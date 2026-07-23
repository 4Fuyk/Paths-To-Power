const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/if \(lastCountryIdRef\.current !== country\.id\) \{[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}[^}]+\}/s, (match) => {
  return `if (lastCountryIdRef.current !== country.id) {
      lastCountryIdRef.current = country.id;
      if (country.id === 'DE') {
        map.setView([51.1657, 10.4515], 6);
      } else if (country.id === 'US') {
        map.setView([37.0902, -95.7129], 4);
      } else if (country.id === 'BR') {
        map.setView([-14.235, -51.9253], 4);
      } else if (country.id === 'JP') {
        map.setView([36.2048, 138.2529], 5);
      } else if (country.id === 'EG') {
        map.setView([26.8206, 30.8025], 5);
      } else if (country.id === 'GB') {
        map.setView([54.3781, -3.4360], 5);
      } else if (country.id === 'CA') {
        map.setView([56.1304, -106.3468], 3);
      } else if (country.id === 'ZA') {
        map.setView([-30.5595, 22.9375], 5);
      } else if (country.id === 'IN') {
        map.setView([20.5937, 78.9629], 4);
      } else if (country.id === 'MX') {
        map.setView([23.6345, -102.5528], 5);
      } else if (country.id === 'ES') {
        map.setView([40.4637, -3.7492], 5);
      } else if (country.id === 'AU') {
        map.setView([-25.2744, 133.7751], 4);
      } else if (country.id === 'AR') {
        map.setView([-38.4161, -63.6167], 4);
      } else if (country.id === 'IT') {
        map.setView([41.8719, 12.5674], 5);
      } else if (country.id === 'ID') {
        map.setView([-0.7893, 113.9213], 5);
      } else if (country.id === 'KR') {
        map.setView([35.9078, 127.7669], 6);
      } else {
        map.setView([38.9637, 35.2433], 6);
      }
    }`;
});

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
