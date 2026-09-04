/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Shield, Swords, Crosshair, Users, AlertTriangle, 
  MapPin, Anchor, Plane, Bomb, Flame, RefreshCw, 
  Eye, Check, ChevronRight, Activity, ArrowRight,
  TrendingUp, TrendingDown, Layers, HelpCircle, X, ShieldAlert,
  Ship, ShieldCheck, Flag
} from 'lucide-react';
import { 
  TheaterRegion, 
  NATODivision, 
  DivisionType, 
  PersistentCasualtyStats, 
  getTheaterRegions,
  initializeTheaterDivisions
} from '../utils/warTheaterEngine';
import { 
  calculateCombatPower, 
  resolveDeterministicFrontlineBattle,
  setRegionController,
  getTerritoryControlMap,
  CombatBelligerentForces,
  FrontlineBattleResult
} from '../utils/territorialControl';
import { Country, ScenarioYear } from '../types';
import { playSound } from '../lib/sounds';

interface WarFrontlineMapProps {
  country: Country;
  enemyCountryId?: string;
  theaterKey: string; // 'CIVIL_WAR' or enemyCountryId like 'RU', 'GR', etc.
  conflictName?: string;
  scenario?: string;
  darkMode?: boolean;
  onTerritoryChanged?: () => void;
  onCeasefireOrVictory?: (won: boolean) => void;
  airSuperiority?: number;
  availableTransports?: number;
}

export const WarFrontlineMap: React.FC<WarFrontlineMapProps> = ({
  country,
  enemyCountryId,
  theaterKey,
  conflictName,
  scenario = '2026',
  darkMode = true,
  onTerritoryChanged,
  onCeasefireOrVictory,
  airSuperiority = 65,
  availableTransports = 8
}) => {
  // 1. Theater Setup & Data
  const theaterData = useMemo(() => {
    return getTheaterRegions(country.id, enemyCountryId, country);
  }, [country.id, enemyCountryId, country]);

  const [regions, setRegions] = useState<TheaterRegion[]>(theaterData.regions);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [draggedDivisionId, setDraggedDivisionId] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // 2. NATO Divisions State
  const [divisions, setDivisions] = useState<NATODivision[]>(() => {
    const friendlySide = theaterData.factions.find(f => f.isGovernment) || theaterData.factions[0];
    const enemySide = theaterData.factions.find(f => !f.isGovernment) || theaterData.factions[1] || { id: 'ENEMY', name: 'Hostile Forces' };
    
    return initializeTheaterDivisions(
      theaterData.regions,
      friendlySide.id,
      friendlySide.name,
      enemySide.id,
      enemySide.name,
      Math.max(120000, (country.population || 50000000) * 0.005),
      Math.max(100000, (country.population || 50000000) * 0.0045)
    );
  });

  // Re-sync regions when theater changes
  useEffect(() => {
    setRegions(theaterData.regions);
  }, [theaterData]);

  // 3. Persistent Casualty and Loss Statistics (Top-Right HUD)
  const [casualtyStats, setCasualtyStats] = useState<PersistentCasualtyStats>({
    ownLosses: {
      soldiers: 1420,
      soldiersThisTurn: 0,
      tanks: 18,
      tanksThisTurn: 0,
      aircraft: 4,
      aircraftThisTurn: 0,
      artillery: 12,
      artilleryThisTurn: 0
    },
    enemyLosses: {
      soldiers: 3180,
      soldiersThisTurn: 0,
      tanks: 42,
      tanksThisTurn: 0,
      aircraft: 9,
      aircraftThisTurn: 0,
      artillery: 28,
      artilleryThisTurn: 0
    },
    territory: {
      capturedThisTurn: 0,
      lostThisTurn: 0,
      totalCaptured: 1,
      totalLost: 0
    },
    airSuperiority: airSuperiority,
    navalControl: 70,
    transportShips: {
      total: availableTransports,
      inUse: 0
    }
  });

  // 4. Combat Resolution Modal / Banner State
  const [activeBattleResult, setActiveBattleResult] = useState<{
    result: FrontlineBattleResult;
    attackerDivision: NATODivision;
    targetRegion: TheaterRegion;
    isAmphibious: boolean;
  } | null>(null);

  const [combatLog, setCombatLog] = useState<string[]>([
    `⚔️ Frontline theater operational. NATO combat division counters deployed to tactical positions.`,
    `📡 High Command orders: Drag friendly divisions to adjacent enemy sectors to attack, or to friendly sectors to maneuver.`
  ]);

  const [turnCounter, setTurnCounter] = useState<number>(1);
  const [isResolvingTurn, setIsResolvingTurn] = useState<boolean>(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(false);

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const regionLayersRef = useRef<Record<string, L.Polygon>>({});
  const markerLayersRef = useRef<Record<string, L.Marker>>({});
  const frontlinesLayerRef = useRef<L.LayerGroup | null>(null);
  const neighborsLayerRef = useRef<L.GeoJSON | null>(null);

  const selectedDivision = useMemo(() => {
    return divisions.find(d => d.id === selectedDivisionId) || null;
  }, [divisions, selectedDivisionId]);

  const friendlySideId = useMemo(() => {
    return theaterData.factions.find(f => f.isGovernment)?.id || country.id;
  }, [theaterData, country.id]);

  // Valid reachable adjacent region IDs for selected division
  const reachableRegionIds = useMemo(() => {
    if (!selectedDivision) return new Set<string>();
    const currentReg = regions.find(r => r.id === selectedDivision.regionId);
    if (!currentReg) return new Set<string>();

    const set = new Set<string>();
    // 1. Direct land adjacent regions
    currentReg.adjacentRegionIds.forEach(id => set.add(id));

    // 2. Overseas reachable coastal regions if division is at a port and transport ships exist
    if (currentReg.isPort && casualtyStats.transportShips.total > casualtyStats.transportShips.inUse) {
      regions.filter(r => r.isPort && r.id !== currentReg.id).forEach(r => set.add(r.id));
    }

    return set;
  }, [selectedDivision, regions, casualtyStats.transportShips]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: theaterData.center,
      zoom: theaterData.zoom,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Dark military-grade tactical basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Load Neighbor Countries GeoJSON for surrounding geopolitical context
    fetch('/world_admin0_50m.geojson')
      .then(res => res.json())
      .then(geoData => {
        if (!mapInstanceRef.current) return;
        const neighborSet = new Set(theaterData.neighborIsoCodes);

        const neighborGeoJson = L.geoJSON(geoData, {
          filter: (feature: any) => {
            const isoA2 = (feature.properties?.iso_a2 || '').toUpperCase();
            const isoA3 = (feature.properties?.iso_a3 || feature.properties?.adm0_a3 || '').toUpperCase();
            return neighborSet.has(isoA2) || neighborSet.has(isoA3);
          },
          style: {
            fillColor: '#1e293b',
            fillOpacity: 0.45,
            color: '#475569',
            weight: 1.2,
            dashArray: '3, 3'
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || 'Neighboring State';
            layer.bindTooltip(`🌐 ${name} (Neutral)`, {
              permanent: false,
              direction: 'center',
              className: 'bg-slate-900/90 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 font-mono'
            });
          }
        });

        neighborGeoJson.addTo(mapInstanceRef.current);
        neighborsLayerRef.current = neighborGeoJson;
      })
      .catch(e => console.warn('Neighbor GeoJSON load skipped', e));

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [theaterData]);

  // Render & Update Region Polygons on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous region layers
    Object.values(regionLayersRef.current).forEach((layer: any) => {
      if (layer && typeof layer.remove === 'function') layer.remove();
    });
    regionLayersRef.current = {};

    if (frontlinesLayerRef.current) {
      frontlinesLayerRef.current.remove();
      frontlinesLayerRef.current = null;
    }

    const frontlinesGroup = L.layerGroup().addTo(map);
    frontlinesLayerRef.current = frontlinesGroup;

    regions.forEach(reg => {
      const isFriendly = reg.controllerId === friendlySideId;
      const isReachable = reachableRegionIds.has(reg.id);
      const isSelected = selectedRegionId === reg.id;
      const isHovered = hoveredRegionId === reg.id;

      // Color scheme
      let fillColor = isFriendly ? '#1e40af' : '#991b1b'; // Friendly Navy vs Hostile Crimson
      let fillOpacity = 0.55;
      let borderColor = isFriendly ? '#3b82f6' : '#ef4444';
      let borderWidth = 2;

      if (isSelected) {
        borderColor = '#fbbf24'; // Gold highlight
        borderWidth = 3.5;
        fillOpacity = 0.75;
      } else if (isReachable) {
        if (!isFriendly) {
          borderColor = '#f59e0b'; // Target enemy region highlighted in pulsing amber
          borderWidth = 3;
          fillOpacity = 0.7;
        } else {
          borderColor = '#10b981'; // Maneuver friendly region in green
          borderWidth = 2.5;
          fillOpacity = 0.65;
        }
      }

      // Render polygon
      const polygon = L.polygon(reg.polygon, {
        fillColor,
        fillOpacity,
        color: borderColor,
        weight: borderWidth,
        className: isReachable ? 'cursor-pointer transition-all duration-200' : 'cursor-default'
      }).addTo(map);

      // Region tooltip / label
      const terrainBadge = getTerrainIcon(reg.terrain);
      const portBadge = reg.isPort ? '⚓ Port' : '';
      const controllerLabel = isFriendly ? '🔵 Friendly Control' : '🔴 Hostile Occupied';

      polygon.bindTooltip(`
        <div class="p-1 font-mono text-xs">
          <div class="font-bold text-slate-100 flex items-center gap-1">${terrainBadge} ${reg.name}</div>
          <div class="${isFriendly ? 'text-blue-400' : 'text-red-400'} font-semibold">${controllerLabel}</div>
          <div class="text-slate-400 flex items-center justify-between gap-3 text-[11px] mt-1">
            <span>🛡️ Fort: Lv.${reg.fortificationLevel}</span>
            <span>⚡ Infra: Lv.${reg.infrastructureLevel}</span>
            ${portBadge ? `<span class="text-cyan-400">${portBadge}</span>` : ''}
          </div>
        </div>
      `, {
        permanent: false,
        direction: 'top',
        className: 'bg-slate-950/95 text-slate-100 rounded-lg p-2 border border-slate-700 shadow-2xl backdrop-blur-md'
      });

      // Click on region
      polygon.on('click', () => {
        handleRegionClick(reg);
      });

      // Hover effects
      polygon.on('mouseover', () => {
        setHoveredRegionId(reg.id);
      });
      polygon.on('mouseout', () => {
        setHoveredRegionId(null);
      });

      regionLayersRef.current[reg.id] = polygon;

      // Draw thick contested frontline if this region borders an enemy region
      reg.adjacentRegionIds.forEach(adjId => {
        const adjReg = regions.find(r => r.id === adjId);
        if (adjReg && adjReg.controllerId !== reg.controllerId) {
          // Contested line segment between centroids
          const frontlineLine = L.polyline([reg.center, adjReg.center], {
            color: '#ef4444',
            weight: 3.5,
            dashArray: '6, 6',
            opacity: 0.85
          });
          frontlineLine.addTo(frontlinesGroup);
        }
      });
    });
  }, [regions, reachableRegionIds, selectedRegionId, hoveredRegionId, friendlySideId]);

  // Render & Update NATO Unit Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markerLayersRef.current).forEach((m: any) => {
      if (m && typeof m.remove === 'function') m.remove();
    });
    markerLayersRef.current = {};

    // Group divisions by regionId so multiple units in one sector don't overlap completely
    const divisionsByRegion: Record<string, NATODivision[]> = {};
    divisions.forEach(d => {
      if (!divisionsByRegion[d.regionId]) divisionsByRegion[d.regionId] = [];
      divisionsByRegion[d.regionId].push(d);
    });

    Object.entries(divisionsByRegion).forEach(([regId, divList]) => {
      const reg = regions.find(r => r.id === regId);
      if (!reg) return;

      divList.forEach((div, idx) => {
        const offsetLat = (idx - (divList.length - 1) / 2) * 0.18;
        const offsetLng = (idx % 2 === 0 ? 0.12 : -0.12) * Math.min(1, idx);
        const markerPos: [number, number] = [reg.center[0] + offsetLat, reg.center[1] + offsetLng];

        const isSelected = selectedDivisionId === div.id;
        const isFriendly = div.side === 'FRIENDLY';

        // Custom NATO Marker HTML with Military Symbology
        const natoSymbol = getNATOSymbol(div.type);
        const hpPercent = Math.round((div.manpower / div.maxManpower) * 100);

        const markerHtml = `
          <div 
            id="nato-${div.id}" 
            draggable="${isFriendly}" 
            class="nato-counter ${isFriendly ? 'friendly' : 'enemy'} ${isSelected ? 'selected' : ''} ${div.isEmbarked ? 'embarked' : ''} group"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 58px;
              height: 38px;
              background-color: ${isFriendly ? 'rgba(15, 23, 42, 0.92)' : 'rgba(69, 10, 10, 0.92)'};
              border: 2px solid ${isSelected ? '#fbbf24' : (isFriendly ? '#38bdf8' : '#f87171')};
              border-radius: 4px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6), ${isSelected ? '0 0 10px #fbbf24' : 'none'};
              cursor: ${isFriendly ? 'grab' : 'pointer'};
              transition: transform 0.15s ease, border-color 0.15s ease;
              user-select: none;
            "
          >
            <!-- NATO Echelon Header -->
            <div style="font-size: 8px; font-family: monospace; font-weight: bold; color: ${isFriendly ? '#7dd3fc' : '#fca5a5'}; line-height: 1; letter-spacing: 0.5px;">
              ${div.echelon === 'DIVISION' ? 'XX' : 'X'}
            </div>

            <!-- NATO Center Symbol & Type -->
            <div style="display: flex; align-items: center; justify-content: center; font-size: 13px; line-height: 1; margin: 1px 0;">
              ${div.isEmbarked ? '⚓' : natoSymbol}
            </div>

            <!-- Health / Readiness Mini-Bar -->
            <div style="width: 85%; height: 3px; background: #334155; border-radius: 2px; overflow: hidden; margin-top: 1px;">
              <div style="width: ${hpPercent}%; height: 100%; background: ${hpPercent > 60 ? '#10b981' : (hpPercent > 30 ? '#f59e0b' : '#ef4444')};"></div>
            </div>

            <!-- Status Indicator -->
            <div style="font-size: 7px; font-family: monospace; color: #cbd5e1; font-weight: bold;">
              ${Math.round(div.manpower / 1000)}k
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'nato-marker-icon',
          iconSize: [58, 38],
          iconAnchor: [29, 19]
        });

        const marker = L.marker(markerPos, { icon: customIcon }).addTo(map);

        // Tooltip with full division breakdown
        marker.bindTooltip(`
          <div class="p-1 font-mono text-xs">
            <div class="font-bold text-slate-100 flex items-center justify-between gap-2">
              <span>${div.name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded ${isFriendly ? 'bg-blue-900 text-blue-200' : 'bg-red-900 text-red-200'}">${div.echelon}</span>
            </div>
            <div class="text-slate-300 text-[11px] mt-1 space-y-0.5">
              <div class="flex justify-between"><span>🪖 Manpower:</span> <span class="font-bold">${div.manpower.toLocaleString()} / ${div.maxManpower.toLocaleString()} (${hpPercent}%)</span></div>
              <div class="flex justify-between"><span>🛡️ Armor:</span> <span class="font-bold text-amber-400">${div.tanks} Tanks</span></div>
              <div class="flex justify-between"><span>✈️ Air Wings:</span> <span class="font-bold text-cyan-400">${div.aircraft} Aircraft</span></div>
              <div class="flex justify-between"><span>💥 Artillery:</span> <span class="font-bold text-orange-400">${div.artillery} Guns</span></div>
              <div class="flex justify-between"><span>🛡️ Entrenchment:</span> <span class="font-bold text-emerald-400">${div.entrenchment}%</span></div>
            </div>
            <div class="mt-1 text-[10px] text-cyan-300 border-t border-slate-700 pt-1">
              ${isFriendly ? '👉 Drag or click to attack adjacent enemy or move friendly.' : '🎯 Target Hostile Division'}
            </div>
          </div>
        `, {
          permanent: false,
          direction: 'top',
          className: 'bg-slate-950/95 text-slate-100 rounded-lg p-2.5 border border-slate-700 shadow-2xl backdrop-blur-md'
        });

        // Click on marker
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (isFriendly) {
            handleSelectDivision(div);
          } else if (selectedDivision && reachableRegionIds.has(div.regionId)) {
            // Player clicked on an enemy division in a reachable adjacent region -> trigger assault!
            const targetReg = regions.find(r => r.id === div.regionId);
            if (targetReg) {
              executeCombatEngagement(selectedDivision, targetReg);
            }
          }
        });

        markerLayersRef.current[div.id] = marker;
      });
    });
  }, [divisions, regions, selectedDivisionId, reachableRegionIds]);

  // Select Division Handler
  const handleSelectDivision = (div: NATODivision) => {
    playSound('click');
    if (selectedDivisionId === div.id) {
      setSelectedDivisionId(null);
      setSelectedRegionId(null);
    } else {
      setSelectedDivisionId(div.id);
      setSelectedRegionId(div.regionId);
      const reg = regions.find(r => r.id === div.regionId);
      addCombatLog(`🎯 Division Selected: ${div.name} at ${reg?.name || 'Sector'}. Reachable sectors highlighted.`);
    }
  };

  // Region Click Handler (Move or Attack)
  const handleRegionClick = (targetRegion: TheaterRegion) => {
    if (!selectedDivision) {
      setSelectedRegionId(targetRegion.id);
      return;
    }

    const currentReg = regions.find(r => r.id === selectedDivision.regionId);
    if (!currentReg) return;

    if (targetRegion.id === selectedDivision.regionId) {
      setSelectedDivisionId(null);
      return;
    }

    // Check reachability
    if (!reachableRegionIds.has(targetRegion.id)) {
      playSound('error');
      addCombatLog(`⚠️ INACCESSIBLE SECTOR: ${targetRegion.name} is not adjacent by land. Units must advance sector by sector.`);
      return;
    }

    const isFriendlyMove = targetRegion.controllerId === friendlySideId;

    if (isFriendlyMove) {
      // Friendly Maneuver / Movement
      executeFriendlyMovement(selectedDivision, targetRegion);
    } else {
      // Hostile Assault / Attack Engagement
      executeCombatEngagement(selectedDivision, targetRegion);
    }
  };

  // Friendly Movement Execution
  const executeFriendlyMovement = (div: NATODivision, targetRegion: TheaterRegion) => {
    playSound('click');
    
    setDivisions(prev => prev.map(d => {
      if (d.id === div.id) {
        return {
          ...d,
          regionId: targetRegion.id,
          entrenchment: Math.round(targetRegion.fortificationLevel * 10), // loses previous digging-in, rebuilds in new sector
          status: 'READY'
        };
      }
      return d;
    }));

    addCombatLog(`🏃 DIVISION REDEPLOYMENT: ${div.name} completed tactical road march to ${targetRegion.name}.`);
    setSelectedDivisionId(null);
    setSelectedRegionId(null);
  };

  // Combat Assault Execution
  const executeCombatEngagement = (attackerDiv: NATODivision, targetRegion: TheaterRegion) => {
    playSound('battle');

    // Find defenders in target region
    const defendingDivs = divisions.filter(d => d.regionId === targetRegion.id && d.side !== 'FRIENDLY');
    const totalDefSoldiers = defendingDivs.reduce((sum, d) => sum + d.manpower, 45000);
    const totalDefTanks = defendingDivs.reduce((sum, d) => sum + d.tanks, 80);
    const totalDefAircraft = defendingDivs.reduce((sum, d) => sum + d.aircraft, 20);

    const isAmphibious = !regions.find(r => r.id === attackerDiv.regionId)?.adjacentRegionIds.includes(targetRegion.id) && targetRegion.isPort;

    // Belligerent forces representation
    const attackerForces: CombatBelligerentForces = {
      id: attackerDiv.sideCountryId,
      name: attackerDiv.name,
      soldiers: attackerDiv.manpower,
      tanks: attackerDiv.tanks,
      aircraft: attackerDiv.aircraft + (airSuperiority > 50 ? 25 : 0),
      morale: attackerDiv.morale,
      supplyScore: attackerDiv.supplyScore,
      foreignAlliesBonus: airSuperiority > 60
    };

    const defenderForces: CombatBelligerentForces = {
      id: targetRegion.controllerId,
      name: `${targetRegion.name} Garrison & Hostile Formations`,
      soldiers: totalDefSoldiers,
      tanks: totalDefTanks,
      aircraft: totalDefAircraft,
      morale: 80,
      supplyScore: targetRegion.infrastructureLevel * 20
    };

    // Calculate deterministic combat resolution using force ratios & terrain
    const battleResult = resolveDeterministicFrontlineBattle(
      attackerForces,
      defenderForces,
      {
        id: targetRegion.id,
        name: targetRegion.name,
        controlledBy: targetRegion.controllerId,
        originalOwnerId: targetRegion.originalOwnerId,
        infrastructure: targetRegion.infrastructureLevel,
        seats: targetRegion.seats || 5,
        campaignLevel: 3,
        voterDistribution: {},
        supports: {}
      },
      targetRegion.terrain
    );

    // Show Battle Result Modal / Overlay
    setActiveBattleResult({
      result: battleResult,
      attackerDivision: attackerDiv,
      targetRegion,
      isAmphibious
    });

    // Update Region Controller in State & Persistent LocalStorage
    if (battleResult.captured) {
      setRegionController(targetRegion.id, friendlySideId);

      setRegions(prev => prev.map(r => {
        if (r.id === targetRegion.id) {
          return { ...r, controllerId: friendlySideId };
        }
        return r;
      }));

      // Attacker moves into captured region
      setDivisions(prev => prev.map(d => {
        if (d.id === attackerDiv.id) {
          return {
            ...d,
            regionId: targetRegion.id,
            manpower: Math.max(1000, d.manpower - battleResult.attackerLosses.soldiers),
            tanks: Math.max(0, d.tanks - battleResult.attackerLosses.tanks),
            aircraft: Math.max(0, d.aircraft - battleResult.attackerLosses.aircraft),
            entrenchment: 15,
            status: 'READY'
          };
        }
        // Defender division in this sector eliminated or retreated
        if (d.regionId === targetRegion.id && d.side !== 'FRIENDLY') {
          return {
            ...d,
            manpower: Math.max(0, d.manpower - battleResult.defenderLosses.soldiers),
            status: 'REORGANIZING'
          };
        }
        return d;
      }));

      // Check if all enemy sectors are captured
      const remainingEnemy = regions.filter(r => r.id !== targetRegion.id && r.controllerId !== friendlySideId);
      if (remainingEnemy.length === 0) {
        playSound('win');
        addCombatLog(`🏆 TOTAL THEATER VICTORY: All contested sectors liberated and hostile formations neutralized!`);
        if (onCeasefireOrVictory) onCeasefireOrVictory(true);
      }
    } else {
      // Repulsed or Stalemate: Attacker remains in origin region but suffers losses
      setDivisions(prev => prev.map(d => {
        if (d.id === attackerDiv.id) {
          return {
            ...d,
            manpower: Math.max(1000, d.manpower - battleResult.attackerLosses.soldiers),
            tanks: Math.max(0, d.tanks - battleResult.attackerLosses.tanks),
            aircraft: Math.max(0, d.aircraft - battleResult.attackerLosses.aircraft),
            morale: Math.max(20, d.morale - 12),
            status: 'REORGANIZING'
          };
        }
        return d;
      }));
    }

    // Update Persistent Casualty Stats
    setCasualtyStats(prev => ({
      ...prev,
      ownLosses: {
        soldiers: prev.ownLosses.soldiers + battleResult.attackerLosses.soldiers,
        soldiersThisTurn: battleResult.attackerLosses.soldiers,
        tanks: prev.ownLosses.tanks + battleResult.attackerLosses.tanks,
        tanksThisTurn: battleResult.attackerLosses.tanks,
        aircraft: prev.ownLosses.aircraft + battleResult.attackerLosses.aircraft,
        aircraftThisTurn: battleResult.attackerLosses.aircraft,
        artillery: prev.ownLosses.artillery + Math.round(battleResult.attackerLosses.tanks * 0.5),
        artilleryThisTurn: Math.round(battleResult.attackerLosses.tanks * 0.5)
      },
      enemyLosses: {
        soldiers: prev.enemyLosses.soldiers + battleResult.defenderLosses.soldiers,
        soldiersThisTurn: battleResult.defenderLosses.soldiers,
        tanks: prev.enemyLosses.tanks + battleResult.defenderLosses.tanks,
        tanksThisTurn: battleResult.defenderLosses.tanks,
        aircraft: prev.enemyLosses.aircraft + battleResult.defenderLosses.aircraft,
        aircraftThisTurn: battleResult.defenderLosses.aircraft,
        artillery: prev.enemyLosses.artillery + Math.round(battleResult.defenderLosses.tanks * 0.6),
        artilleryThisTurn: Math.round(battleResult.defenderLosses.tanks * 0.6)
      },
      territory: {
        capturedThisTurn: battleResult.captured ? 1 : 0,
        lostThisTurn: 0,
        totalCaptured: prev.territory.totalCaptured + (battleResult.captured ? 1 : 0),
        totalLost: prev.territory.totalLost
      }
    }));

    addCombatLog(battleResult.narrative);
    setSelectedDivisionId(null);
    setSelectedRegionId(null);

    if (onTerritoryChanged) {
      onTerritoryChanged();
    }
  };

  const addCombatLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev.slice(0, 20)]);
  };

  // Next Combat Turn Step / Air Strike Support
  const handleAdvanceCombatTurn = () => {
    playSound('click');
    setIsResolvingTurn(true);
    setTurnCounter(prev => prev + 1);

    // AI Counter-Maneuver Simulation (Deterministic enemy pressure on weak friendly borders)
    setTimeout(() => {
      const hostileDivs = divisions.filter(d => d.side !== 'FRIENDLY' && d.manpower > 5000);
      const friendlyRegions = regions.filter(r => r.controllerId === friendlySideId);

      if (hostileDivs.length > 0 && friendlyRegions.length > 0) {
        addCombatLog(`⏱️ TURN ${turnCounter + 1} ENGAGEMENT: Hostile artillery barrages and reconnaissance probes detected across active line of contact.`);
      }

      setIsResolvingTurn(false);
    }, 600);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans rounded-xl border border-slate-800 shadow-2xl">
      {/* Top Tactical Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-wide text-slate-100 uppercase font-mono">
                {conflictName || theaterData.conflictName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-900/60 text-red-300 border border-red-700/50 flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400 animate-pulse" /> ACTIVE LINE OF CONTACT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Drag divisions to adjacent sectors to attack or maneuver. Overseas landings utilize sealift transport ships.
            </p>
          </div>
        </div>

        {/* Action Controls & Turn Advancement */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            TURN: <span className="font-bold text-amber-400">WEEK {turnCounter}</span>
          </div>

          <button
            onClick={handleAdvanceCombatTurn}
            disabled={isResolvingTurn}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs font-mono rounded-lg shadow-lg border border-red-400/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResolvingTurn ? 'animate-spin' : ''}`} />
            {isResolvingTurn ? 'RESOLVING COMBAT...' : 'RESOLVE COMBAT TURN'}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-full min-h-[520px]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Unit Guidance Tooltip Overlay (Bottom Left) */}
        {selectedDivision && (
          <div className="absolute bottom-5 left-5 z-20 max-w-sm bg-slate-900/95 border-2 border-amber-500/70 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-400 text-sm">
                <Crosshair className="w-4 h-4 text-amber-400 animate-spin" />
                <span>SELECTED: {selectedDivision.name}</span>
              </div>
              <button 
                onClick={() => setSelectedDivisionId(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-300 font-mono space-y-1">
              <div className="flex justify-between">
                <span>Manpower / Strength:</span>
                <span className="font-bold text-slate-100">{selectedDivision.manpower.toLocaleString()} Troops</span>
              </div>
              <div className="flex justify-between">
                <span>Combat Equipment:</span>
                <span className="font-bold text-amber-300">{selectedDivision.tanks} Tanks • {selectedDivision.artillery} Artillery</span>
              </div>
              <div className="flex justify-between">
                <span>Entrenchment / Supply:</span>
                <span className="font-bold text-emerald-400">{selectedDivision.entrenchment}% Fortified</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-cyan-300 font-mono bg-cyan-950/40 p-2 rounded border border-cyan-800/40 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-cyan-400 animate-pulse" />
              <span>Click any highlighted sector on map to commit assault or redeploy.</span>
            </div>
          </div>
        )}

        {/* PERSISTENT LOSS & CASUALTY PANEL (TOP-RIGHT CORNER) */}
        <div className={`absolute top-4 right-4 z-20 transition-all duration-200 ${isStatsCollapsed ? 'w-auto' : 'w-80'} bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden font-mono`}>
          {/* Panel Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 border-b border-slate-700/80">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">THEATER LOSSES & CASUALTIES</span>
            </div>
            <button
              onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-700 cursor-pointer"
            >
              {isStatsCollapsed ? 'EXPAND' : 'COLLAPSE'}
            </button>
          </div>

          {!isStatsCollapsed && (
            <div className="p-3.5 space-y-3 text-xs">
              {/* Own Losses vs Enemy Losses Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Own Friendly Casualties */}
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40">
                  <div className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> OWN LOSSES
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-100">
                    {casualtyStats.ownLosses.soldiers.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">KIA</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                    <div>Tanks Lost: <span className="text-red-400 font-bold">{casualtyStats.ownLosses.tanks}</span></div>
                    <div>Aircraft: <span className="text-red-400 font-bold">{casualtyStats.ownLosses.aircraft}</span></div>
                    {casualtyStats.ownLosses.soldiersThisTurn > 0 && (
                      <div className="text-amber-400 font-bold">+{casualtyStats.ownLosses.soldiersThisTurn} this turn</div>
                    )}
                  </div>
                </div>

                {/* Enemy Losses */}
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40">
                  <div className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> ENEMY LOSSES
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-100">
                    {casualtyStats.enemyLosses.soldiers.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">KIA</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                    <div>Tanks Destroyed: <span className="text-emerald-400 font-bold">{casualtyStats.enemyLosses.tanks}</span></div>
                    <div>Aircraft: <span className="text-emerald-400 font-bold">{casualtyStats.enemyLosses.aircraft}</span></div>
                    {casualtyStats.enemyLosses.soldiersThisTurn > 0 && (
                      <div className="text-emerald-400 font-bold">+{casualtyStats.enemyLosses.soldiersThisTurn} eliminated</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Territory Control Progress Bar */}
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">TERRITORY CONTROL</span>
                  <span className="text-amber-400 font-bold">
                    {regions.filter(r => r.controllerId === friendlySideId).length} / {regions.length} Sectors
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full mt-1.5 overflow-hidden flex">
                  <div 
                    style={{ width: `${(regions.filter(r => r.controllerId === friendlySideId).length / regions.length) * 100}%` }}
                    className="h-full bg-blue-500 transition-all duration-300"
                  />
                  <div 
                    style={{ width: `${(regions.filter(r => r.controllerId !== friendlySideId).length / regions.length) * 100}%` }}
                    className="h-full bg-red-600 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Air Superiority & Naval Transport Capacity */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
                  <div className="text-slate-400 flex items-center gap-1"><Plane className="w-3 h-3 text-cyan-400" /> AIR SUPREMACY</div>
                  <div className="text-cyan-300 font-bold text-xs mt-0.5">{casualtyStats.airSuperiority}% Control</div>
                </div>
                <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
                  <div className="text-slate-400 flex items-center gap-1"><Ship className="w-3 h-3 text-emerald-400" /> SEALIFT TRANSPORTS</div>
                  <div className="text-emerald-300 font-bold text-xs mt-0.5">
                    {casualtyStats.transportShips.total - casualtyStats.transportShips.inUse} Ships Avail
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Combat Operational History Log (Bottom Center Bar) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-xl w-full px-4 pointer-events-none">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-2xl backdrop-blur-md pointer-events-auto max-h-24 overflow-y-auto font-mono text-xs space-y-1">
            {combatLog.slice(0, 3).map((log, idx) => (
              <div key={idx} className={`${idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMBAT ENGAGEMENT RESULT MODAL */}
      {activeBattleResult && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/70 max-w-lg w-full rounded-2xl p-6 shadow-2xl font-mono text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Swords className="w-6 h-6 text-red-400" />
                <h3 className="text-base font-bold uppercase tracking-wider text-slate-100">
                  {activeBattleResult.result.captured ? '🚩 SECTOR BREAKTHROUGH & CAPTURE' : '🛡️ TACTICAL DEFENSIVE STALEMATE'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveBattleResult(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                {activeBattleResult.result.narrative}
              </div>

              {/* Force Ratio Display */}
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">CALCULATED POWER RATIO</div>
                  <div className="text-lg font-bold text-amber-400">
                    {activeBattleResult.result.powerRatio} : 1.00
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-300">
                  <div>Attacker Power: <span className="font-bold text-blue-400">{activeBattleResult.result.attackerPower.toLocaleString()}</span></div>
                  <div>Defender Power: <span className="font-bold text-red-400">{activeBattleResult.result.defenderPower.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Immediate Casualties Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40">
                  <div className="font-bold text-blue-400">OUR LOSSES</div>
                  <div className="mt-1 space-y-0.5 text-slate-300 text-[11px]">
                    <div>🪖 {activeBattleResult.result.attackerLosses.soldiers.toLocaleString()} Troops</div>
                    <div>🛡️ {activeBattleResult.result.attackerLosses.tanks} Tanks</div>
                    <div>✈️ {activeBattleResult.result.attackerLosses.aircraft} Aircraft</div>
                  </div>
                </div>

                <div className="p-3 bg-red-950/40 rounded-xl border border-red-800/40">
                  <div className="font-bold text-red-400">ENEMY CASUALTIES</div>
                  <div className="mt-1 space-y-0.5 text-slate-300 text-[11px]">
                    <div>🪖 {activeBattleResult.result.defenderLosses.soldiers.toLocaleString()} Neutralized</div>
                    <div>🛡️ {activeBattleResult.result.defenderLosses.tanks} Tanks Destroyed</div>
                    <div>✈️ {activeBattleResult.result.defenderLosses.aircraft} Aircraft Downed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveBattleResult(null)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold font-mono text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                ACKNOWLEDGE COMBAT REPORT & RESUME COMMAND
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to get NATO symbol string
function getNATOSymbol(type: DivisionType): string {
  switch (type) {
    case 'INFANTRY': return '⚔️';
    case 'ARMORED': return '🛡️';
    case 'ARTILLERY': return '💥';
    case 'SPECOPS': return '⚡';
    case 'MARINE': return '⚓';
    case 'AIRBORNE': return '🪂';
  }
}

// Helper to get Terrain icon
function getTerrainIcon(terrain: string): string {
  switch (terrain) {
    case 'MOUNTAINS': return '⛰️';
    case 'URBAN': return '🏙️';
    case 'COAST': return '🏖️';
    case 'MARSH': return '🌊';
    case 'PLAINS': return '🌾';
    default: return '📍';
  }
}
