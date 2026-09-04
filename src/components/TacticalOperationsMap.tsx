/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Country, ScenarioYear } from '../types';
import { PLAYABLE_COUNTRIES, countryColors } from '../constants/countries';
import { getPlayableCountriesForScenario } from '../constants/eraCountries';
import { INITIAL_CIVIL_WARS, isCountryInCivilWar, getCivilWarState } from '../constants/civilWarData';
import { CountryInfoSidePanel, CountryInfoData } from './CountryInfoSidePanel';
import { 
  Globe, Shield, Swords, Users, Landmark, AlertTriangle, 
  MapPin, Flag, Award, Eye, Crosshair, ChevronRight, Activity,
  Info, Zap, BarChart2, Flame
} from 'lucide-react';
import { playSound } from '../lib/sounds';

export type TacticalMapLayer = 'FREEDOM' | 'IDEOLOGY' | 'ACTIVE_WAR' | 'INFLUENCE' | 'CIVIL_WARS';

interface TacticalOperationsMapProps {
  country: Country;
  party: { name: string; ideology?: string };
  civilWarRisk?: number;
  freedomIndex?: number;
  internationalReputation?: number;
  countryIdeologies?: Record<string, string>;
  countryFreedomScores?: Record<string, number>;
  diplomaticRelations?: Record<string, { status: string; opinion: number; alliance?: boolean }>;
  scenario?: ScenarioYear;
  darkMode: boolean;
  playerTreasury?: number;
  onDeclareWar?: (countryId: string) => void;
  onProposeAlliance?: (countryId: string) => void;
  onTradeDeal?: (countryId: string) => void;
  onSendAid?: (countryId: string) => void;
  onOpenEmbassy?: (countryId: string) => void;
  onCivilWarAction?: (countryId: string, actionType: 'RECOGNIZE_GOV' | 'RECOGNIZE_REBEL' | 'AID_GOV' | 'AID_REBEL' | 'INTERVENE', factionId?: string) => void;
}

const getScenarioBg = (scenarioId: string) => {
  switch (scenarioId) {
    case '2026': return '/bg-2026.svg';
    case '1950': return '/bg-1950.svg';
    case '1936': return '/bg-1936.svg';
    case '1914': return '/bg-1914.svg';
    case '1920': return '/bg-1920.svg';
    default: return '/bg-2026.svg';
  }
};

export const TacticalOperationsMap: React.FC<TacticalOperationsMapProps> = ({
  country,
  party,
  civilWarRisk = 15,
  freedomIndex = 72,
  internationalReputation = 65,
  countryIdeologies = {},
  countryFreedomScores = {},
  diplomaticRelations = {},
  scenario = '2026',
  darkMode,
  playerTreasury = 100000,
  onDeclareWar,
  onProposeAlliance,
  onTradeDeal,
  onSendAid,
  onOpenEmbassy,
  onCivilWarAction,
}) => {
  const activeScenarioId: ScenarioYear = (scenario as ScenarioYear) || '2026';
  const activeCountries = getPlayableCountriesForScenario(activeScenarioId);

  const [activeLayer, setActiveLayer] = useState<TacticalMapLayer>('FREEDOM');
  const [selectedIntelCountry, setSelectedIntelCountry] = useState<Country | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [panelAnchor, setPanelAnchor] = useState<{ x: number; y: number } | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active wars definition per scenario and dynamic diplomatic state
  const getActiveWarDetails = (cId: string) => {
    // 1. Dynamic check from actual diplomatic state
    if (diplomaticRelations && (diplomaticRelations[cId] as any)?.status === 'At War') {
      return {
        war: `Sovereign War vs ${country.name}`,
        belligerent: 'Active Hostile Frontline',
        intensity: 'Critical'
      };
    }
    if (cId === country.id) {
      const hasActiveWar = Object.values(diplomaticRelations || {}).some(r => (r as any)?.status === 'At War');
      if (hasActiveWar) {
        return {
          war: 'National Mobilization Defense',
          belligerent: 'Sovereign Homeland Command',
          intensity: 'Critical'
        };
      }
    }

    // 2. Scenario-specific historical/active conflicts
    if (activeScenarioId === '2026') {
      if (['RU', 'UA'].includes(cId)) return { war: 'Russo-Ukrainian War', belligerent: 'Active Combatant', intensity: 'High' };
      if (['IL', 'PS'].includes(cId)) return { war: 'Middle East Conflict', belligerent: 'Active Combatant', intensity: 'High' };
      if (['SD', 'MM', 'SY', 'LY', 'YE', 'SO', 'ML', 'CD', 'ET', 'HT'].includes(cId)) {
        return { war: 'Civil Armed Conflict', belligerent: 'Civil War Theater', intensity: 'Critical' };
      }
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
    if (['SU', 'DDR', 'CN', 'CS', 'BY', 'KP', 'IR', 'SY', 'MM', 'SD', 'YE', 'HT'].includes(cId)) return 14;
    if (['US', 'GB', 'FR', 'DE', 'CA', 'AU', 'IS', 'PT', 'BE', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH', 'AT', 'NZ', 'IE'].includes(cId)) return 92;
    if (['TR', 'PL', 'RO', 'HU', 'IT', 'ES', 'CL', 'GR', 'BG', 'HR', 'RS', 'BR', 'MX', 'AR', 'IN', 'ID', 'ZA'].includes(cId)) return 68;
    return 48;
  };

  const getIdeologyLabel = (cId: string): string => {
    if (cId === country.id && party) {
      const pName = (party.name || '').toLowerCase();
      const pIdeo = (party.ideology || '').toLowerCase();
      if (pName.includes('rassemblement national') || pName.includes('rn') || pIdeo.includes('national') || pIdeo.includes('populism') || pName.includes('zafer') || pName.includes('mhp') || pName.includes('afd')) {
        return 'Right-Wing Nationalist';
      }
      if (pIdeo.includes('socialist') || pIdeo.includes('communist') || pIdeo.includes('marxist')) {
        return 'Socialist / Left';
      }
      if (pIdeo.includes('social dem') || pIdeo.includes('chp') || pIdeo.includes('labour') || pIdeo.includes('spd') || pIdeo.includes('democrat')) {
        return 'Social Democrat';
      }
      if (pIdeo.includes('conservative') || pIdeo.includes('cdu') || pIdeo.includes('akp') || pIdeo.includes('tory') || pIdeo.includes('republican')) {
        return 'Conservative';
      }
      if (pIdeo.includes('liberal') || pIdeo.includes('fdp') || pIdeo.includes('iyip') || pIdeo.includes('renaissance')) {
        return 'Liberal Centrist';
      }
      return party.ideology || 'Centrist';
    }

    if (countryIdeologies[cId]) return countryIdeologies[cId];

    if (activeScenarioId === '2026') {
      if (['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'NZ'].includes(cId)) return 'Liberal Democracy';
      if (['RU', 'BY'].includes(cId)) return 'Authoritarian Conservative';
      if (['CN', 'KP', 'CU', 'VN'].includes(cId)) return 'Marxist-Leninist State';
      if (['TR', 'HU', 'PL', 'RS'].includes(cId)) return 'Sovereign Conservative';
      if (['IR', 'SA', 'QA'].includes(cId)) return 'Theocratic Monarchy / Islamic';
      if (['SY', 'SD', 'MM', 'YE', 'LY', 'SO', 'ML', 'CD', 'ET', 'HT'].includes(cId)) return 'Civil Conflict Transitional';
    }

    return 'Sovereign Republic';
  };

  // Convert selected country to CountryInfoData format
  const sidePanelData: CountryInfoData | null = useMemo(() => {
    if (!selectedIntelCountry) return null;
    const cId = selectedIntelCountry.id;
    const isPlayer = cId === country.id;
    const rel = diplomaticRelations[cId];
    const cw = getCivilWarState(cId);

    // Find ruling party
    let rPartyName = 'Government Council';
    let rLeader = 'Head of State';
    let rIdeology = getIdeologyLabel(cId);
    let rColor = selectedIntelCountry.primaryColor || '#3b82f6';

    if (isPlayer) {
      rPartyName = party.name;
      rLeader = 'Player Commander';
      rIdeology = party.ideology || 'Democratic Sovereign';
      rColor = selectedIntelCountry.primaryColor || '#6366f1';
    } else if (selectedIntelCountry.rivals && selectedIntelCountry.rivals.length > 0) {
      const topParty = selectedIntelCountry.rivals.reduce((prev, curr) => (curr.baseSupport > prev.baseSupport ? curr : prev), selectedIntelCountry.rivals[0]);
      rPartyName = topParty.name;
      rLeader = topParty.leader || 'Party Leader';
      rIdeology = topParty.ideology || rIdeology;
      rColor = topParty.color || rColor;
    }

    // Active wars
    const warsList: Array<{ enemyName: string; enemyFlag: string; frontStatus: string }> = [];
    const warDetails = getActiveWarDetails(cId);
    if (warDetails) {
      if (cId === 'RU') warsList.push({ enemyName: 'Ukraine', enemyFlag: '🇺🇦', frontStatus: 'High Intensity Front' });
      else if (cId === 'UA') warsList.push({ enemyName: 'Russia', enemyFlag: '🇷🇺', frontStatus: 'Territorial Defense' });
      else if (cId === 'IL') warsList.push({ enemyName: 'Gaza & Regional Fronts', enemyFlag: '🇵🇸', frontStatus: 'Active Strikes' });
      else if (cId === 'PS') warsList.push({ enemyName: 'Israel', enemyFlag: '🇮🇱', frontStatus: 'Besieged Frontline' });
      else if (cw) warsList.push({ enemyName: 'Internal Faction Insurgency', enemyFlag: '⚠️', frontStatus: `${cw.monthlyCasualties} Casualties/Mo` });
      else if (rel && rel.status === 'At War') warsList.push({ enemyName: country.name, enemyFlag: country.flag, frontStatus: 'Sovereign Hostility' });
    }

    // Alliances
    const alliancesList: string[] = [];
    if (['US', 'GB', 'FR', 'DE', 'IT', 'CA', 'TR', 'PL', 'NO', 'NL', 'BE', 'ES', 'PT', 'GR', 'RO', 'IS', 'SE', 'FI'].includes(cId)) {
      alliancesList.push('NATO');
    }
    if (['FR', 'DE', 'IT', 'ES', 'PL', 'RO', 'NL', 'BE', 'SE', 'PT', 'GR', 'AT', 'FI', 'IE'].includes(cId)) {
      alliancesList.push('European Union');
    }
    if (['RU', 'BY', 'KZ', 'KG', 'TJ', 'AM'].includes(cId)) {
      alliancesList.push('CSTO');
    }
    if (['CN', 'RU', 'KZ', 'UZ', 'TJ', 'KG', 'IN', 'PK', 'IR'].includes(cId)) {
      alliancesList.push('SCO');
    }
    if (rel && (rel.status === 'Alliance' || rel.status === 'Defensive Pact')) {
      alliancesList.push(`Pact with ${country.name}`);
    }

    // Stability & Next Election
    let stabilityVal = isPlayer ? (100 - civilWarRisk) : 74;
    let nextElectionStr = 'November 2028 (Scheduled)';

    if (cw && cw.status === 'ACTIVE') {
      stabilityVal = cw.stability;
      nextElectionStr = 'No scheduled elections (Civil Conflict)';
    } else if (getFreedomScore(cId) < 25 || ['SA', 'QA', 'OM', 'AE', 'KP', 'CN', 'CU', 'VN', 'BY'].includes(cId)) {
      nextElectionStr = 'No scheduled elections (Autocratic State)';
    } else if (isPlayer) {
      nextElectionStr = 'End of Legislative Term';
    }

    // Recent news
    const newsList: string[] = [];
    if (cw && cw.status === 'ACTIVE') {
      newsList.push(`Heavy clashes reported between ${cw.factions[0]?.name} and armed opposition factions.`);
      newsList.push(`UN human rights delegation issues emergency report on internal displaced populations.`);
      newsList.push(`Regional peace talks stalled over territorial recognition demands.`);
    } else if (warsList.length > 0) {
      newsList.push(`Supreme Command announces expanded military mobilization and logistics reinforcement.`);
      newsList.push(`Diplomatic envoys convene multilateral security summit in Switzerland.`);
      newsList.push(`Parliament authorizes supplemental war bonds and defense appropriations.`);
    } else {
      newsList.push(`Central bank announces monetary policy adjustment to stabilize annual inflation targets.`);
      newsList.push(`Legislative assembly introduces comprehensive infrastructure and energy modernization bill.`);
      newsList.push(`Bilateral trade delegates conclude strategic maritime export tariff framework.`);
    }

    return {
      id: cId,
      name: selectedIntelCountry.name,
      flag: selectedIntelCountry.flag,
      system: selectedIntelCountry.system,
      rulingParty: {
        name: rPartyName,
        leader: rLeader,
        ideology: rIdeology,
        color: rColor,
      },
      population: selectedIntelCountry.population || '45.2 Million',
      gdp: `$${(Math.round(selectedIntelCountry.seats * 12.5) / 10).toFixed(1)} Trillion`,
      militaryStrength: `${Math.round(selectedIntelCountry.seats * 3.8 + 80)}k Active Forces`,
      treasury: `$${Math.round(selectedIntelCountry.seats * 1.5 + 25)} Billion`,
      freedomIndex: getFreedomScore(cId),
      stability: stabilityVal,
      nextElection: nextElectionStr,
      wars: warsList,
      alliances: alliancesList,
      recentEvents: newsList,
      civilWar: cw,
      isPlayerCountry: isPlayer,
      playerRelation: rel ? {
        opinion: rel.opinion,
        status: rel.status as any,
        hasCB: false
      } : {
        opinion: 50,
        status: 'Neutral',
        hasCB: false
      }
    };
  }, [selectedIntelCountry, country, party, diplomaticRelations, activeScenarioId, civilWarRisk, freedomIndex]);


  // Load GeoJSON polygons
  useEffect(() => {
    let isMounted = true;

    const fetchJsonSafely = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) return null;
        const text = await res.text();
        if (text.trim().startsWith('<')) return null;
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    const fetchUrls = [
      '/world_admin0_50m.geojson',
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson',
      'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    ];

    const fetchGeoData = async () => {
      for (const url of fetchUrls) {
        try {
          const data = await fetchJsonSafely(url);
          if (isMounted && data && data.features) {
            setGeoJsonData(data);
            setIsLoading(false);
            return;
          }
        } catch {
          // Ignore and continue to next fallback
        }
      }
      if (isMounted) setIsLoading(false);
    };

    fetchGeoData();
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

    // Dismiss floating country dossier when clicking empty map ocean/space
    map.on('click', () => {
      setIsSidePanelOpen(false);
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
      const ISO3_TO_ISO2: Record<string, string> = {
        USA: 'US', FRA: 'FR', TUR: 'TR', DEU: 'DE', GBR: 'GB', ITA: 'IT', RUS: 'RU', UKR: 'UA',
        CHN: 'CN', JPN: 'JP', POL: 'PL', HUN: 'HU', ROU: 'RO', GRC: 'GR', PRT: 'PT', ESP: 'ES',
        EGY: 'EG', BRA: 'BR', IND: 'IN', KOR: 'KR', CAN: 'CA', AUS: 'AU', CHL: 'CL', ISL: 'IS',
        BEL: 'BE', NLD: 'NL', CHE: 'CH', AUT: 'AT', SWE: 'SE', NOR: 'NO', DNK: 'DK', FIN: 'FI',
        BLR: 'BY', CZE: 'CZ', SVK: 'SK', BGR: 'BG', SRB: 'RS', HRV: 'HR', BIH: 'BA', SVN: 'SI',
        ALB: 'AL', MKD: 'MK', MNE: 'ME', IRL: 'IE', EST: 'EE', LVA: 'LV', LTU: 'LT', MDA: 'MD',
        GEO: 'GE', ARM: 'AM', AZE: 'AZ', KAZ: 'KZ', UZB: 'UZ', TKM: 'TM', TJK: 'TJ', KGZ: 'KG',
        SAU: 'SA', IRN: 'IR', IRQ: 'IQ', SYR: 'SY', ISR: 'IL', PSE: 'PS', JOR: 'JO', LBN: 'LB',
        ARE: 'AE', QAT: 'QA', KWT: 'KW', OMN: 'OM', YEM: 'YE', MEX: 'MX', ARG: 'AR', COL: 'CO',
        PER: 'PE', VEN: 'VE', ZAF: 'ZA', NGA: 'NG', DZA: 'DZ', MAR: 'MA', TUN: 'TN', LBY: 'LY',
        ETH: 'ET', KEN: 'KE', GHA: 'GH', SDN: 'SD', SSD: 'SS', SOM: 'SO', COD: 'CD', COG: 'CG',
        PAK: 'PK', BGD: 'BD', IDN: 'ID', MYS: 'MY', THA: 'TH', VNM: 'VN', PHL: 'PH', TWN: 'TW',
        PRK: 'KP', MNG: 'MN', AFG: 'AF', NZL: 'NZ', GUF: 'FR', GLP: 'FR', MTQ: 'FR', REU: 'FR', MYT: 'FR',
        NCL: 'FR', PYF: 'FR', US1: 'US', FR1: 'FR', GB1: 'GB', NL1: 'NL', DN1: 'DK', IT1: 'IT'
      };

      const getCountryCodeFromFeature = (f: any): string | null => {
        const props = f.properties || {};
        const iso3 = String(
          (props.ISO_A3 && props.ISO_A3 !== '-99') ? props.ISO_A3 :
          (props.iso_a3 && props.iso_a3 !== '-99') ? props.iso_a3 :
          (props.adm0_a3 && props.adm0_a3 !== '-99') ? props.adm0_a3 :
          (props.ADM0_A3 && props.ADM0_A3 !== '-99') ? props.ADM0_A3 :
          (props.sov_a3 && props.sov_a3 !== '-99') ? props.sov_a3 :
          (props.SOV_A3 && props.SOV_A3 !== '-99') ? props.SOV_A3 :
          (props.gu_a3 && props.gu_a3 !== '-99') ? props.gu_a3 :
          (props.su_a3 && props.su_a3 !== '-99') ? props.su_a3 :
          (f.id && String(f.id).length === 3 && f.id !== '-99') ? f.id : ''
        ).toUpperCase();

        if (iso3 && ISO3_TO_ISO2[iso3]) return ISO3_TO_ISO2[iso3];

        const iso2 = String(props.ISO_A2 || props.iso_a2 || '').toUpperCase();
        if (iso2 && iso2.length === 2 && iso2 !== '-99') return iso2;

        return null;
      };

      const tacticalGeoLayer = L.geoJSON(geoJsonData, {
        style: (feature: any) => {
          const cId = getCountryCodeFromFeature(feature);

          // All borders 1px solid white #ffffff, no glow/gradients
          let borderColor = '#ffffff';
          let weight = (cId && cId === country.id) ? 2.5 : 1;
          let fillOpacity = 0.85;

          if (!cId) {
            // Unassigned country with no game data: fill neutral gray #4a4a4a
            return {
              fillColor: '#4a4a4a',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.8,
              interactive: true
            };
          }

          let fillColor = '#4a4a4a';

          if (activeLayer === 'FREEDOM') {
            const score = getFreedomScore(cId);
            if (score >= 70) fillColor = '#16a34a'; // Free
            else if (score >= 40) fillColor = '#d97706'; // Partly Free
            else fillColor = '#dc2626'; // Not Free
          } else if (activeLayer === 'IDEOLOGY') {
            const ideo = getIdeologyLabel(cId).toLowerCase();
            if (ideo.includes('communist') || ideo.includes('marxist') || ideo.includes('socialist') || ideo.includes('left')) {
              fillColor = '#dc2626'; // Red (Left / Socialist)
            } else if (ideo.includes('nationalist') || ideo.includes('sovereign right') || ideo.includes('populism')) {
              fillColor = '#1e3a8a'; // Dark Navy Blue (Right / Nationalist)
            } else if (ideo.includes('conservative') || ideo.includes('christian')) {
              fillColor = '#2563eb'; // Royal Blue (Right / Conservative)
            } else if (ideo.includes('social dem') || ideo.includes('progressive')) {
              fillColor = '#0891b2'; // Cyan / Teal (Center-Left)
            } else if (ideo.includes('centrist') || ideo.includes('liberal') || ideo.includes('pro-european')) {
              fillColor = '#eab308'; // Amber / Yellow (Center / Liberal)
            } else if (ideo.includes('traditionalist')) {
              fillColor = '#7c3aed'; // Purple (Traditionalist)
            } else {
              fillColor = '#4a4a4a';
            }
          } else if (activeLayer === 'CIVIL_WARS') {
            const isCW = isCountryInCivilWar(cId);
            if (isCW) {
              fillColor = '#b91c1c'; // Dark Red for civil war state
              fillOpacity = 0.9;
              borderColor = '#f59e0b'; // Amber border
              weight = 2;
            } else {
              fillColor = darkMode ? '#1e293b' : '#94a3b8';
              fillOpacity = 0.35;
            }
          } else if (activeLayer === 'ACTIVE_WAR') {
            const warInfo = getActiveWarDetails(cId);
            if (warInfo) {
              fillColor = warInfo.intensity === 'Critical' ? '#e11d48' : '#ea580c';
              fillOpacity = 0.95;
              borderColor = '#ffffff';
              weight = 2;
            } else {
              fillColor = darkMode ? '#334155' : '#64748b';
              fillOpacity = 0.45;
            }
          } else if (activeLayer === 'INFLUENCE') {
            if (cId === country.id) fillColor = '#6366f1';
            else if (['US', 'GB', 'FR', 'DE'].includes(cId)) fillColor = '#0284c7';
            else if (['RU', 'CN'].includes(cId)) fillColor = '#b91c1c';
            else fillColor = '#4a4a4a';
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
          const rawName = feature.properties?.name || feature.properties?.name_long || feature.properties?.ADMIN || feature.properties?.sovereignt || 'Sovereign Territory';
          const matchedCountry = cId ? (activeCountries.find(c => c.id === cId) || PLAYABLE_COUNTRIES.find(c => c.id === cId)) : null;
          const cName = matchedCountry ? matchedCountry.name : rawName;
          const war = cId ? getActiveWarDetails(cId) : null;
          const cw = cId ? getCivilWarState(cId) : null;
          const freedom = cId ? getFreedomScore(cId) : 50;
          const ideology = cId ? getIdeologyLabel(cId) : 'Neutral / Non-Aligned';

          layer.bindTooltip(`
            <div style="font-family: inherit; font-size: 11px; padding: 4px; color: #ffffff; background: #0f172a; border-radius: 6px;">
              <div style="font-weight: 900; text-transform: uppercase; margin-bottom: 3px; font-size: 12px;">${cName} ${cId ? `(${cId})` : ''}</div>
              <div>🕊️ Freedom Index: <strong>${freedom}/100</strong></div>
              <div>⚖️ Ideology: <strong>${ideology}</strong></div>
              ${cw ? `<div style="color: #f59e0b; font-weight: 800; margin-top: 3px;">🔥 Civil War: Stability ${cw.stability}% (${cw.factions.length} Factions)</div>` : ''}
              ${war && !cw ? `<div style="color: #f43f5e; font-weight: 800; margin-top: 3px;">⚔️ ${war.war} (${war.belligerent})</div>` : ''}
            </div>
          `, {
            sticky: true,
            direction: 'top',
            className: darkMode ? 'dark-tactical-tooltip' : 'light-tactical-tooltip'
          });

          layer.on('click', (e: any) => {
            if (e && e.originalEvent) {
              L.DomEvent.stopPropagation(e);
            }
            if (e && e.containerPoint) {
              setPanelAnchor({ x: e.containerPoint.x, y: e.containerPoint.y });
            }
            if (matchedCountry) {
              setSelectedIntelCountry(matchedCountry);
              setIsSidePanelOpen(true);
              playSound('click');
            } else if (cId) {
              // Create temporary country object for non-playable countries
              const tempCountry: Country = {
                id: cId,
                name: cName,
                flag: '🌐',
                seats: 120,
                system: 'Sovereign Republic',
                parliamentName: 'National Assembly',
                population: '38.5 Million',
                description: `Sovereign territorial state ${cName}.`,
                regions: [],
                rivals: [],
                bills: [],
                campaignTurns: 10,
                electionCycleYears: 4,
                primaryColor: '#64748b'
              };
              setSelectedIntelCountry(tempCountry);
              setIsSidePanelOpen(true);
              playSound('click');
            }
          });
        }
      });

      layerGroupRef.current.addLayer(tacticalGeoLayer);
    }
  }, [activeLayer, geoJsonData, country, party, freedomIndex, civilWarRisk, darkMode, diplomaticRelations, countryIdeologies, countryFreedomScores]);

  // Calculate floating dossier panel position anchored near clicked country
  const getPanelPositionStyle = (): React.CSSProperties => {
    if (!containerRef.current || !panelAnchor) {
      return { top: '16px', left: '16px' };
    }
    const containerWidth = containerRef.current.clientWidth || 900;
    const containerHeight = containerRef.current.clientHeight || 600;
    const panelWidth = Math.min(380, containerWidth - 32);

    if (containerWidth < 640) {
      return { top: '16px', left: '16px', right: '16px', maxWidth: 'calc(100% - 32px)' };
    }

    let targetLeft: number;
    if (panelAnchor.x > containerWidth / 2) {
      // Clicked on the right half: float to the left of the click
      targetLeft = Math.max(16, panelAnchor.x - panelWidth - 20);
    } else {
      // Clicked on the left half: float to the right of the click
      targetLeft = Math.min(containerWidth - panelWidth - 16, panelAnchor.x + 20);
    }

    // Clamp Y neatly inside viewport
    const targetTop = Math.max(16, Math.min(containerHeight * 0.25, Math.max(16, panelAnchor.y - 40)));

    return {
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
    };
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in relative">
      {/* Tactical Header Controls */}
      <div 
        className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
          darkMode ? 'border-slate-800 text-slate-100 shadow-xl' : 'border-slate-200 text-slate-900 shadow-sm'
        }`}
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(135deg, rgba(15, 23, 42, 0.50), rgba(2, 6, 23, 0.50)), url(${getScenarioBg(activeScenarioId)})`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.50), rgba(248, 250, 252, 0.50)), url(${getScenarioBg(activeScenarioId)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-rose-500/20 flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Tactical Operations & Global Intelligence
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              {activeScenarioId} SCENARIO
            </span>
            {isSidePanelOpen && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                📋 INTEL DOSSIER ACTIVE
              </span>
            )}
          </div>
          <h2 className="text-xl font-black mt-1 flex items-center gap-2 font-mono">
            <span>🗺️</span> Global Geopolitical Theater ({country.name})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any sovereign nation to open its detailed intelligence dossier and diplomatic action console.
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
            onClick={() => { setActiveLayer('CIVIL_WARS'); playSound('click'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeLayer === 'CIVIL_WARS'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🔥</span> Civil Wars & Insurgencies
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

      {/* Map Main Stage with Floating Dossier Panel */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-3xl border overflow-hidden shadow-2xl min-h-[580px] flex"
      >
        {/* Floating Dossier Panel anchored inside Map Viewport */}
        {isSidePanelOpen && sidePanelData && (
          <div 
            style={getPanelPositionStyle()}
            className="absolute z-30 pointer-events-auto max-w-[380px] w-[calc(100%-2rem)] sm:w-[380px] max-h-[70%] flex flex-col transition-all duration-200"
          >
            <CountryInfoSidePanel
              country={sidePanelData}
              onClose={() => setIsSidePanelOpen(false)}
              onDeclareWar={onDeclareWar}
              onProposeAlliance={onProposeAlliance}
              onTradeDeal={onTradeDeal}
              onSendAid={onSendAid}
              onOpenEmbassy={onOpenEmbassy}
              onCivilWarAction={onCivilWarAction}
              playerTreasury={playerTreasury}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Leaflet Map Stage */}
        <div className={`w-full h-full min-h-[580px] relative flex flex-col ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-200'
        }`}>
          <div ref={mapRef} className="w-full flex-1 min-h-[580px] z-10" />

          {/* Quick Select Playable Strip on Map Bottom */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 max-w-[50%] overflow-x-auto p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
            {activeCountries.slice(0, 7).map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setPanelAnchor(null);
                  setSelectedIntelCountry(c);
                  setIsSidePanelOpen(true);
                  playSound('click');
                }}
                className={`px-2 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  selectedIntelCountry?.id === c.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{c.flag}</span>
                <span className="hidden sm:inline">{c.id}</span>
              </button>
            ))}
          </div>

          {/* Layer Legend Overlay */}
          <div className="absolute bottom-4 right-4 z-20 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono shadow-xl flex flex-col gap-1.5 max-w-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              {activeLayer === 'FREEDOM' && '🕊️ Freedom Score Legend'}
              {activeLayer === 'IDEOLOGY' && '⚖️ Ideological Spectrum'}
              {activeLayer === 'CIVIL_WARS' && '🔥 Active Civil Wars & Insurgencies'}
              {activeLayer === 'ACTIVE_WAR' && '⚔️ Frontline Intensity'}
              {activeLayer === 'INFLUENCE' && '🌐 Geopolitical Bloc'}
            </span>
            {activeLayer === 'FREEDOM' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Free (70+)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Partly (40-69)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Not Free (&lt;40)</span>
              </div>
            )}
            {activeLayer === 'CIVIL_WARS' && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-700 animate-ping" />
                  <span className="text-rose-300 font-bold">10 Active Civil War Theaters</span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Syria, Libya, Sudan, Myanmar, Yemen, Somalia, Mali, DR Congo, Ethiopia, Haiti. Stability &lt; 30.
                </div>
              </div>
            )}
            {activeLayer === 'IDEOLOGY' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-700" /> Left</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Conservative</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-600" /> SocDem</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-600" /> Centrist</span>
              </div>
            )}
            {activeLayer === 'ACTIVE_WAR' && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" /> Combat Zone</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Peace</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
