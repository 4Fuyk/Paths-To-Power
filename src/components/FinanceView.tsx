/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { 
  Coins, 
  Users, 
  Landmark, 
  Sparkles, 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  Swords, 
  ShieldAlert, 
  Package, 
  Hammer, 
  Globe, 
  HandCoins, 
  FileText,
  TrendingUp,
  ArrowUpRight,
  Ship
} from 'lucide-react';

interface FinanceViewProps {
  country: Country;
  party: Party;
  onUpdateCountry: (updatedCountry: Country) => void;
  onUpdateParty: (updatedParty: Party) => void;
  darkMode: boolean;
  isRuling?: boolean;
  treasury?: number;
  onUpdateTreasury?: (updatedTreasury: number) => void;
  isCivilWarMode?: boolean;
  foreignAidPackages?: Record<string, {
    id: string;
    countryName: string;
    status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
    type: 'funds' | 'equipment' | 'divisions';
    amountPerTurn: number;
    description: string;
  }>;
  onUpdateForeignAid?: (packages: any) => void;
  canControlStateFinance?: boolean;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  country,
  party,
  onUpdateCountry,
  onUpdateParty,
  darkMode,
  isRuling = false,
  treasury = 0,
  onUpdateTreasury,
  isCivilWarMode = false,
  foreignAidPackages = {},
  onUpdateForeignAid,
  canControlStateFinance = true,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper currency converter
  const getCurrency = (countryId: string) => {
    if (countryId === 'US') return '$';
    if (countryId === 'TR') return '₺';
    if (countryId === 'DE') return '€';
    if (countryId === 'GB') return '£';
    if (countryId === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrency(country.id);

  // Compute player seats for civilian mode
  const totalRegions = country.regions.length || 1;
  const playerAvgSupport = country.regions.reduce((acc, r) => acc + (r.supports[party.id] || 0), 0) / totalRegions;
  const playerSeatsCount = Math.round((playerAvgSupport / 100) * country.seats);

  // Effective budget/reserve balance to display & modify
  const isRulingActive = isRuling && onUpdateTreasury !== undefined;
  const currentBalance = isRulingActive ? (treasury ?? 0) : (party?.budget ?? 0);
  const memberCount = party?.members ?? 500;

  // Active foreign aid incoming sum
  const activeForeignAidTotal = (Object.values(foreignAidPackages || {}) as any[]).reduce((sum: number, pkg: any) => {
    return pkg?.status === 'ACCEPTED' ? sum + (Number(pkg?.amountPerTurn) || 0) : sum;
  }, 0);

  // Wartime Specific State
  const [manpowerReserves, setManpowerReserves] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_manpower_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 65000;
  });
  const [munitionsLevel, setMunitionsLevel] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_munitions_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 75;
  });
  const [supplyEfficiency, setSupplyEfficiency] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_supply_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 70;
  });
  const [reconstructionFund, setReconstructionFund] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_reconstruction_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 80000;
  });
  const [wartimeDebt, setWartimeDebt] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_debt_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [transportShips, setTransportShips] = useState<number>(() => {
    const saved = localStorage.getItem(`cw_transports_${country.id}_${party.id}`);
    return saved ? parseInt(saved, 10) : 5;
  });

  // Listen for real-time changes to transport ship fleet
  React.useEffect(() => {
    const handleTransports = (e: any) => {
      if (e?.detail?.count !== undefined) {
        setTransportShips(e.detail.count);
      }
    };
    window.addEventListener('transport_ships_updated', handleTransports);
    return () => window.removeEventListener('transport_ships_updated', handleTransports);
  }, []);

  const updateBalance = (newVal: number) => {
    if (isRulingActive) {
      onUpdateTreasury(newVal);
    } else {
      onUpdateParty({
        ...party,
        budget: newVal
      });
    }
  };

  const applyGeneralPopularityDrop = (dropAmount: number) => {
    const updatedRegions = country.regions.map(r => {
      const supports = { ...r.supports };
      const playerSupport = supports[party.id] || 0;
      const targetSupport = Math.max(1, playerSupport - dropAmount);
      const change = targetSupport - playerSupport;

      const otherParties = Object.keys(supports).filter(id => id !== party.id);
      const totalOtherSupport = otherParties.reduce((sum, id) => sum + (supports[id] || 0), 0);

      if (totalOtherSupport > 0) {
        otherParties.forEach(id => {
          const share = ((supports[id] as number) || 0) / totalOtherSupport;
          supports[id] = Math.max(0.1, ((supports[id] as number) || 0) - (change * share));
        });
      }
      supports[party.id] = targetSupport;

      const finalSum = (Object.values(supports) as number[]).reduce((s: number, v: number) => s + v, 0);
      if (Math.abs(finalSum - 100) > 0.1) {
        const scale = 100 / finalSum;
        Object.keys(supports).forEach(k => {
          supports[k] = (supports[k] as number) * scale;
        });
      }

      return { ...r, supports };
    });

    onUpdateCountry({ ...country, regions: updatedRegions });
  };

  // ==========================================
  // WARTIME FINANCIAL ACTION HANDLERS
  // ==========================================

  // 1) Military Spending: Procure Munitions & Armaments
  const handleProcureMunitions = () => {
    const fee = 40000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient War Chest: You need at least ${currency}${fee.toLocaleString()} to procure heavy munitions and armaments.`);
      setSuccessMessage(null);
      return;
    }

    const nextMunitions = Math.min(100, munitionsLevel + 15);
    setMunitionsLevel(nextMunitions);
    localStorage.setItem(`cw_munitions_${country.id}_${party.id}`, nextMunitions.toString());

    updateBalance(currentBalance - fee);
    playSound('battle');
    setSuccessMessage(`Heavy Munitions Procured: Allocated ${currency}${fee.toLocaleString()} from War Chest into munitions production, anti-tank armaments, and artillery shells. Frontline stockpile reached ${nextMunitions}%.`);
    setErrorMessage(null);
  };

  // 2) Manpower: Mobilize Volunteer Brigades & Conscription
  const handleMobilizeManpower = () => {
    const fee = 25000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient War Chest: You need at least ${currency}${fee.toLocaleString()} to mobilize volunteer brigades and local defense contingents.`);
      setSuccessMessage(null);
      return;
    }

    const recruitCount = 12500;
    const nextManpower = manpowerReserves + recruitCount;
    setManpowerReserves(nextManpower);
    localStorage.setItem(`cw_manpower_${country.id}_${party.id}`, nextManpower.toString());

    updateBalance(currentBalance - fee);
    playSound('success');
    setSuccessMessage(`Manpower Mobilized: Enlisted and equipped +${recruitCount.toLocaleString()} volunteer fighters into active combat reserves for ${currency}${fee.toLocaleString()}. Total reserve pool: ${nextManpower.toLocaleString()} troops.`);
    setErrorMessage(null);
  };

  // 3) Supplies: Fortify Logistics Corridors & Forward Depots
  const handleReinforceSupplies = () => {
    const fee = 30000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient War Chest: You need at least ${currency}${fee.toLocaleString()} to fortify logistics pipelines and construct forward supply depots.`);
      setSuccessMessage(null);
      return;
    }

    const nextSupply = Math.min(100, supplyEfficiency + 20);
    setSupplyEfficiency(nextSupply);
    localStorage.setItem(`cw_supply_${country.id}_${party.id}`, nextSupply.toString());

    updateBalance(currentBalance - fee);
    playSound('success');
    setSuccessMessage(`Logistics Fortified: Established fortified supply depots and fuel corridors for ${currency}${fee.toLocaleString()}. Frontline supply efficiency increased to ${nextSupply}%, mitigating unit attrition.`);
    setErrorMessage(null);
  };

  // 4) Reconstruction Reserves: Allocate Post-Conflict Stabilization Fund
  const handleAllocateReconstruction = () => {
    const fee = 50000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient War Chest: You need at least ${currency}${fee.toLocaleString()} to allocate into provincial reconstruction reserves.`);
      setSuccessMessage(null);
      return;
    }

    const nextReconstruction = reconstructionFund + fee;
    setReconstructionFund(nextReconstruction);
    localStorage.setItem(`cw_reconstruction_${country.id}_${party.id}`, nextReconstruction.toString());

    updateBalance(currentBalance - fee);
    playSound('success');
    setSuccessMessage(`Reconstruction Reserves Deposited: Transferred ${currency}${fee.toLocaleString()} into sovereign reconstruction reserves. Total allocated fund: ${currency}${nextReconstruction.toLocaleString()}, ensuring rapid civilian order recovery in liberated sectors.`);
    setErrorMessage(null);
  };

  // 5) External Aid: Solicit International Military Grants
  const handleSolicitExternalAid = () => {
    const aidYield = 75000;
    playSound('success');

    updateBalance(currentBalance + aidYield);
    setSuccessMessage(`External Military Assistance Secured: Received an emergency international defense grant of +${currency}${aidYield.toLocaleString()} directly into the War Chest from allied security partners.`);
    setErrorMessage(null);
  };

  // 6) Debt: Issue Sovereign Emergency War Bonds
  const handleIssueWarBonds = () => {
    const bondYield = 100000;
    const nextDebt = wartimeDebt + bondYield;
    setWartimeDebt(nextDebt);
    localStorage.setItem(`cw_debt_${country.id}_${party.id}`, nextDebt.toString());

    updateBalance(currentBalance + bondYield);
    playSound('success');
    setSuccessMessage(`Emergency War Bonds Issued: Secured +${currency}${bondYield.toLocaleString()} in immediate liquid capital for military operations. Incurred ${currency}${bondYield.toLocaleString()} in sovereign wartime debt obligations (Total Debt: ${currency}${nextDebt.toLocaleString()}).`);
    setErrorMessage(null);
  };

  // 7) Naval Fleet: Build Transport Ships (Requirement 4)
  const handleBuildTransportShips = () => {
    const fee = 35000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient War Chest: You need at least ${currency}${fee.toLocaleString()} to commission naval transport vessels.`);
      setSuccessMessage(null);
      return;
    }

    const nextShips = transportShips + 2;
    setTransportShips(nextShips);
    localStorage.setItem(`cw_transports_${country.id}_${party.id}`, nextShips.toString());
    window.dispatchEvent(new CustomEvent('transport_ships_updated', { detail: { count: nextShips } }));

    updateBalance(currentBalance - fee);
    playSound('success');
    setSuccessMessage(`Transport Fleet Commissioned: Built +2 Amphibious Transport Ships for ${currency}${fee.toLocaleString()} (Fleet Total: ${nextShips} ships). Sealift capability is operational for maritime crossings.`);
    setErrorMessage(null);
  };

  // ==========================================
  // PEACETIME FINANCIAL ACTION HANDLERS
  // ==========================================

  const handleFundraisingDrive = () => {
    const fee = 15000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient Funds: You need at least ${currency}${fee.toLocaleString()} to kick off a fundraising drive.`);
      setSuccessMessage(null);
      return;
    }

    const reward = 45000;
    const isScandal = Math.random() < 0.25;

    let finalBalance = currentBalance - fee + reward;
    let feedback = `Fundraising Drive completed! Collected a total of +${currency}${reward.toLocaleString()} in grassroots donations.`;

    if (isScandal) {
      applyGeneralPopularityDrop(2);
      playSound('error');
      feedback += ` However, investigative journalists uncovered shady corporate donors! A small scandal erupted, decreasing nationwide popularity by -2%.`;
    } else {
      playSound('success');
    }

    updateBalance(finalBalance);
    setSuccessMessage(feedback);
    setErrorMessage(null);
  };

  const handleIncreaseDues = () => {
    const rewardPerMember = 10;
    const reward = memberCount * rewardPerMember;

    if (memberCount < 50) {
      playSound('error');
      setErrorMessage(`Insufficient Members: You need at least 50 registered members to implement dues collection.`);
      setSuccessMessage(null);
      return;
    }

    applyGeneralPopularityDrop(1);
    playSound('success');

    updateBalance(currentBalance + reward);
    setSuccessMessage(`Membership Dues increased! Collected ${currency}${reward.toLocaleString()} from your ${memberCount.toLocaleString()} members. Popularity nationwide dropped slightly (-1%) due to agitation.`);
    setErrorMessage(null);
  };

  const handleCorporateSponsorship = () => {
    const reward = 120000;
    applyGeneralPopularityDrop(3);
    playSound('success');

    updateBalance(currentBalance + reward);
    setSuccessMessage(`Secured high-tier Corporate Sponsorship! Added +${currency}${reward.toLocaleString()} directly into the treasury. However, your independent neutrality image is damaged, decreasing nationwide popularity by -3%.`);
    setErrorMessage(null);
  };

  const handleSellAssets = () => {
    const reward = 60000;
    playSound('success');

    updateBalance(currentBalance + reward);
    setSuccessMessage(`Sold secondary party facilities and logistics assets. Gained a flat +${currency}${reward.toLocaleString()} one-time treasury injection without popularity penalties.`);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      {/* Treasury Header Info */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isCivilWarMode ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
            {isCivilWarMode ? <Swords className="w-8 h-8" /> : <Coins className="w-8 h-8" />}
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono font-bold uppercase text-indigo-400">
              {isCivilWarMode ? 'WAR CHEST & MILITARY FISCAL LOGISTICS' : isRuling ? 'STATE TREASURY & RESERVES' : 'TREASURY & LIQUID CAPITAL'}
            </span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">
              {isCivilWarMode ? 'Wartime Financial Administration' : isRuling ? 'National Financial Governance' : 'Campaign Financial Management'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isCivilWarMode
                ? 'Martial economy active. Direct state war chest resources into military procurement, volunteer mobilization, frontline supply pipelines, reconstruction reserves, and external aid.'
                : isRuling 
                  ? 'Manage national state resources, launch fundraising programs, secure bilateral sponsorships, or liquidate non-essential state assets.'
                  : 'Leverage grassroots drives, sell assets, or partner with corporate entities to fund your nationwide campaign trail.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase">
            {isCivilWarMode ? 'FACTION WAR CHEST' : isRuling ? 'STATE TREASURY' : 'PARTY RESERVES'}
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
            {currency}{currentBalance.toLocaleString()}
          </div>
          {isCivilWarMode && activeForeignAidTotal > 0 && (
            <div className="text-[10px] font-mono text-emerald-400/90 font-bold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>+${activeForeignAidTotal.toLocaleString()}/mo Foreign Aid</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Specific Notification / Status Banner */}
      {isCivilWarMode ? (
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          darkMode ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs flex-grow leading-relaxed">
            <strong>Martial Economy Active:</strong> Civilian political fundraising and parliamentary subsidies are suspended under martial law. Financial systems are restricted strictly to wartime military spending, manpower mobilization, supplies, reconstruction reserves, external aid, and emergency debt.
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 uppercase border border-amber-500/20 shrink-0">
            Wartime Rules
          </span>
        </div>
      ) : !canControlStateFinance ? (
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          darkMode ? 'bg-sky-950/20 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          <Landmark className="w-5 h-5 text-sky-400 shrink-0" />
          <div className="text-xs flex-grow leading-relaxed">
            <strong>Party Campaign Finance:</strong> You manage campaign fundraising, volunteer donations, and grassroots reserves. Sovereign state treasury, national reserves, and statutory tax rates are controlled by the sovereign government until you win the general election.
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 uppercase border border-sky-500/20 shrink-0">
            Opposition Scope
          </span>
        </div>
      ) : (
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
          playerSeatsCount > 0 
            ? darkMode ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            : darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <Landmark className="w-5 h-5 shrink-0" />
          <div className="text-xs flex-grow">
            {playerSeatsCount > 0 ? (
              <span>
                <strong>Automatic State Subsidy:</strong> Having <strong>{playerSeatsCount} seats</strong> in parliament grants you an automatic weekly injection of <strong>{currency}{(playerSeatsCount * 1500).toLocaleString()}</strong> ({currency}1,500 per seat) when spending action weeks!
              </span>
            ) : (
              <span>
                <strong>Automatic State Subsidy:</strong> You do not currently hold any seats in parliament. Win seats in the general election to secure a guaranteed recurring state campaign subsidy.
              </span>
            )}
          </div>
          {playerSeatsCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
              Active
            </span>
          )}
        </div>
      )}

      {/* Success & Error Alert Feeds */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WARTIME FINANCIAL SYSTEMS (MILITARY SPENDING, MANPOWER, SUPPLIES, RECONSTRUCTION, AID, DEBT) */}
      {/* ========================================================================= */}
      {isCivilWarMode ? (
        <div className="flex flex-col gap-6">
          {/* Wartime Readiness Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Manpower */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold text-[10px] uppercase font-mono">Manpower Pool</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-mono text-indigo-400">
                  {manpowerReserves.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Combat reserves ready</div>
              </div>
            </div>

            {/* Munitions */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold text-[10px] uppercase font-mono">Munitions Stockpile</span>
                <Swords className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-mono text-rose-400">
                  {munitionsLevel}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Heavy arms readiness</div>
              </div>
            </div>

            {/* Supplies */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold text-[10px] uppercase font-mono">Supply Efficiency</span>
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-mono text-emerald-400">
                  {supplyEfficiency}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Attrition resistance</div>
              </div>
            </div>

            {/* Transport Ships (Requirement 4) */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold text-[10px] uppercase font-mono">Transport Ships</span>
                <Ship className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-mono text-cyan-400">
                  {transportShips}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Amphibious sealift fleet</div>
              </div>
            </div>

            {/* Reconstruction & Debt */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold text-[10px] uppercase font-mono">Reconstruction Fund</span>
                <Hammer className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black font-mono text-amber-400">
                  {currency}{reconstructionFund.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {wartimeDebt > 0 ? `Debt: ${currency}${wartimeDebt.toLocaleString()}` : 'No sovereign debt'}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Wartime Action Systems Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Military Spending: Munitions & Armaments */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg"><Swords className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Military Spending: Heavy Munitions</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Procurement
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Direct war chest funds into defense contractors and weapons depots to replenish artillery shells, anti-tank armaments, and armored vehicle components. Increases frontline munitions stockpile by +15%.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Cost: <strong className="text-rose-400">-{currency}40,000</strong></span>
                  <span>Stockpile Boost: <strong className="text-emerald-400">+15% Munitions</strong></span>
                </div>
                <button
                  id="action-procure-munitions"
                  type="button"
                  onClick={handleProcureMunitions}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-rose-600/10"
                >
                  Procure Arms
                </button>
              </div>
            </div>

            {/* 2. Manpower: Volunteer Brigades & Conscription */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg"><Users className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Manpower: Mobilize Volunteers</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Recruitment
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Establish mobilization centers across controlled provinces. Enlist, outfit, and organize local defense brigades, volunteer infantrymen, and logistics personnel to reinforce depleted frontline divisions.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Cost: <strong className="text-rose-400">-{currency}25,000</strong></span>
                  <span>Manpower Yield: <strong className="text-emerald-400">+12,500 Recruits</strong></span>
                </div>
                <button
                  id="action-mobilize-manpower"
                  type="button"
                  onClick={handleMobilizeManpower}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-indigo-600/10"
                >
                  Mobilize Troops
                </button>
              </div>
            </div>

            {/* 3. Supplies: Logistics Corridors & Forward Depots */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"><Package className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Supplies: Forward Logistics Depots</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Logistics
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Construct fortified fuel storage caches, ammunition dumps, and medical supply routes along major combat axes. Increases supply efficiency by +20% and prevents division combat exhaustion.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Cost: <strong className="text-rose-400">-{currency}30,000</strong></span>
                  <span>Supply Boost: <strong className="text-emerald-400">+20% Logistics</strong></span>
                </div>
                <button
                  id="action-reinforce-supplies"
                  type="button"
                  onClick={handleReinforceSupplies}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-emerald-600/10"
                >
                  Fortify Depots
                </button>
              </div>
            </div>

            {/* 4. Reconstruction Reserves: Post-Conflict Infrastructure Fund */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg"><Hammer className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Reconstruction Reserves</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Civil Order
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Allocate capital into emergency reconstruction reserves. Rebuilds destroyed electrical grids, transit networks, and hospitals in liberated provinces, ensuring rapid civilian pacification upon victory.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Cost: <strong className="text-rose-400">-{currency}50,000</strong></span>
                  <span>Reserve Inflow: <strong className="text-emerald-400">+{currency}50,000 Allocated</strong></span>
                </div>
                <button
                  id="action-allocate-reconstruction"
                  type="button"
                  onClick={handleAllocateReconstruction}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-amber-600/10"
                >
                  Allocate Reserves
                </button>
              </div>
            </div>

            {/* 5. External Aid: Solicit International Military Grants */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg"><Globe className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">External Aid: Foreign Military Grants</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Bilateral Aid
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Solicit bilateral wartime grants and material support from foreign powers. Injects immediate liquidity directly into your war chest to sustain high-intensity counter-offensive operations.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Setup Cost: <strong className="text-slate-300">Free (Diplomatic)</strong></span>
                  <span>Grant Inflow: <strong className="text-emerald-400">+{currency}75,000 Cash</strong></span>
                </div>
                <button
                  id="action-solicit-aid"
                  type="button"
                  onClick={handleSolicitExternalAid}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-cyan-600/10"
                >
                  Request Grants
                </button>
              </div>
            </div>

            {/* 6. Debt: Issue Sovereign Emergency War Bonds */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg"><FileText className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Wartime Debt: Issue Emergency Bonds</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Debt Obligation
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Issue wartime defense credit bonds to secure rapid emergency cash. Generates immediate liquidity at the cost of incurring national sovereign debt to be repaid post-conflict.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Liquid Yield: <strong className="text-emerald-400">+{currency}100,000</strong></span>
                  <span>Debt Incurred: <strong className="text-rose-400">+{currency}100,000 Debt</strong></span>
                </div>
                <button
                  id="action-issue-war-bonds"
                  type="button"
                  onClick={handleIssueWarBonds}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-amber-600/10"
                >
                  Issue War Bonds
                </button>
              </div>
            </div>

            {/* 7. Naval Fleet: Build Transport Ships (Requirement 4) */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all md:col-span-2 ${
              darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg"><Ship className="w-4 h-4" /></span>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Naval Fleet: Build Transport Ships</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    Amphibious Sealift
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Commission heavy roll-on/roll-off amphibious transport vessels and logistics sealift craft at coastal dockyards. Any military troop movement that crosses sea sectors requires available transport vessels; without ships, sea crossings are blocked.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
                <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                  <span>Cost: <strong className="text-rose-400">-{currency}35,000</strong></span>
                  <span>Fleet Yield: <strong className="text-cyan-400">+2 Transport Ships</strong> (Current Total: {transportShips})</span>
                </div>
                <button
                  id="action-build-transport-ship"
                  type="button"
                  onClick={handleBuildTransportShips}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-cyan-600/10 flex items-center gap-1.5"
                >
                  <Ship className="w-3.5 h-3.5" />
                  <span>Build Transport Ships</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* PEACETIME FINANCIAL ACTION CARDS GRID */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fundraising Drive */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg"><Sparkles className="w-4 h-4" /></span>
                  <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Fundraising Drive</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Medium Risk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Organize a local funding campaign. Spend a small upfront logistical budget to attract grassroots capital. High reward, but carries a 25% risk of corporate-lobbying investigative scandals.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
              <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                <span>Setup Cost: <strong className="text-rose-400">-{currency}15,000</strong></span>
                <span>Potential Yield: <strong className="text-emerald-400">+{currency}45,000</strong></span>
              </div>
              <button
                id="action-fundraising"
                type="button"
                onClick={handleFundraisingDrive}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-indigo-600/10"
              >
                Launch Drive
              </button>
            </div>
          </div>

          {/* Increase Membership Dues */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"><Users className="w-4 h-4" /></span>
                  <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Increase Membership Dues</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Leverage your membership base. Collect a small monthly fee from all registered members. Directly scales with your current member count ({(party?.members ?? 500).toLocaleString()}), but agitates voters slightly, decreasing overall popularity by -1%.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
              <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                <span>Setup Cost: <strong className="text-slate-300">Free</strong></span>
                <span>Dues Value: <strong className="text-emerald-400">+{currency}10 / Member</strong></span>
              </div>
              <button
                id="action-dues"
                type="button"
                onClick={handleIncreaseDues}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
              >
                Collect Dues
              </button>
            </div>
          </div>

          {/* Corporate Sponsorship */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg"><Building2 className="w-4 h-4" /></span>
                  <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Corporate Sponsorship</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  High Penalty
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Sign strategic advertising deals with manufacturing, telecom, or utility giants. Grants an immediate, massive cash infusion into your campaign funds. However, your independent neutral image takes a major hit, lowering popularity by -3%.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
              <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                <span>Setup Cost: <strong className="text-slate-300">Free</strong></span>
                <span>Treasury Yield: <strong className="text-emerald-400">+{currency}120,000</strong></span>
              </div>
              <button
                id="action-sponsorship"
                type="button"
                onClick={handleCorporateSponsorship}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
              >
                Accept Deals
              </button>
            </div>
          </div>

          {/* Sell Party Assets */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg"><Coins className="w-4 h-4" /></span>
                  <h3 className="font-extrabold text-sm tracking-tight text-slate-100">Sell Party Assets</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  Safe
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Sell off historical party facilities, older logistics vehicles, or non-essential real estate assets. Quick, safe, and completely clean with absolutely zero public opinion or popularity drawbacks.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-500/10">
              <div className="text-left font-mono text-[10px] text-slate-400 flex flex-col">
                <span>Setup Cost: <strong className="text-slate-300">Free</strong></span>
                <span>Treasury Yield: <strong className="text-emerald-400">+{currency}60,000</strong></span>
              </div>
              <button
                id="action-sell"
                type="button"
                onClick={handleSellAssets}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
              >
                Liquidate Assets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
