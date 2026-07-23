const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const isHighcharts = \['CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'\]\.includes\(country\.id\);\s+if \(isHighcharts && hasFitBoundsForCountryRef\.current !== country\.id\) \{/s, `if (hasFitBoundsForCountryRef.current !== country.id) {`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
