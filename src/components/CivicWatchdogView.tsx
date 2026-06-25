import React, { useState, useEffect } from 'react';
import { Country, Party } from '../types';
import { playSound } from '../lib/sounds';
import { 
  ShieldCheck, Info, FileText, Award, Landmark, AlertTriangle, 
  Activity, ArrowRight, UserCheck, Flame, Scale
} from 'lucide-react';

interface CivicWatchdogViewProps {
  country: Country;
  party: Party;
  freedomIndex: number;
  internationalReputation: number;
  bannedPartiesCount: number;
  publicApprovalImpact: (approvalChange: number) => void;
  onUpdateReputation: (repChange: number) => void;
  darkMode: boolean;
}

export const CivicWatchdogView: React.FC<CivicWatchdogViewProps> = ({
  country,
  party,
  freedomIndex,
  internationalReputation,
  bannedPartiesCount,
  publicApprovalImpact,
  onUpdateReputation,
  darkMode,
}) => {
  const [reports, setReports] = useState<{
    id: string;
    organization: string;
    title: string;
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
    impact: string;
    badge: string;
  }[]>([]);

  useEffect(() => {
    // Dynamically calculate grades and descriptions based on freedomIndex & party-ban state
    const hrScore = Math.max(0, freedomIndex - bannedPartiesCount * 12);
    const pressScore = Math.max(0, freedomIndex - bannedPartiesCount * 15 - (bannedPartiesCount > 0 ? 10 : 0));
    const corruptionScore = Math.min(100, Math.max(10, freedomIndex + 5 - (bannedPartiesCount * 8)));

    const getGrade = (score: number) => {
      if (score >= 85) return 'A';
      if (score >= 70) return 'B';
      if (score >= 55) return 'C';
      if (score >= 40) return 'D';
      return 'F';
    };

    const initialReports = [
      {
        id: 'rep_1',
        organization: 'Amnesty & Human Rights Watch',
        title: 'Annual Democratic Rights Audit',
        score: hrScore,
        grade: getGrade(hrScore),
        badge: '⚖️ Human Rights',
        summary: hrScore > 75 
          ? 'Civil liberties, legal representation, and freedom of assembly remain strongly guarded. State police show high operational tolerance.'
          : hrScore > 45 
          ? 'Moderate decline in constitutional protections. Pre-trial detentions and aggressive protest dispersals have been flagged in municipal centers.'
          : 'Severe human rights emergency. State crackdowns, party ban protocols, and silencing of political dissidents constitute systemic abuses.',
        impact: hrScore > 75 
          ? 'Boosts bilateral treaty acceptance rate by +10%.' 
          : hrScore > 45 
          ? 'Minor diplomatic friction. Bilateral opinions decay by -1/turn.' 
          : 'Critical reputation crash. Severely restricts access to Western military alliances.',
      },
      {
        id: 'rep_2',
        organization: 'Reporters Without Borders',
        title: 'World Press Freedom Index',
        score: pressScore,
        grade: getGrade(pressScore),
        badge: '📰 Press Liberty',
        summary: pressScore > 75 
          ? 'Independent journalism thrives. Multi-party broadcasting access is fully preserved in national networks.'
          : pressScore > 45 
          ? 'Noticeable expansion of state regulatory censorship and corporate broadcast buyouts restricting critical reporting.'
          : 'Total information blackout. Opposition channels permanently shuttered, investigative bloggers detained on national security charges.',
        impact: pressScore > 75 
          ? 'Voter turnout at rallies increased.' 
          : 'Popular support for the administration decays globally due to anti-censorship backlash.',
      },
      {
        id: 'rep_3',
        organization: 'Transparency International',
        title: 'Bribe Payers & Corruption Perceptions Index',
        score: corruptionScore,
        grade: getGrade(corruptionScore),
        badge: '💼 Anti-Corruption',
        summary: corruptionScore > 75 
          ? 'Bidding procedures for state logistical networks are clean. High institutional integrity across municipal departments.'
          : corruptionScore > 45 
          ? 'Backroom licensing deals and corporate lobbying shortcuts remain prominent but are occasionally prosecuted.'
          : 'Oligarchical networks have fully captured state departments. Treasury bidding is monopolized by government-aligned partners.',
        impact: corruptionScore > 75 
          ? '+5% State Tax Revenue due to minimized fiscal leakages.' 
          : 'High capital flight risk. Private investments fall.',
      }
    ];

    setReports(initialReports);
  }, [freedomIndex, bannedPartiesCount]);

  const handleAuditAppeal = () => {
    // Sponsoring state transparency audit
    publicApprovalImpact(3);
    onUpdateReputation(Math.min(100, internationalReputation + 5));
    playSound('success');
    alert('Bilateral Appeal Broadcasted: Sponsoring full international observers to audits! Watchdog associations noted the cooperation.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Civic Watchdog Header */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-rose-450 font-bold uppercase">CIVIC MONITORING & AUDITS</span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">Democratic Watchdogs</h2>
            <p className="text-xs text-slate-400 mt-1">
              Independent NGOs continuously audit your civil, journalistic, and institutional corruption records.
            </p>
          </div>
        </div>

        <button
          onClick={handleAuditAppeal}
          className="px-5 py-3 rounded-2xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg cursor-pointer shrink-0"
        >
          Cooperate with Global Observers
        </button>
      </div>

      {/* Grid of NGO Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((rep) => {
          return (
            <div
              key={rep.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                rep.grade === 'A' || rep.grade === 'B'
                  ? darkMode ? 'bg-indigo-950/10 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                  : rep.grade === 'C'
                  ? 'bg-black/15 border-slate-500/10'
                  : 'bg-rose-950/15 border-rose-500/20 text-rose-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start pb-2.5 border-b border-slate-500/10">
                  <span className="text-[10px] font-mono uppercase bg-slate-500/10 px-2 py-0.5 rounded text-indigo-400 font-bold">
                    {rep.badge}
                  </span>
                  <span className={`text-2xl font-black font-mono leading-none ${
                    rep.grade === 'A' ? 'text-emerald-400' :
                    rep.grade === 'B' ? 'text-cyan-400' :
                    rep.grade === 'C' ? 'text-amber-400' :
                    'text-rose-500 animate-pulse'
                  }`}>
                    Grade {rep.grade}
                  </span>
                </div>

                <div className="mt-3.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">{rep.organization}</span>
                  <h4 className="font-extrabold text-sm text-slate-100 mt-0.5">{rep.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                    {rep.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-500/10 text-[10px] font-mono text-slate-450 bg-black/15 p-2.5 rounded-xl border border-slate-500/5">
                <strong>Projected System Impact:</strong>
                <p className="mt-1 font-medium">{rep.impact}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
