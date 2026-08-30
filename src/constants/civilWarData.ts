/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CivilWarState } from '../types';

export const INITIAL_CIVIL_WARS: Record<string, CivilWarState> = {
  SY: {
    countryId: 'SY',
    countryName: 'Syria',
    flag: '🇸🇾',
    conflictName: 'Syrian Civil Conflict & Regional Fragmentations',
    yearStarted: 2011,
    stability: 18,
    status: 'ACTIVE',
    refugeePressure: 85,
    monthlyCasualties: 420,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'SY_GOV',
        name: 'Syrian Arab Republic (Damascus)',
        leader: 'Bashar al-Assad',
        ideology: 'Ba\'athist Authoritarian',
        color: '#b91c1c',
        strength: 58,
        controlledRegions: ['Damascus', 'Aleppo Central', 'Latakia', 'Homs', 'Tartus'],
        isGovernment: true,
        foreignBacker: 'Russia / Iran',
        description: 'Controls the capital, Mediterranean coast, and major central urban corridors with heavy foreign air and logistics support.'
      },
      {
        id: 'SY_SDF',
        name: 'Syrian Democratic Forces (AANES)',
        leader: 'Mazloum Abdi',
        ideology: 'Democratic Confederalism',
        color: '#eab308',
        strength: 24,
        controlledRegions: ['Hasakah', 'Qamishli', 'Raqqa Rural', 'Deir ez-Zor North'],
        foreignBacker: 'Western Coalition',
        description: 'Multi-ethnic autonomous coalition holding northeastern territories, oil fields, and anti-ISIS security zones.'
      },
      {
        id: 'SY_SNA',
        name: 'Syrian National Army & Opposition',
        leader: 'Salim Idris / Interim Govt',
        ideology: 'Sunni Islamist / Opposition',
        color: '#15803d',
        strength: 18,
        controlledRegions: ['Idlib', 'Afrin', 'Al-Bab', 'Jarabulus'],
        foreignBacker: 'Regional Power',
        description: 'Northern territorial enclave encompassing Idlib and northern border security zones.'
      }
    ]
  },
  LY: {
    countryId: 'LY',
    countryName: 'Libya',
    flag: '🇱🇾',
    conflictName: 'Libyan Dual-Regime & Militia Crisis',
    yearStarted: 2014,
    stability: 22,
    status: 'ACTIVE',
    refugeePressure: 60,
    monthlyCasualties: 150,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'LY_GNU',
        name: 'Government of National Unity (Tripoli)',
        leader: 'Abdul Hamid Dbeibeh',
        ideology: 'Centrist / UN-Recognized',
        color: '#0284c7',
        strength: 48,
        controlledRegions: ['Tripoli', 'Misrata', 'Zawiya', 'Gharyan'],
        isGovernment: true,
        foreignBacker: 'UN / Turkey / Italy',
        description: 'Controls western maritime capital, key port infrastructure, and national banking headquarters.'
      },
      {
        id: 'LY_LNA',
        name: 'Libyan National Army / House of Reps (Tobruk)',
        leader: 'Khalifa Haftar',
        ideology: 'Secular Military Rule',
        color: '#dc2626',
        strength: 52,
        controlledRegions: ['Benghazi', 'Tobruk', 'Sirte Basin', 'Kufra Oil Fields'],
        foreignBacker: 'Egypt / UAE / Russia',
        description: 'Controls the eastern Cyrenaica territory, southern desert oases, and the vital Oil Crescent export terminals.'
      }
    ]
  },
  SD: {
    countryId: 'SD',
    countryName: 'Sudan',
    flag: '🇸🇩',
    conflictName: 'Sudanese Armed Forces vs RSF War',
    yearStarted: 2023,
    stability: 14,
    status: 'ACTIVE',
    refugeePressure: 95,
    monthlyCasualties: 1200,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'SD_SAF',
        name: 'Sudanese Armed Forces (SAF)',
        leader: 'Gen. Abdel Fattah al-Burhan',
        ideology: 'Military Transitional Sovereign Council',
        color: '#1e3a8a',
        strength: 51,
        controlledRegions: ['Port Sudan', 'Khartoum North', 'River Nile', 'Gedarif', 'Kassala'],
        isGovernment: true,
        foreignBacker: 'Egypt / Saudi Arabia',
        description: 'Maintains maritime Red Sea coastline headquarters in Port Sudan, heavy artillery, and eastern agricultural heartlands.'
      },
      {
        id: 'SD_RSF',
        name: 'Rapid Support Forces (RSF)',
        leader: 'Mohamed Hamdan Dagalo (Hemedti)',
        ideology: 'Paramilitary Militia Coalition',
        color: '#b45309',
        strength: 49,
        controlledRegions: ['Darfur (North/South/West)', 'Kordofan', 'Omdurman West', 'Wad Madani'],
        foreignBacker: 'UAE / Regional Smugglers',
        description: 'Fast-moving mobile desert paramilitary holding deep western Darfur strongholds and contested central hubs.'
      }
    ]
  },
  MM: {
    countryId: 'MM',
    countryName: 'Myanmar',
    flag: '🇲🇲',
    conflictName: 'Myanmar Spring Revolution & Resistance',
    yearStarted: 2021,
    stability: 16,
    status: 'ACTIVE',
    refugeePressure: 70,
    monthlyCasualties: 850,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'MM_JUNTA',
        name: 'State Administration Council (Tatmadaw)',
        leader: 'Min Aung Hlaing',
        ideology: 'Military Dictatorship',
        color: '#475569',
        strength: 44,
        controlledRegions: ['Naypyidaw', 'Yangon', 'Mandalay Core', 'Bago Lowlands'],
        isGovernment: true,
        foreignBacker: 'Russia / China (Cautious)',
        description: 'Entrenched military regime maintaining capital command, heavy armor, air superiority, and coastal trade.'
      },
      {
        id: 'MM_NUG_PDF',
        name: 'National Unity Government & Brotherhood Alliance',
        leader: 'Duwa Lashi La / Ethnic Armed Orgs',
        ideology: 'Federal Democratic Republic',
        color: '#16a34a',
        strength: 56,
        controlledRegions: ['Shan State North', 'Rakhine (AA)', 'Kachin Hills', 'Kayah / Karen Border'],
        foreignBacker: 'Pro-Democracy Coalitions',
        description: 'Allied ethnic resistance groups and people\'s defense forces holding vast border regions, trade gates, and highlands.'
      }
    ]
  },
  YE: {
    countryId: 'YE',
    countryName: 'Yemen',
    flag: '🇾🇪',
    conflictName: 'Yemeni Civil Conflict & Red Sea Crisis',
    yearStarted: 2014,
    stability: 19,
    status: 'ACTIVE',
    refugeePressure: 80,
    monthlyCasualties: 300,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'YE_HOU',
        name: 'Ansar Allah (Houthi De Facto Authority)',
        leader: 'Abdul-Malik al-Houthi',
        ideology: 'Zaidi Shia Islamist / Anti-Western',
        color: '#15803d',
        strength: 55,
        controlledRegions: ['Sanaa Capital', 'Hodeidah Port', 'Saada', 'Dhamar', 'Ibb'],
        foreignBacker: 'Iran / Axis of Resistance',
        description: 'Holds the historic capital Sanaa, Bab el-Mandeb coastal missile corridors, and high-density northwest highlands.'
      },
      {
        id: 'YE_PLC',
        name: 'Presidential Leadership Council & STC (Aden)',
        leader: 'Rashad al-Alimi / Aidarous al-Zubaidi',
        ideology: 'Internationally Recognized Republic / Southern Movement',
        color: '#0284c7',
        strength: 45,
        controlledRegions: ['Aden Temporary Capital', 'Marib (Oil)', 'Hadramawt', 'Shabwah', 'Socotra'],
        isGovernment: true,
        foreignBacker: 'Saudi Arabia / UAE',
        description: 'UN-recognized coalition holding the southern port of Aden, eastern oil reserves in Marib, and Indian Ocean coast.'
      }
    ]
  },
  SO: {
    countryId: 'SO',
    countryName: 'Somalia',
    flag: '🇸🇴',
    conflictName: 'Somali Counter-Insurgency & Federal Fragmentation',
    yearStarted: 2006,
    stability: 24,
    status: 'ACTIVE',
    refugeePressure: 65,
    monthlyCasualties: 220,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'SO_FGS',
        name: 'Federal Government of Somalia & ATMIS',
        leader: 'Hassan Sheikh Mohamud',
        ideology: 'Federal Democratic Republic',
        color: '#0284c7',
        strength: 62,
        controlledRegions: ['Mogadishu', 'Hirshabelle', 'Galmudug', 'Puntland (Autonomous)', 'Jubaland Core'],
        isGovernment: true,
        foreignBacker: 'African Union / Turkey / USA',
        description: 'Federal authority supported by African Union peacekeeping forces, maintaining urban centers and Indian Ocean ports.'
      },
      {
        id: 'SO_AS',
        name: 'Al-Shabaab Insurgency',
        leader: 'Ahmed Diriye (Abu Ubaidah)',
        ideology: 'Salafi-Jihadist Insurgency',
        color: '#0f172a',
        strength: 38,
        controlledRegions: ['Middle Juba', 'Lower Shabelle Rural', 'Bay Interior', 'Hiran Hinterlands'],
        foreignBacker: 'Illicit Charcoal / Tax Extortion Networks',
        description: 'Insurgent network holding rural riverine strongholds, mounting asymmetrical ambushes, and levying shadow taxes.'
      }
    ]
  },
  ML: {
    countryId: 'ML',
    countryName: 'Mali',
    flag: '🇲🇱',
    conflictName: 'Sahel War & Azawad Tuareg Insurgency',
    yearStarted: 2012,
    stability: 20,
    status: 'ACTIVE',
    refugeePressure: 72,
    monthlyCasualties: 380,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'ML_FAMA',
        name: 'Malian Armed Forces (FAMa Junta)',
        leader: 'Col. Assimi Goïta',
        ideology: 'Military Nationalist Junta',
        color: '#15803d',
        strength: 55,
        controlledRegions: ['Bamako Capital', 'Ségou', 'Sikasso', 'Mopti', 'Kidal Base'],
        isGovernment: true,
        foreignBacker: 'Russia (Africa Corps) / AES Alliance',
        description: 'Military junta allied with Burkina Faso and Niger (AES), relying on Russian instructors and heavy drones.'
      },
      {
        id: 'ML_CMA_JNIM',
        name: 'CSP-DPA (Azawad) & JNIM Militants',
        leader: 'Bilal Ag Acherif / Iyad Ag Ghaly',
        ideology: 'Tuareg Separatist / Sahelian Jihadist Fronts',
        color: '#ca8a04',
        strength: 45,
        controlledRegions: ['Tinzaouaten', 'Tessalit Desert', 'Gao Rural', 'Timbuktu Outskirts'],
        foreignBacker: 'Desert Smuggling Networks',
        description: 'Mobile desert guerrilla confederation controlling northern trade frontiers and Sahara dune corridors.'
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
    factions: [
      {
        id: 'CD_FARDC',
        name: 'FARDC Government & SADC / Wazalendo',
        leader: 'Félix Tshisekedi',
        ideology: 'Constitutional Republic',
        color: '#0284c7',
        strength: 57,
        controlledRegions: ['Kinshasa Capital', 'Katanga Mining Hub', 'Kasaï', 'Kisangani', 'Beni'],
        isGovernment: true,
        foreignBacker: 'SADC / Southern Africa / EU',
        description: 'Holds the vast Western Congo basin, southern cobalt/copper mining basins, and regional peacekeeping allies.'
      },
      {
        id: 'CD_M23',
        name: 'March 23 Movement (M23 / AFC Coalition)',
        leader: 'Corneille Nangaa / Sultani Makenga',
        ideology: 'Armed Political-Military Rebellion',
        color: '#dc2626',
        strength: 43,
        controlledRegions: ['North Kivu (Rutshuru)', 'Masisi Hills', 'Goma Environs', 'Bunagana Border'],
        foreignBacker: 'Regional Neighbors (Alleged)',
        description: 'Heavily equipped rebellion holding volcanic highlands, coltan corridors, and threatening the provincial capital of Goma.'
      }
    ]
  },
  ET: {
    countryId: 'ET',
    countryName: 'Ethiopia',
    flag: '🇪🇹',
    conflictName: 'Amhara Fano & Oromo Regional Insurgencies',
    yearStarted: 2020,
    stability: 27,
    status: 'ACTIVE',
    refugeePressure: 75,
    monthlyCasualties: 450,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'ET_ENDF',
        name: 'Federal Democratic Republic & ENDF',
        leader: 'Abiy Ahmed',
        ideology: 'Prosperity Party / Centralized Developmentalism',
        color: '#15803d',
        strength: 65,
        controlledRegions: ['Addis Ababa', 'Tigray (Pretoria Accord)', 'Dire Dawa', 'Harar', 'Afar'],
        isGovernment: true,
        foreignBacker: 'UAE / Turkey / China',
        description: 'Maintains national institutions, air force, Grand Ethiopian Renaissance Dam, and Addis Ababa metropolis.'
      },
      {
        id: 'ET_FANO_OLA',
        name: 'Fano Militias & OLA Rebels',
        leader: 'Regional Fano Commanders / Jaal Marroo',
        ideology: 'Ethno-Regional Defense & Autonomy',
        color: '#b45309',
        strength: 35,
        controlledRegions: ['Amhara Rural (Gondar/Wollo)', 'Western Welega', 'Guji Highlands'],
        foreignBacker: 'Diaspora Networks',
        description: 'Dispersed regional militias resisting federal disarmament and demanding constitutional revision.'
      }
    ]
  },
  HT: {
    countryId: 'HT',
    countryName: 'Haiti',
    flag: '🇭🇹',
    conflictName: 'Port-au-Prince Gang Coalition War & Security Crisis',
    yearStarted: 2021,
    stability: 12,
    status: 'ACTIVE',
    refugeePressure: 88,
    monthlyCasualties: 310,
    playerStance: 'NEUTRAL',
    factions: [
      {
        id: 'HT_TRANSITION',
        name: 'Transitional Presidential Council & MSS Mission',
        leader: 'Leslie Voltaire / Alix Didier Fils-Aimé',
        ideology: 'Transitional Government / MSS Force',
        color: '#1e3a8a',
        strength: 40,
        controlledRegions: ['National Palace Compound', 'Pétion-Ville', 'Cap-Haïtien Port', 'Les Cayes'],
        isGovernment: true,
        foreignBacker: 'Kenya (MSS) / USA / CARICOM / UN',
        description: 'Transitional council supported by Kenyan-led international security forces, holding northern hubs and state offices.'
      },
      {
        id: 'HT_VIV_ANSANM',
        name: 'Viv Ansanm Gang Coalition',
        leader: 'Jimmy Chérizier ("Barbecue")',
        ideology: 'Armed Criminal Confederation / Populist Guerrilla',
        color: '#7f1d1d',
        strength: 60,
        controlledRegions: ['Port-au-Prince Center', 'Cité Soleil', 'Carrefour', 'Varreux Fuel Terminal', 'Artibonite Valley'],
        foreignBacker: 'Illicit Firearms Trafficking',
        description: 'Heavily armed coalition controlling ~80% of the metropolitan capital, fuel ports, highway choke points, and valleys.'
      }
    ]
  }
};

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
