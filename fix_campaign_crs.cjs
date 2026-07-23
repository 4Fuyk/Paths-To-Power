const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const map = L\.map\(turkeyMapRef\.current, \{[^}]+\}\);/s, `const isHighcharts = ['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'].includes(country.id);
      
      let mapOptions: any = {
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        maxBoundsViscosity: 1.0,
      };

      if (isHighcharts) {
        mapOptions.crs = L.CRS.Simple;
      }

      const map = L.map(turkeyMapRef.current, mapOptions);`);

c = c.replace(/const tiles = L\.tileLayer\(tileUrl, \{\n        subdomains: 'abcd',\n        maxZoom: 18,\n      \}\)\.addTo\(map\);\n\n      turkeyTileLayerRef\.current = tiles;/g, `if (!isHighcharts) {
        const tiles = L.tileLayer(tileUrl, {
          subdomains: 'abcd',
          maxZoom: 18,
        }).addTo(map);
        turkeyTileLayerRef.current = tiles;
      }`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
