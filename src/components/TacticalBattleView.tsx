import React, { useState, useEffect, useRef } from 'react';
import { 
  Crosshair, Swords, Users, Trophy, AlertTriangle, Compass, Heart, Award, 
  Map as MapIcon, Target, Activity, Shield, Flame, Plus, Zap, Navigation, 
  Bomb, Factory, Radio, Anchor, Plane, DollarSign, ChevronRight, CheckCircle2,
  Building2, X, RefreshCw, Ship, Waves, Skull, Check
} from 'lucide-react';
import { normalizeName, getRegionIdFromNormalizedName, getFeatureName } from '../utils/mapUtils';
import { Country, ScenarioYear } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { playSound } from '../lib/sounds';

interface RegionUnit {
  regionId: string;
  type: 'loyal' | 'rebel' | 'contested';
  hp: number;
  maxHp: number;
  fortificationLevel: number;
  facilities: string[];
}

export interface PlayerArmy {
  id: string;
  name: string;
  type: 'infantry' | 'armored' | 'specops' | 'artillery';
  regionId: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  status: 'idle' | 'marching' | 'sieging' | 'embarked';
  targetRegionId?: string;
  assignedTransportId?: string;
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
  JP: [], // Island nation - 100% overseas
  AU: [], // Island nation
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

// Universal Country Military Baseline Generator
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
    SU: { soldiers: 2800000, tanks: 18000, aircraft: 8500, warships: 450, reserves: 4000000, nukes: 50 },
    DDR: { soldiers: 170000, tanks: 2800, aircraft: 380, warships: 60, reserves: 350000, nukes: 0 },
    FRG: { soldiers: 495000, tanks: 4500, aircraft: 950, warships: 120, reserves: 850000, nukes: 0 }
  };

  if (baselines[countryId]) return baselines[countryId];

  // Dynamic procedural baseline for any other sovereign nation
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

interface TacticalBattleViewProps {
  country: Country;
  party: any;
  scenario: string;
  onBattleFinished: (won: boolean) => void;
  onUpdateRelations?: (relations: Record<string, any>) => void;
  diplomaticRelations: Record<string, any>;
  currentTreasury: number;
  spendTreasury: (amount: number) => boolean;
  addTreasury: (amount: number) => void;
  darkMode?: boolean;
}

export const TacticalBattleView: React.FC<TacticalBattleViewProps> = ({
  country,
  party,
  scenario,
  onBattleFinished,
  onUpdateRelations,
  diplomaticRelations = {},
  currentTreasury,
  spendTreasury,
  addTreasury,
  darkMode = true
}) => {
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

  // Active Wars discovery from diplomaticRelations
  const activeWars = Object.entries(diplomaticRelations)
    .filter(([_, rel]) => rel && (rel as any).status === 'At War')
    .map(([cId, _]) => cId);

  // Active Theater state: 'HOME' or an enemy country code (e.g. 'BE', 'RU', 'UA', etc.)
  const [activeTheater, setActiveTheater] = useState<string>('HOME');

  const enemyCountryId = activeTheater !== 'HOME' ? activeTheater : (activeWars[0] || null);
  const isEnemyOverseas = enemyCountryId ? !checkIsLandAdjacent(country.id, enemyCountryId) : false;

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
      BR: 'Brazil'
    };
    return names[cId] || cId;
  };

  const enemyBase = enemyCountryId ? getCountryMilitaryBaselines(enemyCountryId, scenario as ScenarioYear) : null;

  // Frontline War Sectors for the active enemy theater
  const [warSectors, setWarSectors] = useState<Record<string, WarSector[]>>({});
  const [draggedArmyId, setDraggedArmyId] = useState<string | null>(null);
  const [selectedFrontArmyId, setSelectedFrontArmyId] = useState<string | null>(null);

  // Initialize or get sectors for enemy country
  useEffect(() => {
    if (!enemyCountryId) return;
    if (warSectors[enemyCountryId]) return;

    const eName = getCountryName(enemyCountryId);
    const overseas = !checkIsLandAdjacent(country.id, enemyCountryId);

    let defaultSectors: WarSector[] = [];
    if (overseas) {
      defaultSectors = [
        { id: `sec_${enemyCountryId}_beach`, name: `${eName} Coastal Landing & Beachhead`, enemyStrength: 280, maxEnemyStrength: 280, entrenchment: 25, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Amphibious Bridgehead', icon: '🏖️', isBeachhead: true },
        { id: `sec_${enemyCountryId}_naval`, name: `${eName} Naval Port & Fleet Base`, enemyStrength: 340, maxEnemyStrength: 340, entrenchment: 35, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Supply & Logistics Hub', icon: '⚓' },
        { id: `sec_${enemyCountryId}_air`, name: `${eName} Forward Air Base & Radar`, enemyStrength: 310, maxEnemyStrength: 310, entrenchment: 30, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Air Superiority', icon: '✈️' },
        { id: `sec_${enemyCountryId}_cap`, name: `${eName} Capital & High Command HQ`, enemyStrength: 460, maxEnemyStrength: 460, entrenchment: 50, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'National Command Center', icon: '🏛️' }
      ];
    } else {
      defaultSectors = [
        { id: `sec_${enemyCountryId}_1`, name: `${eName} Frontier Fortifications & Checkpoints`, enemyStrength: 260, maxEnemyStrength: 260, entrenchment: 40, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Border Defense', icon: '🚩' },
        { id: `sec_${enemyCountryId}_2`, name: `${eName} Strategic Logistics & Supply Corridor`, enemyStrength: 320, maxEnemyStrength: 320, entrenchment: 30, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Logistics Hub', icon: '🛡️' },
        { id: `sec_${enemyCountryId}_3`, name: `${eName} Central Air Base & Defense Grid`, enemyStrength: 300, maxEnemyStrength: 300, entrenchment: 35, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'Air Superiority', icon: '✈️' },
        { id: `sec_${enemyCountryId}_4`, name: `${eName} Capital & High Command Citadel`, enemyStrength: 450, maxEnemyStrength: 450, entrenchment: 45, controlledBy: 'enemy', assignedArmyIds: [], strategicValue: 'National Command Center', icon: '🏛️' }
      ];
    }

    setWarSectors(prev => ({ ...prev, [enemyCountryId]: defaultSectors }));
  }, [enemyCountryId, warSectors, country.id]);

  // Province built facilities mapping (provinceId -> facility ids[])
  const [provinceFacilities, setProvinceFacilities] = useState<Record<string, string[]>>({});
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  // Player Armies state
  const [armies, setArmies] = useState<PlayerArmy[]>([
    { id: 'army_1', name: '1st Armored Corps', type: 'armored', regionId: country.regions[0]?.id || 'r1', hp: 280, maxHp: 280, attackPower: 80, status: 'idle' },
    { id: 'army_2', name: '2nd Infantry Division', type: 'infantry', regionId: country.regions[1]?.id || 'r2', hp: 180, maxHp: 180, attackPower: 50, status: 'idle' },
    { id: 'army_3', name: '3rd Special Operations Brigade', type: 'specops', regionId: country.regions[2]?.id || 'r3', hp: 200, maxHp: 200, attackPower: 65, status: 'idle' }
  ]);

  // Ordnance & Bomb Arsenal
  const [inventoryBombs, setInventoryBombs] = useState<Record<string, number>>({
    [scenario === '1950' ? 'b_napalm_1950' : scenario === '1936' ? 'b_sc250_1936' : scenario === '1920' ? 'b_cooper_1920' : scenario === '1914' ? 'b_putilov_1914' : 'b_jdam_2026']: 3,
    b_sdb_2026: 2
  });
  const [showOrdnanceFactory, setShowOrdnanceFactory] = useState<boolean>(false);

  const [battleLogs, setBattleLogs] = useState<string[]>([
    `🛡️ Strategic Command and National Defense Operations Center online. Build tactical facilities, construct silos, commission transport flotillas, and manage military theaters.`
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
      TR: [
        'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json',
        '/world_admin0_50m.geojson'
      ],
      DE: [
        'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json',
        '/world_admin0_50m.geojson'
      ],
      US: [
        'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
        '/world_admin0_50m.geojson'
      ],
      RU: ['/russia.geojson', '/world_admin0_50m.geojson'],
      UA: ['/ukraine.geojson', '/world_admin0_50m.geojson'],
      SE: ['/sweden.geojson', '/world_admin0_50m.geojson'],
      PT: ['/portugal.geojson', '/world_admin0_50m.geojson'],
      GR: ['/greece.geojson', '/world_admin0_50m.geojson'],
      IS: ['/iceland.geojson', '/world_admin0_50m.geojson'],
      CL: ['/chile.geojson', '/world_admin0_50m.geojson'],
      TW: ['/taiwan.geojson', '/world_admin0_50m.geojson'],
      SA: ['/saudi-arabia.geojson', '/world_admin0_50m.geojson'],
      IR: ['/iran.geojson', '/world_admin0_50m.geojson'],
      IL: ['/israel.geojson', '/world_admin0_50m.geojson'],
      PS: ['/palestine.geojson', '/world_admin0_50m.geojson'],
      EG: ['/egypt-provinces.geojson', '/world_admin0_50m.geojson'],
      BR: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson', '/world_admin0_50m.geojson'],
      JP: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson', '/world_admin0_50m.geojson'],
      GB: ['https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json', '/world_admin0_50m.geojson'],
      CA: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson', '/world_admin0_50m.geojson'],
      ZA: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-africa.geojson', '/world_admin0_50m.geojson'],
      IN: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/india.geojson', '/world_admin0_50m.geojson'],
      MX: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/mexico.geojson', '/world_admin0_50m.geojson'],
      ES: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-communities.geojson', '/world_admin0_50m.geojson'],
      AU: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson', '/world_admin0_50m.geojson'],
      IT: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/italy-regions.geojson', '/world_admin0_50m.geojson'],
      ID: ['https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia.geojson', '/world_admin0_50m.geojson'],
      KR: ['https://cdn.jsdelivr.net/gh/southkorea/southkorea-maps@master/kostat/2013/json/skorea_provinces_geo_simple.json', '/world_admin0_50m.geojson'],
      AR: ['https://raw.githubusercontent.com/Rodri1791/Regions_Argentina/main/Regiones_ArgentinasGJSON/provinciasargentina.geojson', '/world_admin0_50m.geojson'],
      FR: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/france-regions.geojson', '/world_admin0_50m.geojson'],
      RO: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/romania.geojson', '/world_admin0_50m.geojson'],
      HU: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/hungary.geojson', '/world_admin0_50m.geojson'],
      PL: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/poland.geojson', '/world_admin0_50m.geojson'],
      CN: ['https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/china.geojson', '/world_admin0_50m.geojson']
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

  // Initialize Home Leaflet Map
  useEffect(() => {
    if (activeTheater !== 'HOME') return;
    if (!mapContainerRef.current) return;
    cleanupMap();

    const map = L.map(mapContainerRef.current, {
      center: country.coordinates || [39.0, 35.0],
      zoom: country.zoom || 5,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

    const tiles = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 18,
      maxNativeZoom: 13,
      noWrap: true
    }).addTo(map);
    tileLayerRef.current = tiles;

    facilityMarkersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    setTimeout(() => {
      try { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); } catch(e) {}
    }, 200);

    return () => cleanupMap();
  }, [darkMode, country, activeTheater]);

  // Render GeoJSON on Home Map
  useEffect(() => {
    if (activeTheater !== 'HOME') return;
    if (!mapInstanceRef.current || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      try { mapInstanceRef.current.removeLayer(geoJsonLayerRef.current); } catch(e) {}
    }

    const centers: Record<string, { lat: number; lng: number }> = {};

    const geoLayer = L.geoJSON(geoJsonData, {
      style: (feature: any) => {
        const featureName = getFeatureName(feature);
        const norm = normalizeName(featureName);
        const regionId = getRegionIdFromNormalizedName(norm, country.id);
        const isSelected = selectedProvinceId === regionId;
        const hasNuke = provinceFacilities[regionId]?.includes('fac_nuclear');

        return {
          fillColor: isSelected ? '#3b82f6' : hasNuke ? '#eab308' : (darkMode ? '#1e293b' : '#334155'),
          fillOpacity: isSelected ? 0.85 : 0.65,
          color: isSelected ? '#60a5fa' : '#ffffff',
          weight: isSelected ? 2.5 : 1.2,
          opacity: 1
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const featureName = getFeatureName(feature);
        const norm = normalizeName(featureName);
        const regionId = getRegionIdFromNormalizedName(norm, country.id);

        try {
          const bounds = (layer as any).getBounds();
          if (bounds && bounds.isValid()) {
            const center = bounds.getCenter();
            centers[regionId] = { lat: center.lat, lng: center.lng };
          }
        } catch(e) {}

        layer.on('click', () => {
          setSelectedProvinceId(regionId);
          playSound('click');
        });

        const facilities = provinceFacilities[regionId] || [];
        const facilityIcons = facilities.map(fId => {
          const fac = STRATEGIC_FACILITIES.find(f => f.id === fId);
          return fac ? fac.icon : '';
        }).join(' ');

        layer.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 11px; font-weight: 700; color: #ffffff; padding: 3px 6px;">
            <div>🏢 ${featureName}</div>
            ${facilityIcons ? `<div style="margin-top: 2px; font-size: 13px;">${facilityIcons}</div>` : '<div style="font-size: 9px; color: #94a3b8;">Click: Build Facility / Recruit</div>'}
          </div>
        `, { sticky: true, className: 'leaflet-tactical-tooltip' });
      }
    }).addTo(mapInstanceRef.current);

    geoJsonLayerRef.current = geoLayer;
    regionCentersRef.current = centers;
    setCentersReady(true);

    try {
      mapInstanceRef.current.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
    } catch(e) {}
  }, [geoJsonData, country, selectedProvinceId, provinceFacilities, darkMode, activeTheater]);

  // Update Facility Pins
  useEffect(() => {
    if (activeTheater !== 'HOME') return;
    if (!mapInstanceRef.current || !facilityMarkersLayerRef.current) return;
    facilityMarkersLayerRef.current.clearLayers();

    Object.entries(provinceFacilities).forEach(([regId, rawFacIds]) => {
      const facIds = (rawFacIds as string[]) || [];
      if (!facIds || facIds.length === 0) return;
      const center = regionCentersRef.current[regId];
      if (!center) return;

      const iconsHtml = facIds.map(fId => {
        const fac = STRATEGIC_FACILITIES.find(f => f.id === fId);
        return fac ? `<span style="font-size: 15px; margin: 0 1px;">${fac.icon}</span>` : '';
      }).join('');

      const customIcon = L.divIcon({
        className: 'custom-facility-pin',
        html: `
          <div style="
            background: rgba(15, 23, 42, 0.88); 
            border: 1px solid #38bdf8; 
            border-radius: 9999px; 
            padding: 2px 6px; 
            display: flex; 
            align-items: center; 
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
            cursor: pointer;
            pointer-events: auto;
          ">
            ${iconsHtml}
          </div>
        `,
        iconSize: [40, 24],
        iconAnchor: [20, 12]
      });

      const marker = L.marker([center.lat, center.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedProvinceId(regId);
        playSound('click');
      });
      marker.addTo(facilityMarkersLayerRef.current!);
    });
  }, [provinceFacilities, centersReady, activeTheater]);

  // Handle Construction of Strategic Facility
  const handleConstructFacility = (facilityId: string) => {
    if (!selectedProvinceId) return;
    const fac = STRATEGIC_FACILITIES.find(f => f.id === facilityId);
    if (!fac) return;

    if (currentTreasury < fac.cost) {
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

    const ok = spendTreasury(fac.cost);
    if (!ok) return;

    // Apply bonuses
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
    const cost = 20000;
    if (currentTreasury < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Funds: Commissioning 5x Amphibious Transport Ships requires ${currency}20,000.`);
      return;
    }
    const ok = spendTreasury(cost);
    if (!ok) return;
    setNavalTransports(prev => prev + 5);
    playSound('success');
    addLog(`⚓ NAVAL LOGISTICS: 5x Amphibious Transport Ships added to sovereign sealift fleet!`);
  };

  // Recruit Army Division
  const handleRecruitArmy = (regionId: string, unitType: 'infantry' | 'armored' | 'specops' | 'artillery') => {
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

    if (currentTreasury < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Treasury: Deploying ${typeName} requires ${currency}${cost.toLocaleString()}.`);
      return;
    }

    const ok = spendTreasury(cost);
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
    addLog(`🪖 ${region.name}: New ${typeName} mobilized and ready for strategic deployment!`);
  };

  // Manufacture Historical Ordnance / Bomb
  const handleManufactureBomb = (bombId: string) => {
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    if (!bomb) return;
    if (currentTreasury < bomb.cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Budget: ${bomb.name} production requires ${currency}${bomb.cost.toLocaleString()}.`);
      return;
    }

    const ok = spendTreasury(bomb.cost);
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
    const army = armies.find(a => a.id === armyId);
    if (!army) return;

    if (army.status === 'embarked') {
      // Disembark
      setArmies(prev => prev.map(a => a.id === armyId ? { ...a, status: 'idle' } : a));
      addLog(`⚓ ${army.name} disembarked and stationed on mainland territory.`);
      playSound('click');
    } else {
      // Embark
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

  // Combat Assault / Action on Enemy Sector in active theater
  const handleAssaultSector = (sectorId: string, armyId?: string) => {
    if (!enemyCountryId) return;
    const currentSectors = warSectors[enemyCountryId] || [];
    const sectorIndex = currentSectors.findIndex(s => s.id === sectorId);
    if (sectorIndex === -1) return;

    const sector = currentSectors[sectorIndex];
    if (sector.controlledBy === 'player') {
      addLog(`ℹ️ ${sector.name} sector is already secured by allied forces.`);
      return;
    }

    // Select attacking army
    const attacker = armies.find(a => a.id === (armyId || selectedFrontArmyId)) || armies[0];
    if (!attacker) {
      playSound('error');
      addLog(`⚠️ No active combat division available to execute the assault.`);
      return;
    }

    // Check overseas transport requirement
    if (isEnemyOverseas && attacker.status !== 'embarked') {
      playSound('error');
      addLog(`⚠️ OVERSEAS THEATER RESTRICTION: ${getCountryName(enemyCountryId)} is overseas. You must EMBARK this division onto Naval Transports before launching an amphibious assault!`);
      return;
    }

    // If overseas and beachhead not captured yet, must attack beachhead first
    if (isEnemyOverseas && !sector.isBeachhead) {
      const beachSector = currentSectors.find(s => s.isBeachhead);
      if (beachSector && beachSector.controlledBy !== 'player') {
        playSound('error');
        addLog(`⚠️ AMPHIBIOUS DOCTRINE: You must capture and secure the Coastal Landing Beachhead before advancing deep inland!`);
        return;
      }
    }

    // Roll damage calculation
    const damageDealt = Math.round(attacker.attackPower * (0.85 + Math.random() * 0.45));
    const counterDamage = Math.round(20 * (1 + sector.entrenchment / 100));

    const newStrength = Math.max(0, sector.enemyStrength - damageDealt);
    const newEntrenchment = Math.max(0, sector.entrenchment - 15);
    const isCaptured = newStrength === 0;

    // Update Army HP
    setArmies(prev => prev.map(a => {
      if (a.id === attacker.id) {
        return { ...a, hp: Math.max(10, a.hp - counterDamage) };
      }
      return a;
    }));

    // Update Sector
    const updatedSectors = [...currentSectors];
    updatedSectors[sectorIndex] = {
      ...sector,
      enemyStrength: newStrength,
      entrenchment: newEntrenchment,
      controlledBy: isCaptured ? 'player' : 'contested',
      assignedArmyIds: Array.from(new Set([...sector.assignedArmyIds, attacker.id]))
    };

    setWarSectors(prev => ({ ...prev, [enemyCountryId]: updatedSectors }));
    playSound(isCaptured ? 'win' : 'explosion');

    if (isCaptured) {
      addLog(`🚩 SECTOR CAPTURED: ${attacker.name} broke enemy fortifications in ${sector.name}!`);
      
      // Check if all sectors captured
      const remainingEnemy = updatedSectors.filter(s => s.controlledBy !== 'player');
      if (remainingEnemy.length === 0) {
        // Victory in War!
        addLog(`🏆 TOTAL MILITARY TRIUMPH: ${getCountryName(enemyCountryId)} High Command capitulated and signed peace treaty!`);
        addTreasury(150000);
        
        if (onUpdateRelations) {
          onUpdateRelations({
            ...diplomaticRelations,
            [enemyCountryId]: { status: 'Victorious Peace / Treaty', opinion: 35, alliance: false }
          });
        }
        onBattleFinished(true);
      }
    } else {
      addLog(`⚔️ ENGAGEMENT: ${attacker.name} -> assaulted ${sector.name}! (${damageDealt} damage, Enemy Remaining HP: ${newStrength})`);
    }
  };

  // Deploy Historical Bomb / Ordnance Strike on Enemy Sector
  const handleDeployBombOnSector = (sectorId: string, bombId: string) => {
    if (!enemyCountryId) return;
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    if (!bomb || (inventoryBombs[bombId] || 0) <= 0) {
      playSound('error');
      addLog(`⚠️ Out of stock for ${bomb ? bomb.name : 'this munition'}.`);
      return;
    }

    const currentSectors = warSectors[enemyCountryId] || [];
    const sectorIndex = currentSectors.findIndex(s => s.id === sectorId);
    if (sectorIndex === -1) return;

    const sector = currentSectors[sectorIndex];
    const blastDamage = Math.round(bomb.damage * (1.1 + Math.random() * 0.3));
    const newStrength = Math.max(0, sector.enemyStrength - blastDamage);
    const isCaptured = newStrength === 0;

    // Deduct bomb
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

    setWarSectors(prev => ({ ...prev, [enemyCountryId]: updatedSectors }));
    playSound('explosion');
    addLog(`💥 STRATEGIC AIRSTRIKE: 1x ${bomb.icon} ${bomb.name} dropped on ${sector.name}! (${blastDamage} structural destruction)`);

    if (isCaptured) {
      addLog(`🚩 SECTOR DESTROYED: Enemy resistance in ${sector.name} collapsed!`);
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
    <div id="tactical-battle-view" className={`flex flex-col h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border shadow-2xl transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
    }`}>
      
      {/* 1. TOP MILITARY TELEMETRY HUD BAR */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">{country.name} Strategic Command & War Operations</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                activeWars.length > 0
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {activeWars.length > 0 ? `⚠️ ${activeWars.length} Active Fronts` : '🕊️ Armed Readiness & Peace'}
              </span>
            </div>
            <p className="text-xs text-slate-400">National Defense Doctrine, Strategic Arsenals, Sealift & Frontline Command</p>
          </div>
        </div>

        {/* HUD TELEMETRY METRIC CARDS */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {/* Active Personnel */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <Users className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Personnel</div>
              <div className="text-sm font-extrabold text-blue-400">{(totalActiveSoldiers ?? 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Tanks */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <Shield className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Main Battle Tanks</div>
              <div className="text-sm font-extrabold text-amber-400">{(totalTanks ?? 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Aircraft */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <Plane className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Combat Aircraft</div>
              <div className="text-sm font-extrabold text-cyan-400">{(totalAircraft ?? 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Warships */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <Anchor className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fleet Warships</div>
              <div className="text-sm font-extrabold text-indigo-400">{(totalWarships ?? 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Sealift Transports */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <Ship className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sealift Transports</div>
              <div className="text-sm font-extrabold text-emerald-400">{navalTransports} Ships</div>
            </div>
          </div>

          {/* Nukes */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-yellow-950/30 border-yellow-800/50' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <span className="text-base">☢️</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider">Nuclear Warheads</div>
              <div className="text-sm font-extrabold text-yellow-400">{(totalNukes ?? 0).toLocaleString()} ICBM</div>
            </div>
          </div>

          {/* Treasury */}
          <div className={`px-3 py-2 rounded-xl border flex items-center gap-2.5 ${
            darkMode ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">War Treasury</div>
              <div className="text-sm font-extrabold text-emerald-400">{currency}{(currentTreasury ?? 0).toLocaleString()}</div>
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

      {/* 2. THEATER SWITCHER TABS */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => {
            setActiveTheater('HOME');
            playSound('click');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
            activeTheater === 'HOME'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : darkMode ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>🏠 Homeland Defense & Base Construction ({country.name})</span>
        </button>

        {activeWars.map(cId => (
          <button
            key={cId}
            onClick={() => {
              setActiveTheater(cId);
              playSound('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTheater === cId
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20 animate-pulse'
                : darkMode ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/50' : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>⚔️ {getCountryName(cId)} Active Theater</span>
          </button>
        ))}

        {/* If user has no active wars declared yet */}
        {activeWars.length === 0 && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-[11px] text-slate-400">No active declared war. Engage strategic front:</span>
            {['BE', 'RU', 'UA', 'GR', 'FR', 'DE'].filter(c => c !== country.id).slice(0, 3).map(cId => (
              <button
                key={cId}
                onClick={() => {
                  if (onUpdateRelations) {
                    onUpdateRelations({
                      ...diplomaticRelations,
                      [cId]: { status: 'At War', opinion: 0, alliance: false }
                    });
                  }
                  setActiveTheater(cId);
                  addLog(`⚠️ WAR DECLARED / THEATER OPENED: Military engagement initiated with ${getCountryName(cId)}!`);
                  playSound('battle');
                }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
              >
                + {getCountryName(cId)} Front
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. MAIN WORKSPACE */}
      {activeTheater === 'HOME' ? (
        /* HOME DEFENSE & PROVINCE STRATEGIC CONSTRUCTION */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* LEAFLET TACTICAL GIS MAP */}
          <div className="flex-1 relative h-[50vh] lg:h-full bg-slate-900">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Overlay Badge */}
            <div className="absolute top-3 left-3 z-[400] bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 shadow-xl flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Homeland Tactical GIS: Select any province to commission Silos, Air Bases, Shipyards or Barracks</span>
            </div>

            {/* Bottom Live Operations Feed */}
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
                      No strategic facilities commissioned in this region yet. Choose from the catalog below.
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
                    const canAfford = currentTreasury >= fac.cost;

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
                            disabled={!canAfford || (isBuilt && fac.id !== 'fac_nuclear')}
                            onClick={() => handleConstructFacility(fac.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                              isBuilt && fac.id !== 'fac_nuclear'
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : canAfford
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
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
                      onClick={() => handleRecruitArmy(selectedProvince.id, 'infantry')}
                      className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-left text-xs transition-all cursor-pointer"
                    >
                      <div className="font-bold">🪖 Infantry Division</div>
                      <div className="text-[10px] text-emerald-400 font-extrabold">{currency}15,000</div>
                    </button>
                    <button
                      onClick={() => handleRecruitArmy(selectedProvince.id, 'armored')}
                      className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-left text-xs transition-all cursor-pointer"
                    >
                      <div className="font-bold">🛡️ Armored Brigade</div>
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
        /* ACTIVE ENEMY WAR FRONT: TACTICAL SECTOR BATTLE WITH DRAG-AND-DROP UNITS */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT: ENEMY WAR THEATER SECTORS */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            
            {/* Enemy Assessment Header */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl">
                  ⚔️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black uppercase text-rose-400">
                      {getCountryName(enemyCountryId!)} Offensive Theater
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      Active Belligerence
                    </span>
                    {isEnemyOverseas && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                        <Waves className="w-3 h-3" /> Overseas Theater • Naval Transport Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {isEnemyOverseas 
                      ? 'Target is overseas. Embark divisions into transport ships on the right, secure the Beachhead, then break inner fortified sectors.'
                      : 'Adjacent land border. Drag divisions from the right onto enemy sectors or issue direct assault commands.'}
                  </p>
                </div>
              </div>

              {/* Enemy Real Military Figures */}
              {enemyBase && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold">Enemy Troops</span>
                    <span className="font-black text-rose-400">{(enemyBase.soldiers ?? 50000).toLocaleString()}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold">Enemy Tanks</span>
                    <span className="font-black text-amber-400">{(enemyBase.tanks ?? 400).toLocaleString()}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold">Enemy Air Force</span>
                    <span className="font-black text-cyan-400">{(enemyBase.aircraft ?? 150).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTORS GRID (DRAG TARGETS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(warSectors[enemyCountryId!] || []).map(sector => {
                const isCaptured = sector.controlledBy === 'player';
                const healthPercent = Math.round((sector.enemyStrength / sector.maxEnemyStrength) * 100);

                return (
                  <div
                    key={sector.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSector(e, sector.id)}
                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isCaptured
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : darkMode 
                          ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50' 
                          : 'bg-white border-slate-200 hover:border-rose-400 shadow-sm'
                    }`}
                  >
                    {/* Top Sector Info */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{sector.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-sm">{sector.name}</h4>
                              {sector.isBeachhead && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  BEACHHEAD
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{sector.strategicValue}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isCaptured 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isCaptured ? '✓ SECURED' : 'ENEMY POSITION'}
                        </span>
                      </div>

                      {/* Health and Entrenchment Progress */}
                      {!isCaptured ? (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-400">Garrison Defense Strength:</span>
                            <span className="text-rose-400">{sector.enemyStrength} / {sector.maxEnemyStrength} HP</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 transition-all duration-300"
                              style={{ width: `${healthPercent}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                            <span>Fortification & Entrenchment:</span>
                            <span className="font-bold text-amber-400">%{sector.entrenchment}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sector neutralized and under allied control.</span>
                        </div>
                      )}
                    </div>

                    {/* Sector Actions (Assault & Bomb Drops) */}
                    {!isCaptured && (
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleAssaultSector(sector.id)}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 cursor-pointer"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>{sector.isBeachhead ? 'Launch Amphibious Landing' : 'Order Assault Strike'}</span>
                        </button>

                        {/* Quick Bomb Deployment Dropdown */}
                        {Object.entries(inventoryBombs).filter(([_, count]) => (Number(count) || 0) > 0).length > 0 && (
                          <div className="flex items-center gap-1">
                            {Object.entries(inventoryBombs).filter(([_, count]) => (Number(count) || 0) > 0).slice(0, 2).map(([bombId, count]) => {
                              const b = HISTORICAL_BOMBS.find(item => item.id === bombId);
                              if (!b) return null;
                              return (
                                <button
                                  key={bombId}
                                  onClick={() => handleDeployBombOnSector(sector.id, bombId)}
                                  title={`${b.name} (${count} in stockpile)`}
                                  className="px-2 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{b.icon}</span>
                                  <span className="text-[10px]">x{count}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Battle Event Ticker */}
            <div className={`p-3 rounded-2xl border max-h-36 overflow-y-auto ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="font-bold text-[11px] text-rose-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Tactical Battle Radio & Frontline Dispatch</span>
              </div>
              {battleLogs.map((log, idx) => (
                <div key={idx} className="text-[11px] py-0.5 border-b border-slate-800/40 last:border-none text-slate-300">
                  {log}
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: PLAYER FORCES & DRAGGABLE ARMIES & SEALIFT CONVOYS */}
          <div className={`w-full lg:w-96 border-l p-4 flex flex-col gap-4 overflow-y-auto ${
            darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="font-black text-sm">Deployed Combat Divisions</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{armies.length} Divisions</span>
            </div>

            {/* Sealift Transports Status Box */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold">Sealift Fleet Capacity</div>
                  <div className="text-[11px] text-slate-400">
                    {armies.filter(a => a.status === 'embarked').length} / {navalTransports} Divisions Embarked
                  </div>
                </div>
              </div>

              <button
                onClick={handleCommissionTransports}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
              >
                +5 Ships ({currency}20k)
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Select or drag divisions into enemy sectors to strike. If the theater is overseas, click <span className="text-cyan-400 font-bold">"Embark"</span> first.
            </p>

            <div className="space-y-3 flex-1">
              {armies.map(army => {
                const isSelected = selectedFrontArmyId === army.id;
                const hpPercent = Math.round((army.hp / army.maxHp) * 100);
                const isEmbarked = army.status === 'embarked';

                return (
                  <div
                    key={army.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, army.id)}
                    onClick={() => {
                      setSelectedFrontArmyId(army.id);
                      playSound('click');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                        : darkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {army.type === 'armored' ? '🛡️' : army.type === 'specops' ? '⚡' : army.type === 'artillery' ? '🎯' : '🪖'}
                        </span>
                        <div>
                          <div className="font-bold text-xs">{army.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                            <span>{army.type}</span>
                            {isEmbarked && <span className="text-cyan-400 font-bold">• 🚢 Embarked</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-amber-400">⚔️ {army.attackPower} ATK</div>
                        <div className="text-[10px] text-slate-400">{army.hp}/{army.maxHp} HP</div>
                      </div>
                    </div>

                    <div className="mt-2.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${hpPercent > 50 ? 'bg-blue-500' : 'bg-rose-500'}`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>

                    {/* Embark / Disembark Toggle */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleEmbark(army.id);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                          isEmbarked
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Ship className="w-3 h-3" />
                        <span>{isEmbarked ? 'Disembark' : 'Embark on Ship'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetSec = (warSectors[enemyCountryId!] || []).find(s => s.controlledBy !== 'player');
                          if (targetSec) handleAssaultSector(targetSec.id, army.id);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                      >
                        Quick Assault
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Armistice & Peace Terms */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  if (onUpdateRelations && enemyCountryId) {
                    onUpdateRelations({
                      ...diplomaticRelations,
                      [enemyCountryId]: { status: 'Armistice / Truce', opinion: 20, alliance: false }
                    });
                  }
                  setActiveTheater('HOME');
                  playSound('success');
                  addLog(`🤝 ARMISTICE RATIFIED: Hostilities halted with ${getCountryName(enemyCountryId!)}.`);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🤝 Sign Ceasefire / Armistice</span>
              </button>

              <button
                onClick={() => {
                  const currentSectors = warSectors[enemyCountryId!] || [];
                  const capturedCount = currentSectors.filter(s => s.controlledBy === 'player').length;
                  if (capturedCount < 2) {
                    playSound('error');
                    addLog(`⚠️ You must capture at least 2 sectors before demanding reparations.`);
                    return;
                  }
                  if (onUpdateRelations && enemyCountryId) {
                    onUpdateRelations({
                      ...diplomaticRelations,
                      [enemyCountryId]: { status: 'Reparations Treaty', opinion: 15, alliance: false }
                    });
                  }
                  addTreasury(85000);
                  setActiveTheater('HOME');
                  playSound('win');
                  addLog(`⚖️ REPARATIONS ENFORCED: ${getCountryName(enemyCountryId!)} ceded military facilities and paid ${currency}85,000 indemnities.`);
                }}
                className="w-full py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚖️ Enforce Demilitarization & Reparations</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 4. ORDNANCE & BOMB FACTORY MODAL */}
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
                const canAfford = currentTreasury >= bomb.cost;

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
                        disabled={!canAfford}
                        onClick={() => handleManufactureBomb(bomb.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
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
