/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Play, Settings, Globe } from 'lucide-react';
import { CONTINENTS } from '../constants/worldPaths';

interface StartScreenProps {
  darkMode: boolean;
  onPlay: () => void;
  onSettings?: () => void;
  onLanguages?: () => void;
}

const CAPITALS: [string, number, number][] = [
  ["Washington", 286.0, 133.1],
  ["London", 499.6, 98.1],
  ["Moscow", 604.5, 86.3],
  ["Ankara", 591.3, 130.2],
  ["Beijing", 823.4, 130.3],
  ["New Delhi", 714.5, 161.7],
  ["Cairo", 586.8, 157.7],
  ["Brasilia", 366.9, 285.0],
  ["Canberra", 914.2, 339.2],
  ["Tokyo", 888.0, 142.0],
];

const ROUTES: [number, number, number, number][] = [
  [286.0, 133.1, 499.6, 98.1],
  [499.6, 98.1, 604.5, 86.3],
  [604.5, 86.3, 823.4, 130.3],
  [823.4, 130.3, 888.0, 142.0],
  [591.3, 130.2, 714.5, 161.7],
  [591.3, 130.2, 586.8, 157.7],
  [286.0, 133.1, 366.9, 285.0],
  [823.4, 130.3, 914.2, 339.2],
];

const SCENE_MS = 5500;

export function StartScreen({ darkMode, onPlay, onSettings, onLanguages }: StartScreenProps) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScene((s) => (s + 1) % CAPITALS.length), SCENE_MS);
    return () => clearInterval(id);
  }, []);

  const [, focusX, focusY] = CAPITALS[scene];

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
        
        @keyframes border-shift {
          0%, 100% { stroke-opacity: 0.1; }
          50% { stroke-opacity: 0.85; }
        }
      `}</style>

      <div className={`absolute inset-0 z-0 ${darkMode ? 'opacity-[0.6]' : 'opacity-[0.35]'}`}>
        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="historical-borders-shift" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="3" result="noise" />
              <feColorMatrix type="hueRotate" values="0" result="shiftedNoise">
                <animate attributeName="values" from="0" to="360" dur="25s" repeatCount="indefinite" />
              </feColorMatrix>
              <feDisplacementMap in="SourceGraphic" in2="shiftedNoise" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
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
              strokeWidth="1.3"
              filter="url(#historical-borders-shift)"
            >
              {CONTINENTS.map((d, i) => (
                <path 
                  key={i} 
                  d={d} 
                  style={{
                    animation: `border-shift 12s ease-in-out infinite ${(i % 12) * -1}s`
                  }}
                />
              ))}
            </g>
            <g fill="none" stroke={darkMode ? '#c9a26a' : '#b3432f'} strokeWidth="1.1" opacity={darkMode ? 0.8 : 0.6}>
              {ROUTES.map(([x1, y1, x2, y2], i) => (
                <line key={i} className="ptp-route" x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
            <g fill={darkMode ? '#e7c98f' : '#b3432f'}>
              {CAPITALS.map(([name, x, y], i) => (
                <circle key={name} r={i === scene ? 4 : 2.2} cx={x} cy={y} opacity={i === scene ? 1 : 0.55} />
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
