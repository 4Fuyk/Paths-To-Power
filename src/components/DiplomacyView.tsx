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

  // Selected country on the visual tactical world map
  const [selectedMapCountryId, setSelectedMapCountryId] = useState<string>(() => {
    const firstOther = Object.keys(diplomaticRelations).find(id => id !== country.id);
    return firstOther || 'TR';
  });

  // Current active global conflict
  const [globalConflict, setGlobalConflict] = useState<{
    countryA: string;
    countryB: string;
    description: string;
    resolved: boolean;
    stance?: 'Neutral' | 'Diplomatic' | 'Military';
  }>(() => {
    const conflictPool = [
      {
        countryA: 'TR',
        countryB: 'EG',
        description: 'Doğu Akdeniz doğalgaz arama hakları ve deniz yetki sınırları gerilimi.'
      },
      {
        countryA: 'US',
        countryB: 'DE',
        description: 'NATO askeri harcamaları ve otomotiv ticaret gümrük tarifeleri gergisi.'
      },
      {
        countryA: 'GB',
        countryB: 'DE',
        description: 'Kuzey Denizi balıkçılık kotaları ve ticaret sınırlamaları anlaşmazlığı.'
      },
      {
        countryA: 'US',
        countryB: 'JP',
        description: 'Yarı iletken çip üretim paylaşımları ve teknolojik ihracat engellemeleri rekabeti.'
      },
      {
        countryA: 'BR',
        countryB: 'US',
        description: 'Amazon havzası çevre yönergeleri ve tarımsal gıda ithalat gümrük vergileri gerginliği.'
      },
      {
        countryA: 'EG',
        countryB: 'GB',
        description: 'Süveyş Kanalı kargo geçiş ücretleri ve tarihi eser iade davası ihtilafı.'
      }
    ];

    // Pick a conflict that does not include the player's own nation if possible
    const available = conflictPool.filter(c => c.countryA !== country.id && c.countryB !== country.id);
    const chosen = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : conflictPool[0];

    return {
      countryA: chosen.countryA,
      countryB: chosen.countryB,
      description: chosen.description,
      resolved: false
    };
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
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Schematic Tactical World Map */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400 animate-pulse" />
                DİPLOMATİK TAKTİK HARİTASI • TACTICAL OPERATIONS MAP
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SOVEREIGN CTRL
              </span>
            </div>

            {/* Schematic SVG Map */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-500/5 bg-slate-950/60 p-1">
              <svg viewBox="0 0 800 340" className="w-full h-auto select-none bg-slate-950">
                {/* Visual Grid Lines */}
                <defs>
                  <pattern id="tactical-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#tactical-grid)" />

                {/* Highly Simplified Schematic Continents for high-tech holographic war-map styling */}
                {/* North America */}
                <rect x="40" y="50" width="180" height="120" rx="20" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(148, 163, 184, 0.05)" strokeDasharray="4 4" />
                <text x="50" y="70" className="text-[9px] font-mono fill-slate-500 font-bold uppercase tracking-widest">N. America</text>
                
                {/* South America */}
                <rect x="160" y="200" width="120" height="110" rx="20" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(148, 163, 184, 0.05)" strokeDasharray="4 4" />
                <text x="170" y="220" className="text-[9px] font-mono fill-slate-500 font-bold uppercase tracking-widest">S. America</text>

                {/* Eurasia */}
                <rect x="340" y="40" width="380" height="140" rx="25" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(148, 163, 184, 0.05)" strokeDasharray="4 4" />
                <text x="360" y="60" className="text-[9px] font-mono fill-slate-500 font-bold uppercase tracking-widest">Eurasia</text>

                {/* Africa */}
                <rect x="390" y="190" width="140" height="110" rx="20" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(148, 163, 184, 0.05)" strokeDasharray="4 4" />
                <text x="400" y="210" className="text-[9px] font-mono fill-slate-500 font-bold uppercase tracking-widest">Africa</text>

                {/* Oceania */}
                <rect x="630" y="230" width="110" height="80" rx="15" fill="rgba(30, 41, 59, 0.2)" stroke="rgba(148, 163, 184, 0.05)" strokeDasharray="4 4" />
                <text x="640" y="250" className="text-[9px] font-mono fill-slate-500 font-bold uppercase tracking-widest">Oceania</text>

                {/* Connecting Web Lines from HQ */}
                {(() => {
                  const hqCoords: Record<string, {x: number, y: number}> = {
                    US: {x: 130, y: 110},
                    BR: {x: 220, y: 255},
                    GB: {x: 395, y: 95},
                    DE: {x: 445, y: 105},
                    TR: {x: 505, y: 130},
                    EG: {x: 485, y: 185},
                    JP: {x: 695, y: 125}
                  };
                  const hq = hqCoords[country.id] || {x: 505, y: 130};
                  
                  return Object.entries(hqCoords)
                    .filter(([id]) => id !== country.id)
                    .map(([id, pt]) => {
                      const rel = diplomaticRelations[id];
                      const strokeColor = rel?.status === 'At War' ? 'rgba(239, 68, 68, 0.25)' : 
                                          rel?.status === 'Alliance' ? 'rgba(16, 185, 129, 0.25)' : 
                                          'rgba(99, 102, 241, 0.1)';
                      const isDashed = rel?.status !== 'Alliance' && rel?.status !== 'At War';

                      return (
                        <line
                          key={`line-${id}`}
                          x1={hq.x}
                          y1={hq.y}
                          x2={pt.x}
                          y2={pt.y}
                          stroke={strokeColor}
                          strokeWidth="1.5"
                          strokeDasharray={isDashed ? "3 3" : undefined}
                        />
                      );
                    });
                })()}

                {/* Interactive Node Renderers */}
                {(() => {
                  const countryPoints: { id: string, name: string, x: number, y: number, flag: string }[] = [
                    { id: 'US', name: 'United States', x: 130, y: 110, flag: '🇺🇸' },
                    { id: 'BR', name: 'Brazil', x: 220, y: 255, flag: '🇧🇷' },
                    { id: 'GB', name: 'United Kingdom', x: 395, y: 95, flag: '🇬🇧' },
                    { id: 'DE', name: 'Germany', x: 445, y: 105, flag: '🇩🇪' },
                    { id: 'TR', name: 'Turkey', x: 505, y: 130, flag: '🇹🇷' },
                    { id: 'EG', name: 'Egypt', x: 485, y: 185, flag: '🇪🇬' },
                    { id: 'JP', name: 'Japan', x: 695, y: 125, flag: '🇯🇵' }
                  ];

                  return countryPoints.map((pt) => {
                    const isSelf = pt.id === country.id;
                    const rel = diplomaticRelations[pt.id];
                    const isSelected = selectedMapCountryId === pt.id;

                    // Compute node colors & rings based on geopolitical relation status
                    let color = '#64748b'; // default Gray/Neutral
                    let glowClass = '';
                    if (isSelf) {
                      color = '#3b82f6'; // Bright blue HQ
                    } else if (rel) {
                      if (rel.status === 'At War') {
                        color = '#ef4444';
                        glowClass = 'animate-pulse';
                      } else if (rel.status === 'Alliance') {
                        color = '#10b981';
                      } else if (rel.status === 'Defensive Pact') {
                        color = '#06b6d4';
                      } else if (rel.status === 'Sanctioned') {
                        color = '#f59e0b';
                      } else if (rel.status === 'Non-Aggression') {
                        color = '#eab308';
                      }
                    }

                    return (
                      <g 
                        key={pt.id} 
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                        onClick={() => {
                          if (isSelf) {
                            playSound('click');
                            setSuccessMessage(`Sovereign Headquarters: ${pt.name} is your ruling nation! Select other global nations on the map to manage diplomacy.`);
                            setErrorMessage(null);
                          } else {
                            playSound('click');
                            setSelectedMapCountryId(pt.id);
                          }
                        }}
                      >
                        {/* Selected Indicator Outer Ring */}
                        {isSelected && (
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r="18" 
                            fill="none" 
                            stroke="#818cf8" 
                            strokeWidth="1.5" 
                            strokeDasharray="3 2"
                            className="animate-[spin_8s_linear_infinite]"
                          />
                        )}

                        {/* Status Glowing Ring */}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={isSelected ? 13 : 10} 
                          fill="none" 
                          stroke={color} 
                          strokeWidth="2.5" 
                          opacity="0.6"
                          className={glowClass}
                        />

                        {/* Solid Central Hub Node */}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="6" 
                          fill={color} 
                        />

                        {/* Flag bubble on top/right */}
                        <text 
                          x={pt.x + 8} 
                          y={pt.y + 4} 
                          className="text-[12px] font-bold"
                        >
                          {pt.flag}
                        </text>

                        {/* Label */}
                        <text 
                          x={pt.x} 
                          y={pt.y - 14} 
                          textAnchor="middle"
                          className={`text-[8.5px] font-mono font-black uppercase tracking-wider ${
                            isSelected ? 'fill-indigo-300 font-bold' : 'fill-slate-400'
                          }`}
                        >
                          {pt.id === 'TR' ? 'TÜRKİYE' : pt.id === 'US' ? 'USA' : pt.id === 'GB' ? 'UK' : pt.id}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>
              <div className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/75 px-2 py-0.5 rounded text-slate-400 border border-slate-500/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                LIVE DIPLOMACY FEED
              </div>
            </div>
          </div>

          {/* Active Focused Diplomatic Controls Card */}
          {(() => {
            const id = selectedMapCountryId;
            const rel = diplomaticRelations[id];
            if (!rel) return null;
            const hasCB = casusBelli[id];

            return (
              <div className={`p-6 rounded-3xl border flex flex-col gap-5 ${
                rel.status === 'At War'
                  ? 'bg-rose-950/10 border-rose-500/30'
                  : rel.status === 'Alliance'
                  ? 'bg-indigo-950/10 border-indigo-500/20'
                  : darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Nation Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-500/10 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{getCountryFlag(id)}</span>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-100 uppercase tracking-tight flex items-center gap-2">
                        {getCountryName(id)}
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          rel.status === 'At War' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                          rel.status === 'Alliance' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          rel.status === 'Defensive Pact' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                        }`}>
                          {rel.status === 'At War' ? 'Savaşta / At War' : 
                           rel.status === 'Alliance' ? 'Müttefik / Alliance' :
                           rel.status === 'Defensive Pact' ? 'Savunma Paktı / Defense Pact' :
                           rel.status === 'Sanctioned' ? 'Yaptırımlı / Sanctioned' :
                           rel.status === 'Non-Aggression' ? 'Saldırmazlık / Non-Aggression' : 'Tarafsız / Neutral'}
                        </span>
                      </h4>
                      <div className="flex items-center gap-3.5 mt-1">
                        <span className="text-xs text-slate-400 font-mono">
                          Bilateral Opinion: <strong className="text-indigo-400 font-bold">{rel.opinion}/100</strong>
                        </span>
                        {hasCB && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                            <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Savaş Sebebi / Casus Belli Secur
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual Opinion Bar */}
                  <div className="w-full sm:w-40 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                      <span>Bilateral Mood</span>
                      <span className={rel.opinion > 70 ? 'text-emerald-400' : rel.opinion < 35 ? 'text-rose-400' : 'text-slate-300'}>
                        {rel.opinion > 70 ? 'Friendly' : rel.opinion < 35 ? 'Hostile' : 'Wary'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/30 overflow-hidden border border-slate-500/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          rel.opinion > 70 ? 'bg-emerald-500' : rel.opinion < 35 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${rel.opinion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Diplomacy Movement Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pacifist Treaties & Alliances */}
                  <div className="p-4 rounded-2xl bg-black/15 border border-slate-500/5 flex flex-col gap-3">
                    <h5 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> BARIŞÇIL ANLAŞMALAR • PEACEMAKING
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Establish friendly coalitions, guarantee non-aggression, or form defensive networks. Friendly actions require high bilateral opinions and diplomatic soft power.
                    </p>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        onClick={() => handleSignTreaty(id, 'Non-Aggression')}
                        disabled={rel.status !== 'Neutral'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Neutral'
                            ? 'bg-slate-800 hover:bg-slate-755 text-slate-200 border-slate-700 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Saldırmazlık Paktı • Non-Aggression</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Opinion ≥40</span>
                      </button>

                      <button
                        onClick={() => handleSignTreaty(id, 'Defensive Pact')}
                        disabled={rel.status !== 'Non-Aggression'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Non-Aggression'
                            ? 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border-cyan-500/20 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Ortak Savunma Paktı • Defense Pact</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Opinion ≥65</span>
                      </button>

                      <button
                        onClick={() => handleSignTreaty(id, 'Alliance')}
                        disabled={rel.status !== 'Defensive Pact'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Defensive Pact'
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/20 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Resmi Müttefiklik • Form Alliance</span>
                        <span className="text-[10px] font-mono text-indigo-200 font-bold">Opinion ≥85</span>
                      </button>
                    </div>
                  </div>

                  {/* Hostile & Aggressive Actions */}
                  <div className="p-4 rounded-2xl bg-black/15 border border-slate-500/5 flex flex-col gap-3">
                    <h5 className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> AGRESİF AKSİYONLAR • HOSTILITIES
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Isolate hostile nations, block commercial fleets, fund local rebel groups covertly, or declare active armed mobilization against rival economies.
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleHostileAction(id, 'Sanction')}
                          disabled={rel.status === 'At War'}
                          className="py-2.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                        >
                          Yaptırım / Sanction
                        </button>
                        <button
                          onClick={() => handleHostileAction(id, 'Embargo')}
                          disabled={rel.status === 'At War'}
                          className="py-2.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                        >
                          Ambargo / Embargo
                        </button>
                      </div>

                      <button
                        onClick={() => handleFundRebels(id)}
                        disabled={rel.status === 'At War'}
                        className="w-full py-2.5 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <span>İsyancıları Fonla • Fund Local Rebels</span>
                        <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full uppercase">
                          Costs 80k
                        </span>
                      </button>

                      <button
                        onClick={() => handleHostileAction(id, 'Declare War')}
                        disabled={rel.status === 'At War'}
                        className="w-full py-3 bg-red-650 hover:bg-red-600 text-white rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform shadow-lg shadow-red-500/10 uppercase tracking-widest"
                      >
                        <Swords className="w-4 h-4" /> SAVAŞ İLAN ET • DECLARE WAR!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
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
