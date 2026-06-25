import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { 
  ShieldAlert, ShieldCheck, Swords, Anchor, Cpu, AlertTriangle, 
  Sparkles, Check, Users, Coins, Map, Activity
} from 'lucide-react';

interface MilitaryViewProps {
  country: Country;
  party: Party;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  civilWarRisk: number;
  onUpdateCivilWarRisk: (risk: number) => void;
  freedomIndex: number;
  onUpdateFreedomIndex: (freedom: number) => void;
  publicApprovalImpact: (approvalChange: number) => void;
  darkMode: boolean;
}

export const MilitaryView: React.FC<MilitaryViewProps> = ({
  country,
  party,
  treasury,
  onUpdateTreasury,
  civilWarRisk,
  onUpdateCivilWarRisk,
  freedomIndex,
  onUpdateFreedomIndex,
  publicApprovalImpact,
  darkMode,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local defense stats
  const [readiness, setReadiness] = useState<number>(65); // 0-100%
  const [hqDefenseLevel, setHqDefenseLevel] = useState<number>(1); // 1-5

  const getCurrencySymbol = () => {
    if (country.id === 'US') return '$';
    if (country.id === 'TR') return '₺';
    if (country.id === 'DE') return '€';
    if (country.id === 'GB') return '£';
    if (country.id === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrencySymbol();

  // 1) Deploy Martial Law / State Security Forces
  const handleDeployMartialLaw = () => {
    if (civilWarRisk < 15) {
      playSound('error');
      setErrorMessage(`Tactical deployment rejected: Internal Civil War / Revolt risk is currently safe (${civilWarRisk}%). Martial Law only needed during crises.`);
      return;
    }

    onUpdateCivilWarRisk(0); // completely reset revolt risk
    onUpdateFreedomIndex(Math.max(5, freedomIndex - 20)); // drops freedom index severely
    publicApprovalImpact(-8); // lowers public approval by 8%

    playSound('success');
    setSuccessMessage(`MARTIAL LAW ENFORCED: Tactical state gendarmes have locked down municipal squares. Revolt Risk successfully neutralized to 0%, but overall civil Freedom Index dropped by -20.`);
    setErrorMessage(null);
  };

  // 2) Defense Budget procurement
  const handleDefenseProcurement = () => {
    const cost = 55000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Procurement Rejected: Upgrading tactical defensive readiness requires ${currency}${cost.toLocaleString()} from the treasury.`);
      return;
    }

    onUpdateTreasury(treasury - cost);
    setReadiness(Math.min(100, readiness + 15));
    publicApprovalImpact(2); // nationalist groups approve

    playSound('success');
    setSuccessMessage(`Defense Procurement Successful: Purchased tactical air defense grids, increasing national Military Readiness by +15%!`);
    setErrorMessage(null);
  };

  // 3) Mobilize Border Defense
  const handleMobilizeBorders = () => {
    const cost = 25000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Mobilization Rejected: Troop logistics deployment requires ${currency}${cost.toLocaleString()}.`);
      return;
    }

    onUpdateTreasury(treasury - cost);
    setHqDefenseLevel(Math.min(5, hqDefenseLevel + 1));
    playSound('success');
    setSuccessMessage(`BORDERS SECURED: Reinforced outpost checkpoints. Tactical defense tier upgraded to Level ${Math.min(5, hqDefenseLevel + 1)}.`);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Military command center Header */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
            <Swords className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-red-500 font-bold uppercase">SUPREME JOINT CHIEFS OF STAFF</span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">Military Operations Room</h2>
            <p className="text-xs text-slate-400 mt-1">
              Command borders, deploy martial counter-insurgency security, and coordinate military procurement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 font-mono text-xs text-slate-400">
          <div className="flex flex-col items-end">
            <span>READINESS</span>
            <span className="text-xl font-black text-red-500">{readiness}%</span>
          </div>
          <div className="flex flex-col items-end">
            <span>DEFENSIVE TIER</span>
            <span className="text-xl font-black text-indigo-400">Level {hqDefenseLevel}/5</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Defense Budgets */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-500/10 mb-3.5">
              <span className="p-1.5 bg-red-500/10 text-red-500 rounded-lg"><Cpu className="w-4 h-4" /></span>
              <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full uppercase border border-indigo-500/10">
                Procurement
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-100">Procure Tactical Logistics</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Allocate National Treasury budget to procure cutting-edge defense platforms. Boosts overall defensive capability and national readiness score by +15%.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-500/10 flex justify-between items-center text-xs">
            <span className="font-mono text-[10px] text-slate-500">Cost: {currency}55,000</span>
            <button
              onClick={handleDefenseProcurement}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Order Shipment
            </button>
          </div>
        </div>

        {/* Secure Borders */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-500/10 mb-3.5">
              <span className="p-1.5 bg-red-500/10 text-red-500 rounded-lg"><Anchor className="w-4 h-4" /></span>
              <span className="text-[10px] font-mono font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full uppercase border border-green-500/10">
                HQ Defense
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-100">Secure Borders & Outposts</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Deploy check-posts, naval patrols, and coordinate perimeter drones. Increases defense tier, protecting sovereign territory from hostile state incursions.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-500/10 flex justify-between items-center text-xs">
            <span className="font-mono text-[10px] text-slate-500">Cost: {currency}25,000</span>
            <button
              onClick={handleMobilizeBorders}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Mobilize Outposts
            </button>
          </div>
        </div>

        {/* Counter-Insurgency Martial Law */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-500/10 mb-3.5">
              <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg"><ShieldAlert className="w-4 h-4" /></span>
              <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-450 px-2 py-0.5 rounded-full uppercase border border-rose-500/10 animate-pulse">
                Anti-Revolt
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-100">Enforce Local Martial Law</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              If Civil War Revolt Risk is dangerously elevated, authorize tactical security crackdowns. Forces internal rebellion risk to exactly 0%, but drastically lowers Freedom Index (-20).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-500/10 flex justify-between items-center text-xs">
            <span className="font-mono text-[10px] text-slate-500">Cost: Free</span>
            <button
              onClick={handleDeployMartialLaw}
              className="px-4 py-2 bg-rose-650 hover:bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Deploy Martial Law
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
