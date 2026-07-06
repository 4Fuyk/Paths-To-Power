import fs from 'fs';
import { normalizeName, getRegionIdFromNormalizedName } from './src/utils/mapUtils';
import { PLAYABLE_COUNTRIES } from './src/constants/countries';

const geojson = JSON.parse(fs.readFileSync('public/egypt-provinces.geojson', 'utf8'));

const egypt = PLAYABLE_COUNTRIES.find(c => c.id === 'EG');
const mappedGeojsonIds = geojson.features.map((f: any) => {
  return getRegionIdFromNormalizedName(normalizeName(f.properties.NAME_1), 'EG');
});

egypt?.regions.forEach(r => {
  const norm = normalizeName(r.id);
  if (!mappedGeojsonIds.includes(norm)) {
    console.log(`Region in countries.ts not found in GeoJSON: ${r.id} -> ${norm}`);
  }
});
console.log("Check 2 complete.");
