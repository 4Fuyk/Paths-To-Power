const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const lastCountryIdRef = React\.useRef<string \| null>\(null\);/g, `const lastCountryIdRef = React.useRef<string | null>(null);
  const hasFitBoundsForCountryRef = React.useRef<string | null>(null);`);

c = c.replace(/if \(lastCountryIdRef\.current !== country\.id\) \{\n      lastCountryIdRef\.current = country\.id;/g, `if (lastCountryIdRef.current !== country.id) {
      lastCountryIdRef.current = country.id;
      const isHighcharts = ['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'].includes(country.id);
      if (isHighcharts) {
        // Skip manual setView, rely on fitBounds later
      }`);

c = c.replace(/\}\)\.addTo\(map\);\n\n      turkeyGeoJsonLayerRef\.current = geoLayer;/g, `}).addTo(map);

      turkeyGeoJsonLayerRef.current = geoLayer;
      
      const isHighcharts = ['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'].includes(country.id);
      if (isHighcharts && hasFitBoundsForCountryRef.current !== country.id) {
        try {
          map.fitBounds(geoLayer.getBounds(), { padding: [20, 20], animate: false });
          hasFitBoundsForCountryRef.current = country.id;
        } catch(e) {}
      }`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
