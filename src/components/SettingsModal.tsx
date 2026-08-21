/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Globe, Volume2, VolumeX, Moon, Sun, RotateCcw, 
  Check, Sliders, Zap, Sparkles, Play, Pause, FastForward, Clock
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';
import { GameFlowMode, SimulationSpeed } from '../types';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English (Default)', nativeLabel: 'English (Default)', flag: '🇺🇸 / 🇬🇧' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', flag: '🇹🇷' }
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onResetProgress: () => void;
  gameFlowMode: GameFlowMode;
  onChangeGameFlowMode: (mode: GameFlowMode) => void;
  simulationSpeed: SimulationSpeed;
  onChangeSimulationSpeed: (speed: SimulationSpeed) => void;
  initialTab?: 'settings' | 'languages';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
  muted,
  onToggleMute,
  onResetProgress,
  gameFlowMode,
  onChangeGameFlowMode,
  simulationSpeed,
  onChangeSimulationSpeed,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'languages'>(initialTab);
  const { language, setLanguage, t } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    playSound('click');
  };

  const SPEED_LEVELS: { speed: SimulationSpeed; label: string; intervalDesc: string }[] = [
    { speed: 1, label: t.speedVerySlow, intervalDesc: '10s / turn' },
    { speed: 2, label: t.speedSlow, intervalDesc: '5s / turn' },
    { speed: 3, label: t.speedNormal, intervalDesc: '3s / turn' },
    { speed: 4, label: t.speedFast, intervalDesc: '1.5s / turn' },
    { speed: 5, label: t.speedVeryFast, intervalDesc: '0.8s / turn' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className={`p-5 px-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c9a26a]/15 text-[#dab97c] border border-[#c9a26a]/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-mono tracking-tight">{t.settings.toUpperCase()}</h3>
              <p className="text-xs text-slate-400">Configure language, flow mode, audio & preferences</p>
            </div>
          </div>
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className={`p-2 rounded-xl transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-6 pt-3 gap-2 ${darkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'}`}>
          <button
            onClick={() => { playSound('click'); setActiveTab('settings'); }}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#c9a26a] text-[#dab97c]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            {t.preferences}
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('languages'); }}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'languages'
                ? 'border-[#c9a26a] text-[#dab97c]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            {t.languages}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'languages' ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black font-mono uppercase tracking-wider text-slate-300">Select Interface Language</h4>
                <p className="text-xs text-slate-400 mt-0.5">Choose your preferred language for all menus, election reports, and campaign dashboards.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? darkMode
                            ? 'bg-[#c9a26a]/20 border-[#c9a26a] text-[#dab97c] ring-1 ring-[#c9a26a]/40 shadow-lg'
                            : 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-400/40 shadow'
                          : darkMode
                          ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            {lang.label}
                            {lang.code === 'en' && (
                              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-xs opacity-60">{lang.nativeLabel}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#c9a26a] text-slate-950 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                darkMode ? 'bg-slate-950/60 border-slate-800/60 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Sparkles className="w-4 h-4 text-[#c9a26a] shrink-0 mt-0.5" />
                <span>Selected language updates in real time across maps, election models, cabinet councils, and bills.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gameplay Flow Mode (Turn-by-Turn vs Pausable Real-Time) */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c9a26a]" />
                  {t.gameplayFlowMode}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Turn-by-Turn Button */}
                  <button
                    type="button"
                    onClick={() => { playSound('click'); onChangeGameFlowMode('TURN_BY_TURN'); }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                      gameFlowMode === 'TURN_BY_TURN'
                        ? darkMode
                          ? 'bg-[#c9a26a]/15 border-[#c9a26a] text-[#dab97c] ring-1 ring-[#c9a26a]/40 shadow'
                          : 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-400/40 shadow'
                        : darkMode
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider">{t.turnByTurn}</span>
                      {gameFlowMode === 'TURN_BY_TURN' && <Check className="w-4 h-4 text-[#c9a26a]" />}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80">{t.turnByTurnDesc}</p>
                  </button>

                  {/* Pausable Real-Time Button */}
                  <button
                    type="button"
                    onClick={() => { playSound('click'); onChangeGameFlowMode('PAUSABLE_REALTIME'); }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                      gameFlowMode === 'PAUSABLE_REALTIME'
                        ? darkMode
                          ? 'bg-[#c9a26a]/15 border-[#c9a26a] text-[#dab97c] ring-1 ring-[#c9a26a]/40 shadow'
                          : 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-400/40 shadow'
                        : darkMode
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider">{t.pausableRealtime}</span>
                      {gameFlowMode === 'PAUSABLE_REALTIME' && <Check className="w-4 h-4 text-[#c9a26a]" />}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80">{t.pausableRealtimeDesc}</p>
                  </button>
                </div>
              </div>

              {/* Simulation Speed Presets (5 Speed Levels) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                    <FastForward className="w-3.5 h-3.5 text-indigo-400" />
                    {t.simulationSpeed} (1 - 5)
                  </span>
                  <span className="text-xs font-bold font-mono text-[#dab97c]">
                    {SPEED_LEVELS.find(s => s.speed === simulationSpeed)?.label}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {SPEED_LEVELS.map((lvl) => {
                    const isSelected = simulationSpeed === lvl.speed;
                    return (
                      <button
                        key={lvl.speed}
                        type="button"
                        onClick={() => { playSound('click'); onChangeSimulationSpeed(lvl.speed); }}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                          isSelected
                            ? darkMode
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow'
                              : 'bg-indigo-600 border-indigo-600 text-white font-bold shadow'
                            : darkMode
                            ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-black font-mono">{lvl.speed}</span>
                        <span className="text-[9px] uppercase tracking-tight opacity-80">
                          {lvl.speed === 1 ? 'V.Slow' : lvl.speed === 2 ? 'Slow' : lvl.speed === 3 ? 'Normal' : lvl.speed === 4 ? 'Fast' : 'V.Fast'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme & Display */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">{t.theme}</span>
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-600'}`}>
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.theme}</div>
                      <div className="text-xs text-slate-400">{darkMode ? t.darkMode : t.lightMode}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { playSound('click'); onToggleDarkMode(); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Switch to {darkMode ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>

              {/* Sound & Audio */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">{t.soundEffects}</span>
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${muted ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.soundEffects}</div>
                      <div className="text-xs text-slate-400">{muted ? 'Muted (Silent Operations)' : 'Active (Audio Feedback)'}</div>
                    </div>
                  </div>
                  <button
                    onClick={onToggleMute}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      muted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-rose-600/20 border-rose-500/40 text-rose-300 hover:bg-rose-600/30'
                    }`}
                  >
                    {muted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>

              {/* Reset Game Progress */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-400">{t.dangerZone}</span>
                <div className={`p-4 rounded-2xl border border-rose-500/30 flex items-center justify-between ${darkMode ? 'bg-rose-950/10' : 'bg-rose-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-rose-400">{t.resetProgress}</div>
                      <div className="text-xs text-slate-400">Reset completed countries & election victories</div>
                    </div>
                  </div>
                  {showResetConfirm ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playSound('click');
                          onResetProgress();
                          setShowResetConfirm(false);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500"
                      >
                        Confirm Reset
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 px-6 border-t flex justify-end ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-white transition-all shadow"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
