import React, { useState, useEffect, useRef } from 'react';
import { Country, Party, ScenarioYear } from '../types';
import { countryColors, PLAYABLE_COUNTRIES } from '../constants/countries';
import { getPlayableCountriesForScenario } from '../constants/eraCountries';
import { playSound } from '../lib/sounds';
import { isCountryActive, getSuccessorCountryId, migrateCountryId } from '../utils/countryUtils';
import { 
  Globe, Shield, Landmark, Sparkles, Heart, Scale, Users, Coins, 
  AlertTriangle, Swords, Flame, Check, Zap, X, Lock, Building2, 
  DollarSign, Activity, TrendingUp, Handshake, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import { getVassalStates, getVassalStateById } from '../utils/territorialControl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const countryCoords: Record<string, [number, number]> = {
  US: [38.0, -97.0],
  BR: [-14.235, -51.925],
  GB: [55.378, -3.436],
  DE: [51.165, 10.451],
  TR: [38.963, 35.243],
  EG: [26.820, 30.802],
  JP: [36.204, 138.252],
  CA: [56.130, -106.346],
  AR: [-38.416, -63.616],
  ZA: [-30.559, 22.937],
  IN: [20.593, 78.962],
  IT: [41.871, 12.567],
  ID: [-0.789, 113.921],
  MX: [23.634, -102.552],
  ES: [40.463, -3.749],
  KR: [35.907, 127.766],
  AU: [-25.274, 133.775],
  RU: [61.524, 105.318],
  UA: [48.379, 31.165],
  IL: [31.046, 34.851],
  PS: [31.952, 35.233],
  CN: [35.861, 104.195],
  TW: [23.697, 120.960],
  FR: [46.227, 2.213],
  RO: [45.943, 24.966],
  HU: [47.162, 19.503],
  SA: [23.885, 45.079],
  IR: [32.427, 53.688],
  PL: [51.919, 19.145],
  GR: [39.074, 21.824],
  SE: [60.128, 18.643],
  CD: [-4.4419, 15.2663],
  COD: [-4.4419, 15.2663],
  CG: [-4.2634, 15.2429],
  COG: [-4.2634, 15.2429],
  KP: [40.339, 127.510],
  SU: [60.000, 90.000],
  DDR: [52.520, 13.405],
  CS: [49.817, 15.473],
  YU: [44.016, 20.911],
  CL: [-35.675, -71.543],
  IS: [64.963, -19.020],
  PT: [39.399, -8.224],
  AZ: [40.143, 47.576]
};

export interface ForeignAidPackage {
  id: string;
  countryName: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  type: 'funds' | 'equipment' | 'divisions' | 'humanitarian' | 'intel';
  amountPerTurn: number;
  description: string;
}

interface DiplomacyViewProps {
  country: Country;
  party: Party;
  isRuling?: boolean;
  diplomaticRelations: Record<string, { status: 'Allies' | 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }>;
  onUpdateRelations: (updatedRelations: any) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  influence: number;
  onUpdateInfluence: (updatedInfluence: number) => void;
  internationalReputation: number;
  onUpdateReputation: (updatedReputation: number) => void;
  publicApprovalImpact: (delta: number) => void;
  darkMode: boolean;
  scenario?: ScenarioYear | string;
  freedomIndex?: number;
  countryIdeologies?: Record<string, string>;
  countryFreedomScores?: Record<string, number>;
  onNavigateToWar?: () => void;
  foreignAidPackages?: Record<string, ForeignAidPackage>;
  onUpdateForeignAid?: (updater: any) => void;
  foreignLeaders?: Record<string, { leader: string; rulingParty: string; ideology: string; portrait?: string }>;
}

const getScenarioBg = (scenarioId: string) => {
  switch (scenarioId) {
    case '2026': return '/bg-2026.svg';
    case '1950': return '/bg-1950.svg';
    case '1936': return '/bg-1936.svg';
    case '1914': return '/bg-1914.svg';
    case '1920': return '/bg-1920.svg';
    default: return '/bg-2026.svg';
  }
};

export const DiplomacyView: React.FC<DiplomacyViewProps> = ({
  country,
  party,
  isRuling = true,
  diplomaticRelations,
  onUpdateRelations,
  treasury,
  onUpdateTreasury,
  influence,
  onUpdateInfluence,
  internationalReputation,
  onUpdateReputation,
  publicApprovalImpact,
  darkMode,
  scenario = '2026',
  freedomIndex = 75,
  countryIdeologies = {},
  countryFreedomScores = {},
  onNavigateToWar,
  foreignAidPackages = {},
  onUpdateForeignAid,
  foreignLeaders = {},
}) => {
  const [mapMode, setMapMode] = useState<'RELATIONS' | 'WARS' | 'IDEOLOGY' | 'FREEDOM' | 'INFLUENCE'>('RELATIONS');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [casusBelli, setCasusBelli] = useState<Record<string, boolean>>({});
  const [fundedRebels, setFundedRebels] = useState<Record<string, boolean>>({});

  const handleFundRebels = (targetId: string) => {
    const cost = 80000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient National Budget! Funding local rebel groups requires paying ₺/$/€ ${cost.toLocaleString()} covert operations cost.`);
      return;
    }
    
    onUpdateTreasury(treasury - cost);
    setFundedRebels(prev => ({ ...prev, [targetId]: true }));
    setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    
    const currentRelation = diplomaticRelations[targetId];
    if (currentRelation) {
      const updated = {
        ...diplomaticRelations,
        [targetId]: { ...currentRelation, opinion: Math.max(0, currentRelation.opinion - 35) }
      };
      onUpdateRelations(updated);
    }
    
    playSound('success');
    setSuccessMessage(`Covert rebel funding approved! Local unrest successfully increased in ${getCountryName(targetId)}, dropping their stability and opinion by 35, and fabricating a 100% valid Casus Belli!`);
    setErrorMessage(null);
  };

  // Available Bloc memberships
  const [activeBlocs, setActiveBlocs] = useState<{ economic: boolean; military: boolean; diplomatic: boolean }>({
    economic: false,
    military: false,
    diplomatic: false
  });

  // Selected country on the visual tactical world map (null by default or ID when clicked)
  const [selectedMapCountryId, setSelectedMapCountryId] = useState<string | null>(null);

  // Esc key closes the floating panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMapCountryId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-migrate or clear obsolete country selection for the active scenario (e.g. 2026)
  useEffect(() => {
    if (selectedMapCountryId && !isCountryActive(selectedMapCountryId, scenario)) {
      const successor = getSuccessorCountryId(selectedMapCountryId, scenario);
      setSelectedMapCountryId(isCountryActive(successor, scenario) ? successor : null);
    }
  }, [selectedMapCountryId, scenario]);

  const getCountryDetails = (rawCid: string) => {
    const activeCid = isCountryActive(rawCid, scenario) ? rawCid : getSuccessorCountryId(rawCid, scenario);
    const cid = isCountryActive(activeCid, scenario) ? activeCid : rawCid;
    const isSelf = cid === country.id;

    // 0. Check if target is a registered Vassal State / Buffer State (Requirement 2)
    const vassal = getVassalStateById(cid) || getVassalStates().find(v => v.id === cid);
    if (vassal) {
      const isOurVassal = vassal.suzerainId === country.id;
      return {
        id: vassal.id,
        name: vassal.name,
        flag: vassal.flag || '🛡️',
        governmentType: `Autonomous Buffer / Puppet State (${vassal.suzerainName})`,
        rulingParty: vassal.rulingParty || `${vassal.name} Council`,
        ideology: vassal.ideology || 'Aligned Protectorate',
        leader: vassal.leader || `High Commissioner (${vassal.suzerainName})`,
        portrait: undefined,
        population: `${(vassal.provinces.length * 1.5).toFixed(1)}M`,
        gdp: `$${(vassal.provinces.length * 6.5).toFixed(1)} Billion`,
        militaryStrength: `Protectorate Garrison (${vassal.suzerainName})`,
        stability: 88,
        stabilityLabel: 'Loyal & Protected',
        relationScore: isOurVassal ? 100 : 50,
        relationStatus: isOurVassal ? 'Alliance' : 'Neutral',
        activeWars: [],
        isVassal: true,
        vassalOf: vassal.suzerainName,
        suzerainId: vassal.suzerainId,
        color: vassal.color,
        provinces: vassal.provinces
      };
    }

    const scenarioCountries = getPlayableCountriesForScenario((scenario as ScenarioYear) || '2026');
    const matchedCountry = scenarioCountries.find(c => c.id === cid) || PLAYABLE_COUNTRIES.find(c => c.id === cid);

    const rel = diplomaticRelations[cid] || { status: 'Neutral' as const, opinion: 50 };
    
    // Relation score (-100 to +100)
    let relationScore = 0;
    if (isSelf) {
      relationScore = 100;
    } else if (rel.status === 'At War') {
      relationScore = -100;
    } else {
      relationScore = Math.max(-100, Math.min(100, Math.round((rel.opinion - 50) * 2)));
    }

    // Comprehensive government types & leaders per country & scenario
    const database: Record<string, {
      governmentType: string;
      rulingParty: string;
      ideology: string;
      leader: string;
      population: string;
      gdp: string;
      militaryStrength: string;
      baseStability: number;
    }> = {
      CD: {
        governmentType: 'Semi-Presidential Democratic Republic',
        rulingParty: 'Union for Democracy and Social Progress (UDPS)',
        ideology: 'Social Democrat / African Nationalism',
        leader: 'Félix Tshisekedi',
        population: '102M',
        gdp: '$67.5 Billion',
        militaryStrength: 'Rank #72 (FARDC Armed Forces)',
        baseStability: 45
      },
      CG: {
        governmentType: 'Presidential Republic',
        rulingParty: 'Congolese Party of Labour (PCT)',
        ideology: 'Social Democrat / African Socialism',
        leader: 'Denis Sassou Nguesso',
        population: '6.1M',
        gdp: '$15.8 Billion',
        militaryStrength: 'Rank #115 (FAC Congolese Armed Forces)',
        baseStability: 62
      },
      US: {
        governmentType: 'Federal Presidential Republic',
        rulingParty: scenario === '1950' ? 'Democratic Party (Truman)' : scenario === '1936' ? 'Democratic Party (New Deal)' : scenario === '1914' ? 'Democratic Party (Wilson)' : 'Democratic Party',
        ideology: 'Liberal / Centrist',
        leader: scenario === '1950' ? 'Harry S. Truman' : scenario === '1936' ? 'Franklin D. Roosevelt' : scenario === '1920' ? 'Woodrow Wilson' : scenario === '1914' ? 'Woodrow Wilson' : 'Joe Biden',
        population: scenario === '1950' ? '152M' : scenario === '1936' ? '128M' : scenario === '1914' ? '99M' : '335M',
        gdp: scenario === '1950' ? '$300B' : scenario === '1936' ? '$85B' : scenario === '1914' ? '$40B' : '$27.4 Trillion',
        militaryStrength: 'Rank #1 (Superpower)',
        baseStability: 86
      },
      TR: {
        governmentType: scenario === '1920' || scenario === '1914' ? 'Constitutional Grand Assembly' : 'Executive Presidential Republic',
        rulingParty: scenario === '1950' ? 'Democrat Party (DP)' : scenario === '1936' || scenario === '1920' ? 'Republican People\'s Party (CHP)' : scenario === '1914' ? 'Committee of Union and Progress (İTC)' : 'AK Party (People\'s Alliance)',
        ideology: countryIdeologies['TR'] || (scenario === '1920' ? 'Kemalist / Republican' : 'Right / Conservative-Nationalist'),
        leader: scenario === '1950' ? 'Adnan Menderes' : scenario === '1936' ? 'Mustafa Kemal Atatürk' : scenario === '1920' ? 'Mustafa Kemal Paşa' : scenario === '1914' ? 'Mehmed V / Enver Paşa' : 'Recep Tayyip Erdoğan',
        population: scenario === '1950' ? '21M' : scenario === '1936' ? '16.5M' : scenario === '1920' ? '13M' : scenario === '1914' ? '18.5M' : '85.3M',
        gdp: scenario === '1950' ? '$4.5B' : scenario === '1936' ? '$1.8B' : scenario === '1914' ? '$900M' : '$1.15 Trillion',
        militaryStrength: 'Rank #8 (NATO Strategic Flank)',
        baseStability: 80
      },
      DE: {
        governmentType: scenario === '1936' ? 'Totalitarian Regime' : scenario === '1914' ? 'Imperial Monarchy' : 'Federal Parliamentary Republic',
        rulingParty: scenario === '1950' ? 'CDU/CSU (Adenauer)' : scenario === '1936' ? 'NSDAP' : scenario === '1914' ? 'Imperial Reichstag' : 'SPD Traffic Light Coalition',
        ideology: countryIdeologies['DE'] || 'Social Democrat / Centrist',
        leader: scenario === '1950' ? 'Konrad Adenauer' : scenario === '1936' ? 'Adolf Hitler' : scenario === '1920' ? 'Friedrich Ebert' : scenario === '1914' ? 'Kaiser Wilhelm II' : 'Olaf Scholz',
        population: scenario === '1950' ? '50M' : scenario === '1936' ? '67M' : scenario === '1914' ? '65M' : '84.4M',
        gdp: scenario === '1950' ? '$45B' : scenario === '1936' ? '$40B' : scenario === '1914' ? '$30B' : '$4.45 Trillion',
        militaryStrength: 'Rank #12 (European Heavyweight)',
        baseStability: 90
      },
      GB: {
        governmentType: 'Parliamentary Constitutional Monarchy',
        rulingParty: scenario === '1950' ? 'Labour Party (Attlee)' : scenario === '1936' ? 'Conservative National Gov' : scenario === '1914' ? 'Liberal Party (Asquith)' : 'Labour Party',
        ideology: countryIdeologies['GB'] || 'Social Democrat / Centrist',
        leader: scenario === '1950' ? 'Clement Attlee' : scenario === '1936' ? 'Stanley Baldwin' : scenario === '1920' ? 'David Lloyd George' : scenario === '1914' ? 'H. H. Asquith' : 'Keir Starmer',
        population: scenario === '1950' ? '50M' : scenario === '1936' ? '47M' : scenario === '1914' ? '45M' : '68.2M',
        gdp: scenario === '1950' ? '$38B' : scenario === '1936' ? '$25B' : scenario === '1914' ? '$22B' : '$3.34 Trillion',
        militaryStrength: 'Rank #5 (Royal Navy / Nuclear)',
        baseStability: 92
      },
      FR: {
        governmentType: scenario === '1914' || scenario === '1936' ? 'Third Republic Parliamentary' : 'Unitary Semi-Presidential Republic',
        rulingParty: scenario === '1950' ? 'MRP-SFIO Third Force' : scenario === '1936' ? 'Popular Front (Blum)' : scenario === '1914' ? 'Sacred Union' : 'Ensemble / Renaissance',
        ideology: countryIdeologies['FR'] || 'Liberal / Centrist',
        leader: scenario === '1950' ? 'Vincent Auriol' : scenario === '1936' ? 'Léon Blum' : scenario === '1914' ? 'Raymond Poincaré' : 'Emmanuel Macron',
        population: scenario === '1950' ? '42M' : scenario === '1936' ? '41M' : scenario === '1914' ? '39M' : '68.1M',
        gdp: scenario === '1950' ? '$30B' : scenario === '1936' ? '$20B' : scenario === '1914' ? '$18B' : '$3.05 Trillion',
        militaryStrength: 'Rank #6 (Nuclear Power)',
        baseStability: 84
      },
      RU: {
        governmentType: 'Federal Semi-Presidential Republic',
        rulingParty: 'United Russia',
        ideology: countryIdeologies['RU'] || 'Sovereign Nationalist',
        leader: 'Vladimir Putin',
        population: '144M',
        gdp: '$2.02 Trillion',
        militaryStrength: 'Rank #2 (Global Nuclear Arsenal)',
        baseStability: 65
      },
      SU: {
        governmentType: 'Soviet Socialist Federation',
        rulingParty: 'Communist Party of Soviet Union (CPSU)',
        ideology: 'Communist / Marxist-Leninist',
        leader: scenario === '1950' || scenario === '1936' ? 'Joseph Stalin' : scenario === '1920' ? 'Vladimir Lenin' : 'Nikolai II / Provisional Duma',
        population: scenario === '1950' ? '180M' : scenario === '1936' ? '160M' : '150M',
        gdp: 'Planned Socialist State Economy',
        militaryStrength: 'Rank #1 (Red Army Superpower)',
        baseStability: 85
      },
      UA: {
        governmentType: 'Unitary Semi-Presidential Republic',
        rulingParty: 'Servant of the People',
        ideology: countryIdeologies['UA'] || 'Centrist / Pro-European',
        leader: 'Volodymyr Zelenskyy',
        population: '38.0M',
        gdp: '$180 Billion',
        militaryStrength: 'Rank #15 (War-Mobilized Army)',
        baseStability: 48
      },
      CN: {
        governmentType: scenario === '1936' || scenario === '1920' ? 'Nationalist Republic (KMT)' : 'Unitary One-Party Socialist Republic',
        rulingParty: scenario === '1936' || scenario === '1920' ? 'Kuomintang (KMT)' : 'Communist Party of China (CPC)',
        ideology: scenario === '1936' || scenario === '1920' ? 'Tridemism / Nationalist' : 'Communist / Socialism',
        leader: scenario === '1950' ? 'Mao Zedong' : scenario === '1936' || scenario === '1920' ? 'Chiang Kai-shek' : 'Xi Jinping',
        population: scenario === '1950' ? '550M' : scenario === '1936' ? '470M' : '1.41 Billion',
        gdp: scenario === '1950' ? '$30B' : '$17.8 Trillion',
        militaryStrength: 'Rank #3 (PLA Superpower)',
        baseStability: 92
      },
      JP: {
        governmentType: scenario === '1936' || scenario === '1914' ? 'Imperial Constitutional Monarchy' : 'Parliamentary Monarchy',
        rulingParty: scenario === '1950' ? 'Liberal Party (Yoshida)' : scenario === '1936' ? 'Imperial Rule Assistance' : 'Liberal Democratic Party (LDP)',
        ideology: countryIdeologies['JP'] || 'Conservative / Centrist',
        leader: scenario === '1950' ? 'Shigeru Yoshida' : scenario === '1936' ? 'Emperor Hirohito' : 'Shigeru Ishiba',
        population: scenario === '1950' ? '83M' : scenario === '1936' ? '70M' : '124M',
        gdp: scenario === '1950' ? '$20B' : '$4.21 Trillion',
        militaryStrength: 'Rank #7 (JSDF High-Tech)',
        baseStability: 94
      },
      IN: {
        governmentType: 'Federal Parliamentary Republic',
        rulingParty: scenario === '1950' ? 'Indian National Congress (Nehru)' : 'Bharatiya Janata Party (BJP / NDA)',
        ideology: countryIdeologies['IN'] || 'Nationalist / Conservative',
        leader: scenario === '1950' ? 'Jawaharlal Nehru' : 'Narendra Modi',
        population: scenario === '1950' ? '360M' : '1.43 Billion',
        gdp: scenario === '1950' ? '$15B' : '$3.75 Trillion',
        militaryStrength: 'Rank #4 (Global Armed Forces)',
        baseStability: 82
      },
      BR: {
        governmentType: 'Federal Presidential Republic',
        rulingParty: scenario === '1950' ? 'PSD-PTB Coalition (Vargas)' : 'Workers\' Party (PT)',
        ideology: countryIdeologies['BR'] || 'Social Democrat / Left',
        leader: scenario === '1950' ? 'Getúlio Vargas' : 'Luiz Inácio Lula da Silva',
        population: scenario === '1950' ? '53M' : '216M',
        gdp: scenario === '1950' ? '$12B' : '$2.17 Trillion',
        militaryStrength: 'Rank #14 (Regional Power)',
        baseStability: 76
      },
      IT: {
        governmentType: scenario === '1936' ? 'Fascist Corporate State' : scenario === '1914' ? 'Constitutional Monarchy' : 'Parliamentary Republic',
        rulingParty: scenario === '1950' ? 'Christian Democracy (DC)' : scenario === '1936' ? 'PNF' : 'Brothers of Italy (FdI)',
        ideology: countryIdeologies['IT'] || 'National Conservative',
        leader: scenario === '1950' ? 'Alcide De Gasperi' : scenario === '1936' ? 'Benito Mussolini' : 'Giorgia Meloni',
        population: scenario === '1950' ? '46M' : '58.9M',
        gdp: scenario === '1950' ? '$15B' : '$2.25 Trillion',
        militaryStrength: 'Rank #10 (Air & Naval Force)',
        baseStability: 85
      },
      IL: {
        governmentType: 'Unitary Parliamentary Republic',
        rulingParty: 'Likud Coalition',
        ideology: countryIdeologies['IL'] || 'National Conservative',
        leader: 'Benjamin Netanyahu',
        population: '9.8M',
        gdp: '$520 Billion',
        militaryStrength: 'Rank #17 (IDF Air Superiority)',
        baseStability: 62
      },
      PS: {
        governmentType: 'State Administration under Occupation',
        rulingParty: 'PLO / Fatah Authorities',
        ideology: countryIdeologies['PS'] || 'Nationalist / Arab Socialist',
        leader: 'Mahmoud Abbas',
        population: '5.4M',
        gdp: '$18 Billion',
        militaryStrength: 'Asymmetric Local Defense',
        baseStability: 25
      },
      SA: {
        governmentType: 'Unitary Absolute Monarchy',
        rulingParty: 'House of Saud',
        ideology: 'Monarchist / Economic Reformist',
        leader: 'Mohammed bin Salman',
        population: '36.4M',
        gdp: '$1.07 Trillion',
        militaryStrength: 'Rank #22 (Modern Air Shield)',
        baseStability: 88
      },
      IR: {
        governmentType: scenario === '1950' || scenario === '1936' || scenario === '1914' ? 'Imperial Monarchy (Pahlavi/Qajar)' : 'Theocratic Islamic Republic',
        rulingParty: scenario === '1950' ? 'National Front (Mossadegh)' : 'Principalist Coalition / IRGC',
        ideology: countryIdeologies['IR'] || 'Theocratic / Anti-Imperialist',
        leader: scenario === '1950' ? 'Mohammad Mossadegh' : 'Ali Khamenei',
        population: scenario === '1950' ? '17M' : '88.5M',
        gdp: scenario === '1950' ? '$5B' : '$415 Billion',
        militaryStrength: 'Rank #13 (Missile & Drone Arsenal)',
        baseStability: 60
      },
      CL: {
        governmentType: 'Unitary Presidential Republic',
        rulingParty: 'Frente Amplio / Social Convergence',
        ideology: countryIdeologies['CL'] || 'Left / Democratic Socialist',
        leader: 'Gabriel Boric',
        population: '19.6M',
        gdp: '$335 Billion',
        militaryStrength: 'Rank #42 (Pacific Naval Modernization)',
        baseStability: 82
      },
      IS: {
        governmentType: 'Unitary Parliamentary Republic',
        rulingParty: 'Social Democratic Alliance (Samfylkingin)',
        ideology: countryIdeologies['IS'] || 'Center-Left / Social Democrat',
        leader: 'Kristrún Frostadóttir',
        population: '390,000',
        gdp: '$31 Billion',
        militaryStrength: 'NATO Strategic Host & Coast Guard',
        baseStability: 96
      },
      PT: {
        governmentType: 'Unitary Semi-Presidential Republic',
        rulingParty: 'Democratic Alliance (AD / PSD)',
        ideology: countryIdeologies['PT'] || 'Right / Conservative-Nationalist',
        leader: 'Luís Montenegro',
        population: '10.4M',
        gdp: '$287 Billion',
        militaryStrength: 'Rank #41 (NATO Atlantic Force)',
        baseStability: 88
      },
      GR: {
        governmentType: 'Unitary Parliamentary Republic',
        rulingParty: 'New Democracy (ND)',
        ideology: countryIdeologies['GR'] || 'Right / Conservative-Nationalist',
        leader: 'Kyriakos Mitsotakis',
        population: '10.4M',
        gdp: '$242 Billion',
        militaryStrength: 'Rank #29 (Aegean Navy & Modern Fighters)',
        baseStability: 78
      },
      PL: {
        governmentType: 'Unitary Parliamentary Republic',
        rulingParty: 'Civic Coalition (KO)',
        ideology: countryIdeologies['PL'] || 'Center / Liberal Democracy',
        leader: 'Donald Tusk',
        population: '37.7M',
        gdp: '$842 Billion',
        militaryStrength: 'Rank #20 (NATO Eastern Heavy Armor)',
        baseStability: 85
      },
      AZ: {
        governmentType: 'Unitary Semi-Presidential Republic',
        rulingParty: 'New Azerbaijan Party (YAP)',
        ideology: countryIdeologies['AZ'] || 'Right / Nationalist',
        leader: 'Ilham Aliyev',
        population: '10.3M',
        gdp: '$78 Billion',
        militaryStrength: 'Rank #57 (Artillery & Drone Force)',
        baseStability: 76
      }
    };

    const entry = database[cid];
    const flag = getCountryFlag(cid);
    const name = getCountryName(cid);
    
    // Determine governing party and dynamic ideology from actual governing party
    const rivalsList = matchedCountry?.rivals || [];
    const topParty = rivalsList.slice().sort((a, b) => (b.baseSupport || 0) - (a.baseSupport || 0))[0];

    const governmentType = entry?.governmentType || matchedCountry?.system || 'Representative Republic';
    const rulingParty = isSelf ? party.name : (entry?.rulingParty || topParty?.name || matchedCountry?.rivals?.[0]?.name || 'National Coalition');

    let derivedPartyIdeology: string | undefined = undefined;
    if (cid === 'TR') {
      derivedPartyIdeology = 'Right / Conservative-Nationalist';
    } else if (topParty?.ideology) {
      if (topParty.ideology.toLowerCase().includes('conservative')) {
        derivedPartyIdeology = 'Right / Conservative-Nationalist';
      } else if (topParty.ideology.toLowerCase().includes('social democrat')) {
        derivedPartyIdeology = 'Center-Left / Social Democrat';
      } else if (topParty.ideology.toLowerCase().includes('socialist') || topParty.ideology.toLowerCase().includes('communist')) {
        derivedPartyIdeology = 'Left / Democratic Socialist';
      } else if (topParty.ideology.toLowerCase().includes('nationalist')) {
        derivedPartyIdeology = 'Right / Nationalist';
      } else if (topParty.ideology.toLowerCase().includes('liberal')) {
        derivedPartyIdeology = 'Center / Liberal Democracy';
      } else {
        derivedPartyIdeology = topParty.ideology;
      }
    }

    const ideology = isSelf
      ? party.ideology
      : (countryIdeologies[cid] || derivedPartyIdeology || entry?.ideology || matchedCountry?.rivals?.[0]?.ideology || 'Centrist / Moderate');
    const leader = isSelf ? party.leader : (entry?.leader || matchedCountry?.rivals?.[0]?.leader || 'Head of State');
    const population = entry?.population || matchedCountry?.population || '25.0M';
    const gdp = entry?.gdp || '$450 Billion';
    const militaryStrength = entry?.militaryStrength || 'Rank #24 (National Armed Forces)';
    
    // Stability calculation
    let stability = entry?.baseStability || (countryFreedomScores[cid] ? Math.min(95, countryFreedomScores[cid] + 15) : 75);
    if (fundedRebels[cid]) stability = Math.max(15, stability - 30);
    if (rel.status === 'At War') stability = Math.max(10, stability - 25);
    
    let stabilityLabel: 'High' | 'Moderate' | 'Fragile' | 'Critical' = 'High';
    if (stability >= 75) stabilityLabel = 'High';
    else if (stability >= 50) stabilityLabel = 'Moderate';
    else if (stability >= 30) stabilityLabel = 'Fragile';
    else stabilityLabel = 'Critical';

    // Active wars
    const activeWars: string[] = [];
    if (rel.status === 'At War') {
      activeWars.push(`At War with ${country.name} (${country.flag})`);
    }
    globalConflicts.forEach(c => {
      if (!c.resolved && (c.countryA === cid || c.countryB === cid)) {
        const opp = c.countryA === cid ? c.countryB : c.countryA;
        activeWars.push(`${getCountryName(cid)} ⚔️ ${getCountryName(opp)}`);
      }
    });

    if (scenario === '2026') {
      if ((cid === 'RU' || cid === 'UA') && !activeWars.some(w => w.includes('Ukraine') || w.includes('Russia'))) {
        activeWars.push('Russia ⚔️ Ukraine (Territorial War)');
      }
      if ((cid === 'IL' || cid === 'PS') && !activeWars.some(w => w.includes('Israel') || w.includes('Palestine'))) {
        activeWars.push('Israel ⚔️ Palestine (Regional Conflict)');
      }
    } else if (scenario === '1950') {
      const isKoreanWarActive = diplomaticRelations?.['KP']?.status === 'At War' || diplomaticRelations?.['KR']?.status === 'At War';
      if (isKoreanWarActive && ['KR', 'CN', 'US', 'KP'].includes(cid) && !activeWars.some(w => w.includes('Korea'))) {
        activeWars.push('Korean War (UN vs. DPRK/China)');
      }
    } else if (scenario === '1936') {
      if (cid === 'ES' && !activeWars.some(w => w.includes('Civil War'))) {
        activeWars.push('Spanish Civil War');
      }
    } else if (scenario === '1920') {
      if (['TR', 'GR'].includes(cid) && !activeWars.some(w => w.includes('Independence'))) {
        activeWars.push('Turkish War of Independence');
      }
    } else if (scenario === '1914') {
      if (['DE', 'FR', 'GB', 'SU', 'RU', 'TR'].includes(cid) && !activeWars.some(w => w.includes('World War'))) {
        activeWars.push('World War I (Entente vs Central Powers)');
      }
    }

    const customLeader = foreignLeaders?.[cid];
    const finalLeader = customLeader?.leader || leader;
    const finalRulingParty = customLeader?.rulingParty || rulingParty;
    const finalIdeology = customLeader?.ideology || countryIdeologies[cid] || ideology;
    const finalPortrait = customLeader?.portrait;

    return {
      id: cid,
      name,
      flag,
      governmentType,
      rulingParty: finalRulingParty,
      ideology: finalIdeology,
      leader: finalLeader,
      portrait: finalPortrait,
      population,
      gdp,
      militaryStrength,
      stability,
      stabilityLabel,
      relationScore,
      relationStatus: rel.status,
      activeWars,
      isVassal: Boolean(rel.isVassal),
      vassalOf: rel.vassalOf
    };
  };

  const getPlayableCountryIdFromFeature = (feature: any): string | null => {
    if (!feature) return null;
    const id3 = String(feature.id || feature.properties?.iso_a3 || feature.properties?.ISO_A3 || feature.properties?.adm0_a3 || feature.properties?.sov_a3 || '').toUpperCase();
    const id2 = String(feature.properties?.iso_a2 || feature.properties?.ISO_A2 || feature.properties?.wb_a2 || '').toUpperCase();
    const name = String(feature.properties?.name || feature.properties?.NAME || feature.properties?.admin || '').toLowerCase();

    // Reject non-playable collision territories
    if (id3 === 'CAF' || id2 === 'CF' || name.includes('central african')) return null;
    if (id3 === 'ESH' || id2 === 'EH' || name.includes('western sahara')) return null;

    // French Guiana is integral department of France
    if (id3 === 'GUF' || id2 === 'GF' || name.includes('french guiana') || name.includes('guyane')) return 'FR';

    // Congo distinction: DRC (CD / COD) vs Republic of the Congo (CG / COG)
    if (id3 === 'COD' || id2 === 'CD' || id3 === 'ZAR' || name.includes('democratic republic of the congo') || name.includes('drc') || name.includes('kinshasa') || name === 'congo, democratic republic of the') {
      return 'CD';
    }
    if (id3 === 'COG' || id2 === 'CG' || name.includes('republic of the congo') || name.includes('brazzaville') || name === 'congo') {
      return 'CG';
    }

    const activeScenarioId: ScenarioYear = (scenario as ScenarioYear) || '2026';
    const activeCountries = getPlayableCountriesForScenario(activeScenarioId);

    // 1. HISTORICAL SCENARIO RESOLUTION (1950, 1936, 1920, 1914) - ALWAYS checked before modern codes!
    const isHistoricalSovietEra = activeScenarioId === '1950' || activeScenarioId === '1936' || activeScenarioId === '1920' || activeScenarioId === '1914';
    if (isHistoricalSovietEra) {
      const isSovietRepublic = 
        ['RUS', 'SUN', 'BLR', 'UKR', 'KAZ', 'UZB', 'TKM', 'TJK', 'KGZ', 'GEO', 'ARM', 'AZE', 'MDA', 'EST', 'LVA', 'LTU'].includes(id3) ||
        name.includes('soviet') || name.includes('russia') || name.includes('belarus') || name.includes('byelorussia') ||
        name.includes('ukraine') || name.includes('kazakhstan') || name.includes('uzbekistan') || name.includes('turkmenistan') ||
        name.includes('tajikistan') || name.includes('kyrgyzstan') || name.includes('georgia') || name.includes('armenia') ||
        name.includes('azerbaijan') || name.includes('moldova') || name.includes('estonia') || name.includes('latvia') || name.includes('lithuania');
      if (isSovietRepublic && activeCountries.some(c => c.id === 'SU')) {
        return 'SU';
      }

      const isCzechoslovakia = ['CZE', 'SVK', 'CSK'].includes(id3) || name.includes('czech') || name.includes('slovakia') || name.includes('czechoslovakia');
      if (isCzechoslovakia && activeCountries.some(c => c.id === 'CS')) {
        return 'CS';
      }

      const isYugoslavia = ['SRB', 'HRV', 'SVN', 'BIH', 'MKD', 'MNE', 'KOS', 'KVX', 'YUG'].includes(id3) || name.includes('serbia') || name.includes('croatia') || name.includes('slovenia') || name.includes('bosnia') || name.includes('macedonia') || name.includes('montenegro') || name.includes('kosovo') || name.includes('yugoslavia');
      if (isYugoslavia && activeCountries.some(c => c.id === 'YU')) {
        return 'YU';
      }

      if (id3 === 'DDR' || name.includes('east germany') || name.includes('german democratic') || name === 'gdr' || name === 'ddr') {
        if (activeCountries.some(c => c.id === 'DDR')) return 'DDR';
      }

      if (id3 === 'DE_WEST' || name.includes('west germany') || name.includes('federal republic of germany')) {
        if (activeCountries.some(c => c.id === 'DE')) return 'DE';
      }

      if (id3 === 'DEU' || id2 === 'DE' || name === 'germany' || name === 'deutschland') {
        if (activeCountries.some(c => c.id === 'DE')) return 'DE';
        if (activeCountries.some(c => c.id === 'DDR')) return 'DDR';
      }

      if (activeScenarioId === '1950') {
        if (['KEN', 'UGA', 'NGA', 'GHA', 'MYS', 'CYP', 'TZA', 'ZMB', 'ZWE', 'SLE'].includes(id3) || name.includes('kenya') || name.includes('nigeria') || name.includes('malaya')) {
          if (activeCountries.some(c => c.id === 'GB')) return 'GB';
        }
        if (['DZA', 'MDG'].includes(id3) || name.includes('algeria') || name.includes('madagascar')) {
          if (activeCountries.some(c => c.id === 'FR')) return 'FR';
        }
        if (id3 === 'KOR' || id2 === 'KR' || name.includes('south korea') || name.includes('korea, rep')) {
          if (activeCountries.some(c => c.id === 'KR')) return 'KR';
        }
        if (id3 === 'PRK' || id2 === 'KP' || name.includes('north korea') || name.includes('dprk')) {
          if (activeCountries.some(c => c.id === 'KP')) return 'KP';
        }
      }
    }

    // 2. Standard and Modern Resolution
    const a3ToA2: Record<string, string> = {
      USA: 'US', TUR: 'TR', DEU: 'DE', GBR: 'GB', EGY: 'EG', BRA: 'BR', JPN: 'JP',
      CAN: 'CA', ARG: 'AR', ZAF: 'ZA', IND: 'IN', ITA: 'IT', IDN: 'ID', MEX: 'MX',
      ESP: 'ES', KOR: 'KR', AUS: 'AU', FRA: 'FR', ROU: 'RO', HUN: 'HU', RUS: 'RU',
      UKR: 'UA', ISR: 'IL', PSE: 'PS', CHN: 'CN', TWN: 'TW', SAU: 'SA', IRN: 'IR',
      POL: 'PL', GRC: 'GR', SWE: 'SE', NOR: 'NO', FIN: 'FI', NLD: 'NL', BEL: 'BE',
      CHE: 'CH', AUT: 'AT', PRT: 'PT', IRL: 'IE', DNK: 'DK', CZE: 'CZ', SVK: 'SK',
      BGR: 'BG', HRV: 'HR', SRB: 'RS', AZE: 'AZ', PAK: 'PK', SYR: 'SY', IRQ: 'IQ',
      QAT: 'QA', ARE: 'AE', NZL: 'NZ', COD: 'CD', COG: 'CG'
    };

    let resolvedCode: string | null = null;
    if (id3 && a3ToA2[id3]) resolvedCode = a3ToA2[id3];
    else if (id2 && id2.length === 2 && id2 !== '-9' && Object.values(a3ToA2).includes(id2)) resolvedCode = id2;

    if (!resolvedCode) {
      if (name.includes('united states') || name.includes('america')) resolvedCode = 'US';
      else if (name.includes('turkey') || name.includes('türkiye')) resolvedCode = 'TR';
      else if (name.includes('germany') || name.includes('deutschland')) resolvedCode = 'DE';
      else if (name.includes('united kingdom') || name.includes('britain') || name.includes('england')) resolvedCode = 'GB';
      else if (name.includes('egypt')) resolvedCode = 'EG';
      else if (name.includes('brazil') || name.includes('brasil')) resolvedCode = 'BR';
      else if (name.includes('japan')) resolvedCode = 'JP';
      else if (name.includes('canada')) resolvedCode = 'CA';
      else if (name.includes('argentina')) resolvedCode = 'AR';
      else if (name.includes('south africa')) resolvedCode = 'ZA';
      else if (name.includes('india')) resolvedCode = 'IN';
      else if (name.includes('italy')) resolvedCode = 'IT';
      else if (name.includes('indonesia')) resolvedCode = 'ID';
      else if (name.includes('mexico')) resolvedCode = 'MX';
      else if (name.includes('spain')) resolvedCode = 'ES';
      else if (name.includes('south korea') || (activeScenarioId === '1950' && name.includes('korea'))) resolvedCode = 'KR';
      else if (name.includes('australia')) resolvedCode = 'AU';
      else if (name.includes('russia')) resolvedCode = 'RU';
      else if (name.includes('ukraine')) resolvedCode = 'UA';
      else if (name.includes('israel')) resolvedCode = 'IL';
      else if (name.includes('palestine')) resolvedCode = 'PS';
      else if (name.includes('china')) resolvedCode = 'CN';
      else if (name.includes('taiwan')) resolvedCode = 'TW';
      else if (name.includes('france')) resolvedCode = 'FR';
      else if (name.includes('saudi arabia')) resolvedCode = 'SA';
      else if (name.includes('iran')) resolvedCode = 'IR';
      else if (name.includes('poland')) resolvedCode = 'PL';
      else if (name.includes('greece')) resolvedCode = 'GR';
      else if (name.includes('sweden')) resolvedCode = 'SE';
      else if (name.includes('norway') || name.includes('norge')) resolvedCode = 'NO';
      else if (name.includes('finland') || name.includes('suomi')) resolvedCode = 'FI';
      else if (name.includes('switzerland') || name.includes('suisse') || name.includes('schweiz') || name.includes('svizzera')) resolvedCode = 'CH';
      else if (name.includes('portugal')) resolvedCode = 'PT';
      else if (name.includes('chile')) resolvedCode = 'CL';
      else if (name.includes('iceland')) resolvedCode = 'IS';
    }

    if (!resolvedCode) return null;

    if (!isCountryActive(resolvedCode, activeScenarioId)) {
      const successor = getSuccessorCountryId(resolvedCode, activeScenarioId);
      return isCountryActive(successor, activeScenarioId) ? successor : null;
    }

    return resolvedCode;
  };

  const getCountryColor = (cid: string) => {
    const scheme = countryColors[cid] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
    return scheme.default;
  };

  const getMapColor = (cid: string) => {
    if (mapMode === 'RELATIONS') {
      if (cid === country.id) return '#10b981'; // Our country
      const rel = diplomaticRelations[cid];
      if (rel) {
        if (rel.status === 'At War') return '#ef4444';
        if (rel.status === 'Alliance') return '#0ea5e9';
        if (rel.status === 'Defensive Pact') return '#3b82f6';
        if (rel.status === 'Sanctioned') return '#f59e0b';
        if (rel.status === 'Non-Aggression') return '#eab308';
        if (rel.opinion > 60) return '#4ade80';
        if (rel.opinion < 40) return '#f87171';
      }
      return countryColors[cid]?.default || '#94a3b8';
    }
    
    if (mapMode === 'IDEOLOGY') {
       if (cid === country.id && party) {
         const ideo = (party.ideology || party.name).toLowerCase();
         if (ideo.includes('communist') || ideo.includes('marxist') || ideo.includes('socialist') || ideo.includes('left')) return '#991b1b';
         if (ideo.includes('nationalist') || ideo.includes('sovereign right') || ideo.includes('populism')) return '#1e3a8a';
         if (ideo.includes('conservative') || ideo.includes('capitalist') || ideo.includes('republican') || ideo.includes('right')) return '#2563eb';
         if (ideo.includes('social dem') || ideo.includes('progressive')) return '#0891b2';
         if (ideo.includes('centrist') || ideo.includes('liberal') || ideo.includes('moderate')) return '#ca8a04';
         if (ideo.includes('green') || ideo.includes('ecolog')) return '#22c55e';
       }
       if (countryIdeologies[cid]) {
         const ideo = countryIdeologies[cid].toLowerCase();
         if (ideo.includes('communist') || ideo.includes('marxist') || ideo.includes('socialist') || ideo.includes('left')) return '#991b1b';
         if (ideo.includes('nationalist') || ideo.includes('sovereign right') || ideo.includes('populism')) return '#1e3a8a';
         if (ideo.includes('conservative') || ideo.includes('capitalist') || ideo.includes('republican') || ideo.includes('right')) return '#2563eb';
         if (ideo.includes('social dem') || ideo.includes('progressive')) return '#0891b2';
         if (ideo.includes('centrist') || ideo.includes('liberal') || ideo.includes('moderate')) return '#ca8a04';
         if (ideo.includes('green') || ideo.includes('ecolog')) return '#22c55e';
       }
       if (['SU', 'DDR', 'CN', 'CS', 'YU'].includes(cid)) return '#991b1b'; // Communist / Marxist-Leninist
       const playCountry = PLAYABLE_COUNTRIES.find(c => c.id === cid);
       if (!playCountry) return '#94a3b8';
       const rulingIdeology = playCountry.rivals[0]?.ideology || '';
       if (rulingIdeology.includes('Social') || rulingIdeology.includes('Left') || rulingIdeology.includes('Marxist')) return '#ef4444';
       if (rulingIdeology.includes('Nationalist') || rulingIdeology.includes('Sovereign')) return '#1e3a8a';
       if (rulingIdeology.includes('Conservative') || rulingIdeology.includes('Right')) return '#2563eb';
       if (rulingIdeology.includes('Liberal') || rulingIdeology.includes('Centrist') || rulingIdeology.includes('Democrat')) return '#facc15';
       if (rulingIdeology.includes('Green') || rulingIdeology.includes('Ecologist')) return '#22c55e';
       return '#6366f1';
    }

    if (mapMode === 'FREEDOM') {
      if (cid === country.id) {
        if (freedomIndex >= 70) return '#22c55e';
        if (freedomIndex >= 40) return '#eab308';
        return '#ef4444';
      }
      if (countryFreedomScores[cid] !== undefined) {
        const score = countryFreedomScores[cid];
        if (score >= 70) return '#22c55e';
        if (score >= 40) return '#eab308';
        return '#ef4444';
      }
      if (['SU', 'DDR', 'CN', 'CS'].includes(cid)) return '#ef4444';
      if (['US', 'GB', 'FR', 'DE', 'CA', 'AU', 'IS', 'PT'].includes(cid)) return '#22c55e';
      if (['TR', 'PL', 'RO', 'HU', 'IT', 'ES', 'CL', 'GR'].includes(cid)) return '#eab308';
      return '#64748b';
    }

    if (mapMode === 'INFLUENCE') {
      if (cid === country.id) return '#6366f1';
      if (['US', 'GB', 'FR', 'DE'].includes(cid)) return '#0284c7';
      if (['RU', 'CN', 'SU'].includes(cid)) return '#b91c1c';
      return '#475569';
    }

    return getCountryColor(cid);
  };

  const getIsAtWar = (id3: string, cid: string | null, name: string) => {
    if (cid && (diplomaticRelations[cid] as any)?.status === 'At War') return true;
    if (id3 && (diplomaticRelations[id3] as any)?.status === 'At War') return true;
    if (cid === country.id) {
      return Object.values(diplomaticRelations || {}).some(r => (r as any)?.status === 'At War');
    }
    if (scenario === '2026') {
      return ['UKR', 'RUS', 'ISR', 'PSE'].includes(id3) || cid === 'RU' || cid === 'UA' || cid === 'IL' || cid === 'PS' || name.includes('PALESTINE') || name.includes('ISRAEL') || name.includes('UKRAINE') || name.includes('RUSSIA');
    }
    if (scenario === '1950') {
      return ['KOR', 'PRK', 'CHN', 'USA'].includes(id3) || cid === 'KR' || cid === 'CN' || cid === 'US';
    }
    if (scenario === '1936') {
      return ['ESP', 'CHN', 'JPN', 'ETH', 'ITA'].includes(id3) || cid === 'ES' || cid === 'CN' || cid === 'JP' || cid === 'IT';
    }
    if (scenario === '1920') {
      return ['TUR', 'GRC', 'POL', 'RUS', 'SUN'].includes(id3) || cid === 'TR' || cid === 'GR' || cid === 'PL' || cid === 'SU';
    }
    if (scenario === '1914') {
      return ['DEU', 'FRA', 'GBR', 'RUS', 'SUN', 'TUR', 'SRB'].includes(id3) || cid === 'DE' || cid === 'FR' || cid === 'GB' || cid === 'SU' || cid === 'TR';
    }
    return false;
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [worldGeoJsonData, setWorldGeoJsonData] = useState<any>(null);
  const worldBgLayerRef = useRef<any>(null);
  useEffect(() => {
    let isMounted = true;
    const urls = [
      '/world_admin0_50m.geojson',
      'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json',
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
    ];
    const loadGeo = async () => {
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('text/html')) continue;
          const text = await res.text();
          if (text.trim().startsWith('<')) continue;
          const data = JSON.parse(text);
          if (isMounted && data && data.features) {
            setWorldGeoJsonData(data);
            return;
          }
        } catch {
          // Continue to next URL
        }
      }
    };
    loadGeo();
    return () => { isMounted = false; };
  }, []);

  const [germanStatesData, setGermanStatesData] = useState<any>(null);
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/gh/isellsoap/deutschlandGeoJSON@master/2_bundeslaender/4_niedrig.geo.json')
      .then(res => res.json())
      .then(data => { if (data) setGermanStatesData(data); })
      .catch(e => console.warn('German states load skipped', e));
  }, []);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const terrainLayerRef = useRef<L.TileLayer | null>(null);
  const oceanLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      try { map.stop(); map.off(); map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      terrainLayerRef.current = null;
      oceanLayerRef.current = null;
      markersRef.current = null;
      worldBgLayerRef.current = null;
    }
  };

  useEffect(() => {
    if (worldBgLayerRef.current) {
      worldBgLayerRef.current.setStyle((feature: any) => {
        const cid = getPlayableCountryIdFromFeature(feature);
        const id3 = String(feature?.id || feature?.properties?.ISO_A3 || feature?.properties?.iso_a3 || '').toUpperCase();
        const name = String(feature?.properties?.name || feature?.properties?.NAME || '').toUpperCase();
        const isAtWar = getIsAtWar(id3, cid, name);

        if (cid) {
          const isSelected = selectedMapCountryId === cid;
          const fillColor = getMapColor(cid);
          
          if (mapMode === 'WARS' && isAtWar) {
            return {
              fillColor: '#ef4444',
              color: isSelected ? "#ffffff" : "#ffffff",
              weight: isSelected ? 2.5 : 1.2,
              opacity: 1.0,
              fillOpacity: isSelected ? 0.92 : 0.72,
              interactive: true
            };
          }
          
          return {
            fillColor: fillColor,
            color: isSelected ? "#ffffff" : "#ffffff",
            weight: isSelected ? 2.5 : 1.2,
            opacity: 1.0,
            fillOpacity: isSelected ? 0.92 : 0.72,
            interactive: true
          };
        }
        
        const baseFill = (mapMode === 'WARS' && isAtWar) ? '#ef4444' : (darkMode ? "#1e293b" : "#e2e8f0");
        const borderColor = (mapMode === 'WARS' && isAtWar) ? (darkMode ? '#7f1d1d' : '#f87171') : (darkMode ? "#0f172a" : "#cbd5e1");
        return { fillColor: baseFill, color: borderColor, weight: (mapMode === 'WARS' && isAtWar) ? 1.5 : 0.8, opacity: 1.0, fillOpacity: (mapMode === 'WARS' && isAtWar) ? 0.6 : 0.5, interactive: false };
      });
    }
  }, [mapMode, darkMode, selectedMapCountryId, diplomaticRelations, scenario]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.0, 0.0],
        zoom: 1.8,
        minZoom: 2.0,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: false,
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1.0,
        worldCopyJump: false
      });

      const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

      const tiles = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 18,
        maxNativeZoom: 10,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        className: 'base-map-tile'
      }).addTo(map);
      
      tileLayerRef.current = tiles;

      const terrainPane = map.createPane('terrainPane');
      terrainPane.style.zIndex = '450';
      terrainPane.style.pointerEvents = 'none';
      terrainPane.style.mixBlendMode = 'overlay';

      const terrainUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}';
      const terrain = L.tileLayer(terrainUrl, {
        opacity: darkMode ? 0.35 : 0.35,
        maxZoom: 18,
        maxNativeZoom: 10,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        pane: 'terrainPane',
        className: darkMode ? 'terrain-tile-dark' : 'terrain-tile'
      }).addTo(map);
      terrainLayerRef.current = terrain;
      if (worldGeoJsonData) {
        const activeScenarioId = (scenario as ScenarioYear) || '2026';
        const activeCountries = getPlayableCountriesForScenario(activeScenarioId);
        let featuresToRender = [...(worldGeoJsonData.features || [])];

        // If DDR is active in scenario (e.g. 1950), split German states into DDR vs West Germany (DE)
        if (activeCountries.some(c => c.id === 'DDR') && germanStatesData?.features) {
          const isEastGermanState = (stId: string, stName: string): boolean => {
            const normId = stId.toUpperCase();
            const normName = stName.toLowerCase().trim();
            if (['DE-BB', 'DE-MV', 'DE-SN', 'DE-ST', 'DE-TH'].includes(normId)) return true;
            if (
              normName.includes('brandenburg') ||
              normName.includes('mecklenburg') ||
              normName.includes('vorpommern') ||
              normName.includes('sachsen-anhalt') ||
              normName.includes('saxony-anhalt') ||
              (normName.includes('sachsen') && !normName.includes('nieder')) ||
              (normName.includes('saxony') && !normName.includes('lower')) ||
              normName.includes('thüringen') ||
              normName.includes('thueringen') ||
              normName.includes('thuringia')
            ) return true;
            return false;
          };

          const formattedFeatures: any[] = [];
          germanStatesData.features.forEach((st: any) => {
            const stId = String(st.properties?.id || st.id || '').toUpperCase();
            const stName = String(st.properties?.name || '').toLowerCase();
            if (stId === 'DE-BE' || stName === 'berlin') {
              formattedFeatures.push({
                type: 'Feature',
                id: 'DE_WEST',
                properties: { ISO_A3: 'DE_WEST', name: 'West Berlin (FRG)' },
                geometry: st.geometry
              });
              formattedFeatures.push({
                type: 'Feature',
                id: 'DDR',
                properties: { ISO_A3: 'DDR', name: 'East Berlin (GDR)' },
                geometry: st.geometry
              });
            } else if (isEastGermanState(stId, stName)) {
              formattedFeatures.push({
                type: 'Feature',
                id: 'DDR',
                properties: { ISO_A3: 'DDR', name: 'German Democratic Republic (DDR)' },
                geometry: st.geometry
              });
            } else {
              formattedFeatures.push({
                type: 'Feature',
                id: 'DE_WEST',
                properties: { ISO_A3: 'DE_WEST', name: 'Federal Republic of Germany (FRG)' },
                geometry: st.geometry
              });
            }
          });

          featuresToRender = featuresToRender
            .filter((f: any) => {
              const code = String(f.id || f.properties?.ISO_A3 || f.properties?.adm0_a3 || '').toUpperCase();
              return code !== 'DEU' && code !== 'DE';
            })
            .concat(formattedFeatures);
        }

        const geoJsonToUse = {
          type: 'FeatureCollection',
          features: featuresToRender
        };

        worldBgLayerRef.current = L.geoJSON(geoJsonToUse as any, {
          style: (feature) => {
            const cid = getPlayableCountryIdFromFeature(feature);
            const id3 = String(feature?.id || feature?.properties?.ISO_A3 || feature?.properties?.iso_a3 || '').toUpperCase();
            const name = String(feature?.properties?.name || feature?.properties?.NAME || '').toUpperCase();
            const isAtWar = getIsAtWar(id3, cid, name);

            if (cid) {
              const isSelected = selectedMapCountryId === cid;
              const fillColor = getMapColor(cid);
              return {
                fillColor: fillColor,
                color: isSelected ? "#ffffff" : "#ffffff",
                weight: isSelected ? 2.5 : 1.2,
                opacity: 1.0,
                fillOpacity: isSelected ? 0.92 : 0.72,
                interactive: true
              };
            }
            
            const baseFill = (mapMode === 'WARS' && isAtWar) ? '#ef4444' : (darkMode ? "#1e293b" : "#e2e8f0");
            const borderColor = (mapMode === 'WARS' && isAtWar) ? (darkMode ? '#7f1d1d' : '#f87171') : (darkMode ? "#0f172a" : "#cbd5e1");
            return { fillColor: baseFill, color: borderColor, weight: (mapMode === 'WARS' && isAtWar) ? 1.5 : 0.8, opacity: 1.0, fillOpacity: (mapMode === 'WARS' && isAtWar) ? 0.6 : 0.5, interactive: false };
          },
          onEachFeature: (feature, layer) => {
            const cid = getPlayableCountryIdFromFeature(feature);
            if (cid) {
              const cName = getCountryName(cid);
              layer.bindTooltip(`
                <div style="font-family: sans-serif; font-weight: bold; font-size: 11px; padding: 2px 4px;">
                  <b>${cName}</b> (${cid})
                  <br/><span style="font-size: 9px; color: #94a3b8;">Click to open diplomatic actions</span>
                </div>
              `, { direction: 'top', opacity: 0.95 });

              layer.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                playSound('click');
                const targetId = isCountryActive(cid, scenario) ? cid : getSuccessorCountryId(cid, scenario);
                if (isCountryActive(targetId, scenario)) {
                  setSelectedMapCountryId(targetId);
                }
              });
            }
          }
        }).addTo(map);
      }

      // Clicking empty ocean/background closes the info card
      map.on('click', () => {
        setSelectedMapCountryId(null);
      });

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current && mapInstanceRef.current) {
      tileLayerRef.current.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}');
      
      if (terrainLayerRef.current) {
        terrainLayerRef.current.setOpacity(darkMode ? 0.28 : 0.35);
        const pane = mapInstanceRef.current.getPane('terrainPane');
        if (pane) pane.style.mixBlendMode = 'overlay';
        
        const terrainImg = terrainLayerRef.current.getContainer();
        if (terrainImg) {
          if (darkMode) {
            terrainImg.classList.remove('terrain-tile');
            terrainImg.classList.add('terrain-tile-dark');
          } else {
            terrainImg.classList.remove('terrain-tile-dark');
            terrainImg.classList.add('terrain-tile');
          }
        }
      }
    }

    return () => cleanupMap();
  }, [darkMode, worldGeoJsonData, germanStatesData, scenario]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw connections from our HQ (player country) to all other countries
    const playerCoords = countryCoords[country.id] || [38.963, 35.243];
    
    Object.entries(countryCoords).forEach(([id, coords]) => {
      if (id === country.id || !isCountryActive(id, scenario)) return;
      
      const rel = diplomaticRelations[id];
      if (!rel) return;

      const strokeColor = rel.status === 'At War' ? '#ef4444' : 
                          rel.status === 'Alliance' ? '#10b981' : 
                          rel.status === 'Defensive Pact' ? '#06b6d4' :
                          'rgba(99, 102, 241, 0.2)';
      const isDashed = rel.status !== 'Alliance' && rel.status !== 'At War';

      const polyline = L.polyline([playerCoords, coords], {
        color: strokeColor,
        weight: rel.status === 'At War' || rel.status === 'Alliance' ? 2 : 1,
        dashArray: isDashed ? '4, 4' : undefined,
        opacity: 0.65
      });
      polyline.addTo(markersGroup);
    });

    // 2. Add marker nodes for each playable country
    Object.entries(countryCoords).forEach(([id, coords]) => {
      if (!isCountryActive(id, scenario)) return;
      const isSelf = id === country.id;
      const rel = diplomaticRelations[id];
      const isSelected = selectedMapCountryId === id;

      let color = '#64748b'; // Neutral
      if (isSelf) {
        color = '#3b82f6'; // Bright Blue HQ
      } else if (rel) {
        if (rel.status === 'At War') color = '#ef4444';
        else if (rel.status === 'Alliance') color = '#10b981';
        else if (rel.status === 'Defensive Pact') color = '#06b6d4';
        else if (rel.status === 'Sanctioned') color = '#f59e0b';
        else if (rel.status === 'Non-Aggression') color = '#eab308';
      }

      const name = getCountryName(id);

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          ${isSelected ? `
            <div style="position: absolute; width: 38px; height: 38px; border: 2px dashed ${color}; border-radius: 50%; animation: spin 8s linear infinite;"></div>
          ` : ''}
          <div style="
            position: absolute; 
            width: 28px; 
            height: 28px; 
            background: ${darkMode ? '#0f172a' : '#ffffff'}; 
            border: 2.5px solid ${color}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 10px ${color}a0;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="font-size: 11px; font-weight: 900; font-family: monospace; color: ${color};">${id}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-diplomacy-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(coords, { icon: customIcon });

      marker.bindTooltip(`
        <div style="font-family: sans-serif; padding: 2px 4px;">
          <b style="font-size: 11px;"><span style="color: ${color}">[${id}]</span> ${name}</b>
          ${isSelf ? '<br/><i style="font-size: 9px; color: #3b82f6;">Your Sovereign HQ</i>' : `
            <br/><span style="font-size: 9px; color: #64748b;">Opinion: <b>${rel?.opinion || 50}/100</b></span>
            <br/><span style="font-size: 9px; color: #64748b;">Status: <b>${rel?.status || 'Neutral'}</b></span>
          `}
        </div>
      `, {
        direction: 'top',
        opacity: 0.95
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        playSound('click');
        if (isCountryActive(id, scenario)) {
          setSelectedMapCountryId(id);
        }
      });

      marker.addTo(markersGroup);
    });
  }, [diplomaticRelations, selectedMapCountryId, country.id, darkMode, scenario]);

  // Current active global conflicts
  const [globalConflicts, setGlobalConflicts] = useState<Array<{
    id: string;
    countryA: string;
    countryB: string;
    description: string;
    resolved: boolean;
    stance?: 'Neutral' | 'Diplomatic' | 'Military';
  }>>(() => {
    return [
      {
        id: 'RU_UA',
        countryA: 'RU',
        countryB: 'UA',
        description: 'Territorial invasion and sovereignty defense in Eastern Europe.',
        resolved: false
      },
      {
        id: 'IL_PS',
        countryA: 'IL',
        countryB: 'PS',
        description: 'Intense regional conflict over territorial sovereignty and security.',
        resolved: false
      },
      {
        id: 'CN_TW',
        countryA: 'CN',
        countryB: 'TW',
        description: 'Cross-strait tensions regarding political status and international recognition.',
        resolved: false
      }
    ].filter(c => c.countryA !== country.id && c.countryB !== country.id);
  });

  const getCountryName = (id: string) => {
    const list: Record<string, string> = {
      US: 'United States',
      BR: 'Brazil',
      GB: 'United Kingdom',
      DE: 'Germany',
      TR: 'Turkey',
      EG: 'Egypt',
      JP: 'Japan',
      CA: 'Canada',
      AR: 'Argentina',
      ZA: 'South Africa',
      IN: 'India',
      IT: 'Italy',
      ID: 'Indonesia',
      MX: 'Mexico',
      ES: 'Spain',
      KR: 'South Korea',
      AU: 'Australia',
      RU: 'Russia',
      UA: 'Ukraine',
      IL: 'Israel',
      PS: 'Palestine',
      CN: 'China',
      TW: 'Taiwan',
      FR: 'France',
      RO: 'Romania',
      HU: 'Hungary',
      SA: 'Saudi Arabia',
      IR: 'Iran',
      PL: 'Poland',
      GR: 'Greece',
      SE: 'Sweden',
      NO: 'Norway',
      FI: 'Finland',
      NL: 'Netherlands',
      BE: 'Belgium',
      CH: 'Switzerland',
      AT: 'Austria',
      PT: 'Portugal',
      IE: 'Ireland',
      DK: 'Denmark',
      CZ: 'Czechia',
      SK: 'Slovakia',
      BG: 'Bulgaria',
      HR: 'Croatia',
      RS: 'Serbia',
      AZ: 'Azerbaijan',
      PK: 'Pakistan',
      SY: 'Syria',
      IQ: 'Iraq',
      QA: 'Qatar',
      AE: 'United Arab Emirates',
      NZ: 'New Zealand',
      CL: 'Chile',
      IS: 'Iceland',
      CD: 'Democratic Republic of the Congo',
      COD: 'Democratic Republic of the Congo',
      CG: 'Republic of the Congo',
      COG: 'Republic of the Congo',
      KP: 'North Korea',
      SU: 'Soviet Union',
      DDR: 'East Germany',
      CS: 'Czechoslovakia',
      YU: 'Yugoslavia'
    };
    if (scenario === '2026' && id === 'RU') return 'Russian Federation';
    if (scenario === '2026' && id === 'DE') return 'Germany';
    return list[id] || id;
  };

  const getCountryFlag = (id: string) => {
    const list: Record<string, string> = {
      US: '🇺🇸', BR: '🇧🇷', GB: '🇬🇧', DE: '🇩🇪', TR: '🇹🇷', EG: '🇪🇬', JP: '🇯🇵',
      CA: '🇨🇦', AR: '🇦🇷', ZA: '🇿🇦', IN: '🇮🇳', IT: '🇮🇹', ID: '🇮🇩', MX: '🇲🇽',
      ES: '🇪🇸', KR: '🇰🇷', KP: '🇰🇵', AU: '🇦🇺', RU: '🇷🇺', UA: '🇺🇦', IL: '🇮🇱', PS: '🇵🇸',
      CN: '🇨🇳', TW: '🇹🇼', FR: '🇫🇷', RO: '🇷🇴', HU: '🇭🇺', SA: '🇸🇦', IR: '🇮🇷',
      PL: '🇵🇱', GR: '🇬🇷', SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', NL: '🇳🇱', BE: '🇧🇪',
      CH: '🇨🇭', AT: '🇦🇹', PT: '🇵🇹', IE: '🇮🇪', DK: '🇩🇰', CZ: '🇨🇿', SK: '🇸🇰',
      BG: '🇧🇬', HR: '🇭🇷', RS: '🇷🇸', AZ: '🇦🇿', PK: '🇵🇰', SY: '🇸🇾', IQ: '🇮🇶',
      QA: '🇶🇦', AE: '🇦🇪', NZ: '🇳🇿', CL: '🇨🇱', IS: '🇮🇸',
      CD: '🇨🇩', COD: '🇨🇩', CG: '🇨🇬', COG: '🇨🇬', SU: '🚩', DDR: '🇩🇩', CS: '🇨🇿', YU: '🇷🇸'
    };
    return list[id] || '🌐';
  };

  // Treaty signing mechanics
  const handleSignTreaty = (targetId: string, type: 'Allies' | 'Alliance' | 'Defensive Pact' | 'Non-Aggression') => {
    const currentRelation = diplomaticRelations[targetId];
    if (!currentRelation) return;

    let requiredOpinion = 40;
    let requiredInfluence = 10;
    let costTreasury = 5000;

    if (type === 'Defensive Pact') {
      requiredOpinion = 65;
      requiredInfluence = 25;
      costTreasury = 15000;
    } else if (type === 'Alliance') {
      requiredOpinion = 80;
      requiredInfluence = 40;
      costTreasury = 25000;
    } else if (type === 'Allies') {
      requiredOpinion = 85;
      requiredInfluence = 50;
      costTreasury = 35000;
    }

    if (currentRelation.opinion < requiredOpinion) {
      playSound('error');
      setErrorMessage(`Failed to sign treaty with ${getCountryName(targetId)}! They require at least ${requiredOpinion} bilateral opinion of your country (Current: ${currentRelation.opinion}).`);
      setSuccessMessage(null);
      return;
    }

    if (influence < requiredInfluence) {
      playSound('error');
      setErrorMessage(`Insufficient Political Influence! Signing this treaty requires ${requiredInfluence} Influence points.`);
      setSuccessMessage(null);
      return;
    }

    if (treasury < costTreasury) {
      playSound('error');
      setErrorMessage(`Insufficient National Budget! Signing this treaty requires paying diplomatic protocol fees of ₺/$/€ ${costTreasury.toLocaleString()}.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateInfluence(influence - requiredInfluence);
    onUpdateTreasury(treasury - costTreasury);
    onUpdateReputation(Math.min(100, internationalReputation + (type === 'Allies' ? 15 : type === 'Alliance' ? 10 : 5)));

    // Boost domestic approval slightly for strong leadership abroad
    publicApprovalImpact(type === 'Allies' ? 6 : type === 'Alliance' ? 4 : 2);

    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: type, opinion: Math.min(100, currentRelation.opinion + 15) }
    };
    onUpdateRelations(updated);

    // Allies and Alliance automatically provide per-turn recurring support!
    if ((type === 'Allies' || type === 'Alliance') && onUpdateForeignAid) {
      const aidAmt = type === 'Allies' ? 45000 : 30000;
      onUpdateForeignAid((prev: any) => ({
        ...prev,
        [targetId]: {
          id: targetId,
          countryName: getCountryName(targetId),
          status: 'ACCEPTED' as const,
          type: 'funds' as const,
          amountPerTurn: aidAmt,
          description: `Allied military & financial support from ${getCountryName(targetId)}`
        }
      }));
    }

    playSound('success');
    setSuccessMessage(`Bilateral treaty successfully signed! ${getCountryName(targetId)} is now in a state of ${type} with your government.`);
    setErrorMessage(null);
  };

  // Break Alliance / Dissolve Treaty
  const handleBreakAlliance = (targetId: string) => {
    const currentRelation = diplomaticRelations[targetId];
    if (!currentRelation) return;

    const updated = {
      ...diplomaticRelations,
      [targetId]: {
        ...currentRelation,
        status: 'Neutral' as const,
        opinion: Math.max(10, currentRelation.opinion - 35)
      }
    };
    onUpdateRelations(updated);

    if (onUpdateForeignAid) {
      onUpdateForeignAid((prev: any) => {
        const copy = { ...prev };
        delete copy[targetId];
        return copy;
      });
    }

    playSound('error');
    setSuccessMessage(`Alliance with ${getCountryName(targetId)} has been dissolved. Diplomatic ties severed to Neutral.`);
    setErrorMessage(null);
  };

  // English "Request Support" action with specialized support types
  const handleRequestSupport = (targetId: string, supportType: 'funds' | 'equipment' | 'humanitarian' | 'intel' = 'funds') => {
    const rel = diplomaticRelations[targetId] || { status: 'Neutral', opinion: 50 };
    const targetDetails = getCountryDetails(targetId);

    if (foreignAidPackages && foreignAidPackages[targetId]?.status === 'ACCEPTED') {
      playSound('click');
      setSuccessMessage(`${targetDetails.name} is already providing active recurring support (${foreignAidPackages[targetId].description}).`);
      return;
    }

    // Roll acceptance based on relations, ideology alignment, and existing alliances
    let rollChance = Math.round(rel.opinion * 0.6); // 50 op -> 30%, 80 op -> 48%
    if (rel.status === 'Allies') {
      rollChance += 45; // 90%+ chance
    } else if (rel.status === 'Alliance') {
      rollChance += 35;
    } else if (rel.status === 'Defensive Pact') {
      rollChance += 20;
    } else if (rel.status === 'Sanctioned') {
      rollChance -= 40;
    } else if (rel.status === 'At War') {
      rollChance -= 100;
    }

    // Type specific modifiers
    if (supportType === 'humanitarian') {
      // Humanitarian aid is widely supported internationally even from non-allies
      rollChance += 25;
    } else if (supportType === 'equipment') {
      // Heavy military hardware requires closer ties
      if (rel.status !== 'Allies' && rel.status !== 'Alliance') {
        rollChance -= 15;
      }
    }

    // Ideology alignment bonus
    const playerIdeology = (party.ideology || '').toLowerCase();
    const targetIdeology = (targetDetails.ideology || '').toLowerCase();
    const isAligned =
      (playerIdeology.includes('conservative') && targetIdeology.includes('conservative')) ||
      (playerIdeology.includes('socialist') && targetIdeology.includes('socialist')) ||
      (playerIdeology.includes('social democrat') && targetIdeology.includes('social democrat')) ||
      (playerIdeology.includes('liberal') && targetIdeology.includes('liberal')) ||
      (playerIdeology.includes('nationalist') && targetIdeology.includes('nationalist'));

    if (isAligned) {
      rollChance += 20;
    }

    rollChance = Math.max(5, Math.min(95, rollChance));
    const dice = Math.floor(Math.random() * 100) + 1;
    const accepted = dice <= rollChance;

    if (accepted) {
      let aidAmount = 0;
      let description = '';

      if (supportType === 'funds') {
        aidAmount = rel.status === 'Allies' ? 45000 : (targetDetails.gdp.includes('Trillion') ? 35000 : 25000);
        description = `+$${aidAmount.toLocaleString()}/turn in budgetary foreign aid from ${targetDetails.name}`;
      } else if (supportType === 'equipment') {
        aidAmount = 15000;
        description = `Strategic munitions & military supply shipments from ${targetDetails.name}`;
      } else if (supportType === 'humanitarian') {
        aidAmount = 20000;
        description = `UN & multilateral humanitarian relief convoys from ${targetDetails.name}`;
        if (publicApprovalImpact) publicApprovalImpact(6);
      } else if (supportType === 'intel') {
        aidAmount = 10000;
        description = `Strategic intelligence sharing & diplomatic endorsement from ${targetDetails.name}`;
        if (onUpdateInfluence) onUpdateInfluence(party.influence + 15);
        if (onUpdateReputation) onUpdateReputation(prev => Math.min(100, prev + 12));
      }

      const newPackage = {
        id: targetId,
        countryName: targetDetails.name,
        status: 'ACCEPTED' as const,
        type: supportType,
        amountPerTurn: aidAmount,
        description
      };

      if (onUpdateForeignAid) {
        onUpdateForeignAid((prev: any) => ({
          ...prev,
          [targetId]: newPackage
        }));
      }

      playSound('success');
      setSuccessMessage(`DIPLOMATIC SUCCESS! ${targetDetails.name} approved our Request for ${supportType.toUpperCase()} support: ${description}`);
      setErrorMessage(null);
    } else {
      playSound('error');
      setErrorMessage(`Request for ${supportType} support was declined by ${targetDetails.name} (Acceptance chance was ${rollChance}%). Strengthen bilateral relations or sign a treaty.`);
      setSuccessMessage(null);

      if (onUpdateForeignAid) {
        onUpdateForeignAid((prev: any) => ({
          ...prev,
          [targetId]: {
            id: targetId,
            countryName: targetDetails.name,
            status: 'REJECTED' as const,
            type: supportType,
            amountPerTurn: 0,
            description: `Declined by ${targetDetails.name}`
          }
        }));
      }
    }
  };

  const handleSendGift = (targetId: string) => {
    const giftCost = 20000;
    if (treasury < giftCost) {
      playSound('error');
      setErrorMessage(`Insufficient Treasury! Sending a diplomatic aid gift requires ₺/$/€ ${giftCost.toLocaleString()}.`);
      return;
    }
    const rel = diplomaticRelations[targetId] || { status: 'Neutral', opinion: 50 };

    onUpdateTreasury(treasury - giftCost);
    const updatedOpinion = Math.min(100, rel.opinion + 18);
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, opinion: updatedOpinion }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Diplomatic aid package delivered to ${getCountryName(targetId)}! Bilateral opinion increased by +18.`);
    setErrorMessage(null);
  };

  const handleTradeDeal = (targetId: string) => {
    if (!isRuling) {
      playSound('error');
      setErrorMessage('Diplomatic trade accords are unlocked after you win the election and form the government.');
      return;
    }
    const cost = 10000;
    const infCost = 5;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient National Treasury! Establishing a Trade Deal requires paying ₺/$/€ ${cost.toLocaleString()} commercial accord processing.`);
      return;
    }
    if (influence < infCost) {
      playSound('error');
      setErrorMessage(`Insufficient Influence! Establishing a Trade Deal requires ${infCost} Political Influence.`);
      return;
    }
    const rel = diplomaticRelations[targetId] || { status: 'Neutral', opinion: 50 };
    onUpdateTreasury(treasury - cost);
    onUpdateInfluence(influence - infCost);
    onUpdateReputation(Math.min(100, internationalReputation + 6));
    publicApprovalImpact(2);

    const updatedOpinion = Math.min(100, rel.opinion + 10);
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, opinion: updatedOpinion }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Bilateral Trade Deal signed with ${getCountryName(targetId)}! Commercial channels established, opinion increased by +10.`);
    setErrorMessage(null);
  };

  const handleNormalizeRelations = (targetId: string) => {
    const cost = 10000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Normalizing relations and lifting embargoes requires ₺/$/€ ${cost.toLocaleString()} in diplomatic processing.`);
      return;
    }
    const rel = diplomaticRelations[targetId] || { status: 'Neutral', opinion: 30 };
    onUpdateTreasury(treasury - cost);
    onUpdateReputation(Math.min(100, internationalReputation + 6));
    publicApprovalImpact(2);

    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, status: 'Neutral' as const, opinion: Math.max(45, rel.opinion + 20) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Relations normalized with ${getCountryName(targetId)}! Sanctions lifted and diplomatic channels reopened.`);
    setErrorMessage(null);
  };

  const handleCeasefire = (targetId: string) => {
    const rel = diplomaticRelations[targetId];
    if (!rel || rel.status !== 'At War') return;
    const cost = 30000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Ceasefire Protocol rejected! Paying war reparations & peace negotiations requires ₺/$/€ ${cost.toLocaleString()}.`);
      return;
    }

    onUpdateTreasury(treasury - cost);
    onUpdateReputation(Math.min(100, internationalReputation + 15));
    publicApprovalImpact(5);
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, status: 'Neutral' as const, opinion: 35 }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`PEACE TREATY SIGNED! Hostilities with ${getCountryName(targetId)} have officially ended. Relations restored to Neutral.`);
    setErrorMessage(null);
  };

  const handleFabricateCB = (targetId: string) => {
    const cost = 15000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Fabricating border justification requires ₺/$/€ ${cost.toLocaleString()} intelligence operations.`);
      return;
    }
    onUpdateTreasury(treasury - cost);
    setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    playSound('success');
    setSuccessMessage(`Casus Belli fabricated against ${getCountryName(targetId)}! Justification for military action is now secured.`);
    setErrorMessage(null);
  };

  // Hostile action handlers
  const handleHostileAction = (targetId: string, action: 'Sanction' | 'Embargo' | 'Sever Relations' | 'Declare War') => {
    const currentRelation = diplomaticRelations[targetId] || { status: 'Neutral', opinion: 50 };

    if (action === 'Declare War') {
      const vassal = getVassalStateById(targetId);
      if (vassal && vassal.suzerainId === country.id) {
        playSound('error');
        setErrorMessage(`CANNOT ATTACK A VASSAL STATE! ${vassal.name} is a designated Vassal of ${country.name} and cannot be attacked.`);
        return;
      }

      if (currentRelation.status === 'Allies' || currentRelation.status === 'Alliance') {
        playSound('error');
        setErrorMessage(`CANNOT ATTACK AN ALLY! You must break the Alliance with ${getCountryName(targetId)} before declaring war.`);
        return;
      }

      const hasCB = casusBelli[targetId];
      if (!hasCB) {
        // Allow declare war but with severe penalty
        onUpdateReputation(Math.max(5, internationalReputation - 35));
        publicApprovalImpact(-12);
      } else {
        onUpdateReputation(Math.max(5, internationalReputation - 20));
        publicApprovalImpact(-6);
      }

      const updated = {
        ...diplomaticRelations,
        [targetId]: { ...currentRelation, status: 'At War' as const, opinion: 0 }
      };
      onUpdateRelations(updated);
      playSound('error');
      setSuccessMessage(`WAR DECLARED! Mobilization orders dispatched against ${getCountryName(targetId)}. Frontlines are active.`);
      setErrorMessage(null);
      return;
    }

    // Sanction/Embargo/Sever
    let opDrop = 25;
    let repChange = -5;
    let updatedStatus: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned' = 'Neutral';

    if (action === 'Sanction') {
      opDrop = 30;
      repChange = -6;
      updatedStatus = 'Sanctioned';
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Embargo') {
      opDrop = 45;
      repChange = -12;
      updatedStatus = 'Sanctioned';
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Sever Relations') {
      opDrop = 60;
      repChange = -8;
      updatedStatus = 'Neutral';
    }

    onUpdateReputation(Math.max(10, internationalReputation + repChange));
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: updatedStatus, opinion: Math.max(0, currentRelation.opinion - opDrop) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Hostile Action [${action}] executed against ${getCountryName(targetId)}. Bilateral ties restricted.`);
    setErrorMessage(null);
  };

  // Coalition blocs creation
  const handleJoinBloc = (type: 'economic' | 'military' | 'diplomatic') => {
    let cost = 30;
    if (type === 'military') cost = 40;
    if (type === 'diplomatic') cost = 25;

    if (influence < cost) {
      playSound('error');
      setErrorMessage(`Insufficient Political Influence! Forming a coalition Bloc requires ${cost} Influence.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateInfluence(influence - cost);
    setActiveBlocs(prev => ({ ...prev, [type]: true }));

    if (type === 'economic') {
      onUpdateTreasury(treasury + 50000); // sign on cash
    } else if (type === 'diplomatic') {
      onUpdateReputation(Math.min(100, internationalReputation + 15));
    }

    playSound('success');
    setSuccessMessage(`Successfully established the multinational ${type.toUpperCase()} BLOC! You have solidified your global leadership.`);
    setErrorMessage(null);
  };

  // Stance in third-party wars
  const handleStance = (conflictId: string, stance: 'Neutral' | 'Diplomatic' | 'Military') => {
    const conflictIndex = globalConflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex === -1 || globalConflicts[conflictIndex].resolved) return;
    const conflict = globalConflicts[conflictIndex];

    if (stance === 'Military') {
      const mobilizeCost = 50000;
      if (treasury < mobilizeCost) {
        playSound('error');
        setErrorMessage(`Insufficient National Budget treasury to intervene militarily! MOBILIZATION requires paying ${mobilizeCost.toLocaleString()} immediate expeditionary deployment costs.`);
        return;
      }
      onUpdateTreasury(treasury - mobilizeCost);
      onUpdateReputation(Math.min(100, internationalReputation + 12));
      publicApprovalImpact(-3); // moderate intervention resistance
    }

    setGlobalConflicts(prev => {
      const next = [...prev];
      next[conflictIndex] = { ...next[conflictIndex], stance, resolved: true };
      return next;
    });
    playSound('success');
    setSuccessMessage(`Stance locked! Your strategic stance of [${stance} Support] in the ${getCountryName(conflict.countryA)} vs. ${getCountryName(conflict.countryB)} dispute has been broadcasted globally.`);
  };

  const handleMediatePeace = (conflictId: string) => {
    const conflictIndex = globalConflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex === -1 || globalConflicts[conflictIndex].resolved) return;
    const conflict = globalConflicts[conflictIndex];

    const medCost = 25000;
    if (treasury < medCost) {
      playSound('error');
      setErrorMessage(`Hosting an International Peace Summit requires ₺/$/€ ${medCost.toLocaleString()} in diplomatic budget.`);
      return;
    }

    onUpdateTreasury(treasury - medCost);
    onUpdateReputation(Math.min(100, internationalReputation + 20));
    publicApprovalImpact(5);

    setGlobalConflicts(prev => {
      const next = [...prev];
      next[conflictIndex] = { ...next[conflictIndex], stance: 'Mediated Peace Accord' as any, resolved: true };
      return next;
    });
    playSound('success');
    setSuccessMessage(`HISTORIC PEACE SUMMIT BROKERED! Your diplomats mediated an immediate ceasefire between ${getCountryName(conflict.countryA)} and ${getCountryName(conflict.countryB)}.`);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Diplomacy Header */}
      <div 
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
          darkMode ? 'border-slate-850 shadow-xl' : 'border-slate-200 shadow-sm'
        }`}
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(135deg, rgba(15, 23, 42, 0.50), rgba(2, 6, 23, 0.50)), url(${getScenarioBg(scenario)})`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.50), rgba(248, 250, 252, 0.50)), url(${getScenarioBg(scenario)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase">MINISTRY OF FOREIGN AFFAIRS</span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">International Diplomacy & Blocs</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign treaties, form global alliances, join supranational military/economic blocs, or mobilize defenses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-400">REPUTATION</span>
            <span className="text-xl font-black text-indigo-400">{internationalReputation}/100</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-400">INFLUENCE</span>
            <span className="text-xl font-black text-cyan-400">{influence} PTS</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        
        {/* Playable Countries Diplomacy Panel (Left) */}
        <div className="flex flex-col gap-5">
          {/* Schematic Tactical World Map */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400 animate-pulse" />
                TACTICAL OPERATIONS MAP
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => { playSound('click'); setMapMode('RELATIONS'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'RELATIONS' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Globe className="w-3 h-3" /> RELATIONS
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('IDEOLOGY'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'IDEOLOGY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Shield className="w-3 h-3" /> IDEOLOGY
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('FREEDOM'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'FREEDOM' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Scale className="w-3 h-3" /> FREEDOM
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('INFLUENCE'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'INFLUENCE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Zap className="w-3 h-3" /> INFLUENCE
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('WARS'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'WARS' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Swords className="w-3 h-3" /> WARS
                </button>
              </div>
            </div>

            {/* Interactive Leaflet World Map */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg min-h-[460px] h-[520px] md:h-[560px] z-10 bg-slate-950">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
              
              {/* Active Conflicts Legend */}
              {mapMode === 'WARS' && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <div className="px-3 py-2 rounded-xl border flex flex-col gap-1.5 shadow-lg backdrop-blur-md bg-slate-900/80 border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Global Conflicts
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <div className="text-[9px] font-bold text-red-500">RU ⚔️ UA</div>
                      <div className="text-[9px] font-bold text-red-500">IL ⚔️ PS</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom-Left Map Legend */}
              <div className="absolute bottom-3 left-3 z-20 pointer-events-auto max-w-[250px]">
                <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/70 p-2.5 rounded-xl shadow-2xl flex flex-col gap-1.5 text-white">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-1">
                    <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-indigo-400" /> MAP LEGEND
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{mapMode}</span>
                  </div>

                  {mapMode === 'RELATIONS' && (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 border border-emerald-300/40" />
                        <span className="text-slate-200 truncate">HQ / Alliance</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0 border border-cyan-300/40" />
                        <span className="text-slate-200 truncate">Defense Pact</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 border border-amber-200/40" />
                        <span className="text-slate-200 truncate">Non-Aggression</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 border border-rose-300/40" />
                        <span className="text-slate-200 truncate">At War</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0 border border-amber-300/40" />
                        <span className="text-slate-200 truncate">Sanctioned</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0 border border-slate-300/40" />
                        <span className="text-slate-200 truncate">Neutral</span>
                      </div>
                    </div>
                  )}

                  {mapMode === 'IDEOLOGY' && (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-slate-200">Left / Socialist</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-900 shrink-0" />
                        <span className="text-slate-200">Right / Conservative</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-slate-200">Liberal / Centrist</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-200">Green / Ecology</span>
                      </div>
                    </div>
                  )}

                  {mapMode === 'FREEDOM' && (
                    <div className="grid grid-cols-1 gap-1 text-[9px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-200">High Freedom (&gt;80)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-slate-200">Moderate Freedom (50-80)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="text-slate-200">Low Freedom (&lt;50)</span>
                      </div>
                    </div>
                  )}

                  {mapMode === 'WARS' && (
                    <div className="grid grid-cols-1 gap-1 text-[9px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        <span className="text-slate-200">Active Conflict Zone</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0" />
                        <span className="text-slate-200">Peaceful / Non-Belligerent</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-1 border-t border-slate-800 text-[8.5px] text-slate-400 italic">
                    Click any nation on the map to open country intelligence.
                  </div>
                </div>
              </div>

              {/* Floating Country Info Panel */}
              {selectedMapCountryId && isCountryActive(selectedMapCountryId, scenario) && (() => {
                const details = getCountryDetails(selectedMapCountryId);
                const isSelf = selectedMapCountryId === country.id;
                const rel = diplomaticRelations[selectedMapCountryId] || { status: 'Neutral', opinion: 50 };

                return (
                  <div 
                    className={`absolute top-3 right-3 z-30 w-[calc(100%-24px)] max-w-[360px] max-h-[calc(100%-24px)] overflow-y-auto rounded-2xl p-4 border shadow-2xl backdrop-blur-xl flex flex-col gap-3.5 transition-all duration-200 animate-fade-in ${
                      darkMode 
                        ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-black/80' 
                        : 'bg-white/95 border-slate-300 text-slate-900 shadow-slate-900/30'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header with Flag, Name, Close Button */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-500/15 pb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-3xl shrink-0 filter drop-shadow">{details.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-black text-sm tracking-tight leading-tight truncate">
                              {details.name}
                            </h4>
                            {details.isVassal ? (
                              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                                🛡️ Vassal of {details.vassalOf || country.name}
                              </span>
                            ) : (
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                                rel.status === 'At War' ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse' :
                                rel.status === 'Alliance' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                rel.status === 'Defensive Pact' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                                rel.status === 'Sanctioned' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                                rel.status === 'Non-Aggression' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
                                'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                              }`}>
                                {rel.status === 'At War' ? 'At War' : 
                                 rel.status === 'Alliance' ? 'Alliance' :
                                 rel.status === 'Defensive Pact' ? 'Defense Pact' :
                                 rel.status === 'Sanctioned' ? 'Sanctioned' :
                                 rel.status === 'Non-Aggression' ? 'Non-Aggression' : 'Neutral'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Code: <strong className="text-slate-300">{details.id}</strong> {isSelf && '• (Your Country)'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('click');
                          setSelectedMapCountryId(null);
                        }}
                        title="Close (Esc)"
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Core Country Statistics */}
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">GOVERNMENT</span>
                        <span className="font-bold text-slate-200 truncate mt-0.5" title={details.governmentType}>
                          {details.governmentType}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">RULING PARTY</span>
                        <span className="font-bold text-slate-200 truncate mt-0.5" title={details.rulingParty}>
                          {details.rulingParty}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">IDEOLOGY</span>
                        <span className="font-bold text-indigo-300 truncate mt-0.5" title={details.ideology}>
                          {details.ideology}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">LEADER</span>
                        <span className="font-bold text-slate-200 truncate mt-0.5" title={details.leader}>
                          {details.leader}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">POPULATION</span>
                        <span className="font-bold text-slate-200 font-mono mt-0.5">{details.population}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">GDP (ECONOMY)</span>
                        <span className="font-bold text-emerald-400 font-mono mt-0.5">{details.gdp}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">MILITARY</span>
                        <span className="font-bold text-slate-200 truncate mt-0.5" title={details.militaryStrength}>
                          {details.militaryStrength}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">STABILITY</span>
                        <span className={`font-bold font-mono mt-0.5 ${
                          details.stability >= 75 ? 'text-emerald-400' : details.stability >= 45 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {details.stability}% ({details.stabilityLabel})
                        </span>
                      </div>
                    </div>

                    {/* Relation to Player (-100..+100) */}
                    <div className="p-2.5 rounded-xl bg-black/25 border border-slate-500/10 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-bold uppercase">RELATION TO PLAYER</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${
                          details.relationScore > 30 ? 'bg-emerald-500/20 text-emerald-400' :
                          details.relationScore < -30 ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {details.relationScore > 0 ? `+${details.relationScore}` : details.relationScore} / 100
                        </span>
                      </div>

                      {/* Visual 2-sided relation bar */}
                      <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10" />
                        {details.relationScore >= 0 ? (
                          <div 
                            className="absolute left-1/2 top-0 bottom-0 bg-emerald-500 transition-all duration-300 rounded-r-full"
                            style={{ width: `${(details.relationScore / 100) * 50}%` }}
                          />
                        ) : (
                          <div 
                            className="absolute top-0 bottom-0 bg-rose-500 transition-all duration-300 rounded-l-full"
                            style={{ 
                              right: '50%',
                              width: `${(Math.abs(details.relationScore) / 100) * 50}%` 
                            }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-500">
                        <span>-100 (Hostile)</span>
                        <span>0 (Neutral)</span>
                        <span>+100 (Allied)</span>
                      </div>
                    </div>

                    {/* Active Wars */}
                    <div className="p-2.5 rounded-xl bg-black/20 border border-slate-500/10 flex flex-col gap-1 text-[10.5px]">
                      <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Swords className="w-3 h-3 text-rose-400" /> ACTIVE WARS
                      </span>
                      {details.activeWars.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {details.activeWars.map((war, idx) => (
                            <div key={idx} className="text-[9.5px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                              <span className="truncate">{war}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">
                          🕊️ None (Peaceful State)
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Improve Relations, Trade Deal, Alliance, Declare War */}
                    {!isSelf ? (
                      <div className="flex flex-col gap-2.5 pt-1 border-t border-slate-500/15">
                        
                        {/* 1. Request Support English Action Section */}
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                              International Support
                            </span>
                            {foreignAidPackages && foreignAidPackages[selectedMapCountryId]?.status === 'ACCEPTED' && (
                              <span className="text-[9px] font-mono font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active (+${foreignAidPackages[selectedMapCountryId].amountPerTurn.toLocaleString()}/turn)
                              </span>
                            )}
                            {foreignAidPackages && foreignAidPackages[selectedMapCountryId]?.status === 'PENDING' && (
                              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                Pending Review
                              </span>
                            )}
                            {foreignAidPackages && foreignAidPackages[selectedMapCountryId]?.status === 'REJECTED' && (
                              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                Declined
                              </span>
                            )}
                          </div>

                          {foreignAidPackages && foreignAidPackages[selectedMapCountryId]?.status === 'ACCEPTED' ? (
                            <div className="w-full py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                              <span>Active Support: {foreignAidPackages[selectedMapCountryId].type.toUpperCase()}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  id="btn-request-funds"
                                  onClick={() => handleRequestSupport(selectedMapCountryId, 'funds')}
                                  disabled={rel.status === 'At War' || rel.status === 'Sanctioned'}
                                  title="Request recurring financial grant for national budget"
                                  className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-200 border border-indigo-500/30 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span>💵 Financial Grant</span>
                                </button>
                                <button
                                  id="btn-request-arms"
                                  onClick={() => handleRequestSupport(selectedMapCountryId, 'equipment')}
                                  disabled={rel.status === 'At War' || rel.status === 'Sanctioned'}
                                  title="Request precision munitions and military hardware"
                                  className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-rose-600/20 hover:bg-rose-600/35 text-rose-200 border border-rose-500/30 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span>🛡️ Military Arms</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  id="btn-request-humanitarian"
                                  onClick={() => handleRequestSupport(selectedMapCountryId, 'humanitarian')}
                                  disabled={rel.status === 'At War'}
                                  title="Request UN and international humanitarian relief (+public approval)"
                                  className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-teal-600/20 hover:bg-teal-600/35 text-teal-200 border border-teal-500/30 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span>🕊️ UN Relief</span>
                                </button>
                                <button
                                  id="btn-request-intel"
                                  onClick={() => handleRequestSupport(selectedMapCountryId, 'intel')}
                                  disabled={rel.status === 'At War' || rel.status === 'Sanctioned'}
                                  title="Request diplomatic endorsement and intelligence sharing (+influence & reputation)"
                                  className="py-1.5 px-2 rounded-lg text-[10.5px] font-bold bg-purple-600/20 hover:bg-purple-600/35 text-purple-200 border border-purple-500/30 flex items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span>🌐 Diplomatic Intel</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Standard Bilateral Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleSendGift(selectedMapCountryId)}
                            disabled={!isRuling || rel.status === 'At War'}
                            title={!isRuling ? 'Unlocked after you win the election' : 'Improve diplomatic relations (+18 opinion, 20k ₺/$/€)'}
                            className={`py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                              !isRuling || rel.status === 'At War'
                                ? 'opacity-50 cursor-not-allowed bg-slate-800/60 text-slate-400 border-slate-700/50'
                                : 'bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border-emerald-500/30 cursor-pointer'
                            }`}
                          >
                            {!isRuling && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                            <span>Improve Relations</span>
                          </button>

                          <button
                            onClick={() => handleTradeDeal(selectedMapCountryId)}
                            disabled={!isRuling || rel.status === 'At War' || rel.status === 'Sanctioned'}
                            title={!isRuling ? 'Unlocked after you win the election' : 'Sign bilateral trade deal (+10 opinion, 10k ₺/$, 5 Inf)'}
                            className={`py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                              !isRuling || rel.status === 'At War' || rel.status === 'Sanctioned'
                                ? 'opacity-50 cursor-not-allowed bg-slate-800/60 text-slate-400 border-slate-700/50'
                                : 'bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border-indigo-500/30 cursor-pointer'
                            }`}
                          >
                            {!isRuling && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                            <span>Trade Deal</span>
                          </button>
                        </div>

                        {/* 3. Treaty / Allies / Break Alliance / Declare War Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {rel.status === 'Allies' ? (
                            <button
                              disabled
                              className="py-2 px-2.5 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1.5 transition-all border bg-emerald-500/25 text-emerald-300 border-emerald-500/50 cursor-default shadow-xs"
                            >
                              <Handshake className="w-3.5 h-3.5 text-emerald-400" />
                              <span>🤝 Permanent Allies</span>
                            </button>
                          ) : rel.status === 'Alliance' ? (
                            <button
                              onClick={() => handleSignTreaty(selectedMapCountryId, 'Allies')}
                              disabled={!isRuling || rel.opinion < 85}
                              title={rel.opinion < 85 ? 'Requires 85+ opinion to elevate to full Allies status' : 'Elevate Alliance to permanent Allies!'}
                              className={`py-2 px-2.5 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1.5 transition-all border ${
                                !isRuling || rel.opinion < 85
                                  ? 'opacity-60 cursor-not-allowed bg-slate-800/60 text-slate-400 border-slate-700/50'
                                  : 'bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 border-emerald-500/40 cursor-pointer'
                              }`}
                            >
                              <span>Elevate to Allies</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSignTreaty(selectedMapCountryId, rel.opinion >= 85 ? 'Allies' : rel.opinion >= 80 ? 'Alliance' : 'Defensive Pact')}
                              disabled={!isRuling || rel.status === 'At War'}
                              title={!isRuling ? 'Unlocked after you win the election' : 'Sign defensive pact, alliance, or full allies'}
                              className={`py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                                !isRuling || rel.status === 'At War'
                                  ? 'opacity-50 cursor-not-allowed bg-slate-800/60 text-slate-400 border-slate-700/50'
                                  : 'bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border-cyan-500/30 cursor-pointer'
                              }`}
                            >
                              {!isRuling && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                              <span>{rel.opinion >= 85 ? 'Form Allies' : rel.opinion >= 80 ? 'Form Alliance' : 'Defense Pact'}</span>
                            </button>
                          )}

                          {/* Attack Protection: Allies cannot be attacked without breaking alliance first */}
                          {rel.status === 'Allies' || rel.status === 'Alliance' ? (
                            <button
                              onClick={() => handleBreakAlliance(selectedMapCountryId)}
                              disabled={!isRuling}
                              title="Dissolve alliance treaty to permit hostile actions"
                              className="py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/40 cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Break Alliance</span>
                            </button>
                          ) : details.isVassal ? (
                            <button
                              disabled
                              title="Loyal vassal state: bound by treaty to never attack or declare war on suzerain."
                              className="py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border opacity-60 bg-amber-500/10 text-amber-300 border-amber-500/30 cursor-not-allowed"
                            >
                              <span>🛡️ Vassal (Cannot Attack)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleHostileAction(selectedMapCountryId, 'Declare War')}
                              disabled={!isRuling || rel.status === 'At War'}
                              title={!isRuling ? 'Unlocked after you win the election' : 'Declare armed conflict & mobilize frontlines'}
                              className={`py-2 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                                !isRuling || rel.status === 'At War'
                                  ? 'opacity-50 cursor-not-allowed bg-slate-800/60 text-slate-400 border-slate-700/50'
                                  : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/40 cursor-pointer'
                              }`}
                            >
                              {!isRuling && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                              <span>{rel.status === 'At War' ? 'At War' : 'Declare War'}</span>
                            </button>
                          )}
                        </div>

                        {/* Direct Deployment to War Front Map */}
                        {rel.status === 'At War' && onNavigateToWar && (
                          <button
                            onClick={() => {
                              playSound('click');
                              onNavigateToWar();
                            }}
                            className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-950/40 cursor-pointer animate-pulse"
                          >
                            <Swords className="w-4 h-4 text-rose-200" />
                            <span>⚔️ Open War Frontline Map</span>
                          </button>
                        )}

                        {!isRuling && (
                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[9.5px] text-amber-300/90 leading-tight">
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Unlocked after you win the election.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 text-center font-medium">
                        🏛️ Sovereign Headquarters: Select any foreign nation on the map to conduct bilateral state diplomacy.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Vassal States & Buffer Zones Card (Requirement 2) */}
        {getVassalStates().length > 0 && (
          <div className={`p-5 rounded-3xl border flex flex-col gap-3.5 mb-4 ${
            darkMode ? 'bg-slate-900/60 border-amber-500/30' : 'bg-white border-amber-500/40 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-500/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-amber-300">
                    Vassal States & Buffer Protectorates
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sovereign buffer states created via peace deals. Bound to follow our foreign relations and forbidden from attacking us.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {getVassalStates().length} Active Vassals
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {getVassalStates().map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedMapCountryId(v.id);
                    playSound('click');
                  }}
                  className="p-3.5 rounded-2xl bg-black/25 border border-slate-700/60 hover:border-amber-400/60 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{v.flag || '🛡️'}</span>
                      <div>
                        <span className="font-black text-xs text-white group-hover:text-amber-300 transition-colors block">
                          {v.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          Vassal of {v.suzerainName}
                        </span>
                      </div>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full border border-black/50" style={{ backgroundColor: v.color }} />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-700/40">
                    <span>{v.provinces?.length || 0} Provinces</span>
                    <span className="text-emerald-400 font-bold">100% Loyal</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Global Blocs & Supranational Integration (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Supranational Blocs */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4.5 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 pb-2 border-b border-slate-500/10 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> COALITION BLOCS
            </h3>

            {[
              { type: 'economic' as const, title: 'Supranational Trade Bloc', desc: 'Accelerates free trade agreements, boosting state treasury output on future turns.', influence: 30 },
              { type: 'military' as const, title: 'Joint Defensive Alliance', desc: 'Mitigates civil wars & guarantees mutual aid. Boosts defense stats.', influence: 40 },
              { type: 'diplomatic' as const, title: ' Supranational Council', desc: 'Maximizes global reputation, amplifying soft power & diplomatic treaty speeds.', influence: 25 },
            ].map((bloc) => {
              const joined = activeBlocs[bloc.type];

              return (
                <div
                  key={bloc.type}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 ${
                    joined
                      ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-black/15 border-slate-500/5'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-100 flex justify-between items-center">
                      <span>{bloc.title}</span>
                      {joined && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">JOINED</span>}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {bloc.desc}
                    </p>
                  </div>

                  {!joined && (
                    <button
                      type="button"
                      onClick={() => handleJoinBloc(bloc.type)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow transition-all"
                    >
                      Establish Bloc (-{bloc.influence} Influence)
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Third-Party Conflict Watch */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 pb-2 border-b border-slate-500/10 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-rose-400" /> GLOBAL CONFLICT RADAR
            </h3>
            
            <div className="flex flex-col gap-3">
              {globalConflicts.map((conflict) => (
                <div key={conflict.id} className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-2xl text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-200">
                    <span className="flex items-center gap-1">
                      {getCountryFlag(conflict.countryA)} vs {getCountryFlag(conflict.countryB)}
                    </span>
                    <span className="text-[10px] text-rose-500 font-mono animate-pulse uppercase">Wartime Stance Req</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                    {conflict.description}
                  </p>

                  {!conflict.resolved ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3.5 pt-3.5 border-t border-slate-500/10">
                      <button
                        onClick={() => handleStance(conflict.id, 'Neutral')}
                        className="py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 font-extrabold text-[10px] rounded-xl cursor-pointer"
                      >
                        Stay Neutral
                      </button>
                      <button
                        onClick={() => handleStance(conflict.id, 'Diplomatic')}
                        className="py-2 bg-cyan-650 hover:bg-cyan-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                      >
                        Diplomatic Aid
                      </button>
                      <button
                        onClick={() => handleStance(conflict.id, 'Military')}
                        className="py-2 bg-rose-650 hover:bg-rose-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                      >
                        Intervene Military
                      </button>
                      <button
                        onClick={() => handleMediatePeace(conflict.id)}
                        className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] rounded-xl cursor-pointer shadow-sm shadow-emerald-600/20"
                      >
                        Mediate Peace (25k)
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 bg-black/25 p-2 rounded-xl border border-slate-500/5 text-center font-bold text-[10px] text-emerald-400 uppercase font-mono tracking-wide">
                      Stance Locked: {conflict.stance}
                    </div>
                  )}
                </div>
              ))}
              {globalConflicts.length === 0 && (
                <div className="text-center py-4 text-xs font-bold text-slate-500">No active global conflicts.</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
