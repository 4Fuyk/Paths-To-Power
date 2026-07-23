#!/bin/bash
sed -i "s/pane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/pane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/WorldMap.tsx
sed -i "s/terrainPane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/terrainPane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/WorldMap.tsx

sed -i "s/pane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/pane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/CampaignView.tsx
sed -i "s/terrainPane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/terrainPane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/CampaignView.tsx

sed -i "s/pane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/pane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/DiplomacyView.tsx
sed -i "s/terrainPane.style.mixBlendMode = darkMode ? 'screen' : 'multiply'/terrainPane.style.mixBlendMode = darkMode ? 'overlay' : 'multiply'/g" src/components/DiplomacyView.tsx
