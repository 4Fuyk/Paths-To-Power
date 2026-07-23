const fs = require('fs');
let c = fs.readFileSync('src/components/ElectionSimulator.tsx', 'utf8');

c = c.replace(/\{country\.rivals\.map\(\(rival\) => \{/g, 
  `{country.rivals.filter(rival => !(coalitions?.some(c => c.parties.includes(party.name) && c.parties.includes(rival.name)))).map((rival) => {`);

fs.writeFileSync('src/components/ElectionSimulator.tsx', c);
