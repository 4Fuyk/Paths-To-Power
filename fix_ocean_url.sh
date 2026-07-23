#!/bin/bash
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager_nolabels\/{z}\/{x}\/{y}{r}.png'/'https:\/\/server.arcgisonline.com\/ArcGIS\/rest\/services\/Ocean\/World_Ocean_Base\/MapServer\/tile\/{z}\/{y}\/{x}'/g" src/components/WorldMap.tsx
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager\/{z}\/{x}\/{y}{r}.png'/'https:\/\/server.arcgisonline.com\/ArcGIS\/rest\/services\/Ocean\/World_Ocean_Base\/MapServer\/tile\/{z}\/{y}\/{x}'/g" src/components/CampaignView.tsx
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager\/{z}\/{x}\/{y}{r}.png'/'https:\/\/server.arcgisonline.com\/ArcGIS\/rest\/services\/Ocean\/World_Ocean_Base\/MapServer\/tile\/{z}\/{y}\/{x}'/g" src/components/DiplomacyView.tsx
