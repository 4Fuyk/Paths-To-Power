const fs = require('fs');
let content = fs.readFileSync('src/components/ParliamentView.tsx', 'utf8');

content = content.replace(/'Bekliyor'/g, "'Pending'");
content = content.replace(/'Geçti'/g, "'Passed'");
content = content.replace(/'Reddedildi'/g, "'Rejected'");

content = content.replace(/selectedBill\.status === 'Pending' \|\| selectedBill\.status === 'Pending'/g, "selectedBill.status === 'Pending'");
content = content.replace(/selectedBill\.status !== 'Pending' && selectedBill\.status !== 'Pending'/g, "selectedBill.status !== 'Pending'");

fs.writeFileSync('src/components/ParliamentView.tsx', content, 'utf8');
console.log('Fixed ParliamentView.tsx');
