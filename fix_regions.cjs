const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const injection = `
  // Check for missing regions in geojson and add them dynamically
  useEffect(() => {
    if (!geoJsonData || !geoJsonData.features) return;
    
    let hasChanges = false;
    const newRegions = [...country.regions];
    
    const playerStart = 2;

    geoJsonData.features.forEach((feature: any) => {
       if (feature.properties?.isDistrict) return;

       const fName = getFeatureName(feature);
       if (!fName) return;
       
       const normName = normalizeName(fName);
       const regionId = getRegionIdFromNormalizedName(normName, country.id) || normName;
       
       const exists = newRegions.find(r => r.id === regionId || normalizeName(r.id) === normName || normalizeName(r.name) === normName);
       
       if (!exists) {
         hasChanges = true;
         
         const supports: Record<string, number> = {};
         supports[party.id] = playerStart;
         
         const totalRivalBase = country.rivals.reduce((sum, r) => sum + r.baseSupport, 0);
         let sharedRemaining = 100 - playerStart;
         country.rivals.forEach((rival) => {
           const share = rival.baseSupport / totalRivalBase;
           supports[rival.id] = share * sharedRemaining;
         });
         
         // Normalize sum to 100
         const currentSum = Object.values(supports).reduce((s, v) => s + v, 0);
         if (Math.abs(currentSum - 100) > 0.1) {
           const factor = 100 / currentSum;
           Object.keys(supports).forEach(k => {
             supports[k] = supports[k] * factor;
           });
         }

         let leadingPartyId = party.id;
         let maxSupport = supports[party.id];
         Object.entries(supports).forEach(([pid, val]) => {
           if (val > maxSupport) {
             maxSupport = val;
             leadingPartyId = pid;
           }
         });

         newRegions.push({
            id: regionId,
            name: fName,
            seats: 5, // Default generic seat count
            voterDistribution: {
                "Working Class": 20,
                "Middle Class": 20,
                "Upper Class": 20,
                "Youth": 20,
                "Elderly": 10,
                "Rural": 10
            },
            supports: supports,
            infrastructure: 1,
            campaignLevel: 0,
            ownerPartyId: leadingPartyId,
            mayorName: ""
         });
       }
    });

    if (hasChanges) {
      onUpdateCountry({ ...country, regions: newRegions });
    }
  }, [geoJsonData]);
`;

c = c.replace(/const \[geoJsonData, setGeoJsonData\] = useState<any>\(null\);\s+const \[districtGeoJsonData, setDistrictGeoJsonData\] = useState<any>\(null\);/, `const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState<any>(null);` + injection);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
