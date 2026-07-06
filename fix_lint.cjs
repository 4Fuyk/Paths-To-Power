const fs = require('fs');
// Fix PartyCreator.tsx
let partyCreator = fs.readFileSync('src/components/PartyCreator.tsx', 'utf8');
partyCreator = partyCreator.replace(/'Sosyal Demokrat'/g, "'Social Democrat'");
partyCreator = partyCreator.replace(/'Muhafazakar'/g, "'Conservative'");
partyCreator = partyCreator.replace(/'Milliyetçi'/g, "'Nationalist'");
partyCreator = partyCreator.replace(/'Sosyalist'/g, "'Socialist'");
partyCreator = partyCreator.replace(/'Ekolojist'/g, "'Ecologist'");
fs.writeFileSync('src/components/PartyCreator.tsx', partyCreator, 'utf8');

// Fix countries.ts
let countries = fs.readFileSync('src/constants/countries.ts', 'utf8');
countries = countries.replace(/'Aşırı Sağ'/g, "'Far Right'");
countries = countries.replace(/category: bill\.category,/g, "category: bill.category as any,");
fs.writeFileSync('src/constants/countries.ts', countries, 'utf8');

console.log('Fixed lint issues!');
