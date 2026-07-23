const fs = require('fs');
let c = fs.readFileSync('src/constants/countries.ts', 'utf8');
c = c.replace(/The world's/g, "The world\\'s");
c = c.replace(/People's Party/g, "People\\'s Party");
c = c.replace(/People's Representative/g, "People\\'s Representative");
fs.writeFileSync('src/constants/countries.ts', c, 'utf8');
