#!/bin/bash
sed -i "s/if (!countryId) return {};/if (!countryId) return { fillColor: darkMode ? '#020617' : '#cbd5e1', color: darkMode ? '#1e293b' : '#94a3b8', weight: 1, fillOpacity: 1, interactive: false };/g" src/components/WorldMap.tsx
sed -i "s/if (!countryId) return {};/if (!countryId) return { fillColor: darkMode ? '#020617' : '#cbd5e1', color: darkMode ? '#1e293b' : '#94a3b8', weight: 1, fillOpacity: 1, interactive: false };/g" src/components/CampaignView.tsx
