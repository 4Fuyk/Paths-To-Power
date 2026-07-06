/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Country, Ideology, Party } from '../types';
import { ChevronLeft, Award } from 'lucide-react';

interface PartyCreatorProps {
  country: Country;
  onBack: () => void;
  onCreateParty: (party: Party) => void;
  darkMode: boolean;
}


const AVAILABLE_IDEOLOGIES: { value: Ideology; desc: string; focus: string }[] = [
  { value: 'Social Democrat', desc: 'Social justice, robust state support programs, labor wellness, and comprehensive civil rights.', focus: 'Provides bonus support within Labor and Youth factions.' },
  { value: 'Conservative', desc: 'Cultural patriotism, public order, preservation of heritage, and localized tax alleviation.', focus: 'Provides bonus support within Traditionalist and Merchant factions.' },
  { value: 'Nationalist', desc: 'Robust border security, domestic high-tech industries, and sovereign defense posturing.', focus: 'Provides bonus support within Nationalist and Traditionalist factions.' },
  { value: 'Liberal', desc: 'Free markets, maximum individual liberty, deregulation, and advanced digital integration.', focus: 'Provides bonus support within Liberal and Merchant factions.' },
  { value: 'Socialist', desc: 'Nationalized essential infrastructure, progressive capital wealth taxes, and worker equity.', focus: 'Provides powerful base support within Labor and Youth factions.' },
  { value: 'Ecologist', desc: 'Sustained green transition, carbon taxation, clean grid infrastructure, and conservation.', focus: 'Provides bonus support within Youth and Liberal factions.' },
];

const POLITICAL_COLORS = [
  { hex: '#dc2626' },
  { hex: '#1d4ed8' },
  { hex: '#059669' },
  { hex: '#d97706' },
  { hex: '#7c3aed' },
  { hex: '#06b6d4' },
];

export const PartyCreator: React.FC<PartyCreatorProps> = ({
  country,
  onBack,
  onCreateParty,
  darkMode,
}) => {
  const [partyName, setPartyName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [selectedIdeology, setSelectedIdeology] = useState<Ideology>('Social Democrat');
  const [selectedColor, setSelectedColor] = useState('#dc2626');
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [isPresetSelected, setIsPresetSelected] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim() || !leaderName.trim()) return;

    // Prevent selecting existing national rival parties as custom player party
    const lowerPartyName = partyName.trim().toLowerCase();
    const lowerLeaderName = leaderName.trim().toLowerCase();
    const forbiddenParties = country.id === 'DE' ? [
      'cdu', 'csu', 'afd', 'spd', 'grüne', 'gruene', 'linke', 'die linke', 'bsw', 'fdp', 'ssw'
    ] : country.id === 'US' ? [
      'republican', 'democrat', 'libertarian', 'green', 'cumhuriyetçi', 'cumhuriyetci', 'demokrat', 'özgürlükçü', 'ozgurlukcu', 'yeşiller', 'yesiller', 'rep', 'dem_us', 'lp', 'gp'
    ] : [
      'chp', 'akp', 'ak parti', 'yrp', 'yeniden refah', 'dem', 'dem parti', 'mhp',
      'zafer', 'zafer partisi', 'tip', 'tkp', 'saadet', 'saadet partisi', 'deva',
      'deva partisi', 'gelecek', 'gelecek partisi', 'vatan', 'vatan partisi'
    ];

    if ((country.id === 'TR' || country.id === 'DE' || country.id === 'US') && !isPresetSelected && (
      forbiddenParties.includes(lowerPartyName) ||
      forbiddenParties.some(p => lowerPartyName.includes(p) && p.length > 2)
    )) {
      setErrorModal('This party name is reserved for a national rival party! Please establish your own custom political party or choose one of the official leader templates above.');
      return;
    }

    // Attributes are automatically preset to solid campaign values
    const newParty: Party = {
      id: 'player_party',
      name: partyName.trim(),
      leader: leaderName.trim(),
      ideology: selectedIdeology,
      symbol: 'Flame', // Standard flame logo preassigned behind-the-scenes
      color: selectedColor,
      influence: 30, // solid, balanced, high-fidelity ratings
      budget: 200000, 
      members: 400,
      traits: {
        charisma: 5,
        eloquence: 5,
        organization: 5,
        strategy: 5,
      },
      photo: ((country.id === 'TR' || country.id === 'DE' || country.id === 'US') ? (isPresetSelected ? selectedPhoto : '') : selectedPhoto),
    };

    onCreateParty(newParty);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 lg:p-6 animate-fade-in">
      {/* Return Row */}
      <button
        id="party-creator-back-btn"
        onClick={onBack}
        className={`mb-6 flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl border transition-all cursor-pointer ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <ChevronLeft className="w-4 h-4" /> Return to World Map
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Main Identity Box */}
        <div className={`p-6 rounded-3xl border flex flex-col gap-6 ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl filter drop-shadow-sm select-none">{country.flag}</span>
              <div>
                <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold">ESTABLISH NEW MOVEMENT</span>
                <h2 className="text-xl font-bold tracking-tight">{country.name} Political Headquarters</h2>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Form your political movement, select a campaign leader avatar icon, chose your official color, and draft your guiding manifesto to seek power in {country.name}.
            </p>
          </div>

          <div className="space-y-4">
            {/* National leader presets / Avatar Selector */}
            {country.rivals && country.rivals.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">OFFICIAL NATIONAL LEADER TEMPLATES</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {country.rivals.map((rival) => {
                    const isSelected = selectedPhoto === rival.photo;
                    return (
                      <button
                        key={rival.id}
                        type="button"
                        onClick={() => {
                          setLeaderName(rival.leader);
                          setPartyName(rival.name);
                          setSelectedColor(rival.color);
                          setSelectedIdeology(rival.ideology);
                          setSelectedPhoto(rival.photo || '');
                          setIsPresetSelected(true);
                        }}
                        className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer relative ${
                          isSelected
                            ? darkMode
                              ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 ring-2 ring-indigo-500/20'
                              : 'bg-indigo-50 border-indigo-200 text-slate-900 shadow'
                            : darkMode
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            : 'bg-slate-55 border-slate-200 text-slate-600 hover:bg-slate-10 border'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-700/50 relative">
                          {rival.photo ? (
                            <img
                              src={rival.photo}
                              alt={rival.leader}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center font-bold text-lg text-white" style={{ backgroundColor: rival.color }}>
                               {rival.leader.split(' ').map(w => w[0]).join('').slice(0,2)}
                             </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{rival.leader}</span>
                          <span className="text-[10px] font-semibold" style={{ color: rival.color }}>{rival.name}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-0.5 shadow">
                            <Award className="w-3.5 h-3.5 animate-pulse" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {/* Custom Option button too */}
                  <button
                    type="button"
                    onClick={() => {
                      setLeaderName('');
                      setPartyName('');
                      setSelectedPhoto('');
                      setIsPresetSelected(false);
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[110px] ${
                      !isPresetSelected
                        ? darkMode
                          ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 ring-2 ring-indigo-500/20'
                          : 'bg-indigo-50 border-indigo-200 text-slate-900 shadow'
                        : darkMode
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        : 'bg-slate-55 border-slate-200 text-slate-600 hover:bg-slate-10 border'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full border border-dashed border-slate-500 flex items-center justify-center text-lg text-slate-500 select-none">
                      ?
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Custom Leader</span>
                      <span className="text-[10px] text-slate-400 font-medium">Design My Own</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Party Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">PARTY CHARTER NAME</label>
              <input
                id="party-name-input"
                type="text"
                placeholder="e.g. Alliance for Democratic Reform, Global Progress Coalition"
                required
                maxLength={45}
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all outline-none focus:ring-2 ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-indigo-500/40 focus:border-indigo-500'
                    : 'bg-slate-55 @border-slate-200 text-slate-850 focus:ring-indigo-500/10 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Leader Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">GENERAL CHAIR / FOUNDER</label>
              <input
                id="leader-name-input"
                type="text"
                placeholder="e.g. Victoria Sterling, James Carter"
                required
                maxLength={30}
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className={`w-full p-3 rounded-xl border text-sm font-semibold transition-all outline-none focus:ring-2 ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-100 focus:ring-indigo-500/40 focus:border-indigo-500'
                    : 'bg-slate-55 @border-slate-200 text-slate-850 focus:ring-indigo-500/10 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Avatar & Color Layout Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Party Color picker */}
              <div className="col-span-12">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">PARTY COLOR</label>
                <div className={`p-3 rounded-2xl border flex flex-wrap items-center gap-3 justify-start min-h-[58px] ${
                  darkMode ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-100/80'
                }`}>
                  {POLITICAL_COLORS.map((col) => {
                    const isSelected = selectedColor === col.hex;
                    return (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => setSelectedColor(col.hex)}
                        style={{ backgroundColor: col.hex }}
                        className="w-8 h-8 rounded-full transition-all hover:scale-110 flex items-center justify-center relative cursor-pointer"
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 bg-white rounded-full shadow-md"></span>
                        )}
                      </button>
                    );
                  })}

                  {/* HTML5 Native Custom Color Picker */}
                  <div className="relative w-8 h-8 rounded-full border border-dashed border-slate-500 hover:border-slate-350 flex items-center justify-center cursor-pointer group bg-slate-500/5 hover:bg-slate-500/10 transition-all">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    {!POLITICAL_COLORS.some((c) => c.hex === selectedColor) ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center relative shadow-inner" style={{ backgroundColor: selectedColor }}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full shadow-md"></span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 group-hover:text-slate-200 font-bold font-mono">+</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Manifesto Ideology */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">PARTY MANIFESTO IDEOLOGY</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[...AVAILABLE_IDEOLOGIES, ...(AVAILABLE_IDEOLOGIES.some(i => i.value === selectedIdeology) ? [] : [{ value: selectedIdeology, desc: 'Special Ideology Template', focus: 'Unique bonus attributes.' }])].map((ideo) => {
                  const isSelected = selectedIdeology === ideo.value;
                  return (
                    <button
                      id={`ideology-select-${ideo.value.replace(/\s+/g, '-')}`}
                      key={ideo.value}
                      type="button"
                      onClick={() => setSelectedIdeology(ideo.value)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? darkMode
                            ? 'bg-indigo-950/30 border-indigo-500 text-slate-100'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm'
                          : darkMode
                          ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          : 'bg-slate-5 font-medium border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedColor }}></span>
                        {ideo.value}
                      </span>
                      <span className="text-[10px] leading-relaxed opacity-85 text-slate-400">
                        {ideo.desc}
                      </span>
                      <span className="text-[9px] font-mono font-semibold text-emerald-500 mt-1">
                        {ideo.focus}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch button */}
            <div className="pt-4">
              <button
                id="confirm-party-creation-btn"
                type="submit"
                className="w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-650 to-indigo-550 text-white cursor-pointer hover:scale-[1.015] hover:shadow-indigo-600/25"
              >
                <Award className="w-5 h-5 animate-pulse" /> Establish Party & Launch Campaign!
              </button>
            </div>
          </div>
        </div>
      </form>

      {errorModal && (
        <div className="fixed inset-0 z-[110] h-full w-full bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-5 flex flex-col gap-3 shadow-xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5 text-rose-500">
                <span>⚠</span> Warning
              </h4>
            </div>
            <p className={`text-xs leading-relaxed py-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{errorModal}</p>
            <button
              onClick={() => setErrorModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs cursor-pointer mt-2 text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
