/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Country, Party, Region } from '../types';
import { playSound } from '../lib/sounds';
import { 
  Vote, Award, Trophy, ArrowRight, HelpCircle, AlertTriangle, 
  Tv, BarChart2, CheckCircle2, ChevronRight, RefreshCw, XCircle 
} from 'lucide-react';

interface ElectionSimulatorProps {
  country: Country;
  party: Party;
  onElectionFinished: (success: boolean) => void;
  darkMode: boolean;
}

export const ElectionSimulator: React.FC<ElectionSimulatorProps> = ({
  country,
  party,
  onElectionFinished,
  darkMode,
}) => {
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const [countedRegions, setCountedRegions] = useState<string[]>([]);
  const [seatsWon, setSeatsWon] = useState<Record<string, number>>({});
  const [newsTicker, setNewsTicker] = useState<string>('Polls closed, counting phase begins...');
  const [step, setStep] = useState<'intro' | 'counting' | 'results'>('intro');
  const [userSpeed, setUserSpeed] = useState<number>(2000); // ms per region

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
        const regionSupports = region.supports;

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

  // Determine Overall Victor Status
  const checkVictory = () => {
    const playerTotalSeats = seatsWon[party.id] || 0;
    
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
      return isLargestValue && playerTotalSeats > 20; // Safe threshold of seats
    }
  };

  const isVictor = checkVictory();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className={`p-5 rounded-3xl border text-center relative overflow-hidden ${
        darkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="text-rose-500 animate-pulse text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ELECTION DAY / GENERAL ELECTIONS IN PROGRESS
        </div>
        <h2 className="text-2xl font-black mt-1.5">{country.name} Ballot Counting Center</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto font-medium">
          It is time to reap the rewards of your rallies, organization efforts, and legislative works in parliament. The public is voting!
        </p>
      </div>

      {/* PHASE 1: GAME INTRO TO ELECTION DAY */}
      {step === 'intro' && (
        <div className={`p-6 rounded-3xl border flex flex-col items-center gap-6 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-center space-y-2">
            <Vote className="w-16 h-16 text-indigo-500 animate-bounce mx-auto" />
            <h3 className="text-xl font-bold tracking-tight">Are you ready to count the ballots?</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-medium">
              Welcome to the celebration of democracy. Your campaign budget has been locked and all districts have completed sealing the ballot boxes. Now, results from each district will be broadcast on live television one by one.
            </p>
          </div>

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
            className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.02] cursor-pointer transition-all"
          >
            Start Counting and Tune into Live Broadcast!
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
                {/* Own party seats */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }}></span>
                      {party.name} (You)
                    </span>
                    <span className="font-mono">{seatsWon[party.id] || 0} Seats</span>
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
                        <span className="font-mono text-slate-400">{seats} Seats</span>
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

            {/* List of regions process blocks */}
            {step === 'counting' && (
              <div className={`p-5 rounded-3xl border flex-grow ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono mb-3">DISTRICT COUNTING PROCESS ({countedRegions.length} / {country.regions.length})</h4>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {country.regions.map((reg, idx) => {
                    const isDone = countedRegions.includes(reg.id);
                    const isCurrent = currentRegionIndex === idx;

                    return (
                      <div
                        id={`count-bar-${reg.id}`}
                        key={reg.id}
                        className={`p-3 rounded-xl border flex justify-between items-center text-xs transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/20 border-indigo-500'
                            : isDone
                            ? 'bg-slate-500/5 border-slate-500/10 text-slate-400'
                            : 'bg-transparent border-slate-500/5 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                          ) : (
                            <span className="w-2 h-2 rounded bg-slate-500 shrink-0"></span>
                          )}
                          <span className="font-bold">{reg.name}</span>
                        </div>

                        <span className="font-mono">
                          {isCurrent ? (
                            <span className="text-indigo-400 font-bold animate-pulse">COUNTING</span>
                          ) : isDone ? (
                            <span>100% Completed</span>
                          ) : (
                            <span>Sealed & Waiting</span>
                          )}
                        </span>
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
                      <h3 className="text-2xl font-black text-amber-500">Historic Election Victory Achieved!</h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mt-1.5 font-medium">
                        Congratulations leader! You have won the election in {country.name} with {seatsWon[party.id] || 0} representative seats. The election commission has officially certified your historic victory!
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-8 text-xs font-mono w-full max-w-sm justify-center">
                      <div>
                        <div className="text-slate-450">PARLIAMENT WON</div>
                        <div className="text-sm font-bold text-emerald-400">{country.parliamentName}</div>
                      </div>
                      <div className="border-l border-slate-800 h-8"></div>
                      <div>
                        <div className="text-slate-450">SEATS WON</div>
                        <div className="text-lg font-black text-amber-500">{seatsWon[party.id]} / {country.seats}</div>
                      </div>
                    </div>

                    <button
                      id="save-success-return-btn"
                      onClick={() => onElectionFinished(true)}
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
                      <p className="text-xs text-slate-450 leading-relaxed max-w-md mx-auto mt-1 font-medium">
                        Unfortunately, with only {seatsWon[party.id] || 0} seats inside the parliament, you fell behind opponent coalitions. Please reform your party traits/charter and try again in {country.name}.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-8 text-xs font-mono w-full max-w-sm justify-center">
                      <div>
                        <div className="text-slate-450">REQUIRED SEATS</div>
                        <div className="text-sm font-bold text-rose-400">Majority Goal</div>
                      </div>
                      <div className="border-l border-slate-800 h-8"></div>
                      <div>
                        <div className="text-slate-450">YOUR SEATS</div>
                        <div className="text-md font-bold text-slate-300">{seatsWon[party.id] || 0} Seats</div>
                      </div>
                    </div>

                    <button
                      id="save-fail-return-btn"
                      onClick={() => onElectionFinished(false)}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-500/10 border border-slate-500/15 text-slate-300 hover:bg-slate-500/20 transition-all cursor-pointer mt-2"
                    >
                      Return to Dashboard & Evolve Leadership
                    </button>
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
