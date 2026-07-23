const fs = require('fs');
let c = fs.readFileSync('src/components/TacticalBattleView.tsx', 'utf8');

c = c.replace(/geoJsonLayerRef\.current\.setStyle/g, 
  "if (mapInstanceRef.current && mapInstanceRef.current.hasLayer(geoJsonLayerRef.current)) geoJsonLayerRef.current.setStyle");

fs.writeFileSync('src/components/TacticalBattleView.tsx', c);
