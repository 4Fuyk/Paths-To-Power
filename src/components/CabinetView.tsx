import React, { useState } from 'react';
import { Country, Party, MinisterCandidate } from '../types';
import { playSound } from '../lib/sounds';
import { CABINET_POSITIONS_BY_COUNTRY, POLITICIAN_CANDIDATES_POOL, CabinetPosition } from '../constants/cabinetData';
import { Briefcase, ArrowRight, CheckCircle, Shield, Landmark, Sparkles, User, Users, Coins, AlertTriangle, ShieldCheck, Heart, Medal, X } from 'lucide-react';

interface CabinetViewProps {
  country: Country;
  party: Party;
  cabinet: Record<string, MinisterCandidate | null>;
  onUpdateCabinet: (updatedCabinet: Record<string, MinisterCandidate | null>) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  darkMode: boolean;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  country,
  party,
  cabinet,
  onUpdateCabinet,
  treasury,
  onUpdateTreasury,
  darkMode,
}) => {
  const [selectedPost, setSelectedPost] = useState<CabinetPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const countryCode = country.id;
  const positions = CABINET_POSITIONS_BY_COUNTRY[countryCode] || CABINET_POSITIONS_BY_COUNTRY['DE'];
  const candidatesPool = POLITICIAN_CANDIDATES_POOL[countryCode] || POLITICIAN_CANDIDATES_POOL['DE'];

  const getCurrencySymbol = () => {
    if (country.id === 'US') return '$';
    if (country.id === 'TR') return '₺';
    if (country.id === 'DE') return '€';
    if (country.id === 'GB') return '£';
    if (country.id === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrencySymbol();

  // Appoint candidate to a specific post
  const handleAppoint = (postKey: string, candidate: MinisterCandidate) => {
    // 10k salary sign-on
    const cost = 10000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient National Treasury! You need at least ${currency}${cost.toLocaleString()} to appoint a new minister.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateTreasury(treasury - cost);

    // If the candidate was already assigned to another post, free that post
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

  // Check if candidate is currently holding any office
  const isCandidateAppointed = (name: string) => {
    return Object.values(cabinet).some((c: any) => c && c.name === name);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> SOVEREIGN EXECUTIVE CABINET
          </span>
          <h3 className="text-xl font-black tracking-tight mt-1 uppercase">Form or Reshuffle Your Cabinet</h3>
          <p className="text-xs text-slate-450 mt-1.5 max-w-2xl leading-relaxed">
            As Head of State of <strong className="text-white">{country.name}</strong>, appoint elite political figures to direct national policy. High competence boosts national stats (Finance increases tax yield, Defense lowers civil war risk). Low loyalty poses high scandal and betrayal risks!
          </p>
        </div>
        <div className="flex flex-col items-end bg-black/30 p-3.5 rounded-2xl border border-indigo-500/10 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">STATE TREASURY</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{currency}{treasury.toLocaleString()}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of Ministries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {positions.map((post) => {
          const assigned = cabinet[post.id];
          const hasAssigned = !!assigned;

          return (
            <div
              key={post.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-5 transition-all duration-300 ${
                hasAssigned 
                  ? darkMode ? 'bg-indigo-950/20 border-indigo-500/35 shadow-lg shadow-indigo-950/40' : 'bg-indigo-50/60 border-indigo-200'
                  : darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-start pb-3 border-b border-slate-500/10">
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider font-mono ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {post.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {post.description}
                    </p>
                  </div>
                  {hasAssigned && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md animate-pulse"></span>
                  )}
                </div>

                {hasAssigned ? (
                  <div className="mt-4 flex flex-col gap-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl shrink-0 border border-indigo-500/20">
                        {assigned.portrait ? (
                          <img src={assigned.portrait} alt={assigned.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div>
                        <h5 className={`font-black text-sm uppercase tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {assigned.name}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                            {assigned.party}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attributes progress gauges */}
                    <div className="space-y-2.5 bg-black/20 p-3 rounded-2xl border border-slate-500/5">
                      {/* Competence */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Landmark className="w-3 h-3 text-cyan-400" /> Competence (Skill)
                          </span>
                          <span className="font-bold text-cyan-400">{assigned.competence}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${assigned.competence}%` }}></div>
                        </div>
                      </div>

                      {/* Loyalty */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-amber-400" /> Loyalty (Stability)
                          </span>
                          <span className={`font-bold ${assigned.loyalty < 50 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                            {assigned.loyalty}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${assigned.loyalty < 50 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${assigned.loyalty}%` }}></div>
                        </div>
                        {assigned.loyalty < 50 && (
                          <span className="text-[8px] text-rose-400 font-bold uppercase mt-1 flex items-center gap-1 font-mono">
                            <AlertTriangle className="w-2.5 h-2.5 animate-bounce" /> Warning: Treason & Scandal Risk!
                          </span>
                        )}
                      </div>

                      {/* Popularity */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" /> Popularity
                          </span>
                          <span className="font-bold text-rose-400">{assigned.popularity}/100</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${assigned.popularity}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-700/30 rounded-2xl mt-4 flex flex-col items-center justify-center gap-2">
                    <span className="text-xl">💼</span>
                    <span>VACANT OFFICE</span>
                  </div>
                )}
              </div>

              {hasAssigned ? (
                <button
                  type="button"
                  onClick={() => handleDismiss(post.id)}
                  className="w-full mt-4 py-2 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider"
                >
                  Dismiss Minister
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedPost(post);
                  }}
                  className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-lg shadow-indigo-600/10"
                >
                  Appoint Politician <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Appoint Politician Drawer Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[150] h-full w-full bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 flex flex-col gap-5 ${
            darkMode ? 'bg-slate-950 border-indigo-500/30' : 'bg-white border-slate-250 shadow-2xl'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
              <div>
                <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">APPOINTMENT DRILL</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  Appoint Minister to: {selectedPost.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 -mt-2">
              Select an influential political leader from your candidate pool. Re-assigning an already employed minister will transfer their responsibilities immediately.
            </p>

            <div className="max-h-[350px] overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
              {candidatesPool.map((cand) => {
                const appointed = isCandidateAppointed(cand.name);

                return (
                  <div
                    key={cand.name}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-250 ${
                      appointed
                        ? 'opacity-60 bg-slate-950/35 border-slate-900'
                        : darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg shrink-0">
                        {cand.portrait ? (
                          <img src={cand.portrait} alt={cand.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{cand.name}</h4>
                          <span className="text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                            {cand.party}
                          </span>
                        </div>
                        {/* Attributes HUD */}
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Medal className="w-3 h-3 text-cyan-400" /> Comp: <strong className="text-cyan-400">{cand.competence}</strong>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" /> Loyalty: <strong className="text-amber-400">{cand.loyalty}</strong>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" /> Pop: <strong className="text-rose-400">{cand.popularity}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          playSound('success');
                          handleAppoint(selectedPost.id, cand);
                        }}
                        className={`w-full py-2 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all uppercase tracking-wider text-center ${
                          appointed
                            ? 'bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                        }`}
                      >
                        {appointed ? 'Re-Appoint Here' : 'Appoint Minister'}
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
