#!/bin/bash
file=src/components/DiplomacyView.tsx

# add base map tile class
sed -i 's/noWrap: true,/noWrap: true,\n        className: "base-map-tile"/g' $file

