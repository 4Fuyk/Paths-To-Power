import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Globe, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Landmark, 
  Zap, 
  ArrowRight, 
  FileText,
  DollarSign,
  Award,
  Sliders
} from 'lucide-react';
import { Country, Party, OngoingSituation, StateCrisisEvent } from '../types';

interface StateEventsViewProps {
  country: Country;
  party: Party;
  situations: OngoingSituation[];
  onUpdateSituations: (updater: (prev: OngoingSituation[]) => OngoingSituation[]) => void;
  onResolveSituationEarly: (situationId: string, cost: number) => void;
  pendingCrisis: StateCrisisEvent | null;
  onResolveCrisis: (crisisId: string, optionIndex: number) => void;
  onTriggerNewCrisis: () => void;
  decisionHistory: Array<{
    date: string;
    title: string;
    choice: string;
    outcomeSummary: string;
  }>;
  treasury: number;
  onUpdateTreasury: React.Dispatch<React.SetStateAction<number>>;
  currency: string;
  darkMode: boolean;
  onNavigateToMap: (mapType: 'DIPLOMACY' | 'WAR_FRONT' | 'REGIONAL') => void;
}

export const StateEventsView: React.FC<StateEventsViewProps> = ({
  country,
  party,
  situations,
  onResolveSituationEarly,
  pendingCrisis,
  onResolveCrisis,
  onTriggerNewCrisis,
  decisionHistory,
  treasury,
  currency,
  darkMode,
  onNavigateToMap
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ACTIVE_SITUATIONS' | 'DECISION_ROOM' | 'HISTORY'>('ACTIVE_SITUATIONS');

  // Compute aggregate monthly drift caused by all active situations
  const monthlyTreasuryDrift = situations.reduce((acc, s) => acc + (s.monthlyEffects.treasuryDelta || 0), 0);
  const monthlyInflationDrift = situations.reduce((acc, s) => acc + (s.monthlyEffects.inflationDelta || 0), 0);
  const monthlyReputationDrift = situations.reduce((acc, s) => acc + (s.monthlyEffects.reputationDelta || 0), 0);
  const monthlyApprovalDrift = situations.reduce((acc, s) => acc + (s.monthlyEffects.approvalDelta || 0), 0);
  const monthlyFreedomDrift = situations.reduce((acc, s) => acc + (s.monthlyEffects.freedomDelta || 0), 0);

  const getCategoryColor = (category: OngoingSituation['category']) => {
    switch (category) {
      case 'GEOPOLITICAL': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'MILITARY': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'ECONOMIC': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'DOMESTIC': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'CRISIS': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in" id="state-events-view">
      {/* 1. TOP STRATEGIC SITUATIONS COMMAND BANNER */}
      <div className={`p-6 rounded-3xl border transition-all ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Flame className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">
                  State Affairs, Crisis Decisions & Ongoing Situations
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {situations.length} Active Situation{situations.length !== 1 ? 's' : ''}
                </span>
                {pendingCrisis && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> URGENT CRISIS PENDING
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Major national events shape persistent geopolitical, military, and domestic situations. Monitor their long-term consequences and deploy executive directives.
              </p>
            </div>
          </div>

          {/* QUICK MAP BRIDGE BUTTONS */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => onNavigateToMap('DIPLOMACY')}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/70 border border-cyan-800/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Global Diplomacy Map"
            >
              <Globe className="w-3.5 h-3.5" /> World Diplomacy Map
            </button>
            <button
              onClick={() => onNavigateToMap('WAR_FRONT')}
              className="px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Tactical Battlefield War Map"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> War Front & Battle Map
            </button>
          </div>
        </div>

        {/* CUMULATIVE MONTHLY DRIFT METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-400">Monthly Treasury Drift</span>
            <span className={`text-sm font-black font-mono mt-0.5 ${
              monthlyTreasuryDrift > 0 ? 'text-emerald-400' : monthlyTreasuryDrift < 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {monthlyTreasuryDrift >= 0 ? `+${currency}${monthlyTreasuryDrift.toLocaleString()}` : `-${currency}${Math.abs(monthlyTreasuryDrift).toLocaleString()}`}/mo
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-400">Monthly Inflation Impact</span>
            <span className={`text-sm font-black font-mono mt-0.5 ${
              monthlyInflationDrift < 0 ? 'text-emerald-400' : monthlyInflationDrift > 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {monthlyInflationDrift >= 0 ? `+${monthlyInflationDrift.toFixed(2)}%` : `${monthlyInflationDrift.toFixed(2)}%`}/mo
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-400">Monthly Reputation Drift</span>
            <span className={`text-sm font-black font-mono mt-0.5 ${
              monthlyReputationDrift > 0 ? 'text-cyan-400' : monthlyReputationDrift < 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {monthlyReputationDrift >= 0 ? `+${monthlyReputationDrift}` : `${monthlyReputationDrift}`}/mo
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-400">Public Approval Impact</span>
            <span className={`text-sm font-black font-mono mt-0.5 ${
              monthlyApprovalDrift > 0 ? 'text-emerald-400' : monthlyApprovalDrift < 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {monthlyApprovalDrift >= 0 ? `+${monthlyApprovalDrift.toFixed(1)}%` : `${monthlyApprovalDrift.toFixed(1)}%`}/mo
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col">
            <span className="text-[10px] font-mono uppercase text-slate-400">Freedom Index Drift</span>
            <span className={`text-sm font-black font-mono mt-0.5 ${
              monthlyFreedomDrift > 0 ? 'text-indigo-400' : monthlyFreedomDrift < 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {monthlyFreedomDrift >= 0 ? `+${monthlyFreedomDrift}` : `${monthlyFreedomDrift}`}/mo
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB SWITCHER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className={`p-1 rounded-2xl border flex gap-1 ${
          darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setActiveSubTab('ACTIVE_SITUATIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'ACTIVE_SITUATIONS'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Ongoing Situations ({situations.length})
          </button>

          <button
            onClick={() => setActiveSubTab('DECISION_ROOM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'DECISION_ROOM'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Executive Decision Room {pendingCrisis && '🔴'}
          </button>

          <button
            onClick={() => setActiveSubTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'HISTORY'
                ? 'bg-slate-700 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Consequence Archives ({decisionHistory.length})
          </button>
        </div>

        <button
          onClick={onTriggerNewCrisis}
          className="px-4 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold font-mono uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> Convene Emergency Crisis Council
        </button>
      </div>

      {/* 3. TAB CONTENT 1: ACTIVE ONGOING SITUATIONS */}
      {activeSubTab === 'ACTIVE_SITUATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {situations.length === 0 ? (
            <div className={`col-span-full p-12 rounded-3xl border text-center flex flex-col items-center gap-4 ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">No Active Emergency Situations</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  The republic is currently operating with stable domestic and international baseline metrics. You can advance turns to see upcoming events or convene an emergency council.
                </p>
              </div>
              <button
                onClick={onTriggerNewCrisis}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-md"
              >
                Convene Strategic Council Now
              </button>
            </div>
          ) : (
            situations.map((sit) => {
              const progressPct = Math.round(((sit.totalDuration - sit.remainingMonths) / (sit.totalDuration || 1)) * 100);
              return (
                <div 
                  key={sit.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                    darkMode ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800">{sit.icon}</span>
                        <div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${getCategoryColor(sit.category)}`}>
                            {sit.category}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">{sit.title}</h4>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-amber-400 font-bold block">{sit.remainingMonths} mo left</span>
                        <span className="text-[9px] text-slate-500 font-mono">Total {sit.totalDuration} mo</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{sit.description}</p>
                    
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 text-[11px] text-slate-400">
                      <span className="text-slate-500 uppercase font-mono text-[9px] block">Origin Event:</span>
                      <span className="font-semibold text-slate-200">{sit.sourceEvent}</span>
                    </div>

                    {/* MONTHLY EFFECTS BADGES */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sit.monthlyEffects.treasuryDelta !== undefined && sit.monthlyEffects.treasuryDelta !== 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sit.monthlyEffects.treasuryDelta > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sit.monthlyEffects.treasuryDelta > 0 ? `+${currency}${sit.monthlyEffects.treasuryDelta.toLocaleString()}` : `-${currency}${Math.abs(sit.monthlyEffects.treasuryDelta).toLocaleString()}`}/mo Treasury
                        </span>
                      )}

                      {sit.monthlyEffects.inflationDelta !== undefined && sit.monthlyEffects.inflationDelta !== 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sit.monthlyEffects.inflationDelta < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sit.monthlyEffects.inflationDelta > 0 ? `+${sit.monthlyEffects.inflationDelta}%` : `${sit.monthlyEffects.inflationDelta}%`} Inflation
                        </span>
                      )}

                      {sit.monthlyEffects.reputationDelta !== undefined && sit.monthlyEffects.reputationDelta !== 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sit.monthlyEffects.reputationDelta > 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sit.monthlyEffects.reputationDelta > 0 ? `+${sit.monthlyEffects.reputationDelta}` : `${sit.monthlyEffects.reputationDelta}`} Reputation
                        </span>
                      )}

                      {sit.monthlyEffects.approvalDelta !== undefined && sit.monthlyEffects.approvalDelta !== 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sit.monthlyEffects.approvalDelta > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sit.monthlyEffects.approvalDelta > 0 ? `+${sit.monthlyEffects.approvalDelta}%` : `${sit.monthlyEffects.approvalDelta}%`} Approval
                        </span>
                      )}

                      {sit.monthlyEffects.freedomDelta !== undefined && sit.monthlyEffects.freedomDelta !== 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          sit.monthlyEffects.freedomDelta > 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {sit.monthlyEffects.freedomDelta > 0 ? `+${sit.monthlyEffects.freedomDelta}` : `${sit.monthlyEffects.freedomDelta}`} Freedom
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PROGRESS BAR & COUNTER-ACTION */}
                  <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Timeline Progression</span>
                      <span>{progressPct}% Completed</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {sit.counterAction && (
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">
                          {sit.counterAction.effectDescription}
                        </span>
                        <button
                          onClick={() => onResolveSituationEarly(sit.id, sit.counterAction!.cost)}
                          disabled={treasury < sit.counterAction.cost}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono uppercase transition-all shrink-0 cursor-pointer ${
                            treasury >= sit.counterAction.cost
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {sit.counterAction.label} ({currency}{sit.counterAction.cost.toLocaleString()})
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. TAB CONTENT 2: EXECUTIVE DECISION ROOM */}
      {activeSubTab === 'DECISION_ROOM' && (
        <div className="flex flex-col gap-6">
          {pendingCrisis ? (
            <div className={`p-6 md:p-8 rounded-3xl border flex flex-col gap-6 ${
              darkMode ? 'bg-slate-900 border-indigo-500/40 shadow-2xl' : 'bg-white border-indigo-200 shadow-xl'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{pendingCrisis.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {pendingCrisis.urgency} URGENCY
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                        {pendingCrisis.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">{pendingCrisis.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {pendingCrisis.description}
              </p>

              {/* OPTIONS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {pendingCrisis.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                      darkMode ? 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                          {idx + 1}
                        </span>
                        {opt.text}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {opt.flavorImpact}
                      </p>

                      {/* IMMEDIATE STAT DELTAS */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {opt.immediateEffects.treasuryDelta !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            opt.immediateEffects.treasuryDelta >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {opt.immediateEffects.treasuryDelta >= 0 ? `+${currency}${opt.immediateEffects.treasuryDelta.toLocaleString()}` : `-${currency}${Math.abs(opt.immediateEffects.treasuryDelta).toLocaleString()}`} Treasury
                          </span>
                        )}

                        {opt.immediateEffects.reputationDelta !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            opt.immediateEffects.reputationDelta >= 0 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {opt.immediateEffects.reputationDelta >= 0 ? `+${opt.immediateEffects.reputationDelta}` : `${opt.immediateEffects.reputationDelta}`} Reputation
                          </span>
                        )}

                        {opt.immediateEffects.freedomDelta !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            opt.immediateEffects.freedomDelta >= 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {opt.immediateEffects.freedomDelta >= 0 ? `+${opt.immediateEffects.freedomDelta}` : `${opt.immediateEffects.freedomDelta}`} Freedom
                          </span>
                        )}
                      </div>

                      {/* SPAWNS ONGOING SITUATION PREVIEW */}
                      {opt.spawnSituation && (
                        <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                          <span className="font-bold block text-[10px] font-mono uppercase text-amber-400">Creates Ongoing Situation:</span>
                          <span>{opt.spawnSituation.title} ({opt.spawnSituation.totalDuration} months impact)</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onResolveCrisis(pendingCrisis.id, idx)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-md text-center"
                    >
                      Ratify Executive Directive
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`p-10 rounded-3xl border text-center flex flex-col items-center gap-4 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
                <Landmark className="w-10 h-10" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">Cabinet Chamber & Crisis Desk Active</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  No immediate critical emergencies require executive decree at this moment. You may convene a special emergency ministerial session or advance the game clock to evaluate ongoing policy outcomes.
                </p>
              </div>
              <button
                onClick={onTriggerNewCrisis}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono uppercase transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Summon Crisis Council Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT 3: CONSEQUENCE ARCHIVE & SITUATION HISTORY */}
      {activeSubTab === 'HISTORY' && (
        <div className={`p-6 rounded-3xl border flex flex-col gap-4 ${
          darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            National Executive Decisions & Consequence Log
          </h3>
          <p className="text-xs text-slate-400">
            A permanent record of ratified decrees, summit treaties, and their historical outcomes during your administration.
          </p>

          {decisionHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No historical decrees recorded yet. Decisions made in office will appear here.
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {decisionHistory.map((hist, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">{hist.date}</span>
                      <span className="text-slate-600">•</span>
                      <h4 className="text-xs font-bold text-white">{hist.title}</h4>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Directive:</strong> {hist.choice}
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
                    {hist.outcomeSummary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
