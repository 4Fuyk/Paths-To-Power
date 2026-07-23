const fs = require('fs');
let c = fs.readFileSync('src/constants/countries.ts', 'utf8');
if(c.includes("id: 'IN'")) {
    console.log("India found!");
}
