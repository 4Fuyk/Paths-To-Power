/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Settings, Globe } from 'lucide-react';

interface StartScreenProps {
  darkMode: boolean;
  onPlay: () => void;
  onSettings?: () => void;
  onLanguages?: () => void;
}

const CONTINENTS = [
  "M100,70 C140,55 190,58 220,80 C245,98 240,125 225,145 C235,165 220,190 195,195 C175,220 150,215 140,190 C110,180 90,150 95,115 C88,95 85,80 100,70 Z",
  "M205,240 C230,235 250,255 248,285 C255,320 240,365 220,400 C210,420 190,415 185,390 C170,350 175,300 185,265 C188,250 195,242 205,240 Z",
  "M455,65 C480,55 510,60 525,75 C540,85 535,105 520,112 C525,125 505,135 490,128 C470,132 452,120 450,100 C445,85 448,72 455,65 Z",
  "M450,175 C490,168 535,178 555,210 C570,240 565,280 545,320 C535,355 515,385 495,378 C480,370 478,345 470,320 C450,285 440,245 445,210 C444,197 444,184 450,175 Z",
  "M565,45 C630,35 710,42 770,60 C830,72 890,90 905,120 C915,145 890,160 860,155 C845,175 810,178 790,160 C755,175 715,168 690,150 C650,160 605,150 580,120 C560,100 555,70 565,45 Z",
  "M800,330 C835,322 875,330 890,352 C900,372 880,392 850,393 C825,398 795,388 788,368 C782,352 788,338 800,330 Z",
];

const CAPITALS: [number, number][] = [
  [150, 110], [225, 320], [485, 95], [500, 250], [700, 100], [845, 360], [730, 220], [330, 150],
];

const ROUTES: [number, number, number, number][] = [
  [150, 110, 485, 95],
  [485, 95, 700, 100],
  [700, 100, 845, 360],
  [500, 250, 225, 320],
  [485, 95, 500, 250],
  [150, 110, 225, 320],
];

export function StartScreen({ darkMode, onPlay, onSettings, onLanguages }: StartScreenProps) {
  return (
    <div
      className={`relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] overflow-hidden ${
        darkMode ? 'bg-[#05070d]' : 'bg-slate-50'
      }`}
    >
      <style>{`
        @keyframes ptp-dash { to { stroke-dashoffset: -400; } }
        @keyframes ptp-blip { 0%, 100% { opacity: .35; r: 2.2; } 50% { opacity: 1; r: 3.4; } }
        @keyframes ptp-impact { 0% { opacity: 0; transform: scale(.6); } 30% { opacity: .55; } 100% { opacity: 0; transform: scale(1.6); } }
        .ptp-route { stroke-dasharray: 6 10; animation: ptp-dash 14s linear infinite; }
        .ptp-blip { animation: ptp-blip 3s ease-in-out infinite; }
        .ptp-impact { animation: ptp-impact 2.6s ease-out infinite; }
        .ptp-title-scuff {
          -webkit-mask-image: repeating-linear-gradient(115deg, #000 0px, #000 3px, transparent 3px, transparent 5px);
          mask-image: repeating-linear-gradient(115deg, #000 0px, #000 3px, transparent 3px, transparent 5px);
        }
      `}</style>

      <div className={`absolute inset-0 z-0 ${darkMode ? 'opacity-[0.16]' : 'opacity-[0.09]'}`}>
        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g stroke={darkMode ? '#3b4762' : '#94a3b8'} strokeWidth="0.6">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={500} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 100} x2={1000} y2={i * 100} />
            ))}
          </g>
          <g fill={darkMode ? '#c9a26a' : '#475569'}>
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill="none" stroke={darkMode ? '#c9a26a' : '#b3432f'} strokeWidth="1.1" opacity={darkMode ? 0.8 : 0.6}>
            {ROUTES.map(([x1, y1, x2, y2], i) => (
              <line key={i} className="ptp-route" x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
          </g>
          <g fill={darkMode ? '#e7c98f' : '#b3432f'}>
            {CAPITALS.map(([x, y], i) => (
              <circle key={i} className="ptp-blip" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r={2.4} />
            ))}
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

      <div className="z-10 flex flex-col items-center justify-center px-8 py-16 max-w-2xl text-center gap-10">
        <div className="flex items-center gap-3">
          <span className={`h-px w-10 ${darkMode ? 'bg-[#c9a26a]/50' : 'bg-slate-400'}`} />
          <span className={`text-[11px] tracking-[0.35em] font-mono font-bold ${darkMode ? 'text-[#c9a26a]' : 'text-slate-500'}`}>
            GLOBAL CAMPAIGN SIMULATOR
          </span>
          <span className={`h-px w-10 ${darkMode ? 'bg-[#c9a26a]/50' : 'bg-slate-400'}`} />
        </div>

        <div className="relative select-none">
          <h1
            className={`ptp-title-scuff text-6xl md:text-8xl font-black tracking-tighter font-mono leading-[0.95] ${
              darkMode ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            PATHS TO
            <br />
            POWER
          </h1>

          <svg
            viewBox="0 0 220 140"
            className="absolute -right-6 -bottom-8 w-40 md:w-56 rotate-[-16deg] pointer-events-none"
            style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
          >
            <circle
              cx="110"
              cy="70"
              r="55"
              fill="#b3432f"
              className="ptp-impact"
              style={{ transformOrigin: '110px 70px' }}
            />
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
            onClick={onPlay}
            className="group w-full px-12 py-5 bg-gradient-to-b from-[#dab97c] to-[#b8925a] hover:from-[#e6c78d] hover:to-[#c49f68] text-[#1a1206] font-black rounded-lg shadow-xl shadow-black/40 transition-all text-xl uppercase tracking-widest border border-[#8a6a3a] hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSettings}
              className={`px-6 py-3.5 font-bold rounded-lg transition-all text-sm border uppercase tracking-wider hover:scale-[1.02] flex items-center justify-center gap-2 ${
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
              className={`px-6 py-3.5 font-bold rounded-lg transition-all text-sm border uppercase tracking-wider hover:scale-[1.02] flex items-center justify-center gap-2 ${
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
    </div>
  );
}
