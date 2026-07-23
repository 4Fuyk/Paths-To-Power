const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const geojsonMapUrls: Record<string, string> = \{[^}]+\};/s, `const geojsonMapUrls: Record<string, string> = {
      BR: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/brazil-states.geojson',
      JP: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/japan.geojson',
      EG: '/egypt-provinces.geojson',
      GB: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json',
      CA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson',
      ZA: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-africa.geojson',
      IN: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/india.geojson',
      MX: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/mexico.geojson',
      ES: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/spain-communities.geojson',
      AU: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
      IT: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/italy-regions.geojson',
      ID: 'https://cdn.jsdelivr.net/gh/superpikar/indonesia-geojson@master/indonesia.geojson',
      KR: 'https://cdn.jsdelivr.net/gh/southkorea/southkorea-maps@master/kostat/2013/json/skorea_provinces_geo_simple.json',
      AR: 'https://raw.githubusercontent.com/Rodri1791/Regions_Argentina/main/Regiones_ArgentinasGJSON/provinciasargentina.geojson'
    };`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
