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
import { ElectionSimulator } from './components/ElectionSimulator';
import { 
  Landmark, Megaphone, Users, Award, Calendar, 
  Coins, HelpCircle, RefreshCw, LogOut, CheckCircle, Info, X, Play 
} from 'lucide-react';

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
  const [dashboardTab, setDashboardTab] = useState<'CAMPAIGN' | 'PARLIAMENT' | 'CONGRESS'>('CAMPAIGN');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

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
    // Reset starting region support configurations for the simulation run
    const preppedRegions = country.regions.map((region) => {
      const supports: Record<string, number> = {};
      const playerStart = 8 + Math.floor(Math.random() * 5);
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
    setPlayerParty(party);
    setCampaignTurn(1);
    setDashboardTab('CAMPAIGN');
    setActiveScreen('MAIN_DASHBOARD');
  };

  // Spend turn action decrementer
  const handleSpendTurn = () => {
    if (!selectedCountry) return;
    const next = campaignTurn + 1;
    if (next > selectedCountry.campaignTurns) {
      // Out of weeks, transition to general voting day results!
      setActiveScreen('ELECTION_SIMULATOR');
    } else {
      setCampaignTurn(next);
    }
  };

  // Election simulator end callback
  const handleElectionFinished = (success: boolean) => {
    if (success && selectedCountry) {
      // Add and save completed country
      if (!completedCountries.includes(selectedCountry.id)) {
        setCompletedCountries([...completedCountries, selectedCountry.id]);
      }
    }
    // Return back to operations map
    setActiveScreen('MAP');
    setSelectedCountry(null);
    setPlayerParty(null);
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
              onClick={() => setShowHowToPlay(true)}
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
              onClick={resetAllProgress}
              className={`p-2 rounded-xl transition-all border text-xs font-semibold hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-450 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
              }`}
              title="Reset Progress"
            >
              <RefreshCw className="w-4 h-4" />
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
                      {playerParty.photo ? (
                        <img 
                          src={playerParty.photo} 
                          alt={playerParty.leader} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white uppercase text-xl">
                          {playerParty.leader.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-lg font-bold tracking-tight">{selectedCountry.name} Campaign HQ</h2>
                      <span 
                        className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide flex items-center gap-1 text-white shadow-sm"
                        style={{ backgroundColor: playerParty.color }}
                      >
                        {playerParty.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      <div>
                        Leader: <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{playerParty.leader}</strong>
                      </div>
                      <div className="mt-0.5">
                        Ideology: <strong className={darkMode ? 'text-slate-250' : 'text-slate-750'}>{playerParty.ideology}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core attributes HUD dials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/20 p-4 rounded-2xl border border-slate-500/5 min-w-0 flex-grow max-w-3xl">
                  {/* Countdown action turn */}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">CAMPAIGN WEEK</span>
                      <div className="text-sm font-black font-mono">
                        {campaignTurn} / {selectedCountry.campaignTurns} Wk
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">PARTY BUDGET</span>
                      <div className="text-sm font-black font-mono text-emerald-400">
                        {currency}{playerParty.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Siyasi Nüfuz */}
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">POLITICAL INFLUENCE</span>
                      <div className="text-sm font-black font-mono text-cyan-400">
                        {playerParty.influence} Influence
                      </div>
                    </div>
                  </div>

                  {/* Estimated support */}
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">EST. VOTE SHARE</span>
                      <div className="text-sm font-black font-mono text-rose-500">
                        % {getGlobalAvgSupport()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. General election day triggers */}
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  <button
                    id="exit-dashboard-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to abort the current campaign and return to the World Map? All current progress for this country will be lost.')) {
                        setActiveScreen('MAP');
                        setSelectedCountry(null);
                        setPlayerParty(null);
                      }
                    }}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all outline-none ${
                      darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-100 hover:bg-slate-205 text-slate-600 border-slate-200'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Abort Campaign
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
              </div>
            </div>

            {/* TAB CONTROLLERS */}
            <div className={`p-1.5 rounded-2xl border flex gap-1 ${
              darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200'
            }`}>
              <button
                id="tab-campaign"
                onClick={() => setDashboardTab('CAMPAIGN')}
                className={`flex-1 py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                  dashboardTab === 'CAMPAIGN'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Megaphone className="w-4 h-4" /> Campaign & Rallies
              </button>
              
              <button
                id="tab-parliament"
                onClick={() => setDashboardTab('PARLIAMENT')}
                className={`flex-1 py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                  dashboardTab === 'PARLIAMENT'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Landmark className="w-4 h-4" /> Parliament & Legislation
              </button>

              <button
                id="tab-congress"
                onClick={() => setDashboardTab('CONGRESS')}
                className={`flex-1 py-3 text-center rounded-xl font-bold text-xs tracking-wide transition-all uppercase flex items-center justify-center gap-2 cursor-pointer ${
                  dashboardTab === 'CONGRESS'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                <Users className="w-4 h-4" /> Party Congress (Assembly)
              </button>
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

    </div>
  );
}
