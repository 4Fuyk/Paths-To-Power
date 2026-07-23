const https = require('https');
const urls = [
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson',
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/south-africa.geojson',
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/india.geojson',
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/mexico.geojson',
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/spain-provinces.geojson',
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/australia.geojson'
];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const names = json.features.map(f => f.properties.name || f.properties.NAME_1).slice(0, 5);
        console.log(url.split('/').pop(), "=>", names);
      } catch (e) {}
    });
  });
});
