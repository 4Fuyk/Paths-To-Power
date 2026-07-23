const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/const currency =[^]*?: country\.id === 'KR' \? '₩' \n    : '.*?\n/s, `const currency = country.id === 'TR' ? '₺' 
    : ['DE', 'IT', 'ES'].includes(country.id) ? '€' 
    : country.id === 'ZA' ? 'R' 
    : country.id === 'IN' ? '₹' 
    : country.id === 'ID' ? 'Rp' 
    : country.id === 'KR' ? '₩' 
    : '$$';\n`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
