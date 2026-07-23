const fs = require('fs');

function fixFile(file) {
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/try \{\n\s*map\.off\(\);\n\s*map\.remove\(\);\n\s*\} catch \(e\) \{\}/g, 
      "try { if(map.stop) map.stop(); map.off(); map.remove(); } catch(e) {}");
    fs.writeFileSync(file, c);
}

fixFile('src/components/CampaignView.tsx');
fixFile('src/components/TacticalBattleView.tsx');
fixFile('src/components/WorldMap.tsx');
