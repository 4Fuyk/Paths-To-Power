const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/setCoalitions\(generated\);/g, "setCoalitions([...(coalitions || []), ...generated]);");

fs.writeFileSync('src/App.tsx', c);
