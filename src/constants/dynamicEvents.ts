import { DynamicGameEvent } from '../types';

export const DYNAMIC_EVENTS_BANK: DynamicGameEvent[] = [
  // ==========================================
  // 1. DOMESTIC EVENTS - EGYPT (EG)
  // ==========================================
  {
    id: 'dom-eg-currency-devaluation',
    title: 'Egyptian Pound Currency Devaluation & Foreign Reserves Pressure',
    icon: '💱',
    scope: 'DOMESTIC',
    countryId: 'EG',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'The Central Bank of Egypt is facing acute foreign exchange reserve shortages as debt service payments fall due. The parallel exchange rate has diverged significantly from the official peg, driving up the cost of imported medicines and staple consumer goods across Cairo and Alexandria.',
    choices: [
      {
        id: 'eg-deval-cushion',
        text: 'Deploy Emergency Reserves to Subsidize Staple Imports',
        flavorPreview: 'Spend state reserves to cushion consumer prices on basic food and pharmaceuticals.',
        expectedEffectsSummary: 'Cost: -₺75,000 Treasury | Inflation: -1.5% | Approval: +6% | Confidence: +5',
        effects: {
          treasuryDelta: -75000,
          inflationDelta: -1.5,
          approvalDelta: 6,
          confidenceDelta: 5,
          voterApprovalDelta: { Workers: 8, Traditionalists: 6 }
        },
        outcomeNarrative: 'The government subsidized crucial import items, dampening inflation and easing cost-of-living burdens on working-class households.',
        spawnSituation: {
          title: 'Subsidized Food Supply Chain',
          icon: '🌾',
          category: 'ECONOMIC',
          description: 'State emergency reserve buffers keep urban bakery and pharmacy shelves stocked at controlled prices.',
          sourceEvent: 'Egyptian Pound Currency Devaluation - Reserve Cushion',
          remainingMonths: 5,
          totalDuration: 5,
          monthlyEffects: {
            inflationDelta: -0.2,
            approvalDelta: 0.5
          },
          resolutionOutcome: 'Foreign currency markets stabilized as agricultural trade balanced out.'
        }
      },
      {
        id: 'eg-deval-float',
        text: 'Free-Float the Egyptian Pound & Secure International Loans',
        flavorPreview: 'Allow the currency to adjust to market value to unlock foreign direct investment and foreign exchange tranches.',
        expectedEffectsSummary: 'Treasury: +₺110,000 | Confidence: +15 | Inflation: +3.0% | Approval: -6%',
        effects: {
          treasuryDelta: 110000,
          confidenceDelta: 15,
          inflationDelta: 3.0,
          approvalDelta: -6,
          voterApprovalDelta: { Liberals: 10, Workers: -8 }
        },
        outcomeNarrative: 'The free-float attracted foreign direct capital and unlocked IMF development tranches, though consumer prices temporarily jumped.',
        spawnSituation: {
          title: 'Post-Float Market Adjustment',
          icon: '📈',
          category: 'ECONOMIC',
          description: 'High import costs cause friction, but sovereign reserves and foreign investment inflows are steadily rebounding.',
          sourceEvent: 'Egyptian Pound Currency Devaluation - Free Float',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            treasuryDelta: 12000,
            confidenceDelta: 1,
            approvalDelta: -0.5
          },
          resolutionOutcome: 'Currency markets normalized at equilibrium with strong institutional investor backing.'
        }
      },
      {
        id: 'eg-deval-controls',
        text: 'Impose Strict Capital Controls & Foreign Exchange Quotas',
        flavorPreview: 'Restrict foreign currency outflows and mandate state approval for commercial currency exchanges.',
        expectedEffectsSummary: 'Treasury: +₺30,000 | Freedom Index: -8 | Confidence: -6 | Nationalists: +6%',
        effects: {
          treasuryDelta: 30000,
          freedomDelta: -8,
          confidenceDelta: -6,
          approvalDelta: -2,
          voterApprovalDelta: { Nationalists: 6, Shopkeepers: -8 }
        },
        outcomeNarrative: 'Strict currency quotas stemmed capital flight, but informal black market activity expanded and business groups protested bureaucracy.'
      }
    ]
  },
  {
    id: 'dom-eg-suez-revenue-drop',
    title: 'Suez Canal Maritime Transit Revenue Drop',
    icon: '🚢',
    scope: 'DOMESTIC',
    countryId: 'EG',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Regional security escalation in the southern Red Sea and Bab el-Mandeb strait has caused global shipping lines to reroute around Africa. Monthly transit fees through the Suez Canal—one of Egypt\'s primary sources of foreign sovereign revenue—have plummeted by over 40%.',
    choices: [
      {
        id: 'eg-suez-discount',
        text: 'Offer Strategic Transit Rebates & Expanded Naval Escorts',
        flavorPreview: 'Incentivize commercial convoys by lowering toll tariffs and providing Egyptian Navy escort corridors.',
        expectedEffectsSummary: 'Cost: -₺40,000 | Reputation: +14 | Relations with US/EU: +15 | Approval: +4%',
        effects: {
          treasuryDelta: -40000,
          reputationDelta: 14,
          approvalDelta: 4,
          relationDeltas: { 'US': 15, 'GB': 15, 'FR': 12 },
          voterApprovalDelta: { Nationalists: 6, Shopkeepers: 5 }
        },
        outcomeNarrative: 'Naval convoy escorts and toll concessions reassured maritime shippers, restoring a significant portion of container traffic through Port Said and Suez.',
        spawnSituation: {
          title: 'Suez Maritime Security Corridor',
          icon: '⚓',
          category: 'GEOPOLITICAL',
          description: 'Egyptian naval patrol frigates actively escort commercial container ships through the Red Sea transit lanes.',
          sourceEvent: 'Suez Canal Revenue Drop - Escort Convoys',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            treasuryDelta: 8000,
            reputationDelta: 1
          },
          resolutionOutcome: 'Suez Canal traffic returned to pre-crisis operational volumes.'
        }
      },
      {
        id: 'eg-suez-diplomacy',
        text: 'Convene Red Sea Littoral States Security Summit in Cairo',
        flavorPreview: 'Lead a diplomatic peace initiative with regional littoral states to guarantee free navigation.',
        requiresDiplomaticCapability: true,
        minReputationRequired: 40,
        expectedEffectsSummary: 'Reputation: +20 | Relations with Gulf/Arab League: +20 | Treasury: +₺15,000 | Approval: +8%',
        effects: {
          reputationDelta: 20,
          treasuryDelta: 15000,
          approvalDelta: 8,
          relationDeltas: { 'SA': 20, 'TR': 12, 'US': 10 },
          voterApprovalDelta: { Liberals: 10, Nationalists: 8 }
        },
        outcomeNarrative: 'The Cairo Maritime Peace Summit established a joint monitoring framework, significantly reducing missile threats and elevating Egypt\'s diplomatic prestige.'
      },
      {
        id: 'eg-suez-austerity',
        text: 'Absorb Revenue Loss via Sovereign Spending Reallocation',
        flavorPreview: 'Delay non-urgent infrastructure outlays and tap sovereign wealth holdings.',
        expectedEffectsSummary: 'Treasury: +₺25,000 | Confidence: -4 | Approval: -4%',
        effects: {
          treasuryDelta: 25000,
          confidenceDelta: -4,
          approvalDelta: -4
        },
        outcomeNarrative: 'The state deferred capital outlays to cover the maritime shortfall while waiting for global shipping insurers to lower premiums.'
      }
    ]
  },
  {
    id: 'dom-eg-sinai-security-surge',
    title: 'North Sinai Border Security & Counter-Terror Operation',
    icon: '🛡️',
    scope: 'DOMESTIC',
    countryId: 'EG',
    category: 'SECURITY',
    urgency: 'CRITICAL',
    description: 'Intelligence services report armed extremist networks attempting to establish logistic hubs near the Rafah and North Sinai border corridors. Military command seeks executive authorization to launch a sweeping combined-arms stabilization campaign.',
    choices: [
      {
        id: 'eg-sinai-military',
        text: 'Authorize Combined-Arms Sweep with Local Bedouin Tribal Alliances',
        flavorPreview: 'Deploy special forces alongside respected tribal scouts to neutralize cells with minimal collateral damage.',
        expectedEffectsSummary: 'Cost: -₺45,000 | Civil War Risk: -15% | Approval: +8% | Nationalists: +12%',
        effects: {
          treasuryDelta: -45000,
          civilWarRiskDelta: -15,
          approvalDelta: 8,
          voterApprovalDelta: { Nationalists: 12, Traditionalists: 10 }
        },
        outcomeNarrative: 'Partnering with Sinai tribal elders enabled rapid intelligence breakthroughs, dismantling insurgent arms depots and securing key desert highways.'
      },
      {
        id: 'eg-sinai-development',
        text: 'Pair Counter-Terror Sweep with Massive Sinai Economic Development Fund',
        flavorPreview: 'Invest in local Sinai agricultural irrigation, desalination, and vocational schools.',
        expectedEffectsSummary: 'Cost: -₺85,000 | Civil War Risk: -20% | Freedom Index: +6 | Approval: +12%',
        effects: {
          treasuryDelta: -85000,
          civilWarRiskDelta: -20,
          freedomDelta: 6,
          approvalDelta: 12,
          voterApprovalDelta: { Workers: 10, Youth: 14 }
        },
        outcomeNarrative: 'Comprehensive socio-economic development dried up recruitment grounds for militants and fostered deep loyalty in the Sinai Peninsula.'
      },
      {
        id: 'eg-sinai-curfew',
        text: 'Impose Strict Military Curfews & Heavy Checkpoint Grid',
        flavorPreview: 'Rely primarily on defensive blockades and surveillance without new tribal expenditures.',
        expectedEffectsSummary: 'Cost: -₺15,000 | Civil War Risk: -5% | Freedom Index: -8 | Approval: -3%',
        effects: {
          treasuryDelta: -15000,
          civilWarRiskDelta: -5,
          freedomDelta: -8,
          approvalDelta: -3,
          voterApprovalDelta: { Liberals: -8, Nationalists: 4 }
        },
        outcomeNarrative: 'Heavy checkpoints prevented major attacks but caused friction among local traders and transport operators.'
      }
    ]
  },
  {
    id: 'dom-eg-bread-subsidy-crisis',
    title: 'Baladi Bread Subsidy & Wheat Sourcing Emergency',
    icon: '🥖',
    scope: 'DOMESTIC',
    countryId: 'EG',
    category: 'SOCIAL',
    urgency: 'HIGH',
    description: 'Black Sea grain export disruptions and rising global fertilizer costs have doubled the international cost of wheat. Over 70 million citizens rely on Egypt\'s historic subsidized Baladi bread program, placing immense pressure on the Ministry of Supply.',
    choices: [
      {
        id: 'eg-bread-subsidize',
        text: 'Fully Absorb Wheat Import Cost Increases from State Treasury',
        flavorPreview: 'Guarantee the fixed price of subsidized bread to safeguard vulnerable families from hunger.',
        expectedEffectsSummary: 'Cost: -₺90,000 | Approval: +14% | Inflation: -1.0% | Workers: +18%',
        effects: {
          treasuryDelta: -90000,
          approvalDelta: 14,
          inflationDelta: -1.0,
          voterApprovalDelta: { Workers: 18, Traditionalists: 14 }
        },
        outcomeNarrative: 'The government protected Egyptian families from food price shocks, earning widespread grassroots praise across urban and rural provinces.'
      },
      {
        id: 'eg-bread-cash-transfers',
        text: 'Transition to Targeted Digital Cash Subsidies (Takaful & Karama)',
        flavorPreview: 'Modernize the food assistance system by issuing direct monthly digital payments to low-income households.',
        expectedEffectsSummary: 'Cost: -₺50,000 | Confidence: +10 | Freedom: +5 | Approval: +6%',
        effects: {
          treasuryDelta: -50000,
          confidenceDelta: 10,
          freedomDelta: 5,
          approvalDelta: 6,
          voterApprovalDelta: { Liberals: 10, Youth: 8 }
        },
        outcomeNarrative: 'Digital subsidy reform eliminated wheat smuggling and improved fiscal transparency, receiving praise from international lenders.'
      },
      {
        id: 'eg-bread-import-pact',
        text: 'Sign Long-Term Bilateral Wheat Supply Treaty with Black Sea Exporters',
        flavorPreview: 'Secure discount grain quotas through direct state-to-state currency swap agreements.',
        expectedEffectsSummary: 'Cost: -₺40,000 | Reputation: +8 | Relations with RU/RO: +20 | Approval: +8%',
        effects: {
          treasuryDelta: -40000,
          reputationDelta: 8,
          approvalDelta: 8,
          relationDeltas: { 'RU': 20, 'RO': 15 },
          voterApprovalDelta: { Workers: 10 }
        },
        outcomeNarrative: 'Direct bilateral wheat contracts ensured grain silos remained full through the winter at predictable discounted prices.'
      }
    ]
  },

  // ==========================================
  // 2. DOMESTIC EVENTS - TURKEY (TR)
  // ==========================================
  {
    id: 'dom-tr-inflation-lira',
    title: 'Central Bank Monetary Stance & Lira Stabilization',
    icon: '📈',
    scope: 'DOMESTIC',
    countryId: 'TR',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Persistent consumer price inflation and global currency fluctuations are testing household grocery budgets across Istanbul, Ankara, and Izmir. Business federations demand predictable interest rates and credit liquidity.',
    choices: [
      {
        id: 'tr-rate-orthodox',
        text: 'Tighten Monetary Policy & Build Foreign Currency Reserves',
        flavorPreview: 'Strengthen the Lira, suppress inflation, and attract international portfolio capital.',
        expectedEffectsSummary: 'Inflation: -2.5% | Confidence: +16 | Treasury: -₺30,000 | Approval: +4%',
        effects: {
          inflationDelta: -2.5,
          confidenceDelta: 16,
          treasuryDelta: -30000,
          approvalDelta: 4,
          voterApprovalDelta: { Liberals: 12, Shopkeepers: 8 }
        },
        outcomeNarrative: 'Orthodox monetary policy stabilized exchange rates and renewed international investor confidence in Turkish sovereign debt.'
      },
      {
        id: 'tr-wage-hikes',
        text: 'Hike Minimum Wage & Expand Public Sector Purchasing Subsidies',
        flavorPreview: 'Provide immediate financial relief to working-class families and civil servants.',
        expectedEffectsSummary: 'Cost: -₺75,000 | Approval: +12% | Inflation: +1.8% | Workers: +16%',
        effects: {
          treasuryDelta: -75000,
          approvalDelta: 12,
          inflationDelta: 1.8,
          voterApprovalDelta: { Workers: 16, Youth: 10 }
        },
        outcomeNarrative: 'Wage hikes brought immediate purchasing relief to millions of workers, though manufacturers voiced concerns over production costs.'
      },
      {
        id: 'tr-export-incentives',
        text: 'Launch Eximbank Low-Interest Industrial Export Credits',
        flavorPreview: 'Drive industrial manufacturing exports and expand automotive and textile trade.',
        expectedEffectsSummary: 'Treasury: +₺40,000 | Confidence: +8 | Trade: +12 | Approval: +6%',
        effects: {
          treasuryDelta: 40000,
          confidenceDelta: 8,
          approvalDelta: 6,
          tradeModifierDelta: 12,
          voterApprovalDelta: { Shopkeepers: 12, Nationalists: 6 }
        },
        outcomeNarrative: 'Export credit expansion powered record factory output in Bursa, Kocaeli, and Gaziantep.'
      }
    ]
  },
  {
    id: 'dom-tr-earthquake-retrofitting',
    title: 'Disaster Preparedness & National Urban Renewal Plan',
    icon: '🏗️',
    scope: 'DOMESTIC',
    countryId: 'TR',
    category: 'SOCIAL',
    urgency: 'HIGH',
    description: 'Chambers of Civil Engineers release updated seismic risk maps for the North Anatolian and East Anatolian fault zones, urging immediate state funding to retrofit vulnerable schools, hospitals, and residential neighborhoods.',
    choices: [
      {
        id: 'tr-quake-mega-fund',
        text: 'Fund Nationwide Zero-Interest Urban Renewal & Retrofit Loans',
        flavorPreview: 'Allocate state budget to subsidize structural strengthening of high-risk buildings.',
        expectedEffectsSummary: 'Cost: -₺110,000 | Confidence: +16 | Approval: +15% | Civil War Risk: -10%',
        effects: {
          treasuryDelta: -110000,
          confidenceDelta: 16,
          approvalDelta: 15,
          civilWarRiskDelta: -10,
          voterApprovalDelta: { Workers: 14, Liberals: 12, Youth: 15 }
        },
        outcomeNarrative: 'The National Urban Renewal Fund transformed disaster preparedness, providing safer housing for millions and generating thousands of construction jobs.'
      },
      {
        id: 'tr-quake-regulations',
        text: 'Enforce Strict Mandatory Inspection Audits & Building Codes',
        flavorPreview: 'Tighten building permits, impose heavy fines on non-compliant contractors, and train emergency response teams.',
        expectedEffectsSummary: 'Cost: -₺30,000 | Confidence: +10 | Approval: +8% | Freedom: -2',
        effects: {
          treasuryDelta: -30000,
          confidenceDelta: 10,
          approvalDelta: 8,
          freedomDelta: -2,
          voterApprovalDelta: { Liberals: 8, Nationalists: 6 }
        },
        outcomeNarrative: 'Strict building audits elevated structural standards and improved emergency rescue readiness nationwide.'
      }
    ]
  },

  // ==========================================
  // 3. DOMESTIC EVENTS - UNITED STATES (US)
  // ==========================================
  {
    id: 'dom-us-debt-ceiling',
    title: 'Federal Debt Ceiling Impasse & Sovereign Credit Watch',
    icon: '🏛️',
    scope: 'DOMESTIC',
    countryId: 'US',
    category: 'POLITICAL',
    urgency: 'CRITICAL',
    description: 'Partisan standoff on Capitol Hill threatens to breach the statutory debt ceiling within 30 days. Credit rating agencies warn that failure to raise the limit could trigger a catastrophic technical default on US Treasury bonds and halt federal operations.',
    choices: [
      {
        id: 'us-debt-bipartisan',
        text: 'Negotiate Bipartisan Spending Caps & Pass Clean Debt Extension',
        flavorPreview: 'Sign a compromise agreement with moderate budget caps to preserve global credit ratings.',
        expectedEffectsSummary: 'Confidence: +18 | Treasury: +₺40,000 | Approval: +6% | Liberals: +6%',
        effects: {
          confidenceDelta: 18,
          treasuryDelta: 40000,
          approvalDelta: 6,
          voterApprovalDelta: { Liberals: 8, Shopkeepers: 8 }
        },
        outcomeNarrative: 'The bipartisan debt ceiling agreement averted default, spurring a sharp rally across global equity and bond markets.'
      },
      {
        id: 'us-debt-executive',
        text: 'Invoke Constitutional 14th Amendment Sovereign Authority',
        flavorPreview: 'Order the Treasury Department to continue honoring sovereign debt obligations without congressional approval.',
        expectedEffectsSummary: 'Confidence: +8 | Freedom Index: -5 | Approval: +2% | Nationalists: +8%',
        effects: {
          confidenceDelta: 8,
          freedomDelta: -5,
          approvalDelta: 2,
          voterApprovalDelta: { Nationalists: 8, Liberals: 4 }
        },
        outcomeNarrative: 'Invoking executive constitutional authority prevented a sovereign bond default, although opposition leaders filed federal lawsuits.'
      }
    ]
  },
  {
    id: 'dom-us-tech-antitrust',
    title: 'Federal Antitrust Ruling & Artificial Intelligence Standards',
    icon: '💻',
    scope: 'DOMESTIC',
    countryId: 'US',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Federal regulators and the Department of Justice reach a pivotal verdict in anti-monopoly proceedings against major tech conglomerates controlling online search, app ecosystems, and foundational artificial intelligence infrastructure.',
    choices: [
      {
        id: 'us-tech-unbundle',
        text: 'Mandate Open Data Interoperability & Fair Platform Competition',
        flavorPreview: 'Enforce platform neutrality rules to spur open innovation and protect consumer privacy.',
        expectedEffectsSummary: 'Freedom Index: +10 | Confidence: +8 | Approval: +8% | Youth: +14%',
        effects: {
          freedomDelta: 10,
          confidenceDelta: 8,
          approvalDelta: 8,
          voterApprovalDelta: { Youth: 14, Liberals: 10 }
        },
        outcomeNarrative: 'Antitrust reform opened software markets to dynamic startups, driving a fresh wave of innovation and consumer protections.'
      },
      {
        id: 'us-tech-national-champion',
        text: 'Preserve Scale Advantages to Maintain Global Tech Leadership',
        flavorPreview: 'Protect domestic tech titans to guarantee American supremacy in global AI and semiconductor competition.',
        expectedEffectsSummary: 'Confidence: +14 | Treasury: +₺60,000 | Nationalists: +12% | Reputation: +8',
        effects: {
          confidenceDelta: 14,
          treasuryDelta: 60000,
          reputationDelta: 8,
          voterApprovalDelta: { Nationalists: 12, Shopkeepers: 8 }
        },
        outcomeNarrative: 'Domestic tech champions expanded export revenues and accelerated national compute cluster development.'
      }
    ]
  },

  // ==========================================
  // 4. DOMESTIC EVENTS - GERMANY (DE)
  // ==========================================
  {
    id: 'dom-de-energy-transition',
    title: 'Industrial Energy Tariffs & Energiewende Acceleration',
    icon: '⚡',
    scope: 'DOMESTIC',
    countryId: 'DE',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Heavy chemical, steel, and automotive manufacturing federations in North Rhine-Westphalia and Baden-Württemberg warn that elevated electricity prices threaten international competitiveness and factory employment.',
    choices: [
      {
        id: 'de-energy-bridge-tariff',
        text: 'Introduce Subsidized Industrial Bridge Electricity Tariff (Brückenstrompreis)',
        flavorPreview: 'Subsidize factory power rates using federal climate transformation funds.',
        expectedEffectsSummary: 'Cost: -₺85,000 | Confidence: +16 | Approval: +10% | Workers: +14%',
        effects: {
          treasuryDelta: -85000,
          confidenceDelta: 16,
          approvalDelta: 10,
          voterApprovalDelta: { Workers: 14, Shopkeepers: 10 }
        },
        outcomeNarrative: 'The industrial power tariff secured hundreds of thousands of manufacturing jobs and prevented factory relocations.'
      },
      {
        id: 'de-energy-renewables-grid',
        text: 'Accelerate North-South High-Voltage Wind Transmission Grid',
        flavorPreview: 'Overhaul grid infrastructure to transmit offshore Baltic & North Sea wind directly to southern factories.',
        expectedEffectsSummary: 'Cost: -₺70,000 | Confidence: +12 | Reputation: +10 | Liberals: +12%',
        effects: {
          treasuryDelta: -70000,
          confidenceDelta: 12,
          reputationDelta: 10,
          approvalDelta: 6,
          voterApprovalDelta: { Liberals: 12, Youth: 10 }
        },
        outcomeNarrative: 'Expanding grid interconnectors lowered long-term wholesale power costs across Germany.'
      }
    ]
  },

  // ==========================================
  // 5. DOMESTIC EVENTS - UNITED KINGDOM (GB)
  // ==========================================
  {
    id: 'dom-gb-nhs-crisis',
    title: 'National Health Service (NHS) Winter Capacity Surge',
    icon: '🏥',
    scope: 'DOMESTIC',
    countryId: 'GB',
    category: 'SOCIAL',
    urgency: 'HIGH',
    description: 'Urgent care waiting times and seasonal hospital admissions have surged across England, Scotland, and Wales. Healthcare unions and royal colleges call for emergency state funding to expand hospital beds and retain nursing staff.',
    choices: [
      {
        id: 'gb-nhs-fund-surge',
        text: 'Pass Emergency NHS Modernization & Staff Retention Package',
        flavorPreview: 'Fund 10,000 additional acute hospital beds and raise nursing and paramedic compensation.',
        expectedEffectsSummary: 'Cost: -₺75,000 | Approval: +15% | Workers: +18% | Confidence: +8',
        effects: {
          treasuryDelta: -75000,
          approvalDelta: 15,
          confidenceDelta: 8,
          voterApprovalDelta: { Workers: 18, Traditionalists: 12 }
        },
        outcomeNarrative: 'The emergency NHS investment package brought waiting times down to multi-year lows and boosted public trust in national services.'
      },
      {
        id: 'gb-nhs-digital-triage',
        text: 'Deploy AI Digital Triage & Expand Community Health Hubs',
        flavorPreview: 'Streamline outpatient diagnostics through local community pharmacies and digital appointment apps.',
        expectedEffectsSummary: 'Cost: -₺35,000 | Confidence: +10 | Approval: +8% | Liberals: +10%',
        effects: {
          treasuryDelta: -35000,
          confidenceDelta: 10,
          approvalDelta: 8,
          voterApprovalDelta: { Liberals: 10, Youth: 10 }
        },
        outcomeNarrative: 'Digital health triage reduced hospital emergency room congestion and modernized outpatient healthcare delivery.'
      }
    ]
  },

  // ==========================================
  // 6. DOMESTIC EVENTS - FRANCE (FR)
  // ==========================================
  {
    id: 'dom-fr-pension-labor',
    title: 'National Labor Reform & Trade Union Negotiations',
    icon: '✊',
    scope: 'DOMESTIC',
    countryId: 'FR',
    category: 'POLITICAL',
    urgency: 'HIGH',
    description: 'Major trade unions have organized coordinated transport strikes and public rallies in Paris, Marseille, and Lyon over working conditions, retirement provisions, and purchasing power protections.',
    choices: [
      {
        id: 'fr-tripartite-accord',
        text: 'Convene Tripartite Social Dialogue & Fund Youth Apprenticeships',
        flavorPreview: 'Negotiate with union leaders to introduce early retirement bonuses for arduous labor and expand vocational credits.',
        expectedEffectsSummary: 'Cost: -₺60,000 | Approval: +14% | Workers: +16% | Youth: +14%',
        effects: {
          treasuryDelta: -60000,
          approvalDelta: 14,
          voterApprovalDelta: { Workers: 16, Youth: 14 }
        },
        outcomeNarrative: 'The social accord ended transport disruptions, uniting union representatives and employers behind shared modernization goals.'
      },
      {
        id: 'fr-market-competitiveness',
        text: 'Hold Firm on Fiscal Competitiveness to Reassure European Partners',
        flavorPreview: 'Maintain structural budget reforms to keep sovereign borrowing rates low and attract foreign capital.',
        expectedEffectsSummary: 'Confidence: +14 | Treasury: +₺35,000 | Approval: -6% | Liberals: +12%',
        effects: {
          confidenceDelta: 14,
          treasuryDelta: 35000,
          approvalDelta: -6,
          voterApprovalDelta: { Liberals: 12, Workers: -10 }
        },
        outcomeNarrative: 'Fiscal discipline kept French sovereign bond yields stable, although street protests continued for several weeks.'
      }
    ]
  },

  // ==========================================
  // 7. GLOBAL CONFLICT EVENTS (WARS & DISPUTES)
  // ==========================================
  {
    id: 'glob-eastern-europe-war',
    title: 'Escalating War of Attrition in Eastern Europe',
    icon: '💥',
    scope: 'GLOBAL',
    category: 'MILITARY',
    urgency: 'CRITICAL',
    description: 'Heavy artillery battles and combined-arms offensives rage along the frontline between the sovereign state of Ukraine (supported by NATO allies) and the armed forces of the Russian Federation. Both sides appeal to global capitals for diplomatic backing, munitions deliveries, and trade sanctions.',
    partiesInvolved: {
      partyA: { id: 'UA', name: 'Ukraine & European Coalition', flag: '🇺🇦' },
      partyB: { id: 'RU', name: 'Russian Federation', flag: '🇷🇺' }
    },
    choices: [
      {
        id: 'ee-support-a',
        text: 'Support Ukraine & Western Coalition (Military Aid & Sanctions)',
        flavorPreview: 'Authorize air defense financing, humanitarian logistics, and join international energy embargoes.',
        expectedEffectsSummary: 'Cost: -₺55,000 | Relations with US/EU/UA: +25 | Relations with RU: -35 | Rep: +16 | Approval: +6%',
        effects: {
          treasuryDelta: -55000,
          reputationDelta: 16,
          approvalDelta: 6,
          relationDeltas: { 'US': 25, 'GB': 25, 'DE': 20, 'FR': 20, 'RU': -35 },
          voterApprovalDelta: { Liberals: 12, Youth: 8, Traditionalists: -4 }
        },
        outcomeNarrative: 'Your decisive support strengthened Western alliances, earned gratitude from European partners, but permanently severed energy trade with Moscow.'
      },
      {
        id: 'ee-support-b',
        text: 'Support Russian Federation (Energy Barter & Non-Sanctions Pact)',
        flavorPreview: 'Sign discounted crude and natural gas import agreements and oppose unilateral Western sanctions.',
        expectedEffectsSummary: 'Treasury: +₺65,000 | Relations with RU: +35 | Relations with US/EU: -35 | Rep: -14 | Inflation: -2.0%',
        effects: {
          treasuryDelta: 65000,
          reputationDelta: -14,
          inflationDelta: -2.0,
          approvalDelta: -4,
          relationDeltas: { 'RU': 35, 'CN': 20, 'US': -35, 'GB': -35, 'DE': -30 },
          voterApprovalDelta: { Nationalists: 10, Liberals: -14 }
        },
        outcomeNarrative: 'Discounted energy imports lowered domestic factory fuel costs, but triggered diplomatic backlash and sanctions warnings from Washington and Brussels.'
      },
      {
        id: 'ee-neutral',
        text: 'Maintain Strict Neutrality & Open Trade Corridors',
        flavorPreview: 'Refuse military alignment, protect domestic commerce, and advocate for humanitarian grain corridors.',
        expectedEffectsSummary: 'Treasury: +₺15,000 | Relations: Stable | Reputation: +4 | Approval: +4%',
        effects: {
          treasuryDelta: 15000,
          reputationDelta: 4,
          approvalDelta: 4,
          voterApprovalDelta: { Shopkeepers: 8, Traditionalists: 6 }
        },
        outcomeNarrative: 'Strict non-alignment shielded your economy from retaliatory tariffs and kept diplomatic channels open with all major capitals.'
      },
      {
        id: 'ee-mediate',
        text: 'Host High-Level International Peace & Grain Transit Summit',
        flavorPreview: 'Leverage your diplomatic standing to host peace negotiations in your capital to broker a maritime ceasefire.',
        requiresDiplomaticCapability: true,
        minReputationRequired: 45,
        expectedEffectsSummary: 'Reputation: +26 | Relations with ALL: +18 | Confidence: +14 | Approval: +12%',
        effects: {
          reputationDelta: 26,
          confidenceDelta: 14,
          approvalDelta: 12,
          relationDeltas: { 'US': 18, 'RU': 18, 'DE': 20, 'FR': 20 },
          voterApprovalDelta: { Liberals: 15, Nationalists: 10, Workers: 12 }
        },
        outcomeNarrative: 'Your leadership brokered a landmark Black Sea navigation and prisoner-of-war accord, earning worldwide acclaim as an indispensable global peacemaker!',
        spawnSituation: {
          title: 'International Peace Summit Prestige',
          icon: '🕊️',
          category: 'GEOPOLITICAL',
          description: 'Your capital is now recognized as a premier neutral mediator for international geopolitical disputes.',
          sourceEvent: 'Eastern European War - Peace Mediation',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            reputationDelta: 2,
            confidenceDelta: 1,
            approvalDelta: 0.5
          },
          resolutionOutcome: 'Diplomatic goodwill solidified long-term foreign trade agreements.'
        }
      }
    ]
  },
  {
    id: 'glob-taiwan-strait-crisis',
    title: 'Taiwan Strait Naval Blockade & Semiconductor Standoff',
    icon: '⚓',
    scope: 'GLOBAL',
    category: 'DIPLOMATIC',
    urgency: 'CRITICAL',
    description: 'Massive naval task forces and air defense patrols have established overlapping exclusion zones across the Taiwan Strait. With over 60% of the world\'s advanced microchips produced in the region, global technology and automotive supply chains face an unprecedented freeze.',
    partiesInvolved: {
      partyA: { id: 'TW', name: 'Taiwan & Pacific Coalition', flag: '🇹🇼' },
      partyB: { id: 'CN', name: 'People\'s Republic of China', flag: '🇨🇳' }
    },
    choices: [
      {
        id: 'tw-support-a',
        text: 'Align with Pacific Maritime Coalition & Secure Chip Allocations',
        flavorPreview: 'Endorse freedom of navigation in the Taiwan Strait and secure priority domestic semiconductor shipments.',
        expectedEffectsSummary: 'Cost: -₺40,000 | Relations with US/JP: +25 | Relations with CN: -30 | Confidence: +12',
        effects: {
          treasuryDelta: -40000,
          confidenceDelta: 12,
          approvalDelta: 4,
          relationDeltas: { 'US': 25, 'JP': 25, 'CN': -30 },
          voterApprovalDelta: { Liberals: 10, Shopkeepers: 8 }
        },
        outcomeNarrative: 'Joining the maritime coalition safeguarded your domestic tech industry\'s silicon supplies, though bilateral trade with Beijing slowed.'
      },
      {
        id: 'tw-support-b',
        text: 'Affirm Comprehensive Economic Partnership with China',
        flavorPreview: 'Reaffirm One-China diplomatic ties and sign bilateral direct industrial manufacturing pacts.',
        expectedEffectsSummary: 'Treasury: +₺70,000 | Relations with CN: +35 | Relations with US/JP: -30 | Trade: +15',
        effects: {
          treasuryDelta: 70000,
          tradeModifierDelta: 15,
          approvalDelta: -2,
          relationDeltas: { 'CN': 35, 'US': -30, 'JP': -25 },
          voterApprovalDelta: { Shopkeepers: 10, Liberals: -8 }
        },
        outcomeNarrative: 'Expanding commercial trade with China brought significant export windfalls, despite diplomatic friction with Washington and Tokyo.'
      },
      {
        id: 'tw-neutral',
        text: 'Declare Neutral Strategic Autonomy & Stockpile Domestic Chips',
        flavorPreview: 'Maintain diplomatic ambiguity while subsidizing emergency domestic component inventories.',
        expectedEffectsSummary: 'Cost: -₺25,000 | Confidence: +8 | Relations: Balanced | Approval: +5%',
        effects: {
          treasuryDelta: -25000,
          confidenceDelta: 8,
          approvalDelta: 5,
          voterApprovalDelta: { Nationalists: 8, Workers: 6 }
        },
        outcomeNarrative: 'Strategic autonomy protected domestic manufacturers from supply embargoes without antagonizing either superpower.'
      },
      {
        id: 'tw-mediate',
        text: 'Lead Multilateral ASEAN / UN Maritime De-Escalation Initiative',
        flavorPreview: 'Sponsor a multilateral maritime code-of-conduct summit to reopen international commercial shipping lanes.',
        requiresDiplomaticCapability: true,
        minReputationRequired: 45,
        expectedEffectsSummary: 'Reputation: +24 | Relations with ALL: +16 | Approval: +10% | Trade: +10',
        effects: {
          reputationDelta: 24,
          approvalDelta: 10,
          tradeModifierDelta: 10,
          relationDeltas: { 'US': 16, 'CN': 16, 'JP': 16 },
          voterApprovalDelta: { Liberals: 14, Shopkeepers: 12 }
        },
        outcomeNarrative: 'Your multilateral peace initiative successfully established neutral commercial sea lanes, averting an international economic disaster.'
      }
    ]
  },
  {
    id: 'glob-middle-east-energy-crisis',
    title: 'Gulf Energy Maritime Transit Crisis & Oil Embargo Fears',
    icon: '🛢️',
    scope: 'GLOBAL',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Drone and missile skirmishes along key maritime chokepoints in the Persian Gulf and Strait of Hormuz have sent crude oil futures surging past $120 per barrel. Tanker insurance rates have quadrupled overnight, threatening global transport logistics.',
    partiesInvolved: {
      partyA: { id: 'GULF_ALLIANCE', name: 'Gulf Energy Producers & Western Fleet', flag: '🇸🇦' },
      partyB: { id: 'REGIONAL_FRONT', name: 'Regional Resistance Front & Allies', flag: '🇮🇷' }
    },
    choices: [
      {
        id: 'gulf-support-a',
        text: 'Join Maritime Protection Task Force & Escort Tankers',
        flavorPreview: 'Deploy naval assets to secure energy routes alongside international allies.',
        expectedEffectsSummary: 'Cost: -₺50,000 | Relations with Gulf/US: +25 | Inflation: -1.5% | Rep: +12',
        effects: {
          treasuryDelta: -50000,
          inflationDelta: -1.5,
          reputationDelta: 12,
          approvalDelta: 4,
          relationDeltas: { 'SA': 25, 'US': 20, 'GB': 20 },
          voterApprovalDelta: { Nationalists: 10, Shopkeepers: 8 }
        },
        outcomeNarrative: 'Naval escort patrols secured vital crude deliveries and cemented deep strategic ties with Gulf energy suppliers.'
      },
      {
        id: 'gulf-support-b',
        text: 'Condemn Foreign Military Presence & Seek Alternative Fuel Pacts',
        flavorPreview: 'Advocate for regional non-intervention and sign bilateral energy swaps with independent producers.',
        expectedEffectsSummary: 'Treasury: +₺30,000 | Relations with Non-Aligned: +20 | Relations with Western Powers: -20',
        effects: {
          treasuryDelta: 30000,
          reputationDelta: -6,
          approvalDelta: 2,
          relationDeltas: { 'SA': -15, 'US': -20 },
          voterApprovalDelta: { Traditionalists: 8, Liberals: -8 }
        },
        outcomeNarrative: 'Championing regional sovereignty found favour with non-aligned nations, though Western allies criticized the stance.'
      },
      {
        id: 'gulf-neutral',
        text: 'Release Strategic Domestic Fuel Reserves & Enforce Transport Efficiency',
        flavorPreview: 'Rely on national petroleum reserves while remaining non-aligned in the conflict.',
        expectedEffectsSummary: 'Cost: -₺30,000 | Inflation: -1.0% | Confidence: +6 | Approval: +6%',
        effects: {
          treasuryDelta: -30000,
          inflationDelta: -1.0,
          confidenceDelta: 6,
          approvalDelta: 6,
          voterApprovalDelta: { Workers: 8, Shopkeepers: 6 }
        },
        outcomeNarrative: 'Releasing state fuel reserves cushioned domestic petrol stations without entangling your military overseas.'
      },
      {
        id: 'gulf-mediate',
        text: 'Broker Cairo-Doha Emergency Energy & Navigation Ceasefire',
        flavorPreview: 'Host emergency diplomatic mediation between Gulf littoral powers to guarantee non-targeting of commercial shipping.',
        requiresDiplomaticCapability: true,
        minReputationRequired: 45,
        expectedEffectsSummary: 'Reputation: +25 | Relations with ALL: +20 | Inflation: -2.5% | Approval: +12%',
        effects: {
          reputationDelta: 25,
          inflationDelta: -2.5,
          approvalDelta: 12,
          relationDeltas: { 'SA': 20, 'EG': 20, 'TR': 15, 'US': 15 },
          voterApprovalDelta: { Liberals: 14, Workers: 12, Shopkeepers: 14 }
        },
        outcomeNarrative: 'Your mediation produced a breakthrough commercial non-aggression agreement, causing global oil prices to plunge back to normal levels!'
      }
    ]
  },
  {
    id: 'glob-african-critical-minerals-dispute',
    title: 'Central African Critical Minerals & Cobalt Rail Corridor Dispute',
    icon: '💎',
    scope: 'GLOBAL',
    category: 'ECONOMIC',
    urgency: 'MODERATE',
    description: 'A major border dispute between sovereign nations in Central Africa threatens copper, lithium, and cobalt supply routes vital for global green battery production and electric vehicle manufacturing.',
    partiesInvolved: {
      partyA: { id: 'CORRIDOR_A', name: 'Atlantic Corridor Mining Consortium', flag: '🌐' },
      partyB: { id: 'CORRIDOR_B', name: 'Sovereign Resource Union', flag: '🌍' }
    },
    choices: [
      {
        id: 'minerals-support-a',
        text: 'Back Consortium Rail Infrastructure (Invest & Secure Offtake)',
        flavorPreview: 'Co-finance railway modernization to lock in long-term raw material supply contracts.',
        expectedEffectsSummary: 'Cost: -₺45,000 | Confidence: +14 | Trade: +15 | Relations with EU/US: +15',
        effects: {
          treasuryDelta: -45000,
          confidenceDelta: 14,
          tradeModifierDelta: 15,
          approvalDelta: 4,
          relationDeltas: { 'US': 15, 'DE': 15, 'FR': 15 }
        },
        outcomeNarrative: 'Securing critical mineral offtake guarantees powered your domestic advanced manufacturing sector.'
      },
      {
        id: 'minerals-support-b',
        text: 'Support Sovereign Local Value-Addition & Domestic Refining Mandate',
        flavorPreview: 'Champion local resource sovereignty and partner on domestic processing plants.',
        expectedEffectsSummary: 'Reputation: +16 | Treasury: +₺25,000 | Relations with African Union: +25 | Approval: +6%',
        effects: {
          reputationDelta: 16,
          treasuryDelta: 25000,
          approvalDelta: 6,
          relationDeltas: { 'ZA': 25, 'IN': 15, 'BR': 15 }
        },
        outcomeNarrative: 'Partnering on local refining created high-margin export products and deep goodwill across developing economies.'
      },
      {
        id: 'minerals-neutral',
        text: 'Diversify Domestic Battery R&D with Recycled Minerals',
        flavorPreview: 'Invest in domestic circular recycling plants rather than foreign mining disputes.',
        expectedEffectsSummary: 'Cost: -₺35,000 | Confidence: +8 | Freedom: +4 | Approval: +6%',
        effects: {
          treasuryDelta: -35000,
          confidenceDelta: 8,
          freedomDelta: 4,
          approvalDelta: 6
        },
        outcomeNarrative: 'Investing in domestic mineral recycling insulated your factories from overseas supply shocks.'
      },
      {
        id: 'minerals-mediate',
        text: 'Organize Equitable Joint Infrastructure & Revenue-Sharing Treaty',
        flavorPreview: 'Broker a fair cross-border tariff and revenue-sharing framework between the disputing states.',
        requiresDiplomaticCapability: true,
        minReputationRequired: 42,
        expectedEffectsSummary: 'Reputation: +22 | Relations with ALL: +18 | Confidence: +12 | Approval: +10%',
        effects: {
          reputationDelta: 22,
          confidenceDelta: 12,
          approvalDelta: 10,
          voterApprovalDelta: { Liberals: 12, Shopkeepers: 10 }
        },
        outcomeNarrative: 'Your diplomatic treaty unlocked the mining corridor under shared international auditing, ensuring prosperity for all parties.'
      }
    ]
  }
];
