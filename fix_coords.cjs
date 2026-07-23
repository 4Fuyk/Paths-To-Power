const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const geoLayer = L\.geoJSON\(displayGeoJson, \{\s+coordsToLatLng: \(coords\) => \{\s+const isHighcharts = \['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'\]\.includes\(country\.id\);\s+if \(isHighcharts\) \{\s+return L\.latLng\(-coords\[1\], coords\[0\]\);\s+\}\s+return L\.latLng\(coords\[1\], coords\[0\]\);\s+\},/s, `const geoLayer = L.geoJSON(displayGeoJson, {`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
