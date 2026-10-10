/**
 * Real Historical & Modern Generals Database
 * Filtered by Country and Scenario Year
 */

export interface WarGeneral {
  id: string;
  name: string;
  countryId: string;
  factionId?: string; // e.g. 'LY_GNU', 'LY_LNA', 'UA_ZSU', 'RU_FORCES'
  role: string;
  avatar: string; // emoji or visual badge
  era: 'MODERN' | '1950' | '1936' | '1914' | 'ANY';
  bonuses: {
    attackBonus: number; // e.g. 0.20 (+20% attack)
    defenseBonus: number; // e.g. 0.25 (+25% defense)
    supplyBonus: number; // e.g. 0.15 (+15% supply efficiency)
  };
  specialty: string;
  description: string;
}

export const WAR_GENERALS_DATABASE: WarGeneral[] = [
  // ==========================================
  // LIBYA (Modern / 2026)
  // ==========================================
  {
    id: 'gen_ly_haftar',
    name: 'Field Marshal Khalifa Haftar',
    countryId: 'LY',
    factionId: 'LY_LNA',
    role: 'Commander-in-Chief, Libyan National Army',
    avatar: '🎖️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.22, defenseBonus: 0.15, supplyBonus: 0.05 },
    specialty: 'Desert Offensive & Artillery Focus',
    description: 'Supreme military commander of eastern Libya with extensive conventional and mechanized combat experience.'
  },
  {
    id: 'gen_ly_haddad',
    name: 'Lt. Gen. Mohamed al-Haddad',
    countryId: 'LY',
    factionId: 'LY_GNU',
    role: 'Chief of General Staff, GNU Armed Forces',
    avatar: '🛡️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.12, defenseBonus: 0.25, supplyBonus: 0.20 },
    specialty: 'Coalition Defense & Logistics Integration',
    description: 'Western Libyan staff commander overseeing Tripolitanian regular and allied brigade formations.'
  },
  {
    id: 'gen_ly_juwaili',
    name: 'Major Gen. Osama al-Juwaili',
    countryId: 'LY',
    factionId: 'LY_GNU',
    role: 'Western Military Region Commander',
    avatar: '⚔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.20, defenseBonus: 0.18, supplyBonus: 0.10 },
    specialty: 'Zintan Mountain Mobile Armor',
    description: 'Seasoned western commander specializing in rapid armored maneuvers across Jabal Nafusa and Tripoli borders.'
  },
  {
    id: 'gen_ly_saddam',
    name: 'Major Gen. Saddam Haftar',
    countryId: 'LY',
    factionId: 'LY_LNA',
    role: 'Ground Forces Commander, LNA',
    avatar: '🦅',
    era: 'MODERN',
    bonuses: { attackBonus: 0.25, defenseBonus: 0.10, supplyBonus: 0.05 },
    specialty: 'Combined Arms Shock Operations',
    description: 'Spearheads high-readiness brigades with heavy armored support and foreign-supplied materiel.'
  },
  {
    id: 'gen_ly_fitory',
    name: 'Brig. Gen. Mahmoud al-Fitory',
    countryId: 'LY',
    factionId: 'LY_GNU',
    role: 'Central Coast Defense Director',
    avatar: '⚓',
    era: 'MODERN',
    bonuses: { attackBonus: 0.10, defenseBonus: 0.22, supplyBonus: 0.25 },
    specialty: 'Coastal Fortification & Port Supply',
    description: 'Expert in maritime logistics and securing critical port facilities in Tripoli, Misrata, and Khoms.'
  },
  {
    id: 'gen_ly_south',
    name: 'General Ali Kanna',
    countryId: 'LY',
    factionId: 'LY_SOUTH',
    role: 'Commander of Southern Military Zone',
    avatar: '🏜️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.15, defenseBonus: 0.20, supplyBonus: 0.18 },
    specialty: 'Saharan Deep Infiltration & Border Patrol',
    description: 'Veteran commander of the southern Fezzan tribal regiments and border protection forces.'
  },

  // ==========================================
  // SYRIA (Modern / 2026)
  // ==========================================
  {
    id: 'gen_sy_ayyoub',
    name: 'General Ali Abdullah Ayyoub',
    countryId: 'SY',
    factionId: 'SY_SAA',
    role: 'Minister of Defense & General Staff (SAA)',
    avatar: '🎖️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.15, defenseBonus: 0.25, supplyBonus: 0.15 },
    specialty: 'Integrated Air Defense & Heavy Barrage',
    description: 'Senior artillery and armor strategist coordinating Syrian Arab Army division echelons.'
  },
  {
    id: 'gen_sy_hassan',
    name: 'Major Gen. Suheil al-Hassan',
    countryId: 'SY',
    factionId: 'SY_SAA',
    role: 'Commander, 25th Special Mission Forces ("Tiger Forces")',
    avatar: '🐅',
    era: 'MODERN',
    bonuses: { attackBonus: 0.30, defenseBonus: 0.10, supplyBonus: 0.08 },
    specialty: 'Urban Breakthrough & Shock Assault',
    description: 'Frontline shock commander deployed to crack entrenched enemy strongholds.'
  },
  {
    id: 'gen_sy_abdi',
    name: 'General Mazloum Abdi',
    countryId: 'SY',
    factionId: 'SY_SDF',
    role: 'Commander-in-Chief, Syrian Democratic Forces (SDF)',
    avatar: '⭐',
    era: 'MODERN',
    bonuses: { attackBonus: 0.18, defenseBonus: 0.24, supplyBonus: 0.20 },
    specialty: 'Asymmetric Defense & Coalition Air Support',
    description: 'Leader of northeast SDF forces renowned for disciplined defensive coordination and counter-insurgency.'
  },
  {
    id: 'gen_sy_idris',
    name: 'Brigadier Gen. Salim Idris',
    countryId: 'SY',
    factionId: 'SY_SNA',
    role: 'Commander, Syrian National Army (SNA)',
    avatar: '⚔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.20, defenseBonus: 0.15, supplyBonus: 0.12 },
    specialty: 'Frontline Skirmishing & Cross-Border Logistics',
    description: 'Senior officer organizing opposition formations in northern Aleppo and Idlib borders.'
  },

  // ==========================================
  // UKRAINE (Modern / 2026)
  // ==========================================
  {
    id: 'gen_ua_syrskyi',
    name: 'General Oleksandr Syrskyi',
    countryId: 'UA',
    factionId: 'UA_ZSU',
    role: 'Commander-in-Chief, Armed Forces of Ukraine',
    avatar: '🇺🇦',
    era: 'MODERN',
    bonuses: { attackBonus: 0.25, defenseBonus: 0.18, supplyBonus: 0.15 },
    specialty: 'Dynamic Counter-Offensive & Trench Breakthrough',
    description: 'Architect of the Kyiv defense and Kharkiv liberation operations.'
  },
  {
    id: 'gen_ua_zaluzhnyi',
    name: 'General Valerii Zaluzhnyi',
    countryId: 'UA',
    factionId: 'UA_ZSU',
    role: 'Hero of Ukraine & Strategic High Commander',
    avatar: '🛡️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.18, defenseBonus: 0.28, supplyBonus: 0.22 },
    specialty: 'Flexible Deep Defense & Precision Fires',
    description: 'Pioneered decentralized Western-style tactical command and asymmetric attrition doctrine.'
  },
  {
    id: 'gen_ua_budanov',
    name: 'Lt. Gen. Kyrylo Budanov',
    countryId: 'UA',
    factionId: 'UA_ZSU',
    role: 'Chief of Defense Intelligence (HUR)',
    avatar: '🦉',
    era: 'MODERN',
    bonuses: { attackBonus: 0.28, defenseBonus: 0.12, supplyBonus: 0.18 },
    specialty: 'Special Reconnaissance & Deep Rear Interdiction',
    description: 'Directs drone swarms, partisan logistics disruption, and cross-border sabotage.'
  },

  // ==========================================
  // RUSSIA (Modern / 2026)
  // ==========================================
  {
    id: 'gen_ru_gerasimov',
    name: 'General Valery Gerasimov',
    countryId: 'RU',
    factionId: 'RU_FORCES',
    role: 'Chief of the General Staff (Russian Armed Forces)',
    avatar: '🇷🇺',
    era: 'MODERN',
    bonuses: { attackBonus: 0.15, defenseBonus: 0.22, supplyBonus: 0.18 },
    specialty: 'Massed Heavy Artillery & Strategic Depth',
    description: 'Oversees centralized operational doctrine and sustained artillery attrition.'
  },
  {
    id: 'gen_ru_surovikin',
    name: 'General Sergey Surovikin',
    countryId: 'RU',
    factionId: 'RU_FORCES',
    role: 'Fortified Line Commander ("Surovikin Line")',
    avatar: '🧱',
    era: 'MODERN',
    bonuses: { attackBonus: 0.10, defenseBonus: 0.35, supplyBonus: 0.15 },
    specialty: 'Multi-Echelon Fortifications & Minefields',
    description: 'Engineer of dense anti-tank belts, dragon teeth lines, and defensive fire pockets.'
  },
  {
    id: 'gen_ru_teplinsky',
    name: 'Colonel Gen. Mikhail Teplinsky',
    countryId: 'RU',
    factionId: 'RU_FORCES',
    role: 'Commander, Russian Airborne Forces (VDV)',
    avatar: '🪂',
    era: 'MODERN',
    bonuses: { attackBonus: 0.26, defenseBonus: 0.15, supplyBonus: 0.10 },
    specialty: 'Airborne Shock Tactics & Flank Maneuver',
    description: 'Directs elite parachute and mechanized infantry formations.'
  },

  // ==========================================
  // SUDAN (Modern / 2026)
  // ==========================================
  {
    id: 'gen_sd_burhan',
    name: 'General Abdel Fattah al-Burhan',
    countryId: 'SD',
    factionId: 'SD_SAF',
    role: 'Commander-in-Chief, Sudanese Armed Forces (SAF)',
    avatar: '🇸🇩',
    era: 'MODERN',
    bonuses: { attackBonus: 0.16, defenseBonus: 0.25, supplyBonus: 0.20 },
    specialty: 'Air Force Strike Coordination & Base Defense',
    description: 'Chairman of the Sovereign Council directing SAF armor, artillery, and air wings.'
  },
  {
    id: 'gen_sd_hemedti',
    name: 'General Mohamed Hamdan Dagalo ("Hemedti")',
    countryId: 'SD',
    factionId: 'SD_RSF',
    role: 'Commander, Rapid Support Forces (RSF)',
    avatar: '🐎',
    era: 'MODERN',
    bonuses: { attackBonus: 0.30, defenseBonus: 0.10, supplyBonus: 0.05 },
    specialty: 'Technical Swarm & Rapid Desert Maneuver',
    description: 'Controls high-mobility technical battle groups optimized for swift flanking.'
  },
  {
    id: 'gen_sd_atta',
    name: 'Lt. Gen. Yasser al-Atta',
    countryId: 'SD',
    factionId: 'SD_SAF',
    role: 'SAF Operations Commander (Omdurman Front)',
    avatar: '⚔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.22, defenseBonus: 0.20, supplyBonus: 0.15 },
    specialty: 'Urban Clearing & Heavy Armor Push',
    description: 'Field commander of central Khartoum and Nile river defensive lines.'
  },

  // ==========================================
  // MYANMAR (Modern / 2026)
  // ==========================================
  {
    id: 'gen_mm_hlaing',
    name: 'Senior Gen. Min Aung Hlaing',
    countryId: 'MM',
    factionId: 'MM_SAC',
    role: 'Commander-in-Chief, Myanmar Armed Forces (Tatmadaw)',
    avatar: '🇲🇲',
    era: 'MODERN',
    bonuses: { attackBonus: 0.14, defenseBonus: 0.24, supplyBonus: 0.15 },
    specialty: 'Airstrikes & Heavy Fortified Outposts',
    description: 'Head of the military junta relying on centralized airpower and heavy ordnance.'
  },
  {
    id: 'gen_mm_naing',
    name: 'General Tun Myat Naing',
    countryId: 'MM',
    factionId: 'MM_AA',
    role: 'Commander-in-Chief, Arakan Army (AA)',
    avatar: '🦅',
    era: 'MODERN',
    bonuses: { attackBonus: 0.28, defenseBonus: 0.20, supplyBonus: 0.18 },
    specialty: 'Coastal & Riverine Encirclement',
    description: 'Led historic capture of major northern and coastal townships across Rakhine State.'
  },
  {
    id: 'gen_mm_maw',
    name: 'General Gun Maw',
    countryId: 'MM',
    factionId: 'MM_KIA',
    role: 'Deputy Commander, Kachin Independence Army (KIA)',
    avatar: '🏔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.22, defenseBonus: 0.25, supplyBonus: 0.20 },
    specialty: 'Mountain Guerilla Defense & Ambush Doctrine',
    description: 'Veteran Kachin military strategist coordinating joint ethnic resistance offensives.'
  },

  // ==========================================
  // YEMEN (Modern / 2026)
  // ==========================================
  {
    id: 'gen_ye_aziz',
    name: 'Major Gen. Saghir bin Aziz',
    countryId: 'YE',
    factionId: 'YE_PLC',
    role: 'Chief of Staff, Yemeni Armed Forces',
    avatar: '🇾🇪',
    era: 'MODERN',
    bonuses: { attackBonus: 0.18, defenseBonus: 0.24, supplyBonus: 0.20 },
    specialty: 'Desert Defense & Anti-Ballistic Coordination',
    description: 'Leads regular government forces in the critical oil-rich Marib sector.'
  },
  {
    id: 'gen_ye_tareq',
    name: 'Brigadier Gen. Tareq Saleh',
    countryId: 'YE',
    factionId: 'YE_PLC',
    role: 'Commander, National Resistance (Guardians of the Republic)',
    avatar: '⚓',
    era: 'MODERN',
    bonuses: { attackBonus: 0.24, defenseBonus: 0.18, supplyBonus: 0.15 },
    specialty: 'Red Sea Coastal Mobile Combat',
    description: 'Controls hardened veteran brigades operating along the Bab-el-Mandeb littoral.'
  },
  {
    id: 'gen_ye_houthi',
    name: 'Major Gen. Abdul-Khaliq al-Houthi',
    countryId: 'YE',
    factionId: 'YE_HOUTHI',
    role: 'Central Military Region Commander (Ansar Allah)',
    avatar: '🏔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.22, defenseBonus: 0.26, supplyBonus: 0.10 },
    specialty: 'Mountain Redoubts & Drone/Missile Barrages',
    description: 'Oversees Sanaa defense perimeter and highland missile deployment regiments.'
  },

  // ==========================================
  // DR CONGO (Modern / 2026)
  // ==========================================
  {
    id: 'gen_cd_tshiwewe',
    name: 'Lt. Gen. Christian Tshiwewe Songesha',
    countryId: 'CD',
    factionId: 'CD_FARDC',
    role: 'Chief of General Staff, FARDC',
    avatar: '🇨🇩',
    era: 'MODERN',
    bonuses: { attackBonus: 0.16, defenseBonus: 0.22, supplyBonus: 0.22 },
    specialty: 'Allied SADC Logistics & National Garrison',
    description: 'Highest ranking military officer coordinating armed forces and southern regional partners.'
  },
  {
    id: 'gen_cd_makenga',
    name: 'General Sultani Makenga',
    countryId: 'CD',
    factionId: 'CD_M23',
    role: 'Military Commander, March 23 Movement (M23 / AFC)',
    avatar: '⚔️',
    era: 'MODERN',
    bonuses: { attackBonus: 0.30, defenseBonus: 0.18, supplyBonus: 0.12 },
    specialty: 'Volcanic Ridge Assault & Mobile Shock',
    description: 'Field commander holding key mountain heights and highways in North Kivu.'
  },

  // ==========================================
  // HISTORICAL: 1950 KOREAN WAR
  // ==========================================
  {
    id: 'gen_kr_macarthur',
    name: 'General Douglas MacArthur',
    countryId: 'US',
    factionId: 'US_UN',
    role: 'Supreme Commander, UN Command',
    avatar: '🎖️',
    era: '1950',
    bonuses: { attackBonus: 0.30, defenseBonus: 0.15, supplyBonus: 0.20 },
    specialty: 'Amphibious Incheon Landings & Deep Encirclement',
    description: 'Legendary commander who reversed the Korean War through audacious amphibious maneuvers.'
  },
  {
    id: 'gen_kr_ridgway',
    name: 'General Matthew Ridgway',
    countryId: 'US',
    factionId: 'US_UN',
    role: 'Commander, Eighth United States Army',
    avatar: '🛡️',
    era: '1950',
    bonuses: { attackBonus: 0.20, defenseBonus: 0.30, supplyBonus: 0.25 },
    specialty: 'Meatgrinder Defense & Line Stabilization',
    description: 'Restored UN fighting spirit and halted massive offensive thrusts with devastating firepower.'
  },
  {
    id: 'gen_kr_paik',
    name: 'General Paik Sun-yup',
    countryId: 'KR',
    factionId: 'ROK_ARMY',
    role: 'Commander, ROK 1st Infantry Division',
    avatar: '🇰🇷',
    era: '1950',
    bonuses: { attackBonus: 0.22, defenseBonus: 0.28, supplyBonus: 0.18 },
    specialty: 'Pusan Perimeter Defense ("I will lead from the front")',
    description: 'South Korea\'s most celebrated combat general who held the critical Dabudo defensive line.'
  },
  {
    id: 'gen_kr_peng',
    name: 'Marshal Peng Dehuai',
    countryId: 'CN',
    factionId: 'CN_PVA',
    role: 'Commander, Chinese People\'s Volunteer Army',
    avatar: '🇨🇳',
    era: '1950',
    bonuses: { attackBonus: 0.28, defenseBonus: 0.22, supplyBonus: 0.10 },
    specialty: 'Night Infiltration & Double Envelopment',
    description: 'Engineered sudden winter mountain counter-offensives that pushed allied lines south.'
  },
  {
    id: 'gen_kr_choe',
    name: 'General Choe Yong-gon',
    countryId: 'KP',
    factionId: 'KPA_NORTH',
    role: 'Commander-in-Chief, Korean People\'s Army (KPA)',
    avatar: '⭐',
    era: '1950',
    bonuses: { attackBonus: 0.26, defenseBonus: 0.16, supplyBonus: 0.12 },
    specialty: 'Rapid Armor Thrusts & Soviet T-34 Tactics',
    description: 'Led the initial mechanized blitzkrieg south across the 38th parallel in summer 1950.'
  },

  // ==========================================
  // HISTORICAL: 1936-1939 (WWII)
  // ==========================================
  {
    id: 'gen_ww2_zhukov',
    name: 'Marshal Georgy Zhukov',
    countryId: 'SU',
    factionId: 'SU_RED_ARMY',
    role: 'Deputy Supreme Commander, Red Army',
    avatar: '⭐',
    era: '1936',
    bonuses: { attackBonus: 0.32, defenseBonus: 0.25, supplyBonus: 0.15 },
    specialty: 'Deep Battle Doctrine & Massed Artillery Pounding',
    description: 'Mastermind of Stalingrad and Berlin operations, delivering crushing combined-arms punches.'
  },
  {
    id: 'gen_ww2_guderian',
    name: 'Generaloberst Heinz Guderian',
    countryId: 'DE',
    factionId: 'DE_WEHRMACHT',
    role: 'Inspector General of Armoured Troops',
    avatar: '⚡',
    era: '1936',
    bonuses: { attackBonus: 0.35, defenseBonus: 0.10, supplyBonus: 0.10 },
    specialty: 'Blitzkrieg Panzer Spearhead',
    description: 'Pioneer of modern armored warfare and lightning motorized breakthroughs.'
  },
  {
    id: 'gen_ww2_patton',
    name: 'General George S. Patton',
    countryId: 'US',
    factionId: 'US_ARMY',
    role: 'Commander, US Third Army',
    avatar: '🦅',
    era: '1936',
    bonuses: { attackBonus: 0.34, defenseBonus: 0.12, supplyBonus: 0.14 },
    specialty: 'Aggressive Armored Pursuit & Flank Smashing',
    description: 'Relentless combat commander celebrated for rapid advances across France and Germany.'
  },
  {
    id: 'gen_ww2_montgomery',
    name: 'Field Marshal Bernard Montgomery',
    countryId: 'GB',
    factionId: 'GB_ARMY',
    role: 'Commander, British Eighth Army',
    avatar: '🇬🇧',
    era: '1936',
    bonuses: { attackBonus: 0.18, defenseBonus: 0.30, supplyBonus: 0.25 },
    specialty: 'Methodical Artillery Defense & Desert Forts',
    description: 'Victor of El Alamein, known for rigorous logistics, prepared defenses, and high morale.'
  },

  // ==========================================
  // HISTORICAL: 1914-1920 (WWI)
  // ==========================================
  {
    id: 'gen_ww1_ataturk',
    name: 'Mustafa Kemal Pasha (Atatürk)',
    countryId: 'TR',
    factionId: 'TR_ARMY',
    role: 'Commander, 19th Division (Gallipoli)',
    avatar: '🇹🇷',
    era: '1914',
    bonuses: { attackBonus: 0.28, defenseBonus: 0.35, supplyBonus: 0.20 },
    specialty: 'Iron Will Trench Defense & Decisive Counter-Charge',
    description: '"I do not order you to fight, I order you to die." Halted allied forces at Conkbayırı and Anafartalar.'
  },
  {
    id: 'gen_ww1_foch',
    name: 'Marshal Ferdinand Foch',
    countryId: 'FR',
    factionId: 'FR_ARMY',
    role: 'Supreme Allied Commander',
    avatar: '🇫🇷',
    era: '1914',
    bonuses: { attackBonus: 0.26, defenseBonus: 0.24, supplyBonus: 0.20 },
    specialty: 'Hundred Days Coordinated Counter-Offensive',
    description: 'Unified command of French, British, and American forces to break the Western Front in 1918.'
  }
];

/**
 * Returns available real generals for a given country and year
 */
export function getGeneralsForCountryAndYear(countryId: string, scenarioYear: string = '2026', factionId?: string): WarGeneral[] {
  const normCountry = countryId.toUpperCase();
  const yearNum = parseInt(scenarioYear, 10) || 2026;

  let eraTarget: 'MODERN' | '1950' | '1936' | '1914' = 'MODERN';
  if (yearNum <= 1925) eraTarget = '1914';
  else if (yearNum <= 1945) eraTarget = '1936';
  else if (yearNum <= 1980) eraTarget = '1950';

  // 1. Direct matches by country and era
  const direct = WAR_GENERALS_DATABASE.filter(g => {
    const countryMatch = g.countryId === normCountry;
    const eraMatch = g.era === 'ANY' || g.era === eraTarget || (yearNum >= 1990 && g.era === 'MODERN');
    const factionMatch = !factionId || !g.factionId || g.factionId === factionId;
    return countryMatch && eraMatch && factionMatch;
  });

  if (direct.length > 0) return direct;

  // 2. Fallback to same country any era or any general for that era
  const countryAnyEra = WAR_GENERALS_DATABASE.filter(g => g.countryId === normCountry);
  if (countryAnyEra.length > 0) return countryAnyEra;

  // 3. Fallback generic staff officer tailored to country
  return [
    {
      id: `gen_generic_staff_${normCountry}`,
      name: `Chief of General Staff (${normCountry})`,
      countryId: normCountry,
      role: 'Supreme Operational Commander',
      avatar: '🎖️',
      era: 'ANY',
      bonuses: { attackBonus: 0.20, defenseBonus: 0.20, supplyBonus: 0.20 },
      specialty: 'Standard Combined-Arms Command',
      description: 'Senior military council commander directing field division deployments and defensive maneuvers.'
    },
    {
      id: `gen_generic_armor_${normCountry}`,
      name: `Major General of Armored Corps (${normCountry})`,
      countryId: normCountry,
      role: 'Mobile Armored Strike Commander',
      avatar: '🛡️',
      era: 'ANY',
      bonuses: { attackBonus: 0.25, defenseBonus: 0.15, supplyBonus: 0.10 },
      specialty: 'Armored Spearhead & Rapid Penetration',
      description: 'Specialist in heavy tank breakthroughs and mechanized border sector combat.'
    },
    {
      id: `gen_generic_defense_${normCountry}`,
      name: `Inspector General of Fortifications (${normCountry})`,
      countryId: normCountry,
      role: 'Territorial Defense Director',
      avatar: '🧱',
      era: 'ANY',
      bonuses: { attackBonus: 0.10, defenseBonus: 0.30, supplyBonus: 0.20 },
      specialty: 'Entrenchment & Supply Network Resiliency',
      description: 'Organizes deep fortified belts, artillery strongpoints, and supply stockpiles.'
    }
  ];
}
