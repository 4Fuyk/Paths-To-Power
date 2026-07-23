const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/setTimeout\(\(\) => \{\n\s*map\.invalidateSize\(\);\n\s*\}, 250\);/g, 
  "setTimeout(() => { try { if (turkeyMapInstanceRef.current) turkeyMapInstanceRef.current.invalidateSize(); } catch(e) {} }, 250);");

fs.writeFileSync('src/components/CampaignView.tsx', c);
