const fs = require('fs');

let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

content = content.replace(/Muhafazakar/g, 'Conservative');
content = content.replace(/Sosyal Demokrat/g, 'Social Democrat');
content = content.replace(/Sosyalist/g, 'Socialist');
content = content.replace(/Milliyetçi/g, 'Nationalist');
content = content.replace(/Ekolojist/g, 'Ecologist');
content = content.replace(/Hükümet Koalisyonu/g, 'Coalition Government');
content = content.replace(/Başkanlık Sistemi/g, 'Presidential System');
content = content.replace(/Dar Bölge Meclisi/g, 'First-Past-The-Post');

fs.writeFileSync('src/constants/countries.ts', content);
console.log('Translated');
