#!/bin/bash
sed -i '/const mapContainerRef = useRef<HTMLDivElement>(null);/a \  const [worldGeoJsonData, setWorldGeoJsonData] = useState<any>(null);\n  const worldBgLayerRef = useRef<any>(null);\n  useEffect(() => {\n    fetch("https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json")\n      .then(res => res.json())\n      .then(data => setWorldGeoJsonData(data))\n      .catch(err => console.error("Failed to load world geojson", err));\n  }, []);' src/components/DiplomacyView.tsx

# Find map initialization block and add geojson rendering
sed -i '/terrainLayerRef.current = terrain;/a \      if (worldGeoJsonData) {\n        worldBgLayerRef.current = L.geoJSON(worldGeoJsonData, {\n          style: (feature) => {\n            return { fillColor: darkMode ? "#334155" : "#e2e8f0", color: "#ffffff", weight: 0.5, fillOpacity: 0.9, interactive: false };\n          }\n        }).addTo(map);\n      }' src/components/DiplomacyView.tsx

# Also need to re-render if worldGeoJsonData changes, which requires it in dependency array of map init or update
