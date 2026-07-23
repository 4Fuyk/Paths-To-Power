const fs = require('fs');
let c = fs.readFileSync('src/components/WorldMap.tsx', 'utf8');

c = c.replace(/return \(\) => \{\n\s*map\.remove\(\);\n\s*mapInstanceRef\.current = null;\n\s*tileLayerRef\.current = null;\n\s*\};/g, 
  `return () => {
      try { map.off(); map.remove(); } catch(e) {}
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };`);

fs.writeFileSync('src/components/WorldMap.tsx', c);
