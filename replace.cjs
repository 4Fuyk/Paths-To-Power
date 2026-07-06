const fs = require('fs');
let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

// Replace makeVoterGroup keys
content = content.replace(/'İşçiler'/g, "'Workers'");
content = content.replace(/'Gençler'/g, "'Youth'");
content = content.replace(/'Nationalistler'/g, "'Nationalists'");
content = content.replace(/'Liberaller'/g, "'Liberals'");
content = content.replace(/'Gelenekçiler'/g, "'Traditionalists'");
content = content.replace(/'Esnaflar'/g, "'Shopkeepers'");

// Replace BILL_POOL keys (they are already replaced above, wait no they were using 'İşçiler' etc which are replaced)
// Replace SPEECH_CARDS_POOL keys
content = content.replace(/lowerClass/g, 'Workers');
content = content.replace(/upperClass/g, 'Shopkeepers');
content = content.replace(/conservatives/g, 'Traditionalists');
content = content.replace(/nationalists/g, 'Nationalists');
content = content.replace(/liberals/g, 'Liberals');
content = content.replace(/middleClass/g, 'Shopkeepers'); // merge with shopkeepers
content = content.replace(/lower\/middle class/g, 'workers/shopkeepers');
content = content.replace(/lower class/g, 'workers');
content = content.replace(/upper class/g, 'shopkeepers');
content = content.replace(/middle class/g, 'shopkeepers');

// Also translate other remaining Turkish things:
content = content.replace(/status: 'Bekliyor'/g, "status: 'Pending'");

// Translate ideology
content = content.replace(/ideology: 'Muhafazakar'/g, "ideology: 'Conservative'");
content = content.replace(/ideology: 'Sosyal Demokrat'/g, "ideology: 'Social Democrat'");
content = content.replace(/ideology: 'Sosyal Muhafazakar'/g, "ideology: 'Social Conservative'");
content = content.replace(/ideology: 'Milliyetçi'/g, "ideology: 'Nationalist'");
content = content.replace(/ideology: 'Merkez'/g, "ideology: 'Centrist'");
content = content.replace(/ideology: 'Komünist'/g, "ideology: 'Communist'");

fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
console.log('Translated everything!');
