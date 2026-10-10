/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CivilWarState, ConflictSide } from '../types';

export const INITIAL_CIVIL_WARS: Record<string, CivilWarState> = {
  SY: {
    countryId: 'SY',
    countryName: 'Syria',
    flag: '🇸🇾',
    conflictName: 'Syrian Civil War & Multi-Front Conflict',
    yearStarted: 2011,
    stability: 18,
    status: 'ACTIVE',
    refugeePressure: 85,
    monthlyCasualties: 420,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'SY_SIDE_GOV',
        name: 'Syrian Arab Republic (SAA / Gov)',
        leader: 'SY_SAA',
        members: ['SY_SAA'],
        color: '#dc2626'
      },
      {
        id: 'SY_SIDE_OPP',
        name: 'Syrian Opposition & Salvation Front',
        leader: 'SY_SNA',
        members: ['SY_SNA', 'SY_HTS'],
        color: '#059669'
      },
      {
        id: 'SY_SIDE_SDF',
        name: 'Syrian Democratic Forces (AANES)',
        leader: 'SY_SDF',
        members: ['SY_SDF'],
        color: '#f59e0b'
      }
    ],
    factions: [
      {
        id: 'SY_SAA',
        name: 'Syrian Arab Army (SAA / Assad)',
        leader: 'Bashar al-Assad',
        ideology: 'Ba\'athist Authoritarian',
        color: '#dc2626',
        strength: 42,
        controlledRegions: ['Damascus', 'RifDimashq', 'Hamah', 'Hims', 'Lattakia', 'Tartus', 'AsSuwayda\'', 'Dar`a', 'Quneitra'],
        isGovernment: true,
        foreignBacker: 'Russia / Iran',
        description: 'Controls the capital Damascus, Mediterranean seaports, and the central highway corridor with Russian air cover and Iranian allied militias.'
      },
      {
        id: 'SY_SDF',
        name: 'Syrian Democratic Forces (SDF / AANES)',
        leader: 'Mazloum Abdi',
        ideology: 'Democratic Confederalism / Kurdish AANES',
        color: '#f59e0b',
        strength: 26,
        controlledRegions: ['AlḤasakah', 'ArRaqqah', 'DayrAzZawr'],
        foreignBacker: 'United States / CJTF-OIR Global Coalition',
        description: 'Multi-ethnic confederation holding the Euphrates river basin, vast cereal farmland, and major east Syrian oil installations.'
      },
      {
        id: 'SY_SNA',
        name: 'Syrian National Army (SNA / Opposition)',
        leader: 'Salim Idris / Abdurrahman Mustafa',
        ideology: 'Sunni Opposition / Turkish Alignment',
        color: '#2563eb',
        strength: 18,
        controlledRegions: ['Aleppo'],
        foreignBacker: 'Turkey',
        description: 'Turkish-backed opposition alliance governing the northern Syrian border security strip and Afrin corridors.'
      },
      {
        id: 'SY_HTS',
        name: 'Hay\'at Tahrir al-Sham (HTS / Salvation Gov)',
        leader: 'Abu Mohammad al-Julani',
        ideology: 'Islamist Salvation Authority',
        color: '#047857',
        strength: 14,
        controlledRegions: ['Idlib'],
        foreignBacker: 'Independent Border War Economy / Idlib Commerce',
        description: 'De facto administrative regime controlling Greater Idlib, maintaining Bab al-Hawa commercial border crossings.'
      }
    ]
  },
  LY: {
    countryId: 'LY',
    countryName: 'Libya',
    flag: '🇱🇾',
    conflictName: 'Libyan Dual-Regime & Multi-Faction Division',
    yearStarted: 2014,
    stability: 22,
    status: 'ACTIVE',
    refugeePressure: 60,
    monthlyCasualties: 150,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'LY_SIDE_TRIPOLI',
        name: 'Tripoli Sovereign Alliance',
        leader: 'LY_GNU',
        members: ['LY_GNU', 'LY_MISRATA', 'LY_PFG'],
        color: '#2563eb'
      },
      {
        id: 'LY_SIDE_EASTERN',
        name: 'Eastern Military Command (LNA)',
        leader: 'LY_LNA',
        members: ['LY_LNA', 'LY_SOUTH'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'LY_GNU',
        name: 'Government of National Unity (Tripoli)',
        leader: 'Abdul Hamid Dbeibeh',
        ideology: 'Centrist / UN-Recognized',
        color: '#2563eb',
        strength: 32,
        controlledRegions: ['Tripoli', 'AlJifarah', 'AzZawiyah', 'AnNuqatalKhams', 'AlMarqab'],
        isGovernment: true,
        foreignBacker: 'Turkey / Italy / UN',
        description: 'UN-recognized sovereign government holding the Tripoli metropolis, central bank, and western maritime ports.'
      },
      {
        id: 'LY_LNA',
        name: 'Libyan National Army (LNA / Haftar)',
        leader: 'Field Marshal Khalifa Haftar',
        ideology: 'Eastern Military Command / Secular Nationalist',
        color: '#dc2626',
        strength: 34,
        controlledRegions: ['Benghazi', 'AlButnan', 'AlJabalalAkhdar', 'Darnah', 'AlMarj', 'AlKufrah', 'AlJufrah'],
        foreignBacker: 'Egypt / UAE / Russia (Africa Corps)',
        description: 'Dominates Cyrenaica and eastern military bases, commanding the 106th and Tariq bin Ziyad mechanized formations.'
      },
      {
        id: 'LY_MISRATA',
        name: 'Misrata Military Council & Western Coalition',
        leader: 'Misrata Joint Security Board',
        ideology: 'Western Revolutionary Front / Commercial Autonomy',
        color: '#059669',
        strength: 16,
        controlledRegions: ['Misratah', 'Nalut', 'AlJabalalGharbi'],
        foreignBacker: 'Local Industrial War Chest / Qatar',
        description: 'Heavily armed port city brigade network controlling key trade axes and western mountain Amazigh garrisons.'
      },
      {
        id: 'LY_PFG',
        name: 'Petroleum Facilities Guard (PFG / Oil Crescent)',
        leader: 'Ibrahim Jadhran / NOC Security Directorate',
        ideology: 'Resource Custodian / Hydrocarbon Security',
        color: '#d97706',
        strength: 10,
        controlledRegions: ['AlWahat', 'Surt'],
        foreignBacker: 'National Oil Corporation (NOC) / Commercial Revenues',
        description: 'Secures the vital Sirte Basin oil fields, pipelines, and export marine terminals at Ras Lanuf and Es Sider.'
      },
      {
        id: 'LY_SOUTH',
        name: 'Tuareg & Tebu Fezzan Southern Defense',
        leader: 'Ali Kana / Southern Tribal Chiefs',
        ideology: 'Southern Indigenous Autonomy & Border Guard',
        color: '#7c3aed',
        strength: 8,
        controlledRegions: ['Ghat', 'Murzuq', 'WadialHayat', 'WadiashShati\'', 'Sabha'],
        foreignBacker: 'Cross-Border Sahel Kinship / Fezzan Assembly',
        description: 'Controls desert deep oases, southern border choke points toward Chad/Niger, and Sahara trade crossroads.'
      }
    ]
  },
  UA: {
    countryId: 'UA',
    countryName: 'Ukraine',
    flag: '🇺🇦',
    conflictName: 'Russo-Ukrainian Interstate High-Intensity War',
    yearStarted: 2022,
    stability: 28,
    status: 'ACTIVE',
    refugeePressure: 90,
    monthlyCasualties: 850,
    playerStance: 'RECOGNIZED_GOV',
    sides: [
      {
        id: 'UA_SIDE_UKRAINE',
        name: 'Armed Forces of Ukraine (Kyiv)',
        leader: 'UA_ZSU',
        members: ['UA_ZSU'],
        color: '#0284c7'
      },
      {
        id: 'UA_SIDE_RUSSIA',
        name: 'Russian Armed Forces & Allied Formations',
        leader: 'RU_OCC',
        members: ['RU_OCC'],
        color: '#ef4444'
      }
    ],
    factions: [
      {
        id: 'UA_ZSU',
        name: 'Armed Forces of Ukraine (Kyiv)',
        leader: 'Volodymyr Zelenskyy',
        ideology: 'Democratic Defense / Sovereign Republic',
        color: '#0284c7',
        strength: 55,
        controlledRegions: [
          'Kiev', 'KievCity', 'L\'viv', 'Kharkiv', 'Dnipropetrovs\'k', 'Odessa', 
          'Mykolayiv', 'Chernihiv', 'Sumy', 'Poltava', 'Cherkasy', 'Vinnytsya', 
          'Zhytomyr', 'Rivne', 'Volyn', 'Khmel\'nyts\'kyy', 'Ternopil\'', 
          'Ivano-Frankivs\'k', 'Zakarpattia', 'Chernivtsi', 'Kirovohrad'
        ],
        isGovernment: true,
        foreignBacker: 'NATO / EU / USA',
        description: 'Controls sovereign central, western, northern, and southern maritime heartlands.'
      },
      {
        id: 'RU_OCC',
        name: 'Russian Armed Forces & Allied Formations',
        leader: 'Vladimir Putin',
        ideology: 'Expansionist Federation / Occupation',
        color: '#ef4444',
        strength: 45,
        controlledRegions: [
          'Crimea', 'Sevastopol\'', 'Donets\'k', 'Luhans\'k', 'Zaporizhia', 'Kherson'
        ],
        foreignBacker: 'Russian Federation / CSTO',
        description: 'Occupies Crimea, Donbas basin, and southern land bridge sectors.'
      }
    ]
  },
  SD: {
    countryId: 'SD',
    countryName: 'Sudan',
    flag: '🇸🇩',
    conflictName: 'Sudanese Armed Forces vs RSF & Multi-Front Civil War',
    yearStarted: 2023,
    stability: 14,
    status: 'ACTIVE',
    refugeePressure: 95,
    monthlyCasualties: 1200,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'SD_SIDE_SAF',
        name: 'Sovereign Council & Darfur Joint Alliance',
        leader: 'SD_SAF',
        members: ['SD_SAF', 'SD_DARFUR'],
        color: '#2563eb'
      },
      {
        id: 'SD_SIDE_RSF',
        name: 'Rapid Support Forces & Insurgent Axis',
        leader: 'SD_RSF',
        members: ['SD_RSF', 'SD_SPLMN'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'SD_SAF',
        name: 'Sudanese Armed Forces (SAF / Burhan)',
        leader: 'Gen. Abdel Fattah al-Burhan',
        ideology: 'Military Transitional Sovereign Council',
        color: '#2563eb',
        strength: 38,
        controlledRegions: ['RedSea', 'RiverNile', 'Northern', 'Kassala', 'AlQadarif', 'Sennar', 'WhiteNile'],
        isGovernment: true,
        foreignBacker: 'Egypt / Saudi Arabia / Turkey / Iran',
        description: 'Maintains maritime Red Sea coastline headquarters in Port Sudan, heavy armor, and eastern agricultural heartlands.'
      },
      {
        id: 'SD_RSF',
        name: 'Rapid Support Forces (RSF / Dagalo)',
        leader: 'Mohamed Hamdan Dagalo ("Hemedti")',
        ideology: 'Paramilitary Militia Coalition',
        color: '#dc2626',
        strength: 36,
        controlledRegions: ['AlJazirah', 'WestKurdufan', 'NorthKurdufan', 'EastDarfur', 'SouthDarfur', 'CentralDarfur'],
        foreignBacker: 'UAE / Chadian Mercenary Networks',
        description: 'Fast-moving mobile desert paramilitary holding deep western Darfur strongholds and contested central river hubs.'
      },
      {
        id: 'SD_SPLMN',
        name: 'SPLM-N (al-Hilu / Nuba Mountains)',
        leader: 'Abdelaziz al-Hilu',
        ideology: 'Secular Democratic Federalism / Nuba Autonomy',
        color: '#d97706',
        strength: 14,
        controlledRegions: ['SouthKurdufan', 'BlueNile'],
        foreignBacker: 'South Sudan Sympathizers / Nuba Self-Defense',
        description: 'Hardened mountain rebel forces controlling the Kauda fortress redoubt and southern border sectors.'
      },
      {
        id: 'SD_DARFUR',
        name: 'Darfur Joint Protection Force (SLM/Minawi)',
        leader: 'Minni Minawi / Gibril Ibrahim',
        ideology: 'Darfur Self-Defense Front',
        color: '#059669',
        strength: 12,
        controlledRegions: ['WestDarfur'],
        foreignBacker: 'Darfur Civil Assembly / Chadian Cross-Border Kinship',
        description: 'Defending El Fasher and western Darfur civilian populations against RSF assaults.'
      }
    ]
  },
  MM: {
    countryId: 'MM',
    countryName: 'Myanmar',
    flag: '🇲🇲',
    conflictName: 'Myanmar Spring Revolution & Resistance War',
    yearStarted: 2021,
    stability: 16,
    status: 'ACTIVE',
    refugeePressure: 70,
    monthlyCasualties: 850,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'MM_SIDE_RESISTANCE',
        name: 'Spring Revolution Democratic Alliance',
        leader: 'MM_NUG',
        members: ['MM_NUG', 'MM_KIA', 'MM_AA', 'MM_KNU'],
        color: '#2563eb'
      },
      {
        id: 'MM_SIDE_JUNTA',
        name: 'Tatmadaw (State Administration Council)',
        leader: 'MM_SAC',
        members: ['MM_SAC'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'MM_SAC',
        name: 'State Administration Council (Tatmadaw Junta)',
        leader: 'Senior Gen. Min Aung Hlaing',
        ideology: 'Military Dictatorship',
        color: '#dc2626',
        strength: 34,
        controlledRegions: ['Naypyitaw', 'Yangon', 'Mandalay', 'Bago', 'Magway', 'Ayeyarwady', 'Tanintharyi'],
        isGovernment: true,
        foreignBacker: 'Russia / China (Weapons & Diplomatic Cover)',
        description: 'Entrenched military regime maintaining capital command, heavy armor, air superiority, and coastal trade.'
      },
      {
        id: 'MM_NUG',
        name: 'NUG & People\'s Defence Force (PDF Combined)',
        leader: 'Duwa Lashi La / Mahn Win Khaing Than',
        ideology: 'Federal Democratic Republic',
        color: '#2563eb',
        strength: 24,
        controlledRegions: ['Sagaing', 'Chin'],
        foreignBacker: 'Myanmar Diaspora / Western Democratic Aid',
        description: 'Nationwide democratic youth and civilian resistance conducting coordinated operations across central valleys.'
      },
      {
        id: 'MM_KIA',
        name: 'Kachin Independence Army (KIA)',
        leader: 'Gen. N\'Ban La',
        ideology: 'Kachin Self-Determination & Federal Autonomy',
        color: '#059669',
        strength: 15,
        controlledRegions: ['Kachin'],
        foreignBacker: 'Cross-Border Jade & Trade Economy',
        description: 'Veterans of highland guerrilla warfare holding key mountain passes and rare-earth border crossings with China.'
      },
      {
        id: 'MM_AA',
        name: 'Arakan Army (AA / Rakhine Front)',
        leader: 'Maj. Gen. Twan Mrat Naing',
        ideology: 'Rakhine Nationalist Autonomy ("Way of Rakhita")',
        color: '#d97706',
        strength: 15,
        controlledRegions: ['Rakhine'],
        foreignBacker: 'Three Brotherhood Alliance / Bay of Bengal Commerce',
        description: 'Highly organized marine and mechanized forces having captured almost all northern and central Rakhine townships.'
      },
      {
        id: 'MM_KNU',
        name: 'Karen National Union (KNU / KNLA)',
        leader: 'Padoh Saw Kwe Htoo Win',
        ideology: 'Kawthoolei Self-Determination',
        color: '#7c3aed',
        strength: 12,
        controlledRegions: ['Kayin', 'Mon', 'Kayah'],
        foreignBacker: 'Thai Border Crossings / Karen Diaspora',
        description: 'Long-standing revolutionary front commanding the Thai border highway corridor and Myawaddy border hub.'
      }
    ]
  },
  YE: {
    countryId: 'YE',
    countryName: 'Yemen',
    flag: '🇾🇪',
    conflictName: 'Yemeni Multi-Front Conflict & Red Sea Front',
    yearStarted: 2014,
    stability: 19,
    status: 'ACTIVE',
    refugeePressure: 80,
    monthlyCasualties: 300,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'YE_SIDE_COALITION',
        name: 'Anti-Houthi Coalition (PLC & Allies)',
        leader: 'YE_PLC',
        members: ['YE_PLC', 'YE_STC', 'YE_TAREQ', 'YE_RES'],
        color: '#2563eb'
      },
      {
        id: 'YE_SIDE_HOUTHIS',
        name: 'Ansar Allah (Houthi Armed Movement)',
        leader: 'YE_HOU',
        members: ['YE_HOU'],
        color: '#059669'
      }
    ],
    factions: [
      {
        id: 'YE_PLC',
        name: 'Presidential Leadership Council (PLC / Recognized Gov)',
        leader: 'Rashad al-Alimi',
        ideology: 'Internationally Recognized Sovereign Coalition',
        color: '#2563eb',
        strength: 30,
        controlledRegions: ['Ma\'rib', 'Hadramawt', 'AlMahrah', 'AlJawf'],
        isGovernment: true,
        foreignBacker: 'Saudi Arabia / GCC',
        description: 'UN-recognized coalition holding the eastern hydrocarbon reserves in Marib and eastern Indian Ocean borderlands.'
      },
      {
        id: 'YE_HOU',
        name: 'Ansar Allah (Houthi Movement / Sana\'a Authority)',
        leader: 'Abdul-Malik al-Houthi',
        ideology: 'Zaidi Shia Islamist / Anti-Western',
        color: '#059669',
        strength: 36,
        controlledRegions: ['San`a\'', 'AmanatAlAsimah', 'Amran', 'Sa`dah', 'Hajjah', 'AlMahwit', 'Dhamar', 'Ibb', 'Raymah', 'AlBayda\''],
        foreignBacker: 'Iran / Axis of Resistance',
        description: 'Holds the capital Sana\'a, northern highlands, ballistic missile sites, and drone command centers.'
      },
      {
        id: 'YE_STC',
        name: 'Southern Transitional Council (STC / South Yemen)',
        leader: 'Aidarous al-Zubaidi',
        ideology: 'Southern Yemeni Independence / Secular Republic',
        color: '#7c3aed',
        strength: 22,
        controlledRegions: ['`Adan', 'Lahij', 'Abyan', 'AlDali\'', 'Shabwah'],
        foreignBacker: 'UAE',
        description: 'Secures the historic port city of Aden, Bab el-Mandeb maritime approaches, and southern governorates.'
      },
      {
        id: 'YE_TAREQ',
        name: 'National Resistance & Giants Brigades (Tareq Saleh)',
        leader: 'Tareq Mohammed Saleh',
        ideology: 'Republican Guard Veterans / Anti-Houthi Coastal Front',
        color: '#d97706',
        strength: 12,
        controlledRegions: ['AlHudaydah'],
        foreignBacker: 'UAE / Joint Coastal Forces',
        description: 'Heavily equipped motorized assault corps commanding the southern Red Sea shoreline.'
      }
    ]
  },
  SO: {
    countryId: 'SO',
    countryName: 'Somalia',
    flag: '🇸🇴',
    conflictName: 'Somali Counter-Insurgency & Federal Statehood Crisis',
    yearStarted: 2006,
    stability: 24,
    status: 'ACTIVE',
    refugeePressure: 65,
    monthlyCasualties: 220,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'SO_SIDE_FED',
        name: 'Federal Coalition (FGS + States)',
        leader: 'SO_FGS',
        members: ['SO_FGS', 'SO_PUNT', 'SO_PNT', 'SO_JUBA', 'SO_JUB'],
        color: '#2563eb'
      },
      {
        id: 'SO_SIDE_SHA',
        name: 'Al-Shabaab Insurgent Network',
        leader: 'SO_SHA',
        members: ['SO_SHA'],
        color: '#dc2626'
      },
      {
        id: 'SO_SIDE_SOM',
        name: 'Republic of Somaliland',
        leader: 'SO_SOM',
        members: ['SO_SOM'],
        color: '#059669'
      }
    ],
    factions: [
      {
        id: 'SO_FGS',
        name: 'Federal Government + AU forces',
        leader: 'Hassan Sheikh Mohamud',
        ideology: 'Federal Democratic Republic / UN-Recognized',
        color: '#2563eb',
        strength: 32,
        controlledRegions: ['Banaadir', 'ShabeellahaDhexe', 'ShabeellahaHoose', 'Hiiraan', 'Galguduud'],
        isGovernment: true,
        foreignBacker: 'USA (AFRICOM) / Turkey / ATMIS / EU',
        description: 'UN-recognized sovereign government holding the Mogadishu seaport, airports, and central Shabelle basin.'
      },
      {
        id: 'SO_SHA',
        name: 'al-Shabaab',
        leader: 'Ahmed Diriye ("Abu Ubaidah")',
        ideology: 'Salafi-Jihadist Insurgency',
        color: '#dc2626',
        strength: 26,
        controlledRegions: ['JubbadaDhexe', 'Bay', 'Bakool'],
        foreignBacker: 'Al-Qaeda Global Network / Port Extortion',
        description: 'Insurgent network holding deep interior Juba River sanctuaries, mounting bombings and taxation checkpoints.'
      },
      {
        id: 'SO_SOM',
        name: 'Somaliland (separate de facto state)',
        leader: 'Abdirahman Mohamed Abdullahi ("Cirro")',
        ideology: 'De Facto Constitutional Republic',
        color: '#059669',
        strength: 20,
        controlledRegions: ['Awdal', 'WoqooyiGalbeed', 'Togdheer', 'Sool', 'Sanaag'],
        foreignBacker: 'Ethiopia (MoU Partner) / UAE (Berbera Port)',
        description: 'Maintains thirty years of de facto independent statehood, Berbera deep-water trade hub, and army corps.'
      },
      {
        id: 'SO_PUNT',
        name: 'Puntland',
        leader: 'Said Abdullahi Deni',
        ideology: 'Federal Autonomy / Maritime State Defense',
        color: '#d97706',
        strength: 12,
        controlledRegions: ['Bari', 'Nugaal', 'Mudug'],
        foreignBacker: 'UAE (PMPF) / Autonomy Charter',
        description: 'Holds the northeastern Horn of Africa tip, Bossaso port, and elite counter-piracy marine forces.'
      },
      {
        id: 'SO_JUBA',
        name: 'Jubaland',
        leader: 'Ahmed Madobe',
        ideology: 'Southern Border Federal Defense',
        color: '#7c3aed',
        strength: 10,
        controlledRegions: ['JubbadaHoose', 'Gedo'],
        foreignBacker: 'Kenya (KDF) / Jubaland State',
        description: 'Controls Kismayo port and the strategic southern border defense corridor along the Kenyan frontier.'
      }
    ]
  },
  ML: {
    countryId: 'ML',
    countryName: 'Mali',
    flag: '🇲🇱',
    conflictName: 'Malian Civil War & Sahelian Insurgency',
    yearStarted: 2012,
    stability: 20,
    status: 'ACTIVE',
    refugeePressure: 72,
    monthlyCasualties: 380,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'ML_SIDE_JUNTA',
        name: 'FAMa Junta & Africa Corps',
        leader: 'ML_JUNTA',
        members: ['ML_JUNTA'],
        color: '#15803d'
      },
      {
        id: 'ML_SIDE_FLA',
        name: 'FLA (Azawad Independence)',
        leader: 'ML_FLA',
        members: ['ML_FLA'],
        color: '#2563eb'
      },
      {
        id: 'ML_SIDE_JNIM',
        name: 'JNIM (Sahelian Al-Qaeda)',
        leader: 'ML_JNIM',
        members: ['ML_JNIM'],
        color: '#d97706'
      },
      {
        id: 'ML_SIDE_ISSP',
        name: 'ISSP (Islamic State Sahel)',
        leader: 'ML_ISSP',
        members: ['ML_ISSP'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'ML_JUNTA',
        name: 'Junta + Africa Corps',
        leader: 'Col. Assimi Goïta & Gen. Sadio Camara',
        ideology: 'Military Sovereignist Junta / AES Alliance',
        color: '#15803d',
        strength: 45,
        controlledRegions: ['Bamako', 'Koulikoro', 'Kayes', 'Sikasso', 'Ségou'],
        isGovernment: true,
        foreignBacker: 'Russia (Africa Corps) / Alliance of Sahel States (AES)',
        description: 'Military junta allied with Burkina Faso and Niger (AES), relying on Russian instructors, Africa Corps assault detachments, and heavy drones.'
      },
      {
        id: 'ML_FLA',
        name: 'FLA (Azawad)',
        leader: 'Bilal Ag Acherif & Alghabass Ag Intalla',
        ideology: 'Tuareg Self-Determination / Azawad Independence',
        color: '#2563eb',
        strength: 22,
        controlledRegions: ['Kidal'],
        foreignBacker: 'Tuareg Regional Diaspora / Trans-Saharan Defense Networks',
        description: 'Secular Tuareg and Arab rebel alliance defending their historic northern desert homeland of Azawad, commanding highly mobile technical desert columns around Kidal.'
      },
      {
        id: 'ML_JNIM',
        name: 'JNIM',
        leader: 'Iyad Ag Ghaly & Amadou Koufa',
        ideology: 'Salafi-Jihadist Insurgency (Al-Qaeda in the Sahel)',
        color: '#d97706',
        strength: 20,
        controlledRegions: ['Mopti', 'Timbuktu'],
        foreignBacker: 'Al-Qaeda Central / Sahel Gold & Cattle Smuggling',
        description: 'Vast jihadist alliance dominating central rural Mali and the Macina floodplains, applying local sharia, laying IED ambushes, and besieging Timbuktu roads.'
      },
      {
        id: 'ML_ISSP',
        name: 'ISSP',
        leader: 'Abu al-Bara al-Sahrawi',
        ideology: 'Islamic State Caliphate Province',
        color: '#dc2626',
        strength: 13,
        controlledRegions: ['Gao'],
        foreignBacker: 'Global ISIS Network / Menaka Border Extraction',
        description: 'Brutal Islamic State affiliate active in eastern Mali and the tri-border Liptako-Gourma zone, controlling Gao trade corridors and fighting both FAMa and JNIM.'
      }
    ]
  },
  CD: {
    countryId: 'CD',
    countryName: 'Democratic Republic of the Congo',
    flag: '🇨🇩',
    conflictName: 'Eastern DRC & M23 Great Lakes Conflict',
    yearStarted: 1996,
    stability: 21,
    status: 'ACTIVE',
    refugeePressure: 90,
    monthlyCasualties: 750,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'CD_SIDE_GOV',
        name: 'Forces Armées de la RDC (FARDC)',
        leader: 'CD_FARDC',
        members: ['CD_FARDC'],
        color: '#0284c7'
      },
      {
        id: 'CD_SIDE_M23',
        name: 'M23 / AFC Coalition',
        leader: 'CD_M23',
        members: ['CD_M23'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'CD_FARDC',
        name: 'FARDC Government & SADC / Wazalendo Alliance',
        leader: 'Félix Tshisekedi',
        ideology: 'Constitutional Republic',
        color: '#0284c7',
        strength: 60,
        controlledRegions: [
          'Kinshasa', 'Kongo-Central', 'Kwango', 'Kwilu', 'Mai-Ndombe',
          'Équateur', 'Mongala', 'Nord-Ubangi', 'Sud-Ubangi', 'Tshuapa',
          'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Sankuru', 'Lomami',
          'Haut-Katanga', 'Haut-Lomami', 'Lualaba', 'Tanganyika', 'Maniema',
          'Tshopo', 'Bas-Uele', 'Haut-Uele', 'Ituri', 'Sud-Kivu'
        ],
        isGovernment: true,
        foreignBacker: 'SADC (SAMIDRC: South Africa, Tanzania, Malawi) / Angola / Burundi / Wazalendo',
        description: 'Holds the capital Kinshasa, the vast Congo basin, Katanga copper/cobalt mining zones, and regional peacekeeping allies.'
      },
      {
        id: 'CD_M23',
        name: 'March 23 Movement & Alliance Fleuve Congo (AFC/M23)',
        leader: 'Corneille Nangaa & Gen. Sultani Makenga',
        ideology: 'Armed Political-Military Rebellion',
        color: '#dc2626',
        strength: 40,
        controlledRegions: ['Nord-Kivu'],
        foreignBacker: 'Rwanda (RDF Logistical & Operational Support) / Regional Rebel Networks',
        description: 'Heavily equipped rebellion holding volcanic highlands, coltan corridors, and threatening the provincial capital of Goma.'
      }
    ]
  },
  ET: {
    countryId: 'ET',
    countryName: 'Ethiopia',
    flag: '🇪🇹',
    conflictName: 'Ethiopian Multi-Front Civil War & Regional Insurgencies',
    yearStarted: 2020,
    stability: 27,
    status: 'ACTIVE',
    refugeePressure: 75,
    monthlyCasualties: 450,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'ET_SIDE_GOV',
        name: 'Federal Democratic Republic & ENDF',
        leader: 'ET_GOV',
        members: ['ET_GOV'],
        color: '#15803d'
      },
      {
        id: 'ET_SIDE_TPLF',
        name: 'Tigray Forces (TPLF / TDF)',
        leader: 'ET_TPLF',
        members: ['ET_TPLF'],
        color: '#dc2626'
      },
      {
        id: 'ET_SIDE_FANO',
        name: 'Amhara Fano Resistance',
        leader: 'ET_FANO',
        members: ['ET_FANO'],
        color: '#2563eb'
      },
      {
        id: 'ET_SIDE_OLA',
        name: 'Oromo Liberation Army (OLA)',
        leader: 'ET_OLA',
        members: ['ET_OLA'],
        color: '#d97706'
      }
    ],
    factions: [
      {
        id: 'ET_GOV',
        name: 'Federal Government',
        leader: 'Abiy Ahmed',
        ideology: 'Prosperity Party / Centralized Developmentalism',
        color: '#15803d',
        strength: 45,
        controlledRegions: ['AddisAbeba', 'DireDawa', 'HarariPeople', 'Afar', 'Somali', 'Benshangul-Gumaz', 'GambelaPeoples', 'SouthernNations,Nationalities'],
        isGovernment: true,
        foreignBacker: 'UAE / Turkey / China',
        description: 'UN-recognized federal government commanding the Ethiopian National Defense Force (ENDF), holding the capital Addis Ababa, key logistical transit corridors to Djibouti, and federal regional capitals.'
      },
      {
        id: 'ET_TPLF',
        name: 'TPLF/Tigray forces',
        leader: 'Debretsion Gebremichael',
        ideology: 'Democratic Nationalism / Tigray Autonomy',
        color: '#dc2626',
        strength: 22,
        controlledRegions: ['Tigray'],
        foreignBacker: 'Tigrayan Diaspora / Pretoria Agreement Monitoring',
        description: 'Hardened northern regional army holding Tigray highland trenches, Mekelle capital, and preserving organized mechanized brigades following the Pretoria Cessation of Hostilities.'
      },
      {
        id: 'ET_FANO',
        name: 'Fano (Amhara)',
        leader: 'Zemene Kassie',
        ideology: 'Amhara Ethno-Nationalist Resistance',
        color: '#2563eb',
        strength: 20,
        controlledRegions: ['Amhara'],
        foreignBacker: 'Amhara Civic & Diaspora Coalitions',
        description: 'Decentralized popular militia waging widespread guerrilla resistance against federal demobilization across the mountainous Amhara region and historic Gondar-Wollo axes.'
      },
      {
        id: 'ET_OLA',
        name: 'OLA (Oromo)',
        leader: 'Jaal Marroo (Kumsa Diriba)',
        ideology: 'Oromo Self-Determination & Federal Autonomy',
        color: '#d97706',
        strength: 13,
        controlledRegions: ['Oromia'],
        foreignBacker: 'Oromo Diaspora & Regional Border Networks',
        description: 'Armed wing of the Oromo national movement fighting for regional autonomy and rural control across western and southern Oromia farmlands.'
      }
    ]
  },
  HT: {
    countryId: 'HT',
    countryName: 'Haiti',
    flag: '🇭🇹',
    conflictName: 'Port-au-Prince Gang War & Security Mission Crisis',
    yearStarted: 2021,
    stability: 12,
    status: 'ACTIVE',
    refugeePressure: 88,
    monthlyCasualties: 310,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'HT_SIDE_GOV',
        name: 'Transitional Gov & Kenya MSS',
        leader: 'HT_TRANSITION',
        members: ['HT_TRANSITION'],
        color: '#1e3a8a'
      },
      {
        id: 'HT_SIDE_GANGS',
        name: 'Viv Ansanm Gang Coalition',
        leader: 'HT_VIV_ANSANM',
        members: ['HT_VIV_ANSANM'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'HT_TRANSITION',
        name: 'Transitional Government + Kenya-led Security Mission',
        leader: 'Leslie Voltaire & Alix Didier Fils-Aimé',
        ideology: 'Transitional Governance / UN Security Support',
        color: '#1e3a8a',
        strength: 48,
        controlledRegions: ['Nord', 'Nord-Est', 'Nord-Ouest', 'Sud', 'Sud-Est', 'Nippes', "Grand'Anse", 'Centre'],
        isGovernment: true,
        foreignBacker: 'Kenya (MSS Mission) / USA / CARICOM / UN',
        description: 'Transitional presidential council supported by Kenyan-led international security police, holding provincial departments and sea routes.'
      },
      {
        id: 'HT_VIV_ANSANM',
        name: 'Viv Ansanm Gang Coalition',
        leader: 'Jimmy Chérizier ("Barbecue") & Johnson André ("Izo")',
        ideology: 'Armed Criminal Confederation / Populist Militia',
        color: '#dc2626',
        strength: 52,
        controlledRegions: ['Ouest', "L'Artibonite"],
        foreignBacker: 'Illicit Firearms Trafficking / Extortion Networks',
        description: 'Heavily armed coalition controlling ~80% of Port-au-Prince metropolitan department, petroleum wharves, and Artibonite agrarian corridors.'
      }
    ]
  },
  AF: {
    countryId: 'AF',
    countryName: 'Afghanistan',
    flag: '🇦🇫',
    conflictName: 'Afghan Anti-Taliban Insurgency & Resistance War',
    yearStarted: 2021,
    stability: 22,
    status: 'ACTIVE',
    refugeePressure: 78,
    monthlyCasualties: 190,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'AF_SIDE_TALIBAN',
        name: 'Taliban Government (IEA)',
        leader: 'AF_TAL',
        members: ['AF_TAL'],
        color: '#1e293b'
      },
      {
        id: 'AF_SIDE_RESISTANCE',
        name: 'National Resistance Front (NRF)',
        leader: 'AF_NRF',
        members: ['AF_NRF'],
        color: '#059669'
      },
      {
        id: 'AF_SIDE_ISKP',
        name: 'ISIS-K (Islamic State Khorasan)',
        leader: 'AF_ISKP',
        members: ['AF_ISKP'],
        color: '#dc2626'
      }
    ],
    factions: [
      {
        id: 'AF_TAL',
        name: 'Taliban Government',
        leader: 'Hibatullah Akhundzada & Sirajuddin Haqqani',
        ideology: 'Theocratic Authoritarianism / De Facto Regime',
        color: '#1e293b',
        strength: 65,
        controlledRegions: ['Kabul', 'Kandahar', 'Hirat', 'Balkh', 'Hilmand', 'Kunduz', 'Ghazni', 'Faryab', 'Jawzjan', 'Samangan', 'SariPul', 'Ghor', 'Daykundi', 'Bamyan', 'Farah', 'Nimroz', 'Uruzgan', 'Zabul', 'Paktya', 'Paktika', 'Khost', 'Logar', 'Wardak', 'Parwan', 'Kapisa', 'Laghman', 'Badghis'],
        isGovernment: true,
        foreignBacker: 'Regional Trade Ties / Seized Military Arsenals',
        description: 'Controls state apparatus, major provincial capitals, border crossings, and national infrastructure.'
      },
      {
        id: 'AF_NRF',
        name: 'National Resistance Front',
        leader: 'Ahmad Massoud',
        ideology: 'Democratic Republican / Anti-Taliban Front',
        color: '#059669',
        strength: 22,
        controlledRegions: ['Panjshir', 'Badakhshan', 'Takhar', 'Baghlan'],
        foreignBacker: 'Afghan Diaspora / European Sympathizers / Tajikistan',
        description: 'Guerrilla insurgent front operating from high Hindu Kush valleys, mounting asymmetric ambushes against Taliban garrisons.'
      },
      {
        id: 'AF_ISKP',
        name: 'ISIS-K',
        leader: 'Sanaullah Ghafari ("Shahab al-Muhajir")',
        ideology: 'Transnational Salafi-Jihadist Caliphate',
        color: '#dc2626',
        strength: 13,
        controlledRegions: ['Nangarhar', 'Kunar', 'Nuristan'],
        foreignBacker: 'Global Salafi-Jihadist Underground Networks',
        description: 'Hardline militant wing conducting suicide bombings and insurgent ambushes in eastern mountain sectors.'
      }
    ]
  },
  CN: {
    countryId: 'CN',
    countryName: 'China',
    flag: '🇨🇳',
    conflictName: 'Chinese Civil War (PRC vs. ROC 1950)',
    yearStarted: 1946,
    stability: 30,
    status: 'ACTIVE',
    refugeePressure: 60,
    monthlyCasualties: 850,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'CN_SIDE_PRC',
        name: 'People\'s Republic of China (PRC)',
        leader: 'CN_PRC',
        members: ['CN_PRC'],
        color: '#dc2626'
      },
      {
        id: 'CN_SIDE_ROC',
        name: 'Republic of China (ROC / Taiwan)',
        leader: 'CN_ROC',
        members: ['CN_ROC'],
        color: '#2563eb'
      }
    ],
    factions: [
      {
        id: 'CN_PRC',
        name: 'People\'s Republic of China (PRC / PLA)',
        leader: 'Mao Zedong & Zhou Enlai',
        ideology: 'Socialist / People\'s Democratic Dictatorship',
        color: '#dc2626',
        strength: 82,
        controlledRegions: [
          'Anhui', 'Beijing', 'Chongqing', 'Gansu', 'Guangdong', 'Guangxi', 
          'Guizhou', 'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 
          'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'NeiMongol', 'NingxiaHui', 
          'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 
          'Tianjin', 'XinjiangUygur', 'Xizang', 'Yunnan', 'Zhejiang'
        ],
        isGovernment: true,
        foreignBacker: 'Soviet Union (USSR)',
        description: 'Controls the entirety of mainland China following the founding of the PRC in Beijing, organizing agrarian revolution and mass mobilizations.'
      },
      {
        id: 'CN_ROC',
        name: 'Republic of China (ROC / Taiwan)',
        leader: 'Chiang Kai-shek & Chen Cheng',
        ideology: 'Three Principles of the People / Nationalist',
        color: '#2563eb',
        strength: 18,
        controlledRegions: ['Taiwan', 'Kinmen', 'Hainan', 'Fujian', 'HongKong', 'Macau'],
        isGovernment: false,
        foreignBacker: 'United States (US Seventh Fleet & MAAG)',
        description: 'Holding Taiwan, the Pescadores, Hainan, Kinmen, and Matsu, maintaining naval superiority and preparing defense against PLA amphibious assaults.'
      }
    ]
  },
  VN: {
    countryId: 'VN',
    countryName: 'Vietnam',
    flag: '🇻🇳',
    conflictName: 'First Indochina War (Viet Minh vs. French Union)',
    yearStarted: 1946,
    stability: 22,
    status: 'ACTIVE',
    refugeePressure: 70,
    monthlyCasualties: 600,
    playerStance: 'NEUTRAL',
    sides: [
      {
        id: 'VN_SIDE_VIETMINH',
        name: 'Viet Minh (Democratic Republic of Vietnam)',
        leader: 'VN_VIETMINH',
        members: ['VN_VIETMINH'],
        color: '#dc2626'
      },
      {
        id: 'VN_SIDE_FRENCH',
        name: 'French Union & State of Vietnam',
        leader: 'VN_FRENCH_STATE',
        members: ['VN_FRENCH_STATE'],
        color: '#2563eb'
      }
    ],
    factions: [
      {
        id: 'VN_VIETMINH',
        name: 'Viet Minh (Democratic Republic of Vietnam)',
        leader: 'Hồ Chí Minh & Võ Nguyên Giáp',
        ideology: 'Anti-Colonial National Liberation / Communist',
        color: '#dc2626',
        strength: 52,
        controlledRegions: [
          'CaoBằng', 'LạngSơn', 'BắcKạn', 'HàGiang', 'TuyênQuang', 'TháiNguyên', 
          'LàoCai', 'YênBái', 'PhúThọ', 'ĐiệnBiên', 'LaiChâu', 'SơnLa', 
          'HoàBình', 'QuảngNinh', 'BắcGiang', 'NghệAn', 'HàTĩnh', 'QuảngBình', 'ThanhHóa'
        ],
        isGovernment: false,
        foreignBacker: 'People\'s Republic of China & Soviet Union',
        description: 'National liberation forces based in northern Viet Bac mountains and rural strongholds, conducting guerrilla and mobile warfare.'
      },
      {
        id: 'VN_FRENCH_STATE',
        name: 'French Union & State of Vietnam',
        leader: 'Bảo Đại & Gen. Jean de Lattre de Tassigny',
        ideology: 'Associated State / French Union',
        color: '#2563eb',
        strength: 48,
        controlledRegions: [
          'HàNội', 'HảiPhòng', 'HảiDương', 'NamĐịnh', 'TháiBình', 'HưngYên', 
          'HàNam', 'NinhBình', 'ThừaThiênHuế', 'ĐàNẵng', 'QuảngNam', 'QuảngNgãi', 
          'BìnhĐịnh', 'PhúYên', 'KhánhHòa', 'NinhThuận', 'BìnhThuận', 'HồChíMinh', 
          'ĐồngNai', 'BàRịa-VũngTàu', 'BìnhDương', 'BìnhPhước', 'TâyNinh', 
          'LongAn', 'TiềnGiang', 'BếnTre', 'TràVinh', 'VĩnhLong', 'ĐồngTháp', 
          'AnGiang', 'KiênGiang', 'CầnThơ', 'HậuGiang', 'SócTrăng', 'BạcLiêu', 
          'CàMau', 'KonTum', 'GiaLai', 'ĐắkLắk', 'ĐắkNông', 'LâmĐồng', 
          'QuảngTrị', 'VĩnhPhúc', 'BắcNinh'
        ],
        isGovernment: true,
        foreignBacker: 'French Republic & United States',
        description: 'French Expeditionary Corps (CEFEO) and Vietnamese National Army holding urban centers, major seaports, and the southern delta.'
      }
    ]
  }
};

// Aliases for 3-letter ISO codes where needed
INITIAL_CIVIL_WARS.COD = INITIAL_CIVIL_WARS.CD;
INITIAL_CIVIL_WARS.ETH = INITIAL_CIVIL_WARS.ET;
INITIAL_CIVIL_WARS.SOM = INITIAL_CIVIL_WARS.SO;
INITIAL_CIVIL_WARS.AFG = INITIAL_CIVIL_WARS.AF;
INITIAL_CIVIL_WARS.HTI = INITIAL_CIVIL_WARS.HT;
INITIAL_CIVIL_WARS.MLI = INITIAL_CIVIL_WARS.ML;
INITIAL_CIVIL_WARS.CHN = INITIAL_CIVIL_WARS.CN;
INITIAL_CIVIL_WARS.VNM = INITIAL_CIVIL_WARS.VN;
INITIAL_CIVIL_WARS.LBY = INITIAL_CIVIL_WARS.LY;
INITIAL_CIVIL_WARS.SYR = INITIAL_CIVIL_WARS.SY;
INITIAL_CIVIL_WARS.SDN = INITIAL_CIVIL_WARS.SD;
INITIAL_CIVIL_WARS.MMR = INITIAL_CIVIL_WARS.MM;
INITIAL_CIVIL_WARS.YEM = INITIAL_CIVIL_WARS.YE;

/**
 * Checks if a country code is currently in an active civil war state
 */
export function isCountryInCivilWar(countryId: string): boolean {
  return countryId in INITIAL_CIVIL_WARS && INITIAL_CIVIL_WARS[countryId].status === 'ACTIVE';
}

/**
 * Gets the civil war state for a given country code
 */
export function getCivilWarState(countryId: string): CivilWarState | null {
  return INITIAL_CIVIL_WARS[countryId] || null;
}

/**
 * Gets structured conflict sides for a given civil war country
 */
export function getConflictSides(countryId: string): ConflictSide[] {
  const cw = INITIAL_CIVIL_WARS[countryId];
  if (cw?.sides && cw.sides.length > 0) return cw.sides;
  return [];
}

/**
 * Returns true if two factions belong to the same side/alliance
 */
export function areFactionsAllied(factionAId: string, factionBId: string, sides?: ConflictSide[]): boolean {
  if (factionAId === factionBId) return true;
  if (!sides || sides.length === 0) return false;
  return sides.some(side => side.members.includes(factionAId) && side.members.includes(factionBId));
}

/**
 * Returns true if two factions are mutually hostile
 */
export function areFactionsHostile(factionAId: string, factionBId: string, sides?: ConflictSide[]): boolean {
  return !areFactionsAllied(factionAId, factionBId, sides);
}

/**
 * Simulates a monthly turn for an active civil war.
 * Determines shifts in strength, potential ceasefire, or faction victory.
 */
export function simulateCivilWarMonth(
  cw: CivilWarState,
  playerAid?: { recipientId: string; amount: number }
): { updatedState: CivilWarState; outcomeEvent?: string } {
  if (cw.status !== 'ACTIVE') return { updatedState: cw };

  const updated: CivilWarState = JSON.parse(JSON.stringify(cw));
  let outcomeEvent: string | undefined;

  // Apply player aid boost
  if (playerAid && playerAid.amount > 0) {
    const targetFaction = updated.factions.find(f => f.id === playerAid.recipientId);
    if (targetFaction) {
      const boost = Math.min(8, Math.round(playerAid.amount / 10000));
      targetFaction.strength = Math.min(95, targetFaction.strength + boost);
      // Reduce rivals
      const rivals = updated.factions.filter(f => f.id !== playerAid.recipientId);
      rivals.forEach(r => {
        r.strength = Math.max(5, r.strength - Math.round(boost / (rivals.length || 1)));
      });
    }
  }

  // Monthly strength drift & combat
  const gov = updated.factions.find(f => f.isGovernment);
  const rebels = updated.factions.filter(f => !f.isGovernment);
  const maxRebel = rebels.reduce((prev, curr) => (curr.strength > prev.strength ? curr : prev), rebels[0]);

  if (gov && maxRebel) {
    const dice = (Math.random() - 0.48) * 4; // slight random fluctuation
    if (dice > 0) {
      gov.strength = Math.min(95, Math.max(10, gov.strength + dice));
      maxRebel.strength = Math.min(90, Math.max(10, maxRebel.strength - dice));
    } else {
      gov.strength = Math.min(95, Math.max(10, gov.strength + dice));
      maxRebel.strength = Math.min(90, Math.max(10, maxRebel.strength - dice));
    }

    // Check Victory Thresholds
    if (gov.strength >= 85) {
      updated.status = 'GOV_VICTORY';
      updated.stability = 68;
      outcomeEvent = `Government Forces have decisively reclaimed full sovereign control of ${cw.countryName}. The civil conflict is officially concluded, national stabilization commences, and scheduled elections are restored.`;
    } else if (maxRebel.strength >= 85) {
      updated.status = 'REBEL_VICTORY';
      updated.stability = 42;
      outcomeEvent = `Rebel Coalition under ${maxRebel.name} has captured the state apparatus in ${cw.countryName}. A new transitional regime is established.`;
    } else if (updated.stability < 10 && Math.random() < 0.05) {
      updated.status = 'PARTITION';
      updated.stability = 38;
      outcomeEvent = `Under international mediation, a permanent territorial partition agreement has been formalized in ${cw.countryName}.`;
    }
  }

  // Monthly casualty variance
  updated.monthlyCasualties = Math.round(cw.monthlyCasualties * (0.85 + Math.random() * 0.3));

  return { updatedState: updated, outcomeEvent };
}
