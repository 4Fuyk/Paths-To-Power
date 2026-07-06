const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

// replace the map.remove() logic in cleanupTurkeyMap to make sure container is cleared properly
const oldCleanup = `      try {
        const container = map.getContainer() as any;
        if (container && container._leaflet_id) {
          map.remove();
        }
      } catch (e) {}`;

const newCleanup = `      try {
        const container = map.getContainer() as any;
        if (container) {
          map.remove();
          container._leaflet_id = null;
        }
      } catch (e) {}`;

if (content.includes(oldCleanup)) {
  content = content.replace(oldCleanup, newCleanup);
  fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
  console.log("Fixed map cleanup!");
} else {
  console.log("old cleanup not found");
}
