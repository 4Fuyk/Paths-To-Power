import { StateCrisisEvent } from '../types';

export const STATE_CRISIS_BANK: StateCrisisEvent[] = [
  {
    id: 'crisis-energy-embargo',
    title: 'Global Energy Cartel Supply Bottleneck',
    icon: '⚡',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'An international oil and gas consortium has announced sudden production cuts of 2.5 million barrels per day. Domestic transport and industrial power costs are skyrocketing, threatening runaway inflation.',
    options: [
      {
        text: 'Release Strategic Energy Reserves & Subsidize Tariffs',
        flavorImpact: 'Deploy national petroleum reserves and spend 90,000 to cap domestic fuel prices. Protects households from cost spikes.',
        immediateEffects: {
          treasuryDelta: -90000,
          inflationDelta: -1.5,
          confidenceDelta: 10,
          approvalDelta: 4
        },
        spawnSituation: {
          title: 'Strategic Energy Cushion',
          icon: '🛢️',
          category: 'ECONOMIC',
          description: 'Subsidized fuel prices stabilize factories and household budgets over the coming quarters.',
          sourceEvent: 'Global Energy Supply Bottleneck - Released Strategic Reserves',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            inflationDelta: -0.2,
            confidenceDelta: 1,
            approvalDelta: 0.5
          },
          resolutionOutcome: 'Energy reserve depletion successfully buffered the economy until global supply normalized.'
        }
      },
      {
        text: 'Pass Immediate Green Transition Incentive Package',
        flavorImpact: 'Invest 140,000 into emergency renewable grid acceleration and EV incentives. Short-term friction with massive long-term prestige.',
        immediateEffects: {
          treasuryDelta: -140000,
          reputationDelta: 15,
          confidenceDelta: 12,
          freedomDelta: 5
        },
        spawnSituation: {
          title: 'Renewable Power Surge',
          icon: '🍃',
          category: 'ECONOMIC',
          description: 'Accelerated clean energy deployment lowers foreign fossil reliance and builds green technological exports.',
          sourceEvent: 'Global Energy Supply Bottleneck - Green Transition Act',
          remainingMonths: 8,
          totalDuration: 8,
          monthlyEffects: {
            treasuryDelta: 12000,
            reputationDelta: 1,
            approvalDelta: 0.8
          },
          counterAction: {
            label: 'Expand Grid Grants',
            cost: 50000,
            effectDescription: 'Further speed up solar & wind storage deployment'
          },
          resolutionOutcome: 'Renewable energy infrastructure completed, permanently reducing state energy import bills.'
        }
      },
      {
        text: 'Allow Free Market Price Discovery (Fiscal Austerity)',
        flavorImpact: 'Refuse state market intervention to save state reserves. Consumer prices rise, triggering public protests.',
        immediateEffects: {
          inflationDelta: 3.0,
          confidenceDelta: -8,
          approvalDelta: -6,
          freedomDelta: 3
        },
        spawnSituation: {
          title: 'Consumer Cost of Living Crisis',
          icon: '📉',
          category: 'DOMESTIC',
          description: 'High pump prices cause transport union strikes and consumer spending contraction.',
          sourceEvent: 'Global Energy Supply Bottleneck - Free Market Inaction',
          remainingMonths: 5,
          totalDuration: 5,
          monthlyEffects: {
            approvalDelta: -1.0,
            inflationDelta: 0.3
          },
          counterAction: {
            label: 'Issue Family Relief Checks',
            cost: 60000,
            effectDescription: 'Distribute direct cash vouchers to calm public anger'
          },
          resolutionOutcome: 'Public unrest subsided as global commodity traders rebalanced price differentials.'
        }
      }
    ]
  },
  {
    id: 'crisis-maritime-standoff',
    title: 'Naval Exclusion Zone in International Waters',
    icon: '⚓',
    category: 'GEOPOLITICAL',
    urgency: 'CRITICAL',
    description: 'A hostile regional naval flotilla has established an unauthorized exclusion corridor across key maritime commercial straits, turning away merchant cargo ships and threatening global supply chains.',
    options: [
      {
        text: 'Deploy Carrier Strike Group & Escort Merchant Convoys',
        flavorImpact: 'Mobilize our navy to challenge the blockade directly. Restores free navigation and signals undisputed military resolve.',
        immediateEffects: {
          treasuryDelta: -100000,
          reputationDelta: 18,
          confidenceDelta: 15,
          civilWarRiskDelta: -3
        },
        spawnSituation: {
          title: 'Freedom of Navigation Armada',
          icon: '🚢',
          category: 'MILITARY',
          description: 'Naval escort flotillas maintain undisputed control over trade corridors, boosting commercial import revenue.',
          sourceEvent: 'Naval Exclusion Crisis - Armed Escort Deployment',
          remainingMonths: 7,
          totalDuration: 7,
          monthlyEffects: {
            treasuryDelta: 18000,
            reputationDelta: 2
          },
          resolutionOutcome: 'The hostile navy withdrew their exclusion zone after seeing our decisive naval posture.'
        }
      },
      {
        text: 'Enact Severe Multilateral Financial Sanctions',
        flavorImpact: 'Rally allied nations to freeze overseas central bank assets and embargo electronics exports to the offending state.',
        immediateEffects: {
          treasuryDelta: -30000,
          reputationDelta: 12,
          confidenceDelta: 8,
          freedomDelta: 2
        },
        spawnSituation: {
          title: 'Coordinated Diplomatic Sanctions Regimes',
          icon: '📜',
          category: 'GEOPOLITICAL',
          description: 'Diplomatic sanctions mount immense pressure on the adversary while bolstering international law coalitions.',
          sourceEvent: 'Naval Exclusion Crisis - Multilateral Sanctions Package',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            reputationDelta: 1.5,
            confidenceDelta: 1
          },
          resolutionOutcome: 'Sanctions pressure forced the adversary to negotiate a maritime de-escalation treaty.'
        }
      },
      {
        text: 'Reroute Commercial Shipping via Overland Railways',
        flavorImpact: 'Avoid military confrontation entirely by subsidizing alternative rail transit routes. Costs treasury and signals weakness.',
        immediateEffects: {
          treasuryDelta: -80000,
          reputationDelta: -12,
          confidenceDelta: -6,
          approvalDelta: -4
        },
        spawnSituation: {
          title: 'Overland Logistics Congestion',
          icon: '🚆',
          category: 'ECONOMIC',
          description: 'Rail freight bottlenecks lead to minor factory shipment delays across several export zones.',
          sourceEvent: 'Naval Exclusion Crisis - Transit Route Detour',
          remainingMonths: 4,
          totalDuration: 4,
          monthlyEffects: {
            inflationDelta: 0.2
          },
          resolutionOutcome: 'New rail terminals cleared backlogs, returning commercial flow to baseline capacity.'
        }
      }
    ]
  },
  {
    id: 'crisis-border-skirmish',
    title: 'Frontline Border Outpost Provocation',
    icon: '⚔️',
    category: 'MILITARY',
    urgency: 'CRITICAL',
    description: 'Armed insurgent squads backed by a rogue neighboring regime have raided two border garrisons, inflicting casualties and taking tactical observation hills.',
    options: [
      {
        text: 'Launch Immediate Combined-Arms Counter-Offensive',
        flavorImpact: 'Authorize airstrikes and armored spearheads to retake sovereign territory and destroy hostile staging bases.',
        immediateEffects: {
          treasuryDelta: -120000,
          reputationDelta: 10,
          confidenceDelta: 10,
          civilWarRiskDelta: -8,
          approvalDelta: 6
        },
        spawnSituation: {
          title: 'Iron Shield Border Fortification',
          icon: '🛡️',
          category: 'MILITARY',
          description: 'Frontline troops hold elevated strategic outposts, deterring all cross-border hostile incursions.',
          sourceEvent: 'Border Outpost Provocation - Combined Arms Counter-Attack',
          remainingMonths: 8,
          totalDuration: 8,
          monthlyEffects: {
            approvalDelta: 0.5,
            confidenceDelta: 1
          },
          counterAction: {
            label: 'Install Radar Surveillance',
            cost: 45000,
            effectDescription: 'Permanently eliminate blind spots along the frontier'
          },
          resolutionOutcome: 'Hostile forces retreated 30km behind the demarcation line following the decisive counter-blow.'
        }
      },
      {
        text: 'Fortify Defense Lines & Request UN Peacekeeper Monitors',
        flavorImpact: 'Avoid escalation. Establish heavily reinforced trenches and invite international observer teams to inspect the border.',
        immediateEffects: {
          treasuryDelta: -50000,
          reputationDelta: 14,
          freedomDelta: 3,
          approvalDelta: -2
        },
        spawnSituation: {
          title: 'UN Blue Helmet Border Zone',
          icon: '🕊️',
          category: 'GEOPOLITICAL',
          description: 'International peacekeepers patrol the buffer zone, ensuring ceasefire compliance.',
          sourceEvent: 'Border Outpost Provocation - Peacekeeper Deployment',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            reputationDelta: 2,
            treasuryDelta: -5000
          },
          resolutionOutcome: 'A formal demilitarized buffer zone was established under international treaty.'
        }
      }
    ]
  },
  {
    id: 'crisis-intelligence-breach',
    title: 'Classified Sovereign Intelligence Leak',
    icon: '🕵️',
    category: 'DOMESTIC',
    urgency: 'HIGH',
    description: 'An encrypted state database holding foreign communications transcripts and domestic surveillance memos has been leaked by a whistleblower to global press syndicates.',
    options: [
      {
        text: 'Embrace Radical Transparency & Reform Intelligence Mandate',
        flavorImpact: 'Publicly acknowledge the leaks, declassify obsolete files, and establish independent judicial oversight.',
        immediateEffects: {
          freedomDelta: 15,
          reputationDelta: 12,
          confidenceDelta: -5,
          approvalDelta: 5
        },
        spawnSituation: {
          title: 'Democratic Transparency Epoch',
          icon: '⚖️',
          category: 'DOMESTIC',
          description: 'Enhanced civic oversight and freedom of information rebuild trust between citizens and state institutions.',
          sourceEvent: 'Intelligence Leak - Democratic Transparency Mandate',
          remainingMonths: 7,
          totalDuration: 7,
          monthlyEffects: {
            freedomDelta: 1,
            approvalDelta: 0.6
          },
          resolutionOutcome: 'Judicial reforms established a globally celebrated standard for constitutional intelligence oversight.'
        }
      },
      {
        text: 'Crack Down on Whistleblower Networks & Tighten State Secrets',
        flavorImpact: 'Invoke national security emergency clauses to halt publication and raid unauthorized digital distribution nodes.',
        immediateEffects: {
          freedomDelta: -18,
          reputationDelta: -10,
          confidenceDelta: 6,
          approvalDelta: -5
        },
        spawnSituation: {
          title: 'Internal Security Lockdown',
          icon: '🔒',
          category: 'DOMESTIC',
          description: 'Stricter internet surveillance protects technical secrets but fuels student and journalist dissent.',
          sourceEvent: 'Intelligence Leak - State Security Crackdown',
          remainingMonths: 5,
          totalDuration: 5,
          monthlyEffects: {
            freedomDelta: -1,
            approvalDelta: -0.5
          },
          counterAction: {
            label: 'Grant Media Amnesty',
            cost: 30000,
            effectDescription: 'Drop charges against journalists to heal public trust'
          },
          resolutionOutcome: 'State security protocols were overhauled without further unauthorized disclosures.'
        }
      }
    ]
  },
  {
    id: 'crisis-sovereign-debt',
    title: 'Sovereign Bond Speculation & Credit Rating Review',
    icon: '📈',
    category: 'ECONOMIC',
    urgency: 'HIGH',
    description: 'Wall Street credit agencies are threatening a sovereign debt downgrade due to global interest rate pressures and fiscal deficit projections.',
    options: [
      {
        text: 'Pass Comprehensive Fiscal Discipline & Tech Investment Bill',
        flavorImpact: 'Targeted spending cuts paired with high-yield tech infrastructure tax exemptions. Secures an upgraded AAA rating.',
        immediateEffects: {
          treasuryDelta: -60000,
          confidenceDelta: 22,
          inflationDelta: -1.2,
          reputationDelta: 10
        },
        spawnSituation: {
          title: 'Prime Sovereign Credit Rating',
          icon: '🌟',
          category: 'ECONOMIC',
          description: 'Low borrowing bond yields attract multinational headquarters and institutional capital to domestic markets.',
          sourceEvent: 'Credit Rating Review - Fiscal Discipline Package',
          remainingMonths: 8,
          totalDuration: 8,
          monthlyEffects: {
            treasuryDelta: 25000,
            confidenceDelta: 1.5
          },
          resolutionOutcome: 'The sovereign credit rating was confirmed at prime status, saving billions in annual bond servicing.'
        }
      },
      {
        text: 'Nationalize Strategic Industries & Introduce Capital Controls',
        flavorImpact: 'Protect domestic assets from foreign hedge funds. Repels speculative attacks but cools foreign investor sentiment.',
        immediateEffects: {
          treasuryDelta: 80000,
          confidenceDelta: -15,
          freedomDelta: -6,
          approvalDelta: 3
        },
        spawnSituation: {
          title: 'State Capitalism Framework',
          icon: '🏭',
          category: 'ECONOMIC',
          description: 'State enterprises operate under direct executive control, funneling production dividends into the treasury.',
          sourceEvent: 'Credit Rating Review - Strategic Nationalization',
          remainingMonths: 6,
          totalDuration: 6,
          monthlyEffects: {
            treasuryDelta: 15000,
            confidenceDelta: -1
          },
          resolutionOutcome: 'State enterprises consolidated national supply lines, providing reliable public revenue.'
        }
      }
    ]
  },
  {
    id: 'crisis-cyber-offensive',
    title: 'Critical National Grid Cyber Siege',
    icon: '💻',
    category: 'CRISIS',
    urgency: 'CRITICAL',
    description: 'Foreign state-sponsored hacker syndicates have injected zero-day payloads into national power grid switches and central bank payment gateways.',
    options: [
      {
        text: 'Activate Cyber Defense Command & Counter-Infiltrate',
        flavorImpact: 'Mobilize military cyber units to neutralize malicious payloads and retaliate against enemy command servers.',
        immediateEffects: {
          treasuryDelta: -75000,
          confidenceDelta: 14,
          reputationDelta: 8,
          approvalDelta: 4
        },
        spawnSituation: {
          title: 'Encrypted Infrastructure Fortress',
          icon: '🛡️',
          category: 'MILITARY',
          description: 'State quantum-resistant firewalls prevent financial sabotage and ensure 99.9% power grid reliability.',
          sourceEvent: 'Grid Cyber Siege - Cyber Defense Command Strike',
          remainingMonths: 7,
          totalDuration: 7,
          monthlyEffects: {
            confidenceDelta: 1,
            treasuryDelta: 10000
          },
          resolutionOutcome: 'All malicious payloads were purged and enemy command servers neutralized.'
        }
      },
      {
        text: 'Airgap Critical Systems & Mandate Offline Manual Fallbacks',
        flavorImpact: 'Physically disconnect sensitive registries from public internet. Foolproof security at the cost of processing speed.',
        immediateEffects: {
          treasuryDelta: -30000,
          confidenceDelta: -5,
          freedomDelta: -3
        },
        spawnSituation: {
          title: 'Airgapped Bureaucracy Protocol',
          icon: '📑',
          category: 'DOMESTIC',
          description: 'Paper and local terminal verification prevents hacks but slows down public permit issuance.',
          sourceEvent: 'Grid Cyber Siege - Airgap Mandate',
          remainingMonths: 4,
          totalDuration: 4,
          monthlyEffects: {
            approvalDelta: -0.4
          },
          resolutionOutcome: 'Digital systems were safely re-integrated with newly verified firmware.'
        }
      }
    ]
  }
];
