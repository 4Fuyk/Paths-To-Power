#!/bin/bash
sed -i '/if (turkeyGeoJsonLayerRef.current) {/i \    if (worldBgLayerRef.current) {\n      map.removeLayer(worldBgLayerRef.current);\n      worldBgLayerRef.current = null;\n    }' src/components/CampaignView.tsx
