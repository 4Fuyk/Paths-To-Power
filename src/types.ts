/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Ideology = 'Sosyal Demokrat' | 'Muhafazakar' | 'Milliyetçi' | 'Liberal' | 'Sosyalist' | 'Ekolojist';

export type VoterGroup = 'İşçiler' | 'Gençler' | 'Milliyetçiler' | 'Liberaller' | 'Gelenekçiler' | 'Esnaflar';

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
}

export interface Region {
  id: string;
  name: string;
  seats: number; // Parliamentary seats allocated to this state/region
  voterDistribution: Record<VoterGroup, number>; // Ratio of voters (adds up to 100%)
  supports: Record<string, number>; // Current support percentages (key is party.id or rival.id, adds up to 100)
  infrastructure: number; // Campaign multiplier (1-5, cost/efficiency)
  campaignLevel: number; // Player's rally level
  ownerPartyId?: string; // Winner party id in 2024
  mayorName?: string;    // Winner mayor name
}

export interface Bill {
  id: string;
  title: string;
  description: string;
  category: 'Ekonomi' | 'Özgürlükler' | 'Güvenlik' | 'Sağlık / Eğitim';
  voterImpacts: Record<VoterGroup, number>; // Positive or negative effect on support if passed
  budgetCost: number; // Bütçe etkisi
  influenceMod: number; // Nüfuz etkisi
  status: 'Bekliyor' | 'Kabul Edildi' | 'Reddedildi';
  yesVotesPercentage: number; // Realized yes vote percentage
}

export interface Delegate {
  id: string;
  name: string;
  city: string;
  faction: 'Gelenekçi' | 'Yenilikçi' | 'Merkezci';
  loyalty: number; // 0-100 (loyalty to player)
  demands: string;
}

export interface Country {
  id: string; // e.g. TR, US, DE, GB, BR, JP
  name: string;
  description: string;
  flag: string;
  seats: number;
  system: 'Hükümet Koalisyonu' | 'Başkanlık Sistemi' | 'Dar Bölge Meclisi';
  parliamentName: string;
  population: string;
  primaryColor: string; // Map color when unlocked
  regions: Region[];
  rivals: RivalParty[];
  bills: Bill[];
  campaignTurns: number; // Total weeks or campaign actions allowed
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
  voterImpacts: Partial<Record<VoterGroup, number>>;
  budgetCost: number;
  influenceMod: number;
}

export interface SpeechCard {
  id: string;
  topic: string;
  question: string;
  choices: SpeechChoice[];
}
