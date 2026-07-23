#!/bin/bash
sed -i "s/? 'sepia(0.8) hue-rotate(195deg) saturate(1.8) brightness(0.6) contrast(1.1) !important;'/? 'brightness(0.4) contrast(1.3) saturate(1.2) !important;'/g" src/components/WorldMap.tsx
sed -i "s/: 'saturate(2.0) contrast(1.1) !important;'}/: 'brightness(0.9) saturate(1.2) contrast(1.1) !important;'}/g" src/components/WorldMap.tsx
