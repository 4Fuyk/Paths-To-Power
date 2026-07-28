const fs = require('fs');
const paths = JSON.parse(fs.readFileSync('paths.json'));
fs.writeFileSync('src/constants/worldPaths.ts', `export const CONTINENTS = ${JSON.stringify(paths, null, 2)};\n`);
