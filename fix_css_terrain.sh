#!/bin/bash
sed -i 's/filter: contrast(1.5) brightness(1.2) opacity(0.7) !important;/filter: grayscale(1) contrast(1.5) brightness(1.1) !important;/g' src/index.css
sed -i 's/filter: invert(1) contrast(1.8) opacity(0.8) !important;/filter: grayscale(1) contrast(1.5) brightness(1.1) !important;/g' src/index.css
