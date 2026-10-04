/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Country, ConflictSide } from '../types';
import { 
  Shield, 
  Flag, 
  Trophy, 
  MapPin, 
  Check, 
  Scale, 
  AlertCircle, 
  ArrowRight,
  Landmark,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';

export interface FactionData {
  id: string;
  name: string;
  leader?: string;
  color: string;
  controlledRegions: string[];
  isGovernment?: boolean;
}

export interface PeaceTerritorialSettlementModalProps {
  isOpen: boolean;
  country: Country;
  factions: FactionData[];
  winnerFactionId: string;
  playerFactionId: string;
  sides?: ConflictSide[];
  allRegions: string[];
  divisionsCount: Record<string, number>;
  manpowerCount: Record<string, number>;
  onConfirmSettlement: (updatedFactions: FactionData[]) => void;
  onClose?: () => void;
}

export const PeaceTerritorialSettlementModal: React.FC<PeaceTerritorialSettlementModalProps> = ({
  isOpen,
  country,
  factions,
  winnerFactionId,
  playerFactionId,
  sides = [],
  allRegions,
  divisionsCount,
  manpowerCount,
  onConfirmSettlement,
  onClose
}) => {
  if (!isOpen) return null;

  const winner = factions.find(f => f.id === winnerFactionId) || factions[0];
  const isPlayerWinner = winnerFactionId === playerFactionId;

  // Calculate military and territorial control weights
  const totalManpower = (Object.values(manpowerCount) as number[]).reduce((a: number, b: number) => a + b, 0);
  const winnerManpower = manpowerCount[winnerFactionId] || 0;
  const militaryWeight = Math.round(
    ((winnerManpower / Math.max(1, totalManpower)) * 40) +
    Math.min(30, (divisionsCount[winnerFactionId] || 0) * 4)
  );

  const initialHeldCount = winner.controlledRegions.length;
  const territoryWeight = Math.round((initialHeldCount / Math.max(1, allRegions.length)) * 50);
  const totalSettlementCapital = Math.min(200, Math.max(60, 40 + militaryWeight + territoryWeight));

  // Determine strategic cost per region
  const regionCostMap = useMemo(() => {
    const costMap: Record<string, number> = {};
    allRegions.forEach((reg, idx) => {
      const isCapital = idx === 0 || /capital|damascus|tripoli|kiev|khartoum|sana|naypyitaw|mogadishu|bamako|kinshasa|kabul/i.test(reg);
      const isEconomic = /port|oil|basin|valley|center|marib|benghazi|aden|hodeidah|misrata/i.test(reg);
      if (isCapital) costMap[reg] = 25;
      else if (isEconomic) costMap[reg] = 18;
      else costMap[reg] = 12;
    });
    return costMap;
  }, [allRegions]);

  // Working state: mapping of region -> assigned faction ID
  const [regionAssignment, setRegionAssignment] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    // First map existing faction controls
    factions.forEach(f => {
      f.controlledRegions.forEach(r => {
        initialMap[r] = f.id;
      });
    });
    // Any unassigned region defaults to winner or first faction
    allRegions.forEach(r => {
      if (!initialMap[r]) initialMap[r] = winnerFactionId;
    });
    return initialMap;
  });

  // Calculate claims spent by winner on newly claimed/reassigned regions
  const pointsSpent = useMemo(() => {
    let spent = 0;
    Object.entries(regionAssignment).forEach(([reg, facId]) => {
      if (facId === winnerFactionId) {
        // If it wasn't originally held by winner, it costs settlement capital
        if (!winner.controlledRegions.includes(reg)) {
          spent += regionCostMap[reg] || 12;
        }
      }
    });
    return spent;
  }, [regionAssignment, winnerFactionId, winner.controlledRegions, regionCostMap]);

  const remainingCapital = Math.max(0, totalSettlementCapital - pointsSpent);

  // Quick Settlement Presets
  const applyPreset = (preset: 'UNCONDITIONAL' | 'STATUS_QUO' | 'AUTONOMOUS_COMPACT') => {
    const newMap: Record<string, string> = { ...regionAssignment };

    if (preset === 'UNCONDITIONAL') {
      // Award all possible regions to winner up to available score or fully if winner is overwhelming
      allRegions.forEach(reg => {
        newMap[reg] = winnerFactionId;
      });
    } else if (preset === 'STATUS_QUO') {
      // Revert to original controls
      factions.forEach(f => {
        f.controlledRegions.forEach(r => {
          newMap[r] = f.id;
        });
      });
    } else if (preset === 'AUTONOMOUS_COMPACT') {
      // Winner gets 75% core regions, minority factions retain their ancestral homelands
      factions.forEach(f => {
        if (f.id === winnerFactionId) return;
        const homeland = f.controlledRegions.slice(0, 2); // Keep small core
        homeland.forEach(r => {
          newMap[r] = f.id;
        });
      });
      allRegions.forEach(r => {
        if (!newMap[r] || !factions.some(f => f.id !== winnerFactionId && f.controlledRegions.slice(0, 2).includes(r))) {
          newMap[r] = winnerFactionId;
        }
      });
    }

    setRegionAssignment(newMap);
  };

  const handleToggleRegionClaim = (region: string) => {
    const currentOwner = regionAssignment[region];
    const cost = regionCostMap[region] || 12;

    if (currentOwner === winnerFactionId) {
      // Relinquish to original or rival faction
      const original = factions.find(f => f.controlledRegions.includes(region))?.id || factions.find(f => f.id !== winnerFactionId)?.id || winnerFactionId;
      setRegionAssignment(prev => ({ ...prev, [region]: original }));
    } else {
      // Claim for winner if capital permits
      if (pointsSpent + cost > totalSettlementCapital) {
        // Exceeds capital limit
        return;
      }
      setRegionAssignment(prev => ({ ...prev, [region]: winnerFactionId }));
    }
  };

  const handleConfirm = () => {
    // Generate updated factions array with new controlled regions
    const updatedFactions = factions.map(f => {
      const newlyHeld = Object.entries(regionAssignment)
        .filter(([_, facId]) => facId === f.id)
        .map(([reg]) => reg);
      return {
        ...f,
        controlledRegions: newlyHeld
      };
    });

    onConfirmSettlement(updatedFactions);
  };

  // Group regions into Contested/Transferred vs Retained
  const contestedRegions = useMemo(() => {
    return allRegions.filter(reg => {
      const current = regionAssignment[reg];
      const original = factions.find(f => f.controlledRegions.includes(reg))?.id;
      return current !== original || current !== winnerFactionId;
    });
  }, [allRegions, regionAssignment, factions, winnerFactionId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Post-War Settlement Conference
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {country.name} Peace Accord
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              Territorial Peace & Border Demarcation
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Hostilities have concluded. Ratify the formal treaty borders below. The victorious coalition may annex contested provinces weighted by military dominance, manpower control, and frontline holdings.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex flex-col items-end shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">Victor & Lead Negotiator</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: winner.color }} />
              <span className="font-black text-slate-100 text-sm">{winner.name}</span>
            </div>
            {isPlayerWinner && (
              <span className="text-[9px] font-black text-emerald-400 mt-0.5">
                ★ PLAYER MANDATE
              </span>
            )}
          </div>
        </div>

        {/* Settlement Capital & Score Bar */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settlement Capital</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-amber-400">{remainingCapital}</span>
              <span className="text-xs text-slate-500">/ {totalSettlementCapital} pts</span>
            </div>
            <div className="text-[10px] text-slate-400">Available to claim contested land</div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Military Weight</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>+{militaryWeight} pts</span>
            </div>
            <div className="text-[10px] text-slate-400">{divisionsCount[winnerFactionId] || 0} active divisions</div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Territory Weight</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
              <Flag className="w-3.5 h-3.5 text-emerald-400" />
              <span>+{territoryWeight} pts</span>
            </div>
            <div className="text-[10px] text-slate-400">{initialHeldCount} / {allRegions.length} provinces held</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Treaty Templates</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyPreset('UNCONDITIONAL')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-colors border border-slate-700 cursor-pointer"
                title="Claim all provinces for victor"
              >
                Unconditional
              </button>
              <button
                onClick={() => applyPreset('AUTONOMOUS_COMPACT')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-colors border border-slate-700 cursor-pointer"
                title="Give victor 75% and preserve regional minority autonomy"
              >
                Federation
              </button>
              <button
                onClick={() => applyPreset('STATUS_QUO')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-colors border border-slate-700 cursor-pointer"
                title="Revert to frontline holdings"
              >
                Frontline
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Region Claims Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Provinces & Contested Sectors ({allRegions.length})
            </h3>
            <span className="text-xs text-slate-400">
              Click any province to toggle or claim ownership for the victor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {allRegions.map(region => {
              const assignedFactionId = regionAssignment[region];
              const assignedFaction = factions.find(f => f.id === assignedFactionId);
              const isClaimedByWinner = assignedFactionId === winnerFactionId;
              const originalOwner = factions.find(f => f.controlledRegions.includes(region));
              const cost = regionCostMap[region] || 12;
              const canAfford = remainingCapital >= cost || isClaimedByWinner;

              return (
                <div
                  key={region}
                  onClick={() => handleToggleRegionClaim(region)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-2 ${
                    isClaimedByWinner
                      ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        <span>{region}</span>
                        {originalOwner && originalOwner.id !== assignedFactionId && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            TRANSFERRED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <span>Assigned to:</span>
                        <span className="font-bold text-slate-200" style={{ color: assignedFaction?.color }}>
                          {assignedFaction?.name.split('(')[0].trim()}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-black text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {cost} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: assignedFaction?.color }} />
                      <span>{isClaimedByWinner ? 'Winner Sovereign Sector' : 'Autonomous / Faction Sector'}</span>
                    </div>

                    <button
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        isClaimedByWinner
                          ? 'bg-amber-500 text-slate-950'
                          : canAfford
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isClaimedByWinner ? 'Claimed ✓' : canAfford ? '+ Claim' : 'No Pts'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Border Outcome Preview */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Treaty Demarcation Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {factions.map(f => {
                const assignedCount = Object.values(regionAssignment).filter(id => id === f.id).length;
                const percentage = Math.round((assignedCount / Math.max(1, allRegions.length)) * 100);
                const delta = assignedCount - f.controlledRegions.length;

                return (
                  <div key={f.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                        <span className="font-bold text-slate-200">{f.name.split('(')[0].trim()}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-300">{assignedCount} prov. ({percentage}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Territory Delta:</span>
                      <span className={`font-mono font-bold ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {delta > 0 ? `+${delta}` : delta} provinces
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Border changes become permanent upon ratification before transition.</span>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Return to Battle Map
              </button>
            )}

            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Ratify Territorial Settlement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
