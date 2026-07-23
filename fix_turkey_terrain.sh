#!/bin/bash
sed -i "s/turkeyTerrainLayerRef.current.setOpacity(darkMode ? 0.35 : 0.4);/turkeyTerrainLayerRef.current.setOpacity(darkMode ? 0.15 : 0.25);/g" src/components/CampaignView.tsx
