#!/bin/bash
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/dark_nolabels\/{z}\/{x}\/{y}{r}.png'/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager_nolabels\/{z}\/{x}\/{y}{r}.png'/g" src/components/WorldMap.tsx
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/dark_all\/{z}\/{x}\/{y}{r}.png'/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager\/{z}\/{x}\/{y}{r}.png'/g" src/components/CampaignView.tsx
sed -i "s/'https:\/\/{s}.basemaps.cartocdn.com\/dark_all\/{z}\/{x}\/{y}{r}.png'/'https:\/\/{s}.basemaps.cartocdn.com\/rastertiles\/voyager\/{z}\/{x}\/{y}{r}.png'/g" src/components/DiplomacyView.tsx
