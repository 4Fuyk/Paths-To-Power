/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party, Delegate, SpeechChoice } from '../types';
import { generateName } from '../constants/countries';
import { playSound } from '../lib/sounds';
import { 
  Users, Award, Gift, Megaphone, ShieldAlert, CheckCircle, 
  Sparkles, Coffee, Key, BarChart3, TrendingUp, Radio,
  Vote, Flag, Shield, Landmark, Scale, FileText, Target
} from 'lucide-react';

interface CongressViewProps {
  country: Country;
  party: Party;
  onUpdateParty: (updatedParty: Party) => void;
  onSpendTurn: () => void;
  darkMode: boolean;
  isJuniorMember?: boolean;
  onWinLeadership?: () => void;
}

export interface PartyDirective {
  id: string;
  name: string;
  icon: string;
  description: string;
  buffDescription: string;
  cost: number;
}

export const NATIONAL_PARTY_DIRECTIVES: PartyDirective[] = [
  {
    id: 'dir_liberties',
    name: 'Civic Freedoms & Constitutional Renewal',
    icon: '🏛️',
    description: 'Mandate strict protections for independent press, democratic oversight, and universal civil rights.',
    buffDescription: '+15 Freedom Index, +15% youth and liberal voter enthusiasm, +10 Political Influence.',
    cost: 45000
  },
  {
    id: 'dir_industry',
    name: 'National Industrial & Sovereign Reinvestment',
    icon: '📈',
    description: 'Direct party apparatus toward regional development, heavy industrial output, and small enterprise grants.',
    buffDescription: '+20% grassroots fundraising yield, +12% working-class and shopkeeper polling support.',
    cost: 50000
  },
  {
    id: 'dir_defense',
    name: 'Border Fortification & Defense Readiness',
    icon: '🛡️',
    description: 'Adopt an uncompromising defense readiness platform, expanding territorial protection and veteran benefits.',
    buffDescription: '+20 Military Stability, -15 Civil War Risk, +15% nationalist voter loyalty.',
    cost: 55000
  },
  {
    id: 'dir_welfare',
    name: 'Universal Welfare & Social Safety Accord',
    icon: '🤝',
    description: 'Ratify comprehensive healthcare protections, pensions, and agricultural subsidies.',
    buffDescription: '+15% working-class voter loyalty, +10% senior turnout, lower domestic social friction.',
    cost: 40000
  }
];

export const CongressView: React.FC<CongressViewProps> = ({
  country,
  party,
  onUpdateParty,
  onSpendTurn,
  darkMode,
  isJuniorMember = false,
  onWinLeadership,
}) => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);
  const [congressSpeechStatus, setCongressSpeechStatus] = useState<string | null>(null);
  const [modalAlert, setModalAlert] = useState<{ title: string; message: string; type: 'success' | 'warning' | 'info' } | null>(null);
  
  // Party Congress Enhanced Strategic States
  const [activeDirectiveId, setActiveDirectiveId] = useState<string | null>(null);
  const [hasHeldConfidenceVote, setHasHeldConfidenceVote] = useState<boolean>(false);
  const [confidenceVoteResult, setConfidenceVoteResult] = useState<{ passed: boolean; percentage: number; message: string } | null>(null);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);

  const getEnglishFaction = (fac: Delegate['faction']): string => {
    if (fac === 'Traditionalist' || fac === 'Gelenekçi') return 'Traditionalist';
    if (fac === 'Reformist' || fac === 'Yenilikçi') return 'Reformist';
    return 'Centrist';
  };

  const showAlert = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setModalAlert({ title, message, type });
  };

  // Helper to determine currency symbol based on country ID
  const getCurrency = (countryId: string) => {
    if (countryId === 'US') return '$';
    if (countryId === 'TR') return '₺';
    if (countryId === 'DE') return '€';
    if (countryId === 'GB') return '£';
    if (countryId === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrency(country.id);

  // Generate 8 local delegates dynamically on mount if not loaded
  useEffect(() => {
    const factions: Delegate['faction'][] = ['Traditionalist', 'Reformist', 'Centrist'];
    const demandsPool = [
      'Demands a more passionate stance during public election rallies.',
      'Wants legislative bills carrying civil liberties and constitutional rights approved.',
      'Demands vigorous budgetary allocations for sovereign military defense.',
      'Seeks strict financial transparency in internal party budgeting.',
      'Demands youth wing representation on the Central Executive Board.',
      'Wants targeted stimulus programs aiding regional merchants and farmers.',
      'Calls for uncompromising anti-corruption audits in state administration.',
      'Requests increased investment in independent digital broadcast platforms.'
    ];

    const initialDelegates = Array.from({ length: 8 }).map((_, i) => {
      const name = generateName(country.id);
      const city = country.regions[i % country.regions.length]?.name || 'National HQ';
      const faction = factions[i % factions.length];
      const startLoyalty = 50 + party.traits.charisma * 4 + Math.floor(Math.random() * 16);

      return {
        id: `del_${i}`,
        name,
        city,
        faction,
        loyalty: Math.min(100, Math.max(15, startLoyalty)),
        demands: demandsPool[i % demandsPool.length]
      };
    });

    setDelegates(initialDelegates);
  }, [country, party.traits.charisma]);

  // Handle Delegate Loyalty Average
  const averageLoyalty = delegates.length > 0
    ? Math.round(delegates.reduce((acc, d) => acc + d.loyalty, 0) / delegates.length)
    : 50;

  // Delegate speeches choices pool
  const CONGRESS_SPEECH_OPTIONS = [
    {
      question: 'The Reformist faction demands updating the party charter with direct democratic feedback channels. However, Traditionalist delegates fear this will dilute the founding ideological core of the organization. What will you state from the podium?',
      choices: [
        {
          text: 'Time moves forward! We will completely modernize our platform to champion youth participation and progressive reforms.',
          impactText: 'Reformist delegate loyalty +28%; Traditionalists express discontent (-15%).',
          factionsAffected: { 'Reformist': 28, 'Traditionalist': -15, 'Centrist': 6 }
        },
        {
          text: 'We draw power from our heritage and founding principles. We will protect our ideological roots without compromise.',
          impactText: 'Traditionalist delegate loyalty +25%; Reformists criticize (-12%).',
          factionsAffected: { 'Traditionalist': 25, 'Reformist': -12, 'Centrist': 8 }
        },
        {
          text: 'We will govern from the principled center! We will protect our core identity while modernizing our outreach.',
          impactText: 'Balanced loyalty boost across all factions (+14%).',
          factionsAffected: { 'Centrist': 18, 'Reformist': 12, 'Traditionalist': 12 }
        }
      ]
    }
  ];

  const handleTriggerCongressSpeech = () => {
    playSound('click');
    setActiveSpeechIndex(0);
    setCongressSpeechStatus(null);
  };

  const handleSelectCongressSpeech = (choice: { text: string; factionsAffected: Record<string, number> }) => {
    const updated = delegates.map((del) => {
      const englishFaction = getEnglishFaction(del.faction);
      const modifier = choice.factionsAffected[englishFaction] || 0;
      return {
        ...del,
        loyalty: Math.min(100, Math.max(5, del.loyalty + modifier))
      };
    });
    setDelegates(updated);

    const updatedParty = { ...party, influence: party.influence + 12 };
    onUpdateParty(updatedParty);
    onSpendTurn();

    playSound('win');
    setCongressSpeechStatus(`Your address to the delegates received an enthusiastic standing ovation! Party cohesion strengthened. Gained +12 Political Influence.`);
  };

  // Host delegate unity gala
  const handleHostDinner = () => {
    const cost = 50000;
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', `You need at least ${cost.toLocaleString()} ${currency} to host a delegate unity gala.`, 'warning');
      return;
    }

    const updated = delegates.map((del) => {
      const engFac = getEnglishFaction(del.faction);
      if (engFac === 'Traditionalist' || engFac === 'Centrist') {
        return { ...del, loyalty: Math.min(100, del.loyalty + 18) };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, budget: party.budget - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Unity Gala Hosted', 'Traditionalist and Centrist delegates were warmly engaged (+18% Loyalty).', 'success');
  };

  // Empower youth branches
  const handleEmpowerYouth = () => {
    const cost = 30000;
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', `You need at least ${cost.toLocaleString()} ${currency} for youth branch grants.`, 'warning');
      return;
    }

    const updated = delegates.map((del) => {
      const engFac = getEnglishFaction(del.faction);
      if (engFac === 'Reformist') {
        return { ...del, loyalty: Math.min(100, del.loyalty + 25) };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, budget: party.budget - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Youth Grants Dispatched', 'Technological and grassroots funds distributed. Reformist delegate trust surged (+25% Loyalty).', 'success');
  };

  // Appoint to executive committee
  const handleBackroomDeals = () => {
    const cost = 20;
    if (party.influence < cost) {
      playSound('error');
      showAlert('Insufficient Influence', `You need at least ${cost} political influence points for executive appointments.`, 'warning');
      return;
    }

    const sorted = [...delegates].sort((a, b) => a.loyalty - b.loyalty);
    if (sorted.length === 0) return;

    const lowestId = sorted[0].id;
    const updated = delegates.map((del) => {
      if (del.id === lowestId) {
        return { ...del, loyalty: 90 };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, influence: party.influence - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Executive Appointment Ratified', `Secured alliance with delegate ${sorted[0].name}. Appointed to Party High Board (Loyalty set to 90%).`, 'success');
  };

  // Ratify National Party Directive
  const handleAdoptDirective = (directive: PartyDirective) => {
    if (party.budget < directive.cost) {
      playSound('error');
      showAlert('Insufficient Funds', `You need ${(directive.cost ?? 0).toLocaleString()} ${currency} to ratify this national directive.`, 'warning');
      return;
    }

    setActiveDirectiveId(directive.id);
    onUpdateParty({
      ...party,
      budget: party.budget - directive.cost,
      influence: party.influence + 15
    });
    onSpendTurn();
    playSound('win');
    showAlert(
      'National Directive Ratified',
      `"${directive.name}" has been officially passed by the congress! ${directive.buffDescription}`,
      'success'
    );
  };

  // Call Confidence Vote
  const handleCallConfidenceVote = () => {
    playSound('click');
    const passed = averageLoyalty >= 60;
    const percentage = averageLoyalty;
    
    if (passed) {
      playSound('win');
      setConfidenceVoteResult({
        passed: true,
        percentage,
        message: `SUPREME PARTY MANDATE GRANTED! With ${percentage}% delegate approval, your leadership has been unconditionally confirmed. Campaign costs discounted by 25% and national voter confidence surged!`
      });
      onUpdateParty({
        ...party,
        influence: party.influence + 25
      });
    } else {
      playSound('error');
      setConfidenceVoteResult({
        passed: false,
        percentage,
        message: `CONFIDENCE VOTE CONTESTED: Only ${percentage}% of delegates supported the motion. Factional friction remains high. Strengthen delegate relations before proceeding!`
      });
    }
    setHasHeldConfidenceVote(true);
    onSpendTurn();
  };

  // Charter Upgrades Buy actions
  const handleBuyUpgrade = (upgradeId: string, cost: number, tName: string) => {
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', `You need at least ${cost.toLocaleString()} ${currency} for charter reform.`, 'warning');
      return;
    }

    const updatedTraits = { ...party.traits };
    if (upgradeId === 'charter_hitabet') {
      updatedTraits.eloquence = Math.min(10, party.traits.eloquence + 1);
    } else if (upgradeId === 'charter_charisma') {
      updatedTraits.charisma = Math.min(10, party.traits.charisma + 1);
    } else if (upgradeId === 'charter_org') {
      updatedTraits.organization = Math.min(10, party.traits.organization + 1);
    } else if (upgradeId === 'charter_strat') {
      updatedTraits.strategy = Math.min(10, party.traits.strategy + 1);
    }

    const updatedParty = {
      ...party,
      budget: party.budget - cost,
      traits: updatedTraits
    };

    onUpdateParty(updatedParty);
    setPurchasedUpgrades([...purchasedUpgrades, upgradeId]);
    playSound('success');
    showAlert('Charter Approved', `"${tName}" reform approved! Leadership traits permanently upgraded.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Junior Member Leadership Challenge Header */}
      {isJuniorMember && (
        <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
          darkMode ? 'bg-indigo-950/25 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">👑</span>
            <div>
              <h3 className="text-sm font-black tracking-tight text-indigo-400 uppercase">JUNIOR MEMBER LEADERSHIP CHALLENGE</h3>
              <p className="text-xs text-slate-300 mt-1">
                You are currently a junior deputy of <strong>{party.name}</strong>. You must secure at least <strong>50%</strong> delegate loyalty to call an extraordinary party congress and assume the national chairmanship.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {averageLoyalty >= 50 ? (
              <button
                id="claim-leadership-btn"
                type="button"
                onClick={() => {
                  if (onWinLeadership) onWinLeadership();
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs cursor-pointer shadow-lg transition-all transform hover:scale-105"
              >
                💥 TRIGGER EXTRAORDINARY CONGRESS! ({averageLoyalty}% Loyalty)
              </button>
            ) : (
              <div className="px-5 py-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-slate-400 font-bold">
                🔒 {averageLoyalty}% / 50% Loyalty Required
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP STRATEGIC BANNER: Supreme Mandate & Directives */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-500/10">
          <div>
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black uppercase tracking-tight">
                Supreme Party Congress & National Platform
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pass official national directives, manage factional delegates, and call confidence votes to secure electoral momentum.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCallConfidenceVote}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                averageLoyalty >= 60
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Call Confidence Vote ({averageLoyalty}%)</span>
            </button>
          </div>
        </div>

        {/* Confidence Vote Notification */}
        {confidenceVoteResult && (
          <div className={`mt-4 p-4 rounded-2xl border flex items-start gap-3 ${
            confidenceVoteResult.passed
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <span className="text-2xl">{confidenceVoteResult.passed ? '🏆' : '⚠️'}</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {confidenceVoteResult.passed ? 'Supreme Mandate Confirmed' : 'Confidence Vote Contested'}
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed">{confidenceVoteResult.message}</p>
            </div>
          </div>
        )}

        {/* 4 NATIONAL DIRECTIVES */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-indigo-400" /> Ratify National Party Directive
            </h4>
            <span className="text-[10px] font-mono text-slate-500">1 Directive Active at a time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {NATIONAL_PARTY_DIRECTIVES.map((dir) => {
              const isActive = activeDirectiveId === dir.id;
              return (
                <div
                  key={dir.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                      : darkMode
                      ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{dir.icon}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold mt-2 text-slate-100">{dir.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{dir.description}</p>
                  </div>

                  <div className="space-y-2 border-t border-slate-500/10 pt-2">
                    <div className="text-[10px] text-indigo-300 font-medium">{dir.buffDescription}</div>
                    <button
                      onClick={() => handleAdoptDirective(dir)}
                      disabled={isActive}
                      className={`w-full py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      }`}
                    >
                      {isActive ? 'Current Directive' : `Adopt: ${(dir.cost ?? 0).toLocaleString()} ${currency}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Delegates Directory */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-500/10">
              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" /> Party Congress Delegates ({delegates.length})
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Regional representatives who decide leadership and platform motions.</p>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-mono">CONCORD SCORE</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`text-base font-extrabold font-mono ${
                    averageLoyalty >= 70 ? 'text-emerald-400' : averageLoyalty >= 45 ? 'text-amber-400' : 'text-rose-500'
                  }`}>
                    {averageLoyalty}% Loyalty
                  </div>
                </div>
              </div>
            </div>

            {/* List delegates as grid cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[380px] overflow-y-auto pr-1">
              {delegates.map((del) => (
                <div
                  key={del.id}
                  className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all relative overflow-hidden ${
                    darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{del.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{del.city} Assembly</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      del.faction === 'Gelenekçi'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : del.faction === 'Yenilikçi'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {getEnglishFaction(del.faction)}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed italic pr-2 mt-1">
                    "{del.demands}"
                  </p>

                  <div className="space-y-1 mt-2 border-t border-slate-500/10 pt-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Trust Level:</span>
                      <span className={`font-bold ${
                        del.loyalty >= 75 ? 'text-emerald-400' : del.loyalty >= 45 ? 'text-amber-400' : 'text-rose-500'
                      }`}>{del.loyalty}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          del.loyalty >= 75 ? 'bg-emerald-400' : del.loyalty >= 45 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ width: `${del.loyalty}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {averageLoyalty < 45 && (
              <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2 text-rose-300">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold">Critical Confidence Vote Risk!</h5>
                  <p className="text-[10px] leading-relaxed mt-0.5">
                    Delegate loyalty fell below 45%. Consolidate party factions before election day to prevent internal fractures.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lobbying actions & upgrade charter reforms */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className={`p-5 rounded-3xl border flex flex-col gap-3 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="pb-2 border-b border-slate-500/10">
              <h3 className="text-sm font-bold tracking-tight">Faction Lobbying & Podium Actions</h3>
              <p className="text-[10px] text-slate-400">Resolve factional disputes and generate Political Influence.</p>
            </div>

            {!activeSpeechIndex ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="congress-speech-btn"
                  type="button"
                  onClick={handleTriggerCongressSpeech}
                  className="p-3.5 bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 text-left rounded-2xl transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <Radio className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold mt-1">Deliver Keynote Address</span>
                  <span className="text-[10px] text-slate-400 leading-tight">Debate platform issues. Awards +12 Influence.</span>
                </button>

                <button
                  id="congress-dinner-btn"
                  type="button"
                  onClick={handleHostDinner}
                  className="p-3.5 bg-slate-800 border border-amber-500/30 hover:border-amber-500 text-left rounded-2xl transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold mt-1">Host Unity Gala</span>
                  <span className="text-[10px] text-slate-400 leading-tight">Cost: {(50000).toLocaleString()} {currency} (+18% Traditionalist & Centrist Loyalty).</span>
                </button>

                <button
                  id="congress-youth-btn"
                  type="button"
                  onClick={handleEmpowerYouth}
                  className="p-3.5 bg-slate-800 border border-cyan-500/30 hover:border-cyan-500 text-left rounded-2xl transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold mt-1">Empower Youth Chapters</span>
                  <span className="text-[10px] text-slate-400 leading-tight">Cost: {(30000).toLocaleString()} {currency} (+25% Reformist Loyalty).</span>
                </button>

                <button
                  id="congress-backroom-btn"
                  type="button"
                  onClick={handleBackroomDeals}
                  className="p-3.5 bg-slate-800 border border-rose-500/30 hover:border-rose-500 text-left rounded-2xl transition-all flex flex-col gap-1 cursor-pointer"
                >
                  <Key className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-bold mt-1">Executive Board Seat</span>
                  <span className="text-[10px] text-rose-400 leading-tight font-mono font-bold">Cost: 20 Influence (Locks lowest delegate to 90%).</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📢</span>
                  <h4 className="text-xs font-black text-indigo-400 uppercase">PODIUM DEBATE TOPIC</h4>
                </div>

                {!congressSpeechStatus ? (
                  <>
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded-xl border border-slate-800">
                      "{CONGRESS_SPEECH_OPTIONS[0].question}"
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      {CONGRESS_SPEECH_OPTIONS[0].choices.map((choice, i) => (
                        <button
                          id={`del-choice-${i}`}
                          key={i}
                          type="button"
                          onClick={() => handleSelectCongressSpeech(choice)}
                          className="text-left text-[11px] p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all font-semibold cursor-pointer"
                        >
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-200 mt-2 font-semibold">
                      {congressSpeechStatus}
                    </p>
                    <button
                      id="close-congress-speech-btn"
                      onClick={() => {
                        setActiveSpeechIndex(null);
                        setCongressSpeechStatus(null);
                      }}
                      className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Conclude Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Permanent Charter Reforms */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="pb-2 border-b border-slate-500/10">
              <h3 className="text-sm font-bold tracking-tight">Permanent Constitutional Charter Reforms</h3>
              <p className="text-[10px] text-slate-400">Upgrade core leadership capabilities permanently through party charter amendments.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-2 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="text-amber-400">📢</span> Eloquence Reform
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Amplifies campaign speech charisma and media multiplier effects.
                  </p>
                </div>
                <button
                  id="upgrade-hitabet-btn"
                  type="button"
                  disabled={party.traits.eloquence >= 10 || purchasedUpgrades.includes('charter_hitabet')}
                  onClick={() => handleBuyUpgrade('charter_hitabet', 180000, 'Eloquence Reform')}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold mt-2 text-center transition-all ${
                    purchasedUpgrades.includes('charter_hitabet')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  {purchasedUpgrades.includes('charter_hitabet') ? 'APPROVED' : `Ratify: 180,000 ${currency}`}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-2 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="text-rose-400">♥</span> Charisma Reform
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Elevates baseline popularity and voter attraction across all demographics.
                  </p>
                </div>
                <button
                  id="upgrade-charisma-btn"
                  type="button"
                  disabled={party.traits.charisma >= 10 || purchasedUpgrades.includes('charter_charisma')}
                  onClick={() => handleBuyUpgrade('charter_charisma', 210000, 'Charisma Reform')}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold mt-2 text-center transition-all ${
                    purchasedUpgrades.includes('charter_charisma')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  {purchasedUpgrades.includes('charter_charisma') ? 'APPROVED' : `Ratify: 210,000 ${currency}`}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-2 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="text-emerald-400">👥</span> Grassroots Reform
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Streamlines volunteer operations and cuts headquarters opening costs.
                  </p>
                </div>
                <button
                  id="upgrade-org-btn"
                  type="button"
                  disabled={party.traits.organization >= 10 || purchasedUpgrades.includes('charter_org')}
                  onClick={() => handleBuyUpgrade('charter_org', 160000, 'Grassroots Reform')}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold mt-2 text-center transition-all ${
                    purchasedUpgrades.includes('charter_org')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  {purchasedUpgrades.includes('charter_org') ? 'APPROVED' : `Ratify: 160,000 ${currency}`}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-2 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="text-cyan-400">♟</span> Strategy Reform
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Optimizes coalition bargaining and lowers legislative lobbying friction.
                  </p>
                </div>
                <button
                  id="upgrade-strategy-btn"
                  type="button"
                  disabled={party.traits.strategy >= 10 || purchasedUpgrades.includes('charter_strat')}
                  onClick={() => handleBuyUpgrade('charter_strat', 150000, 'Strategy Reform')}
                  className={`w-full py-2 rounded-xl text-[10px] font-bold mt-2 text-center transition-all ${
                    purchasedUpgrades.includes('charter_strat')
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  {purchasedUpgrades.includes('charter_strat') ? 'APPROVED' : `Ratify: 150,000 ${currency}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalAlert && (
        <div className="fixed inset-0 z-[110] h-full w-full bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col gap-3 shadow-xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                {modalAlert.type === 'success' && <span className="text-emerald-400">✓</span>}
                {modalAlert.type === 'warning' && <span className="text-rose-500">⚠</span>}
                {modalAlert.type === 'info' && <span className="text-blue-400">ℹ</span>}
                {modalAlert.title}
              </h4>
            </div>
            <p className={`text-xs leading-relaxed py-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{modalAlert.message}</p>
            <button
              onClick={() => setModalAlert(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer mt-2 text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
