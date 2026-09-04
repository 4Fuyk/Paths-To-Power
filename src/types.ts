/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Ideology = 
  | 'Social Democrat' 
  | 'Conservative' 
  | 'Nationalist' 
  | 'Liberal' 
  | 'Socialist' 
  | 'Ecologist' 
  | 'Centrist' 
  | 'Far Right' 
  | 'Far Left' 
  | 'Communist' 
  | 'Social Conservative' 
  | 'Progressive' 
  | 'Alliance'
  | 'Traditionalist'
  | 'Populist'
  | 'Monarchist'
  | 'Fascist';

export type GameDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export type GameFlowMode = 'TURN_BY_TURN' | 'PAUSABLE_REALTIME';
export type SimulationSpeed = 1 | 2 | 3 | 4 | 5; // 1: very slow, 2: slow, 3: normal, 4: fast, 5: very fast

export type ScenarioYear = '2026' | '1950' | '1936' | '1920' | '1914';

export interface GameScenario {
  id: ScenarioYear;
  year: number;
  title: string;
  tagline: string;
  description: string;
  globalTension: 'Low' | 'Moderate' | 'Elevated' | 'Critical' | 'Extreme';
  dominantIdeologies: string[];
  keyEvents: string[];
  economicClimate: string;
  majorPowers: string[];
  worldOrderSummary: string;
  statusTag: 'PLAYABLE' | 'PREVIEW';
}

export type VoterGroup = 'Workers' | 'Youth' | 'Nationalists' | 'Liberals' | 'Traditionalists' | 'Shopkeepers';

export interface Party {
  id: string;
  name: string;
  leader: string;
  ideology: Ideology;
  symbol: string; // Lucide icon identifier
  color: string;  // Hex color
  influence: number; // Siyasi Nüfuz (0h-100+)
  budget: number;    // Bütçe ($ or TL)
  members: number;   // Üye sayısı
  traits: {
    charisma: number;      // Karizma
    eloquence: number;     // Hitabet
    organization: number;  // Teşkilatçılık
    strategy: number;      // Strateji
  };
  photo?: string;    // Leader photo URL
}

export interface RivalParty {
  id: string;
  name: string;
  leader: string;
  ideology: Ideology;
  symbol: string;
  color: string;
  baseSupport: number; // Base election support %
  photo?: string;      // Photo URL
  startingSeats?: number; // Pre-allocated Bundestag/TBMM seats
}

export interface Region {
  id: string;
  name: string;
  seats: number; // Parliamentary seats allocated to this state/region
  voterDistribution: Record<string, number>; // Ratio of voters (adds up to 100%)
  supports: Record<string, number>; // Current support percentages (key is party.id or rival.id, adds up to 100)
  infrastructure: number; // Campaign multiplier (1-5, cost/efficiency)
  campaignLevel: number; // Player's rally level
  ownerPartyId?: string; // Winner party id in 2024
  mayorName?: string;    // Winner mayor name
  playerCandidate?: string; // Nominated candidate for the player's party
  nominatedCandidates?: Record<string, string>; // Party-specific nominated regional leaders
  controlledBy?: string; // Controller country or faction ID (e.g. TR, SY_SDF, LY_LNA, etc.)
  originalOwnerId?: string; // Original sovereign parent country ID
}

export interface Bill {
  id: string;
  title: string;
  description: string;
  category: 'Economy' | 'Freedoms' | 'Security' | 'Environment' | 'Education' | 'Healthcare' | 'Infrastructure' | 'Technology';
  voterImpacts: Record<string, number>; // Positive or negative effect on support if passed
  budgetCost: number; // Bütçe etkisi
  influenceMod: number; // Nüfuz etkisi
  status: 'Pending' | 'Passed' | 'Rejected';
  yesVotesPercentage: number; // Realized yes vote percentage
}

export interface Delegate {
  id: string;
  name: string;
  city: string;
  faction: 'Traditionalist' | 'Reformist' | 'Centrist' | 'Gelenekçi' | 'Yenilikçi' | 'Merkezci';
  loyalty: number; // 0-100 (loyalty to player)
  demands: string;
}

export interface Country {
  id: string; // e.g. TR, US, DE, GB, BR, JP
  name: string;
  description: string;
  flag: string;
  seats: number;
  system: string;
  parliamentName: string;
  population: string;
  primaryColor: string; // Map color when unlocked
  regions: Region[];
  rivals: RivalParty[];
  bills: Bill[];
  campaignTurns: number; // Total weeks or campaign actions allowed
  electionCycleYears: number; // election cycle frequency in years
  termLimit?: number; // Maximum number of terms allowed (e.g. 2 for US). Infinite if undefined.
  freedomScore?: number;
  isBreakaway?: boolean; // True if state is a de facto separatist/breakaway state from civil conflict
  parentCountryId?: string; // e.g. 'SY', 'LY', 'SD', 'MM', 'YE', 'CD'
  activeConflictId?: string; // Associated ongoing conflict ID
}

export interface Coalition {
  name: string;
  parties: string[]; // party IDs (can include 'player' or playerParty.id, and rival ids)
  totalSeats: number;
  ideologyAvg: string;
}

export interface MinisterCandidate {
  name: string;
  party: string;
  portrait?: string;
  loyalty: number; // 1-100
  competence: number; // 1-100
  popularity: number; // 1-100
  role?: string; // current assigned role if any
}

export interface Ministry {
  id: string; // e.g. "finance", "defence"
  name: string; // display name in English
  assignedMinister: MinisterCandidate | null;
}

export interface GameState {
  currentCountry: Country | null;
  playerParty: Party | null;
  activeTurn: number; // e.g. Week 1 to Week 10
  completedCountries: string[]; // List of country IDs successfully cleared (won election)
  parliamentHistory: {
    passedBills: string[];
    rejectedBills: string[];
  };
  delegates: Delegate[];
}

export interface SpeechChoice {
  text: string;
  impactText: string;
  voterImpacts: Partial<Record<string, number>>;
  budgetCost: number;
  influenceMod: number;
}

export interface SpeechCard {
  id: string;
  topic: string;
  question: string;
  choices: SpeechChoice[];
}

export interface OngoingSituation {
  id: string;
  title: string;
  icon: string;
  category: 'GEOPOLITICAL' | 'MILITARY' | 'ECONOMIC' | 'DOMESTIC' | 'CRISIS';
  description: string;
  sourceEvent: string;
  remainingMonths: number;
  totalDuration: number;
  monthlyEffects: {
    treasuryDelta?: number;
    inflationDelta?: number;
    reputationDelta?: number;
    confidenceDelta?: number;
    freedomDelta?: number;
    civilWarRiskDelta?: number;
    approvalDelta?: number;
  };
  resolutionOutcome?: string;
  counterAction?: {
    label: string;
    cost: number;
    effectDescription: string;
  };
}

export interface StateCrisisOption {
  text: string;
  flavorImpact: string;
  immediateEffects: {
    treasuryDelta?: number;
    inflationDelta?: number;
    reputationDelta?: number;
    confidenceDelta?: number;
    freedomDelta?: number;
    civilWarRiskDelta?: number;
    approvalDelta?: number;
  };
  spawnSituation?: Omit<OngoingSituation, 'id'>;
}

export interface StateCrisisEvent {
  id: string;
  title: string;
  icon: string;
  category: 'GEOPOLITICAL' | 'MILITARY' | 'ECONOMIC' | 'DOMESTIC' | 'CRISIS';
  urgency: 'HIGH' | 'CRITICAL' | 'MODERATE';
  description: string;
  options: StateCrisisOption[];
}

export interface CivilWarFaction {
  id: string;
  name: string;
  leader: string;
  ideology: string;
  color: string;
  strength: number; // 0-100
  controlledRegions: string[];
  isGovernment?: boolean;
  foreignBacker?: string;
  description: string;
}

export interface CivilWarState {
  countryId: string;
  countryName: string;
  flag: string;
  conflictName: string;
  yearStarted: number;
  stability: number; // strictly < 30
  factions: CivilWarFaction[];
  status: 'ACTIVE' | 'GOV_VICTORY' | 'REBEL_VICTORY' | 'PARTITION' | 'FROZEN_CONFLICT';
  playerStance?: 'NEUTRAL' | 'RECOGNIZED_GOV' | 'RECOGNIZED_REBEL' | 'PEACEKEEPER';
  playerAidRecipient?: string;
  militaryIntervention?: boolean;
  refugeePressure: number;
  monthlyCasualties: number;
}

export interface WartimeDecree {
  id: string;
  name: string;
  category: 'MOBILIZATION' | 'FINANCE' | 'SECURITY' | 'MEDIA';
  militaryBenefit: string;
  electoralCost: string;
  active: boolean;
  benefits: {
    militaryReadinessDelta?: number;
    armyMoraleDelta?: number;
    manpowerDelta?: number;
    treasuryDelta?: number;
    defenseDelta?: number;
    resistanceSuppression?: number;
  };
  costs: {
    voterGroupApprovalDelta?: Record<string, number>;
    overallApprovalDelta?: number;
    freedomIndexDelta?: number;
    inflationDelta?: number;
    reputationDelta?: number;
    warWearinessDelta?: number;
  };
}

export type EventScope = 'DOMESTIC' | 'GLOBAL';

export interface GameEventChoice {
  id: string;
  text: string;
  flavorPreview: string;
  expectedEffectsSummary: string;
  requiresDiplomaticCapability?: boolean;
  minReputationRequired?: number; // e.g. 45 for mediation
  effects: {
    treasuryDelta?: number;
    inflationDelta?: number;
    reputationDelta?: number;
    confidenceDelta?: number;
    freedomDelta?: number;
    civilWarRiskDelta?: number;
    approvalDelta?: number;
    relationDeltas?: Record<string, number>; // e.g. { 'EG': 20, 'IL': -25 }
    voterApprovalDelta?: Partial<Record<VoterGroup, number>>;
    tradeModifierDelta?: number;
    warRiskDelta?: number;
  };
  outcomeNarrative: string;
  spawnSituation?: Omit<OngoingSituation, 'id'>;
}

export interface DynamicGameEvent {
  id: string;
  title: string;
  icon: string;
  scope: EventScope;
  countryId?: string; // If domestic, specific country ID (e.g. 'EG', 'TR', 'US') or 'ALL'
  partiesInvolved?: {
    partyA: { id: string; name: string; flag?: string };
    partyB: { id: string; name: string; flag?: string };
  };
  category: 'POLITICAL' | 'ECONOMIC' | 'MILITARY' | 'DIPLOMATIC' | 'SECURITY' | 'SOCIAL';
  urgency: 'HIGH' | 'CRITICAL' | 'MODERATE';
  description: string; // 2-4 sentences
  choices: GameEventChoice[];
  scenarioYear?: string; // '2026' | '1950' | '1936' | '1914' | '1920' | 'ANY'
}

export interface ResolvedEventLog {
  id: string;
  timestamp: string; // e.g. "Week 4 / 12" or "Month 14 (Year 2027)"
  scope: EventScope;
  title: string;
  category: string;
  icon: string;
  countryName?: string;
  chosenOptionText: string;
  outcomeNarrative: string;
  consequencesSummary: string;
}


