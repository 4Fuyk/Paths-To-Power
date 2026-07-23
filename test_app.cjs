const fs = require('fs');
let c = fs.readFileSync('src/constants/countries.ts', 'utf8');
if(c.includes("Arunachal Pradesh")) {
    console.log("India regions updated!");
}
if(c.includes("Baja California")) {
    console.log("Mexico regions updated!");
}
