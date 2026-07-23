const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/    \} catch \(e\) \{\}\n    try \{\n      map\.eachLayer/s, `    }
    
    // Clear old layers/markers robustly
    try {
      map.closeTooltip();
    } catch (e) {}
    try {
      map.eachLayer`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
