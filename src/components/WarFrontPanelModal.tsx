/**
 * Interactive Frontline Command Panel
 * Requirement 3:
 * - Clicking a front label opens front panel with:
 *   - "Send Reinforcements" (choose how many divisions to send from reserves or other fronts)
 *   - "Assign General" real generals according to country and year (gives attack, defence or supply bonuses)
 *   - Front order: Hold / Advance / Fall Back
 *   - Divisions assigned, strength, supply and casualties
 * - Units sent to a front spread across all of that front's border regions, not just one region.
 */

import React, { useState, useMemo } from 'react';
import { ActiveFront, CivilWarDivision } from './CivilWarBattleMap';
import { WarGeneral, getGeneralsForCountryAndYear } from '../data/warGenerals';
import { playSound } from '../lib/sounds';
import { 
  Shield, Swords, ArrowDownRight, UserPlus, Users, Package, 
  Activity, X, ChevronRight, Award, AlertCircle, Compass
} from 'lucide-react';

interface WarFrontPanelModalProps {
  front: ActiveFront;
  allDivisions: CivilWarDivision[];
  playerFactionId: string;
  countryId: string;
  scenarioYear?: string;
  assignedGeneral?: WarGeneral;
  frontCasualties?: number;
  onClose: () => void;
  onSetStance: (frontId: string, stance: 'HOLD' | 'ADVANCE' | 'FALL_BACK') => void;
  onAssignGeneral: (frontId: string, general: WarGeneral) => void;
  onSendReinforcements: (frontId: string, divisionsToSend: CivilWarDivision[]) => void;
  onExecuteFallback?: (frontId: string) => void;
}

export const WarFrontPanelModal: React.FC<WarFrontPanelModalProps> = ({
  front,
  allDivisions,
  playerFactionId,
  countryId,
  scenarioYear = '2026',
  assignedGeneral,
  frontCasualties = 0,
  onClose,
  onSetStance,
  onAssignGeneral,
  onSendReinforcements,
  onExecuteFallback
}) => {
  const [showGeneralSelector, setShowGeneralSelector] = useState<boolean>(false);
  const [reinforceCount, setReinforceCount] = useState<number>(1);

  // Available real generals for country & year
  const availableGenerals = useMemo(() => {
    return getGeneralsForCountryAndYear(countryId, scenarioYear, playerFactionId);
  }, [countryId, scenarioYear, playerFactionId]);

  // Divisions currently assigned to this front
  const frontDivisions = useMemo(() => {
    return allDivisions.filter(d => d.assignedFrontId === front.id && d.strength > 0);
  }, [allDivisions, front.id]);

  // Available friendly divisions that can be sent as reinforcements
  const availableReserves = useMemo(() => {
    return allDivisions.filter(d => 
      d.ownerFaction === playerFactionId && 
      d.assignedFrontId !== front.id && 
      d.strength > 0
    );
  }, [allDivisions, playerFactionId, front.id]);

  // Total metrics
  const totalStrength = frontDivisions.reduce((sum, d) => sum + d.strength, 0);
  const avgSupply = frontDivisions.length > 0
    ? Math.round(frontDivisions.reduce((sum, d) => sum + d.supply, 0) / frontDivisions.length)
    : 0;
  const avgMorale = frontDivisions.length > 0
    ? Math.round(frontDivisions.reduce((sum, d) => sum + d.morale, 0) / frontDivisions.length)
    : 0;

  const handleDeployReinforcements = () => {
    if (availableReserves.length === 0) return;
    const count = Math.min(reinforceCount, availableReserves.length);
    const selectedToDeploy = availableReserves.slice(0, count);
    playSound('success');
    onSendReinforcements(front.id, selectedToDeploy);
  };

  const handleOrderChange = (newStance: 'HOLD' | 'ADVANCE' | 'FALL_BACK') => {
    playSound('click');
    onSetStance(front.id, newStance);
    if (newStance === 'FALL_BACK' && onExecuteFallback) {
      onExecuteFallback(front.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide uppercase">{front.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  vs {front.hostileFactionName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Frontline Operational Sector • {front.friendlyBorderRegions.length} border region(s)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. FRONT ORDER / STANCE (Hold / Advance / Fall Back) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>Frontline Strategic Order</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Current: <strong className="text-white uppercase">{front.stance || 'HOLD'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* HOLD */}
              <button
                type="button"
                onClick={() => handleOrderChange('HOLD')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  front.stance === 'HOLD'
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-1 ring-blue-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs">🛡️ Hold</span>
                <span className="text-[9px] text-slate-400 text-center leading-tight">
                  +40% Defense, low attrition
                </span>
              </button>

              {/* ADVANCE */}
              <button
                type="button"
                onClick={() => handleOrderChange('ADVANCE')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  front.stance === 'ADVANCE'
                    ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">⚔️ Advance</span>
                <span className="text-[9px] text-slate-400 text-center leading-tight">
                  Offensive push across border
                </span>
              </button>

              {/* FALL BACK */}
              <button
                type="button"
                onClick={() => handleOrderChange('FALL_BACK')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  front.stance === 'FALL_BACK'
                    ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">↩️ Fall Back</span>
                <span className="text-[9px] text-slate-400 text-center leading-tight">
                  Withdraw to consolidate rear
                </span>
              </button>
            </div>
          </div>

          {/* 2. FRONT STATS: Divisions, Strength, Supply, Casualties */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Divisions</span>
              <span className="text-base font-black text-white font-mono">{frontDivisions.length}</span>
              <span className="text-[9px] text-slate-500 block">Assigned units</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Troop Strength</span>
              <span className="text-base font-black text-amber-300 font-mono">{totalStrength.toLocaleString()}</span>
              <span className="text-[9px] text-slate-500 block">Active soldiers</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Supply Level</span>
              <span className="text-base font-black text-emerald-400 font-mono">{avgSupply}%</span>
              <span className="text-[9px] text-slate-500 block">Avg efficiency</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Casualties</span>
              <span className="text-base font-black text-rose-400 font-mono">{frontCasualties.toLocaleString()}</span>
              <span className="text-[9px] text-slate-500 block">Cumulative losses</span>
            </div>
          </div>

          {/* 3. ASSIGNED GENERAL (Real Generals according to Country & Year) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>Command General ({scenarioYear})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowGeneralSelector(prev => !prev);
                }}
                className="px-2 py-0.5 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[10px] font-bold cursor-pointer transition-colors"
              >
                {assignedGeneral ? 'Change General' : 'Assign General'}
              </button>
            </div>

            {assignedGeneral ? (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{assignedGeneral.avatar}</span>
                  <div>
                    <h4 className="font-extrabold text-white text-xs leading-tight">{assignedGeneral.name}</h4>
                    <span className="text-[10px] text-purple-300 font-mono">{assignedGeneral.role}</span>
                    <p className="text-[9px] text-slate-400 italic mt-0.5">{assignedGeneral.specialty}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-[10px] font-mono shrink-0">
                  <span className="text-amber-400 font-bold">⚔️ Attack: +{Math.round(assignedGeneral.bonuses.attackBonus * 100)}%</span>
                  <span className="text-blue-400 font-bold">🛡️ Defense: +{Math.round(assignedGeneral.bonuses.defenseBonus * 100)}%</span>
                  <span className="text-emerald-400 font-bold">📦 Supply: +{Math.round(assignedGeneral.bonuses.supplyBonus * 100)}%</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-slate-700 text-center text-slate-400">
                <p className="text-xs">No general assigned to this front. Assigning a real general grants combat & supply bonuses.</p>
              </div>
            )}

            {/* General Picker Dropdown / List */}
            {showGeneralSelector && (
              <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-800 animate-fade-in max-h-48 overflow-y-auto pr-1">
                <p className="text-[10px] text-slate-400 font-mono uppercase mb-1">
                  Historical Generals available for {countryId} ({scenarioYear}):
                </p>
                {availableGenerals.map(gen => (
                  <div
                    key={gen.id}
                    onClick={() => {
                      playSound('success');
                      onAssignGeneral(front.id, gen);
                      setShowGeneralSelector(false);
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      assignedGeneral?.id === gen.id
                        ? 'bg-purple-950/60 border-purple-500 text-white'
                        : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xl shrink-0">{gen.avatar}</span>
                      <div className="truncate">
                        <div className="font-bold text-xs truncate text-white">{gen.name}</div>
                        <div className="text-[9px] text-slate-400 truncate">{gen.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[9px] font-mono">
                      <span className="text-amber-400">+{Math.round(gen.bonuses.attackBonus * 100)}% Atk</span>
                      <span className="text-blue-400">+{Math.round(gen.bonuses.defenseBonus * 100)}% Def</span>
                      <span className="text-emerald-400">+{Math.round(gen.bonuses.supplyBonus * 100)}% Sup</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. SEND REINFORCEMENTS (Spreads across all border regions) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                <span>Send Reinforcements to Front</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Reserves: <strong className="text-blue-400 font-bold">{availableReserves.length}</strong> available
              </span>
            </div>

            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              Units sent to this front are evenly distributed across all {front.friendlyBorderRegions.length} border sector(s) (<span className="text-slate-300">{front.friendlyBorderRegions.join(', ')}</span>).
            </p>

            {availableReserves.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setReinforceCount(prev => Math.max(1, prev - 1))}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-white text-xs">{reinforceCount}</span>
                  <button
                    type="button"
                    onClick={() => setReinforceCount(prev => Math.min(availableReserves.length, prev + 1))}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setReinforceCount(availableReserves.length)}
                  className="px-2 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-bold cursor-pointer"
                >
                  Max ({availableReserves.length})
                </button>

                <button
                  type="button"
                  onClick={handleDeployReinforcements}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Deploy {reinforceCount} Division(s) Across Front</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-[11px]">
                No reserve divisions available to send. Mobilize additional brigades from home territory.
              </div>
            )}
          </div>

          {/* 5. CURRENT DIVISIONS IN SECTOR */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block mb-2">
              Units on Sector ({frontDivisions.length})
            </span>
            {frontDivisions.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {frontDivisions.map(d => (
                  <div key={d.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[9px] px-1 rounded bg-slate-800 text-amber-300 uppercase">{d.type}</span>
                      <span className="font-bold text-slate-200 truncate">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
                      <span className="text-slate-400">At: <strong className="text-white">{d.regionName}</strong></span>
                      <span className="text-amber-400 font-bold">{d.strength.toLocaleString()}</span>
                      <span className="text-emerald-400">{d.supply}% Sup</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[11px] italic">No friendly divisions committed to this front. Send reinforcements above to garrison.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Front Panel
          </button>
        </div>
      </div>
    </div>
  );
};
