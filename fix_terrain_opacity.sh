#!/bin/bash
sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/g" src/components/WorldMap.tsx
sed -i "s/opacity: darkMode ? 0.2 : 0.3/opacity: darkMode ? 0.5 : 0.6/g" src/components/WorldMap.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/g" src/components/CampaignView.tsx
sed -i "s/opacity: darkMode ? 0.2 : 0.3/opacity: darkMode ? 0.5 : 0.6/g" src/components/CampaignView.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.2 : 0.3);/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/g" src/components/DiplomacyView.tsx
sed -i "s/opacity: darkMode ? 0.2 : 0.3/opacity: darkMode ? 0.5 : 0.6/g" src/components/DiplomacyView.tsx
