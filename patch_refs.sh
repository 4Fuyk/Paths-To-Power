#!/bin/bash
sed -i '/const turkeyGeoJsonLayerRef = useRef<any>(null);/a \  const worldBgLayerRef = useRef<any>(null);' src/components/CampaignView.tsx
