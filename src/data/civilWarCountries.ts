/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, Region, RivalParty } from '../types';

function makeRegions(names: string[], countryId: string, capitalName: string): Region[] {
  return names.map((name, idx) => {
    const isCap = name.toLowerCase().includes(capitalName.toLowerCase());
    return {
      id: `${countryId}_${idx + 1}`,
      name,
      seats: isCap ? 8 : 4,
      voterDistribution: {
        Workers: 25,
        Youth: 25,
        Nationalists: 20,
        Liberals: 10,
        Traditionalists: 20
      },
      supports: {},
      infrastructure: isCap ? 3 : 2,
      campaignLevel: 0,
      ownerPartyId: undefined
    };
  });
}

// 1. LIBYA (LY)
const libyaRegionNames = [
  'Al Butnan', 'Al Jabal al Akhdar', 'Al Jabal al Gharbi', 'Al Jifarah', 
  'Al Jufrah', 'Al Kufrah', 'Al Marj', 'Al Marqab', 'Al Wahat', 
  'An Nuqat al Khams', 'Az Zawiyah', 'Benghazi', 'Darnah', 'Ghat', 
  'Misratah', 'Murzuq', 'Nalut', 'Sabha', 'Surt', 'Tripoli', 
  'Wadi al Hayat', 'Wadi ash Shati\''
];

export const LIBYA: Country = {
  id: 'LY',
  name: 'Libya',
  description: 'A divided North African nation embroiled in protracted conflict between rival western and eastern administrations and local armed groups.',
  flag: '🇱🇾',
  seats: 200,
  parliamentName: 'House of Representatives / High Council of State (Suspended)',
  system: 'Civil War / Dual Administration',
  population: '7.1 Million',
  primaryColor: '#0284c7',
  countryMode: 'civilwar',
  capitalRegionId: 'Tripoli',
  regions: makeRegions(libyaRegionNames, 'LY', 'Tripoli'),
  rivals: [
    { id: 'LY_GNU', name: 'Government of National Unity (Tripoli)', leader: 'Abdul Hamid Dbeibeh', ideology: 'Centrist', symbol: 'Building', color: '#0284c7', baseSupport: 48 },
    { id: 'LY_LNA', name: 'Libyan National Army (Tobruk)', leader: 'Khalifa Haftar', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 52 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 2. SYRIA (SY)
const syriaRegionNames = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia', 
  'Tartus', 'Idlib', 'Al-Hasakah', 'Deir ez-Zor', 'Ar-Raqqah', 
  'Daraa', 'As-Suwayda', 'Quneitra'
];

export const SYRIA: Country = {
  id: 'SY',
  name: 'Syria',
  description: 'A Levantine nation fractured by over a decade of civil conflict, multifaceted insurgencies, and overlapping international spheres of influence.',
  flag: '🇸🇾',
  seats: 250,
  parliamentName: 'People\'s Council of Syria (Suspended)',
  system: 'Civil War / Multiple Belligerents',
  population: '22.1 Million',
  primaryColor: '#b91c1c',
  countryMode: 'civilwar',
  capitalRegionId: 'Damascus',
  regions: makeRegions(syriaRegionNames, 'SY', 'Damascus'),
  rivals: [
    { id: 'SY_GOV', name: 'Syrian Arab Republic (Damascus)', leader: 'Bashar al-Assad', ideology: 'Socialist', symbol: 'Building', color: '#b91c1c', baseSupport: 58 },
    { id: 'SY_SDF', name: 'Syrian Democratic Forces (AANES)', leader: 'Mazloum Abdi', ideology: 'Centrist', symbol: 'Users', color: '#eab308', baseSupport: 24 },
    { id: 'SY_SNA', name: 'Syrian National Army & Opposition', leader: 'Salim Idris', ideology: 'Conservative', symbol: 'Shield', color: '#15803d', baseSupport: 18 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 3. SUDAN (SD)
const sudanRegionNames = [
  'Khartoum', 'Al Jazirah', 'Kassala', 'Al Qadarif', 'Red Sea', 
  'River Nile', 'Northern', 'North Kordofan', 'South Kordofan', 
  'West Kordofan', 'North Darfur', 'West Darfur', 'South Darfur', 
  'Central Darfur', 'East Darfur', 'Blue Nile', 'Sennar', 'White Nile'
];

export const SUDAN: Country = {
  id: 'SD',
  name: 'Sudan',
  description: 'A northeast African state devastated by intense warfare between the Sudanese Armed Forces and the paramilitary Rapid Support Forces.',
  flag: '🇸🇩',
  seats: 300,
  parliamentName: 'National Legislature (Suspended)',
  system: 'Civil War / Military Junta Rivalry',
  population: '48.1 Million',
  primaryColor: '#1e3a8a',
  countryMode: 'civilwar',
  capitalRegionId: 'Khartoum',
  regions: makeRegions(sudanRegionNames, 'SD', 'Khartoum'),
  rivals: [
    { id: 'SD_SAF', name: 'Sudanese Armed Forces (SAF)', leader: 'Gen. Abdel Fattah al-Burhan', ideology: 'Conservative', symbol: 'Shield', color: '#1e3a8a', baseSupport: 51 },
    { id: 'SD_RSF', name: 'Rapid Support Forces (RSF)', leader: 'Mohamed Hamdan Dagalo', ideology: 'Nationalist', symbol: 'Flame', color: '#b45309', baseSupport: 49 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 4. MYANMAR (MM)
const myanmarRegionNames = [
  'Yangon', 'Mandalay', 'Naypyidaw', 'Sagaing', 'Bago', 'Magway', 
  'Ayeyarwady', 'Shan', 'Kachin', 'Chin', 'Rakhine', 'Kayin', 
  'Mon', 'Kayah', 'Tanintharyi'
];

export const MYANMAR: Country = {
  id: 'MM',
  name: 'Myanmar',
  description: 'A Southeast Asian country engulfed in nationwide armed revolution between the military junta and an alliance of ethnic armies and democratic forces.',
  flag: '🇲🇲',
  seats: 440,
  parliamentName: 'Pyidaungsu Hluttaw (Suspended)',
  system: 'Civil War / Armed Resistance',
  population: '54.5 Million',
  primaryColor: '#475569',
  countryMode: 'civilwar',
  capitalRegionId: 'Naypyidaw',
  regions: makeRegions(myanmarRegionNames, 'MM', 'Naypyidaw'),
  rivals: [
    { id: 'MM_JUNTA', name: 'State Administration Council (Tatmadaw)', leader: 'Min Aung Hlaing', ideology: 'Conservative', symbol: 'Shield', color: '#475569', baseSupport: 44 },
    { id: 'MM_NUG_PDF', name: 'National Unity Government & Brotherhood', leader: 'Duwa Lashi La', ideology: 'Liberal', symbol: 'Users', color: '#16a34a', baseSupport: 56 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 5. YEMEN (YE)
const yemenRegionNames = [
  'Sanaa', 'Amanat Al Asimah', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 
  'Dhamar', 'Hajjah', 'Amran', 'Saada', 'Al Bayda', 'Al Jawf', 
  'Marib', 'Shabwah', 'Hadramaut', 'Al Mahrah', 'Socotra', 
  'Lahij', 'Abyan', 'Al Dali', 'Raymah'
];

export const YEMEN: Country = {
  id: 'YE',
  name: 'Yemen',
  description: 'A fractured Arabian Peninsula nation marked by severe conflict between the Houthi movement and the internationally recognized Presidential Leadership Council.',
  flag: '🇾🇪',
  seats: 301,
  parliamentName: 'House of Representatives (Suspended)',
  system: 'Civil War / Fragmented Sovereignty',
  population: '33.7 Million',
  primaryColor: '#15803d',
  countryMode: 'civilwar',
  capitalRegionId: 'Sanaa',
  regions: makeRegions(yemenRegionNames, 'YE', 'Sanaa'),
  rivals: [
    { id: 'YE_HOU', name: 'Ansar Allah (Houthi Authority)', leader: 'Abdul-Malik al-Houthi', ideology: 'Conservative', symbol: 'Flame', color: '#15803d', baseSupport: 55 },
    { id: 'YE_PLC', name: 'Presidential Leadership Council (Aden)', leader: 'Rashad al-Alimi', ideology: 'Centrist', symbol: 'Building', color: '#0284c7', baseSupport: 45 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 6. SOMALIA (SO)
const somaliaRegionNames = [
  'Banaadir', 'Galguduud', 'Hiran', 'Middle Shabelle', 'Lower Shabelle', 
  'Middle Juba', 'Lower Juba', 'Gedo', 'Bay', 'Bakool', 'Mudug', 
  'Nugaal', 'Bari', 'Sool', 'Sanaag', 'Togdheer', 'Woqooyi Galbeed', 'Awdal'
];

export const SOMALIA: Country = {
  id: 'SO',
  name: 'Somalia',
  description: 'A Horn of Africa nation navigating long-standing federal state-building, regional clan balances, and persistent counter-insurgency operations.',
  flag: '🇸🇴',
  seats: 275,
  parliamentName: 'Federal Parliament of Somalia',
  system: 'Civil War / Federal Insurgency',
  population: '18.1 Million',
  primaryColor: '#2563eb',
  countryMode: 'civilwar',
  capitalRegionId: 'Banaadir',
  regions: makeRegions(somaliaRegionNames, 'SO', 'Banaadir'),
  rivals: [
    { id: 'SO_FGS', name: 'Federal Government of Somalia (Mogadishu)', leader: 'Hassan Sheikh Mohamud', ideology: 'Centrist', symbol: 'Building', color: '#2563eb', baseSupport: 62 },
    { id: 'SO_AS', name: 'Al-Shabaab Insurgency', leader: 'Ahmed Diriye', ideology: 'Conservative', symbol: 'Flame', color: '#1e293b', baseSupport: 38 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 7. AFGHANISTAN (AF)
const afghanistanRegionNames = [
  'Kabul', 'Kandahar', 'Herat', 'Balkh', 'Nangarhar', 'Helmand', 
  'Kunduz', 'Ghazni', 'Badakhshan', 'Baghlan', 'Takhar', 'Panjshir', 
  'Parwan', 'Wardak', 'Logar', 'Paktia', 'Paktika', 'Khost', 
  'Bamyan', 'Daykundi', 'Ghor', 'Farah', 'Nimruz', 'Zabul', 
  'Uruzgan', 'Samangan', 'Sar-e Pol', 'Jowzjan', 'Faryab', 
  'Badghis', 'Nuristan', 'Kunar', 'Laghman', 'Kapisa'
];

export const AFGHANISTAN: Country = {
  id: 'AF',
  name: 'Afghanistan',
  description: 'A mountainous Central Asian nation ruled by the Taliban theocracy, confronted with armed republican resistance and severe humanitarian challenges.',
  flag: '🇦🇫',
  seats: 249,
  parliamentName: 'Loya Jirga / Islamic Emirate Council',
  system: 'Theocratic Emirate / Guerrilla Front',
  population: '41.1 Million',
  primaryColor: '#1e293b',
  countryMode: 'civilwar',
  capitalRegionId: 'Kabul',
  regions: makeRegions(afghanistanRegionNames, 'AF', 'Kabul'),
  rivals: [
    { id: 'AF_TALIBAN', name: 'Islamic Emirate of Afghanistan (Taliban)', leader: 'Hibatullah Akhundzada', ideology: 'Conservative', symbol: 'Building', color: '#1e293b', baseSupport: 72 },
    { id: 'AF_NRF', name: 'National Resistance Front (NRF)', leader: 'Ahmad Massoud', ideology: 'Liberal', symbol: 'Shield', color: '#15803d', baseSupport: 28 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 8. UKRAINE (UA - Hybrid Mode)
const ukraineRegionNames = [
  'Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Dnipropetrovsk', 'Zaporizhzhia', 
  'Donetsk', 'Luhansk', 'Autonomous Republic of Crimea', 'Mykolaiv', 
  'Vinnytsia', 'Poltava', 'Chernihiv', 'Cherkasy', 'Sumy', 'Zhytomyr', 
  'Khmelnytskyi', 'Rivne', 'Ivano-Frankivsk', 'Ternopil', 'Volyn', 
  'Zakarpattia', 'Kirovohrad', 'Chernivtsi', 'Kherson'
];

export const UKRAINE: Country = {
  id: 'UA',
  name: 'Ukraine',
  description: 'An Eastern European democracy defending its national sovereignty amidst high-intensity war, operating under wartime martial law with unified institutional resilience.',
  flag: '🇺🇦',
  seats: 450,
  parliamentName: 'Verkhovna Rada of Ukraine',
  system: 'Semi-Presidential Republic (Martial Law)',
  population: '38.0 Million',
  primaryColor: '#0284c7',
  countryMode: 'hybrid',
  capitalRegionId: 'Kyiv',
  regions: makeRegions(ukraineRegionNames, 'UA', 'Kyiv'),
  rivals: [
    { id: 'SN', name: 'Servant of the People (Слуга народу)', leader: 'Volodymyr Zelenskyy', ideology: 'Centrist', symbol: 'Sparkles', color: '#10b981', baseSupport: 44 },
    { id: 'ES', name: 'European Solidarity (Європейська Солідарність)', leader: 'Petro Poroshenko', ideology: 'Conservative', symbol: 'Globe', color: '#1e40af', baseSupport: 26 },
    { id: 'BATK', name: 'Batkivshchyna (Батьківщина)', leader: 'Yulia Tymoshenko', ideology: 'Social Democrat', symbol: 'Heart', color: '#ef4444', baseSupport: 16 },
    { id: 'HOLOS', name: 'Holos (Голос)', leader: 'Kira Rudik', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 14 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 9. DEMOCRATIC REPUBLIC OF THE CONGO (CD / COD)
const drCongoRegionNames = [
  'Bas-Uele', 'Équateur', 'Haut-Katanga', 'Haut-Lomami', 'Haut-Uele', 
  'Ituri', 'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Kinshasa', 
  'Kongo-Central', 'Kwango', 'Kwilu', 'Lomami', 'Lualaba', 
  'Mai-Ndombe', 'Maniema', 'Mongala', 'Nord-Kivu', 'Nord-Ubangi', 
  'Sankuru', 'Sud-Kivu', 'Sud-Ubangi', 'Tanganyika', 'Tshopo', 'Tshuapa'
];

export const DR_CONGO: Country = {
  id: 'CD',
  name: 'Democratic Republic of the Congo',
  description: 'A vast, mineral-rich Central African nation embroiled in high-intensity conflict against the M23/AFC rebellion in North Kivu alongside SADC and Wazalendo allies.',
  flag: '🇨🇩',
  seats: 500,
  parliamentName: 'National Assembly of the DRC (Wartime Administration)',
  system: 'Civil War / Armed Conflict',
  population: '102.3 Million',
  primaryColor: '#0284c7',
  countryMode: 'civilwar',
  capitalRegionId: 'Kinshasa',
  regions: makeRegions(drCongoRegionNames, 'CD', 'Kinshasa'),
  rivals: [
    { id: 'CD_FARDC', name: 'Forces Armées de la RDC & SADC (FARDC)', leader: 'Félix Tshisekedi', ideology: 'Centrist', symbol: 'Building', color: '#0284c7', baseSupport: 60 },
    { id: 'CD_M23', name: 'Alliance Fleuve Congo & M23 (AFC/M23)', leader: 'Corneille Nangaa & Sultani Makenga', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 40 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

// 10. REPUBLIC OF THE CONGO (CG / COG - Sovereign Republic / Electoral Mode)
const republicOfCongoRegionNames = [
  'Brazzaville', 'Pointe-Noire', 'Bouenza', 'Cuvette', 'Cuvette-Ouest', 
  'Kouilou', 'Likouala', 'Lékoumou', 'Niari', 'Plateaux', 'Pool', 'Sangha'
];

export const REPUBLIC_OF_CONGO: Country = {
  id: 'CG',
  name: 'Republic of the Congo',
  description: 'A sovereign Central African republic on the right bank of the Congo River with its capital at Brazzaville, operating as a distinct unitary state.',
  flag: '🇨🇬',
  seats: 151,
  parliamentName: 'National Assembly of the Republic of the Congo',
  system: 'Presidential Republic',
  population: '6.1 Million',
  primaryColor: '#16a34a',
  countryMode: 'electoral',
  capitalRegionId: 'Brazzaville',
  regions: makeRegions(republicOfCongoRegionNames, 'CG', 'Brazzaville'),
  rivals: [
    { id: 'PCT', name: 'Congolese Party of Labour (PCT)', leader: 'Denis Sassou Nguesso', ideology: 'Socialist', symbol: 'Building', color: '#dc2626', baseSupport: 65 },
    { id: 'UPADS', name: 'Pan-African Union for Social Democracy (UPADS)', leader: 'Pascal Tsaty Mabiala', ideology: 'Social Democrat', symbol: 'Users', color: '#2563eb', baseSupport: 20 },
    { id: 'MCDDI', name: 'Congolese Movement for Democracy (MCDDI)', leader: 'Guy Brice Parfait Kolélas', ideology: 'Centrist', symbol: 'Shield', color: '#eab308', baseSupport: 15 }
  ],
  bills: [],
  campaignTurns: 52,
  electionCycleYears: 5
};

export const CIVIL_WAR_PLAYABLE_COUNTRIES: Country[] = [
  LIBYA,
  SYRIA,
  SUDAN,
  MYANMAR,
  YEMEN,
  SOMALIA,
  AFGHANISTAN,
  DR_CONGO
];

export const HYBRID_PLAYABLE_COUNTRIES: Country[] = [
  UKRAINE
];

/**
 * Authentic Real Political Party Rosters for Post-War Democratic Elections (Requirement 3)
 * War factions (e.g. GNU, LNA, SAF, RSF, SAC) are military belligerents and NEVER converted into political parties.
 */
export const REAL_COUNTRY_PARTIES: Record<string, RivalParty[]> = {
  CD: [
    { id: 'UDPS', name: 'Union for Democracy and Social Progress (UDPS)', leader: 'Félix Tshisekedi', ideology: 'Social Democrat', symbol: 'Building', color: '#0284c7', baseSupport: 35 },
    { id: 'ENSEMBLE', name: 'Ensemble pour la République', leader: 'Moïse Katumbi', ideology: 'Centrist', symbol: 'Globe', color: '#2563eb', baseSupport: 25 },
    { id: 'UNC', name: 'Union for the Congolese Nation (UNC)', leader: 'Vital Kamerhe', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 15 },
    { id: 'MLC', name: 'Movement for the Liberation of the Congo (MLC)', leader: 'Jean-Pierre Bemba', ideology: 'Nationalist', symbol: 'Shield', color: '#16a34a', baseSupport: 12 },
    { id: 'ECIDE', name: 'Engagement for Citizenship and Development (ECiDé)', leader: 'Martin Fayulu', ideology: 'Social Democrat', symbol: 'Sparkles', color: '#7c3aed', baseSupport: 8 },
    { id: 'PPRD', name: 'People\'s Party for Reconstruction and Democracy (PPRD)', leader: 'Joseph Kabila', ideology: 'Conservative', symbol: 'Scale', color: '#dc2626', baseSupport: 5 }
  ],
  COD: [
    { id: 'UDPS', name: 'Union for Democracy and Social Progress (UDPS)', leader: 'Félix Tshisekedi', ideology: 'Social Democrat', symbol: 'Building', color: '#0284c7', baseSupport: 35 },
    { id: 'ENSEMBLE', name: 'Ensemble pour la République', leader: 'Moïse Katumbi', ideology: 'Centrist', symbol: 'Globe', color: '#2563eb', baseSupport: 25 },
    { id: 'UNC', name: 'Union for the Congolese Nation (UNC)', leader: 'Vital Kamerhe', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 15 },
    { id: 'MLC', name: 'Movement for the Liberation of the Congo (MLC)', leader: 'Jean-Pierre Bemba', ideology: 'Nationalist', symbol: 'Shield', color: '#16a34a', baseSupport: 12 },
    { id: 'ECIDE', name: 'Engagement for Citizenship and Development (ECiDé)', leader: 'Martin Fayulu', ideology: 'Social Democrat', symbol: 'Sparkles', color: '#7c3aed', baseSupport: 8 },
    { id: 'PPRD', name: 'People\'s Party for Reconstruction and Democracy (PPRD)', leader: 'Joseph Kabila', ideology: 'Conservative', symbol: 'Scale', color: '#dc2626', baseSupport: 5 }
  ],
  LY: [
    { id: 'NFA', name: 'National Forces Alliance (تحالف القوى الوطنية)', leader: 'Ali Tekbali', ideology: 'Centrist', symbol: 'Building', color: '#0284c7', baseSupport: 36 },
    { id: 'JCP', name: 'Justice and Construction Party (حزب العدالة والبناء)', leader: 'Emad al-Bannani', ideology: 'Conservative', symbol: 'Scale', color: '#16a34a', baseSupport: 24 },
    { id: 'NFP', name: 'National Front Party (حزب الجبهة الوطنية)', leader: 'Mohammed Magariaf', ideology: 'Social Democrat', symbol: 'Globe', color: '#f59e0b', baseSupport: 18 },
    { id: 'ULP', name: 'Union for Homeland (الاتحاد من أجل الوطن)', leader: 'Abdul Rahman Sewehli', ideology: 'Liberal', symbol: 'Compass', color: '#06b6d4', baseSupport: 12 },
    { id: 'LNP', name: 'Libyan National Democratic Party', leader: 'Asaad Mohsen Zuhio', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 10 }
  ],
  SY: [
    { id: 'BAATH', name: 'Arab Socialist Ba\'ath Party (حزب البعث العربي الاشتراكي)', leader: 'Hamouda Sabbagh', ideology: 'Socialist', symbol: 'Building', color: '#b91c1c', baseSupport: 34 },
    { id: 'SSNP', name: 'Syrian Social Nationalist Party (الحزب السوري القومي الاجتماعي)', leader: 'Rabi Deeb', ideology: 'Nationalist', symbol: 'Shield', color: '#1e3a8a', baseSupport: 22 },
    { id: 'SNC', name: 'National Coalition for Syrian Revolutionary Forces', leader: 'Hadi al-Bahra', ideology: 'Liberal', symbol: 'Globe', color: '#059669', baseSupport: 20 },
    { id: 'KDP_SY', name: 'Kurdish Democratic Progressive Party', leader: 'Abdulhamid Darwish', ideology: 'Social Democrat', symbol: 'Sparkles', color: '#eab308', baseSupport: 14 },
    { id: 'CDM', name: 'Civil Democratic Movement (التيار المدني الديمقراطي)', leader: 'Michel Kilo', ideology: 'Centrist', symbol: 'Users', color: '#2563eb', baseSupport: 10 }
  ],
  SD: [
    { id: 'NUP', name: 'National Umma Party (حزب الأمة القومي)', leader: 'Fadlallah Burma Nasir', ideology: 'Centrist', symbol: 'Building', color: '#15803d', baseSupport: 32 },
    { id: 'DUP', name: 'Democratic Unionist Party (الحزب الاتحادي الديمقراطي)', leader: 'Muhammad Uthman al-Mirghani', ideology: 'Conservative', symbol: 'Scale', color: '#1e40af', baseSupport: 25 },
    { id: 'SCOP', name: 'Sudanese Congress Party (حزب المؤتمر السوداني)', leader: 'Omer El-Digair', ideology: 'Social Democrat', symbol: 'Users', color: '#f97316', baseSupport: 20 },
    { id: 'SCP', name: 'Sudanese Communist Party (الحزب الشيوعي السوداني)', leader: 'Muhammad Mukhtar al-Khatib', ideology: 'Socialist', symbol: 'Flame', color: '#dc2626', baseSupport: 13 },
    { id: 'SPLM_N', name: 'SPLM-North Democratic Movement', leader: 'Yasir Arman', ideology: 'Liberal', symbol: 'Globe', color: '#0891b2', baseSupport: 10 }
  ],
  MM: [
    { id: 'NLD', name: 'National League for Democracy (NLD)', leader: 'Aung San Suu Kyi', ideology: 'Liberal', symbol: 'Sparkles', color: '#dc2626', baseSupport: 48 },
    { id: 'USDP', name: 'Union Solidarity and Development Party (USDP)', leader: 'Khin Yi', ideology: 'Nationalist', symbol: 'Shield', color: '#15803d', baseSupport: 24 },
    { id: 'SNLD', name: 'Shan Nationalities League for Democracy (SNLD)', leader: 'Sai Nyunt Lwin', ideology: 'Centrist', symbol: 'Building', color: '#f59e0b', baseSupport: 14 },
    { id: 'DPNS', name: 'Democratic Party for a New Society (DPNS)', leader: 'Aung Moe Zaw', ideology: 'Social Democrat', symbol: 'Users', color: '#2563eb', baseSupport: 8 },
    { id: 'ANP', name: 'Arakan National Party (ANP)', leader: 'Thar Tun Hla', ideology: 'Conservative', symbol: 'Compass', color: '#7c3aed', baseSupport: 6 }
  ],
  YE: [
    { id: 'GPC', name: 'General People\'s Congress (المؤتمر الشعبي العام)', leader: 'Rashad al-Alimi', ideology: 'Nationalist', symbol: 'Building', color: '#2563eb', baseSupport: 35 },
    { id: 'ISLAH', name: 'Yemeni Congregation for Reform (التجمع اليمني للإصلاح)', leader: 'Mohammed al-Yadumi', ideology: 'Conservative', symbol: 'Scale', color: '#16a34a', baseSupport: 28 },
    { id: 'YSP', name: 'Yemeni Socialist Party (الحزب الاشتراكي اليمني)', leader: 'Abdulraham Al-Saqqaf', ideology: 'Social Democrat', symbol: 'Flame', color: '#dc2626', baseSupport: 18 },
    { id: 'NUPO', name: 'Nasserist Unionist People\'s Organization', leader: 'Abdullah No\'man', ideology: 'Socialist', symbol: 'Users', color: '#d97706', baseSupport: 11 },
    { id: 'HIRAK', name: 'Southern Movement Civic Bloc (الحراك الجنوبي)', leader: 'Fadi Baoum', ideology: 'Centrist', symbol: 'Globe', color: '#059669', baseSupport: 8 }
  ],
  SO: [
    { id: 'UPD', name: 'Union for Peace and Development (UPD)', leader: 'Hassan Sheikh Mohamud', ideology: 'Centrist', symbol: 'Building', color: '#2563eb', baseSupport: 40 },
    { id: 'HQ', name: 'Himilo Qaran (National Vision Party)', leader: 'Sharif Sheikh Ahmed', ideology: 'Conservative', symbol: 'Scale', color: '#15803d', baseSupport: 26 },
    { id: 'WADAJIR', name: 'Wadajir Party', leader: 'Abdirahman Abdishakur', ideology: 'Liberal', symbol: 'Sparkles', color: '#f59e0b', baseSupport: 18 },
    { id: 'SAHAN', name: 'Sahan Democratic Party', leader: 'Hussein Arab Isse', ideology: 'Social Democrat', symbol: 'Users', color: '#06b6d4', baseSupport: 16 }
  ],
  AF: [
    { id: 'NCA', name: 'National Coalition of Afghanistan', leader: 'Abdullah Abdullah', ideology: 'Centrist', symbol: 'Building', color: '#2563eb', baseSupport: 36 },
    { id: 'JI', name: 'Jamiat-e Islami', leader: 'Salahuddin Rabbani', ideology: 'Conservative', symbol: 'Scale', color: '#15803d', baseSupport: 26 },
    { id: 'HW', name: 'Hezb-e Wahdat Civic Party', leader: 'Mohammad Mohaqiq', ideology: 'Social Democrat', symbol: 'Users', color: '#d97706', baseSupport: 18 },
    { id: 'ASDP', name: 'Afghan Social Democratic Party (Afghan Mellat)', leader: 'Stana Gul Sherzad', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 12 },
    { id: 'RDF', name: 'Republican Democratic Front', leader: 'Fawzia Koofi', ideology: 'Liberal', symbol: 'Sparkles', color: '#7c3aed', baseSupport: 8 }
  ]
};

export function getRealPartiesForCountry(countryId: string): RivalParty[] | null {
  return REAL_COUNTRY_PARTIES[countryId] || null;
}

