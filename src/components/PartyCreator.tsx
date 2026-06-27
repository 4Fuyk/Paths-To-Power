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

const TURKEY_AVATARS = [
  {
    id: 'tr_ozgur_ozel',
    name: 'Özgür Özel',
    url: 'https://thf.bing.com/th/id/OIP.tw1bDleSary6Ua4NxPIuvgHaEK?w=292&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=',
    partyName: 'CHP',
    color: '#e30613',
    ideology: 'Sosyal Demokrat' as Ideology,
  },
  {
    id: 'tr_erdogan',
    name: 'Recep Tayyip Erdoğan',
    url: 'https://thf.bing.com/th/id/OIP.OSuQe5LJxNif6UcSy0D9YAHaE7?w=242&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'AK Parti',
    color: '#ff9e1b',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'tr_bahceli',
    name: 'Devlet Bahçeli',
    url: 'https://thf.bing.com/th/id/OIP.uKLHt8YQ5W_ghAlMr7TR7AHaEK?w=280&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'MHP',
    color: '#991b1b',
    ideology: 'Milliyetçi' as Ideology,
  },
  {
    id: 'tr_fatih_erbakan',
    name: 'Fatih Erbakan',
    url: 'https://thf.bing.com/th/id/OIP.jwt8F1waSse9KWS-sVyWKgHaEK?w=303&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'Yeniden Refah Partisi (YRP)',
    color: '#2563eb',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'tr_tuncer_bakirhan',
    name: 'Tuncer Bakırhan',
    url: 'https://thf.bing.com/th/id/OIP.37I-MTcx4uo8vRif0r3DmgHaEO?w=278&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'DEM Parti',
    color: '#8b5cf6',
    ideology: 'Sosyalist' as Ideology,
  },
  {
    id: 'tr_umit_ozdag',
    name: 'Ümit Özdağ',
    url: 'https://thf.bing.com/th/id/OIP.D6YUtsOdukEPYEv357621AHaEK?w=332&h=186&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'Zafer Partisi',
    color: '#c2410c',
    ideology: 'Milliyetçi' as Ideology,
  },
  {
    id: 'tr_erkan_bas',
    name: 'Erkan Baş',
    url: 'https://thf.bing.com/th/id/OIP.z4i5RbWcUnSCP01SVVXeNwHaE7?w=255&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'TİP',
    color: '#be123c',
    ideology: 'Sosyalist' as Ideology,
  },
  {
    id: 'tr_mahmut_arıkan',
    name: 'Mahmut Arıkan',
    url: 'https://i.gazeteduvar.com.tr/2/1280/720/storage/files/images/2024/11/19/mahmud-w0bc_cover.jpg',
    partyName: 'Saadet Partisi',
    color: '#1d4ed8',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'tr_ali_babacan',
    name: 'Ali Babacan',
    url: 'https://thf.bing.com/th/id/OIP.NeK1Fpea9DEqrDm_IGfEjAHaEN?w=308&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'DEVA Partisi',
    color: '#06b6d4',
    ideology: 'Liberal' as Ideology,
  },
  {
    id: 'tr_ahmet_davutoglu',
    name: 'Ahmet Davutoğlu',
    url: 'https://thf.bing.com/th/id/OIP.nYYgkEuIUEjy_QGs_Ha-agHaEK?w=289&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'Gelecek Partisi',
    color: '#16a34a',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'tr_kemal_okuyan',
    name: 'Kemal Okuyan',
    url: 'https://tse4.mm.bing.net/th/id/OIP.SnPu5vlsLQCb_aLz9UxpwgHaEK?r=0&cb=thfc1falcon2&rs=1&pid=ImgDetMain&o=7&rm=3',
    partyName: 'TKP',
    color: '#dc2626',
    ideology: 'Sosyalist' as Ideology,
  },
  {
    id: 'tr_dogu_perincek',
    name: 'Doğu Perinçek',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg/250px-Do%C4%9Fu_Perin%C3%A7ek_in_Tasnim_News_Agency.jpg',
    partyName: 'Vatan Partisi',
    color: '#b91c1c',
    ideology: 'Milliyetçi' as Ideology,
  }
];

const GERMANY_AVATARS = [
  {
    id: 'de_merz',
    name: 'Friedrich Merz',
    url: 'https://thf.bing.com/th/id/OIP.C6IhExWdSFCEi8UMuMPLpgHaEs?w=265&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'CDU/CSU',
    color: '#111827',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'de_weidel',
    name: 'Alice Weidel',
    url: 'https://thf.bing.com/th/id/OIP.HMj4SiIh4c7KS6KMTvXSSAHaEu?w=236&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'AfD',
    color: '#009EE0',
    ideology: 'Milliyetçi' as Ideology,
  },
  {
    id: 'de_klingbeil',
    name: 'Lars Klingbeil',
    url: 'https://thf.bing.com/th/id/OIP.AtJS2ybczy_TBZrRMeiCJwHaE7?w=283&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'SPD',
    color: '#E3000F',
    ideology: 'Sosyal Demokrat' as Ideology,
  },
  {
    id: 'de_brantner',
    name: 'Franziska Brantner',
    url: 'https://thf.bing.com/th/id/OIP.IyG5NwjRofDj4_FbuGZNRQHaEK?w=322&h=181&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'GRÜNE',
    color: '#46962B',
    ideology: 'Ekolojist' as Ideology,
  },
  {
    id: 'de_reichinnek',
    name: 'Heidi Reichinnek',
    url: 'https://thf.bing.com/th/id/OIP.d4VFRFsa1VBK8V33hKRESAHaEK?w=327&h=184&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'Die Linke',
    color: '#BE3075',
    ideology: 'Sosyalist' as Ideology,
  },
  {
    id: 'de_wagenknecht',
    name: 'Sahra Wagenknecht',
    url: 'https://thf.bing.com/th/id/OIP.tU_3IENu_tkFM8v2XC_MQgHaEK?w=314&h=180&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'BSW',
    color: '#8B1A4B',
    ideology: 'Sosyalist' as Ideology,
  },
  {
    id: 'de_lindner',
    name: 'Christian Lindner',
    url: 'https://thf.bing.com/th/id/OIP.t97fKXH73vpJGAMOigSoPwHaEK?w=333&h=187&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'FDP',
    color: '#FFED00',
    ideology: 'Liberal' as Ideology,
  },
  {
    id: 'de_seidler',
    name: 'Stefan Seidler',
    url: 'https://thf.bing.com/th/id/OIP.ZMWMp-FO5VvshEQLlsaR0gHaEK?w=325&h=183&c=7&r=0&o=7&cb=thfc1falcon2&pid=1.7&rm=3',
    partyName: 'SSW',
    color: '#003D8F',
    ideology: 'Sosyal Demokrat' as Ideology,
  }
];

const US_AVATARS = [
  {
    id: 'us_trump',
    name: 'Donald Trump',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/250px-Donald_Trump_official_portrait.jpg',
    partyName: 'Cumhuriyetçi Parti',
    color: '#dc2626',
    ideology: 'Muhafazakar' as Ideology,
  },
  {
    id: 'us_harris',
    name: 'Kamala Harris',
    url: 'https://thfvnext.bing.com/th/id/OIP.iDEUHnU5PFy9zsOdzZL0VQHaEK?w=308&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3',
    partyName: 'Demokrat Parti',
    color: '#2563eb',
    ideology: 'Sosyal Demokrat' as Ideology,
  },
  {
    id: 'us_oliver',
    name: 'Chase Oliver',
    url: 'https://thfvnext.bing.com/th/id/OIP.c_KBzJb73OaFQMUvfUuF0wHaE7?w=250&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3',
    partyName: 'Özgürlükçü Parti (Libertarian)',
    color: '#eab308',
    ideology: 'Liberal' as Ideology,
  },
  {
    id: 'us_stein',
    name: 'Jill Stein',
    url: 'https://thfvnext.bing.com/th/id/OIF.THHEKT1ezKNhsLglk3uxDQ?w=260&h=180&c=7&r=0&o=7&cb=thfvnextfalcon3&pid=1.7&rm=3',
    partyName: 'Yeşiller Partisi (Green)',
    color: '#16a34a',
    ideology: 'Ekolojist' as Ideology,
  }
];

const AVAILABLE_IDEOLOGIES: { value: Ideology; desc: string; focus: string }[] = [
  { value: 'Sosyal Demokrat', desc: 'Social justice, robust state support programs, labor wellness, and comprehensive civil rights.', focus: 'Provides bonus support within Labor and Youth factions.' },
  { value: 'Muhafazakar', desc: 'Cultural patriotism, public order, preservation of heritage, and localized tax alleviation.', focus: 'Provides bonus support within Traditionalist and Merchant factions.' },
  { value: 'Milliyetçi', desc: 'Robust border security, domestic high-tech industries, and sovereign defense posturing.', focus: 'Provides bonus support within Nationalist and Traditionalist factions.' },
  { value: 'Liberal', desc: 'Free markets, maximum individual liberty, deregulation, and advanced digital integration.', focus: 'Provides bonus support within Liberal and Merchant factions.' },
  { value: 'Sosyalist', desc: 'Nationalized essential infrastructure, progressive capital wealth taxes, and worker equity.', focus: 'Provides powerful base support within Labor and Youth factions.' },
  { value: 'Ekolojist', desc: 'Sustained green transition, carbon taxation, clean grid infrastructure, and conservation.', focus: 'Provides bonus support within Youth and Liberal factions.' },
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
  const [selectedIdeology, setSelectedIdeology] = useState<Ideology>('Sosyal Demokrat');
  const [selectedColor, setSelectedColor] = useState('#dc2626');
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [isPresetSelected, setIsPresetSelected] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [startAsGovernment, setStartAsGovernment] = useState(false);

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

    // Auto set to government mode if the selected/created party matches the ruling incumbent parties:
    // USA: Donald Trump / Cumhuriyetçi Parti / Republican
    // Turkey: Recep Tayyip Erdoğan / AKP / AK Parti
    // Germany: Friedrich Merz / CDU
    let finalStartAsGovernment = startAsGovernment;
    if (country.id === 'US') {
      if (lowerLeaderName.includes('trump') || lowerPartyName.includes('cumhuriyet') || lowerPartyName.includes('republic') || lowerPartyName.includes('gop')) {
        finalStartAsGovernment = true;
      }
    } else if (country.id === 'TR') {
      if (lowerLeaderName.includes('erdogan') || lowerPartyName.includes('akp') || lowerPartyName.includes('ak parti') || lowerPartyName.includes('adalet ve kalkinma')) {
        finalStartAsGovernment = true;
      }
    } else if (country.id === 'DE') {
      if (lowerLeaderName.includes('merz') || lowerPartyName.includes('cdu') || lowerPartyName.includes('christlich dem')) {
        finalStartAsGovernment = true;
      }
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
      startAsGovernment: finalStartAsGovernment,
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
            {(country.id === 'TR' || country.id === 'DE' || country.id === 'US') && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">OFFICIAL NATIONAL LEADER TEMPLATES</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(country.id === 'TR' ? TURKEY_AVATARS : country.id === 'DE' ? GERMANY_AVATARS : US_AVATARS).map((avatar) => {
                    const isSelected = selectedPhoto === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          setLeaderName(avatar.name);
                          setPartyName(avatar.partyName);
                          setSelectedColor(avatar.color);
                          setSelectedIdeology(avatar.ideology);
                          setSelectedPhoto(avatar.url);
                          setIsPresetSelected(true);
                          
                          // By default, presets do not auto-force direct governance start. Player runs campaign/congress as requested!
                          setStartAsGovernment(false);
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
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{avatar.name}</span>
                          <span className="text-[10px] font-semibold" style={{ color: avatar.color }}>{avatar.partyName}</span>
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
                {AVAILABLE_IDEOLOGIES.map((ideo) => {
                  const isSelected = selectedIdeology === ideo.value;
                  return (
                    <button
                      id={`ideology-select-${ideo.value.replace(' ', '-')}`}
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

            {/* Gameplay Mode Selection Toggle */}
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-indigo-950/20 border-indigo-950/40' : 'bg-indigo-50/40 border-indigo-100'}`}>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">GAMEPLAY STARTING MODE</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStartAsGovernment(false)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    !startAsGovernment
                      ? darkMode
                        ? 'bg-indigo-900/40 border-indigo-500 text-white shadow-sm'
                        : 'bg-white border-indigo-300 text-indigo-950 shadow-sm'
                      : darkMode
                        ? 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-550 hover:text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                    📣 Campaign Mode
                  </span>
                  <span className="text-[10px] opacity-80 leading-normal mt-0.5">
                    Start in opposition. Build grassroots support across states and win the general election to earn power.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStartAsGovernment(true)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    startAsGovernment
                      ? darkMode
                        ? 'bg-indigo-900/40 border-indigo-500 text-white shadow-sm'
                        : 'bg-white border-indigo-300 text-indigo-950 shadow-sm'
                      : darkMode
                        ? 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-550 hover:text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                    🏛 Governance Mode
                  </span>
                  <span className="text-[10px] opacity-80 leading-normal mt-0.5">
                    Skip the campaign. Start immediately as the sitting, ruling government with full access to Cabinet, Diplomacy, and Parliament.
                  </span>
                </button>
              </div>
            </div>

            {/* Launch button */}
            <div className="pt-4">
              <button
                id="confirm-party-creation-btn"
                type="submit"
                className="w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-650 to-indigo-550 text-white cursor-pointer hover:scale-[1.015] hover:shadow-indigo-600/25"
              >
                <Award className="w-5 h-5 animate-pulse" /> {startAsGovernment ? 'Form State Government & Start Ruling!' : 'Establish Party & Launch Campaign!'}
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
