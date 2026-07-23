const fs = require('fs');
let c = fs.readFileSync('src/components/TacticalBattleView.tsx', 'utf8');

const replacement = `
      try {
        map.off();
        map.remove();
      } catch (e) {}
`;

c = c.replace(/try \{\n\s*const container = map\.getContainer\(\) as any;\n\s*if \(container && container\._leaflet_id\) \{\n\s*map\.remove\(\);\n\s*\}\n\s*\} catch \(e\) \{\}/g, replacement);

fs.writeFileSync('src/components/TacticalBattleView.tsx', c);
