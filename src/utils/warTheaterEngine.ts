/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenarioYear, Country, Region } from '../types';
import { 
  calculateCombatPower, 
  resolveDeterministicFrontlineBattle,
  setRegionController,
  getTerritoryControlMap,
  CombatBelligerentForces,
  FrontlineBattleResult
} from './territorialControl';

export type DivisionType = 'INFANTRY' | 'ARMORED' | 'ARTILLERY' | 'SPECOPS' | 'MARINE' | 'AIRBORNE';

export interface NATODivision {
  id: string;
  name: string;
  side: 'FRIENDLY' | 'ENEMY' | 'FACTION_A' | 'FACTION_B' | 'FACTION_C';
  sideCountryId: string;
  sideName: string;
  type: DivisionType;
  echelon: 'DIVISION' | 'BRIGADE' | 'CORPS';
  regionId: string;
  destinationRegionId?: string;
  movementTurnsRemaining?: number;
  manpower: number;
  maxManpower: number;
  tanks: number;
  aircraft: number;
  artillery: number;
  entrenchment: number; // 0-100%
  morale: number; // 0-100%
  supplyScore: number; // 0-100%
  isEmbarked?: boolean;
  status: 'READY' | 'FORTIFIED' | 'ENGAGED' | 'MOVING' | 'EMBARKED' | 'REORGANIZING';
}

export interface TheaterRegion {
  id: string;
  name: string;
  countryId: string;
  controllerId: string;
  originalOwnerId: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // [lat, lng] ring
  terrain: 'PLAINS' | 'MOUNTAINS' | 'URBAN' | 'MARSH' | 'COAST';
  isPort: boolean;
  adjacentRegionIds: string[];
  strategicValue: number; // 1-5
  fortificationLevel: number; // 0-5
  infrastructureLevel: number; // 1-5
  population: number;
  seats?: number;
}

export interface PersistentCasualtyStats {
  ownLosses: {
    soldiers: number;
    soldiersThisTurn: number;
    tanks: number;
    tanksThisTurn: number;
    aircraft: number;
    aircraftThisTurn: number;
    artillery: number;
    artilleryThisTurn: number;
  };
  enemyLosses: {
    soldiers: number;
    soldiersThisTurn: number;
    tanks: number;
    tanksThisTurn: number;
    aircraft: number;
    aircraftThisTurn: number;
    artillery: number;
    artilleryThisTurn: number;
  };
  territory: {
    capturedThisTurn: number;
    lostThisTurn: number;
    totalCaptured: number;
    totalLost: number;
  };
  airSuperiority: number; // 0-100
  navalControl: number; // 0-100
  transportShips: {
    total: number;
    inUse: number;
  };
}

// Generate simple bounding polygon ring around center with radius and shape noise
export function generateRegionPolygon(
  center: [number, number],
  latRadius: number,
  lngRadius: number,
  points: number = 8,
  seedStr: string = ''
): [number, number][] {
  const [lat, lng] = center;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed += seedStr.charCodeAt(i);
  }

  const ring: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const noise = 0.85 + (((seed + i * 17) % 30) / 100);
    const pLat = lat + Math.sin(angle) * latRadius * noise;
    const pLng = lng + Math.cos(angle) * lngRadius * noise;
    ring.push([Number(pLat.toFixed(4)), Number(pLng.toFixed(4))]);
  }
  ring.push(ring[0]); // close polygon
  return ring;
}

// Pre-seeded Civil War Theater Regions
export const PREDEFINED_CIVIL_WAR_THEATERS: Record<string, {
  conflictName: string;
  center: [number, number];
  zoom: number;
  factions: { id: string; name: string; color: string; isGovernment: boolean }[];
  regions: Omit<TheaterRegion, 'controllerId'>[];
}> = {
  LY: {
    conflictName: 'Second Libyan Civil War (GNU vs LNA)',
    center: [28.0, 17.5],
    zoom: 6,
    factions: [
      { id: 'GNU', name: 'Government of National Unity (Tripoli)', color: '#2563eb', isGovernment: true },
      { id: 'LNA', name: 'Libyan National Army (Haftar / Tobruk)', color: '#dc2626', isGovernment: false }
    ],
    regions: [
      {
        id: 'LY_tripoli',
        name: 'Tripoli Capital & Western Coast',
        countryId: 'LY',
        originalOwnerId: 'GNU',
        center: [32.88, 13.19],
        polygon: generateRegionPolygon([32.88, 13.19], 0.9, 1.2, 8, 'LY_tripoli'),
        terrain: 'URBAN',
        isPort: true,
        adjacentRegionIds: ['LY_misrata', 'LY_zawiya', 'LY_gharyan'],
        strategicValue: 5,
        fortificationLevel: 3,
        infrastructureLevel: 4,
        population: 1300000
      },
      {
        id: 'LY_misrata',
        name: 'Misrata Maritime Corridor',
        countryId: 'LY',
        originalOwnerId: 'GNU',
        center: [32.37, 15.09],
        polygon: generateRegionPolygon([32.37, 15.09], 1.0, 1.3, 8, 'LY_misrata'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['LY_tripoli', 'LY_sirte', 'LY_gharyan'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 550000
      },
      {
        id: 'LY_zawiya',
        name: 'Zawiya & Western Oil Refinery',
        countryId: 'LY',
        originalOwnerId: 'GNU',
        center: [32.75, 12.72],
        polygon: generateRegionPolygon([32.75, 12.72], 0.8, 1.0, 8, 'LY_zawiya'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['LY_tripoli', 'LY_gharyan'],
        strategicValue: 4,
        fortificationLevel: 2,
        infrastructureLevel: 3,
        population: 300000
      },
      {
        id: 'LY_gharyan',
        name: 'Gharyan & Nafusa Highlands',
        countryId: 'LY',
        originalOwnerId: 'GNU',
        center: [32.17, 13.02],
        polygon: generateRegionPolygon([32.17, 13.02], 1.1, 1.4, 8, 'LY_gharyan'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['LY_tripoli', 'LY_zawiya', 'LY_misrata', 'LY_sabha'],
        strategicValue: 3,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 200000
      },
      {
        id: 'LY_sirte',
        name: 'Sirte Basin & Oil Crescent',
        countryId: 'LY',
        originalOwnerId: 'LNA',
        center: [31.20, 16.58],
        polygon: generateRegionPolygon([31.20, 16.58], 1.4, 1.8, 8, 'LY_sirte'),
        terrain: 'PLAINS',
        isPort: true,
        adjacentRegionIds: ['LY_misrata', 'LY_benghazi', 'LY_sabha', 'LY_kufra'],
        strategicValue: 5,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 250000
      },
      {
        id: 'LY_benghazi',
        name: 'Benghazi & Cyrenaica Command',
        countryId: 'LY',
        originalOwnerId: 'LNA',
        center: [32.11, 20.06],
        polygon: generateRegionPolygon([32.11, 20.06], 1.2, 1.5, 8, 'LY_benghazi'),
        terrain: 'URBAN',
        isPort: true,
        adjacentRegionIds: ['LY_sirte', 'LY_tobruk', 'LY_kufra'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 900000
      },
      {
        id: 'LY_tobruk',
        name: 'Tobruk & Eastern Border Gate',
        countryId: 'LY',
        originalOwnerId: 'LNA',
        center: [32.08, 23.97],
        polygon: generateRegionPolygon([32.08, 23.97], 1.3, 1.6, 8, 'LY_tobruk'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['LY_benghazi', 'LY_kufra'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 350000
      },
      {
        id: 'LY_sabha',
        name: 'Sabha & Fezzan Desert Gateway',
        countryId: 'LY',
        originalOwnerId: 'LNA',
        center: [27.03, 14.42],
        polygon: generateRegionPolygon([27.03, 14.42], 1.8, 2.2, 8, 'LY_sabha'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['LY_gharyan', 'LY_sirte', 'LY_kufra'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 180000
      },
      {
        id: 'LY_kufra',
        name: 'Kufra & Southern Strategic Oases',
        countryId: 'LY',
        originalOwnerId: 'LNA',
        center: [24.29, 23.29],
        polygon: generateRegionPolygon([24.29, 23.29], 2.0, 2.5, 8, 'LY_kufra'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['LY_sirte', 'LY_benghazi', 'LY_tobruk', 'LY_sabha'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 1,
        population: 90000
      }
    ]
  },
  SY: {
    conflictName: 'Syrian Armed Conflict',
    center: [35.0, 38.5],
    zoom: 7,
    factions: [
      { id: 'SY_GOV', name: 'Syrian Arab Army (Government)', color: '#2563eb', isGovernment: true },
      { id: 'SDF', name: 'Syrian Democratic Forces (NES)', color: '#d97706', isGovernment: false },
      { id: 'SNA', name: 'Syrian National Opposition & Militias', color: '#dc2626', isGovernment: false }
    ],
    regions: [
      {
        id: 'SY_damascus',
        name: 'Damascus Capital & Central Command',
        countryId: 'SY',
        originalOwnerId: 'SY_GOV',
        center: [33.51, 36.27],
        polygon: generateRegionPolygon([33.51, 36.27], 0.6, 0.7, 8, 'SY_damascus'),
        terrain: 'URBAN',
        isPort: false,
        adjacentRegionIds: ['SY_homs', 'SY_daraa', 'SY_latakia'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 2500000
      },
      {
        id: 'SY_latakia',
        name: 'Latakia & Tartus Naval Coast',
        countryId: 'SY',
        originalOwnerId: 'SY_GOV',
        center: [35.53, 35.79],
        polygon: generateRegionPolygon([35.53, 35.79], 0.7, 0.6, 8, 'SY_latakia'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['SY_damascus', 'SY_homs', 'SY_idlib'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 1200000
      },
      {
        id: 'SY_homs',
        name: 'Homs & Central Highway Corridor',
        countryId: 'SY',
        originalOwnerId: 'SY_GOV',
        center: [34.73, 36.71],
        polygon: generateRegionPolygon([34.73, 36.71], 0.9, 1.1, 8, 'SY_homs'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SY_damascus', 'SY_latakia', 'SY_aleppo', 'SY_deir'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 1000000
      },
      {
        id: 'SY_aleppo',
        name: 'Aleppo Metropolis & Citadel',
        countryId: 'SY',
        originalOwnerId: 'SY_GOV',
        center: [36.20, 37.13],
        polygon: generateRegionPolygon([36.20, 37.13], 0.7, 0.8, 8, 'SY_aleppo'),
        terrain: 'URBAN',
        isPort: false,
        adjacentRegionIds: ['SY_homs', 'SY_idlib', 'SY_afrin', 'SY_raqqa'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 3,
        population: 2000000
      },
      {
        id: 'SY_idlib',
        name: 'Idlib & Northwestern Pocket',
        countryId: 'SY',
        originalOwnerId: 'SNA',
        center: [35.93, 36.63],
        polygon: generateRegionPolygon([35.93, 36.63], 0.6, 0.6, 8, 'SY_idlib'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['SY_aleppo', 'SY_latakia', 'SY_afrin'],
        strategicValue: 4,
        fortificationLevel: 5,
        infrastructureLevel: 2,
        population: 1500000
      },
      {
        id: 'SY_afrin',
        name: 'Afrin & Northern Border Shield',
        countryId: 'SY',
        originalOwnerId: 'SNA',
        center: [36.51, 36.86],
        polygon: generateRegionPolygon([36.51, 36.86], 0.5, 0.6, 8, 'SY_afrin'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['SY_idlib', 'SY_aleppo', 'SY_raqqa'],
        strategicValue: 3,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 400000
      },
      {
        id: 'SY_hasakah',
        name: 'Hasakah & Qamishli (Jazira)',
        countryId: 'SY',
        originalOwnerId: 'SDF',
        center: [36.50, 40.75],
        polygon: generateRegionPolygon([36.50, 40.75], 0.8, 1.2, 8, 'SY_hasakah'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SY_raqqa', 'SY_deir'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 1100000
      },
      {
        id: 'SY_raqqa',
        name: 'Raqqa & Euphrates Basin',
        countryId: 'SY',
        originalOwnerId: 'SDF',
        center: [35.95, 39.01],
        polygon: generateRegionPolygon([35.95, 39.01], 0.8, 1.0, 8, 'SY_raqqa'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SY_aleppo', 'SY_hasakah', 'SY_deir'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 600000
      },
      {
        id: 'SY_deir',
        name: 'Deir ez-Zor & Conoco Fields',
        countryId: 'SY',
        originalOwnerId: 'SDF',
        center: [35.33, 40.14],
        polygon: generateRegionPolygon([35.33, 40.14], 1.0, 1.3, 8, 'SY_deir'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SY_homs', 'SY_raqqa', 'SY_hasakah'],
        strategicValue: 4,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 500000
      },
      {
        id: 'SY_daraa',
        name: 'Daraa & Southern Front',
        countryId: 'SY',
        originalOwnerId: 'SY_GOV',
        center: [32.62, 36.10],
        polygon: generateRegionPolygon([32.62, 36.10], 0.5, 0.7, 8, 'SY_daraa'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SY_damascus'],
        strategicValue: 3,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 700000
      }
    ]
  },
  SD: {
    conflictName: 'Sudanese Civil War (SAF vs RSF)',
    center: [15.5, 32.5],
    zoom: 6,
    factions: [
      { id: 'SAF', name: 'Sudanese Armed Forces (Gov / Burhan)', color: '#2563eb', isGovernment: true },
      { id: 'RSF', name: 'Rapid Support Forces (Hemedti)', color: '#dc2626', isGovernment: false }
    ],
    regions: [
      {
        id: 'SD_khartoum',
        name: 'Khartoum Capital Tri-City',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [15.55, 32.53],
        polygon: generateRegionPolygon([15.55, 32.53], 0.7, 0.8, 8, 'SD_khartoum'),
        terrain: 'URBAN',
        isPort: false,
        adjacentRegionIds: ['SD_rivernile', 'SD_portsudan', 'SD_gezira', 'SD_kordofan'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 5000000
      },
      {
        id: 'SD_portsudan',
        name: 'Port Sudan & Red Sea Coast',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [19.61, 37.21],
        polygon: generateRegionPolygon([19.61, 37.21], 1.5, 1.8, 8, 'SD_portsudan'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['SD_khartoum', 'SD_kassala', 'SD_rivernile'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 800000
      },
      {
        id: 'SD_rivernile',
        name: 'River Nile & Northern State',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [17.59, 33.96],
        polygon: generateRegionPolygon([17.59, 33.96], 1.6, 1.8, 8, 'SD_rivernile'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_khartoum', 'SD_portsudan', 'SD_darfurnorth'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 1200000
      },
      {
        id: 'SD_kassala',
        name: 'Kassala & Gedarif Grain Belt',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [15.45, 36.40],
        polygon: generateRegionPolygon([15.45, 36.40], 1.3, 1.5, 8, 'SD_kassala'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_portsudan', 'SD_gezira', 'SD_bluenile'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 2000000
      },
      {
        id: 'SD_gezira',
        name: 'Gezira & Wad Madani',
        countryId: 'SD',
        originalOwnerId: 'RSF',
        center: [14.40, 33.52],
        polygon: generateRegionPolygon([14.40, 33.52], 0.9, 1.1, 8, 'SD_gezira'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_khartoum', 'SD_kassala', 'SD_kordofan', 'SD_bluenile'],
        strategicValue: 4,
        fortificationLevel: 2,
        infrastructureLevel: 3,
        population: 2500000
      },
      {
        id: 'SD_kordofan',
        name: 'Kordofan (El Obeid & Nuba)',
        countryId: 'SD',
        originalOwnerId: 'RSF',
        center: [13.18, 30.22],
        polygon: generateRegionPolygon([13.18, 30.22], 1.4, 1.8, 8, 'SD_kordofan'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_khartoum', 'SD_gezira', 'SD_darfursouth', 'SD_darfurnorth'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 3000000
      },
      {
        id: 'SD_darfurnorth',
        name: 'North Darfur (El Fasher Siege)',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [13.63, 25.35],
        polygon: generateRegionPolygon([13.63, 25.35], 1.8, 2.2, 8, 'SD_darfurnorth'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['SD_rivernile', 'SD_kordofan', 'SD_darfursouth'],
        strategicValue: 4,
        fortificationLevel: 4,
        infrastructureLevel: 1,
        population: 1800000
      },
      {
        id: 'SD_darfursouth',
        name: 'South & West Darfur (Nyala/Geneina)',
        countryId: 'SD',
        originalOwnerId: 'RSF',
        center: [12.05, 24.88],
        polygon: generateRegionPolygon([12.05, 24.88], 1.7, 2.0, 8, 'SD_darfursouth'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_darfurnorth', 'SD_kordofan'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 3500000
      },
      {
        id: 'SD_bluenile',
        name: 'Blue Nile & Sennar Dam',
        countryId: 'SD',
        originalOwnerId: 'SAF',
        center: [11.77, 34.35],
        polygon: generateRegionPolygon([11.77, 34.35], 1.2, 1.4, 8, 'SD_bluenile'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['SD_gezira', 'SD_kassala'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 1100000
      }
    ]
  },
  MM: {
    conflictName: 'Myanmar Civil War (Spring Revolution)',
    center: [21.0, 96.0],
    zoom: 6,
    factions: [
      { id: 'JUNTA', name: 'State Administration Council (SAC / Tatmadaw)', color: '#2563eb', isGovernment: true },
      { id: 'NUG_PDF', name: 'National Unity Government & Ethnic Alliances', color: '#dc2626', isGovernment: false }
    ],
    regions: [
      {
        id: 'MM_naypyidaw',
        name: 'Naypyidaw Federal Capital Bunker',
        countryId: 'MM',
        originalOwnerId: 'JUNTA',
        center: [19.76, 96.07],
        polygon: generateRegionPolygon([19.76, 96.07], 0.7, 0.8, 8, 'MM_naypyidaw'),
        terrain: 'URBAN',
        isPort: false,
        adjacentRegionIds: ['MM_mandalay', 'MM_yangon', 'MM_bago', 'MM_shan'],
        strategicValue: 5,
        fortificationLevel: 5,
        infrastructureLevel: 4,
        population: 1200000
      },
      {
        id: 'MM_yangon',
        name: 'Yangon Commercial Port & Delta',
        countryId: 'MM',
        originalOwnerId: 'JUNTA',
        center: [16.86, 96.19],
        polygon: generateRegionPolygon([16.86, 96.19], 0.9, 1.1, 8, 'MM_yangon'),
        terrain: 'URBAN',
        isPort: true,
        adjacentRegionIds: ['MM_naypyidaw', 'MM_bago', 'MM_tanintharyi'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 6000000
      },
      {
        id: 'MM_mandalay',
        name: 'Mandalay Core & Central Plains',
        countryId: 'MM',
        originalOwnerId: 'JUNTA',
        center: [21.95, 96.08],
        polygon: generateRegionPolygon([21.95, 96.08], 0.9, 1.0, 8, 'MM_mandalay'),
        terrain: 'URBAN',
        isPort: false,
        adjacentRegionIds: ['MM_naypyidaw', 'MM_sagaing', 'MM_shan', 'MM_kachin'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 2500000
      },
      {
        id: 'MM_shan',
        name: 'Shan State North & Lashio',
        countryId: 'MM',
        originalOwnerId: 'NUG_PDF',
        center: [22.93, 97.75],
        polygon: generateRegionPolygon([22.93, 97.75], 1.5, 1.8, 8, 'MM_shan'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['MM_mandalay', 'MM_naypyidaw', 'MM_kachin', 'MM_kayah'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 3500000
      },
      {
        id: 'MM_rakhine',
        name: 'Rakhine Coast & Sittwe Port (AA)',
        countryId: 'MM',
        originalOwnerId: 'NUG_PDF',
        center: [20.15, 92.90],
        polygon: generateRegionPolygon([20.15, 92.90], 1.4, 1.1, 8, 'MM_rakhine'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['MM_sagaing', 'MM_bago'],
        strategicValue: 4,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 2200000
      },
      {
        id: 'MM_kachin',
        name: 'Kachin Highlands & Myitkyina (KIA)',
        countryId: 'MM',
        originalOwnerId: 'NUG_PDF',
        center: [25.38, 97.40],
        polygon: generateRegionPolygon([25.38, 97.40], 1.6, 1.5, 8, 'MM_kachin'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['MM_mandalay', 'MM_sagaing', 'MM_shan'],
        strategicValue: 4,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 1700000
      },
      {
        id: 'MM_sagaing',
        name: 'Sagaing Resistance Heartland',
        countryId: 'MM',
        originalOwnerId: 'NUG_PDF',
        center: [22.50, 95.50],
        polygon: generateRegionPolygon([22.50, 95.50], 1.5, 1.3, 8, 'MM_sagaing'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['MM_mandalay', 'MM_kachin', 'MM_rakhine'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 3000000
      },
      {
        id: 'MM_kayah',
        name: 'Kayah & Karen Borderlands (KNU/PDF)',
        countryId: 'MM',
        originalOwnerId: 'NUG_PDF',
        center: [19.23, 97.25],
        polygon: generateRegionPolygon([19.23, 97.25], 1.2, 1.2, 8, 'MM_kayah'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['MM_shan', 'MM_naypyidaw', 'MM_bago', 'MM_tanintharyi'],
        strategicValue: 4,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 1800000
      },
      {
        id: 'MM_bago',
        name: 'Bago & Irrawaddy Delta',
        countryId: 'MM',
        originalOwnerId: 'JUNTA',
        center: [17.33, 96.48],
        polygon: generateRegionPolygon([17.33, 96.48], 1.0, 1.1, 8, 'MM_bago'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['MM_naypyidaw', 'MM_yangon', 'MM_kayah', 'MM_rakhine'],
        strategicValue: 3,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 4000000
      },
      {
        id: 'MM_tanintharyi',
        name: 'Tanintharyi Southern Coast',
        countryId: 'MM',
        originalOwnerId: 'JUNTA',
        center: [12.08, 98.60],
        polygon: generateRegionPolygon([12.08, 98.60], 2.0, 1.1, 8, 'MM_tanintharyi'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['MM_yangon', 'MM_kayah'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 1400000
      }
    ]
  },
  YE: {
    conflictName: 'Yemeni Civil War & Red Sea Conflict',
    center: [15.5, 47.5],
    zoom: 6,
    factions: [
      { id: 'HOUTHIS', name: 'Ansar Allah (Houthi Supreme Council)', color: '#dc2626', isGovernment: false },
      { id: 'PLC_STC', name: 'Presidential Leadership Council & STC', color: '#2563eb', isGovernment: true }
    ],
    regions: [
      {
        id: 'YE_sanaa',
        name: 'Sanaa Capital & Mountain Highlands',
        countryId: 'YE',
        originalOwnerId: 'HOUTHIS',
        center: [15.36, 44.19],
        polygon: generateRegionPolygon([15.36, 44.19], 0.8, 0.9, 8, 'YE_sanaa'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['YE_saada', 'YE_hodeidah', 'YE_dhamar', 'YE_marib'],
        strategicValue: 5,
        fortificationLevel: 5,
        infrastructureLevel: 3,
        population: 3000000
      },
      {
        id: 'YE_hodeidah',
        name: 'Hodeidah Port & Red Sea Coastline',
        countryId: 'YE',
        originalOwnerId: 'HOUTHIS',
        center: [14.79, 42.95],
        polygon: generateRegionPolygon([14.79, 42.95], 0.9, 0.9, 8, 'YE_hodeidah'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['YE_sanaa', 'YE_saada', 'YE_dhamar', 'YE_aden'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 3,
        population: 1800000
      },
      {
        id: 'YE_saada',
        name: 'Saada Northern Fortress',
        countryId: 'YE',
        originalOwnerId: 'HOUTHIS',
        center: [16.94, 43.76],
        polygon: generateRegionPolygon([16.94, 43.76], 1.0, 1.2, 8, 'YE_saada'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['YE_sanaa', 'YE_hodeidah', 'YE_marib'],
        strategicValue: 4,
        fortificationLevel: 5,
        infrastructureLevel: 2,
        population: 900000
      },
      {
        id: 'YE_dhamar',
        name: 'Dhamar, Ibb & Taiz North',
        countryId: 'YE',
        originalOwnerId: 'HOUTHIS',
        center: [14.54, 44.40],
        polygon: generateRegionPolygon([14.54, 44.40], 0.8, 0.9, 8, 'YE_dhamar'),
        terrain: 'MOUNTAINS',
        isPort: false,
        adjacentRegionIds: ['YE_sanaa', 'YE_hodeidah', 'YE_aden', 'YE_marib'],
        strategicValue: 4,
        fortificationLevel: 4,
        infrastructureLevel: 2,
        population: 2500000
      },
      {
        id: 'YE_aden',
        name: 'Aden Interim Capital & Port',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [12.82, 45.03],
        polygon: generateRegionPolygon([12.82, 45.03], 0.8, 1.1, 8, 'YE_aden'),
        terrain: 'URBAN',
        isPort: true,
        adjacentRegionIds: ['YE_dhamar', 'YE_hodeidah', 'YE_shabwah'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 4,
        population: 1000000
      },
      {
        id: 'YE_marib',
        name: 'Marib Oil Reserves & Frontline',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [15.47, 45.32],
        polygon: generateRegionPolygon([15.47, 45.32], 1.0, 1.2, 8, 'YE_marib'),
        terrain: 'PLAINS',
        isPort: false,
        adjacentRegionIds: ['YE_sanaa', 'YE_saada', 'YE_dhamar', 'YE_shabwah', 'YE_hadramawt'],
        strategicValue: 5,
        fortificationLevel: 4,
        infrastructureLevel: 3,
        population: 800000
      },
      {
        id: 'YE_shabwah',
        name: 'Shabwah & Ataq Oil Corridor',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [14.53, 46.83],
        polygon: generateRegionPolygon([14.53, 46.83], 1.2, 1.5, 8, 'YE_shabwah'),
        terrain: 'PLAINS',
        isPort: true,
        adjacentRegionIds: ['YE_aden', 'YE_marib', 'YE_hadramawt'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 2,
        population: 600000
      },
      {
        id: 'YE_hadramawt',
        name: 'Hadramawt & Mukalla Seaport',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [14.53, 49.12],
        polygon: generateRegionPolygon([14.53, 49.12], 1.8, 2.4, 8, 'YE_hadramawt'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['YE_marib', 'YE_shabwah', 'YE_mahrah'],
        strategicValue: 4,
        fortificationLevel: 3,
        infrastructureLevel: 3,
        population: 1400000
      },
      {
        id: 'YE_mahrah',
        name: 'Al-Mahrah Eastern Border Region',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [16.50, 51.50],
        polygon: generateRegionPolygon([16.50, 51.50], 1.5, 2.0, 8, 'YE_mahrah'),
        terrain: 'PLAINS',
        isPort: true,
        adjacentRegionIds: ['YE_hadramawt'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 200000
      },
      {
        id: 'YE_socotra',
        name: 'Socotra Strategic Island Base',
        countryId: 'YE',
        originalOwnerId: 'PLC_STC',
        center: [12.46, 53.82],
        polygon: generateRegionPolygon([12.46, 53.82], 0.6, 1.0, 8, 'YE_socotra'),
        terrain: 'COAST',
        isPort: true,
        adjacentRegionIds: ['YE_aden'],
        strategicValue: 3,
        fortificationLevel: 2,
        infrastructureLevel: 2,
        population: 60000
      }
    ]
  }
};

// Neighbor country ISO codes for surrounding map context
export const THEATER_NEIGHBORS: Record<string, string[]> = {
  LY: ['DZ', 'TN', 'EG', 'SD', 'TD', 'NE', 'IT', 'MT', 'GR'],
  SY: ['TR', 'IQ', 'JO', 'IL', 'LB', 'CY', 'EG'],
  SD: ['EG', 'LY', 'TD', 'CF', 'SS', 'ET', 'ER', 'SA'],
  MM: ['CN', 'IN', 'BD', 'TH', 'LA'],
  YE: ['SA', 'OM', 'SO', 'DJ', 'ER'],
  UA: ['RU', 'BY', 'PL', 'SK', 'HU', 'RO', 'MD'],
  RU: ['UA', 'BY', 'PL', 'FI', 'EE', 'LV', 'LT', 'GE', 'AZ', 'KZ', 'CN', 'MN'],
  TR: ['GR', 'BG', 'SY', 'IQ', 'IR', 'AZ', 'AM', 'GE', 'CY'],
  GR: ['TR', 'AL', 'MK', 'BG', 'IT', 'CY'],
  IL: ['PS', 'SY', 'JO', 'LB', 'EG', 'SA'],
  PS: ['IL', 'JO', 'EG'],
  IR: ['IQ', 'TR', 'AZ', 'AM', 'TM', 'AF', 'PK', 'SA', 'AE', 'KW'],
  US: ['CA', 'MX', 'CU', 'BS', 'RU'],
  CN: ['TW', 'RU', 'MN', 'KP', 'KR', 'JP', 'VN', 'LA', 'MM', 'IN', 'PK', 'AF', 'TJ', 'KG', 'KZ', 'PH']
};

/**
 * Initializes or resolves regions for a given war theater
 */
export function getTheaterRegions(
  countryId: string, 
  enemyCountryId?: string, 
  customCountry?: Country
): {
  conflictName: string;
  center: [number, number];
  zoom: number;
  factions: { id: string; name: string; color: string; isGovernment: boolean }[];
  regions: TheaterRegion[];
  neighborIsoCodes: string[];
} {
  const currentControlMap = getTerritoryControlMap();

  // 1. Civil War predefined theaters
  if (PREDEFINED_CIVIL_WARS[countryId] || PREDEFINED_CIVIL_WAR_THEATERS[countryId]) {
    const predefined = PREDEFINED_CIVIL_WAR_THEATERS[countryId];
    if (predefined) {
      const resolvedRegions: TheaterRegion[] = predefined.regions.map(r => ({
        ...r,
        controllerId: currentControlMap[r.id] || r.originalOwnerId
      }));

      return {
        conflictName: predefined.conflictName,
        center: predefined.center,
        zoom: predefined.zoom,
        factions: predefined.factions,
        regions: resolvedRegions,
        neighborIsoCodes: THEATER_NEIGHBORS[countryId] || []
      };
    }
  }

  // 2. Interstate Theaters (e.g. Ukraine vs Russia, Turkey vs Greece, etc.)
  if (enemyCountryId) {
    const isUaRu = (countryId === 'UA' && enemyCountryId === 'RU') || (countryId === 'RU' && enemyCountryId === 'UA');
    if (isUaRu) {
      return getUkraineRussiaTheater(currentControlMap, countryId);
    }

    const isTrGr = (countryId === 'TR' && enemyCountryId === 'GR') || (countryId === 'GR' && enemyCountryId === 'TR');
    if (isTrGr) {
      return getTurkeyGreeceTheater(currentControlMap, countryId);
    }
  }

  // 3. Fallback dynamically generated regions from country object
  if (customCountry && customCountry.regions && customCountry.regions.length > 0) {
    const resolvedRegions: TheaterRegion[] = customCountry.regions.map((r, idx) => {
      const center: [number, number] = [30 + (idx % 4) * 2, 20 + Math.floor(idx / 4) * 3];
      const adj = customCountry.regions
        .filter((_, oIdx) => Math.abs(oIdx - idx) === 1 || Math.abs(oIdx - idx) === 4)
        .map(other => other.id);

      return {
        id: r.id,
        name: r.name,
        countryId: customCountry.id,
        controllerId: currentControlMap[r.id] || r.controlledBy || customCountry.id,
        originalOwnerId: r.originalOwnerId || customCountry.id,
        center,
        polygon: generateRegionPolygon(center, 0.9, 1.2, 8, r.id),
        terrain: (r.id.includes('coast') || r.id.includes('sea') || idx % 3 === 0) ? 'COAST' : (idx % 2 === 0 ? 'URBAN' : 'PLAINS'),
        isPort: idx % 3 === 0,
        adjacentRegionIds: adj,
        strategicValue: Math.max(2, Math.min(5, r.infrastructure || 3)),
        fortificationLevel: 2,
        infrastructureLevel: r.infrastructure || 3,
        population: 500000,
        seats: r.seats || 5
      };
    });

    return {
      conflictName: `${customCountry.name} Theater of Operations`,
      center: (resolvedRegions[0]?.center || [25, 25]) as [number, number],
      zoom: 6,
      factions: [
        { id: customCountry.id, name: `${customCountry.name} Armed Forces`, color: '#2563eb', isGovernment: true },
        { id: enemyCountryId || 'ENEMY', name: `Hostile Forces`, color: '#dc2626', isGovernment: false }
      ],
      regions: resolvedRegions,
      neighborIsoCodes: THEATER_NEIGHBORS[customCountry.id] || []
    };
  }

  // 4. Default generic fallback
  return {
    conflictName: `National Theater of Operations`,
    center: [30, 25] as [number, number],
    zoom: 6,
    factions: [
      { id: countryId, name: `Homeland Defense`, color: '#2563eb', isGovernment: true },
      { id: enemyCountryId || 'ENEMY', name: `Adversary Forces`, color: '#dc2626', isGovernment: false }
    ],
    regions: [],
    neighborIsoCodes: []
  };
}

const PREDEFINED_CIVIL_WARS: Record<string, boolean> = {
  LY: true,
  SY: true,
  SD: true,
  MM: true,
  YE: true
};

function getUkraineRussiaTheater(controlMap: Record<string, string>, playerCountryId: string) {
  const regions: TheaterRegion[] = [
    {
      id: 'UA_kyiv',
      name: 'Kyiv Capital & Dnieper Bastion',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_kyiv'] || 'UA',
      center: [50.45, 30.52],
      polygon: generateRegionPolygon([50.45, 30.52], 0.9, 1.2, 8, 'UA_kyiv'),
      terrain: 'URBAN',
      isPort: false,
      adjacentRegionIds: ['UA_kharkiv', 'UA_dnipro', 'UA_lviv', 'RU_belgorod'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 3000000
    },
    {
      id: 'UA_kharkiv',
      name: 'Kharkiv & Northern Frontline',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_kharkiv'] || 'UA',
      center: [49.99, 36.23],
      polygon: generateRegionPolygon([49.99, 36.23], 0.9, 1.3, 8, 'UA_kharkiv'),
      terrain: 'URBAN',
      isPort: false,
      adjacentRegionIds: ['UA_kyiv', 'UA_donbas', 'UA_dnipro', 'RU_belgorod', 'RU_kursk'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 1500000
    },
    {
      id: 'UA_donbas',
      name: 'Donbas Fortified Bulwark (Donetsk/Luhansk)',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_donbas'] || 'RU',
      center: [48.01, 37.80],
      polygon: generateRegionPolygon([48.01, 37.80], 1.1, 1.4, 8, 'UA_donbas'),
      terrain: 'URBAN',
      isPort: false,
      adjacentRegionIds: ['UA_kharkiv', 'UA_dnipro', 'UA_zaporizhzhia', 'RU_rostov'],
      strategicValue: 5,
      fortificationLevel: 5,
      infrastructureLevel: 3,
      population: 3500000
    },
    {
      id: 'UA_zaporizhzhia',
      name: 'Zaporizhzhia & Southern Land Bridge',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_zaporizhzhia'] || 'RU',
      center: [47.83, 35.13],
      polygon: generateRegionPolygon([47.83, 35.13], 1.0, 1.3, 8, 'UA_zaporizhzhia'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['UA_donbas', 'UA_dnipro', 'UA_kherson', 'UA_crimea'],
      strategicValue: 4,
      fortificationLevel: 4,
      infrastructureLevel: 3,
      population: 1200000
    },
    {
      id: 'UA_kherson',
      name: 'Kherson & Lower Dnieper Delta',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_kherson'] || 'UA',
      center: [46.63, 32.61],
      polygon: generateRegionPolygon([46.63, 32.61], 1.0, 1.2, 8, 'UA_kherson'),
      terrain: 'MARSH',
      isPort: true,
      adjacentRegionIds: ['UA_zaporizhzhia', 'UA_odesa', 'UA_crimea'],
      strategicValue: 4,
      fortificationLevel: 3,
      infrastructureLevel: 3,
      population: 900000
    },
    {
      id: 'UA_odesa',
      name: 'Odesa Port & Black Sea Maritime Basin',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_odesa'] || 'UA',
      center: [46.48, 30.72],
      polygon: generateRegionPolygon([46.48, 30.72], 1.1, 1.3, 8, 'UA_odesa'),
      terrain: 'COAST',
      isPort: true,
      adjacentRegionIds: ['UA_kherson', 'UA_dnipro', 'UA_lviv'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 1400000
    },
    {
      id: 'UA_dnipro',
      name: 'Dnipro Logistics & Industrial Basin',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_dnipro'] || 'UA',
      center: [48.46, 35.04],
      polygon: generateRegionPolygon([48.46, 35.04], 1.0, 1.3, 8, 'UA_dnipro'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['UA_kyiv', 'UA_kharkiv', 'UA_donbas', 'UA_zaporizhzhia', 'UA_odesa'],
      strategicValue: 4,
      fortificationLevel: 3,
      infrastructureLevel: 4,
      population: 1800000
    },
    {
      id: 'UA_lviv',
      name: 'Lviv & Western Rear Guard',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_lviv'] || 'UA',
      center: [49.83, 24.02],
      polygon: generateRegionPolygon([49.83, 24.02], 1.2, 1.4, 8, 'UA_lviv'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['UA_kyiv', 'UA_odesa'],
      strategicValue: 4,
      fortificationLevel: 3,
      infrastructureLevel: 4,
      population: 2000000
    },
    {
      id: 'UA_crimea',
      name: 'Crimea & Sevastopol Fleet Base',
      countryId: 'UA',
      originalOwnerId: 'UA',
      controllerId: controlMap['UA_crimea'] || 'RU',
      center: [44.95, 34.10],
      polygon: generateRegionPolygon([44.95, 34.10], 0.9, 1.4, 8, 'UA_crimea'),
      terrain: 'COAST',
      isPort: true,
      adjacentRegionIds: ['UA_kherson', 'UA_zaporizhzhia', 'RU_rostov'],
      strategicValue: 5,
      fortificationLevel: 5,
      infrastructureLevel: 4,
      population: 2200000
    },
    {
      id: 'RU_belgorod',
      name: 'Belgorod Frontier & Staging Hub',
      countryId: 'RU',
      originalOwnerId: 'RU',
      controllerId: controlMap['RU_belgorod'] || 'RU',
      center: [50.59, 36.58],
      polygon: generateRegionPolygon([50.59, 36.58], 1.0, 1.3, 8, 'RU_belgorod'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['UA_kharkiv', 'UA_kyiv', 'RU_kursk', 'RU_rostov'],
      strategicValue: 4,
      fortificationLevel: 3,
      infrastructureLevel: 4,
      population: 1400000
    },
    {
      id: 'RU_kursk',
      name: 'Kursk Border Sector',
      countryId: 'RU',
      originalOwnerId: 'RU',
      controllerId: controlMap['RU_kursk'] || 'RU',
      center: [51.73, 36.19],
      polygon: generateRegionPolygon([51.73, 36.19], 1.1, 1.4, 8, 'RU_kursk'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['UA_kharkiv', 'RU_belgorod'],
      strategicValue: 4,
      fortificationLevel: 3,
      infrastructureLevel: 3,
      population: 1100000
    },
    {
      id: 'RU_rostov',
      name: 'Rostov-on-Don Southern Command',
      countryId: 'RU',
      originalOwnerId: 'RU',
      controllerId: controlMap['RU_rostov'] || 'RU',
      center: [47.23, 39.72],
      polygon: generateRegionPolygon([47.23, 39.72], 1.2, 1.5, 8, 'RU_rostov'),
      terrain: 'URBAN',
      isPort: true,
      adjacentRegionIds: ['UA_donbas', 'UA_crimea', 'RU_belgorod'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 2800000
    }
  ];

  return {
    conflictName: 'Russo-Ukrainian War Frontline',
    center: [48.5, 34.0] as [number, number],
    zoom: 6,
    factions: [
      { id: 'UA', name: 'Armed Forces of Ukraine (ZSU)', color: '#2563eb', isGovernment: true },
      { id: 'RU', name: 'Armed Forces of the Russian Federation', color: '#dc2626', isGovernment: false }
    ],
    regions,
    neighborIsoCodes: ['PL', 'RO', 'MD', 'BY', 'HU', 'SK']
  };
}

function getTurkeyGreeceTheater(controlMap: Record<string, string>, playerCountryId: string) {
  const regions: TheaterRegion[] = [
    {
      id: 'TR_ist',
      name: 'Istanbul & Straits Maritime Gate',
      countryId: 'TR',
      originalOwnerId: 'TR',
      controllerId: controlMap['TR_ist'] || 'TR',
      center: [41.00, 28.97],
      polygon: generateRegionPolygon([41.00, 28.97], 0.7, 0.9, 8, 'TR_ist'),
      terrain: 'URBAN',
      isPort: true,
      adjacentRegionIds: ['TR_thrace', 'TR_izm', 'TR_ank'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 5,
      population: 16000000
    },
    {
      id: 'TR_thrace',
      name: 'Eastern Thrace (Edirne Frontier)',
      countryId: 'TR',
      originalOwnerId: 'TR',
      controllerId: controlMap['TR_thrace'] || 'TR',
      center: [41.67, 26.56],
      polygon: generateRegionPolygon([41.67, 26.56], 0.8, 0.9, 8, 'TR_thrace'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['TR_ist', 'GR_thrace'],
      strategicValue: 4,
      fortificationLevel: 4,
      infrastructureLevel: 3,
      population: 900000
    },
    {
      id: 'TR_izm',
      name: 'Izmir & Aegean Coastal Basin',
      countryId: 'TR',
      originalOwnerId: 'TR',
      controllerId: controlMap['TR_izm'] || 'TR',
      center: [38.42, 27.14],
      polygon: generateRegionPolygon([38.42, 27.14], 1.0, 1.2, 8, 'TR_izm'),
      terrain: 'COAST',
      isPort: true,
      adjacentRegionIds: ['TR_ist', 'TR_ank', 'GR_aegean'],
      strategicValue: 5,
      fortificationLevel: 3,
      infrastructureLevel: 4,
      population: 4400000
    },
    {
      id: 'TR_ank',
      name: 'Ankara Central High Command',
      countryId: 'TR',
      originalOwnerId: 'TR',
      controllerId: controlMap['TR_ank'] || 'TR',
      center: [39.93, 32.85],
      polygon: generateRegionPolygon([39.93, 32.85], 1.1, 1.3, 8, 'TR_ank'),
      terrain: 'URBAN',
      isPort: false,
      adjacentRegionIds: ['TR_ist', 'TR_izm'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 5800000
    },
    {
      id: 'GR_thrace',
      name: 'Western Thrace & Evros River Border',
      countryId: 'GR',
      originalOwnerId: 'GR',
      controllerId: controlMap['GR_thrace'] || 'GR',
      center: [41.13, 25.40],
      polygon: generateRegionPolygon([41.13, 25.40], 0.8, 0.9, 8, 'GR_thrace'),
      terrain: 'PLAINS',
      isPort: false,
      adjacentRegionIds: ['TR_thrace', 'GR_thessaloniki'],
      strategicValue: 4,
      fortificationLevel: 5,
      infrastructureLevel: 3,
      population: 400000
    },
    {
      id: 'GR_thessaloniki',
      name: 'Central Macedonia & Thessaloniki',
      countryId: 'GR',
      originalOwnerId: 'GR',
      controllerId: controlMap['GR_thessaloniki'] || 'GR',
      center: [40.64, 22.94],
      polygon: generateRegionPolygon([40.64, 22.94], 1.0, 1.2, 8, 'GR_thessaloniki'),
      terrain: 'URBAN',
      isPort: true,
      adjacentRegionIds: ['GR_thrace', 'GR_athens', 'GR_aegean'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 4,
      population: 1800000
    },
    {
      id: 'GR_athens',
      name: 'Attica & Athens Metropolitan Command',
      countryId: 'GR',
      originalOwnerId: 'GR',
      controllerId: controlMap['GR_athens'] || 'GR',
      center: [37.98, 23.72],
      polygon: generateRegionPolygon([37.98, 23.72], 0.8, 1.0, 8, 'GR_athens'),
      terrain: 'URBAN',
      isPort: true,
      adjacentRegionIds: ['GR_thessaloniki', 'GR_aegean', 'GR_crete'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 5,
      population: 3800000
    },
    {
      id: 'GR_aegean',
      name: 'Aegean Island Chain (Lesbos/Chios/Rhodes)',
      countryId: 'GR',
      originalOwnerId: 'GR',
      controllerId: controlMap['GR_aegean'] || 'GR',
      center: [38.00, 25.50],
      polygon: generateRegionPolygon([38.00, 25.50], 1.2, 1.8, 8, 'GR_aegean'),
      terrain: 'COAST',
      isPort: true,
      adjacentRegionIds: ['GR_athens', 'GR_thessaloniki', 'TR_izm', 'GR_crete'],
      strategicValue: 5,
      fortificationLevel: 4,
      infrastructureLevel: 3,
      population: 600000
    },
    {
      id: 'GR_crete',
      name: 'Crete Naval & Air Superiority Base',
      countryId: 'GR',
      originalOwnerId: 'GR',
      controllerId: controlMap['GR_crete'] || 'GR',
      center: [35.24, 24.80],
      polygon: generateRegionPolygon([35.24, 24.80], 0.7, 1.8, 8, 'GR_crete'),
      terrain: 'COAST',
      isPort: true,
      adjacentRegionIds: ['GR_athens', 'GR_aegean'],
      strategicValue: 4,
      fortificationLevel: 4,
      infrastructureLevel: 3,
      population: 650000
    }
  ];

  return {
    conflictName: 'Aegean & Thracian Theater of Operations',
    center: [39.0, 27.0] as [number, number],
    zoom: 6,
    factions: [
      { id: 'TR', name: 'Turkish Armed Forces (TSK)', color: '#2563eb', isGovernment: true },
      { id: 'GR', name: 'Hellenic Armed Forces', color: '#dc2626', isGovernment: false }
    ],
    regions,
    neighborIsoCodes: ['BG', 'AL', 'MK', 'IT', 'CY', 'SY']
  };
}

/**
 * Initializes NATO Divisions for both sides based on active theater regions and baseline forces
 */
export function initializeTheaterDivisions(
  regions: TheaterRegion[],
  friendlySideId: string,
  friendlySideName: string,
  enemySideId: string,
  enemySideName: string,
  totalFriendlyTroops: number,
  totalEnemyTroops: number
): NATODivision[] {
  const divisions: NATODivision[] = [];

  const friendlyRegions = regions.filter(r => r.controllerId === friendlySideId);
  const enemyRegions = regions.filter(r => r.controllerId !== friendlySideId);

  // Distribute Friendly Divisions
  const friendlyCount = Math.max(3, Math.min(8, Math.round(totalFriendlyTroops / 35000)));
  const friendlyTypes: DivisionType[] = ['ARMORED', 'INFANTRY', 'ARTILLERY', 'SPECOPS', 'MARINE', 'INFANTRY'];

  for (let i = 0; i < friendlyCount; i++) {
    const targetReg = friendlyRegions[i % friendlyRegions.length] || regions[0];
    const type = friendlyTypes[i % friendlyTypes.length];
    const manpower = Math.round(totalFriendlyTroops / friendlyCount);

    divisions.push({
      id: `div_fr_${i + 1}`,
      name: `${i + 1}${getOrdinal(i + 1)} ${friendlySideName} ${getDivisionLabel(type)}`,
      side: 'FRIENDLY',
      sideCountryId: friendlySideId,
      sideName: friendlySideName,
      type,
      echelon: 'DIVISION',
      regionId: targetReg.id,
      manpower,
      maxManpower: manpower,
      tanks: type === 'ARMORED' ? 240 : (type === 'INFANTRY' ? 60 : 30),
      aircraft: type === 'SPECOPS' ? 24 : 12,
      artillery: type === 'ARTILLERY' ? 120 : 48,
      entrenchment: targetReg.fortificationLevel * 15,
      morale: 88,
      supplyScore: targetReg.infrastructureLevel * 20,
      status: 'READY'
    });
  }

  // Distribute Enemy Divisions
  const enemyCount = Math.max(3, Math.min(8, Math.round(totalEnemyTroops / 35000)));
  const enemyTypes: DivisionType[] = ['INFANTRY', 'ARMORED', 'INFANTRY', 'ARTILLERY', 'SPECOPS', 'MARINE'];

  for (let i = 0; i < enemyCount; i++) {
    const targetReg = enemyRegions[i % enemyRegions.length] || regions[regions.length - 1];
    const type = enemyTypes[i % enemyTypes.length];
    const manpower = Math.round(totalEnemyTroops / enemyCount);

    divisions.push({
      id: `div_en_${i + 1}`,
      name: `${i + 1}${getOrdinal(i + 1)} ${enemySideName} ${getDivisionLabel(type)}`,
      side: 'ENEMY',
      sideCountryId: enemySideId,
      sideName: enemySideName,
      type,
      echelon: 'DIVISION',
      regionId: targetReg.id,
      manpower,
      maxManpower: manpower,
      tanks: type === 'ARMORED' ? 220 : (type === 'INFANTRY' ? 50 : 25),
      aircraft: type === 'SPECOPS' ? 20 : 10,
      artillery: type === 'ARTILLERY' ? 110 : 40,
      entrenchment: targetReg.fortificationLevel * 15,
      morale: 82,
      supplyScore: targetReg.infrastructureLevel * 20,
      status: 'FORTIFIED'
    });
  }

  return divisions;
}

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getDivisionLabel(type: DivisionType): string {
  switch (type) {
    case 'ARMORED': return 'Armored Division (XX)';
    case 'INFANTRY': return 'Mechanized Infantry Division (XX)';
    case 'ARTILLERY': return 'Heavy Artillery Rocket Brigade (X)';
    case 'SPECOPS': return 'Air Assault / Special Ops Brigade (X)';
    case 'MARINE': return 'Naval Infantry Amphibious Division (XX)';
    case 'AIRBORNE': return 'Airborne Paratroop Division (XX)';
  }
}
