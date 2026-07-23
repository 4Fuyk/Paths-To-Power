const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const replacement = `    const geojsonMapUrls: Record<string, string> = {
      BR: 'https://cdn.jsdelivr.net/gh/codeforamerica/click_that_hood@master/public/data/brazil-states.geojson',
      JP: 'https://cdn.jsdelivr.net/gh/dataofjapan/land@master/japan.geojson',
      EG: '/egypt-provinces.geojson',
      GB: 'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json',
      CA: 'https://code.highcharts.com/mapdata/countries/ca/ca-all.geo.json',
      ZA: 'https://code.highcharts.com/mapdata/countries/za/za-all.geo.json',
      IN: 'https://code.highcharts.com/mapdata/countries/in/in-all.geo.json',
      MX: 'https://code.highcharts.com/mapdata/countries/mx/mx-all.geo.json',
      ES: 'https://code.highcharts.com/mapdata/countries/es/es-all.geo.json',
      AU: 'https://code.highcharts.com/mapdata/countries/au/au-all.geo.json',
      AR: 'https://code.highcharts.com/mapdata/countries/ar/ar-all.geo.json',
      IT: 'https://code.highcharts.com/mapdata/countries/it/it-all.geo.json',
      ID: 'https://code.highcharts.com/mapdata/countries/id/id-all.geo.json',
      KR: 'https://code.highcharts.com/mapdata/countries/kr/kr-all.geo.json'
    };`;

c = c.replace(/const geojsonMapUrls: Record<string, string> = \{[^}]+\};/s, replacement);
fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
