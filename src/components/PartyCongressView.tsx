/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party, Ideology } from '../types';
import { playSound } from '../lib/sounds';
import { 
  Users, Award, Gift, Megaphone, ShieldAlert, CheckCircle, 
  Sparkles, Coffee, Key, BarChart3, TrendingUp, Radio,
  ChevronRight, ArrowRight, UserCheck, Flame, Landmark
} from 'lucide-react';

interface PartyCongressViewProps {
  country: Country;
  party: Party;
  onWinCongress: (leaderChoice: 'own' | 'figurehead', customName: string, pollingShift: number) => void;
  onBackToMap: () => void;
  darkMode: boolean;
}

interface ActionFeedback {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
}

export const PartyCongressView: React.FC<PartyCongressViewProps> = ({
  country,
  party,
  onWinCongress,
  onBackToMap,
  darkMode,
}) => {
  // Prep Weeks: Week 1 to 4. Week 5 is Congress voting day.
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [phase, setPhase] = useState<'prep' | 'voting' | 'results' | 'victory_dialog'>('prep');
  
  // Contestants
  const leaderName = party.leader || 'Current Leader';
  const rivalCandidateName = party.id === 'CHP' 
    ? 'Kemal Kılıçdaroğlu' 
    : party.id === 'AKP' 
    ? 'Mehmet Şimşek (Moderate Faction)' 
    : party.id === 'SPD'
    ? 'Olaf Scholz (Traditional Wing)'
    : 'National Executive Challenger';

  // Support within delegate groups (adds up to 100% per group)
  // Traditionalist delegates (30%), Reformist delegates (40%), Centrist delegates (30%)
  const [supports, setSupports] = useState({
    traditionalist: { player: 8, leader: 62, rival: 30 },
    reformist: { player: 14, leader: 48, rival: 38 },
    centrist: { player: 10, leader: 68, rival: 22 }
  });

  // Action log feedback
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  // Voting animation state
  const [votesCounted, setVotesCounted] = useState<number>(0);
  const [votingProgress, setVotingProgress] = useState<number>(0); // 0 to 100%

  // Post-victory dialog states
  const [leaderChoice, setLeaderChoice] = useState<'own' | 'figurehead'>('own');
  const [customName, setCustomName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  // Calculate weighted overall support
  const getOverallSupport = (playerType: 'player' | 'leader' | 'rival') => {
    const tradWeight = 0.30;
    const refWeight = 0.40;
    const centWeight = 0.30;

    const value = 
      supports.traditionalist[playerType] * tradWeight +
      supports.reformist[playerType] * refWeight +
      supports.centrist[playerType] * centWeight;
    
    return parseFloat(value.toFixed(1));
  };

  const playerOverall = getOverallSupport('player');
  const leaderOverall = getOverallSupport('leader');
  const rivalOverall = getOverallSupport('rival');

  const getCurrency = (countryId: string) => {
    if (countryId === 'US') return '$';
    if (countryId === 'TR') return '₺';
    if (countryId === 'DE') return '€';
    return '$';
  };
  const currency = getCurrency(country.id);

  // Normalize supports to exactly 100 in each category
  const normalizeFaction = (faction: 'traditionalist' | 'reformist' | 'centrist', state: typeof supports) => {
    const f = state[faction];
    const sum = f.player + f.leader + f.rival;
    if (Math.abs(sum - 100) > 0.01) {
      const scale = 100 / sum;
      return {
        player: parseFloat((f.player * scale).toFixed(1)),
        leader: parseFloat((f.leader * scale).toFixed(1)),
        rival: parseFloat((f.rival * scale).toFixed(1))
      };
    }
    return f;
  };

  const applySupportChange = (changes: {
    traditionalist?: { player?: number; leader?: number; rival?: number };
    reformist?: { player?: number; leader?: number; rival?: number };
    centrist?: { player?: number; leader?: number; rival?: number };
  }) => {
    setSupports((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      
      // Traditionalist
      if (changes.traditionalist) {
        if (changes.traditionalist.player !== undefined) next.traditionalist.player = Math.max(0, next.traditionalist.player + changes.traditionalist.player);
        if (changes.traditionalist.leader !== undefined) next.traditionalist.leader = Math.max(0, next.traditionalist.leader + changes.traditionalist.leader);
        if (changes.traditionalist.rival !== undefined) next.traditionalist.rival = Math.max(0, next.traditionalist.rival + changes.traditionalist.rival);
      }
      // Reformist
      if (changes.reformist) {
        if (changes.reformist.player !== undefined) next.reformist.player = Math.max(0, next.reformist.player + changes.reformist.player);
        if (changes.reformist.leader !== undefined) next.reformist.leader = Math.max(0, next.reformist.leader + changes.reformist.leader);
        if (changes.reformist.rival !== undefined) next.reformist.rival = Math.max(0, next.reformist.rival + changes.reformist.rival);
      }
      // Centrist
      if (changes.centrist) {
        if (changes.centrist.player !== undefined) next.centrist.player = Math.max(0, next.centrist.player + changes.centrist.player);
        if (changes.centrist.leader !== undefined) next.centrist.leader = Math.max(0, next.centrist.leader + changes.centrist.leader);
        if (changes.centrist.rival !== undefined) next.centrist.rival = Math.max(0, next.centrist.rival + changes.centrist.rival);
      }

      next.traditionalist = normalizeFaction('traditionalist', next);
      next.reformist = normalizeFaction('reformist', next);
      next.centrist = normalizeFaction('centrist', next);

      return next;
    });
  };

  // Turn preps actions
  const handleDelegateVisits = () => {
    playSound('click');
    // Strong boost among traditionalists, small boost among centrists
    applySupportChange({
      traditionalist: { player: 14, leader: -8, rival: -6 },
      centrist: { player: 8, leader: -4, rival: -4 },
      reformist: { player: -2, leader: 1, rival: 1 }
    });
    setFeedback({
      title: 'Personal Delegate Visits',
      description: 'You traveled across the districts, drinking tea and holding closed meetings with influential party delegacy. Traditionalists (+14%) and Centrists (+8%) appreciate your grassroots focus!',
      type: 'success'
    });
    advanceWeek();
  };

  const handleInternalSpeech = () => {
    playSound('click');
    // Boost among reformists and centrists, slight traditionalist penalty if charisma/eloquence is high
    const eloquenceBonus = Math.floor(party.traits.eloquence * 1.5);
    applySupportChange({
      reformist: { player: 12 + eloquenceBonus, leader: -8, rival: -4 },
      centrist: { player: 10, leader: -6, rival: -4 }
    });
    setFeedback({
      title: 'Powerful Faction Keynote Address',
      description: `You delivered a fiery speech to delegates in the metropolitan HQ. Your high eloquence (+${eloquenceBonus}% bonus) completely electrified Reformists and Centrists!`,
      type: 'success'
    });
    advanceWeek();
  };

  const handleAllianceForming = () => {
    playSound('click');
    // Offer terms to rival delegates, transfer some rival delegates directly to player!
    applySupportChange({
      traditionalist: { player: 10, rival: -10 },
      reformist: { player: 15, rival: -15 },
      centrist: { player: 12, rival: -12 }
    });
    setFeedback({
      title: 'Secret Backroom Pact Secured',
      description: `You agreed to give committee chairs to the challenger's faction in exchange for delegate instructions. They transferred significant numbers of supporters directly to your camp!`,
      type: 'success'
    });
    advanceWeek();
  };

  const handleMediaAppearance = () => {
    playSound('click');
    // Great public exposure: boosts reformists & centrists, but slightly irritates traditionalists
    applySupportChange({
      reformist: { player: 15, leader: -10, rival: -5 },
      centrist: { player: 12, leader: -8, rival: -4 },
      traditionalist: { player: -6, leader: 4, rival: 2 }
    });
    setFeedback({
      title: 'Viral Television Broadcast',
      description: 'Your prime-time television interview went viral. Reformist (+15%) and Centrist (+12%) delegates are proud, though conservative elements find it too unorthodox.',
      type: 'success'
    });
    advanceWeek();
  };

  const handleFundraising = () => {
    playSound('click');
    // Slight delegate penalty (looks a bit commercial), but gives future budget/resource power!
    applySupportChange({
      traditionalist: { player: -2, leader: 1, rival: 1 },
      reformist: { player: -3, leader: 2, rival: 1 }
    });
    setFeedback({
      title: 'Unity Fundraiser Banquet',
      description: 'You raised substantial political cache and funds among major business backers. Delegates feel slightly neglected, but your core network grows.',
      type: 'success'
    });
    advanceWeek();
  };

  const advanceWeek = () => {
    if (currentWeek < 4) {
      setCurrentWeek((prev) => prev + 1);
    } else {
      // Initiate Congress Voting day
      setTimeout(() => {
        setFeedback(null);
        setPhase('voting');
      }, 2500);
    }
  };

  // Voting day simulation count
  useEffect(() => {
    if (phase !== 'voting') return;

    playSound('click');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setVotingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setPhase('results');
        const won = playerOverall >= 50;
        playSound(won ? 'win' : 'error');
      }
    }, 150);

    return () => clearInterval(interval);
  }, [phase, playerOverall]);

  // Handle final victory transition
  const handleCompleteCongress = () => {
    if (leaderChoice === 'own' && !customName.trim()) {
      setNameError('Please enter your leader name.');
      playSound('error');
      return;
    }
    setNameError('');
    playSound('success');

    // Calculate a realistic shift in general voter polling
    // Shift is ±1% to ±7% based on old leader departure
    // Usually a negative shift initially due to loyalist backlash, sometimes offset by new momentum
    const rawShift = -1 * (2 + Math.floor(Math.random() * 6)); // default -2% to -7% loyalists küsmesi
    const charismaBonus = Math.floor(party.traits.charisma * 0.7); // offset by player charisma
    const finalShift = parseFloat((rawShift + charismaBonus).toFixed(1));

    onWinCongress(leaderChoice, leaderChoice === 'own' ? customName : leaderName, finalShift);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      
      {/* HEADER CARD */}
      <div className={`p-6 rounded-3xl border text-center relative overflow-hidden ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Landmark className="w-4 h-4 text-indigo-400" /> STATE PARTY ORG • EXTRAORDINARY LEADERSHIP CONGRESS
        </div>
        <h2 className="text-2xl font-black uppercase mt-1.5">{party.name} National Congress Campaign</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto leading-relaxed">
          The delegates are gathering. You are currently a junior contender challenging the entrenched leadership of <strong>{leaderName}</strong>. 
          You must reach <strong className="text-indigo-400">50% or more</strong> of overall delegate votes to claim leadership of the party.
        </p>
      </div>

      {/* PHASE 1: PREPARATION ACTIONS */}
      {phase === 'prep' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* LEFT COLUMN: STATS AND DELEGATES */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
            
            {/* WEEK INDICATOR */}
            <div className={`p-4 rounded-2xl border flex justify-between items-center ${
              darkMode ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'
            }`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">PREPARATION PHASE</span>
                <h4 className="text-base font-black uppercase">Week {currentWeek} of 4</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400">CONGRESS DAY IN</span>
                <h4 className="text-sm font-black text-amber-500">{5 - currentWeek} Actions Left</h4>
              </div>
            </div>

            {/* OVERALL DELEGACY SUPPORT SPEEDOMETER */}
            <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
              darkMode ? 'bg-slate-900/65 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                📊 Projected Delegate Polls
              </h3>

              <div className="space-y-4">
                {/* PLAYER */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-indigo-400">Challenge (You)</span>
                    <span className="font-mono font-bold text-indigo-400">{playerOverall}% Support</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${playerOverall}%` }}></div>
                  </div>
                </div>

                {/* ACTIVE LEADER */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">{leaderName} (Incumbent)</span>
                    <span className="font-mono font-bold text-slate-300">{leaderOverall}% Support</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${leaderOverall}%` }}></div>
                  </div>
                </div>

                {/* THIRD CONTENDER */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-450">{rivalCandidateName}</span>
                    <span className="font-mono text-slate-450">{rivalOverall}% Support</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-slate-600 rounded-full transition-all duration-500" style={{ width: `${rivalOverall}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[10px] text-slate-400 leading-normal text-center">
                Goal: Command <strong className="text-indigo-400">≥ 50%</strong> of the delegate seats by week 5 to win the gavel!
              </div>
            </div>

            {/* SECTORAL FACTION DETAILS */}
            <div className={`p-5 rounded-3xl border flex flex-col gap-3.5 ${
              darkMode ? 'bg-slate-900/65 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                👥 Faction-wise Standing
              </h3>

              <div className="space-y-3.5">
                {/* Traditionalist */}
                <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-amber-500 uppercase font-mono">Traditionalists (30% weight)</span>
                    <span className="text-slate-450">You: {supports.traditionalist.player}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-950">
                    <div className="bg-indigo-500 h-full" style={{ width: `${supports.traditionalist.player}%` }} />
                    <div className="bg-slate-400 h-full" style={{ width: `${supports.traditionalist.leader}%` }} />
                    <div className="bg-slate-600 h-full" style={{ width: `${supports.traditionalist.rival}%` }} />
                  </div>
                </div>

                {/* Reformist */}
                <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-emerald-400 uppercase font-mono">Reformists (40% weight)</span>
                    <span className="text-slate-450">You: {supports.reformist.player}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-950">
                    <div className="bg-indigo-500 h-full" style={{ width: `${supports.reformist.player}%` }} />
                    <div className="bg-slate-400 h-full" style={{ width: `${supports.reformist.leader}%` }} />
                    <div className="bg-slate-600 h-full" style={{ width: `${supports.reformist.rival}%` }} />
                  </div>
                </div>

                {/* Centrist */}
                <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
                  <div className="flex justify-between items-center text-[11px] mb-1.5">
                    <span className="font-bold text-cyan-400 uppercase font-mono">Centrists (30% weight)</span>
                    <span className="text-slate-450">You: {supports.centrist.player}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-950">
                    <div className="bg-indigo-500 h-full" style={{ width: `${supports.centrist.player}%` }} />
                    <div className="bg-slate-400 h-full" style={{ width: `${supports.centrist.leader}%` }} />
                    <div className="bg-slate-600 h-full" style={{ width: `${supports.centrist.rival}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTION DASHBOARD */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
            
            {/* ACTION FEEDBACK ALERT */}
            {feedback && (
              <div className={`p-4 rounded-2xl border text-xs flex gap-3 items-start animate-scale-up ${
                feedback.type === 'success' 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <Sparkles className="w-5 h-5 shrink-0 text-indigo-400 animate-pulse" />
                <div>
                  <strong className="font-black font-mono block uppercase tracking-wider">{feedback.title}</strong>
                  <p className="mt-1 leading-relaxed text-[11px]">{feedback.description}</p>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-3xl border flex flex-col gap-4 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest pb-2 border-b border-slate-500/10">
                ⚡ Select weekly campaign actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* ACTION 1: DELEGATE VISITS */}
                <button
                  type="button"
                  onClick={handleDelegateVisits}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-left transition-all duration-150 hover:bg-indigo-500/5 flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 w-fit">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold group-hover:text-indigo-400">Delegate Private Lobbying</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Hold personal meetings and drink tea with traditionalist powerbrokers.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 mt-auto font-black uppercase">
                    📈 ++Traditionalists • +Centrists
                  </span>
                </button>

                {/* ACTION 2: INTERNAL SPEECH */}
                <button
                  type="button"
                  onClick={handleInternalSpeech}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-left transition-all duration-150 hover:bg-indigo-500/5 flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500 w-fit">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold group-hover:text-indigo-400">Podium Keynote Address</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Deliver a programmatic address using Eloquence to sway delegates.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 mt-auto font-black uppercase">
                    📈 ++Reformists • +Centrists (Eloquence Scaled)
                  </span>
                </button>

                {/* ACTION 3: ALLIANCE FORMING */}
                <button
                  type="button"
                  onClick={handleAllianceForming}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-left transition-all duration-150 hover:bg-indigo-500/5 flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-500 w-fit">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold group-hover:text-indigo-400">Backroom Alliance Deal</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Offer future government ministries or leadership positions to rival delegates.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 mt-auto font-black uppercase">
                    📈 Direct Rival Support Transfer
                  </span>
                </button>

                {/* ACTION 4: MEDIA EXPOSURE */}
                <button
                  type="button"
                  onClick={handleMediaAppearance}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-left transition-all duration-150 hover:bg-indigo-500/5 flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-500 w-fit">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold group-hover:text-indigo-400">Viral Prime-Time Interview</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Appear on nation-wide news. Greatly impress reformists but risk minor traditional backlash.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 mt-auto font-black uppercase">
                    📈 +++Reformists • --Traditionalists
                  </span>
                </button>

                {/* ACTION 5: FUNDRAISING */}
                <button
                  type="button"
                  onClick={handleFundraising}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-left transition-all duration-150 hover:bg-indigo-500/5 flex flex-col gap-2 group cursor-pointer col-span-1 md:col-span-2"
                >
                  <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 w-fit">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold group-hover:text-indigo-400">Host Elite Fundraising Banquet</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Rally wealthy party donors. This generates future political currency at the cost of minor delegates friction.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-rose-400 mt-auto font-black uppercase">
                    📈 Budget Secure • -Delegacy backing
                  </span>
                </button>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* PHASE 2: VOTING DAY ANIMATION */}
      {phase === 'voting' && (
        <div className={`p-8 rounded-3xl border text-center flex flex-col items-center gap-6 ${
          darkMode ? 'bg-slate-900/60 border-indigo-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 animate-spin">
            <Radio className="w-12 h-12" />
          </div>
          
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 uppercase tracking-widest">
              🔴 Live Ballot Counting Day
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight mt-1.5">
              The Congress Gavel Is Cast!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Delegates are filing into the main congress arena. Electronic and paper balloting processes are currently active. Official results incoming!
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>COUNTING DELEGATES</span>
              <span>{votingProgress}%</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-150" 
                style={{ width: `${votingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: CONGRESS RESULTS VERDICT */}
      {phase === 'results' && (
        <div className={`p-8 rounded-3xl border text-center flex flex-col items-center gap-6 ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {playerOverall >= 50 ? (
            <>
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 animate-bounce">
                <Award className="w-16 h-16" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-widest">
                  🏆 CONGRESS CHAMPION • RULING REVELATION
                </span>
                <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-tight mt-2">
                  VICTORY! You Command {playerOverall}% of Faction Delegates
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                  You successfully defeated the incumbent leadership in a dramatic extraordinary voting round! 
                  The delegates have handed you the party gavel.
                </p>
              </div>

              {/* VOTES BREAKDOWN */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-md p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs font-mono">
                <div>
                  <div className="text-indigo-400 font-extrabold text-[13px]">{playerOverall}%</div>
                  <div className="text-[9px] text-slate-450 uppercase font-bold mt-1">Your Votes</div>
                </div>
                <div className="border-l border-slate-850"></div>
                <div>
                  <div className="text-slate-400 font-bold text-[13px]">{leaderOverall}%</div>
                  <div className="text-[9px] text-slate-450 uppercase font-bold mt-1">{leaderName}</div>
                </div>
                <div className="border-l border-slate-850"></div>
                <div>
                  <div className="text-slate-500 text-[13px]">{rivalOverall}%</div>
                  <div className="text-[9px] text-slate-450 uppercase font-bold mt-1">{rivalCandidateName}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPhase('victory_dialog')}
                className="px-8 py-3.5 rounded-2xl font-bold text-xs bg-indigo-650 hover:bg-indigo-600 text-white shadow-lg cursor-pointer flex items-center gap-2 mt-2 group animate-pulse"
              >
                Claim Gavel & Re-brand Leadership! <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
              </button>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                <ShieldAlert className="w-16 h-16" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 uppercase tracking-widest">
                  ❌ CONGRESS DEFEAT • DELEGATES DEPARTED
                </span>
                <h3 className="text-2xl font-black text-rose-400 uppercase tracking-tight mt-2">
                  DEFEATED! SECURED {playerOverall}% OF THE GAUNTLET
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                  You failed to command the required majority (50%+) of the party congress. 
                  The executive board has re-elected <strong>{leaderName}</strong> as supreme leader, and your political rebellion has been crushed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-xs p-3 bg-slate-950 rounded-2xl border border-slate-850 text-xs font-mono">
                <div>
                  <span className="text-rose-400 font-bold">{playerOverall}%</span>
                  <div className="text-[9px] text-slate-500 uppercase mt-0.5">Your Support</div>
                </div>
                <div className="border-l border-slate-850">
                  <span className="text-slate-300 font-bold">{100 - playerOverall}%</span>
                  <div className="text-[9px] text-slate-500 uppercase mt-0.5 font-bold">Opponents</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onBackToMap}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-500/10 border border-slate-550/15 text-slate-300 hover:bg-slate-500/20 cursor-pointer mt-2"
              >
                Return to Global Map & Try Again
              </button>
            </>
          )}
        </div>
      )}

      {/* PHASE 4: POST-CONGRESS NAME & FIGUREHEAD CHOICE DIALOG */}
      {phase === 'victory_dialog' && (
        <div className={`p-6 rounded-3xl border flex flex-col gap-6 text-left animate-scale-up ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">RE-BRANDING THE FUTURE</span>
            <h3 className="text-xl font-black uppercase mt-1 leading-tight">
              Secure CHP/Party Rebranding
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You won the leadership of <strong>{party.name}</strong>. Will you continue under your own name as Chairman, or keep <strong>{leaderName}</strong> as the public figurehead while you pull the strings from the shadows?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION A: OWN NAME */}
            <button
              type="button"
              onClick={() => {
                setLeaderChoice('own');
                playSound('click');
              }}
              className={`p-5 rounded-2xl border text-left flex flex-col gap-2.5 transition-all cursor-pointer ${
                leaderChoice === 'own' 
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-md' 
                  : 'border-slate-800 bg-transparent hover:border-slate-650'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  leaderChoice === 'own' ? 'border-indigo-400 text-indigo-400' : 'border-slate-500'
                }`}>
                  {leaderChoice === 'own' && <span className="w-2 h-2 bg-indigo-400 rounded-full" />}
                </span>
                <span className="text-xs font-black uppercase font-mono">Use my own name</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Erase the old regime! Rebrand the party fully under your custom name. You will be the official public face in all television debates and rallies.
              </p>
            </button>

            {/* OPTION B: FIGUREHEAD */}
            <button
              type="button"
              onClick={() => {
                setLeaderChoice('figurehead');
                playSound('click');
              }}
              className={`p-5 rounded-2xl border text-left flex flex-col gap-2.5 transition-all cursor-pointer ${
                leaderChoice === 'figurehead' 
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-md' 
                  : 'border-slate-800 bg-transparent hover:border-slate-650'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  leaderChoice === 'figurehead' ? 'border-indigo-400 text-indigo-400' : 'border-slate-500'
                }`}>
                  {leaderChoice === 'figurehead' && <span className="w-2 h-2 bg-indigo-400 rounded-full" />}
                </span>
                <span className="text-xs font-black uppercase font-mono">Keep {leaderName} as figurehead</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Rule from the shadows! Keep the former leader's portrait and name as the public face to avoid alienation, while you direct the entire budget, traits, and strategy.
              </p>
            </button>
          </div>

          {/* CONDITIONAL TEXT INPUT FOR OWN NAME */}
          {leaderChoice === 'own' && (
            <div className="space-y-2 animate-scale-up">
              <label htmlFor="custom-leader-name" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                Enter Your Supreme Leader Name:
              </label>
              <input
                id="custom-leader-name"
                type="text"
                placeholder="e.g. Ahmet Yılmaz, Sarah Connor"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  if (e.target.value.trim()) setNameError('');
                }}
                className={`w-full p-3.5 rounded-2xl bg-slate-950 border text-xs font-bold transition-all focus:outline-none focus:border-indigo-500 ${
                  nameError ? 'border-rose-500/75' : 'border-slate-850'
                }`}
              />
              {nameError && (
                <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                  ⚠️ {nameError}
                </span>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-500/10 flex justify-end">
            <button
              id="confirm-gavel-rebrand-btn"
              type="button"
              onClick={handleCompleteCongress}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Confirm and Launch National Campaign
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
