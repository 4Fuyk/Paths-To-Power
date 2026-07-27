/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party, MinisterCandidate, Coalition } from './types';
import { PLAYABLE_COUNTRIES } from './constants/countries';
import { ALL_PRESS_QUESTIONS } from './constants/pressQuestions';
import { ThemeToggle } from './components/ThemeToggle';
import { WorldMap } from './components/WorldMap';
import { PartyCreator } from './components/PartyCreator';
import { CampaignView } from './components/CampaignView';
import { ParliamentView } from './components/ParliamentView';
import { CongressView } from './components/CongressView';
import { FinanceView } from './components/FinanceView';
import { ElectionSimulator } from './components/ElectionSimulator';
import { PartyCongressView } from './components/PartyCongressView';
import { TacticalBattleView } from './components/TacticalBattleView';
import { CabinetView } from './components/CabinetView';
import { DiplomacyView } from './components/DiplomacyView';
import { GovernanceView } from './components/GovernanceView';
import { CivicWatchdogView } from './components/CivicWatchdogView';
import { MilitaryView } from './components/MilitaryView';
import { 
  Landmark, Megaphone, Users, Award, Calendar, 
  Coins, HelpCircle, RefreshCw, LogOut, CheckCircle, Info, X, Play,
  Volume2, VolumeX, Briefcase, Globe, TrendingUp, ShieldAlert, Scale, UserX, AlertTriangle, ShieldCheck, Shield
} from 'lucide-react';
import { isMuted, setMuted, playSound } from './lib/sounds';
import { syncRegionOwnersAndMayors } from './utils/mayorUtils';

const getDynamicIRLNews = (countryId: string | undefined, isRuling: boolean, playerPartyName?: string) => {
  const globalNews = [
    "🌐 GLOBAL FOCUS: Central banks around the world signal interest rate cuts as global inflation begins to cool.",
    "⚡ TECH MONITOR: Artificial Intelligence regulations (AI Act) take full effect, prompting tech hubs to restructure compliance.",
    "📣 ENVIRONMENT WATCH: Climate summits raise pressure on sovereign states to phase out thermal coal and triple renewable capacity.",
    "📈 MARKET REPORT: Nasdaq and Nikkei hit fresh record highs amid strong semiconductor demand and tech earnings.",
    "🛡️ DEFENSE LOG: Naval exercises in international waters reinforce maritime shipping route security protocols."
  ];

  if (!countryId) {
    return globalNews;
  }

  const countrySpecific: Record<string, string[]> = {
    TR: [
      "🇹🇷 CENTRAL BANK REPORT: The Central Bank announced its interest rate decision; tight monetary policy continues in the fight against inflation.",
      "🗳️ DOMESTIC POLITICS: New constitution debates and inter-party alliance negotiations in parliament have accelerated.",
      "🏙️ MUNICIPAL NEWS: Istanbul and Ankara municipalities are increasing budgets for urban renewal and earthquake prep.",
      "⚓ GEOPOLITICS: Energy exploration and diplomatic dialogues in the Eastern Mediterranean are being closely monitored.",
      "📊 INFLATION DATA: Monthly inflation figures announced; consumer price index changes dominate public discourse."
    ],
    US: [
      "🇺🇸 WASHINGTON BRIEF: Bipartisan Congressional committees lock horns over federal budget limits and national debt ceilings.",
      "🏛️ FEDERAL RESERVE: Chairman Powell indicates interest rates may stay 'higher for longer' depending on upcoming jobs data.",
      "🗳️ CAMPAIGN RAIL: Primary polls show tightening margins as key swing states of Pennsylvania and Wisconsin draw heavy ad spend.",
      "🛡️ BORDER SECURITY: Legislative battles intensify over foreign aid packages paired with national border enforcement funding.",
      "🚀 AEROSPACE LOG: NASA announces new schedule targets for the Artemis crewed lunar landings in collaboration with SpaceX."
    ],
    DE: [
      "🇩🇪 BERLIN REPORT: Chancellor Scholz's traffic-light coalition faces intense policy debates over budget allocations.",
      "📈 ECONOMIC FOCUS: German industrial sectors report rising export demand despite higher energy costs and supply bottlenecks.",
      "🗳️ STATE ELECTIONS: Rising support for alternative factions in eastern states prompts strategy meetings among mainstream parties.",
      "🚆 INFRALOG: Deutsche Bahn announces massive modernization investments to resolve network delays and infrastructure backlogs.",
      "🍃 ENERGIEWENDE: Federal network agency reports wind power hit a record 43% share of national electricity generation."
    ],
    GB: [
      "🇬🇧 WESTMINSTER FEED: Keir Starmer's Labour government presents new NHS funding reforms and green energy transition bills.",
      "📈 COST OF LIVING: Bank of England monitors retail spending as inflation drops back to the target 2.0% rate.",
      "🚢 HOME OFFICE: Debate intensifies in the House of Commons over immigration policies and asylum processing centers.",
      "🏙️ LOCAL GOVERNMENT: Multiple councils appeal for emergency financial assistance amid rising social care costs.",
      "🍃 ENERGY GRID: UK successfully operates for a full month without coal power, marking a historic carbon-reduction milestone."
    ],
    JP: [
      "🇯🇵 TOKYO DAILY: Prime Minister Ishiba emphasizes national defense budget hikes and wage-inflation cycle support.",
      "💴 YEN EXCHANGE: Bank of Japan monitors currency volatility as the Yen showing signs of recovery against the USD.",
      "🔌 TECH FOCUS: Massive semiconductor fabricators in Kumamoto begin pilot production runs, securing domestic chip supply.",
      "🗻 TOKYO STOCK: Nikkei 225 index fluctuates near historic levels as multinational corporations report record export revenues.",
      "🍁 SOCIAL MONITOR: Ministry of Health proposes fresh nursery subsidies and parental leave expansions to boost birth rates."
    ],
    IT: [
      "🇮🇹 ROMA FEED: Meloni's administration defends the national maritime migration plan and digital infrastructure investments.",
      "🗳️ OPPOSITION UNION: Elly Schlein (PD) and Giuseppe Conte (M5S) hold public rallies to form a unified center-left alliance.",
      "🏛️ FINANCIAL NOTE: Ministry of Finance implements the superbonus tax reform package to curb national deficit spikes.",
      "🍇 ECONOMY BAROMETER: Agribusiness and high-end fashion exports lead Italy's economic growth indicators in the Eurozone.",
      "🛶 VENICE WATCH: Conservation committees test upgraded MOSE barrier systems amid exceptional high tide warnings."
    ],
    ES: [
      "🇪🇸 MADRID MONITOR: Sanchez's cabinet faces parliamentary inquiries over the implementation of the regional amnesty bills.",
      "🗳️ OPPOSITION DRIVE: PP leader Núñez Feijóo organizes national demonstrations calling for immediate early general elections.",
      "🏖️ TOURISM REFORM: Regional governments in Barcelona and Malaga announce stricter regulations on short-term holiday rentals.",
      "🌾 CLIMATE CHALLENGE: Agriculture ministry allocates emergency irrigation funds to combat prolonged dry spells in Andalusia.",
      "🚇 TRANSIT FOCUS: Government expands free regional train travel passes to ease cost-of-living pressures for young workers."
    ],
    ID: [
      "🇮🇩 JAKARTA PRESS: President Prabowo outlines smooth transition policies focusing on infrastructure and digital education.",
      "🏗️ IKN MONITOR: Construction of the new capital city Nusantara (IKN) in Kalimantan enters its final Phase 2 rollout.",
      "🪙 TRADE RECORD: Mineral export revenues surge as nickel processing refineries in Sulawesi expand production capacity.",
      "🗳️ REGIONAL POLLS: Dynamic campaigns begin across Jakarta and West Java as candidates compete for key governorships.",
      "🌋 RISK ALERTS: Volcano monitoring agencies issue updated safety guidelines for active regions in East Java."
    ],
    IN: [
      "🇮🇳 NEW DELHI MON: Prime Minister Narendra Modi's third-term cabinet focuses on manufacturing incentives and digital public infra.",
      "📊 GDP REPORT: India remains the fastest-growing major economy, posting a 7.2% annualized growth rate.",
      "🌾 RURAL FOCUS: Agriculture minister announces updated minimum support prices (MSP) for essential monsoon crops.",
      "🛰️ ISRO LOG: Indian Space Research Organisation prepares to launch the crewless Gaganyaan test flight in late autumn.",
      "🗳️ POLL WATCH: Tight local legislative contests in Maharashtra and Haryana draw intensive campaign visits by national leaders."
    ],
    KR: [
      "🇰🇷 SEOUL BRIEF: Political deadlock continues in the National Assembly over Special Counsel investigation bills.",
      "🏥 MEDICAL CRISIS: Health ministry initiates dialogue rounds with resident doctors over medical school admission quotas.",
      "🔌 CHIP WAR: Samsung and SK Hynix announce massive joint R&D investments in the Yongin semiconductor super-cluster.",
      "👶 POPULATION TASK: Presidential committee proposes cash-allowance bundles and housing priorities for newlywed couples.",
      "🛡️ DEFENSE SHIELD: Combined military exercises conducted to reinforce readiness posture amid regional tensions."
    ],
    MX: [
      "🇲🇽 MEXICO CITY: President Claudia Sheinbaum defends the judicial reform bills ensuring popular election of magistrates.",
      "📈 NEARSHORING BOOM: Northern states of Nuevo León and Coahuila report record industrial park occupancy by auto suppliers.",
      "🌳 TREN MAYA: Federal developers complete the final southern loop, connecting major Yucatan archaeological sites.",
      "💲 PESO FLUCTUATIONS: Banco de México adjusts interest rates to maintain stable exchange rates amid US trade reviews.",
      "🛡️ SECURITY UPDATE: National Guard expands specialized highway safety patrols to protect commercial cargo trucks."
    ],
    AU: [
      "🇦🇺 CANBERRA PRESS: Albanese's administration outlines housing affordability initiatives and rental assistance programs.",
      "🛡️ AUKUS DEBATE: Defense minister details ship-building timelines and strategic technology partnerships in South Australia.",
      "📉 INTEREST RATES: RBA Governor warns of persistent service-sector inflation, keeping rate-cut expectations on hold.",
      "🪸 ECO SYSTEM: Great Barrier Reef marine authorities report positive coral recovery rates following winter surveys.",
      "🗳️ FEDERAL OUTLOOK: Coalition leader Peter Dutton targets suburban swing seats in Queensland and Western Australia."
    ]
  };

  const selectedList = countrySpecific[countryId] || globalNews;
  
  // Create a mixed feed of 4 country-specific items + 2 global items
  const mixedFeed = [
    ...selectedList.slice(0, 4),
    globalNews[Math.floor(Math.random() * globalNews.length)],
    globalNews[(Math.floor(Math.random() * globalNews.length) + 1) % globalNews.length]
  ];

  if (isRuling && playerPartyName) {
    mixedFeed.push(
      `🏛️ CABINET HIGHLIGHT: Prime Minister's office (${playerPartyName}) coordinates with parliament on upcoming reform packages.`,
      "📊 STATE STATUS: Economic feedback indicates high treasury efficiency. Voter response is monitored."
    );
  }

  return mixedFeed;
};

export default function App() {
  // Global States
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('world_political_dark_mode');
    return saved !== null ? saved === 'true' : true; // Default to immersive dark mode
  });

  const [completedCountries, setCompletedCountries] = useState<string[]>(() => {
    const saved = localStorage.getItem('completed_world_countries');
    return saved ? JSON.parse(saved) : [];
  });
  const [countryWinCounts, setCountryWinCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('country_win_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeScreen, setActiveScreen] = useState<'START_SCREEN' | 'MAP' | 'PARTY_CREATOR' | 'MAIN_DASHBOARD' | 'ELECTION_SIMULATOR' | 'PARTY_CONGRESS'>('START_SCREEN');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [playerParty, setPlayerParty] = useState<Party | null>(null);
  const [campaignTurn, setCampaignTurn] = useState<number>(1); // 1 to country.campaignTurns

  const [dashboardTab, setDashboardTab] = useState<string>('CAMPAIGN');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [warningAlert, setWarningAlert] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);
  const [showElectionSuccessModal, setShowElectionSuccessModal] = useState<boolean>(false);
  const [showPressConference, setShowPressConference] = useState<boolean>(false);
  const [activePressQuestions, setActivePressQuestions] = useState<any[]>([]);
  const [pressConferenceIndex, setPressConferenceIndex] = useState<number>(0);
  const [pressTreasuryBonus, setPressTreasuryBonus] = useState<number>(0);
  const [pressFreedomBonus, setPressFreedomBonus] = useState<number>(0);
  const [pressReputationBonus, setPressReputationBonus] = useState<number>(0);

  // Sovereign Government and Diplomacy States
  const [isRuling, setIsRuling] = useState<boolean>(false);

  const newsTickerItems = React.useMemo(() => {
    return getDynamicIRLNews(selectedCountry?.id, isRuling, playerParty?.name);
  }, [selectedCountry?.id, isRuling, campaignTurn, playerParty?.name]);

  const [hasReshuffledPrompt, setHasReshuffledPrompt] = useState<boolean>(false);
  const [coalitions, setCoalitions] = useState<Coalition[]>([]);
  const [electionSeats, setElectionSeats] = useState<Record<string, number> | null>(null);
  const [rulingMonthsCount, setRulingMonthsCount] = useState<number>(0);
  const [isJuniorMember, setIsJuniorMember] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<{
    title: string;
    description: string;
    options: {
      text: string;
      effect: () => void;
    }[];
  } | null>(null);

  const [cabinet, setCabinet] = useState<Record<string, MinisterCandidate | null>>({});

  const [taxRates, setTaxRates] = useState({
    income: 25,
    corporate: 20,
    vat: 18,
    tariffs: 10
  });

  const [investorConfidence, setInvestorConfidence] = useState<number>(75);
  const [treasury, setTreasury] = useState<number>(1000000);
  const [inflation, setInflation] = useState<number>(3.5);
  const [freedomIndex, setFreedomIndex] = useState<number>(85);
  const [bannedParties, setBannedParties] = useState<string[]>([]);
  const [civilWarRisk, setCivilWarRisk] = useState<number>(0);
  const [internationalReputation, setInternationalReputation] = useState<number>(80);

  const [diplomaticRelations, setDiplomaticRelations] = useState<Record<string, { status: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }>>({
    TR: { status: 'Neutral', opinion: 50 },
    US: { status: 'Neutral', opinion: 55 },
    DE: { status: 'Neutral', opinion: 60 },
    GB: { status: 'Neutral', opinion: 50 },
    BR: { status: 'Neutral', opinion: 45 },
    EG: { status: 'Neutral', opinion: 40 },
    JP: { status: 'Neutral', opinion: 65 }
  });
  const [muted, setMutedState] = useState(isMuted());

  const handleToggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    if (!next) {
      playSound('click');
    }
  };

  // Sync completion tracker with localStorage
  useEffect(() => {
    localStorage.setItem('completed_world_countries', JSON.stringify(completedCountries));
  }, [completedCountries]);

  useEffect(() => {
    localStorage.setItem('country_win_counts', JSON.stringify(countryWinCounts));
  }, [countryWinCounts]);

  // Sync dark mode style settings
  useEffect(() => {
    localStorage.setItem('world_political_dark_mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Settle country picker
  const handleSelectCountry = (country: Country) => {
    const startCampaignFlow = (targetCountry: Country) => {
      setIsRuling(false);
      setElectionSeats(null);

      // Reset starting region support configurations for the simulation run
      const preppedRegions = targetCountry.regions.map((region, index) => {
        const supports: Record<string, number> = {};
        const playerStart = 3 + Math.floor(Math.random() * 12); // Randomized player start between 3% and 14%
        supports['player_party'] = playerStart;
        
        const hasPreseeded = region.supports && Object.keys(region.supports).length > 0;
        if (hasPreseeded) {
          const remaining = 100 - playerStart;
          // Apply a per-region randomized multiplier (+/- 35%) to create highly unique support ratios for each region
          const regionalRatios: Record<string, number> = {};
          Object.entries(region.supports).forEach(([rivalId, val]) => {
            const randomFactor = 0.95 + Math.random() * 0.10; // Random factor between 0.65 and 1.35
            regionalRatios[rivalId] = val * randomFactor;
          });

          const preseededSum = Object.values(regionalRatios).reduce((sum, v) => sum + v, 0);
          Object.entries(regionalRatios).forEach(([rivalId, val]) => {
            supports[rivalId] = (val / preseededSum) * remaining;
          });
        } else {
          // Rivals share the remaining support based on their base support quotients with wider randomized variation
          const regionalRatios: Record<string, number> = {};
          targetCountry.rivals.forEach((rival) => {
            const randomFactor = 0.90 + Math.random() * 0.20; // Random factor between 0.50 and 1.50
            regionalRatios[rival.id] = rival.baseSupport * randomFactor;
          });

          const totalRivalBase = Object.values(regionalRatios).reduce((sum, v) => sum + v, 0);
          let sharedRemaining = 100 - playerStart;

          targetCountry.rivals.forEach((rival) => {
            const share = (regionalRatios[rival.id] || rival.baseSupport) / totalRivalBase;
            supports[rival.id] = share * sharedRemaining;
          });
        }

        // Normalize accurate sum to 100%
        const currentSum = Object.values(supports).reduce((s, v) => s + v, 0);
        if (Math.abs(currentSum - 100) > 0.1) {
          const factor = 100 / currentSum;
          Object.keys(supports).forEach(k => {
            supports[k] = supports[k] * factor;
          });
        }

        // Determine the rival with the highest starting support in this region on startup to set as the owner dynamically
        let highestRivalId = '';
        let maxSupport = -1;
        Object.entries(supports).forEach(([rivalId, supportVal]) => {
          if (rivalId !== 'player_party' && supportVal > maxSupport) {
            maxSupport = supportVal;
            highestRivalId = rivalId;
          }
        });

        return {
          ...region,
          supports,
          ownerPartyId: highestRivalId || region.ownerPartyId,
          campaignLevel: 0
        };
      });

      const syncedRegions = syncRegionOwnersAndMayors(preppedRegions, targetCountry.id, undefined, targetCountry.rivals);
      const initCountry = { ...targetCountry, regions: syncedRegions };
      setSelectedCountry(initCountry);
      setActiveScreen('PARTY_CREATOR');
    };

    startCampaignFlow(country);
  };

  // Party assembly creation callback
  const handleCreateParty = (party: Party) => {
    let updatedCountry = selectedCountry;
    let matchedRival: any = undefined;

    if (selectedCountry) {
      // Find matching rival to prevent duplicate preset parties
      matchedRival = selectedCountry.rivals.find(r => 
        r.name.toLowerCase().trim() === party.name.toLowerCase().trim() ||
        party.name.toLowerCase().trim().includes(r.id.toLowerCase().trim()) ||
        r.id.toLowerCase().trim() === party.name.toLowerCase().trim() ||
        (party.name.includes("CHP") && r.id === "CHP") ||
        (party.name.includes("AK Parti") && r.id === "AKP") ||
        (party.name.includes("DEM") && r.id === "DEM") ||
        (party.name.includes("MHP") && r.id === "MHP") ||
        (party.name.includes("Yeniden Refah") && r.id === "YRP") ||
        (party.name.includes("YRP") && r.id === "YRP") ||
        (party.name.includes("Zafer") && r.id === "ZAFER") ||
        (party.name.includes("Yeni") && r.id === "YENI") ||
        (party.name.includes("YENI") && r.id === "YENI") ||
        (party.name.includes("TİP") && r.id === "TIP") ||
        (party.name.includes("TKP") && r.id === "TKP") ||
        (party.name.includes("Saadet") && r.id === "SAADET") ||
        (party.name.includes("DEVA") && r.id === "DEVA") ||
        (party.name.includes("Gelecek") && r.id === "GELECEK") ||
        (party.name.includes("Vatan") && r.id === "VATAN") ||
        (party.name.includes("CDU") && r.id === "CDU") ||
        (party.name.includes("AfD") && r.id === "AfD") ||
        (party.name.includes("SPD") && r.id === "SPD") ||
        (party.name.includes("GRÜNE") && r.id === "GRÜNE") ||
        (party.name.includes("LINKE") && r.id === "LINKE") ||
        (party.name.includes("BSW") && r.id === "BSW") ||
        (party.name.includes("FDP") && r.id === "FDP") ||
        (party.name.includes("SSW") && r.id === "SSW") ||
        (party.name.includes("Republican Party") && r.id === "REP") ||
        (party.name.includes("Democratic Party") && r.id === "DEM_US") ||
        (party.name.includes("Libertarian Party") && r.id === "LP") ||
        (party.name.includes("Green Party") && r.id === "GP")
      );

      if (matchedRival) {
        // Swap supports from matchedRival to player_party so the player starts with their real historical support base!
        let updatedRegions = selectedCountry.regions.map(r => {
          const supports = { ...r.supports };
          const rivalVal = supports[matchedRival.id] || 0;
          const playerStartVal = supports['player_party'] || 0;

          // Merge matched rival support base into player_party
          supports['player_party'] = rivalVal + playerStartVal;
          delete supports[matchedRival.id];

          return { ...r, supports };
        });

        // Normalize supports to exactly 100%
        updatedRegions = updatedRegions.map(r => {
          const supports = { ...r.supports };
          const sum = Object.keys(supports).reduce((s, k) => s + (supports[k] || 0), 0);
          if (sum > 0 && Math.abs(sum - 100) > 0.1) {
            const scale = 100 / sum;
            Object.keys(supports).forEach(k => {
              supports[k] = parseFloat((supports[k] * scale).toFixed(2));
            });
          }
          return { ...r, supports };
        });

        const updatedRivals = selectedCountry.rivals.filter(r => r.id !== matchedRival.id);
        const syncedRegions = syncRegionOwnersAndMayors(updatedRegions, selectedCountry.id, party, updatedRivals);
        updatedCountry = {
          ...selectedCountry,
          rivals: updatedRivals,
          regions: syncedRegions
        };
        setSelectedCountry(updatedCountry);
        setIsJuniorMember(true);
      } else {
        setIsJuniorMember(false);
      }
    }

    setPlayerParty(party);
    setCampaignTurn(1);

    if (matchedRival) {
      setActiveScreen('PARTY_CONGRESS');
    } else {
      setDashboardTab('CAMPAIGN');
      setActiveScreen('MAIN_DASHBOARD');
    }
  };

  const handleWinCongress = (leaderChoice: 'own' | 'figurehead', newLeaderName: string, pollingShift: number) => {
    if (!selectedCountry || !playerParty) return;

    // Update player party leader
    const updatedParty: Party = {
      ...playerParty,
      leader: newLeaderName,
    };
    if (leaderChoice === 'own') {
      updatedParty.photo = ''; // Reset photo for custom face
    }
    setPlayerParty(updatedParty);

    // Calculate old support percentage (Y%) before shift
    const totalRegions = selectedCountry.regions.length;
    const oldAvgSupport = selectedCountry.regions.reduce((acc, r) => acc + (r.supports[playerParty.id] || 0), 0) / totalRegions;

    // Apply the shift to all regions
    const updatedRegions = selectedCountry.regions.map(r => {
      const supports = { ...r.supports };
      const currentSupport = supports[playerParty.id] || 0;
      // Shift support in this region
      const targetSupport = Math.min(95, Math.max(1, currentSupport + pollingShift));
      supports[playerParty.id] = targetSupport;

      // Adjust other rivals proportionally to maintain 100%
      const otherParties = Object.keys(supports).filter(id => id !== playerParty.id);
      const otherSum = otherParties.reduce((sum, id) => sum + (supports[id] || 0), 0);
      const neededOtherSum = 100 - targetSupport;

      if (otherSum > 0) {
        const factor = neededOtherSum / otherSum;
        otherParties.forEach(id => {
          supports[id] = parseFloat((supports[id] * factor).toFixed(2));
        });
      }

      // Final normalization check
      const sum = Object.keys(supports).reduce((s, k) => s + (supports[k] || 0), 0);
      if (Math.abs(sum - 100) > 0.05) {
        const scale = 100 / sum;
        Object.keys(supports).forEach(k => {
          supports[k] = parseFloat((supports[k] * scale).toFixed(2));
        });
      }

      return { ...r, supports };
    });

    const newAvgSupport = updatedRegions.reduce((acc, r) => acc + (r.supports[playerParty.id] || 0), 0) / totalRegions;

    // Set updated country
    setSelectedCountry({
      ...selectedCountry,
      regions: updatedRegions
    });

    // Mark as no longer junior member since we have won the congress
    setIsJuniorMember(false);
    setDashboardTab('CAMPAIGN');
    setActiveScreen('MAIN_DASHBOARD');

    // Trigger state governance alert or news report event for the polling shift
    setCurrentEvent({
      title: 'CONGRESS POLL SHIFT NEWS',
      description: `Following the dramatic leadership transition at the ${playerParty.name} Extraordinary Congress, political pollsters have updated their indexes. Following former leader's departure, polls show ${playerParty.name} at ${newAvgSupport.toFixed(1)}% nationwide support (was ${oldAvgSupport.toFixed(1)}%).`,
      options: [
        {
          text: 'We will rebuild and conquer the general election!',
          effect: () => {}
        }
      ]
    });
  };

  const handleWinLeadership = () => {
    setIsJuniorMember(false);
    setDashboardTab('CAMPAIGN');
  };

  const getNextElectionCountdown = () => {
    if (!selectedCountry) return "";
    const total = selectedCountry.electionCycleYears * 12;
    const remaining = total - rulingMonthsCount;
    if (remaining <= 0) return "Election day is now!";
    const yrs = Math.floor(remaining / 12);
    const mos = remaining % 12;
    let str = "";
    if (yrs > 0) str += `${yrs} year${yrs > 1 ? 's' : ''} `;
    if (mos > 0) str += `${mos} month${mos > 1 ? 's' : ''} `;
    return `${str.trim()} left`;
  };

  const handleNextMonth = () => {
    if (!selectedCountry) return;

    playSound('success');

    // 1. Advance the months count
    const nextMonths = rulingMonthsCount + 1;
    setRulingMonthsCount(nextMonths);
    
    // Check if the current term is ending
    const termLengthMonths = selectedCountry.electionCycleYears * 12;
    if (nextMonths > 0 && nextMonths % termLengthMonths === 0) {
      playSound('error'); // Dramatic sound
      
      // Snap Election / Normal Re-election
      setCurrentEvent({
        title: "END OF TERM: GENERAL ELECTIONS",
        description: `Your ${selectedCountry.electionCycleYears}-year term has concluded. The country must go to the polls. Are you ready to face the voters again?`,
        options: [
          {
            text: "Relaunch Campaign for Re-election!",
            effect: () => {
              setWarningAlert("🗳️ CAMPAIGN SEASON: Your term has ended and a new election cycle has officially begun.");
              setIsRuling(false);
              setCampaignTurn(1);
              setCurrentEvent(null);
            }
          },
          {
            text: "Step down voluntarily (Return to World Map)",
            effect: () => {
              setWarningAlert("📜 VOLUNTARY RETIREMENT: You have chosen not to seek re-election and step away from politics.");
              setActiveScreen('MAP');
              setSelectedCountry(null);
              setPlayerParty(null);
              setIsRuling(false);
              setCurrentEvent(null);
            }
          }
        ]
      });
      return; // Do not process taxes/events during term end
    }

    // Check for extreme Civil War / Revolt Risk Rebellion
    if (false) {
      // Trigger a dramatic Rebellion / Coup crisis!
      playSound('error');
      setCurrentEvent({
        title: "🔥 ARMED REBELLION AND COUP ATTEMPT!",
        description: `CRITICAL WARNING! Due to political suppression or extreme unrest, the civil war risk has reached ${civilWarRisk}%! Armed rebel cells have barricaded the roads leading to the Presidential palace in the capital. How will you respond?`,
        options: [
          {
            text: "Deploy the Military and engage rebels on the Tactical Map! (Cost: $200,000, Freedom -25)",
            effect: () => {
              setTreasury(prev => Math.max(0, prev - 200000));
              setFreedomIndex(prev => Math.max(10, prev - 25));
              setActiveScreen('TACTICAL_BATTLE');
              setCurrentEvent(null);
            }
          },
          {
            text: "Flee the country and form a government in exile (Resign, lose the country)",
            effect: () => {
              setWarningAlert("✈️ ESCAPE: You fled to a friendly nation on a private jet. Your administration collapsed, and a transitional military council took control.");
              setActiveScreen('MAP');
              setSelectedCountry(null);
              setPlayerParty(null);
              setIsRuling(false);
              setCurrentEvent(null);
            }
          }
        ]
      });
      return;
    }

    // Calculate tax revenues based on tax rates
    const incomeTaxRevenue = taxRates.income * 1200;
    const corporateTaxRevenue = taxRates.corporate * 1500;
    const vatRevenue = taxRates.vat * 1000;
    const tariffRevenue = taxRates.tariffs * 400;
    
    const baseTaxYield = (incomeTaxRevenue + corporateTaxRevenue + vatRevenue + tariffRevenue);
    
    // Find finance/treasury minister
    const financeMinister = cabinet['finance'] || cabinet['treasury'];
    const financeCompetence = financeMinister ? financeMinister.competence : 0;
    const financeMultiplier = 1 + (financeCompetence * 0.003);
    
    // final tax revenue scaled by investor confidence
    const finalTaxRevenue = Math.round(baseTaxYield * (investorConfidence / 100) * financeMultiplier);
    
    // expenses: base + inflation + minister salaries
    const baseGovExpenses = 45000;
    const inflationImpact = Math.round(inflation * 4500);
    const ministerSalariesSum = Object.values(cabinet).reduce((sum: number, c) => sum + (c ? 15000 : 0), 0) as number;
    const totalExpenses = baseGovExpenses + inflationImpact + ministerSalariesSum;
    
    const netMonthlyChange = finalTaxRevenue - totalExpenses;
    const nextTreasury = Math.max(0, treasury + netMonthlyChange);
    setTreasury(nextTreasury);

    // Fluctuating region supports dynamically so region owners shift as time goes on
    const updatedRegions = selectedCountry.regions.map(r => {
      const supports = { ...r.supports };
      const partyIds = Object.keys(supports);
      
      const changes = partyIds.map(id => {
        let change = (Math.random() * 6 - 3); // -3% to +3% random drift
        if (id === playerParty.id) {
          // Player's support drift is influenced by investor confidence & freedom index
          const baseGovRating = (investorConfidence / 10) + (freedomIndex / 10) - (inflation * 1.5);
          change += baseGovRating * 0.1;
        }
        return { id, change };
      });

      // Apply changes, bound between 1% and 100%
      changes.forEach(c => {
        supports[c.id] = Math.min(100, Math.max(1, Math.round((supports[c.id] || 0) + c.change)));
      });

      // Normalize supports to add up to 100%
      const sum = Object.values(supports).reduce((acc: number, val) => acc + (val as number), 0) as number;
      if (sum > 0) {
        partyIds.forEach(id => {
          supports[id] = Math.round(((supports[id] || 0) / sum) * 100);
        });
      }

      return { ...r, supports };
    });

    setSelectedCountry({ ...selectedCountry, regions: updatedRegions });

    // 2. Economic & confidence indicators drift
    const taxConfidenceImpact = (taxRates.corporate > 35 ? -2 : 0) + (taxRates.income > 40 ? -2 : 0);
    const inflationDelta = (inflation > 2.5 ? -0.15 : 0.05) - (financeCompetence * 0.003);
    const nextInflation = Math.max(1.0, parseFloat((inflation + inflationDelta).toFixed(2)));
    setInflation(nextInflation);

    const confidenceDelta = taxConfidenceImpact + (nextInflation > 7.5 ? -3 : 2);
    const nextConfidence = Math.max(10, Math.min(100, investorConfidence + confidenceDelta));
    setInvestorConfidence(nextConfidence);

    // 3. National election countdown check
    const totalCycleMonths = selectedCountry.electionCycleYears * 12;
    if (nextMonths >= totalCycleMonths) {
      setWarningAlert(`Your ruling term is complete! It is time for the next General Elections in ${selectedCountry.name}!`);
      setIsRuling(false);
      setCampaignTurn(1);
      setRulingMonthsCount(0);
      setActiveScreen('ELECTION_SIMULATOR');
      return;
    }

    // 4. Random Crisis / Governance Events (every 3 months, or 25% chance)
    const shouldTriggerEvent = nextMonths % 3 === 0 || Math.random() < 0.25;
    if (shouldTriggerEvent) {
      const events = [
        {
          title: "Public Sector Infrastructure Project",
          description: "Your Minister of Transport proposes a massive investment in new high-speed rail lines to boost rural economies. It will cost the treasury but improve public approval.",
          options: [
            {
              text: "Fund the project (Costs 150,000)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 150000));
                setInvestorConfidence(prev => Math.min(100, prev + 8));
                setFreedomIndex(prev => Math.min(100, prev + 5));
                setWarningAlert("Infrastructure project funded! Public transport is modernized, boosting approval and long-term confidence.");
              }
            },
            {
              text: "Austerity: Focus on Budget Balance",
              effect: () => {
                setTreasury(prev => prev + 50000);
                setInvestorConfidence(prev => Math.max(10, prev - 5));
                setWarningAlert("Budget austerity maintained! Savings of 50,000 added to state reserves.");
              }
            }
          ]
        },
        {
          title: "Sudden Inflation Shock",
          description: "Global commodity prices are rising rapidly, causing immediate inflation spikes in domestic markets. How do you respond?",
          options: [
            {
              text: "Impose Price Controls (-5 Freedom, -2% Inflation)",
              effect: () => {
                setFreedomIndex(prev => Math.max(10, prev - 5));
                setInflation(prev => Math.max(1.0, parseFloat((prev - 2.0).toFixed(2))));
                setWarningAlert("Price controls imposed! Inflation is curbed but individual freedom suffers.");
              }
            },
            {
              text: "Rely on Market Correction (-8% Confidence, +3% Inflation)",
              effect: () => {
                setInvestorConfidence(prev => Math.max(10, prev - 8));
                setInflation(prev => parseFloat((prev + 3.0).toFixed(2)));
                setWarningAlert("Let the market decide. Inflation rises but investors appreciate the lack of state interference.");
              }
            }
          ]
        },
        {
          title: "Trade Tariff Negotiation",
          description: "A major neighboring coalition proposes a reciprocal trade deal. They demand we lower our import tariffs in exchange for higher access.",
          options: [
            {
              text: "Accept Lower Tariffs (-5% Tariffs, +15% Confidence)",
              effect: () => {
                setTaxRates(prev => ({ ...prev, tariffs: Math.max(0, prev.tariffs - 5) }));
                setInvestorConfidence(prev => Math.min(100, prev + 15));
                setWarningAlert("Tariffs lowered! International trade surges, boosting investor confidence massively.");
              }
            },
            {
              text: "Protect Domestic Industry (+10% Tariffs, -5% Confidence)",
              effect: () => {
                setTaxRates(prev => ({ ...prev, tariffs: Math.min(50, prev.tariffs + 10) }));
                setInvestorConfidence(prev => Math.max(10, prev - 5));
                setWarningAlert("Protective tariffs raised! Domestic factories are shielded, but import costs increase.");
              }
            }
          ]
        },
        {
          title: "Cabinet Integrity Scan",
          description: "A major media outlet threatens to leak details of a tax evasion scandal involving one of your prominent cabinet ministers. How do you proceed?",
          options: [
            {
              text: "Dismiss the suspect minister (+10 Freedom)",
              effect: () => {
                setFreedomIndex(prev => Math.min(100, prev + 10));
                const keys = Object.keys(cabinet).filter(k => cabinet[k] !== null);
                if (keys.length > 0) {
                  const target = keys[Math.floor(Math.random() * keys.length)];
                  setCabinet(prev => ({ ...prev, [target]: null }));
                }
                setWarningAlert("Minister dismissed! Your prompt anti-corruption stance receives universal praise.");
              }
            },
            {
              text: "Cover up the scandal (-15 Freedom, -10 Confidence)",
              effect: () => {
                setFreedomIndex(prev => Math.max(10, prev - 15));
                setInvestorConfidence(prev => Math.max(10, prev - 10));
                setWarningAlert("Scandal covered up. Word still leaked out slightly, damaging your international reputation.");
              }
            }
          ]
        },
        {
          title: "Border Conflict Escalation",
          description: "A nearby border dispute has erupted into military clashes. Neighboring factions request our diplomatic intervention or logistics supply.",
          options: [
            {
              text: "Deploy Peacekeepers (Costs 80,000, +10 Reputation)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 80000));
                setInternationalReputation(prev => Math.min(100, prev + 10));
                setCivilWarRisk(prev => Math.max(0, prev - 5));
                setWarningAlert("Peacekeeping mission successfully deployed under global supervision!");
              }
            },
            {
              text: "Sell Arms to Factions (Earns 100,000, -15 Reputation, +10% Civil War Risk)",
              effect: () => {
                setTreasury(prev => prev + 100000);
                setInternationalReputation(prev => Math.max(0, prev - 15));
                setCivilWarRisk(prev => Math.min(100, prev + 10));
                setWarningAlert("Arms sales approved. State reserves increased but domestic peace-groups are protesting.");
              }
            }
          ]
        },
        {
          title: "Regional Humanitarian Wave",
          description: "Severe conflict in the Balkans has triggered a massive refugee migration wave towards our borders. Independent watchdogs request opening safe passages.",
          options: [
            {
              text: "Open Passages & Fund Assistance (Costs 60,000, +12 Reputation)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 60000));
                setInternationalReputation(prev => Math.min(100, prev + 12));
                setFreedomIndex(prev => Math.min(100, prev + 3));
                setWarningAlert("Safe passages opened. Human rights monitors applaud our diplomatic humanity.");
              }
            },
            {
              text: "Enforce Border Defense Restrictions (Costs 30,000, -10 Reputation)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 30000));
                setInternationalReputation(prev => Math.max(0, prev - 10));
                setInvestorConfidence(prev => Math.min(100, prev + 5));
                setWarningAlert("Border reinforcement active. Regional stability prioritized over global appeal.");
              }
            }
          ]
        },
        {
          title: "Global Cyber warfare Aggression",
          description: "Digital nation-state hacking cells have launched massive ransom denial-of-service attacks against our primary treasury registries.",
          options: [
            {
              text: "Deploy Defensive Cyber Teams (Costs 50,000, +8 Confidence)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 50000));
                setInvestorConfidence(prev => Math.min(100, prev + 8));
                setWarningAlert("Defenses held! The hack was successfully countered and secured.");
              }
            },
            {
              text: "Shut down international IP routing (-10 Freedom)",
              effect: () => {
                setFreedomIndex(prev => Math.max(10, prev - 10));
                setInvestorConfidence(prev => Math.max(10, prev - 5));
                setWarningAlert("Temporary routing shutdown complete. Digital systems secured but public web access suffered.");
              }
            }
          ]
        },
        {
          title: "Naval Blockade Crisis",
          description: "A maritime superpower has declared a tactical embargo on regional commercial shipping routes, increasing domestic trade costs.",
          options: [
            {
              text: "Escort Cargo Vessels (Costs 100,000, -1% Inflation)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 100000));
                setInflation(prev => Math.max(1.0, parseFloat((prev - 1.0).toFixed(2))));
                setInternationalReputation(prev => Math.min(100, prev + 8));
                setWarningAlert("Naval protection convoy successfully neutralized import price spikes.");
              }
            },
            {
              text: "Divert Cargo overland (+2% Inflation, -5 Confidence)",
              effect: () => {
                setInflation(prev => parseFloat((prev + 2.0).toFixed(2)));
                setInvestorConfidence(prev => Math.max(10, prev - 5));
                setWarningAlert("Overland routing active. Commercial goods arrived late, triggering temporary price spikes.");
              }
            }
          ]
        },
        {
          title: "International Coalition Summit",
          description: "Our administration is invited to speak at a global strategic conference regarding human rights and regional defense commitments.",
          options: [
            {
              text: "Commit to Collective Defense Pact (+15 Reputation, -50,000)",
              effect: () => {
                setTreasury(prev => Math.max(0, prev - 50000));
                setInternationalReputation(prev => Math.min(100, prev + 15));
                setWarningAlert("Signed collective defense commitments. Global stature rises!");
              }
            },
            {
              text: "Advocate Isolationism & National Sovereignty (+8 Confidence, -10 Reputation)",
              effect: () => {
                setInvestorConfidence(prev => Math.min(100, prev + 8));
                setInternationalReputation(prev => Math.max(0, prev - 10));
                setWarningAlert("Spoke in defense of non-alignment. Nationalist supporters applaud.");
              }
            }
          ]
        }
      ];

      const chosenEvent = events[Math.floor(Math.random() * events.length)];
      setCurrentEvent(chosenEvent);
    }
  };

  const handleUpdateCountry = (updatedCountry: Country) => {
    const syncedRegions = syncRegionOwnersAndMayors(
      updatedCountry.regions,
      updatedCountry.id,
      playerParty || undefined,
      updatedCountry.rivals
    );
    setSelectedCountry({ ...updatedCountry, regions: syncedRegions });
  };

  // Spend turn action decrementer
  const handleSpendTurn = () => {
    if (!selectedCountry || !playerParty) return;

    // Automatically award State Subsidy if seats > 0
    const totalRegions = selectedCountry.regions.length || 1;
    const avgSupport = selectedCountry.regions.reduce((acc, r) => acc + (r.supports[playerParty.id] || 0), 0) / totalRegions;
    const playerSeatsCount = Math.round((avgSupport / 100) * selectedCountry.seats);
    let subsidyPayout = 0;
    if (playerSeatsCount > 0) {
      subsidyPayout = playerSeatsCount * 1500;
    }

    // Weekly rival campaigns & player support decay across all regions
    // This maintains realistic "main difficulty" scaled to 53 weeks!
    const updatedRegions = selectedCountry.regions.map(r => {
      const supports = { ...r.supports };
      const playerSupport = supports[playerParty.id] || 0;
      
      if (playerSupport > 2) {
        // Decay is proportional to player support (higher support decays faster as rivals target you)
        // HQ level (infrastructure) mitigates decay.
        const baseDecay = 0.5 + (playerSupport / 150); // e.g. at 50% support, decay is 0.5 + 0.33 = 0.83%
        const mitigation = (r.infrastructure || 0) * 0.15; // up to 0.75% mitigation at level 5
        const actualDecay = Math.max(0, baseDecay - mitigation);
        
        const nextPlayerSupport = Math.max(2, playerSupport - actualDecay);
        const change = playerSupport - nextPlayerSupport;
        
        if (change > 0) {
          supports[playerParty.id] = nextPlayerSupport;
          
          // Distribute the decayed support back to rivals based on their baseSupport
          const rivals = Object.keys(supports).filter(id => id !== playerParty.id);
          const totalRivalBase = selectedCountry.rivals.reduce((sum, riv) => sum + riv.baseSupport, 0) || 1;
          
          rivals.forEach(rivalId => {
            const rivalDef = selectedCountry.rivals.find(riv => riv.id === rivalId);
            const share = rivalDef ? (rivalDef.baseSupport / totalRivalBase) : (1 / rivals.length);
            supports[rivalId] = (supports[rivalId] || 0) + (change * share);
          });
        }
      }
      
      // Normalize
      const sum = Object.keys(supports).reduce((s, k) => s + (supports[k] || 0), 0);
      if (Math.abs(sum - 100) > 0.1) {
        const scale = 100 / sum;
        Object.keys(supports).forEach(k => {
          supports[k] = parseFloat((supports[k] * scale).toFixed(2));
        });
      }
      
      return { ...r, supports };
    });

    const syncedRegions = syncRegionOwnersAndMayors(updatedRegions, selectedCountry.id, playerParty, selectedCountry.rivals);
    const nextCountryState = {
      ...selectedCountry,
      regions: syncedRegions
    };
    setSelectedCountry(nextCountryState);

    const next = campaignTurn + 1;
    if (next > selectedCountry.campaignTurns) {
      // Out of weeks, transition to general voting day results!
      setActiveScreen('ELECTION_SIMULATOR');
    } else {
      setCampaignTurn(next);
      if (subsidyPayout > 0) {
        setPlayerParty({
          ...playerParty,
          budget: playerParty.budget + subsidyPayout
        });
      }
    }
  };

  // Election simulator end callback
  const handleElectionFinished = (success: boolean, finalSeats?: Record<string, number>, newCoalition?: any) => {
    if (success && selectedCountry && playerParty) {
      if (finalSeats) {
        setElectionSeats(finalSeats);
      }
      // Add and save completed country
      if (!completedCountries.includes(selectedCountry.id)) {
        setCompletedCountries([...completedCountries, selectedCountry.id]);
      }
      
      setCountryWinCounts(prev => ({
        ...prev,
        [selectedCountry.id]: (prev[selectedCountry.id] || 0) + 1
      }));

      // Generate dynamic AI-to-AI coalitions if no majority
      if (finalSeats) {
        const playerSeats = finalSeats[playerParty.id] || 0;
        const halfTotal = selectedCountry.seats / 2;
        if (playerSeats < halfTotal) {
          const partiesList = [
            { id: playerParty.id, name: playerParty.name, seats: finalSeats[playerParty.id] || 0, ideology: playerParty.ideology },
            ...selectedCountry.rivals.map(r => ({
              id: r.id,
              name: r.name,
              seats: finalSeats[r.id] || 0,
              ideology: r.ideology
            }))
          ];

          const generated: Coalition[] = [];

          const leftParties = partiesList.filter(p => p.id !== playerParty.id && (p.ideology.includes("Social") || p.ideology.includes("Left") || p.ideology.includes("Green") || p.ideology.includes("Marxist") || p.ideology.includes("Democratic Socialist") || p.ideology.includes("Socialist")));
          const rightParties = partiesList.filter(p => p.id !== playerParty.id && (p.ideology.includes("Conservative") || p.ideology.includes("Nationalist") || p.ideology.includes("Islamist") || p.ideology.includes("Right") || p.ideology.includes("Religious")));
          const centristParties = partiesList.filter(p => p.id !== playerParty.id && (p.ideology.includes("Centrist") || p.ideology.includes("Liberal") || p.ideology.includes("Moderate") || p.ideology.includes("Democrat")));

          if (leftParties.length >= 2) {
            const seatsSum = leftParties.reduce((sum, p) => sum + p.seats, 0);
            generated.push({
              name: "Socialist Alliance",
              parties: leftParties.map(p => p.name),
              totalSeats: seatsSum,
              ideologyAvg: "Left-Wing Progressive"
            });
          } else if (leftParties.length === 1 && centristParties.length > 0) {
            const pool = [...leftParties, centristParties[0]];
            const seatsSum = pool.reduce((sum, p) => sum + p.seats, 0);
            generated.push({
              name: "Progressive Front",
              parties: pool.map(p => p.name),
              totalSeats: seatsSum,
              ideologyAvg: "Socialist-Green Pact"
            });
          }

          if (rightParties.length >= 2) {
            const seatsSum = rightParties.reduce((sum, p) => sum + p.seats, 0);
            generated.push({
              name: "Conservative Bloc",
              parties: rightParties.map(p => p.name),
              totalSeats: seatsSum,
              ideologyAvg: "National Coalition"
            });
          }

          if (centristParties.length >= 2) {
            const seatsSum = centristParties.reduce((sum, p) => sum + p.seats, 0);
            generated.push({
              name: "Centrist Pact",
              parties: centristParties.map(p => p.name),
              totalSeats: seatsSum,
              ideologyAvg: "Grand Coalition"
            });
          }

          const finalCoals = [...(coalitions || []), ...generated]; if(newCoalition && !finalCoals.find(c => c.name === newCoalition.name)) finalCoals.push(newCoalition); setCoalitions(finalCoals);
        } else {
          if (newCoalition) setCoalitions([...(coalitions || []), newCoalition]); else setCoalitions([...(coalitions || [])]);
        }
      }

      const shuffled = [...ALL_PRESS_QUESTIONS].sort(() => 0.5 - Math.random());
      setActivePressQuestions(shuffled.slice(0, 3));
      setShowElectionSuccessModal(true);
      setShowPressConference(true);
      setPressConferenceIndex(0);
      setPressTreasuryBonus(0);
      setPressFreedomBonus(0);
      setPressReputationBonus(0);
      return;
    }

    setIsRuling(false);
    // Return back to operations map
    setActiveScreen('MAP');
    setSelectedCountry(null);
    setPlayerParty(null);
    setElectionSeats(null);
  };

  const handleFormCabinet = () => {
    setIsRuling(true);
    setTreasury(1000000 + pressTreasuryBonus);
    setFreedomIndex(Math.min(100, Math.max(10, 85 + pressFreedomBonus)));
    setBannedParties([]);
    setCivilWarRisk(0);
    setDashboardTab('CABINET');
    setActiveScreen('MAIN_DASHBOARD');
    setHasReshuffledPrompt(true);
    setShowElectionSuccessModal(false);
    setShowPressConference(false);
    if (pressReputationBonus !== 0) {
      setInternationalReputation(prev => Math.min(100, Math.max(0, prev + pressReputationBonus)));
    }
  };

  const handleReturnToMap = () => {
    setIsRuling(false);
    setActiveScreen('MAP');
    setSelectedCountry(null);
    setPlayerParty(null);
    setElectionSeats(null);
    setShowElectionSuccessModal(false);
  };

  // Helper currency converter
  const getCurrency = (countryId: string) => {
    if (countryId === 'US') return '$';
    if (countryId === 'TR') return '₺';
    if (countryId === 'DE') return '€';
    if (countryId === 'GB') return '£';
    if (countryId === 'JP') return '¥';
    return '$';
  };

  const adjustPublicApproval = (delta: number) => {
    if (!selectedCountry || !playerParty) return;
    const updatedRegions = selectedCountry.regions.map(r => {
      const supports = { ...r.supports };
      const playerSupport = supports[playerParty.id] || 0;
      const targetSupport = Math.min(100, Math.max(1, playerSupport + delta));
      const change = targetSupport - playerSupport;

      const otherParties = Object.keys(supports).filter(id => id !== playerParty.id);
      const totalOtherSupport = otherParties.reduce((sum, id) => sum + (supports[id] || 0), 0);

      if (totalOtherSupport > 0) {
        otherParties.forEach(id => {
          const share = ((supports[id] as number) || 0) / totalOtherSupport;
          supports[id] = Math.max(0.1, ((supports[id] as number) || 0) - (change * share));
        });
      }
      supports[playerParty.id] = targetSupport;

      // Normalize accurate sum to 100%
      const finalSum = (Object.values(supports) as number[]).reduce((s: number, v: number) => s + v, 0);
      if (Math.abs(finalSum - 100) > 0.1) {
        const scale = 100 / finalSum;
        Object.keys(supports).forEach(k => {
          supports[k] = (supports[k] as number) * scale;
        });
      }

      return { ...r, supports };
    });

    setSelectedCountry({ ...selectedCountry, regions: updatedRegions });
  };

  const getRegimeType = (ideology: string) => {
    if (ideology === 'Sosyal Demokrat') return 'Social Democratic Republic';
    if (ideology === 'Muhafazakar') return 'National Conservative Republic';
    if (ideology === 'Nationalist') return 'Authoritarian Nationalist State';
    if (ideology === 'Liberal') return 'Federal Democratic Republic';
    if (ideology === 'Sosyalist') return 'Socialist Council Republic';
    if (ideology === 'Ekolojist') return 'Ecological Federation';
    return 'Constitutional Democracy';
  };

  const currency = selectedCountry ? getCurrency(selectedCountry.id) : '$';

  // Settle global averages for dashboard
  const getGlobalAvgSupport = () => {
    if (!selectedCountry || !playerParty) return 0;
    const total = selectedCountry.regions.reduce((acc, r) => acc + (r.supports[playerParty.id] || 0), 0);
    return Math.round(total / selectedCountry.regions.length);
  };

  const resetAllProgress = () => {
    setConfirmModal({
      title: "RESET GAME PROGRESS?",
      message: "Are you sure you want to reset all game progress? All secured countries will return to their default colors and status.",
      confirmText: "Yes, Reset Everything",
      cancelText: "No, Keep Progress",
      onConfirm: () => {
        setConfirmModal(null);
        setCompletedCountries([]);
        localStorage.removeItem('completed_world_countries');
      },
      onCancel: () => {
        setConfirmModal(null);
      }
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-300'
    }`}>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(50%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>

      {/* Dynamic English Breaking News Ticker */}
      <div className="bg-red-700 text-white text-[10px] sm:text-[11px] font-bold h-7 flex items-center overflow-hidden border-b border-red-800 font-mono relative select-none">
        <div className="bg-red-900 px-3 h-full flex items-center gap-1.5 shrink-0 z-10 border-r border-red-800">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          <span>BREAKING NEWS</span>
        </div>
        <div className="w-full relative overflow-hidden flex items-center h-full">
          <div className="whitespace-nowrap flex gap-16 absolute animate-marquee">
            {newsTickerItems.map((item, index) => (
              <span key={index} className={item.includes("🏛️") || item.includes("📜") ? "text-amber-300" : ""}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Universal Navbar */}
      <nav className={`border-b sticky top-0 z-50 transition-all ${
        darkMode ? 'bg-slate-950/80 border-slate-900 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          <div 
            onClick={() => {
              setActiveScreen('MAP');
              setSelectedCountry(null);
              setPlayerParty(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-all"
            id="nav-logo"
            title="Return to main world map"
          >
            <span className="text-3xl select-none animate-pulse">🗺️</span>
            <div>
              <span className="text-[10px] tracking-widest font-mono text-indigo-500 font-bold block leading-none">GLOBAL EDITION</span>
              <h1 className="text-lg font-black tracking-tight mt-0.5 font-mono">PATHS TO POWER</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Play Guide */}
            <button
              id="how-to-play-toggle"
              onClick={() => { playSound('click'); setShowHowToPlay(true); }}
              className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center border text-xs font-bold gap-1.5 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Info className="w-4 h-4 text-indigo-400" /> <span className="hidden sm:inline">How to Play</span>
            </button>

            {/* Clear database progress */}
            <button
              id="reset-prog-btn"
              onClick={() => { playSound('click'); resetAllProgress(); }}
              className={`p-2 rounded-xl transition-all border text-xs font-semibold hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-450 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}
              title="Reset Progress"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-all border text-xs font-semibold hover:border-indigo-500/20 hover:bg-indigo-500/5 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
              title={muted ? "Unmute Sounds" : "Mute Sounds"}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </nav>

      {/* Main Container screen routers */}
      <main className="py-2">
        {activeScreen === 'START_SCREEN' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] relative overflow-hidden">
            {/* Background Map Placeholder or abstract design */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-500/30 via-transparent to-transparent"></div>
            </div>
            
            <div className="z-10 flex flex-col items-center justify-center p-8 max-w-2xl text-center space-y-12">
              <div className="space-y-4 relative">
                <span className="text-[12px] tracking-[0.3em] font-mono text-slate-500 font-bold block">GLOBAL ELECTION SIMULATOR</span>
                
                <div className="relative inline-block">
                  {/* Boot footprint cutout effect using an SVG overlay */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-30 pointer-events-none transform -rotate-12 scale-150 mix-blend-multiply dark:mix-blend-color-burn">
                     <svg viewBox="0 0 100 100" fill="currentColor" className="w-40 h-40 text-slate-900 dark:text-slate-950">
                        <path d="M30 70 Q 40 85 50 85 Q 60 85 65 70 Q 75 55 65 40 Q 60 25 50 20 Q 40 25 35 40 Q 25 55 30 70 Z" />
                        <path d="M50 85 Q 45 95 50 100 Q 55 95 50 85 Z" />
                        {/* Boot tread marks */}
                        <rect x="35" y="30" width="30" height="5" />
                        <rect x="35" y="45" width="30" height="5" />
                        <rect x="35" y="60" width="30" height="5" />
                        <rect x="42" y="75" width="16" height="4" />
                     </svg>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text font-mono relative z-0" 
                      style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png'), linear-gradient(to bottom right, #94a3b8, #475569, #334155)",
                        backgroundSize: "auto, cover",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}>
                    PATHS TO POWER
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-sm justify-center pt-8 mx-auto">
                <button
                  onClick={() => { playSound('click'); setActiveScreen('MAP'); }}
                  className="w-full px-12 py-5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-white dark:text-slate-900 text-white font-black rounded-xl shadow-xl shadow-slate-900/20 transition-all text-xl uppercase tracking-widest border border-slate-700 dark:border-slate-300 hover:scale-[1.02]"
                >
                  PLAY
                </button>
                <button
                  onClick={() => { playSound('click'); /* Optional Settings Logic */ }}
                  className={`w-full px-8 py-4 font-bold rounded-xl transition-all text-lg border uppercase tracking-wider hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                  SETTINGS
                </button>
                <button
                  onClick={() => { playSound('click'); /* Optional Languages Logic */ }}
                  className={`w-full px-8 py-4 font-bold rounded-xl transition-all text-lg border uppercase tracking-wider hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                  LANGUAGES
                </button>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'MAP' && (
          <WorldMap
            completedCountries={completedCountries}
            countryWinCounts={countryWinCounts}
            onSelectCountry={handleSelectCountry}
            darkMode={darkMode}
          />
        )}

        {activeScreen === 'PARTY_CREATOR' && selectedCountry && (
          <PartyCreator
            country={selectedCountry}
            onBack={() => setActiveScreen('MAP')}
            onCreateParty={handleCreateParty}
            darkMode={darkMode}
          />
        )}

        {/* OPERATIONS HUD GENERAL DASHBOARD */}
        {activeScreen === 'MAIN_DASHBOARD' && selectedCountry && playerParty && (
          <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
            
            {/* COUNTRY DASHBOARD COCKPIT HEADER ACTIONS */}
            <div className={`p-6 rounded-3xl border transition-all ${
              darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* 1. Brand info */}
                <div className="flex items-center gap-4.5">
                  <div className="relative shrink-0 select-none">
                    <span className="text-3xl absolute -bottom-1 -right-1 filter drop-shadow z-10">{selectedCountry.flag}</span>
                    <div 
                      className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-md relative bg-slate-800"
                      style={{ borderColor: playerParty.color }}
                    >
                      {playerParty.photo ? (
                        <img 
                          src={playerParty.photo} 
                          alt={playerParty.leader} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div 
                          style={{ background: playerParty.color }} 
                          className="w-full h-full flex items-center justify-center text-white font-bold text-lg uppercase"
                        >
                          {playerParty.name.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-lg font-bold tracking-tight">
                        {isRuling ? `${selectedCountry.name} Government Executive Office` : `${selectedCountry.name} Campaign HQ`}
                      </h2>
                      <span 
                        className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide flex items-center gap-1 text-white shadow-sm"
                        style={{ backgroundColor: playerParty.color }}
                      >
                        {isRuling ? 'RULING GOVERNMENT' : playerParty.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      <div>
                        {selectedCountry.id === 'US' ? (isRuling ? 'President:' : 'Presidential Candidate:') : selectedCountry.id === 'TR' ? (isRuling ? 'President:' : 'Presidential Candidate:') : selectedCountry.id === 'DE' ? (isRuling ? 'Chancellor:' : 'Chancellor Candidate:') : (isRuling ? 'Head of State:' : 'Leader:')} <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{playerParty.leader}</strong>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>Ideology: <strong className={darkMode ? 'text-slate-250' : 'text-slate-750'}>{playerParty.ideology}</strong></span>
                        {isRuling && (
                          <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                            Regime: {getRegimeType(playerParty.ideology)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core attributes HUD dials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/20 p-4 rounded-2xl border border-slate-500/5 min-w-0 flex-grow max-w-3xl">
                  {/* Countdown action / Year Tracker */}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">
                        {isRuling ? 'NEXT ELECTION' : (selectedCountry.id === 'US' ? 'PRESIDENTIAL CAMPAIGN' : selectedCountry.id === 'TR' ? 'GENERAL ELECTION' : selectedCountry.id === 'DE' ? 'GENERAL ELECTION' : 'CAMPAIGN WEEK')}
                      </span>
                      <div className="text-xs font-black font-mono text-indigo-400">
                        {isRuling ? getNextElectionCountdown() : `${campaignTurn} / ${selectedCountry.campaignTurns} Wk`}
                      </div>
                    </div>
                  </div>

                  {/* State Treasury vs Party Budget */}
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">
                        {isRuling ? 'STATE TREASURY' : 'PARTY BUDGET'}
                      </span>
                      <div className="text-sm font-black font-mono text-emerald-400">
                        {currency}{isRuling ? treasury.toLocaleString() : playerParty.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Reputation / Influence */}
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">
                        {isRuling ? 'INTL REPUTATION' : 'POLITICAL INFLUENCE'}
                      </span>
                      <div className="text-sm font-black font-mono text-cyan-400">
                        {isRuling ? `${internationalReputation}/100` : `${playerParty.influence} Influence`}
                      </div>
                    </div>
                  </div>

                  {/* Freedom Index / Vote Share */}
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">
                        {isRuling ? 'FREEDOM INDEX' : 'EST. VOTE SHARE'}
                      </span>
                      <div className="text-sm font-black font-mono text-rose-500">
                        {isRuling ? `${freedomIndex}/100` : `% ${getGlobalAvgSupport()}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. General election day triggers / Exit Sovereign */}
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  {isRuling && (
                    <button
                      id="next-month-btn"
                      onClick={handleNextMonth}
                      className="py-2.5 px-4 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer shadow-md shadow-emerald-500/10 animate-pulse border border-emerald-500/50"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Next Month
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const msg = isRuling 
                        ? 'Return to the World Map? Your cabinet, diplomacy, and taxation settings are preserved.'
                        : 'Are you sure you want to abort the current campaign and return to the World Map? All current progress for this country will be lost.';
                      
                      setConfirmModal({
                        title: isRuling ? "EXIT TO WORLD MAP?" : "ABORT ACTIVE CAMPAIGN?",
                        message: msg,
                        confirmText: isRuling ? "Yes, Exit" : "Yes, Abort",
                        cancelText: "No, Continue",
                        onConfirm: () => {
                          setConfirmModal(null);
                          setActiveScreen('MAP');
                          setSelectedCountry(null);
                          setPlayerParty(null);
                        },
                        onCancel: () => {
                          setConfirmModal(null);
                        }
                      });
                    }}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer ${
                      darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" /> {isRuling ? 'Exit to Map' : 'Abort Campaign'}
                  </button>
                </div>
              </div>

              {/* Character stats indicators row */}
              <div className="flex items-center gap-4 flex-wrap mt-4 pt-3 border-t border-slate-500/10 text-[10px] font-mono text-slate-400">
                <span className="font-bold uppercase tracking-wider">Leader Stats:</span>
                <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5">
                  <span className="text-rose-400">♥</span> Charisma: {playerParty.traits.charisma}
                </span>
                <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5">
                  <span className="text-amber-400">📢</span> Eloquence: {playerParty.traits.eloquence}
                </span>
                <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5">
                  <span className="text-emerald-400">👥</span> Organization: {playerParty.traits.organization}
                </span>
                <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5">
                  <span className="text-cyan-400">♟</span> Strategy: {playerParty.traits.strategy}
                </span>
                {isRuling && (
                  <>
                    <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5 text-amber-500 font-bold">
                      ⚠️ Revolt Risk: {civilWarRisk}%
                    </span>
                    <span className="flex items-center gap-1 bg-slate-500/5 px-2 py-0.5 rounded border border-slate-500/5 text-cyan-400">
                      📈 Investor Confidence: {investorConfidence}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* FORM CABINET PROMPT BANNER */}
            {hasReshuffledPrompt && (
              <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex justify-between items-center animate-fade-in shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <strong className="block text-slate-100 text-sm">Executive Cabinet Formation</strong>
                    <span className="text-slate-400 mt-1 block">"Do you want to form a cabinet / reshuffle ministers?" Your political transition is active.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setHasReshuffledPrompt(false); setDashboardTab('CABINET'); playSound('click'); }}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Form Cabinet Now
                  </button>
                  <button
                    onClick={() => setHasReshuffledPrompt(false)}
                    className="p-1.5 hover:bg-slate-500/10 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTROLLERS SECTION */}
            <div className="flex flex-col gap-3">
              {/* CAMPAIGN OPERATIONS ROW */}
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5 ml-1">Campaign Operations</span>
                <div className={`p-1 rounded-2xl border flex gap-1 flex-wrap ${
                  darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <button
                    onClick={() => {
                      if (isJuniorMember) {
                        playSound('error');
                        setWarningAlert("🔒 You must win the extraordinary party congress first to become the party leader before you can launch a national election campaign!");
                        return;
                      }
                      playSound('click'); 
                      setDashboardTab('CAMPAIGN'); 
                    }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'CAMPAIGN'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Campaign & Rallies {isJuniorMember && '🔒'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (isJuniorMember) {
                        playSound('error');
                        setWarningAlert("🔒 Parliament access is restricted to official party leaders during active national campaigns.");
                        return;
                      }
                      playSound('click'); 
                      setDashboardTab('PARLIAMENT'); 
                    }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'PARLIAMENT'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" /> Parliament {isJuniorMember && '🔒'}
                  </button>

                  <button
                    onClick={() => {
                      playSound('click'); 
                      setDashboardTab('CONGRESS'); 
                    }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'CONGRESS'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Party Congress
                  </button>

                  <button
                    onClick={() => {
                      if (isJuniorMember) {
                        playSound('error');
                        setWarningAlert("🔒 Junior members do not have access to the official party treasury.");
                        return;
                      }
                      playSound('click'); 
                      setDashboardTab('FINANCE'); 
                    }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'FINANCE'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" /> Finance & Treasury {isJuniorMember && '🔒'}
                  </button>

                  <button
                    onClick={() => {
                      if (!isRuling) {
                        playSound('error');
                        setWarningAlert("You must win the general election first to unlock Diplomatic Actions!");
                        return;
                      }
                      playSound('click');
                      setDashboardTab('DIPLOMACY');
                    }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'DIPLOMACY'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" /> Diplomatic Actions {!isRuling && '🔒'}
                  </button>
                </div>
              </div>

              {/* SOVEREIGN GOVERNANCE ROW */}
              {(completedCountries.length > 0 || isRuling) && (
                <div>
                  <span className="text-[9px] font-mono font-bold text-rose-450 uppercase tracking-wider block mb-1.5 ml-1">
                    Sovereign Governance {isRuling ? '• Unlocked' : '• 🔒 Locked (Opposition Phase)'}
                  </span>
                  <div className={`p-1 rounded-2xl border flex gap-1 flex-wrap ${
                    darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    {/* CABINET & RESHUFFLES */}
                    <button
                      onClick={() => {
                        if (!isRuling) {
                          playSound('error');
                          setWarningAlert('This sovereign Cabinet panel is locked during the opposition phase. Complete and win the election first!');
                          return;
                        }
                        playSound('click'); 
                        setDashboardTab('CABINET'); 
                      }}
                      className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                        dashboardTab === 'CABINET'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Cabinet {isRuling ? '' : '🔒'}
                    </button>

                    {/* DIPLOMACY & FOREIGN POLICY */}
                    <button
                      onClick={() => {
                        if (!isRuling) {
                          playSound('error');
                          setWarningAlert('This sovereign Diplomacy panel is locked during the opposition phase. Complete and win the election first!');
                          return;
                        }
                        playSound('click'); 
                        setDashboardTab('DIPLOMACY'); 
                      }}
                      className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                        dashboardTab === 'DIPLOMACY'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Diplomacy {isRuling ? '' : '🔒'}
                    </button>

                    {/* TAXATION & ECONOMY */}
                    <button
                      onClick={() => {
                        if (!isRuling) {
                          playSound('error');
                          setWarningAlert('This sovereign Taxation panel is locked during the opposition phase. Complete and win the election first!');
                          return;
                        }
                        playSound('click'); 
                        setDashboardTab('TAXATION'); 
                      }}
                      className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                        dashboardTab === 'TAXATION'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Taxation & Economy {isRuling ? '' : '🔒'}
                    </button>

                    {/* MILITARY OPERATIONS */}
                    <button
                      onClick={() => {
                        if (!isRuling) {
                          playSound('error');
                          setWarningAlert('This sovereign Military panel is locked during the opposition phase. Complete and win the election first!');
                          return;
                        }
                        playSound('click'); 
                        setDashboardTab('MILITARY'); 
                      }}
                      className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                        dashboardTab === 'MILITARY'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Military {isRuling ? '' : '🔒'}
                    </button>

                    {/* WATCHDOGS */}
                    <button
                      onClick={() => {
                        if (!isRuling) {
                          playSound('error');
                          setWarningAlert('This sovereign Watchdogs panel is locked during the opposition phase. Complete and win the election first!');
                          return;
                        }
                        playSound('click'); 
                        setDashboardTab('WATCHDOG'); 
                      }}
                      className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                        dashboardTab === 'WATCHDOG'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" /> Watchdogs {isRuling ? '' : '🔒'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TAB WORKSPACE */}
            {dashboardTab === 'CAMPAIGN' && (
              <CampaignView
                country={selectedCountry}
                party={playerParty}
                onUpdateCountry={handleUpdateCountry}
                onUpdateParty={setPlayerParty}
                onSpendTurn={handleSpendTurn}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'PARLIAMENT' && (
              <ParliamentView
                country={selectedCountry}
                party={playerParty}
                onUpdateCountry={handleUpdateCountry}
                onUpdateParty={setPlayerParty}
                darkMode={darkMode}
                coalitions={coalitions}
                onUpdateCoalitions={setCoalitions}
                electionSeats={electionSeats}
              />
            )}

            {dashboardTab === 'CONGRESS' && (
              <CongressView
                country={selectedCountry}
                party={playerParty}
                onUpdateParty={setPlayerParty}
                onSpendTurn={handleSpendTurn}
                darkMode={darkMode}
                isJuniorMember={isJuniorMember}
                onWinLeadership={handleWinLeadership}
              />
            )}

            {dashboardTab === 'FINANCE' && selectedCountry && playerParty && (
              <FinanceView
                country={selectedCountry}
                party={playerParty}
                onUpdateCountry={handleUpdateCountry}
                onUpdateParty={setPlayerParty}
                darkMode={darkMode}
                isRuling={isRuling}
                treasury={treasury}
                onUpdateTreasury={setTreasury}
              />
            )}

            {dashboardTab === 'CABINET' && (
              <CabinetView
                country={selectedCountry}
                party={playerParty}
                cabinet={cabinet}
                onUpdateCabinet={setCabinet}
                treasury={treasury}
                onUpdateTreasury={setTreasury}
                darkMode={darkMode}
                coalitions={coalitions}
              />
            )}

            {dashboardTab === 'DIPLOMACY' && (
              <DiplomacyView
                country={selectedCountry}
                party={playerParty}
                diplomaticRelations={diplomaticRelations}
                onUpdateRelations={setDiplomaticRelations}
                treasury={treasury}
                onUpdateTreasury={setTreasury}
                influence={playerParty.influence}
                onUpdateInfluence={(inf) => setPlayerParty({ ...playerParty, influence: inf })}
                internationalReputation={internationalReputation}
                onUpdateReputation={setInternationalReputation}
                publicApprovalImpact={adjustPublicApproval}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'TAXATION' && (
              <GovernanceView
                country={selectedCountry}
                party={playerParty}
                isRuling={isRuling}
                onSetRuling={setIsRuling}
                taxRates={taxRates}
                onUpdateTaxRates={setTaxRates}
                investorConfidence={investorConfidence}
                onUpdateInvestorConfidence={setInvestorConfidence}
                treasury={treasury}
                onUpdateTreasury={setTreasury}
                inflation={inflation}
                onUpdateInflation={setInflation}
                freedomIndex={freedomIndex}
                onUpdateFreedomIndex={setFreedomIndex}
                bannedParties={bannedParties}
                onUpdateBannedParties={setBannedParties}
                civilWarRisk={civilWarRisk}
                onUpdateCivilWarRisk={setCivilWarRisk}
                publicApprovalImpact={adjustPublicApproval}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'MILITARY' && (
              <MilitaryView
                country={selectedCountry}
                party={playerParty}
                treasury={treasury}
                onUpdateTreasury={setTreasury}
                civilWarRisk={civilWarRisk}
                onUpdateCivilWarRisk={setCivilWarRisk}
                freedomIndex={freedomIndex}
                onUpdateFreedomIndex={setFreedomIndex}
                publicApprovalImpact={adjustPublicApproval}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'WATCHDOG' && (
              <CivicWatchdogView
                country={selectedCountry}
                party={playerParty}
                freedomIndex={freedomIndex}
                internationalReputation={internationalReputation}
                bannedPartiesCount={bannedParties.length}
                publicApprovalImpact={adjustPublicApproval}
                onUpdateReputation={setInternationalReputation}
                darkMode={darkMode}
              />
            )}

          </div>
        )}

        {/* PHASE 4: GENERAL RUN OF ELECTION DAY RESULTS */}
        {activeScreen === 'ELECTION_SIMULATOR' && selectedCountry && playerParty && (
          <ElectionSimulator
            country={selectedCountry}
            party={playerParty}
            onElectionFinished={handleElectionFinished}
            darkMode={darkMode}
            coalitions={coalitions}
          />
        )}

        {/* EXTRAORDINARY PARTY CONGRESS CHALLENGE */}
        {activeScreen === 'PARTY_CONGRESS' && selectedCountry && playerParty && (
          <PartyCongressView
            country={selectedCountry}
            party={playerParty}
            onWinCongress={handleWinCongress}
            onBackToMap={() => {
              setIsJuniorMember(false);
              setActiveScreen('MAP');
            }}
            darkMode={darkMode}
          />
        )}

        {/* CIVIL WAR TACTICAL BATTLE ENGAGEMENT */}
        {activeScreen === 'TACTICAL_BATTLE' && selectedCountry && playerParty && (
          <TacticalBattleView
            country={selectedCountry}
            party={playerParty}
            civilWarRisk={civilWarRisk}
            darkMode={darkMode}
            onBattleFinished={(success: boolean) => {
              if (success) {
                setCivilWarRisk(10);
                setWarningAlert("💥 GLORIOUS VICTORY: Our military forces have cleared all rebel cells in the capital. The indivisible integrity of the state has been successfully protected!");
                setActiveScreen('MAIN_DASHBOARD');
              } else {
                setWarningAlert("💀 DEFEAT: After our military units were defeated, the rebels stormed the presidential palace and overthrew the government. You have lost control of the administration.");
                setActiveScreen('MAP');
                setSelectedCountry(null);
                setPlayerParty(null);
                setIsRuling(false);
              }
            }}
          />
        )}
      </main>

      {/* HOW TO PLAY MODAL overlay popup */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-[100] h-full w-full bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 flex flex-col gap-4 animate-scale-up ${
            darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <h3 className="text-lg font-black font-mono uppercase tracking-wide">Paths to Power: How to Play</h3>
              </div>
              <button
                id="close-how-to-play"
                onClick={() => setShowHowToPlay(false)}
                className={`p-1.5 rounded-lg border transition-all hover:bg-red-500/10 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'
                }`}
              >
                <X className="w-5 h-5 text-rose-500" />
              </button>
            </div>

            <div className="text-xs space-y-4 max-h-[420px] overflow-y-auto pr-1 leading-relaxed">
              <div className="space-y-1.5">
                <h4 className="font-bold text-indigo-400">1. Paint the Map (Win Condition)</h4>
                <p className="text-slate-400">
                  All playable nations start in a neutral gray/grid pattern on the world map. When you select a country and win the majority of legislative seats on Election Day, it will illuminate with your political party's color! Your ultimate goal is to secure electoral victories across all playable nations.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-indigo-400">2. Character Creation and setup</h4>
                <p className="text-slate-450">
                  When establishing your political party, you can distribute 12 Character Points across 4 critical leadership skills:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                  <li><strong>Charisma:</strong> Grows initial supporter turnout and strengthens delegate loyalty.</li>
                  <li><strong>Eloquence:</strong> Multiplies the positive vote share gains from successful rally speeches.</li>
                  <li><strong>Organization:</strong> Confers extra starting budget and minimizes weekly campaign headquarters expenses.</li>
                  <li><strong>Strategy:</strong> Enhances lobbying power and parliamentary control during critical assembly votes.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-indigo-400">3. Running Campaigns and Holding Rallies</h4>
                <p className="text-slate-400">
                  Travel to contested electoral districts to host Rallies. Answer critical public questions about economy, welfare, security, and environment. Choosing strategically aligned stances will sway different demographic groups (Workers, Youth, Nationalists, Bureaucrats) to your side.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-indigo-400">4. Parliament and Legislative Control</h4>
                <p className="text-slate-400">
                  Sponsoring legislative bills in parliament builds broad political influence and popularity. If you lack the required seat plurality, spend Political Influence on lobbying delegates or deploy budget funds to ensure a YES vote.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-indigo-400">5. Party Convention and Loyalty</h4>
                <p className="text-slate-400">
                  If your delegates' loyalty drops below 45%, a vote of no confidence may trigger, locking you out of launching elections. Keep them satisfied by hosting conventions, gifting items, or negotiating backroom promises to refresh loyalty. You can also deploy tactical Decisions to unlock passive campaign upgrades.
                </p>
              </div>
            </div>

            <button
              id="confirm-how-to-play-close-btn"
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3.5 rounded-2xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg cursor-pointer text-center"
            >
              Understood! Let's Campaign
            </button>
          </div>
        </div>
      )}

      {/* WARNING ALERT CUSTOM POPUP MODAL */}
      {warningAlert && (
        <div className="fixed inset-0 z-[120] h-full w-full bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl border p-6 flex flex-col gap-5 items-center text-center animate-scale-up ${
            darkMode ? 'bg-slate-950 border-rose-500/30' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className={`text-lg font-black uppercase tracking-wide ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                ACCESS RESTRICTED
              </h3>
              <p className={`text-xs leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {warningAlert}
              </p>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setWarningAlert(null);
              }}
              className="w-full py-3.5 rounded-2xl bg-rose-650 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg cursor-pointer text-center uppercase tracking-wider"
            >
              Close & Go Back
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-[130] h-full w-full bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl border p-6 flex flex-col gap-5 items-center text-center animate-scale-up ${
            darkMode ? 'bg-slate-950 border-indigo-500/30' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-450 animate-pulse">
              <HelpCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className={`text-lg font-black uppercase tracking-wide ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {confirmModal.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {confirmModal.message}
              </p>
            </div>

            <div className="w-full flex gap-3">
              <button
                onClick={() => {
                  playSound('click');
                  if (confirmModal.onCancel) {
                    confirmModal.onCancel();
                  } else {
                    setConfirmModal(null);
                  }
                }}
                className={`flex-1 py-3.5 rounded-2xl border font-bold text-xs uppercase tracking-wider cursor-pointer ${
                  darkMode 
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  confirmModal.onConfirm();
                }}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg cursor-pointer text-center uppercase tracking-wider transition-all"
              >
                {confirmModal.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ELECTION VICTORY / GOVERNING SUCCESS MODAL */}
      {showElectionSuccessModal && selectedCountry && playerParty && (
        <div className="fixed inset-0 z-[120] h-full w-full bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-xl rounded-3xl border p-8 flex flex-col gap-6 items-center animate-scale-up ${
            darkMode ? 'bg-slate-950 border-emerald-500/30' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            
            {showPressConference && pressConferenceIndex < 3 ? (
              // Press Conference Steps
              (() => {
                const currentQ = activePressQuestions[pressConferenceIndex];

                if (!currentQ) return null;

                return (
                  <div className="w-full flex flex-col gap-5 text-left">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
                      <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-2 uppercase">
                        <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        LIVE PRESS CONFERENCE ({pressConferenceIndex + 1}/3)
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">PRESIDENTIAL DECREE</span>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                      <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs border ${currentQ.color}`}>
                        {currentQ.avatar}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-250 italic leading-relaxed border-l-2 border-emerald-500/40 pl-3">
                      "{currentQ.question}"
                    </p>

                    <div className="flex flex-col gap-2.5 mt-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">SELECT YOUR RESPONSE:</span>
                      {currentQ.options.map((opt: any, oIdx: number) => (
                        <button
                          key={oIdx}
                          onClick={() => {
                            playSound('click');
                            setPressTreasuryBonus(prev => prev + (opt.treasuryBonus || 0));
                            setPressFreedomBonus(prev => prev + (opt.freedomBonus || 0));
                            setPressReputationBonus(prev => prev + (opt.reputationBonus || 0));
                            setPressConferenceIndex(prev => prev + 1);
                          }}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 text-slate-200 text-left transition-all hover:scale-[1.01] cursor-pointer"
                        >
                          <div className="font-bold text-xs text-slate-100">{opt.text}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                            {opt.bonusDesc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : (
              // Final Step: Choice to Rule or Return
              <>
                <div className="p-5 rounded-full bg-emerald-500/10 text-emerald-500 animate-pulse">
                  <Award className="w-14 h-14" />
                </div>

                <div className="space-y-3 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400">
                    Electoral Victory
                  </span>
                  <h3 className={`text-2xl font-black uppercase tracking-tight ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    CONGRATULATIONS! {playerParty.name} WINS THE ELECTION!
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    You have successfully concluded the press conference! The election results are now official. Would you like to immediately form your cabinet, appoint ministers, and begin making diplomatic and military decisions?
                  </p>

                  <div className="p-3.5 bg-slate-900/60 border border-slate-850 rounded-2xl flex flex-wrap gap-4 items-center justify-center text-xs font-mono max-w-sm mx-auto">
                    <div className="text-left">
                      <div className="text-slate-450 text-[10px]">TREASURY BONUS</div>
                      <div className="text-emerald-400 font-bold">+{pressTreasuryBonus.toLocaleString()} ₺</div>
                    </div>
                    <div className="border-l border-slate-800 h-6"></div>
                    <div className="text-left">
                      <div className="text-slate-450 text-[10px]">FREEDOM INDEX</div>
                      <div className="text-cyan-400 font-bold">+{pressFreedomBonus} Pts</div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={() => {
                      playSound('click');
                      handleFormCabinet();
                    }}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg cursor-pointer text-center uppercase tracking-widest transition-all"
                  >
                    Form Cabinet & Start Governing
                  </button>

                  <button
                    onClick={() => {
                      playSound('click');
                      handleReturnToMap();
                    }}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs cursor-pointer text-center uppercase tracking-widest transition-all border ${
                      darkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Return to World Map
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* GOVERNANCE EVENT OVERLAY POPUP */}
      {currentEvent && (
        <div className="fixed inset-0 z-[130] h-full w-full bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl border p-8 flex flex-col gap-6 items-center text-center animate-scale-up ${
            darkMode ? 'bg-slate-950 border-indigo-500/30' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 animate-bounce">
              <Globe className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400">
                ⚠️ STATE GOVERNANCE ALERT • RANDOM EVENT
              </span>
              <h3 className={`text-xl font-black uppercase tracking-tight ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {currentEvent.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {currentEvent.description}
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              {currentEvent.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSound('click');
                    opt.effect();
                    setCurrentEvent(null);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer text-left transition-all flex items-center justify-between group"
                >
                  <span>{opt.text}</span>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Copyright */}
      <footer className={`py-4 text-center text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        © 2026 Paths To Power. All rights reserved.
      </footer>
    </div>
  );
}
