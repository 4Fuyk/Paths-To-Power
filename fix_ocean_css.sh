#!/bin/bash
sed -i 's/filter: invert(1) hue-rotate(210deg) brightness(1.2) contrast(1.1) saturate(1.5) !important;/filter: invert(1) hue-rotate(180deg) brightness(1.1) contrast(1.2) saturate(1.5) !important;/g' src/index.css
