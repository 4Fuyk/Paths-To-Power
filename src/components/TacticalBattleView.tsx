import React, { useState, useEffect, useRef } from 'react';
import { Shield, Swords, Users, Trophy, AlertTriangle, Compass, Heart, Award, Map as MapIcon } from 'lucide-react';
import { normalizeName, getRegionIdFromNormalizedName, getFeatureName } from '../utils/mapUtils';
import { Country } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionUnit {
  regionId: string;
  type: 'loyal' | 'rebel' | 'contested';
  hp: number;
  maxHp: number;
}

interface TacticalBattleViewProps {
  country: Country;
  party: { name: string };
  darkMode: boolean;
  onBattleFinished: (success: boolean) => void;
}

export const TacticalBattleView: React.FC<TacticalBattleViewProps> = ({
  country,
  party,
  darkMode,
  onBattleFinished
}) => {
  const [regionStatus, setRegionStatus] = useState<Record<string, RegionUnit>>({});
  const [battleLogs, setBattleLogs] = useState<string[]>(['The conflict has begun! Rebel forces have captured several regions. Select a rebel-controlled region to deploy the military and attack.']);
  const [mapMode, setMapMode] = useState<'GIS' | 'CARDS'>(
    (country.id === 'TR' || country.id === 'DE' || country.id === 'US' || country.id === 'BR' || country.id === 'JP' || country.id === 'EG' || country.id === 'GB') ? 'GIS' : 'CARDS'
  );
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const armyMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const regionCentersRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const regionStatusRef = useRef<Record<string, RegionUnit>>({});
  
  useEffect(() => {
    regionStatusRef.current = regionStatus;
  }, [regionStatus]);
  
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      try {
        const container = map.getContainer() as any;
        if (container && container._leaflet_id) {
          map.remove();
        }
      } catch (e) {}
      mapInstanceRef.current = null;
      geoJsonLayerRef.current = null;
      tileLayerRef.current = null;
      armyMarkersLayerRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupMap();
  }, []);

  // Initialize board
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    const regions = country.regions || [];
    
    // In GIS mode, wait for centers to be calculated by Leaflet
    if (mapMode === 'GIS') {
       if (Object.keys(regionCentersRef.current).length < regions.length * 0.5) {
          // not ready yet
          return;
       }
    }

    const initialStatus: Record<string, RegionUnit> = {};
    
    if (mapMode === 'GIS') {
       // Pick a random epicenter (not the capital if possible)
       const epicenterIdx = Math.floor(Math.random() * (regions.length - 1)) + 1;
       const epicenterId = regions[epicenterIdx].id;
       const epiCenterCoords = regionCentersRef.current[epicenterId] || {lat: 0, lng: 0};
       
       const getDist = (id: string) => {
          const c = regionCentersRef.current[id];
          if (!c) return 999;
          return Math.sqrt(Math.pow(c.lat - epiCenterCoords.lat, 2) + Math.pow(c.lng - epiCenterCoords.lng, 2));
       };

       const sorted = [...regions].sort((a,b) => getDist(a.id) - getDist(b.id));
       const rebelCount = Math.floor(regions.length * 0.4); // 40% are rebels clustered together
       
       sorted.forEach((reg, idx) => {
         const isRebel = idx < rebelCount;
         initialStatus[reg.id] = {
           regionId: reg.id,
           type: isRebel ? 'rebel' : 'loyal',
           hp: isRebel ? 150 + Math.floor(Math.random() * 100) : 200,
           maxHp: isRebel ? 250 : 200,
         };
       });
    } else {
       // Distribute randomly for CARDS mode
       regions.forEach((reg, idx) => {
         const isRebel = idx > 0 && Math.random() > 0.4;
         initialStatus[reg.id] = {
           regionId: reg.id,
           type: isRebel ? 'rebel' : 'loyal',
           hp: isRebel ? 150 + Math.floor(Math.random() * 100) : 200,
           maxHp: isRebel ? 250 : 200,
         };
       });
    }

    // Ensure at least one rebel region
    const finalRebelCount = Object.values(initialStatus).filter(s => s.type === 'rebel').length;
    if (finalRebelCount === 0 && regions.length > 1) {
      initialStatus[regions[regions.length - 1].id].type = 'rebel';
      initialStatus[regions[regions.length - 1].id].hp = 150;
    }

    setRegionStatus(initialStatus);
    setIsInitialized(true);
  }, [country, isInitialized, mapMode, geoJsonData]); // run when geoJsonData changes (which populates centers)

  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev].slice(0, 8));
  };

  const handleAttack = (regionId: string) => {
    const target = regionStatusRef.current[regionId];
    if (!target || target.type !== 'rebel') return;

    // Player attacks
    const damageDealt = 40 + Math.floor(Math.random() * 40);
    const newHp = Math.max(0, target.hp - damageDealt);
    
    addLog(`💥 Our forces struck ${country.regions.find(r => r.id === regionId)?.name} dealing ${damageDealt} damage!`);
    
    setRegionStatus(prev => {
      const next = { ...prev };
      if (newHp === 0) {
        addLog(`🟢 ${country.regions.find(r => r.id === regionId)?.name} has been liberated from rebel control!`);
        next[regionId] = { ...target, hp: target.maxHp, type: 'loyal' };
      } else {
        next[regionId] = { ...target, hp: newHp };
      }
      return next;
    });

    // Rebels counter-attack
    setTimeout(() => {
      rebelTurn();
    }, 1000);
  };
  
  const rebelTurn = () => {
    setRegionStatus(prev => {
      const next = { ...prev };
      const rebels = Object.values(next).filter(r => r.type === 'rebel');
      const loyals = Object.values(next).filter(r => r.type === 'loyal');
      
      if (rebels.length === 0 || loyals.length === 0) return next; // battle is over
      
      // Rebel randomly attacks a loyal region
      const randomRebel = rebels[Math.floor(Math.random() * rebels.length)];
      const targetLoyal = loyals[Math.floor(Math.random() * loyals.length)];
      
      const rebelDamage = 30 + Math.floor(Math.random() * 40);
      const newHp = Math.max(0, targetLoyal.hp - rebelDamage);
      
      addLog(`⚠️ Rebels attacked ${country.regions.find(r => r.id === targetLoyal.regionId)?.name} dealing ${rebelDamage} damage!`);
      
      if (newHp === 0) {
        addLog(`💀 We lost control of ${country.regions.find(r => r.id === targetLoyal.regionId)?.name}! Rebels took over.`);
        next[targetLoyal.regionId] = { ...targetLoyal, hp: 150, type: 'rebel' };
      } else {
        next[targetLoyal.regionId] = { ...targetLoyal, hp: newHp };
      }
      return next;
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapMode !== 'GIS' || !mapContainerRef.current) return;
    
    if (!mapInstanceRef.current) {
      let initialCenter: [number, number] = [38.9637, 35.2433];
      let initialZoom = 5.5;
      if (country.id === 'DE') { initialCenter = [51.1657, 10.4515]; initialZoom = 6; }
      else if (country.id === 'US') { initialCenter = [37.0902, -95.7129]; initialZoom = 4; }
      else if (country.id === 'BR') { initialCenter = [-14.235, -51.9253]; initialZoom = 4; }
      else if (country.id === 'JP') { initialCenter = [36.2048, 138.2529]; initialZoom = 5; }
      else if (country.id === 'EG') { initialCenter = [26.8206, 30.8025]; initialZoom = 5; }
      else if (country.id === 'GB') { initialCenter = [54.3781, -3.4360]; initialZoom = 5; }

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      const tileUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18 }).addTo(map);
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current) {
       const tileUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
       tileLayerRef.current.setUrl(tileUrl);
    }
  }, [mapMode, darkMode, country.id]);

  // Fetch GeoJSON and apply it
  useEffect(() => {
    if (mapMode !== 'GIS') return;
    if (country.id === 'TR') {
      fetch('https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'DE') {
      fetch('https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'US') {
      fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'BR') {
      fetch('https://code.highcharts.com/mapdata/countries/br/br-all.geo.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'JP') {
      fetch('https://code.highcharts.com/mapdata/countries/jp/jp-all.geo.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'EG') {
      fetch('https://code.highcharts.com/mapdata/countries/eg/eg-all.geo.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    } else if (country.id === 'GB') {
      fetch('https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json')
        .then(res => res.json())
        .then(setGeoJsonData).catch(console.error);
    }
  }, [country.id, mapMode]);

  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonData) return;
    
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const normName = normalizeName(getFeatureName(feature));
        let regionId = getRegionIdFromNormalizedName(normName, country.id);
        let matchRegion = country.regions.find(r => r.id === regionId);
        if (!matchRegion) {
          matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
          if (matchRegion) regionId = matchRegion.id;
        }

        const status = matchRegion ? regionStatusRef.current[matchRegion.id] : null;
        
        if (status?.type === 'rebel') {
          return { fillColor: '#ef4444', color: '#ef4444', weight: 1.5, fillOpacity: 0.85 };
        } else if (status?.type === 'loyal') {
          return { fillColor: '#10b981', color: '#10b981', weight: 1.5, fillOpacity: 0.7 };
        }
        return { fillColor: '#64748b', color: '#64748b', weight: 1, fillOpacity: 0.3 };
      },
      onEachFeature: (feature, layer) => {
        const normName = normalizeName(getFeatureName(feature));
        let regionId = getRegionIdFromNormalizedName(normName, country.id);
        let matchRegion = country.regions.find(r => r.id === regionId);
        if (!matchRegion) {
          matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
          if (matchRegion) regionId = matchRegion.id;
        }
        
        if (matchRegion) {
          if ((layer as any).getBounds) {
            try {
              const center = (layer as any).getBounds().getCenter();
              regionCentersRef.current[matchRegion.id] = { lat: center.lat, lng: center.lng };
            } catch (e) {}
          }
          
          layer.bindTooltip(matchRegion.name);
          layer.on('click', () => {
             const status = regionStatusRef.current[matchRegion.id];
             if (status?.type === 'rebel') {
                handleAttack(matchRegion.id);
             }
          });
        }
      }
    }).addTo(mapInstanceRef.current);
  }, [geoJsonData, country.regions]); // Only recreate when GeoJSON data changes

  // Update styles and markers when regionStatus changes
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;

    // Update GeoJSON layer styles
    geoJsonLayerRef.current.setStyle((feature: any) => {
      const normName = normalizeName(getFeatureName(feature));
      let regionId = getRegionIdFromNormalizedName(normName, country.id);
      let matchRegion = country.regions.find(r => r.id === regionId);
      if (!matchRegion) {
        matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
        if (matchRegion) regionId = matchRegion.id;
      }

      const status = matchRegion ? regionStatus[matchRegion.id] : null;
      
      if (status?.type === 'rebel') {
        return { fillColor: '#ef4444', color: '#ef4444', weight: 1.5, fillOpacity: 0.85 };
      } else if (status?.type === 'loyal') {
        return { fillColor: '#10b981', color: '#10b981', weight: 1.5, fillOpacity: 0.7 };
      }
      return { fillColor: '#64748b', color: '#64748b', weight: 1, fillOpacity: 0.3 };
    });

    if (armyMarkersLayerRef.current) {
      armyMarkersLayerRef.current.clearLayers();
    } else {
      armyMarkersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const regionsList = Object.values(regionStatus);
    const getDistance = (id1: string, id2: string) => {
      const c1 = regionCentersRef.current[id1];
      const c2 = regionCentersRef.current[id2];
      if (!c1 || !c2) return 999999;
      return Math.sqrt(Math.pow(c1.lat - c2.lat, 2) + Math.pow(c1.lng - c2.lng, 2));
    };

    const isBorder = (regionId: string, myType: 'loyal' | 'rebel') => {
      const enemies = regionsList.filter(r => r.type !== myType);
      if (enemies.length === 0) return false;
      
      let minDst = 999999;
      for (const e of enemies) {
        const d = getDistance(regionId, e.regionId);
        if (d < minDst) minDst = d;
      }
      
      const allOthers = regionsList.filter(r => r.regionId !== regionId);
      let minAny = 999999;
      for (const o of allOthers) {
        const d = getDistance(regionId, o.regionId);
        if (d < minAny) minAny = d;
      }
      
      return minDst <= minAny * 2.8;
    };

    regionsList.forEach(status => {
      const center = regionCentersRef.current[status.regionId];
      if (center && isBorder(status.regionId, status.type)) {
        const iconHtml = status.type === 'loyal' 
          ? `<div style="width: 24px; height: 24px; background: #0ea5e9; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>`
          : `<div style="width: 24px; height: 24px; background: #ef4444; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>`;
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-army-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([center.lat, center.lng], { icon: customIcon });
        
        marker.on('click', () => {
          if (status.type === 'rebel') {
            handleAttack(status.regionId);
          }
        });
        
        marker.addTo(armyMarkersLayerRef.current!);
      }
    });

  }, [geoJsonData, regionStatus, country.regions]);

  // Check victory / defeat
  useEffect(() => {
    const statuses = Object.values(regionStatus);
    if (statuses.length === 0) return;
    
    const rebelCount = statuses.filter(s => s.type === 'rebel').length;
    const loyalCount = statuses.filter(s => s.type === 'loyal').length;
    
    if (rebelCount === 0) {
      addLog("🏆 VICTORY: All regions have been secured!");
      setTimeout(() => onBattleFinished(true), 2500);
    } else if (loyalCount === 0) {
      addLog("💀 DEFEAT: The government has collapsed. Rebels control all regions.");
      setTimeout(() => onBattleFinished(false), 2500);
    }
  }, [regionStatus, onBattleFinished]);

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-sm">TACTICAL OPERATIONS</h1>
            <p className="text-[10px] uppercase font-mono tracking-wider opacity-60">
              Crisis in {country?.name}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono opacity-60">GOVERNMENT STATUS</span>
            <span className="text-xs font-bold text-emerald-500">ACTIVE - UNDER ATTACK</span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* MAP VIEW */}
        <div className="flex-grow p-4 md:p-8 flex flex-col relative overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold opacity-50 uppercase tracking-widest font-mono">REGIONAL COMMAND MAP</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase font-mono">
                <span className="flex items-center gap-1 text-emerald-500"><Shield className="w-3 h-3"/> Loyal</span>
                <span className="flex items-center gap-1 text-red-500"><AlertTriangle className="w-3 h-3"/> Rebel</span>
              </div>
              
              {(country.id === 'TR' || country.id === 'DE' || country.id === 'US') && (
                <div className="flex items-center rounded-lg overflow-hidden border border-slate-700/50">
                   <button 
                     onClick={() => setMapMode('GIS')}
                     className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-1.5 ${mapMode === 'GIS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                   >
                     <MapIcon className="w-3 h-3" /> GIS
                   </button>
                   <button 
                     onClick={() => setMapMode('CARDS')}
                     className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-1.5 ${mapMode === 'CARDS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                   >
                     <Compass className="w-3 h-3" /> Grid
                   </button>
                </div>
              )}
            </div>
          </div>
          
          {mapMode === 'GIS' ? (
             <div className="w-full flex-grow relative rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg min-h-[400px]">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                   <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-xl flex flex-col gap-2">
                     <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2"><MapIcon className="w-3 h-3 text-indigo-400" /> GIS Target System</span>
                     <span className="text-[10px] text-slate-400">Click on any <span className="text-red-400 font-bold">Red (Rebel)</span> territory to order a military strike.</span>
                   </div>
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {country?.regions?.map(reg => {
              const status = regionStatus[reg.id];
              if (!status) return null;
              
              const isRebel = status.type === 'rebel';
              
              return (
                <button
                  key={reg.id}
                  disabled={!isRebel}
                  onClick={() => handleAttack(reg.id)}
                  className={`p-4 rounded-2xl border-2 text-left relative overflow-hidden transition-all duration-300 ${
                    isRebel 
                      ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500 cursor-crosshair' 
                      : 'border-emerald-500/30 bg-emerald-500/10 opacity-80 cursor-default'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm line-clamp-1 pr-4">{reg.name}</span>
                    {isRebel ? <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /> : <Shield className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-4">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span>INTEGRITY</span>
                      <span className={isRebel ? 'text-red-400' : 'text-emerald-400'}>{status.hp} / {status.maxHp}</span>
                    </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isRebel ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(status.hp / status.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {isRebel && (
                    <div className="absolute top-0 right-0 p-1 bg-red-500 text-white text-[8px] font-bold uppercase rounded-bl-lg">
                      Target
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          )}
        </div>

        {/* BATTLE LOGS */}
        <div className={`w-full md:w-80 border-t md:border-t-0 md:border-l p-4 flex flex-col ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
          <h3 className="text-xs font-bold opacity-60 uppercase font-mono mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4" /> BATTLE LOGS
          </h3>
          
          <div className="flex-grow overflow-y-auto space-y-3">
            {battleLogs.map((log, i) => (
              <div key={i} className={`text-xs p-3 rounded-lg border ${
                i === 0 
                  ? (darkMode ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200' : 'border-indigo-500/30 bg-indigo-50 text-indigo-900') 
                  : (darkMode ? 'border-slate-800 bg-slate-800/30 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')
              } animate-fade-in`}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
