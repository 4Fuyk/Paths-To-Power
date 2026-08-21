/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Play, Settings, Globe, Zap, Shield, Flame, X, ChevronRight, 
  ChevronLeft, Sparkles, AlertTriangle, Globe2, Crown, Check, Layers
} from 'lucide-react';
import { GameDifficulty, ScenarioYear } from '../types';
import { HISTORICAL_SCENARIOS } from '../constants/scenarios';

interface StartScreenProps {
  darkMode: boolean;
  onPlay: (difficulty: GameDifficulty, scenario: ScenarioYear) => void;
  onSettings?: () => void;
  onLanguages?: () => void;
}

const CONTINENTS = [
  "M 41.7,61.1 L 69.4,83.3 L 125.0,88.9 L 138.9,97.2 L 144.4,111.1 L 155.6,113.9 L 158.3,122.2 L 161.1,147.2 L 175.0,161.1 L 188.9,186.1 L 208.3,194.4 L 230.6,205.6 L 244.4,208.3 L 255.6,191.7 L 230.6,177.8 L 238.9,169.4 L 252.8,166.7 L 275.0,180.6 L 277.8,177.8 L 275.0,163.9 L 286.1,155.6 L 291.7,152.8 L 294.4,136.9 L 305.6,136.1 L 313.9,125.0 L 316.7,125.0 L 322.2,122.2 L 333.3,122.2 L 352.8,119.4 L 347.2,105.6 L 319.4,88.9 L 291.7,83.3 L 263.9,61.1 L 236.1,55.6 L 194.4,55.6 L 138.9,52.8 L 97.2,55.6 L 66.7,52.8 L 41.7,61.1 Z",
  "M 375.0,83.3 L 438.9,83.3 L 444.4,55.6 L 430.6,36.1 L 388.9,19.4 L 347.2,22.2 L 319.4,38.9 L 327.8,55.6 L 347.2,75.0 L 375.0,83.3 Z",
  "M 286.1,227.8 L 300.0,219.4 L 327.8,219.4 L 355.6,238.9 L 402.8,266.7 L 394.4,277.8 L 388.9,286.1 L 394.4,294.4 L 391.7,305.6 L 380.6,313.9 L 366.7,322.2 L 352.8,333.3 L 341.7,344.4 L 338.9,347.2 L 327.8,361.1 L 311.1,394.4 L 305.6,402.8 L 297.2,394.4 L 294.4,377.8 L 297.2,361.1 L 302.8,341.7 L 302.8,319.4 L 305.6,300.0 L 291.7,272.2 L 277.8,263.9 L 277.8,250.0 L 283.3,244.4 L 286.1,227.8 Z",
  "M 483.3,150.0 L 505.6,147.2 L 527.8,147.2 L 530.6,155.6 L 555.6,161.1 L 569.4,163.9 L 591.7,163.9 L 597.2,172.2 L 605.6,208.3 L 619.4,219.4 L 641.7,216.7 L 636.1,222.2 L 622.2,238.9 L 613.9,255.6 L 611.1,272.2 L 597.2,291.7 L 597.2,305.6 L 611.1,305.6 L 597.2,319.4 L 591.7,325.0 L 577.8,341.7 L 550.0,344.4 L 541.7,333.3 L 533.3,300.0 L 536.1,277.8 L 525.0,255.6 L 508.3,233.3 L 488.9,236.1 L 475.0,236.1 L 469.4,230.6 L 463.9,225.0 L 452.8,208.3 L 455.6,194.4 L 472.2,166.7 L 483.3,150.0 Z",
  "M 619.4,283.3 L 630.6,286.1 L 638.9,294.4 L 630.6,319.4 L 622.2,319.4 L 619.4,305.6 L 619.4,283.3 Z",
  "M 475.0,130.6 L 494.4,130.6 L 508.3,130.6 L 519.4,127.8 L 525.0,125.0 L 536.1,122.2 L 538.9,138.9 L 550.0,138.9 L 555.6,152.8 L 563.9,144.4 L 569.4,138.9 L 577.8,136.1 L 597.2,150.0 L 600.0,155.6 L 580.6,136.1 L 566.7,127.8 L 577.8,125.0 L 583.3,122.2 L 575.0,116.7 L 566.7,111.1 L 552.8,111.1 L 541.7,100.0 L 530.6,100.0 L 522.2,100.0 L 513.9,108.3 L 505.6,108.3 L 494.4,113.9 L 486.1,116.7 L 475.0,130.6 Z",
  "M 513.9,88.9 L 522.2,88.9 L 530.6,86.1 L 530.6,75.0 L 538.9,63.9 L 555.6,55.6 L 569.4,52.8 L 577.8,58.3 L 561.1,75.0 L 550.0,88.9 L 533.3,94.4 L 522.2,94.4 L 513.9,88.9 Z",
  "M 583.3,111.1 L 611.1,116.7 L 633.3,119.4 L 652.8,108.3 L 666.7,100.0 L 661.1,83.3 L 680.6,77.8 L 694.4,63.9 L 716.7,50.0 L 750.0,47.2 L 791.7,47.2 L 833.3,50.0 L 875.0,52.8 L 916.7,61.1 L 952.8,83.3 L 972.2,72.2 L 994.4,61.1 L 952.8,61.1 L 888.9,75.0 L 855.6,97.2 L 827.8,102.8 L 805.6,111.1 L 777.8,111.1 L 750.0,111.1 L 722.2,116.7 L 694.4,111.1 L 666.7,105.6 L 644.4,125.0 L 625.0,133.3 L 605.6,127.8 L 588.9,122.2 L 583.3,111.1 Z",
  "M 591.7,147.2 L 605.6,147.2 L 622.2,147.2 L 633.3,166.7 L 644.4,175.0 L 655.6,177.8 L 663.9,186.1 L 661.1,202.8 L 647.2,213.9 L 633.3,216.7 L 622.2,213.9 L 616.7,205.6 L 602.8,188.9 L 597.2,172.2 L 591.7,163.9 L 597.2,161.1 L 591.7,147.2 Z",
  "M 688.9,183.3 L 700.0,188.9 L 694.4,191.7 L 702.8,205.6 L 708.3,216.7 L 713.9,227.8 L 722.2,225.0 L 722.2,213.9 L 730.6,202.8 L 741.7,191.7 L 744.4,188.9 L 755.6,188.9 L 761.1,191.7 L 755.6,180.6 L 744.4,177.8 L 733.3,177.8 L 722.2,172.2 L 711.1,166.7 L 700.0,169.4 L 688.9,183.3 Z",
  "M 702.8,166.7 L 716.7,166.7 L 736.1,172.2 L 755.6,172.2 L 772.2,172.2 L 783.3,172.2 L 805.6,180.6 L 838.9,166.7 L 838.9,161.1 L 836.1,163.9 L 830.6,180.6 L 811.1,188.9 L 800.0,191.7 L 800.0,222.2 L 791.7,225.0 L 786.1,244.4 L 780.6,247.2 L 777.8,236.1 L 772.2,227.8 L 763.9,208.3 L 763.9,194.4 L 750.0,188.9 L 736.1,177.8 L 722.2,172.2 L 711.1,166.7 L 702.8,166.7 Z",
  "M 847.2,155.6 L 858.3,152.8 L 861.1,147.2 L 855.6,141.7 L 847.2,138.9 L 844.4,147.2 L 847.2,155.6 Z",
  "M 861.1,163.9 L 866.7,158.3 L 875.0,155.6 L 880.6,152.8 L 888.9,150.0 L 891.7,141.7 L 894.4,138.9 L 891.7,130.6 L 900.0,127.8 L 902.8,130.6 L 894.4,141.7 L 888.9,152.8 L 875.0,158.3 L 861.1,163.9 Z",
  "M 486.1,111.1 L 491.7,108.3 L 502.8,108.3 L 500.0,102.8 L 491.7,97.2 L 486.1,88.9 L 483.3,88.9 L 486.1,97.2 L 483.3,102.8 L 486.1,111.1 Z",
  "M 763.9,236.1 L 772.2,241.7 L 786.1,247.2 L 791.7,258.3 L 805.6,269.4 L 819.4,272.2 L 830.6,272.2 L 841.7,275.0 L 861.1,258.3 L 875.0,255.6 L 888.9,258.3 L 888.9,272.2 L 872.2,266.7 L 838.9,263.9 L 825.0,252.8 L 805.6,252.8 L 786.1,263.9 L 777.8,255.6 L 766.7,241.7 L 763.9,236.1 Z",
  "M 813.9,311.1 L 816.7,325.0 L 819.4,338.9 L 822.2,344.4 L 827.8,347.2 L 838.9,344.4 L 863.9,338.9 L 872.2,341.7 L 883.3,347.2 L 888.9,355.6 L 902.8,355.6 L 908.3,355.6 L 916.7,352.8 L 925.0,325.0 L 925.0,316.7 L 905.6,302.8 L 897.2,288.9 L 891.7,280.6 L 880.6,283.3 L 863.9,283.3 L 850.0,288.9 L 838.9,300.0 L 816.7,311.1 L 813.9,311.1 Z",
  "M 980.6,363.9 L 986.1,366.7 L 983.3,375.0 L 975.0,372.2 L 966.7,372.2 L 972.2,361.1 L 980.6,363.9 Z",
];

const CAPITALS: [string, number, number][] = [
  ["Washington", 286.1, 141.7],
  ["London", 500.0, 106.9],
  ["Moscow", 604.4, 95.1],
  ["Ankara", 591.2, 139.2],
  ["Beijing", 823.3, 139.2],
  ["New Delhi", 714.4, 170.6],
  ["Cairo", 586.7, 166.7],
  ["Brasilia", 366.9, 293.9],
  ["Canberra", 914.2, 348.1],
  ["Tokyo", 888.1, 150.8],
];

const ROUTES: [number, number, number, number][] = [
  [286.1, 141.7, 500.0, 106.9],
  [500.0, 106.9, 604.4, 95.1],
  [604.4, 95.1, 823.3, 139.2],
  [823.3, 139.2, 888.1, 150.8],
  [591.2, 139.2, 714.4, 170.6],
  [591.2, 139.2, 586.7, 166.7],
  [286.1, 141.7, 366.9, 293.9],
  [823.3, 139.2, 914.2, 348.1],
];

const WORLD_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

function project(lon: number, lat: number): [number, number] {
  return [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500];
}

function ringToPath(ring: number[][], stride: number = 2): string {
  const pts = ring.filter((_, i) => i % stride === 0);
  if (pts.length < 3) return '';
  return 'M ' + pts.map((c) => project(c[0], c[1]).map((n) => n.toFixed(1)).join(',')).join(' L ') + ' Z';
}

function featurePaths(feature: any, stride: number): string[] {
  const geom = feature?.geometry;
  if (!geom) return [];
  const out: string[] = [];
  if (geom.type === 'Polygon') {
    for (const ring of geom.coordinates) {
      const p = ringToPath(ring, stride);
      if (p) out.push(p);
    }
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      for (const ring of poly) {
        const p = ringToPath(ring, stride);
        if (p) out.push(p);
      }
    }
  }
  return out;
}

export function StartScreen({ darkMode, onPlay, onSettings, onLanguages }: StartScreenProps) {
  const [capitalScene, setCapitalScene] = useState(0);
  const [worldPaths, setWorldPaths] = useState<string[]>(CONTINENTS);
  
  // Game Setup Modal States
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [setupStep, setSetupStep] = useState<'SCENARIO' | 'DIFFICULTY'>('SCENARIO');
  const [selectedScenarioYear, setSelectedScenarioYear] = useState<ScenarioYear>('2026');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('NORMAL');

  useEffect(() => {
    fetch(WORLD_URL)
      .then(res => res.json())
      .then(data => {
        const paths: string[] = [];
        data.features.forEach((f: any) => {
          paths.push(...featurePaths(f, 2));
        });
        if (paths.length > 0) setWorldPaths(paths);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCapitalScene((s) => (s + 1) % CAPITALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  const [, focusX, focusY] = CAPITALS[capitalScene];
  const activeScenario = HISTORICAL_SCENARIOS.find(s => s.id === selectedScenarioYear) || HISTORICAL_SCENARIOS[0];

  const handleProceedToDifficulty = () => {
    setSetupStep('DIFFICULTY');
  };

  const handleStartGame = () => {
    setShowSetupModal(false);
    onPlay(selectedDifficulty, selectedScenarioYear);
  };

  return (
    <div
      className={`relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] overflow-hidden ${
        darkMode ? 'bg-[#05070d]' : 'bg-slate-50'
      }`}
    >
      <style>{`
        @keyframes ptp-dash { to { stroke-dashoffset: -400; } }
        .ptp-route { stroke-dasharray: 6 10; animation: ptp-dash 14s linear infinite; }
        .ptp-title-scuff {
          -webkit-mask-image: repeating-linear-gradient(115deg, #000 0px, #000 3px, transparent 3px, transparent 5px);
          mask-image: repeating-linear-gradient(115deg, #000 0px, #000 3px, transparent 3px, transparent 5px);
        }
        .ptp-spot { transition: cx 3.5s cubic-bezier(0.22, 1, 0.36, 1), cy 3.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .ptp-epoch-label { animation: ptp-fade-in 0.6s ease; }
        @keyframes ptp-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-pop-forward {
          0% { opacity: 0; transform: perspective(1000px) translateZ(-50px) scale(0.95); }
          100% { opacity: 1; transform: perspective(1000px) translateZ(0) scale(1); }
        }
        .animate-slide-pop {
          animation: slide-pop-forward 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* World Map Grid Background */}
      <div className={`absolute inset-0 z-0 ${darkMode ? 'opacity-[0.6]' : 'opacity-[0.35]'}`}>
        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <g>
            <g stroke={darkMode ? '#4a5a7a' : '#94a3b8'} strokeWidth="0.6">
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={500} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * 100} x2={1000} y2={i * 100} />
              ))}
            </g>

            <g
              fill={darkMode ? '#d8ae72' : '#334155'}
              stroke={darkMode ? '#f2d9a8' : '#0f172a'}
              strokeWidth="0.8"
              strokeOpacity={darkMode ? 0.85 : 0.6}
            >
              {worldPaths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>

            <g fill="none" stroke={darkMode ? '#c9a26a' : '#b3432f'} strokeWidth="1.1" opacity={darkMode ? 0.8 : 0.6}>
              {ROUTES.map(([x1, y1, x2, y2], i) => (
                <line key={i} className="ptp-route" x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
            <g fill={darkMode ? '#e7c98f' : '#b3432f'}>
              {CAPITALS.map(([name, x, y], i) => (
                <circle key={name} r={i === capitalScene ? 4 : 2.2} cx={x} cy={y} opacity={i === capitalScene ? 1 : 0.55} />
              ))}
            </g>
            <circle className="ptp-spot" cx={focusX} cy={focusY} r="70" fill="url(#ptp-spot-glow)" />

            <defs>
              <radialGradient id="ptp-spot-glow">
                <stop offset="0%" stopColor="#b3432f" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#b3432f" stopOpacity="0" />
              </radialGradient>
            </defs>
          </g>
        </svg>
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: darkMode
            ? 'radial-gradient(ellipse at center, transparent 35%, #05070d 92%)'
            : 'radial-gradient(ellipse at center, transparent 45%, #f8fafc 92%)',
        }}
      />

      {/* Main Title Center Hero */}
      <div className="z-10 flex flex-col items-center justify-center px-8 pt-6 pb-12 max-w-2xl text-center gap-6">
        <div className="flex items-center gap-3">
          <span className={`h-px w-10 ${darkMode ? 'bg-[#c9a26a]/50' : 'bg-slate-400'}`} />
          <span className={`text-[11px] tracking-[0.35em] font-mono font-bold ${darkMode ? 'text-[#c9a26a]' : 'text-slate-500'}`}>
            GLOBAL CAMPAIGN SIMULATOR
          </span>
          <span className={`h-px w-10 ${darkMode ? 'bg-[#c9a26a]/50' : 'bg-slate-400'}`} />
        </div>

        <div className="relative select-none">
          <h1
            className={`ptp-title-scuff text-5xl md:text-6xl font-black tracking-tighter font-mono leading-[0.95] ${
              darkMode ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            PATHS TO
            <br />
            POWER
          </h1>

          <svg
            viewBox="0 0 220 140"
            className="absolute -right-4 -bottom-6 w-32 md:w-44 rotate-[-16deg] pointer-events-none"
            style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
          >
            <g fill={darkMode ? '#c9a26a' : '#334155'} opacity={darkMode ? 0.92 : 0.75}>
              <path d="M95,10 C130,8 150,25 152,55 C154,80 148,100 152,118 C154,132 140,138 122,134 C100,140 70,138 58,128 C42,124 38,108 44,92 C36,75 38,52 52,35 C60,18 78,11 95,10 Z" />
            </g>
            <g stroke={darkMode ? '#05070d' : '#e2e8f0'} strokeWidth="5" strokeLinecap="round">
              <line x1="55" y1="30" x2="135" y2="30" />
              <line x1="50" y1="48" x2="145" y2="46" />
              <line x1="47" y1="66" x2="150" y2="64" />
              <line x1="47" y1="84" x2="150" y2="84" />
              <line x1="50" y1="102" x2="145" y2="104" />
              <line x1="58" y1="120" x2="130" y2="122" />
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-1 w-full max-w-xs justify-center">
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              className={`${i % 5 === 0 ? 'h-2.5' : 'h-1'} w-px ${darkMode ? 'bg-[#c9a26a]/60' : 'bg-slate-400'}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={() => {
              setSetupStep('SCENARIO');
              setShowSetupModal(true);
            }}
            className="group w-full px-12 py-5 bg-gradient-to-b from-[#dab97c] to-[#b8925a] hover:from-[#e6c78d] hover:to-[#c49f68] text-[#1a1206] font-black rounded-lg shadow-xl shadow-black/40 transition-all text-xl uppercase tracking-widest border border-[#8a6a3a] hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSettings}
              className={`px-6 py-3.5 font-bold rounded-lg transition-all text-sm border uppercase tracking-wider hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer ${
                darkMode
                  ? 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-[#c9a26a]/40'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={onLanguages}
              className={`px-6 py-3.5 font-bold rounded-lg transition-all text-sm border uppercase tracking-wider hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer ${
                darkMode
                  ? 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-[#c9a26a]/40'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              Languages
            </button>
          </div>
        </div>
      </div>

      {/* Two-Step Setup Modal: Vertical Scenario Selection & Difficulty Selection */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`relative w-full max-w-5xl h-[88vh] max-h-[850px] flex flex-col p-5 sm:p-7 rounded-2xl border shadow-2xl transition-all ${
              darkMode
                ? 'bg-[#0b0f19] border-[#c9a26a]/35 text-slate-100 shadow-black/80'
                : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
            }`}
          >
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${darkMode ? 'text-[#c9a26a]' : 'text-amber-600'}`} />
                  <span className={`text-[11px] font-mono tracking-widest uppercase font-bold ${
                    darkMode ? 'text-[#c9a26a]' : 'text-amber-700'
                  }`}>
                    CAMPAIGN SETUP • STEP {setupStep === 'SCENARIO' ? '1/2' : '2/2'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 font-mono">
                  {setupStep === 'SCENARIO' ? 'Select Historical Scenario' : 'Select Campaign Difficulty'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupModal(false)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  darkMode
                    ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container to prevent any overlap with bottom bar */}
            <div className="flex-1 overflow-y-auto min-h-0 py-4 pr-1">
              {/* STEP 1: VERTICAL SCENARIO LIST + DETAILED POWERPOINT SLIDE PRESENTATION */}
              {setupStep === 'SCENARIO' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: VERTICAL STACK OF SCENARIOS */}
                  <div className="lg:col-span-4 flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 px-1 pb-1">
                      <Layers className="w-3.5 h-3.5 text-[#c9a26a]" />
                      Historical Eras ({HISTORICAL_SCENARIOS.length})
                    </span>

                    {HISTORICAL_SCENARIOS.map((scen) => {
                      const isSelected = selectedScenarioYear === scen.id;
                      return (
                        <button
                          key={scen.id}
                          type="button"
                          onClick={() => setSelectedScenarioYear(scen.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? darkMode
                                ? 'bg-gradient-to-r from-[#c9a26a]/25 to-[#c9a26a]/10 border-[#c9a26a] text-[#dab97c] shadow-lg shadow-[#c9a26a]/10 ring-1 ring-[#c9a26a]/50 scale-[1.01]'
                                : 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-600 text-amber-950 shadow-md ring-1 ring-amber-500/40 scale-[1.01]'
                              : darkMode
                              ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 hover:border-white/20'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`px-2 py-1 rounded-md font-mono font-black text-sm border shrink-0 ${
                              isSelected
                                ? 'bg-[#c9a26a] text-[#1a1206] border-[#8a6a3a]'
                                : darkMode
                                ? 'bg-white/5 border-white/10 text-slate-300'
                                : 'bg-white border-slate-300 text-slate-700'
                            }`}>
                              {scen.year}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm truncate">{scen.title}</h4>
                              <span className="text-[9px] uppercase font-mono opacity-70 block">
                                Tension: {scen.globalTension}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {scen.statusTag === 'PLAYABLE' ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Ready to Play" />
                            ) : (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase opacity-60">
                                Preview
                              </span>
                            )}
                            {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: MAIN ACTIVE SCENARIO PRESENTATION SLIDE */}
                  <div className="lg:col-span-8 flex flex-col">
                    <div
                      key={activeScenario.id}
                      className={`animate-slide-pop p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                        darkMode
                          ? 'bg-gradient-to-br from-slate-900/95 via-[#0b1120] to-[#05070d] border-[#c9a26a]/40 shadow-2xl shadow-black/80'
                          : 'bg-gradient-to-br from-slate-50 via-amber-50/40 to-white border-amber-300 shadow-xl'
                      }`}
                    >
                      <div>
                        {/* Era Top Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider bg-[#c9a26a]/20 text-[#dab97c] border border-[#c9a26a]/40">
                              YEAR {activeScenario.year}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                              activeScenario.statusTag === 'PLAYABLE'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            }`}>
                              {activeScenario.statusTag === 'PLAYABLE' ? '● FULL MAP AVAILABLE' : '● ALPHA PREVIEW ERA'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <AlertTriangle className={`w-3.5 h-3.5 ${
                              activeScenario.globalTension === 'Extreme' || activeScenario.globalTension === 'Critical'
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`} />
                            <span className="text-slate-400">Global Tension:</span>
                            <span className={`font-bold ${
                              activeScenario.globalTension === 'Extreme' || activeScenario.globalTension === 'Critical'
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}>
                              {activeScenario.globalTension}
                            </span>
                          </div>
                        </div>

                        {/* Title & Tagline */}
                        <div className="mt-3.5">
                          <h4 className="text-xl sm:text-2xl font-black tracking-tight font-mono">
                            {activeScenario.title}
                          </h4>
                          <p className={`text-xs sm:text-sm italic mt-1 font-serif ${darkMode ? 'text-[#c9a26a]/90' : 'text-amber-800'}`}>
                            "{activeScenario.tagline}"
                          </p>
                        </div>

                        {/* Historical Briefing & World Order */}
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mt-2.5">
                          {activeScenario.description}
                        </p>

                        {/* World Order Summary Box */}
                        <div className={`mt-3.5 p-3 rounded-xl border flex items-start gap-2.5 ${
                          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-100/70 border-slate-200'
                        }`}>
                          <Globe2 className="w-4 h-4 text-[#c9a26a] shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <span className="font-bold text-slate-200 block mb-0.5">Geopolitical Order & Borders:</span>
                            {activeScenario.worldOrderSummary}
                          </div>
                        </div>

                        {/* Two-Column Grid: Flashpoints & Major Powers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5 pt-3.5 border-t border-white/10">
                          <div className={`p-3 rounded-xl border ${darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200'}`}>
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-1.5">
                              Key Historical Dynamics
                            </span>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {activeScenario.keyEvents.map((evt, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a26a] shrink-0" />
                                  <span className="truncate">{evt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className={`p-3 rounded-xl border ${darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200'}`}>
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 mb-1.5">
                              <Crown className="w-3 h-3 text-[#c9a26a]" /> Major Powers of {activeScenario.year}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {activeScenario.majorPowers.map((pwr, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300"
                                >
                                  {pwr}
                                </span>
                              ))}
                            </div>

                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mt-2.5 mb-1">
                              Dominant Ideologies
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {activeScenario.dominantIdeologies.map((ideo, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#c9a26a]/10 border border-[#c9a26a]/20 text-[#dab97c]"
                                >
                                  {ideo}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Era Selection Footer info inside Slide */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-400 font-mono truncate">
                          Active Selection: <strong className="text-[#dab97c]">{activeScenario.year} — {activeScenario.title}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {activeScenario.statusTag === 'PLAYABLE' ? '✓ Ready to Simulate' : '● Preview Era'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DIFFICULTY SELECTION */}
              {setupStep === 'DIFFICULTY' && (
                <div className="flex flex-col gap-3.5">
                  {/* Active Scenario Indicator Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    darkMode ? 'bg-[#c9a26a]/10 border-[#c9a26a]/30 text-slate-200' : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span className="font-bold uppercase tracking-wider text-[#dab97c]">Active Scenario:</span>
                      <span className="font-black text-sm">{activeScenario.year} — {activeScenario.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSetupStep('SCENARIO')}
                      className="text-xs font-bold underline cursor-pointer hover:opacity-80"
                    >
                      Change Era
                    </button>
                  </div>

                  {/* EASY */}
                  <div
                    onClick={() => setSelectedDifficulty('EASY')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      selectedDifficulty === 'EASY'
                        ? darkMode
                          ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50 scale-[1.01]'
                          : 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/30 scale-[1.01]'
                        : darkMode
                        ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedDifficulty === 'EASY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-white/5'
                      }`}
                    >
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          Easy / Accessible
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            +50% Budget
                          </span>
                        </h4>
                        <span className="text-xs font-mono text-emerald-400 font-bold">$300,000</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Generous initial campaign funds, amplified rally popularity gains, and mild opposition attack campaigns.
                      </p>
                    </div>
                  </div>

                  {/* NORMAL */}
                  <div
                    onClick={() => setSelectedDifficulty('NORMAL')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      selectedDifficulty === 'NORMAL'
                        ? darkMode
                          ? 'bg-[#c9a26a]/15 border-[#c9a26a] ring-1 ring-[#c9a26a]/50 scale-[1.01]'
                          : 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-500/30 scale-[1.01]'
                        : darkMode
                        ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedDifficulty === 'NORMAL'
                          ? 'bg-[#c9a26a]/20 text-[#dab97c] border border-[#c9a26a]/40'
                          : 'bg-slate-800/40 text-slate-400 border border-white/5'
                      }`}
                    >
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          Normal / Realistic
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-[#c9a26a]/20 text-[#dab97c] border border-[#c9a26a]/40">
                            Standard Simulation
                          </span>
                        </h4>
                        <span className="text-xs font-mono text-[#dab97c] font-bold">$200,000</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Authentic historical balance. Active rival movements, realistic voter volatility, and nuanced parliamentary math.
                      </p>
                    </div>
                  </div>

                  {/* HARD */}
                  <div
                    onClick={() => setSelectedDifficulty('HARD')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      selectedDifficulty === 'HARD'
                        ? darkMode
                          ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50 scale-[1.01]'
                          : 'bg-rose-50/80 border-rose-500 ring-1 ring-rose-500/30 scale-[1.01]'
                        : darkMode
                        ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedDifficulty === 'HARD'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-white/5'
                      }`}
                    >
                      <Flame className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          Hard / Political Hardcore
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Hardcore
                          </span>
                        </h4>
                        <span className="text-xs font-mono text-rose-400 font-bold">$130,000</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Strict treasury limitations, intense opposition smear campaigns, high scandal vulnerability, and contested majorities.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions (Always pinned cleanly at bottom, completely separate from scroll area) */}
            <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-white/10 shrink-0">
              {setupStep === 'SCENARIO' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowSetupModal(false)}
                    className={`px-5 py-2.5 rounded-lg border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                      darkMode
                        ? 'border-white/10 text-slate-300 hover:bg-white/5'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Cancel Setup
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToDifficulty}
                    className="px-6 py-2.5 bg-gradient-to-b from-[#dab97c] to-[#b8925a] hover:from-[#e6c78d] hover:to-[#c49f68] text-[#1a1206] font-bold rounded-lg shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    Next: Choose Difficulty
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSetupStep('SCENARIO')}
                    className={`px-5 py-2.5 rounded-lg border font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                      darkMode
                        ? 'border-white/10 text-slate-300 hover:bg-white/5'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Scenarios
                  </button>
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="px-7 py-2.5 bg-gradient-to-b from-[#dab97c] to-[#b8925a] hover:from-[#e6c78d] hover:to-[#c49f68] text-[#1a1206] font-bold rounded-lg shadow-lg transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    Launch Campaign
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
