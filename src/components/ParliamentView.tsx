/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Country, Party, Bill, VoterGroup } from '../types';
import { playSound } from '../lib/sounds';
import { 
  Landmark, AlertCircle, CheckCircle2, XCircle, 
  ChevronRight, Vote, Sparkles, Coins, RefreshCw 
} from 'lucide-react';

interface ParliamentViewProps {
  country: Country;
  party: Party;
  onUpdateCountry: (updatedCountry: Country) => void;
  onUpdateParty: (updatedParty: Party) => void;
  darkMode: boolean;
}

export const ParliamentView: React.FC<ParliamentViewProps> = ({
  country,
  party,
  onUpdateCountry,
  onUpdateParty,
  darkMode,
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill>(country.bills[0]);
  const [votingAnimation, setVotingAnimation] = useState<boolean>(false);
  const [votingScoreboard, setVotingScoreboard] = useState<{ yes: number; no: number; current: number } | null>(null);
  const [lobbyAlert, setLobbyAlert] = useState<{ title: string; message: string } | null>(null);

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

  // Calculate global support estimates for player in the country
  const countRegions = country.regions.length;
  const averagePlayerSupport = country.regions.reduce((acc, r) => acc + (r.supports[party.id] || 0), 0) / countRegions;

  // Parliament Seats Distribution based on current global support averages
  let playerSeatsCount = Math.round((averagePlayerSupport / 100) * country.seats);
  if (country.id === 'DE') {
    if (averagePlayerSupport < 5.0) {
      playerSeatsCount = 0;
    }
  } else if (averagePlayerSupport <= 2.2) {
    playerSeatsCount = 0;
  }
  let remainingSeats = country.seats - playerSeatsCount;

  // Allocate seats among rivals based on startingSeats if defined, otherwise baseSupport
  const hasStartingSeats = country.rivals.some(r => r.startingSeats !== undefined);
  const totalRivalBase = country.rivals.reduce((acc, r) => {
    return acc + (hasStartingSeats ? (r.startingSeats || 0) : r.baseSupport);
  }, 0);

  const rivalsSeatsData = country.rivals.map((rival) => {
    const rivalWeight = hasStartingSeats ? (rival.startingSeats || 0) : rival.baseSupport;
    const share = totalRivalBase > 0 ? rivalWeight / totalRivalBase : 0;
    const seats = Math.round(share * remainingSeats);
    return { ...rival, seats };
  });

  // Calculate seat rows to render a stunning semi-circle representation of parliament/meclis
  const generateParliamentArch = () => {
    const points: { x: number; y: number; color: string }[] = [];

    // Distribute seats proportionally
    const allPartiesSeats = [
      { color: party.color, seats: playerSeatsCount },
      ...rivalsSeatsData.map(r => ({ color: r.color, seats: r.seats }))
    ];

    // Align seats count with total country seats
    const totalSeatsAllocated = allPartiesSeats.reduce((acc, p) => acc + p.seats, 0);
    if (totalSeatsAllocated < country.seats) {
      allPartiesSeats[0].seats += (country.seats - totalSeatsAllocated);
    } else if (totalSeatsAllocated > country.seats) {
      let diff = totalSeatsAllocated - country.seats;
      for (let p of allPartiesSeats) {
        if (p.seats >= diff) {
          p.seats -= diff;
          break;
        } else {
          diff -= p.seats;
          p.seats = 0;
        }
      }
    }

    const seatsList: string[] = [];
    allPartiesSeats.forEach((p) => {
      for (let i = 0; i < p.seats; i++) {
        seatsList.push(p.color);
      }
    });

    const totalSeats = country.seats;
    const isLarge = totalSeats > 200;
    const dotSpacing = isLarge ? 5.2 : 10;
    const dynamicRowStep = isLarge ? 7.5 : 16;
    const dynamicBaseRadius = isLarge ? 35 : 60;

    let seatIndex = 0;
    let r = 0;

    while (seatIndex < totalSeats) {
      const radius = dynamicBaseRadius + r * dynamicRowStep;
      const arcLength = radius * Math.PI;
      const seatsInRow = Math.max(8, Math.round(arcLength / dotSpacing));
      const angleStep = Math.PI / (seatsInRow - 1);

      for (let s = 0; s < seatsInRow && seatIndex < totalSeats; s++) {
        const angle = Math.PI - s * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        points.push({
          x: x + 150, // Center offset
          y: 155 - y, // Invert and lower slightly
          color: seatsList[seatIndex] || '#64748b'
        });
        seatIndex++;
      }
      r++;
      if (r > 40) break; // Safety cutoff
    }
    return points;
  };

  const seatCoordinates = generateParliamentArch();

  // Lobby actions
  const [lobbySpent, setLobbySpent] = useState({
    influenceLobbied: false,
    fundsInjected: false,
  });

  const handleApplyLobbyInfluence = () => {
    const cost = 15;
    if (party.influence < cost) {
      setLobbyAlert({
        title: 'Insufficient influence',
        message: 'Lobbying requires at least ' + cost + ' political influence.'
      });
      return;
    }
    onUpdateParty({ ...party, influence: party.influence - cost });
    setLobbySpent({ ...lobbySpent, influenceLobbied: true });
  };

  const handleApplyLobbyFunds = () => {
    const cost = 120000;
    if (party.budget < cost) {
      setLobbyAlert({
        title: 'Insufficient budget',
        message: 'Subsidizing opposition groups requires at least ' + cost.toLocaleString() + ' ' + currency + '.'
      });
      return;
    }
    onUpdateParty({ ...party, budget: party.budget - cost });
    setLobbySpent({ ...lobbySpent, fundsInjected: true });
  };

  // Launch electronic votes counts
  const handleTriggerVote = (voteFor: boolean) => {
    if (selectedBill.status !== 'Pending' && selectedBill.status !== 'Bekliyor') return;

    setVotingAnimation(true);

    // Calculate pass probability bases
    // High support and high strategy makes passing bills easier
    const baseYesChance = (playerSeatsCount / country.seats) * 100;

    // Ideological affinity score (Left supports economy packages, center supports safety, etc.)
    let ideologicalBonus = 18; // default starting center threshold
    if (selectedBill.category === 'Economy' || selectedBill.category === 'Ekonomi') {
      // Socialists under study
      ideologicalBonus += country.rivals.some(r => r.ideology === 'Socialist' || r.ideology === 'Sosyalist') ? 14 : 0;
    } else if (selectedBill.category === 'Liberty' || selectedBill.category === 'Özgürlükler') {
      ideologicalBonus += country.rivals.some(r => r.ideology === 'Liberal' || r.ideology === 'Demokrat') ? 12 : 0;
    } else if (selectedBill.category === 'Security' || selectedBill.category === 'Güvenlik') {
      ideologicalBonus += country.rivals.some(r => r.ideology === 'Nationalist' || r.ideology === 'Milliyetçi') ? 16 : 0;
    }

    // Lobby bonuses
    const lobbyBonus = (lobbySpent.influenceLobbied ? 18 : 0) + (lobbySpent.fundsInjected ? 26 : 0);

    // Player voting command stance
    const commandStanceBonus = voteFor ? 10 : -25;

    // Aggregate Yes probability
    let finalYesPercent = Math.max(15, Math.min(95, baseYesChance + ideologicalBonus + lobbyBonus + commandStanceBonus + (party.traits.strategy * 1.5)));

    // Run interval ticker for visual LED counts
    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      const progress = ticks / 20; // 20 frames
      const yesVotesCount = Math.round(country.seats * (finalYesPercent / 100) * progress);
      const noVotesCount = Math.round(country.seats * (1 - finalYesPercent / 100) * progress);

      setVotingScoreboard({
        yes: yesVotesCount,
        no: noVotesCount,
        current: Math.round(progress * 100)
      });

      if (ticks >= 20) {
        clearInterval(interval);
        finalizeVoteResult(finalYesPercent >= 50, finalYesPercent);
      }
    }, 80);
  };

  const finalizeVoteResult = (passed: boolean, rating: number) => {
    // Determine new status
    const resultStatus = passed ? 'Passed' : 'Rejected';
    playSound(passed ? 'success' : 'error');

    // Apply outcomes dynamically if PASSED
    let updatedCountry = { ...country };
    let updatedParty = { ...party };

    if (passed) {
      // Apply budget cost / gains from bill
      updatedParty.budget = Math.max(0, party.budget - selectedBill.budgetCost);
      updatedParty.influence = Math.max(0, party.influence + selectedBill.influenceMod);

      // Shift support scores in ALL regions in the country according to bill impacts
      updatedCountry.regions = country.regions.map((region) => {
        const supports = { ...region.supports };
        const currentSupport = supports[party.id] || 0;

        let totalShift = 0;
        Object.entries(selectedBill.voterImpacts).forEach(([vgroup, rate]) => {
          const voterWeight = region.voterDistribution[vgroup as VoterGroup] || 10;
          // Strategy attribute strengthens legislative shift outcomes by 10% per level
          const stratMult = 1 + (party.traits.strategy * 0.1);
          totalShift += (voterWeight / 100) * (rate as number) * stratMult;
        });

        const targetSupport = Math.min(95, Math.max(1, currentSupport + totalShift));
        const diff = targetSupport - currentSupport;

        // Take from rivals proportionately
        const rivals = Object.keys(supports).filter(id => id !== party.id);
        const rivalsTotal = rivals.reduce((s, id) => s + (supports[id] || 0), 0);
        if (rivalsTotal > 0) {
          rivals.forEach((id) => {
            const fraction = (supports[id] || 0) / rivalsTotal;
            supports[id] = Math.max(1, (supports[id] || 0) - (diff * fraction));
          });
        }
        supports[party.id] = targetSupport;

        return { ...region, supports };
      });
    }

    // Set updated status on the bill
    const modifiedBills = country.bills.map((b) => 
      b.id === selectedBill.id ? { ...b, status: resultStatus, yesVotesPercentage: rating } : b
    );
    updatedCountry.bills = modifiedBills;

    onUpdateCountry(updatedCountry);
    onUpdateParty(updatedParty);

    // Refresh selected bill state visual
    const updatedSelectedBill = modifiedBills.find(b => b.id === selectedBill.id);
    if (updatedSelectedBill) {
      setSelectedBill(updatedSelectedBill);
    }

    setVotingAnimation(false);
    setLobbySpent({ influenceLobbied: false, fundsInjected: false });
  };

  const getStatusBadge = (status: Bill['status']) => {
    switch (status as string) {
      case 'Kabul Edildi':
      case 'Passed':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">PASSED</span>;
      case 'Reddedildi':
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold border border-rose-500/20">REJECTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-bold border border-amber-500/20">ON LEGISLATIVE AGENDA</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full py-2">
      {/* Semicircular Seat layout display */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
        <div className={`p-5 rounded-3xl border flex flex-col items-center relative ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-full text-left pb-3 border-b border-slate-500/10">
            <h3 className="text-xs font-bold tracking-tight uppercase text-slate-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-indigo-400" /> {country.parliamentName}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Seats Distribution and Architectural Seating Chart</p>
          </div>

          {/* SVG Semicircle Seat representation */}
          <div className="w-[300px] h-[160px] relative mt-4 select-none">
            <svg viewBox="0 0 300 165" className="w-full h-full">
              {/* Outer border arc */}
              <path d="M 30 145 A 120 120 0 0 1 270 145" fill="none" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="12" strokeLinecap="round" />
              {/* Inner border arc */}
              <path d="M 80 145 A 70 70 0 0 1 220 145" fill="none" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="4" strokeLinecap="round" strokeDasharray="3,3" />

              {/* Render small vector light nodes */}
              {seatCoordinates.map((coord, i) => (
                <circle
                  key={i}
                  cx={coord.x}
                  cy={coord.y}
                  r="3.5"
                  fill={coord.color}
                  className="transition-all duration-300 hover:scale-130"
                />
              ))}

              {/* Central Dais Podium desk */}
              <rect x="135" y="140" width="30" height="15" rx="3" fill="#475569" />
              <line x1="150" y1="130" x2="150" y2="140" stroke="#94a3b8" />
              <circle cx="150" cy="130" r="1.5" fill="#f59e0b" />
            </svg>
          </div>

          {/* Assembly party legends box */}
          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-500/10 text-[10px]">
            <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-500/5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }}></span>
              <span className="font-semibold truncate">{party.name}:</span>
              <strong className="font-mono">{playerSeatsCount} Seats</strong>
            </div>

            {rivalsSeatsData.map((riv) => (
              <div key={riv.id} className="flex items-center gap-1.5 p-1.5 rounded bg-slate-500/5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riv.color }}></span>
                <span className="font-semibold truncate">{riv.name}:</span>
                <strong className="font-mono">{riv.seats} Seats</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill lists & Interactive lobby action board */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
        {/* Bill tabs selection */}
        <div className={`p-4 rounded-2xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono mb-2.5">LEGISLATIVE BILLS (GENERAL AGENDA)</h4>
          <div className="flex flex-wrap gap-2">
            {country.bills.map((bill) => {
              const isSelected = selectedBill.id === bill.id;
              return (
                <button
                  id={`bill-tab-${bill.id}`}
                  key={bill.id}
                  onClick={() => {
                    if (!votingAnimation) setSelectedBill(bill);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : darkMode
                      ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/25 text-indigo-200">
                    {bill.category}
                  </span>
                  {bill.title.length > 25 ? bill.title.substring(0, 25) + '...' : bill.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bill detail workspace */}
        {selectedBill && (
          <div className={`p-6 rounded-3xl border flex flex-col h-full gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase font-mono">BILL SPECIFICATIONS</span>
                <h4 className="text-base font-extrabold tracking-tight mt-0.5 text-slate-100">{selectedBill.title}</h4>
              </div>
              {getStatusBadge(selectedBill.status)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-black/25 p-3 rounded-xl">
              {selectedBill.description}
            </p>

            {/* Bill dynamic impacts summary if passed */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-500/5 text-xs text-center">
              <div>
                <div className="text-[9px] text-slate-400 font-mono uppercase">BILL BUDGETY</div>
                <div className="font-extrabold font-mono text-rose-400 mt-1">
                  - {selectedBill.budgetCost.toLocaleString()} {currency}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-mono uppercase">IMPACT ACHIEVED</div>
                <div className="font-extrabold font-mono text-emerald-400 mt-1">
                  + {selectedBill.influenceMod} Influence
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-mono uppercase">TARGET VOTERS</div>
                <div className="font-bold text-indigo-400 mt-1 text-[10px]">
                  {Object.entries(selectedBill.voterImpacts)
                    .filter(([, rate]) => (rate as number) > 0)
                    .map(([g]) => g)
                    .join(', ')}
                </div>
              </div>
            </div>

            {/* If bill is STILL pending state */}
            {(selectedBill.status === 'Bekliyor' || selectedBill.status === 'Pending') && !votingAnimation && (
              <div className="flex flex-col gap-4 mt-auto">
                {/* Lobby and buying tools */}
                <div className="border-t border-slate-500/10 pt-4">
                  <h5 className="text-[10px] font-bold tracking-wider font-mono text-slate-400 uppercase mb-3">
                    PARLIAMENT LOBBY & COALITIONS
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Influence Lobbying button */}
                    <button
                      id="lobby-influence-btn"
                      onClick={handleApplyLobbyInfluence}
                      disabled={lobbySpent.influenceLobbied}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        lobbySpent.influenceLobbied
                          ? 'bg-slate-500/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold">Lobby with Influence</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Convinces undecided delegates. (+18% YES chance)</div>
                      </div>
                      <span className="text-xs font-mono font-black shrink-0 px-2.5 py-1 bg-indigo-500/10 rounded text-indigo-400 border border-indigo-500/10">
                        -15 Influence
                      </span>
                    </button>

                    {/* Funds Buying button */}
                    <button
                      id="lobby-funds-btn"
                      onClick={handleApplyLobbyFunds}
                      disabled={lobbySpent.fundsInjected}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        lobbySpent.fundsInjected
                          ? 'bg-slate-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold">Social Funds Subsidy</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Subsidizes opposition projects. (+26% YES chance)</div>
                      </div>
                      <span className="text-xs font-mono font-black shrink-0 px-2 py-1 bg-emerald-500/10 rounded text-emerald-400 border border-emerald-500/10">
                        -{(120000).toLocaleString()} {currency}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Vote triggers row */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-500/10 pt-4">
                  <button
                    id="vote-no-btn"
                    onClick={() => handleTriggerVote(false)}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-rose-500/15 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-all"
                  >
                    Group Stance: OPPOSE (NO)
                  </button>
                  <button
                    id="vote-yes-btn"
                    onClick={() => handleTriggerVote(true)}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/15 cursor-pointer transition-all"
                  >
                    Group Stance: SUPPORT (YES)
                  </button>
                </div>
              </div>
            )}

            {/* Voting Animation Scoring boards panel screen */}
            {votingAnimation && votingScoreboard && (
              <div className="p-5 rounded-2xl bg-black border border-slate-800 text-center flex flex-col gap-3 animate-pulse mt-auto">
                <span className="text-[10px] tracking-widest text-[#00ffcc] font-mono">PARLIAMENT ELECTRONIC VOTING MATRIX</span>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border border-emerald-500/30 p-2.5 rounded bg-emerald-950/20">
                    <div className="text-[9px] text-slate-400">SUPPORT (YES)</div>
                    <div className="text-3xl font-extrabold font-mono text-emerald-400">{votingScoreboard.yes}</div>
                  </div>
                  <div className="border border-rose-500/30 p-2.5 rounded bg-rose-950/20">
                    <div className="text-[9px] text-slate-400">OPPOSE (NO)</div>
                    <div className="text-3xl font-extrabold font-mono text-rose-500">{votingScoreboard.no}</div>
                  </div>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
                  <div className="bg-[#00ffcc] h-full transition-all" style={{ width: `${votingScoreboard.current}%` }}></div>
                </div>
                <span className="text-[9px] font-mono text-slate-500">Vote tallying progress: % {votingScoreboard.current}</span>
              </div>
            )}

            {/* If bill is ALREADY VOTED ON (Passed or failed feedback info) */}
            {selectedBill.status !== 'Bekliyor' && selectedBill.status !== 'Pending' && !votingAnimation && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl bg-black/25 border border-slate-500/5 mt-auto text-center justify-center items-center">
                {selectedBill.status === 'Kabul Edildi' || selectedBill.status === 'Passed' ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <div>
                      <h5 className="text-sm font-bold text-emerald-400">Legislative Bill Passed!</h5>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-md">
                        This bill has sparked massive enthusiasm across your voter base, yielding positive shifts. It was successfully enacted with a %{selectedBill.yesVotesPercentage.toFixed(1)} majority.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-10 h-10 text-rose-500" />
                    <div>
                      <h5 className="text-sm font-bold text-rose-400">Legislative Bill Vetoed & Rejected!</h5>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-md">
                        The bill was rejected due to fierce opposition coalitions or structural concerns in the budget draft. No budget was spent.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {lobbyAlert && (
        <div className="fixed inset-0 z-[110] h-full w-full bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl border p-5 flex flex-col gap-3 shadow-xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-rose-500">
                <span>⚠</span> {lobbyAlert.title}
              </h4>
            </div>
            <p className={`text-xs leading-relaxed py-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{lobbyAlert.message}</p>
            <button
              onClick={() => setLobbyAlert(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs cursor-pointer mt-2 text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
