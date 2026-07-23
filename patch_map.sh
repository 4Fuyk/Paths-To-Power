#!/bin/bash
file=$1
# add className to base map
sed -i 's/noWrap: true,/noWrap: true,\n      className: "base-map-tile"/g' $file
# add className to terrain map (note: this might duplicate if there are multiple tileLayer calls)
