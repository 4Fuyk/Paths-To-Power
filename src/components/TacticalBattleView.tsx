import React, { useState, useEffect, useRef } from 'react';
import { 
  Crosshair, Swords, Users, Trophy, AlertTriangle, Compass, Heart, Award, 
  Map as MapIcon, Target, Activity, Shield, Flame, Plus, Zap, Navigation, 
  Bomb, Factory, Radio, Anchor, Plane, DollarSign, ChevronRight, CheckCircle2,
  Building2, X, RefreshCw, Ship, Waves, Skull, Check, Lock, ArrowRight,
  ShieldAlert, ShieldCheck, CornerDownLeft, Eye, MessageSquare, Megaphone
} from 'lucide-react';
import { normalizeName, getRegionIdFromNormalizedName, getFeatureName } from '../utils/mapUtils';
import { Country, ScenarioYear, Region } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { playSound } from '../lib/sounds';
import { INITIAL_CIVIL_WARS } from '../constants/civilWarData';
import { GlobalWar } from '../constants/globalWarData';
import { 
  resolveDeterministicFrontlineBattle, 
  calculateCombatPower, 
  setRegionController, 
  getTerritoryControlMap, 
  applyPeaceDealAnnexation 
} from '../utils/territorialControl';
import { WarFrontlineMap } from './WarFrontlineMap';

export interface PlayerArmy {
  id: string;
  name: string;
  type: 'infantry' | 'armored' | 'specops' | 'artillery';
  regionId: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  status: 'idle' | 'marching' | 'sieging' | 'embarked' | 'entrenched' | 'retreating';
  assignedSectorId?: string;
}

export interface HistoricalBomb {
  id: string;
  name: string;
  era: ScenarioYear;
  type: 'tactical' | 'heavy' | 'strategic' | 'nuclear';
  damage: number;
  cost: number;
  description: string;
  icon: string;
}

export const HISTORICAL_BOMBS: HistoricalBomb[] = [
  // 2026
  { id: 'b_sdb_2026', name: 'GBU-39 Small Diameter Bomb', era: '2026', type: 'tactical', damage: 65, cost: 25000, description: 'GPS-guided stand-off glide bomb with surgical strike accuracy.', icon: '🎯' },
  { id: 'b_jdam_2026', name: 'JDAM 2000lb Guided Penetrator', era: '2026', type: 'heavy', damage: 120, cost: 45000, description: 'All-weather smart weapon kit converting free-fall bombs into precision munition.', icon: '💣' },
  { id: 'b_fab3000_2026', name: 'FAB-3000 Heavy Glide Bomb', era: '2026', type: 'strategic', damage: 220, cost: 85000, description: 'High-explosive heavy demolition aerial bomb with deployable wing kit.', icon: '💥' },
  
  // 1950
  { id: 'b_napalm_1950', name: 'M116 Incendiary Napalm Bomb', era: '1950', type: 'tactical', damage: 70, cost: 18000, description: 'Gelatinized fuel canister generating sustained intense combustion zones.', icon: '🔥' },
  { id: 'b_tallboy_1950', name: 'Tallboy 12,000lb Earthquake Bomb', era: '1950', type: 'heavy', damage: 150, cost: 55000, description: 'Deep-penetration aerodynamic seismic bomb shattering underground fortifications.', icon: '💣' },
  { id: 'b_mark4_1950', name: 'Mark 4 Strategic Atomic Device', era: '1950', type: 'nuclear', damage: 350, cost: 250000, description: 'First mass-produced post-war atomic implosion weapon with kiloton blast yield.', icon: '☢️' },

  // 1936
  { id: 'b_sc250_1936', name: 'SC 250 General-Purpose Bomb', era: '1936', type: 'tactical', damage: 50, cost: 12000, description: 'Standard high-explosive aerial bomb for tactical close support.', icon: '💣' },
  { id: 'b_sc1000_1936', name: 'SC 1000 Hermann Heavy Demolition', era: '1936', type: 'heavy', damage: 110, cost: 40000, description: 'Thin-cased heavy blast bomb designed to flatten fortified sectors.', icon: '💥' },

  // 1920
  { id: 'b_cooper_1920', name: 'Cooper 20lb High-Explosive Bomb', era: '1920', type: 'tactical', damage: 35, cost: 6000, description: 'Interwar aerial fragmentation bomb dropped from biplane aircraft.', icon: '💣' },
  { id: 'b_livens_1920', name: 'Livens Chemical Projector Canister', era: '1920', type: 'heavy', damage: 75, cost: 22000, description: 'Large-bore suppression projectile for entrenchment clearance.', icon: '⚠️' },

  // 1914
  { id: 'b_putilov_1914', name: 'Putilov 76mm Aerial Shrapnel Canister', era: '1914', type: 'tactical', damage: 25, cost: 4000, description: 'Early Great War hand-dropped canister with timer fuze.', icon: '💣' },
  { id: 'b_zeppelin_1914', name: 'Carbonit 50kg Torpedo Aerobomb', era: '1914', type: 'heavy', damage: 60, cost: 16000, description: 'Dirigible Zeppelin heavy fragmentation bomb for strategic bombardment.', icon: '💥' }
];

export interface StrategicFacilityType {
  id: string;
  name: string;
  type: 'nuclear' | 'airbase' | 'tank_factory' | 'naval_base' | 'barracks' | 'sam_shield';
  cost: number;
  icon: string;
  description: string;
  soldierBonus?: number;
  tankBonus?: number;
  aircraftBonus?: number;
  warshipBonus?: number;
  reserveBonus?: number;
  nuclearBonus?: number;
}

export const STRATEGIC_FACILITIES: StrategicFacilityType[] = [
  {
    id: 'fac_nuclear',
    name: 'Nuclear Reactor & ICBM Silo',
    type: 'nuclear',
    cost: 120000,
    icon: '☢️',
    description: 'Strategic nuclear enrichment facility and hardened ICBM launch silo. Provides maximum deterrence.',
    nuclearBonus: 1,
    reserveBonus: 10000
  },
  {
    id: 'fac_airbase',
    name: 'Strategic Air Base & Radar Network',
    type: 'airbase',
    cost: 45000,
    icon: '✈️',
    description: 'Heavy bomber airfield, stealth fighter hangars, and early warning long-range radar station.',
    aircraftBonus: 50
  },
  {
    id: 'fac_tank_factory',
    name: 'Heavy Armor & Tank Assembly Plant',
    type: 'tank_factory',
    cost: 35000,
    icon: '🛡️',
    description: 'Modern main battle tank (MBT) and infantry fighting vehicle (IFV) fabrication complex.',
    tankBonus: 100
  },
  {
    id: 'fac_naval_base',
    name: 'Naval Shipyard & Fleet Base',
    type: 'naval_base',
    cost: 50000,
    icon: '⚓',
    description: 'Deep-water harbor for frigates, destroyers, submarines, and amphibious assault transports.',
    warshipBonus: 10
  },
  {
    id: 'fac_barracks',
    name: 'Military Barracks & Mobilization HQ',
    type: 'barracks',
    cost: 25000,
    icon: '🪖',
    description: 'Brigade-level professional barracks, drill training grounds, and rapid mobilization depot.',
    soldierBonus: 40000,
    reserveBonus: 120000
  },
  {
    id: 'fac_sam_shield',
    name: 'SAM Missile Defense & Air Shield',
    type: 'sam_shield',
    cost: 30000,
    icon: '🎯',
    description: 'Multi-layered surface-to-air missile battery guarding regional airspace against cruise/ballistic threats.'
  }
];

// Land Border Adjacency Database for realistic overseas vs land war detection
const LAND_BORDERS: Record<string, string[]> = {
  TR: ['GR', 'BG', 'SY', 'IQ', 'IR', 'AZ', 'AM', 'GE'],
  GR: ['TR', 'AL', 'MK', 'BG'],
  BG: ['TR', 'GR', 'RO', 'RS', 'MK'],
  FR: ['BE', 'LU', 'DE', 'CH', 'IT', 'ES', 'AD', 'MC'],
  BE: ['FR', 'LU', 'DE', 'NL'],
  DE: ['DK', 'PL', 'CZ', 'AT', 'CH', 'FR', 'LU', 'BE', 'NL'],
  NL: ['DE', 'BE'],
  IT: ['FR', 'CH', 'AT', 'SI', 'SM', 'VA'],
  ES: ['PT', 'FR', 'AD', 'GI'],
  PT: ['ES'],
  PL: ['DE', 'CZ', 'SK', 'UA', 'BY', 'LT', 'RU'],
  UA: ['RU', 'BY', 'PL', 'SK', 'HU', 'RO', 'MD'],
  RU: ['NO', 'FI', 'EE', 'LV', 'LT', 'PL', 'BY', 'UA', 'GE', 'AZ', 'KZ', 'CN', 'MN', 'KP'],
  US: ['CA', 'MX'],
  CA: ['US'],
  MX: ['US', 'GT', 'BZ'],
  CN: ['RU', 'MN', 'KZ', 'KG', 'TJ', 'AF', 'PK', 'IN', 'NP', 'BT', 'MM', 'LA', 'VN', 'KP'],
  IN: ['PK', 'CN', 'NP', 'BT', 'BD', 'MM'],
  GB: ['IE'],
  IE: ['GB'],
  JP: [],
  AU: [],
  NZ: [],
  BR: ['UY', 'AR', 'PY', 'BO', 'PE', 'CO', 'VE', 'GY', 'SR', 'GF'],
  AR: ['CL', 'BO', 'PY', 'BR', 'UY'],
  IL: ['LB', 'SY', 'JO', 'EG', 'PS'],
  SY: ['TR', 'IQ', 'JO', 'IL', 'LB'],
  IR: ['TR', 'AM', 'AZ', 'TM', 'AF', 'PK', 'IQ'],
  IQ: ['TR', 'SY', 'JO', 'SA', 'KW', 'IR'],
  SA: ['JO', 'IQ', 'KW', 'QA', 'AE', 'OM', 'YE'],
  EG: ['IL', 'PS', 'SD', 'LY']
};

export const checkIsLandAdjacent = (countryA: string, countryB: string): boolean => {
  if (countryA === countryB) return true;
  const neighbors = LAND_BORDERS[countryA];
  if (!neighbors) return false;
  return neighbors.includes(countryB);
};

export const getCountryMilitaryBaselines = (countryId: string, scenario: ScenarioYear = '2026') => {
  const baselines: Record<string, { soldiers: number; tanks: number; aircraft: number; warships: number; reserves: number; nukes: number }> = {
    TR: { soldiers: 485000, tanks: 2229, aircraft: 1065, warships: 154, reserves: 880000, nukes: 0 },
    US: { soldiers: 1350000, tanks: 5500, aircraft: 13200, warships: 480, reserves: 800000, nukes: 5044 },
    FR: { soldiers: 205000, tanks: 222, aircraft: 1050, warships: 180, reserves: 41000, nukes: 290 },
    DE: { soldiers: 181000, tanks: 295, aircraft: 610, warships: 65, reserves: 30000, nukes: 0 },
    RU: { soldiers: 1150000, tanks: 12560, aircraft: 4180, warships: 598, reserves: 2000000, nukes: 5580 },
    GB: { soldiers: 148000, tanks: 213, aircraft: 660, warships: 117, reserves: 37000, nukes: 225 },
    CN: { soldiers: 2035000, tanks: 4950, aircraft: 3280, warships: 730, reserves: 510000, nukes: 500 },
    JP: { soldiers: 247000, tanks: 1000, aircraft: 1450, warships: 155, reserves: 56000, nukes: 0 },
    IT: { soldiers: 165000, tanks: 200, aircraft: 800, warships: 184, reserves: 20000, nukes: 0 },
    ES: { soldiers: 120000, tanks: 327, aircraft: 500, warships: 130, reserves: 15000, nukes: 0 },
    CA: { soldiers: 68000, tanks: 82, aircraft: 390, warships: 68, reserves: 27000, nukes: 0 },
    AU: { soldiers: 59000, tanks: 59, aircraft: 460, warships: 52, reserves: 29000, nukes: 0 },
    IN: { soldiers: 1450000, tanks: 4614, aircraft: 2210, warships: 295, reserves: 1155000, nukes: 164 },
    BR: { soldiers: 360000, tanks: 469, aircraft: 665, warships: 112, reserves: 1340000, nukes: 0 },
    BE: { soldiers: 25000, tanks: 40, aircraft: 110, warships: 18, reserves: 6000, nukes: 0 },
    NL: { soldiers: 41000, tanks: 18, aircraft: 160, warships: 32, reserves: 7000, nukes: 0 },
    PL: { soldiers: 216000, tanks: 850, aircraft: 460, warships: 86, reserves: 150000, nukes: 0 },
    UA: { soldiers: 800000, tanks: 2100, aircraft: 320, warships: 25, reserves: 1200000, nukes: 0 },
    GR: { soldiers: 142000, tanks: 1240, aircraft: 570, warships: 120, reserves: 220000, nukes: 0 },
    IL: { soldiers: 170000, tanks: 2200, aircraft: 600, warships: 65, reserves: 465000, nukes: 90 },
    IR: { soldiers: 610000, tanks: 1996, aircraft: 551, warships: 101, reserves: 350000, nukes: 0 },
    SA: { soldiers: 257000, tanks: 1062, aircraft: 897, warships: 55, reserves: 0, nukes: 0 },
    EG: { soldiers: 438500, tanks: 4300, aircraft: 1050, warships: 80, reserves: 479000, nukes: 0 },
    SY: { soldiers: 130000, tanks: 1500, aircraft: 160, warships: 12, reserves: 100000, nukes: 0 },
    SD: { soldiers: 100000, tanks: 400, aircraft: 90, warships: 8, reserves: 80000, nukes: 0 },
    YE: { soldiers: 80000, tanks: 350, aircraft: 40, warships: 5, reserves: 50000, nukes: 0 },
    LY: { soldiers: 60000, tanks: 250, aircraft: 30, warships: 6, reserves: 40000, nukes: 0 },
    MM: { soldiers: 220000, tanks: 600, aircraft: 180, warships: 35, reserves: 110000, nukes: 0 }
  };

  if (baselines[countryId]) return baselines[countryId];

  let seed = 0;
  for (let i = 0; i < countryId.length; i++) seed += countryId.charCodeAt(i);
  const soldiers = 30000 + (seed * 1500) % 180000;
  const tanks = 50 + (seed * 12) % 650;
  const aircraft = 40 + (seed * 8) % 320;
  const warships = 10 + (seed * 3) % 45;
  const reserves = soldiers * 2;
  return { soldiers, tanks, aircraft, warships, reserves, nukes: 0 };
};

export interface WarSector {
  id: string;
  name: string;
  enemyStrength: number;
  maxEnemyStrength: number;
  entrenchment: number;
  controlledBy: 'player' | 'enemy' | 'contested';
  assignedArmyIds: string[];
  strategicValue: string;
  icon: string;
  isBeachhead?: boolean;
}

export interface ActiveWarFront {
  id: string;
  type: 'CIVIL_WAR' | 'INTERSTATE';
  conflictName: string;
  targetCountryId?: string;
  enemyCountryId?: string;
  sides: {
    friendlyName: string;
    friendlyDivisions: number;
    friendlyTroops: number;
    enemyName: string;
    enemyDivisions: number;
    enemyTroops: number;
  };
  status: string;
  momentum: number; // -100 to +100
  isOverseas: boolean;
}

interface TacticalBattleViewProps {
  country: Country;
  party: any;
  scenario: string;
  onBattleFinished: (won: boolean) => void;
  onUpdateRelations?: (relations: Record<string, any>) => void;
  diplomaticRelations: Record<string, any>;
  globalWars?: GlobalWar[];
  currentTreasury?: number;
  treasury?: number;
  spendTreasury?: (amount: number) => boolean;
  onUpdateTreasury?: (amount: number) => void;
  addTreasury?: (amount: number) => void;
  civilWarRisk?: number;
  isRuling?: boolean;
  onPoliticalStance?: (stance: 'SUPPORT' | 'CRITICIZE' | 'REFORM' | 'NEUTRAL') => void;
  darkMode?: boolean;
}

export const TacticalBattleView: React.FC<TacticalBattleViewProps> = ({
  country,
  party,
  scenario,
  onBattleFinished,
  onUpdateRelations,
  diplomaticRelations = {},
  globalWars,
  currentTreasury,
  treasury,
  spendTreasury,
  onUpdateTreasury,
  addTreasury,
  civilWarRisk = 0,
  isRuling = true,
  onPoliticalStance,
  darkMode = true
}) => {
  // Safe Treasury accessor
  const effectiveTreasury = currentTreasury !== undefined ? currentTreasury : (treasury !== undefined ? treasury : 500000);

  const safeSpendTreasury = (amount: number): boolean => {
    if (spendTreasury) return spendTreasury(amount);
    if (onUpdateTreasury) {
      if (effectiveTreasury < amount) return false;
      onUpdateTreasury(effectiveTreasury - amount);
      return true;
    }
    return true;
  };

  const safeAddTreasury = (amount: number) => {
    if (addTreasury) addTreasury(amount);
    else if (onUpdateTreasury) onUpdateTreasury(effectiveTreasury + amount);
  };

  const getCurrency = (countryId: string) => {
    if (countryId === 'US') return '$';
    if (countryId === 'TR') return '₺';
    if (countryId === 'DE' || countryId === 'FR' || countryId === 'IT' || countryId === 'ES') return '€';
    if (countryId === 'GB') return '£';
    if (countryId === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrency(country.id);

  // Baseline Military
  const initialBase = getCountryMilitaryBaselines(country.id, scenario as ScenarioYear);
  const [extraSoldiers, setExtraSoldiers] = useState<number>(0);
  const [extraTanks, setExtraTanks] = useState<number>(0);
  const [extraAircraft, setExtraAircraft] = useState<number>(0);
  const [extraWarships, setExtraWarships] = useState<number>(0);
  const [extraReserves, setExtraReserves] = useState<number>(0);
  const [extraNukes, setExtraNukes] = useState<number>(0);

  // Naval Transports for Overseas Wars
  const [navalTransports, setNavalTransports] = useState<number>(10);

  const totalActiveSoldiers = initialBase.soldiers + extraSoldiers;
  const totalTanks = initialBase.tanks + extraTanks;
  const totalAircraft = initialBase.aircraft + extraAircraft;
  const totalWarships = initialBase.warships + extraWarships;
  const totalReserves = initialBase.reserves + extraReserves;
  const totalNukes = initialBase.nukes + extraNukes;

  // Country name lookup
  const getCountryName = (cId: string) => {
    const names: Record<string, string> = {
      BE: 'Belgium',
      FR: 'France',
      TR: 'Turkey',
      US: 'United States',
      DE: 'Germany',
      GB: 'United Kingdom',
      RU: 'Russia',
      UA: 'Ukraine',
      IT: 'Italy',
      ES: 'Spain',
      GR: 'Greece',
      PL: 'Poland',
      CN: 'China',
      JP: 'Japan',
      IR: 'Iran',
      IL: 'Israel',
      SY: 'Syria',
      CA: 'Canada',
      AU: 'Australia',
      IN: 'India',
      BR: 'Brazil',
      EG: 'Egypt',
      SD: 'Sudan',
      LY: 'Libya',
      YE: 'Yemen',
      MM: 'Myanmar'
    };
    return names[cId] || cId;
  };

  // 1. DYNAMIC FRONT GENERATION FROM GAME STATE
  // Derived dynamically from declared interstate wars and civil wars/insurgencies.
  const activeFronts: ActiveWarFront[] = [];

  // A) Civil War Front (Triggered whenever civilWarRisk >= 15 or in recognized initial civil war country)
  const isCivilWarActive = civilWarRisk >= 15 || Boolean(INITIAL_CIVIL_WARS[country.id]);
  if (isCivilWarActive) {
    const cwData = INITIAL_CIVIL_WARS[country.id];
    const friendlyTroops = Math.round(initialBase.soldiers * 0.7);
    const rebelTroops = Math.round(initialBase.soldiers * Math.max(0.2, (civilWarRisk / 100) * 0.6));
    const friendlyDivs = Math.max(4, Math.round(friendlyTroops / 25000));
    const rebelDivs = Math.max(3, Math.round(rebelTroops / 25000));

    activeFronts.push({
      id: 'CIVIL_WAR',
      type: 'CIVIL_WAR',
      conflictName: cwData?.conflictName || `${country.name} Civil War & Anti-Insurgency Front`,
      sides: {
        friendlyName: `${country.name} Armed Forces (Government Loyalists)`,
        friendlyDivisions: friendlyDivs,
        friendlyTroops,
        enemyName: cwData?.factions.find(f => !f.isGovernment)?.name || 'National Salvation Rebel Militias',
        enemyDivisions: rebelDivs,
        enemyTroops: rebelTroops
      },
      status: civilWarRisk > 50 ? 'Critical Urban Siege & Sector Contestation' : 'Counter-Insurgency Encirclement',
      momentum: Math.max(-100, Math.min(100, 50 - civilWarRisk)),
      isOverseas: false
    });
  }

  // B) Interstate Wars (From Global Wars state or declared diplomatic relations)
  const processedEnemies = new Set<string>();

  // Check global wars involving the player country
  if (globalWars && globalWars.length > 0) {
    globalWars.forEach(war => {
      const isSideA = war.belligerentsA.includes(country.id);
      const isSideB = war.belligerentsB.includes(country.id);
      if (isSideA || isSideB) {
        const enemies = isSideA ? war.belligerentsB : war.belligerentsA;
        const enemyId = enemies[0] || (isSideA ? war.countryB : war.countryA);
        if (enemyId && enemyId !== country.id) {
          processedEnemies.add(enemyId);
          const eBase = getCountryMilitaryBaselines(enemyId, scenario as ScenarioYear);
          const isOverseas = !checkIsLandAdjacent(country.id, enemyId);
          const friendlyDivs = Math.max(5, Math.round(totalActiveSoldiers / 25000));
          const enemyDivs = Math.max(4, Math.round(eBase.soldiers / 25000));

          activeFronts.push({
            id: enemyId,
            type: 'INTERSTATE',
            conflictName: war.name || `${country.name} - ${getCountryName(enemyId)} Conflict`,
            targetCountryId: enemyId,
            sides: {
              friendlyName: `${country.name} Armed Forces`,
              friendlyDivisions: friendlyDivs,
              friendlyTroops: totalActiveSoldiers,
              enemyName: `${getCountryName(enemyId)} Armed Forces`,
              enemyDivisions: enemyDivs,
              enemyTroops: eBase.soldiers
            },
            status: isOverseas ? 'Amphibious Expeditionary Operations' : 'Active Border Clashes & Frontline Penetration',
            momentum: 0,
            isOverseas
          });
        }
      }
    });
  }

  // Also check any declared wars in diplomaticRelations not yet in activeFronts
  Object.entries(diplomaticRelations).forEach(([cId, rel]) => {
    if (rel && (rel as any).status === 'At War' && cId !== country.id && !processedEnemies.has(cId)) {
      processedEnemies.add(cId);
      const eBase = getCountryMilitaryBaselines(cId, scenario as ScenarioYear);
      const isOverseas = !checkIsLandAdjacent(country.id, cId);
      const friendlyDivs = Math.max(5, Math.round(totalActiveSoldiers / 25000));
      const enemyDivs = Math.max(4, Math.round(eBase.soldiers / 25000));

      activeFronts.push({
        id: cId,
        type: 'INTERSTATE',
        conflictName: `${country.name} - ${getCountryName(cId)} Sovereign Conflict`,
        targetCountryId: cId,
        sides: {
          friendlyName: `${country.name} Sovereign Armed Forces`,
          friendlyDivisions: friendlyDivs,
          friendlyTroops: totalActiveSoldiers,
          enemyName: `${getCountryName(cId)} Armed Forces`,
          enemyDivisions: enemyDivs,
          enemyTroops: eBase.soldiers
        },
        status: isOverseas ? 'Amphibious Expeditionary Operations' : 'Active Border Clashes & Frontline Penetration',
        momentum: 0,
        isOverseas
      });
    }
  });

  // Active Theater state: 'HOME' or an active front id
  const [activeTheater, setActiveTheater] = useState<string>(() => {
    return activeFronts.length > 0 ? activeFronts[0].id : 'HOME';
  });

  // Keep active theater valid if front closes
  useEffect(() => {
    if (activeTheater !== 'HOME' && !activeFronts.some(f => f.id === activeTheater)) {
      setActiveTheater(activeFronts.length > 0 ? activeFronts[0].id : 'HOME');
    }
  }, [activeFronts.length]);

  const currentFront = activeFronts.find(f => f.id === activeTheater) || null;
  const isCivilWarFront = currentFront?.type === 'CIVIL_WAR';
  const enemyCountryId = currentFront?.targetCountryId || null;
  const isEnemyOverseas = currentFront?.isOverseas || false;

  const enemyBase = enemyCountryId ? getCountryMilitaryBaselines(enemyCountryId, scenario as ScenarioYear) : null;

  // Frontline War Sectors
  const [warSectors, setWarSectors] = useState<Record<string, WarSector[]>>({});
  const [draggedArmyId, setDraggedArmyId] = useState<string | null>(null);
  const [selectedFrontArmyId, setSelectedFrontArmyId] = useState<string | null>(null);

  // Opposition Political Stance on War
  const [selectedStance, setSelectedStance] = useState<string | null>(null);

  // Initialize Sectors for Active Fronts
  useEffect(() => {
    if (!currentFront) return;
    const frontKey = currentFront.id;
    if (warSectors[frontKey]) return;

    let defaultSectors: WarSector[] = [];

    if (currentFront.type === 'CIVIL_WAR') {
      defaultSectors = [
        { id: `sec_cw_cap`, name: `Capital Citadel & Presidential Palace`, enemyStrength: 350, maxEnemyStrength: 350, entrenchment: 45, controlledBy: 'contested', assignedArmyIds: [], strategicValue: 'National Command Center', icon: '🏛️' },
        { id: `sec_cw_urban`, name: `Metropolitan Industrial Corridor`, enemyStrength: 280, maxEnemyStrength: 280, entrenchment: 30, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Supply & Factory Hub', icon: '🏙️' },
        { id: `sec_cw_airbase`, name: `Strategic Air Base & Airspace Radar`, enemyStrength: 300, maxEnemyStrength: 300, entrenchment: 35, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Air Superiority', icon: '✈️' },
        { id: `sec_cw_stronghold`, name: `Rebel Mountain Bastion & Command Cave`, enemyStrength: 420, maxEnemyStrength: 420, entrenchment: 55, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Insurgent Headquarters', icon: '🚩' }
      ];
    } else {
      const eName = getCountryName(currentFront.targetCountryId!);
      if (currentFront.isOverseas) {
        defaultSectors = [
          { id: `sec_${frontKey}_beach`, name: `${eName} Coastal Landing & Beachhead`, enemyStrength: 280, maxEnemyStrength: 280, entrenchment: 25, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Amphibious Bridgehead', icon: '🏖️', isBeachhead: true },
          { id: `sec_${frontKey}_naval`, name: `${eName} Naval Port & Fleet Base`, enemyStrength: 340, maxEnemyStrength: 340, entrenchment: 35, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Supply & Logistics Hub', icon: '⚓' },
          { id: `sec_${frontKey}_air`, name: `${eName} Forward Air Base & Radar`, enemyStrength: 310, maxEnemyStrength: 310, entrenchment: 30, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Air Superiority', icon: '✈️' },
          { id: `sec_${frontKey}_cap`, name: `${eName} Capital & High Command HQ`, enemyStrength: 460, maxEnemyStrength: 460, entrenchment: 50, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'National Command Center', icon: '🏛️' }
        ];
      } else {
        defaultSectors = [
          { id: `sec_${frontKey}_1`, name: `${eName} Frontier Fortifications & Checkpoints`, enemyStrength: 260, maxEnemyStrength: 260, entrenchment: 40, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Border Defense', icon: '🚩' },
          { id: `sec_${frontKey}_2`, name: `${eName} Strategic Logistics Corridor`, enemyStrength: 320, maxEnemyStrength: 320, entrenchment: 30, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Logistics Hub', icon: '🛡️' },
          { id: `sec_${frontKey}_3`, name: `${eName} Central Air Base & Defense Grid`, enemyStrength: 300, maxEnemyStrength: 300, entrenchment: 35, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Air Superiority', icon: '✈️' },
          { id: `sec_${frontKey}_4`, name: `${eName} Capital & High Command Citadel`, enemyStrength: 450, maxEnemyStrength: 450, entrenchment: 45, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'National Command Center', icon: '🏛️' }
        ];
      }
    }

    setWarSectors(prev => ({ ...prev, [frontKey]: defaultSectors }));
  }, [currentFront, warSectors]);

  // Province built facilities mapping (provinceId -> facility ids[])
  const [provinceFacilities, setProvinceFacilities] = useState<Record<string, string[]>>({});
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  // Armies state
  const [armies, setArmies] = useState<PlayerArmy[]>([
    { id: 'army_1', name: '1st Armored Corps', type: 'armored', regionId: country.regions[0]?.id || 'r1', hp: 280, maxHp: 280, attackPower: 80, status: 'idle' },
    { id: 'army_2', name: '2nd Infantry Division', type: 'infantry', regionId: country.regions[1]?.id || 'r2', hp: 180, maxHp: 180, attackPower: 50, status: 'idle' },
    { id: 'army_3', name: '3rd Special Operations Brigade', type: 'specops', regionId: country.regions[2]?.id || 'r2', hp: 200, maxHp: 200, attackPower: 65, status: 'idle' },
    { id: 'army_4', name: '4th Heavy Artillery Regiment', type: 'artillery', regionId: country.regions[0]?.id || 'r1', hp: 150, maxHp: 150, attackPower: 85, status: 'idle' }
  ]);

  // Ordnance & Bomb Arsenal
  const [inventoryBombs, setInventoryBombs] = useState<Record<string, number>>({
    [scenario === '1950' ? 'b_napalm_1950' : scenario === '1936' ? 'b_sc250_1936' : scenario === '1920' ? 'b_cooper_1920' : scenario === '1914' ? 'b_putilov_1914' : 'b_jdam_2026']: 3,
    b_sdb_2026: 2
  });
  const [showOrdnanceFactory, setShowOrdnanceFactory] = useState<boolean>(false);

  const [battleLogs, setBattleLogs] = useState<string[]>([
    `🛡️ Strategic Command and Sovereign Defense Center online. Monitoring active theaters and defense posture.`
  ]);

  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const facilityMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const regionCentersRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const [centersReady, setCentersReady] = useState(false);

  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev.slice(0, 24)]);
  };

  // Load geojson for home country
  useEffect(() => {
    let isMounted = true;

    const fetchJsonSafely = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) return null;
        const text = await res.text();
        if (text.trim().startsWith('<')) return null;
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    const countryGeoJsonUrls: Record<string, string[]> = {
      TR: ['https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json', '/world_admin0_50m.geojson'],
      DE: ['https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json', '/world_admin0_50m.geojson'],
      US: ['https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json', '/world_admin0_50m.geojson'],
      RU: ['/russia.geojson', '/world_admin0_50m.geojson'],
      UA: ['/ukraine.geojson', '/world_admin0_50m.geojson'],
      EG: ['/egypt-provinces.geojson', '/world_admin0_50m.geojson'],
      BR: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson', '/world_admin0_50m.geojson'],
      JP: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson', '/world_admin0_50m.geojson'],
      GB: ['https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json', '/world_admin0_50m.geojson'],
      CA: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson', '/world_admin0_50m.geojson'],
      FR: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/france-regions.geojson', '/world_admin0_50m.geojson']
    };

    const loadCountryGeoJson = async () => {
      const candidates = countryGeoJsonUrls[country.id] || [
        `/${country.name.toLowerCase().replace(/\s+/g, '-')}.geojson`,
        '/world_admin0_50m.geojson',
        'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
      ];

      for (const url of candidates) {
        const data = await fetchJsonSafely(url);
        if (isMounted && data && (data.features || data.type === 'FeatureCollection')) {
          setGeoJsonData(data);
          return;
        }
      }
    };

    loadCountryGeoJson();
    return () => { isMounted = false; };
  }, [country.id, country.name]);

  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      try { if (map.stop) map.stop(); map.off(); map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
      geoJsonLayerRef.current = null;
      tileLayerRef.current = null;
      facilityMarkersLayerRef.current = null;
    }
  };

  // Initialize leaflet map
  useEffect(() => {
    if (activeTheater !== 'HOME') {
      cleanupMap();
      return;
    }

    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30, 10],
        zoom: 4,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tileUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);
      facilityMarkersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      cleanupMap();
    };
  }, [activeTheater, darkMode]);

  // Update map geojson
  useEffect(() => {
    if (activeTheater !== 'HOME' || !mapInstanceRef.current || !geoJsonData) return;

    const map = mapInstanceRef.current;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const centers: Record<string, { lat: number; lng: number }> = {};

    const geoLayer = L.geoJSON(geoJsonData, {
      style: (feature: any) => {
        const rawName = getFeatureName(feature);
        const rId = getRegionIdFromNormalizedName(rawName, country.regions);
        const isSelected = rId && rId === selectedProvinceId;

        return {
          fillColor: isSelected ? '#3b82f6' : darkMode ? '#1e293b' : '#cbd5e1',
          fillOpacity: isSelected ? 0.75 : 0.45,
          color: isSelected ? '#60a5fa' : darkMode ? '#475569' : '#94a3b8',
          weight: isSelected ? 2.5 : 1
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const rawName = getFeatureName(feature);
        const rId = getRegionIdFromNormalizedName(rawName, country.regions) || rawName;

        try {
          if ((layer as any).getBounds) {
            const bounds = (layer as any).getBounds();
            centers[rId] = bounds.getCenter();
          }
        } catch (e) {}

        layer.on({
          click: () => {
            setSelectedProvinceId(rId);
            playSound('click');
          }
        });
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoLayer;
    regionCentersRef.current = centers;
    setCentersReady(true);

    try {
      map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
    } catch(e) {}
  }, [geoJsonData, activeTheater, selectedProvinceId, country.regions, darkMode]);

  // Render facility markers on map
  useEffect(() => {
    if (activeTheater !== 'HOME' || !facilityMarkersLayerRef.current) return;
    const markersGroup = facilityMarkersLayerRef.current;
    markersGroup.clearLayers();

    Object.entries(provinceFacilities).forEach(([pId, fIds]) => {
      const facilityList = (fIds as string[]) || [];
      const center = regionCentersRef.current[pId];
      if (!center || facilityList.length === 0) return;

      const iconsHtml = facilityList.map(fid => {
        const fac = STRATEGIC_FACILITIES.find(f => f.id === fid);
        return fac ? fac.icon : '🏛️';
      }).join(' ');

      const icon = L.divIcon({
        className: 'custom-facility-marker',
        html: `<div style="background: rgba(15, 23, 42, 0.85); border: 1px solid #3b82f6; border-radius: 8px; padding: 2px 5px; font-size: 12px; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">${iconsHtml}</div>`,
        iconSize: [24, 24]
      });

      L.marker([center.lat, center.lng], { icon }).addTo(markersGroup);
    });
  }, [provinceFacilities, centersReady, activeTheater]);

  // Check if player has power to command armed forces
  const checkRulingControl = (actionName: string): boolean => {
    if (!isRuling) {
      playSound('error');
      addLog(`🔒 ACTION LOCKED: Only the sitting government commands the armed forces.`);
      return false;
    }
    return true;
  };

  // Handle Political Stance Selection for Opposition
  const handleSelectPoliticalStance = (stanceKey: 'SUPPORT' | 'CRITICIZE' | 'REFORM' | 'NEUTRAL') => {
    setSelectedStance(stanceKey);
    if (onPoliticalStance) {
      onPoliticalStance(stanceKey);
    }
    if (stanceKey === 'SUPPORT') {
      addLog(`📣 PARLIAMENTARY STANCE: Your party officially declared unwavering support for sovereign national defense!`);
    } else if (stanceKey === 'CRITICIZE') {
      addLog(`🕊️ PARLIAMENTARY STANCE: Your party condemned the sitting government's war mismanagement and demanded immediate peace negotiations!`);
    } else if (stanceKey === 'REFORM') {
      addLog(`🛡️ PARLIAMENTARY STANCE: Your party demanded an emergency equipment and logistics surge for frontline troops!`);
    } else {
      addLog(`⚖️ PARLIAMENTARY STANCE: Your party called for constructive scrutiny and strict defense budget oversight.`);
    }
  };

  // Handle Construction of Strategic Facility
  const handleConstructFacility = (facilityId: string) => {
    if (!checkRulingControl('Facility Construction')) return;
    if (!selectedProvinceId) return;
    const fac = STRATEGIC_FACILITIES.find(f => f.id === facilityId);
    if (!fac) return;

    if (effectiveTreasury < fac.cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Treasury Funds: ${fac.name} requires ${currency}${fac.cost.toLocaleString()}.`);
      return;
    }

    const regName = country.regions.find(r => r.id === selectedProvinceId)?.name || selectedProvinceId;
    const existing = provinceFacilities[selectedProvinceId] || [];

    if (existing.includes(facilityId) && facilityId !== 'fac_nuclear') {
      playSound('error');
      addLog(`⚠️ This region (${regName}) already operates a ${fac.name}.`);
      return;
    }

    const ok = safeSpendTreasury(fac.cost);
    if (!ok) return;

    if (fac.soldierBonus) setExtraSoldiers(prev => prev + fac.soldierBonus!);
    if (fac.tankBonus) setExtraTanks(prev => prev + fac.tankBonus!);
    if (fac.aircraftBonus) setExtraAircraft(prev => prev + fac.aircraftBonus!);
    if (fac.warshipBonus) setExtraWarships(prev => prev + fac.warshipBonus!);
    if (fac.reserveBonus) setExtraReserves(prev => prev + fac.reserveBonus!);
    if (fac.nuclearBonus) setExtraNukes(prev => prev + fac.nuclearBonus!);

    setProvinceFacilities(prev => ({
      ...prev,
      [selectedProvinceId]: [...(prev[selectedProvinceId] || []), facilityId]
    }));

    playSound('success');
    addLog(`🏗️ CONSTRUCTION COMPLETE: ${regName} commissioned a ${fac.icon} ${fac.name}! (${currency}${fac.cost.toLocaleString()})`);
  };

  // Commission Naval Transports
  const handleCommissionTransports = () => {
    if (!checkRulingControl('Naval Transport Commission')) return;
    const cost = 20000;
    if (effectiveTreasury < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Funds: Commissioning 5x Amphibious Transport Ships requires ${currency}20,000.`);
      return;
    }
    const ok = safeSpendTreasury(cost);
    if (!ok) return;
    setNavalTransports(prev => prev + 5);
    playSound('success');
    addLog(`⚓ NAVAL LOGISTICS: 5x Amphibious Transport Ships added to sovereign sealift fleet!`);
  };

  // Recruit & Deploy Army Division
  const handleRecruitArmy = (regionId: string, unitType: 'infantry' | 'armored' | 'specops' | 'artillery') => {
    if (!checkRulingControl('Division Mobilization')) return;
    const region = country.regions.find(r => r.id === regionId);
    if (!region) return;

    let cost = 15000;
    let hp = 180;
    let atk = 45;
    let typeName = 'Infantry Division';

    if (unitType === 'armored') {
      cost = 35000; hp = 280; atk = 75; typeName = 'Armored Brigade';
    } else if (unitType === 'specops') {
      cost = 25000; hp = 200; atk = 60; typeName = 'Special Operations Group';
    } else if (unitType === 'artillery') {
      cost = 30000; hp = 150; atk = 85; typeName = 'Heavy Artillery Regiment';
    }

    if (effectiveTreasury < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Treasury: Deploying ${typeName} requires ${currency}${cost.toLocaleString()}.`);
      return;
    }

    const ok = safeSpendTreasury(cost);
    if (!ok) return;

    const newArmy: PlayerArmy = {
      id: `army-${Date.now()}`,
      name: `${armies.length + 1}th ${typeName}`,
      type: unitType,
      regionId: regionId,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      status: 'idle'
    };

    setArmies(prev => [...prev, newArmy]);
    playSound('success');
    addLog(`🪖 ${region.name}: New ${typeName} mobilized and assigned to tactical command!`);
  };

  // Manufacture Historical Ordnance / Bomb
  const handleManufactureBomb = (bombId: string) => {
    if (!checkRulingControl('Bomb Manufacturing')) return;
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    if (!bomb) return;
    if (effectiveTreasury < bomb.cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Budget: ${bomb.name} production requires ${currency}${bomb.cost.toLocaleString()}.`);
      return;
    }

    const ok = safeSpendTreasury(bomb.cost);
    if (!ok) return;

    setInventoryBombs(prev => ({
      ...prev,
      [bombId]: (prev[bombId] || 0) + 1
    }));
    playSound('success');
    addLog(`🏭 ORDNANCE ARSENAL: 1x ${bomb.icon} ${bomb.name} manufactured and stockpiled!`);
  };

  // Toggle Embarkation onto Naval Transports
  const handleToggleEmbark = (armyId: string) => {
    if (!checkRulingControl('Naval Embarkation')) return;
    const army = armies.find(a => a.id === armyId);
    if (!army) return;

    if (army.status === 'embarked') {
      setArmies(prev => prev.map(a => a.id === armyId ? { ...a, status: 'idle' } : a));
      addLog(`⚓ ${army.name} disembarked and stationed on mainland territory.`);
      playSound('click');
    } else {
      const currentlyEmbarked = armies.filter(a => a.status === 'embarked').length;
      if (currentlyEmbarked >= navalTransports) {
        playSound('error');
        addLog(`⚠️ Sealift Capacity Exceeded: You have ${navalTransports} transport ships. Commission more transports in Naval Shipyards.`);
        return;
      }
      setArmies(prev => prev.map(a => a.id === armyId ? { ...a, status: 'embarked' } : a));
      addLog(`🚢 ${army.name} embarked onto Amphibious Transport Flotilla for overseas operations.`);
      playSound('success');
    }
  };

  // Defend / Entrench Action on Front
  const handleDefendSector = (sectorId: string, armyId?: string) => {
    if (!checkRulingControl('Entrenchment Command')) return;
    if (!currentFront) return;
    const frontKey = currentFront.id;
    const currentSectors = warSectors[frontKey] || [];
    const sectorIndex = currentSectors.findIndex(s => s.id === sectorId);
    if (sectorIndex === -1) return;

    const sector = currentSectors[sectorIndex];
    const updatedSectors = [...currentSectors];
    const newEntrenchment = Math.min(100, sector.entrenchment + 25);

    updatedSectors[sectorIndex] = {
      ...sector,
      entrenchment: newEntrenchment
    };

    setWarSectors(prev => ({ ...prev, [frontKey]: updatedSectors }));
    playSound('success');
    addLog(`🛡️ DEFENSE ENTRENCHMENT: Allied divisions dug trenches, set up barricades and reinforced fortifications in ${sector.name} (+25% entrenchment).`);
  };

  // Retreat / Fallback Action
  const handleRetreatArmy = (armyId: string) => {
    if (!checkRulingControl('Retreat Command')) return;
    const army = armies.find(a => a.id === armyId);
    if (!army) return;

    setArmies(prev => prev.map(a => {
      if (a.id === armyId) {
        return { ...a, status: 'retreating', hp: Math.min(a.maxHp, a.hp + 20) };
      }
      return a;
    }));

    playSound('click');
    addLog(`🏃 TACTICAL FALLBACK: ${army.name} withdrew to rear supply depot to preserve division strength and recover.`);
  };

  // Reinforce / Replenish Army Division
  const handleReinforceArmy = (armyId: string) => {
    if (!checkRulingControl('Reinforce Command')) return;
    const cost = 8000;
    if (effectiveTreasury < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Funds: Field reinforcement requires ${currency}8,000.`);
      return;
    }

    const ok = safeSpendTreasury(cost);
    if (!ok) return;

    setArmies(prev => prev.map(a => {
      if (a.id === armyId) {
        return { ...a, hp: Math.min(a.maxHp, a.hp + 80), status: 'idle' };
      }
      return a;
    }));

    playSound('success');
    addLog(`💉 DIVISION REINFORCED: Field reserves and medical logistics replenished division fighting strength (+80 HP).`);
  };

  // Combat Assault / Action on Enemy Sector in active theater
  const handleAssaultSector = (sectorId: string, armyId?: string) => {
    if (!checkRulingControl('Combat Assault Order')) return;
    if (!currentFront) return;
    const frontKey = currentFront.id;
    const currentSectors = warSectors[frontKey] || [];
    const sectorIndex = currentSectors.findIndex(s => s.id === sectorId);
    if (sectorIndex === -1) return;

    const sector = currentSectors[sectorIndex];
    if (sector.controlledBy === 'player') {
      addLog(`ℹ️ ${sector.name} sector is already secured by allied forces.`);
      return;
    }

    const attacker = armies.find(a => a.id === (armyId || selectedFrontArmyId)) || armies[0];
    if (!attacker) {
      playSound('error');
      addLog(`⚠️ No active combat division available to execute the assault.`);
      return;
    }

    if (currentFront.isOverseas && attacker.status !== 'embarked') {
      playSound('error');
      addLog(`⚠️ OVERSEAS THEATER RESTRICTION: Target is overseas. You must EMBARK this division onto Naval Transports before launching an amphibious assault!`);
      return;
    }

    if (currentFront.isOverseas && !sector.isBeachhead) {
      const beachSector = currentSectors.find(s => s.isBeachhead);
      if (beachSector && beachSector.controlledBy !== 'player') {
        playSound('error');
        addLog(`⚠️ AMPHIBIOUS DOCTRINE: You must capture and secure the Coastal Landing Beachhead before advancing deep inland!`);
        return;
      }
    }

    // Deterministic Combat Power Calculation based on army size, equipment, morale, and sector entrenchment
    const attackerMorale = 85;
    const attackerSupply = 90;
    const attackerForces = Math.round(attacker.attackPower * 12);
    const attackerPower = calculateCombatPower({
      id: attacker.id,
      name: attacker.name,
      soldiers: attackerForces,
      tanks: attacker.type === 'armored' ? 25 : 5,
      aircraft: 15,
      morale: attackerMorale,
      supplyScore: attackerSupply
    }, false, sector.entrenchment > 40 ? 'MOUNTAINS' : 'PLAINS', 3);

    const defenderForces = Math.round(sector.enemyStrength * 10);
    const defenderPower = calculateCombatPower({
      id: sector.id,
      name: sector.name,
      soldiers: defenderForces,
      tanks: 10,
      aircraft: 8,
      morale: 75,
      supplyScore: 70
    }, true, sector.entrenchment > 40 ? 'MOUNTAINS' : 'PLAINS', 3);

    // Resolve battle exchange
    const totalPower = attackerPower + defenderPower;
    const attackerShare = totalPower > 0 ? attackerPower / totalPower : 0.5;

    const damageDealt = Math.max(30, Math.round(attacker.attackPower * (0.8 + attackerShare * 0.6)));
    const counterDamage = Math.max(5, Math.round(25 * (1 - attackerShare * 0.5) * (1 + sector.entrenchment / 100)));

    const newStrength = Math.max(0, sector.enemyStrength - damageDealt);
    const newEntrenchment = Math.max(0, sector.entrenchment - 15);
    const isCaptured = newStrength === 0;

    setArmies(prev => prev.map(a => {
      if (a.id === attacker.id) {
        return { ...a, hp: Math.max(10, a.hp - counterDamage) };
      }
      return a;
    }));

    const updatedSectors = [...currentSectors];
    updatedSectors[sectorIndex] = {
      ...sector,
      enemyStrength: newStrength,
      entrenchment: newEntrenchment,
      controlledBy: isCaptured ? 'player' : 'contested',
      assignedArmyIds: Array.from(new Set([...sector.assignedArmyIds, attacker.id]))
    };

    setWarSectors(prev => ({ ...prev, [frontKey]: updatedSectors }));
    playSound(isCaptured ? 'win' : 'explosion');

    if (isCaptured) {
      addLog(`🚩 SECTOR CAPTURED: ${attacker.name} broke hostile fortifications in ${sector.name}! (Casualties: Friendly -${counterDamage} HP, Hostile Neutralized)`);
      
      // Update region control if sector maps to a region
      const targetRegionId = sector.id.replace('sec_', '');
      setRegionController(targetRegionId, country.id);

      const remainingEnemy = updatedSectors.filter(s => s.controlledBy !== 'player');
      if (remainingEnemy.length === 0) {
        if (isCivilWarFront) {
          addLog(`🏆 CIVIL WAR RESOLVED: Sovereign armed forces cleared all insurgent bastions. State territorial integrity restored!`);
          
          // Re-annex and restore control over all country regions
          country.regions.forEach(r => {
            setRegionController(r.id, country.id);
          });

          safeAddTreasury(100000);
          onBattleFinished(true);
        } else {
          const enemyId = currentFront.targetCountryId!;
          addLog(`🏆 TOTAL MILITARY TRIUMPH: ${getCountryName(enemyId)} High Command capitulated and signed peace treaty! Borders updated.`);
          
          // Apply permanent peace deal border annexation
          const occupiedRegions: Region[] = [
            { 
              id: `${enemyId.toLowerCase()}_frontier_1`, 
              name: `${getCountryName(enemyId)} Border Sector 1`, 
              seats: 4, 
              campaignLevel: 2, 
              infrastructure: 3, 
              controlledBy: country.id, 
              originalOwnerId: enemyId,
              voterDistribution: { Workers: 35, Youth: 25, Nationalists: 20, Liberals: 20 },
              supports: {}
            },
            { 
              id: `${enemyId.toLowerCase()}_logistics_2`, 
              name: `${getCountryName(enemyId)} Logistics Hub 2`, 
              seats: 3, 
              campaignLevel: 2, 
              infrastructure: 3, 
              controlledBy: country.id, 
              originalOwnerId: enemyId,
              voterDistribution: { Workers: 30, Youth: 30, Nationalists: 15, Liberals: 25 },
              supports: {}
            }
          ];
          applyPeaceDealAnnexation(country, enemyId, occupiedRegions);

          safeAddTreasury(150000);
          if (onUpdateRelations && currentFront.targetCountryId) {
            onUpdateRelations({
              ...diplomaticRelations,
              [currentFront.targetCountryId]: { status: 'Victorious Peace / Treaty', opinion: 35, alliance: false }
            });
          }
          onBattleFinished(true);
        }
      }
    } else {
      addLog(`⚔️ ENGAGEMENT: ${attacker.name} assaulted ${sector.name}! (${damageDealt} dealt, ${counterDamage} received, Hostile Remainder: ${newStrength} HP)`);
    }
  };

  // Deploy Historical Bomb / Ordnance Strike on Enemy Sector
  const handleDeployBombOnSector = (sectorId: string, bombId: string) => {
    if (!checkRulingControl('Airstrike Execution')) return;
    if (!currentFront) return;
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    if (!bomb || (inventoryBombs[bombId] || 0) <= 0) {
      playSound('error');
      addLog(`⚠️ Out of stock for ${bomb ? bomb.name : 'this munition'}.`);
      return;
    }

    const frontKey = currentFront.id;
    const currentSectors = warSectors[frontKey] || [];
    const sectorIndex = currentSectors.findIndex(s => s.id === sectorId);
    if (sectorIndex === -1) return;

    const sector = currentSectors[sectorIndex];
    const blastDamage = Math.round(bomb.damage * (1.1 + Math.random() * 0.3));
    const newStrength = Math.max(0, sector.enemyStrength - blastDamage);
    const isCaptured = newStrength === 0;

    setInventoryBombs(prev => ({
      ...prev,
      [bombId]: Math.max(0, (prev[bombId] || 0) - 1)
    }));

    const updatedSectors = [...currentSectors];
    updatedSectors[sectorIndex] = {
      ...sector,
      enemyStrength: newStrength,
      entrenchment: Math.max(0, sector.entrenchment - 35),
      controlledBy: isCaptured ? 'player' : sector.controlledBy
    };

    setWarSectors(prev => ({ ...prev, [frontKey]: updatedSectors }));
    playSound('explosion');
    addLog(`💥 STRATEGIC AIRSTRIKE: 1x ${bomb.icon} ${bomb.name} dropped on ${sector.name}! (${blastDamage} structural destruction)`);

    if (isCaptured) {
      addLog(`🚩 SECTOR DESTROYED: Hostile resistance in ${sector.name} collapsed!`);
    }
  };

  // Drag and Drop handlers for army movement
  const handleDragStart = (e: React.DragEvent, armyId: string) => {
    e.dataTransfer.setData('text/plain', armyId);
    setDraggedArmyId(armyId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSector = (e: React.DragEvent, sectorId: string) => {
    e.preventDefault();
    const armyId = e.dataTransfer.getData('text/plain') || draggedArmyId;
    if (armyId) {
      handleAssaultSector(sectorId, armyId);
    }
    setDraggedArmyId(null);
  };

  const selectedProvince = country.regions.find(r => r.id === selectedProvinceId) || (selectedProvinceId ? { id: selectedProvinceId, name: selectedProvinceId } : null);
  const selectedProvinceBuilt = selectedProvinceId ? (provinceFacilities[selectedProvinceId] || []) : [];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none">
      
      {/* 1. TOP STATUS & WAR READINESS BAR */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${isRuling ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight uppercase">
                {country.name} Supreme Military Command
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isRuling ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isRuling ? 'Sitting Government Command' : 'Parliamentary Opposition Watch'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isRuling 
                ? 'Strategic Sovereign Operations, Force Mobilization & Frontline Engagements' 
                : 'Only the sitting government commands the armed forces. Monitor frontline engagements and declare political positions.'}
            </p>
          </div>
        </div>

        {/* Global Military Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Troops</div>
              <div className="text-xs font-black">{totalActiveSoldiers.toLocaleString()}</div>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Shield className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Armor / Tanks</div>
              <div className="text-xs font-black">{totalTanks.toLocaleString()}</div>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Plane className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Air Force</div>
              <div className="text-xs font-black">{totalAircraft.toLocaleString()}</div>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">War Treasury</div>
              <div className="text-sm font-extrabold text-emerald-400">{currency}{(effectiveTreasury ?? 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Ordnance Arsenal Modal Trigger */}
          <button
            onClick={() => setShowOrdnanceFactory(true)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              darkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-900'
            }`}
          >
            <Factory className="w-4 h-4 text-amber-400" />
            <span>Ordnance Arsenal</span>
          </button>
        </div>
      </div>

      {/* 2. THEATER SWITCHER TABS (GENERATED ONLY FROM ACTIVE WARS & CIVIL WARS) */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto ${
        darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => {
            setActiveTheater('HOME');
            playSound('click');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTheater === 'HOME'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : darkMode ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>🏠 Homeland Defense & Base HQ ({country.name})</span>
        </button>

        {/* Dynamic active war fronts */}
        {activeFronts.map(front => (
          <button
            key={front.id}
            onClick={() => {
              setActiveTheater(front.id);
              playSound('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTheater === front.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 animate-pulse'
                : darkMode ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/50' : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>⚔️ {front.conflictName}</span>
          </button>
        ))}

        {/* Peacetime Status Badge (when no active conflicts exist) */}
        {activeFronts.length === 0 && (
          <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Peacetime Readiness: Sovereign Armed Forces on high alert. No active wars or civil insurgencies.</span>
          </div>
        )}
      </div>

      {/* 3. OPPOSITION WAR CONTROL LOCK BANNER (ITEM 5) */}
      {!isRuling && (
        <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-black uppercase tracking-wider">Only the sitting government commands the armed forces.</span>
              <span className="text-slate-300 block text-[11px] mt-0.5">
                Your party is currently in parliamentary opposition / campaigning. The incumbent sitting administration conducts military operations autonomously. You can declare your party's political stance on the conflict.
              </span>
            </div>
          </div>

          {/* Opposition Stance Picker */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <button
              onClick={() => handleSelectPoliticalStance('SUPPORT')}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                selectedStance === 'SUPPORT' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🦅 Support War Effort</span>
            </button>
            <button
              onClick={() => handleSelectPoliticalStance('CRITICIZE')}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                selectedStance === 'CRITICIZE' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🕊️ Condemn & Demand Peace</span>
            </button>
            <button
              onClick={() => handleSelectPoliticalStance('REFORM')}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                selectedStance === 'REFORM' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🛡️ Surge Troop Equipment</span>
            </button>
            <button
              onClick={() => handleSelectPoliticalStance('NEUTRAL')}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                selectedStance === 'NEUTRAL' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>⚖️ Constructive Scrutiny</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE */}
      {activeTheater === 'HOME' ? (
        /* HOME DEFENSE & PROVINCE STRATEGIC CONSTRUCTION */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* LEAFLET TACTICAL GIS MAP */}
          <div className="flex-1 relative h-[50vh] lg:h-full bg-slate-900">
            <div ref={mapContainerRef} className="w-full h-full" />

            <div className="absolute top-3 left-3 z-[400] bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 shadow-xl flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Homeland Defense Operations: Select any province to commission Strategic Silos, Air Bases, or Barracks</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 lg:right-96 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 max-h-24 overflow-y-auto text-xs text-slate-300 shadow-xl">
              <div className="font-bold text-[11px] text-blue-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Strategic Command Operations Log</span>
              </div>
              {battleLogs.map((log, idx) => (
                <div key={idx} className="text-[11px] py-0.5 border-b border-slate-800/40 last:border-none text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR: PROVINCE STRATEGIC FACILITY CONSTRUCTION PANEL */}
          <div className={`w-full lg:w-96 border-l flex flex-col h-[50vh] lg:h-full overflow-hidden ${
            darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {selectedProvince ? (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Selected Province</div>
                    <h3 className="text-lg font-black">{selectedProvince.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProvinceId(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Built Facilities in Province */}
                <div className="my-3">
                  <div className="text-xs font-bold text-slate-400 mb-2">Commissioned Facilities:</div>
                  {selectedProvinceBuilt.length === 0 ? (
                    <div className="p-3 rounded-xl border border-dashed text-xs text-slate-400 text-center">
                      No strategic facilities commissioned in this region yet. Choose from catalog below.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedProvinceBuilt.map((fId, idx) => {
                        const fac = STRATEGIC_FACILITIES.find(f => f.id === fId);
                        if (!fac) return null;
                        return (
                          <div key={idx} className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold flex items-center gap-1.5 text-slate-200">
                            <span>{fac.icon}</span>
                            <span>{fac.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Strategic Construction Options */}
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Strategic Facility Catalog</span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {STRATEGIC_FACILITIES.map(fac => {
                    const isBuilt = selectedProvinceBuilt.includes(fac.id);
                    const canAfford = effectiveTreasury >= fac.cost;

                    return (
                      <div
                        key={fac.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isBuilt && fac.id !== 'fac_nuclear'
                            ? 'bg-slate-800/40 border-slate-800 opacity-60'
                            : darkMode 
                              ? 'bg-slate-950/60 border-slate-800 hover:border-blue-500/50' 
                              : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{fac.icon}</span>
                            <div>
                              <div className="font-bold text-xs">{fac.name}</div>
                              <div className="text-[11px] font-extrabold text-emerald-400">{currency}{fac.cost.toLocaleString()}</div>
                            </div>
                          </div>

                          <button
                            disabled={!isRuling || !canAfford || (isBuilt && fac.id !== 'fac_nuclear')}
                            onClick={() => handleConstructFacility(fac.id)}
                            title={!isRuling ? "Only the sitting government commands the armed forces" : undefined}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                              !isRuling || (isBuilt && fac.id !== 'fac_nuclear')
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : canAfford
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {!isRuling && <Lock className="w-3 h-3 text-slate-400" />}
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isBuilt && fac.id === 'fac_nuclear' ? 'Expand' : isBuilt ? 'Built' : 'Construct'}</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                          {fac.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Recruit Military Unit in Province */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mobilize Military Divisions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={!isRuling}
                      onClick={() => handleRecruitArmy(selectedProvince.id, 'infantry')}
                      className={`p-2 rounded-xl border border-slate-800 text-left text-xs transition-all cursor-pointer ${
                        !isRuling ? 'bg-slate-950/40 opacity-50 cursor-not-allowed' : 'bg-slate-950/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        {!isRuling && <Lock className="w-3 h-3 text-slate-500" />}
                        <span>🪖 Infantry Division</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-extrabold">{currency}15,000</div>
                    </button>
                    <button
                      disabled={!isRuling}
                      onClick={() => handleRecruitArmy(selectedProvince.id, 'armored')}
                      className={`p-2 rounded-xl border border-slate-800 text-left text-xs transition-all cursor-pointer ${
                        !isRuling ? 'bg-slate-950/40 opacity-50 cursor-not-allowed' : 'bg-slate-950/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        {!isRuling && <Lock className="w-3 h-3 text-slate-500" />}
                        <span>🛡️ Armored Brigade</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-extrabold">{currency}35,000</div>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-3xl">
                  🗺️
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Select a Province</h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Click any province on the tactical GIS map to commission Nuclear Silos, Air Bases, Tank Complexes, or Mobilize Divisions.
                </p>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* REAL INTERACTIVE WAR MAP (STEP 4): LEAFLET THEATER MAP WITH NATO DIVISION COUNTERS, DRAG-AND-DROP MOVEMENT & CASUALTY HUD */
        <div className="flex-1 flex flex-col overflow-hidden relative p-3">
          <WarFrontlineMap
            country={country}
            enemyCountryId={currentFront?.enemyCountryId || enemyCountryId}
            theaterKey={currentFront?.id || activeTheater}
            conflictName={currentFront?.conflictName}
            scenario={scenario}
            darkMode={darkMode}
            onTerritoryChanged={() => {
              // Trigger sync with world map and tactical homeland
              if (onUpdateRelations && (currentFront?.enemyCountryId || enemyCountryId)) {
                // Refresh front
              }
            }}
            onCeasefireOrVictory={(won) => {
              if (won && onUpdateRelations && (currentFront?.enemyCountryId || enemyCountryId)) {
                const eId = currentFront?.enemyCountryId || enemyCountryId || '';
                onUpdateRelations({
                  ...diplomaticRelations,
                  [eId]: { status: 'Armistice / Victory', opinion: 30, alliance: false }
                });
                safeAddTreasury(100000);
              }
            }}
          />
        </div>
      )}

      {/* 5. ORDNANCE & BOMB FACTORY MODAL */}
      {showOrdnanceFactory && (
        <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
            darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent border-slate-800">
              <div className="flex items-center gap-3">
                <Factory className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-black text-base">Strategic Ordnance & Weapon Arsenal</h3>
                  <p className="text-xs text-slate-400">Manufacture era-appropriate precision guided weapons and heavy demolition bombs</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrdnanceFactory(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {HISTORICAL_BOMBS.map(bomb => {
                const count = inventoryBombs[bomb.id] || 0;
                const canAfford = effectiveTreasury >= bomb.cost;

                return (
                  <div
                    key={bomb.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{bomb.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{bomb.name}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300">
                            {bomb.era} • {bomb.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{bomb.description}</p>
                        <div className="text-xs font-extrabold text-amber-400 mt-1">Blast Power: {bomb.damage} Damage</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs font-bold text-slate-300">
                        Stockpile: <span className="text-emerald-400 font-extrabold">{count} units</span>
                      </div>
                      <button
                        disabled={!isRuling || !canAfford}
                        onClick={() => handleManufactureBomb(bomb.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          !isRuling || !canAfford
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                        }`}
                      >
                        {!isRuling && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        <Plus className="w-3.5 h-3.5" />
                        <span>Produce ({currency}{bomb.cost.toLocaleString()})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowOrdnanceFactory(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
