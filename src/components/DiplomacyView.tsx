import React, { useState, useEffect, useRef } from 'react';
import { Country, Party } from '../types';
import { countryColors, PLAYABLE_COUNTRIES } from '../constants/countries';
import { playSound } from '../lib/sounds';
import { Globe, Shield, Landmark, Sparkles, Heart, Scale, Users, Coins, AlertTriangle, Swords, Flame, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const countryCoords: Record<string, [number, number]> = {
  US: [38.0, -97.0],
  BR: [-14.235, -51.925],
  GB: [55.378, -3.436],
  DE: [51.165, 10.451],
  TR: [38.963, 35.243],
  EG: [26.820, 30.802],
  JP: [36.204, 138.252],
  CA: [56.130, -106.346],
  AR: [-38.416, -63.616],
  ZA: [-30.559, 22.937],
  IN: [20.593, 78.962],
  IT: [41.871, 12.567],
  ID: [-0.789, 113.921],
  MX: [23.634, -102.552],
  ES: [40.463, -3.749],
  KR: [35.907, 127.766],
  AU: [-25.274, 133.775]
};

interface DiplomacyViewProps {
  country: Country;
  party: Party;
  diplomaticRelations: Record<string, { status: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned'; opinion: number }>;
  onUpdateRelations: (updatedRelations: any) => void;
  treasury: number;
  onUpdateTreasury: (updatedTreasury: number) => void;
  influence: number;
  onUpdateInfluence: (updatedInfluence: number) => void;
  internationalReputation: number;
  onUpdateReputation: (updatedReputation: number) => void;
  publicApprovalImpact: (approvalChange: number) => void;
  darkMode: boolean;
}

export const DiplomacyView: React.FC<DiplomacyViewProps> = ({
  country,
  party,
  diplomaticRelations,
  onUpdateRelations,
  treasury,
  onUpdateTreasury,
  influence,
  onUpdateInfluence,
  internationalReputation,
  onUpdateReputation,
  publicApprovalImpact,
  darkMode,
}) => {
  const [mapMode, setMapMode] = useState<'RELATIONS' | 'WARS' | 'IDEOLOGY' | 'FREEDOM'>('RELATIONS');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [casusBelli, setCasusBelli] = useState<Record<string, boolean>>({});
  const [fundedRebels, setFundedRebels] = useState<Record<string, boolean>>({});

  const handleFundRebels = (targetId: string) => {
    const cost = 80000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Insufficient National Budget! Funding local rebel groups requires paying ₺/$/€ ${cost.toLocaleString()} covert operations cost.`);
      return;
    }
    
    onUpdateTreasury(treasury - cost);
    setFundedRebels(prev => ({ ...prev, [targetId]: true }));
    setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    
    const currentRelation = diplomaticRelations[targetId];
    if (currentRelation) {
      const updated = {
        ...diplomaticRelations,
        [targetId]: { ...currentRelation, opinion: Math.max(0, currentRelation.opinion - 35) }
      };
      onUpdateRelations(updated);
    }
    
    playSound('success');
    setSuccessMessage(`Covert rebel funding approved! Local unrest successfully increased in ${getCountryName(targetId)}, dropping their stability and opinion by 35, and fabricating a 100% valid Casus Belli!`);
    setErrorMessage(null);
  };

  // Available Bloc memberships
  const [activeBlocs, setActiveBlocs] = useState<{ economic: boolean; military: boolean; diplomatic: boolean }>({
    economic: false,
    military: false,
    diplomatic: false
  });

  // Selected country on the visual tactical world map
  const [selectedMapCountryId, setSelectedMapCountryId] = useState<string>(() => {
    const firstOther = Object.keys(diplomaticRelations).find(id => id !== country.id);
    return firstOther || 'TR';
  });

  const getPlayableCountryIdFromFeature = (feature: any): string | null => {
    if (!feature) return null;
    const id3 = feature.id || feature.properties?.iso_a3 || feature.properties?.adm0_a3;
    const id2 = feature.properties?.iso_a2 || feature.properties?.wb_a2;
    const name = (feature.properties?.name || '').toLowerCase();

    if (id2 && countryCoords[id2]) return id2;

    const a3ToA2: Record<string, string> = {
      USA: 'US', TUR: 'TR', DEU: 'DE', GBR: 'GB', EGY: 'EG', BRA: 'BR', JPN: 'JP',
      CAN: 'CA', ARG: 'AR', ZAF: 'ZA', IND: 'IN', ITA: 'IT', IDN: 'ID', MEX: 'MX',
      ESP: 'ES', KOR: 'KR', AUS: 'AU', FRA: 'FR', ROU: 'RO', HUN: 'HU'
    };
    if (id3 && a3ToA2[id3]) return a3ToA2[id3];

    if (name.includes('united states') || name.includes('america')) return 'US';
    if (name.includes('turkey') || name.includes('türkiye')) return 'TR';
    if (name.includes('germany') || name.includes('deutschland')) return 'DE';
    if (name.includes('united kingdom') || name.includes('britain') || name.includes('england')) return 'GB';
    if (name.includes('egypt')) return 'EG';
    if (name.includes('brazil') || name.includes('brasil')) return 'BR';
    if (name.includes('japan')) return 'JP';
    if (name.includes('canada')) return 'CA';
    if (name.includes('argentina')) return 'AR';
    if (name.includes('south africa')) return 'ZA';
    if (name.includes('india')) return 'IN';
    if (name.includes('italy')) return 'IT';
    if (name.includes('indonesia')) return 'ID';
    if (name.includes('mexico')) return 'MX';
    if (name.includes('spain')) return 'ES';
    if (name.includes('korea')) return 'KR';
    if (name.includes('australia')) return 'AU';
    if (name.includes('france')) return 'FR';
    if (name.includes('romania')) return 'RO';
    if (name.includes('hungary')) return 'HU';

    return null;
  };

  const getCountryColor = (cid: string) => {
    const scheme = countryColors[cid] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
    return scheme.default;
  };

  const getMapColor = (cid: string) => {
    if (mapMode === 'RELATIONS') {
      if (cid === country.id) return '#10b981'; // Our country
      const rel = diplomaticRelations[cid];
      if (rel) {
        if (rel.status === 'At War') return '#ef4444';
        if (rel.status === 'Alliance') return '#0ea5e9';
        if (rel.status === 'Defensive Pact') return '#3b82f6';
        if (rel.status === 'Sanctioned') return '#f59e0b';
        if (rel.status === 'Non-Aggression') return '#eab308';
        if (rel.opinion > 60) return '#4ade80';
        if (rel.opinion < 40) return '#f87171';
      }
      return countryColors[cid]?.default || '#94a3b8';
    }
    
    if (mapMode === 'IDEOLOGY') {
       const playCountry = PLAYABLE_COUNTRIES.find(c => c.id === cid);
       if (!playCountry) return '#94a3b8';
       const rulingIdeology = playCountry.rivals[0]?.ideology || '';
       if (rulingIdeology.includes('Social') || rulingIdeology.includes('Left') || rulingIdeology.includes('Marxist')) return '#ef4444';
       if (rulingIdeology.includes('Conservative') || rulingIdeology.includes('Right') || rulingIdeology.includes('Nationalist')) return '#1e3a8a';
       if (rulingIdeology.includes('Liberal') || rulingIdeology.includes('Centrist') || rulingIdeology.includes('Democrat')) return '#facc15';
       if (rulingIdeology.includes('Green') || rulingIdeology.includes('Ecologist')) return '#22c55e';
       return '#6366f1';
    }

    if (mapMode === 'FREEDOM') {
      let hash = 0;
      for (let i = 0; i < cid.length; i++) hash = cid.charCodeAt(i) + ((hash << 5) - hash);
      const freedom = 30 + (Math.abs(hash) % 65);
      // Optional: Use actual freedom index if it's the player's country
      // if (cid === country.id) freedom = freedomIndex;
      if (freedom > 80) return '#22c55e';
      if (freedom > 50) return '#eab308';
      return '#ef4444';
    }

    return getCountryColor(cid);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [worldGeoJsonData, setWorldGeoJsonData] = useState<any>(null);
  const worldBgLayerRef = useRef<any>(null);
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json")
      .then(res => res.json())
      .then(data => setWorldGeoJsonData(data))
      .catch(err => console.error("Failed to load world geojson", err));
  }, []);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const terrainLayerRef = useRef<L.TileLayer | null>(null);
  const oceanLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      try { map.stop(); map.off(); map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      terrainLayerRef.current = null;
      oceanLayerRef.current = null;
      markersRef.current = null;
      worldBgLayerRef.current = null;
    }
  };

  useEffect(() => {
    if (worldBgLayerRef.current) {
      worldBgLayerRef.current.setStyle((feature: any) => {
        const cid = getPlayableCountryIdFromFeature(feature);
        const id3 = String(feature?.id || feature?.properties?.ISO_A3 || feature?.properties?.iso_a3 || '').toUpperCase();
        const name = String(feature?.properties?.name || feature?.properties?.NAME || '').toUpperCase();
        const isAtWar = ['UKR', 'RUS', 'ISR', 'PSE'].includes(id3) || name === 'PALESTINE' || name === 'ISRAEL' || name === 'UKRAINE' || name === 'RUSSIA';

        if (cid) {
          const isSelected = selectedMapCountryId === cid;
          const fillColor = getMapColor(cid);
          
          if (mapMode === 'WARS' && isAtWar) {
            return {
              fillColor: '#ef4444',
              color: isSelected ? "#ffffff" : "#ffffff",
              weight: isSelected ? 2.5 : 1.2,
              opacity: 1.0,
              fillOpacity: isSelected ? 0.92 : 0.72,
              interactive: true
            };
          }
          
          return {
            fillColor: fillColor,
            color: isSelected ? "#ffffff" : "#ffffff",
            weight: isSelected ? 2.5 : 1.2,
            opacity: 1.0,
            fillOpacity: isSelected ? 0.92 : 0.72,
            interactive: true
          };
        }
        
        const baseFill = (mapMode === 'WARS' && isAtWar) ? '#ef4444' : (darkMode ? "#1e293b" : "#e2e8f0");
        const borderColor = (mapMode === 'WARS' && isAtWar) ? (darkMode ? '#7f1d1d' : '#f87171') : (darkMode ? "#0f172a" : "#cbd5e1");
        return { fillColor: baseFill, color: borderColor, weight: (mapMode === 'WARS' && isAtWar) ? 1.5 : 0.8, opacity: 1.0, fillOpacity: (mapMode === 'WARS' && isAtWar) ? 0.6 : 0.5, interactive: false };
      });
    }
  }, [mapMode, darkMode, selectedMapCountryId, diplomaticRelations]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.0, 0.0],
        zoom: 1.8,
        minZoom: 2.0,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: false,
        maxBounds: [[-85, -180], [85, 180]],
        maxBoundsViscosity: 1.0,
        worldCopyJump: false
      });

      const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

      const tiles = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 18,
        maxNativeZoom: 10,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        className: 'base-map-tile'
      }).addTo(map);
      
      tileLayerRef.current = tiles;

      const terrainPane = map.createPane('terrainPane');
      terrainPane.style.zIndex = '450';
      terrainPane.style.pointerEvents = 'none';
      terrainPane.style.mixBlendMode = 'overlay';

      const terrainUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}';
      const terrain = L.tileLayer(terrainUrl, {
        opacity: darkMode ? 0.35 : 0.35,
        maxZoom: 18,
        maxNativeZoom: 10,
        noWrap: true,
        bounds: [[-85, -180], [85, 180]],
        pane: 'terrainPane',
        className: darkMode ? 'terrain-tile-dark' : 'terrain-tile'
      }).addTo(map);
      terrainLayerRef.current = terrain;
      if (worldGeoJsonData) {
        worldBgLayerRef.current = L.geoJSON(worldGeoJsonData, {
          style: (feature) => {
            const cid = getPlayableCountryIdFromFeature(feature);
            const id3 = String(feature?.id || feature?.properties?.ISO_A3 || feature?.properties?.iso_a3 || '').toUpperCase();
            const name = String(feature?.properties?.name || feature?.properties?.NAME || '').toUpperCase();
            const isAtWar = ['UKR', 'RUS', 'ISR', 'PSE'].includes(id3) || name === 'PALESTINE' || name === 'ISRAEL' || name === 'UKRAINE' || name === 'RUSSIA';

            if (cid) {
              const isSelected = selectedMapCountryId === cid;
              const fillColor = getMapColor(cid);
              return {
                fillColor: fillColor,
                color: isSelected ? "#ffffff" : "#ffffff",
                weight: isSelected ? 2.5 : 1.2,
                opacity: 1.0,
                fillOpacity: isSelected ? 0.92 : 0.72,
                interactive: true
              };
            }
            
            const baseFill = (mapMode === 'WARS' && isAtWar) ? '#ef4444' : (darkMode ? "#1e293b" : "#e2e8f0");
            const borderColor = (mapMode === 'WARS' && isAtWar) ? (darkMode ? '#7f1d1d' : '#f87171') : (darkMode ? "#0f172a" : "#cbd5e1");
            return { fillColor: baseFill, color: borderColor, weight: (mapMode === 'WARS' && isAtWar) ? 1.5 : 0.8, opacity: 1.0, fillOpacity: (mapMode === 'WARS' && isAtWar) ? 0.6 : 0.5, interactive: false };
          },
          onEachFeature: (feature, layer) => {
            const cid = getPlayableCountryIdFromFeature(feature);
            if (cid) {
              const cName = getCountryName(cid);
              layer.bindTooltip(`
                <div style="font-family: sans-serif; font-weight: bold; font-size: 11px; padding: 2px 4px;">
                  <b>${cName}</b> (${cid})
                  <br/><span style="font-size: 9px; color: #94a3b8;">Click to open diplomatic actions</span>
                </div>
              `, { direction: 'top', opacity: 0.95 });

              layer.on('click', () => {
                playSound('click');
                setSelectedMapCountryId(cid);
              });
            }
          }
        }).addTo(map);
      }

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current && mapInstanceRef.current) {
      tileLayerRef.current.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}');
      
      if (terrainLayerRef.current) {
        terrainLayerRef.current.setOpacity(darkMode ? 0.28 : 0.35);
        const pane = mapInstanceRef.current.getPane('terrainPane');
        if (pane) pane.style.mixBlendMode = 'overlay';
        
        const terrainImg = terrainLayerRef.current.getContainer();
        if (terrainImg) {
          if (darkMode) {
            terrainImg.classList.remove('terrain-tile');
            terrainImg.classList.add('terrain-tile-dark');
          } else {
            terrainImg.classList.remove('terrain-tile-dark');
            terrainImg.classList.add('terrain-tile');
          }
        }
      }
    }

    return () => cleanupMap();
  }, [darkMode, worldGeoJsonData]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw connections from our HQ (player country) to all other countries
    const playerCoords = countryCoords[country.id] || [38.963, 35.243];
    
    Object.entries(countryCoords).forEach(([id, coords]) => {
      if (id === country.id) return;
      
      const rel = diplomaticRelations[id];
      if (!rel) return;

      const strokeColor = rel.status === 'At War' ? '#ef4444' : 
                          rel.status === 'Alliance' ? '#10b981' : 
                          rel.status === 'Defensive Pact' ? '#06b6d4' :
                          'rgba(99, 102, 241, 0.2)';
      const isDashed = rel.status !== 'Alliance' && rel.status !== 'At War';

      const polyline = L.polyline([playerCoords, coords], {
        color: strokeColor,
        weight: rel.status === 'At War' || rel.status === 'Alliance' ? 2 : 1,
        dashArray: isDashed ? '4, 4' : undefined,
        opacity: 0.65
      });
      polyline.addTo(markersGroup);
    });

    // 2. Add marker nodes for each playable country
    Object.entries(countryCoords).forEach(([id, coords]) => {
      const isSelf = id === country.id;
      const rel = diplomaticRelations[id];
      const isSelected = selectedMapCountryId === id;

      let color = '#64748b'; // Neutral
      if (isSelf) {
        color = '#3b82f6'; // Bright Blue HQ
      } else if (rel) {
        if (rel.status === 'At War') color = '#ef4444';
        else if (rel.status === 'Alliance') color = '#10b981';
        else if (rel.status === 'Defensive Pact') color = '#06b6d4';
        else if (rel.status === 'Sanctioned') color = '#f59e0b';
        else if (rel.status === 'Non-Aggression') color = '#eab308';
      }

      const name = getCountryName(id);

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          ${isSelected ? `
            <div style="position: absolute; width: 38px; height: 38px; border: 2px dashed ${color}; border-radius: 50%; animation: spin 8s linear infinite;"></div>
          ` : ''}
          <div style="
            position: absolute; 
            width: 28px; 
            height: 28px; 
            background: ${darkMode ? '#0f172a' : '#ffffff'}; 
            border: 2.5px solid ${color}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 0 10px ${color}a0;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="font-size: 11px; font-weight: 900; font-family: monospace; color: ${color};">${id}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-diplomacy-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(coords, { icon: customIcon });

      marker.bindTooltip(`
        <div style="font-family: sans-serif; padding: 2px 4px;">
          <b style="font-size: 11px;"><span style="color: ${color}">[${id}]</span> ${name}</b>
          ${isSelf ? '<br/><i style="font-size: 9px; color: #3b82f6;">Your Sovereign HQ</i>' : `
            <br/><span style="font-size: 9px; color: #64748b;">Opinion: <b>${rel?.opinion || 50}/100</b></span>
            <br/><span style="font-size: 9px; color: #64748b;">Status: <b>${rel?.status || 'Neutral'}</b></span>
          `}
        </div>
      `, {
        direction: 'top',
        opacity: 0.95
      });

      marker.on('click', () => {
        if (isSelf) {
          playSound('click');
          setSuccessMessage(`Sovereign Headquarters: ${name} is your ruling nation! Select other global nations on the map to manage diplomacy.`);
          setErrorMessage(null);
        } else {
          playSound('click');
          setSelectedMapCountryId(id);
        }
      });

      marker.addTo(markersGroup);
    });
  }, [diplomaticRelations, selectedMapCountryId, country.id, darkMode]);

  // Current active global conflict
  const [globalConflict, setGlobalConflict] = useState<{
    countryA: string;
    countryB: string;
    description: string;
    resolved: boolean;
    stance?: 'Neutral' | 'Diplomatic' | 'Military';
  }>(() => {
    const conflictPool = [
      {
        countryA: 'TR',
        countryB: 'EG',
        description: 'Eastern Mediterranean natural gas exploration rights and maritime boundary tensions.'
      },
      {
        countryA: 'US',
        countryB: 'DE',
        description: 'NATO military spending and automotive trade tariff tensions.'
      },
      {
        countryA: 'GB',
        countryB: 'DE',
        description: 'North Sea fishing quotas and trade restrictions dispute.'
      },
      {
        countryA: 'US',
        countryB: 'JP',
        description: 'Semiconductor chip production sharing and tech export blockades competition.'
      },
      {
        countryA: 'BR',
        countryB: 'US',
        description: 'Amazon basin environmental regulations and agricultural food import tariffs tension.'
      },
      {
        countryA: 'EG',
        countryB: 'GB',
        description: 'Suez Canal cargo transit fees and historical artifact return lawsuit dispute.'
      }
    ];

    // Pick a conflict that does not include the player's own nation if possible
    const available = conflictPool.filter(c => c.countryA !== country.id && c.countryB !== country.id);
    const chosen = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : conflictPool[0];

    return {
      countryA: chosen.countryA,
      countryB: chosen.countryB,
      description: chosen.description,
      resolved: false
    };
  });

  const getCountryName = (id: string) => {
    const list: Record<string, string> = {
      US: 'United States',
      BR: 'Brazil',
      GB: 'United Kingdom',
      DE: 'Germany',
      TR: 'Turkey',
      EG: 'Egypt',
      JP: 'Japan',
      CA: 'Canada',
      AR: 'Argentina',
      ZA: 'South Africa',
      IN: 'India',
      IT: 'Italy',
      ID: 'Indonesia',
      MX: 'Mexico',
      ES: 'Spain',
      KR: 'South Korea',
      AU: 'Australia'
    };
    return list[id] || id;
  };

  const getCountryFlag = (id: string) => {
    const list: Record<string, string> = {
      US: '🇺🇸',
      BR: '🇧🇷',
      GB: '🇬🇧',
      DE: '🇩🇪',
      TR: '🇹🇷',
      EG: '🇪🇬',
      JP: '🇯🇵',
      CA: '🇨🇦',
      AR: '🇦🇷',
      ZA: '🇿🇦',
      IN: '🇮🇳',
      IT: '🇮🇹',
      ID: '🇮🇩',
      MX: '🇲🇽',
      ES: '🇪🇸',
      KR: '🇰🇷',
      AU: '🇦🇺'
    };
    return list[id] || '🌐';
  };

  // Treaty signing mechanics
  const handleSignTreaty = (targetId: string, type: 'Alliance' | 'Defensive Pact' | 'Non-Aggression') => {
    const currentRelation = diplomaticRelations[targetId];
    if (!currentRelation) return;

    let requiredOpinion = 40;
    let requiredInfluence = 10;
    let costTreasury = 5000;

    if (type === 'Defensive Pact') {
      requiredOpinion = 65;
      requiredInfluence = 25;
      costTreasury = 15000;
    } else if (type === 'Alliance') {
      requiredOpinion = 85;
      requiredInfluence = 50;
      costTreasury = 35000;
    }

    if (currentRelation.opinion < requiredOpinion) {
      playSound('error');
      setErrorMessage(`Failed to sign treaty with ${getCountryName(targetId)}! They require at least ${requiredOpinion} bilateral opinion of your country (Current: ${currentRelation.opinion}).`);
      setSuccessMessage(null);
      return;
    }

    if (influence < requiredInfluence) {
      playSound('error');
      setErrorMessage(`Insufficient Political Influence! Signing this treaty requires ${requiredInfluence} Influence points.`);
      setSuccessMessage(null);
      return;
    }

    if (treasury < costTreasury) {
      playSound('error');
      setErrorMessage(`Insufficient National Budget! Signing this treaty requires paying diplomatic protocol fees of ₺/$/€ ${costTreasury.toLocaleString()}.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateInfluence(influence - requiredInfluence);
    onUpdateTreasury(treasury - costTreasury);
    onUpdateReputation(Math.min(100, internationalReputation + (type === 'Alliance' ? 10 : 5)));

    // Boost domestic approval slightly for strong leadership abroad
    publicApprovalImpact(type === 'Alliance' ? 4 : 2);

    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: type, opinion: Math.min(100, currentRelation.opinion + 15) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Bilateral treaty successfully signed! ${getCountryName(targetId)} is now in a state of ${type} with your government.`);
    setErrorMessage(null);
  };

  const handleSendGift = (targetId: string) => {
    const giftCost = 20000;
    if (treasury < giftCost) {
      playSound('error');
      setErrorMessage(`Insufficient Treasury! Sending a diplomatic aid gift requires ₺/$/€ ${giftCost.toLocaleString()}.`);
      return;
    }
    const rel = diplomaticRelations[targetId];
    if (!rel) return;

    onUpdateTreasury(treasury - giftCost);
    const updatedOpinion = Math.min(100, rel.opinion + 18);
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, opinion: updatedOpinion }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Diplomatic aid package delivered to ${getCountryName(targetId)}! Bilateral opinion increased by +18.`);
    setErrorMessage(null);
  };

  const handleCeasefire = (targetId: string) => {
    const rel = diplomaticRelations[targetId];
    if (!rel || rel.status !== 'At War') return;
    const cost = 30000;
    if (treasury < cost) {
      playSound('error');
      setErrorMessage(`Ceasefire Protocol rejected! Paying war reparations & peace negotiations requires ₺/$/€ ${cost.toLocaleString()}.`);
      return;
    }

    onUpdateTreasury(treasury - cost);
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...rel, status: 'Neutral' as const, opinion: 35 }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`PEACE TREATY SIGNED! Hostilities with ${getCountryName(targetId)} have officially ended. Relations restored to Neutral.`);
    setErrorMessage(null);
  };

  // Hostile action handlers
  const handleHostileAction = (targetId: string, action: 'Sanction' | 'Embargo' | 'Sever Relations' | 'Declare War') => {
    const currentRelation = diplomaticRelations[targetId];
    if (!currentRelation) return;

    if (action === 'Declare War') {
      // Must have casus belli
      const hasCB = casusBelli[targetId];
      if (!hasCB) {
        playSound('error');
        setErrorMessage(`Declaration of War rejected! You do not have a valid Casus Belli (Justification of War) against ${getCountryName(targetId)}. Sanction or Embargo them first to fabricate justification.`);
        setSuccessMessage(null);
        return;
      }

      onUpdateReputation(Math.max(5, internationalReputation - 40));
      publicApprovalImpact(-10); // War triggers public anti-war protests, drops approval by 10%

      const updated = {
        ...diplomaticRelations,
        [targetId]: { ...currentRelation, status: 'At War' as const, opinion: 0 }
      };
      onUpdateRelations(updated);
      playSound('error');
      setSuccessMessage(`WAR HAS BEEN DECLARED! You have mobilized the military command structure against ${getCountryName(targetId)}. Prepare defenses immediately!`);
      setErrorMessage(null);
      return;
    }

    // Sanction/Embargo/Sever
    let opDrop = 25;
    let repChange = -5;
    let updatedStatus: 'Alliance' | 'Defensive Pact' | 'Non-Aggression' | 'Neutral' | 'At War' | 'Sanctioned' = 'Neutral';

    if (action === 'Sanction') {
      opDrop = 30;
      repChange = -8;
      updatedStatus = 'Sanctioned';
      // Fabricate Casus Belli on 50% chance
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Embargo') {
      opDrop = 45;
      repChange = -15;
      updatedStatus = 'Sanctioned'; // also embargoed
      setCasusBelli(prev => ({ ...prev, [targetId]: true }));
    } else if (action === 'Sever Relations') {
      opDrop = 60;
      repChange = -10;
      updatedStatus = 'Neutral';
    }

    onUpdateReputation(Math.max(10, internationalReputation + repChange));
    const updated = {
      ...diplomaticRelations,
      [targetId]: { ...currentRelation, status: updatedStatus, opinion: Math.max(0, currentRelation.opinion - opDrop) }
    };
    onUpdateRelations(updated);
    playSound('success');
    setSuccessMessage(`Hostile Action [${action}] executed against ${getCountryName(targetId)}. Relations severed, trade halted, and Casus Belli has been secured!`);
    setErrorMessage(null);
  };

  // Coalition blocs creation
  const handleJoinBloc = (type: 'economic' | 'military' | 'diplomatic') => {
    let cost = 30;
    if (type === 'military') cost = 40;
    if (type === 'diplomatic') cost = 25;

    if (influence < cost) {
      playSound('error');
      setErrorMessage(`Insufficient Political Influence! Forming a coalition Bloc requires ${cost} Influence.`);
      setSuccessMessage(null);
      return;
    }

    onUpdateInfluence(influence - cost);
    setActiveBlocs(prev => ({ ...prev, [type]: true }));

    if (type === 'economic') {
      onUpdateTreasury(treasury + 50000); // sign on cash
    } else if (type === 'diplomatic') {
      onUpdateReputation(Math.min(100, internationalReputation + 15));
    }

    playSound('success');
    setSuccessMessage(`Successfully established the multinational ${type.toUpperCase()} BLOC! You have solidified your global leadership.`);
    setErrorMessage(null);
  };

  // Stance in third-party wars
  const handleStance = (stance: 'Neutral' | 'Diplomatic' | 'Military') => {
    if (globalConflict.resolved) return;

    if (stance === 'Military') {
      const mobilizeCost = 50000;
      if (treasury < mobilizeCost) {
        playSound('error');
        setErrorMessage(`Insufficient National Budget treasury to intervene militarily! MOBILIZATION requires paying ${mobilizeCost.toLocaleString()} immediate expeditionary deployment costs.`);
        return;
      }
      onUpdateTreasury(treasury - mobilizeCost);
      onUpdateReputation(Math.min(100, internationalReputation + 12));
      publicApprovalImpact(-3); // moderate intervention resistance
    }

    setGlobalConflict(prev => ({ ...prev, stance, resolved: true }));
    playSound('success');
    setSuccessMessage(`Stance locked! Your strategic stance of [${stance} Support] in the ${getCountryName(globalConflict.countryA)} vs. ${getCountryName(globalConflict.countryB)} dispute has been broadcasted globally.`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 animate-fade-in flex flex-col gap-6">
      
      {/* Diplomacy Header */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        darkMode ? 'bg-slate-900/50 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest font-mono text-indigo-400 font-bold uppercase">MINISTRY OF FOREIGN AFFAIRS</span>
            <h2 className="text-xl font-black tracking-tight mt-0.5">International Diplomacy & Blocs</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign treaties, form global alliances, join supranational military/economic blocs, or mobilize defenses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-400">REPUTATION</span>
            <span className="text-xl font-black text-indigo-400">{internationalReputation}/100</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-400">INFLUENCE</span>
            <span className="text-xl font-black text-cyan-400">{influence} PTS</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Playable Countries Diplomacy Panel (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Schematic Tactical World Map */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
              <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400 animate-pulse" />
                TACTICAL OPERATIONS MAP
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => { playSound('click'); setMapMode('RELATIONS'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'RELATIONS' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Globe className="w-3 h-3" /> RELATIONS
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('IDEOLOGY'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'IDEOLOGY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Shield className="w-3 h-3" /> IDEOLOGY
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('FREEDOM'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'FREEDOM' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Scale className="w-3 h-3" /> FREEDOM
                </button>
                <button 
                  onClick={() => { playSound('click'); setMapMode('WARS'); }}
                  className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 hover:opacity-80 ${mapMode === 'WARS' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'border-slate-700/50 text-slate-500'}`}
                >
                  <Swords className="w-3 h-3" /> WARS
                </button>
              </div>
            </div>

            {/* Interactive Leaflet World Map */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg min-h-[380px] h-[380px] z-10 bg-slate-950">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
              
              {/* Active Conflicts Legend */}
              {mapMode === 'WARS' && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <div className="px-3 py-2 rounded-xl border flex flex-col gap-1.5 shadow-lg backdrop-blur-md bg-slate-900/80 border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Global Conflicts
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      <div className="text-[9px] font-bold text-red-500">RU ⚔️ UA</div>
                      <div className="text-[9px] font-bold text-red-500">IL ⚔️ PS</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                 <div className="bg-slate-900/95 backdrop-blur border border-slate-700/50 p-3 rounded-xl shadow-xl flex flex-col gap-1">
                   <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-400 font-bold" /> Co-Op GIS Operations Map</span>
                   <span className="text-[10px] text-slate-400 max-w-xs">Click on any Country Hub Node to manage bilateral foreign actions and defense treaties.</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Active Focused Diplomatic Controls Card */}
          {(() => {
            const id = selectedMapCountryId;
            const rel = diplomaticRelations[id];
            if (!rel) return null;
            const hasCB = casusBelli[id];

            return (
              <div className={`p-6 rounded-3xl border flex flex-col gap-5 ${
                rel.status === 'At War'
                  ? 'bg-rose-950/10 border-rose-500/30'
                  : rel.status === 'Alliance'
                  ? 'bg-indigo-950/10 border-indigo-500/20'
                  : darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Nation Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-500/10 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{getCountryFlag(id)}</span>
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-100 uppercase tracking-tight flex items-center gap-2">
                        {getCountryName(id)}
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          rel.status === 'At War' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                          rel.status === 'Alliance' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          rel.status === 'Defensive Pact' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                        }`}>
                          {rel.status === 'At War' ? 'At War' : 
                           rel.status === 'Alliance' ? 'Alliance' :
                           rel.status === 'Defensive Pact' ? 'Defense Pact' :
                           rel.status === 'Sanctioned' ? 'Sanctioned' :
                           rel.status === 'Non-Aggression' ? 'Non-Aggression' : 'Neutral'}
                        </span>
                      </h4>
                      <div className="flex items-center gap-3.5 mt-1">
                        <span className="text-xs text-slate-400 font-mono">
                          Bilateral Opinion: <strong className="text-indigo-400 font-bold">{rel.opinion}/100</strong>
                        </span>
                        {hasCB && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                            <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> Casus Belli Secured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual Opinion Bar */}
                  <div className="w-full sm:w-40 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                      <span>Bilateral Mood</span>
                      <span className={rel.opinion > 70 ? 'text-emerald-400' : rel.opinion < 35 ? 'text-rose-400' : 'text-slate-300'}>
                        {rel.opinion > 70 ? 'Friendly' : rel.opinion < 35 ? 'Hostile' : 'Wary'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/30 overflow-hidden border border-slate-500/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          rel.opinion > 70 ? 'bg-emerald-500' : rel.opinion < 35 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${rel.opinion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Diplomacy Movement Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pacifist Treaties & Alliances */}
                  <div className="p-4 rounded-2xl bg-black/15 border border-slate-500/5 flex flex-col gap-3">
                    <h5 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> BARIŞÇIL ANLAŞMALAR • PEACEMAKING
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Establish friendly coalitions, guarantee non-aggression, or form defensive networks. Friendly actions require high bilateral opinions and diplomatic soft power.
                    </p>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <button
                        onClick={() => handleSignTreaty(id, 'Non-Aggression')}
                        disabled={rel.status !== 'Neutral'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Neutral'
                            ? 'bg-slate-800 hover:bg-slate-755 text-slate-200 border-slate-700 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Non-Aggression Pact</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Opinion ≥40</span>
                      </button>

                      <button
                        onClick={() => handleSignTreaty(id, 'Defensive Pact')}
                        disabled={rel.status !== 'Non-Aggression'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Non-Aggression'
                            ? 'bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border-cyan-500/20 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Defense Pact</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Opinion ≥65</span>
                      </button>

                      <button
                        onClick={() => handleSignTreaty(id, 'Alliance')}
                        disabled={rel.status !== 'Defensive Pact'}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs border cursor-pointer transition-all flex items-center justify-between px-3 ${
                          rel.status === 'Defensive Pact'
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/20 hover:scale-[1.01]'
                            : 'opacity-50 pointer-events-none text-slate-500 border-transparent bg-slate-900/45'
                        }`}
                      >
                        <span>Form Alliance</span>
                        <span className="text-[10px] font-mono text-indigo-200 font-bold">Opinion ≥85</span>
                      </button>

                      <button
                        onClick={() => handleSendGift(id)}
                        disabled={rel.status === 'At War'}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-between px-3"
                      >
                        <span>Send Aid Gift</span>
                        <span className="text-[10px] font-mono text-emerald-300 font-bold">+18 Op (20k ₺)</span>
                      </button>

                      {rel.status === 'At War' && (
                        <button
                          onClick={() => handleCeasefire(id)}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all flex items-center justify-between px-3 shadow-md shadow-amber-500/20 uppercase tracking-wide"
                        >
                          <span>Ceasefire & Peace Treaty</span>
                          <span className="text-[10px] font-mono font-bold">30k ₺</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hostile & Aggressive Actions */}
                  <div className="p-4 rounded-2xl bg-black/15 border border-slate-500/5 flex flex-col gap-3">
                    <h5 className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> HOSTILITIES
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Isolate hostile nations, block commercial fleets, fund local rebel groups covertly, or declare active armed mobilization against rival economies.
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleHostileAction(id, 'Sanction')}
                          disabled={rel.status === 'At War'}
                          className="py-2.5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                        >
                          Sanction
                        </button>
                        <button
                          onClick={() => handleHostileAction(id, 'Embargo')}
                          disabled={rel.status === 'At War'}
                          className="py-2.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all"
                        >
                          Ambargo / Embargo
                        </button>
                      </div>

                      <button
                        onClick={() => handleFundRebels(id)}
                        disabled={rel.status === 'At War'}
                        className="w-full py-2.5 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <span>Fund Local Rebels</span>
                        <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full uppercase">
                          Costs 80k
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Global Blocs & Supranational Integration (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Supranational Blocs */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4.5 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 pb-2 border-b border-slate-500/10 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> COALITION BLOCS
            </h3>

            {[
              { type: 'economic' as const, title: 'Supranational Trade Bloc', desc: 'Accelerates free trade agreements, boosting state treasury output on future turns.', influence: 30 },
              { type: 'military' as const, title: 'Joint Defensive Alliance', desc: 'Mitigates civil wars & guarantees mutual aid. Boosts defense stats.', influence: 40 },
              { type: 'diplomatic' as const, title: ' Supranational Council', desc: 'Maximizes global reputation, amplifying soft power & diplomatic treaty speeds.', influence: 25 },
            ].map((bloc) => {
              const joined = activeBlocs[bloc.type];

              return (
                <div
                  key={bloc.type}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 ${
                    joined
                      ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-black/15 border-slate-500/5'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-100 flex justify-between items-center">
                      <span>{bloc.title}</span>
                      {joined && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">JOINED</span>}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {bloc.desc}
                    </p>
                  </div>

                  {!joined && (
                    <button
                      type="button"
                      onClick={() => handleJoinBloc(bloc.type)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow transition-all"
                    >
                      Establish Bloc (-{bloc.influence} Influence)
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Third-Party Conflict Watch */}
          <div className={`p-5 rounded-3xl border flex flex-col gap-4 ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-400 pb-2 border-b border-slate-500/10 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-rose-400" /> GLOBAL CONFLICT RADAR
            </h3>

            <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-2xl text-xs">
              <div className="flex justify-between items-center font-bold text-slate-200">
                <span className="flex items-center gap-1">
                  {getCountryFlag(globalConflict.countryA)} vs {getCountryFlag(globalConflict.countryB)}
                </span>
                <span className="text-[10px] text-rose-500 font-mono animate-pulse uppercase">Wartime Stance Req</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                {globalConflict.description}
              </p>

              {!globalConflict.resolved ? (
                <div className="grid grid-cols-3 gap-1.5 mt-3.5 pt-3.5 border-t border-slate-500/10">
                  <button
                    onClick={() => handleStance('Neutral')}
                    className="py-2 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Stay Neutral
                  </button>
                  <button
                    onClick={() => handleStance('Diplomatic')}
                    className="py-2 bg-cyan-650 hover:bg-cyan-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Diplomatic Aid
                  </button>
                  <button
                    onClick={() => handleStance('Military')}
                    className="py-2 bg-rose-650 hover:bg-rose-600 text-white font-extrabold text-[10px] rounded-xl cursor-pointer"
                  >
                    Intervene militarily
                  </button>
                </div>
              ) : (
                <div className="mt-3 bg-black/25 p-2 rounded-xl border border-slate-500/5 text-center font-bold text-[10px] text-emerald-400 uppercase font-mono tracking-wide">
                  Stance Locked: {globalConflict.stance}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
