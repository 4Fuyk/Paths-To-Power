/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { 
  X, 
  Swords, 
  Handshake, 
  TrendingUp, 
  HeartHandshake, 
  Building2, 
  ShieldAlert, 
  AlertTriangle,
  Flame,
  Globe2
} from 'lucide-react';
import { CivilWarState } from '../types';

export interface CountryInfoData {
  id: string;
  name: string;
  flag: string;
  system: string;
  rulingParty: {
    name: string;
    leader: string;
    ideology: string;
    color: string;
  };
  population: string;
  gdp: string;
  militaryStrength: string;
  treasury: string;
  freedomIndex: number; // 0-100
  stability: number; // 0-100
  nextElection: string;
  wars: Array<{
    enemyName: string;
    enemyFlag: string;
    frontStatus: string;
  }>;
  alliances: string[];
  recentEvents: string[];
  civilWar?: CivilWarState | null;
  // Player state comparison
  isPlayerCountry?: boolean;
  playerRelation?: {
    opinion: number;
    status: 'Allied' | 'Friendly' | 'Neutral' | 'Hostile' | 'At War' | 'Defensive Pact';
    hasCB?: boolean;
  };
}

interface CountryInfoSidePanelProps {
  country: CountryInfoData | null;
  onClose: () => void;
  playerTreasury?: number;
  onDeclareWar?: (countryId: string) => void;
  onProposeAlliance?: (countryId: string) => void;
  onTradeDeal?: (countryId: string) => void;
  onSendAid?: (countryId: string) => void;
  onOpenEmbassy?: (countryId: string) => void;
  onCivilWarAction?: (countryId: string, actionType: 'RECOGNIZE_GOV' | 'RECOGNIZE_REBEL' | 'AID_GOV' | 'AID_REBEL' | 'INTERVENE', factionId?: string) => void;
}

export const CountryInfoSidePanel: React.FC<CountryInfoSidePanelProps> = ({
  country,
  onClose,
  playerTreasury = 100000,
  onDeclareWar,
  onProposeAlliance,
  onTradeDeal,
  onSendAid,
  onOpenEmbassy,
  onCivilWarAction,
}) => {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!country) return null;

  const isSelf = !!country.isPlayerCountry;
  const isAtWar = country.playerRelation?.status === 'At War';
  const isAllied = country.playerRelation?.status === 'Allied';
  const opinion = country.playerRelation?.opinion ?? 50;

  // Determine button disabled reasons
  const warDisabledReason = isSelf
    ? 'Cannot declare war on your own country'
    : isAtWar
    ? 'Already at war with this nation'
    : undefined;

  const allianceDisabledReason = isSelf
    ? 'Cannot ally with own country'
    : isAtWar
    ? 'Cannot form alliance while engaged in active war'
    : isAllied
    ? 'Mutual alliance is already established'
    : opinion < 75
    ? `Requires Diplomatic Opinion ≥75 (Current: ${opinion})`
    : undefined;

  const tradeDisabledReason = isSelf
    ? 'Domestic trade is automatically active'
    : isAtWar
    ? 'Commercial trade embargoed due to active warfare'
    : undefined;

  const aidDisabledReason = isSelf
    ? 'Cannot send foreign aid to own sovereign treasury'
    : isAtWar
    ? 'Direct financial aid prohibited to wartime adversary'
    : playerTreasury < 25000
    ? 'Requires at least 25,000 ₺ in national treasury'
    : undefined;

  const embassyDisabledReason = isSelf
    ? 'Sovereign capital already hosts national administration'
    : isAtWar
    ? 'Diplomatic ties severed due to state of war'
    : undefined;

  return (
    <aside 
      aria-label={`Dossier for ${country.name}`}
      className="fixed z-[1000] left-0 top-0 bottom-0 w-full md:w-[360px] h-[55vh] md:h-full md:max-h-screen bg-slate-950/98 text-slate-100 border-r border-t md:border-t-0 border-slate-800 flex flex-col justify-between shadow-2xl font-mono select-none overflow-hidden"
    >
      {/* 1. PANEL HEADER - DENSE HOI4 / AoH3 BANNER */}
      <div className="shrink-0 bg-slate-900/90 border-b border-slate-800 p-3.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-9 bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center text-2xl shadow-inner shrink-0">
            {country.flag || '🌐'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-100 truncate tracking-tight uppercase">
                {country.name}
              </h2>
              {isSelf && (
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-xs font-bold uppercase shrink-0">
                  Player Nation
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {country.system || 'Sovereign State'}
            </div>
            <div className="text-[10px] font-bold truncate flex items-center gap-1.5 mt-0.5">
              <span 
                className="w-2 h-2 rounded-full inline-block shrink-0" 
                style={{ backgroundColor: country.rulingParty.color || '#6366f1' }} 
              />
              <span style={{ color: country.rulingParty.color || '#e2e8f0' }} className="truncate">
                {country.rulingParty.name}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 cursor-pointer transition-all shrink-0"
          title="Close Panel (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. PANEL BODY - DENSE DATA ROWS WITH 1PX HAIRLINE DIVIDERS */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-850 text-xs">
        
        {/* ROW 1: RULING PARTY & LEADER */}
        <div className="p-3 bg-slate-950 flex flex-col gap-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Head of State & Government
          </div>
          <div className="flex justify-between items-center text-slate-200">
            <span className="font-bold text-slate-100">{country.rulingParty.leader}</span>
            <span 
              className="text-[11px] font-semibold px-2 py-0.5 rounded-xs border"
              style={{ 
                color: country.rulingParty.color,
                borderColor: `${country.rulingParty.color}40`,
                backgroundColor: `${country.rulingParty.color}15`
              }}
            >
              {country.rulingParty.name}
            </span>
          </div>
        </div>

        {/* ROW 2: IDEOLOGY */}
        <div className="p-3 bg-slate-950/60 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Ideology
          </span>
          <span className="font-bold text-slate-200 bg-slate-850 px-2 py-0.5 rounded-xs border border-slate-750">
            {country.rulingParty.ideology}
          </span>
        </div>

        {/* ROW 3: CORE STATS (POPULATION, GDP, MILITARY, TREASURY) */}
        <div className="p-3 bg-slate-950 grid grid-cols-2 gap-2 text-[11px]">
          <div className="border border-slate-850 bg-slate-900/40 p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Population</span>
            <span className="font-black text-slate-200">{country.population}</span>
          </div>
          <div className="border border-slate-850 bg-slate-900/40 p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Gross Domestic Product</span>
            <span className="font-black text-emerald-400">{country.gdp}</span>
          </div>
          <div className="border border-slate-850 bg-slate-900/40 p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Military Strength</span>
            <span className="font-black text-rose-400">{country.militaryStrength}</span>
          </div>
          <div className="border border-slate-850 bg-slate-900/40 p-2 flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Treasury / Reserves</span>
            <span className="font-black text-amber-400">{country.treasury}</span>
          </div>
        </div>

        {/* ROW 4: FREEDOM INDEX (0-100 BAR) */}
        <div className="p-3 bg-slate-950/60 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 uppercase tracking-wider font-bold">Freedom Index</span>
            <span className="font-bold text-slate-300">
              {country.freedomIndex}/100 ({country.freedomIndex >= 70 ? 'Free' : country.freedomIndex >= 40 ? 'Partly Free' : 'Not Free'})
            </span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-xs overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 ${
                country.freedomIndex >= 70 ? 'bg-cyan-500' : country.freedomIndex >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, country.freedomIndex))}%` }}
            />
          </div>
        </div>

        {/* ROW 5: STABILITY / UNREST (0-100 BAR) */}
        <div className="p-3 bg-slate-950 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-500 uppercase tracking-wider font-bold">National Stability</span>
            <span className="font-bold text-slate-300">
              {country.stability}% ({country.stability < 30 ? 'High Unrest / Critical' : country.stability < 60 ? 'Fragile' : 'Stable'})
            </span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-xs overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 ${
                country.stability >= 60 ? 'bg-emerald-500' : country.stability >= 30 ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, country.stability))}%` }}
            />
          </div>
        </div>

        {/* ROW 6: NEXT ELECTION DATE */}
        <div className="p-3 bg-slate-950/60 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Next Election
          </span>
          <span className={`font-bold px-2 py-0.5 rounded-xs border text-[11px] ${
            country.nextElection.toLowerCase().includes('no') || country.nextElection.toLowerCase().includes('suspend')
              ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
              : 'bg-indigo-950/40 text-indigo-300 border-indigo-800/40'
          }`}>
            {country.nextElection}
          </span>
        </div>

        {/* ROW 7: WAR STATUS */}
        <div className="p-3 bg-slate-950 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center justify-between">
            <span>War Status</span>
            {country.wars.length > 0 && (
              <span className="text-[9px] text-rose-400 font-bold bg-rose-950/40 px-1.5 py-0.2 rounded-xs border border-rose-800/40 animate-pulse">
                WAR ENGAGED
              </span>
            )}
          </div>
          {country.wars.length === 0 ? (
            <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              At peace
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {country.wars.map((w, idx) => (
                <div key={idx} className="p-2 bg-rose-950/20 border border-rose-900/40 flex justify-between items-center text-[11px]">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    vs {w.enemyFlag} {w.enemyName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {w.frontStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ROW 8: ALLIANCES & PACTS */}
        <div className="p-3 bg-slate-950/60 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Alliances & Pacts
          </div>
          {country.alliances.length === 0 ? (
            <div className="text-slate-500 text-xs italic">Unaligned / No mutual defense treaties</div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {country.alliances.map((al, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-cyan-300 text-[10px] px-2 py-0.5 rounded-xs font-bold">
                  {al}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ROW 9: LATEST 3 NEWS / EVENTS */}
        <div className="p-3 bg-slate-950 flex flex-col gap-1.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Latest Intelligence & News
          </div>
          <div className="flex flex-col gap-1.5">
            {country.recentEvents.slice(0, 3).map((evt, idx) => (
              <div key={idx} className="text-[11px] text-slate-300 bg-slate-900/30 p-1.5 border-l-2 border-indigo-500 pl-2 leading-relaxed">
                {evt}
              </div>
            ))}
          </div>
        </div>

        {/* SPECIAL ROW 10: CIVIL WAR & CONTESTED FACTIONS (IF ACTIVE) */}
        {country.civilWar && country.civilWar.status === 'ACTIVE' && (
          <div className="p-3 bg-rose-950/20 border-t-2 border-rose-600 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-rose-400 uppercase font-black tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Active Civil Conflict
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                Est. {country.civilWar.yearStarted}
              </span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-tight">
              {country.civilWar.conflictName}
            </p>

            <div className="flex flex-col gap-2 mt-1">
              {country.civilWar.factions.map(faction => (
                <div key={faction.id} className="p-2 bg-black/40 border border-slate-800 rounded-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold flex items-center gap-1.5" style={{ color: faction.color }}>
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: faction.color }} />
                      {faction.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 font-bold">
                      {faction.strength}% Strength
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Leader: <span className="text-slate-200">{faction.leader}</span> ({faction.ideology})
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Controlled: {faction.controlledRegions.join(', ')}
                  </div>
                  
                  {/* Faction Action Options */}
                  {!isSelf && onCivilWarAction && (
                    <div className="grid grid-cols-2 gap-1 mt-1 pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => onCivilWarAction(country.id, faction.isGovernment ? 'RECOGNIZE_GOV' : 'RECOGNIZE_REBEL', faction.id)}
                        className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] font-bold border border-slate-700 rounded-xs cursor-pointer transition-all truncate"
                      >
                        Recognize Stance
                      </button>
                      <button
                        onClick={() => onCivilWarAction(country.id, faction.isGovernment ? 'AID_GOV' : 'AID_REBEL', faction.id)}
                        className="py-1 px-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-[9px] font-bold border border-indigo-700 rounded-xs cursor-pointer transition-all truncate"
                      >
                        Send Aid (25k)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isSelf && onCivilWarAction && (
              <button
                onClick={() => onCivilWarAction(country.id, 'INTERVENE')}
                className="w-full mt-1 py-1.5 bg-rose-700 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xs cursor-pointer transition-all border border-rose-500 shadow-md flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Deploy Military Intervention Force
              </button>
            )}
          </div>
        )}

      </div>

      {/* 3. PANEL FOOTER - CONTEXTUAL ACTION BUTTONS WITH HOVER REASONS */}
      <div className="shrink-0 bg-slate-900/95 border-t border-slate-800 p-2.5 flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          {/* DECLARE WAR */}
          <button
            onClick={() => onDeclareWar && onDeclareWar(country.id)}
            disabled={!!warDisabledReason}
            title={warDisabledReason || 'Declare war and mobilize forces against this nation'}
            className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider border rounded-xs transition-all flex items-center justify-center gap-1 ${
              warDisabledReason
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-rose-700 hover:bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30 cursor-pointer'
            }`}
          >
            <Swords className="w-3 h-3 shrink-0" />
            <span>Declare War</span>
          </button>

          {/* PROPOSE ALLIANCE */}
          <button
            onClick={() => onProposeAlliance && onProposeAlliance(country.id)}
            disabled={!!allianceDisabledReason}
            title={allianceDisabledReason || 'Propose a mutual defensive treaty / alliance'}
            className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider border rounded-xs transition-all flex items-center justify-center gap-1 ${
              allianceDisabledReason
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-900/30 cursor-pointer'
            }`}
          >
            <Handshake className="w-3 h-3 shrink-0" />
            <span>Propose Alliance</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* TRADE DEAL */}
          <button
            onClick={() => onTradeDeal && onTradeDeal(country.id)}
            disabled={!!tradeDisabledReason}
            title={tradeDisabledReason || 'Negotiate bilateral trade agreement and commercial concessions'}
            className={`py-1.5 px-1 text-[9px] font-bold uppercase tracking-wider border rounded-xs transition-all flex flex-col items-center justify-center gap-0.5 ${
              tradeDisabledReason
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-600 cursor-pointer'
            }`}
          >
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span>Trade Deal</span>
          </button>

          {/* SEND AID */}
          <button
            onClick={() => onSendAid && onSendAid(country.id)}
            disabled={!!aidDisabledReason}
            title={aidDisabledReason || 'Send financial aid grant (+18 Opinion, -25k Treasury)'}
            className={`py-1.5 px-1 text-[9px] font-bold uppercase tracking-wider border rounded-xs transition-all flex flex-col items-center justify-center gap-0.5 ${
              aidDisabledReason
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-amber-800/80 hover:bg-amber-700 text-amber-100 border-amber-600 cursor-pointer'
            }`}
          >
            <HeartHandshake className="w-3 h-3 shrink-0" />
            <span>Send Aid</span>
          </button>

          {/* OPEN EMBASSY */}
          <button
            onClick={() => onOpenEmbassy && onOpenEmbassy(country.id)}
            disabled={!!embassyDisabledReason}
            title={embassyDisabledReason || 'Establish formal diplomatic embassy and liaison office'}
            className={`py-1.5 px-1 text-[9px] font-bold uppercase tracking-wider border rounded-xs transition-all flex flex-col items-center justify-center gap-0.5 ${
              embassyDisabledReason
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500 border-slate-800'
                : 'bg-indigo-800/80 hover:bg-indigo-700 text-indigo-100 border-indigo-600 cursor-pointer'
            }`}
          >
            <Building2 className="w-3 h-3 shrink-0" />
            <span>Open Embassy</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
