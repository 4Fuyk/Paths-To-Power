import fs from 'fs';
import { normalizeName, getRegionIdFromNormalizedName } from './src/utils/mapUtils';
import { PLAYABLE_COUNTRIES } from './src/constants/countries';

const geojson = JSON.parse(fs.readFileSync('public/egypt-provinces.geojson', 'utf8'));

const egypt = PLAYABLE_COUNTRIES.find(c => c.id === 'EG');
const egyptRegionIds = egypt?.regions.map(r => normalizeName(r.id)) || [];

geojson.features.forEach((feature: any) => {
  const name1 = feature.properties.NAME_1;
  const norm = normalizeName(name1);
  const regionId = getRegionIdFromNormalizedName(norm, 'EG');
  
  if (!egyptRegionIds.includes(regionId)) {
    console.log(`Unmapped region: ${name1} -> ${norm} -> ${regionId}`);
  }
});
console.log("Check complete.");
