const fs = require('fs');
let c = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

c = c.replace(/    const finalCost = type === 'townhall' \? 15000 : 5000;/g, `  const handleLaunchDistrictCampaign = (type: 'townhall' | 'flyers') => {
    const finalCost = type === 'townhall' ? 15000 : 5000;`);

fs.writeFileSync('src/components/CampaignView.tsx', c, 'utf8');
