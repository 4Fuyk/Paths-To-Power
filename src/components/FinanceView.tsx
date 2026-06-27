/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { Coins, Heart, Users, Landmark, Sparkles, Building2, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface FinanceViewProps {
  country: Country;
  party: Party;
  onUpdateCountry: (updatedCountry: Country) => void;
  onUpdateParty: (updatedParty: Party) => void;
  darkMode: boolean;
  isRuling?: boolean;
  treasury?: number;
  onUpdateTreasury?: (updatedTreasury: number) => void;
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

  // Compute player seats
  const totalRegions = country.regions.length || 1;
  const playerAvgSupport = country.regions.reduce((acc, r) => acc + (r.supports[party.id] || 0), 0) / totalRegions;
  const playerSeatsCount = Math.round((playerAvgSupport / 100) * country.seats);

  // Effective budget/reserve balance to display & modify
  const isRulingActive = isRuling && onUpdateTreasury !== undefined;
  const currentBalance = isRulingActive ? treasury : party.budget;

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
      const change = targetSupport - playerSupport; // Negative change

      const otherParties = Object.keys(supports).filter(id => id !== party.id);
      const totalOtherSupport = otherParties.reduce((sum, id) => sum + (supports[id] || 0), 0);

      if (totalOtherSupport > 0) {
        otherParties.forEach(id => {
          const share = ((supports[id] as number) || 0) / totalOtherSupport;
          supports[id] = Math.max(0.1, ((supports[id] as number) || 0) - (change * share));
        });
      }
      supports[party.id] = targetSupport;

      // Normalize accurate sum to 100%
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

  // 1) Fundraising Drive
  const handleFundraisingDrive = () => {
    const fee = 15000;
    if (currentBalance < fee) {
      playSound('error');
      setErrorMessage(`Insufficient Funds: You need at least ${currency}${fee.toLocaleString()} to kick off a fundraising drive.`);
      setSuccessMessage(null);
      return;
    }

    const reward = 45000;
    const isScandal = Math.random() < 0.25; // 25% scandal risk

    let finalBalance = currentBalance - fee + reward;
    let feedback = `Fundraising Drive completed! Collected a total of +${currency}${reward.toLocaleString()} in grassroots donations.`;

    if (isScandal) {
      // Scandal drops popularity by 2%
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

  // 2) Increase Membership Dues
  const handleIncreaseDues = () => {
    const rewardPerMember = 10;
    const reward = party.members * rewardPerMember;

    if (party.members < 50) {
      playSound('error');
      setErrorMessage(`Insufficient Members: You need at least 50 registered members to implement dues collection.`);
      setSuccessMessage(null);
      return;
    }

    applyGeneralPopularityDrop(1); // Popularity falls by 1% due to voter agitation
    playSound('success');

    updateBalance(currentBalance + reward);

    setSuccessMessage(`Membership Dues increased! Collected ${currency}${reward.toLocaleString()} from your ${party.members.toLocaleString()} members. Popularity nationwide dropped slightly (-1%) due to agitation.`);
    setErrorMessage(null);
  };

  // 3) Corporate Sponsorship
  const handleCorporateSponsorship = () => {
    const reward = 120000;
    applyGeneralPopularityDrop(3); // General neutrality image drop of -3%
    playSound('success');

    updateBalance(currentBalance + reward);

    setSuccessMessage(`Secured high-tier Corporate Sponsorship! Added +${currency}${reward.toLocaleString()} directly into the treasury. However, your independent neutrality image is damaged, decreasing nationwide popularity by -3%.`);
    setErrorMessage(null);
  };

  // 4) Sell Party Assets
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
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase">
              {isRuling ? 'STATE TREASURY & RESERVES' : 'TREASURY & LIQUID CAPITAL'}
            </span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">
              {isRuling ? 'National Financial Governance' : 'Campaign Financial Management'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRuling 
                ? 'Manage national state resources, launch fundraising programs, secure bilateral sponsorships, or liquidate non-essential state assets.'
                : 'Leverage grassroots drives, sell assets, or partner with corporate entities to fund your nationwide campaign trail.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <div className="text-sm font-mono text-slate-400 font-bold">
            {isRuling ? 'STATE TREASURY' : 'PARTY RESERVES'}
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
            {currency}{currentBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* State Subsidy Notification Panel */}
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

      {/* Financial Action Cards Grid */}
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
              Leverage your membership base. Collect a small monthly fee from all registered members. Directly scales with your current member count ({party.members.toLocaleString()}), but agitates voters slightly, decreasing overall popularity by -1%.
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
    </div>
  );
};
