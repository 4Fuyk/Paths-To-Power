#!/bin/bash
sed -i "s/mixBlendMode = darkMode ? 'hard-light' : 'multiply'/mixBlendMode = 'overlay'/g" src/components/WorldMap.tsx
sed -i "s/mixBlendMode = darkMode ? 'hard-light' : 'multiply'/mixBlendMode = 'overlay'/g" src/components/CampaignView.tsx
sed -i "s/mixBlendMode = darkMode ? 'hard-light' : 'multiply'/mixBlendMode = 'overlay'/g" src/components/DiplomacyView.tsx
