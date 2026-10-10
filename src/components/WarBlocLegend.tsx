/**
 * Alliance Bloc Colour Legend & Filter
 * Requirement 2:
 * - Each bloc gets ONE strong, clearly different colour.
 * - Members use shades of that colour plus their flag on the unit counter.
 * - Never give two enemy blocs similar colours.
 * - Colour legend on the map.
 */

import React, { useState } from 'react';
import { ConflictSide } from '../types';
import { FactionData, CivilWarDivision } from './CivilWarBattleMap';
import { Shield, ChevronDown, ChevronUp, Flag } from 'lucide-react';

interface WarBlocLegendProps {
  blocs: ConflictSide[];
  factions: FactionData[];
  divisions: CivilWarDivision[];
  selectedBlocId: string | null;
  factionColorMap: Record<string, string>;
  getFactionFlag: (factionId: string) => string;
  onSelectBloc: (blocId: string | null) => void;
}

export const WarBlocLegend: React.FC<WarBlocLegendProps> = ({
  blocs,
  factions,
  divisions,
  selectedBlocId,
  factionColorMap,
  getFactionFlag,
  onSelectBloc
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (!blocs || blocs.length === 0) return null;

  return (
    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-2.5 max-w-[260px] text-xs pointer-events-auto transition-all select-none">
      {/* Legend Header */}
      <div 
        className="flex items-center justify-between pb-1.5 border-b border-slate-800 cursor-pointer"
        onClick={() => setIsCollapsed(prev => !prev)}
      >
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
            Alliance Blocs & Colours
          </span>
        </div>
        <button className="text-slate-400 hover:text-white p-0.5">
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-2 space-y-2.5">
          {blocs.map(bloc => {
            const isSelected = selectedBlocId === bloc.id;
            const blocDivisions = divisions.filter(d => bloc.members.includes(d.ownerFaction) && d.strength > 0);
            const blocRegionsCount = factions
              .filter(f => bloc.members.includes(f.id))
              .reduce((sum, f) => sum + f.controlledRegions.length, 0);

            return (
              <div 
                key={bloc.id}
                onClick={() => onSelectBloc(isSelected ? null : bloc.id)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-white ring-1 ring-white/40'
                    : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                }`}
              >
                {/* Bloc Header with distinct parent colour */}
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm border border-white/20" 
                      style={{ backgroundColor: bloc.color }} 
                    />
                    <span className="font-extrabold text-white text-[11px] truncate">{bloc.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                    {blocRegionsCount} reg.
                  </span>
                </div>

                {/* Member Factions with their individual shades & flags */}
                <div className="space-y-1 pl-4 border-l border-slate-800 mt-1.5">
                  {bloc.members.map(memberId => {
                    const fac = factions.find(f => f.id === memberId);
                    if (!fac) return null;
                    const shadeColor = factionColorMap[fac.id] || fac.color;
                    const flag = getFactionFlag(fac.id);
                    const memberDivCount = divisions.filter(d => d.ownerFaction === fac.id && d.strength > 0).length;

                    return (
                      <div key={fac.id} className="flex items-center justify-between text-[10px] text-slate-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <span 
                            className="w-2 h-2 rounded-sm shrink-0 border border-white/10" 
                            style={{ backgroundColor: shadeColor }} 
                            title={`Faction Shade: ${shadeColor}`}
                          />
                          <span className="text-xs shrink-0">{flag}</span>
                          <span className="truncate font-medium">{fac.name.split('(')[0].trim()}</span>
                        </div>
                        <span className="font-mono text-[9px] text-slate-400 shrink-0">
                          {memberDivCount} div
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Quick reset button if filtered */}
          {selectedBlocId !== null && (
            <button
              type="button"
              onClick={() => onSelectBloc(null)}
              className="w-full py-1 text-center text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 rounded-lg cursor-pointer transition-colors"
            >
              Reset to All Blocs
            </button>
          )}
        </div>
      )}
    </div>
  );
};
