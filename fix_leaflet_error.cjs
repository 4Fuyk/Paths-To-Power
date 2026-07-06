const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const regex = /\/\/ Clear old layers\/markers robustly[\s\S]*?turkeyGeoJsonLayerRef\.current = null;/;

const newRemoveLogic = `    // Clear old layers/markers robustly
    try {
      map.closeTooltip();
    } catch (e) {}
    try {
      map.eachLayer((layer) => {
        if (layer !== turkeyTileLayerRef.current) {
          try {
            if (layer.unbindTooltip) layer.unbindTooltip();
            if (layer.unbindPopup) layer.unbindPopup();
            if (layer.off) layer.off();
            map.removeLayer(layer);
          } catch (e) {}
        }
      });
    } catch (e) {}
    turkeyGeoJsonLayerRef.current = null;`;

if (regex.test(content)) {
  content = content.replace(regex, newRemoveLogic);
  fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
  console.log("Fixed layer removal!");
} else {
  console.log("Could not find old layer removal logic.");
}
