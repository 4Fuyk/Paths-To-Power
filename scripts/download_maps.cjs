const fs = require('fs');
const https = require('https');
const path = require('path');

function fetchWithRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchWithRedirect(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve(buf.toString('utf8'));
      });
    }).on('error', reject);
  });
}

const countries = [
  { id: 'RU', file: 'russia.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/RUS/ADM1/geoBoundaries-RUS-ADM1_simplified.geojson' },
  { id: 'IS', file: 'iceland.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/ISL/ADM1/geoBoundaries-ISL-ADM1_simplified.geojson' },
  { id: 'PT', file: 'portugal.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/PRT/ADM1/geoBoundaries-PRT-ADM1_simplified.geojson' },
  { id: 'CL', file: 'chile.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/CHL/ADM1/geoBoundaries-CHL-ADM1_simplified.geojson' },
  { id: 'IR', file: 'iran.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/IRN/ADM1/geoBoundaries-IRN-ADM1_simplified.geojson' },
  { id: 'UA', file: 'ukraine.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/UKR/ADM1/geoBoundaries-UKR-ADM1_simplified.geojson' },
  { id: 'SE', file: 'sweden.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/SWE/ADM1/geoBoundaries-SWE-ADM1_simplified.geojson' },
  { id: 'GR', file: 'greece.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/GRC/ADM1/geoBoundaries-GRC-ADM1_simplified.geojson' },
  { id: 'SA', file: 'saudi-arabia.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/SAU/ADM1/geoBoundaries-SAU-ADM1_simplified.geojson' },
  { id: 'IL', file: 'israel.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/ISR/ADM1/geoBoundaries-ISR-ADM1_simplified.geojson' },
  { id: 'PS', file: 'palestine.geojson', url: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/PSE/ADM1/geoBoundaries-PSE-ADM1_simplified.geojson' },
  { id: 'TW', file: 'taiwan.geojson', url: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/taiwan.geojson' }
];

async function main() {
  for (const c of countries) {
    try {
      console.log(`Fetching ${c.id} from ${c.url}...`);
      const raw = await fetchWithRedirect(c.url);
      const parsed = JSON.parse(raw);
      if (!parsed.features || parsed.features.length === 0) {
        throw new Error('No features in GeoJSON');
      }
      const dest = path.join(__dirname, '../public', c.file);
      fs.writeFileSync(dest, JSON.stringify(parsed));
      console.log(`Saved ${c.file} (${parsed.features.length} features, ${raw.length} bytes)`);
    } catch(e) {
      console.error(`Failed ${c.id}: ${e.message}`);
    }
  }
}

main();
