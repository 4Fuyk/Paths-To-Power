#!/bin/bash
sed -i 's/filter: invert(1) hue-rotate(180deg) brightness(1.1) contrast(1.2) saturate(1.5) !important;/filter: brightness(0.4) contrast(1.3) saturate(1.2) !important;/g' src/index.css
sed -i 's/filter: saturate(2.0) contrast(1.1) !important;/filter: brightness(0.9) saturate(1.2) contrast(1.1) !important;/g' src/index.css
