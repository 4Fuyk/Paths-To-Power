const fs = require('fs');
let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

// Japan party IDs
content = content.replace(/"Ishin no Kai":/g, '"ISHIN":');
content = content.replace(/'Ishin no Kai'/g, "'ISHIN'");
content = content.replace(/"Komeito":/g, '"KOMEITO":');
content = content.replace(/'Komeito'/g, "'KOMEITO'");

fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
console.log('Fixed Japan IDs');
