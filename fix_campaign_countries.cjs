const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const supportedCountries = \['TR', 'DE', 'US', 'BR', 'JP', 'EG', 'GB'\];/g, "const supportedCountries = ['TR', 'DE', 'US', 'BR', 'JP', 'EG', 'GB', 'CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'];");
c = c.replace(/\{\(\['TR', 'DE', 'US', 'BR', 'JP', 'EG', 'GB'\]\.includes\(country\.id\)\) && \(/g, "{(['TR', 'DE', 'US', 'BR', 'JP', 'EG', 'GB', 'CA', 'ZA', 'IN', 'MX', 'ES', 'AU', 'AR', 'IT', 'ID', 'KR'].includes(country.id)) && (");

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
