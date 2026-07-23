const fs = require('fs');
let c = fs.readFileSync('src/components/WorldMap.tsx', 'utf8');

c = c.replace(/setTimeout\(\(\) => \{\n\s*map\.invalidateSize\(\);\n\s*\}, 300\);/g, 
  "setTimeout(() => { try { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); } catch(e) {} }, 300);");

fs.writeFileSync('src/components/WorldMap.tsx', c);
