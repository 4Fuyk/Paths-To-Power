/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party } from './types';
import { PLAYABLE_COUNTRIES } from './constants/countries';
import { ThemeToggle } from './components/ThemeToggle';
import { WorldMap } from './components/WorldMap';
import { PartyCreator } from './components/PartyCreator';
import { CampaignView } from './components/CampaignView';
import { ParliamentView } from './components/ParliamentView';
import { CongressView } from './components/CongressView';
import { FinanceView } from './components/FinanceView';
import { ElectionSimulator } from './components/ElectionSimulator';
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

  const [activeScreen, setActiveScreen] = useState<'MAP' | 'PARTY_CREATOR' | 'MAIN_DASHBOARD' | 'ELECTION_SIMULATOR'>('MAP');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [playerParty, setPlayerParty] = useState<Party | null>(null);
  const [campaignTurn, setCampaignTurn] = useState<number>(1); // 1 to country.campaignTurns
  const [dashboardTab, setDashboardTab] = useState<string>('CAMPAIGN');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [warningAlert, setWarningAlert] = useState<string | null>(null);
  const [showElectionSuccessModal, setShowElectionSuccessModal] = useState<boolean>(false);

  // Sovereign Government and Diplomacy States
  const [isRuling, setIsRuling] = useState<boolean>(false);
  const [hasReshuffledPrompt, setHasReshuffledPrompt] = useState<boolean>(false);

  const [cabinet, setCabinet] = useState<Record<string, { name: string; avatar: string; skill: string; bonus: string; salary: number }>>({
    finance: { name: 'Unassigned', avatar: '💼', skill: 'None', bonus: 'None', salary: 0 },
    interior: { name: 'Unassigned', avatar: '🛡️', skill: 'None', bonus: 'None', salary: 0 },
    defense: { name: 'Unassigned', avatar: '⚔️', skill: 'None', bonus: 'None', salary: 0 },
    foreign: { name: 'Unassigned', avatar: '🌐', skill: 'None', bonus: 'None', salary: 0 }
  });

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
    if (completedCountries.includes(country.id)) {
      const choice = window.confirm(
        `You have already won the general election in ${country.name}!\n\n` +
        `• Press OK to ENTER GOVERNANCE MODE (Rule as Government, manage Taxes, Cabinet, and Diplomacy).\n` +
        `• Press CANCEL to RELAUNCH THE CAMPAIGN (Run as opposition party to win again).`
      );
      
      if (choice) {
        // Go straight to ruling dashboard
        const preppedRegions = country.regions.map(r => {
          const supports = { ...r.supports, player_party: 55 };
          return { ...r, supports };
        });
        
        // Define a mock player party
        const mockParty = {
          id: 'player_party',
          name: 'Ruling Coalition Party',
          leader: 'President of ' + country.name,
          ideology: 'Sosyal Demokrat',
          color: '#3b82f6',
          budget: 500000,
          members: 25000,
          influence: 100,
          photo: '',
          traits: { charisma: 5, eloquence: 4, organization: 4, strategy: 5 }
        };
        
        setSelectedCountry({ ...country, regions: preppedRegions });
        setPlayerParty(mockParty);
        setIsRuling(true);
        setCampaignTurn(1);
        setDashboardTab('CABINET');
        setActiveScreen('MAIN_DASHBOARD');
        return;
      }
    }

    setIsRuling(false);

    // Reset starting region support configurations for the simulation run
    const preppedRegions = country.regions.map((region) => {
      const supports: Record<string, number> = {};
      const playerStart = 2;
      supports['player_party'] = playerStart;
      
      const hasPreseeded = region.supports && Object.keys(region.supports).length > 0;
      if (hasPreseeded) {
        const remaining = 100 - playerStart;
        const preseededSum = Object.values(region.supports).reduce((sum, v) => sum + v, 0);
        Object.entries(region.supports).forEach(([rivalId, val]) => {
          supports[rivalId] = (val / preseededSum) * remaining;
        });
      } else {
        // Rivals share the remaining support based on their base support quotients
        const totalRivalBase = country.rivals.reduce((sum, r) => sum + r.baseSupport, 0);
        let sharedRemaining = 100 - playerStart;

        country.rivals.forEach((rival) => {
          const share = rival.baseSupport / totalRivalBase;
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

      return {
        ...region,
        supports,
        campaignLevel: 0
      };
    });

    const initCountry = { ...country, regions: preppedRegions };
    setSelectedCountry(initCountry);
    setActiveScreen('PARTY_CREATOR');
  };

  // Party assembly creation callback
  const handleCreateParty = (party: Party) => {
    let updatedCountry = selectedCountry;

    if (selectedCountry) {
      // Find matching rival to prevent duplicate preset parties
      const matchedRival = selectedCountry.rivals.find(r => 
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
        (party.name.includes("SSW") && r.id === "SSW")
      );

      if (matchedRival) {
        // Swap supports from matchedRival to player_party so the player starts with their real historical support base!
        let updatedRegions = selectedCountry.regions.map(r => {
          const supports = { ...r.supports };
          if (supports[matchedRival.id] !== undefined) {
            supports[party.id] = (supports[party.id] || 0) + supports[matchedRival.id];
            delete supports[matchedRival.id];
          }
          return { ...r, supports };
        });

        // Normalize supports to exactly 100%
        updatedRegions = updatedRegions.map(r => {
          const supports = { ...r.supports };
          const sum = Object.keys(supports).reduce((s, k) => s + (supports[k] || 0), 0);
          if (Math.abs(sum - 100) > 0.1) {
            const scale = 100 / sum;
            Object.keys(supports).forEach(k => {
              supports[k] = parseFloat((supports[k] * scale).toFixed(2));
            });
          }
          return { ...r, supports };
        });

        const updatedRivals = selectedCountry.rivals.filter(r => r.id !== matchedRival.id);
        updatedCountry = {
          ...selectedCountry,
          rivals: updatedRivals,
          regions: updatedRegions
        };
        setSelectedCountry(updatedCountry);
      }
    }

    setPlayerParty(party);
    setCampaignTurn(1);
    setDashboardTab('CAMPAIGN');
    setActiveScreen('MAIN_DASHBOARD');
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

    const nextCountryState = {
      ...selectedCountry,
      regions: updatedRegions
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
  const handleElectionFinished = (success: boolean) => {
    if (success && selectedCountry && playerParty) {
      // Add and save completed country
      if (!completedCountries.includes(selectedCountry.id)) {
        setCompletedCountries([...completedCountries, selectedCountry.id]);
      }
      setShowElectionSuccessModal(true);
      return;
    }

    setIsRuling(false);
    // Return back to operations map
    setActiveScreen('MAP');
    setSelectedCountry(null);
    setPlayerParty(null);
  };

  const handleFormCabinet = () => {
    setIsRuling(true);
    setTreasury(1000000);
    setFreedomIndex(85);
    setBannedParties([]);
    setCivilWarRisk(0);
    setDashboardTab('CABINET');
    setActiveScreen('MAIN_DASHBOARD');
    setHasReshuffledPrompt(true);
    setShowElectionSuccessModal(false);
  };

  const handleReturnToMap = () => {
    setIsRuling(false);
    setActiveScreen('MAP');
    setSelectedCountry(null);
    setPlayerParty(null);
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
    if (ideology === 'Milliyetçi') return 'Authoritarian Nationalist State';
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
    if (window.confirm('Do you want to reset all game progress? Secured countries will return to default colors.')) {
      setCompletedCountries([]);
      localStorage.removeItem('completed_world_countries');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-300'
    }`}>
      
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
        {activeScreen === 'MAP' && (
          <WorldMap
            completedCountries={completedCountries}
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
                      {playerParty.photo && selectedCountry.id !== 'DE' ? (
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
                        {isRuling ? 'Head of State:' : 'Leader:'} <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{playerParty.leader}</strong>
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
                        {isRuling ? 'YEARS IN POWER' : 'CAMPAIGN WEEK'}
                      </span>
                      <div className="text-sm font-black font-mono">
                        {isRuling ? 'Year 1 (Active Term)' : `${campaignTurn} / ${selectedCountry.campaignTurns} Wk`}
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
                  <button
                    onClick={() => {
                      const msg = isRuling 
                        ? 'Return to the World Map? Your cabinet, diplomacy, and taxation settings are preserved.'
                        : 'Are you sure you want to abort the current campaign and return to the World Map? All current progress for this country will be lost.';
                      if (window.confirm(msg)) {
                        setActiveScreen('MAP');
                        setSelectedCountry(null);
                        setPlayerParty(null);
                      }
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
                    onClick={() => { playSound('click'); setDashboardTab('CAMPAIGN'); }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'CAMPAIGN'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Campaign & Rallies
                  </button>
                  
                  <button
                    onClick={() => { playSound('click'); setDashboardTab('PARLIAMENT'); }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'PARLIAMENT'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" /> Parliament
                  </button>

                  <button
                    onClick={() => { playSound('click'); setDashboardTab('CONGRESS'); }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'CONGRESS'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Party Congress
                  </button>

                  <button
                    onClick={() => { playSound('click'); setDashboardTab('FINANCE'); }}
                    className={`flex-1 min-w-[120px] py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                      dashboardTab === 'FINANCE'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" /> Finance & Treasury
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
                onUpdateCountry={setSelectedCountry}
                onUpdateParty={setPlayerParty}
                onSpendTurn={handleSpendTurn}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'PARLIAMENT' && (
              <ParliamentView
                country={selectedCountry}
                party={playerParty}
                onUpdateCountry={setSelectedCountry}
                onUpdateParty={setPlayerParty}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'CONGRESS' && (
              <CongressView
                country={selectedCountry}
                party={playerParty}
                onUpdateParty={setPlayerParty}
                onSpendTurn={handleSpendTurn}
                darkMode={darkMode}
              />
            )}

            {dashboardTab === 'FINANCE' && selectedCountry && playerParty && (
              <FinanceView
                country={selectedCountry}
                party={playerParty}
                onUpdateCountry={setSelectedCountry}
                onUpdateParty={setPlayerParty}
                darkMode={darkMode}
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

      {/* ELECTION VICTORY / GOVERNING SUCCESS MODAL */}
      {showElectionSuccessModal && selectedCountry && playerParty && (
        <div className="fixed inset-0 z-[120] h-full w-full bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl border p-8 flex flex-col gap-6 items-center text-center animate-scale-up ${
            darkMode ? 'bg-slate-950 border-emerald-500/30' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="p-5 rounded-full bg-emerald-500/10 text-emerald-500 animate-pulse">
              <Award className="w-14 h-14" />
            </div>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400">
                Electoral Victory • Seçim Zaferi
              </span>
              <h3 className={`text-2xl font-black uppercase tracking-tight ${
                darkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                TEBRİKLER! {playerParty.name} SEÇİMİ KAZANDI!
              </h3>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Genel seçimleri başarıyla tamamlayarak mecliste çoğunluğu elde ettiniz! Kabineyi kurup, bakanları atayarak, vergileri ayarlayıp diplomatik ve askeri kararlar almaya hemen başlamak ister misiniz?
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => {
                  playSound('click');
                  handleFormCabinet();
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg cursor-pointer text-center uppercase tracking-widest transition-all"
              >
                Kabineyi Kur & Yönetmeye Başla (Governing Phase)
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
                Dünya Haritasına Dön
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
