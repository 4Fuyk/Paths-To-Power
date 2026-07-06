const fs = require('fs');
let content = fs.readFileSync('src/components/ParliamentView.tsx', 'utf8');

content = content.replace(/'Kabul Edildi'/g, "'Passed'");
content = content.replace(/selectedBill\.status === 'Passed' \|\| selectedBill\.status === 'Passed'/g, "selectedBill.status === 'Passed'");
content = content.replace(/case 'Passed':\s+return <CheckCircle2 className="w-5 h-5 text-green-500" \/>;\s+case 'Passed':\s+return <CheckCircle2 className="w-5 h-5 text-green-500" \/>;/g, "case 'Passed': return <CheckCircle2 className=\"w-5 h-5 text-green-500\" />;");

fs.writeFileSync('src/components/ParliamentView.tsx', content, 'utf8');
console.log('Fixed ParliamentView.tsx');
