#!/bin/bash

# Update WorldMap.tsx unplayable countries style and borders
sed -i "s/if (!countryId) return { fillColor: darkMode ? '#1e293b' : '#cbd5e1', color: darkMode ? '#1e293b' : '#94a3b8', weight: 1, fillOpacity: 1, interactive: false };/if (!countryId) return { fillColor: darkMode ? '#334155' : '#e2e8f0', color: '#ffffff', weight: 0.5, fillOpacity: 0.9, interactive: false };/g" src/components/WorldMap.tsx

# Change weight to 0.5 for playable countries, keeping white borders
sed -i "s/weight: isSelected ? 2.5 : 1.5,/weight: isSelected ? 2.5 : 0.8,/g" src/components/WorldMap.tsx

# Update CampaignView.tsx similarly
sed -i "s/if (!countryId) return { fillColor: darkMode ? '#1e293b' : '#cbd5e1', color: darkMode ? '#1e293b' : '#94a3b8', weight: 1, fillOpacity: 1, interactive: false };/if (!countryId) return { fillColor: darkMode ? '#334155' : '#e2e8f0', color: '#ffffff', weight: 0.5, fillOpacity: 0.9, interactive: false };/g" src/components/CampaignView.tsx

# Also CampaignView playable countries borders
# Wait, CampaignView doesn't have getPlayableCountryCode in style for districts, it uses feature.properties.isDistrict

