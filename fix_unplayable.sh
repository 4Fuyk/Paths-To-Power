#!/bin/bash
sed -i "s/fillColor: darkMode ? '#020617' : '#cbd5e1'/fillColor: darkMode ? '#1e293b' : '#cbd5e1'/g" src/components/WorldMap.tsx
sed -i "s/fillColor: darkMode ? '#020617' : '#cbd5e1'/fillColor: darkMode ? '#1e293b' : '#cbd5e1'/g" src/components/CampaignView.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.35 : 0.4);/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/g" src/components/WorldMap.tsx
sed -i "s/opacity: darkMode ? 0.35 : 0.4/opacity: darkMode ? 0.2 : 0.3/g" src/components/WorldMap.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.35 : 0.4);/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/g" src/components/CampaignView.tsx
sed -i "s/opacity: darkMode ? 0.35 : 0.4/opacity: darkMode ? 0.2 : 0.3/g" src/components/CampaignView.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.35 : 0.4);/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/g" src/components/DiplomacyView.tsx
sed -i "s/opacity: darkMode ? 0.35 : 0.4/opacity: darkMode ? 0.2 : 0.3/g" src/components/DiplomacyView.tsx
