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
  Sparkles, Coffee, Key, BarChart3, TrendingUp, Radio 
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

  const getEnglishFaction = (fac: Delegate['faction']): string => {
    if (fac === 'Gelenekçi') return 'Traditionalist';
    if (fac === 'Yenilikçi') return 'Reformist';
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

  // Generate 6 local delegates dynamically on mount if not loaded
  useEffect(() => {
    const factions: Delegate['faction'][] = ['Gelenekçi', 'Yenilikçi', 'Merkezci'];
    const demandsPool = [
      'Demands a more passionate attitude during rallies.',
      'Wants legislative bills carrying civil liberties approved.',
      'Demands vigorous support for indigenous military defence budgets.',
      'Seeks financial transparency in internal party budgeting.',
      'Asks for placing reformist voices in youth branches.',
      'Wants specific economic programs aiding rural merchants.'
    ];

    const initialDelegates = Array.from({ length: 6 }).map((_, i) => {
      const name = generateName(country.id);
      const city = country.regions[i % country.regions.length]?.name || 'HQ';
      const faction = factions[i % factions.length];
      // Charisma of player boosts delegate starting loyalty
      const startLoyalty = 45 + party.traits.charisma * 4 + Math.floor(Math.random() * 15);

      return {
        id: `del_${i}`,
        name,
        city,
        faction,
        loyalty: Math.min(100, Math.max(10, startLoyalty)),
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
      question: 'The Reformist faction demands updating the party charter with democratic and digital-first participation channels. However, Traditionalist delegates fear this will disrupt the native core of the organization. What will you state from the podium?',
      choices: [
        {
          text: 'Time goes forward! We will completely modernize the charter according to the youth and digital era.',
          impactText: 'Reformist delegate loyalty increased by 30%; Traditionalists are unhappy.',
          factionsAffected: { 'Reformist': 30, 'Traditionalist': -18, 'Centrist': 5 }
        },
        {
          text: 'We draw power from our roots. We will implement mini-reforms without shaking our traditional core.',
          impactText: 'Traditionalist delegate loyalty increased by 25%; Reformists criticize.',
          factionsAffected: { 'Traditionalist': 25, 'Reformist': -15, 'Centrist': 8 }
        },
        {
          text: 'We will meet in the compromise middle! We will guard our traditions while introducing digital feedback loops.',
          impactText: 'Mild +15 loyalty boost for Centrists and all factions.',
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
    // Apply loyalty changes
    const updated = delegates.map((del) => {
      const englishFaction = getEnglishFaction(del.faction);
      const modifier = choice.factionsAffected[englishFaction] || 0;
      return {
        ...del,
        loyalty: Math.min(100, Math.max(5, del.loyalty + modifier))
      };
    });
    setDelegates(updated);

    // Update Party state
    const updatedParty = { ...party, influence: party.influence + 8 };
    onUpdateParty(updatedParty);

    // Spent turn
    onSpendTurn();

    // Show report
    playSound('win');
    setCongressSpeechStatus(`Your historic speech was received with great applause. Party unity strengthened! Obtained +8 Political Influence.`);
  };

  // Luxury dinner function (-$50k, boosts traditionalist and centralists loyalty +16)
  const handleHostDinner = () => {
    const cost = 50000;
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' to host a unity dinner.', 'warning');
      return;
    }

    const updated = delegates.map((del) => {
      const engFac = getEnglishFaction(del.faction);
      if (engFac === 'Traditionalist' || engFac === 'Centrist') {
        return { ...del, loyalty: Math.min(100, del.loyalty + 16) };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, budget: party.budget - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Unity Dinner Hosted', 'Bond strengthened with Traditionalist and Centrist delegates (+16% Loyalty).', 'success');
  };

  // Empower youth branches (-$30k, boosts reformists loyalty +22)
  const handleEmpowerYouth = () => {
    const cost = 30000;
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' for youth grants.', 'warning');
      return;
    }

    const updated = delegates.map((del) => {
      const engFac = getEnglishFaction(del.faction);
      if (engFac === 'Reformist') {
        return { ...del, loyalty: Math.min(100, del.loyalty + 22) };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, budget: party.budget - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Youth Grants Sent', 'Technological grants sent to Youth Front. Reformist delegate loyalty skyrocketed (+22% Loyalty).', 'success');
  };

  // Backroom deal / appoint board members (-22 Nüfuz, raises lowest delegate to 85)
  const handleBackroomDeals = () => {
    const cost = 22;
    if (party.influence < cost) {
      playSound('error');
      showAlert('Insufficient Political Influence', 'You need at least ' + cost + ' influence points to handle backroom agreements.', 'warning');
      return;
    }

    // Sort delegates to find lowest loyalty
    const sorted = [...delegates].sort((a, b) => a.loyalty - b.loyalty);
    if (sorted.length === 0) return;

    const lowestId = sorted[0].id;
    const updated = delegates.map((del) => {
      if (del.id === lowestId) {
        return { ...del, loyalty: 85 };
      }
      return del;
    });

    setDelegates(updated);
    onUpdateParty({ ...party, influence: party.influence - cost });
    onSpendTurn();
    playSound('success');
    showAlert('Backroom Deal Secured', `Reached deep agreement with dissatisfied delegate ${sorted[0].name}. Appointed them to internal committees. Loyalty set to 85%.`, 'success');
  };

  // Charter Upgrades Buy actions
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);

  const handleBuyUpgrade = (upgradeId: string, cost: number, tName: string) => {
    if (party.budget < cost) {
      playSound('error');
      showAlert('Insufficient Budget', 'You need at least ' + cost.toLocaleString() + ' ' + currency + ' for charter upgrade.', 'warning');
      return;
    }

    let updatedTraits = { ...party.traits };
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
    showAlert('Charter Approved', `"${tName}" reform approved! Leadership stats permanently upgraded.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {isJuniorMember && (
        <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
          darkMode ? 'bg-indigo-950/25 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">👑</span>
            <div>
              <h3 className="text-sm font-black tracking-tight text-indigo-400">JUNIOR MEMBER CONGRESS CHALLENGE</h3>
              <p className="text-xs text-slate-300 mt-1">
                You are currently a junior member of <strong>{party.name}</strong>. You must secure at least <strong>50%</strong> delegate loyalty to call an extraordinary congress and claim the party leadership.
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
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs cursor-pointer shadow-lg hover:from-indigo-500 hover:to-violet-500 transition-all transform hover:scale-105"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full py-2">
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
              <p className="text-[10px] text-slate-400 mt-0.5">The delegates who will determine the fate of your party leadership.</p>
            </div>

            {/* Loyalty indicator meter */}
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-mono">CONGRESS CONCORD</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`text-base font-extrabold font-mono ${
                  averageLoyalty >= 70 ? 'text-emerald-400' : averageLoyalty >= 45 ? 'text-amber-400' : 'text-rose-500'
                }`}>
                  {averageLoyalty}% Loyalty
                </div>
              </div>
            </div>
          </div>

          {/* List delegeles as grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[360px] overflow-y-auto pr-1">
            {delegates.map((del) => (
              <div
                key={del.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all relative overflow-hidden ${
                  darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* Visual back glow */}
                <div className="absolute right-0 bottom-0 opacity-[0.03] select-none text-[80px] font-bold font-mono">
                  {del.faction === 'Gelenekçi' ? 'T' : del.faction === 'Yenilikçi' ? 'R' : 'C'}
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{del.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{del.city} Delegate Assembly</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    del.faction === 'Gelenekçi'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : del.faction === 'Yenilikçi'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {del.faction === 'Gelenekçi' ? 'Traditionalist' : del.faction === 'Yenilikçi' ? 'Reformist' : 'Centrist'}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed italic pr-2 mt-1">
                  "{del.demands}"
                </p>

                {/* Individual loyalty progress line */}
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

          {/* Delegate warning warning info if low loyalty aggregate */}
          {averageLoyalty < 45 && (
            <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2 text-rose-300">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <h5 className="text-xs font-bold font-sans">Critical Confidence Vote Risk!</h5>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Aggregate delegate trust fell below the critical safe threshold (45%). You must consolidate delegate support before election day, or risk facing an internal party coup.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lobbying actions & upgrade charter reforms */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        {/* Quick lobbying activities */}
        <div className={`p-5 rounded-3xl border flex flex-col gap-3 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="pb-2 border-b border-slate-500/10">
            <h3 className="text-sm font-bold tracking-tight">Lobbying & Delegation Activities</h3>
            <p className="text-[10px] text-slate-400">Restore delegate loyalty and secure your leadership status.</p>
          </div>

          {!activeSpeechIndex ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Act 1: Speech speech */}
              <button
                id="congress-speech-btn"
                type="button"
                onClick={handleTriggerCongressSpeech}
                className="p-3 bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 text-left rounded-xl transition-all flex flex-col gap-1 cursor-pointer"
              >
                <Radio className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold mt-1">Deliver Podium Speech</span>
                <span className="text-[9px] text-slate-400 leading-tight">Debate topic. Restores/generates Political Influence.</span>
              </button>

              {/* Act 2: luxury dinners */}
              <button
                id="congress-dinner-btn"
                type="button"
                onClick={handleHostDinner}
                className="p-3 bg-gradient-to-br from-amber-950/20 to-slate-900 border border-amber-500/30 hover:border-amber-500 text-left rounded-xl transition-all flex flex-col gap-1 cursor-pointer"
              >
                <Coffee className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold mt-1">Host Unity Dinner</span>
                <span className="text-[9px] text-slate-400 leading-tight">Cost: {(50000).toLocaleString()} {currency}</span>
                <span className="text-[9px] text-slate-400">+16 loyalty to Traditionalists & Centrists.</span>
              </button>

              {/* Act 3: empower youth */}
              <button
                id="congress-youth-btn"
                type="button"
                onClick={handleEmpowerYouth}
                className="p-3 bg-gradient-to-br from-cyan-950/20 to-slate-900 border border-cyan-500/30 hover:border-cyan-500 text-left rounded-xl transition-all flex flex-col gap-1 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold mt-1">Empower Youth Branch</span>
                <span className="text-[9px] text-slate-400 leading-tight">Cost: {(30000).toLocaleString()} {currency}</span>
                <span className="text-[9px] text-slate-400">+22 loyalty to Reformist delegates.</span>
              </button>

              {/* Act 4: backroom deal */}
              <button
                id="congress-backroom-btn"
                type="button"
                onClick={handleBackroomDeals}
                className="p-3 bg-gradient-to-br from-rose-950/20 to-slate-900 border border-rose-500/30 hover:border-rose-500 text-left rounded-xl transition-all flex flex-col gap-1 cursor-pointer"
              >
                <Key className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-bold mt-1">Appoint Committee Seat</span>
                <span className="text-[9px] text-rose-400 leading-tight font-mono font-bold">Cost: 22 Influence</span>
                <span className="text-[9px] text-slate-400">Locks most dissatisfied delegate to 85% loyalty.</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <h4 className="text-xs font-black text-indigo-400">PODIUM DISCUSSIONS TOPICS CARD</h4>
              </div>

              {!congressSpeechStatus ? (
                <>
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-905 p-3 rounded border border-slate-900">
                    "{CONGRESS_SPEECH_OPTIONS[0].question}"
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    {CONGRESS_SPEECH_OPTIONS[0].choices.map((choice, i) => (
                      <button
                        id={`del-choice-${i}`}
                        key={i}
                        type="button"
                        onClick={() => handleSelectCongressSpeech(choice)}
                        className="text-left text-[11px] p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all font-semibold"
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
                    className="mt-4 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Leave Podium / Continue
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
            <h3 className="text-sm font-bold tracking-tight">Permanent Charter Reforms</h3>
            <p className="text-[10px] text-slate-400">Upgrade your leadership characteristics permanently through deep constitutional changes in party structure.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Upgrade Hitabet */}
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/5 flex flex-col gap-2 justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="text-amber-400">📢</span> Eloquence Reform
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Boosts campaign enthusiasm, adding extra press speech multiplier benefits.
                </p>
              </div>
              <button
                id="upgrade-hitabet-btn"
                type="button"
                disabled={party.traits.eloquence >= 10 || purchasedUpgrades.includes('charter_hitabet')}
                onClick={() => handleBuyUpgrade('charter_hitabet', 180000, 'Eloquence Reform')}
                className={`w-full py-1.5 rounded text-[10px] font-bold mt-2 text-center transition-all ${
                  purchasedUpgrades.includes('charter_hitabet')
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer'
                }`}
              >
                {purchasedUpgrades.includes('charter_hitabet') ? 'APPROVED' : `Approve: 180,000 ${currency}`}
              </button>
            </div>

            {/* Upgrade Karizma */}
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/5 flex flex-col gap-2 justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="text-rose-400">♥</span> Charisma Reform
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Permanently upgrades the party's ability to attract and charm voter blocks.
                </p>
              </div>
              <button
                id="upgrade-charisma-btn"
                type="button"
                disabled={party.traits.charisma >= 10 || purchasedUpgrades.includes('charter_charisma')}
                onClick={() => handleBuyUpgrade('charter_charisma', 210000, 'Charisma Reform')}
                className={`w-full py-1.5 rounded text-[10px] font-bold mt-2 text-center transition-all ${
                  purchasedUpgrades.includes('charter_charisma')
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer'
                }`}
              >
                {purchasedUpgrades.includes('charter_charisma') ? 'APPROVED' : `Approve: 210,000 ${currency}`}
              </button>
            </div>

            {/* Upgrade Teşkilat */}
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/5 flex flex-col gap-2 justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="text-emerald-400">👥</span> Grassroots Reform
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Optimizes campaigns and logistics operations, lowering cost of opening headquarters.
                </p>
              </div>
              <button
                id="upgrade-org-btn"
                type="button"
                disabled={party.traits.organization >= 10 || purchasedUpgrades.includes('charter_org')}
                onClick={() => handleBuyUpgrade('charter_org', 160000, 'Grassroots Reform')}
                className={`w-full py-1.5 rounded text-[10px] font-bold mt-2 text-center transition-all ${
                  purchasedUpgrades.includes('charter_org')
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer'
                }`}
              >
                {purchasedUpgrades.includes('charter_org') ? 'APPROVED' : `Approve: 160,000 ${currency}`}
              </button>
            </div>

            {/* Upgrade Strateji */}
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-500/5 flex flex-col gap-2 justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="text-cyan-400">♟</span> Strategy Reform
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Lowers the lobbying and diplomatic costs when negotiating coalitions and passing bills.
                </p>
              </div>
              <button
                id="upgrade-strategy-btn"
                type="button"
                disabled={party.traits.strategy >= 10 || purchasedUpgrades.includes('charter_strat')}
                onClick={() => handleBuyUpgrade('charter_strat', 150000, 'Strategy Reform')}
                className={`w-full py-1.5 rounded text-[10px] font-bold mt-2 text-center transition-all ${
                  purchasedUpgrades.includes('charter_strat')
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer'
                }`}
              >
                {purchasedUpgrades.includes('charter_strat') ? 'APPROVED' : `Approve: 150,000 ${currency}`}
              </button>
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
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs cursor-pointer mt-2 text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
