const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/if \(isHighcharts\) \{\n        \/\/ Skip manual setView, rely on fitBounds later\n      \}\n      if \(country\.id === 'DE'\)/g, `if (country.id === 'DE')`);

c = c.replace(/\} else \{\n        map\.setView\(\[38\.9637, 35\.2433\], 6\);\n      \}/g, `} else if (isHighcharts) {
        // Skip manual setView, will be fit bounds later
      } else {
        map.setView([38.9637, 35.2433], 6);
      }`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
