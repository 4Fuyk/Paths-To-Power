const fs = require('fs');

const mexicoRegions = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Mexico City", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "State of Mexico", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const regionsObj = mexicoRegions.map(name => ({
    id: name,
    name: name,
    seats: name === "State of Mexico" ? 40 : (name === "Mexico City" ? 30 : 10),
    voterDistribution: { "Working Class": 20, "Middle Class": 20, "Upper Class": 20, "Youth": 20, "Elderly": 10, "Rural": 10 },
    supports: { MORENA: 50, PAN: 30, PRI: 10 },
    infrastructure: 3,
    campaignLevel: 0,
    ownerPartyId: "MORENA",
    mayorName: ""
}));

let c = fs.readFileSync('src/constants/countries.ts', 'utf8');

const regex = /(id:\s*'MX'[\s\S]*?regions:\s*)\[([\s\S]*?)\](,\s*bills:)/;
c = c.replace(regex, `$1${JSON.stringify(regionsObj)}$3`);

fs.writeFileSync('src/constants/countries.ts', c);
console.log("Replaced Mexico regions");
