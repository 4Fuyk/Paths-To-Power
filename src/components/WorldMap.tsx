/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Country, ScenarioYear } from '../types';
import { PLAYABLE_COUNTRIES, countryColors } from '../constants/countries';
import { getPlayableCountriesForScenario } from '../constants/eraCountries';
import { HISTORICAL_SCENARIOS } from '../constants/scenarios';
import { 
  Globe, Trophy, Users, Landmark, Vote, ArrowRight, HelpCircle, 
  RotateCcw, ZoomIn, ZoomOut, Search, Compass, Info,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Map as MapIcon,
  Calendar, ShieldAlert
} from 'lucide-react';
import L from 'leaflet';

interface WorldMapProps {
  completedCountries: string[];
  countryWinCounts: Record<string, number>;
  onSelectCountry: (country: Country) => void;
  darkMode: boolean;
  scenario?: ScenarioYear;
  countryIdeologies?: Record<string, string>;
  countryFreedomScores?: Record<string, number>;
}

const countryCoords: Record<string, [number, number]> = {
  US: [38.0, -97.0],
  BR: [-14.235, -51.925],
  GB: [55.378, -3.436],
  DE: [50.7374, 7.0982], // Bonn / West Germany
  DDR: [52.5200, 13.4050], // Berlin / East Germany
  SU: [55.7558, 37.6173], // Moscow / Soviet Union
  CS: [49.8175, 15.4730], // Prague / Czechoslovakia
  PL: [52.0693, 19.4803], // Warsaw / Poland
  CN: [35.8617, 104.1954], // Beijing / China
  YU: [44.0165, 21.0059], // Belgrade / Yugoslavia
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
  AU: [-25.274, 133.775],
  FR: [46.227, 2.213],
  RO: [45.943, 24.966],
  HU: [47.162, 19.503],
  TW: [23.6978, 120.9605],
  RU: [61.524, 105.3188],
  CL: [-35.6751, -71.543],
  IS: [64.9631, -19.0208],
  PT: [39.3999, -8.2245],
  GR: [39.0742, 21.8243]
};

const englishNames: Record<string, string> = {
  TR: "Turkey",
  US: "United States of America",
  DE: "Federal Republic of Germany",
  DDR: "German Democratic Republic",
  SU: "Union of Soviet Socialist Republics",
  CS: "Czechoslovak Republic",
  PL: "Poland",
  CN: "People's Republic of China",
  YU: "FPR Yugoslavia",
  GB: "United Kingdom",
  BR: "Brazil",
  EG: "Egypt",
  JP: "Japan",
  CA: "Canada",
  AR: "Argentina",
  ZA: "South Africa",
  IN: "India",
  IT: "Italian Republic",
  ID: "Indonesia",
  MX: "Mexico",
  ES: "Spain",
  KR: "Korea",
  AU: "Australia",
  FR: "France",
  RO: "Romania",
  HU: "Hungary",
  TW: "Republic of China (Taiwan)",
  RU: "Russian Federation",
  CL: "Republic of Chile",
  IS: "Iceland",
  PT: "Portuguese Republic",
  GR: "Hellenic Republic"
};

const countryRadii: Record<string, number> = {
  US: 850000,
  BR: 800000,
  GB: 380000,
  DE: 320000,
  DDR: 220000,
  SU: 1300000,
  CS: 260000,
  PL: 360000,
  CN: 950000,
  YU: 300000,
  TR: 480000,
  EG: 450000,
  JP: 400000,
  CA: 950000,
  AR: 600000,
  ZA: 500000,
  IN: 650000,
  IT: 300000,
  ID: 700000,
  MX: 600000,
  ES: 350000,
  KR: 200000,
  AU: 850000,
  FR: 350000,
  RO: 300000,
  HU: 250000,
  TW: 200000,
  RU: 1300000,
  CL: 650000,
  IS: 250000,
  PT: 300000,
  GR: 280000
};

export type MapFilterMode = 'POLITICAL' | 'FREEDOM' | 'IDEOLOGY' | 'ACTIVE_WAR';

export const WorldMap: React.FC<WorldMapProps> = ({
  completedCountries,
  countryWinCounts,
  onSelectCountry,
  darkMode,
  scenario = '2026',
  countryIdeologies = {},
  countryFreedomScores = {},
}) => {
  const activeScenarioId: ScenarioYear = (scenario as ScenarioYear) || '2026';
  const activeCountries = getPlayableCountriesForScenario(activeScenarioId);
  const activeScenarioMeta = HISTORICAL_SCENARIOS.find(s => s.id === activeScenarioId) || HISTORICAL_SCENARIOS[0];

  const [mapMode, setMapMode] = useState<MapFilterMode>('POLITICAL');
  const [selectedPreview, setSelectedPreview] = useState<Country | null>(activeCountries[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursorCoords, setCursorCoords] = useState({ lat: 0.0, lng: 0.0 });
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [germanStatesData, setGermanStatesData] = useState<any>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState<boolean>(true);

  // Synchronize selectedPreview if scenario changes
  useEffect(() => {
    const list = getPlayableCountriesForScenario((scenario as ScenarioYear) || '2026');
    if (list.length > 0) {
      setSelectedPreview(list[0]);
    }
  }, [scenario]);

  // Keyboard based panning and zoom controls for WASD, Arrow Keys and +/-
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid tracking keystrokes if the player is typing in research search inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        mapInstanceRef.current?.panBy([0, -150]);
      } else if (key === 'arrowdown' || key === 's') {
        mapInstanceRef.current?.panBy([0, 150]);
      } else if (key === 'arrowleft' || key === 'a') {
        mapInstanceRef.current?.panBy([-150, 0]);
      } else if (key === 'arrowright' || key === 'd') {
        mapInstanceRef.current?.panBy([150, 0]);
      } else if (key === 'r') {
        handleResetView();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredCountries = activeCountries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const terrainLayerRef = useRef<L.TileLayer | null>(null);
  const oceanLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<any[]>([]);

  // Helper to determine the country ID from GeoJSON feature
  const getPlayableCountryCode = (feature: any): string | null => {
    if (!feature) return null;
    const id3 = String(feature.id || feature.properties?.ISO_A3 || feature.properties?.iso_a3 || '').toUpperCase();
    const id2 = String(feature.properties?.ISO_A2 || feature.properties?.iso_a2 || '').toUpperCase();
    const name = String(feature.properties?.name || feature.properties?.NAME || '').toUpperCase();

    // 1. Check if Soviet Union / All 15 Republics unified under Soviet Union
    const isSovietRepublic = 
      id3 === 'RUS' || id3 === 'SUN' || id3 === 'BLR' || id3 === 'UKR' || id3 === 'KAZ' ||
      id3 === 'UZB' || id3 === 'TKM' || id3 === 'TJK' || id3 === 'KGZ' || id3 === 'GEO' ||
      id3 === 'ARM' || id3 === 'AZE' || id3 === 'MDA' || id3 === 'EST' || id3 === 'LVA' || id3 === 'LTU' ||
      name.includes('RUSSIA') || name.includes('SOVIET') || name.includes('BELARUS') || name.includes('BYELORUSSIA') ||
      name.includes('UKRAINE') || name.includes('KAZAKHSTAN') || name.includes('UZBEKISTAN') ||
      name.includes('TURKMENISTAN') || name.includes('TAJIKISTAN') || name.includes('KYRGYZSTAN') ||
      name.includes('GEORGIA') || name.includes('ARMENIA') || name.includes('AZERBAIJAN') ||
      name.includes('MOLDOVA') || name.includes('ESTONIA') || name.includes('LATVIA') || name.includes('LITHUANIA');

    if (isSovietRepublic && activeCountries.some(c => c.id === 'SU')) {
      return 'SU';
    }

    // 2. Check Czechoslovakia
    const isCzechoslovakia = 
      id3 === 'CZE' || id3 === 'SVK' || id3 === 'CSK' ||
      name.includes('CZECH') || name.includes('SLOVAKIA') || name.includes('CZECHOSLOVAKIA');

    if (isCzechoslovakia && activeCountries.some(c => c.id === 'CS')) {
      return 'CS';
    }

    // 3. Check Poland
    if (id3 === 'POL' || id2 === 'PL' || name.includes('POLAND')) {
      if (activeCountries.some(c => c.id === 'PL')) return 'PL';
    }

    // 4. Check China
    if (id3 === 'CHN' || id2 === 'CN' || name.includes('CHINA')) {
      if (activeCountries.some(c => c.id === 'CN')) return 'CN';
    }

    // 5. Check Yugoslavia
    const isYugoslavia = 
      id3 === 'SRB' || id3 === 'HRV' || id3 === 'SVN' || id3 === 'BIH' || id3 === 'MKD' || id3 === 'MNE' || id3 === 'KOS' || id3 === 'KVX' || id3 === 'YUG' ||
      name.includes('SERBIA') || name.includes('CROATIA') || name.includes('SLOVENIA') || name.includes('BOSNIA') ||
      name.includes('MACEDONIA') || name.includes('MONTENEGRO') || name.includes('KOSOVO') || name.includes('YUGOSLAVIA');

    if (isYugoslavia && activeCountries.some(c => c.id === 'YU')) {
      return 'YU';
    }

    // 6. Check East Germany (DDR) vs West Germany (DE)
    if (id3 === 'DDR' || name === 'EAST GERMANY' || name === 'GERMAN DEMOCRATIC REPUBLIC' || name === 'DDR' || name === 'GDR' || name.includes('GERMAN DEMOCRATIC')) {
      if (activeCountries.some(c => c.id === 'DDR')) return 'DDR';
    }

    if (id3 === 'DE_WEST' || name.includes('WEST GERMANY') || name === 'FEDERAL REPUBLIC OF GERMANY') {
      if (activeCountries.some(c => c.id === 'DE')) return 'DE';
    }

    if (id3 === 'DEU' || id2 === 'DE' || name === 'GERMANY') {
      if (activeCountries.some(c => c.id === 'DE')) return 'DE';
      if (activeCountries.some(c => c.id === 'DDR')) return 'DDR';
    }

    if (id3 === 'TUR' || id2 === 'TR' || name.includes('TURKEY') || name.includes('TURKIYE')) {
      if (activeCountries.some(c => c.id === 'TR')) return 'TR';
    }
    if (id3 === 'USA' || id2 === 'US' || name.includes('UNITED STATES') || name === 'USA') {
      if (activeCountries.some(c => c.id === 'US')) return 'US';
    }
    if (id3 === 'BRA' || id2 === 'BR' || name.includes('BRAZIL')) {
      if (activeCountries.some(c => c.id === 'BR')) return 'BR';
    }
    if (id3 === 'GBR' || id2 === 'GB' || name.includes('UNITED KINGDOM') || name === 'GREAT BRITAIN' || name === 'UK' ||
        (activeScenarioId === '1950' && (['KEN', 'UGA', 'NGA', 'GHA', 'MYS', 'CYP', 'TZA', 'ZMB', 'ZWE', 'SLE'].includes(id3) || name.includes('KENYA') || name.includes('NIGERIA') || name.includes('MALAYA')))) {
      if (activeCountries.some(c => c.id === 'GB')) return 'GB';
    }
    if (id3 === 'FRA' || id2 === 'FR' || name.includes('FRANCE') ||
        (activeScenarioId === '1950' && (id3 === 'DZA' || id3 === 'MDG' || id3 === 'GUF' || name.includes('ALGERIA') || name.includes('MADAGASCAR') || name.includes('FRENCH GUIANA')))) {
      if (activeCountries.some(c => c.id === 'FR')) return 'FR';
    }
    if (id3 === 'ITA' || id2 === 'IT' || name.includes('ITALY')) {
      if (activeCountries.some(c => c.id === 'IT')) return 'IT';
    }
    if (id3 === 'ROU' || id2 === 'RO' || name.includes('ROMANIA')) {
      if (activeCountries.some(c => c.id === 'RO')) return 'RO';
    }
    if (id3 === 'HUN' || id2 === 'HU' || name.includes('HUNGARY')) {
      if (activeCountries.some(c => c.id === 'HU')) return 'HU';
    }
    if (id3 === 'EGY' || id2 === 'EG' || name.includes('EGYPT')) {
      if (activeCountries.some(c => c.id === 'EG')) return 'EG';
    }
    if (id3 === 'JPN' || id2 === 'JP' || name.includes('JAPAN')) {
      if (activeCountries.some(c => c.id === 'JP')) return 'JP';
    }
    if (id3 === 'CAN' || id2 === 'CA' || name.includes('CANADA')) {
      if (activeCountries.some(c => c.id === 'CA')) return 'CA';
    }
    if (id3 === 'ARG' || id2 === 'AR' || name.includes('ARGENTINA')) {
      if (activeCountries.some(c => c.id === 'AR')) return 'AR';
    }
    if (id3 === 'ZAF' || id2 === 'ZA' || name.includes('SOUTH AFRICA')) {
      if (activeCountries.some(c => c.id === 'ZA')) return 'ZA';
    }
    if (id3 === 'IND' || id2 === 'IN' || name.includes('INDIA')) {
      if (activeCountries.some(c => c.id === 'IN')) return 'IN';
    }
    if (id3 === 'IDN' || id2 === 'ID' || name.includes('INDONESIA')) {
      if (activeCountries.some(c => c.id === 'ID')) return 'ID';
    }
    if (id3 === 'MEX' || id2 === 'MX' || name.includes('MEXICO')) {
      if (activeCountries.some(c => c.id === 'MX')) return 'MX';
    }
    if (id3 === 'ESP' || id2 === 'ES' || name.includes('SPAIN')) {
      if (activeCountries.some(c => c.id === 'ES')) return 'ES';
    }
    if (id3 === 'KOR' || id2 === 'KR' || name.includes('SOUTH KOREA') || name === 'KOREA, REPUBLIC OF') {
      if (activeCountries.some(c => c.id === 'KR')) return 'KR';
    }
    if (id3 === 'AUS' || id2 === 'AU' || name.includes('AUSTRALIA')) {
      if (activeCountries.some(c => c.id === 'AU')) return 'AU';
    }
    if (id3 === 'TWN' || id2 === 'TW' || name.includes('TAIWAN')) {
      if (activeCountries.some(c => c.id === 'TW')) return 'TW';
    }
    if (id3 === 'RUS' || id2 === 'RU' || name.includes('RUSSIA') || name.includes('RUSSIAN FEDERATION')) {
      if (activeCountries.some(c => c.id === 'RU')) return 'RU';
    }
    if (id3 === 'CHL' || id2 === 'CL' || name.includes('CHILE')) {
      if (activeCountries.some(c => c.id === 'CL')) return 'CL';
    }
    if (id3 === 'ISL' || id2 === 'IS' || name.includes('ICELAND')) {
      if (activeCountries.some(c => c.id === 'IS')) return 'IS';
    }
    if (id3 === 'PRT' || id2 === 'PT' || name.includes('PORTUGAL')) {
      if (activeCountries.some(c => c.id === 'PT')) return 'PT';
    }
    if (id3 === 'GRC' || id2 === 'GR' || name.includes('GREECE')) {
      if (activeCountries.some(c => c.id === 'GR')) return 'GR';
    }

    return null;
  };

  // Fetch beautiful low-res world boundaries + German states for precise 1950 DDR/FRG borders
  useEffect(() => {
    let active = true;
    fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json')
      .then(res => {
        if (!res.ok) throw new Error('Primary CDN failed');
        return res.json();
      })
      .catch(() => {
        return fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson')
          .then(res => res.json());
      })
      .then(data => {
        if (active && data) {
          setGeoJsonData(data);
          setIsLoadingGeoJson(false);
        }
      })
      .catch(err => {
        console.error("Could not load country polygons:", err);
        if (active) setIsLoadingGeoJson(false);
      });

    fetch('https://cdn.jsdelivr.net/gh/isellsoap/deutschlandGeoJSON@master/2_bundeslaender/4_niedrig.geo.json')
      .then(res => res.json())
      .then(data => {
        if (active && data) {
          setGermanStatesData(data);
        }
      })
      .catch(err => {
        console.warn("Could not load German federal states geojson:", err);
      });

    return () => { active = false; };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(mapRef.current, {
      center: [28, 12],
      zoom: 1.8,
      minZoom: 2.0,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: false,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1.0,
    });

    const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';

    const tiles = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 18,
      maxNativeZoom: 13,
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
      opacity: darkMode ? 0.16 : 0.22,
      maxZoom: 18,
      maxNativeZoom: 13,
      noWrap: true,
      bounds: [[-85, -180], [85, 180]],
      pane: 'terrainPane',
      className: darkMode ? 'terrain-tile-dark' : 'terrain-tile'
    }).addTo(map);
    terrainLayerRef.current = terrain;

    mapInstanceRef.current = map;

    // Capture coordinates under cursor on move over map
    map.on('mousemove', (e: any) => {
      const latlng = e.latlng;
      if (latlng) {
        setCursorCoords({ lat: latlng.lat, lng: latlng.lng });
      }
    });

    // Invalidate size to guarantee perfect layout inside container bounds
    setTimeout(() => { try { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); } catch(e) {} }, 300);

    return () => {
      try { map.off(); map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      terrainLayerRef.current = null;
    };
  }, []);

  // Update Map Tilings when DarkMode is toggled
  useEffect(() => {
    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}');
    }
    if (terrainLayerRef.current && mapInstanceRef.current) {
      terrainLayerRef.current.setOpacity(darkMode ? 0.28 : 0.35);
      const pane = mapInstanceRef.current.getPane('terrainPane');
      if (pane) {
        pane.style.mixBlendMode = 'overlay';
      }
      
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
  }, [darkMode]);

  // Synchronize Map Markers/Polygons with Completed/Selected countries and styles
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    try {
      mapInstanceRef.current.closeTooltip();
    } catch (e) {}

    // Remove obsolete layers
    markersRef.current.forEach(layer => {
      if (mapInstanceRef.current && mapInstanceRef.current.hasLayer(layer)) {
        try {
          if (typeof (layer as any).closeTooltip === 'function') {
            (layer as any).closeTooltip();
          }
        } catch (e) {}
        try {
          if (typeof (layer as any).unbindTooltip === 'function') {
            (layer as any).unbindTooltip();
          }
        } catch (e) {}
        try {
          if (typeof (layer as any).off === 'function') {
            (layer as any).off();
          }
        } catch (e) {}
        try {
          mapInstanceRef.current.removeLayer(layer);
        } catch (e) {}
      }
    });
    markersRef.current = [];

    if (geoJsonData && geoJsonData.features) {
      // 1. RENDER ACTUAL GEOGRAPHIC COUNTRY BORDER SURFACE POLYGONS!
      let featuresToRender = [...geoJsonData.features];

      // If DDR is active in the scenario (1950), replace monolithic DEU with the 16 German states and partition Berlin!
      if (activeCountries.some(c => c.id === 'DDR')) {
        if (germanStatesData && germanStatesData.features) {
          // East Germany (DDR) strictly consists of the 5 historical eastern states + East Berlin:
          // Brandenburg (DE-BB), Mecklenburg-Vorpommern (DE-MV), Sachsen / Saxony (DE-SN), Sachsen-Anhalt (DE-ST), Thüringen (DE-TH).
          // LOWER SAXONY (Niedersachsen / DE-NI), NRW, Bavaria, Hesse, Baden-Wurttemberg, etc. are STRICTLY WEST GERMANY!
          const isEastGermanState = (stId: string, stName: string): boolean => {
            const normId = stId.toUpperCase();
            const normName = stName.toLowerCase().trim();

            if (['DE-BB', 'DE-MV', 'DE-SN', 'DE-ST', 'DE-TH'].includes(normId)) {
              return true;
            }
            if (normName.includes('niedersachsen') || normName.includes('lower saxony')) {
              return false;
            }
            if (
              normName === 'brandenburg' ||
              normName.includes('mecklenburg') ||
              normName === 'sachsen' ||
              normName === 'saxony' ||
              normName.includes('sachsen-anhalt') ||
              normName.includes('saxony-anhalt') ||
              normName.includes('thüringen') ||
              normName.includes('thueringen') ||
              normName.includes('thuringia')
            ) {
              return true;
            }
            return false;
          };

          const formattedFeatures: any[] = [];

          germanStatesData.features.forEach((st: any) => {
            const stId = String(st.properties?.id || st.id || '').toUpperCase();
            const stName = String(st.properties?.name || '').toLowerCase();

            // Berlin Partition (West Berlin for FRG, East Berlin for DDR)
            if (stId === 'DE-BE' || stName === 'berlin') {
              // 1. West Berlin (Western Allied Sectors / FRG)
              formattedFeatures.push({
                type: 'Feature',
                id: 'DE_WEST',
                properties: {
                  id: 'DE-BE-W',
                  isSubDivision: true,
                  ISO_A3: 'DEU',
                  iso_a3: 'DEU',
                  name: 'West Berlin (Federal Republic of Germany / Western Sectors)'
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [13.088, 52.420], [13.120, 52.380], [13.200, 52.410], [13.310, 52.390],
                    [13.385, 52.400], [13.385, 52.516], [13.380, 52.550], [13.330, 52.600],
                    [13.220, 52.620], [13.120, 52.580], [13.088, 52.480], [13.088, 52.420]
                  ]]
                }
              });

              // 2. East Berlin (Capital of GDR / DDR)
              formattedFeatures.push({
                type: 'Feature',
                id: 'DDR',
                properties: {
                  id: 'DE-BE-E',
                  isSubDivision: true,
                  ISO_A3: 'DDR',
                  iso_a3: 'DDR',
                  name: 'East Berlin (German Democratic Republic / Capital of DDR)'
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [13.385, 52.400], [13.450, 52.410], [13.600, 52.380], [13.761, 52.430],
                    [13.720, 52.550], [13.620, 52.620], [13.480, 52.675], [13.350, 52.650],
                    [13.330, 52.600], [13.380, 52.550], [13.385, 52.516], [13.385, 52.400]
                  ]]
                }
              });
            } else {
              const isEast = isEastGermanState(stId, stName);
              formattedFeatures.push({
                ...st,
                id: isEast ? 'DDR' : 'DE_WEST',
                properties: {
                  ...st.properties,
                  isSubDivision: true,
                  ISO_A3: isEast ? 'DDR' : 'DEU',
                  iso_a3: isEast ? 'DDR' : 'DEU',
                  name: isEast ? 'German Democratic Republic' : 'Federal Republic of Germany'
                }
              });
            }
          });

          featuresToRender = featuresToRender.filter((f: any) => {
            const id = String(f.id || f.properties?.ISO_A3 || f.properties?.iso_a3 || '').toUpperCase();
            const name = String(f.properties?.name || '').toUpperCase();
            return id !== 'DEU' && name !== 'GERMANY';
          }).concat(formattedFeatures);
        }
      }

      // Check active war belligerents per scenario
      const getWarStatus = (countryId: string) => {
        if (activeScenarioId === '2026') {
          return ['RU', 'UA', 'IL', 'PS', 'SD', 'MM'].includes(countryId);
        }
        if (activeScenarioId === '1950') {
          return ['KR', 'CN', 'US', 'GB', 'TR', 'FR'].includes(countryId);
        }
        if (activeScenarioId === '1936') {
          return ['ES', 'CN', 'JP', 'IT'].includes(countryId);
        }
        if (activeScenarioId === '1920') {
          return ['TR', 'GR', 'PL', 'SU', 'GB'].includes(countryId);
        }
        if (activeScenarioId === '1914') {
          return ['DE', 'TR', 'GB', 'FR', 'SU', 'YU'].includes(countryId);
        }
        return false;
      };

      // Freedom Index mapping (0-100 score)
      const getFreedomColor = (countryId: string) => {
        if (countryFreedomScores[countryId] !== undefined) {
          const score = countryFreedomScores[countryId];
          if (score >= 70) return '#16a34a'; // Free (Green)
          if (score >= 40) return '#d97706'; // Partly Free (Amber)
          return '#dc2626'; // Not Free (Red)
        }
        const country = activeCountries.find(c => c.id === countryId) || PLAYABLE_COUNTRIES.find(c => c.id === countryId);
        const score = country?.freedomScore ?? (['SU', 'DDR', 'CN', 'CS'].includes(countryId) ? 18 : ['US', 'GB', 'FR', 'DE', 'CA', 'AU', 'IS'].includes(countryId) ? 88 : 55);
        if (score >= 70) return '#16a34a'; // Free (Green)
        if (score >= 40) return '#d97706'; // Partly Free (Amber)
        return '#dc2626'; // Not Free (Red)
      };

      // Ideology Color mapping
      const getIdeologyColor = (countryId: string) => {
        if (countryIdeologies[countryId]) {
          const ideo = countryIdeologies[countryId].toLowerCase();
          if (ideo.includes('communist') || ideo.includes('marxist') || ideo.includes('socialist') || ideo.includes('left')) return '#991b1b';
          if (ideo.includes('conservative') || ideo.includes('republican') || ideo.includes('capitalist') || ideo.includes('tory')) return '#2563eb';
          if (ideo.includes('liberal') || ideo.includes('democrat') || ideo.includes('green') || ideo.includes('social dem')) return '#0891b2';
          if (ideo.includes('nationalist') || ideo.includes('centrist') || ideo.includes('kemalist')) return '#ca8a04';
          return '#475569';
        }
        if (['SU', 'DDR', 'CN', 'CS', 'YU'].includes(countryId)) return '#991b1b'; // Communist / Marxist-Leninist
        if (['PL', 'RO', 'HU'].includes(countryId)) return activeScenarioId === '1950' ? '#991b1b' : '#2563eb';
        if (['US', 'GB', 'JP', 'CA', 'AU', 'IS', 'PT'].includes(countryId)) return '#2563eb'; // Conservative / Capitalist / Liberal Dem
        if (['DE', 'FR', 'IT', 'ES', 'CL', 'GR'].includes(countryId)) return '#0891b2'; // Social / Liberal / Christian Dem
        if (['TR', 'EG', 'ZA', 'BR', 'MX', 'AR', 'IN', 'ID'].includes(countryId)) return '#ca8a04'; // Centrist / Nationalist / Republic
        if (['RU'].includes(countryId)) return '#7f1d1d'; // Illiberal / Traditionalist
        return '#475569';
      };

      const geoLayer = L.geoJSON({ type: 'FeatureCollection', features: featuresToRender } as any, {
        filter: () => true,
        style: (feature) => {
          const countryId = getPlayableCountryCode(feature);
          if (!countryId) {
            return {
              fillColor: darkMode ? '#1e293b' : '#cbd5e1',
              color: darkMode ? '#0f172a' : '#94a3b8',
              weight: 0.5,
              opacity: 0.85,
              fillOpacity: darkMode ? 0.75 : 0.85,
              interactive: false
            };
          }

          const isCompleted = completedCountries.includes(countryId);
          const isSelected = selectedPreview?.id === countryId;
          const isSubDivision = Boolean((feature as any)?.properties?.isSubDivision);

          const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
          const fillColor = isSelected ? scheme.selected : (isCompleted ? scheme.completed : scheme.default);
          const fillOpacity = isSelected ? 0.95 : (isCompleted ? 0.90 : 0.84);
          
          // Seamless borders for composite subdivisions like 1950 German states
          const borderColor = isSubDivision ? fillColor : (isSelected ? '#ffffff' : fillColor);
          const borderWidth = isSubDivision ? 0.1 : (isSelected ? 2.2 : 0.6);

          return {
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            color: borderColor,
            weight: borderWidth,
            opacity: 1.0
          };
        },
        onEachFeature: (feature, layer) => {
          const countryId = getPlayableCountryCode(feature);
          if (!countryId) return;

          const country = activeCountries.find(c => c.id === countryId) || PLAYABLE_COUNTRIES.find(c => c.id === countryId);
          if (!country) return;

          const isCompleted = completedCountries.includes(countryId);
          const hoverEnglishName = englishNames[countryId] || country.name;

          const tooltipHtml = `
            <div style="font-family: sans-serif; padding: 4px 6px; min-width: 140px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <span style="font-size: 16px;">${country.flag}</span>
                <span style="font-weight: 800; font-size: 12px; color: #ffffff;">${hoverEnglishName}</span>
              </div>
              <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${country.system}</div>
              ${isCompleted ? '<div style="color: #fbbf24; font-size: 9px; font-weight: 700; margin-top: 2px;">★ Campaign Secured</div>' : ''}
              <div style="font-size: 8px; color: #cbd5e1; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px;">Click to select nation</div>
            </div>
          `;

          layer.bindTooltip(tooltipHtml, {
            permanent: false,
            sticky: true,
            direction: 'top',
            className: `custom-map-tooltip ${darkMode ? 'dark' : 'light'}`
          });

          // Interactive overrides on mouse hover
          layer.on('mouseover', () => {
            const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
            const hoverFill = scheme.selected;

            geoLayer.eachLayer((l: any) => {
              if (l.feature && getPlayableCountryCode(l.feature) === countryId) {
                const sub = Boolean(l.feature.properties?.isSubDivision);
                l.setStyle({
                  fillColor: hoverFill,
                  fillOpacity: 0.96,
                  weight: sub ? 0.1 : 1.8,
                  color: sub ? hoverFill : '#ffffff'
                });
              }
            });
          });

          layer.on('mouseout', () => {
            const isNowSelected = selectedPreview?.id === countryId;
            const isNowCompleted = completedCountries.includes(countryId);
            const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };

            const baseFill = isNowSelected ? scheme.selected : (isNowCompleted ? scheme.completed : scheme.default);
            const baseOpacity = isNowSelected ? 0.95 : (isNowCompleted ? 0.90 : 0.84);

            geoLayer.eachLayer((l: any) => {
              if (l.feature && getPlayableCountryCode(l.feature) === countryId) {
                const sub = Boolean(l.feature.properties?.isSubDivision);
                const baseBorder = sub ? baseFill : (isNowSelected ? '#ffffff' : baseFill);
                const baseWeight = sub ? 0.1 : (isNowSelected ? 2.2 : 0.6);

                l.setStyle({
                  fillColor: baseFill,
                  fillOpacity: baseOpacity,
                  weight: baseWeight,
                  color: baseBorder
                });
              }
            });
          });

          layer.on('click', () => {
            setSelectedPreview(country);
            const coords = countryCoords[countryId];
            if (coords) {
              mapInstanceRef.current?.setView(coords, Math.max(mapInstanceRef.current.getZoom(), 4), {
                animate: true,
                duration: 0.6
              });
            }
          });
        }
      });

      geoLayer.addTo(mapInstanceRef.current);
      markersRef.current.push(geoLayer);

    } else {
      // 2. BACKUP INTERACTIVE COORDINATE CIRCLE LAYER SYSTEM (If geojson is still fetching)
      activeCountries.forEach(country => {
        const coords = countryCoords[country.id];
        if (!coords) return;

        const isCompleted = completedCountries.includes(country.id);
        const isSelected = selectedPreview?.id === country.id;

        const scheme = countryColors[country.id] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
        const radius = countryRadii[country.id] || 400000;
        const themeColor = isCompleted ? scheme.completed : scheme.default;

        const circlePr = L.circle(coords, {
          radius: radius,
          color: '#ffffff',
          weight: isSelected ? 3.5 : 1.5,
          opacity: 0.9,
          fillColor: isSelected ? scheme.selected : themeColor,
          fillOpacity: isSelected ? 0.85 : (isCompleted ? 0.7 : 0.55),
          interactive: true
        });

        circlePr.addTo(mapInstanceRef.current!);

        const hoverEnglishName = englishNames[country.id] || country.name;

        circlePr.bindTooltip(`
          <div style="font-family: inherit; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px; line-height: 1;">${country.flag || '🌐'}</span>
            <span style="font-weight: 950; letter-spacing: 0.05em; text-transform: uppercase;">${hoverEnglishName}</span>
            ${isCompleted ? `<span style="color: #fbbf24; font-weight: 900; margin-left: 2px;">★</span>` : ''}
          </div>
        `, {
          permanent: false,
          sticky: true,
          direction: 'top',
          className: `custom-map-tooltip ${darkMode ? 'dark' : 'light'}`
        });

        circlePr.on('mouseover', () => {
          circlePr.setStyle({
            fillColor: scheme.selected,
            fillOpacity: 0.9,
            weight: 3.5,
            color: scheme.selected
          });
        });

        circlePr.on('mouseout', () => {
          const isNowSelected = selectedPreview?.id === country.id;
          const isNowCompleted = completedCountries.includes(country.id);
          const schemeNow = countryColors[country.id] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
          const themeColorNow = isNowCompleted ? schemeNow.completed : schemeNow.default;

          circlePr.setStyle({
            fillColor: isNowSelected ? schemeNow.selected : themeColorNow,
            fillOpacity: isNowSelected ? 0.85 : (isNowCompleted ? 0.7 : 0.55),
            weight: isNowSelected ? 3.5 : 1.5,
            color: isNowSelected ? schemeNow.selected : (isNowCompleted ? '#eab308' : schemeNow.completed)
          });
        });

        circlePr.on('click', () => {
          setSelectedPreview(country);
          mapInstanceRef.current?.setView(coords, Math.max(mapInstanceRef.current.getZoom(), 4), {
            animate: true,
            duration: 0.6
          });
        });

        markersRef.current.push(circlePr);
      });
    }
  }, [completedCountries, selectedPreview, darkMode, geoJsonData, scenario, activeCountries]);

  // Zoom / Offset Navigation Triggers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView([25, 10], 1.5);
  };

  const handlePanUp = () => {
    mapInstanceRef.current?.panBy([0, -150]);
  };

  const handlePanDown = () => {
    mapInstanceRef.current?.panBy([0, 150]);
  };

  const handlePanLeft = () => {
    mapInstanceRef.current?.panBy([-150, 0]);
  };

  const handlePanRight = () => {
    mapInstanceRef.current?.panBy([150, 0]);
  };

  const handleSelectFromList = (country: Country) => {
    setSelectedPreview(country);
    const coords = countryCoords[country.id];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.setView(coords, 4, {
        animate: true,
        duration: 0.6
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto p-4 lg:p-6 select-none animate-fade-in">
      
      {/* Dynamic leafet tooltip injected overrides styles */}
      <style>{`
        /* Deep global structural Leaflet overrides for ultra-premium dark theme styling */
        .leaflet-container {
          background: ${darkMode ? '#131e31' : '#e2e8f0'} !important;
          font-family: inherit !important;
        }
        /* Colorize ocean tiles to gorgeous deep navy / dark blue (koyu mavi) */
        .base-map-tile {
          filter: ${darkMode 
            ? 'brightness(0.4) contrast(1.3) saturate(1.2) !important;' 
            : 'brightness(0.9) saturate(1.2) contrast(1.1) !important;'}
        }
        .terrain-tile-dark {
          filter: invert(1) contrast(1.8) opacity(0.8) !important;
        }
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-map-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(51, 65, 85, 0.3) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
          color: #f1f5f9 !important;
          padding: 4px 8px !important;
        }
        .custom-map-tooltip.light {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          color: #1e293b !important;
        }
        .custom-map-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
        .custom-map-tooltip.light::before {
          border-top-color: rgba(255, 255, 255, 0.95) !important;
        }

        /* Remove browser default focus outline rectangles on interactive SVG layers and overall container content completely */
        .leaflet-container *,
        .leaflet-container *:focus,
        .leaflet-container *:active,
        .leaflet-container *:focus-visible,
        .leaflet-interactive,
        .leaflet-interactive:focus,
        .leaflet-interactive:active,
        .leaflet-interactive:focus-visible,
        path.leaflet-interactive,
        path.leaflet-interactive:focus,
        path.leaflet-interactive:active,
        path.leaflet-interactive:focus-visible,
        .leaflet-container svg path,
        .leaflet-container svg path:focus,
        .leaflet-container svg path:focus-visible,
        svg:focus,
        svg *,
        g,
        g:focus,
        path:focus {
          outline: none !important;
          outline-style: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
      `}</style>

      {/* Header Banner */}
      <div className={`col-span-12 p-5 rounded-3xl border transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900/60 border-slate-800/80 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#c9a26a]/20 text-[#dab97c] font-mono tracking-widest uppercase border border-[#c9a26a]/30 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                SCENARIO: {activeScenarioMeta.year} — {activeScenarioMeta.title}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 font-mono tracking-widest uppercase">
                GEOGRAPHICAL STRATEGY
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono tracking-widest uppercase">
                {activeCountries.length} PLAYABLE NATIONS
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-2 flex items-center gap-2 tracking-tight">
              <Globe className="w-8 h-8 text-[#c9a26a] animate-spin-slow" /> Paths to Power ({activeScenarioMeta.year})
            </h1>
            <p className="text-xs mt-1 text-slate-400 max-w-2xl leading-relaxed">
              {activeScenarioMeta.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-500/5 px-4 py-3 rounded-2xl border border-slate-500/10 self-start md:self-auto">
            <Trophy className="w-9 h-9 text-[#c9a26a] shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">CAMPAIGNS SECURED</div>
              <div className="text-sm font-black font-mono">
                {completedCountries.length} / {activeCountries.length} Nations Won
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container and Layout */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
        {/* Scenario Borders Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1.5 font-mono text-[11px]">
              <span>🗺️</span> {activeScenarioMeta.year} Historical Political Borders
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Hover over or click any sovereign territory to select your nation.
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Playable Nations</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Non-Playable</span>
          </div>
        </div>

        <div className={`relative rounded-3xl border overflow-hidden aspect-[2/1] transition-all flex items-center justify-center ${
          darkMode 
            ? 'bg-slate-950 border-slate-900 shadow-inner' 
            : 'bg-indigo-50/20 border-slate-200'
        }`}>
          {/* Main Leaflet Mount Element */}
          <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />

          {/* Leaflet Custom Floating Actions Panel */}
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5">
            <button
              onClick={handleZoomIn}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center hover:scale-105 shadow-md ${
                darkMode ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center hover:scale-105 shadow-md ${
                darkMode ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center hover:scale-105 shadow-md ${
                darkMode ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Reset (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Premium Minimal Control Key Guide */}
            <div className="hidden md:flex flex-col gap-0.5 px-2 py-1.5 bg-black/75 backdrop-blur-xs text-[8px] text-slate-300 font-mono tracking-wide rounded-lg border border-white/5 shadow-md mt-1 shrink-0 select-none">
              <div className="font-extrabold text-indigo-400 mb-0.5 border-b border-white/5 pb-0.5 text-center">KEYBOARD GUIDE</div>
              <div className="flex justify-between gap-3"><span>Keyboard Pan:</span><span className="font-bold text-yellow-400">W, A, S, D</span></div>
              <div className="flex justify-between gap-3"><span>Arrow Keys:</span><span className="font-bold text-yellow-400">↑, ↓, ←, →</span></div>
              <div className="flex justify-between gap-3"><span>Zoom:</span><span className="font-bold text-yellow-400">+, -</span></div>
              <div className="flex justify-between gap-3"><span>Reset Map:</span><span className="font-bold text-yellow-400">R</span></div>
            </div>
          </div>

          {/* Scale Control HUD */}
          <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded text-[10px] text-slate-300 font-mono tracking-wide">
              <span>REAL-TIME GEOGRAPHIC SCALE SYSTEM</span>
              <div className="h-1.5 border-l border-r border-b border-slate-300 w-12 ml-1"></div>
            </div>
          </div>

          {/* Coordinates HUD */}
          <div className="absolute bottom-4 right-4 z-30 pointer-events-none px-3 py-1 bg-black/60 rounded text-[10px] text-slate-300 font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>
              {Math.abs(cursorCoords.lat).toFixed(4)}°{cursorCoords.lat >= 0 ? 'N' : 'S'},{' '}
              {Math.abs(cursorCoords.lng).toFixed(4)}°{cursorCoords.lng >= 0 ? 'E' : 'W'}
            </span>
          </div>

          {/* Map Status Overlay Indicator */}
          <div className="absolute bottom-12 left-4 right-4 z-30 flex justify-between items-center bg-black/60 backdrop-blur-xs p-2 rounded-xl border border-white/5 pointer-events-none text-[10px] text-slate-300 font-mono tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>GLOBAL POLITICAL SYSTEM ONLINE</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="text-amber-400">★</span> Secured</span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
              <span>Double-Click Country to Focus</span>
            </div>
          </div>
        </div>

        {/* Selected Country Dashboard Quick Info Card */}
        {selectedPreview && (
          <div className={`p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'
          }`}>
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-4xl filter drop-shadow-md select-none">{selectedPreview.flag}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold tracking-tight">{selectedPreview.name}</h3>
                    {completedCountries.includes(selectedPreview.id) ? (
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                        ★ VICTORIOUS / CAMPAIGN WON
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                        Ready for Campaign (Open Territory)
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-slate-400 max-w-xl leading-relaxed">
                    {selectedPreview.description}
                  </p>
                </div>
              </div>
              
              {(() => {
                const wins = countryWinCounts[selectedPreview.id] || 0;
                
                return (
                  <div className="flex flex-col items-start lg:items-end gap-1">
                    <button
                      id="play-country-btn"
                      onClick={() => onSelectCountry(selectedPreview)}
                      className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center gap-2 transition-all self-start lg:self-center group ${
                        completedCountries.includes(selectedPreview.id)
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shrink-0 cursor-pointer'
                          : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 shrink-0 hover:scale-[1.02] cursor-pointer'
                      }`}
                    >
                      {completedCountries.includes(selectedPreview.id) ? 'Relaunch Campaign' : 'Govern & Start Election Campaign'} 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {wins > 0 && (
                      <span className={`text-[10px] font-mono text-amber-500`}>
                        Terms Served: {wins}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 py-3.5 border-t border-slate-500/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-455 font-mono uppercase">LEGISLATURE</div>
                  <div className="text-xs font-bold text-slate-200">{selectedPreview.parliamentName}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <Vote className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-455 font-mono uppercase">SEATS LIMIT</div>
                  <div className="text-xs font-bold text-slate-200 font-mono">{selectedPreview.seats} Seats</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-455 font-mono uppercase">GEOGRAPHIC POPULATION</div>
                  <div className="text-xs font-bold text-slate-200 font-mono">{selectedPreview.population}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-[9px] text-slate-455 font-mono uppercase">GOVERNMENT SYSTEM</div>
                  <div className="text-xs font-bold text-slate-200">{selectedPreview.system}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar List panel */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        <div className={`p-5 rounded-3xl border flex flex-col gap-3 h-full ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="p-4 rounded-2xl shadow-lg border border-blue-400/20" style={{ backgroundColor: '#1f5ba7' }}>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-blue-200" />
              Global Operations Map
            </h2>
            <p className="text-xs text-blue-100/80 mt-1 font-sans font-medium leading-relaxed">
              Select a country to view properties and launch election campaigns directly from the list or the map.
            </p>
          </div>

          {/* Search bar input filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search country or government type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 pl-9 pr-4 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
            {filteredCountries.map((country) => {
              const isCompleted = completedCountries.includes(country.id);
              const isSelected = selectedPreview?.id === country.id;

              return (
                <button
                  id={`country-list-${country.id}`}
                  key={country.id}
                  onClick={() => handleSelectFromList(country)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all group ${
                    isSelected
                      ? darkMode
                        ? 'bg-indigo-950/20 border-indigo-500/50 text-slate-100 shadow-md'
                        : 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-xs'
                      : darkMode
                      ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-xs select-none">{country.flag}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate tracking-wide">{country.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{country.system}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold">
                        SECURED
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-450 group-hover:bg-indigo-500 transition-colors"></span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                No playable countries found matching your criteria.
              </div>
            )}
          </div>

          {/* Quick instructions and tips guide */}
          <div className={`mt-auto p-4 rounded-2xl border ${
            darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" /> MAP NAVIGATION GUIDE
            </h4>
            <ul className="text-[10px] space-y-1.5 mt-2 text-slate-400 leading-relaxed list-disc list-inside">
              <li>Feel free to <strong className={darkMode ? 'text-slate-300' : 'text-slate-700'}>drag and pan</strong> the globe to navigate.</li>
              <li>Click on items in the sidebar list to <strong className={darkMode ? 'text-slate-300' : 'text-slate-700'}>auto-focus the map</strong>.</li>
              <li>Observe dynamic <strong className={darkMode ? 'text-slate-300' : 'text-slate-700'}>GPS coordinates</strong> in the bottom status panel.</li>
              <li>Govern regions, win seats, and secure the global electorate!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
