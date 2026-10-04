/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Handshake, Shield, AlertTriangle, CheckCircle2, XCircle, 
  Globe, Award, Flag, Users, FileText, ChevronRight, X,
  Building, Sparkles, Scale, HeartHandshake
} from 'lucide-react';
import { FactionData, FactionStats, CivilWarDivision } from './CivilWarBattleMap';
import { playSound } from '../lib/sounds';

export type PeaceActionType = 
  | 'CEASEFIRE'
  | 'NEGOTIATE_PEACE'
  | 'DEMAND_SURRENDER'
  | 'ACCEPT_SURRENDER'
  | 'REJECT_PROPOSAL'
  | 'INTERNATIONAL_MEDIATION'
  | 'POWER_SHARING'
  | 'REGIONAL_AUTONOMY'
  | 'INTEGRATE_FACTION';

export interface PeaceAgreement {
  type: PeaceActionType;
  title: string;
  signatories: string[];
  targetFactionId: string;
  date: string;
  terms: string[];
  territoryTransferred: string[];
  manpowerIntegrated: number;
  treasuryTransfer: number;
  postWarGovernance: 'TRANSITIONAL_COALITION' | 'FEDERAL_AUTONOMY' | 'UNIFIED_REPUBLIC';
}

interface CivilWarPeaceModalProps {
  countryId: string;
  countryName: string;
  playerFactionId: string;
  factions: FactionData[];
  divisions: CivilWarDivision[];
  casualtyStats: Record<string, FactionStats>;
  totalRegionsCount: number;
  playerTerritoryPercent: number;
  turnNumber: number;
  peaceSignatoryFactionIds?: string[];
  onClose: () => void;
  onSettlementReached: (agreement: PeaceAgreement) => void;
}

export const CivilWarPeaceModal: React.FC<CivilWarPeaceModalProps> = ({
  countryId,
  countryName,
  playerFactionId,
  factions,
  divisions,
  casualtyStats,
  totalRegionsCount,
  playerTerritoryPercent,
  turnNumber,
  peaceSignatoryFactionIds = [],
  onClose,
  onSettlementReached
}) => {
  const [selectedTargetFactionId, setSelectedTargetFactionId] = useState<string>(() => {
    const unnegotiated = factions.find(f => f.id !== playerFactionId && !peaceSignatoryFactionIds.includes(f.id));
    if (unnegotiated) return unnegotiated.id;
    const rival = factions.find(f => f.id !== playerFactionId);
    return rival ? rival.id : '';
  });

  const [hasRequestedMediation, setHasRequestedMediation] = useState<boolean>(false);
  const [negotiationLog, setNegotiationLog] = useState<string[]>([]);
  const [activeProposal, setActiveProposal] = useState<{
    action: PeaceActionType;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    explanation: string;
    agreement?: PeaceAgreement;
  } | null>(null);

  const playerFaction = factions.find(f => f.id === playerFactionId) || factions[0];
  const targetFaction = factions.find(f => f.id === selectedTargetFactionId) || factions[1];

  const targetStats = casualtyStats[selectedTargetFactionId] || {
    divisionsRemaining: 0,
    totalManpower: 0,
    lossesThisTurn: 0,
    cumulativeLosses: 0,
    regionsHeld: 0
  };

  const playerStats = casualtyStats[playerFactionId] || {
    divisionsRemaining: 0,
    totalManpower: 0,
    lossesThisTurn: 0,
    cumulativeLosses: 0,
    regionsHeld: 0
  };

  // Calculate Acceptance Factors
  const calculation = useMemo(() => {
    const targetTerritoryPercent = totalRegionsCount > 0 
      ? Math.round((targetFaction.controlledRegions.length / totalRegionsCount) * 100)
      : 20;

    // 1. Territory Factor (-30 to +40)
    const territoryAdvantage = playerTerritoryPercent - targetTerritoryPercent;
    const territoryScore = Math.round(territoryAdvantage * 0.5);

    // 2. Military Ratio Factor (-25 to +35)
    const targetDivs = divisions.filter(d => d.ownerFaction === selectedTargetFactionId && d.strength > 0).length;
    const playerDivs = divisions.filter(d => d.ownerFaction === playerFactionId && d.strength > 0).length;
    const militaryAdvantage = playerDivs - targetDivs;
    const militaryScore = Math.min(35, Math.max(-25, militaryAdvantage * 6));

    // 3. War Exhaustion & Casualties Factor (0 to +25)
    const targetExhaustion = Math.min(25, Math.round((targetStats.cumulativeLosses / 25000) * 15));

    // 4. Strategic Position / Momentum Factor (-10 to +20)
    const momentumScore = playerTerritoryPercent >= 60 ? 15 : playerTerritoryPercent >= 45 ? 5 : -5;

    // 5. Mediation Bonus
    const mediationBonus = hasRequestedMediation ? 18 : 0;

    // Total baseline peace willingness score (0 - 100)
    const baseWillingness = Math.min(100, Math.max(5, 
      35 + territoryScore + militaryScore + targetExhaustion + momentumScore + mediationBonus
    ));

    return {
      targetTerritoryPercent,
      territoryScore,
      militaryScore,
      targetExhaustion,
      momentumScore,
      mediationBonus,
      baseWillingness
    };
  }, [
    playerTerritoryPercent, targetFaction, selectedTargetFactionId, 
    divisions, playerFactionId, targetStats, totalRegionsCount, hasRequestedMediation
  ]);

  // Execute peace actions
  const handleExecuteAction = (action: PeaceActionType) => {
    playSound('click');

    // 1. Request International Mediation
    if (action === 'INTERNATIONAL_MEDIATION') {
      setHasRequestedMediation(true);
      playSound('win');
      setNegotiationLog(prev => [
        `🌐 UN Special Envoy and Regional Mediators entered the negotiations. International diplomatic pressure applied (+18 Mediation Bonus to all peace talks).`,
        ...prev
      ]);
      return;
    }

    // 2. Reject Proposal
    if (action === 'REJECT_PROPOSAL') {
      setActiveProposal(null);
      setNegotiationLog(prev => [
        `❌ You formally rejected the proposed terms. Frontline hostilities resume.`,
        ...prev
      ]);
      return;
    }

    // Evaluate Acceptance based on action thresholds
    let threshold = 50;
    let actionTitle = '';
    let successMessage = '';
    let rejectionReason = '';
    let governanceType: 'TRANSITIONAL_COALITION' | 'FEDERAL_AUTONOMY' | 'UNIFIED_REPUBLIC' = 'UNIFIED_REPUBLIC';

    switch (action) {
      case 'CEASEFIRE':
        threshold = 40;
        actionTitle = 'Bilateral Frontline Ceasefire';
        successMessage = `${targetFaction.name} accepted the humanitarian ceasefire. Offensive maneuvers are frozen under international observation.`;
        rejectionReason = `${targetFaction.name} command rejects ceasefire: "We retain defensive depth and will not freeze current frontlines without territorial concessions."`;
        break;

      case 'NEGOTIATE_PEACE':
        threshold = 55;
        actionTitle = 'Negotiated Comprehensive Peace Treaty';
        governanceType = 'UNIFIED_REPUBLIC';
        successMessage = `Historic breakthrough! ${targetFaction.name} delegates signed the Comprehensive Peace Treaty, ending the civil war.`;
        rejectionReason = `${targetFaction.name} diplomatic council rejected the peace treaty: "The terms do not guarantee our constitutional sovereignty."`;
        break;

      case 'POWER_SHARING':
        threshold = 48;
        actionTitle = 'National Power-Sharing Agreement';
        governanceType = 'TRANSITIONAL_COALITION';
        successMessage = `Power-sharing accord reached! A transitional national unity government has been established, integrating cabinet portfolios.`;
        rejectionReason = `${targetFaction.name} leadership refused coalition power-sharing: "We cannot govern jointly with ideological adversaries without greater regional autonomy."`;
        break;

      case 'REGIONAL_AUTONOMY':
        threshold = 44;
        actionTitle = 'Federal Autonomy & Peace Pact';
        governanceType = 'FEDERAL_AUTONOMY';
        successMessage = `Regional autonomy granted! ${targetFaction.name} accepted self-governing provincial status under the sovereign national constitution.`;
        rejectionReason = `${targetFaction.name} rejected regional autonomy: "Autonomy is insufficient; we demand full sovereign secession or national control."`;
        break;

      case 'DEMAND_SURRENDER':
        threshold = 74;
        actionTitle = 'Unconditional Capitulation & Surrender';
        governanceType = 'UNIFIED_REPUBLIC';
        successMessage = `${targetFaction.name} has laid down arms and signed unconditional surrender documents! Hostile forces are demobilized.`;
        rejectionReason = `${targetFaction.name} Supreme Command fiercely rejected surrender: "Our forces will fight to the last man. You lack the decisive dominance to demand our capitulation!" (Requires >= 75 acceptance score)`;
        break;

      case 'ACCEPT_SURRENDER':
      case 'INTEGRATE_FACTION':
        threshold = 60;
        actionTitle = 'Faction Integration & Demobilization Protocol';
        governanceType = 'UNIFIED_REPUBLIC';
        successMessage = `Peaceful disarmament achieved! Militias from ${targetFaction.name} have disarmed and integrated into national civic reconstruction.`;
        rejectionReason = `${targetFaction.name} refuses integration into state security: "Our units will not submit to disarmament without federal guarantees."`;
        break;
    }

    const accepted = calculation.baseWillingness >= threshold;

    if (accepted) {
      playSound('win');
      const agreement: PeaceAgreement = {
        type: action,
        title: actionTitle,
        signatories: [playerFaction.name, targetFaction.name, 'United Nations Observers'],
        targetFactionId: selectedTargetFactionId,
        date: `Turn ${turnNumber} · 2026`,
        terms: [
          `Immediate cessation of all armed hostilities across ${countryName}.`,
          `Demobilization of irregular militias and restoration of civilian legal order.`,
          `Transfer of administrative authority and regional garrisons.`,
          governanceType === 'TRANSITIONAL_COALITION' 
            ? 'Establishment of a multi-party Transitional Coalition Cabinet.'
            : governanceType === 'FEDERAL_AUTONOMY'
            ? 'Granting of autonomous provincial governance status within the republic.'
            : 'Unification of all sovereign administrative territories under constitutional democracy.'
        ],
        territoryTransferred: targetFaction.controlledRegions,
        manpowerIntegrated: Math.round(targetStats.totalManpower * 0.45),
        treasuryTransfer: 150000000,
        postWarGovernance: governanceType
      };

      setActiveProposal({
        action,
        status: 'ACCEPTED',
        explanation: successMessage,
        agreement
      });

      setNegotiationLog(prev => [
        `✅ SUCCESS: ${actionTitle} officially ratified! ${successMessage}`,
        ...prev
      ]);
    } else {
      playSound('error');
      setActiveProposal({
        action,
        status: 'REJECTED',
        explanation: `${rejectionReason} (Current score: ${calculation.baseWillingness}/100, needed: ${threshold}/100)`
      });

      setNegotiationLog(prev => [
        `❌ FAILED: ${targetFaction.name} rejected ${actionTitle}. ${rejectionReason}`,
        ...prev
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-100 uppercase tracking-tight">
                  Peace & Strategic Settlement Conference
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {countryName}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Negotiate ceasefires, autonomy, power-sharing agreements, or demand capitulation based on territorial control and combat momentum.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* Target Faction Selector */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Negotiate with Opposing Faction:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {factions.filter(f => f.id !== playerFactionId).map(f => {
                const hasPeace = peaceSignatoryFactionIds.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedTargetFactionId(f.id);
                      setActiveProposal(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedTargetFactionId === f.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : hasPeace
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    <span>{f.name}</span>
                    {hasPeace && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        🕊️ Peace Signed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strategic Assessment Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Territory Control */}
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Territory Comparison</div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 font-bold">{playerFaction.name}: {playerTerritoryPercent}%</span>
                <span className="text-red-400 font-bold">{calculation.targetTerritoryPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden flex">
                <div style={{ width: `${playerTerritoryPercent}%` }} className="bg-blue-500 h-full" />
                <div style={{ width: `${calculation.targetTerritoryPercent}%` }} className="bg-red-500 h-full" />
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Score Impact: <span className="font-mono text-amber-300 font-bold">+{calculation.territoryScore} pts</span>
              </div>
            </div>

            {/* Military Dispositions */}
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Combat Strength Ratio</div>
              <div className="text-xs text-slate-300 font-mono space-y-0.5">
                <div className="flex justify-between">
                  <span>Enemy Divs:</span> <span className="text-slate-100 font-bold">{targetStats.divisionsRemaining}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enemy Losses:</span> <span className="text-rose-400 font-bold">{targetStats.cumulativeLosses.toLocaleString()} KIA</span>
                </div>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Fatigue/Ratio: <span className="font-mono text-emerald-300 font-bold">+{calculation.militaryScore + calculation.targetExhaustion} pts</span>
              </div>
            </div>

            {/* Total Settlement Willingness Index */}
            <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-800/40 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-teal-400">Peace Willingness Index</div>
                <div className="text-xl font-black font-mono text-teal-300 mt-1">
                  {calculation.baseWillingness} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
              </div>
              <div className="text-[10px] text-teal-400/80">
                {calculation.baseWillingness >= 75 
                  ? 'Enemy forces in crisis: willing to capitulate or surrender.'
                  : calculation.baseWillingness >= 50
                  ? 'Favorable window: open to power sharing or peace treaty.'
                  : 'Hostile defiance: will reject unilateral demands.'}
              </div>
            </div>
          </div>

          {/* Available Diplomatic Actions */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Peace Proposals & Diplomatic Levers</span>
              <span className="text-[10px] text-slate-500 font-mono font-normal">Select an action to submit terms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Request International Mediation */}
              <button
                onClick={() => handleExecuteAction('INTERNATIONAL_MEDIATION')}
                disabled={hasRequestedMediation}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  hasRequestedMediation
                    ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                    : 'bg-slate-950/60 hover:bg-slate-800 border-cyan-800/40 hover:border-cyan-500'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {hasRequestedMediation ? '✓ UN Mediation Active (+18)' : 'Request International Mediation'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Invites UN/regional envoys to mediate, granting +18 bonus to all settlement chances.
                  </div>
                </div>
              </button>

              {/* 2. Ceasefire */}
              <button
                onClick={() => handleExecuteAction('CEASEFIRE')}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 text-left transition-all cursor-pointer flex items-start gap-2.5"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Offer Frontline Ceasefire</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Temporarily halt hostile combat. Requires basic fatigue (Needed: 40 pts).
                  </div>
                </div>
              </button>

              {/* 3. Power-Sharing Agreement */}
              <button
                onClick={() => handleExecuteAction('POWER_SHARING')}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 text-left transition-all cursor-pointer flex items-start gap-2.5"
              >
                <Scale className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Sign Power-Sharing Agreement</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Form transitional coalition government dividing cabinet seats (Needed: 48 pts).
                  </div>
                </div>
              </button>

              {/* 4. Regional Autonomy */}
              <button
                onClick={() => handleExecuteAction('REGIONAL_AUTONOMY')}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer flex items-start gap-2.5"
              >
                <Building className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Grant Regional Autonomy</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Grant federal self-governance in exchange for disarmament & unity (Needed: 44 pts).
                  </div>
                </div>
              </button>

              {/* 5. Negotiate Comprehensive Peace */}
              <button
                onClick={() => handleExecuteAction('NEGOTIATE_PEACE')}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-teal-500 text-left transition-all cursor-pointer flex items-start gap-2.5"
              >
                <FileText className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Negotiate Peace Treaty</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Comprehensive settlement restoring national sovereignty & elections (Needed: 55 pts).
                  </div>
                </div>
              </button>

              {/* 6. Demand Surrender */}
              <button
                onClick={() => handleExecuteAction('DEMAND_SURRENDER')}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 text-left transition-all cursor-pointer flex items-start gap-2.5"
              >
                <Flag className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Demand Unconditional Surrender</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Demand enemy lay down arms and surrender all held sectors (Needed: 74 pts).
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Active Proposal Result Banner */}
          {activeProposal && (
            <div className={`p-4 rounded-xl border ${
              activeProposal.status === 'ACCEPTED'
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {activeProposal.status === 'ACCEPTED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span>{activeProposal.status === 'ACCEPTED' ? 'PEACE PROPOSAL ACCEPTED' : 'PROPOSAL REJECTED'}</span>
              </div>
              <p className="text-xs mb-3">{activeProposal.explanation}</p>

              {activeProposal.status === 'ACCEPTED' && activeProposal.agreement && (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-800/60 space-y-2">
                  <div className="font-bold text-xs text-slate-100 flex items-center justify-between">
                    <span>{activeProposal.agreement.title}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">RATIFIED</span>
                  </div>
                  <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-1">
                    {activeProposal.agreement.terms.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (activeProposal.agreement) {
                          onSettlementReached(activeProposal.agreement);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ratify Agreement & Restore Constitutional Sovereignty</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Negotiation Log */}
          {negotiationLog.length > 0 && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 max-h-32 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300 mb-1">Diplomatic Negotiation Wire:</div>
              {negotiationLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[10px]">
            Turn {turnNumber} · UN Security Council Session in Progress
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
