const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

// We will add a simple getPolygonCenter function inside the `useEffect` or globally
const centerFunc = `
const getPolygonCenter = (feat: any) => {
  let minX = 180, maxX = -180, minY = 90, maxY = -90;
  let pts = 0;
  const processCoords = (coords: any[]) => {
    if (typeof coords[0] === 'number') {
      const lng = coords[0], lat = coords[1];
      if (lng < minX) minX = lng;
      if (lng > maxX) maxX = lng;
      if (lat < minY) minY = lat;
      if (lat > maxY) maxY = lat;
      pts++;
    } else {
      coords.forEach(processCoords);
    }
  };
  if (feat.geometry && feat.geometry.coordinates) {
    processCoords(feat.geometry.coordinates);
  }
  if (pts === 0) return null;
  return { lat: (minY + maxY) / 2, lng: (minX + maxX) / 2 };
};
`;

if (!content.includes('getPolygonCenter')) {
  content = content.replace('const subdivideProvinceGeoJson', centerFunc + '\n  const subdivideProvinceGeoJson');
  
  // Replace the default center logic inside the fallback:
  // let center = provinceCentersRef.current[reg.id] || defaultCenter;
  content = content.replace(
    /let center = provinceCentersRef\.current\[reg\.id\] \|\| defaultCenter;/g,
    'let center = provinceCentersRef.current[reg.id] || getPolygonCenter(feat) || defaultCenter;'
  );
  
  fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
  console.log('Fixed center calculation!');
} else {
  console.log('Already fixed?');
}
