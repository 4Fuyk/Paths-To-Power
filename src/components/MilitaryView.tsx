import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { 
  ShieldAlert, ShieldCheck, Swords, Anchor, Cpu, AlertTriangle, 
  Sparkles, Check, Users, Coins, Map, Activity, Lock
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
  isRuling?: boolean;
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
  isRuling = true,
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

  const checkRuling = () => {
    if (!isRuling) {
      playSound('error');
      setErrorMessage("🔒 Only the sitting government commands the armed forces.");
      return false;
    }
    return true;
  };

  // 1) Deploy Martial Law / State Security Forces
  const handleDeployMartialLaw = () => {
    if (!checkRuling()) return;
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
    if (!checkRuling()) return;
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
    if (!checkRuling()) return;
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

      {!isRuling && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Only the sitting government commands the armed forces</span>
            <span className="text-slate-300 text-[11px]">Executive defense decrees and martial deployments are restricted to the sitting administration.</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Strategic Command Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Martial Law & Internal Security */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="p-2.5 bg-red-500/10 rounded-2xl text-red-400 w-fit mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Martial Law & Curfew</h3>
            <p className="text-xs text-slate-400 mt-1">
              Authorize armed gendarme crackdowns on insurgent cells. Completely neutralizes civil revolt risk to 0%, but severely degrades national freedom.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-2">
            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>REVOLT THRESHOLD:</span>
              <span className="font-bold text-red-400">Requires ≥15% Risk</span>
            </div>
            <button
              disabled={!isRuling}
              onClick={handleDeployMartialLaw}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRuling
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
              }`}
            >
              {!isRuling && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>Enforce Martial Law</span>
            </button>
          </div>
        </div>

        {/* 2. Procurement & Modernization */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400 w-fit mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Air Defense & Drones</h3>
            <p className="text-xs text-slate-400 mt-1">
              Procure modern multi-spectrum radar grids, surface-to-air batteries and strike drones. Boosts military readiness by +15%.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-2">
            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>TREASURY COST:</span>
              <span className="font-bold text-emerald-400">{currency}55,000</span>
            </div>
            <button
              disabled={!isRuling}
              onClick={handleDefenseProcurement}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRuling
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {!isRuling && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>Procure Defense Grid</span>
            </button>
          </div>
        </div>

        {/* 3. Border Hardening */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 ${
          darkMode ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-emerald-400 w-fit mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Fortify Frontier Outposts</h3>
            <p className="text-xs text-slate-400 mt-1">
              Construct physical barriers, electronic sensors and fortified checkpoints across sovereign border perimeters.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-2">
            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>LOGISTICS COST:</span>
              <span className="font-bold text-emerald-400">{currency}25,000</span>
            </div>
            <button
              disabled={!isRuling}
              onClick={handleMobilizeBorders}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRuling
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {!isRuling && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>Fortify Borders</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
