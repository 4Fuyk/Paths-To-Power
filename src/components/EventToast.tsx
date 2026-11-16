/**
 * Sağ üst köşe olay bildirimi. Başlık satırı her zaman İngilizce: "EVENT RECEIVED".
 */
import React from 'react';
import { X } from 'lucide-react';
import type { GovChangeEvent } from '../utils/neighborElections';
import { useUi } from '../i18n/ui';

export interface CustomToast { icon: string; title: string; subtitle: string; body: string; }
export interface ToastItem { key: string; ev?: GovChangeEvent; custom?: CustomToast; }

export interface PendingEvent { title: string; icon?: string; onOpen: () => void; }

export const EventToastStack: React.FC<{ toasts: ToastItem[]; onClose: (key: string) => void; darkMode: boolean; pendingEvent?: PendingEvent | null }> = ({ toasts, onClose, darkMode, pendingEvent }) => {
  const u = useUi();
  if (!toasts.length && !pendingEvent) return null;
  return (
    <div className="fixed top-14 right-4 z-[10000] flex flex-col gap-2 w-[min(92vw,360px)] pointer-events-none">
      {pendingEvent && (
        <button onClick={pendingEvent.onOpen} className="pointer-events-auto text-left rounded-xl border border-amber-400 bg-amber-500 text-slate-950 shadow-2xl px-3 py-2 hover:bg-amber-400 cursor-pointer animate-pulse">
          <div lang="en" className="text-[10px] font-black tracking-widest uppercase">🔔 Event received</div>
          <div className="text-sm font-black leading-tight">{pendingEvent.icon || '📜'} {pendingEvent.title}</div>
          <div className="text-[10px] font-mono opacity-80">{u('eventReceivedOpen')}</div>
        </button>
      )}
      {toasts.slice(-2).map(({ key, ev, custom }) => (
        <div
          key={key}
          className={`pointer-events-auto rounded-xl border shadow-2xl overflow-hidden ${
            darkMode ? 'bg-slate-900 border-amber-500/40 text-slate-100' : 'bg-white border-amber-500/50 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-amber-500 text-slate-950">
            <span lang="en" className="text-[10px] font-black tracking-widest uppercase">🔔 Event received</span>
            <button onClick={() => onClose(key)} className="p-0.5 rounded hover:bg-black/10 cursor-pointer" title={u('close')}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {custom && (
            <div className="p-3 space-y-1.5 text-xs">
              <div className="font-black text-sm">{custom.icon} {custom.title}</div>
              <div lang="en" className="opacity-70 text-[10px] font-mono uppercase">{custom.subtitle}</div>
              <div className="leading-snug">{custom.body}</div>
            </div>
          )}
          {ev && (
            <div className="p-3 space-y-1.5 text-xs">
              <div className="font-black text-sm">
                {ev.flag} {ev.country}: {ev.changed ? u('newGovernment') : u('governmentContinues')}
                {ev.simulated && <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">{u('simulatedTag')}</span>}
              </div>
              <div lang="en" className="opacity-70 text-[10px] font-mono uppercase">{ev.kind} · {ev.date}</div>
              <div><span className="opacity-60">{u('leader')}:</span> <b>{ev.after.leader}</b> ({ev.after.party})</div>
              <div><span className="opacity-60">{u('ideology')}:</span> <b>{ev.after.ideology}</b></div>
              <div><span className="opacity-60">{u('voteShare')}:</span> <b>{ev.after.voteShare != null ? `${+ev.after.voteShare.toFixed(2)}%` : u('noData')}</b></div>
              {ev.note && <div className="opacity-70 text-[11px] leading-snug border-t border-white/10 pt-1.5">{ev.note}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** Kenar çubuğu: şimdiye kadar gerçekleşen komşu seçimleri */
export const NeighborGovPanel: React.FC<{ events: GovChangeEvent[]; darkMode: boolean }> = ({ events, darkMode }) => {
  const u = useUi();
  return (
    <div className={`w-full p-2 rounded-xl border space-y-1.5 ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">🗳️ {u('neighborGovs')}</div>
      {events.length === 0 && <div className="text-[10px] text-slate-500">{u('noElectionsYet')}</div>}
      {events.slice().reverse().map(ev => (
        <div key={ev.id} className={`text-[10px] leading-tight p-1.5 rounded-lg ${darkMode ? 'bg-slate-900' : 'bg-white border border-slate-200'}`}>
          <div className="font-black">{ev.flag} {ev.country} <span className="font-mono font-normal opacity-60">{ev.date}</span></div>
          <div>{ev.after.leader} · {ev.after.party}</div>
          <div className="opacity-70">{ev.after.ideology} · {ev.after.voteShare != null ? `${+ev.after.voteShare.toFixed(2)}%` : u('noData')}</div>
        </div>
      ))}
    </div>
  );
};

/** Her zaman görünen süre çubuğu: tarih, durdur/başlat, hız ve gece/gündüz */
export const TimeHud: React.FC<{
  dateLabel: string; periodLabel: string; playing: boolean; onToggle: () => void;
  speed: number; onSpeed: (lvl: number) => void; dayNight: boolean; onDayNight: () => void; darkMode: boolean;
}> = ({ dateLabel, periodLabel, playing, onToggle, speed, onSpeed, dayNight, onDayNight, darkMode }) => {
  const u = useUi();
  const btn = (active: boolean) => `px-2 py-1 rounded-md text-[11px] font-black border cursor-pointer transition-colors ${
    active ? 'bg-amber-500 text-slate-950 border-amber-400' : darkMode ? 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'}`;
  return (
    <div className={`fixed top-2 left-[24%] z-[9990] flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-2xl ${
      darkMode ? 'bg-slate-950/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-300 text-slate-900'}`}>
      <div className="leading-tight pr-1">
        <div className="text-sm font-black tabular-nums">📅 {dateLabel}</div>
        <div className="text-[10px] font-mono opacity-70">{periodLabel} · {playing ? u('timeRunning') : u('timePaused')}</div>
      </div>
      <button onClick={onToggle} className={btn(playing)} title={playing ? u('pauseTime') : u('startTime')}>{playing ? '⏸' : '▶'}</button>
      {([['1x', 3], ['2x', 4], ['5x', 5]] as const).map(([l, lvl]) => (
        <button key={l} onClick={() => onSpeed(lvl)} className={btn(speed === lvl)}>{l}</button>
      ))}
      <button onClick={onDayNight} className={btn(dayNight)} title={u('dayNightCycle')}>{dayNight ? '🌙' : '☀️'}</button>
    </div>
  );
};
