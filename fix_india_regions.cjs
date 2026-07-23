const fs = require('fs');

const indiaRegions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
];

const regionsObj = indiaRegions.map(name => ({
    id: name,
    name: name,
    seats: name === "Uttar Pradesh" ? 80 : (name === "Maharashtra" ? 48 : (name === "West Bengal" ? 42 : (name === "Bihar" ? 40 : (name === "Tamil Nadu" ? 39 : 10)))),
    voterDistribution: { "Working Class": 20, "Middle Class": 20, "Upper Class": 20, "Youth": 20, "Elderly": 10, "Rural": 10 },
    supports: { BJP: 40, INC: 30, TMC: 5 },
    infrastructure: 3,
    campaignLevel: 0,
    ownerPartyId: "BJP",
    mayorName: ""
}));

let c = fs.readFileSync('src/constants/countries.ts', 'utf8');

const regex = /(id:\s*'IN'[\s\S]*?regions:\s*)\[([\s\S]*?)\](,\s*bills:)/;
c = c.replace(regex, `$1${JSON.stringify(regionsObj)}$3`);

fs.writeFileSync('src/constants/countries.ts', c);
console.log("Replaced India regions");
