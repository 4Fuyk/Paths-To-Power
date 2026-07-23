const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const replacement = `
      try {
        map.off();
        map.remove();
      } catch (e) {}
`;

c = c.replace(/try \{\n\s*const container = map\.getContainer\(\) as any;\n\s*if \(container\) \{\n\s*map\.remove\(\);\n\s*container\._leaflet_id = null;\n\s*\}\n\s*\} catch \(e\) \{\}/g, replacement);

fs.writeFileSync('src/components/CampaignView.tsx', c);
