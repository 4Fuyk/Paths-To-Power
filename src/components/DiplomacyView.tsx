import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { Globe, Shield, Landmark, Sparkles, Heart, Scale, Users, Coins, AlertTriangle, Swords, Flame, Check } from 'lucide-react';

interface DiplomacyViewProps {
  country: Country;
  party: Party;
  diplomaticRelations: Record<string, { status: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }>;
  onUpdateRelations: (updatedRelations: any) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  influence: number;
  onUpdateInfluence: (updatedInfluence: number) => void;
  internationalReputation: number;
  onUpdateReputation: (updatedReputation: number) => void;
  publicApprovalImpact: (approvalChange: number) => void;
  darkMode: boolean;
}

export const DiplomacyView: React.FC<DiplomacyViewProps> = ({
  country,
  party,
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
}) => {
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

  // Current active global conflict
  const [globalConflict, setGlobalConflict] = useState<{
    countryA: string;
    countryB: string;
    description: string;
    resolved: boolean;
    stance?: 'Neutral' | 'Diplomatic' | 'Military';
  }>({
    countryA: country.id === 'US' ? 'DE' : 'US',
    countryB: country.id === 'EG' ? 'JP' : 'EG',
    description: 'Border security dispute regarding shipping corridors and territorial waters in the Suez Canal zone.',
    resolved: false
  });

  const getCountryName = (id: string) => {
    const list: Record<string, string> = {
      US: 'United States',
      BR: 'Brazil',
      GB: 'United Kingdom',
      DE: 'Germany',
      TR: 'Turkey',
      EG: 'Egypt',
      JP: 'Japan'
    };
    return list[id] || id;
  };

  const getCountryFlag = (id: string) => {
    const list: Record<string, string> = {
      US: '🇺🇸',
      BR: '🇧🇷',
      GB: '🇬🇧',
      DE: '🇩🇪',
      TR: '🇹🇷',
      EG: '🇪🇬',
      JP: '🇯🇵'
    };
    return list[id] || '🌐';
  };

  // Treaty signing mechanics
  const handleSignTreaty = (targetId: string, type: 'Alliance' | 'Defensive Pact' | 'Non-Aggression') => {
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
    onUpdateReputation(Math.min(100, internationalReputation + (type === 'Alliance' ? 10 : 5)));

    // Boost domestic approval slightly for strong leadership abroad
    publicApprovalImpact(type === 'Alliance' ? 4 : 2);

    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: type, opinion: Math.min(100, currentRelation.opinion + 15) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Bilateral treaty successfully signed! ${getCountryName(targetId)} is now in a state of ${type} with your government.`);
    setErrorMessage(null);
  };

  // Hostile action handlers
  const handleHostileAction = (targetId: string, action: 'Sanction' | 'Embargo' | 'Sever Relations' | 'Declare War') => {
    const currentRelation = diplomaticRelations[targetId];
    if (!currentRelation) return;

    if (action === 'Declare War') {
      // Must have casus belli
      const hasCB = casusBelli[targetId];
      if (!hasCB) {
        playSound('error');
        setErrorMessage(`Declaration of War rejected! You do not have a valid Casus Belli (Justification of War) against ${getCountryName(targetId)}. Sanction or Embargo them first to fabricate justification.`);
        setSuccessMessage(null);
        return;
      }

      onUpdateReputation(Math.max(5, internationalReputation - 40));
      publicApprovalImpact(-10); // War triggers public anti-war protests, drops approval by 10%

      const updated = {
        ...diplomaticRelations,
        [targetId]: { ...currentRelation, status: 'At War' as const, opinion: 0 }
      };
      onUpdateRelations(updated);
      playSound('error');
      setSuccessMessage(`WAR HAS BEEN DECLARED! You have mobilized the military command structure against ${getCountryName(targetId)}. Prepare defenses immediately!`);
      setErrorMessage(null);
      return;
    }

    // Sanction/Embargo/Sever
    let opDrop = 25;
    let repChange = -5;
    let updatedStatus: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned' = 'Neutral';

    if (action === 'Sanction') {
      opDrop = 30;
      repChange = -8;
      updatedStatus = 'Sanctioned';
      // Fabricate Casus Belli on 50% chance
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Embargo') {
      opDrop = 45;
      repChange = -15;
      updatedStatus = 'Sanctioned'; // also embargoed
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Sever Relations') {
      opDrop = 60;
      repChange = -10;
      updatedStatus = 'Neutral';
    }

    onUpdateReputation(Math.max(10, internationalReputation + repChange));
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: updatedStatus, opinion: Math.max(0, currentRelation.opinion - opDrop) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Hostile Action [${action}] executed against ${getCountryName(targetId)}. Relations severed, trade halted, and Casus Belli has been secured!`);
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
  const handleStance = (stance: 'Neutral' | 'Diplomatic' | 'Military') => {
    if (globalConflict.resolved) return;

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

    setGlobalConflict(prev => ({ ...prev, stance, resolved: true }));
    playSound('success');
    setSuccessMessage(`Stance locked! Your strategic stance of [${stance} Support] in the ${getCountryName(globalConflict.countryA)} vs. ${getCountryName(globalConflict.countryB)} dispute has been broadcasted globally.`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Diplomacy Header */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Playable Countries Diplomacy Panel (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 pb-2 border-b border-slate-500/10 mb-4">
              FOREIGN NATIONS & BILATERAL RELATIONS
            </h3>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {Object.entries(diplomaticRelations)
                .filter(([id]) => id !== country.id) // exclude self
                .map(([id, relVal]) => {
                  const rel = relVal as any;
                  const hasCB = casusBelli[id];
                  
                  return (
                    <div
                      key={id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                        rel.status === 'At War'
                          ? 'bg-rose-950/10 border-rose-500/30'
                          : rel.status === 'Alliance'
                          ? 'bg-indigo-950/10 border-indigo-500/20'
                          : darkMode ? 'bg-slate-950/30 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-4xl">{getCountryFlag(id)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-100">{getCountryName(id)}</h4>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              rel.status === 'At War' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                              rel.status === 'Alliance' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              rel.status === 'Defensive Pact' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                            }`}>
                              {rel.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-semibold">
                            <span>Opinion: <strong className="text-slate-350">{rel.opinion}/100</strong></span>
                            {hasCB && (
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/5 border border-amber-500/10 px-1.5 rounded flex items-center gap-0.5 uppercase">
                                <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Casus Belli Secur
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Diplomacy Action Triggers */}
                      <div className="flex flex-wrap gap-1.5">
                        {rel.status === 'At War' ? (
                          <span className="text-xs font-mono text-rose-500 font-bold uppercase animate-pulse flex items-center gap-1 bg-rose-500/5 px-3 py-1.5 border border-rose-500/15 rounded-xl">
                            ⚔️ ACTIVE ARMED CONFLICT
                          </span>
                        ) : (
                          <>
                            {/* Positive Treaties */}
                            <button
                              onClick={() => handleSignTreaty(id, 'Non-Aggression')}
                              disabled={rel.status !== 'Neutral'}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                                rel.status === 'Neutral'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-750'
                                  : 'opacity-50 pointer-events-none text-slate-500 border-transparent'
                              }`}
                            >
                              Non-Aggression Pact
                            </button>
                            <button
                              onClick={() => handleSignTreaty(id, 'Defensive Pact')}
                              disabled={rel.status !== 'Non-Aggression'}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                                rel.status === 'Non-Aggression'
                                  ? 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border-cyan-500/20'
                                  : 'opacity-50 pointer-events-none text-slate-500 border-transparent'
                              }`}
                            >
                              Defense Pact
                            </button>
                            <button
                              onClick={() => handleSignTreaty(id, 'Alliance')}
                              disabled={rel.status !== 'Defensive Pact'}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                                rel.status === 'Defensive Pact'
                                  ? 'bg-indigo-650 hover:bg-indigo-600 text-white border-indigo-500/20'
                                  : 'opacity-50 pointer-events-none text-slate-500 border-transparent'
                              }`}
                            >
                              Alliance
                            </button>

                            {/* Hostile Actions Dropdown Trigger */}
                            <button
                              onClick={() => handleHostileAction(id, 'Sanction')}
                              className="px-2.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                            >
                              Sanction
                            </button>
                            <button
                              onClick={() => handleHostileAction(id, 'Embargo')}
                              className="px-2.5 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                            >
                              Embargo
                            </button>
                            <button
                              onClick={() => handleFundRebels(id)}
                              className="px-2.5 py-1.5 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                            >
                              Fund Rebellion
                            </button>
                            <button
                              onClick={() => handleHostileAction(id, 'Declare War')}
                              className="px-2.5 py-1.5 bg-red-650 hover:bg-red-600 text-white rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 hover:scale-[1.02] transition-transform"
                            >
                              <Swords className="w-3.5 h-3.5" /> War
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Global Blocs & Supranational Integration (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
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

            <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-2xl text-xs">
              <div className="flex justify-between items-center font-bold text-slate-200">
                <span className="flex items-center gap-1">
                  {getCountryFlag(globalConflict.countryA)} vs {getCountryFlag(globalConflict.countryB)}
                </span>
                <span className="text-[10px] text-rose-500 font-mono animate-pulse uppercase">Wartime Stance Req</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                {globalConflict.description}
              </p>

              {!globalConflict.resolved ? (
                <div className="grid grid-cols-3 gap-1.5 mt-3.5 pt-3.5 border-t border-slate-500/10">
                  <button
                    onClick={() => handleStance('Neutral')}
                    className="py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Stay Neutral
                  </button>
                  <button
                    onClick={() => handleStance('Diplomatic')}
                    className="py-2 bg-cyan-650 hover:bg-cyan-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Diplomatic Aid
                  </button>
                  <button
                    onClick={() => handleStance('Military')}
                    className="py-2 bg-rose-650 hover:bg-rose-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Intervene militarily
                  </button>
                </div>
              ) : (
                <div className="mt-3 bg-black/25 p-2 rounded-xl border border-slate-500/5 text-center font-bold text-[10px] text-emerald-400 uppercase font-mono tracking-wide">
                  Stance Locked: {globalConflict.stance}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
