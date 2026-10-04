/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { 
  Scale, Shield, Globe, Landmark, Coins, Ship, 
  Flame, CheckCircle2, AlertTriangle, Sparkles, X, 
  MapPin, Check, Award, ArrowRight, BookOpen, Layers
} from 'lucide-react';
import { Country, ScenarioYear, PeaceTreatyTerms } from '../types';
export type { PeaceTreatyTerms };
import { loadCountryMapData, getFeatureRegionName } from '../data/mapRegistry';
import { getCountryMilitaryBaselines } from './TacticalBattleView';
import { setRegionController, getTerritoryControlMap } from '../utils/territorialControl';
import { playSound } from '../lib/sounds';

interface PeaceConferenceModalProps {
  victorCountry: Country;
  targetCountryId: string;
  targetCountryName: string;
  targetCountryFlag?: string;
  scenario?: ScenarioYear | string;
  darkMode?: boolean;
  warSuperiority?: number;
  onClose: () => void;
  onRatifyTreaty: (terms: PeaceTreatyTerms) => void;
}

export const PeaceConferenceModal: React.FC<PeaceConferenceModalProps> = ({
  victorCountry,
  targetCountryId,
  targetCountryName,
  targetCountryFlag = '🏳️',
  scenario = '2026',
  darkMode = true,
  warSuperiority = 75,
  onClose,
  onRatifyTreaty
}) => {
  const is2026 = scenario === '2026';
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);

  // UN Compliance Option (Requirement: UN compliance mode especially for 2026)
  const [isUNCompliant, setIsUNCompliant] = useState<boolean>(is2026);

  // Provinces selection: 'ANNEX' | 'BUFFER' | 'RETAIN'
  const [provinceStatusMap, setProvinceStatusMap] = useState<Record<string, 'ANNEX' | 'BUFFER' | 'RETAIN'>>({});
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Ideology / Regime Change options (Context-appropriate modern treaties)
  const [selectedIdeology, setSelectedIdeology] = useState<string>('Status Quo Sovereign Peace');
  const [selectedGovernment, setSelectedGovernment] = useState<string>('Sovereign Constitutional Republic');

  // Military Confiscations
  const [confiscateFleet, setConfiscateFleet] = useState<boolean>(false);
  const [confiscateTanks, setConfiscateTanks] = useState<boolean>(true);
  const [confiscateAircraft, setConfiscateAircraft] = useState<boolean>(false);
  const [fullDisarmament, setFullDisarmament] = useState<boolean>(false);

  // War Reparations Indemnity
  const [reparationsPreset, setReparationsPreset] = useState<'NONE' | 'MODERATE' | 'HEAVY' | 'MAXIMUM'>('MODERATE');

  // Baseline military numbers of defeated country
  const enemyBaselines = useMemo(() => {
    return getCountryMilitaryBaselines(targetCountryId, scenario as ScenarioYear);
  }, [targetCountryId, scenario]);

  // Load Map GeoJSON for Defeated Country and Victor's Occupied/Contested Homelands (Requirement 2)
  useEffect(() => {
    let isMounted = true;
    setIsLoadingGeo(true);

    const isCrossBorderWar = (targetCountryId === 'RU' && victorCountry.id === 'UA') || 
                             (targetCountryId === 'UA' && victorCountry.id === 'RU') ||
                             Boolean(victorCountry.id && targetCountryId);

    const loadPromises = [loadCountryMapData(targetCountryId)];
    if (isCrossBorderWar) {
      loadPromises.push(loadCountryMapData(victorCountry.id));
    }

    Promise.all(loadPromises)
      .then(results => {
        if (!isMounted) return;
        const targetRes = (results[0] as any)?.data || results[0];
        const victorRes = results[1] ? ((results[1] as any)?.data || results[1]) : null;

        const combinedFeatures: any[] = [];
        const initialMap: Record<string, 'ANNEX' | 'BUFFER' | 'RETAIN'> = {};
        const controlMap = getTerritoryControlMap();

        // 1. Enemy core regions
        if (targetRes && targetRes.features) {
          targetRes.features.forEach((feat: any) => {
            const name = getFeatureRegionName(feat, targetCountryId);
            if (name) {
              const currentCtrl = controlMap[name];
              initialMap[name] = currentCtrl === 'BUFFER_ZONE' ? 'BUFFER' : currentCtrl === victorCountry.id ? 'ANNEX' : 'RETAIN';
              combinedFeatures.push({ ...feat, _countryId: targetCountryId, _regionName: name, _isCoreEnemy: true });
            }
          });
        }

        // 2. Player-held or occupied regions that originally belonged to the player (e.g. Crimea, Donbas, Zaporizhzhia)
        if (victorRes && victorRes.features) {
          victorRes.features.forEach((feat: any) => {
            const name = getFeatureRegionName(feat, victorCountry.id);
            if (name) {
              const currentCtrl = controlMap[name];
              const isOccupiedByEnemy = currentCtrl === targetCountryId || /crimea|donetsk|luhansk|zaporizhzhia|kherson|kursk|belgorod/i.test(name);
              // Only include occupied/frontline regions from victor country so map focuses on the conflict theater
              if (isOccupiedByEnemy || (targetCountryId === 'RU' && victorCountry.id === 'UA') || (targetCountryId === 'UA' && victorCountry.id === 'RU')) {
                initialMap[name] = currentCtrl === 'BUFFER_ZONE' ? 'BUFFER' : currentCtrl === targetCountryId ? 'RETAIN' : 'ANNEX';
                combinedFeatures.push({ ...feat, _countryId: victorCountry.id, _regionName: name, _isOccupiedPlayerTerritory: isOccupiedByEnemy });
              }
            }
          });
        }

        setGeoData({ type: 'FeatureCollection', features: combinedFeatures.length > 0 ? combinedFeatures : (targetRes?.features || []) });
        setProvinceStatusMap(initialMap);
        setIsLoadingGeo(false);
      })
      .catch(err => {
        console.warn('Peace conference map load error:', err);
        if (isMounted) setIsLoadingGeo(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetCountryId, victorCountry.id]);

  // D3 Projection for Map
  const { projection, pathGenerator } = useMemo(() => {
    if (!geoData || !geoData.features) return { projection: null, pathGenerator: null };
    const width = 480;
    const height = 360;
    const pad = 24;

    const proj = geoMercator().fitExtent(
      [[pad, pad], [width - pad, height - pad]],
      geoData
    );
    const pathGen = geoPath(proj);
    return { projection: proj, pathGenerator: pathGen };
  }, [geoData]);

  // Count how many provinces are annexed or buffer
  const annexedCount = Object.values(provinceStatusMap).filter(v => v === 'ANNEX').length;
  const bufferCount = Object.values(provinceStatusMap).filter(v => v === 'BUFFER').length;
  const totalProvinces = Object.keys(provinceStatusMap).length || 1;

  // Toggle province status on click / touch & update borders immediately on all maps (Requirement 2)
  const toggleProvinceStatus = (provName: string, explicitStatus?: 'ANNEX' | 'BUFFER' | 'RETAIN') => {
    playSound('click');
    setProvinceStatusMap(prev => {
      const current = prev[provName] || 'RETAIN';
      let next: 'ANNEX' | 'BUFFER' | 'RETAIN' = explicitStatus || 'RETAIN';

      if (!explicitStatus) {
        if (isUNCompliant) {
          if (current === 'RETAIN') next = 'BUFFER';
          else if (current === 'BUFFER') next = 'ANNEX';
          else next = 'RETAIN';
        } else {
          if (current === 'RETAIN') next = 'ANNEX';
          else if (current === 'ANNEX') next = 'BUFFER';
          else next = 'RETAIN';
        }
      }

      // Requirement 2: Every term updates borders immediately on all maps!
      const newControllerId = next === 'ANNEX' ? victorCountry.id : next === 'BUFFER' ? 'BUFFER_ZONE' : targetCountryId;
      setRegionController(provName, newControllerId);

      return { ...prev, [provName]: next };
    });
  };

  // Reparations calculation
  const reparationsCash = useMemo(() => {
    if (reparationsPreset === 'NONE') return 0;
    if (reparationsPreset === 'MODERATE') return 50000000;
    if (reparationsPreset === 'HEAVY') return 180000000;
    return 350000000;
  }, [reparationsPreset]);

  // Confiscated assets summary
  const seizedWarships = confiscateFleet ? Math.max(8, Math.round(enemyBaselines.warships * 0.75)) : 0;
  const seizedTanks = confiscateTanks ? Math.max(40, Math.round(enemyBaselines.tanks * 0.70)) : 0;
  const seizedAircraft = confiscateAircraft ? Math.max(15, Math.round(enemyBaselines.aircraft * 0.65)) : 0;

  // Demands cost calculation & AI Acceptance evaluation
  const effectiveSuperiority = Math.max(35, Math.min(100, warSuperiority));

  const demandsCost = useMemo(() => {
    let cost = 0;
    // Territory demands
    cost += annexedCount * 18;
    cost += bufferCount * 6;

    // Reparations
    if (reparationsPreset === 'MODERATE') cost += 10;
    else if (reparationsPreset === 'HEAVY') cost += 20;
    else if (reparationsPreset === 'MAXIMUM') cost += 32;

    // Disarmament & Military Confiscations
    if (confiscateFleet) cost += 12;
    if (confiscateTanks) cost += 10;
    if (confiscateAircraft) cost += 10;
    if (fullDisarmament) cost += 22;

    // Regime change (if not Status Quo)
    if (selectedIdeology !== 'Status Quo Sovereign Peace') {
      cost += 15;
    }

    return cost;
  }, [annexedCount, bufferCount, reparationsPreset, confiscateFleet, confiscateTanks, confiscateAircraft, fullDisarmament, selectedIdeology]);

  const isAcceptedByAI = demandsCost <= effectiveSuperiority;

  // Handle final treaty ratification
  const handleConfirmRatification = () => {
    if (!isAcceptedByAI) {
      playSound('error');
      return;
    }
    playSound('win');
    const annexedList = Object.entries(provinceStatusMap)
      .filter(([_, status]) => status === 'ANNEX')
      .map(([name]) => name);

    const bufferList = Object.entries(provinceStatusMap)
      .filter(([_, status]) => status === 'BUFFER')
      .map(([name]) => name);

    const terms: PeaceTreatyTerms = {
      targetCountryId,
      targetCountryName,
      isUNCompliant,
      annexedProvinces: annexedList,
      demilitarizedProvinces: bufferList,
      newGovernmentType: selectedGovernment,
      newIdeology: selectedIdeology,
      newReligion: 'Secular Civil Code',
      confiscateFleet,
      confiscateTanks,
      confiscateAircraft,
      fullDisarmament,
      warReparationsAmount: reparationsCash,
      monthlyReparations: reparationsPreset !== 'NONE' ? 5000000 : 0,
      unSecurityCouncilApproval: isUNCompliant
    };

    onRatifyTreaty(terms);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        ref={containerRef}
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* HEADER: PEACE CONFERENCE BANNER */}
        <div className="p-5 md:p-6 border-b border-slate-800/80 bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-950 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🕊️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                  {scenario} Global Summit Accord
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Unconditional Capitulation
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                {targetCountryName} {targetCountryFlag} Peace Conference & Sovereign Treaty
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Summit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN BODY: 2 COLUMN SPLIT */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: INTERACTIVE PROVINCE MAP & ANNEXATION */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Territorial Disposition (Touch Provinces to Annex)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click or touch any province on the map to annex to sovereign territory or designate as a demilitarized buffer zone.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold shrink-0">
                {annexedCount} / {totalProvinces} Annexed
              </span>
            </div>

            {/* SVG Interactive Map Container */}
            <div className="relative w-full h-80 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
              {isLoadingGeo ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Loading {targetCountryName} Provinces...</span>
                </div>
              ) : pathGenerator && geoData ? (
                <svg viewBox="0 0 480 360" className="w-full h-full select-none cursor-pointer">
                  <defs>
                    <pattern id="peace-buffer-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <rect width="8" height="8" fill="#334155" />
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="2.5" />
                    </pattern>
                  </defs>
                  <g>
                    {geoData.features.map((feat: any, idx: number) => {
                      const provName = feat._regionName || getFeatureRegionName(feat, targetCountryId);
                      const status = provinceStatusMap[provName] || 'RETAIN';
                      const isHovered = hoveredProvince === provName;

                      let fillColor = '#334155'; // default slate-700
                      let strokeColor = '#475569';
                      let strokeDasharray: string | undefined = undefined;

                      if (status === 'ANNEX') {
                        fillColor = '#059669'; // emerald-600
                        strokeColor = '#10b981';
                      } else if (status === 'BUFFER') {
                        fillColor = 'url(#peace-buffer-hatch)';
                        strokeColor = '#94a3b8';
                        strokeDasharray = '4, 3';
                      }

                      if (isHovered) {
                        if (status === 'ANNEX') fillColor = '#10b981';
                        else if (status === 'BUFFER') fillColor = 'url(#peace-buffer-hatch)';
                        else fillColor = '#64748b';
                      }

                      const pathD = pathGenerator(feat);
                      if (!pathD) return null;

                      return (
                        <path
                          key={idx}
                          d={pathD}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isHovered ? 2.5 : 1.2}
                          strokeDasharray={strokeDasharray}
                          className="transition-colors duration-150"
                          onMouseEnter={() => setHoveredProvince(provName)}
                          onMouseLeave={() => setHoveredProvince(null)}
                          onClick={() => toggleProvinceStatus(provName)}
                        />
                      );
                    })}
                  </g>
                </svg>
              ) : (
                <div className="text-xs text-slate-500">Provincial boundary data unavailable for GIS render.</div>
              )}

              {/* Hovered Province Floating Tooltip */}
              {hoveredProvince && (
                <div className="absolute bottom-3 left-3 bg-slate-950/95 border border-slate-700 px-3 py-1.5 rounded-xl shadow-xl text-xs flex items-center gap-2 pointer-events-none">
                  <span className="font-bold text-white">{hoveredProvince}</span>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                    provinceStatusMap[hoveredProvince] === 'ANNEX' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : provinceStatusMap[hoveredProvince] === 'BUFFER'
                        ? 'bg-slate-700 text-slate-200 border border-slate-500'
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {provinceStatusMap[hoveredProvince] === 'BUFFER' ? '🛡️ Demilitarized Buffer Zone' : (provinceStatusMap[hoveredProvince] || 'RETAIN')}
                  </span>
                </div>
              )}
            </div>

            {/* Map Action Legend & Quick Toggles */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 shrink-0" /> Annexed ({annexedCount})
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <span className="w-3 h-3 rounded-md bg-hatched-neutral border border-slate-400 shrink-0" /> Buffer Zone ({bufferCount})
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded-md bg-slate-700 shrink-0" /> Retained
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    playSound('click');
                    const updatedMap: Record<string, 'BUFFER'> = {};
                    Object.keys(provinceStatusMap).forEach(k => {
                      updatedMap[k] = 'BUFFER';
                      setRegionController(k, 'BUFFER_ZONE');
                    });
                    setProvinceStatusMap(prev => ({ ...prev, ...updatedMap }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase transition-colors cursor-pointer border border-slate-600 flex items-center gap-1"
                  title="Designate all provinces as a Demilitarized Buffer Zone"
                >
                  <span>🛡️ Buffer Zone All</span>
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    const updatedMap: Record<string, 'ANNEX'> = {};
                    Object.keys(provinceStatusMap).forEach(k => {
                      updatedMap[k] = 'ANNEX';
                      setRegionController(k, victorCountry.id);
                    });
                    setProvinceStatusMap(prev => ({ ...prev, ...updatedMap }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold uppercase transition-colors cursor-pointer border border-emerald-500/40"
                >
                  Annex All
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    const updatedMap: Record<string, 'RETAIN'> = {};
                    Object.keys(provinceStatusMap).forEach(k => {
                      updatedMap[k] = 'RETAIN';
                      setRegionController(k, targetCountryId);
                    });
                    setProvinceStatusMap(prev => ({ ...prev, ...updatedMap }));
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Scrollable list of provinces for accessibility */}
            <div className="max-h-36 overflow-y-auto pr-1 flex flex-wrap gap-1.5">
              {Object.keys(provinceStatusMap).map(provName => {
                const status = provinceStatusMap[provName];
                return (
                  <button
                    key={provName}
                    onClick={() => toggleProvinceStatus(provName)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      status === 'ANNEX'
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : status === 'BUFFER'
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{provName}</span>
                    <span className="text-[9px] font-mono opacity-80">
                      {status === 'ANNEX' ? '✓ Annexed' : status === 'BUFFER' ? '🛡️ Buffer' : '•'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: UN MODE, REGIME, RELIGION, MILITARY, REPARATIONS */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* 1. UNITED NATIONS (BM) COMPLIANCE MODE SWITCH */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isUNCompliant 
                ? 'bg-blue-950/40 border-blue-500/40 shadow-md' 
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>United Nations (BM) International Law Compliance</span>
                      {is2026 && <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">2026 Mandate</span>}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isUNCompliant 
                        ? 'Align treaty with UN Charter Chapter VII: Grants +35 Global Reputation & $150M UN Grant.' 
                        : 'Total Victor Dictated Peace: Unrestricted annexations, but triggers -15 UN diplomatic friction.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound('click');
                    setIsUNCompliant(!isUNCompliant);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shrink-0 ${
                    isUNCompliant 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isUNCompliant ? 'UN Compliant: ON' : 'Dictated Peace: ON'}
                </button>
              </div>

              {isUNCompliant && (
                <div className="mt-2.5 pt-2.5 border-t border-blue-500/20 grid grid-cols-2 gap-2 text-[10px] font-mono text-blue-300">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>+35 Global Reputation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>+$150,000,000 UN Reconstruction Grant</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. REGIME & DIPLOMATIC SETTLEMENT */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-400" />
                <span>Diplomatic Regime Settlement</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { 
                    name: 'Status Quo Sovereign Peace', 
                    gov: 'Sovereign Republic', 
                    label: '🕊️ Status Quo Sovereign Peace', 
                    desc: 'No intervention in internal affairs; constitutional sovereignty preserved (+0 Cost)' 
                  },
                  { 
                    name: 'Demilitarized Neutral Buffer State', 
                    gov: 'Neutral Buffer Authority', 
                    label: '🛡️ Demilitarized Buffer State', 
                    desc: 'Internationally guaranteed demilitarized buffer zone status (+15 Cost)' 
                  },
                  { 
                    name: 'Democratic Transition', 
                    gov: 'Parliamentary Democracy', 
                    label: '🗳️ Democratic Transition', 
                    desc: 'Multi-party transparent elections and internationally supervised constitution (+15 Cost)' 
                  },
                  { 
                    name: 'Install Allied Coalition Governance', 
                    gov: 'Allied Sovereign Government', 
                    label: '🤝 Allied Coalition Governance', 
                    desc: 'Mutual defense pact and installation of an allied transitional administration (+15 Cost)' 
                  }
                ].map((item, idx) => {
                  const isSelected = selectedIdeology === item.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        playSound('click');
                        setSelectedIdeology(item.name);
                        setSelectedGovernment(item.gov);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold shadow-sm' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{item.label}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. MILITARY ASSET CONFISCATION & FLEET (Tüm Ordu Mühimmatı ve Gemilere El Koyma) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" />
                <span>Seizure of Military Arsenals & Naval Fleets</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900/80">
                  <div className="flex items-center gap-2 truncate">
                    <Ship className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Seize War Fleets</span>
                      <span className="text-[9.5px] text-cyan-400 font-mono">+{seizedWarships} Warships</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={confiscateFleet}
                    onChange={(e) => setConfiscateFleet(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>

                <label className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900/80">
                  <div className="flex items-center gap-2 truncate">
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Seize Heavy Armor</span>
                      <span className="text-[9.5px] text-amber-400 font-mono">+{seizedTanks} MBT Tanks</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={confiscateTanks}
                    onChange={(e) => setConfiscateTanks(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>

                <label className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900/80">
                  <div className="flex items-center gap-2 truncate">
                    <Flame className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Seize Air Wings</span>
                      <span className="text-[9.5px] text-blue-400 font-mono">+{seizedAircraft} Fighters</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={confiscateAircraft}
                    onChange={(e) => setConfiscateAircraft(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>

                <label className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-900/80">
                  <div className="flex items-center gap-2 truncate">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Full Disarmament</span>
                      <span className="text-[9.5px] text-emerald-400 font-mono">Disband Army</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={fullDisarmament}
                    onChange={(e) => setFullDisarmament(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 5. WAR REPARATIONS & INDEMNITY */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>War Reparations & Indemnity</span>
                </h4>
                <span className="text-xs font-mono font-black text-amber-400">
                  ${reparationsCash.toLocaleString()} USD
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'NONE', label: 'Waived', cash: '$0' },
                  { id: 'MODERATE', label: 'Moderate', cash: '$50M' },
                  { id: 'HEAVY', label: 'Heavy', cash: '$180M' },
                  { id: 'MAXIMUM', label: 'Maximum', cash: '$350M' }
                ].map((item) => {
                  const isSelected = reparationsPreset === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        playSound('click');
                        setReparationsPreset(item.id as any);
                      }}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col ${
                        isSelected 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{item.label}</span>
                      <span className="text-[9px] font-mono mt-0.5">{item.cash}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* WAR SUPERIORITY & AI ACCEPTANCE INDICATOR */}
        <div className={`p-3.5 px-6 border-t ${
          isAcceptedByAI 
            ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-900/50 text-rose-200'
        } flex items-center justify-between gap-4 flex-wrap text-xs`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shrink-0 ${isAcceptedByAI ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <span className="font-black uppercase tracking-wider block text-[11px]">
                {isAcceptedByAI ? '🟢 DIPLOMATIC ACCEPTANCE: Terms Acceptable' : '🔴 DIPLOMATIC REJECTION: Demands Exceed Superiority!'}
              </span>
              <span className="text-[10px] opacity-85">
                {isAcceptedByAI 
                  ? `The enemy delegation agrees to ratify this treaty under your military superiority (${demandsCost} / ${effectiveSuperiority} demand score).`
                  : `Your demands (${demandsCost} pts) exceed your battlefield superiority (${effectiveSuperiority} pts)! The enemy refuses to surrender. Reduce territorial demands or reparations.`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <span className="text-slate-400">Superiority:</span>
            <span className="font-bold text-sky-400">{effectiveSuperiority}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Demands:</span>
            <span className={`font-bold ${demandsCost > effectiveSuperiority ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
              {demandsCost}
            </span>
          </div>
        </div>

        {/* FOOTER: RATIFICATION BAR */}
        <div className="p-5 md:p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Territory Ceded:</span>
              <strong className="text-emerald-400 font-mono font-bold">{annexedCount} Provinces</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Reparations:</span>
              <strong className="text-amber-400 font-mono font-bold">${reparationsCash.toLocaleString()}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">New Regime:</span>
              <strong className="text-indigo-300 truncate max-w-[140px]">{selectedIdeology}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!isAcceptedByAI}
              onClick={handleConfirmRatification}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-xl transition-all flex items-center gap-2 ${
                isAcceptedByAI
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white cursor-pointer shadow-indigo-500/25'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isAcceptedByAI ? 'Sign & Ratify Final Peace Treaty' : 'Demands Exceed Superiority - Rejected'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
