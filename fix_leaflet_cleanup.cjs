const fs = require('fs');
let content = fs.readFileSync('src/components/CampaignView.tsx', 'utf8');

const regex = /const cleanupTurkeyMap = \(\) => \{\n    if \(turkeyMapInstanceRef\.current\) \{\n      const map = turkeyMapInstanceRef\.current;/;

const newLogic = `const cleanupTurkeyMap = () => {
    if (turkeyMapInstanceRef.current) {
      const map = turkeyMapInstanceRef.current;
      try {
         map.stop();
      } catch(e) {}`;

if (regex.test(content)) {
  content = content.replace(regex, newLogic);
  fs.writeFileSync('src/components/CampaignView.tsx', content, 'utf8');
  console.log("Fixed cleanupTurkeyMap");
} else {
  console.log("Could not find cleanupTurkeyMap start.");
}
