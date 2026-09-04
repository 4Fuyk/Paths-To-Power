/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, Region, RivalParty, Bill } from '../types';

export interface BreakawayCountryMeta {
  parentCountryId: string;
  parentCountryName: string;
  conflictName: string;
  rebelLeader: string;
  militaryStrength: number; // 0-100
  foreignBackers: string;
}

export const BREAKAWAY_COUNTRIES: (Country & { meta: BreakawayCountryMeta })[] = [
  {
    id: 'SY_SDF',
    name: 'Autonomous Administration of North and East Syria (Rojava)',
    description: 'A multi-ethnic secular democratic confederal administration holding northeastern Syrian territories, vital hydro dams, and oil fields.',
    flag: '🟡',
    seats: 120,
    parliamentName: 'Syrian Democratic Council (MSD)',
    system: 'Democratic Confederal Republic',
    population: '3.2 Million',
    primaryColor: '#eab308',
    isBreakaway: true,
    parentCountryId: 'SY',
    freedomScore: 68,
    rivals: [
      { id: 'PYD', name: 'Democratic Union Movement', leader: 'Salih Muslim / Asya Abdullah', ideology: 'Socialist', symbol: 'Sparkles', color: '#eab308', baseSupport: 48 },
      { id: 'SNC_ARAB', name: 'Arab Tribal & Democratic Assembly', leader: 'Sheikh Mansour Salal', ideology: 'Centrist', symbol: 'Users', color: '#3b82f6', baseSupport: 28 },
      { id: 'KNC', name: 'Kurdish National Council', leader: 'Ibrahim Biro', ideology: 'Liberal', symbol: 'Building', color: '#16a34a', baseSupport: 24 }
    ],
    regions: [
      {
        id: 'SY_SDF_HASAKAH',
        name: 'Hasakah Governorate',
        seats: 38,
        voterDistribution: { Workers: 35, Youth: 30, Liberals: 20, Nationalists: 15 },
        supports: { PYD: 52, SNC_ARAB: 26, KNC: 22 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'SY_SDF',
        originalOwnerId: 'SY'
      },
      {
        id: 'SY_SDF_QAMISHLI',
        name: 'Qamishli Administrative Hub',
        seats: 32,
        voterDistribution: { Workers: 30, Youth: 35, Liberals: 25, Nationalists: 10 },
        supports: { PYD: 56, SNC_ARAB: 22, KNC: 22 },
        infrastructure: 4,
        campaignLevel: 3,
        controlledBy: 'SY_SDF',
        originalOwnerId: 'SY'
      },
      {
        id: 'SY_SDF_RAQQA_RURAL',
        name: 'Raqqa Rural & Tabqa Hydro Hub',
        seats: 26,
        voterDistribution: { Workers: 40, Youth: 25, Traditionalists: 20, Liberals: 15 },
        supports: { PYD: 40, SNC_ARAB: 42, KNC: 18 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'SY_SDF',
        originalOwnerId: 'SY'
      },
      {
        id: 'SY_SDF_DEIR_EZ_ZOR',
        name: 'Northern Deir ez-Zor Oil Belt',
        seats: 24,
        voterDistribution: { Workers: 45, Youth: 20, Traditionalists: 25, Liberals: 10 },
        supports: { PYD: 38, SNC_ARAB: 46, KNC: 16 },
        infrastructure: 2,
        campaignLevel: 1,
        controlledBy: 'SY_SDF',
        originalOwnerId: 'SY'
      }
    ],
    bills: [
      {
        id: 'sdf_b1',
        title: 'Social Contract for Democratic Confederalism',
        description: 'Enact direct neighborhood commune self-governance and multi-ethnic regional councils.',
        category: 'Freedoms',
        voterImpacts: { Youth: 15, Liberals: 12, Workers: 8 },
        budgetCost: 15000,
        influenceMod: 20,
        status: 'Pending',
        yesVotesPercentage: 72
      },
      {
        id: 'sdf_b2',
        title: 'Women\'s Defense & Equality Charter',
        description: 'Guarantee 50% co-chair representation across all municipal and security commands.',
        category: 'Freedoms',
        voterImpacts: { Youth: 20, Liberals: 15, Traditionalists: -8 },
        budgetCost: 10000,
        influenceMod: 15,
        status: 'Pending',
        yesVotesPercentage: 68
      },
      {
        id: 'sdf_b3',
        title: 'Strategic Hydrocarbon & Euphrates Basin Logistics',
        description: 'Modernize oil refining cooperatives and Euphrates irrigation canal networks.',
        category: 'Economy',
        voterImpacts: { Workers: 20, Traditionalists: 10 },
        budgetCost: 25000,
        influenceMod: 12,
        status: 'Pending',
        yesVotesPercentage: 80
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'SY',
      parentCountryName: 'Syria',
      conflictName: 'Syrian Civil Conflict & Regional Fragmentations',
      rebelLeader: 'General Mazloum Abdi',
      militaryStrength: 65,
      foreignBackers: 'Western International Coalition'
    }
  },
  {
    id: 'LY_LNA',
    name: 'House of Representatives & Libyan National Army (Tobruk)',
    description: 'The eastern sovereign authority in Cyrenaica controlling Benghazi, Tobruk, and key central Oil Crescent export terminals.',
    flag: '🇱🇾',
    seats: 200,
    parliamentName: 'House of Representatives (HoR)',
    system: 'Presidential Military Republic',
    population: '2.8 Million',
    primaryColor: '#dc2626',
    isBreakaway: true,
    parentCountryId: 'LY',
    freedomScore: 42,
    rivals: [
      { id: 'LNA_COMMAND', name: 'National Armed Forces Command', leader: 'Field Marshal Khalifa Haftar', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 52 },
      { id: 'HOR_BLOC', name: 'Eastern Parliamentary Sovereignty Bloc', leader: 'Aguila Saleh Issa', ideology: 'Conservative', symbol: 'Landmark', color: '#2563eb', baseSupport: 30 },
      { id: 'CYRENAICA_TRIBAL', name: 'Cyrenaica Federal Council', leader: 'Sheikh Ali al-Barasi', ideology: 'Traditionalist', symbol: 'Users', color: '#16a34a', baseSupport: 18 }
    ],
    regions: [
      {
        id: 'LY_LNA_BENGHAZI',
        name: 'Benghazi & Coastal Hub',
        seats: 75,
        voterDistribution: { Nationalists: 40, Workers: 30, Liberals: 15, Traditionalists: 15 },
        supports: { LNA_COMMAND: 58, HOR_BLOC: 26, CYRENAICA_TRIBAL: 16 },
        infrastructure: 4,
        campaignLevel: 3,
        controlledBy: 'LY_LNA',
        originalOwnerId: 'LY'
      },
      {
        id: 'LY_LNA_TOBRUK',
        name: 'Tobruk Parliamentary Seat & Harbor',
        seats: 45,
        voterDistribution: { Nationalists: 35, Traditionalists: 35, Workers: 20, Liberals: 10 },
        supports: { LNA_COMMAND: 48, HOR_BLOC: 36, CYRENAICA_TRIBAL: 16 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'LY_LNA',
        originalOwnerId: 'LY'
      },
      {
        id: 'LY_LNA_SIRTE_OIL',
        name: 'Sirte Basin & Oil Crescent Terminals',
        seats: 50,
        voterDistribution: { Workers: 50, Nationalists: 30, Traditionalists: 20 },
        supports: { LNA_COMMAND: 55, HOR_BLOC: 25, CYRENAICA_TRIBAL: 20 },
        infrastructure: 4,
        campaignLevel: 2,
        controlledBy: 'LY_LNA',
        originalOwnerId: 'LY'
      },
      {
        id: 'LY_LNA_KUFRA',
        name: 'Kufra & Southern Desert Oases',
        seats: 30,
        voterDistribution: { Traditionalists: 50, Nationalists: 30, Workers: 20 },
        supports: { LNA_COMMAND: 44, HOR_BLOC: 26, CYRENAICA_TRIBAL: 30 },
        infrastructure: 2,
        campaignLevel: 1,
        controlledBy: 'LY_LNA',
        originalOwnerId: 'LY'
      }
    ],
    bills: [
      {
        id: 'lna_b1',
        title: 'Central Bank of Libya Eastern Unification Decree',
        description: 'Enforce independent eastern oil revenues and unified sovereign fiscal deposits.',
        category: 'Economy',
        voterImpacts: { Workers: 18, Nationalists: 15 },
        budgetCost: 20000,
        influenceMod: 22,
        status: 'Pending',
        yesVotesPercentage: 78
      },
      {
        id: 'lna_b2',
        title: 'Southern Frontier Anti-Smuggling & Counter-Terror Grid',
        description: 'Deploy mechanized desert border brigades across Sahara crossroads.',
        category: 'Security',
        voterImpacts: { Traditionalists: 15, Nationalists: 20 },
        budgetCost: 35000,
        influenceMod: 18,
        status: 'Pending',
        yesVotesPercentage: 82
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'LY',
      parentCountryName: 'Libya',
      conflictName: 'Libyan Dual-Regime & Militia Crisis',
      rebelLeader: 'Field Marshal Khalifa Haftar',
      militaryStrength: 72,
      foreignBackers: 'Egypt / UAE / Regional Partners'
    }
  },
  {
    id: 'SD_RSF',
    name: 'Rapid Support Forces Command (Sudan)',
    description: 'A mobile paramilitary authority controlling western Darfur, Kordofan, and contested metropolitan centers.',
    flag: '🇸🇩',
    seats: 150,
    parliamentName: 'Transitional Revolutionary Council',
    system: 'Paramilitary Revolutionary Administration',
    population: '9.5 Million',
    primaryColor: '#b45309',
    isBreakaway: true,
    parentCountryId: 'SD',
    freedomScore: 28,
    rivals: [
      { id: 'RSF_CORE', name: 'Rapid Support Movement', leader: 'Mohamed Hamdan Dagalo (Hemedti)', ideology: 'Populist', symbol: 'Flame', color: '#b45309', baseSupport: 58 },
      { id: 'DARFUR_ALLIANCE', name: 'Darfur Peace & Civil Alliance', leader: 'Al-Hadi Idris', ideology: 'Alliance', symbol: 'Users', color: '#15803d', baseSupport: 26 },
      { id: 'KORDOFAN_TRIBAL', name: 'Kordofan United Councils', leader: 'Sheikh Musa Hilal', ideology: 'Traditionalist', symbol: 'Shield', color: '#dc2626', baseSupport: 16 }
    ],
    regions: [
      {
        id: 'SD_RSF_DARFUR_NORTH',
        name: 'North Darfur (El Fasher Hinterlands)',
        seats: 45,
        voterDistribution: { Workers: 40, Traditionalists: 40, Youth: 20 },
        supports: { RSF_CORE: 62, DARFUR_ALLIANCE: 24, KORDOFAN_TRIBAL: 14 },
        infrastructure: 2,
        campaignLevel: 2,
        controlledBy: 'SD_RSF',
        originalOwnerId: 'SD'
      },
      {
        id: 'SD_RSF_DARFUR_SOUTH',
        name: 'South & West Darfur (Nyala Hub)',
        seats: 45,
        voterDistribution: { Workers: 45, Traditionalists: 35, Youth: 20 },
        supports: { RSF_CORE: 65, DARFUR_ALLIANCE: 22, KORDOFAN_TRIBAL: 13 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'SD_RSF',
        originalOwnerId: 'SD'
      },
      {
        id: 'SD_RSF_KORDOFAN',
        name: 'Kordofan Mineral & Oil Hub',
        seats: 35,
        voterDistribution: { Workers: 50, Traditionalists: 30, Youth: 20 },
        supports: { RSF_CORE: 54, DARFUR_ALLIANCE: 26, KORDOFAN_TRIBAL: 20 },
        infrastructure: 2,
        campaignLevel: 1,
        controlledBy: 'SD_RSF',
        originalOwnerId: 'SD'
      },
      {
        id: 'SD_RSF_WAD_MADANI',
        name: 'Gezira Agriculture Center (Wad Madani)',
        seats: 25,
        voterDistribution: { Workers: 55, Traditionalists: 30, Youth: 15 },
        supports: { RSF_CORE: 48, DARFUR_ALLIANCE: 32, KORDOFAN_TRIBAL: 20 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'SD_RSF',
        originalOwnerId: 'SD'
      }
    ],
    bills: [
      {
        id: 'rsf_b1',
        title: 'Agricultural Granary Emergency Mobilization',
        description: 'Requisition central Gezira farm yields to secure regional food sovereignty.',
        category: 'Economy',
        voterImpacts: { Workers: 16, Traditionalists: 10 },
        budgetCost: 18000,
        influenceMod: 15,
        status: 'Pending',
        yesVotesPercentage: 75
      },
      {
        id: 'rsf_b2',
        title: 'Darfur Artisanal Gold Concession Export Act',
        description: 'Direct trade routes through international brokers to finance civic defense.',
        category: 'Economy',
        voterImpacts: { Workers: 20, Youth: 10 },
        budgetCost: 12000,
        influenceMod: 24,
        status: 'Pending',
        yesVotesPercentage: 84
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'SD',
      parentCountryName: 'Sudan',
      conflictName: 'Sudanese Armed Forces vs RSF War',
      rebelLeader: 'Mohamed Hamdan Dagalo (Hemedti)',
      militaryStrength: 68,
      foreignBackers: 'Regional Trade Networks'
    }
  },
  {
    id: 'MM_NUG_PDF',
    name: 'National Unity Government & Resistance Alliance (Myanmar)',
    description: 'The recognized democratic alternative to the military junta, backed by the People\'s Defense Forces and ethnic armed brotherhoods.',
    flag: '🇲🇲',
    seats: 224,
    parliamentName: 'Committee Representing Pyidaungsu Hluttaw (CRPH)',
    system: 'Federal Democratic Republic',
    population: '14.5 Million',
    primaryColor: '#16a34a',
    isBreakaway: true,
    parentCountryId: 'MM',
    freedomScore: 74,
    rivals: [
      { id: 'NLD_FED', name: 'National League for Democracy (Federal)', leader: 'Duwa Lashi La', ideology: 'Social Democrat', symbol: 'Sparkles', color: '#16a34a', baseSupport: 52 },
      { id: 'ETHNIC_ALLIANCE', name: 'Three Brotherhood & Ethnic Alliance', leader: 'Gen. Gun Maw / Peng Deren', ideology: 'Alliance', symbol: 'ShieldAlert', color: '#eab308', baseSupport: 34 },
      { id: 'PDF_YOUTH', name: 'People\'s Defense Vanguard', leader: 'Min Ko Naing', ideology: 'Progressive', symbol: 'Flame', color: '#ef4444', baseSupport: 14 }
    ],
    regions: [
      {
        id: 'MM_NUG_SHAN_NORTH',
        name: 'Northern Shan & Border Gates',
        seats: 70,
        voterDistribution: { Workers: 35, Youth: 35, Liberals: 20, Traditionalists: 10 },
        supports: { NLD_FED: 44, ETHNIC_ALLIANCE: 42, PDF_YOUTH: 14 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'MM_NUG_PDF',
        originalOwnerId: 'MM'
      },
      {
        id: 'MM_NUG_RAKHINE',
        name: 'Rakhine State (Arakan Army Territory)',
        seats: 60,
        voterDistribution: { Workers: 40, Youth: 30, Nationalists: 20, Liberals: 10 },
        supports: { NLD_FED: 38, ETHNIC_ALLIANCE: 50, PDF_YOUTH: 12 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'MM_NUG_PDF',
        originalOwnerId: 'MM'
      },
      {
        id: 'MM_NUG_KACHIN',
        name: 'Kachin Highlands & Mineral Frontier',
        seats: 50,
        voterDistribution: { Workers: 35, Youth: 35, Liberals: 20, Traditionalists: 10 },
        supports: { NLD_FED: 50, ETHNIC_ALLIANCE: 36, PDF_YOUTH: 14 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'MM_NUG_PDF',
        originalOwnerId: 'MM'
      },
      {
        id: 'MM_NUG_KAREN_BORDER',
        name: 'Kayah & Karenni Liberated Corridors',
        seats: 44,
        voterDistribution: { Youth: 40, Workers: 30, Liberals: 20, Traditionalists: 10 },
        supports: { NLD_FED: 54, ETHNIC_ALLIANCE: 28, PDF_YOUTH: 18 },
        infrastructure: 3,
        campaignLevel: 3,
        controlledBy: 'MM_NUG_PDF',
        originalOwnerId: 'MM'
      }
    ],
    bills: [
      {
        id: 'nug_b1',
        title: 'Federal Democratic Constitutional Charter',
        description: 'Abolish the 2008 military constitution and establish equal state rights for all ethnic nationalities.',
        category: 'Freedoms',
        voterImpacts: { Youth: 22, Liberals: 20, Workers: 15 },
        budgetCost: 20000,
        influenceMod: 25,
        status: 'Pending',
        yesVotesPercentage: 88
      },
      {
        id: 'nug_b2',
        title: 'Spring Revolutionary Bond Issuance',
        description: 'Issue decentralized digital treasury bonds to fund civilian resistance administration.',
        category: 'Economy',
        voterImpacts: { Youth: 18, Liberals: 15 },
        budgetCost: 10000,
        influenceMod: 20,
        status: 'Pending',
        yesVotesPercentage: 82
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'MM',
      parentCountryName: 'Myanmar',
      conflictName: 'Myanmar Spring Revolution & Resistance',
      rebelLeader: 'Acting President Duwa Lashi La',
      militaryStrength: 75,
      foreignBackers: 'International Democratic Coalition'
    }
  },
  {
    id: 'YE_HOU',
    name: 'Supreme Political Council (Ansar Allah / Sanaa)',
    description: 'The de facto governing authority in northern Yemen holding the historic capital Sanaa and Red Sea coastal missile corridors.',
    flag: '🇾🇪',
    seats: 301,
    parliamentName: 'House of Representatives (Sanaa)',
    system: 'Theocratic Revolutionary Republic',
    population: '18 Million',
    primaryColor: '#15803d',
    isBreakaway: true,
    parentCountryId: 'YE',
    freedomScore: 22,
    rivals: [
      { id: 'ANSAR_ALLAH', name: 'Ansar Allah Movement', leader: 'Mahdi al-Mashat / Abdul-Malik al-Houthi', ideology: 'Traditionalist', symbol: 'Flame', color: '#15803d', baseSupport: 64 },
      { id: 'GPC_SANAA', name: 'General People\'s Congress (Sanaa Wing)', leader: 'Sadiq Amin Abu Rass', ideology: 'Nationalist', symbol: 'Building', color: '#2563eb', baseSupport: 24 },
      { id: 'TRIBAL_NORTH', name: 'Highland Tribal Confederation', leader: 'Sheikh Dhaifallah Rassam', ideology: 'Traditionalist', symbol: 'Shield', color: '#ca8a04', baseSupport: 12 }
    ],
    regions: [
      {
        id: 'YE_HOU_SANAA',
        name: 'Sanaa Capital Metropolis',
        seats: 90,
        voterDistribution: { Traditionalists: 45, Workers: 30, Nationalists: 20, Youth: 5 },
        supports: { ANSAR_ALLAH: 65, GPC_SANAA: 25, TRIBAL_NORTH: 10 },
        infrastructure: 4,
        campaignLevel: 3,
        controlledBy: 'YE_HOU',
        originalOwnerId: 'YE'
      },
      {
        id: 'YE_HOU_HODEIDAH',
        name: 'Hodeidah Red Sea Port',
        seats: 75,
        voterDistribution: { Workers: 50, Traditionalists: 30, Nationalists: 20 },
        supports: { ANSAR_ALLAH: 60, GPC_SANAA: 28, TRIBAL_NORTH: 12 },
        infrastructure: 4,
        campaignLevel: 3,
        controlledBy: 'YE_HOU',
        originalOwnerId: 'YE'
      },
      {
        id: 'YE_HOU_SAADA',
        name: 'Saada Mountain Bastion',
        seats: 60,
        voterDistribution: { Traditionalists: 60, Nationalists: 25, Workers: 15 },
        supports: { ANSAR_ALLAH: 78, GPC_SANAA: 12, TRIBAL_NORTH: 10 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'YE_HOU',
        originalOwnerId: 'YE'
      },
      {
        id: 'YE_HOU_IBB_DHAMAR',
        name: 'Ibb & Dhamar Agricultural Highlands',
        seats: 76,
        voterDistribution: { Workers: 45, Traditionalists: 40, Nationalists: 15 },
        supports: { ANSAR_ALLAH: 56, GPC_SANAA: 30, TRIBAL_NORTH: 14 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'YE_HOU',
        originalOwnerId: 'YE'
      }
    ],
    bills: [
      {
        id: 'hou_b1',
        title: 'Maritime Strategic Denial & Red Sea Logistics Decree',
        description: 'Reinforce coastal radar installations and anti-ship missile defense batteries.',
        category: 'Security',
        voterImpacts: { Traditionalists: 20, Nationalists: 15 },
        budgetCost: 28000,
        influenceMod: 22,
        status: 'Pending',
        yesVotesPercentage: 84
      },
      {
        id: 'hou_b2',
        title: 'Highland Agricultural Self-Sufficiency Act',
        description: 'Mandate grain and legume cultivation across terraced valleys to counter embargoes.',
        category: 'Economy',
        voterImpacts: { Workers: 20, Traditionalists: 15 },
        budgetCost: 16000,
        influenceMod: 16,
        status: 'Pending',
        yesVotesPercentage: 79
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'YE',
      parentCountryName: 'Yemen',
      conflictName: 'Yemeni Civil Conflict & Red Sea Crisis',
      rebelLeader: 'President Mahdi al-Mashat',
      militaryStrength: 76,
      foreignBackers: 'Regional Resistance Front'
    }
  },
  {
    id: 'CD_M23',
    name: 'Alliance Fleuve Congo & M23 Resistance (Eastern DRC)',
    description: 'An armed political-military movement controlling strategic highlands, coltan corridors, and border posts in North Kivu.',
    flag: '🇨🇩',
    seats: 100,
    parliamentName: 'Eastern Territorial Administrative Council',
    system: 'Provisional Military Administration',
    population: '2.5 Million',
    primaryColor: '#dc2626',
    isBreakaway: true,
    parentCountryId: 'CD',
    freedomScore: 32,
    rivals: [
      { id: 'AFC_M23', name: 'Alliance Fleuve Congo (AFC)', leader: 'Corneille Nangaa / Sultani Makenga', ideology: 'Alliance', symbol: 'Shield', color: '#dc2626', baseSupport: 62 },
      { id: 'KIVU_CIVIL', name: 'Kivu Peace & Civic Coalition', leader: 'Denis Mukwege Civic Supporters', ideology: 'Liberal', symbol: 'Sparkles', color: '#3b82f6', baseSupport: 22 },
      { id: 'RUTSHURU_TRIBAL', name: 'Rutshuru Local Community Assembly', leader: 'Mwami Ndeze', ideology: 'Traditionalist', symbol: 'Users', color: '#16a34a', baseSupport: 16 }
    ],
    regions: [
      {
        id: 'CD_M23_RUTSHURU',
        name: 'Rutshuru & Bunagana Trade Corridor',
        seats: 35,
        voterDistribution: { Workers: 45, Traditionalists: 35, Youth: 20 },
        supports: { AFC_M23: 68, KIVU_CIVIL: 18, RUTSHURU_TRIBAL: 14 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'CD_M23',
        originalOwnerId: 'CD'
      },
      {
        id: 'CD_M23_MASISI',
        name: 'Masisi Strategic Coltan Mining Hills',
        seats: 35,
        voterDistribution: { Workers: 55, Traditionalists: 30, Youth: 15 },
        supports: { AFC_M23: 64, KIVU_CIVIL: 20, RUTSHURU_TRIBAL: 16 },
        infrastructure: 3,
        campaignLevel: 2,
        controlledBy: 'CD_M23',
        originalOwnerId: 'CD'
      },
      {
        id: 'CD_M23_GOMA_ENVIRONS',
        name: 'Goma Environs & Lake Kivu Shore',
        seats: 30,
        voterDistribution: { Workers: 40, Youth: 30, Liberals: 20, Traditionalists: 10 },
        supports: { AFC_M23: 52, KIVU_CIVIL: 32, RUTSHURU_TRIBAL: 16 },
        infrastructure: 4,
        campaignLevel: 3,
        controlledBy: 'CD_M23',
        originalOwnerId: 'CD'
      }
    ],
    bills: [
      {
        id: 'm23_b1',
        title: 'Mining Concession Transparency & Security Decree',
        description: 'Levy unified extraction royalties on rare earth and coltan artisanal sites.',
        category: 'Economy',
        voterImpacts: { Workers: 20, Youth: 12 },
        budgetCost: 15000,
        influenceMod: 18,
        status: 'Pending',
        yesVotesPercentage: 76
      }
    ],
    campaignTurns: 53,
    electionCycleYears: 4,
    meta: {
      parentCountryId: 'CD',
      parentCountryName: 'Democratic Republic of the Congo',
      conflictName: 'Eastern DRC & M23 Great Lakes Conflict',
      rebelLeader: 'Corneille Nangaa',
      militaryStrength: 66,
      foreignBackers: 'Regional Strategic Partners'
    }
  }
];

export function getBreakawayState(countryId: string): (Country & { meta: BreakawayCountryMeta }) | null {
  return BREAKAWAY_COUNTRIES.find(b => b.id === countryId) || null;
}

export function isBreakawayState(countryId: string): boolean {
  return BREAKAWAY_COUNTRIES.some(b => b.id === countryId);
}
