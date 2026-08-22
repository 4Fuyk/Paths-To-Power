import React, { useState } from 'react';
import { Country, Party, MinisterCandidate, Coalition, ScenarioYear } from '../types';
import { playSound } from '../lib/sounds';
import { CABINET_POSITIONS_BY_COUNTRY, DEFAULT_CABINET_POSITIONS, getCandidatesForEraAndCountry, CabinetPosition } from '../constants/cabinetData';
import { Briefcase, ArrowRight, CheckCircle, Shield, Landmark, Sparkles, User, Users, Coins, AlertTriangle, ShieldCheck, Heart, Medal, X, Calendar } from 'lucide-react';

interface CabinetViewProps {
  country: Country;
  party: Party;
  cabinet: Record<string, MinisterCandidate | null>;
  onUpdateCabinet: (updatedCabinet: Record<string, MinisterCandidate | null>) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  darkMode: boolean;
  coalitions?: Coalition[];
  scenario?: ScenarioYear | string;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  country,
  party,
  cabinet,
  onUpdateCabinet,
  treasury,
  onUpdateTreasury,
  darkMode,
  coalitions = [],
  scenario = '2026',
}) => {
  const [selectedPost, setSelectedPost] = useState<CabinetPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const countryCode = country.id;
  const positions = CABINET_POSITIONS_BY_COUNTRY[countryCode] || DEFAULT_CABINET_POSITIONS;

  // Build authentic historical candidates pool for this specific country and era
  const safeScenario = (['2026', '1950', '1936', '1920', '1914'].includes(scenario) ? scenario : '2026') as ScenarioYear;
  const historicalCandidates = getCandidatesForEraAndCountry(countryCode, safeScenario);
  
  const baseCandidatesPool: MinisterCandidate[] = historicalCandidates.length > 0 ? historicalCandidates : [
    { name: party.leader || `${party.name} Leader`, party: party.name, loyalty: 98, competence: 90, popularity: 88 },
    { name: `${party.name} General Secretary`, party: party.name, loyalty: 94, competence: 88, popularity: 82 },
    { name: `${party.name} Chief Strategist`, party: party.name, loyalty: 92, competence: 92, popularity: 76 },
    { name: `${party.name} Senior Deputy`, party: party.name, loyalty: 90, competence: 85, popularity: 78 },
    ...country.rivals.map(r => ({
      name: r.leader,
      party: r.name,
      loyalty: 65,
      competence: 84,
      popularity: Math.min(95, Math.max(60, Math.round(r.baseSupport * 2.2)))
    })),
    ...country.rivals.map(r => ({
      name: `${r.name} Spokesperson`,
      party: r.name,
      loyalty: 60,
      competence: 80,
      popularity: Math.min(90, Math.max(50, Math.round(r.baseSupport * 1.8)))
    }))
  ];

  // Filter out rival party leaders unless they are in a coalition with the player
  const playerCoalition = coalitions.find(c => c.parties.includes(party.name));
  const coalitionPartyNames = playerCoalition ? playerCoalition.parties : [];
  
  const candidatesPool = baseCandidatesPool.filter(candidate => {
    const isLeaderOfRival = country.rivals.some(r => r.leader === candidate.name);
    
    if (isLeaderOfRival) {
      const rivalInfo = country.rivals.find(r => r.leader === candidate.name);
      if (rivalInfo && (coalitionPartyNames.includes(rivalInfo.name) || coalitionPartyNames.includes(rivalInfo.id))) {
        return true;
      }
      return false;
    }
    return true;
  });

  const getCurrencySymbol = () => {
    if (country.id === 'US') return '$';
    if (country.id === 'TR') return '₺';
    if (country.id === 'DE') return '€';
    if (country.id === 'GB') return '£';
    if (country.id === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrencySymbol();

  // Auto-assign coalition partners if applicable
  React.useEffect(() => {
    if (!playerCoalition) return;
    
    let changed = false;
    const nextCabinet = { ...cabinet };
    
    const coalitionRivals = country.rivals.filter(r => 
      coalitionPartyNames.includes(r.name) || coalitionPartyNames.includes(r.id)
    );
    
    coalitionRivals.forEach(rival => {
      const isAlreadyAppointed = Object.values(nextCabinet).some((c: any) => c && c.name === rival.leader);
      if (!isAlreadyAppointed) {
        const cand = baseCandidatesPool.find(c => c.name === rival.leader);
        if (cand) {
          const emptySlotId = positions.find(p => !nextCabinet[p.id])?.id;
          if (emptySlotId) {
            nextCabinet[emptySlotId] = { ...cand, role: emptySlotId };
            changed = true;
          }
        }
      }
    });

    if (changed) {
      onUpdateCabinet(nextCabinet);
      setSuccessMessage('Coalition partners have been assigned to available ministries!');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCoalition, baseCandidatesPool, country.rivals, positions]);

  // Appoint candidate to a specific post
  const handleAppoint = (postKey: string, candidate: MinisterCandidate) => {
    const cost = 10000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient National Treasury! You need at least ${currency}${cost.toLocaleString()} to appoint a new minister.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateTreasury(treasury - cost);

    const nextCabinet = { ...cabinet };
    Object.keys(nextCabinet).forEach((k) => {
      if (nextCabinet[k]?.name === candidate.name) {
        nextCabinet[k] = null;
      }
    });

    nextCabinet[postKey] = {
      ...candidate,
      role: postKey
    };

    onUpdateCabinet(nextCabinet);
    playSound('success');
    setSuccessMessage(`Successfully appointed ${candidate.name} as ${positions.find(p => p.id === postKey)?.name}!`);
    setErrorMessage(null);
    setSelectedPost(null);
  };

  // Dismiss minister from a post
  const handleDismiss = (postKey: string) => {
    const nextCabinet = { ...cabinet };
    const dismissed = nextCabinet[postKey];
    nextCabinet[postKey] = null;
    onUpdateCabinet(nextCabinet);
    playSound('error');
    setSuccessMessage(dismissed ? `Dismissed ${dismissed.name} from office.` : `Position vacated.`);
    setErrorMessage(null);
  };

  const isCandidateAppointed = (name: string) => {
    return Object.values(cabinet).some((c: any) => c && c.name === name);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/20 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> HISTORICAL EXECUTIVE CABINET
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Era: {scenario}
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 uppercase">Form or Reshuffle Your Cabinet</h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            As Head of State of <strong className="text-white">{country.name}</strong> in <strong className="text-indigo-400">{scenario}</strong>, appoint authentic era-specific statesmen to direct national policy. High competence increases tax collection and institutional efficiency, while high defense readiness deters civil unrest!
          </p>
        </div>
        <div className="flex flex-col items-end bg-black/30 p-3.5 rounded-2xl border border-indigo-500/10 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">STATE TREASURY</span>
          <span className="text-xl font-black font-mono text-emerald-400 mt-0.5">
            {currency}{treasury.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Cabinet Positions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((pos) => {
          const appointed = cabinet[pos.id];
          return (
            <div
              key={pos.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                appointed
                  ? darkMode
                    ? 'bg-slate-900/90 border-indigo-500/30 shadow-lg'
                    : 'bg-white border-indigo-300 shadow-md'
                  : darkMode
                  ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${
                      appointed ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-100">{pos.name}</h4>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{pos.description}</span>
                    </div>
                  </div>
                </div>

                {appointed ? (
                  <div className="mt-4 p-3.5 rounded-2xl bg-black/25 border border-indigo-500/20 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                          {appointed.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white">{appointed.name}</div>
                          <div className="text-[10px] text-indigo-300 font-medium">{appointed.party}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDismiss(pos.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-slate-500/10 text-center">
                      <div className="p-1.5 rounded-xl bg-slate-900/50">
                        <div className="text-[9px] text-slate-400 uppercase font-mono">Loyalty</div>
                        <div className={`text-xs font-black font-mono ${appointed.loyalty >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {appointed.loyalty}%
                        </div>
                      </div>
                      <div className="p-1.5 rounded-xl bg-slate-900/50">
                        <div className="text-[9px] text-slate-400 uppercase font-mono">Skill</div>
                        <div className="text-xs font-black font-mono text-indigo-400">
                          {appointed.competence}%
                        </div>
                      </div>
                      <div className="p-1.5 rounded-xl bg-slate-900/50">
                        <div className="text-[9px] text-slate-400 uppercase font-mono">Fame</div>
                        <div className="text-xs font-black font-mono text-cyan-400">
                          {appointed.popularity}%
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-2xl border border-dashed border-slate-700/60 bg-black/10 flex flex-col items-center justify-center text-center">
                    <User className="w-6 h-6 text-slate-500 mb-1 opacity-50" />
                    <span className="text-[11px] font-bold text-slate-400">Position Vacant</span>
                    <span className="text-[9px] text-slate-500">No minister appointed yet</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => setSelectedPost(pos)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    appointed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{appointed ? 'Reshuffle' : 'Appoint Minister'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Selection Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 flex flex-col gap-4 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">APPOINTMENT PROTOCOL ({scenario})</span>
                <h3 className="text-base font-black uppercase text-slate-100">Select Minister for {selectedPost.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Appointing a minister costs <strong className="text-emerald-400">{currency}10,000</strong> from the National Treasury. Candidates currently holding another portfolio will be transferred.
            </div>

            <div className="max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-2.5">
              {candidatesPool.map((candidate, idx) => {
                const isAppointed = isCandidateAppointed(candidate.name);
                const currentPostId = Object.keys(cabinet).find(k => cabinet[k]?.name === candidate.name);
                const currentPostName = positions.find(p => p.id === currentPostId)?.name;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      darkMode ? 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/40' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-black text-sm text-white uppercase shadow-md shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{candidate.name}</span>
                          {isAppointed && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Currently: {currentPostName}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-indigo-300 font-medium mt-0.5">{candidate.party}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center gap-3 text-center">
                        <div>
                          <div className="text-[9px] text-slate-400 font-mono">LOYALTY</div>
                          <div className={`text-xs font-bold font-mono ${candidate.loyalty >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {candidate.loyalty}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400 font-mono">SKILL</div>
                          <div className="text-xs font-bold font-mono text-indigo-400">
                            {candidate.competence}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400 font-mono">FAME</div>
                          <div className="text-xs font-bold font-mono text-cyan-400">
                            {candidate.popularity}%
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAppoint(selectedPost.id, candidate)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0"
                      >
                        {isAppointed ? 'Transfer' : 'Appoint'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
