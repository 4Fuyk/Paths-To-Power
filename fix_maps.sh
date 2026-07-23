#!/bin/bash
for file in src/components/WorldMap.tsx src/components/CampaignView.tsx src/components/DiplomacyView.tsx; do
  sed -i 's/\.leaflet-tile {/.base-map-tile {/g' $file
done
