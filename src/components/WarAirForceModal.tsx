/**
 * Air Force Command Center Modal
 * Requirement 5:
 * - Aircraft squadrons: Fighter, Bomber, Close Air Support (CAS)
 * - Players can order:
 *   - Air Superiority over a region
 *   - Bombing (lowers enemy strength and supply)
 *   - Support Attack (bonus to a friendly attack)
 * - Aircraft have a range, a cost and losses. Enemy fighters and air defence can shoot them down.
 */

import React, { useState } from 'react';
import { AirSquadron, AirMissionType, AirMissionResult, executeAirMission } from '../data/warAirForce';
import { playSound } from '../lib/sounds';
import { 
  Plane, Shield, Bomb, Crosshair, AlertTriangle, CheckCircle2, 
  X, Plus, Zap, ArrowRight, Activity
} from 'lucide-react';

interface WarAirForceModalProps {
  squadrons: AirSquadron[];
  availableTargetRegions: string[];
  hostileRegions: string[];
  friendlyRegions: string[];
  airSuperiority: number;
  playerBudget: number;
  currency?: string;
  onClose: () => void;
  onExecuteMission: (squadronId: string, targetRegion: string, missionType: AirMissionType) => void;
  onProcureAircraft?: (type: 'fighter' | 'bomber' | 'cas') => void;
}

export const WarAirForceModal: React.FC<WarAirForceModalProps> = ({
  squadrons,
  availableTargetRegions,
  hostileRegions,
  friendlyRegions,
  airSuperiority,
  playerBudget,
  currency = '$',
  onClose,
  onExecuteMission,
  onProcureAircraft
}) => {
  const [selectedSquadronId, setSelectedSquadronId] = useState<string>(squadrons[0]?.id || '');
  const [selectedMission, setSelectedMission] = useState<AirMissionType>('air_superiority');
  const [targetRegion, setTargetRegion] = useState<string>(hostileRegions[0] || availableTargetRegions[0] || '');
  const [lastResult, setLastResult] = useState<AirMissionResult | null>(null);

  const selectedSquadron = squadrons.find(s => s.id === selectedSquadronId) || squadrons[0];

  const handleLaunchSortie = () => {
    if (!selectedSquadron || !targetRegion) return;
    if (selectedSquadron.aircraftCount <= 0) {
      playSound('error');
      return;
    }
    playSound('battle');
    onExecuteMission(selectedSquadron.id, targetRegion, selectedMission);
  };

  const getMissionIcon = (type: AirMissionType) => {
    switch (type) {
      case 'air_superiority': return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'bombing': return <Bomb className="w-4 h-4 text-rose-400" />;
      case 'support_attack': return <Crosshair className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-800/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Plane className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide uppercase">Air Force Command Center</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Air Superiority: {airSuperiority}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tactical Air Wings, Interdiction Strikes & Close Air Support (CAS)
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. SQUADRONS CAROUSEL / SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Active Tactical Air Squadrons ({squadrons.length})
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Total Operational: <strong className="text-cyan-400 font-bold">{squadrons.reduce((s, sq) => s + sq.aircraftCount, 0)} Aircraft</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {squadrons.map(sq => {
                const isSelected = sq.id === selectedSquadronId;
                const isDepleted = sq.aircraftCount <= 0;

                return (
                  <div
                    key={sq.id}
                    onClick={() => {
                      playSound('click');
                      setSelectedSquadronId(sq.id);
                      if (sq.type === 'fighter') setSelectedMission('air_superiority');
                      else if (sq.type === 'bomber') setSelectedMission('bombing');
                      else if (sq.type === 'cas') setSelectedMission('support_attack');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg ring-1 ring-cyan-400'
                        : isDepleted
                        ? 'bg-slate-950/60 border-slate-800 opacity-60'
                        : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">
                          {sq.type === 'fighter' ? '✈️' : sq.type === 'bomber' ? '💣' : '🎯'}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold bg-slate-800 text-cyan-300">
                          {sq.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1 leading-snug">{sq.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Range: {sq.rangeKm} km</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ready Aircraft:</span>
                        <span className={`font-bold ${sq.aircraftCount < 8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {sq.aircraftCount} / {sq.maxAircraft}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all"
                          style={{ width: `${(sq.aircraftCount / Math.max(1, sq.maxAircraft)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500">Readiness:</span>
                        <span className="text-slate-300 font-bold">{sq.readiness}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. MISSION PLANNER & LAUNCHPAD */}
          {selectedSquadron && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedSquadron.type === 'fighter' ? '✈️' : selectedSquadron.type === 'bomber' ? '💣' : '🎯'}</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">{selectedSquadron.name}</h4>
                    <span className="text-[10px] text-slate-400">Deploy flight wing for combat operations</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {selectedSquadron.aircraftCount} Available
                </span>
              </div>

              {/* Mission Type Selector */}
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1.5">
                  Select Air Mission:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* AIR SUPERIORITY */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedMission('air_superiority');
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all text-left cursor-pointer ${
                      selectedMission === 'air_superiority'
                        ? 'bg-cyan-900/30 border-cyan-400 text-white ring-1 ring-cyan-400'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Air Superiority</span>
                    </div>
                    <span className="text-[9px] text-slate-400 leading-tight">
                      Fighter combat sweep. Dominates airspace and suppresses hostile strikes (+25% Air Dominance).
                    </span>
                  </button>

                  {/* STRATEGIC BOMBING */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedMission('bombing');
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all text-left cursor-pointer ${
                      selectedMission === 'bombing'
                        ? 'bg-rose-900/30 border-rose-400 text-white ring-1 ring-rose-400'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                      <Bomb className="w-3.5 h-3.5" />
                      <span>Bombing Run</span>
                    </div>
                    <span className="text-[9px] text-slate-400 leading-tight">
                      Heavy ordinance strike. Lowers enemy strength (-20%) and severs enemy supply (-30%).
                    </span>
                  </button>

                  {/* CLOSE AIR SUPPORT */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedMission('support_attack');
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all text-left cursor-pointer ${
                      selectedMission === 'support_attack'
                        ? 'bg-amber-900/30 border-amber-400 text-white ring-1 ring-amber-400'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Support Attack (CAS)</span>
                    </div>
                    <span className="text-[9px] text-slate-400 leading-tight">
                      Direct ground tactical strike. Gives +35% combat power bonus to friendly ground attacks.
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Region Selector */}
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
                  Target Operational Province:
                </span>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <optgroup label="⚠️ Hostile Contested Sectors">
                    {hostileRegions.map(r => (
                      <option key={`h_${r}`} value={r}>{r} (Hostile)</option>
                    ))}
                  </optgroup>
                  <optgroup label="🛡️ Friendly & Frontier Sectors">
                    {friendlyRegions.map(r => (
                      <option key={`f_${r}`} value={r}>{r} (Friendly Sector)</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Scramble Button */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-mono">
                  Operational Risk: <strong className="text-amber-400">Flak & SAM Interception Risk</strong>
                </div>

                <button
                  type="button"
                  disabled={selectedSquadron.aircraftCount <= 0 || !targetRegion}
                  onClick={handleLaunchSortie}
                  className={`py-2 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                    selectedSquadron.aircraftCount > 0
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Plane className="w-4 h-4" />
                  <span>Scramble Sortie: {selectedMission.replace('_', ' ').toUpperCase()}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. REPLENISH SQUADRONS */}
          {onProcureAircraft && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-white">Procure New Aircraft Wings</h5>
                <p className="text-[10px] text-slate-400">Purchase factory-fresh aircraft to replenish combat losses.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onProcureAircraft('fighter')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px] font-bold cursor-pointer transition-colors border border-slate-700"
                >
                  +4 Fighters ({currency}20k)
                </button>
                <button
                  type="button"
                  onClick={() => onProcureAircraft('bomber')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono text-[10px] font-bold cursor-pointer transition-colors border border-slate-700"
                >
                  +2 Bombers ({currency}30k)
                </button>
                <button
                  type="button"
                  onClick={() => onProcureAircraft('cas')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[10px] font-bold cursor-pointer transition-colors border border-slate-700"
                >
                  +4 CAS ({currency}25k)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Air Command
          </button>
        </div>
      </div>
    </div>
  );
};
