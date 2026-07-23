#!/bin/bash
sed -i 's/return getPlayableCountryCode(feature) !== null;/return true;/g' src/components/WorldMap.tsx
sed -i 's/return getPlayableCountryCode(feature) !== null;/return true;/g' src/components/CampaignView.tsx
sed -i 's/return getPlayableCountryCode(feature) !== null;/return true;/g' src/components/DiplomacyView.tsx
