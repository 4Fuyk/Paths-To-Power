/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Country } from '../types';
import { PLAYABLE_COUNTRIES } from '../constants/countries';
import { 
  Globe, Trophy, Users, Landmark, Vote, ArrowRight, HelpCircle, 
  RotateCcw, ZoomIn, ZoomOut, Search, Compass, Info,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import L from 'leaflet';

interface WorldMapProps {
  completedCountries: string[];
  onSelectCountry: (country: Country) => void;
  darkMode: boolean;
}

const countryCoords: Record<string, [number, number]> = {
  US: [38.0, -97.0],
  BR: [-14.235, -51.925],
  GB: [55.378, -3.436],
  DE: [51.165, 10.451],
  TR: [38.963, 35.243],
  EG: [26.820, 30.802],
  JP: [36.204, 138.252]
};

const englishNames: Record<string, string> = {
  TR: "Turkey",
  US: "United States",
  DE: "Germany",
  GB: "United Kingdom",
  BR: "Brazil",
  EG: "Egypt",
  JP: "Japan"
};

const countryColors: Record<string, { default: string; completed: string; selected: string }> = {
  TR: { default: '#991b1b', completed: '#dc2626', selected: '#f87171' }, // Türkiye: Koyu Kırmızı -> Canlı Kırmızı -> Açık Kırmızı
  US: { default: '#1d4ed8', completed: '#3b82f6', selected: '#60a5fa' }, // ABD: Canlı Mavi -> Açık Mavi -> Daha Açık Mavi
  BR: { default: '#15803d', completed: '#22c55e', selected: '#4ade80' }, // Brezilya: Canlı Yeşil -> Açık Yeşil -> Daha Açık Yeşil
  DE: { default: '#7c3aed', completed: '#8b5cf6', selected: '#a78bfa' }, // Almanya: Parlak Mor -> Eflatun -> Daha Açık Mor
  GB: { default: '#0e7490', completed: '#06b6d4', selected: '#22d3ee' }, // Birleşik Krallık: Canlı Turkuaz -> Cyan -> Açık Cyan
  EG: { default: '#b45309', completed: '#f59e0b', selected: '#fbc02d' }, // Mısır: Altın Sarısı / Taba -> Turuncu -> Açık Sarı/Amber
  JP: { default: '#be1c5a', completed: '#ec4899', selected: '#f472b6' }  // Japonya: Ahududu -> Pembe -> Açık Pembe
};

const countryRadii: Record<string, number> = {
  US: 850000,
  BR: 800000,
  GB: 380000,
  DE: 350000,
  TR: 480000,
  EG: 450000,
  JP: 400000
};

export const WorldMap: React.FC<WorldMapProps> = ({
  completedCountries,
  onSelectCountry,
  darkMode,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<Country | null>(PLAYABLE_COUNTRIES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursorCoords, setCursorCoords] = useState({ lat: 0.0, lng: 0.0 });
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState<boolean>(true);

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

  const filteredCountries = PLAYABLE_COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<any[]>([]);

  // Helper to determine the country ID from GeoJSON feature
  const getPlayableCountryCode = (feature: any): string | null => {
    if (!feature) return null;
    const id3 = String(feature.id || feature.properties?.ISO_A3 || feature.properties?.iso_a3 || '').toUpperCase();
    const id2 = String(feature.properties?.ISO_A2 || feature.properties?.iso_a2 || '').toUpperCase();
    const name = String(feature.properties?.name || feature.properties?.NAME || '').toUpperCase();

    if (id3 === 'TUR' || id2 === 'TR' || name.includes('TURKEY')) return 'TR';
    if (id3 === 'USA' || id2 === 'US' || name.includes('UNITED STATES') || name === 'USA') return 'US';
    if (id3 === 'BRA' || id2 === 'BR' || name.includes('BRAZIL')) return 'BR';
    if (id3 === 'DEU' || id2 === 'DE' || name.includes('GERMANY')) return 'DE';
    if (id3 === 'GBR' || id2 === 'GB' || name.includes('UNITED KINGDOM') || name === 'GREAT BRITAIN' || name === 'UK') return 'GB';
    if (id3 === 'EGY' || id2 === 'EG' || name.includes('EGYPT')) return 'EG';
    if (id3 === 'JPN' || id2 === 'JP' || name.includes('JAPAN')) return 'JP';

    return null;
  };

  // Fetch beautiful low-res world boundaries
  useEffect(() => {
    let active = true;
    fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json')
      .then(res => {
        if (!res.ok) throw new Error('Primary CDN failed');
        return res.json();
      })
      .catch(() => {
        return fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
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

    return () => { active = false; };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(mapRef.current, {
      center: [28, 12],
      zoom: 1.8,
      minZoom: 1.5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    const tileUrl = darkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 18,
      noWrap: false,
    }).addTo(map);

    tileLayerRef.current = tiles;
    mapInstanceRef.current = map;

    // Capture coordinates under cursor on move over map
    map.on('mousemove', (e: any) => {
      const latlng = e.latlng;
      if (latlng) {
        setCursorCoords({ lat: latlng.lat, lng: latlng.lng });
      }
    });

    // Invalidate size to guarantee perfect layout inside container bounds
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update Map Tilings when DarkMode is toggled
  useEffect(() => {
    if (tileLayerRef.current) {
      const newUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
      tileLayerRef.current.setUrl(newUrl);
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
      const geoLayer = L.geoJSON(geoJsonData, {
        filter: (feature) => {
          return getPlayableCountryCode(feature) !== null;
        },
        style: (feature) => {
          const countryId = getPlayableCountryCode(feature);
          if (!countryId) return {};

          const isCompleted = completedCountries.includes(countryId);
          const isSelected = selectedPreview?.id === countryId;

          const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
          const fillColor = isSelected ? scheme.selected : (isCompleted ? scheme.completed : scheme.default);
          const color = '#ffffff';

          return {
            fillColor: fillColor,
            fillOpacity: isSelected ? 0.95 : (isCompleted ? 0.90 : 0.82),
            color: color,
            weight: isSelected ? 2.5 : 1.5,
            opacity: isSelected ? 1.0 : 0.9
          };
        },
        onEachFeature: (feature, layer) => {
          const countryId = getPlayableCountryCode(feature);
          if (!countryId) return;

          const country = PLAYABLE_COUNTRIES.find(c => c.id === countryId)!;
          const isCompleted = completedCountries.includes(countryId);
          const hoverEnglishName = englishNames[countryId] || country.name;

          // English-only hover tooltip, absolutely no persistent overlays
          layer.bindTooltip(`
            <div style="font-family: inherit; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 14px; line-height: 1;">${country.flag}</span>
              <span style="font-weight: 950; letter-spacing: 0.05em; text-transform: uppercase;">${hoverEnglishName}</span>
              ${isCompleted ? `<span style="color: #fbbf24; font-weight: 900; margin-left: 2px;">★</span>` : ''}
            </div>
          `, {
            permanent: false,
            sticky: true,
            direction: 'top',
            className: `custom-map-tooltip ${darkMode ? 'dark' : 'light'}`
          });

          // Elegant visual interactive overrides on mouse hover
          layer.on('mouseover', () => {
            const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };
            (layer as any).setStyle({
              fillColor: scheme.selected,
              fillOpacity: 0.95,
              weight: 2.2,
              color: scheme.selected
            });
          });

          layer.on('mouseout', () => {
            const isNowSelected = selectedPreview?.id === countryId;
            const isNowCompleted = completedCountries.includes(countryId);
            const scheme = countryColors[countryId] || { default: '#6366f1', completed: '#4338ca', selected: '#4f46e5' };

            const baseFill = isNowSelected ? scheme.selected : (isNowCompleted ? scheme.completed : scheme.default);
            const baseBorder = isNowSelected ? scheme.selected : (isNowCompleted ? '#eab308' : scheme.completed);

            (layer as any).setStyle({
              fillColor: baseFill,
              fillOpacity: isNowSelected ? 0.95 : (isNowCompleted ? 0.90 : 0.82),
              weight: isNowSelected ? 2.2 : 1.2,
              color: baseBorder
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
      PLAYABLE_COUNTRIES.forEach(country => {
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
            <span style="font-size: 14px; line-height: 1;">${country.flag}</span>
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
  }, [completedCountries, selectedPreview, darkMode, geoJsonData]);

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
        .leaflet-tile {
          filter: ${darkMode 
            ? 'sepia(0.8) hue-rotate(195deg) saturate(1.8) brightness(0.6) contrast(1.1) !important;' 
            : 'sepia(0.2) hue-rotate(200deg) saturate(1.2) brightness(0.8) contrast(1.0) !important;'}
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
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 font-mono tracking-widest uppercase">
              STRATEGY MAP / GEOGRAPHICAL LOCATIONS
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono tracking-widest uppercase ml-2">
              GEOGRAPHICAL SYSTEM
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2 flex items-center gap-2 tracking-tight">
              <Globe className="w-8 h-8 text-indigo-500 animate-spin-slow" /> Paths to Power
            </h1>
            <p className="text-xs mt-1 text-slate-400 max-w-2xl leading-relaxed">
              Launch election campaigns in playable nations across the world. Control local target regions, sway delegates, and win general assembly voting!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-500/5 px-4 py-3 rounded-2xl border border-slate-500/10 self-start md:self-auto">
            <Trophy className="w-9 h-9 text-amber-500 shrink-0" />
            <div>
              <div className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">COUNTRIES SECURED</div>
              <div className="text-sm font-black font-mono">
                {completedCountries.length} / {PLAYABLE_COUNTRIES.length} Campaign Wins
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container and Layout */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
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
              title="Yakınlaştır (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center hover:scale-105 shadow-md ${
                darkMode ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Uzaklaştır (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center hover:scale-105 shadow-md ${
                darkMode ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Sıfırla (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Premium Minimal Control Key Guide */}
            <div className="hidden md:flex flex-col gap-0.5 px-2 py-1.5 bg-black/75 backdrop-blur-xs text-[8px] text-slate-300 font-mono tracking-wide rounded-lg border border-white/5 shadow-md mt-1 shrink-0 select-none">
              <div className="font-extrabold text-indigo-400 mb-0.5 border-b border-white/5 pb-0.5 text-center">KLAVYE KILAVUZU</div>
              <div className="flex justify-between gap-3"><span>Klavye Taşıma:</span><span className="font-bold text-yellow-400">W, A, S, D</span></div>
              <div className="flex justify-between gap-3"><span>Ok Tuşları:</span><span className="font-bold text-yellow-400">↑, ↓, ←, →</span></div>
              <div className="flex justify-between gap-3"><span>Ölçekleme:</span><span className="font-bold text-yellow-400">+, -</span></div>
              <div className="flex justify-between gap-3"><span>Harita Reset:</span><span className="font-bold text-yellow-400">R</span></div>
            </div>
          </div>

          {/* Scale Control HUD */}
          <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded text-[10px] text-slate-300 font-mono tracking-wide">
              <span>REAL-TIME COĞRAFİ ÖLÇEK SİSTEMİ</span>
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
              
              <button
                id="play-country-btn"
                onClick={() => onSelectCountry(selectedPreview)}
                className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all self-start lg:self-center group ${
                  completedCountries.includes(selectedPreview.id)
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shrink-0'
                    : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 shrink-0 hover:scale-[1.02]'
                }`}
              >
                {completedCountries.includes(selectedPreview.id) ? 'Relaunch Campaign' : 'Govern & Start Election Campaign'} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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
          <div className="pb-2 border-b border-slate-500/10">
            <h2 className="text-lg font-bold tracking-tight">Global Operations Map</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans font-medium">Select a country to view properties and launch election campaigns directly from the list or the map.</p>
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
