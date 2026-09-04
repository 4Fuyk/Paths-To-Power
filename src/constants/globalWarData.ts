/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GlobalWar {
  id: string;
  name: string;
  scenario: '2026' | '1950' | '1936' | '1920' | '1914' | 'ANY';
  type: 'INTERSTATE' | 'CIVIL_WAR' | 'REGIONAL';
  belligerentsA: string[]; // Country IDs, e.g. ['RU']
  belligerentsB: string[]; // Country IDs, e.g. ['UA']
  namesA: string[];
  namesB: string[];
  startDate: string;
  status: 'ACTIVE' | 'CEASEFIRE' | 'RESOLVED';
  intensity: 'Critical' | 'High' | 'Moderate';
  description: string;
  theaterLocation: string;
}

export const INITIAL_GLOBAL_WARS: GlobalWar[] = [
  // ==========================================
  // 2026 MODERN CONFLICTS
  // ==========================================
  {
    id: 'WAR_RU_UA_2026',
    name: 'Russo-Ukrainian War',
    scenario: '2026',
    type: 'INTERSTATE',
    belligerentsA: ['RU'],
    belligerentsB: ['UA'],
    namesA: ['Russian Federation'],
    namesB: ['Ukraine'],
    startDate: 'February 2022',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Active full-scale frontline warfare across the Donbas, Zaporizhzhia, and frontier border sectors.',
    theaterLocation: 'Eastern Europe / Donbas & Black Sea Basin'
  },
  {
    id: 'WAR_IL_PS_2026',
    name: 'Israel–Palestine Conflict & Regional Tensions',
    scenario: '2026',
    type: 'INTERSTATE',
    belligerentsA: ['IL'],
    belligerentsB: ['PS', 'LB', 'IR'],
    namesA: ['Israel'],
    namesB: ['Palestine (Gaza)', 'Lebanon', 'Iran (Regional Axis)'],
    startDate: 'October 2023',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'High-intensity regional conflict across Gaza, southern Lebanon border, and missile standoff corridors.',
    theaterLocation: 'Levant / Eastern Mediterranean'
  },
  {
    id: 'WAR_SD_CIVIL_2026',
    name: 'Sudanese Armed Conflict (SAF vs RSF)',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['SD'],
    belligerentsB: ['SD_RSF'],
    namesA: ['Sudanese Armed Forces (SAF)'],
    namesB: ['Rapid Support Forces (RSF)'],
    startDate: 'April 2023',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Devastating civil conflict across Khartoum, Darfur, and Kordofan causing massive humanitarian displacement.',
    theaterLocation: 'Sudan / Nile Basin & Red Sea Coast'
  },
  {
    id: 'WAR_MM_CIVIL_2026',
    name: 'Myanmar Civil War & Spring Revolution',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['MM'],
    belligerentsB: ['MM_NUG'],
    namesA: ['State Administration Council (Tatmadaw)'],
    namesB: ['National Unity Government & Ethnic Alliances'],
    startDate: 'February 2021',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Multi-front nationwide resistance by People’s Defense Forces and ethnic armed organizations against the military junta.',
    theaterLocation: 'Southeast Asia / Myanmar Highlands & Borderlands'
  },
  {
    id: 'WAR_SY_CIVIL_2026',
    name: 'Syrian Conflict & Regional Fragmentation',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['SY'],
    belligerentsB: ['SY_OPP', 'SY_SDF'],
    namesA: ['Syrian Arab Republic (Damascus)'],
    namesB: ['Opposition & SDF Coalitions'],
    startDate: 'March 2011',
    status: 'ACTIVE',
    intensity: 'Moderate',
    description: 'Fragmented territorial control between government forces, Syrian Democratic Forces, and northern opposition.',
    theaterLocation: 'Levant / Northern Syria & Euphrates'
  },
  {
    id: 'WAR_LY_CIVIL_2026',
    name: 'Libyan Dual-Administration Crisis',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['LY'],
    belligerentsB: ['LY_LNA'],
    namesA: ['Government of National Unity (Tripoli)'],
    namesB: ['Libyan National Army (Tobruk)'],
    startDate: 'May 2014',
    status: 'ACTIVE',
    intensity: 'Moderate',
    description: 'Political-military partition of Libya between western Tripoli administration and eastern Haftar forces.',
    theaterLocation: 'North Africa / Mediterranean Coast & Oil Crescent'
  },
  {
    id: 'WAR_YE_CIVIL_2026',
    name: 'Yemeni Civil Conflict & Red Sea Chokepoint Crisis',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['YE_PLC'],
    belligerentsB: ['YE'],
    namesA: ['Presidential Leadership Council (Aden)'],
    namesB: ['Ansar Allah (Houthi Movement)'],
    startDate: 'September 2014',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Partitioned state with Houthi control of Sanaa and Red Sea coastal missile sites challenging maritime transit.',
    theaterLocation: 'Arabian Peninsula / Bab el-Mandeb Strait'
  },
  {
    id: 'WAR_ML_SAHEL_2026',
    name: 'Sahel War & Azawad Insurgency',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['ML'],
    belligerentsB: ['ML_REBELS'],
    namesA: ['Malian Armed Forces & AES Alliance'],
    namesB: ['CSP-DPA (Azawad) & Insurgent Fronts'],
    startDate: 'January 2012',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Desert counter-insurgency and sovereignty conflict in northern Mali across Kidal and Timbuktu.',
    theaterLocation: 'West Africa / Sahara-Sahel Corridor'
  },
  {
    id: 'WAR_CD_EAST_2026',
    name: 'Eastern DRC & M23 Great Lakes Conflict',
    scenario: '2026',
    type: 'CIVIL_WAR',
    belligerentsA: ['CD'],
    belligerentsB: ['CD_M23'],
    namesA: ['FARDC & SADC Coalition'],
    namesB: ['March 23 Movement (M23 / AFC)'],
    startDate: 'November 2021',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Armed clashes in North Kivu and surrounding volcanic highlands threatening regional trade hubs.',
    theaterLocation: 'Central Africa / Lake Kivu & Goma Basin'
  },

  // ==========================================
  // 1950 EARLY COLD WAR CONFLICTS
  // ==========================================
  {
    id: 'WAR_KOREA_1950',
    name: 'Korean War',
    scenario: '1950',
    type: 'INTERSTATE',
    belligerentsA: ['KR', 'US', 'GB', 'TR', 'CA', 'AU'],
    belligerentsB: ['KP', 'CN', 'SU'],
    namesA: ['Republic of Korea & UN Command'],
    namesB: ['DPRK & Chinese People’s Volunteers'],
    startDate: 'June 1950',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Intense ideological and conventional conflict along the 38th Parallel and the Korean Peninsula.',
    theaterLocation: 'East Asia / Korean Peninsula'
  },
  {
    id: 'WAR_INDOCHINA_1950',
    name: 'First Indochina War',
    scenario: '1950',
    type: 'INTERSTATE',
    belligerentsA: ['FR'],
    belligerentsB: ['VN'],
    namesA: ['French Union & State of Vietnam'],
    namesB: ['Viet Minh (Democratic Republic of Vietnam)'],
    startDate: 'December 1946',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Colonial liberation war waged across northern Tonkin and Vietnamese highlands.',
    theaterLocation: 'Southeast Asia / Indochina'
  },

  // ==========================================
  // 1936 INTERWAR & WWII PRELUDE
  // ==========================================
  {
    id: 'WAR_SPAIN_1936',
    name: 'Spanish Civil War',
    scenario: '1936',
    type: 'CIVIL_WAR',
    belligerentsA: ['ES'],
    belligerentsB: ['ES_NAT'],
    namesA: ['Spanish Republic (Loyalists)'],
    namesB: ['Nationalist Faction (Franco)'],
    startDate: 'July 1936',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Ideological struggle for Spain involving international volunteer brigades and foreign axis intervention.',
    theaterLocation: 'Iberian Peninsula / Madrid & Ebro Fronts'
  },
  {
    id: 'WAR_SINO_JAPANESE_1936',
    name: 'Second Sino-Japanese Conflict',
    scenario: '1936',
    type: 'INTERSTATE',
    belligerentsA: ['CN'],
    belligerentsB: ['JP'],
    namesA: ['Republic of China (Nationalists & CPC)'],
    namesB: ['Empire of Japan'],
    startDate: 'July 1937',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Total continental war for survival across mainland China, Manchuria, and Shanghai.',
    theaterLocation: 'East Asia / Mainland China'
  },
  {
    id: 'WAR_ITALO_ETHIOPIAN_1936',
    name: 'Second Italo-Ethiopian War',
    scenario: '1936',
    type: 'INTERSTATE',
    belligerentsA: ['IT'],
    belligerentsB: ['ET'],
    namesA: ['Kingdom of Italy'],
    namesB: ['Ethiopian Empire'],
    startDate: 'October 1935',
    status: 'ACTIVE',
    intensity: 'High',
    description: 'Fascist Italian invasion of the sovereign Ethiopian Empire.',
    theaterLocation: 'Horn of Africa / Abyssinian Highlands'
  },

  // ==========================================
  // 1920 POST-WWI & REVOLUTIONARY CONFLICTS
  // ==========================================
  {
    id: 'WAR_TURKISH_INDEP_1920',
    name: 'Turkish War of Independence',
    scenario: '1920',
    type: 'INTERSTATE',
    belligerentsA: ['TR'],
    belligerentsB: ['GR', 'FR', 'GB', 'AM'],
    namesA: ['Ankara Government (Grand National Assembly)'],
    namesB: ['Kingdom of Greece & Allied Powers'],
    startDate: 'May 1919',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'National liberation campaign led by Mustafa Kemal Pasha to overturn the Treaty of Sèvres.',
    theaterLocation: 'Anatolia / Sakarya & Western Front'
  },
  {
    id: 'WAR_POLISH_SOVIET_1920',
    name: 'Polish-Soviet War',
    scenario: '1920',
    type: 'INTERSTATE',
    belligerentsA: ['PL'],
    belligerentsB: ['SU'],
    namesA: ['Second Polish Republic'],
    namesB: ['Russian Soviet Federative Socialist Republic'],
    startDate: 'February 1919',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Crucial border warfare determining the post-WWI frontier and the defense of Warsaw.',
    theaterLocation: 'Central & Eastern Europe / Vistula River'
  },
  {
    id: 'WAR_RUSSIAN_CIVIL_1920',
    name: 'Russian Civil War',
    scenario: '1920',
    type: 'CIVIL_WAR',
    belligerentsA: ['SU'],
    belligerentsB: ['SU_WHITE'],
    namesA: ['Bolshevik Red Army'],
    namesB: ['White Movement & Allied Expeditionary Forces'],
    startDate: 'November 1917',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'All-out ideological civil conflict for control of the former Russian Empire.',
    theaterLocation: 'Eurasia / Russian Steppes & Siberia'
  },

  // ==========================================
  // 1914 WORLD WAR I (GREAT WAR)
  // ==========================================
  {
    id: 'WAR_WWI_WEST_1914',
    name: 'World War I (Western Front)',
    scenario: '1914',
    type: 'INTERSTATE',
    belligerentsA: ['DE'],
    belligerentsB: ['FR', 'GB', 'BE'],
    namesA: ['German Empire'],
    namesB: ['France, Great Britain & Belgium'],
    startDate: 'August 1914',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Entrenched total warfare stretching from the North Sea to the Swiss border.',
    theaterLocation: 'Western Europe / Marne, Somme & Flanders'
  },
  {
    id: 'WAR_WWI_EAST_1914',
    name: 'World War I (Eastern Front)',
    scenario: '1914',
    type: 'INTERSTATE',
    belligerentsA: ['DE', 'AT'],
    belligerentsB: ['RU'],
    namesA: ['German Empire & Austria-Hungary'],
    namesB: ['Russian Empire'],
    startDate: 'August 1914',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Vast mobile warfare across East Prussia, Galicia, and Poland.',
    theaterLocation: 'Eastern Europe / Tannenberg & Carpathian Passes'
  },
  {
    id: 'WAR_WWI_MIDDLE_EAST_1914',
    name: 'World War I (Ottoman & Middle Eastern Fronts)',
    scenario: '1914',
    type: 'INTERSTATE',
    belligerentsA: ['TR'],
    belligerentsB: ['GB', 'RU', 'FR'],
    namesA: ['Ottoman Empire'],
    namesB: ['British Empire & Russian Empire'],
    startDate: 'November 1914',
    status: 'ACTIVE',
    intensity: 'Critical',
    description: 'Critical campaigns spanning Gallipoli, the Caucasus, Mesopotamia, and Sinai-Palestine.',
    theaterLocation: 'Middle East / Dardanelles & Mesopotamia'
  }
];

/**
 * Returns active global wars matching the specified scenario
 */
export function getInitialGlobalWars(scenario: string): GlobalWar[] {
  const s = scenario || '2026';
  return INITIAL_GLOBAL_WARS.filter(w => w.scenario === s || w.scenario === 'ANY');
}

/**
 * Returns initial diplomatic relations for a given country in a scenario,
 * ensuring real historical and active wars are pre-seeded accurately!
 */
export function getInitialDiplomaticRelations(
  scenario: string,
  playerCountryId: string
): Record<string, { status: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }> {
  const baseScenario = scenario || '2026';
  const cId = playerCountryId || 'TR';

  const defaultRelations: Record<string, { status: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }> = {
    TR: { status: 'Neutral', opinion: 50 },
    US: { status: 'Neutral', opinion: 55 },
    DE: { status: 'Neutral', opinion: 60 },
    GB: { status: 'Neutral', opinion: 50 },
    BR: { status: 'Neutral', opinion: 45 },
    EG: { status: 'Neutral', opinion: 40 },
    JP: { status: 'Neutral', opinion: 65 },
    RU: { status: 'Neutral', opinion: 45 },
    UA: { status: 'Neutral', opinion: 50 },
    IL: { status: 'Neutral', opinion: 40 },
    PS: { status: 'Neutral', opinion: 40 },
    CN: { status: 'Neutral', opinion: 50 },
    FR: { status: 'Neutral', opinion: 55 },
    IT: { status: 'Neutral', opinion: 55 },
    IN: { status: 'Neutral', opinion: 50 },
    SD: { status: 'Neutral', opinion: 40 },
    MM: { status: 'Neutral', opinion: 40 },
    SY: { status: 'Neutral', opinion: 30 },
    LY: { status: 'Neutral', opinion: 35 },
    YE: { status: 'Neutral', opinion: 30 },
    ML: { status: 'Neutral', opinion: 40 },
    CD: { status: 'Neutral', opinion: 40 },
    ET: { status: 'Neutral', opinion: 45 },
    HT: { status: 'Neutral', opinion: 35 },
    GR: { status: 'Neutral', opinion: 40 },
    PL: { status: 'Neutral', opinion: 55 }
  };

  // ==========================================
  // SCENARIO 2026 REAL-WORLD RELATIONS
  // ==========================================
  if (baseScenario === '2026') {
    if (cId === 'RU') {
      defaultRelations.UA = { status: 'At War', opinion: 0 };
      defaultRelations.US = { status: 'Sanctioned', opinion: 15 };
      defaultRelations.GB = { status: 'Sanctioned', opinion: 10 };
      defaultRelations.DE = { status: 'Sanctioned', opinion: 20 };
      defaultRelations.FR = { status: 'Sanctioned', opinion: 20 };
      defaultRelations.PL = { status: 'Sanctioned', opinion: 10 };
      defaultRelations.CN = { status: 'Alliance', opinion: 85 };
      defaultRelations.BY = { status: 'Alliance', opinion: 95 };
      defaultRelations.IR = { status: 'Alliance', opinion: 80 };
      defaultRelations.TR = { status: 'Neutral', opinion: 50 };
      defaultRelations.IN = { status: 'Neutral', opinion: 65 };
    } else if (cId === 'UA') {
      defaultRelations.RU = { status: 'At War', opinion: 0 };
      defaultRelations.US = { status: 'Alliance', opinion: 90 };
      defaultRelations.GB = { status: 'Alliance', opinion: 90 };
      defaultRelations.DE = { status: 'Alliance', opinion: 85 };
      defaultRelations.PL = { status: 'Alliance', opinion: 85 };
      defaultRelations.FR = { status: 'Alliance', opinion: 80 };
      defaultRelations.TR = { status: 'Defensive Pact', opinion: 65 };
    } else if (cId === 'IL') {
      defaultRelations.PS = { status: 'At War', opinion: 0 };
      defaultRelations.LB = { status: 'At War', opinion: 5 };
      defaultRelations.IR = { status: 'Sanctioned', opinion: 0 };
      defaultRelations.US = { status: 'Alliance', opinion: 95 };
      defaultRelations.DE = { status: 'Alliance', opinion: 85 };
      defaultRelations.GB = { status: 'Alliance', opinion: 80 };
      defaultRelations.EG = { status: 'Non-Aggression', opinion: 55 };
    } else if (cId === 'PS') {
      defaultRelations.IL = { status: 'At War', opinion: 0 };
      defaultRelations.IR = { status: 'Alliance', opinion: 85 };
      defaultRelations.TR = { status: 'Alliance', opinion: 80 };
      defaultRelations.EG = { status: 'Neutral', opinion: 55 };
      defaultRelations.US = { status: 'Sanctioned', opinion: 15 };
    } else if (cId === 'US') {
      defaultRelations.RU = { status: 'Sanctioned', opinion: 15 };
      defaultRelations.CN = { status: 'Sanctioned', opinion: 30 };
      defaultRelations.IR = { status: 'Sanctioned', opinion: 5 };
      defaultRelations.GB = { status: 'Alliance', opinion: 95 };
      defaultRelations.DE = { status: 'Alliance', opinion: 85 };
      defaultRelations.FR = { status: 'Alliance', opinion: 85 };
      defaultRelations.JP = { status: 'Alliance', opinion: 90 };
      defaultRelations.UA = { status: 'Alliance', opinion: 90 };
      defaultRelations.IL = { status: 'Alliance', opinion: 95 };
      defaultRelations.TR = { status: 'Defensive Pact', opinion: 60 };
    } else if (cId === 'TR') {
      defaultRelations.AZ = { status: 'Alliance', opinion: 98 };
      defaultRelations.US = { status: 'Defensive Pact', opinion: 60 };
      defaultRelations.DE = { status: 'Neutral', opinion: 55 };
      defaultRelations.RU = { status: 'Neutral', opinion: 50 };
      defaultRelations.UA = { status: 'Defensive Pact', opinion: 65 };
      defaultRelations.GR = { status: 'Neutral', opinion: 45 };
      defaultRelations.EG = { status: 'Neutral', opinion: 50 };
      defaultRelations.SY = { status: 'Sanctioned', opinion: 25 };
    } else if (cId === 'DE') {
      defaultRelations.FR = { status: 'Alliance', opinion: 95 };
      defaultRelations.US = { status: 'Alliance', opinion: 85 };
      defaultRelations.GB = { status: 'Alliance', opinion: 85 };
      defaultRelations.PL = { status: 'Alliance', opinion: 80 };
      defaultRelations.UA = { status: 'Alliance', opinion: 85 };
      defaultRelations.RU = { status: 'Sanctioned', opinion: 20 };
    }
  }

  // ==========================================
  // SCENARIO 1950 CONFLICTS
  // ==========================================
  if (baseScenario === '1950') {
    if (['KR', 'US', 'GB', 'TR', 'AU', 'CA'].includes(cId)) {
      defaultRelations.KP = { status: 'At War', opinion: 0 };
      defaultRelations.CN = { status: 'At War', opinion: 0 };
      defaultRelations.SU = { status: 'Sanctioned', opinion: 15 };
    } else if (['CN', 'KP'].includes(cId)) {
      defaultRelations.KR = { status: 'At War', opinion: 0 };
      defaultRelations.US = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'At War', opinion: 0 };
      defaultRelations.SU = { status: 'Alliance', opinion: 90 };
    } else if (cId === 'FR') {
      defaultRelations.VN = { status: 'At War', opinion: 0 };
      defaultRelations.US = { status: 'Alliance', opinion: 80 };
      defaultRelations.GB = { status: 'Alliance', opinion: 85 };
    }
  }

  // ==========================================
  // SCENARIO 1936 CONFLICTS
  // ==========================================
  if (baseScenario === '1936') {
    if (cId === 'JP') {
      defaultRelations.CN = { status: 'At War', opinion: 0 };
      defaultRelations.SU = { status: 'Sanctioned', opinion: 20 };
      defaultRelations.DE = { status: 'Defensive Pact', opinion: 75 };
    } else if (cId === 'CN') {
      defaultRelations.JP = { status: 'At War', opinion: 0 };
      defaultRelations.US = { status: 'Defensive Pact', opinion: 70 };
    } else if (cId === 'IT') {
      defaultRelations.ET = { status: 'At War', opinion: 0 };
      defaultRelations.DE = { status: 'Alliance', opinion: 85 };
    }
  }

  // ==========================================
  // SCENARIO 1920 CONFLICTS
  // ==========================================
  if (baseScenario === '1920') {
    if (cId === 'TR') {
      defaultRelations.GR = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'At War', opinion: 10 };
      defaultRelations.FR = { status: 'At War', opinion: 15 };
      defaultRelations.AM = { status: 'At War', opinion: 0 };
      defaultRelations.SU = { status: 'Defensive Pact', opinion: 75 }; // Soviet aid to Ankara
    } else if (cId === 'GR') {
      defaultRelations.TR = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'Alliance', opinion: 85 };
    } else if (cId === 'PL') {
      defaultRelations.SU = { status: 'At War', opinion: 0 };
      defaultRelations.FR = { status: 'Alliance', opinion: 80 };
    } else if (cId === 'SU') {
      defaultRelations.PL = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'Sanctioned', opinion: 15 };
      defaultRelations.FR = { status: 'Sanctioned', opinion: 15 };
    }
  }

  // ==========================================
  // SCENARIO 1914 CONFLICTS
  // ==========================================
  if (baseScenario === '1914') {
    if (cId === 'DE') {
      defaultRelations.FR = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'At War', opinion: 0 };
      defaultRelations.RU = { status: 'At War', opinion: 0 };
      defaultRelations.BE = { status: 'At War', opinion: 0 };
      defaultRelations.AT = { status: 'Alliance', opinion: 95 };
      defaultRelations.TR = { status: 'Alliance', opinion: 85 };
    } else if (cId === 'FR') {
      defaultRelations.DE = { status: 'At War', opinion: 0 };
      defaultRelations.AT = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'Alliance', opinion: 95 };
      defaultRelations.RU = { status: 'Alliance', opinion: 90 };
    } else if (cId === 'GB') {
      defaultRelations.DE = { status: 'At War', opinion: 0 };
      defaultRelations.AT = { status: 'At War', opinion: 0 };
      defaultRelations.TR = { status: 'At War', opinion: 0 };
      defaultRelations.FR = { status: 'Alliance', opinion: 95 };
      defaultRelations.RU = { status: 'Alliance', opinion: 85 };
    } else if (cId === 'TR') {
      defaultRelations.RU = { status: 'At War', opinion: 0 };
      defaultRelations.GB = { status: 'At War', opinion: 0 };
      defaultRelations.FR = { status: 'At War', opinion: 0 };
      defaultRelations.DE = { status: 'Alliance', opinion: 90 };
      defaultRelations.AT = { status: 'Alliance', opinion: 85 };
    }
  }

  return defaultRelations;
}
