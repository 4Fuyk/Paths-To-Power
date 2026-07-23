const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const isHighcharts = \['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'\]\.includes\(country\.id\);\s+let mapOptions: any = \{[^}]+\};\s+if \(isHighcharts\) \{\s+mapOptions\.crs = L\.CRS\.Simple;\s+\}\s+const map = L\.map\(turkeyMapRef\.current, mapOptions\);\s+const tileUrl = darkMode\s+\? 'https:\/\/{s}\.basemaps\.cartocdn\.com\/dark_all\/{z}\/{x}\/{y}{r}\.png'\s+: 'https:\/\/{s}\.basemaps\.cartocdn\.com\/light_all\/{z}\/{x}\/{y}{r}\.png';\s+if \(!isHighcharts\) \{\s+const tiles = L\.tileLayer\(tileUrl, \{\s+subdomains: 'abcd',\s+maxZoom: 18,\s+\}\)\.addTo\(map\);\s+turkeyTileLayerRef\.current = tiles;\s+\}\s+turkeyMapInstanceRef\.current = map;/s, `
      let mapOptions: any = {
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        maxBoundsViscosity: 1.0,
      };
      const map = L.map(turkeyMapRef.current, mapOptions);

      const tileUrl = darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);
      turkeyTileLayerRef.current = tiles;

      turkeyMapInstanceRef.current = map;`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
