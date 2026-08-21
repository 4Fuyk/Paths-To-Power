/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, ScenarioYear, Region, RivalParty, Bill } from '../types';
import { PLAYABLE_COUNTRIES, getTurkeyRegions, getUSRegions, getGermanyRegions, getUKRegions, getFranceRegions, getItalyRegions } from './countries';

// Helper to generate generic historical regions
const generateHistoricalRegions = (
  countryId: string,
  specs: { name: string; seats: number; winner: string; mayorName?: string }[],
  rivals: RivalParty[]
): Region[] => {
  return specs.map((spec) => {
    const supports: Record<string, number> = {};
    const totalRivals = rivals.length;
    const baseVal = Math.floor(100 / totalRivals);
    
    rivals.forEach((r) => {
      if (r.id === spec.winner) {
        supports[r.id] = baseVal + 15;
      } else {
        supports[r.id] = Math.max(5, baseVal - Math.floor(15 / (totalRivals - 1 || 1)));
      }
    });

    // Normalize
    const sum = Object.values(supports).reduce((a, b) => a + b, 0);
    const scale = 100 / sum;
    Object.keys(supports).forEach(k => {
      supports[k] = parseFloat((supports[k] * scale).toFixed(1));
    });

    const cleanIdPart = spec.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

    return {
      id: `${countryId}_${cleanIdPart}`,
      name: spec.name,
      seats: spec.seats,
      voterDistribution: {
        'Workers': 25,
        'Youth': 15,
        'Nationalists': 20,
        'Liberals': 15,
        'Traditionalists': 15,
        'Shopkeepers': 10,
      },
      supports,
      infrastructure: spec.seats > 20 ? 5 : spec.seats > 10 ? 4 : 3,
      campaignLevel: 0,
      ownerPartyId: spec.winner,
      mayorName: spec.mayorName || 'Regional Governor',
    };
  });
};

// Generic & Country-Specific historical bills
const createHistoricalBills = (era: ScenarioYear, countryId?: string): Bill[] => {
  if (era === '1950') {
    if (countryId === 'TR') {
      return [
        {
          id: `bill_${era}_TR_1`,
          title: 'Return to Arabic Adhan & Religious Freedoms Act',
          description: 'Lifts the legal restrictions on reciting the Islamic call to prayer in its traditional Arabic form.',
          category: 'Freedoms',
          budgetCost: 20000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Traditionalists': 22, 'Shopkeepers': 12, 'Nationalists': 8, 'Liberals': 4, 'Workers': 6, 'Youth': -8 }
        },
        {
          id: `bill_${era}_TR_2`,
          title: 'Korean War Expeditionary Brigade Authorization',
          description: 'Dispatches an armed infantry brigade under UN Command to Korea to secure NATO membership integration.',
          category: 'Security',
          budgetCost: 350000,
          influenceMod: 35,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 20, 'Liberals': 10, 'Traditionalists': 10, 'Shopkeepers': 4, 'Workers': -4, 'Youth': -6 }
        },
        {
          id: `bill_${era}_TR_3`,
          title: 'Agricultural Mechanization & Marshall Tractor Subsidies',
          description: 'Subsidizes modern tractors and combine harvesters for Anatolian peasant farmers via Marshall Plan credits.',
          category: 'Economy',
          budgetCost: 280000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 16, 'Shopkeepers': 14, 'Traditionalists': 10, 'Youth': 8, 'Liberals': 8, 'Nationalists': 4 }
        },
        {
          id: `bill_${era}_TR_4`,
          title: 'Democrat Party Press & Expression Liberalization Act',
          description: 'Reduces censorship regulations and guarantees newspaper publishing rights across all provinces.',
          category: 'Freedoms',
          budgetCost: 40000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 18, 'Youth': 14, 'Shopkeepers': 8, 'Workers': 6, 'Nationalists': 2, 'Traditionalists': 2 }
        },
        {
          id: `bill_${era}_TR_5`,
          title: 'National Highway Network Infrastructure Initiative',
          description: 'Constructs paved arterial highway connections between central Anatolia, the Black Sea, and Mediterranean ports.',
          category: 'Infrastructure',
          budgetCost: 420000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 18, 'Workers': 14, 'Nationalists': 10, 'Youth': 8, 'Liberals': 6, 'Traditionalists': 6 }
        },
        {
          id: `bill_${era}_TR_6`,
          title: 'Sugar & Cotton State Monopoly Decentralization Bill',
          description: 'Encourages private enterprise in textile mills and agro-industrial manufacturing plants.',
          category: 'Economy',
          budgetCost: 150000,
          influenceMod: 18,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 20, 'Liberals': 15, 'Workers': 4, 'Nationalists': -2, 'Youth': 4, 'Traditionalists': 4 }
        }
      ];
    }

    if (countryId === 'SU') {
      return [
        {
          id: `bill_${era}_SU_1`,
          title: 'Great Construction Projects of Communism (Volga-Don Canal)',
          description: 'Mobilizes state labor to complete strategic hydro-electric power cascades and inland waterways.',
          category: 'Infrastructure',
          budgetCost: 650000,
          influenceMod: 35,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 22, 'Nationalists': 14, 'Youth': 12, 'Shopkeepers': -10, 'Liberals': -12, 'Traditionalists': 6 }
        },
        {
          id: `bill_${era}_SU_2`,
          title: 'Great Plan for the Transformation of Nature',
          description: 'Plants thousands of miles of protective forest shelterbelts to combat droughts in the Eurasian steppes.',
          category: 'Environment',
          budgetCost: 320000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 18, 'Youth': 12, 'Nationalists': 10, 'Traditionalists': 8, 'Shopkeepers': 2, 'Liberals': 2 }
        },
        {
          id: `bill_${era}_SU_3`,
          title: 'Fifth Five-Year Plan Heavy Metallurgy Modernization',
          description: 'Doubles pig iron and steel ingot production targets across the Urals and Donbass industrial complexes.',
          category: 'Economy',
          budgetCost: 580000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 20, 'Nationalists': 12, 'Youth': 8, 'Traditionalists': 4, 'Shopkeepers': -8, 'Liberals': -10 }
        },
        {
          id: `bill_${era}_SU_4`,
          title: 'Kolkhoz Collective Farm Consolidation & Agrarian Mechanization',
          description: 'Merges small collective farms into large agro-towns with Machine and Tractor Stations (MTS).',
          category: 'Economy',
          budgetCost: 380000,
          influenceMod: 20,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 14, 'Traditionalists': 10, 'Nationalists': 6, 'Shopkeepers': -12, 'Liberals': -8, 'Youth': 6 }
        },
        {
          id: `bill_${era}_SU_5`,
          title: 'Soviet Strategic Nuclear & Jet Air Defense Expansion',
          description: 'Expands RDS nuclear weapons testing and mass production of MiG-15 jet interceptor divisions.',
          category: 'Security',
          budgetCost: 750000,
          influenceMod: 40,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 24, 'Workers': 12, 'Youth': 10, 'Traditionalists': 8, 'Liberals': -14, 'Shopkeepers': -6 }
        },
        {
          id: `bill_${era}_SU_6`,
          title: 'Ideological Vigilance & Cultural Education Reform',
          description: 'Enforces socialist realism standards in literature, sciences, and mass youth pioneer education.',
          category: 'Education',
          budgetCost: 120000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 12, 'Youth': 14, 'Nationalists': 10, 'Traditionalists': 4, 'Liberals': -18, 'Shopkeepers': -6 }
        }
      ];
    }

    if (countryId === 'US') {
      return [
        {
          id: `bill_${era}_US_1`,
          title: 'Defense Production Act & Korean War Emergency Mobilization',
          description: 'Empowers federal allocation of strategic materials and contracts to support UN forces in Korea.',
          category: 'Security',
          budgetCost: 650000,
          influenceMod: 35,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 22, 'Workers': 8, 'Traditionalists': 12, 'Shopkeepers': 6, 'Liberals': -4, 'Youth': -6 }
        },
        {
          id: `bill_${era}_US_2`,
          title: 'Marshall Plan European Recovery Extension Act',
          description: 'Provides economic and technical credits to Western European allies to build resilient trade markets.',
          category: 'Economy',
          budgetCost: 400000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 18, 'Shopkeepers': 14, 'Nationalists': 6, 'Workers': 6, 'Youth': 10, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_US_3`,
          title: 'Fair Deal Social Security Expansion & Housing Act',
          description: 'Expands old-age pension coverage to 10 million more citizens and funds low-income municipal housing.',
          category: 'Economy',
          budgetCost: 500000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 20, 'Youth': 14, 'Shopkeepers': 4, 'Liberals': 12, 'Traditionalists': 4, 'Nationalists': 2 }
        },
        {
          id: `bill_${era}_US_4`,
          title: 'National Science Foundation (NSF) Creation Act',
          description: 'Establishes federal grant funding for university research in physics, medicine, and computing.',
          category: 'Education',
          budgetCost: 220000,
          influenceMod: 20,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 18, 'Liberals': 16, 'Shopkeepers': 8, 'Workers': 6, 'Nationalists': 8, 'Traditionalists': 2 }
        },
        {
          id: `bill_${era}_US_5`,
          title: 'McCarran Internal Security & Anti-Subversion Oversight Act',
          description: 'Requires registration of subversive organizations and strengthens homeland intelligence protocols.',
          category: 'Security',
          budgetCost: 180000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 22, 'Traditionalists': 18, 'Shopkeepers': 6, 'Workers': 2, 'Liberals': -16, 'Youth': -10 }
        },
        {
          id: `bill_${era}_US_6`,
          title: 'Federal Civil Defense & Strategic Air Shelter Authorization',
          description: 'Organizes volunteer civil defense wardens and emergency fallout shelter construction in major cities.',
          category: 'Infrastructure',
          budgetCost: 290000,
          influenceMod: 18,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 14, 'Traditionalists': 12, 'Workers': 8, 'Shopkeepers': 8, 'Youth': 4, 'Liberals': 2 }
        }
      ];
    }

    if (countryId === 'GB') {
      return [
        {
          id: `bill_${era}_GB_1`,
          title: 'National Health Service (NHS) Free Universal Care Consolidation',
          description: 'Secures permanent treasury funding for free public hospitals, general practitioners, and medicines.',
          category: 'Healthcare',
          budgetCost: 550000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 24, 'Youth': 16, 'Shopkeepers': 6, 'Liberals': 10, 'Traditionalists': 4, 'Nationalists': 2 }
        },
        {
          id: `bill_${era}_GB_2`,
          title: 'Iron and Steel Nationalization Act 1950',
          description: 'Brings major steel mills and metallurgical foundries into public ownership under the Iron and Steel Corporation.',
          category: 'Economy',
          budgetCost: 420000,
          influenceMod: 24,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 22, 'Youth': 8, 'Traditionalists': -6, 'Shopkeepers': -12, 'Liberals': -8, 'Nationalists': 4 }
        },
        {
          id: `bill_${era}_GB_3`,
          title: 'Post-War Food & Commodity Rationing Phasing-Out Act',
          description: 'Lifts wartime rationing on petrol, soap, and foodstuffs, restoring free retail market supply.',
          category: 'Economy',
          budgetCost: 120000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 22, 'Traditionalists': 14, 'Workers': 10, 'Liberals': 14, 'Youth': 10, 'Nationalists': 8 }
        },
        {
          id: `bill_${era}_GB_4`,
          title: 'British Atomic Deterrent Project (High Explosive Research)',
          description: 'Funds independent British atomic bomb development and strategic V-bomber aviation platforms.',
          category: 'Security',
          budgetCost: 600000,
          influenceMod: 35,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 24, 'Traditionalists': 16, 'Workers': 4, 'Shopkeepers': 6, 'Liberals': -6, 'Youth': -8 }
        },
        {
          id: `bill_${era}_GB_5`,
          title: 'New Towns & Post-War Urban Rehousing Program',
          description: 'Constructs modern planned residential garden cities (Stevenage, Harlow, Crawley) to rebuild blitzed areas.',
          category: 'Infrastructure',
          budgetCost: 480000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 20, 'Youth': 18, 'Shopkeepers': 8, 'Liberals': 8, 'Nationalists': 4, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_GB_6`,
          title: 'Commonwealth Sterling Area & Imperial Preference Trade Pact',
          description: 'Strengthens preferential customs duties with dominions and colonies to stabilize the British pound sterling.',
          category: 'Economy',
          budgetCost: 160000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 18, 'Traditionalists': 16, 'Shopkeepers': 12, 'Liberals': 4, 'Workers': 4, 'Youth': 2 }
        }
      ];
    }

    if (countryId === 'FR') {
      return [
        {
          id: `bill_${era}_FR_1`,
          title: 'Schuman Declaration & European Coal and Steel Community Treaty',
          description: 'Pools French and West German coal and steel production under a supranational High Authority to ensure lasting peace.',
          category: 'Economy',
          budgetCost: 250000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 20, 'Youth': 16, 'Shopkeepers': 10, 'Workers': 10, 'Nationalists': -6, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_FR_2`,
          title: 'Monnet Modernization Plan for French Heavy Industry',
          description: 'Invests state credits in electricity, rail electrification (SNCF), and Renault nationalized automotive plants.',
          category: 'Infrastructure',
          budgetCost: 520000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 22, 'Youth': 12, 'Shopkeepers': 10, 'Liberals': 8, 'Nationalists': 8, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_FR_3`,
          title: 'Indochina Expeditionary Corps Defense Procurement Bill',
          description: 'Supplies armor, naval landing craft, and aviation to French Union armed forces defending against the Viet Minh.',
          category: 'Security',
          budgetCost: 600000,
          influenceMod: 34,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 22, 'Traditionalists': 16, 'Shopkeepers': 4, 'Workers': -8, 'Liberals': -6, 'Youth': -12 }
        },
        {
          id: `bill_${era}_FR_4`,
          title: 'Guaranteed Interoccupational Minimum Wage (SMIG) Enactment',
          description: 'Establishes a universal indexed minimum wage floor for all salaried industrial and agricultural workers.',
          category: 'Economy',
          budgetCost: 350000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 24, 'Youth': 14, 'Shopkeepers': -8, 'Liberals': 6, 'Nationalists': 4, 'Traditionalists': 2 }
        },
        {
          id: `bill_${era}_FR_5`,
          title: 'French Atomic Energy Commission (CEA) Expansion',
          description: 'Funds the development of French nuclear reactors at Saclay and Marcoule for scientific and defensive capability.',
          category: 'Education',
          budgetCost: 450000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 20, 'Youth': 14, 'Liberals': 10, 'Workers': 8, 'Shopkeepers': 6, 'Traditionalists': 6 }
        },
        {
          id: `bill_${era}_FR_6`,
          title: 'French Union Overseas Territories Development Fund',
          description: 'Finances port improvements, schools, and medical clinics in Algeria, French West Africa, and Madagascar.',
          category: 'Infrastructure',
          budgetCost: 380000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Traditionalists': 14, 'Liberals': 12, 'Nationalists': 10, 'Workers': 6, 'Youth': 8, 'Shopkeepers': 6 }
        }
      ];
    }

    if (countryId === 'DE') {
      return [
        {
          id: `bill_${era}_DE_1`,
          title: 'Social Market Economy (Soziale Marktwirtschaft) Foundation Charter',
          description: 'Enshrines free competition and private initiative coupled with strong social welfare security nets.',
          category: 'Economy',
          budgetCost: 300000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 22, 'Liberals': 18, 'Traditionalists': 14, 'Workers': 12, 'Nationalists': 8, 'Youth': 10 }
        },
        {
          id: `bill_${era}_DE_2`,
          title: 'Coal and Steel Co-determination (Montan-Mitbestimmung) Act',
          description: 'Grants trade unions equal representation on the supervisory boards of mining and steel corporations.',
          category: 'Freedoms',
          budgetCost: 150000,
          influenceMod: 24,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 24, 'Youth': 12, 'Liberals': 8, 'Shopkeepers': -6, 'Traditionalists': 4, 'Nationalists': 2 }
        },
        {
          id: `bill_${era}_DE_3`,
          title: 'Equalization of Burdens Act (Lastenausgleichsgesetz)',
          description: 'Levies a capital tax on undamaged property to compensate millions of German expellees and war refugees.',
          category: 'Economy',
          budgetCost: 550000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Traditionalists': 20, 'Workers': 18, 'Nationalists': 14, 'Youth': 10, 'Shopkeepers': -4, 'Liberals': 6 }
        },
        {
          id: `bill_${era}_DE_4`,
          title: 'Western Integration (Westbindung) & Schuman Plan Accession',
          description: 'Anchors the Federal Republic firmly with the Western democracies through the European Coal and Steel Community.',
          category: 'Economy',
          budgetCost: 220000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 20, 'Shopkeepers': 14, 'Youth': 14, 'Traditionalists': 12, 'Nationalists': -6, 'Workers': 8 }
        },
        {
          id: `bill_${era}_DE_5`,
          title: 'Federal Constitutional Court (Bundesverfassungsgericht) Establishment',
          description: 'Constitutes the supreme independent constitutional court in Karlsruhe to safeguard the Basic Law.',
          category: 'Freedoms',
          budgetCost: 80000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 22, 'Youth': 16, 'Shopkeepers': 10, 'Workers': 8, 'Traditionalists': 10, 'Nationalists': 4 }
        },
        {
          id: `bill_${era}_DE_6`,
          title: 'Federal Border Guard (Bundesgrenzschutz - BGS) Formation',
          description: 'Establishes a specialized federal paramilitary border force to secure the inner-German border.',
          category: 'Security',
          budgetCost: 360000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 20, 'Traditionalists': 16, 'Shopkeepers': 8, 'Liberals': 4, 'Workers': 4, 'Youth': -4 }
        }
      ];
    }

    if (countryId === 'DDR') {
      return [
        {
          id: `bill_${era}_DDR_1`,
          title: 'First Five-Year Plan of the German Democratic Republic',
          description: 'Targets a doubling of heavy industrial output in steel, chemistry, and machinery across East Germany.',
          category: 'Economy',
          budgetCost: 500000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 22, 'Youth': 14, 'Nationalists': 8, 'Traditionalists': 2, 'Shopkeepers': -12, 'Liberals': -12 }
        },
        {
          id: `bill_${era}_DDR_2`,
          title: 'VEB Enterprise Socialization & Key Industry Nationalization',
          description: 'Transforms privately owned factories into People\'s Enterprises (Volkseigener Betrieb).',
          category: 'Economy',
          budgetCost: 320000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 20, 'Youth': 10, 'Traditionalists': -4, 'Nationalists': 4, 'Shopkeepers': -18, 'Liberals': -14 }
        },
        {
          id: `bill_${era}_DDR_3`,
          title: 'Agricultural Production Cooperatives (LPG) Formation',
          description: 'Voluntary-to-obligatory pooling of peasant farmlands into socialist collective farming cooperatives.',
          category: 'Economy',
          budgetCost: 280000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 16, 'Youth': 10, 'Traditionalists': 6, 'Nationalists': 4, 'Shopkeepers': -10, 'Liberals': -8 }
        },
        {
          id: `bill_${era}_DDR_4`,
          title: 'Treaty of Zgorzelec Oder-Neisse Border Confirmation',
          description: 'Formally recognizes the peace border along the Oder and Neisse rivers with the People\'s Republic of Poland.',
          category: 'Security',
          budgetCost: 60000,
          influenceMod: 20,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 12, 'Youth': 10, 'Workers': 10, 'Nationalists': -10, 'Traditionalists': -6, 'Shopkeepers': 4 }
        },
        {
          id: `bill_${era}_DDR_5`,
          title: 'Free German Youth (FDJ) & Socialist Education Act',
          description: 'Unifies polytechnic secondary education and sports training under the Free German Youth movement.',
          category: 'Education',
          budgetCost: 190000,
          influenceMod: 24,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 22, 'Workers': 14, 'Nationalists': 8, 'Traditionalists': -4, 'Liberals': -12, 'Shopkeepers': 2 }
        },
        {
          id: `bill_${era}_DDR_6`,
          title: 'Barracked People\'s Police (Kasernierte Volkspolizei) Expansion',
          description: 'Expands the core armed divisions of the interior ministry as the precursor to a national army.',
          category: 'Security',
          budgetCost: 450000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 18, 'Workers': 12, 'Youth': 8, 'Traditionalists': 4, 'Liberals': -10, 'Shopkeepers': -4 }
        }
      ];
    }

    if (countryId === 'CS') {
      return [
        {
          id: `bill_${era}_CS_1`,
          title: 'Five-Year Heavy Industrialization & Metallurgy Plan',
          description: 'Directs Czechoslovak heavy engineering and Skoda industrial plants towards Comecon export production.',
          category: 'Economy',
          budgetCost: 480000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 22, 'Youth': 12, 'Nationalists': 8, 'Traditionalists': 2, 'Shopkeepers': -12, 'Liberals': -10 }
        },
        {
          id: `bill_${era}_CS_2`,
          title: 'Unified Agricultural Cooperatives (JZD) Collectivization Act',
          description: 'Reorganizes Czech and Slovak agrarian villages into collective agricultural units.',
          category: 'Economy',
          budgetCost: 300000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 16, 'Youth': 10, 'Traditionalists': 4, 'Nationalists': 4, 'Shopkeepers': -10, 'Liberals': -8 }
        },
        {
          id: `bill_${era}_CS_3`,
          title: 'National Security Corps (SNB) & People\'s Militias Modernization',
          description: 'Equips factory worker militia detachments with automatic firearms for public security defense.',
          category: 'Security',
          budgetCost: 380000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 18, 'Nationalists': 14, 'Youth': 8, 'Traditionalists': 4, 'Liberals': -12, 'Shopkeepers': -6 }
        },
        {
          id: `bill_${era}_CS_4`,
          title: 'Ostrava Heavy Metallurgy & Coal Mining Expansion Program',
          description: 'Constructs the New Metallurgical Works of Klement Gottwald in Nova Hut, Ostrava.',
          category: 'Infrastructure',
          budgetCost: 520000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 24, 'Youth': 14, 'Nationalists': 10, 'Traditionalists': 2, 'Shopkeepers': 4, 'Liberals': 2 }
        },
        {
          id: `bill_${era}_CS_5`,
          title: 'Socialist Unified Public School System Reform',
          description: 'Establishes free nationwide compulsory 9-year unified public schooling and technical vocational institutes.',
          category: 'Education',
          budgetCost: 240000,
          influenceMod: 25,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 20, 'Workers': 14, 'Liberals': 8, 'Shopkeepers': 6, 'Nationalists': 6, 'Traditionalists': -4 }
        },
        {
          id: `bill_${era}_CS_6`,
          title: 'Czechoslovak-Soviet Trade and Mutual Assistance Protocol',
          description: 'Integrates rail transport, grain imports, and uranium extraction protocols with Comecon partners.',
          category: 'Economy',
          budgetCost: 180000,
          influenceMod: 20,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 14, 'Nationalists': 8, 'Youth': 6, 'Traditionalists': 2, 'Shopkeepers': -6, 'Liberals': -10 }
        }
      ];
    }

    if (countryId === 'PL') {
      return [
        {
          id: `bill_${era}_PL_1`,
          title: 'Polish Six-Year Plan for Industrialization (Nowa Huta Complex)',
          description: 'Constructs the gigantic Lenin Steelworks and the model socialist city of Nowa Huta near Krakow.',
          category: 'Infrastructure',
          budgetCost: 600000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 24, 'Youth': 14, 'Nationalists': 10, 'Traditionalists': 2, 'Shopkeepers': -10, 'Liberals': -8 }
        },
        {
          id: `bill_${era}_PL_2`,
          title: 'Warsaw Reconstruction & Marszalkowska Dzielnica Mieszkaniowa',
          description: 'Funds monumental post-war rebuilding of the historic capital, Old Town, and central residential quarters.',
          category: 'Infrastructure',
          budgetCost: 450000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 20, 'Nationalists': 18, 'Youth': 16, 'Traditionalists': 12, 'Shopkeepers': 8, 'Liberals': 6 }
        },
        {
          id: `bill_${era}_PL_3`,
          title: 'State Agricultural Farms (PGR) & Cooperative Modernization',
          description: 'Mechanizes agriculture across the Recovered Western Territories with state-owned tractors and combine fleets.',
          category: 'Economy',
          budgetCost: 320000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 16, 'Youth': 10, 'Traditionalists': 6, 'Nationalists': 8, 'Shopkeepers': -6, 'Liberals': -6 }
        },
        {
          id: `bill_${era}_PL_4`,
          title: 'Zgorzelec Border Confirmation & Western Territories Integration',
          description: 'Formally ratifies the Oder-Neisse western frontier and settles Polish families in Silesia and Pomerania.',
          category: 'Security',
          budgetCost: 200000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 24, 'Traditionalists': 14, 'Workers': 12, 'Youth': 10, 'Liberals': 6, 'Shopkeepers': 6 }
        },
        {
          id: `bill_${era}_PL_5`,
          title: 'Port of Gdynia & Baltic Merchant Fleet Expansion',
          description: 'Rebuilds deepwater berths and shipyard cranes to expand Polish Ocean Lines international shipping.',
          category: 'Infrastructure',
          budgetCost: 360000,
          influenceMod: 24,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 18, 'Shopkeepers': 12, 'Nationalists': 12, 'Youth': 10, 'Liberals': 8, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_PL_6`,
          title: 'Mass Literacy Campaign & Worker Cultural House Charter',
          description: 'Eliminates rural adult illiteracy and opens community libraries and recreation centers across all voivodeships.',
          category: 'Education',
          budgetCost: 150000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 20, 'Workers': 16, 'Liberals': 10, 'Traditionalists': 6, 'Nationalists': 6, 'Shopkeepers': 4 }
        }
      ];
    }

    if (countryId === 'CN') {
      return [
        {
          id: `bill_${era}_CN_1`,
          title: 'Agrarian Reform Law of the People\'s Republic of China',
          description: 'Confiscates land from feudal landlords and distributes plots freely to hundreds of millions of poor peasants.',
          category: 'Economy',
          budgetCost: 350000,
          influenceMod: 38,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 26, 'Youth': 16, 'Traditionalists': 8, 'Nationalists': 12, 'Shopkeepers': -12, 'Liberals': -10 }
        },
        {
          id: `bill_${era}_CN_2`,
          title: 'Marriage Law of 1950 (Abolishing Feudal Arranged Marriages)',
          description: 'Guarantees free choice of partner, equal rights for women, monogamy, and the right to divorce.',
          category: 'Freedoms',
          budgetCost: 60000,
          influenceMod: 32,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 24, 'Liberals': 18, 'Workers': 14, 'Traditionalists': -12, 'Shopkeepers': 6, 'Nationalists': 4 }
        },
        {
          id: `bill_${era}_CN_3`,
          title: 'Resist America and Aid Korea Chinese People\'s Volunteer Army',
          description: 'Mobilizes volunteer infantry armies under General Peng Dehuai across the Yalu River.',
          category: 'Security',
          budgetCost: 650000,
          influenceMod: 40,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 26, 'Workers': 14, 'Traditionalists': 12, 'Youth': 10, 'Shopkeepers': 4, 'Liberals': -8 }
        },
        {
          id: `bill_${era}_CN_4`,
          title: 'Sino-Soviet Treaty of Friendship, Alliance and Mutual Assistance',
          description: 'Secures Soviet low-interest industrial loans, technical advisors, and defense guarantees.',
          category: 'Economy',
          budgetCost: 200000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 18, 'Youth': 12, 'Nationalists': 10, 'Liberals': -6, 'Traditionalists': 2, 'Shopkeepers': 4 }
        },
        {
          id: `bill_${era}_CN_5`,
          title: 'Campaign to Suppress Counterrevolutionaries & Restore Public Order',
          description: 'Eliminates banditry, opium syndicates, and covert sabotage rings in newly liberated provinces.',
          category: 'Security',
          budgetCost: 280000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 22, 'Traditionalists': 14, 'Workers': 12, 'Shopkeepers': 8, 'Youth': 6, 'Liberals': -12 }
        },
        {
          id: `bill_${era}_CN_6`,
          title: 'Unified People\'s Renminbi Currency & Price Stabilization',
          description: 'Halts hyperinflation through unified state grain stores, price controls, and state bank reserves.',
          category: 'Economy',
          budgetCost: 220000,
          influenceMod: 26,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 20, 'Workers': 18, 'Traditionalists': 12, 'Nationalists': 10, 'Youth': 8, 'Liberals': 6 }
        }
      ];
    }

    if (countryId === 'YU') {
      return [
        {
          id: `bill_${era}_YU_1`,
          title: 'Basic Law on Worker Self-Management of State Enterprises',
          description: 'Hands factory management councils directly to worker collectives, creating Yugoslavia\'s unique socialist path.',
          category: 'Freedoms',
          budgetCost: 300000,
          influenceMod: 34,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Workers': 26, 'Youth': 18, 'Liberals': 14, 'Shopkeepers': 8, 'Nationalists': 4, 'Traditionalists': 2 }
        },
        {
          id: `bill_${era}_YU_2`,
          title: 'Independent Non-Aligned Trade Agreements with Western Markets',
          description: 'Opens export avenues with Western Europe and the United States following the Tito-Stalin split.',
          category: 'Economy',
          budgetCost: 180000,
          influenceMod: 28,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Shopkeepers': 18, 'Liberals': 16, 'Workers': 12, 'Youth': 12, 'Nationalists': 8, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_YU_3`,
          title: 'Brotherhood and Unity Highway (Autoput) National Project',
          description: 'Constructs the grand highway linking Ljubljana, Zagreb, Belgrade, and Skopje with volunteer youth brigades.',
          category: 'Infrastructure',
          budgetCost: 450000,
          influenceMod: 30,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Youth': 22, 'Workers': 18, 'Nationalists': 14, 'Shopkeepers': 10, 'Traditionalists': 6, 'Liberals': 6 }
        },
        {
          id: `bill_${era}_YU_4`,
          title: 'Decentralization of Federal Ministries to Republic Governments',
          description: 'Deuteronomizes economic planning to the authorities in Serbia, Croatia, Slovenia, Bosnia, Montenegro, and Macedonia.',
          category: 'Freedoms',
          budgetCost: 120000,
          influenceMod: 22,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Liberals': 16, 'Youth': 12, 'Workers': 8, 'Shopkeepers': 8, 'Nationalists': 10, 'Traditionalists': 4 }
        },
        {
          id: `bill_${era}_YU_5`,
          title: 'Territorial Partisan Reserve Defense Modernization',
          description: 'Maintains independent territorial defense corps to deter foreign military incursions from any bloc.',
          category: 'Security',
          budgetCost: 480000,
          influenceMod: 36,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Nationalists': 22, 'Workers': 14, 'Traditionalists': 12, 'Youth': 10, 'Liberals': 4, 'Shopkeepers': 4 }
        },
        {
          id: `bill_${era}_YU_6`,
          title: 'Voluntary Cooperative Farming Reform & Peasant Property Protection',
          description: 'Haults forced agricultural collectivization and protects private smallholder peasant ownership.',
          category: 'Economy',
          budgetCost: 160000,
          influenceMod: 24,
          status: 'Pending',
          yesVotesPercentage: 0,
          voterImpacts: { 'Traditionalists': 20, 'Shopkeepers': 16, 'Workers': 10, 'Liberals': 10, 'Youth': 6, 'Nationalists': 4 }
        }
      ];
    }

    // Default fallback 6 bills for 1950
    return [
      {
        id: `bill_${era}_1`,
        title: 'Marshall Plan Reconstruction Aid Bill',
        description: 'Allocates American financial aid to modernize ports, railways, and agricultural mechanization.',
        category: 'Economy',
        budgetCost: 200000,
        influenceMod: 25,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Workers': 10, 'Shopkeepers': 8, 'Liberals': 6, 'Nationalists': -2, 'Traditionalists': 4, 'Youth': 8 }
      },
      {
        id: `bill_${era}_2`,
        title: 'NATO Collective Defense Treaty Ratification',
        description: 'Binds national defense forces to the North Atlantic Treaty Organization alliance against Soviet expansion.',
        category: 'Security',
        budgetCost: 350000,
        influenceMod: 30,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Nationalists': 15, 'Traditionalists': 10, 'Liberals': 8, 'Workers': -5, 'Youth': -4, 'Shopkeepers': 4 }
      },
      {
        id: `bill_${era}_3`,
        title: 'Universal Electoral Roll Reform Act',
        description: 'Guarantees secret ballots and open counting in parliamentary general elections.',
        category: 'Freedoms',
        budgetCost: 50000,
        influenceMod: 20,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Liberals': 12, 'Youth': 10, 'Workers': 6, 'Shopkeepers': 6, 'Nationalists': 2, 'Traditionalists': 4 }
      },
      {
        id: `bill_${era}_4`,
        title: 'Industrial Heavy Manufacturing Subsidies',
        description: 'Provides long-term government credits for metallurgy, steel rolling, and power generation.',
        category: 'Infrastructure',
        budgetCost: 400000,
        influenceMod: 24,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Workers': 16, 'Shopkeepers': 8, 'Nationalists': 10, 'Youth': 6, 'Liberals': 4, 'Traditionalists': 2 }
      },
      {
        id: `bill_${era}_5`,
        title: 'National Public Health and Sanitation Campaign',
        description: 'Vaccinates school children and modernizes provincial community hospitals.',
        category: 'Healthcare',
        budgetCost: 280000,
        influenceMod: 22,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Workers': 14, 'Youth': 14, 'Shopkeepers': 8, 'Liberals': 8, 'Traditionalists': 6, 'Nationalists': 2 }
      },
      {
        id: `bill_${era}_6`,
        title: 'Rural Education & Polytechnic Institute Charter',
        description: 'Expands technical vocational schools and primary academies across all districts.',
        category: 'Education',
        budgetCost: 220000,
        influenceMod: 22,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Youth': 18, 'Liberals': 12, 'Workers': 10, 'Shopkeepers': 6, 'Nationalists': 4, 'Traditionalists': 2 }
      }
    ];
  }

  if (era === '1936') {
    return [
      {
        id: `bill_${era}_1`,
        title: 'Emergency National Industrial Rearmament Act',
        description: 'Mobilizes heavy metallurgical and chemical industries to modernize mechanized army divisions.',
        category: 'Security',
        budgetCost: 500000,
        influenceMod: 35,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Nationalists': 20, 'Workers': 8, 'Traditionalists': 10, 'Liberals': -12, 'Youth': 6, 'Shopkeepers': -4 }
      },
      {
        id: `bill_${era}_2`,
        title: 'State Monopoly & Five-Year Plan Investment',
        description: 'Establishes state-owned textile and mining enterprises to achieve autarkic national self-sufficiency.',
        category: 'Economy',
        budgetCost: 400000,
        influenceMod: 25,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Workers': 14, 'Traditionalists': 6, 'Shopkeepers': -10, 'Liberals': -8, 'Youth': 8, 'Nationalists': 12 }
      },
      {
        id: `bill_${era}_3`,
        title: 'Public Literacy & Village Institutes Charter',
        description: 'Establishes secular educator academies and primary schools across all rural districts.',
        category: 'Education',
        budgetCost: 250000,
        influenceMod: 22,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Youth': 18, 'Liberals': 14, 'Workers': 8, 'Traditionalists': -12, 'Nationalists': 6, 'Shopkeepers': 2 }
      }
    ];
  }

  if (era === '1920') {
    return [
      {
        id: `bill_${era}_1`,
        title: 'National Pact (Misak-ı Millî) Territorial Integrity Act',
        description: 'Affirms absolute national independence and unconditional defense of national borders.',
        category: 'Security',
        budgetCost: 300000,
        influenceMod: 40,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Nationalists': 25, 'Traditionalists': 15, 'Workers': 8, 'Youth': 12, 'Liberals': 4, 'Shopkeepers': 8 }
      },
      {
        id: `bill_${era}_2`,
        title: 'War Requisition (Tekâlif-i Milliye) Orders',
        description: 'Requisitions grain, textiles, and transport draft animals to supply the frontline armies.',
        category: 'Economy',
        budgetCost: 150000,
        influenceMod: 20,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Nationalists': 12, 'Workers': -4, 'Shopkeepers': -15, 'Traditionalists': 4, 'Youth': 6, 'Liberals': -6 }
      },
      {
        id: `bill_${era}_3`,
        title: 'Establishment of the Sovereign Grand National Assembly',
        description: 'Declares that sovereignty unconditionally belongs to the nation without imperial veto.',
        category: 'Freedoms',
        budgetCost: 80000,
        influenceMod: 30,
        status: 'Pending',
        yesVotesPercentage: 0,
        voterImpacts: { 'Liberals': 18, 'Youth': 16, 'Nationalists': 14, 'Workers': 10, 'Traditionalists': -8, 'Shopkeepers': 6 }
      }
    ];
  }

  // 1914
  return [
    {
      id: `bill_${era}_1`,
      title: 'General Imperial Mobilization Order (Seferberlik)',
      description: 'Orders all reserve conscription age classes to report immediately to designated military depots.',
      category: 'Security',
      budgetCost: 450000,
      influenceMod: 35,
      status: 'Pending',
      yesVotesPercentage: 0,
      voterImpacts: { 'Nationalists': 22, 'Traditionalists': 14, 'Workers': -8, 'Youth': -10, 'Liberals': -12, 'Shopkeepers': -6 }
    },
    {
      id: `bill_${era}_2`,
      title: 'Abolition of the Capitulations & Economic Protectionism',
      description: 'Unilaterally repeals extraterritorial legal privileges and tax exemptions granted to foreign powers.',
      category: 'Economy',
      budgetCost: 180000,
      influenceMod: 28,
      status: 'Pending',
      yesVotesPercentage: 0,
      voterImpacts: { 'Shopkeepers': 18, 'Nationalists': 18, 'Traditionalists': 10, 'Liberals': 4, 'Workers': 4, 'Youth': 8 }
    },
    {
      id: `bill_${era}_3`,
      title: 'Naval Dreadnought Fleet Emergency Fund',
      description: 'Public donation drives to finance the acquisition of modern dreadnought battleships for the imperial fleet.',
      category: 'Security',
      budgetCost: 320000,
      influenceMod: 22,
      status: 'Pending',
      yesVotesPercentage: 0,
      voterImpacts: { 'Nationalists': 16, 'Shopkeepers': 8, 'Traditionalists': 8, 'Youth': 6, 'Workers': 2, 'Liberals': -2 }
    }
  ];
};

// ==========================================
// SCENARIO 1950 COUNTRIES (Cold War Dawn)
// ==========================================
const COUNTRIES_1950: Country[] = [
  {
    id: 'TR',
    name: 'Republic of Turkey (1950)',
    description: 'The historic dawn of Turkish multiparty democracy. The rising Democrat Party challenges the 27-year rule of the Republican People\'s Party.',
    flag: '🇹🇷',
    seats: 487,
    parliamentName: 'Grand National Assembly of Turkey (TBMM 1950)',
    system: 'Parliamentary System',
    population: '21 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'DP', name: 'Demokrat Parti (DP)', leader: 'Celal Bayar & Adnan Menderes', ideology: 'Liberal', symbol: 'Sun', color: '#2563eb', baseSupport: 52 },
      { id: 'CHP', name: 'Cumhuriyet Halk Partisi (CHP)', leader: 'İsmet İnönü', ideology: 'Social Democrat', symbol: 'Flame', color: '#dc2626', baseSupport: 40 },
      { id: 'MP', name: 'Millet Partisi (MP)', leader: 'Hikmet Bayur & Mareşal Çakmak', ideology: 'Conservative', symbol: 'Shield', color: '#16a34a', baseSupport: 8 },
    ],
    regions: getTurkeyRegions(),
    bills: createHistoricalBills('1950', 'TR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'SU',
    name: 'Union of Soviet Socialist Republics (1950)',
    description: 'The Eastern superpower at the height of the post-WWII reconstruction, leading the socialist world through Comecon and Warsaw alliances.',
    flag: '🚩',
    seats: 780,
    parliamentName: 'Supreme Soviet of the USSR',
    system: 'Single-Party Socialist Republic',
    population: '180 Million',
    primaryColor: '#b91c1c',
    rivals: [
      { id: 'CPSU', name: 'Communist Party of the Soviet Union (CPSU)', leader: 'Joseph Stalin', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 88 },
      { id: 'SOV_NON', name: 'Bloc of Communists and Non-Partisans', leader: 'Nikolai Shvernik', ideology: 'Socialist', symbol: 'Users', color: '#991b1b', baseSupport: 12 },
    ],
    regions: generateHistoricalRegions('SU', [
      { name: 'Russian SFSR (Moscow & Leningrad)', seats: 350, winner: 'CPSU' },
      { name: 'Ukrainian SSR (Kyiv & Kharkiv)', seats: 150, winner: 'CPSU' },
      { name: 'Byelorussian SSR (Minsk)', seats: 60, winner: 'CPSU' },
      { name: 'Kazakh SSR (Alma-Ata)', seats: 50, winner: 'CPSU' },
      { name: 'Uzbek SSR (Tashkent)', seats: 40, winner: 'CPSU' },
      { name: 'Transcaucasian SSRs (Georgia, Armenia, Azerbaijan)', seats: 45, winner: 'CPSU' },
      { name: 'Baltic SSRs (Estonia, Latvia, Lithuania)', seats: 35, winner: 'CPSU' },
      { name: 'Central Asian SSRs (Turkmenistan, Tajikistan, Kyrgyzstan)', seats: 30, winner: 'CPSU' },
      { name: 'Moldavian SSR (Chisinau)', seats: 20, winner: 'CPSU' }
    ], [
      { id: 'CPSU', name: 'CPSU', leader: 'Joseph Stalin', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 88 },
      { id: 'SOV_NON', name: 'Non-Partisans', leader: 'Nikolai Shvernik', ideology: 'Socialist', symbol: 'Users', color: '#991b1b', baseSupport: 12 }
    ]),
    bills: createHistoricalBills('1950', 'SU'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'DE',
    name: 'Federal Republic of Germany (West Germany 1950)',
    description: 'Post-war West Germany under Chancellor Konrad Adenauer, establishing a social market economy and anchoring with Western democracies.',
    flag: '🇩🇪',
    seats: 402,
    parliamentName: 'Deutscher Bundestag (Bonn 1950)',
    system: 'Coalition Government',
    population: '50 Million',
    primaryColor: '#334155',
    rivals: [
      { id: 'CDU', name: 'Christian Democratic Union (CDU/CSU)', leader: 'Konrad Adenauer', ideology: 'Conservative', symbol: 'Building', color: '#1f2937', baseSupport: 36 },
      { id: 'SPD', name: 'Social Democratic Party of Germany (SPD)', leader: 'Kurt Schumacher', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 33 },
      { id: 'FDP', name: 'Free Democratic Party (FDP)', leader: 'Theodor Heuss', ideology: 'Liberal', symbol: 'Compass', color: '#facc15', baseSupport: 15 },
      { id: 'KPD', name: 'Communist Party of Germany (KPD)', leader: 'Max Reimann', ideology: 'Socialist', symbol: 'Flame', color: '#991b1b', baseSupport: 8 },
      { id: 'DP_GER', name: 'German Party (DP)', leader: 'Heinrich Hellwege', ideology: 'Nationalist', symbol: 'Shield', color: '#4b5563', baseSupport: 8 },
    ],
    regions: generateHistoricalRegions('DE', [
      { name: 'Nordrhein-Westfalen (Köln & Ruhr)', seats: 110, winner: 'CDU' },
      { name: 'Bayern (Munich & Nuremberg)', seats: 78, winner: 'CDU' },
      { name: 'Baden-Württemberg (Stuttgart)', seats: 65, winner: 'CDU' },
      { name: 'Niedersachsen (Hannover)', seats: 52, winner: 'SPD' },
      { name: 'Hessen (Frankfurt)', seats: 38, winner: 'SPD' },
      { name: 'Rheinland-Pfalz (Mainz)', seats: 28, winner: 'CDU' },
      { name: 'Schleswig-Holstein (Kiel)', seats: 20, winner: 'CDU' },
      { name: 'Hamburg & Bremen', seats: 11, winner: 'SPD' }
    ], [
      { id: 'CDU', name: 'CDU/CSU', leader: 'Konrad Adenauer', ideology: 'Conservative', symbol: 'Building', color: '#1f2937', baseSupport: 36 },
      { id: 'SPD', name: 'SPD', leader: 'Kurt Schumacher', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 33 },
      { id: 'FDP', name: 'FDP', leader: 'Theodor Heuss', ideology: 'Liberal', symbol: 'Compass', color: '#facc15', baseSupport: 15 },
      { id: 'KPD', name: 'KPD', leader: 'Max Reimann', ideology: 'Socialist', symbol: 'Flame', color: '#991b1b', baseSupport: 8 },
      { id: 'DP_GER', name: 'DP', leader: 'Heinrich Hellwege', ideology: 'Nationalist', symbol: 'Shield', color: '#4b5563', baseSupport: 8 }
    ]),
    bills: createHistoricalBills('1950', 'DE'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'DDR',
    name: 'German Democratic Republic (East Germany 1950)',
    description: 'Founded in the Soviet occupation zone under the leadership of the Socialist Unity Party (SED), forging a socialist planned economy.',
    flag: '🇩🇪',
    seats: 400,
    parliamentName: 'Volkskammer (People\'s Chamber)',
    system: 'Socialist Republic / National Front',
    population: '18 Million',
    primaryColor: '#991b1b',
    rivals: [
      { id: 'SED', name: 'Socialist Unity Party of Germany (SED)', leader: 'Wilhelm Pieck & Walter Ulbricht', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 68 },
      { id: 'CDU_EAST', name: 'Christian Democratic Union (East)', leader: 'Otto Nuschke', ideology: 'Conservative', symbol: 'Building', color: '#1e3a8a', baseSupport: 16 },
      { id: 'LDPD', name: 'Liberal Democratic Party (LDPD)', leader: 'Hans Loch', ideology: 'Liberal', symbol: 'Compass', color: '#facc15', baseSupport: 16 },
    ],
    regions: generateHistoricalRegions('DDR', [
      { name: 'East Berlin (Capital)', seats: 66, winner: 'SED' },
      { name: 'Saxony (Leipzig & Dresden)', seats: 110, winner: 'SED' },
      { name: 'Thuringia (Erfurt & Weimar)', seats: 68, winner: 'SED' },
      { name: 'Saxony-Anhalt (Magdeburg & Halle)', seats: 72, winner: 'SED' },
      { name: 'Brandenburg (Potsdam & Cottbus)', seats: 52, winner: 'SED' },
      { name: 'Mecklenburg (Rostock & Schwerin)', seats: 32, winner: 'SED' }
    ], [
      { id: 'SED', name: 'SED', leader: 'Wilhelm Pieck', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 68 },
      { id: 'CDU_EAST', name: 'CDU East', leader: 'Otto Nuschke', ideology: 'Conservative', symbol: 'Building', color: '#1e3a8a', baseSupport: 16 },
      { id: 'LDPD', name: 'LDPD', leader: 'Hans Loch', ideology: 'Liberal', symbol: 'Compass', color: '#facc15', baseSupport: 16 },
    ]),
    bills: createHistoricalBills('1950', 'DDR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'CS',
    name: 'Czechoslovak Republic (1950)',
    description: 'Following the 1948 Victorious February, the Communist Party transforms Czechoslovakia into an industrialized socialist republic.',
    flag: '🇨🇿',
    seats: 300,
    parliamentName: 'National Assembly of Czechoslovakia (Národní shromáždění)',
    system: 'People\'s Democracy / National Front',
    population: '12.5 Million',
    primaryColor: '#c2410c',
    rivals: [
      { id: 'KSC', name: 'Communist Party of Czechoslovakia (KSČ)', leader: 'Klement Gottwald & Antonín Zápotocký', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 76 },
      { id: 'CSS', name: 'Czechoslovak Socialist Party (ČSS)', leader: 'Alois Neuman', ideology: 'Social Democrat', symbol: 'Users', color: '#ea580c', baseSupport: 14 },
      { id: 'CSL', name: 'Czechoslovak People\'s Party (ČSL)', leader: 'Josef Plojhar', ideology: 'Social Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 10 },
    ],
    regions: generateHistoricalRegions('CS', [
      { name: 'Prague & Central Bohemia', seats: 80, winner: 'KSC' },
      { name: 'Moravia & Silesia (Brno & Ostrava)', seats: 75, winner: 'KSC' },
      { name: 'Western & Northern Bohemia (Plzeň & Ústí)', seats: 55, winner: 'KSC' },
      { name: 'Eastern Bohemia (Hradec Králové)', seats: 30, winner: 'KSC' },
      { name: 'Western Slovakia (Bratislava & Trnava)', seats: 35, winner: 'KSC' },
      { name: 'Central & Eastern Slovakia (Banská Bystrica & Košice)', seats: 25, winner: 'KSC' }
    ], [
      { id: 'KSC', name: 'KSČ', leader: 'Klement Gottwald', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 76 },
      { id: 'CSS', name: 'ČSS', leader: 'Alois Neuman', ideology: 'Social Democrat', symbol: 'Users', color: '#ea580c', baseSupport: 14 },
      { id: 'CSL', name: 'ČSL', leader: 'Josef Plojhar', ideology: 'Social Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 10 }
    ]),
    bills: createHistoricalBills('1950', 'CS'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'PL',
    name: 'Polish People\'s Republic (1950)',
    description: 'Rebuilding the country from war ruins under the Six-Year Plan, led by the Polish United Workers\' Party (PZPR).',
    flag: '🇵🇱',
    seats: 425,
    parliamentName: 'Sejm of the Polish People\'s Republic',
    system: 'People\'s Republic / Front of National Unity',
    population: '25 Million',
    primaryColor: '#be123c',
    rivals: [
      { id: 'PZPR', name: 'Polish United Workers\' Party (PZPR)', leader: 'Bolesław Bierut', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 78 },
      { id: 'ZSL', name: 'United People\'s Party (ZSL)', leader: 'Władysław Kowalski', ideology: 'Social Democrat', symbol: 'Users', color: '#16a34a', baseSupport: 14 },
      { id: 'SD_PL', name: 'Democratic Party (SD)', leader: 'Wacław Barcikowski', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 8 },
    ],
    regions: generateHistoricalRegions('PL', [
      { name: 'Warsaw Capital Region & Masovia', seats: 85, winner: 'PZPR' },
      { name: 'Silesia & Katowice Industrial Basin', seats: 95, winner: 'PZPR' },
      { name: 'Lesser Poland (Kraków)', seats: 65, winner: 'PZPR' },
      { name: 'Greater Poland (Poznań)', seats: 55, winner: 'PZPR' },
      { name: 'Pomerania & Gdańsk Maritime', seats: 50, winner: 'PZPR' },
      { name: 'Lower Silesia (Wrocław)', seats: 45, winner: 'PZPR' },
      { name: 'Podlaskie & Lublin', seats: 30, winner: 'PZPR' }
    ], [
      { id: 'PZPR', name: 'PZPR', leader: 'Bolesław Bierut', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 78 },
      { id: 'ZSL', name: 'ZSL', leader: 'Władysław Kowalski', ideology: 'Social Democrat', symbol: 'Users', color: '#16a34a', baseSupport: 14 },
      { id: 'SD_PL', name: 'SD', leader: 'Wacław Barcikowski', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 8 }
    ]),
    bills: createHistoricalBills('1950', 'PL'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'CN',
    name: 'People\'s Republic of China (1950)',
    description: 'Proclaimed by Chairman Mao Zedong at Tiananmen Square in October 1949, consolidating agrarian reform and national reconstruction.',
    flag: '🇨🇳',
    seats: 600,
    parliamentName: 'Chinese People\'s Political Consultative Conference',
    system: 'People\'s Democratic Dictatorship',
    population: '550 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'CCP', name: 'Communist Party of China (CCP)', leader: 'Mao Zedong & Zhou Enlai', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 85 },
      { id: 'CDL', name: 'China Democratic League', leader: 'Zhang Lan', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 10 },
      { id: 'RCCK', name: 'Revolutionary Committee of the Kuomintang', leader: 'Li Jishen', ideology: 'Nationalist', symbol: 'Shield', color: '#16a34a', baseSupport: 5 },
    ],
    regions: generateHistoricalRegions('CN', [
      { name: 'Northern China (Beijing & Tianjin & Hebei)', seats: 120, winner: 'CCP' },
      { name: 'Eastern China (Shanghai, Jiangsu & Zhejiang)', seats: 130, winner: 'CCP' },
      { name: 'Southern China (Guangdong & Guangxi)', seats: 90, winner: 'CCP' },
      { name: 'Central China (Hubei & Hunan & Henan)', seats: 100, winner: 'CCP' },
      { name: 'Southwestern China (Sichuan & Yunnan)', seats: 80, winner: 'CCP' },
      { name: 'Northeastern China (Manchuria & Harbin)', seats: 50, winner: 'CCP' },
      { name: 'Northwestern China (Shaanxi & Gansu)', seats: 30, winner: 'CCP' }
    ], [
      { id: 'CCP', name: 'CCP', leader: 'Mao Zedong', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 85 },
      { id: 'CDL', name: 'CDL', leader: 'Zhang Lan', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 10 },
      { id: 'RCCK', name: 'RCCK', leader: 'Li Jishen', ideology: 'Nationalist', symbol: 'Shield', color: '#16a34a', baseSupport: 5 }
    ]),
    bills: createHistoricalBills('1950', 'CN'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'US',
    name: 'United States of America (1950)',
    description: 'Leading the Western Bloc through the Marshall Plan and Korean War under President Harry S. Truman.',
    flag: '🇺🇸',
    seats: 538,
    parliamentName: '81st United States Congress',
    system: 'Presidential System',
    population: '152 Million',
    primaryColor: '#1d4ed8',
    rivals: [
      { id: 'DEM_US', name: 'Democratic Party (Fair Deal)', leader: 'Harry S. Truman', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 49 },
      { id: 'REP', name: 'Republican Party', leader: 'Robert A. Taft / Thomas Dewey', ideology: 'Conservative', symbol: 'ShieldCheck', color: '#dc2626', baseSupport: 45 },
      { id: 'DIXIE', name: 'States\' Rights Democratic (Dixiecrats)', leader: 'Strom Thurmond', ideology: 'Traditionalist', symbol: 'Landmark', color: '#ca8a04', baseSupport: 6 },
    ],
    regions: generateHistoricalRegions('US', [
      { name: 'Northeast (New York, Pennsylvania & New England)', seats: 125, winner: 'DEM_US' },
      { name: 'Midwest (Illinois, Ohio & Michigan)', seats: 130, winner: 'REP' },
      { name: 'Deep South (Alabama, Georgia, Mississippi & Carolinas)', seats: 110, winner: 'DIXIE' },
      { name: 'West Coast (California, Oregon & Washington)', seats: 95, winner: 'DEM_US' },
      { name: 'Great Plains & Rocky Mountains', seats: 78, winner: 'REP' }
    ], [
      { id: 'DEM_US', name: 'Democratic Party', leader: 'Harry S. Truman', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 49 },
      { id: 'REP', name: 'Republican Party', leader: 'Thomas Dewey', ideology: 'Conservative', symbol: 'ShieldCheck', color: '#dc2626', baseSupport: 45 },
      { id: 'DIXIE', name: 'Dixiecrats', leader: 'Strom Thurmond', ideology: 'Traditionalist', symbol: 'Landmark', color: '#ca8a04', baseSupport: 6 }
    ]),
    bills: createHistoricalBills('1950', 'US'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GB',
    name: 'United Kingdom (1950)',
    description: 'Clement Attlee\'s Labour administration establishing the National Health Service (NHS) facing Winston Churchill\'s resilient Conservatives.',
    flag: '🇬🇧',
    seats: 625,
    parliamentName: 'House of Commons (Westminster)',
    system: 'Parliamentary System',
    population: '50 Million',
    primaryColor: '#1e3a8a',
    rivals: [
      { id: 'LAB', name: 'Labour Party', leader: 'Clement Attlee', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 46 },
      { id: 'CON', name: 'Conservative Party', leader: 'Winston Churchill', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 44 },
      { id: 'LD', name: 'Liberal Party', leader: 'Clement Davies', ideology: 'Liberal', symbol: 'Compass', color: '#eab308', baseSupport: 8 },
      { id: 'COMM_GB', name: 'Communist Party of Great Britain', leader: 'Harry Pollitt', ideology: 'Socialist', symbol: 'Flame', color: '#991b1b', baseSupport: 2 },
    ],
    regions: generateHistoricalRegions('GB', [
      { name: 'London & Home Counties', seats: 110, winner: 'CON' },
      { name: 'North West (Manchester & Liverpool)', seats: 85, winner: 'LAB' },
      { name: 'Yorkshire and The Humber', seats: 62, winner: 'LAB' },
      { name: 'Scotland (Glasgow & Edinburgh)', seats: 71, winner: 'LAB' },
      { name: 'West Midlands (Birmingham)', seats: 58, winner: 'CON' },
      { name: 'South West & Bristol', seats: 52, winner: 'CON' },
      { name: 'Wales (Cardiff & Industrial Valleys)', seats: 36, winner: 'LAB' },
      { name: 'East Midlands & Eastern', seats: 75, winner: 'CON' },
      { name: 'North East (Newcastle & Durham)', seats: 36, winner: 'LAB' },
      { name: 'Northern Ireland (Belfast & Ulster)', seats: 12, winner: 'CON' },
      { name: 'British Malaya & Singapore (Kuala Lumpur & Singapore)', seats: 18, winner: 'CON' },
      { name: 'British Kenya & East Africa (Nairobi & Mau Mau Zone)', seats: 15, winner: 'CON' },
      { name: 'British West Africa (Nigeria & Gold Coast)', seats: 20, winner: 'LAB' },
      { name: 'British Suez Canal Military Zone & Cyprus', seats: 14, winner: 'CON' },
      { name: 'British Empire Crown Dependencies & Overseas', seats: 28, winner: 'CON' }
    ], [
      { id: 'LAB', name: 'Labour Party', leader: 'Clement Attlee', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 46 },
      { id: 'CON', name: 'Conservative Party', leader: 'Winston Churchill', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 44 },
      { id: 'LD', name: 'Liberal Party', leader: 'Clement Davies', ideology: 'Liberal', symbol: 'Compass', color: '#eab308', baseSupport: 8 },
      { id: 'COMM_GB', name: 'Communist Party', leader: 'Harry Pollitt', ideology: 'Socialist', symbol: 'Flame', color: '#991b1b', baseSupport: 2 }
    ]),
    bills: createHistoricalBills('1950', 'GB'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'FR',
    name: 'French Fourth Republic (1950)',
    description: 'Post-war French coalition politics navigating colonial crises and the Schuman Plan for European coal and steel unity.',
    flag: '🇫🇷',
    seats: 627,
    parliamentName: 'National Assembly (Fourth Republic)',
    system: 'Coalition Government',
    population: '42 Million',
    primaryColor: '#2563eb',
    rivals: [
      { id: 'PCF', name: 'Parti Communiste Français (PCF)', leader: 'Maurice Thorez', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 28 },
      { id: 'RPF', name: 'Rassemblement du Peuple Français (RPF)', leader: 'Charles de Gaulle', ideology: 'Nationalist', symbol: 'Shield', color: '#1e3a8a', baseSupport: 25 },
      { id: 'MRP', name: 'Mouvement Républicain Populaire (MRP)', leader: 'Robert Schuman', ideology: 'Conservative', symbol: 'Building', color: '#0284c7', baseSupport: 22 },
      { id: 'SFIO', name: 'Section Française de l\'Internationale Ouvrière (SFIO)', leader: 'Guy Mollet', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 15 },
      { id: 'RAD', name: 'Parti Radical-Socialiste (RAD)', leader: 'Henri Queuille', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 6 },
      { id: 'CNIP', name: 'Centre National des Indépendants et Paysans (CNIP)', leader: 'Antoine Pinay', ideology: 'Conservative', symbol: 'Building', color: '#15803d', baseSupport: 4 }
    ],
    regions: generateHistoricalRegions('FR', [
      { name: 'Île-de-France (Paris & Seine)', seats: 95, winner: 'RPF' },
      { name: 'Hauts-de-France (Lille & Nord)', seats: 58, winner: 'PCF' },
      { name: 'Auvergne-Rhône-Alpes (Lyon)', seats: 65, winner: 'MRP' },
      { name: 'Grand Est (Strasbourg & Lorraine)', seats: 50, winner: 'MRP' },
      { name: 'Nouvelle-Aquitaine (Bordeaux)', seats: 52, winner: 'RAD' },
      { name: 'Occitanie (Toulouse & Languedoc)', seats: 48, winner: 'SFIO' },
      { name: 'Provence-Alpes-Côte d\'Azur (Marseille)', seats: 48, winner: 'PCF' },
      { name: 'Bretagne & Pays de la Loire (Rennes)', seats: 55, winner: 'MRP' },
      { name: 'Normandie (Rouen & Caen)', seats: 36, winner: 'CNIP' },
      { name: 'Bourgogne-Franche-Comté (Dijon)', seats: 35, winner: 'RAD' },
      { name: 'Algérie française (Algiers, Oran & Constantine)', seats: 45, winner: 'RPF' },
      { name: 'Indochine française (Saigon, Hanoi & Tonkin)', seats: 35, winner: 'RPF' },
      { name: 'Afrique Occidentale Française (Dakar, Senegal & Côte d\'Ivoire)', seats: 25, winner: 'SFIO' },
      { name: 'Afrique Équatoriale Française & Madagascar (Brazzaville & Antananarivo)', seats: 20, winner: 'SFIO' },
      { name: 'Protectorats du Maroc et de Tunisie (Rabat & Tunis)', seats: 22, winner: 'MRP' },
      { name: 'Territoires d\'Outre-Mer (DOM-TOM & French Union)', seats: 18, winner: 'SFIO' }
    ], [
      { id: 'PCF', name: 'PCF', leader: 'Maurice Thorez', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 28 },
      { id: 'RPF', name: 'RPF', leader: 'Charles de Gaulle', ideology: 'Nationalist', symbol: 'Shield', color: '#1e3a8a', baseSupport: 25 },
      { id: 'MRP', name: 'MRP', leader: 'Robert Schuman', ideology: 'Conservative', symbol: 'Building', color: '#0284c7', baseSupport: 22 },
      { id: 'SFIO', name: 'SFIO', leader: 'Guy Mollet', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 15 },
      { id: 'RAD', name: 'Radicaux', leader: 'Henri Queuille', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 6 },
      { id: 'CNIP', name: 'CNIP', leader: 'Antoine Pinay', ideology: 'Conservative', symbol: 'Building', color: '#15803d', baseSupport: 4 }
    ]),
    bills: createHistoricalBills('1950', 'FR'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IT',
    name: 'Italian Republic (1950)',
    description: 'Post-war reconstruction under Alcide De Gasperi\'s Christian Democracy, confronting powerful Communist and Socialist opposition.',
    flag: '🇮🇹',
    seats: 574,
    parliamentName: 'Camera dei Deputati (Rome 1950)',
    system: 'Parliamentary Republic',
    population: '47 Million',
    primaryColor: '#15803d',
    rivals: [
      { id: 'DC', name: 'Democrazia Cristiana (DC)', leader: 'Alcide De Gasperi', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 48 },
      { id: 'PCI', name: 'Partito Comunista Italiano (PCI)', leader: 'Palmiro Togliatti', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 31 },
      { id: 'PSI', name: 'Partito Socialista Italiano (PSI)', leader: 'Pietro Nenni', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 13 },
      { id: 'MSI', name: 'Movimento Sociale Italiano (MSI)', leader: 'Giorgio Almirante', ideology: 'Nationalist', symbol: 'Shield', color: '#1f2937', baseSupport: 5 },
      { id: 'PLI', name: 'Partito Liberale Italiano (PLI)', leader: 'Luigi Einaudi', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 3 },
    ],
    regions: generateHistoricalRegions('IT', [
      { name: 'Lombardy (Milan)', seats: 85, winner: 'DC' },
      { name: 'Lazio (Rome)', seats: 65, winner: 'DC' },
      { name: 'Campania (Naples)', seats: 55, winner: 'DC' },
      { name: 'Sicily (Palermo)', seats: 52, winner: 'DC' },
      { name: 'Veneto (Venice & Verona)', seats: 50, winner: 'DC' },
      { name: 'Emilia-Romagna (Bologna)', seats: 48, winner: 'PCI' },
      { name: 'Piedmont (Turin)', seats: 45, winner: 'PCI' },
      { name: 'Tuscany (Florence)', seats: 42, winner: 'PCI' },
      { name: 'Apulia (Bari)', seats: 40, winner: 'DC' },
      { name: 'Calabria & Basilicata', seats: 32, winner: 'DC' },
      { name: 'Sardinia (Cagliari)', seats: 25, winner: 'DC' },
      { name: 'Liguria (Genoa)', seats: 25, winner: 'PCI' },
      { name: 'Abruzzo & Molise', seats: 20, winner: 'DC' }
    ], [
      { id: 'DC', name: 'DC', leader: 'Alcide De Gasperi', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 48 },
      { id: 'PCI', name: 'PCI', leader: 'Palmiro Togliatti', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 31 },
      { id: 'PSI', name: 'PSI', leader: 'Pietro Nenni', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 13 },
      { id: 'MSI', name: 'MSI', leader: 'Giorgio Almirante', ideology: 'Nationalist', symbol: 'Shield', color: '#1f2937', baseSupport: 5 },
      { id: 'PLI', name: 'PLI', leader: 'Luigi Einaudi', ideology: 'Liberal', symbol: 'Compass', color: '#f59e0b', baseSupport: 3 }
    ]),
    bills: createHistoricalBills('1950', 'IT'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'YU',
    name: 'FPR Yugoslavia (1950)',
    description: 'Following the 1948 Tito-Stalin split, Marshal Josip Broz Tito pioneers worker self-management and an independent socialist path.',
    flag: '🇽🇰',
    seats: 350,
    parliamentName: 'Federal Assembly of Yugoslavia (Savezna skupština)',
    system: 'Socialist Federal Republic',
    population: '16 Million',
    primaryColor: '#0284c7',
    rivals: [
      { id: 'KPJ', name: 'League of Communists of Yugoslavia (KPJ)', leader: 'Josip Broz Tito & Edvard Kardelj', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 86 },
      { id: 'NFY', name: 'People\'s Front of Yugoslavia (NFY)', leader: 'Moša Pijade', ideology: 'Socialist', symbol: 'Users', color: '#0284c7', baseSupport: 14 },
    ],
    regions: generateHistoricalRegions('YU', [
      { name: 'PR Serbia (Belgrade & Niš)', seats: 95, winner: 'KPJ' },
      { name: 'PR Croatia (Zagreb & Split)', seats: 80, winner: 'KPJ' },
      { name: 'PR Bosnia and Herzegovina (Sarajevo)', seats: 52, winner: 'KPJ' },
      { name: 'PR Slovenia (Ljubljana)', seats: 40, winner: 'KPJ' },
      { name: 'PR Macedonia (Skopje)', seats: 28, winner: 'KPJ' },
      { name: 'Autonomous Region of Kosovo and Metohija (Pristina)', seats: 20, winner: 'KPJ' },
      { name: 'Autonomous Province of Vojvodina (Novi Sad)', seats: 25, winner: 'KPJ' },
      { name: 'PR Montenegro (Titograd)', seats: 18, winner: 'KPJ' }
    ], [
      { id: 'KPJ', name: 'KPJ', leader: 'Josip Broz Tito', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 86 },
      { id: 'NFY', name: 'NFY', leader: 'Moša Pijade', ideology: 'Socialist', symbol: 'Users', color: '#0284c7', baseSupport: 14 }
    ]),
    bills: createHistoricalBills('1950', 'YU'),
    campaignTurns: 53,
    electionCycleYears: 4,
  }
];

// ==========================================
// SCENARIO 1936 COUNTRIES (Gathering Storm)
// ==========================================
const COUNTRIES_1936: Country[] = [
  {
    id: 'DE',
    name: 'German Reich (1936)',
    description: 'Remilitarizing the Rhineland and hosting the 1936 Berlin Olympics. A totalitarian regime consolidating state authority and industrial power.',
    flag: '🇩🇪',
    seats: 741,
    parliamentName: 'Großdeutscher Reichstag',
    system: 'Totalitarian One-Party State',
    population: '67 Million',
    primaryColor: '#7f1d1d',
    rivals: [
      { id: 'NSDAP', name: 'National Socialist German Workers\' Party', leader: 'Adolf Hitler', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#7f1d1d', baseSupport: 88 },
      { id: 'UNDERGROUND_SPD', name: 'Sopade (Underground SPD Resistance)', leader: 'Otto Wels', ideology: 'Social Democrat', symbol: 'Flame', color: '#dc2626', baseSupport: 6 },
      { id: 'UNDERGROUND_KPD', name: 'Red Orchestra (Anti-Fascist Network)', leader: 'Ernst Thälmann', ideology: 'Socialist', symbol: 'Users', color: '#991b1b', baseSupport: 6 },
    ],
    regions: getGermanyRegions(),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'TR',
    name: 'Republic of Turkey (1936)',
    description: 'Under President Mustafa Kemal Atatürk and Prime Minister İsmet İnönü, Turkey secures the Montreux Straits Convention and expands five-year industrial plans.',
    flag: '🇹🇷',
    seats: 399,
    parliamentName: 'Grand National Assembly of Turkey (TBMM 5th Period)',
    system: 'Single-Party Progressive Republic',
    population: '16 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'CHP', name: 'Cumhuriyet Halk Partisi (Six Arrows)', leader: 'Mustafa Kemal Atatürk & İsmet İnönü', ideology: 'Social Democrat', symbol: 'Flame', color: '#dc2626', baseSupport: 86 },
      { id: 'BAGIMSIZ', name: 'Müstakil Grup (Independent Deputy Caucus)', leader: 'Celal Bayar', ideology: 'Liberal', symbol: 'Sun', color: '#2563eb', baseSupport: 14 },
    ],
    regions: getTurkeyRegions(),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'US',
    name: 'United States of America (1936)',
    description: 'President Franklin D. Roosevelt campaigning for a historic second term on the triumph of the New Deal, Social Security, and public works programs.',
    flag: '🇺🇸',
    seats: 531,
    parliamentName: '74th United States Congress',
    system: 'Presidential System',
    population: '128 Million',
    primaryColor: '#1d4ed8',
    rivals: [
      { id: 'DEM_US', name: 'Democratic Party (New Deal Coalition)', leader: 'Franklin D. Roosevelt', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 61 },
      { id: 'REP', name: 'Republican Party', leader: 'Alf Landon', ideology: 'Conservative', symbol: 'Building', color: '#dc2626', baseSupport: 36 },
      { id: 'UNION', name: 'Union Party', leader: 'William Lemke & Father Coughlin', ideology: 'Populist', symbol: 'Users', color: '#ca8a04', baseSupport: 3 },
    ],
    regions: getUSRegions(),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'SU',
    name: 'Soviet Union (1936)',
    description: 'Adopting the 1936 Stalin Constitution and expanding rapid industrialization through the Second Five-Year Plan across Eurasia.',
    flag: '☭',
    seats: 600,
    parliamentName: 'Congress of Soviets of the USSR',
    system: 'Socialist State',
    population: '162 Million',
    primaryColor: '#b91c1c',
    rivals: [
      { id: 'VKPB', name: 'All-Union Communist Party (Bolsheviks)', leader: 'Joseph Stalin', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 90 },
      { id: 'TRADE_UNIONS', name: 'All-Union Central Council of Trade Unions', leader: 'Nikolai Shvernik', ideology: 'Socialist', symbol: 'Users', color: '#991b1b', baseSupport: 10 },
    ],
    regions: generateHistoricalRegions('SU', [
      { name: 'RSFSR (Russia)', seats: 320, winner: 'VKPB' },
      { name: 'Ukrainian SSR', seats: 140, winner: 'VKPB' },
      { name: 'Byelorussian SSR', seats: 50, winner: 'VKPB' },
      { name: 'Transcaucasian SFSR', seats: 50, winner: 'VKPB' },
      { name: 'Central Asian Republics', seats: 40, winner: 'VKPB' }
    ], [
      { id: 'VKPB', name: 'Bolsheviks', leader: 'Joseph Stalin', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 90 },
      { id: 'TRADE_UNIONS', name: 'Trade Unions', leader: 'Nikolai Shvernik', ideology: 'Socialist', symbol: 'Users', color: '#991b1b', baseSupport: 10 }
    ]),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GB',
    name: 'United Kingdom & Empire (1936)',
    description: 'The National Government navigating the Abdication Crisis of King Edward VIII and initial rearmament debates against European dictatorships.',
    flag: '🇬🇧',
    seats: 615,
    parliamentName: 'House of Commons (National Government)',
    system: 'Parliamentary System',
    population: '47 Million',
    primaryColor: '#1e3a8a',
    rivals: [
      { id: 'CON', name: 'Conservative Party (National Gov)', leader: 'Stanley Baldwin & Neville Chamberlain', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 53 },
      { id: 'LAB', name: 'Labour Party', leader: 'Clement Attlee', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 38 },
      { id: 'LD', name: 'Liberal Party', leader: 'Archibald Sinclair', ideology: 'Liberal', symbol: 'Compass', color: '#eab308', baseSupport: 9 },
    ],
    regions: getUKRegions(),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IT',
    name: 'Kingdom of Italy (1936)',
    description: 'Proclaiming the Italian Empire following the Second Italo-Ethiopian War under Benito Mussolini.',
    flag: '🇮🇹',
    seats: 400,
    parliamentName: 'Chamber of Fasces and Corporations',
    system: 'Totalitarian Fascist Regime',
    population: '42 Million',
    primaryColor: '#15803d',
    rivals: [
      { id: 'PNF', name: 'National Fascist Party (PNF)', leader: 'Benito Mussolini', ideology: 'Nationalist', symbol: 'Shield', color: '#1f2937', baseSupport: 88 },
      { id: 'MONARCHIST', name: 'Royalist Faction (House of Savoy)', leader: 'King Victor Emmanuel III', ideology: 'Traditionalist', symbol: 'Landmark', color: '#1d4ed8', baseSupport: 12 },
    ],
    regions: getItalyRegions(),
    bills: createHistoricalBills('1936'),
    campaignTurns: 53,
    electionCycleYears: 5,
  }
];

// ==========================================
// SCENARIO 1920 COUNTRIES (Roaring Twenties)
// ==========================================
const COUNTRIES_1920: Country[] = [
  {
    id: 'TR',
    name: 'Grand National Assembly of Turkey (Ankara 1920)',
    description: 'Mustafa Kemal Pasha opens the First Grand National Assembly in Ankara on April 23, 1920, leading the Turkish War of Independence against foreign occupation.',
    flag: '🇹🇷',
    seats: 380,
    parliamentName: 'Grand National Assembly of Turkey (1st Period)',
    system: 'Revolutionary Assembly Government',
    population: '13 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'MUDAFAA', name: 'Anadolu ve Rumeli Müdafaa-i Hukuk (First Group)', leader: 'Mustafa Kemal Pasha (Atatürk)', ideology: 'Nationalist', symbol: 'Flame', color: '#dc2626', baseSupport: 68 },
      { id: 'SECOND_GROUP', name: 'Second Group (İkinci Grup)', leader: 'Hüseyin Avni Ulaş & Ali Şükrü Bey', ideology: 'Traditionalist', symbol: 'Landmark', color: '#15803d', baseSupport: 32 },
    ],
    regions: getTurkeyRegions(),
    bills: createHistoricalBills('1920'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'DE',
    name: 'Weimar Republic (1920 Germany)',
    description: 'The fledgling German democratic republic navigating post-Versailles reparations, Spartacist uprisings, and Kapp Putsch crises.',
    flag: '🇩🇪',
    seats: 459,
    parliamentName: 'Reichstag of the Weimar Republic',
    system: 'Coalition Government',
    population: '62 Million',
    primaryColor: '#000000',
    rivals: [
      { id: 'SPD', name: 'Social Democratic Party of Germany (SPD)', leader: 'Friedrich Ebert & Hermann Müller', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 22 },
      { id: 'USPD', name: 'Independent Social Democratic Party (USPD)', leader: 'Arthur Crispien', ideology: 'Socialist', symbol: 'Flame', color: '#991b1b', baseSupport: 18 },
      { id: 'DNVP', name: 'German National People\'s Party (DNVP)', leader: 'Oskar Hergt', ideology: 'Nationalist', symbol: 'Shield', color: '#1f2937', baseSupport: 15 },
      { id: 'DVP', name: 'German People\'s Party (DVP)', leader: 'Gustav Stresemann', ideology: 'Liberal', symbol: 'Compass', color: '#ca8a04', baseSupport: 14 },
      { id: 'ZENTRUM', name: 'Centre Party (Zentrum)', leader: 'Constantin Fehrenbach', ideology: 'Conservative', symbol: 'Building', color: '#f59e0b', baseSupport: 14 },
      { id: 'DDP', name: 'German Democratic Party (DDP)', leader: 'Carl Petersen', ideology: 'Liberal', symbol: 'Sun', color: '#3b82f6', baseSupport: 8 },
      { id: 'KPD', name: 'Communist Party of Germany (KPD)', leader: 'Paul Levi', ideology: 'Socialist', symbol: 'Flame', color: '#7f1d1d', baseSupport: 9 },
    ],
    regions: getGermanyRegions(),
    bills: createHistoricalBills('1920'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'SU',
    name: 'Russian SFSR / Soviet Russia (1920)',
    description: 'Vladimir Lenin\'s Bolshevik government securing victory in the Russian Civil War and defending against Polish offensives.',
    flag: '🚩',
    seats: 500,
    parliamentName: 'All-Russian Central Executive Committee (VTsIK)',
    system: 'Soviet Republic',
    population: '136 Million',
    primaryColor: '#b91c1c',
    rivals: [
      { id: 'BOLSHEVIKS', name: 'Russian Communist Party (Bolsheviks)', leader: 'Vladimir Lenin & Leon Trotsky', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 85 },
      { id: 'LEFT_SR', name: 'Left Socialist-Revolutionaries & Mensheviks', leader: 'Julius Martov', ideology: 'Socialist', symbol: 'Users', color: '#ca8a04', baseSupport: 15 },
    ],
    regions: generateHistoricalRegions('SU', [
      { name: 'Petrograd & Northern Region', seats: 120, winner: 'BOLSHEVIKS' },
      { name: 'Moscow & Central Industrial', seats: 160, winner: 'BOLSHEVIKS' },
      { name: 'Volga & Urals Region', seats: 100, winner: 'BOLSHEVIKS' },
      { name: 'Siberia & Far East', seats: 70, winner: 'BOLSHEVIKS' },
      { name: 'Ukraine & South Front', seats: 50, winner: 'BOLSHEVIKS' }
    ], [
      { id: 'BOLSHEVIKS', name: 'Bolsheviks', leader: 'Vladimir Lenin', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 85 },
      { id: 'LEFT_SR', name: 'Left SRs / Mensheviks', leader: 'Julius Martov', ideology: 'Socialist', symbol: 'Users', color: '#ca8a04', baseSupport: 15 }
    ]),
    bills: createHistoricalBills('1920'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'US',
    name: 'United States of America (1920)',
    description: 'Warren G. Harding\'s "Return to Normalcy" victory following the conclusion of World War I and the ratification of women\'s voting rights (19th Amendment).',
    flag: '🇺🇸',
    seats: 531,
    parliamentName: '66th United States Congress',
    system: 'Presidential System',
    population: '106 Million',
    primaryColor: '#1d4ed8',
    rivals: [
      { id: 'REP', name: 'Republican Party (Return to Normalcy)', leader: 'Warren G. Harding & Calvin Coolidge', ideology: 'Conservative', symbol: 'Building', color: '#dc2626', baseSupport: 60 },
      { id: 'DEM_US', name: 'Democratic Party (Wilson League Platform)', leader: 'James M. Cox & Franklin D. Roosevelt', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 34 },
      { id: 'SPA', name: 'Socialist Party of America', leader: 'Eugene V. Debs', ideology: 'Socialist', symbol: 'Flame', color: '#b91c1c', baseSupport: 6 },
    ],
    regions: getUSRegions(),
    bills: createHistoricalBills('1920'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'GB',
    name: 'British Empire (1920)',
    description: 'David Lloyd George\'s wartime coalition managing post-war imperial expansion in the Middle East and the Irish War of Independence.',
    flag: '🇬🇧',
    seats: 707,
    parliamentName: 'Imperial Parliament (Westminster)',
    system: 'Parliamentary System',
    population: '43 Million',
    primaryColor: '#1e3a8a',
    rivals: [
      { id: 'COALITION_LIB', name: 'Coalition Liberals & Unionists', leader: 'David Lloyd George & Bonar Law', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 52 },
      { id: 'LAB', name: 'Labour Party', leader: 'William Adamson', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 28 },
      { id: 'SINN_FEIN', name: 'Sinn Féin (Irish Abstentionists)', leader: 'Éamon de Valera', ideology: 'Nationalist', symbol: 'Shield', color: '#15803d', baseSupport: 12 },
      { id: 'ASQUITH_LIB', name: 'Independent Liberals (Asquith)', leader: 'H. H. Asquith', ideology: 'Liberal', symbol: 'Sun', color: '#eab308', baseSupport: 8 },
    ],
    regions: getUKRegions(),
    bills: createHistoricalBills('1920'),
    campaignTurns: 53,
    electionCycleYears: 5,
  }
];

// ==========================================
// SCENARIO 1914 COUNTRIES (Eve of Great War)
// ==========================================
const COUNTRIES_1914: Country[] = [
  {
    id: 'TR',
    name: 'Ottoman Empire (1914)',
    description: 'Sultan Mehmed V and the Committee of Union and Progress (CUP / İttihat ve Terakki) governing during the July Crisis and World War I mobilization.',
    flag: '🇹🇷',
    seats: 275,
    parliamentName: 'Meclis-i Mebusan (Chamber of Deputies)',
    system: 'Constitutional Monarchy',
    population: '21 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'ITTIHAT', name: 'İttihat ve Terakki Cemiyeti (CUP)', leader: 'Talat Pasha, Enver Pasha & Cemal Pasha', ideology: 'Nationalist', symbol: 'Shield', color: '#dc2626', baseSupport: 72 },
      { id: 'ITILAF', name: 'Hürriyet ve İtilaf Fırkası (Liberal Entente)', leader: 'Damad Ferid Pasha & Rıza Tevfik', ideology: 'Liberal', symbol: 'Sun', color: '#2563eb', baseSupport: 28 },
    ],
    regions: getTurkeyRegions(),
    bills: createHistoricalBills('1914'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'DE',
    name: 'German Empire (Deutsches Kaiserreich 1914)',
    description: 'Kaiser Wilhelm II and Chancellor Bethmann-Hollweg commanding Europe\'s premier industrial powerhouse and army on the brink of general mobilization.',
    flag: '🇩🇪',
    seats: 397,
    parliamentName: 'Reichstag of the German Empire',
    system: 'Constitutional Imperial Monarchy',
    population: '67 Million',
    primaryColor: '#000000',
    rivals: [
      { id: 'SPD', name: 'Social Democratic Party of Germany (SPD)', leader: 'Friedrich Ebert & Hugo Haase', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 35 },
      { id: 'ZENTRUM', name: 'Centre Party (Zentrum)', leader: 'Peter Spahn', ideology: 'Conservative', symbol: 'Building', color: '#f59e0b', baseSupport: 23 },
      { id: 'NAT_LIB', name: 'National Liberal Party', leader: 'Ernst Bassermann', ideology: 'Liberal', symbol: 'Compass', color: '#2563eb', baseSupport: 16 },
      { id: 'CON_GER', name: 'German Conservative Party', leader: 'Ernst von Heydebrand', ideology: 'Traditionalist', symbol: 'Shield', color: '#1f2937', baseSupport: 14 },
      { id: 'PROG_LIB', name: 'Progressive People\'s Party', leader: 'Friedrich von Payer', ideology: 'Liberal', symbol: 'Sun', color: '#eab308', baseSupport: 12 },
    ],
    regions: getGermanyRegions(),
    bills: createHistoricalBills('1914'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'GB',
    name: 'British Empire (1914)',
    description: 'H. H. Asquith\'s Liberal government managing the Home Rule crisis in Ireland and declaring war in defense of Belgian neutrality.',
    flag: '🇬🇧',
    seats: 670,
    parliamentName: 'Imperial Parliament (Westminster 1914)',
    system: 'Parliamentary System',
    population: '45 Million',
    primaryColor: '#1e3a8a',
    rivals: [
      { id: 'LIB', name: 'Liberal Party', leader: 'H. H. Asquith & David Lloyd George', ideology: 'Liberal', symbol: 'Compass', color: '#eab308', baseSupport: 43 },
      { id: 'CON', name: 'Conservative and Unionist Party', leader: 'Bonar Law & Lord Lansdowne', ideology: 'Conservative', symbol: 'Building', color: '#2563eb', baseSupport: 42 },
      { id: 'IPP', name: 'Irish Parliamentary Party', leader: 'John Redmond', ideology: 'Nationalist', symbol: 'Shield', color: '#15803d', baseSupport: 8 },
      { id: 'LAB', name: 'Labour Party', leader: 'Ramsay MacDonald & Arthur Henderson', ideology: 'Social Democrat', symbol: 'Users', color: '#dc2626', baseSupport: 7 },
    ],
    regions: getUKRegions(),
    bills: createHistoricalBills('1914'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'SU',
    name: 'Russian Empire (1914)',
    description: 'Tsar Nicholas II and the Fourth State Duma mobilizing millions of soldiers in support of Serbia and Pan-Slavic defense.',
    flag: '🇷🇺',
    seats: 442,
    parliamentName: 'State Duma of the Russian Empire (4th Duma)',
    system: 'Imperial Autocracy with Representative Duma',
    population: '175 Million',
    primaryColor: '#b91c1c',
    rivals: [
      { id: 'OCTOBRISTS', name: 'Union of October 17 (Octobrists)', leader: 'Mikhail Rodzianko & Alexander Guchkov', ideology: 'Conservative', symbol: 'Building', color: '#ca8a04', baseSupport: 32 },
      { id: 'RIGHTISTS', name: 'Union of the Russian People (Rightists)', leader: 'Vladimir Purishkevich', ideology: 'Traditionalist', symbol: 'Shield', color: '#1f2937', baseSupport: 28 },
      { id: 'KADETS', name: 'Constitutional Democratic Party (Kadets)', leader: 'Pavel Milyukov', ideology: 'Liberal', symbol: 'Sun', color: '#2563eb', baseSupport: 22 },
      { id: 'TRUDOVIKS', name: 'Trudoviks & Social Democrats', leader: 'Alexander Kerensky', ideology: 'Socialist', symbol: 'Flame', color: '#dc2626', baseSupport: 18 },
    ],
    regions: generateHistoricalRegions('SU', [
      { name: 'Saint Petersburg Imperial Governorate', seats: 90, winner: 'OCTOBRISTS' },
      { name: 'Moscow Governorate & Central Russia', seats: 120, winner: 'OCTOBRISTS' },
      { name: 'Southwest & Little Russia (Kiev)', seats: 90, winner: 'RIGHTISTS' },
      { name: 'Volga, Urals & Cossack Host Lands', seats: 80, winner: 'RIGHTISTS' },
      { name: 'Congress Poland & Baltic Governorates', seats: 62, winner: 'KADETS' }
    ], [
      { id: 'OCTOBRISTS', name: 'Octobrists', leader: 'Mikhail Rodzianko', ideology: 'Conservative', symbol: 'Building', color: '#ca8a04', baseSupport: 32 },
      { id: 'RIGHTISTS', name: 'Rightists', leader: 'Vladimir Purishkevich', ideology: 'Traditionalist', symbol: 'Shield', color: '#1f2937', baseSupport: 28 },
      { id: 'KADETS', name: 'Kadets', leader: 'Pavel Milyukov', ideology: 'Liberal', symbol: 'Sun', color: '#2563eb', baseSupport: 22 },
      { id: 'TRUDOVIKS', name: 'Trudoviks', leader: 'Alexander Kerensky', ideology: 'Socialist', symbol: 'Flame', color: '#dc2626', baseSupport: 18 }
    ]),
    bills: createHistoricalBills('1914'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'US',
    name: 'United States of America (1914)',
    description: 'President Woodrow Wilson declaring strict American neutrality while managing domestic progressive antitrust and Federal Reserve reforms.',
    flag: '🇺🇸',
    seats: 531,
    parliamentName: '63rd United States Congress',
    system: 'Presidential System',
    population: '98 Million',
    primaryColor: '#1d4ed8',
    rivals: [
      { id: 'DEM_US', name: 'Democratic Party (New Freedom)', leader: 'Woodrow Wilson', ideology: 'Social Democrat', symbol: 'Globe', color: '#2563eb', baseSupport: 48 },
      { id: 'REP', name: 'Republican Party', leader: 'William Howard Taft', ideology: 'Conservative', symbol: 'Building', color: '#dc2626', baseSupport: 35 },
      { id: 'PROGRESSIVE_US', name: 'Progressive Party (Bull Moose)', leader: 'Theodore Roosevelt', ideology: 'Liberal', symbol: 'ShieldCheck', color: '#15803d', baseSupport: 17 },
    ],
    regions: getUSRegions(),
    bills: createHistoricalBills('1914'),
    campaignTurns: 53,
    electionCycleYears: 4,
  }
];

export const getPlayableCountriesForScenario = (scenario: ScenarioYear): Country[] => {
  if (scenario === '1950') return COUNTRIES_1950;
  if (scenario === '1936') return COUNTRIES_1936;
  if (scenario === '1920') return COUNTRIES_1920;
  if (scenario === '1914') return COUNTRIES_1914;
  return PLAYABLE_COUNTRIES; // Default 2026
};
