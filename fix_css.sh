#!/bin/bash
sed -i 's/filter: sepia(0.8) hue-rotate(195deg) saturate(1.8) brightness(0.6) contrast(1.1) !important;/filter: invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1) saturate(1.2) !important;/g' src/index.css
