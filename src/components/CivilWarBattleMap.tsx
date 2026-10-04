/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { Country, Party, ScenarioYear, ConflictSide } from '../types';
import { loadCountryMapData, getFeatureRegionName, COUNTRY_MAP_REGISTRY } from '../data/mapRegistry';
import { INITIAL_CIVIL_WARS, getConflictSides, areFactionsAllied, areFactionsHostile } from '../constants/civilWarData';
import { playSound } from '../lib/sounds';
import { 
  Shield, Swords, AlertTriangle, Ship, ChevronRight, RotateCcw, 
  Target, Users, Zap, CheckCircle2, XCircle, Trophy, Flag, Crosshair,
  Plus, X, Handshake, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { CivilWarPeaceModal, PeaceAgreement } from './CivilWarPeaceModal';
import { PeaceTerritorialSettlementModal } from './PeaceTerritorialSettlementModal';

export type DivisionType = 'infantry' | 'armor' | 'mechanized' | 'artillery';

export interface CivilWarDivision {
  id: string;
  name: string;
  type: DivisionType;
  strength: number;
  maxStrength: number;
  morale: number; // 0-100
  supply: number; // 0-100
  ownerFaction: string;
  regionName: string;
  hasActedThisTurn?: boolean;
  isExpeditionary?: boolean;
  supporterCountryId?: string;
  supporterCountryName?: string;
  supporterFlag?: string;
  equipmentName?: string;
  assignedFrontId?: string;
}

export interface ActiveFront {
  id: string;
  name: string;
  hostileFactionId: string;
  hostileFactionName: string;
  hostileFactionColor: string;
  friendlyBorderRegions: string[];
  hostileBorderRegions: string[];
  borderPairs: Array<{ friendly: string; hostile: string }>;
  assignedDivisionIds: string[];
  stance: 'HOLD' | 'ADVANCE';
}

export interface FactionData {
  id: string;
  name: string;
  color: string;
  controlledRegions: string[];
  isGovernment?: boolean;
}

export interface FactionStats {
  divisionsRemaining: number;
  totalManpower: number;
  lossesThisTurn: number;
  cumulativeLosses: number;
  regionsHeld: number;
}

interface DragState {
  divisionId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  originRegionName: string;
}

interface BattleEvent {
  turn: number;
  attackerDivisionName: string;
  attackerFaction: string;
  defenderFaction: string;
  targetRegionName: string;
  attackerLosses: number;
  defenderLosses: number;
  won: boolean;
  timestamp: string;
}

interface CivilWarBattleMapProps {
  country: Country;
  playerParty?: Party;
  scenario?: ScenarioYear | string;
  darkMode?: boolean;
  isRuling?: boolean;
  foreignAidPackages?: Record<string, any>;
  onTerritoryChange?: (updatedRegions: { name: string; controlledBy: string }[], playerPercent: number) => void;
  onVictory?: (winnerFactionId: string) => void;
  onTurnAdvance?: () => void;
}

// Resilient name normalization for GeoJSON matching
export const normalizeGeoName = (s: string): string => {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

export interface ForeignSupporterConfig {
  countryId: string;
  countryName: string;
  flag: string;
  defaultEquipment: string;
  type: DivisionType;
  equipmentVariants: Array<{ name: string; type: DivisionType; strength: number }>;
}

export const FOREIGN_SUPPORTER_REGISTRY: Record<string, ForeignSupporterConfig> = {
  CN: {
    countryId: 'CN',
    countryName: 'China',
    flag: '🇨🇳',
    defaultEquipment: 'Type 99A Main Battle Tank',
    type: 'armor',
    equipmentVariants: [
      { name: 'Type 99A Main Battle Tank', type: 'armor', strength: 5500 },
      { name: 'Type 04A Tracked IFV', type: 'mechanized', strength: 5000 },
      { name: 'PLZ-05 155mm Howitzer', type: 'artillery', strength: 4500 }
    ]
  },
  RU: {
    countryId: 'RU',
    countryName: 'Russia',
    flag: '🇷🇺',
    defaultEquipment: 'T-90M Proryv Heavy Armor',
    type: 'armor',
    equipmentVariants: [
      { name: 'T-90M Proryv Heavy Armor', type: 'armor', strength: 5500 },
      { name: 'BMP-3M Infantry Fighting Vehicle', type: 'mechanized', strength: 5000 },
      { name: '2S19 Msta-S Self-Propelled Artillery', type: 'artillery', strength: 4500 }
    ]
  },
  US: {
    countryId: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    defaultEquipment: 'M1A2 SEPv3 Abrams Tank',
    type: 'armor',
    equipmentVariants: [
      { name: 'M1A2 SEPv3 Abrams Tank', type: 'armor', strength: 6000 },
      { name: 'M2A3 Bradley Mechanized IFV', type: 'mechanized', strength: 5200 },
      { name: 'M109A7 Paladin Heavy Artillery', type: 'artillery', strength: 4800 }
    ]
  },
  TR: {
    countryId: 'TR',
    countryName: 'Turkey',
    flag: '🇹🇷',
    defaultEquipment: 'Altay Main Battle Tank',
    type: 'armor',
    equipmentVariants: [
      { name: 'Altay Main Battle Tank', type: 'armor', strength: 5500 },
      { name: 'FNSS ACV-15 Mechanized APC', type: 'mechanized', strength: 5000 },
      { name: 'T-155 Fırtına Heavy Howitzer', type: 'artillery', strength: 4500 }
    ]
  },
  SA: {
    countryId: 'SA',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    defaultEquipment: 'M1A2S Heavy Armor',
    type: 'armor',
    equipmentVariants: [
      { name: 'M1A2S Heavy Armor', type: 'armor', strength: 5500 },
      { name: 'LAV-700 8x8 Combat IFV', type: 'mechanized', strength: 5000 },
      { name: 'CAESAR 155mm Artillery', type: 'artillery', strength: 4500 }
    ]
  },
  AE: {
    countryId: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    defaultEquipment: 'Leclerc Tropicalized MBT',
    type: 'armor',
    equipmentVariants: [
      { name: 'Leclerc Tropicalized MBT', type: 'armor', strength: 5500 },
      { name: 'Rabdan 8x8 Mechanized IFV', type: 'mechanized', strength: 5000 },
      { name: 'G6-52 155mm Howitzer', type: 'artillery', strength: 4500 }
    ]
  },
  IR: {
    countryId: 'IR',
    countryName: 'Iran',
    flag: '🇮🇷',
    defaultEquipment: 'Karrar Advanced Battle Tank',
    type: 'armor',
    equipmentVariants: [
      { name: 'Karrar Advanced Battle Tank', type: 'armor', strength: 5200 },
      { name: 'Boragh Mechanized IFV', type: 'mechanized', strength: 4800 },
      { name: 'Raad-2 155mm Artillery', type: 'artillery', strength: 4500 }
    ]
  },
  EG: {
    countryId: 'EG',
    countryName: 'Egypt',
    flag: '🇪🇬',
    defaultEquipment: 'M1A1 Abrams MBT',
    type: 'armor',
    equipmentVariants: [
      { name: 'M1A1 Abrams MBT', type: 'armor', strength: 5200 },
      { name: 'YPR-765 Armored IFV', type: 'mechanized', strength: 4800 },
      { name: 'SPH 122mm Artillery Regiment', type: 'artillery', strength: 4500 }
    ]
  }
};

export const resolveForeignSupporter = (
  backerString?: string,
  foreignAidPackages?: Record<string, any>
): ForeignSupporterConfig | null => {
  if (foreignAidPackages) {
    for (const [key, pkg] of Object.entries(foreignAidPackages)) {
      if (pkg && pkg.status === 'ACCEPTED') {
        const idUpper = (pkg.id || key).toUpperCase();
        if (FOREIGN_SUPPORTER_REGISTRY[idUpper]) return FOREIGN_SUPPORTER_REGISTRY[idUpper];
        const nameUpper = (pkg.countryName || '').toUpperCase();
        for (const [sKey, cfg] of Object.entries(FOREIGN_SUPPORTER_REGISTRY)) {
          if (nameUpper.includes(cfg.countryName.toUpperCase()) || nameUpper.includes(sKey)) {
            return cfg;
          }
        }
      }
    }
  }

  if (!backerString) return null;
  const b = backerString.toUpperCase();
  if (b.includes('CHINA') || b.includes('PLA') || b.includes('BEIJING')) return FOREIGN_SUPPORTER_REGISTRY.CN;
  if (b.includes('RUSSIA') || b.includes('MOSCOW') || b.includes('AFRICA CORPS') || b.includes('CSTO')) return FOREIGN_SUPPORTER_REGISTRY.RU;
  if (b.includes('UNITED STATES') || b.includes('USA') || b.includes('CJTF') || b.includes('AFRICOM') || b.includes('NATO')) return FOREIGN_SUPPORTER_REGISTRY.US;
  if (b.includes('TURKEY') || b.includes('ANKARA') || b.includes('TURKISH')) return FOREIGN_SUPPORTER_REGISTRY.TR;
  if (b.includes('SAUDI') || b.includes('RIYADH') || b.includes('GCC')) return FOREIGN_SUPPORTER_REGISTRY.SA;
  if (b.includes('UAE') || b.includes('EMIRATES') || b.includes('ABU DHABI')) return FOREIGN_SUPPORTER_REGISTRY.AE;
  if (b.includes('IRAN') || b.includes('TEHRAN') || b.includes('AXIS OF RESISTANCE')) return FOREIGN_SUPPORTER_REGISTRY.IR;
  if (b.includes('EGYPT') || b.includes('CAIRO')) return FOREIGN_SUPPORTER_REGISTRY.EG;
  return null;
};

export const getFactionShortName = (factionId: string, factionName: string): string => {
  if (factionId.includes('_')) {
    return factionId.split('_').pop() || factionId.slice(0, 3);
  }
  const match = factionName.match(/\(([^/)]+)/);
  if (match) return match[1].trim().slice(0, 3);
  return factionName.slice(0, 3);
};

interface DivisionCounterProps {
  division: CivilWarDivision;
  posX: number;
  posY: number;
  isSelected: boolean;
  isShaking: boolean;
  isPlayer: boolean;
  isAllied: boolean;
  coalitionColor: string;
  factionColor: string;
  factionShortName: string;
  hasActedThisTurn: boolean;
  onPointerDown: (e: React.PointerEvent, div: CivilWarDivision) => void;
  onClick: (e: React.MouseEvent, div: CivilWarDivision) => void;
}

export const DivisionCounter = React.memo<DivisionCounterProps>(({
  division,
  posX,
  posY,
  isSelected,
  isShaking,
  isPlayer,
  isAllied,
  coalitionColor,
  factionColor,
  factionShortName,
  hasActedThisTurn,
  onPointerDown,
  onClick
}) => {
  const counterWidth = 46;
  const counterHeight = 28;

  return (
    <g
      transform={`translate(${posX - counterWidth / 2}, ${posY - counterHeight / 2})`}
      className={`cursor-pointer transition-transform ${isShaking ? 'animate-pulse' : ''}`}
      onPointerDown={(e) => onPointerDown(e, division)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => onClick(e, division)}
    >
      {/* Outer Box */}
      <rect
        width={counterWidth}
        height={counterHeight}
        rx={3}
        fill="#0f172a"
        stroke={isSelected ? '#fbbf24' : isPlayer ? '#38bdf8' : isAllied ? coalitionColor : '#64748b'}
        strokeWidth={isSelected ? 2.5 : isPlayer || isAllied ? 2 : 1}
        opacity={isPlayer || isAllied ? 1 : 0.85}
        filter={isPlayer ? 'url(#player-glow)' : undefined}
      />

      {/* Coalition Header Strip (Allied units appear in coalition color) */}
      <rect
        x={0}
        y={0}
        width={counterWidth}
        height={7}
        rx={2}
        fill={coalitionColor}
      />

      {/* Small Faction Marker of their own (Corner Badge) */}
      <g transform="translate(1.5, 1.2)">
        <rect
          width={13}
          height={5}
          rx={1}
          fill={factionColor}
        />
        <text
          x={6.5}
          y={4}
          textAnchor="middle"
          className="text-[4.5px] font-black fill-white pointer-events-none select-none uppercase"
        >
          {factionShortName.slice(0, 3)}
        </text>
      </g>

      {/* Foreign Supporter Flag if Expeditionary Battalion */}
      {division.isExpeditionary && division.supporterFlag ? (
        <text
          x={counterWidth - 8}
          y={6}
          textAnchor="middle"
          className="text-[7px] pointer-events-none select-none"
        >
          {division.supporterFlag}
        </text>
      ) : (
        /* NATO Echelon 'XX' (Division) */
        <text
          x={counterWidth / 2 + 6}
          y={6}
          textAnchor="middle"
          className="text-[7.5px] font-black fill-white pointer-events-none select-none"
        >
          XX
        </text>
      )}

      {/* Standard NATO Symbol */}
      <g 
        transform={`translate(${counterWidth / 2}, ${counterHeight / 2 + 1})`}
        stroke={isPlayer || isAllied ? '#f8fafc' : '#94a3b8'}
        fill="none"
        className="pointer-events-none select-none"
      >
        {division.type === 'infantry' && (
          <>
            <line x1={-12} y1={-5} x2={12} y2={5} strokeWidth={1.8} />
            <line x1={-12} y1={5} x2={12} y2={-5} strokeWidth={1.8} />
          </>
        )}
        {division.type === 'armor' && (
          <rect x={-12} y={-5} width={24} height={10} rx={5} strokeWidth={1.8} />
        )}
        {division.type === 'mechanized' && (
          <>
            <rect x={-13} y={-5.5} width={26} height={11} rx={5.5} strokeWidth={1.5} />
            <line x1={-10} y1={-4} x2={10} y2={4} strokeWidth={1.2} />
            <line x1={-10} y1={4} x2={10} y2={-4} strokeWidth={1.2} />
          </>
        )}
        {division.type === 'artillery' && (
          <circle cx={0} cy={0} r={3.8} fill={isPlayer || isAllied ? '#f8fafc' : '#94a3b8'} />
        )}
      </g>

      {/* Mini Health Bar */}
      <rect
        x={3}
        y={counterHeight - 4}
        width={counterWidth - 6}
        height={2}
        rx={1}
        fill="#334155"
      />
      <rect
        x={3}
        y={counterHeight - 4}
        width={Math.max(2, ((counterWidth - 6) * division.strength) / division.maxStrength)}
        height={2}
        rx={1}
        fill={
          division.strength / division.maxStrength > 0.6
            ? '#22c55e'
            : division.strength / division.maxStrength > 0.3
            ? '#f59e0b'
            : '#ef4444'
        }
      />

      {/* Action Indicator */}
      {hasActedThisTurn && (
        <circle
          cx={counterWidth - 4}
          cy={counterHeight - 4}
          r={2}
          fill="#94a3b8"
        />
      )}
    </g>
  );
});

export const CivilWarBattleMap: React.FC<CivilWarBattleMapProps> = ({
  country,
  playerParty,
  scenario = '2026',
  darkMode = true,
  isRuling = false,
  foreignAidPackages,
  onTerritoryChange,
  onVictory,
  onTurnAdvance
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 900, height: 600 });
  const [geoData, setGeoData] = useState<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Zoom & Pan state (clamped to [0.5, 8], reset to 1 on country change)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resolve ISO3 for country
  const ISO2_TO_ISO3: Record<string, string> = useMemo(() => ({
    CD: 'COD',
    CG: 'COG',
    LY: 'LBY',
    SY: 'SYR',
    YE: 'YEM',
    SD: 'SDN',
    MM: 'MMR',
    US: 'USA',
    UA: 'UKR',
    RU: 'RUS',
    TR: 'TUR',
    GB: 'GBR',
    FR: 'FRA',
    DE: 'DEU'
  }), []);

  const iso3 = useMemo(() => {
    const parentId = country.parentCountryId || (country.id.includes('_') ? country.id.split('_')[0] : null);
    const resolvedIso = 
      COUNTRY_MAP_REGISTRY[country.id]?.iso3 || 
      ISO2_TO_ISO3[country.id] || 
      (parentId ? (COUNTRY_MAP_REGISTRY[parentId]?.iso3 || ISO2_TO_ISO3[parentId]) : null) ||
      (country.id.length === 3 ? country.id : '');
    return (resolvedIso || country.id).toUpperCase();
  }, [country.id, country.parentCountryId, ISO2_TO_ISO3]);

  // Requirement 6: Reset zoom & pan to fitted value whenever country (ISO3) changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [iso3]);

  // Turn management
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // Factions and Divisions
  const [factions, setFactions] = useState<FactionData[]>([]);
  const [divisions, setDivisions] = useState<CivilWarDivision[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<string[]>([]);
  const [isBoxSelectMode, setIsBoxSelectMode] = useState<boolean>(false);
  const [boxSelection, setBoxSelection] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [hoveredRegionName, setHoveredRegionName] = useState<string | null>(null);

  // Mobilize Division Modal & Batch Quantity
  const [showMobilizeModal, setShowMobilizeModal] = useState<boolean>(false);
  const [mobilizeRegion, setMobilizeRegion] = useState<string>('');
  const [mobilizeType, setMobilizeType] = useState<'infantry' | 'mechanized' | 'armor' | 'artillery'>('armor');
  const [mobilizeQuantity, setMobilizeQuantity] = useState<number>(1);

  // Check international recognition & foreign aid status
  const acceptedPackages = useMemo(() => {
    if (!foreignAidPackages) return [];
    return Object.values(foreignAidPackages).filter((p: any) => p && p.status === 'ACCEPTED');
  }, [foreignAidPackages]);

  const hasSovereignSupport = isRuling || acceptedPackages.length > 0;

  // Missile Strikes System (Restricted under arms embargo if unrecognized)
  const [missileStockpile, setMissileStockpile] = useState<number>(hasSovereignSupport ? 10 : 2);
  const [missileStrikesLeft, setMissileStrikesLeft] = useState<number>(3);
  const [isMissileTargeting, setIsMissileTargeting] = useState<boolean>(false);
  const [missileImpacts, setMissileImpacts] = useState<Array<{ id: string; x: number; y: number; casualties: number; regionName: string; timestamp: number }>>([]);

  // Victory Conditions State
  const [hasWonWar, setHasWonWar] = useState<boolean>(false);
  const [winnerFactionName, setWinnerFactionName] = useState<string>('');
  const [showTerritorialSettlementModal, setShowTerritorialSettlementModal] = useState<boolean>(false);
  const [settlementWinnerFactionId, setSettlementWinnerFactionId] = useState<string>('');
  const [peaceSignatoryFactionIds, setPeaceSignatoryFactionIds] = useState<string[]>([]);

  // Allied & UN Support State (Subject to international recognition & UN arms embargo)
  const [turnAidReceived, setTurnAidReceived] = useState<{ cash: number; supplies: number; recruits: number; missiles?: number; turn?: number } | null>(
    hasSovereignSupport
      ? { cash: 25000000, supplies: 15, recruits: 2500 }
      : { cash: 1500000, supplies: 5, recruits: 400 }
  );
  const [showForeignAidModal, setShowForeignAidModal] = useState<boolean>(false);
  const [showPeaceModal, setShowPeaceModal] = useState<boolean>(false);
  const [foreignAidHistory, setForeignAidHistory] = useState<Array<{ turn: number; description: string; type: string }>>(
    hasSovereignSupport
      ? [{ turn: 1, description: 'UN peacekeepers & allied logistics delivered precision missiles, field supplies, and naval transport ships', type: 'Strategic Transport' }]
      : [{ turn: 1, description: 'UN Arms Embargo in effect: Precision weapons withheld. Only basic contraband and local volunteers available.', type: 'Restricted (Embargo)' }]
  );
  const [foreignAidLog, setForeignAidLog] = useState<Array<{ factionId: string; factionName: string; backer: string; summary: string }>>([]);

  // Naval transport ships
  const [navalTransports, setNavalTransports] = useState<number>(5);

  // Casualties tracking per faction
  const [casualtyStats, setCasualtyStats] = useState<Record<string, FactionStats>>({});
  const [recentBattleEvents, setRecentBattleEvents] = useState<BattleEvent[]>([]);

  // Drag-and-drop state
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [shakingDivisionId, setShakingDivisionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);

  // Front Stances ('HOLD' | 'ADVANCE')
  const [frontStances, setFrontStances] = useState<Record<string, 'HOLD' | 'ADVANCE'>>({});

  // Performance RAF throttling refs
  const pendingPointerRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const rafMoveIdRef = useRef<number | null>(null);

  // Prevent browser context menu globally within battle view
  useEffect(() => {
    const blockMenu = (e: MouseEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('contextmenu', blockMenu, { capture: true });
    return () => {
      window.removeEventListener('contextmenu', blockMenu, { capture: true });
      if (rafMoveIdRef.current !== null) {
        cancelAnimationFrame(rafMoveIdRef.current);
      }
    };
  }, []);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Identify player's faction
  const playerFactionId = useMemo(() => {
    if (playerParty && playerParty.id) {
      const match = factions.find(f => f.id === playerParty.id);
      if (match) return match.id;

      const pNorm = playerParty.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const aliasMatch = factions.find(f => {
        const fNorm = f.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return fNorm === pNorm || fNorm.includes(pNorm) || pNorm.includes(fNorm);
      });
      if (aliasMatch) return aliasMatch.id;

      const nameMatch = factions.find(f => 
        f.name.toLowerCase().includes(playerParty.name.toLowerCase()) ||
        playerParty.name.toLowerCase().includes(f.name.toLowerCase())
      );
      if (nameMatch) return nameMatch.id;
    }
    const gov = factions.find(f => f.isGovernment);
    return gov ? gov.id : (factions[0]?.id || 'LY_GNU');
  }, [factions, playerParty]);

  // Structured War Sides & Alliances (Side A vs Side B)
  const conflictSides: ConflictSide[] = useMemo(() => {
    return getConflictSides(country.id);
  }, [country.id]);

  // Player Coalition (Side A)
  const playerCoalition = useMemo(() => {
    return conflictSides.find(s => s.members.includes(playerFactionId)) || {
      id: 'SIDE_' + playerFactionId,
      name: factions.find(f => f.id === playerFactionId)?.name || 'Coalition',
      leader: playerFactionId,
      members: [playerFactionId],
      color: factions.find(f => f.id === playerFactionId)?.color || '#2563eb'
    };
  }, [conflictSides, playerFactionId, factions]);

  const areAllied = useCallback((facA: string, facB: string): boolean => {
    return areFactionsAllied(facA, facB, conflictSides);
  }, [conflictSides]);

  const areHostile = useCallback((facA: string, facB: string): boolean => {
    // If either faction signed a separate peace with player/coalition, hostilities cease between them (Requirement 1)
    const facAInCoalition = playerCoalition.members.includes(facA);
    const facBInCoalition = playerCoalition.members.includes(facB);
    if ((facAInCoalition && peaceSignatoryFactionIds.includes(facB)) || (facBInCoalition && peaceSignatoryFactionIds.includes(facA))) {
      return false;
    }
    return areFactionsHostile(facA, facB, conflictSides);
  }, [conflictSides, playerCoalition, peaceSignatoryFactionIds]);

  // Territorial Hegemony Percent for Player Faction
  const playerTerritoryPercent = useMemo(() => {
    if (!factions || factions.length === 0) return 0;
    const playerFac = factions.find(f => f.id === playerFactionId);
    if (!playerFac) return 0;
    const totalRegions = factions.reduce((sum, f) => sum + f.controlledRegions.length, 0);
    if (totalRegions === 0) return 0;
    return Math.round((playerFac.controlledRegions.length / totalRegions) * 100);
  }, [factions, playerFactionId]);

  // Coalition Territorial Hegemony Percent (Allied regions count toward coalition victory)
  const coalitionTerritoryPercent = useMemo(() => {
    if (!factions || factions.length === 0) return 0;
    const totalRegions = factions.reduce((sum, f) => sum + f.controlledRegions.length, 0);
    if (totalRegions === 0) return 0;
    const coalitionRegionsCount = factions
      .filter(f => playerCoalition.members.includes(f.id))
      .reduce((sum, f) => sum + f.controlledRegions.length, 0);
    return Math.round((coalitionRegionsCount / totalRegions) * 100);
  }, [factions, playerCoalition]);

  // Active foreign expeditionary battalions
  const expeditionaryDivisions = useMemo(() => {
    return divisions.filter(d => d.isExpeditionary && d.strength > 0);
  }, [divisions]);

  // Foreign expeditionary battalions leave if support ends (Requirement 2)
  useEffect(() => {
    if (!foreignAidPackages && !INITIAL_CIVIL_WARS[country.id]) return;
    const conflictDef = INITIAL_CIVIL_WARS[country.id];
    const factionBacker = conflictDef?.factions.find(f => f.id === playerFactionId)?.foreignBacker;

    setDivisions(prev => {
      let withdrawnCount = 0;
      let withdrawnName = '';

      const remaining = prev.filter(d => {
        if (!d.isExpeditionary || !d.supporterCountryId) return true;
        const supporterId = d.supporterCountryId;
        const pkg: any = foreignAidPackages ? Object.values(foreignAidPackages).find((p: any) => p && (p.id === supporterId || p.countryId === supporterId)) : null;
        const isBackerMatch = factionBacker && factionBacker.toUpperCase().includes(d.supporterCountryName?.toUpperCase() || supporterId);
        const isPackageActive = pkg && pkg.status === 'ACCEPTED';
        const isStillSupported = isPackageActive || (isBackerMatch && (!pkg || pkg.status !== 'REJECTED'));

        if (!isStillSupported) {
          withdrawnCount++;
          withdrawnName = d.supporterCountryName || supporterId;
          return false;
        }
        return true;
      });

      if (withdrawnCount > 0) {
        setToastMessage({
          text: `⚠️ Diplomatic Shift: ${withdrawnName} expeditionary forces have withdrawn due to terminated diplomatic support.`,
          type: 'info'
        });
        return remaining;
      }
      return prev;
    });
  }, [foreignAidPackages, country.id, playerFactionId]);

  // Helper: Find GeoJSON feature by name
  const findFeatureByName = useCallback((name: string) => {
    if (!geoData || !geoData.features) return null;
    const norm = normalizeGeoName(name);
    return geoData.features.find((f: any) => {
      const raw = f.properties?.NAME_1 || f.properties?.name || '';
      return normalizeGeoName(raw) === norm;
    }) || null;
  }, [geoData]);

  // Helper: Find which faction controls a region
  const getRegionController = useCallback((regionName: string): FactionData | null => {
    const norm = normalizeGeoName(regionName);
    for (const f of factions) {
      if (f.controlledRegions.some(cr => normalizeGeoName(cr) === norm)) {
        return f;
      }
    }
    return null;
  }, [factions]);

  // Stable ref for onTerritoryChange to avoid re-render loops
  const onTerritoryChangeRef = useRef(onTerritoryChange);
  useEffect(() => {
    onTerritoryChangeRef.current = onTerritoryChange;
  });

  // Track the last synced state to eliminate redundant notifications
  const lastSyncHashRef = useRef<string>('');

  // Sync with parent App only when territory actually changes
  useEffect(() => {
    if (!onTerritoryChangeRef.current || factions.length === 0) return;

    const currentHash = `${coalitionTerritoryPercent}_` + factions.map(f => `${f.id}:${[...f.controlledRegions].sort().join(',')}`).join('|');
    if (lastSyncHashRef.current === currentHash) return;

    lastSyncHashRef.current = currentHash;
    const allRegions = factions.flatMap(f => f.controlledRegions.map(r => ({ name: r, controlledBy: f.id })));
    onTerritoryChangeRef.current(allRegions, coalitionTerritoryPercent);
  }, [factions, coalitionTerritoryPercent]);

  // 1. Observe Map Container Dimensions for Responsive Projection
  useEffect(() => {
    const el = mapContainerRef.current || containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 50 && rect.height > 50) {
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height)
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, mapError]);

  // 2. Load GeoJSON for Civil-War Country: ONLY public/geo/{iso3}.geojson
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setMapError(null);

    async function loadGeoJson() {
      try {
        let json: any = null;

        // Load ONLY public/geo/{iso3}.geojson
        try {
          const res = await fetch(`/geo/${iso3}.geojson`);
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) {
              json = await res.json();
            }
          }
        } catch (e) {
          // ignore
        }

        // Fallback to lowercase if filesystem is case-sensitive
        if (!json || !json.features) {
          try {
            const resLower = await fetch(`/geo/${iso3.toLowerCase()}.geojson`);
            if (resLower.ok) {
              const contentType = resLower.headers.get('content-type') || '';
              if (!contentType.includes('text/html')) {
                json = await resLower.json();
              }
            }
          } catch (e) {
            // ignore
          }
        }

        if (isCancelled) return;

        // Guard: feature count < 2
        if (!json || !Array.isArray(json.features) || json.features.length < 2) {
          console.warn(`Invalid GeoJSON extent for ${iso3}`);
          setMapError(`Map data unavailable — geo/${iso3}.geojson missing`);
          setIsLoading(false);
          return;
        }

        setGeoData(json);
        setIsLoading(false);
      } catch (err) {
        if (isCancelled) return;
        console.warn(`Invalid GeoJSON extent for ${iso3}`);
        setMapError(`Map data unavailable — geo/${iso3}.geojson missing`);
        setIsLoading(false);
      }
    }

    loadGeoJson();

    return () => {
      isCancelled = true;
    };
  }, [iso3]);

  // 3. Precompute Adjacency Map from Shared GeoJSON Coordinates
  const adjacencyMap = useMemo<Record<string, string[]>>(() => {
    if (!geoData || !geoData.features) return {};
    const coordMap: Record<string, Set<string>> = {};

    geoData.features.forEach((feat: any) => {
      const rawName = feat.properties?.NAME_1 || feat.properties?.name || '';
      if (!rawName) return;
      const pts = new Set<string>();

      function recurse(arr: any) {
        if (typeof arr[0] === 'number') {
          const x = Math.round(arr[0] * 100) / 100;
          const y = Math.round(arr[1] * 100) / 100;
          pts.add(`${x},${y}`);
        } else if (Array.isArray(arr)) {
          arr.forEach(recurse);
        }
      }

      if (feat.geometry?.coordinates) {
        recurse(feat.geometry.coordinates);
      }
      coordMap[rawName] = pts;
    });

    const adjacency: Record<string, string[]> = {};
    const names = Object.keys(coordMap);

    names.forEach(n1 => {
      adjacency[n1] = [];
      names.forEach(n2 => {
        if (n1 === n2) return;
        let sharedCount = 0;
        for (const p of coordMap[n1]) {
          if (coordMap[n2].has(p)) {
            sharedCount++;
            if (sharedCount >= 2) break;
          }
        }
        if (sharedCount >= 2) {
          adjacency[n1].push(n2);
        }
      });
    });

    return adjacency;
  }, [geoData]);

  // 4. Initialize Factions, Regions & Starting Divisions based on Country
  useEffect(() => {
    if (!geoData || !geoData.features || geoData.features.length === 0) return;

    const allRegionNames: string[] = geoData.features
      .map((f: any) => f.properties?.NAME_1 || f.properties?.name || '')
      .filter(Boolean);

    let initialFactions: FactionData[] = [];
    let initialDivisions: CivilWarDivision[] = [];

    if (country.id === 'LY') {
      // Libya Initial Setup (5 Real Factions: GNU, LNA, Misrata, PFG, Tuareg/Tebu South)
      const gnuControlled = ['Tripoli', 'AlJifarah', 'AzZawiyah', 'AnNuqatalKhams', 'AlMarqab'];
      const lnaControlled = ['Benghazi', 'AlButnan', 'AlJabalalAkhdar', 'Darnah', 'AlMarj', 'AlKufrah'];
      const misrataControlled = ['Misratah', 'Nalut', 'AlJabalalGharbi'];
      const pfgControlled = ['AlWahat'];
      const southControlled = ['Ghat', 'Murzuq', 'WadialHayat', 'WadiashShati\'', 'Sabha'];
      // Contested sectors: 'Surt' (PFG vs LNA) & 'AlJufrah' (LNA vs GNU)

      initialFactions = [
        {
          id: 'LY_GNU',
          name: 'GNU (Government of National Unity - Tripoli)',
          color: '#2563eb',
          controlledRegions: Array.from(new Set(gnuControlled)),
          isGovernment: true
        },
        {
          id: 'LY_LNA',
          name: 'LNA / Haftar (Tobruk-Benghazi Eastern Command)',
          color: '#dc2626',
          controlledRegions: Array.from(new Set([...lnaControlled, 'AlJufrah'])),
          isGovernment: false
        },
        {
          id: 'LY_MISRATA',
          name: 'Misrata Coalition & Western Brigades',
          color: '#059669',
          controlledRegions: Array.from(new Set(misrataControlled)),
          isGovernment: false
        },
        {
          id: 'LY_PFG',
          name: 'Petroleum Facilities Guard (PFG / Oil Crescent)',
          color: '#d97706',
          controlledRegions: Array.from(new Set([...pfgControlled, 'Surt'])),
          isGovernment: false
        },
        {
          id: 'LY_SOUTH',
          name: 'Tuareg & Tebu Southern Fezzan Forces',
          color: '#7c3aed',
          controlledRegions: Array.from(new Set(southControlled)),
          isGovernment: false
        }
      ];

      initialDivisions = [
        // GNU Forces (Tripolitania)
        { id: 'div_gnu_1', name: '444th Combat Brigade', type: 'mechanized', strength: 8500, maxStrength: 10000, morale: 88, supply: 90, ownerFaction: 'LY_GNU', regionName: 'Tripoli' },
        { id: 'div_gnu_2', name: '111th Infantry Division', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 82, supply: 85, ownerFaction: 'LY_GNU', regionName: 'AlMarqab' },
        { id: 'div_gnu_3', name: 'Zawiya Coastal Defense Brigade', type: 'infantry', strength: 6500, maxStrength: 7500, morale: 78, supply: 80, ownerFaction: 'LY_GNU', regionName: 'AzZawiyah' },
        { id: 'div_gnu_4', name: 'Tripoli Security Artillery Regiment', type: 'artillery', strength: 5500, maxStrength: 6500, morale: 85, supply: 85, ownerFaction: 'LY_GNU', regionName: 'AlJifarah' },
        { id: 'div_gnu_5', name: 'Jufra Forward Recon Mobile Unit', type: 'mechanized', strength: 5000, maxStrength: 6000, morale: 80, supply: 75, ownerFaction: 'LY_GNU', regionName: 'AlJufrah' },

        // LNA Forces (Cyrenaica & Forward Strongholds)
        { id: 'div_lna_1', name: 'Tariq bin Ziyad Heavy Armored', type: 'armor', strength: 9500, maxStrength: 10000, morale: 88, supply: 88, ownerFaction: 'LY_LNA', regionName: 'Benghazi' },
        { id: 'div_lna_2', name: '106th Mechanized Brigade', type: 'mechanized', strength: 8000, maxStrength: 9000, morale: 84, supply: 85, ownerFaction: 'LY_LNA', regionName: 'AlJabalalAkhdar' },
        { id: 'div_lna_3', name: 'Tobruk Border Defense Division', type: 'armor', strength: 7000, maxStrength: 8000, morale: 82, supply: 85, ownerFaction: 'LY_LNA', regionName: 'AlButnan' },
        { id: 'div_lna_4', name: 'Saiqa Special Forces Regiment', type: 'infantry', strength: 7000, maxStrength: 8000, morale: 86, supply: 80, ownerFaction: 'LY_LNA', regionName: 'Darnah' },
        { id: 'div_lna_5', name: 'Al-Jufra Airbase Armored Fortress', type: 'armor', strength: 7500, maxStrength: 8500, morale: 85, supply: 82, ownerFaction: 'LY_LNA', regionName: 'AlJufrah' },
        { id: 'div_lna_6', name: 'Sirte Vanguard Assault Regiment', type: 'mechanized', strength: 6500, maxStrength: 7500, morale: 80, supply: 80, ownerFaction: 'LY_LNA', regionName: 'Surt' },

        // Misrata Coalition
        { id: 'div_mis_1', name: 'Misrata Joint Armored Corps', type: 'armor', strength: 9000, maxStrength: 10000, morale: 92, supply: 88, ownerFaction: 'LY_MISRATA', regionName: 'Misratah' },
        { id: 'div_mis_2', name: 'Western Mountain Amazigh Brigade', type: 'infantry', strength: 6500, maxStrength: 7500, morale: 84, supply: 80, ownerFaction: 'LY_MISRATA', regionName: 'Nalut' },
        { id: 'div_mis_3', name: 'Jabal Nefusa Light Infantry', type: 'infantry', strength: 6000, maxStrength: 7000, morale: 80, supply: 78, ownerFaction: 'LY_MISRATA', regionName: 'AlJabalalGharbi' },

        // Petroleum Facilities Guard (PFG)
        { id: 'div_pfg_1', name: 'Ras Lanuf Oil Terminal Defense', type: 'mechanized', strength: 7000, maxStrength: 8000, morale: 82, supply: 90, ownerFaction: 'LY_PFG', regionName: 'AlWahat' },
        { id: 'div_pfg_2', name: 'Es Sider Marine Security Guard', type: 'infantry', strength: 6500, maxStrength: 7500, morale: 80, supply: 85, ownerFaction: 'LY_PFG', regionName: 'Surt' },

        // Tuareg & Tebu Southern Forces (Fezzan)
        { id: 'div_sth_1', name: 'Murzuq Desert Recon Division', type: 'infantry', strength: 6500, maxStrength: 7500, morale: 86, supply: 75, ownerFaction: 'LY_SOUTH', regionName: 'Murzuq' },
        { id: 'div_sth_2', name: 'Ghat Saharan Frontier Guard', type: 'infantry', strength: 6000, maxStrength: 7000, morale: 82, supply: 70, ownerFaction: 'LY_SOUTH', regionName: 'Ghat' },
        { id: 'div_sth_3', name: 'Sabha Oasis Heavy Commandos', type: 'mechanized', strength: 7000, maxStrength: 8000, morale: 84, supply: 78, ownerFaction: 'LY_SOUTH', regionName: 'Sabha' }
      ];
    } else if (country.id === 'SY') {
      // Syria (SAA vs SDF vs SNA vs HTS)
      const saaControlled = ['Damascus', 'RifDimashq', 'Hamah', 'Hims', 'Lattakia', 'Tartus', 'AsSuwayda\'', 'Dar`a', 'Quneitra'];
      const sdfControlled = ['AlḤasakah', 'ArRaqqah', 'DayrAzZawr'];
      const snaControlled = ['Aleppo'];
      const htsControlled = ['Idlib'];

      initialFactions = [
        { id: 'SY_SAA', name: 'Syrian Arab Army (SAA / Assad)', color: '#dc2626', controlledRegions: saaControlled, isGovernment: true },
        { id: 'SY_SDF', name: 'Syrian Democratic Forces (SDF / AANES)', color: '#f59e0b', controlledRegions: sdfControlled, isGovernment: false },
        { id: 'SY_SNA', name: 'Syrian National Army (SNA / Opposition)', color: '#2563eb', controlledRegions: snaControlled, isGovernment: false },
        { id: 'SY_HTS', name: 'Hay\'at Tahrir al-Sham (HTS / Salvation Gov)', color: '#059669', controlledRegions: htsControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_sy_1', name: '4th Armoured Division', type: 'armor', strength: 9500, maxStrength: 10000, morale: 88, supply: 90, ownerFaction: 'SY_SAA', regionName: 'Damascus' },
        { id: 'div_sy_2', name: 'Republican Guard Division', type: 'mechanized', strength: 9000, maxStrength: 9500, morale: 90, supply: 92, ownerFaction: 'SY_SAA', regionName: 'RifDimashq' },
        { id: 'div_sy_3', name: 'Tiger Forces (25th Special Mission)', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 92, supply: 88, ownerFaction: 'SY_SAA', regionName: 'Aleppo' },
        { id: 'div_sy_4', name: 'Coastal Defense Division', type: 'artillery', strength: 6000, maxStrength: 7000, morale: 80, supply: 85, ownerFaction: 'SY_SAA', regionName: 'Lattakia' },

        { id: 'div_sy_5', name: 'YPG/YPJ Mechanized Vanguard', type: 'mechanized', strength: 8500, maxStrength: 9000, morale: 92, supply: 88, ownerFaction: 'SY_SDF', regionName: 'AlḤasakah' },
        { id: 'div_sy_6', name: 'Raqqa Internal Security Brigade', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 84, supply: 82, ownerFaction: 'SY_SDF', regionName: 'ArRaqqah' },
        { id: 'div_sy_7', name: 'Deir ez-Zor Military Council', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 80, supply: 80, ownerFaction: 'SY_SDF', regionName: 'DayrAzZawr' },

        { id: 'div_sy_8', name: 'Sultan Murad Armored Brigade', type: 'armor', strength: 7500, maxStrength: 8000, morale: 85, supply: 82, ownerFaction: 'SY_SNA', regionName: 'Aleppo' },
        { id: 'div_sy_9', name: 'Sham Legion Frontier Regiment', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 82, supply: 80, ownerFaction: 'SY_SNA', regionName: 'Aleppo' },

        { id: 'div_sy_10', name: 'Liwa al-Fatih Heavy Infantry', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 90, supply: 85, ownerFaction: 'SY_HTS', regionName: 'Idlib' },
        { id: 'div_sy_11', name: 'Idlib Artillery Corps', type: 'artillery', strength: 5500, maxStrength: 6500, morale: 84, supply: 80, ownerFaction: 'SY_HTS', regionName: 'Idlib' }
      ];
    } else if (country.id === 'SD') {
      // Sudan (SAF vs RSF vs SPLM-N vs Darfur Groups)
      const safControlled = ['RedSea', 'RiverNile', 'Northern', 'Kassala', 'AlQadarif', 'Sennar'];
      const rsfControlled = ['Khartoum', 'AlJazirah', 'WestKurdufan', 'SouthKurdufan', 'EastDarfur'];
      const splmControlled = ['BlueNile'];
      const darfurControlled = ['NorthDarfur', 'SouthDarfur', 'CentralDarfur', 'WestDarfur'];

      initialFactions = [
        { id: 'SD_SAF', name: 'SAF (Sudanese Armed Forces / Burhan)', color: '#2563eb', controlledRegions: safControlled, isGovernment: true },
        { id: 'SD_RSF', name: 'RSF (Rapid Support Forces / Dagalo)', color: '#dc2626', controlledRegions: [...rsfControlled, 'Khartoum'], isGovernment: false },
        { id: 'SD_SPLMN', name: 'SPLM-N (al-Hilu Nuba Movement)', color: '#059669', controlledRegions: splmControlled, isGovernment: false },
        { id: 'SD_DARFUR', name: 'Darfur Joint Force & SLM Coalition', color: '#d97706', controlledRegions: darfurControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_sd_1', name: '1st Infantry Division (Port Sudan)', type: 'infantry', strength: 9000, maxStrength: 10000, morale: 88, supply: 90, ownerFaction: 'SD_SAF', regionName: 'RedSea' },
        { id: 'div_sd_2', name: 'SAF Armored Corps (Wadi Seidna)', type: 'armor', strength: 8500, maxStrength: 9000, morale: 86, supply: 85, ownerFaction: 'SD_SAF', regionName: 'RiverNile' },
        { id: 'div_sd_3', name: 'Khartoum Corps Loyalists', type: 'mechanized', strength: 7500, maxStrength: 8500, morale: 84, supply: 80, ownerFaction: 'SD_SAF', regionName: 'Khartoum' },

        { id: 'div_sd_4', name: 'RSF Rapid Mobile Cavalry', type: 'mechanized', strength: 9500, maxStrength: 10000, morale: 92, supply: 85, ownerFaction: 'SD_RSF', regionName: 'Khartoum' },
        { id: 'div_sd_5', name: 'Gezira Vanguard Mechanized', type: 'mechanized', strength: 8000, maxStrength: 8500, morale: 86, supply: 82, ownerFaction: 'SD_RSF', regionName: 'AlJazirah' },
        { id: 'div_sd_6', name: 'Kurdufan Desert Strike Regiment', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 85, supply: 80, ownerFaction: 'SD_RSF', regionName: 'WestKurdufan' },

        { id: 'div_sd_7', name: 'Nuba Mountains Liberation Army', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 90, supply: 85, ownerFaction: 'SD_SPLMN', regionName: 'BlueNile' },

        { id: 'div_sd_8', name: 'Joint Darfur Protection Force', type: 'armor', strength: 8000, maxStrength: 8500, morale: 88, supply: 80, ownerFaction: 'SD_DARFUR', regionName: 'NorthDarfur' },
        { id: 'div_sd_9', name: 'SLM Minawi Vanguard', type: 'mechanized', strength: 7000, maxStrength: 7500, morale: 84, supply: 78, ownerFaction: 'SD_DARFUR', regionName: 'SouthDarfur' }
      ];
    } else if (country.id === 'YE') {
      // Yemen (PLC vs Houthis vs STC vs Tareq Saleh)
      const houthiControlled = ['San`a\'', 'AmanatAlAsimah', 'Amran', 'Sa`dah', 'Hajjah', 'AlMahwit', 'Dhamar', 'Ibb', 'Raymah', 'AlHudaydah', 'AlBayda\'', 'AlJawf'];
      const plcControlled = ['Ma\'rib', 'Hadramawt', 'AlMahrah', 'Shabwah'];
      const stcControlled = ['Adan', 'Lahij', 'AdDali\'', 'Abyan', 'Socotra'];
      const tareqControlled = ['Ta`izz'];

      initialFactions = [
        { id: 'YE_PLC', name: 'Presidential Leadership Council (PLC / Recognized Gov)', color: '#2563eb', controlledRegions: plcControlled, isGovernment: true },
        { id: 'YE_HOU', name: 'Ansar Allah (Houthi Armed Movement)', color: '#059669', controlledRegions: houthiControlled, isGovernment: false },
        { id: 'YE_STC', name: 'Southern Transitional Council (STC / South Yemen)', color: '#dc2626', controlledRegions: stcControlled, isGovernment: false },
        { id: 'YE_RES', name: 'National Resistance Forces (Tareq Saleh / Coast)', color: '#d97706', controlledRegions: tareqControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_ye_1', name: 'Marib Defense Force Division', type: 'infantry', strength: 8500, maxStrength: 9000, morale: 90, supply: 88, ownerFaction: 'YE_PLC', regionName: 'Ma\'rib' },
        { id: 'div_ye_2', name: 'Hadramawt 1st Military District', type: 'mechanized', strength: 8000, maxStrength: 8500, morale: 82, supply: 85, ownerFaction: 'YE_PLC', regionName: 'Hadramawt' },

        { id: 'div_ye_3', name: 'Sanaa Republican Strike Division', type: 'mechanized', strength: 9000, maxStrength: 9500, morale: 92, supply: 88, ownerFaction: 'YE_HOU', regionName: 'AmanatAlAsimah' },
        { id: 'div_ye_4', name: 'Saada Ballistic Missile & Artillery Corps', type: 'artillery', strength: 7000, maxStrength: 7500, morale: 92, supply: 90, ownerFaction: 'YE_HOU', regionName: 'Sa`dah' },
        { id: 'div_ye_5', name: 'Hodeidah Red Sea Coastal Defense', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 88, supply: 82, ownerFaction: 'YE_HOU', regionName: 'AlHudaydah' },

        { id: 'div_ye_6', name: 'Giants Brigades (Al-Amaliqa)', type: 'armor', strength: 9500, maxStrength: 10000, morale: 92, supply: 90, ownerFaction: 'YE_STC', regionName: 'Adan' },
        { id: 'div_ye_7', name: 'Security Belt Rapid Brigade', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 85, supply: 85, ownerFaction: 'YE_STC', regionName: 'Lahij' },

        { id: 'div_ye_8', name: 'Guardians of the Republic Brigade', type: 'armor', strength: 8000, maxStrength: 8500, morale: 88, supply: 85, ownerFaction: 'YE_RES', regionName: 'Ta`izz' }
      ];
    } else if (country.id === 'MM') {
      // Myanmar (Tatmadaw vs NUG/PDF vs KIA vs AA vs KNU)
      const juntaControlled = ['Naypyitaw', 'Yangon', 'Bago', 'Magway', 'Ayeyarwady', 'Tanintharyi'];
      const nugControlled = ['Sagaing', 'Mandalay'];
      const kiaControlled = ['Kachin'];
      const aaControlled = ['Rakhine', 'Chin'];
      const knuControlled = ['Kayin', 'Kayah', 'Mon', 'Shan'];

      initialFactions = [
        { id: 'MM_SAC', name: 'Tatmadaw (State Administration Council Junta)', color: '#dc2626', controlledRegions: juntaControlled, isGovernment: true },
        { id: 'MM_NUG', name: 'National Unity Government & PDF', color: '#2563eb', controlledRegions: nugControlled, isGovernment: false },
        { id: 'MM_KIA', name: 'Kachin Independence Army (KIA)', color: '#059669', controlledRegions: kiaControlled, isGovernment: false },
        { id: 'MM_AA', name: 'Arakan Army (AA / ULA)', color: '#d97706', controlledRegions: aaControlled, isGovernment: false },
        { id: 'MM_KNU', name: 'Karen National Union & KNLA', color: '#7c3aed', controlledRegions: knuControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_mm_1', name: 'Naypyitaw Capital Command Division', type: 'armor', strength: 9500, maxStrength: 10000, morale: 85, supply: 90, ownerFaction: 'MM_SAC', regionName: 'Naypyitaw' },
        { id: 'div_mm_2', name: 'Yangon Coastal Defense Division', type: 'mechanized', strength: 8500, maxStrength: 9000, morale: 82, supply: 88, ownerFaction: 'MM_SAC', regionName: 'Yangon' },

        { id: 'div_mm_3', name: 'Sagaing PDF Combined Brigade', type: 'infantry', strength: 8500, maxStrength: 9000, morale: 94, supply: 82, ownerFaction: 'MM_NUG', regionName: 'Sagaing' },
        { id: 'div_mm_4', name: 'Mandalay Urban Resistance Cell', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 90, supply: 80, ownerFaction: 'MM_NUG', regionName: 'Mandalay' },

        { id: 'div_mm_5', name: 'Kachin Independence 1st Brigade', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 92, supply: 85, ownerFaction: 'MM_KIA', regionName: 'Kachin' },

        { id: 'div_mm_6', name: 'Arakan Coastal Strike Division', type: 'armor', strength: 8500, maxStrength: 9000, morale: 94, supply: 88, ownerFaction: 'MM_AA', regionName: 'Rakhine' },

        { id: 'div_mm_7', name: 'Karen National Liberation Army', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 88, supply: 82, ownerFaction: 'MM_KNU', regionName: 'Kayin' }
      ];
    } else if (country.id === 'SO') {
      // Somalia (FGS vs Al-Shabaab vs Somaliland vs Puntland vs Jubaland)
      const somalilandControlled = ['Awdal', 'WoqooyiGalbeed', 'Togdheer', 'Sanaag', 'Sool'];
      const puntlandControlled = ['Bari', 'Nugaal', 'Mudug'];
      const shabaabControlled = ['JubbadaDhexe', 'Bay', 'Bakool'];
      const jubalandControlled = ['JubbadaHoose', 'Gedo'];
      const fgsControlled = ['Banaadir', 'ShabeellahaHoose', 'ShabeellahaDhexe', 'Hiiraan', 'Galguduud'];

      initialFactions = [
        { id: 'SO_FGS', name: 'Federal Government of Somalia (Mogadishu)', color: '#2563eb', controlledRegions: fgsControlled, isGovernment: true },
        { id: 'SO_SHA', name: 'Al-Shabaab Militant Insurgents', color: '#dc2626', controlledRegions: shabaabControlled, isGovernment: false },
        { id: 'SO_SOM', name: 'Republic of Somaliland (Hargeisa)', color: '#059669', controlledRegions: somalilandControlled, isGovernment: false },
        { id: 'SO_PNT', name: 'Puntland State Dervish Security Forces', color: '#0891b2', controlledRegions: puntlandControlled, isGovernment: false },
        { id: 'SO_JUB', name: 'Jubaland Regional Forces (Kismayo)', color: '#d97706', controlledRegions: jubalandControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_so_1', name: 'Danab Advanced Commando Brigade', type: 'mechanized', strength: 8500, maxStrength: 9000, morale: 92, supply: 88, ownerFaction: 'SO_FGS', regionName: 'Banaadir' },
        { id: 'div_so_2', name: 'Gorgor Elite Strike Command', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 85, supply: 85, ownerFaction: 'SO_FGS', regionName: 'Hiiraan' },

        { id: 'div_so_3', name: 'Jaysh al-Usra Heavy Assault Brigade', type: 'armor', strength: 8500, maxStrength: 9000, morale: 90, supply: 80, ownerFaction: 'SO_SHA', regionName: 'JubbadaDhexe' },
        { id: 'div_so_4', name: 'Bay & Bakool Guerrilla Front', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 88, supply: 78, ownerFaction: 'SO_SHA', regionName: 'Bay' },

        { id: 'div_so_5', name: 'Somaliland 1st Armored Division', type: 'armor', strength: 8000, maxStrength: 8500, morale: 88, supply: 85, ownerFaction: 'SO_SOM', regionName: 'WoqooyiGalbeed' },

        { id: 'div_so_6', name: 'Puntland Dervish Rapid Reaction', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 86, supply: 82, ownerFaction: 'SO_PNT', regionName: 'Bari' },

        { id: 'div_so_7', name: 'Jubaland Marine & Port Security', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 84, supply: 80, ownerFaction: 'SO_JUB', regionName: 'JubbadaHoose' }
      ];
    } else if (country.id === 'AF') {
      // Afghanistan (Taliban vs NRF vs AFF vs ISKP)
      const nrfControlled = ['Panjshir', 'Badakhshan', 'Takhar', 'Kapisa', 'Parwan'];
      const affControlled = ['Baghlan', 'Samangan'];
      const iskpControlled = ['Nangarhar', 'Kunar'];
      const talibanControlled = allRegionNames.filter(r => {
        const norm = normalizeGeoName(r);
        return !nrfControlled.some(s => normalizeGeoName(s) === norm) &&
               !affControlled.some(s => normalizeGeoName(s) === norm) &&
               !iskpControlled.some(s => normalizeGeoName(s) === norm);
      });

      initialFactions = [
        { id: 'AF_TAL', name: 'Taliban (Islamic Emirate of Afghanistan)', color: '#dc2626', controlledRegions: talibanControlled, isGovernment: true },
        { id: 'AF_NRF', name: 'National Resistance Front (NRF / Massoud)', color: '#059669', controlledRegions: nrfControlled, isGovernment: false },
        { id: 'AF_AFF', name: 'Afghanistan Freedom Front (AFF / Veterans)', color: '#2563eb', controlledRegions: affControlled, isGovernment: false },
        { id: 'AF_ISKP', name: 'ISKP (Islamic State Khorasan Province)', color: '#1e293b', controlledRegions: iskpControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_af_1', name: 'Badri 313 Special Commando Corps', type: 'armor', strength: 9500, maxStrength: 10000, morale: 92, supply: 90, ownerFaction: 'AF_TAL', regionName: 'Kabul' },
        { id: 'div_af_2', name: 'Kandahar Heavy Mechanized Division', type: 'mechanized', strength: 8500, maxStrength: 9000, morale: 88, supply: 88, ownerFaction: 'AF_TAL', regionName: 'Kandahar' },
        { id: 'div_af_3', name: 'Mansoori Corps Border Division', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 82, supply: 82, ownerFaction: 'AF_TAL', regionName: 'Herat' },

        { id: 'div_af_4', name: 'Panjshir Valley Defense Brigade', type: 'infantry', strength: 8500, maxStrength: 9000, morale: 94, supply: 85, ownerFaction: 'AF_NRF', regionName: 'Panjshir' },
        { id: 'div_af_5', name: 'Hindu Kush Mountain Vanguard', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 90, supply: 80, ownerFaction: 'AF_NRF', regionName: 'Badakhshan' },

        { id: 'div_af_6', name: 'AFF Northern Freedom Commandos', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 88, supply: 80, ownerFaction: 'AF_AFF', regionName: 'Baghlan' },

        { id: 'div_af_7', name: 'ISKP Eastern Insurgent Wing', type: 'infantry', strength: 6000, maxStrength: 6500, morale: 85, supply: 75, ownerFaction: 'AF_ISKP', regionName: 'Nangarhar' }
      ];
    } else if (country.id === 'ML') {
      // Mali (FAMa vs Azawad CSP-DPA vs JNIM)
      const azawadControlled = ['Kidal', 'Taoudenit', 'Tombouctou'];
      const jnimControlled = ['Mopti', 'Gao'];
      const famaControlled = allRegionNames.filter(r => {
        const norm = normalizeGeoName(r);
        return !azawadControlled.some(s => normalizeGeoName(s) === norm) &&
               !jnimControlled.some(s => normalizeGeoName(s) === norm);
      });

      initialFactions = [
        { id: 'ML_GOV', name: 'FAMa (Forces Armées Maliennes)', color: '#3b82f6', controlledRegions: famaControlled, isGovernment: true },
        { id: 'ML_CSP', name: 'CSP-DPA (Azawad Liberation Coalition)', color: '#10b981', controlledRegions: azawadControlled, isGovernment: false },
        { id: 'ML_JNI', name: 'JNIM (Sahel Insurgent Network)', color: '#dc2626', controlledRegions: jnimControlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_ml_1', name: 'FAMa 1st Armored Division', type: 'armor', strength: 8500, maxStrength: 9000, morale: 88, supply: 90, ownerFaction: 'ML_GOV', regionName: 'Bamako' },
        { id: 'div_ml_2', name: 'Airborne Commando Battalion', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 85, supply: 85, ownerFaction: 'ML_GOV', regionName: 'Segou' },
        { id: 'div_ml_3', name: 'Koulikoro Artillery Brigade', type: 'artillery', strength: 6000, maxStrength: 7000, morale: 82, supply: 82, ownerFaction: 'ML_GOV', regionName: 'Koulikoro' },

        { id: 'div_ml_4', name: 'Azawad Liberation Motorized Units', type: 'mechanized', strength: 8000, maxStrength: 8500, morale: 92, supply: 80, ownerFaction: 'ML_CSP', regionName: 'Kidal' },
        { id: 'div_ml_5', name: 'CSP Desert Recon Brigade', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 88, supply: 78, ownerFaction: 'ML_CSP', regionName: 'Tombouctou' },

        { id: 'div_ml_6', name: 'Katiba Macina Guerrilla Brigade', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 86, supply: 75, ownerFaction: 'ML_JNI', regionName: 'Mopti' }
      ];
    } else if (country.id === 'CD') {
      // DR Congo (FARDC vs M23/AFC Coalition)
      const m23Controlled = ['Nord-Kivu', 'Sud-Kivu', 'Ituri'];
      const fardcControlled = allRegionNames.filter(r => {
        const norm = normalizeGeoName(r);
        return !m23Controlled.some(s => normalizeGeoName(s) === norm);
      });

      initialFactions = [
        { id: 'CD_GOV', name: 'FARDC (Forces Armées de la RDC)', color: '#3b82f6', controlledRegions: fardcControlled, isGovernment: true },
        { id: 'CD_M23', name: 'M23 / AFC Coalition', color: '#ef4444', controlledRegions: m23Controlled, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_cd_1', name: 'Republican Guard Division', type: 'armor', strength: 9000, maxStrength: 10000, morale: 86, supply: 90, ownerFaction: 'CD_GOV', regionName: 'Kinshasa' },
        { id: 'div_cd_2', name: '34th Military Region Command', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 80, supply: 82, ownerFaction: 'CD_GOV', regionName: 'Tshopo' },
        { id: 'div_cd_3', name: 'Katanga Heavy Armored Corps', type: 'mechanized', strength: 7500, maxStrength: 8000, morale: 84, supply: 85, ownerFaction: 'CD_GOV', regionName: 'Haut-Katanga' },

        { id: 'div_cd_4', name: 'M23 Arc Strike Brigade', type: 'armor', strength: 9000, maxStrength: 9500, morale: 92, supply: 85, ownerFaction: 'CD_M23', regionName: 'Nord-Kivu' },
        { id: 'div_cd_5', name: 'AFC Mobile Eastern Commandos', type: 'mechanized', strength: 8000, maxStrength: 8500, morale: 90, supply: 80, ownerFaction: 'CD_M23', regionName: 'Sud-Kivu' },
        { id: 'div_cd_6', name: 'Ituri Frontline Combatants', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 84, supply: 78, ownerFaction: 'CD_M23', regionName: 'Ituri' }
      ];
    } else if (country.id === 'UA') {
      // Ukraine Frontline Setup (ZSU vs Russian Armed Forces)
      const ruOccupied = ['Crimea', "Sevastopol'", "Donets'k", "Luhans'k", 'Zaporizhia', 'Kherson'];
      const uaControlled = allRegionNames.filter(r => {
        const norm = normalizeGeoName(r);
        return !ruOccupied.some(ru => normalizeGeoName(ru) === norm);
      });

      initialFactions = [
        {
          id: 'UA_ZSU',
          name: 'Armed Forces of Ukraine (ZSU)',
          color: '#3b82f6',
          controlledRegions: uaControlled,
          isGovernment: true
        },
        {
          id: 'RU_FORCES',
          name: 'Russian Armed Forces & Occupying Forces',
          color: '#ef4444',
          controlledRegions: ruOccupied,
          isGovernment: false
        }
      ];

      initialDivisions = [
        // ZSU Ukrainian Divisions - Distributed across frontline & strategic hubs
        { id: 'div_ua_1', name: '93rd Mechanized Brigade Kholodnyi Yar', type: 'mechanized', strength: 9500, maxStrength: 10000, morale: 92, supply: 90, ownerFaction: 'UA_ZSU', regionName: 'Kharkiv' },
        { id: 'div_ua_2', name: '47th Separate Magura Mechanized', type: 'armor', strength: 9000, maxStrength: 10000, morale: 90, supply: 88, ownerFaction: 'UA_ZSU', regionName: "Dnipropetrovs'k" },
        { id: 'div_ua_3', name: 'Presidential Defense Guard', type: 'infantry', strength: 8500, maxStrength: 9000, morale: 95, supply: 95, ownerFaction: 'UA_ZSU', regionName: 'Kiev' },
        { id: 'div_ua_4', name: '35th Marine Brigade', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 88, supply: 85, ownerFaction: 'UA_ZSU', regionName: 'Mykolayiv' },
        { id: 'div_ua_5', name: '28th Eyvazov Mechanized Brigade', type: 'artillery', strength: 7500, maxStrength: 8000, morale: 85, supply: 86, ownerFaction: 'UA_ZSU', regionName: 'Odessa' },
        { id: 'div_ua_6', name: '80th Air Assault Brigade', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 90, supply: 88, ownerFaction: 'UA_ZSU', regionName: "L'viv" },

        // Russian Occupying Forces - Distributed across occupied sectors
        { id: 'div_ru_1', name: '1st Army Corps (Donetsk Front)', type: 'armor', strength: 9500, maxStrength: 10000, morale: 82, supply: 85, ownerFaction: 'RU_FORCES', regionName: "Donets'k" },
        { id: 'div_ru_2', name: '2nd Guards Army Corps (Luhansk)', type: 'mechanized', strength: 9000, maxStrength: 9500, morale: 80, supply: 84, ownerFaction: 'RU_FORCES', regionName: "Luhans'k" },
        { id: 'div_ru_3', name: '58th Combined Arms Army', type: 'armor', strength: 9000, maxStrength: 10000, morale: 84, supply: 82, ownerFaction: 'RU_FORCES', regionName: 'Zaporizhia' },
        { id: 'div_ru_4', name: 'Dnieper Group of Forces', type: 'infantry', strength: 8000, maxStrength: 8500, morale: 78, supply: 80, ownerFaction: 'RU_FORCES', regionName: 'Kherson' },
        { id: 'div_ru_5', name: '810th Guards Naval Infantry Brigade', type: 'infantry', strength: 8500, maxStrength: 9000, morale: 85, supply: 88, ownerFaction: 'RU_FORCES', regionName: 'Crimea' },
        { id: 'div_ru_6', name: 'Black Sea Coastal Defense Corps', type: 'artillery', strength: 7000, maxStrength: 7500, morale: 80, supply: 82, ownerFaction: 'RU_FORCES', regionName: "Sevastopol'" },
      ];
    } else {
      // Dynamic fallback for any other conflict territory
      const half = Math.ceil(allRegionNames.length / 2);
      const govRegions = allRegionNames.slice(0, half);
      const rebelRegions = allRegionNames.slice(half);

      initialFactions = [
        { id: `${country.id}_GOV`, name: `${country.name} Government Loyalists`, color: '#3b82f6', controlledRegions: govRegions, isGovernment: true },
        { id: `${country.id}_REB`, name: `${country.name} National Salvation Council`, color: '#ef4444', controlledRegions: rebelRegions, isGovernment: false }
      ];

      initialDivisions = [
        { id: 'div_dyn_1', name: '1st Armored Vanguard', type: 'armor', strength: 8500, maxStrength: 9000, morale: 85, supply: 90, ownerFaction: `${country.id}_GOV`, regionName: govRegions[0] || 'Capital' },
        { id: 'div_dyn_2', name: 'National Guard Infantry', type: 'infantry', strength: 7500, maxStrength: 8000, morale: 80, supply: 85, ownerFaction: `${country.id}_GOV`, regionName: govRegions[1] || govRegions[0] },
        { id: 'div_dyn_3', name: 'Rebel Mechanized Strike', type: 'mechanized', strength: 8000, maxStrength: 8500, morale: 88, supply: 85, ownerFaction: `${country.id}_REB`, regionName: rebelRegions[0] || 'Border' },
        { id: 'div_dyn_4', name: 'Liberation Infantry Brigade', type: 'infantry', strength: 7000, maxStrength: 7500, morale: 82, supply: 80, ownerFaction: `${country.id}_REB`, regionName: rebelRegions[1] || rebelRegions[0] }
      ];
    }

    const deduplicatedFactions = initialFactions.map(f => ({
      ...f,
      controlledRegions: Array.from(new Set(f.controlledRegions))
    }));

    // Inject starting expeditionary battalion for factions with foreign backers (Requirement 2)
    const conflictDef = INITIAL_CIVIL_WARS[country.id];
    const resolvedPlayerFacId = playerParty?.id || deduplicatedFactions.find(f => f.isGovernment)?.id || deduplicatedFactions[0]?.id;
    const factionBacker = conflictDef?.factions.find(f => f.id === resolvedPlayerFacId)?.foreignBacker;
    const supporter = resolveForeignSupporter(factionBacker, foreignAidPackages);
    if (supporter && !initialDivisions.some(d => d.isExpeditionary && d.ownerFaction === resolvedPlayerFacId)) {
      const safeReg = deduplicatedFactions.find(f => f.id === resolvedPlayerFacId)?.controlledRegions[0] || allRegionNames[0] || 'Capital';
      const variant = supporter.equipmentVariants[0];
      initialDivisions.push({
        id: `div_exp_init_${supporter.countryId}`,
        name: `${supporter.countryName} ${variant.name} Task Force`,
        type: variant.type,
        strength: variant.strength,
        maxStrength: variant.strength,
        morale: 95,
        supply: 95,
        ownerFaction: resolvedPlayerFacId,
        regionName: safeReg,
        isExpeditionary: true,
        supporterCountryId: supporter.countryId,
        supporterCountryName: supporter.countryName,
        supporterFlag: supporter.flag,
        equipmentName: variant.name,
        hasActedThisTurn: false
      });
    }

    setFactions(deduplicatedFactions);
    setDivisions(initialDivisions);

    // Initialize Casualty Stats
    const initialStats: Record<string, FactionStats> = {};
    initialFactions.forEach(f => {
      const fDivs = initialDivisions.filter(d => d.ownerFaction === f.id);
      const totalManpower = fDivs.reduce((acc, d) => acc + d.strength, 0);
      initialStats[f.id] = {
        divisionsRemaining: fDivs.length,
        totalManpower,
        lossesThisTurn: 0,
        cumulativeLosses: 0,
        regionsHeld: f.controlledRegions.length
      };
    });
    setCasualtyStats(initialStats);
  }, [geoData, country.id, country.name, playerParty, foreignAidPackages]);

  // 5. Compute Bounding Box Across All Features (minLon, minLat, maxLon, maxLat) and Fit with Mercator
  const { projection, pathGenerator, centroids, featurePaths, fitError } = useMemo(() => {
    if (!geoData || !Array.isArray(geoData.features) || geoData.features.length < 2 || dimensions.width <= 50 || dimensions.height <= 50) {
      if (geoData && geoData.features && geoData.features.length < 2) {
        console.warn(`Invalid GeoJSON extent for ${iso3}`);
      }
      return { projection: null, pathGenerator: null, centroids: {}, featurePaths: {}, fitError: Boolean(geoData) };
    }

    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    const scanCoords = (coords: any) => {
      if (!coords) return;
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        const lon = coords[0];
        const lat = coords[1];
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        return;
      }
      if (Array.isArray(coords)) {
        for (let i = 0; i < coords.length; i++) {
          scanCoords(coords[i]);
        }
      }
    };

    geoData.features.forEach((feat: any) => {
      if (feat.geometry?.coordinates) {
        scanCoords(feat.geometry.coordinates);
      }
    });

    if (!isFinite(minLon) || !isFinite(maxLon) || !isFinite(minLat) || !isFinite(maxLat)) {
      console.warn(`Invalid GeoJSON extent for ${iso3}`);
      return { projection: null, pathGenerator: null, centroids: {}, featurePaths: {}, fitError: true };
    }

    // Raw Mercator projection:
    const rawMercator = geoMercator().scale(1).translate([0, 0]);
    const pTL = rawMercator([minLon, maxLat]);
    const pBR = rawMercator([maxLon, minLat]);

    if (!pTL || !pBR) {
      console.warn(`Invalid GeoJSON extent for ${iso3}`);
      return { projection: null, pathGenerator: null, centroids: {}, featurePaths: {}, fitError: true };
    }

    const minX = pTL[0];
    const maxX = pBR[0];
    const minY = pTL[1];
    const maxY = pBR[1];

    // Guard: if maxX - minX <= 0 or maxY - minY <= 0
    if (maxX - minX <= 0 || maxY - minY <= 0) {
      console.warn(`Invalid GeoJSON extent for ${iso3}`);
      return { projection: null, pathGenerator: null, centroids: {}, featurePaths: {}, fitError: true };
    }

    const W = dimensions.width;
    const H = dimensions.height;
    const PAD = 24;

    const scale = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
    const ox = PAD + (W - 2 * PAD - (maxX - minX) * scale) / 2;
    const oy = PAD + (H - 2 * PAD - (maxY - minY) * scale) / 2;

    const proj = geoMercator()
      .scale(scale)
      .translate([ox - minX * scale, oy - minY * scale]);

    const pathGen = geoPath(proj);

    const centerPoints: Record<string, [number, number]> = {};
    const fPaths: Record<string, string> = {};
    geoData.features.forEach((feat: any, idx: number) => {
      const rawName = feat.properties?.NAME_1 || feat.properties?.name || `Region_${idx}`;
      if (!rawName) return;
      const c = pathGen.centroid(feat);
      if (!isNaN(c[0]) && !isNaN(c[1])) {
        centerPoints[rawName] = [c[0], c[1]];
        centerPoints[normalizeGeoName(rawName)] = [c[0], c[1]];
      }
      const d = pathGen(feat) || '';
      fPaths[rawName] = d;
      fPaths[normalizeGeoName(rawName)] = d;
      if (feat.properties?.GID_1) fPaths[feat.properties.GID_1] = d;
    });

    return { projection: proj, pathGenerator: pathGen, centroids: centerPoints, featurePaths: fPaths, fitError: false };
  }, [geoData, dimensions, iso3]);

  // Dynamically compute Active Fronts between Player Coalition and Hostile Sides
  const activeFronts = useMemo<ActiveFront[]>(() => {
    if (!adjacencyMap || Object.keys(adjacencyMap).length === 0 || factions.length === 0) return [];

    const friendlyRegions = factions
      .filter(f => playerCoalition.members.includes(f.id))
      .flatMap(f => f.controlledRegions);

    const fronts: ActiveFront[] = [];
    const hostileFactions = factions.filter(f => areHostile(f.id, playerFactionId));

    hostileFactions.forEach(hostileFac => {
      const hostileRegions = hostileFac.controlledRegions;
      const borderPairs: Array<{ friendly: string; hostile: string }> = [];
      const friendlyBorder = new Set<string>();
      const hostileBorder = new Set<string>();

      friendlyRegions.forEach(fReg => {
        const rawF = findFeatureByName(fReg)?.properties?.NAME_1 || fReg;
        const adjs = adjacencyMap[rawF] || adjacencyMap[normalizeGeoName(fReg)] || [];
        adjs.forEach(adj => {
          const adjNorm = normalizeGeoName(adj);
          const isHostileControlled = hostileRegions.some(hr => normalizeGeoName(hr) === adjNorm);
          if (isHostileControlled) {
            borderPairs.push({ friendly: fReg, hostile: adj });
            friendlyBorder.add(fReg);
            hostileBorder.add(adj);
          }
        });
      });

      if (borderPairs.length > 0) {
        const frontId = `front_${hostileFac.id}`;
        const hostileShort = getFactionShortName(hostileFac.id, hostileFac.name);
        const playerShort = getFactionShortName(playerFactionId, playerCoalition.name);
        const frontName = `${playerShort} – ${hostileShort} Front`;
        const assignedIds = divisions
          .filter(d => d.assignedFrontId === frontId && d.strength > 0)
          .map(d => d.id);

        fronts.push({
          id: frontId,
          name: frontName,
          hostileFactionId: hostileFac.id,
          hostileFactionName: hostileFac.name,
          hostileFactionColor: hostileFac.color,
          friendlyBorderRegions: Array.from(friendlyBorder),
          hostileBorderRegions: Array.from(hostileBorder),
          borderPairs,
          assignedDivisionIds: assignedIds,
          stance: frontStances[frontId] || 'HOLD'
        });
      }
    });

    return fronts;
  }, [adjacencyMap, factions, playerCoalition, playerFactionId, areHostile, divisions, frontStances, findFeatureByName]);

  const handleToggleFrontStance = useCallback((frontId: string) => {
    setFrontStances(prev => {
      const current = prev[frontId] || 'HOLD';
      const next = current === 'HOLD' ? 'ADVANCE' : 'HOLD';
      playSound('click');
      setToastMessage({
        text: `Front Order: Set stance to ${next === 'ADVANCE' ? '⚔️ ADVANCE (Assault Ready)' : '🛡️ HOLD (Dig In Defense)'}.`,
        type: 'info'
      });
      return { ...prev, [frontId]: next };
    });
  }, []);

  const assignDivisionsToFront = useCallback((frontId: string, customDivIds?: string[]) => {
    const front = activeFronts.find(f => f.id === frontId);
    if (!front || front.friendlyBorderRegions.length === 0) return;

    const targetDivIds = customDivIds || selectedDivisionIds;
    const targetDivs = divisions.filter(d => targetDivIds.includes(d.id) && d.ownerFaction === playerFactionId);

    if (targetDivs.length === 0) {
      setToastMessage({ text: 'Select one or more divisions to assign to this front.', type: 'info' });
      return;
    }

    const borderRegions = front.friendlyBorderRegions;
    const numBorder = borderRegions.length;

    setDivisions(prev => {
      let divIdx = 0;
      return prev.map(d => {
        if (targetDivIds.includes(d.id) && d.ownerFaction === playerFactionId) {
          const assignedRegion = borderRegions[divIdx % numBorder];
          divIdx++;
          return {
            ...d,
            regionName: assignedRegion,
            assignedFrontId: front.id,
            hasActedThisTurn: true
          };
        }
        return d;
      });
    });

    playSound('click');
    setToastMessage({
      text: `🎖️ Front Assignment: ${targetDivs.length} division(s) assigned to ${front.name} and spread across ${numBorder} border sectors.`,
      type: 'success'
    });
  }, [activeFronts, selectedDivisionIds, divisions, playerFactionId]);

  // Group divisions by region name for stacking offsets and collision detection
  const stackedDivisionsMap = useMemo(() => {
    const map: Record<string, CivilWarDivision[]> = {};
    divisions.filter(d => d.strength > 0).forEach(d => {
      const norm = normalizeGeoName(d.regionName);
      if (!map[norm]) map[norm] = [];
      map[norm].push(d);
    });
    return map;
  }, [divisions]);

  // Detect contested regions (overlapping faction divisions or active hostilities in province)
  const contestedRegions = useMemo<Set<string>>(() => {
    const contested = new Set<string>();
    (Object.entries(stackedDivisionsMap) as [string, CivilWarDivision[]][]).forEach(([normReg, divs]) => {
      const activeDivs = divs.filter(d => d.strength > 0);
      const presentFactions = new Set(activeDivs.map(d => d.ownerFaction));
      if (presentFactions.size > 1) {
        contested.add(normReg);
      } else if (presentFactions.size === 1) {
        const unitFaction = activeDivs[0].ownerFaction;
        const ctrl = getRegionController(normReg);
        if (ctrl && ctrl.id !== unitFaction) {
          contested.add(normReg);
        }
      }
    });
    return contested;
  }, [stackedDivisionsMap, getRegionController]);

  // Map coordinates calculation relative to SVG transform
  const getMapCoordinates = useCallback((e: React.PointerEvent) => {
    const svgRect = svgRef.current?.getBoundingClientRect() || containerRef.current?.getBoundingClientRect();
    if (!svgRect) return { x: 0, y: 0 };
    const sx = e.clientX - svgRect.left;
    const sy = e.clientY - svgRect.top;
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const mapX = cx + (sx - cx - pan.x) / zoom;
    const mapY = cy + (sy - cy - pan.y) / zoom;
    return { x: mapX, y: mapY };
  }, [dimensions, pan, zoom]);

  // Valid reachable adjacent region names for selected division
  const reachableAdjacentRegions = useMemo<Set<string>>(() => {
    if (!selectedDivisionId) return new Set<string>();
    const div = divisions.find(d => d.id === selectedDivisionId);
    if (!div) return new Set<string>();

    const targetSet = new Set<string>();
    const feat = findFeatureByName(div.regionName);
    const rawOrigin = feat?.properties?.NAME_1 || div.regionName;
    const directAdjacents = adjacencyMap[rawOrigin] || [];

    directAdjacents.forEach(adj => targetSet.add(normalizeGeoName(adj)));
    return targetSet;
  }, [selectedDivisionId, divisions, adjacencyMap, findFeatureByName]);

  // All regions in the country map
  const allCountryRegions = useMemo(() => {
    if (!geoData?.features) return [];
    return geoData.features
      .map((f: any) => f.properties?.NAME_1 || f.properties?.name || '')
      .filter(Boolean);
  }, [geoData]);

  // Divisions count by faction
  const divisionsByFaction = useMemo(() => {
    const res: Record<string, number> = {};
    divisions.forEach(d => {
      if (d.strength > 0) {
        res[d.ownerFaction] = (res[d.ownerFaction] || 0) + 1;
      }
    });
    return res;
  }, [divisions]);

  // Manpower count by faction
  const manpowerByFaction = useMemo(() => {
    const res: Record<string, number> = {};
    divisions.forEach(d => {
      if (d.strength > 0) {
        res[d.ownerFaction] = (res[d.ownerFaction] || 0) + d.strength;
      }
    });
    return res;
  }, [divisions]);

  // Check and execute victory conditions
  const checkVictoryConditions = useCallback(() => {
    if (hasWonWar || showTerritorialSettlementModal) return;

    const playerFac = factions.find(f => f.id === playerFactionId);
    if (!playerFac) return;

    const totalRegions = geoData?.features?.length || 20;

    // Allied regions count toward coalition victory! (Requirement 1)
    const coalitionHeld = factions
      .filter(f => playerCoalition.members.includes(f.id))
      .flatMap(f => f.controlledRegions);
    const uniqueCoalitionHeld = Array.from(new Set(coalitionHeld.map(normalizeGeoName)));
    const coalitionControlledCount = uniqueCoalitionHeld.length;

    const enemyFactions = factions.filter(f => !playerCoalition.members.includes(f.id));
    const allEnemyFactionsSignedPeace = enemyFactions.length > 0 && enemyFactions.every(f => peaceSignatoryFactionIds.includes(f.id));
    const has90PercentControl = coalitionControlledCount >= Math.ceil(totalRegions * 0.90);

    // Full victory ONLY at >=90% regions controlled OR when every enemy faction has signed peace! (Requirement 1)
    if (has90PercentControl || allEnemyFactionsSignedPeace) {
      setSettlementWinnerFactionId(playerFactionId);
      const victoryName = playerCoalition.name || playerFac.name;
      setWinnerFactionName(victoryName);
      setShowTerritorialSettlementModal(true);

      playSound('success');
      setToastMessage({
        text: `🏆 DECISIVE COALITION VICTORY: ${victoryName} secured ${has90PercentControl ? '≥90% territorial control' : 'peace with all enemy factions'}! Opening Settlement Conference...`,
        type: 'success'
      });
    }
  }, [hasWonWar, showTerritorialSettlementModal, factions, playerFactionId, playerCoalition, geoData, peaceSignatoryFactionIds]);

  // 6. Drag-and-Drop & Multi-Unit Selection Handlers
  const handlePointerDownCounter = (e: React.PointerEvent, division: CivilWarDivision) => {
    e.stopPropagation();

    // Right-click drag: multi-select of divisions (box select)
    if (e.button === 2) {
      e.preventDefault();
      const mapCoords = getMapCoordinates(e);
      setBoxSelection({
        startX: mapCoords.x,
        startY: mapCoords.y,
        currentX: mapCoords.x,
        currentY: mapCoords.y
      });
      return;
    }

    if (e.button !== 0) return;

    // Left click on enemy division: order attack if friendly division already selected
    if (division.ownerFaction !== playerFactionId && !areAllied(division.ownerFaction, playerFactionId)) {
      if (selectedDivisionId) {
        const selectedUnit = divisions.find(d => d.id === selectedDivisionId);
        if (selectedUnit && selectedUnit.ownerFaction === playerFactionId && !selectedUnit.hasActedThisTurn) {
          executeDivisionMove(selectedUnit, division.regionName);
          return;
        }
      }
      setSelectedDivisionId(division.id);
      setSelectedDivisionIds([division.id]);
      return;
    }

    if (division.ownerFaction !== playerFactionId) {
      // Allied division: select to inspect
      setSelectedDivisionId(division.id);
      setSelectedDivisionIds([division.id]);
      return;
    }

    if (division.hasActedThisTurn) {
      setToastMessage({ text: `${division.name} has already acted this turn. Wait for End Turn.`, type: 'info' });
      setSelectedDivisionId(division.id);
      return;
    }

    // Shift-Click toggles division in multi-selection
    if (e.shiftKey) {
      setSelectedDivisionIds(prev => {
        if (prev.includes(division.id)) {
          return prev.filter(id => id !== division.id);
        }
        return [...prev, division.id];
      });
      setSelectedDivisionId(division.id);
      playSound('click');
      return;
    }

    // Single left-click on already-selected or moving unit -> ready for new order!
    if (selectedDivisionId === division.id) {
      setToastMessage({
        text: `🎯 Ready: ${division.name} selected. Left-click a destination province on the map to give order.`,
        type: 'info'
      });
    } else {
      setSelectedDivisionId(division.id);
      if (!selectedDivisionIds.includes(division.id)) {
        setSelectedDivisionIds([division.id]);
      }
    }

    const mapCoords = getMapCoordinates(e);
    setDragState({
      divisionId: division.id,
      startX: mapCoords.x,
      startY: mapCoords.y,
      currentX: mapCoords.x,
      currentY: mapCoords.y,
      originRegionName: division.regionName
    });

    playSound('click');
  };

  const handleCounterClick = (e: React.MouseEvent, division: CivilWarDivision) => {
    e.stopPropagation();

    // If clicking an enemy unit and player already has units selected, order attack on enemy's region!
    if (division.ownerFaction !== playerFactionId && !areAllied(division.ownerFaction, playerFactionId)) {
      if (selectedDivisionId) {
        const selectedUnit = divisions.find(d => d.id === selectedDivisionId);
        if (selectedUnit && selectedUnit.ownerFaction === playerFactionId && !selectedUnit.hasActedThisTurn) {
          executeDivisionMove(selectedUnit, division.regionName);
          return;
        }
      }
      setSelectedDivisionId(division.id);
      setSelectedDivisionIds([division.id]);
      playSound('click');
      return;
    }

    // Friendly unit: left-click already selected unit prepares order
    if (division.ownerFaction === playerFactionId) {
      if (selectedDivisionId === division.id) {
        setToastMessage({
          text: `🎯 Ready: ${division.name} selected. Left-click any province to march or assault!`,
          type: 'info'
        });
      } else {
        setSelectedDivisionId(division.id);
        if (!selectedDivisionIds.includes(division.id)) {
          setSelectedDivisionIds([division.id]);
        }
      }
      playSound('click');
    } else {
      setSelectedDivisionId(division.id);
      setSelectedDivisionIds([division.id]);
      playSound('click');
    }
  };

  // Performance: Throttle dragging with requestAnimationFrame (Requirement 5)
  const handlePointerMoveContainer = useCallback((e: React.PointerEvent) => {
    if (!boxSelection && !isPanning && !dragState) return;

    pendingPointerRef.current = { clientX: e.clientX, clientY: e.clientY };

    if (rafMoveIdRef.current !== null) return;

    rafMoveIdRef.current = requestAnimationFrame(() => {
      rafMoveIdRef.current = null;
      const coords = pendingPointerRef.current;
      if (!coords) return;

      const syntheticEvent = { clientX: coords.clientX, clientY: coords.clientY } as React.PointerEvent;

      if (boxSelection) {
        const mapCoords = getMapCoordinates(syntheticEvent);
        setBoxSelection(prev => prev ? { ...prev, currentX: mapCoords.x, currentY: mapCoords.y } : null);
        return;
      }

      if (isPanning) {
        const dx = coords.clientX - panStartRef.current.x;
        const dy = coords.clientY - panStartRef.current.y;
        setPan({
          x: panOriginRef.current.x + dx,
          y: panOriginRef.current.y + dy
        });
        return;
      }

      if (dragState) {
        const mapCoords = getMapCoordinates(syntheticEvent);
        setDragState(prev => prev ? {
          ...prev,
          currentX: mapCoords.x,
          currentY: mapCoords.y
        } : null);
      }
    });
  }, [boxSelection, isPanning, dragState, getMapCoordinates]);

  const handleSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isMissileTargeting) {
      // Handled in region click
      return;
    }

    // Right-click drag: multi-select of divisions (box select)
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
      const mapCoords = getMapCoordinates(e);
      setBoxSelection({
        startX: mapCoords.x,
        startY: mapCoords.y,
        currentX: mapCoords.x,
        currentY: mapCoords.y
      });
      return;
    }

    // Left-click on empty map space = deselect
    if (e.button === 0 && (e.target === svgRef.current || (e.target as Element).tagName === 'svg')) {
      setSelectedDivisionId(null);
      setSelectedDivisionIds([]);
      setHoveredRegionName(null);
      setBoxSelection(null);
      setDragState(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom(prev => Math.min(8, Math.max(0.5, Number((prev + zoomDelta).toFixed(2)))));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(8, Number((prev + 0.3).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, Number((prev - 0.3).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Trigger brief shake animation on division counter
  const triggerShake = (divisionId: string) => {
    setShakingDivisionId(divisionId);
    playSound('error');
    setTimeout(() => {
      setShakingDivisionId(null);
    }, 450);
  };

  // Coordinated Combat Formula for multiple attacking divisions
  const resolveGroupCombat = (
    attackers: CivilWarDivision[],
    targetRegionName: string,
    targetFaction: FactionData
  ) => {
    const normTarget = normalizeGeoName(targetRegionName);
    const defenders = divisions.filter(
      d => (d.ownerFaction === targetFaction.id || areAllied(d.ownerFaction, targetFaction.id)) && normalizeGeoName(d.regionName) === normTarget && d.strength > 0
    );

    // Frontline HOLD stance entrenchment defense bonus (Requirement 3)
    const isHoldFront = activeFronts.some(f => f.stance === 'HOLD' && defenders.some(d => d.assignedFrontId === f.id));
    const terrainDefenseBonus = isHoldFront ? 1.45 : 1.20;

    // Calculate total attacking force power with specialized unit bonuses
    let totalAttackerPower = 0;
    let totalAttackerStrength = 0;
    attackers.forEach(att => {
      let typeMod = 1.0;
      if (att.type === 'armor') typeMod = 1.30;
      else if (att.type === 'mechanized') typeMod = 1.15;
      else if (att.type === 'artillery') typeMod = 1.25;
      totalAttackerPower += att.strength * (att.morale / 100) * (att.supply / 100) * typeMod;
      totalAttackerStrength += att.strength;
    });

    let defenderPower = 0;
    let totalDefenderStrength = 0;
    if (defenders.length > 0) {
      defenderPower = defenders.reduce((sum, d) => sum + (d.strength * (d.morale / 100) * (d.supply / 100)), 0) * terrainDefenseBonus;
      totalDefenderStrength = defenders.reduce((sum, d) => sum + d.strength, 0);
    } else {
      defenderPower = 1200 * 0.5 * 0.5 * terrainDefenseBonus;
      totalDefenderStrength = 1200;
    }

    const powerRatio = totalAttackerPower / (totalAttackerPower + defenderPower + 1);

    const totalAttackerLosses = Math.min(
      totalAttackerStrength - (attackers.length * 150),
      Math.round((1 - powerRatio) * totalAttackerStrength * 0.22) + (attackers.length * 30)
    );

    const defenderLosses = Math.min(
      totalDefenderStrength,
      Math.round(powerRatio * totalDefenderStrength * 0.48) + 100
    );

    const defendersSurvive = totalDefenderStrength - defenderLosses > 500 && powerRatio < 0.65;
    const attackerIds = new Set(attackers.map(a => a.id));
    const defenderIds = new Set(defenders.map(d => d.id));

    if (!defendersSurvive) {
      // Sector Captured!
      setFactions(prev => prev.map(f => {
        if (f.id === targetFaction.id) {
          return {
            ...f,
            controlledRegions: f.controlledRegions.filter(r => normalizeGeoName(r) !== normTarget)
          };
        }
        if (f.id === playerFactionId) {
          return {
            ...f,
            controlledRegions: Array.from(new Set([...f.controlledRegions, targetRegionName]))
          };
        }
        return f;
      }));

      // Move all attacking units into captured region
      setDivisions(prev => prev.map(d => {
        if (attackerIds.has(d.id)) {
          const perUnitLoss = Math.round(totalAttackerLosses / attackers.length);
          return {
            ...d,
            strength: Math.max(150, d.strength - perUnitLoss),
            morale: Math.max(20, d.morale - 8),
            supply: Math.max(15, d.supply - 12),
            regionName: targetRegionName,
            hasActedThisTurn: true
          };
        }
        if (defenderIds.has(d.id)) {
          return {
            ...d,
            strength: 0,
            morale: 0
          };
        }
        return d;
      }));

      playSound('success');
      setToastMessage({
        text: `🏆 COORDINATED VICTORY: Battle group cleared ${targetRegionName}! Sector captured under allied control.`,
        type: 'success'
      });

      setTimeout(() => {
        checkVictoryConditions();
      }, 400);
    } else {
      // Repelled
      setDivisions(prev => prev.map(d => {
        if (attackerIds.has(d.id)) {
          const perUnitLoss = Math.round(totalAttackerLosses / attackers.length);
          return {
            ...d,
            strength: Math.max(150, d.strength - perUnitLoss),
            morale: Math.max(20, d.morale - 12),
            supply: Math.max(15, d.supply - 15),
            hasActedThisTurn: true
          };
        }
        if (defenderIds.has(d.id)) {
          const perUnitLoss = Math.round(defenderLosses / Math.max(1, defenders.length));
          return {
            ...d,
            strength: Math.max(100, d.strength - perUnitLoss),
            morale: Math.max(20, d.morale - 8)
          };
        }
        return d;
      }));

      playSound('battle');
      setToastMessage({
        text: `Battle of ${targetRegionName}: Hostile defenders held ground. Both forces sustained casualties.`,
        type: 'info'
      });
    }

    // Update casualty statistics
    setCasualtyStats(prev => {
      const attStats = prev[playerFactionId] || { divisionsRemaining: 0, totalManpower: 0, lossesThisTurn: 0, cumulativeLosses: 0, regionsHeld: 0 };
      const defStats = prev[targetFaction.id] || { divisionsRemaining: 0, totalManpower: 0, lossesThisTurn: 0, cumulativeLosses: 0, regionsHeld: 0 };

      return {
        ...prev,
        [playerFactionId]: {
          ...attStats,
          totalManpower: Math.max(0, attStats.totalManpower - totalAttackerLosses),
          lossesThisTurn: attStats.lossesThisTurn + totalAttackerLosses,
          cumulativeLosses: attStats.cumulativeLosses + totalAttackerLosses,
          regionsHeld: !defendersSurvive ? attStats.regionsHeld + 1 : attStats.regionsHeld
        },
        [targetFaction.id]: {
          ...defStats,
          totalManpower: Math.max(0, defStats.totalManpower - defenderLosses),
          lossesThisTurn: defStats.lossesThisTurn + defenderLosses,
          cumulativeLosses: defStats.cumulativeLosses + defenderLosses,
          regionsHeld: !defendersSurvive ? Math.max(0, defStats.regionsHeld - 1) : defStats.regionsHeld
        }
      };
    });
  };

  // Single division combat formula
  const resolveCombat = (
    attacker: CivilWarDivision,
    targetRegionName: string,
    targetFaction: FactionData
  ) => {
    resolveGroupCombat([attacker], targetRegionName, targetFaction);
  };

  // Unified Division Movement & Attack Executor
  const executeDivisionMove = (movingDivision: CivilWarDivision, targetRegion: string) => {
    if (movingDivision.ownerFaction !== playerFactionId) {
      setToastMessage({ text: 'You can only command divisions belonging to your faction.', type: 'error' });
      triggerShake(movingDivision.id);
      return;
    }

    // Check if this is a group movement
    const isGroup = selectedDivisionIds.includes(movingDivision.id) && selectedDivisionIds.length > 1;
    const unitsToMove = isGroup
      ? divisions.filter(d => selectedDivisionIds.includes(d.id) && d.ownerFaction === playerFactionId && !d.hasActedThisTurn)
      : [movingDivision];

    if (unitsToMove.length === 0) {
      setToastMessage({ text: 'All selected divisions have already acted this turn.', type: 'info' });
      return;
    }

    if (unitsToMove.length === 1 && unitsToMove[0].hasActedThisTurn) {
      setToastMessage({
        text: `${unitsToMove[0].name} has already acted this turn. Click 'End Turn' to refresh tactical action points.`,
        type: 'info'
      });
      triggerShake(unitsToMove[0].id);
      return;
    }

    // Dropped or clicked on same origin region = cancel quietly
    if (unitsToMove.length === 1 && normalizeGeoName(targetRegion) === normalizeGeoName(unitsToMove[0].regionName)) {
      return;
    }

    // Target Region Controller
    const targetController = getRegionController(targetRegion);
    const movingOwner = movingDivision.ownerFaction;
    const enemyUnitsInTarget = divisions.filter(
      d => normalizeGeoName(d.regionName) === normalizeGeoName(targetRegion) &&
           areHostile(d.ownerFaction, movingOwner) &&
           d.strength > 0
    );

    const isHostile = enemyUnitsInTarget.length > 0 || (targetController && areHostile(targetController.id, movingOwner));

    // Check if each unit can reach target (adjacent or naval)
    let neededNaval = 0;
    unitsToMove.forEach(u => {
      const originFeat = findFeatureByName(u.regionName);
      const rawOrigin = originFeat?.properties?.NAME_1 || u.regionName;
      const directAdjacents = adjacencyMap[rawOrigin] || [];
      const isLandAdjacent = directAdjacents.some(adj => normalizeGeoName(adj) === normalizeGeoName(targetRegion));
      if (!isLandAdjacent) neededNaval += 1;
    });

    if (neededNaval > 0) {
      if (navalTransports < neededNaval) {
        setToastMessage({
          text: `Amphibious Operation: Requires ${neededNaval} transport ships (you have ${navalTransports}).`,
          type: 'error'
        });
        triggerShake(movingDivision.id);
        return;
      }
      setNavalTransports(prev => Math.max(0, prev - neededNaval));
      setToastMessage({
        text: `⚓ Sealift Assault: Deployed ${neededNaval} Transport Ships for amphibious landing!`,
        type: 'info'
      });
    }

    if (isHostile) {
      // Coordinated Combat Assault
      const defenderFaction = enemyUnitsInTarget.length > 0
        ? (factions.find(f => f.id === enemyUnitsInTarget[0].ownerFaction) || targetController)
        : targetController;

      if (defenderFaction) {
        setToastMessage({
          text: isGroup
            ? `⚔️ Battle Group Assault: ${unitsToMove.length} divisions launched coordinated offensive on ${targetRegion}!`
            : `⚔️ Direct Encounter: ${movingDivision.name} engaged hostile forces at ${targetRegion}!`,
          type: 'info'
        });
        resolveGroupCombat(unitsToMove, targetRegion, defenderFaction);
      }
    } else {
      // Friendly Maneuver / Move
      const unitIdsToMove = new Set(unitsToMove.map(u => u.id));
      setDivisions(prev => prev.map(d => {
        if (unitIdsToMove.has(d.id)) {
          return {
            ...d,
            regionName: targetRegion,
            hasActedThisTurn: true
          };
        }
        return d;
      }));

      // If region was unowned or owned by hostile faction, entering faction captures it
      const normTarget = normalizeGeoName(targetRegion);
      if (!targetController || areHostile(targetController.id, movingOwner)) {
        setFactions(prev => prev.map(f => {
          if (targetController && f.id === targetController.id) {
            return {
              ...f,
              controlledRegions: f.controlledRegions.filter(r => normalizeGeoName(r) !== normTarget)
            };
          }
          if (f.id === movingOwner) {
            return {
              ...f,
              controlledRegions: Array.from(new Set([...f.controlledRegions, targetRegion]))
            };
          }
          return f;
        }));
      }

      playSound('click');
      setToastMessage({
        text: isGroup
          ? `🎖️ Group Maneuver: ${unitsToMove.length} divisions redeployed to ${targetRegion}!`
          : `March Order Executed: ${movingDivision.name} moved to ${targetRegion}.`,
        type: 'success'
      });

      setTimeout(() => {
        checkVictoryConditions();
      }, 300);
    }
  };

  // Launch Precision Cruise Missile Strike
  const executeMissileStrike = (targetRegionName: string) => {
    if (missileStrikesLeft <= 0) {
      setToastMessage({ text: 'All precision missile strikes used this turn. Click End Turn to resupply.', type: 'error' });
      setIsMissileTargeting(false);
      return;
    }
    if (missileStockpile <= 0) {
      setToastMessage({ text: 'Missile stockpile depleted! Await international aid shipment.', type: 'error' });
      setIsMissileTargeting(false);
      return;
    }

    const normTarget = normalizeGeoName(targetRegionName);
    const feat = findFeatureByName(targetRegionName);
    const rawTarget = feat?.properties?.NAME_1 || targetRegionName;
    const center = centroids[rawTarget] || centroids[normTarget] || [dimensions.width / 2, dimensions.height / 2];

    // Consume missile
    setMissileStrikesLeft(prev => prev - 1);
    setMissileStockpile(prev => Math.max(0, prev - 1));
    setIsMissileTargeting(false);

    // Find enemy divisions in this region
    const enemyUnitsInTarget = divisions.filter(
      d => normalizeGeoName(d.regionName) === normTarget &&
           areHostile(d.ownerFaction, playerFactionId) &&
           d.strength > 0
    );

    let totalLosses = 0;
    if (enemyUnitsInTarget.length > 0) {
      setDivisions(prev => prev.map(d => {
        if (normalizeGeoName(d.regionName) === normTarget && areHostile(d.ownerFaction, playerFactionId) && d.strength > 0) {
          const loss = Math.min(d.strength, Math.round(d.strength * 0.35) + 1200);
          totalLosses += loss;
          return {
            ...d,
            strength: Math.max(0, d.strength - loss),
            morale: Math.max(10, d.morale - 25),
            supply: Math.max(10, d.supply - 30)
          };
        }
        return d;
      }));
    } else {
      totalLosses = 2800;
    }

    // Record impact visual effect
    const impactId = `impact_${Date.now()}`;
    setMissileImpacts(prev => [
      ...prev,
      { id: impactId, x: center[0], y: center[1], casualties: totalLosses, timestamp: Date.now() }
    ]);
    setTimeout(() => {
      setMissileImpacts(prev => prev.filter(imp => imp.id !== impactId));
    }, 2200);

    // Record casualty statistics
    const targetController = getRegionController(targetRegionName);
    const targetFactionId = enemyUnitsInTarget[0]?.ownerFaction || targetController?.id;
    if (targetFactionId) {
      setCasualtyStats(prev => {
        const existing = prev[targetFactionId] || {
          divisionsRemaining: 0,
          totalManpower: 50000,
          lossesThisTurn: 0,
          cumulativeLosses: 0,
          regionsHeld: 4
        };
        return {
          ...prev,
          [targetFactionId]: {
            ...existing,
            lossesThisTurn: existing.lossesThisTurn + totalLosses,
            cumulativeLosses: existing.cumulativeLosses + totalLosses,
            totalManpower: Math.max(0, existing.totalManpower - totalLosses)
          }
        };
      });
    }

    playSound('explosion');
    playSound('success');
    setToastMessage({
      text: `🚀 CRUISE MISSILE IMPACT: Precision strike hit ${targetRegionName}! Hostiles suffered -${totalLosses.toLocaleString()} casualties.`,
      type: 'success'
    });

    // Check victory
    setTimeout(() => {
      checkVictoryConditions();
    }, 500);
  };

  // Pointer Up / Drop Resolution & Marquee Box Selection
  const handlePointerUpContainer = (e: React.PointerEvent) => {
    if (boxSelection) {
      const minX = Math.min(boxSelection.startX, boxSelection.currentX);
      const maxX = Math.max(boxSelection.startX, boxSelection.currentX);
      const minY = Math.min(boxSelection.startY, boxSelection.currentY);
      const maxY = Math.max(boxSelection.startY, boxSelection.currentY);
      const width = maxX - minX;
      const height = maxY - minY;

      if (width > 8 && height > 8) {
        // Find player divisions in this bounding box
        const matchingIds: string[] = [];
        divisions.filter(d => d.ownerFaction === playerFactionId && d.strength > 0).forEach(div => {
          const norm = normalizeGeoName(div.regionName);
          const feat = findFeatureByName(div.regionName);
          const rawName = feat?.properties?.NAME_1 || div.regionName;
          const center = centroids[rawName] || centroids[norm];
          if (!center) return;

          const divsInReg = stackedDivisionsMap[norm] || [];
          const count = divsInReg.length;
          const stackIndex = divsInReg.findIndex(d => d.id === div.id);
          let offsetX = 0;
          let offsetY = 0;
          if (count > 1 && stackIndex >= 0) {
            const angle = (2 * Math.PI * stackIndex) / count - Math.PI / 2;
            offsetX = 14 * Math.cos(angle);
            offsetY = 14 * Math.sin(angle);
          }
          const posX = center[0] + offsetX;
          const posY = center[1] + offsetY;

          if (posX >= minX && posX <= maxX && posY >= minY && posY <= maxY) {
            matchingIds.push(div.id);
          }
        });

        if (matchingIds.length > 0) {
          setSelectedDivisionIds(matchingIds);
          setSelectedDivisionId(matchingIds[0]);
          playSound('click');
          setToastMessage({
            text: `Selected ${matchingIds.length} division(s). Left-click-drag from unit to move or assault!`,
            type: 'info'
          });
        } else {
          // Empty space box -> clear multi-selection
          setSelectedDivisionIds([]);
          setSelectedDivisionId(null);
        }
      }

      setBoxSelection(null);
      return;
    }

    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!dragState) return;

    const movingDivision = divisions.find(d => d.id === dragState.divisionId);
    const targetRegion = hoveredRegionName;

    setDragState(null);

    if (!movingDivision || !targetRegion) {
      if (movingDivision) triggerShake(movingDivision.id);
      return;
    }

    executeDivisionMove(movingDivision, targetRegion);
  };

  // Map Region Click Handler (Click-to-Move, Precision Missile Strike, or Select Unit)
  const handleRegionClick = (rawRegionName: string) => {
    setHoveredRegionName(rawRegionName);

    // Precision missile strike mode
    if (isMissileTargeting) {
      executeMissileStrike(rawRegionName);
      return;
    }

    // Click to move selected unit(s)
    if (selectedDivisionId) {
      const selectedUnit = divisions.find(d => d.id === selectedDivisionId);
      if (selectedUnit && selectedUnit.ownerFaction === playerFactionId) {
        if (normalizeGeoName(selectedUnit.regionName) !== normalizeGeoName(rawRegionName)) {
          executeDivisionMove(selectedUnit, rawRegionName);
          return;
        }
      }
    }

    // Otherwise, select friendly unit stationed in this province if available
    const friendlyUnitInRegion = divisions.find(
      d => d.ownerFaction === playerFactionId &&
           normalizeGeoName(d.regionName) === normalizeGeoName(rawRegionName) &&
           d.strength > 0
    );

    if (friendlyUnitInRegion) {
      setSelectedDivisionId(friendlyUnitInRegion.id);
      setSelectedDivisionIds([friendlyUnitInRegion.id]);
      playSound('click');
    }
  };

  // Mobilize New Specialized Divisions with Batch Quantity Support
  const handleMobilizeDivision = (
    type: 'infantry' | 'mechanized' | 'armor' | 'artillery',
    targetRegion: string,
    quantity: number = 1
  ) => {
    const playerFac = factions.find(f => f.id === playerFactionId);
    if (!playerFac) return;

    if (!playerFac.controlledRegions.some(r => normalizeGeoName(r) === normalizeGeoName(targetRegion))) {
      setToastMessage({ text: 'Divisions can only be mobilized in player-controlled territory.', type: 'error' });
      return;
    }

    const typeConfigs = {
      armor: { name: 'Heavy Armored Division', strength: 9000, maxStrength: 10000, morale: 90, supply: 90 },
      mechanized: { name: 'Rapid Mechanized Brigade', strength: 8500, maxStrength: 9000, morale: 88, supply: 88 },
      infantry: { name: 'Elite Mountain Infantry', strength: 7500, maxStrength: 8000, morale: 92, supply: 85 },
      artillery: { name: 'Heavy Siege Artillery Battery', strength: 6000, maxStrength: 7000, morale: 85, supply: 85 }
    };

    const cfg = typeConfigs[type];
    const newUnits: CivilWarDivision[] = [];
    const timestamp = Date.now();

    for (let i = 1; i <= quantity; i++) {
      newUnits.push({
        id: `div_mob_${timestamp}_${i}`,
        name: quantity > 1 ? `${targetRegion} ${i}th ${cfg.name}` : `${targetRegion} ${cfg.name}`,
        type,
        strength: cfg.strength,
        maxStrength: cfg.maxStrength,
        morale: cfg.morale,
        supply: cfg.supply,
        ownerFaction: playerFactionId,
        regionName: targetRegion,
        hasActedThisTurn: true
      });
    }

    setDivisions(prev => [...prev, ...newUnits]);
    setSelectedDivisionId(newUnits[0].id);
    setSelectedDivisionIds(newUnits.map(u => u.id));
    setShowMobilizeModal(false);
    playSound('success');
    setToastMessage({
      text: `🎖️ Mobilization Complete: ${quantity} ${cfg.name}${quantity > 1 ? 's' : ''} deployed to ${targetRegion}!`,
      type: 'success'
    });
  };

  // 7. End Turn Execution (AI Factions Move and Attack, Allied Aid Received, Victory Evaluated)
  const handleEndTurn = () => {
    if (isAiProcessing) return;
    setIsAiProcessing(true);
    playSound('click');

    // Reset precision missile strikes for new turn
    setMissileStrikesLeft(3);

    // Deliver International & UN Foreign Aid (Restricted if unrecognized rebel faction under UN arms embargo)
    let aidCash = 0;
    let aidRecruits = 0;
    let aidMissiles = 0;
    let deliveryDesc = '';

    if (hasSovereignSupport) {
      aidCash = 25000000;
      aidRecruits = 2500;
      aidMissiles = 2;
      deliveryDesc = isRuling
        ? 'UN peacekeepers & sovereign defense logistics delivered 2 Precision Cruise Missiles, funds, and military provisions'
        : `International sponsors (${acceptedPackages.map((p: any) => p.countryName).join(', ')}) delivered 2 Precision Cruise Missiles and allied munitions`;
    } else {
      // Restricted support under UN arms embargo
      aidCash = 1500000; // Local contraband and black-market trade
      aidRecruits = 400; // Local volunteer recruits
      aidMissiles = 0;   // UN Arms Embargo prohibits precision weapon transfers
      deliveryDesc = 'UN Arms Embargo in effect: Precision weapon transfers prohibited. Received limited local contraband provisions and 400 volunteers.';
    }

    if (aidMissiles > 0) {
      setMissileStockpile(prev => prev + aidMissiles);
    }

    setTurnAidReceived({
      cash: aidCash,
      recruits: aidRecruits,
      missiles: aidMissiles,
      turn: turnNumber + 1
    });
    setForeignAidHistory(prev => [
      ...prev,
      {
        turn: turnNumber + 1,
        description: deliveryDesc,
        type: hasSovereignSupport ? 'Sovereign Logistics' : 'Restricted (Embargo)'
      }
    ]);

    // Notify parent app of campaign turn / week advancement
    if (onTurnAdvance) {
      onTurnAdvance();
    }

    const nextTurn = turnNumber + 1;
    setTurnNumber(nextTurn);

    // AI Moves & Combat Logic
    setTimeout(() => {
      const updatedDivisions = [...divisions];
      const aiDivisions = updatedDivisions.filter(d => d.ownerFaction !== playerFactionId && d.strength > 0);

      // Reset 'hasActedThisTurn' for next round & replenish supplies + volunteer reinforcements
      updatedDivisions.forEach(d => {
        d.hasActedThisTurn = false;
        d.supply = Math.min(100, d.supply + (d.ownerFaction === playerFactionId ? 15 : 5));
        if (d.ownerFaction === playerFactionId && d.strength < d.maxStrength) {
          d.strength = Math.min(d.maxStrength, d.strength + 500);
        }
      });

      // 0a. Periodic Foreign Expeditionary Battalion Arrivals (Requirement 2)
      const conflictDef = INITIAL_CIVIL_WARS[country.id];
      const factionBacker = conflictDef?.factions.find(f => f.id === playerFactionId)?.foreignBacker;
      const supporter = resolveForeignSupporter(factionBacker, foreignAidPackages);
      if (supporter && nextTurn % 3 === 0) {
        const variantIdx = Math.floor(nextTurn / 3) % supporter.equipmentVariants.length;
        const variant = supporter.equipmentVariants[variantIdx];
        const playerFac = factions.find(f => f.id === playerFactionId);
        const safeReg = playerFac?.controlledRegions[0] || (geoData?.features?.[0]?.properties?.NAME_1) || 'Capital';
        const newExpDiv: CivilWarDivision = {
          id: `div_exp_turn_${nextTurn}_${supporter.countryId}`,
          name: `${supporter.countryName} ${variant.name} Task Force`,
          type: variant.type,
          strength: variant.strength,
          maxStrength: variant.strength,
          morale: 95,
          supply: 95,
          ownerFaction: playerFactionId,
          regionName: safeReg,
          isExpeditionary: true,
          supporterCountryId: supporter.countryId,
          supporterCountryName: supporter.countryName,
          supporterFlag: supporter.flag,
          equipmentName: variant.name,
          hasActedThisTurn: false
        };
        updatedDivisions.push(newExpDiv);
        playSound('success');
        setToastMessage({
          text: `🎖️ Foreign Expeditionary Arrival: ${supporter.flag} ${supporter.countryName} deployed ${variant.name} Task Force to ${safeReg}!`,
          type: 'success'
        });
      }

      // 0b. Advance together: Fronts set to 'ADVANCE' order their assigned divisions to push into border hostiles (Requirement 3)
      activeFronts.filter(f => f.stance === 'ADVANCE').forEach(front => {
        const assignedUnits = updatedDivisions.filter(d => d.assignedFrontId === front.id && d.ownerFaction === playerFactionId && d.strength > 0);
        if (assignedUnits.length > 0 && front.borderPairs.length > 0) {
          assignedUnits.forEach((unit, uIdx) => {
            const targetPair = front.borderPairs[uIdx % front.borderPairs.length];
            if (targetPair) {
              unit.regionName = targetPair.hostile;
              unit.hasActedThisTurn = true;
            }
          });
        }
      });

      // 1. AI Maneuvers: AI divisions reposition or advance into strategic sectors
      aiDivisions.forEach(aiUnit => {
        if (aiUnit.strength < 2000) return; // Do not advance if crippled

        const rawOrigin = findFeatureByName(aiUnit.regionName)?.properties?.NAME_1 || aiUnit.regionName;
        const adjacents = adjacencyMap[rawOrigin] || [];
        if (adjacents.length === 0) return;

        // Find adjacent sectors containing hostile units or controlled by hostile factions
        const hostileTargets = adjacents.filter(adj => {
          const ctrl = getRegionController(adj);
          const hasHostileUnit = updatedDivisions.some(
            d => normalizeGeoName(d.regionName) === normalizeGeoName(adj) &&
                 areHostile(d.ownerFaction, aiUnit.ownerFaction) &&
                 d.strength > 0
          );
          return (ctrl && areHostile(ctrl.id, aiUnit.ownerFaction)) || hasHostileUnit;
        });

        if (hostileTargets.length > 0 && Math.random() < 0.65) {
          // AI Unit advances into contested/hostile region
          const target = hostileTargets[Math.floor(Math.random() * hostileTargets.length)];
          aiUnit.regionName = target;
        } else {
          // AI Repositions to friendly or allied sector
          const friendlyTargets = adjacents.filter(adj => {
            const ctrl = getRegionController(adj);
            return !ctrl || areAllied(ctrl.id, aiUnit.ownerFaction);
          });
          if (friendlyTargets.length > 0 && Math.random() < 0.40) {
            const target = friendlyTargets[Math.floor(Math.random() * friendlyTargets.length)];
            aiUnit.regionName = target;
          }
        }
      });

      // 2. INDEPENDENT REGION RESOLUTION
      // Resolve each region independently:
      // - If units from 2+ hostile factions occupy it, run combat; the winner (strongest surviving force) takes control.
      // - If the region is empty of hostiles, the entering faction takes it (unless already owned by an ally).
      // - Region ownership is set to the faction that actually owns the surviving units — never to the player by default!
      const allRegionNames = (geoData?.features || []).map((f: any) => f.properties?.NAME_1 || f.properties?.name || '').filter(Boolean);
      const regionSet = new Set<string>(allRegionNames);
      updatedDivisions.forEach(d => regionSet.add(d.regionName));
      factions.forEach(f => f.controlledRegions.forEach(r => regionSet.add(r)));

      // Current controller map: normRegion -> factionId
      const regionOwnerMap = new Map<string, string>();
      factions.forEach(f => {
        f.controlledRegions.forEach(r => {
          regionOwnerMap.set(normalizeGeoName(r), f.id);
        });
      });

      const newTurnLosses: Record<string, number> = {};
      let battlesFoughtCount = 0;

      Array.from(regionSet).forEach(regionName => {
        const normRegion = normalizeGeoName(regionName);
        const unitsInRegion = updatedDivisions.filter(
          d => normalizeGeoName(d.regionName) === normRegion && d.strength > 0
        );

        if (unitsInRegion.length === 0) {
          // Region is empty of troops: ownership remains unchanged
          return;
        }

        // Group surviving units by faction
        const factionMap = new Map<string, CivilWarDivision[]>();
        unitsInRegion.forEach(u => {
          if (!factionMap.has(u.ownerFaction)) {
            factionMap.set(u.ownerFaction, []);
          }
          factionMap.get(u.ownerFaction)!.push(u);
        });

        const factionsPresent = Array.from(factionMap.keys());

        // Check if units from 2+ hostile factions occupy it
        const hasHostileConflict = factionsPresent.some(f1 =>
          factionsPresent.some(f2 => f1 !== f2 && areHostile(f1, f2))
        );

        if (hasHostileConflict) {
          battlesFoughtCount++;
          // Run Combat: calculate total power per faction
          const factionPower: Record<string, number> = {};
          const factionTotalStrength: Record<string, number> = {};

          factionsPresent.forEach(fId => {
            const divs = factionMap.get(fId)!;
            let p = 0;
            let s = 0;
            divs.forEach(d => {
              let mod = 1.0;
              if (d.type === 'armor') mod = 1.3;
              else if (d.type === 'mechanized') mod = 1.15;
              else if (d.type === 'artillery') mod = 1.25;
              p += d.strength * (d.morale / 100) * (d.supply / 100) * mod;
              s += d.strength;
            });
            factionPower[fId] = p;
            factionTotalStrength[fId] = s;
          });

          // Winner is the faction with the highest power
          let winningFactionId = factionsPresent[0];
          let maxPower = -1;
          factionsPresent.forEach(fId => {
            if (factionPower[fId] > maxPower) {
              maxPower = factionPower[fId];
              winningFactionId = fId;
            }
          });

          // Inflict casualties
          const enemyFactions = factionsPresent.filter(fId => fId !== winningFactionId && areHostile(winningFactionId, fId));
          const totalEnemyPower = enemyFactions.reduce((sum, fId) => sum + (factionPower[fId] || 0), 0);

          // Winner sustains moderate casualties
          const winnerDivs = factionMap.get(winningFactionId)!;
          const winnerLossPercent = Math.min(0.30, (totalEnemyPower / (maxPower + totalEnemyPower + 1)) * 0.4);
          const totalWinnerLoss = Math.round(factionTotalStrength[winningFactionId] * winnerLossPercent);
          newTurnLosses[winningFactionId] = (newTurnLosses[winningFactionId] || 0) + totalWinnerLoss;

          winnerDivs.forEach(d => {
            const perDivLoss = Math.round(totalWinnerLoss / winnerDivs.length);
            d.strength = Math.max(150, d.strength - perDivLoss);
            d.morale = Math.max(25, d.morale - 5);
            d.supply = Math.max(15, d.supply - 10);
          });

          // Hostile defeated factions suffer severe casualties or retreat
          enemyFactions.forEach(fId => {
            const enemyDivs = factionMap.get(fId)!;
            const enemyLossPercent = Math.min(0.85, (maxPower / (maxPower + (factionPower[fId] || 1))) * 0.7 + 0.15);
            const totalEnemyLoss = Math.round(factionTotalStrength[fId] * enemyLossPercent);
            newTurnLosses[fId] = (newTurnLosses[fId] || 0) + totalEnemyLoss;

            enemyDivs.forEach(d => {
              const perDivLoss = Math.round(totalEnemyLoss / enemyDivs.length);
              d.strength = Math.max(0, d.strength - perDivLoss);
              d.morale = Math.max(10, d.morale - 25);
              d.supply = Math.max(10, d.supply - 20);
            });
          });

          // Set region ownership to the winning faction (never player by default!)
          regionOwnerMap.set(normRegion, winningFactionId);
        } else {
          // Region contains units from only 1 faction or mutually allied factions
          // Find the faction with the largest force present
          let largestFactionId = factionsPresent[0];
          let largestStrength = -1;
          factionsPresent.forEach(fId => {
            const fStr = (factionMap.get(fId) || []).reduce((sum, d) => sum + d.strength, 0);
            if (fStr > largestStrength) {
              largestStrength = fStr;
              largestFactionId = fId;
            }
          });

          const currentOwner = regionOwnerMap.get(normRegion);
          // If current owner is hostile to the occupying forces (or region is unowned):
          // "If the region is empty of hostiles, the entering faction takes it."
          if (!currentOwner || areHostile(currentOwner, largestFactionId)) {
            regionOwnerMap.set(normRegion, largestFactionId);
          }
          // If current owner is allied, territory remains with the existing ally
        }
      });

      // Update factions with new territorial control
      setFactions(prev => {
        return prev.map(f => {
          const controlled: string[] = [];
          regionOwnerMap.forEach((ownerId, normReg) => {
            if (ownerId === f.id) {
              const feat = (geoData?.features || []).find((feat: any) => normalizeGeoName(feat.properties?.NAME_1 || feat.properties?.name || '') === normReg);
              const origName = feat?.properties?.NAME_1 || feat?.properties?.name || normReg;
              controlled.push(origName);
            }
          });
          return {
            ...f,
            controlledRegions: Array.from(new Set(controlled))
          };
        });
      });

      // Commit division casualties & updates
      setDivisions(updatedDivisions);

      // Reset turn loss counters & apply battle casualties
      setCasualtyStats(prev => {
        const next: Record<string, FactionStats> = {};
        (Object.entries(prev) as [string, FactionStats][]).forEach(([fId, stat]) => {
          const activeDivs = updatedDivisions.filter(d => d.ownerFaction === fId && d.strength > 0);
          const roundLoss = newTurnLosses[fId] || 0;
          next[fId] = {
            ...stat,
            divisionsRemaining: activeDivs.length,
            totalManpower: Math.max(0, activeDivs.reduce((sum, d) => sum + d.strength, 0) - roundLoss),
            lossesThisTurn: roundLoss,
            cumulativeLosses: (stat.cumulativeLosses || 0) + roundLoss
          };
        });
        return next;
      });

      setIsAiProcessing(false);
      setToastMessage({
        text: battlesFoughtCount > 0
          ? `🕊️ Turn ${nextTurn}: ${battlesFoughtCount} regional clashes resolved across active fronts! International aid delivered.`
          : `🕊️ Turn ${nextTurn}: International logistics resupplied active fronts with munitions and volunteers.`,
        type: 'info'
      });

      checkVictoryConditions();
    }, 600);
  };

  // Selected Division Data
  const selectedDivision = useMemo(() => {
    return divisions.find(d => d.id === selectedDivisionId) || null;
  }, [divisions, selectedDivisionId]);

  // Error State Handling (Requirement 5)
  if (mapError || fitError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300 p-8 text-center select-none font-mono text-sm">
        {mapError || `Map data unavailable — geo/${iso3}.geojson missing`}
      </div>
    );
  }

  // Loading State
  if (isLoading || !geoData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-200 p-8 text-center select-none">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Aligning Tactical Grid & NATO Division Counters...
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMoveContainer}
      onPointerUp={handlePointerUpContainer}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative flex-1 min-h-0 w-full h-[60vh] lg:h-full flex flex-col overflow-hidden select-none ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
      }`}
    >
      {/* 1. TOP-LEFT LEGEND (Requirement 2) */}
      <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl min-w-[210px] pointer-events-auto">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Flag className="w-3 h-3 text-blue-400" />
          <span>Territorial Control Legend</span>
        </div>
        <div className="space-y-1.5">
          {factions.map(f => {
            const isPlayer = f.id === playerFactionId;
            return (
              <div key={f.id} className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: f.color }} />
                  <span className="font-bold text-slate-200 truncate text-[11px]">{f.name}</span>
                </div>
                <span className="text-[11px] font-mono font-extrabold text-slate-300 shrink-0">
                  {f.controlledRegions.length} reg.
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Active Turn:</span>
          <span className="text-amber-400 font-mono font-bold">Turn {turnNumber}</span>
        </div>
      </div>

      {/* TOP-CENTER 90% COALITION HEGEMONY & COMMAND CONTROLS (Requirement 1 & 2) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl min-w-[380px] max-w-lg pointer-events-auto flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-1 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-slate-200 truncate">
            <Trophy className={`w-3.5 h-3.5 shrink-0 ${coalitionTerritoryPercent >= 90 ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="truncate">{playerCoalition.name}</span>
          </div>
          <span className={`font-mono font-black shrink-0 ${coalitionTerritoryPercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {coalitionTerritoryPercent}% / 90%
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative mb-2 border border-slate-700/60">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              coalitionTerritoryPercent >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
            }`}
            style={{ width: `${Math.min(100, (coalitionTerritoryPercent / 90) * 100)}%` }}
          />
        </div>

        {/* Command Action Buttons */}
        <div className="flex items-center justify-between gap-1.5 w-full pt-1 border-t border-slate-800/80">
          <button
            onClick={() => {
              const playerFac = factions.find(f => f.id === playerFactionId);
              if (playerFac && playerFac.controlledRegions.length > 0) {
                setMobilizeRegion(playerFac.controlledRegions[0]);
                setShowMobilizeModal(true);
              } else {
                setToastMessage({ text: 'No controlled territory available to mobilize.', type: 'error' });
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors shadow cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Mobilize</span>
          </button>

          <button
            onClick={() => {
              if (missileStockpile <= 0) {
                setToastMessage({ text: 'No cruise missiles in stockpile. Awaiting UN/allied foreign aid shipment.', type: 'error' });
                return;
              }
              if (missileStrikesLeft <= 0) {
                setToastMessage({ text: 'Max strikes per turn used. End Turn to reload launchers.', type: 'info' });
                return;
              }
              setIsMissileTargeting(prev => !prev);
              playSound('click');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
              isMissileTargeting
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>Missile ({missileStrikesLeft}/3)</span>
          </button>

          <button
            onClick={() => {
              setIsBoxSelectMode(prev => !prev);
              playSound('click');
            }}
            className={`px-2 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
              isBoxSelectMode
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Toggle box selection (or Shift+Drag on map)"
          >
            <span>⬚ Box Select</span>
          </button>

          <button
            onClick={() => setShowForeignAidModal(true)}
            className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
            title="View international and UN foreign aid logistics"
          >
            <span>🕊️ Aid</span>
          </button>

          {expeditionaryDivisions.length > 0 && (
            <div 
              className="px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-bold text-[10px] flex items-center gap-1 cursor-default shadow-sm"
              title={`${expeditionaryDivisions.length} Foreign Expeditionary Battalion(s) active`}
            >
              <span>{expeditionaryDivisions[0]?.supporterFlag || '🌐'}</span>
              <span>Expeditionary ({expeditionaryDivisions.length})</span>
            </div>
          )}

          <button
            id="btn-peace-negotiations"
            onClick={() => {
              setShowPeaceModal(true);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg bg-teal-950/70 hover:bg-teal-900 border border-teal-500/50 text-teal-300 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
            title="Open Peace & Strategic Settlement Negotiations"
          >
            <Handshake className="w-3 h-3 text-teal-400" />
            <span>Peace & Settlement</span>
          </button>
        </div>
      </div>

      {/* 2. TOP-RIGHT CASUALTIES PANEL (Requirement 5) */}
      <div className="absolute top-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 shadow-2xl min-w-[280px] max-w-xs pointer-events-auto max-h-[85vh] overflow-y-auto">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-rose-500" />
            <span>Casualties & Forces</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-800 text-slate-300">
            LIVE WAR HUD
          </span>
        </div>

        {/* Foreign Expeditionary Battalions (Requirement 2) */}
        {expeditionaryDivisions.length > 0 && (
          <div className="mb-2.5 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
            <div className="text-[9px] font-black uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>🌐</span>
                <span>Expeditionary Forces</span>
              </span>
              <span className="text-indigo-400 font-mono text-[9px] font-bold">
                {expeditionaryDivisions.length} ACTIVE
              </span>
            </div>

            <div className="space-y-1.5">
              {expeditionaryDivisions.map(div => (
                <div key={div.id} className="p-1.5 rounded bg-slate-900/90 border border-slate-800 text-[10px]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-100 flex items-center gap-1 truncate">
                      <span>{div.supporterFlag}</span>
                      <span className="truncate">{div.name}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">{div.strength.toLocaleString()}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 flex items-center justify-between">
                    <span className="truncate">Equip: <strong className="text-amber-300">{div.equipmentName || 'Heavy Armor'}</strong></span>
                    <span className="shrink-0 ml-1">At: <strong className="text-slate-200">{div.regionName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic War Sides & Alliance Blocs Alignment */}
        {conflictSides && conflictSides.length > 0 && (
          <div className="mb-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>War Sides & Fronts</span>
              <span className="text-amber-400 font-mono text-[9px]">{conflictSides.length} BLOCS</span>
            </div>

            {/* Structured Sides list */}
            <div className="space-y-1.5 mb-2">
              {conflictSides.map((side) => {
                const membersFormatted = side.members.map(mId => {
                  const fac = factions.find(f => f.id === mId);
                  if (!fac) return mId;
                  const match = fac.name.match(/\(([^)]+)\)/);
                  return match ? match[1].split('/')[0].trim() : fac.name.split(' ')[0];
                }).join(' + ');

                return (
                  <div key={side.id} className="flex items-start gap-1.5 text-[10px] leading-tight">
                    <span className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: side.color }} />
                    <div>
                      <span className="font-bold text-slate-200">{side.name}: </span>
                      <span className="text-slate-300 font-mono">{membersFormatted}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Line: Side A: X + Y vs Side B: Z + W */}
            <div className="pt-1.5 border-t border-slate-800/80 text-[9px] font-mono text-amber-300/90 leading-tight">
              {conflictSides.map(s => {
                const names = s.members.map(mId => {
                  const fac = factions.find(f => f.id === mId);
                  const match = fac?.name.match(/\(([^)]+)\)/);
                  return match ? match[1].split('/')[0].trim() : (fac?.name.split(' ')[0] || mId);
                }).join(' + ');
                return `${s.name}: ${names}`;
              }).join(' vs ')}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {factions.map(f => {
            const isPlayer = f.id === playerFactionId;
            const stats = casualtyStats[f.id] || {
              divisionsRemaining: divisions.filter(d => d.ownerFaction === f.id && d.strength > 0).length,
              totalManpower: divisions.filter(d => d.ownerFaction === f.id).reduce((sum, d) => sum + d.strength, 0),
              lossesThisTurn: 0,
              cumulativeLosses: 0,
              regionsHeld: f.controlledRegions.length
            };

            return (
              <div 
                key={f.id} 
                className={`p-2 rounded-lg border ${
                  isPlayer ? 'bg-blue-950/20 border-blue-500/30' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                    <span className="font-bold text-xs text-slate-200 truncate">{f.name}</span>
                  </div>
                  {isPlayer && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      PLAYER
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-slate-400">
                  <div>Divisions: <span className="text-slate-200 font-bold">{stats.divisionsRemaining}</span></div>
                  <div>Manpower: <span className="text-slate-200 font-bold">{stats.totalManpower.toLocaleString()}</span></div>
                  <div>Turn Loss: <span className="text-rose-400 font-bold">-{stats.lossesThisTurn.toLocaleString()}</span></div>
                  <div>Total Loss: <span className="text-rose-400 font-bold">-{stats.cumulativeLosses.toLocaleString()}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FLOATING ACTION TOAST BANNER */}
      {toastMessage && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-100 shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-rose-500" />}
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === 'info' && <Target className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Precision Missile Targeting Banner */}
      {isMissileTargeting && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-rose-950/95 border-2 border-rose-500 text-rose-100 px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-3 animate-pulse">
          <Crosshair className="w-4 h-4 text-rose-400 animate-spin" />
          <span>🎯 PRECISION CRUISE MISSILE TARGETING: Click any province on the map to strike hostile positions! (Strikes left: {missileStrikesLeft} | Stock: {missileStockpile})</span>
          <button
            onClick={() => setIsMissileTargeting(false)}
            className="px-2.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-bold uppercase cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 4. MAIN INTERACTIVE SVG BATTLE MAP */}
      <div 
        ref={mapContainerRef}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex-1 min-h-0 w-full h-[60vh] lg:h-full overflow-hidden bg-slate-950"
      >
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full block ${isMissileTargeting ? 'cursor-crosshair' : 'cursor-crosshair'}`}
          onPointerDown={handleSvgPointerDown}
          onContextMenu={(e) => e.preventDefault()}
        >
          <defs>
            {/* Contested stripes pattern for contested regions (GNU blue + LNA red) */}
            <pattern id="contested-stripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#dc2626" strokeWidth="6" />
              <line x1="6" y1="0" x2="6" y2="12" stroke="#2563eb" strokeWidth="6" />
            </pattern>
            {/* Glow filters for player division border highlight */}
            <filter id="player-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
            <filter id="shake-filter">
              <feOffset dx="-2" dy="0" />
            </filter>
          </defs>

          {/* Scaled and Panned Map Content Layer */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: `${dimensions.width / 2}px ${dimensions.height / 2}px`,
              transition: isPanning ? 'none' : 'transform 0.05s ease-out'
            }}
          >
            {/* REGION POLYGONS - Render one <path> per admin-1 feature, keyed by NAME_1 */}
            <g className="regions-layer">
            {geoData.features.map((feat: any, idx: number) => {
              const rawName = feat.properties?.NAME_1 || feat.properties?.name || `Region_${idx}`;
              const norm = normalizeGeoName(rawName);
              const pathStr = featurePaths[rawName] || featurePaths[norm] || (pathGenerator ? pathGenerator(feat) : '');
              if (!pathStr) return null;

              const controller = getRegionController(rawName);
              const isHovered = hoveredRegionName && normalizeGeoName(hoveredRegionName) === norm;
              const isReachable = reachableAdjacentRegions.has(norm);

              // Check if contested: multiple opposing divisions present or hostile forces in province
              const isContested = contestedRegions.has(norm);

              // Controlling faction coloring: GNU blue, LNA red, contested striped
              let fillColor = '#334155';
              if (isContested) {
                fillColor = 'url(#contested-stripes)';
              } else if (controller) {
                if (controller.id === 'LY_GNU' || controller.id.includes('GNU') || controller.isGovernment) {
                  fillColor = '#2563eb'; // GNU blue
                } else if (controller.id === 'LY_LNA' || controller.id.includes('LNA')) {
                  fillColor = '#dc2626'; // LNA red
                } else {
                  fillColor = controller.color || '#3b82f6';
                }
              }

              let fillOpacity = isHovered ? 0.95 : isReachable ? 0.85 : 0.72;

              return (
                <path
                  key={feat.properties?.GID_1 ? `${feat.properties.GID_1}_${idx}` : `region_feat_${idx}_${rawName}`}
                  d={pathStr}
                  fill={fillColor}
                  fillOpacity={fillOpacity}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  className="transition-colors duration-150 cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    if (e.button === 2) {
                      e.preventDefault();
                      const mapCoords = getMapCoordinates(e);
                      setBoxSelection({
                        startX: mapCoords.x,
                        startY: mapCoords.y,
                        currentX: mapCoords.x,
                        currentY: mapCoords.y
                      });
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onPointerEnter={() => setHoveredRegionName(rawName)}
                  onPointerLeave={() => {
                    if (hoveredRegionName === rawName) setHoveredRegionName(null);
                  }}
                  onClick={() => {
                    handleRegionClick(rawName);
                  }}
                />
              );
            })}
          </g>

          {/* REGION LABELS - rendered once per region at its centroid, hidden if region is smaller than label */}
          <g className="labels-layer pointer-events-none select-none">
            {(() => {
              const renderedLabels = new Set<string>();
              return geoData.features.map((feat: any, fIdx: number) => {
                const rawName = feat.properties?.NAME_1 || feat.properties?.name || '';
                if (!rawName) return null;
                const normName = normalizeGeoName(rawName);
                if (renderedLabels.has(normName)) return null;
                renderedLabels.add(normName);

                const center = centroids[rawName] || centroids[normName];
                if (!center) return null;

                // Check bounding box size to hide if region is smaller than label
                if (pathGenerator) {
                  const bounds = pathGenerator.bounds(feat);
                  if (bounds) {
                    const [[x0, y0], [x1, y1]] = bounds;
                    const width = x1 - x0;
                    const height = y1 - y0;
                    const approxLabelWidth = rawName.length * 6.5;
                    if (width < approxLabelWidth || height < 16) {
                      return null; // Region too small for label
                    }
                  }
                }

                // If units exist in region, position label above centroid so NATO counters don't collide
                const hasUnits = Boolean(stackedDivisionsMap[normName]?.length);
                const labelY = hasUnits ? center[1] - 22 : center[1];

                return (
                  <text
                    key={`label_${normName}_${fIdx}`}
                    x={center[0]}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[9px] font-black uppercase tracking-wider fill-white/85 select-none pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]"
                  >
                    {rawName}
                  </text>
                );
              });
            })()}
          </g>

          {/* DRAG-AND-DROP TACTICAL ARROW LINE */}
          {dragState && (
            <g className="drag-line-layer pointer-events-none">
              <line
                x1={dragState.startX}
                y1={dragState.startY}
                x2={dragState.currentX}
                y2={dragState.currentY}
                stroke={
                  hoveredRegionName && reachableAdjacentRegions.has(normalizeGeoName(hoveredRegionName))
                    ? '#ef4444'
                    : '#38bdf8'
                }
                strokeWidth={2.5}
                strokeDasharray="5, 3"
              />
              <circle
                cx={dragState.currentX}
                cy={dragState.currentY}
                r={6}
                fill="#38bdf8"
                fillOpacity={0.8}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </g>
          )}

          {/* FRONTLINES LAYER: Border line between hostile sides (Requirement 3) */}
          <g className="frontlines-layer pointer-events-auto">
            {activeFronts.map(front => {
              const pairs = front.borderPairs;
              if (pairs.length === 0) return null;

              return (
                <g key={front.id} className="front-group">
                  {/* Border Frontline Segments */}
                  {pairs.map((pair, pIdx) => {
                    const featF = findFeatureByName(pair.friendly);
                    const featH = findFeatureByName(pair.hostile);
                    const rawF = featF?.properties?.NAME_1 || pair.friendly;
                    const rawH = featH?.properties?.NAME_1 || pair.hostile;
                    const cF = centroids[rawF] || centroids[normalizeGeoName(pair.friendly)];
                    const cH = centroids[rawH] || centroids[normalizeGeoName(pair.hostile)];
                    if (!cF || !cH) return null;

                    const mx = (cF[0] + cH[0]) / 2;
                    const my = (cF[1] + cH[1]) / 2;
                    const dx = cH[0] - cF[0];
                    const dy = cH[1] - cF[1];
                    const len = Math.hypot(dx, dy) || 1;
                    const nx = -dy / len;
                    const ny = dx / len;
                    const span = 26;

                    return (
                      <g key={`front_seg_${front.id}_${pIdx}`}>
                        {/* Tactically styled frontline */}
                        <line
                          x1={mx - nx * span}
                          y1={my - ny * span}
                          x2={mx + nx * span}
                          y2={my + ny * span}
                          stroke={front.hostileFactionColor || '#ef4444'}
                          strokeWidth={3}
                          strokeDasharray={front.stance === 'ADVANCE' ? '4 2' : '6 4'}
                          strokeOpacity={0.85}
                          strokeLinecap="round"
                        />
                        {/* Perpendicular tick mark pointing into hostile province */}
                        <line
                          x1={mx}
                          y1={my}
                          x2={mx + (dx / len) * 8}
                          y2={my + (dy / len) * 8}
                          stroke={front.hostileFactionColor || '#ef4444'}
                          strokeWidth={2}
                          strokeOpacity={0.7}
                        />
                      </g>
                    );
                  })}

                  {/* Frontline Center Command Tag / Stance Badge */}
                  {(() => {
                    const midPair = pairs[Math.floor(pairs.length / 2)];
                    const cF = centroids[midPair?.friendly] || centroids[normalizeGeoName(midPair?.friendly)];
                    const cH = centroids[midPair?.hostile] || centroids[normalizeGeoName(midPair?.hostile)];
                    if (!cF || !cH) return null;
                    const tagX = (cF[0] + cH[0]) / 2;
                    const tagY = (cF[1] + cH[1]) / 2 - 12;

                    return (
                      <g
                        className="front-tag cursor-pointer select-none"
                        transform={`translate(${tagX}, ${tagY})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFrontStance(front.id);
                        }}
                      >
                        <rect
                          x={-55}
                          y={-10}
                          width={110}
                          height={20}
                          rx={4}
                          fill="#090d16"
                          stroke={front.stance === 'ADVANCE' ? '#f59e0b' : '#38bdf8'}
                          strokeWidth={1.5}
                          fillOpacity={0.92}
                        />
                        <text
                          x={0}
                          y={-1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-[8.5px] font-black fill-white uppercase tracking-wider pointer-events-none"
                        >
                          {front.name}
                        </text>
                        <text
                          x={0}
                          y={6.5}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`text-[7px] font-black uppercase tracking-widest pointer-events-none ${
                            front.stance === 'ADVANCE' ? 'fill-amber-400' : 'fill-emerald-400'
                          }`}
                        >
                          {front.stance === 'ADVANCE' ? '⚔️ ADVANCE' : '🛡️ HOLD'} • {front.assignedDivisionIds.length} DIVS
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </g>

          {/* NATO DIVISION COUNTER ICONS AT CENTROIDS (Requirement 1, 2 & 5: memoized DivisionCounter) */}
          <g className="divisions-layer">
            {(Object.entries(stackedDivisionsMap) as [string, CivilWarDivision[]][]).map(([normRegion, divsInRegion]) => {
              const feat = findFeatureByName(normRegion);
              const rawName = feat?.properties?.NAME_1 || divsInRegion[0]?.regionName || '';
              const center = centroids[rawName] || centroids[normRegion];
              if (!center) return null;

              const count = divsInRegion.length;

              return (
                <g key={`stack_group_${normRegion}`}>
                  {divsInRegion.map((div, stackIndex) => {
                    const isPlayer = div.ownerFaction === playerFactionId;
                    const isAllied = areAllied(div.ownerFaction, playerFactionId) && !isPlayer;
                    const isSelected = selectedDivisionIds.includes(div.id) || selectedDivisionId === div.id;
                    const isShaking = shakingDivisionId === div.id;

                    // Fan out in a small circle around centroid if multiple divisions occupy region
                    let offsetX = 0;
                    let offsetY = 0;
                    if (count > 1) {
                      const angle = (2 * Math.PI * stackIndex) / count - Math.PI / 2;
                      offsetX = 14 * Math.cos(angle);
                      offsetY = 14 * Math.sin(angle);
                    }
                    const posX = center[0] + offsetX;
                    const posY = center[1] + offsetY;

                    const faction = factions.find(f => f.id === div.ownerFaction);
                    const factionColor = faction?.color || (div.ownerFaction === 'LY_GNU' ? '#2563eb' : '#dc2626');
                    const factionShortName = getFactionShortName(div.ownerFaction, faction?.name || div.ownerFaction);

                    return (
                      <DivisionCounter
                        key={div.id}
                        division={div}
                        posX={posX}
                        posY={posY}
                        isSelected={isSelected}
                        isShaking={isShaking}
                        isPlayer={isPlayer}
                        isAllied={isAllied}
                        coalitionColor={playerCoalition.color}
                        factionColor={factionColor}
                        factionShortName={factionShortName}
                        hasActedThisTurn={Boolean(div.hasActedThisTurn)}
                        onPointerDown={handlePointerDownCounter}
                        onClick={handleCounterClick}
                      />
                    );
                  })}

                  {/* Stack Count Badge at Centroid if multiple divisions occupy this region */}
                  {count > 1 && (
                    <g
                      className="stack-count-badge pointer-events-none select-none"
                      transform={`translate(${center[0]}, ${center[1]})`}
                    >
                      <circle r={10} fill="#090d16" stroke="#fbbf24" strokeWidth={1.5} />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#fbbf24"
                        fontSize={10}
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {count}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Marquee Box Selection Overlay */}
          {boxSelection && (
            <rect
              x={Math.min(boxSelection.startX, boxSelection.currentX)}
              y={Math.min(boxSelection.startY, boxSelection.currentY)}
              width={Math.abs(boxSelection.currentX - boxSelection.startX)}
              height={Math.abs(boxSelection.currentY - boxSelection.startY)}
              fill="#38bdf8"
              fillOpacity={0.15}
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              pointerEvents="none"
            />
          )}

          {/* Cruise Missile Strike Impact Explosions */}
          {missileImpacts.map(imp => (
            <g key={imp.id} className="pointer-events-none">
              <circle cx={imp.x} cy={imp.y} r={32} fill="#ef4444" fillOpacity={0.4} stroke="#f97316" strokeWidth={3} className="animate-ping" />
              <circle cx={imp.x} cy={imp.y} r={16} fill="#f59e0b" fillOpacity={0.8} />
              <text x={imp.x} y={imp.y - 20} textAnchor="middle" fill="#fca5a5" fontWeight="900" fontSize={11}>
                -{imp.casualties.toLocaleString()}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Floating Zoom & Pan Controls (Requirement 6) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-2xl pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-bold"
        >
          +
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset to Fit"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] font-mono"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-bold"
        >
          -
        </button>
      </div>
    </div>

      {/* 5. BOTTOM BAR: SELECTED DIVISION DETAILS & END TURN BUTTON (Requirement 6) */}
      <div className="z-30 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Selected Unit Details */}
        <div className="flex items-center gap-4 flex-1 min-w-[280px]">
          {selectedDivision ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-slate-900 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: factions.find(f => f.id === selectedDivision.ownerFaction)?.color || '#3b82f6' }}
                />
                <span className="text-[9px] font-black uppercase text-slate-300">XX</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  {selectedDivision.type.slice(0, 4)}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-100">{selectedDivision.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {selectedDivision.type} Division
                  </span>
                  {selectedDivision.isExpeditionary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-900/70 border border-indigo-500/50 text-indigo-300 flex items-center gap-1">
                      <span>{selectedDivision.supporterFlag}</span>
                      <span>{selectedDivision.supporterCountryName} Expeditionary ({selectedDivision.equipmentName || 'Heavy Armor'})</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    Stationed: <strong className="text-slate-200">{selectedDivision.regionName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-1">
                  {/* Strength Bar */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Strength:</span>
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (selectedDivision.strength / selectedDivision.maxStrength) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-200">
                      {selectedDivision.strength.toLocaleString()}
                    </span>
                  </div>

                  {/* Morale Bar */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Morale:</span>
                    <span className="text-[11px] font-mono font-bold text-blue-400">
                      {selectedDivision.morale}%
                    </span>
                  </div>

                  {/* Supply Bar */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Supply:</span>
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      {selectedDivision.supply}%
                    </span>
                  </div>
                </div>

                {/* Frontline Assignment & Management Controls (Requirement 3) */}
                {selectedDivision.ownerFaction === playerFactionId && activeFronts.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap border-t border-slate-800/80 pt-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Frontline Command:</span>
                    {selectedDivision.assignedFrontId ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-300">
                          {activeFronts.find(f => f.id === selectedDivision.assignedFrontId)?.name || 'Active Front'}
                        </span>
                        <button
                          onClick={() => handleToggleFrontStance(selectedDivision.assignedFrontId!)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            frontStances[selectedDivision.assignedFrontId] === 'ADVANCE'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {frontStances[selectedDivision.assignedFrontId] === 'ADVANCE' ? '⚔️ ADVANCE' : '🛡️ HOLD'}
                        </button>
                        <button
                          onClick={() => {
                            const front = activeFronts.find(f => f.id === selectedDivision.assignedFrontId);
                            if (front && front.borderPairs.length > 0) {
                              const assignedUnits = divisions.filter(d => d.assignedFrontId === front.id && d.ownerFaction === playerFactionId && !d.hasActedThisTurn);
                              if (assignedUnits.length === 0) {
                                setToastMessage({ text: 'All divisions on this front have already acted this turn.', type: 'info' });
                                return;
                              }
                              assignedUnits.forEach((unit, uIdx) => {
                                const pair = front.borderPairs[uIdx % front.borderPairs.length];
                                if (pair) executeDivisionMove(unit, pair.hostile);
                              });
                            }
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors"
                        >
                          ⚔️ Push Front Now
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeFronts.map(front => (
                          <button
                            key={front.id}
                            onClick={() => assignDivisionsToFront(front.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-200 cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <span>Assign to {front.name}</span>
                            <span className="text-[9px] text-blue-400 font-mono">({front.friendlyBorderRegions.length} sectors)</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reachable Sectors Action Buttons for Selected Player Unit */}
                {selectedDivision.ownerFaction === playerFactionId && reachableAdjacentRegions.size > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Tactical Order:</span>
                    {Array.from(reachableAdjacentRegions).slice(0, 5).map((normAdj, adjIdx) => {
                      const feat = findFeatureByName(normAdj);
                      const targetName = feat?.properties?.NAME_1 || normAdj;
                      const targetCtrl = getRegionController(targetName);
                      const isHostile = targetCtrl && targetCtrl.id !== playerFactionId;
                      return (
                        <button
                          key={`adj_${normAdj}_${adjIdx}`}
                          onClick={() => executeDivisionMove(selectedDivision, targetName)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isHostile
                              ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200'
                              : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200'
                          }`}
                        >
                          {isHostile ? <Swords className="w-3 h-3 text-rose-400" /> : <ChevronRight className="w-3 h-3 text-blue-400" />}
                          <span>{isHostile ? `Assault ${targetName}` : `March to ${targetName}`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Crosshair className="w-4 h-4 text-blue-400" />
              <span>
                Click any division counter to inspect stats, click adjacent regions to march or assault, or drag-and-drop counters across frontlines.
              </span>
            </div>
          )}
        </div>

        {/* Naval Transports & End Turn Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-300">
            <Ship className="w-4 h-4 text-cyan-400" />
            <span>Transports:</span>
            <span className="text-cyan-300 font-mono font-extrabold">{navalTransports} Ships</span>
          </div>

          <button
            onClick={handleEndTurn}
            disabled={isAiProcessing}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isAiProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isAiProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Resolving Fronts...</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>End Turn {turnNumber}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6. MOBILIZE DIVISION MODAL */}
      {showMobilizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-100 font-black text-base">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Commission Strategic Division</span>
              </div>
              <button
                onClick={() => setShowMobilizeModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Select Unit Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'armor', label: 'Heavy Armored (Zırhlı)', desc: '9,000 Manpower · +30% Assault Mod' },
                    { id: 'mechanized', label: 'Mechanized (Mekanize)', desc: '8,500 Manpower · +15% Rapid Strike' },
                    { id: 'infantry', label: 'Mountain Commando (Dağ)', desc: '7,500 Manpower · High Morale' },
                    { id: 'artillery', label: 'Heavy Artillery (Ağır Topçu)', desc: '6,000 Manpower · +25% Siege Mod' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMobilizeType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        mobilizeType === t.id
                          ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-200">{t.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Batch Mobilization Quantity:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 20].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setMobilizeQuantity(qty)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        mobilizeQuantity === qty
                          ? 'border-blue-500 bg-blue-600 text-white shadow'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Unit' : 'Units'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Deployment Region:</label>
                <select
                  value={mobilizeRegion}
                  onChange={(e) => setMobilizeRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {Array.from(new Set(factions.find(f => f.id === playerFactionId)?.controlledRegions || [])).map((r, rIdx) => (
                    <option key={`deploy_reg_${rIdx}_${r}`} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMobilizeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleMobilizeDivision(mobilizeType, mobilizeRegion, mobilizeQuantity)}
                className="px-5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Deploy {mobilizeQuantity} {mobilizeQuantity > 1 ? 'Divisions' : 'Division'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ALLIED / UN FOREIGN AID LOGISTICS MODAL */}
      {showForeignAidModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-100 font-black text-base">
                <span className="text-emerald-400">🕊️</span>
                <span>Allied & International Foreign Aid Logistics</span>
              </div>
              <button
                onClick={() => setShowForeignAidModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!hasSovereignSupport ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-300 uppercase tracking-wide text-[11px]">UN Arms Embargo & Sanctions Active</div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    As an unrecognized non-state faction without sovereign diplomatic backing, international precision missile transfers and heavy military transports are embargoed by the UN. Use World Diplomacy to secure foreign aid packages or capture the capital to establish sovereign legitimacy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300 uppercase tracking-wide text-[11px]">Sovereign Recognition & Logistics Active</div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    Your faction maintains diplomatic backing or constitutional governance. International military airlifts and strategic naval transports deliver precision munitions and financial resources each turn.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Missiles In Stock</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-1">{missileStockpile}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Strikes: {missileStrikesLeft}/3 turn</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Naval Ships</div>
                <div className="text-xl font-black text-cyan-400 font-mono mt-1">{navalTransports}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Maritime Resupply</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Aid Shipments</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">{foreignAidHistory.length}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Delivered Each Turn</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-300 mb-2">Foreign Assistance Delivery Log:</div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {foreignAidHistory.length === 0 ? (
                  <div className="text-xs text-slate-500 italic text-center py-4">
                    Aid shipments arrive automatically at the end of each turn.
                  </div>
                ) : (
                  foreignAidHistory.slice(-6).reverse().map((entry, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400 font-bold">Turn {entry.turn}:</span>
                        <span className="text-slate-300">{entry.description}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{entry.type}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowForeignAidModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                Close Logistics Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7B. PEACE & STRATEGIC SETTLEMENT PANEL */}
      {showPeaceModal && (
        <CivilWarPeaceModal
          countryId={country.id}
          countryName={country.name}
          playerFactionId={playerFactionId}
          factions={factions}
          divisions={divisions}
          casualtyStats={casualtyStats}
          totalRegionsCount={geoData?.features?.length || 1}
          playerTerritoryPercent={playerTerritoryPercent}
          turnNumber={turnNumber}
          peaceSignatoryFactionIds={peaceSignatoryFactionIds}
          onClose={() => setShowPeaceModal(false)}
          onSettlementReached={(agreement: PeaceAgreement) => {
            setShowPeaceModal(false);
            const targetFactionId = agreement.targetFactionId;
            const updatedPeaceFactions = Array.from(new Set([...peaceSignatoryFactionIds, targetFactionId]));
            setPeaceSignatoryFactionIds(updatedPeaceFactions);

            // Transfer agreed regions to player faction
            const updatedFactions = [...factions];
            const pFac = updatedFactions.find(f => f.id === playerFactionId);
            if (pFac) {
              pFac.controlledRegions = pFac.controlledRegions || [];
              (agreement.territoryTransferred || []).forEach(reg => {
                if (!pFac.controlledRegions.includes(reg)) {
                  pFac.controlledRegions.push(reg);
                }
              });
              setFactions(updatedFactions);
            }

            // Stand down divisions of the target faction against player
            setDivisions(prev => prev.map(d => {
              if (d.ownerFaction === targetFactionId) {
                return { ...d, hasActedThisTurn: true };
              }
              return d;
            }));

            // Check if ALL enemy factions have signed peace or coalition holds >= 90% (Requirement 1)
            const totalRegions = geoData?.features?.length || 20;
            const coalitionHeld = updatedFactions
              .filter(f => playerCoalition.members.includes(f.id))
              .flatMap(f => f.controlledRegions);
            const uniqueCoalitionHeld = Array.from(new Set(coalitionHeld.map(normalizeGeoName)));
            const coalitionControlledCount = uniqueCoalitionHeld.length;

            const enemyFactions = updatedFactions.filter(f => !playerCoalition.members.includes(f.id));
            const allEnemySignedPeace = enemyFactions.length > 0 && enemyFactions.every(f => updatedPeaceFactions.includes(f.id));
            const has90PercentControl = coalitionControlledCount >= Math.ceil(totalRegions * 0.90);

            if (has90PercentControl || allEnemySignedPeace) {
              if (INITIAL_CIVIL_WARS[country.id]) {
                INITIAL_CIVIL_WARS[country.id].status = agreement.postWarGovernance === 'FEDERAL_AUTONOMY' ? 'PARTITION' : 'GOV_VICTORY';
              }
              playSound('win');
              setToastMessage({
                text: `🕊️ Full Victory! Peace ratified with all factions / ≥90% territory secured. Transitioning to settlement...`,
                type: 'success'
              });
              setSettlementWinnerFactionId(playerFactionId);
              setShowTerritorialSettlementModal(true);
              setHasWonWar(true);
            } else {
              // SEPARATE PEACE: War stays active! No election unlocks until full victory.
              playSound('win');
              const remainingEnemyCount = enemyFactions.filter(f => !updatedPeaceFactions.includes(f.id)).length;
              const targetFacName = factions.find(f => f.id === targetFactionId)?.name || 'enemy faction';
              setToastMessage({
                text: `🕊️ Separate Peace Signed with ${targetFacName}! Hostilities ceased with their forces. ${remainingEnemyCount} enemy faction(s) remain active. War remains active until ≥90% territory or all enemy factions sign peace.`,
                type: 'info'
              });
              setHasWonWar(false);
            }
          }}
        />
      )}

      {/* 7C. POST-WAR PEACE & TERRITORIAL SETTLEMENT CONFERENCE MODAL */}
      {showTerritorialSettlementModal && (
        <PeaceTerritorialSettlementModal
          isOpen={showTerritorialSettlementModal}
          country={country}
          factions={factions}
          winnerFactionId={settlementWinnerFactionId || playerFactionId}
          playerFactionId={playerFactionId}
          sides={conflictSides}
          allRegions={allCountryRegions}
          divisionsCount={divisionsByFaction}
          manpowerCount={manpowerByFaction}
          onConfirmSettlement={(updatedFactions) => {
            setFactions(updatedFactions);
            setShowTerritorialSettlementModal(false);
            setHasWonWar(true);
            playSound('win');
            setToastMessage({
              text: '🕊️ Peace & Territorial Settlement Ratified! Transitioning to post-war democratic transition.',
              type: 'success'
            });
          }}
          onClose={() => {
            setShowTerritorialSettlementModal(false);
            setHasWonWar(true);
          }}
        />
      )}

      {/* 8. CONSTITUTIONAL REUNIFICATION & VICTORY MODAL */}
      {hasWonWar && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-lg">
              🏆
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-100 tracking-tight">
                National Constitutional Victory!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                All hostile insurgent fronts have been pacified. 100% of sovereign provincial territories have been reintegrated under constitutional rule. The emergency civil war status is officially concluded.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-left text-xs text-emerald-200 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Provincial Demilitarization & Democratic Transition</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                All regions have been transferred to civilian governance. Combat operations have ceased and nationwide democratic elections are now unlocked.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('win');
                onVictory(playerFactionId);
              }}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all cursor-pointer active:scale-98"
            >
              Unlock Democratic Elections & Transition to Peace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
