import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Swords, Users, Trophy, AlertTriangle, Compass, Heart, Award, Map as MapIcon, Target, Activity, Shield, Flame, Plus, Zap, Navigation, Bomb, Factory, Radio } from 'lucide-react';
import { normalizeName, getRegionIdFromNormalizedName, getFeatureName } from '../utils/mapUtils';
import { Country, ScenarioYear } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { playSound } from '../lib/sounds';

interface RegionUnit {
  regionId: string;
  type: 'loyal' | 'rebel' | 'contested';
  hp: number;
  maxHp: number;
}

export interface PlayerArmy {
  id: string;
  name: string;
  type: 'infantry' | 'armored' | 'specops' | 'artillery';
  regionId: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  status: 'idle' | 'marching' | 'sieging';
  targetRegionId?: string;
}

export interface HistoricalBomb {
  id: string;
  name: string;
  era: ScenarioYear;
  type: 'tactical' | 'heavy' | 'strategic' | 'nuclear';
  damage: number;
  cost: number;
  description: string;
  icon: string;
}

export const HISTORICAL_BOMBS: HistoricalBomb[] = [
  // 2026
  { id: 'b_sdb_2026', name: 'GBU-39 Small Diameter Bomb', era: '2026', type: 'tactical', damage: 65, cost: 25000, description: 'GPS-guided stand-off glide bomb with surgical strike accuracy.', icon: '🎯' },
  { id: 'b_jdam_2026', name: 'JDAM 2000lb Guided Penetrator', era: '2026', type: 'heavy', damage: 120, cost: 45000, description: 'All-weather smart weapon kit converting free-fall bombs into precision munition.', icon: '💣' },
  { id: 'b_fab3000_2026', name: 'FAB-3000 Heavy Glide Bomb', era: '2026', type: 'strategic', damage: 220, cost: 85000, description: 'High-explosive heavy demolition aerial bomb with deployable wing kit.', icon: '💥' },
  
  // 1950
  { id: 'b_napalm_1950', name: 'M116 Incendiary Napalm Bomb', era: '1950', type: 'tactical', damage: 70, cost: 18000, description: 'Gelatinized fuel canister generating sustained intense combustion zones.', icon: '🔥' },
  { id: 'b_tallboy_1950', name: 'Tallboy 12,000lb Earthquake Bomb', era: '1950', type: 'heavy', damage: 150, cost: 55000, description: 'Deep-penetration aerodynamic seismic bomb shattering underground fortifications.', icon: '💣' },
  { id: 'b_mark4_1950', name: 'Mark 4 Strategic Atomic Device', era: '1950', type: 'nuclear', damage: 350, cost: 250000, description: 'First mass-produced post-war atomic implosion weapon with kiloton blast yield.', icon: '☢️' },

  // 1936
  { id: 'b_sc250_1936', name: 'SC 250 General-Purpose Bomb', era: '1936', type: 'tactical', damage: 50, cost: 12000, description: 'Standard high-explosive aerial bomb for tactical close support.', icon: '💣' },
  { id: 'b_sc1000_1936', name: 'SC 1000 Hermann Heavy Demolition', era: '1936', type: 'heavy', damage: 110, cost: 40000, description: 'Thin-cased heavy blast bomb designed to flatten fortified sectors.', icon: '💥' },

  // 1920
  { id: 'b_cooper_1920', name: 'Cooper 20lb High-Explosive Bomb', era: '1920', type: 'tactical', damage: 35, cost: 6000, description: 'Interwar aerial fragmentation bomb dropped from biplane aircraft.', icon: '💣' },
  { id: 'b_livens_1920', name: 'Livens Chemical Projector Canister', era: '1920', type: 'heavy', damage: 75, cost: 22000, description: 'Large-bore suppression projectile for entrenchment clearance.', icon: '⚠️' },

  // 1914
  { id: 'b_putilov_1914', name: 'Putilov 76mm Aerial Shrapnel Canister', era: '1914', type: 'tactical', damage: 25, cost: 4000, description: 'Early Great War hand-dropped canister with timer fuze.', icon: '💣' },
  { id: 'b_zeppelin_1914', name: 'Carbonit 50kg Torpedo Aerobomb', era: '1914', type: 'heavy', damage: 60, cost: 16000, description: 'Dirigible Zeppelin heavy fragmentation bomb for strategic bombardment.', icon: '💥' }
];

interface TacticalBattleViewProps {
  country: Country;
  party: { name: string };
  civilWarRisk?: number;
  darkMode: boolean;
  scenario?: ScenarioYear;
  onBattleFinished: (success: boolean) => void;
}

export const TacticalBattleView: React.FC<TacticalBattleViewProps> = ({
  country,
  party,
  civilWarRisk = 50,
  darkMode,
  scenario = '2026',
  onBattleFinished
}) => {
  const [regionStatus, setRegionStatus] = useState<Record<string, RegionUnit>>({});
  const [armies, setArmies] = useState<PlayerArmy[]>([]);
  const [militaryBudget, setMilitaryBudget] = useState<number>(180000);
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [recruitingProvinceId, setRecruitingProvinceId] = useState<string | null>(null);

  // Casualties and Army tracking state
  const [loyalCasualties, setLoyalCasualties] = useState<number>(57039);
  const [rebelCasualties, setRebelCasualties] = useState<number>(82392);
  const [loyalArmyCount, setLoyalArmyCount] = useState<number>(420000);
  const [rebelArmyCount, setRebelArmyCount] = useState<number>(280000);

  // Ordnance & Bomb Arsenal
  const [inventoryBombs, setInventoryBombs] = useState<Record<string, number>>({
    [scenario === '1950' ? 'b_napalm_1950' : scenario === '1936' ? 'b_sc250_1936' : scenario === '1920' ? 'b_cooper_1920' : scenario === '1914' ? 'b_putilov_1914' : 'b_jdam_2026']: 2
  });
  const [showOrdnanceFactory, setShowOrdnanceFactory] = useState<boolean>(false);
  const [selectedBombToDrop, setSelectedBombToDrop] = useState<string | null>(null);

  const [battleLogs, setBattleLogs] = useState<string[]>([
    'Tactical command center active! You can recruit new armies from provinces, manufacture era-specific bombs, and issue attack or siege orders.'
  ]);
  const [mapMode, setMapMode] = useState<'GIS' | 'CARDS'>('GIS');
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const armyMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const regionCentersRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const regionStatusRef = useRef<Record<string, RegionUnit>>({});
  const armiesRef = useRef<PlayerArmy[]>([]);
  const [centersReady, setCentersReady] = useState(false);
  
  useEffect(() => {
    regionStatusRef.current = regionStatus;
  }, [regionStatus]);

  useEffect(() => {
    armiesRef.current = armies;
  }, [armies]);
  
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      
      try { if(map.stop) map.stop(); map.off(); map.remove(); } catch(e) {}

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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [gameDate, setGameDate] = useState<Date>(new Date(Number(scenario) || 2026, 0, 1));

  useEffect(() => {
    if (isInitialized) return;
    const regions = country.regions || [];
    
    if (mapMode === 'GIS') {
       if (!centersReady) return;
    }

    const initialStatus: Record<string, RegionUnit> = {};
    const isUnderCivilWar = civilWarRisk >= 40;
    
    if (isUnderCivilWar) {
      if (mapMode === 'GIS') {
        const epicenterIdx = Math.floor(Math.random() * (regions.length - 1)) + 1;
        const epicenterId = regions[epicenterIdx].id;
        const epiCenterCoords = regionCentersRef.current[epicenterId] || {lat: 0, lng: 0};
        
        const getDist = (id: string) => {
           const c = regionCentersRef.current[id];
           if (!c) return 999;
           return Math.sqrt(Math.pow(c.lat - epiCenterCoords.lat, 2) + Math.pow(c.lng - epiCenterCoords.lng, 2));
        };

        const sorted = [...regions].sort((a,b) => getDist(a.id) - getDist(b.id));
        const rebelProportion = Math.max(0.15, Math.min(0.7, (civilWarRisk - 30) / 100)); 
        const rebelCount = Math.max(1, Math.floor(regions.length * rebelProportion)); 
        
        sorted.forEach((reg, idx) => {
          const isRebel = idx < rebelCount;
          initialStatus[reg.id] = {
            regionId: reg.id,
            type: isRebel ? 'rebel' : 'loyal',
            hp: isRebel ? 160 + Math.floor(Math.random() * 80) : 200,
            maxHp: isRebel ? 250 : 200,
          };
        });
      } else {
        const rebelProportion = Math.max(0.15, Math.min(0.7, (civilWarRisk - 30) / 100)); 
        regions.forEach((reg, idx) => {
          const isRebel = idx > 0 && Math.random() < rebelProportion;
          initialStatus[reg.id] = {
            regionId: reg.id,
            type: isRebel ? 'rebel' : 'loyal',
            hp: isRebel ? 160 + Math.floor(Math.random() * 80) : 200,
            maxHp: isRebel ? 250 : 200,
          };
        });
      }
    } else {
      // Sovereign Peace: all regions loyal, ready for national defense
      regions.forEach((reg) => {
        initialStatus[reg.id] = {
          regionId: reg.id,
          type: 'loyal',
          hp: 200,
          maxHp: 200,
        };
      });
    }

    setRegionStatus(initialStatus);

    // Initial standing national defense armies in loyal provinces
    const loyalProvinces = regions.filter(r => initialStatus[r.id]?.type === 'loyal');
    const initialArmies: PlayerArmy[] = [];
    if (loyalProvinces.length > 0) {
      initialArmies.push({
        id: 'army-1',
        name: '1st Infantry Division',
        type: 'infantry',
        regionId: loyalProvinces[0].id,
        hp: 180,
        maxHp: 180,
        attackPower: 45,
        status: 'idle'
      });
    }
    if (loyalProvinces.length > 1) {
      initialArmies.push({
        id: 'army-2',
        name: '1st Armored Brigade',
        type: 'armored',
        regionId: loyalProvinces[1].id,
        hp: 280,
        maxHp: 280,
        attackPower: 75,
        status: 'idle'
      });
    } else if (loyalProvinces.length === 1) {
      initialArmies.push({
        id: 'army-2',
        name: 'Special Operations Forces',
        type: 'specops',
        regionId: loyalProvinces[0].id,
        hp: 200,
        maxHp: 200,
        attackPower: 60,
        status: 'idle'
      });
    }

    setArmies(initialArmies);
    setIsInitialized(true);
  }, [country, isInitialized, mapMode, centersReady, civilWarRisk, scenario]);


  useEffect(() => {
    if (!isPlaying || !isInitialized) return;
    const intervalId = setInterval(() => {
      // Advance date
      setGameDate(prev => {
        const nextDate = new Date(prev);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
      });
      
      // Auto battle
      setRegionStatus(prev => {
        const next = { ...prev };
        const rebels = (Object.values(next) as RegionUnit[]).filter(r => r.type === 'rebel');
        const loyals = (Object.values(next) as RegionUnit[]).filter(r => r.type === 'loyal');
        if (rebels.length === 0 || loyals.length === 0) {
           setIsPlaying(false);
           return next;
        }
        
        // Random loyal attacks
        if (Math.random() < 0.3) {
            const randomRebel = rebels[Math.floor(Math.random() * rebels.length)];
            const damageDealt = 20 + Math.floor(Math.random() * 30);
            const newHp = Math.max(0, randomRebel.hp - damageDealt);
            if (newHp === 0) {
               addLog(`🟢 ${country.regions.find(r => r.id === randomRebel.regionId)?.name} has been liberated from rebel control!`);
               next[randomRebel.regionId] = { ...randomRebel, hp: randomRebel.maxHp, type: 'loyal' };
            } else {
               next[randomRebel.regionId] = { ...randomRebel, hp: newHp };
            }
        }
        
        // Random rebel attacks
        if (Math.random() < 0.3) {
            const targetLoyal = loyals[Math.floor(Math.random() * loyals.length)];
            const rebelDamage = 20 + Math.floor(Math.random() * 30);
            const newHp = Math.max(0, targetLoyal.hp - rebelDamage);
            if (newHp === 0) {
               addLog(`💀 We lost control of ${country.regions.find(r => r.id === targetLoyal.regionId)?.name}! Rebels took over.`);
               next[targetLoyal.regionId] = { ...targetLoyal, hp: 150, type: 'rebel' };
            } else {
               next[targetLoyal.regionId] = { ...targetLoyal, hp: newHp };
            }
        }
        
        return next;
      });
      
    }, 1000 / gameSpeed);
    
    return () => clearInterval(intervalId);
  }, [isPlaying, gameSpeed, isInitialized]);

  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev].slice(0, 8));
  };

  const handleRecruitArmy = (regionId: string, unitType: 'infantry' | 'armored' | 'specops' | 'artillery') => {
    const region = country.regions.find(r => r.id === regionId);
    if (!region) return;

    let cost = 15000;
    let hp = 180;
    let atk = 45;
    let typeName = 'Infantry Division';

    if (unitType === 'armored') {
      cost = 35000; hp = 280; atk = 75; typeName = 'Armored Brigade';
    } else if (unitType === 'specops') {
      cost = 25000; hp = 200; atk = 60; typeName = 'Special Operations Forces';
    } else if (unitType === 'artillery') {
      cost = 30000; hp = 150; atk = 85; typeName = 'Artillery Regiment';
    }

    if (militaryBudget < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Military Budget! More funds required to recruit unit.`);
      return;
    }

    setMilitaryBudget(prev => prev - cost);
    const newArmy: PlayerArmy = {
      id: `army-${Date.now()}`,
      name: `${armies.length + 1}. ${typeName}`,
      type: unitType,
      regionId: regionId,
      hp: hp,
      maxHp: hp,
      attackPower: atk,
      status: 'idle'
    };

    setArmies(prev => [...prev, newArmy]);
    playSound('success');
    addLog(`🪖 ${region.name} New unit recruited and deployed!`);
    setRecruitingProvinceId(null);
  };

  const handleManufactureBomb = (bombId: string) => {
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    if (!bomb) return;
    if (militaryBudget < bomb.cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Military Budget! ₺${bomb.cost.toLocaleString()} required to produce ${bomb.name}.`);
      return;
    }
    setMilitaryBudget(prev => prev - bomb.cost);
    setInventoryBombs(prev => ({
      ...prev,
      [bombId]: (prev[bombId] || 0) + 1
    }));
    playSound('success');
    addLog(`🏭 MANUFACTURED: 1x ${bomb.name} ready for aerial deployment!`);
  };

  const handleLaunchBomb = (bombId: string, targetRegionId: string) => {
    const bomb = HISTORICAL_BOMBS.find(b => b.id === bombId);
    const count = inventoryBombs[bombId] || 0;
    if (!bomb || count <= 0) return;

    const target = regionStatus[targetRegionId];
    if (!target || target.type !== 'rebel') return;

    const regName = country.regions.find(r => r.id === targetRegionId)?.name || targetRegionId;
    setInventoryBombs(prev => ({
      ...prev,
      [bombId]: Math.max(0, (prev[bombId] || 0) - 1)
    }));
    setSelectedBombToDrop(null);

    const damage = bomb.damage;
    const newHp = Math.max(0, target.hp - damage);

    // Increase casualties!
    const addedEnemyCasualties = Math.floor(damage * 180 + Math.random() * 400);
    const addedFriendlyCasualties = Math.floor(Math.random() * 30);
    setRebelCasualties(prev => prev + addedEnemyCasualties);
    setLoyalCasualties(prev => prev + addedFriendlyCasualties);
    setRebelArmyCount(prev => Math.max(0, prev - Math.floor(addedEnemyCasualties * 0.9)));

    playSound('explosion');
    addLog(`🚀 BOMB STRIKE: Deployed ${bomb.name} on ${regName}! ${damage} Demolition Damage (+${addedEnemyCasualties.toLocaleString()} enemy casualties).`);

    setRegionStatus(prev => {
      const next = { ...prev };
      if (newHp === 0) {
        addLog(`🟢 OBLITERATION: Rebel garrison eradicated in ${regName}! Province secured.`);
        next[targetRegionId] = { ...target, hp: target.maxHp, type: 'loyal' };
      } else {
        next[targetRegionId] = { ...target, hp: newHp };
      }
      return next;
    });
  };

  const handleAttack = (targetRegionId: string) => {
    if (selectedBombToDrop) {
      handleLaunchBomb(selectedBombToDrop, targetRegionId);
      return;
    }
    const army = selectedArmyId ? armies.find(a => a.id === selectedArmyId) : armies[0];
    if (army) {
      handleOrderAssault(army.id, targetRegionId);
    } else {
      handleCallAirStrike(targetRegionId);
    }
  };

  const handleOrderAssault = (armyId: string, targetRegionId: string) => {
    const army = armies.find(a => a.id === armyId);
    const target = regionStatus[targetRegionId];
    if (!army || !target || target.type !== 'rebel') return;

    const regName = country.regions.find(r => r.id === targetRegionId)?.name || targetRegionId;
    const damageDealt = Math.floor(army.attackPower * (0.8 + Math.random() * 0.4));
    const newHp = Math.max(0, target.hp - damageDealt);

    // Dynamic casualties update
    const addedRebelLosses = Math.floor(damageDealt * 120 + Math.random() * 300);
    const addedLoyalLosses = Math.floor(180 + Math.random() * 250);
    setRebelCasualties(prev => prev + addedRebelLosses);
    setLoyalCasualties(prev => prev + addedLoyalLosses);
    setRebelArmyCount(prev => Math.max(0, prev - Math.floor(addedRebelLosses * 0.7)));
    setLoyalArmyCount(prev => Math.max(0, prev - Math.floor(addedLoyalLosses * 0.7)));

    playSound('battle');
    addLog(`⚔️ ${army.name} engaged rebel defenders in ${regName}!`);

    setRegionStatus(prev => {
      const next = { ...prev };
      if (newHp === 0) {
        addLog(`🟢 ASSAULT SUCCESSFUL: Province liberated from rebel control!`);
        next[targetRegionId] = { ...target, hp: target.maxHp, type: 'loyal' };
      } else {
        next[targetRegionId] = { ...target, hp: newHp };
      }
      return next;
    });

    const rebelDamage = Math.floor(20 + Math.random() * 25);
    const newArmyHp = Math.max(0, army.hp - rebelDamage);

    setArmies(prev => prev.map(a => {
      if (a.id === armyId) {
        if (newArmyHp === 0) {
          addLog(`💥 HEAVY LOSSES: Unit destroyed in rebel skirmish!`);
          return null;
        }
        return { ...a, hp: newArmyHp, regionId: targetRegionId, status: 'idle' };
      }
      return a;
    }).filter(Boolean) as PlayerArmy[]);
  };

  const handleOrderSiege = (armyId: string, targetRegionId: string) => {
    const army = armies.find(a => a.id === armyId);
    const target = regionStatus[targetRegionId];
    if (!army || !target || target.type !== 'rebel') return;

    const regName = country.regions.find(r => r.id === targetRegionId)?.name || targetRegionId;
    setArmies(prev => prev.map(a => a.id === armyId ? { ...a, status: 'sieging', targetRegionId, regionId: targetRegionId } : a));
    playSound('success');
    addLog(`🛡️ ${army.name}, ${regName} initiated a strategic siege! Rebels are cut off from supplies.`);
  };

  const handleCallAirStrike = (targetRegionId: string) => {
    const cost = 20000;
    if (militaryBudget < cost) {
      playSound('error');
      addLog(`⚠️ Insufficient Military Budget! Funds required for Precision Air Strike.`);
      return;
    }

    const target = regionStatus[targetRegionId];
    if (!target || target.type !== 'rebel') return;

    const regName = country.regions.find(r => r.id === targetRegionId)?.name || targetRegionId;
    setMilitaryBudget(prev => prev - cost);
    const damage = 55;
    const newHp = Math.max(0, target.hp - damage);

    playSound('explosion');
    addLog(`🛩️ F-16 Fighters bombed the rebel headquarters!`);

    setRegionStatus(prev => {
      const next = { ...prev };
      if (newHp === 0) {
        addLog(`🟢 AIR STRIKE VICTORY: Province liberated!`);
        next[targetRegionId] = { ...target, hp: target.maxHp, type: 'loyal' };
      } else {
        next[targetRegionId] = { ...target, hp: newHp };
      }
      return next;
    });
  };

  const handleDisbandArmy = (armyId: string) => {
    const army = armies.find(a => a.id === armyId);
    if (!army) return;
    setMilitaryBudget(prev => prev + 8000);
    setArmies(prev => prev.filter(a => a.id !== armyId));
    if (selectedArmyId === armyId) setSelectedArmyId(null);
    playSound('click');
    addLog(`🗑️ ${army.name} disbanded. Funds returned to military budget.`);
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
      else if (country.id === 'FR') { initialCenter = [46.2276, 2.2137]; initialZoom = 5.5; }
      else if (country.id === 'RO') { initialCenter = [45.9432, 24.9668]; initialZoom = 6.2; }
      else if (country.id === 'HU') { initialCenter = [47.1625, 19.5033]; initialZoom = 6.8; }
      else if (country.id === 'CA') { initialCenter = [56.1304, -106.3468]; initialZoom = 3.5; }
      else if (country.id === 'ZA') { initialCenter = [-30.5595, 22.9375]; initialZoom = 5; }
      else if (country.id === 'IN') { initialCenter = [20.5937, 78.9629]; initialZoom = 4.2; }
      else if (country.id === 'MX') { initialCenter = [23.6345, -102.5528]; initialZoom = 4.5; }
      else if (country.id === 'ES') { initialCenter = [40.4637, -3.7492]; initialZoom = 5.8; }
      else if (country.id === 'AU') { initialCenter = [-25.2744, 133.7751]; initialZoom = 3.8; }
      else if (country.id === 'IT') { initialCenter = [41.8719, 12.5674]; initialZoom = 5.8; }
      else if (country.id === 'ID') { initialCenter = [-0.7893, 113.9213]; initialZoom = 4.2; }
      else if (country.id === 'KR') { initialCenter = [35.9078, 127.7669]; initialZoom = 6.5; }
      else if (country.id === 'AR') { initialCenter = [-38.4161, -63.6167]; initialZoom = 3.8; }

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 18, attribution: 'Tiles &copy; Esri' }).addTo(map);
      mapInstanceRef.current = map;
    } else if (tileLayerRef.current) {
       const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
       tileLayerRef.current.setUrl(tileUrl);
    }
  }, [mapMode, darkMode, country.id]);

  // Fetch GeoJSON and apply it
  useEffect(() => {
    if (mapMode !== 'GIS') return;
    const geojsonMapUrls: Record<string, string> = {
      TR: 'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json',
      DE: 'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json',
      US: 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
      BR: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson',
      JP: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson',
      EG: '/egypt-provinces.geojson',
      GB: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json',
      CA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson',
      ZA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-africa.geojson',
      IN: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/india.geojson',
      MX: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/mexico.geojson',
      ES: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-communities.geojson',
      AU: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
      IT: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/italy-regions.geojson',
      ID: 'https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia.geojson',
      KR: 'https://cdn.jsdelivr.net/gh/southkorea/southkorea-maps@master/kostat/2013/json/skorea_provinces_geo_simple.json',
      AR: 'https://raw.githubusercontent.com/Rodri1791/Regions_Argentina/main/Regiones_ArgentinasGJSON/provinciasargentina.geojson',
      FR: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/france-regions.geojson',
      RO: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/romania.geojson',
      HU: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/hungary.geojson'
    };

    if (geojsonMapUrls[country.id]) {
      fetch(geojsonMapUrls[country.id])
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
        let matchRegion = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
        if (!matchRegion) {
          matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
        }
        if (matchRegion) {
          regionId = matchRegion.id;
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
        let matchRegion = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
        if (!matchRegion) {
          matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
        }
        if (matchRegion) {
          regionId = matchRegion.id;
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
                setTimeout(() => handleAttack(matchRegion.id), 10);
             }
          });
        }
      }
    }).addTo(mapInstanceRef.current);
    
    setCentersReady(true);
  }, [geoJsonData, country.regions]); // Only recreate when GeoJSON data changes

  // Update styles and markers when regionStatus changes
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;

    const updateTimer = setTimeout(() => {
      if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;

      // Update GeoJSON layer styles
      if (mapInstanceRef.current && mapInstanceRef.current.hasLayer(geoJsonLayerRef.current)) geoJsonLayerRef.current.setStyle((feature: any) => {
        const normName = normalizeName(getFeatureName(feature));
        let regionId = getRegionIdFromNormalizedName(normName, country.id);
        let matchRegion = country.regions.find(r => r.id === regionId || normalizeName(r.id) === regionId);
        if (!matchRegion) {
          matchRegion = country.regions.find(r => normalizeName(r.id) === normName || normalizeName(r.name) === normName);
        }
        if (matchRegion) {
          regionId = matchRegion.id;
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

      const regionsList = Object.values(regionStatus) as RegionUnit[];
      const getDistance = (id1: string, id2: string) => {
        const c1 = regionCentersRef.current[id1];
        const c2 = regionCentersRef.current[id2];
        if (!c1 || !c2) return 999999;
        return Math.sqrt(Math.pow(c1.lat - c2.lat, 2) + Math.pow(c1.lng - c2.lng, 2));
      };

      const isBorder = (regionId: string, myType: 'loyal' | 'rebel' | 'contested') => {
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
        if (center) {
          const rName = country.regions.find(r => r.id === status.regionId)?.name || status.regionId;
          const isL = status.type === 'loyal';
          
          const iconHtml = isL
            ? `<div style="width: 36px; height: 24px; background: rgba(16,185,129,0.15); border: 1.5px solid #10b981; backdrop-filter: blur(4px); border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(16,185,129,0.3), inset 0 0 8px rgba(16,185,129,0.2); cursor: grab; position: relative; font-family: monospace;">
                 <span style="font-size: 11px; font-weight: 900; color: #10b981; letter-spacing: -0.5px;">${status.hp}</span>
                 <div style="position: absolute; top: -3px; right: -3px; width: 6px; height: 6px; background: #10b981; border-radius: 50%;"></div>
               </div>`
            : `<div style="width: 36px; height: 24px; background: rgba(244,63,94,0.15); border: 1.5px solid #f43f5e; backdrop-filter: blur(4px); border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(244,63,94,0.3), inset 0 0 8px rgba(244,63,94,0.2); position: relative; font-family: monospace;">
                 <span style="font-size: 11px; font-weight: 900; color: #f43f5e; letter-spacing: -0.5px;">${status.hp}</span>
                 <div style="position: absolute; top: -3px; left: -3px; width: 6px; height: 6px; background: #f43f5e; border-radius: 50%;"></div>
               </div>`;
          
          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-army-icon',
            iconSize: [36, 24],
            iconAnchor: [18, 12],
          });

          const marker = L.marker([center.lat, center.lng], { 
            icon: customIcon,
            draggable: isL // Only loyal armies are draggable
          });

          if (isL) {
            marker.on('dragend', (e: any) => {
              const droppedLatLng = e.target.getLatLng();
              
              // Find the closest rebel region center
              let closestRegionId: string | null = null;
              let minDistance = 999999;
              
              Object.entries(regionCentersRef.current).forEach(([regId, coords]) => {
                const c = coords as { lat: number; lng: number };
                const relStatus = regionStatusRef.current[regId];
                if (relStatus && relStatus.type === 'rebel') {
                  const dist = Math.sqrt(
                    Math.pow(droppedLatLng.lat - c.lat, 2) + 
                    Math.pow(droppedLatLng.lng - c.lng, 2)
                  );
                  if (dist < minDistance) {
                    minDistance = dist;
                    closestRegionId = regId;
                  }
                }
              });
              
              if (closestRegionId && minDistance < 12.0) {
                const rebelName = country.regions.find(r => r.id === closestRegionId)?.name || closestRegionId;
                addLog(`🎯 Drag-and-Drop: Order received! Deploying military to attack rebel garrison in ${rebelName}!`);
                handleAttack(closestRegionId);
              } else {
                addLog(`⚠️ Dropped too far from any active rebel territory! Deployed back to defensive base.`);
              }
              // Reset marker coordinates to its center base
              marker.setLatLng([center.lat, center.lng]);
            });
          } else {
            // Click target on rebel marker
            marker.on('click', () => {
              handleAttack(status.regionId);
            });
          }

          marker.bindTooltip(`
            <div style="font-family: monospace; padding: 4px 6px; background: rgba(15,23,42,0.9); border: 1px solid ${isL ? '#10b981' : '#f43f5e'}; border-radius: 4px; backdrop-filter: blur(4px);">
              <b style="font-size: 10px; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px;">${rName}</b>
              <br/><span style="font-size: 9px; color: ${isL ? '#10b981' : '#f43f5e'}; text-transform: uppercase;">
                ${isL ? 'Loyal Forces' : 'Rebel Militia'}
              </span>
              <br/><span style="font-size: 9px; color: #94a3b8;">INTEGRITY: <b style="color: #f8fafc;">${status.hp}/${status.maxHp}</b></span>
              ${isL ? `<br/><i style="font-size: 8px; color: #10b981; opacity: 0.8;">Drag to attack</i>` : ''}
            </div>
          `, { direction: 'top', opacity: 1, className: 'tactical-tooltip' });
          
          marker.addTo(armyMarkersLayerRef.current!);
        }
      });
    }, 100);

    return () => clearTimeout(updateTimer);
  }, [geoJsonData, regionStatus, country.regions]);

  // Check victory / defeat
  useEffect(() => {
    const statuses = Object.values(regionStatus) as RegionUnit[];
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
      <div className={`p-4 border-b flex flex-wrap justify-between items-center gap-4 ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-tight flex items-center gap-2">
              ARMY AND TACTICAL OPERATIONS CENTER
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold">
                Open Conflict
              </span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-wider opacity-60">
              {country?.name} National Defense Headquarters
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Military Budget & Standing Armies HUD */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Military Operations Budget</span>
              <span className="text-xs font-black font-mono text-amber-400">${militaryBudget.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-700/50" />
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Active Divisions</span>
              <span className="text-xs font-black font-mono text-emerald-400">{armies.length} Divisions</span>
            </div>
          </div>

          {/* TIME CONTROL SYSTEM */}
          <div className="flex items-center gap-2 border border-slate-700/40 bg-slate-950/20 px-3 py-1.5 rounded-xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-2 ${
                isPlaying 
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                  </span>
                  ⏱️ PAUSE
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2 bg-slate-950 rounded-full" />
                  ▶ ADVANCE TIME
                </>
              )}
            </button>
            <div className="text-xs font-bold font-mono px-2 opacity-80 border-l border-slate-700/30">
              📅 {gameDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* PROVINCE ARMY RECRUITMENT MODAL */}
      {recruitingProvinceId && (() => {
        const prov = country.regions.find(r => r.id === recruitingProvinceId);
        if (!prov) return null;

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl flex flex-col gap-4 animate-scale-up ${
              darkMode ? 'bg-slate-900 border-indigo-500/30 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}>
              <div className="flex justify-between items-center border-b pb-3 border-slate-700/50">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    {prov.name} PROVINCE ARMY RECRUITMENT
                  </h3>
                  <p className="text-[11px] text-slate-400">Recruit and deploy a new military unit in this province.</p>
                </div>
                <button 
                  onClick={() => setRecruitingProvinceId(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => handleRecruitArmy(prov.id, 'infantry')}
                  className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-lg">🪖</div>
                    <div>
                      <div className="font-bold text-xs text-slate-100 group-hover:text-indigo-300">Infantry Division</div>
                      <div className="text-[10px] text-slate-400">HP: 180 • Attack: 45 • Basic Defense</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">₺15,000</span>
                </button>

                <button
                  onClick={() => handleRecruitArmy(prov.id, 'armored')}
                  className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-lg">🛡️</div>
                    <div>
                      <div className="font-bold text-xs text-slate-100 group-hover:text-amber-300">Armored Brigade</div>
                      <div className="text-[10px] text-slate-400">HP: 280 • Attack: 75 • Heavy Destruction</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">₺35,000</span>
                </button>

                <button
                  onClick={() => handleRecruitArmy(prov.id, 'specops')}
                  className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-lg">🛩️</div>
                    <div>
                      <div className="font-bold text-xs text-slate-100 group-hover:text-cyan-300">Special Operations Forces</div>
                      <div className="text-[10px] text-slate-400">HP: 200 • Attack: 60 • Rapid Deployment</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">₺25,000</span>
                </button>

                <button
                  onClick={() => handleRecruitArmy(prov.id, 'artillery')}
                  className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-lg">🎯</div>
                    <div>
                      <div className="font-bold text-xs text-slate-100 group-hover:text-orange-300">Artillery Regiment</div>
                      <div className="text-[10px] text-slate-400">HP: 150 • Attack: 85 • High Area Damage</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">₺30,000</span>
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setRecruitingProvinceId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Close / Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* MAP VIEW */}
        <div className="flex-grow p-4 md:p-8 flex flex-col relative overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold opacity-50 uppercase tracking-widest font-mono">REGIONAL COMMAND MAP</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase font-mono">
                <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"><Activity className="w-3 h-3"/> Loyal</span>
                <span className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20"><Target className="w-3 h-3"/> Rebel</span>
              </div>
              
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
            </div>
          </div>

          {/* ACTIVE GIS MAP CONTAINER WITH CASUALTIES HUD */}
          {mapMode === 'GIS' ? (
            <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
              <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

              {/* TOP-RIGHT LIVE CASUALTIES & ORDNANCE HUD */}
              <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto max-w-xs w-full sm:w-auto">
                <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-slate-700/90 shadow-2xl backdrop-blur-md flex flex-col gap-1.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-rose-400 font-mono tracking-tight">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                      CASUALTIES (ACTIVE WAR)
                    </div>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">LIVE FEED</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 pt-0.5 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-bold uppercase text-[11px]">US (LOYAL):</span>
                      <span className="font-black text-slate-100">{loyalCasualties.toLocaleString()} DEAD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400 font-bold uppercase text-[11px]">REBELS:</span>
                      <span className="font-black text-rose-300">{rebelCasualties.toLocaleString()} DEAD</span>
                    </div>
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>FORCES: <strong className="text-emerald-400">{loyalArmyCount.toLocaleString()}</strong></span>
                    <span>ENEMY: <strong className="text-rose-400">{rebelArmyCount.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Bomb Launch Targeting Status Indicator */}
                {selectedBombToDrop && (() => {
                  const b = HISTORICAL_BOMBS.find(x => x.id === selectedBombToDrop);
                  return (
                    <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg animate-pulse">
                      <div className="flex items-center gap-1.5">
                        <Bomb className="w-4 h-4" />
                        <span>TARGETING: Click Rebel Province</span>
                      </div>
                      <button 
                        onClick={() => setSelectedBombToDrop(null)}
                        className="px-2 py-0.5 bg-slate-950 text-white rounded text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })()}

                {/* Quick Factory & Ordnance Arsenal Button */}
                <button
                  onClick={() => setShowOrdnanceFactory(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <Factory className="w-4 h-4" />
                  <span>Ordnance Factory & Bombs ({Object.values(inventoryBombs).reduce((a: number, b: number) => a + Number(b), 0)})</span>
                </button>
              </div>

              {/* Bottom Instructions */}
              <div className="absolute bottom-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
                💡 Drag green markers onto red rebel provinces to launch tactical assaults.
              </div>
            </div>
          ) : (
            /* GRID CARDS VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {country.regions.map(r => {
                const status = regionStatus[r.id];
                const isRebel = status?.type === 'rebel';
                return (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                      isRebel 
                        ? 'bg-rose-950/30 border-rose-500/50' 
                        : 'bg-emerald-950/30 border-emerald-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs">{r.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          isRebel ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isRebel ? 'REBEL' : 'LOYAL'}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        HP: {status?.hp || 200}/{status?.maxHp || 200}
                      </div>
                    </div>

                    {isRebel ? (
                      <button
                        onClick={() => handleAttack(r.id)}
                        className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-mono transition-all"
                      >
                        ⚔️ Attack
                      </button>
                    ) : (
                      <button
                        onClick={() => setRecruitingProvinceId(r.id)}
                        className="w-full py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold font-mono transition-all"
                      >
                        + Recruit Army
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* ACTIVE STANDING ARMIES ROSTER & COMMAND PANEL */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/50 pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wide">
                  ACTIVE UNITS AND COMMAND ROSTER ({armies.length})
                </h3>
              </div>
              <p className="text-[10px] text-slate-400">
                Click on a loyal province on the map to recruit an army or issue attack orders from the units below.
              </p>
            </div>

            {armies.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                You have no active armies! Click on a green (Loyal) province on the map to recruit an army immediately.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {armies.map(army => {
                  const isSel = selectedArmyId === army.id;
                  const stationProv = country.regions.find(r => r.id === army.regionId)?.name || army.regionId;
                  const rebelProvinces = country.regions.filter(r => regionStatus[r.id]?.type === 'rebel');

                  return (
                    <div 
                      key={army.id} 
                      onClick={() => setSelectedArmyId(army.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                        isSel 
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {army.type === 'armored' ? '🛡️' : army.type === 'specops' ? '🛩️' : army.type === 'artillery' ? '🎯' : '🪖'}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-100">{army.name}</div>
                            <div className="text-[10px] text-slate-400">Location: <strong className="text-emerald-400">{stationProv}</strong></div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          army.status === 'sieging' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {army.status === 'sieging' ? 'Sieging' : 'Ready'}
                        </span>
                      </div>

                      {/* Army HP Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Strength / Durability</span>
                          <span className="text-emerald-400 font-bold">{army.hp} / {army.maxHp} HP</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${(army.hp / army.maxHp) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Orders & Action Dropdowns */}
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {rebelProvinces.length > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderAssault(army.id, rebelProvinces[0].id);
                            }}
                            className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer shadow-sm"
                          >
                            ⚔️ Assault ({rebelProvinces[0].name})
                          </button>
                        ) : (
                          <div className="text-[10px] text-emerald-400 font-bold">Victory Achieved</div>
                        )}

                        {rebelProvinces.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderSiege(army.id, rebelProvinces[0].id);
                            }}
                            className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                          >
                            🛡️ Siege
                          </button>
                        )}
                      </div>

                      <div className="flex justify-end pt-1 border-t border-slate-700/30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDisbandArmy(army.id);
                          }}
                          className="text-[9px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider"
                        >
                          Disband (+₺8k)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

      {/* STRATEGIC ORDNANCE FACTORY & BOMB PRODUCTION MODAL */}
      {showOrdnanceFactory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/40 text-slate-100 shadow-2xl flex flex-col gap-4 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2 tracking-tight">
                    HISTORICAL ORDNANCE FACTORY & ARSENAL
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded uppercase font-bold">
                      ERA {scenario}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manufacture authentic historical aerial bombs and munitions from {scenario} to bomb rebel fortifications.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowOrdnanceFactory(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Current Military Budget banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
              <span className="text-xs text-slate-400">Available Military Operations Budget:</span>
              <span className="text-base font-black text-amber-400">₺{militaryBudget.toLocaleString()}</span>
            </div>

            {/* Bombs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HISTORICAL_BOMBS.filter(b => b.era === scenario || (scenario === '2026' ? b.era === '2026' : b.era === scenario)).map(bomb => {
                const owned = inventoryBombs[bomb.id] || 0;
                const canAfford = militaryBudget >= bomb.cost;

                return (
                  <div 
                    key={bomb.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{bomb.icon}</span>
                          <div>
                            <div className="font-bold text-xs text-slate-100">{bomb.name}</div>
                            <div className="text-[10px] text-amber-400 font-mono uppercase">{bomb.type} Ordnance</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          x{owned} Owned
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        {bomb.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-mono">
                        <span className="text-rose-400 font-bold">💥 {bomb.damage} Blast Dmg</span>
                        <span className="text-amber-400 font-bold">₺{bomb.cost.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleManufactureBomb(bomb.id)}
                        disabled={!canAfford}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Produce (₺{bomb.cost / 1000}k)
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBombToDrop(bomb.id);
                          setShowOrdnanceFactory(false);
                          playSound('click');
                          addLog(`🎯 TARGETING ACTIVE: Click any red rebel province to deploy ${bomb.name}!`);
                        }}
                        disabled={owned === 0}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          owned > 0
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                            : 'bg-slate-800/60 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" /> Deploy Strike
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowOrdnanceFactory(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close Arsenal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
