/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Country, ScenarioYear } from '../types';
import { PLAYABLE_COUNTRIES, countryColors } from '../constants/countries';
import { getPlayableCountriesForScenario } from '../constants/eraCountries';
import { 
  Globe, Shield, Swords, Users, Landmark, AlertTriangle, 
  MapPin, Flag, Award, Eye, Crosshair, ChevronRight, Activity,
  Info, Zap, BarChart2
} from 'lucide-react';
import { playSound } from '../lib/sounds';

export type TacticalMapLayer = 'FREEDOM' | 'IDEOLOGY' | 'ACTIVE_WAR' | 'INFLUENCE';

interface TacticalOperationsMapProps {
  country: Country;
  party: { name: string };
  civilWarRisk?: number;
  freedomIndex?: number;
  internationalReputation?: number;
  countryIdeologies?: Record<string, string>;
  countryFreedomScores?: Record<string, number>;
  scenario?: ScenarioYear;
  darkMode: boolean;
}

export const TacticalOperationsMap: React.FC<TacticalOperationsMapProps> = ({
  country,
  party,
  civilWarRisk = 15,
  freedomIndex = 72,
  internationalReputation = 65,
  countryIdeologies = {},
  countryFreedomScores = {},
  scenario = '2026',
  darkMode,
}) => {
  const activeScenarioId: ScenarioYear = (scenario as ScenarioYear) || '2026';
  const activeCountries = getPlayableCountriesForScenario(activeScenarioId);

  const [activeLayer, setActiveLayer] = useState<TacticalMapLayer>('FREEDOM');
  const [selectedIntelCountry, setSelectedIntelCountry] = useState<Country | null>(country);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active wars definition per scenario
  const getActiveWarDetails = (cId: string) => {
    if (activeScenarioId === '2026') {
      if (['RU', 'UA'].includes(cId)) return { war: 'Russo-Ukrainian War', belligerent: 'Active Combatant', intensity: 'High' };
      if (['IL', 'PS'].includes(cId)) return { war: 'Middle East Conflict', belligerent: 'Active Combatant', intensity: 'High' };
      if (['SD', 'MM'].includes(cId)) return { war: 'Civil Armed Conflict', belligerent: 'Armed Insurgency', intensity: 'Critical' };
      if (['TW', 'CN', 'US'].includes(cId)) return { war: 'Taiwan Strait Standoff', belligerent: 'Strategic Deterrence', intensity: 'Moderate' };
    }
    if (activeScenarioId === '1950') {
      if (['KR', 'CN', 'US'].includes(cId)) return { war: 'Korean War (1950-1953)', belligerent: 'Active Frontline', intensity: 'Critical' };
      if (['FR', 'VN'].includes(cId)) return { war: 'First Indochina War', belligerent: 'Colonial Conflict', intensity: 'High' };
      if (['SU', 'DDR', 'DE', 'GB'].includes(cId)) return { war: 'Cold War Blockade Stand-off', belligerent: 'Iron Curtain Border', intensity: 'High' };
    }
    if (activeScenarioId === '1936') {
      if (['ES'].includes(cId)) return { war: 'Spanish Civil War', belligerent: 'Active Civil War', intensity: 'Critical' };
      if (['CN', 'JP'].includes(cId)) return { war: 'Second Sino-Japanese Conflict', belligerent: 'Frontline War', intensity: 'Critical' };
      if (['IT', 'ET'].includes(cId)) return { war: 'Second Italo-Ethiopian War', belligerent: 'Colonial Front', intensity: 'High' };
    }
    if (activeScenarioId === '1920') {
      if (['TR', 'GR'].includes(cId)) return { war: 'Turkish War of Independence', belligerent: 'National Liberation Front', intensity: 'Critical' };
      if (['PL', 'SU'].includes(cId)) return { war: 'Polish-Soviet War', belligerent: 'Frontline Warfare', intensity: 'Critical' };
    }
    if (activeScenarioId === '1914') {
      if (['DE', 'FR', 'GB', 'SU', 'TR', 'YU'].includes(cId)) return { war: 'World War I (Great War)', belligerent: 'Total War Belligerent', intensity: 'Critical' };
    }
    return null;
  };

  const getFreedomScore = (cId: string): number => {
    if (cId === country.id) return freedomIndex;
    if (countryFreedomScores[cId] !== undefined) return countryFreedomScores[cId];
    if (['SU', 'DDR', 'CN', 'CS'].includes(cId)) return 18;
    if (['US', 'GB', 'FR', 'DE', 'CA', 'AU', 'IS', 'PT'].includes(cId)) return 88;
    if (['TR', 'PL', 'RO', 'HU', 'IT', 'ES', 'CL', 'GR'].includes(cId)) return 62;
    return 50;
  };

  const getIdeologyLabel = (cId: string): string => {
    if (cId === country.id && party) return party.name;
    if (countryIdeologies[cId]) return countryIdeologies[cId];
    if (['SU', 'DDR', 'CN', 'CS', 'YU'].includes(cId)) return 'Marxist-Leninist / Communist';
    if (['US', 'GB', 'JP', 'CA', 'AU', 'IS', 'PT'].includes(cId)) return 'Liberal Democracy / Conservative';
    if (['DE', 'FR', 'IT', 'ES', 'CL', 'GR'].includes(cId)) return 'Social Democracy / Progressive';
    if (['TR', 'EG', 'ZA', 'BR', 'MX', 'AR', 'IN', 'ID'].includes(cId)) return 'Republican / Centrist / Nationalist';
    if (['RU'].includes(cId)) return 'Traditionalist / Sovereign';
    return 'Constitutional Centrist';
  };

  // Load GeoJSON polygons
  useEffect(() => {
    let isMounted = true;
    fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data) {
          setGeoJsonData(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Initialize Tactical Map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [30, 15],
      zoom: 2,
      minZoom: 1.8,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      className: 'tactical-ocean-tile',
      noWrap: true
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      try { map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
    };
  }, []);

  // Re-draw tactical layers on change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    if (geoJsonData && geoJsonData.features) {
      const getCountryCodeFromFeature = (f: any): string | null => {
        const id = String(f.id || f.properties?.ISO_A3 || f.properties?.iso_a3 || '').toUpperCase();
        const name = String(f.properties?.name || '').toUpperCase();
        if (id === 'TUR' || name.includes('TURKEY')) return 'TR';
        if (id === 'USA' || name.includes('UNITED STATES')) return 'US';
        if (id === 'DEU' || name.includes('GERMANY')) return 'DE';
        if (id === 'GBR' || name.includes('UNITED KINGDOM')) return 'GB';
        if (id === 'FRA' || name.includes('FRANCE')) return 'FR';
        if (id === 'ITA' || name.includes('ITALY')) return 'IT';
        if (id === 'RUS' || name.includes('RUSSIA')) return 'RU';
        if (id === 'UKR' || name.includes('UKRAINE')) return 'UA';
        if (id === 'CHN' || name.includes('CHINA')) return 'CN';
        if (id === 'JPN' || name.includes('JAPAN')) return 'JP';
        if (id === 'POL' || name.includes('POLAND')) return 'PL';
        if (id === 'HUN' || name.includes('HUNGARY')) return 'HU';
        if (id === 'ROU' || name.includes('ROMANIA')) return 'RO';
        if (id === 'GRC' || name.includes('GREECE')) return 'GR';
        if (id === 'PRT' || name.includes('PORTUGAL')) return 'PT';
        if (id === 'ESP' || name.includes('SPAIN')) return 'ES';
        if (id === 'EGY' || name.includes('EGYPT')) return 'EG';
        if (id === 'BRA' || name.includes('BRAZIL')) return 'BR';
        if (id === 'IND' || name.includes('INDIA')) return 'IN';
        if (id === 'KOR' || name.includes('KOREA')) return 'KR';
        if (id === 'CAN' || name.includes('CANADA')) return 'CA';
        if (id === 'AUS' || name.includes('AUSTRALIA')) return 'AU';
        if (id === 'CHL' || name.includes('CHILE')) return 'CL';
        if (id === 'ISL' || name.includes('ICELAND')) return 'IS';
        return null;
      };

      const tacticalGeoLayer = L.geoJSON(geoJsonData, {
        style: (feature: any) => {
          const cId = getCountryCodeFromFeature(feature);
          if (!cId) {
            return {
              fillColor: darkMode ? '#1e293b' : '#94a3b8',
              color: darkMode ? '#0f172a' : '#64748b',
              weight: 0.5,
              fillOpacity: 0.35,
              interactive: false
            };
          }

          let fillColor = '#64748b';
          let fillOpacity = 0.75;
          let weight = cId === country.id ? 2.5 : 1;
          let borderColor = cId === country.id ? '#38bdf8' : (darkMode ? '#334155' : '#cbd5e1');

          if (activeLayer === 'FREEDOM') {
            const score = getFreedomScore(cId);
            if (score >= 70) fillColor = '#16a34a'; // Free
            else if (score >= 40) fillColor = '#d97706'; // Partly Free
            else fillColor = '#dc2626'; // Not Free
          } else if (activeLayer === 'IDEOLOGY') {
            const ideo = getIdeologyLabel(cId).toLowerCase();
            if (ideo.includes('communist') || ideo.includes('marxist') || ideo.includes('socialist')) fillColor = '#991b1b';
            else if (ideo.includes('conservative') || ideo.includes('capitalist') || ideo.includes('republican')) fillColor = '#2563eb';
            else if (ideo.includes('social dem') || ideo.includes('progressive') || ideo.includes('liberal')) fillColor = '#0891b2';
            else if (ideo.includes('centrist') || ideo.includes('nationalist') || ideo.includes('republican')) fillColor = '#ca8a04';
            else fillColor = '#475569';
          } else if (activeLayer === 'ACTIVE_WAR') {
            const warInfo = getActiveWarDetails(cId);
            if (warInfo) {
              fillColor = warInfo.intensity === 'Critical' ? '#e11d48' : '#ea580c';
              fillOpacity = 0.9;
              borderColor = '#fda4af';
              weight = 2;
            } else {
              fillColor = darkMode ? '#1e293b' : '#cbd5e1';
              fillOpacity = 0.3;
            }
          } else if (activeLayer === 'INFLUENCE') {
            if (cId === country.id) fillColor = '#6366f1';
            else if (['US', 'GB', 'FR', 'DE'].includes(cId)) fillColor = '#0284c7';
            else if (['RU', 'CN'].includes(cId)) fillColor = '#b91c1c';
            else fillColor = '#475569';
          }

          return {
            fillColor,
            color: borderColor,
            weight,
            fillOpacity,
            interactive: true
          };
        },
        onEachFeature: (feature: any, layer: L.Layer) => {
          const cId = getCountryCodeFromFeature(feature);
          if (!cId) return;

          const matchedCountry = activeCountries.find(c => c.id === cId) || PLAYABLE_COUNTRIES.find(c => c.id === cId);
          const cName = matchedCountry ? matchedCountry.name : feature.properties?.name || cId;
          const war = getActiveWarDetails(cId);
          const freedom = getFreedomScore(cId);
          const ideology = getIdeologyLabel(cId);

          layer.bindTooltip(`
            <div style="font-family: inherit; font-size: 11px; padding: 2px;">
              <div style="font-weight: 900; text-transform: uppercase; margin-bottom: 2px;">${cName} (${cId})</div>
              <div>🕊️ Freedom: <strong>${freedom}/100</strong></div>
              <div>⚖️ Ideology: <strong>${ideology}</strong></div>
              ${war ? `<div style="color: #f43f5e; font-weight: 800; margin-top: 2px;">⚔️ ${war.war} (${war.belligerent})</div>` : ''}
            </div>
          `, {
            sticky: true,
            direction: 'top',
            className: darkMode ? 'dark-tactical-tooltip' : 'light-tactical-tooltip'
          });

          layer.on('click', () => {
            if (matchedCountry) {
              setSelectedIntelCountry(matchedCountry);
              playSound('click');
            }
          });
        }
      });

      layerGroupRef.current.addLayer(tacticalGeoLayer);
    }
  }, [activeLayer, geoJsonData, country, freedomIndex, civilWarRisk, darkMode]);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Tactical Header Controls */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-500/20 flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Tactical Operations & Global Intelligence
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              {activeScenarioId} SCENARIO
            </span>
          </div>
          <h2 className="text-xl font-black mt-1 flex items-center gap-2 font-mono">
            <span>🗺️</span> Global Geopolitical Theater ({country.name})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor international freedom indices, ideological sphere alignments, and active frontline war zones in real-time.
          </p>
        </div>

        {/* Tactical Mode Toggle Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <button
            onClick={() => { setActiveLayer('FREEDOM'); playSound('click'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'FREEDOM'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🕊️</span> Freedom Index
          </button>
          <button
            onClick={() => { setActiveLayer('IDEOLOGY'); playSound('click'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'IDEOLOGY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚖️</span> Ideological Spheres
          </button>
          <button
            onClick={() => { setActiveLayer('ACTIVE_WAR'); playSound('click'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'ACTIVE_WAR'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚔️</span> Active War Zones
          </button>
          <button
            onClick={() => { setActiveLayer('INFLUENCE'); playSound('click'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'INFLUENCE'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🌐</span> Hegemonic Spheres
          </button>
        </div>
      </div>

      {/* Map & Intel Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Stage */}
        <div className={`col-span-12 lg:col-span-8 rounded-3xl border overflow-hidden relative shadow-lg min-h-[460px] flex flex-col ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div ref={mapRef} className="w-full flex-1 min-h-[460px] z-10" />

          {/* Layer Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono shadow-xl flex flex-col gap-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              {activeLayer === 'FREEDOM' && '🕊️ Freedom Score Legend'}
              {activeLayer === 'IDEOLOGY' && '⚖️ Ideological Spectrum'}
              {activeLayer === 'ACTIVE_WAR' && '⚔️ Frontline Intensity'}
              {activeLayer === 'INFLUENCE' && '🌐 Geopolitical Bloc'}
            </span>
            {activeLayer === 'FREEDOM' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Free (70-100)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Partly Free (40-69)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Not Free (&lt;40)</span>
              </div>
            )}
            {activeLayer === 'IDEOLOGY' && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-700" /> Communist</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Conservative</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Social Dem</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-600" /> Centrist/Nat.</span>
              </div>
            )}
            {activeLayer === 'ACTIVE_WAR' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" /> Critical Combat Zone</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Strategic Standoff</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Non-Belligerent</span>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Intel Inspector Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {selectedIntelCountry ? (
            <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
              darkMode ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedIntelCountry.flag || '🌐'}</span>
                  <div>
                    <h3 className="text-base font-black font-mono">{selectedIntelCountry.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{selectedIntelCountry.system}</span>
                  </div>
                </div>
                {selectedIntelCountry.id === country.id && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono text-[9px] font-bold uppercase">
                    OUR STATE
                  </span>
                )}
              </div>

              {/* Stat Chips */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">Freedom Index</span>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {getFreedomScore(selectedIntelCountry.id)} / 100
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">Parliament Seats</span>
                  <span className="text-sm font-black font-mono text-cyan-400">
                    {selectedIntelCountry.seats} Seats
                  </span>
                </div>
              </div>

              {/* Ideological alignment block */}
              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Ideological Spectrum</span>
                <div className="text-xs font-bold text-slate-200">
                  {getIdeologyLabel(selectedIntelCountry.id)}
                </div>
              </div>

              {/* Active War Check */}
              {getActiveWarDetails(selectedIntelCountry.id) ? (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Active Conflict Sector
                  </div>
                  <div><strong>Conflict:</strong> {getActiveWarDetails(selectedIntelCountry.id)?.war}</div>
                  <div><strong>Deployment:</strong> {getActiveWarDetails(selectedIntelCountry.id)?.belligerent}</div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <span>🕊️</span> Sovereign territory is at peace (No active military frontline).
                </div>
              )}

              {/* Major Parties */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Parliamentary Factions ({selectedIntelCountry.rivals.length + 1})
                </span>
                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {selectedIntelCountry.rivals.map(r => (
                    <div key={r.id} className="p-2 rounded-xl bg-slate-950/30 border border-slate-800/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="font-bold text-slate-200 truncate max-w-[140px]">{r.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">%{r.baseSupport}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-dashed border-slate-800 text-center text-slate-400 text-xs flex flex-col items-center justify-center min-h-[300px]">
              <Globe className="w-8 h-8 text-slate-600 mb-2" />
              <span>Click on any nation on the tactical operations map to inspect its geopolitical intelligence dossier.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
