/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Swords, Users, Globe, ArrowLeft, 
  MapPin, Flag, AlertTriangle, Crosshair, ChevronRight 
} from 'lucide-react';
import { Country, CivilWarFaction } from '../types';
import { INITIAL_CIVIL_WARS } from '../constants/civilWarData';
import { playSound } from '../lib/sounds';

interface FactionSelectViewProps {
  country: Country;
  darkMode?: boolean;
  onSelectFaction: (faction: CivilWarFaction) => void;
  onBack: () => void;
}

export const FactionSelectView: React.FC<FactionSelectViewProps> = ({
  country,
  darkMode = true,
  onSelectFaction,
  onBack
}) => {
  const civilWar = INITIAL_CIVIL_WARS[country.id] || INITIAL_CIVIL_WARS[country.id === 'COD' ? 'CD' : country.id] || {
    countryId: country.id,
    countryName: country.name,
    flag: country.flag,
    conflictName: `${country.name} Civil Conflict`,
    yearStarted: 2021,
    stability: 20,
    status: 'ACTIVE',
    factions: country.rivals.map((r, i) => ({
      id: r.id,
      name: r.name,
      leader: r.leader,
      ideology: r.ideology,
      color: r.color,
      strength: r.baseSupport || 50,
      controlledRegions: country.regions.slice(i * 3, (i + 1) * 3).map(reg => reg.name),
      isGovernment: i === 0,
      foreignBacker: i === 0 ? 'International Coalition' : 'Regional Powers',
      description: `Faction active in the territorial struggle for ${country.name}.`
    }))
  };

  const [selectedFactionId, setSelectedFactionId] = useState<string>(
    civilWar.factions[0]?.id || ''
  );

  const selectedFaction = civilWar.factions.find(f => f.id === selectedFactionId) || civilWar.factions[0];

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col justify-between ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header & Context Banner */}
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            id="back-to-world-map-btn"
            onClick={() => {
              playSound('click');
              onBack();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              darkMode 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to World Map
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              State of Civil War
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              Constitutional Politics Suspended
            </span>
          </div>
        </div>

        {/* Title block */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-800 shadow-2xl' 
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow">{country.flag}</span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                    {country.name}
                    <span className="text-sm font-bold text-slate-400 font-mono">
                      ({country.id})
                    </span>
                  </h1>
                  <p className="text-xs text-rose-400 font-mono font-bold uppercase tracking-wider mt-0.5">
                    {civilWar.conflictName}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Democratic elections, party congresses, and parliamentary legislation are suspended while hostile belligerents fight for territorial supremacy. Select your faction to assume strategic command, seize provinces, and establish sovereign control to unlock national elections.
              </p>
            </div>

            {/* Victory condition card */}
            <div className={`p-4 rounded-2xl border shrink-0 text-xs space-y-1.5 ${
              darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                Electoral Restoration Criteria
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1 list-disc list-inside">
                <li>Control <strong className="text-slate-200">≥ 70%</strong> of national regions, OR</li>
                <li>Capture and secure <strong className="text-slate-200">the capital city ({country.capitalRegionId || 'Capital'})</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Factions Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Swords className="w-4 h-4 text-rose-400" />
              Choose Your Faction
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {civilWar.factions.length} Belligerents Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {civilWar.factions.map(faction => {
              const isSelected = faction.id === selectedFactionId;
              return (
                <div
                  key={faction.id}
                  id={`faction-card-${faction.id}`}
                  onClick={() => {
                    setSelectedFactionId(faction.id);
                    playSound('click');
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10 scale-[1.01]'
                      : darkMode
                        ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Color badge + Name */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: faction.color }}
                        />
                        <h3 className="font-bold text-sm leading-tight">
                          {faction.name}
                        </h3>
                      </div>
                      {faction.isGovernment && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 whitespace-nowrap">
                          De Jure Govt
                        </span>
                      )}
                    </div>

                    {/* Leader & Ideology */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-slate-500 font-medium">Leader:</span>
                        <strong className="text-white">{faction.leader}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <span className="text-slate-500 font-medium">Ideology:</span>
                        <span className="font-mono">{faction.ideology}</span>
                      </div>
                    </div>

                    {/* Strength meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Troop Strength / Power:</span>
                        <strong className="text-amber-400">{faction.strength}%</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${faction.strength}%`,
                            backgroundColor: faction.color 
                          }}
                        />
                      </div>
                    </div>

                    {/* Foreign Backers */}
                    {faction.foreignBacker && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-black/20 p-2 rounded-xl">
                        <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Backers: <strong className="text-slate-200">{faction.foreignBacker}</strong></span>
                      </div>
                    )}

                    {/* Controlled regions tags */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Held Territories ({faction.controlledRegions.length}):
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                        {faction.controlledRegions.map((reg, idx) => (
                          <span 
                            key={`reg_${reg}_${idx}`}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Narrative Description */}
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {faction.description}
                    </p>
                  </div>

                  {/* Radio selection indicator */}
                  <div className={`mt-2 py-2 px-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : darkMode ? 'bg-slate-800/60 text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'Selected Belligerent' : 'Select Faction'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className={`mt-8 py-4 px-6 rounded-2xl border max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm"
            style={{ backgroundColor: selectedFaction?.color || '#dc2626' }}
          >
            ⚔️
          </div>
          <div>
            <div className="text-xs text-slate-400">Commanding Faction:</div>
            <div className="font-bold text-sm text-white">
              {selectedFaction?.name || 'No Faction Selected'}
            </div>
          </div>
        </div>

        <button
          id="confirm-take-command-btn"
          onClick={() => {
            if (selectedFaction) {
              playSound('win');
              onSelectFaction(selectedFaction);
            }
          }}
          disabled={!selectedFaction}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-black uppercase tracking-wider text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <span>Take Military Command</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
