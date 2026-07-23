#!/bin/bash
sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/terrainLayerRef.current.setOpacity(darkMode ? 0.15 : 0.25);/g" src/components/WorldMap.tsx
sed -i "s/opacity: darkMode ? 0.4 : 0.5/opacity: darkMode ? 0.15 : 0.25/g" src/components/WorldMap.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/terrainLayerRef.current.setOpacity(darkMode ? 0.15 : 0.25);/g" src/components/CampaignView.tsx
sed -i "s/opacity: darkMode ? 0.4 : 0.5/opacity: darkMode ? 0.15 : 0.25/g" src/components/CampaignView.tsx

sed -i "s/terrainLayerRef.current.setOpacity(darkMode ? 0.4 : 0.5);/terrainLayerRef.current.setOpacity(darkMode ? 0.15 : 0.25);/g" src/components/DiplomacyView.tsx
sed -i "s/opacity: darkMode ? 0.4 : 0.5/opacity: darkMode ? 0.15 : 0.25/g" src/components/DiplomacyView.tsx

sed -i "s/weight: isSelected ? 3.8 : 1.5,/weight: isSelected ? 3.8 : 0.8,/g" src/components/CampaignView.tsx

