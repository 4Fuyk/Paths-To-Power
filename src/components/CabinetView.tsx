import React, { useState } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { Briefcase, ArrowRight, CheckCircle, Shield, Landmark, Sparkles, User, Users, Coins, AlertTriangle } from 'lucide-react';

interface CabinetViewProps {
  country: Country;
  party: Party;
  cabinet: Record<string, { name: string; avatar: string; skill: string; bonus: string; salary: number }>;
  onUpdateCabinet: (updatedCabinet: any) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  darkMode: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  skill: string;
  bonus: string;
  salary: number;
  description: string;
  specialty: 'finance' | 'interior' | 'defense' | 'foreign' | 'general';
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  country,
  party,
  cabinet,
  onUpdateCabinet,
  treasury,
  onUpdateTreasury,
  darkMode,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available Candidates Pool (Dynamic names based on country)
  const isTurkey = country.id === 'TR';
  const isGermany = country.id === 'DE';

  const candidates: Candidate[] = [
    {
      id: 'cand_1',
      name: isTurkey ? 'Ahmet Yılmaz' : isGermany ? 'Dr. Wolfgang Schmidt' : 'James Carter',
      avatar: '👨‍💼',
      specialty: 'finance',
      skill: 'Economist',
      bonus: '+5% Corporate & Income Tax Revenue, -1% Inflation',
      salary: 15000,
      description: isTurkey 
        ? 'Maliye ve iktisat alanında 20 yıllık deneyim. Vergileri maximize eder.' 
        : 'Former central bank director. Elite fiscal coordinator.',
    },
    {
      id: 'cand_2',
      name: isTurkey ? 'Zeynep Kaya' : isGermany ? 'Sophia Weber' : 'Sarah Jenkins',
      avatar: '👩‍⚖️',
      specialty: 'interior',
      skill: 'Human Rights Jurist',
      bonus: '+10 Freedom Index, +5% Public Approval, Lowers Unrest',
      salary: 12000,
      description: isTurkey 
        ? 'Sivil özgürlükler ve anayasa hukuku uzmanı. Halk desteğini artırır.' 
        : 'Constitutional law specialist. Safeguards press liberties.',
    },
    {
      id: 'cand_3',
      name: isTurkey ? 'Tuğgeneral Hakan Demir' : isGermany ? 'Gen. Gerhard von Bülow' : 'Gen. Arthur Vance',
      avatar: '🎖️',
      specialty: 'defense',
      skill: 'Tactical Commander',
      bonus: '-15% Civil War/Revolt Risk, +20 Military Readiness',
      salary: 18000,
      description: isTurkey 
        ? 'Terörle mücadele ve savunma sanayii kıdemlisi. İsyan riskini sıfırlar.' 
        : 'Military strategist. Drastically mitigates internal insurgencies.',
    },
    {
      id: 'cand_4',
      name: isTurkey ? 'Büyükelçi Selim Aras' : isGermany ? 'Dietrich von Ribbeck' : 'Julian Vance',
      avatar: '🌐',
      specialty: 'foreign',
      skill: 'Veteran Diplomat',
      bonus: '+15 International Reputation, +10 Diplomatic Relations globally',
      salary: 14000,
      description: isTurkey 
        ? 'Eski Birleşmiş Milletler temsilcisi. Dış ilişkileri canlandırır.' 
        : 'Experienced global negotiator. Lowers alliance treaty friction.',
    },
    {
      id: 'cand_5',
      name: isTurkey ? 'Meltem Şahin' : isGermany ? 'Franziska Brandt' : 'Eleanor Sterling',
      avatar: '👩‍🎤',
      specialty: 'general',
      skill: 'Populist Spokesperson',
      bonus: '+2% Monthly Popularity Boost across all regions',
      salary: 10000,
      description: isTurkey 
        ? 'Medya ve halkla ilişkiler uzmanı. Parti tabanını diri tutar.' 
        : 'Charismatic public relations lead. Keeps voters aligned.',
    },
    {
      id: 'cand_6',
      name: isTurkey ? 'Kemal Özkan' : isGermany ? 'Jan van Aken' : 'Heidi Reichinnek',
      avatar: '👨‍🌾',
      specialty: 'general',
      skill: 'Social Coordinator',
      bonus: '+10% Worker & Youth demographic support',
      salary: 8000,
      description: isTurkey 
        ? 'Sendikal arka planı olan teşkilatçı. Alt gelir gruplarını bağlar.' 
        : 'Union mediator. Deep roots in working class logistics.',
    }
  ];

  const handleAppoint = (post: string, candidate: Candidate) => {
    // Check if player has enough budget to hire this minister (at least salary * 2 as safety deposit)
    if (treasury < candidate.salary) {
      playSound('error');
      setErrorMessage(`Insufficient National Treasury budget! Appointing ${candidate.name} requires paying a sign-on salary of ${candidate.salary.toLocaleString()}.`);
      setSuccessMessage(null);
      return;
    }

    // Deduct salary from treasury
    onUpdateTreasury(treasury - candidate.salary);

    const updatedCabinet = {
      ...cabinet,
      [post]: {
        name: candidate.name,
        avatar: candidate.avatar,
        skill: candidate.skill,
        bonus: candidate.bonus,
        salary: candidate.salary,
      }
    };

    onUpdateCabinet(updatedCabinet);
    playSound('success');
    setSuccessMessage(`Successfully appointed ${candidate.name} as your new Minister! Special Bonus: ${candidate.bonus} activated.`);
    setErrorMessage(null);
  };

  const handleDismiss = (post: string) => {
    const updatedCabinet = {
      ...cabinet,
      [post]: { name: 'Unassigned', avatar: '💼', skill: 'None', bonus: 'None', salary: 0 }
    };
    onUpdateCabinet(updatedCabinet);
    playSound('error');
    setSuccessMessage(`Minister has been dismissed from the cabinet post.`);
    setErrorMessage(null);
  };

  const getCurrencySymbol = () => {
    if (country.id === 'US') return '$';
    if (country.id === 'TR') return '₺';
    if (country.id === 'DE') return '€';
    if (country.id === 'GB') return '£';
    if (country.id === 'JP') return '¥';
    return '$';
  };

  const currency = getCurrencySymbol();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Reshuffle Notice Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900/60 to-slate-900/60 border border-indigo-500/30 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> CABINET FORMATION ENGINE (GOVERNMENT PHASE)
          </span>
          <h3 className="text-lg font-black tracking-tight mt-1">Form or Reshuffle Your Cabinet Ministers</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Assign specialists to key government posts. Each minister draws a salary from the National Treasury every turn, but awards massive strategic buffs to your taxation, internal freedom index, and defense networks.
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] font-mono text-slate-400">STATE TREASURY</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{currency}{treasury.toLocaleString()}</span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of 4 Ministerial Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'finance', title: 'Minister of Finance', placeholder: '💼 No Fiscal Lead' },
          { key: 'interior', title: 'Minister of Interior', placeholder: '🛡️ No Civil/Unrest Lead' },
          { key: 'defense', title: 'Minister of Defense', placeholder: '⚔️ No Defence Commander' },
          { key: 'foreign', title: 'Minister of Foreign Affairs', placeholder: '🌐 No Diplomacy Ambassador' }
        ].map((post) => {
          const assigned = cabinet[post.key];
          const hasAssigned = assigned && assigned.name !== 'Unassigned';

          return (
            <div
              key={post.key}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                hasAssigned 
                  ? darkMode ? 'bg-indigo-950/15 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200'
                  : darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono pb-2 border-b border-slate-500/10 flex items-center justify-between">
                  <span>{post.title}</span>
                  {hasAssigned && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </h4>

                {hasAssigned ? (
                  <div className="mt-4 text-center">
                    <span className="text-4xl block animate-bounce">{assigned.avatar}</span>
                    <h5 className="font-extrabold text-sm text-slate-100 mt-2">{assigned.name}</h5>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                      {assigned.skill}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2.5 bg-black/10 p-2.5 rounded-xl border border-slate-500/5 leading-relaxed font-medium">
                      <strong>Active Buff:</strong> {assigned.bonus}
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 mt-2 font-bold">
                      Salary: {currency}{assigned.salary.toLocaleString()} / Turn
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 font-mono text-xs">
                    {post.placeholder}
                  </div>
                )}
              </div>

              {hasAssigned ? (
                <button
                  type="button"
                  onClick={() => handleDismiss(post.key)}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Dismiss Minister
                </button>
              ) : (
                <div className="text-center text-[10px] text-slate-500 font-mono uppercase font-bold">
                  VACANT POSITION
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Candidates Pool section */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 mb-4 pb-2 border-b border-slate-500/10">
          AVAILABLE ELITE MINISTER CANDIDATES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((cand) => {
            // Find which post can take this candidate
            let postKey = 'finance';
            if (cand.specialty === 'interior') postKey = 'interior';
            else if (cand.specialty === 'defense') postKey = 'defense';
            else if (cand.specialty === 'foreign') postKey = 'foreign';
            else {
              // General candidates can be appointed to any vacant post
              const vacancies = ['finance', 'interior', 'defense', 'foreign'].filter(k => (cabinet as any)[k].name === 'Unassigned');
              postKey = vacancies.length > 0 ? vacancies[0] : 'finance';
            }

            const isAlreadyAppointed = Object.values(cabinet as any).some((c: any) => c.name === cand.name);

            return (
              <div
                key={cand.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                  isAlreadyAppointed
                    ? 'opacity-40 bg-slate-950/20 border-slate-900'
                    : darkMode ? 'bg-slate-950/40 border-slate-850 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex gap-3">
                  <span className="text-3xl p-1 bg-slate-500/5 rounded-xl border border-slate-500/10 h-fit shrink-0">
                    {cand.avatar}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100">{cand.name}</h4>
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase inline-block mt-0.5 font-bold">
                      {cand.skill}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                      {cand.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-500/5 flex flex-col gap-2">
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                    <span>SPECIALTY POST: <strong className="text-indigo-400 uppercase">{cand.specialty}</strong></span>
                    <span>SALARY: <strong className="text-amber-400">{currency}{cand.salary.toLocaleString()}</strong></span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 leading-relaxed bg-black/15 p-2 rounded-lg border border-slate-500/5">
                    <strong>Buff:</strong> {cand.bonus}
                  </div>

                  {!isAlreadyAppointed ? (
                    <button
                      type="button"
                      onClick={() => handleAppoint(postKey, cand)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                    >
                      Appoint as Minister of {postKey.charAt(0).toUpperCase() + postKey.slice(1)} <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="w-full py-2 text-center text-[10px] font-mono text-slate-500 uppercase font-bold border border-dashed border-slate-800 rounded-xl">
                      Active Minister
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
