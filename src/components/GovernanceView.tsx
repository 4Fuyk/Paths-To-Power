import React, { useState } from 'react';
import { Country, Party, RivalParty } from '../types';
import { playSound } from '../lib/sounds';
import { 
  TrendingUp, ShieldAlert, Heart, Landmark, Scale, AlertTriangle, 
  Trash2, UserX, ShieldCheck, HelpCircle, Check, Coins, Users, Zap
} from 'lucide-react';

interface GovernanceViewProps {
  country: Country;
  party: Party;
  isRuling: boolean;
  onSetRuling: (ruling: boolean) => void;
  taxRates: { income: number; corporate: number; vat: number; tariffs: number };
  onUpdateTaxRates: (updatedRates: any) => void;
  investorConfidence: number;
  onUpdateInvestorConfidence: (confidence: number) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  inflation: number;
  onUpdateInflation: (updatedInflation: number) => void;
  freedomIndex: number;
  onUpdateFreedomIndex: (freedom: number) => void;
  bannedParties: string[];
  onUpdateBannedParties: (updatedBanned: string[]) => void;
  civilWarRisk: number;
  onUpdateCivilWarRisk: (risk: number) => void;
  publicApprovalImpact: (approvalChange: number) => void;
  darkMode: boolean;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({
  country,
  party,
  isRuling,
  onSetRuling,
  taxRates,
  onUpdateTaxRates,
  investorConfidence,
  onUpdateInvestorConfidence,
  treasury,
  onUpdateTreasury,
  inflation,
  onUpdateInflation,
  freedomIndex,
  onUpdateFreedomIndex,
  bannedParties,
  onUpdateBannedParties,
  civilWarRisk,
  onUpdateCivilWarRisk,
  publicApprovalImpact,
  darkMode,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'TAXATION' | 'POLITICS' | 'COALITION'>('TAXATION');

  // Coalition State
  const [coalitionPartners, setCoalitionPartners] = useState<string[]>([]);
  
  const getCurrencySymbol = () => {
    if (country.id === 'US') return '$';
    if (country.id === 'TR') return '₺';
    if (country.id === 'DE') return '€';
    if (country.id === 'GB') return '£';
    if (country.id === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrencySymbol();

  // 1) Tax Slider Handlers
  const handleTaxChange = (type: 'income' | 'corporate' | 'vat' | 'tariffs', val: number) => {
    const nextRates = { ...taxRates, [type]: val };
    onUpdateTaxRates(nextRates);

    // Compute dynamic feedback effects
    let nextConfidence = 75;
    let nextInflation = 3.5;

    // Corporate tax lowers confidence
    nextConfidence -= (nextRates.corporate - 20) * 1.5;
    // Tariffs increase inflation
    nextInflation += (nextRates.tariffs - 10) * 0.25;

    // Bound values
    nextConfidence = Math.min(100, Math.max(10, Math.round(nextConfidence)));
    nextInflation = Math.min(15, Math.max(0.5, parseFloat(nextInflation.toFixed(1))));

    onUpdateInvestorConfidence(nextConfidence);
    onUpdateInflation(nextInflation);

    // Dynamic popularity effect
    let approvalDelta = 0;
    if (nextRates.income > 25) approvalDelta -= 2;
    if (nextRates.vat > 18) approvalDelta -= 2;
    if (nextRates.corporate < 15) approvalDelta += 1; // business loves it

    if (approvalDelta !== 0) {
      publicApprovalImpact(approvalDelta);
    }
  };

  // State Treasury Revenue Estimator
  const getWeeklyTaxRevenue = () => {
    const baseRevenue = 150000;
    const incomeFactor = taxRates.income / 25;
    const corpFactor = (taxRates.corporate / 20) * (investorConfidence / 100);
    const vatFactor = taxRates.vat / 18;
    const tariffFactor = taxRates.tariffs / 10;

    const totalRev = baseRevenue * (incomeFactor + corpFactor + vatFactor + tariffFactor) / 4;
    return Math.round(totalRev);
  };

  // 2) Adjust Subsidies
  const handleInvestmentIncentive = () => {
    const cost = 45000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient Funds: Sponsoring a National Enterprise Subsidy requires ${currency}${cost.toLocaleString()} from the treasury.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateTreasury(treasury - cost);
    onUpdateInvestorConfidence(Math.min(100, investorConfidence + 15));
    publicApprovalImpact(5); // increase voter approval by 5%
    playSound('success');
    setSuccessMessage(`National Subsidy activated! Sourced ${currency}${cost.toLocaleString()} into local manufacturing and green sectors. Investor confidence jumped +15% and domestic approval increased +5%.`);
    setErrorMessage(null);
  };

  // 3) Coalition Building
  const handleToggleCoalition = (partnerId: string) => {
    if (coalitionPartners.includes(partnerId)) {
      setCoalitionPartners(coalitionPartners.filter(id => id !== partnerId));
      playSound('error');
    } else {
      setCoalitionPartners([...coalitionPartners, partnerId]);
      playSound('success');
    }
    setSuccessMessage(`Coalition structure updated. Parliamentary seat majority recalculating.`);
  };

  // 4) Ban Opposition Party
  const handleBanParty = (rival: RivalParty) => {
    if (bannedParties.includes(rival.id)) return;

    const nextBanned = [...bannedParties, rival.id];
    onUpdateBannedParties(nextBanned);

    // Drastic dropping of Freedom Index
    const nextFreedom = Math.max(5, freedomIndex - 25);
    onUpdateFreedomIndex(nextFreedom);

    // Compute revolt / civil war risk
    // If the banned party is popular or Freedom Index gets critical, risk surges
    let addedRisk = Math.round(rival.baseSupport * 1.5);
    if (nextFreedom < 40) addedRisk += 25;

    const nextRisk = Math.min(100, civilWarRisk + addedRisk);
    onUpdateCivilWarRisk(nextRisk);

    playSound('error');

    let feedback = `POLITICAL CRISIS: You have officially Banned the [${rival.name}] party, locking down their headquarters and arresting top delegates! `;
    feedback += `Freedom Index plummeted by -25. Due to their ${rival.baseSupport}% base popularity, Civil War Revolt Risk increased by +${addedRisk}%!`;

    // Civil War Trigger Check!
    if (nextRisk > 60) {
      // Trigger instant warning / revolt consequence!
      feedback += ` WARNING: Armed rebel militias sympathetic to ${rival.name} are mobilizing in rural sectors! Civil War Risk is CRITICAL!`;
    }

    setSuccessMessage(feedback);
    setErrorMessage(null);
  };

  // 5) Popular Uprising (Armed Revolution bypass if in opposition)
  const handlePopularUprising = () => {
    // Requires low country freedom or government popularity + high risk
    if (freedomIndex > 50) {
      playSound('error');
      setErrorMessage(`Uprising Failed: The ruling regime retains strong institutional legitimacy. You must reduce the current regime's Freedom Index or wait for peak public anger.`);
      return;
    }

    const roll = Math.random();
    if (roll > 0.4) {
      // Success!
      onSetRuling(true);
      onUpdateFreedomIndex(Math.max(10, freedomIndex - 15));
      playSound('success');
      setSuccessMessage(`REVOLUTION SUCCESSFUL! Armed opposition coalitions successfully stormed the executive presidential palace, seized communication channels, and dissolved the parliament. You are now the Supreme Sovereign Ruler!`);
    } else {
      // Failed revolt
      publicApprovalImpact(-15);
      playSound('error');
      setErrorMessage(`UPRISING CRUSHED: State security services neutralized the rebel logistics hubs. Opposition delegates have been jailed and your overall public popularity dropped by -15%.`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* State Dashboard Header */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 animate-pulse">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-amber-450 font-bold uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> STATE EXECUTIVE EXECUTIVE OFFICE
            </span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">Government Executive Panel</h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRuling 
                ? `Manage national taxation, set budget incentives, dictate party bans, or construct legislative coalitions.`
                : `Opposition Phase: Monitor the ruling regime's statistics. Forge coalitions or coordinate a popular uprising.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400">TREASURY</span>
            <span className="text-xl font-black text-emerald-400">{currency}{treasury.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400">FREEDOM INDEX</span>
            <span className="text-xl font-black text-rose-400">{freedomIndex}/100</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Internal Sub Navigation tabs */}
      <div className="flex gap-2 border-b border-slate-500/10 pb-1">
        <button
          onClick={() => setActiveSubTab('TAXATION')}
          className={`px-4 py-2 font-bold text-xs tracking-wider uppercase transition-all border-b-2 ${
            activeSubTab === 'TAXATION'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-350'
          }`}
        >
          Adjustable Taxation & Economy
        </button>
        <button
          onClick={() => setActiveSubTab('COALITION')}
          className={`px-4 py-2 font-bold text-xs tracking-wider uppercase transition-all border-b-2 ${
            activeSubTab === 'COALITION'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-350'
          }`}
        >
          Legislative Coalition
        </button>
        <button
          onClick={() => setActiveSubTab('POLITICS')}
          className={`px-4 py-2 font-bold text-xs tracking-wider uppercase transition-all border-b-2 ${
            activeSubTab === 'POLITICS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-350'
          }`}
        >
          Party Bans & Regime State
        </button>
      </div>

      {/* TAB 1: TAXATION */}
      {activeSubTab === 'TAXATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase pb-2 border-b border-slate-500/10 mb-4">
                National Tax Administration
              </h3>

              <div className="space-y-6">
                {/* Income Tax */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-350">Personal Income Tax Rate</span>
                    <span className="font-extrabold text-indigo-400">{taxRates.income}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={taxRates.income}
                    onChange={(e) => handleTaxChange('income', parseInt(e.target.value))}
                    disabled={!isRuling}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (Low Revenue, High Approval)</span>
                    <span>50% (Peak Revenue, High Civil Anger)</span>
                  </div>
                </div>

                {/* Corporate Tax */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-350">Corporate Tax Rate (Businesses)</span>
                    <span className="font-extrabold text-indigo-400">{taxRates.corporate}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={taxRates.corporate}
                    onChange={(e) => handleTaxChange('corporate', parseInt(e.target.value))}
                    disabled={!isRuling}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (Attracts Investment, Tax Haven)</span>
                    <span>45% (High Revenue, Severe Capital Flight risk)</span>
                  </div>
                </div>

                {/* Value Added Tax (VAT) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-350">Value Added Tax (VAT)</span>
                    <span className="font-extrabold text-indigo-400">{taxRates.vat}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={taxRates.vat}
                    onChange={(e) => handleTaxChange('vat', parseInt(e.target.value))}
                    disabled={!isRuling}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>5% (Welfare Boost, Low Inflation)</span>
                    <span>25% (Hits Working Class support, Sparks strikes)</span>
                  </div>
                </div>

                {/* Tariffs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-350">Import Tariffs & Duties</span>
                    <span className="font-extrabold text-indigo-400">{taxRates.tariffs}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={taxRates.tariffs}
                    onChange={(e) => handleTaxChange('tariffs', parseInt(e.target.value))}
                    disabled={!isRuling}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0% (Free Trade, Lowers Inflation)</span>
                    <span>30% (Protectionist, Agitates foreign trade allies)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fiscal Indicators & Subsidies (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase pb-2 border-b border-slate-500/10 mb-4">
                FISCAL RADAR
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Weekly Estimated Revenue:</span>
                  <span className="font-bold text-emerald-400">+{currency}{getWeeklyTaxRevenue().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Investor Confidence:</span>
                  <span className={`font-bold ${investorConfidence > 60 ? 'text-indigo-400' : 'text-rose-450'}`}>{investorConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consumer Inflation:</span>
                  <span className="font-bold text-amber-500">{inflation}%</span>
                </div>

                <div className="pt-3 border-t border-slate-500/10">
                  <h4 className="font-extrabold text-xs text-slate-200">Investment Incentives</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Sponsor high-tech & rural subsidies. Restores investor confidence and keeps domestic inflation in check.
                  </p>
                  <button
                    onClick={handleInvestmentIncentive}
                    disabled={!isRuling}
                    className={`w-full py-2.5 mt-3.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer ${
                      !isRuling ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    Deploy National Subsidies (-{currency}45,000)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COALITION */}
      {activeSubTab === 'COALITION' && (
        <div className={`p-5 rounded-3xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase pb-2 border-b border-slate-500/10 mb-4">
            Parliamentary Coalition Builder
          </h3>
          <p className="text-xs text-slate-400 mb-5 max-w-xl leading-relaxed">
            If your party does not hold a absolute 50%+ seat majority, you can partner with ideological allies to form a stable majority coalition block. Invite rivals into your cabinet to prevent votes of no-confidence!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.rivals.map((rival) => {
              const joined = coalitionPartners.includes(rival.id);
              return (
                <div
                  key={rival.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                    joined
                      ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-black/15 border-slate-500/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rival.color }}></span>
                        {rival.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">Leader: {rival.leader}</span>
                      <span className="text-[10px] text-indigo-400 mt-0.5 block">Ideology: {rival.ideology}</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-500/5 border border-slate-500/10 px-2 py-0.5 rounded">
                      {rival.baseSupport}% Seats
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleCoalition(rival.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      joined
                        ? 'bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-400'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {joined ? 'Sever Coalition Alliance' : 'Invite into Coalition'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: POLITICS & BANS */}
      {activeSubTab === 'POLITICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase pb-2 border-b border-slate-500/10 mb-4">
                Opponent Suppression & Regime Safety
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Ban destabilizing rival factions to permanently consolidate legislative control. Banning opposition parties ensures your supremacy but reduces the Freedom Index, sparking riots and surging the overall Civil War risk.
              </p>

              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {country.rivals.map((rival) => {
                  const banned = bannedParties.includes(rival.id);

                  return (
                    <div
                      key={rival.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                        banned
                          ? 'opacity-40 bg-rose-950/15 border-rose-500/20'
                          : darkMode ? 'bg-slate-950/30 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: rival.color }}></span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-100">{rival.name}</h4>
                            {banned && (
                              <span className="text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-full uppercase animate-pulse">
                                ILLEGAL / BANNED
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Leader: <strong>{rival.leader}</strong> | Ideology: <strong>{rival.ideology}</strong>
                          </p>
                        </div>
                      </div>

                      {!banned ? (
                        <button
                          type="button"
                          onClick={() => handleBanParty(rival)}
                          disabled={!isRuling}
                          className={`px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-400 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1 ${
                            !isRuling ? 'opacity-40 pointer-events-none' : ''
                          }`}
                        >
                          <UserX className="w-4 h-4" /> Ban Party
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-slate-500" /> Suppression Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Regime Safety & Armed Uprisings */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Regime safety metrics */}
            <div className={`p-5 rounded-3xl border ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 pb-2 border-b border-slate-500/10 mb-3.5 uppercase">
                SECURITY CORRIDOR
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Civil War / Revolt Risk:</span>
                  <span className={`font-black font-mono px-2 py-0.5 rounded ${
                    civilWarRisk > 50 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                    civilWarRisk > 25 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {civilWarRisk}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed bg-black/10 p-2 rounded-xl border border-slate-500/5">
                  Keep Revolt Risk below 45% by maintaining higher civil freedoms, holding assemblies, or assigning strong defense ministers.
                </p>
              </div>
            </div>

            {/* Armed Opposition Uprising bypass trigger */}
            {!isRuling && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-900/40 to-slate-900/40 border border-rose-500/30 text-slate-100 flex flex-col gap-3">
                <h4 className="font-extrabold text-xs text-rose-400 flex items-center gap-1 uppercase">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> Popular Opposition Uprising
                </h4>
                <p className="text-[11px] text-slate-350 leading-relaxed">
                  Legitimate campaigns take weeks. If the current regime has suppressed civil liberties (Freedom Index below 50), bypass the ballot box and launch an armed storming of the executive palace!
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Current Regime Freedom: <strong className="text-rose-400">{freedomIndex}/100</strong>
                </div>
                <button
                  onClick={handlePopularUprising}
                  className="w-full py-2.5 bg-rose-650 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer text-center"
                >
                  Initiate Palace Storming
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
