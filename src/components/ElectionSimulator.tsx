/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party, Region, Coalition } from '../types';
import { playSound } from '../lib/sounds';
import { 
  Vote, Award, Trophy, ArrowRight, HelpCircle, AlertTriangle, 
  Tv, BarChart2, CheckCircle2, ChevronRight, RefreshCw, XCircle,
  Flame, Shield, Swords, Users, Landmark, Flag, Zap, Radio, Crosshair
} from 'lucide-react';

interface ElectionSimulatorProps {
  country: Country;
  party: Party;
  onElectionFinished: (success: boolean, finalSeats?: Record<string, number>, newCoalition?: any) => void;
  darkMode: boolean;
  coalitions?: Coalition[];
  isAtWar?: boolean;
  militaryReadiness?: number;
}

export type RegimeChangeType = 'POPULAR_UPRISING' | 'MILITARY_COUP' | 'POLITBURO_OPERATION';

export const ElectionSimulator: React.FC<ElectionSimulatorProps> = ({
  country,
  party,
  onElectionFinished,
  darkMode,
  coalitions = [],
  isAtWar = false,
  militaryReadiness = 65,
}) => {
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const [countedRegions, setCountedRegions] = useState<string[]>([]);
  const [seatsWon, setSeatsWon] = useState<Record<string, number>>({});
  const [popularVotes, setPopularVotes] = useState<Record<string, number>>({});
  const [totalSeatsCounted, setTotalSeatsCounted] = useState<number>(0);
  const [newsTicker, setNewsTicker] = useState<string>('Polls closed, counting phase begins...');
  const [step, setStep] = useState<'intro' | 'counting' | 'results' | 'regime_operation'>('intro');
  const [userSpeed, setUserSpeed] = useState<number>(2000); // ms per region

  // Regime change states for communist / non-democratic countries
  const [selectedOperation, setSelectedOperation] = useState<RegimeChangeType | null>(null);
  const [operationExecuting, setOperationExecuting] = useState<boolean>(false);
  const [operationResult, setOperationResult] = useState<{ success: boolean; title: string; message: string; details: string[] } | null>(null);

  const isOnePartyOrCommunist = ['SU', 'DDR', 'CN', 'CS'].includes(country.id) || 
    (country.system && (country.system.includes('One-Party') || country.system.includes('Tek Parti') || country.system.includes('Communist') || country.system.includes('Socialist State')));
  
  const isAuthoritarian = ['RU', 'BY', 'TR', 'EG'].includes(country.id) || 
    (country.freedomScore !== undefined && country.freedomScore < 45);

  // Coalition Negotiation States
  const [selectedCoalitionParties, setSelectedCoalitionParties] = useState<string[]>(() => {
    const activeCoalition = coalitions?.find(c => c.parties.includes(party.name));
    if (activeCoalition) {
      return country.rivals
        .filter(r => activeCoalition.parties.includes(r.name) && r.name !== party.name)
        .map(r => r.id);
    }
    return [];
  });
  const [coalitionNegotiated, setCoalitionNegotiated] = useState<boolean>(false);
  const [coalitionSuccess, setCoalitionSuccess] = useState<boolean | null>(null);
  const [coalitionMessage, setCoalitionMessage] = useState<string>('');

  const calculateOperationOdds = (opType: RegimeChangeType) => {
    let baseOdds = 45;
    const traits = party.traits;

    if (opType === 'POPULAR_UPRISING') {
      // Influenced by Charisma, Eloquence, and party membership / budget
      baseOdds += (traits.charisma * 4) + (traits.eloquence * 3);
      if (party.members > 50000) baseOdds += 10;
      if (party.influence > 60) baseOdds += 10;
    } else if (opType === 'MILITARY_COUP') {
      // Influenced by Strategy, Organization, and Defense investments
      baseOdds += (traits.strategy * 5) + (traits.organization * 3);
      if (party.budget > 100000) baseOdds += 10;
      if (party.influence > 50) baseOdds += 10;
    } else if (opType === 'POLITBURO_OPERATION') {
      // Influenced by Strategy, Charisma, and Political Influence
      baseOdds += (traits.strategy * 5) + (traits.charisma * 3);
      if (party.influence > 70) baseOdds += 15;
    }

    return Math.min(92, Math.max(20, Math.round(baseOdds)));
  };

  const handleExecuteOperation = (opType: RegimeChangeType) => {
    setOperationExecuting(true);
    playSound('click');

    const odds = calculateOperationOdds(opType);
    const roll = Math.random() * 100;
    const isSuccess = roll <= odds;

    setTimeout(() => {
      setOperationExecuting(false);
      if (isSuccess) {
        playSound('success');
        if (opType === 'POPULAR_UPRISING') {
          setOperationResult({
            success: true,
            title: "VICTORY: The Popular Revolution Prevails!",
            message: `Hundreds of thousands of workers, students, and citizens occupied the central square in ${country.name}. Security garrisons laid down their weapons and joined the movement. The authoritarian regime has formally surrendered executive authority!`,
            details: [
              "General Strike halted all state rail and broadcasting systems.",
              "State ministries conceded authority to the Provisional Democratic Assembly.",
              `Your party, ${party.name}, has been mandated by the people to govern!`
            ]
          });
        } else if (opType === 'MILITARY_COUP') {
          setOperationResult({
            success: true,
            title: "VICTORY: Military Garrison & Reformist Staff Secures Power!",
            message: `Key armored divisions and senior commanders defected to your cause overnight. Crucial government broadcasting transmitters, communications hubs, and state ministries in ${country.name} are now secured under your command!`,
            details: [
              "Armored columns secured the presidential palace without major bloodshed.",
              "The old regime apparatus was peacefully detained and disarmed.",
              `State Radio confirms: ${party.name} assumes executive governance over ${country.name}!`
            ]
          });
        } else {
          setOperationResult({
            success: true,
            title: "VICTORY: Executive Politburo Operation Succeeded!",
            message: `Through supreme strategic maneuvering, your faction outvoted and ousted the old regime leadership inside the Central Committee. A historic decree appointed ${party.leader || party.name} as the new sovereign leader!`,
            details: [
              "Central Committee passed a decisive Vote of No Confidence against the old guard.",
              "Key department heads pledged loyalty to the new reformist cabinet.",
              `Official Gazette confirms the transition of ${country.name} to ${party.name} leadership!`
            ]
          });
        }
      } else {
        playSound('error');
        setOperationResult({
          success: false,
          title: "FAILED: The Regime Apparatus Counter-Attacked!",
          message: `The state security forces caught wind of the operation and reinforced key checkpoints. The movement was suppressed before reaching the central palace.`,
          details: [
            "Regime loyalists deployed elite riot police and locked down broadcasting towers.",
            "Key operational contacts were forced into hiding.",
            "You may attempt another regime transition vector or regroup your grassroots organization."
          ]
        });
      }
    }, 2400);
  };

  const getAgreementChance = (rivalId: string) => {
    const rival = country.rivals.find(r => r.id === rivalId);
    if (!rival) return 50;
    
    const pIdeo = party.ideology;
    const rIdeo = rival.ideology;
    if (pIdeo === rIdeo) return 95;
    
    // Moderate alliances
    if (pIdeo === 'Sosyal Demokrat' && rIdeo === 'Sosyalist') return 85;
    if (pIdeo === 'Sosyal Demokrat' && rIdeo === 'Ekolojist') return 90;
    if (pIdeo === 'Muhafazakar' && rIdeo === 'Milliyetçi') return 85;
    if (pIdeo === 'Liberal' && rIdeo === 'Muhafazakar') return 65;
    if (pIdeo === 'Liberal' && rIdeo === 'Sosyal Demokrat') return 70;
    if (pIdeo === 'Sosyalist' && rIdeo === 'Ekolojist') return 80;
    
    // High-friction alliances
    if (pIdeo === 'Sosyalist' && rIdeo === 'Muhafazakar') return 15;
    if (pIdeo === 'Milliyetçi' && rIdeo === 'Sosyalist') return 10;
    if (pIdeo === 'Sosyal Demokrat' && rIdeo === 'Milliyetçi') return 30;
    
    return 50; // default
  };

  // Pre-calculate rival party names and metadata
  const getPartyName = (id: string) => {
    if (id === party.id) return party.name;
    const r = country.rivals.find(riv => riv.id === id);
    return r ? r.name : 'Other Parties';
  };

  const getPartyColor = (id: string) => {
    if (id === party.id) return party.color;
    const r = country.rivals.find(riv => riv.id === id);
    return r ? r.color : '#64748b';
  };

  // Run the counting phase
  useEffect(() => {
    if (step !== 'counting') return;

    if (currentRegionIndex < country.regions.length) {
      const timer = setTimeout(() => {
        const region = country.regions[currentRegionIndex];
        
        // Calculate seats obtained in this region based on local supports
        const regionSeats = region.seats;
        const rawSupports: Record<string, number> = { ...(region.supports as Record<string, number>) };

        // In authoritarian regimes, state apparatus applies suppression pressure against opposition
        if (isAuthoritarian) {
          const playerResistance = (party.traits.organization + party.traits.charisma) / 2;
          const statePressure = Math.max(0, 8 - (playerResistance * 0.7));
          if (statePressure > 0 && country.rivals.length > 0) {
            const incumbentRival = country.rivals[0];
            const playerOld = rawSupports[party.id] || 0;
            const suppressionShift = Math.min(playerOld * 0.15, statePressure);
            rawSupports[party.id] = Math.max(0, playerOld - suppressionShift);
            rawSupports[incumbentRival.id] = (rawSupports[incumbentRival.id] || 0) + suppressionShift;
          }
        }

        // Simultaneous War & Elections Modifier (Russia / Ukraine wartime model)
        if (isAtWar) {
          const playerShare = rawSupports[party.id] || 0;
          if (militaryReadiness >= 65) {
            // Rally 'Round the Flag Effect: Frontline victories boost incumbent support
            const rallyBoost = Math.min(15, playerShare * 0.12);
            rawSupports[party.id] = playerShare + rallyBoost;
          } else if (militaryReadiness <= 40) {
            // Anti-War Backlash: Casualties and exhaustion penalize incumbent support
            const warPenalty = Math.min(20, playerShare * 0.15);
            rawSupports[party.id] = Math.max(5, playerShare - warPenalty);
          }
        }
        const regionSupports = rawSupports;

        // Initialize local changes
        const localSeatResult: Record<string, number> = {};

        // USA Winner-take-all rules
        if (country.system === 'Başkanlık Sistemi') {
          // Find out who has the highest support in this region
          let winnerId = party.id;
          let maxSupport = (regionSupports[party.id] || 0) as number;

          Object.entries(regionSupports).forEach(([pId, val]) => {
            const numVal = val as number;
            if (numVal > maxSupport) {
              winnerId = pId;
              maxSupport = numVal;
            }
          });

          // Winner takes ALL seats (Electoral College votes)
          localSeatResult[winnerId] = regionSeats;
        } else {
          // Proportional seat allocation for Hükümet Koalisyonu and Dar Bölge
          // Distribute seats proportional to support percentages in this region
          let allocated = 0;
          let filteredSupports = Object.entries(regionSupports);
          
          if (country.id === 'DE') {
            // German 5% threshold: Filter out BSW, FDP and player if support is under 5%
            filteredSupports = filteredSupports.filter(([pId, val]) => {
              if (pId === 'BSW' || pId === 'FDP') return false;
              if (pId === party.id) {
                return (val as number) >= 5.0;
              }
              return true;
            });

            // Re-normalize supports
            const sumFiltered = filteredSupports.reduce((s, [, v]) => s + (v as number), 0);
            if (sumFiltered > 0) {
              filteredSupports = filteredSupports.map(([pId, val]) => [pId, ((val as number) / sumFiltered) * 100]);
            }
          }

          const sortedSupports = filteredSupports.sort((a,b) => (b[1] as number) - (a[1] as number));
          
          sortedSupports.forEach(([pId, val]) => {
            const calculatedSeats = Math.floor(((val as number) / 100) * regionSeats);
            localSeatResult[pId] = calculatedSeats;
            allocated += calculatedSeats;
          });

          // Hand out residual seats to the highest voted parties in this region
          let residual = regionSeats - allocated;
          let rIndex = 0;
          while (residual > 0 && sortedSupports.length > 0) {
            const pId = sortedSupports[rIndex % sortedSupports.length][0];
            localSeatResult[pId] = (localSeatResult[pId] || 0) + 1;
            residual--;
            rIndex++;
          }
        }

        // Add to aggregate seats state
        setSeatsWon((prev) => {
          const next = { ...prev };
          Object.entries(localSeatResult).forEach(([pId, val]) => {
            next[pId] = (next[pId] || 0) + val;
          });
          return next;
        });

        // Add weighted support for popular vote
        setPopularVotes((prev) => {
          const next = { ...prev };
          Object.entries(regionSupports).forEach(([pId, val]) => {
            const numVal = val as number;
            next[pId] = (next[pId] || 0) + (numVal * regionSeats);
          });
          return next;
        });
        setTotalSeatsCounted((prev) => prev + regionSeats);

        // Set live television news reports based on country flag and index
        setNewsTicker(generateNewsTickerText(country.id, region, localSeatResult));

        // Mark region as done and increment index
        setCountedRegions((prev) => [...prev, region.id]);
        setCurrentRegionIndex((prev) => prev + 1);

      }, userSpeed);

      return () => clearTimeout(timer);
    } else {
      // Completed last region! Set results page
      setNewsTicker('Counting complete in all electoral districts! The Central Election Commission is preparing the official announcement.');
      const victor = checkVictory();
      playSound(victor ? 'win' : 'error');
      setStep('results');
    }
  }, [step, currentRegionIndex, country, userSpeed]);

  // television reports tickers helpers
  const generateNewsTickerText = (countryId: string, region: Region, localResult: Record<string, number>) => {
    const playerShare = region.supports[party.id] || 0;
    const playerSeats = localResult[party.id] || 0;

    if (countryId === 'TR') {
      return `NATIONAL PRESS: Counting concluded in ${region.name}. Our party claimed %${playerShare.toFixed(1)} support and secured ${playerSeats} seats.`;
    }
    if (countryId === 'US') {
      return `CNN INTERNATIONAL: ${region.name} result is IN! Winner gets all ${region.seats} Electoral Votes. ${playerSeats > 0 ? party.name + ' takes the state!' : 'Rivals secure the state.'}`;
    }
    if (countryId === 'DE') {
      return `ZDF HEUTE: Wahlkreis-Ergebnisse aus ${region.name}. ${party.name} gewinnt ${playerSeats} Mandate im Bundestag.`;
    }
    if (countryId === 'GB') {
      return `BBC NEWS: Constituency announcement for ${region.name}. Proportional seat distribution splits: ${playerSeats} seats go to ${party.name}.`;
    }
    return `GLOBAL PRESS: Results declared in ${region.name} of ${country.name}. ${party.name} wins ${playerSeats} parliamentary seats.`;
  };

  // Find player's winning coalition if any
  const getWinningCoalition = () => {
    if (!coalitions || coalitions.length === 0) return null;
    
    // Find all parties the player is allied with across all their coalitions
    const playerAllies = new Set<string>();
    coalitions.forEach(coal => {
      if (coal.parties.includes(party.name)) {
        coal.parties.forEach(p => playerAllies.add(p));
      }
    });
    
    if (playerAllies.size === 0) return null;
    
    const combinedSeats = Array.from(playerAllies).reduce((sum, partyName) => {
      if (partyName === party.name) {
        return sum + (seatsWon[party.id] || 0);
      }
      const rival = country.rivals.find(r => r.name === partyName);
      if (rival) {
        return sum + (seatsWon[rival.id] || 0);
      }
      return sum;
    }, 0);

    if (combinedSeats > country.seats / 2) {
      return {
        name: "Player Coalition Alliance",
        parties: Array.from(playerAllies),
        totalSeats: combinedSeats,
        ideologyAvg: "Broad Alliance"
      };
    }

    let isLargestBloc = true;
    const playerPartyId = party.id;
    if (seatsWon[playerPartyId] && !playerAllies.has(party.name)) {
      if ((seatsWon[playerPartyId] || 0) >= combinedSeats) {
        isLargestBloc = false;
      }
    }
    
    country.rivals.forEach(r => {
      if (!playerAllies.has(r.name)) {
        const rSeats = seatsWon[r.id] || 0;
        if (rSeats >= combinedSeats) {
          isLargestBloc = false;
        }
      }
    });

    coalitions.forEach(otherCoal => {
      if (!otherCoal.parties.includes(party.name)) {
        const otherCombined = otherCoal.parties.reduce((sum, pName) => {
          if (pName === party.name) return sum + (seatsWon[party.id] || 0);
          const r = country.rivals.find(riv => riv.name === pName);
          return sum + (r ? (seatsWon[r.id] || 0) : 0);
        }, 0);
        if (otherCombined >= combinedSeats) {
          isLargestBloc = false;
        }
      }
    });

    if (isLargestBloc) {
       return {
        name: "Player Coalition Alliance",
        parties: Array.from(playerAllies),
        totalSeats: combinedSeats,
        ideologyAvg: "Broad Alliance"
      };
    }
    return null;
  };

  // Determine Overall Victor Status
  const checkVictory = () => {
    if (coalitionSuccess === true) {
      return true;
    }

    const playerTotalSeats = seatsWon[party.id] || 0;
    
    // First check if there is a winning coalition
    const winningCoal = getWinningCoalition();
    if (winningCoal) {
      return true;
    }

    // Settle target thresholds base on model system
    if (country.system === 'Başkanlık Sistemi' || country.system === 'Presidential System') {
      // USA: Need > 270 out of 538 to win the Presidency
      return playerTotalSeats >= 270;
    } else {
      // General proportional: Must hold the HIGHEST seats (be the #1 largest party in Parliament)
      let isLargestValue = true;
      Object.entries(seatsWon).forEach(([id, val]) => {
        if (id !== party.id && val > playerTotalSeats) {
          isLargestValue = false;
        }
      });
      const singlePartyWin = isLargestValue && playerTotalSeats > 20;
      
      return singlePartyWin;
    }
  };

  const isVictor = checkVictory() || coalitionSuccess === true;
  const winningCoalition = getWinningCoalition() || (coalitionSuccess ? {
    name: "New Coalition Government",
    parties: [party.name, ...selectedCoalitionParties.map(id => country.rivals.find(r => r.id === id)?.name || '')],
    totalSeats: (seatsWon[party.id] || 0) + selectedCoalitionParties.reduce((sum, id) => sum + (seatsWon[id] || 0), 0),
    ideologyAvg: "Alliance"
  } : null);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className={`p-5 rounded-3xl border text-center relative overflow-hidden ${
        darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="text-rose-500 animate-pulse text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> {isOnePartyOrCommunist ? 'POLITICAL TRANSITION & REGIME COMMAND' : 'ELECTION DAY / GENERAL ELECTIONS IN PROGRESS'}
        </div>
        <h2 className="text-2xl font-black mt-1.5">{country.name} {isOnePartyOrCommunist ? 'State Transition Center' : 'Ballot Counting Center'}</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto font-medium">
          {isOnePartyOrCommunist 
            ? 'In a non-democratic or one-party state, power changes require revolutionary mobilization, military defection, internal politburo moves, or constituent assembly pressure.'
            : 'It is time to reap the rewards of your rallies, organization efforts, and legislative works in parliament. The public is voting!'}
        </p>

        {isAtWar && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-850 text-left flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-rose-300 block">⚔️ Simultaneous Wartime Election Underway</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {militaryReadiness >= 65 
                  ? 'High military readiness & frontline dominance inspire a patriotic "Rally \'Round the Flag" voter surge (+12% support).'
                  : militaryReadiness <= 40
                  ? 'Frontline strain and casualties have triggered anti-war voter discontent (-15% support penalty).'
                  : 'Active conflict ongoing. Public opinion is divided between wartime unity and casualty concerns.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SPECIAL REGIME OPERATION SCREEN (Communist / One-Party States) */}
      {step === 'regime_operation' && selectedOperation && (
        <div className={`p-6 rounded-3xl border flex flex-col items-center gap-6 ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          {!operationResult ? (
            <div className="w-full max-w-xl flex flex-col items-center gap-5 text-center">
              <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {selectedOperation === 'POPULAR_UPRISING' && <Users className="w-12 h-12 text-indigo-400 mx-auto" />}
                {selectedOperation === 'MILITARY_COUP' && <Swords className="w-12 h-12 text-rose-400 mx-auto" />}
                {selectedOperation === 'POLITBURO_OPERATION' && <Landmark className="w-12 h-12 text-amber-400 mx-auto" />}
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">COVERT TRANSITION PROTOCOL</span>
                <h3 className="text-xl font-black text-slate-100 mt-1">
                  {selectedOperation === 'POPULAR_UPRISING' && 'Launch Mass Popular Uprising & General Strike'}
                  {selectedOperation === 'MILITARY_COUP' && 'Execute Military Garrison Coup & Defection'}
                  {selectedOperation === 'POLITBURO_OPERATION' && 'Execute Politburo & Central Committee Putsch'}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {selectedOperation === 'POPULAR_UPRISING' && 'Mobilize civil disobedience, university strikes, and trade union walkouts to surround state ministries and force the regime to step down.'}
                  {selectedOperation === 'MILITARY_COUP' && 'Enlist patriotic tank brigades, mechanized divisions, and border garrisons to secure communication transmitters and state television.'}
                  {selectedOperation === 'POLITBURO_OPERATION' && 'Orchestrate an internal vote of no confidence and strategic executive action against the General Secretary / Chairman inside the palace.'}
                </p>
              </div>

              {/* Odds Calculation Card */}
              <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Success</span>
                  <span className={`text-2xl font-black font-mono ${
                    calculateOperationOdds(selectedOperation) >= 65 ? 'text-emerald-400' :
                    calculateOperationOdds(selectedOperation) >= 45 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {calculateOperationOdds(selectedOperation)}%
                  </span>
                </div>
                <div className="border-r border-slate-800 h-10"></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Key Traits Active</span>
                  <span className="text-xs font-bold text-slate-200">
                    {selectedOperation === 'POPULAR_UPRISING' && `Charisma (${party.traits.charisma}) & Eloquence (${party.traits.eloquence})`}
                    {selectedOperation === 'MILITARY_COUP' && `Strategy (${party.traits.strategy}) & Organization (${party.traits.organization})`}
                    {selectedOperation === 'POLITBURO_OPERATION' && `Strategy (${party.traits.strategy}) & Influence (${party.influence})`}
                  </span>
                </div>
              </div>

              {operationExecuting ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <span className="text-xs font-mono font-bold text-indigo-300 animate-pulse">
                    Deploying operatives & broadcasting revolutionary decree...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full max-w-sm">
                  <button
                    onClick={() => setStep('intro')}
                    className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleExecuteOperation(selectedOperation)}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    Execute Command
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Operation Results View */
            <div className="w-full max-w-lg flex flex-col items-center gap-5 text-center animate-fade-in">
              <div className={`p-4 rounded-full border ${
                operationResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-bounce' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              }`}>
                {operationResult.success ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>

              <div>
                <h3 className={`text-xl font-black ${operationResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {operationResult.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  {operationResult.message}
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block pb-1 border-b border-slate-800">Operational Log:</span>
                {operationResult.details.map((d, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className={operationResult.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              {operationResult.success ? (
                <button
                  onClick={() => {
                    const simulatedSeats: Record<string, number> = {
                      [party.id]: Math.ceil(country.seats * 0.65)
                    };
                    country.rivals.forEach((r, idx) => {
                      simulatedSeats[r.id] = Math.floor((country.seats * 0.35) / Math.max(1, country.rivals.length));
                    });
                    onElectionFinished(true, simulatedSeats);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer animate-pulse"
                >
                  Assume State Leadership & Paint the Map!
                </button>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => { setOperationResult(null); setStep('intro'); }}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Try Another Strategy
                  </button>
                  <button
                    onClick={() => onElectionFinished(false)}
                    className="flex-1 py-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer"
                  >
                    Abort & Regroup
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PHASE 1: GAME INTRO TO ELECTION DAY */}
      {step === 'intro' && (
        <div className={`p-6 rounded-3xl border flex flex-col items-center gap-6 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Authoritarian Regime Alert Banner */}
          {isAuthoritarian && !isOnePartyOrCommunist && (
            <div className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3 text-left">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
              <div>
                <strong className="block font-bold">Authoritarian Regime Alert (Heavy State Pressure)</strong>
                <span>In {country.name}, the incumbent state apparatus controls media outlets and administrative levers. Winning requires superior voter mobilization and grassroots popularity!</span>
              </div>
            </div>
          )}

          {/* Non-Democratic Communist Regime Selection Cards */}
          {isOnePartyOrCommunist ? (
            <div className="w-full space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3 text-left">
                <Shield className="w-6 h-6 shrink-0 text-rose-400" />
                <div>
                  <strong className="block font-bold">One-Party State / Non-Democratic Governance</strong>
                  <span>Direct multi-party parliamentary elections are constitutionally prohibited in {country.name}. Select a historical regime change vector below:</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Popular Uprising */}
                <button
                  onClick={() => { setSelectedOperation('POPULAR_UPRISING'); setStep('regime_operation'); }}
                  className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-900/30 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300 font-bold">Civic</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">Popular Uprising</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">Mobilize workers, students, and general strikes to occupy the central square and force regime surrender.</p>
                  </div>
                  <div className="text-[10px] text-indigo-400 font-mono font-bold flex items-center justify-between pt-2 border-t border-indigo-500/20">
                    <span>Charisma & Eloquence</span>
                    <span>{calculateOperationOdds('POPULAR_UPRISING')}% Odds →</span>
                  </div>
                </button>

                {/* 2. Military Coup */}
                <button
                  onClick={() => { setSelectedOperation('MILITARY_COUP'); setStep('regime_operation'); }}
                  className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/30 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                      <Swords className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-rose-500/20 px-2 py-0.5 rounded text-rose-300 font-bold">Military</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-rose-300 transition-colors">Military Garrison Coup</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">Enlist reformist colonels and armored units to secure state television and executive ministries.</p>
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono font-bold flex items-center justify-between pt-2 border-t border-rose-500/20">
                    <span>Strategy & Organization</span>
                    <span>{calculateOperationOdds('MILITARY_COUP')}% Odds →</span>
                  </div>
                </button>

                {/* 3. Politburo Operation */}
                <button
                  onClick={() => { setSelectedOperation('POLITBURO_OPERATION'); setStep('regime_operation'); }}
                  className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-bold">Palace</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition-colors">Politburo Putsch</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">Pass a no-confidence vote inside the Central Committee to depose the General Secretary from within.</p>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center justify-between pt-2 border-t border-amber-500/20">
                    <span>Strategy & Influence</span>
                    <span>{calculateOperationOdds('POLITBURO_OPERATION')}% Odds →</span>
                  </div>
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Or simulate a contested Constitutional Assembly referendum:</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Vote className="w-16 h-16 text-indigo-500 animate-bounce mx-auto" />
              <h3 className="text-xl font-bold tracking-tight">Are you ready to count the ballots?</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md font-medium">
                Welcome to the celebration of democracy. Your campaign budget has been locked and all districts have completed sealing the ballot boxes. Now, results from each district will be broadcast on live television one by one.
              </p>
            </div>
          )}

          {/* Settle Speed details */}
          <div className="flex items-center gap-3 bg-black/25 p-3 rounded-xl border border-slate-800 w-full max-w-sm justify-between">
            <span className="text-xs text-slate-400 font-mono">COUNTING SPEED</span>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUserSpeed(3000)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  userSpeed === 3000 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Slow
              </button>
              <button
                type="button"
                onClick={() => setUserSpeed(1500)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  userSpeed === 1500 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setUserSpeed(600)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  userSpeed === 600 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-955 text-slate-400 border-slate-800'
                }`}
              >
                Swift
              </button>
            </div>
          </div>

          <button
            id="start-counting-btn"
            onClick={() => setStep('counting')}
            className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.02] cursor-pointer transition-all"
          >
            {isOnePartyOrCommunist ? 'Begin Assembly Ballot Count' : 'Start Counting and Tune into Live Broadcast!'}
          </button>
        </div>
      )}

      {/* PHASE 2: COUNTING ANIMATIONS AND SCOREBOARDS */}
      {(step === 'counting' || step === 'results') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left panel: Active scoreboard tracker of seats won */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className={`p-5 rounded-3xl border h-full flex flex-col gap-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-bold tracking-tight uppercase text-slate-400 font-mono pb-2.5 border-b border-slate-500/10 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-400" /> Parliamentary Seat Manifest
              </h3>

              <div className="space-y-4 py-2 flex-grow">
                {/* Coalition Alliances Section if any exist */}
                {coalitions && coalitions.length > 0 && (
                  <div className="space-y-2 pb-2 border-b border-slate-500/10">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                      Active Coalitions
                    </span>
                    {coalitions.map((coal, cIdx) => {
                      const coalSeats = coal.parties.reduce((sum, pName) => {
                        if (pName === party.name || pName === party.id) return sum + (seatsWon[party.id] || 0);
                        const r = country.rivals.find(riv => riv.name === pName || riv.id === pName);
                        return sum + (r ? (seatsWon[r.id] || 0) : 0);
                      }, 0);
                      const isPlayerIn = coal.parties.includes(party.name);

                      return (
                        <div key={cIdx} className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col gap-1">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                            <span className="flex items-center gap-1 text-indigo-300">
                              🏛️ {coal.name} {isPlayerIn && <span className="text-[9px] text-amber-400 font-mono">(Your Alliance)</span>}
                            </span>
                            <span className="font-mono text-amber-400 font-bold">{coalSeats} Seats</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full rounded-full transition-all duration-300 bg-indigo-500"
                              style={{ width: `${(coalSeats / country.seats) * 100}%` }}
                            />
                          </div>
                          <div className="text-[9px] text-slate-400 flex flex-wrap gap-1 mt-0.5">
                            {coal.parties.map((pName, pIdx) => {
                              const pSeats = (pName === party.name || pName === party.id) 
                                ? (seatsWon[party.id] || 0) 
                                : (seatsWon[country.rivals.find(r => r.name === pName || r.id === pName)?.id || ''] || 0);
                              return (
                                <span key={pIdx} className="text-[9px] bg-slate-800/70 px-1.5 py-0.2 rounded font-mono">
                                  {pName}: {pSeats}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Own party seats */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }}></span>
                      {party.name} (You)
                    </span>
                    <span className="font-mono">
                      {seatsWon[party.id] || 0} Seats
                      {totalSeatsCounted > 0 && <span className="ml-2 text-[10px] text-slate-400">({((popularVotes[party.id] || 0) / totalSeatsCounted).toFixed(1)}%)</span>}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: party.color,
                        width: `${((seatsWon[party.id] || 0) / country.seats) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Rival parties list seats */}
                {country.rivals.map((rival) => {
                  const seats = seatsWon[rival.id] || 0;
                  return (
                    <div key={rival.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-450">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rival.color }}></span>
                          {rival.name}
                        </span>
                        <span className="font-mono text-slate-400">
                          {seats} Seats
                          {totalSeatsCounted > 0 && <span className="ml-2 text-[10px] text-slate-500">({((popularVotes[rival.id] || 0) / totalSeatsCounted).toFixed(1)}%)</span>}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div
                          className="h-full rounded-full transition-all duration-350"
                          style={{
                            backgroundColor: rival.color,
                            width: `${(seats / country.seats) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Requirement badge helper */}
              <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 text-[10px] text-slate-400 mt-auto leading-relaxed">
                {country.system === 'Başkanlık Sistemi' || country.system === 'Presidential System' ? (
                  <span>
                    Under the US Presidential System, there is no direct parliament. You need <strong className="text-amber-400">at least 270 electoral votes</strong> to claim the presidency.
                  </span>
                ) : (
                  <span>
                    To form a government, you must become the <strong className="text-amber-400">largest party in parliament</strong> (holding the highest number of representative seats).
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Region counting status cards & results output */}
          <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
            {/* Live TV reporting box */}
            <div className="rounded-3xl p-5 border border-red-500/30 bg-[#070b14] text-slate-100 relative overflow-hidden flex items-center gap-4">
              {/* LED red recording blinker */}
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-red-650/30 border border-red-500/20 text-[9px] font-bold rounded text-red-500 font-mono uppercase">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span> LIVE
              </div>

              <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-2xl shrink-0">
                <Tv className="w-8 h-8 text-red-500 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] text-red-500 font-bold uppercase font-mono tracking-wider">ELECTION RADAR TV BROADCAST</span>
                <p className="text-xs font-semibold font-sans mt-0.5 leading-snug">
                  "{newsTicker}"
                </p>
              </div>
            </div>

            {/* List of regions process blocks acting as a stylized Map */}
            {step === 'counting' && (
              <div className={`p-5 rounded-3xl border flex-grow ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono mb-3">ELECTORAL MAP STATUS ({countedRegions.length} / {country.regions.length})</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pr-1 max-h-[220px] overflow-y-auto">
                  {country.regions.map((reg, idx) => {
                    const isDone = countedRegions.includes(reg.id);
                    const isCurrent = currentRegionIndex === idx;
                    
                    let bgColor = 'bg-transparent';
                    let borderColor = 'border-slate-500/10';
                    let textColor = 'text-slate-500';
                    let winPartyName = '';
                    let displayValue = '';
                    
                    if (isDone) {
                      // Find winner of this region
                      let winnerId = party.id;
                      let max = reg.supports[party.id] || 0;
                      Object.entries(reg.supports).forEach(([pId, val]) => {
                         if ((val as number) > max) { max = (val as number); winnerId = pId; }
                      });
                      
                      const winnerColor = getPartyColor(winnerId);
                      winPartyName = getPartyName(winnerId);
                      displayValue = max.toFixed(1) + '%';
                      
                      bgColor = darkMode ? 'bg-opacity-20' : 'bg-opacity-10';
                      borderColor = 'border-opacity-50';
                      textColor = darkMode ? 'text-slate-200' : 'text-slate-800';
                      
                      return (
                        <div
                          id={`count-bar-${reg.id}`}
                          key={reg.id}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all shadow-sm`}
                          style={{ backgroundColor: `${winnerColor}33`, borderColor: winnerColor, color: textColor }}
                        >
                          <span className="text-[10px] font-bold mb-1 line-clamp-1">{reg.name}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: winnerColor }}>{displayValue}</span>
                          <span className="text-[8px] uppercase tracking-wider opacity-80 truncate w-full">{winPartyName}</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        id={`count-bar-${reg.id}`}
                        key={reg.id}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                            : 'bg-slate-500/5 border-slate-500/10 text-slate-500'
                        }`}
                      >
                        {isCurrent ? (
                          <RefreshCw className="w-4 h-4 mb-1.5 text-indigo-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 mb-1.5 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                          </div>
                        )}
                        <span className="text-[10px] font-bold line-clamp-1">{reg.name}</span>
                        <span className="text-[9px] opacity-60 font-mono">{isCurrent ? 'COUNTING' : 'WAITING'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FINAL RESULTS VERDICT */}
            {step === 'results' && (
              <div className={`p-6 rounded-3xl border flex-grow flex flex-col justify-center items-center text-center gap-4 ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                {isVictor ? (
                  <>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-full animate-bounce">
                      <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-amber-500">
                        {winningCoalition ? 'Government Formed via Coalition!' : 'Historic Election Victory Achieved!'}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mt-1.5 font-medium">
                        {winningCoalition ? (
                          <span>
                            Won as coalition with <strong>{winningCoalition.parties.filter(p => p !== party.name).join(', ')}</strong>! 
                            Together, your alliance has commanded a total of <strong>{
                              winningCoalition.parties.reduce((sum, pName) => sum + (pName === party.name ? (seatsWon[party.id] || 0) : (seatsWon[country.rivals.find(r => r.name === pName)?.id || ''] || 0)), 0)
                            }</strong> seats, establishing a stable democratic majority!
                          </span>
                        ) : (
                          <span>
                            Congratulations leader! You have won the election in {country.name} with {seatsWon[party.id] || 0} representative seats. The election commission has officially certified your historic victory!
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Coalition & Parliamentary Blocs Breakdown Card */}
                    <div className="w-full max-w-md p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-left space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                        <span>🏛️ Coalition & Parliamentary Blocs</span>
                        <span>Seats (% of House)</span>
                      </div>
                      
                      {/* Player Coalition or Standalone Party */}
                      {winningCoalition ? (
                        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                            <span className="text-amber-400 flex items-center gap-1">
                              👑 {winningCoalition.name} (Ruling Majority)
                            </span>
                            <span className="font-mono text-amber-400">
                              {winningCoalition.parties.reduce((sum, pName) => sum + (pName === party.name ? (seatsWon[party.id] || 0) : (seatsWon[country.rivals.find(r => r.name === pName)?.id || ''] || 0)), 0)} / {country.seats}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 flex flex-wrap gap-1.5 pt-1 border-t border-indigo-500/20">
                            {winningCoalition.parties.map((pName, idx) => {
                              const isMe = pName === party.name;
                              const pSeats = isMe ? (seatsWon[party.id] || 0) : (seatsWon[country.rivals.find(r => r.name === pName)?.id || ''] || 0);
                              return (
                                <span key={idx} className="font-mono text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                                  {pName}: <strong className="text-slate-200">{pSeats}</strong>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-slate-200">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }}></span>
                            {party.name} (Single-Party Majority)
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">{seatsWon[party.id] || 0} Seats</span>
                        </div>
                      )}

                      {/* Opposition Parties */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase">Opposition Benches:</span>
                        {country.rivals.filter(r => !winningCoalition?.parties.includes(r.name)).map(r => {
                          const seats = seatsWon[r.id] || 0;
                          return (
                            <div key={r.id} className="flex justify-between items-center text-[11px] px-2 py-1 rounded bg-slate-900/30 text-slate-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span>
                                {r.name}
                              </span>
                              <span className="font-mono text-slate-400">{seats} Seats ({((seats / country.seats) * 100).toFixed(1)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-8 text-xs font-mono w-full max-w-sm justify-center">
                      <div>
                        <div className="text-slate-450">PARLIAMENT WON</div>
                        <div className="text-sm font-bold text-emerald-400">{country.parliamentName}</div>
                      </div>
                      <div className="border-l border-slate-800 h-8"></div>
                      <div>
                        <div className="text-slate-450">{winningCoalition ? 'COALITION SEATS' : 'SEATS WON'}</div>
                        <div className="text-lg font-black text-amber-500">
                          {winningCoalition ? winningCoalition.parties.reduce((sum, pName) => sum + (pName === party.name ? (seatsWon[party.id] || 0) : (seatsWon[country.rivals.find(r => r.name === pName)?.id || ''] || 0)), 0) : seatsWon[party.id]} / {country.seats}
                        </div>
                      </div>
                    </div>

                    <button
                      id="save-success-return-btn"
                      onClick={() => onElectionFinished(true, seatsWon, winningCoalition)}
                      className="px-8 py-3.5 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer mt-2 group animate-pulse"
                    >
                      Color the Map & Expand Globally! <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-rose-400">Parliamentary Majority Unreached</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto mt-1 font-medium">
                        Unfortunately, with only {seatsWon[party.id] || 0} seats inside the parliament, you did not win a single-party majority or become the largest party.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-8 text-xs font-mono w-full max-w-sm justify-center">
                      <div>
                        <div className="text-slate-450">REQUIRED SEATS</div>
                        <div className="text-sm font-bold text-rose-450">Majority Goal</div>
                      </div>
                      <div className="border-l border-slate-850 h-8"></div>
                      <div>
                        <div className="text-slate-450">YOUR SEATS</div>
                        <div className="text-md font-bold text-slate-300">{seatsWon[party.id] || 0} / {country.seats}</div>
                      </div>
                    </div>

                    {country.system !== 'Başkanlık Sistemi' && country.system !== 'Presidential System' ? (
                      /* HUNG PARLIAMENT / COALITION CONFLICT INTERACTIVE VIEW */
                      <div className={`p-5 rounded-2xl border text-left flex flex-col gap-4 w-full mt-2 ${
                        darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <span className="text-[9px] tracking-widest font-mono text-indigo-400 font-bold uppercase block">HUNG PARLIAMENTARY CHAMBER</span>
                          <h4 className="text-sm font-bold text-slate-200 mt-1">Negotiate Coalition Government</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-normal">
                            No single party has achieved an absolute majority ({Math.ceil(country.seats / 2)} seats). Choose other parties below to form a majority coalition government with you!
                          </p>
                        </div>

                        {/* List of other parties */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          {country.rivals.map((rival) => {
                            const seats = seatsWon[rival.id] || 0;
                            const isSelected = selectedCoalitionParties.includes(rival.id);
                            const chance = getAgreementChance(rival.id);
                            
                            return (
                              <button
                                key={rival.id}
                                type="button"
                                onClick={() => {
                                  if (coalitionSuccess) return;
                                  if (isSelected) {
                                    setSelectedCoalitionParties(selectedCoalitionParties.filter(id => id !== rival.id));
                                  } else {
                                    setSelectedCoalitionParties([...selectedCoalitionParties, rival.id]);
                                  }
                                  setCoalitionNegotiated(false);
                                  setCoalitionSuccess(null);
                                }}
                                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 relative cursor-pointer ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: rival.color }}>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rival.color }}></span>
                                    {rival.name}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-slate-300">{seats} Seats</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 border-t border-slate-800/60 pt-1.5 w-full">
                                  <span>Ideology: <strong className="text-slate-300">{rival.ideology}</strong></span>
                                  <span className="font-mono">Sync Chance: <strong className={chance >= 70 ? 'text-emerald-400' : chance >= 40 ? 'text-amber-400' : 'text-rose-400'}>{chance}%</strong></span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Coalition Summary stats bar */}
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex flex-wrap justify-between items-center text-xs gap-3">
                          <div>
                            <span className="text-slate-400">Combined Coalition Seats: </span>
                            <strong className="text-sm font-black text-indigo-400">
                              { (seatsWon[party.id] || 0) + selectedCoalitionParties.reduce((sum, id) => sum + (seatsWon[id] || 0), 0) } / {country.seats}
                            </strong>
                            <span className="text-[10px] text-slate-500 ml-1">({Math.ceil(country.seats / 2)} required)</span>
                          </div>

                          {/* Proposal trigger */}
                          {((seatsWon[party.id] || 0) + (coalitions?.filter(c => c.parties.includes(party.name)).flatMap(c => c.parties).filter((v, i, a) => a.indexOf(v) === i && v !== party.name).reduce((sum, p) => sum + (seatsWon[country.rivals.find(r=>r.name===p)?.id || ''] || 0), 0) || 0) + selectedCoalitionParties.reduce((sum, id) => sum + (seatsWon[id] || 0), 0)) > country.seats / 2 ? (
                            <button
                              type="button"
                              disabled={coalitionSuccess === true}
                              onClick={() => {
                                playSound('click');
                                // Roll chance
                                const avgChance = selectedCoalitionParties.reduce((sum, id) => sum + getAgreementChance(id), 0) / selectedCoalitionParties.length;
                                const roll = Math.random() * 100;
                                setCoalitionNegotiated(true);
                                if (roll <= avgChance) {
                                  setCoalitionSuccess(true);
                                  setCoalitionMessage(`Success! The partner parties have accepted the coalition agreement. Together, you form a stable majority government in ${country.name}!`);
                                  playSound('success');
                                } else {
                                  setCoalitionSuccess(false);
                                  setCoalitionMessage(`Negotiation failed. The ideological friction was too high or negotiations broke down on cabinet seats. Try a different partner party!`);
                                  playSound('error');
                                }
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-550 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                            >
                              Propose Coalition Government
                            </button>
                          ) : (
                            <span className="text-[10px] text-rose-450 font-bold">Select partners to reach a majority</span>
                          )}
                        </div>

                        {/* Negotiation feedback */}
                        {coalitionNegotiated && (
                          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            coalitionSuccess
                              ? 'bg-emerald-950/20 border-emerald-850 text-emerald-400'
                              : 'bg-rose-950/20 border-rose-850 text-rose-450'
                          }`}>
                            <strong className="block mb-0.5">{coalitionSuccess ? '✓ Protocol Signed' : '✗ Protocol Rejected'}</strong>
                            {coalitionMessage}

                            {coalitionSuccess && (
                              <button
                                type="button"
                                onClick={() => {
                                  const partnerNames = selectedCoalitionParties.map(id => country.rivals.find(r => r.id === id)?.name || id);
                                  const partnerSeatsSum = selectedCoalitionParties.reduce((sum, id) => sum + (seatsWon[id] || 0), 0);
                                  const totalCoalitionSeats = (seatsWon[party.id] || 0) + partnerSeatsSum;
                                  const newCoalitionObj: Coalition = {
                                    name: `National Coalition Alliance`,
                                    parties: [party.name, ...partnerNames],
                                    totalSeats: totalCoalitionSeats,
                                    ideologyAvg: `${party.ideology} / Broad Coalition`
                                  };
                                  onElectionFinished(true, seatsWon, newCoalitionObj);
                                }}
                                className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 animate-pulse"
                              >
                                <Trophy className="w-4 h-4 text-slate-950" />
                                Form Majority Coalition Government ({ (seatsWon[party.id] || 0) + selectedCoalitionParties.reduce((sum, id) => sum + (seatsWon[id] || 0), 0) } Seats)
                              </button>
                            )}
                          </div>
                        )}

                        {/* Other Rival AI-to-AI coalitions running in parliament */}
                        <div className="border-t border-slate-800 pt-3 mt-1">
                          <span className="text-[9px] tracking-widest font-mono text-slate-500 font-bold uppercase block">Rival AI-to-AI Coalition Attempts</span>
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="p-2 bg-slate-900/40 border border-slate-800 rounded-lg flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-medium">🛡️ Conservative-Nationalist Alliance</span>
                              <span className="font-mono text-slate-300">
                                {country.rivals.filter(r => r.ideology === 'Muhafazakar' || r.ideology === 'Milliyetçi').reduce((sum, r) => sum + (seatsWon[r.id] || 0), 0)} Seats
                              </span>
                            </div>
                            <div className="p-2 bg-slate-900/40 border border-slate-800 rounded-lg flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 font-medium">🌿 Social-Green Progressive Front</span>
                              <span className="font-mono text-slate-300">
                                {country.rivals.filter(r => r.ideology === 'Sosyal Demokrat' || r.ideology === 'Ekolojist' || r.ideology === 'Sosyalist').reduce((sum, r) => sum + (seatsWon[r.id] || 0), 0)} Seats
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Standard failure action return */}
                    {(!coalitionSuccess) && (
                      <button
                        id="save-fail-return-btn"
                        onClick={() => onElectionFinished(false)}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-500/10 border border-slate-500/15 text-slate-300 hover:bg-slate-500/20 transition-all cursor-pointer mt-4"
                      >
                        Return to Dashboard & Evolve Leadership
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
