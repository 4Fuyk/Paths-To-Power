import React from 'react';
import { 
  Globe, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ArrowRight,
  History,
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { DynamicGameEvent, GameEventChoice, ResolvedEventLog, Country, Party } from '../types';

interface EventModalProps {
  event: DynamicGameEvent | null;
  onChooseOption: (choice: GameEventChoice) => void;
  playerReputation: number;
  playerParty: Party;
  country: Country;
  currency: string;
  darkMode: boolean;
  eventHistory: ResolvedEventLog[];
  showHistoryModal: boolean;
  onCloseHistoryModal: () => void;
  onOpenHistoryModal?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onChooseOption,
  playerReputation,
  playerParty,
  country,
  currency,
  darkMode,
  eventHistory,
  showHistoryModal,
  onCloseHistoryModal
}) => {
  return (
    <>
      {/* 1. ACTIVE EVENT POPUP MODAL */}
      {event && (
        <div className="fixed inset-0 z-[150] h-full w-full bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div 
            className={`w-full max-w-2xl rounded-3xl border p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative animate-scale-up my-auto max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-slate-950 border-amber-500/40 text-slate-100' : 'bg-white border-amber-300 text-slate-900'
            }`}
          >
            {/* Header / Badges */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-3xl p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
                    {event.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest border ${
                        event.scope === 'DOMESTIC' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {event.scope === 'DOMESTIC' ? `🏛️ DOMESTIC AFFAIR • ${country.name}` : '🌐 GLOBAL CONFLICT & DIPLOMACY'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                        event.urgency === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {event.urgency} URGENCY
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                        {event.category}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                      {event.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Disputing Parties Banner if Global */}
              {event.partiesInvolved && (
                <div className={`p-3 rounded-2xl border flex items-center justify-center gap-4 text-xs font-mono font-bold ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="text-base">{event.partiesInvolved.partyA.flag || '🏳️'}</span>
                    <span>{event.partiesInvolved.partyA.name}</span>
                  </span>
                  <span className="text-rose-400 font-black">⚡ VS ⚡</span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="text-base">{event.partiesInvolved.partyB.flag || '🏳️'}</span>
                    <span>{event.partiesInvolved.partyB.name}</span>
                  </span>
                </div>
              )}

              {/* 2-4 Sentence Description */}
              <div className={`p-4 rounded-2xl border text-xs md:text-sm leading-relaxed ${
                darkMode ? 'bg-slate-900/50 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {event.description}
              </div>
            </div>

            {/* Choices Section */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Executive Action Choices (Select one decree):
              </span>

              {event.choices.map((choice) => {
                const isMediation = choice.requiresDiplomaticCapability;
                const minRep = choice.minReputationRequired || 45;
                const canMediate = !isMediation || playerReputation >= minRep;

                return (
                  <button
                    key={choice.id}
                    disabled={!canMediate}
                    onClick={() => {
                      if (canMediate) onChooseOption(choice);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col gap-2.5 relative group ${
                      !canMediate
                        ? 'opacity-40 cursor-not-allowed bg-slate-900/30 border-slate-800 text-slate-500'
                        : darkMode
                          ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500 hover:bg-slate-850 cursor-pointer shadow-md'
                          : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                          ▶
                        </span>
                        <h4 className="text-sm font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
                          {choice.text}
                        </h4>
                      </div>

                      {isMediation && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shrink-0 flex items-center gap-1 ${
                          canMediate ? 'bg-indigo-500/20 text-indigo-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {canMediate ? <Sparkles className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {canMediate ? 'Diplomatic Peace Option' : `Locked (Requires Rep ${minRep}+)`}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 pl-7">
                      {choice.flavorPreview}
                    </p>

                    {/* Preview of Expected Effects */}
                    <div className="pl-7 flex items-center gap-2 flex-wrap text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 font-bold">
                        {choice.expectedEffectsSummary}
                      </span>
                      {choice.effects.relationDeltas && (
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(choice.effects.relationDeltas).map(([countryCode, val]) => {
                            const deltaNum = Number(val) || 0;
                            return (
                              <span
                                key={countryCode}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  deltaNum > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                                }`}
                              >
                                {countryCode}: {deltaNum > 0 ? `+${deltaNum}` : deltaNum}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSISTENT EVENT HISTORY CHRONICLE MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[140] h-full w-full bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div 
            className={`w-full max-w-3xl rounded-3xl border p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative animate-scale-up my-auto max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black">
                    Sovereign Event Chronicle & History Log
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review all domestic and global crises resolved during your tenure.
                  </p>
                </div>
              </div>

              <button
                onClick={onCloseHistoryModal}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Log Records List */}
            {eventHistory.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
                <Globe className="w-10 h-10 stroke-1" />
                <span className="text-sm font-medium">No events logged yet. Events will appear as you advance weeks and months.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {eventHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                      darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-100">{item.title}</h4>
                            <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                              item.scope === 'DOMESTIC' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {item.scope}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.timestamp} • Category: {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pl-8 text-xs text-indigo-300 font-medium">
                      <strong>Policy Decreed:</strong> {item.chosenOptionText}
                    </div>

                    <div className="pl-8 text-xs text-slate-400 leading-relaxed">
                      {item.outcomeNarrative}
                    </div>

                    <div className="pl-8 text-[10px] font-mono text-amber-400/90 font-bold">
                      Impacts: {item.consequencesSummary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
