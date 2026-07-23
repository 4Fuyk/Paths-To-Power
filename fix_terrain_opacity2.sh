#!/bin/bash
sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/g" src/components/WorldMap.tsx
sed -i "s/opacity: darkMode ? 0.5 : 0.6/opacity: darkMode ? 0.4 : 0.5/g" src/components/WorldMap.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/g" src/components/CampaignView.tsx
sed -i "s/opacity: darkMode ? 0.5 : 0.6/opacity: darkMode ? 0.4 : 0.5/g" src/components/CampaignView.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.5 : 0.6);/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/g" src/components/DiplomacyView.tsx
sed -i "s/opacity: darkMode ? 0.5 : 0.6/opacity: darkMode ? 0.4 : 0.5/g" src/components/DiplomacyView.tsx
