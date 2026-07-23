const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const geoLayer = L\.geoJSON\(displayGeoJson, \{/g, `const geoLayer = L.geoJSON(displayGeoJson, {
        coordsToLatLng: (coords) => {
          const isHighcharts = ['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'].includes(country.id);
          if (isHighcharts) {
            return L.latLng(-coords[1], coords[0]);
          }
          return L.latLng(coords[1], coords[0]);
        },`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
