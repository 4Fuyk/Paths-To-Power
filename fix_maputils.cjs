const fs = require('fs');
let content = fs.readFileSync('src/utils/mapUtils.ts', 'utf8');

content = content.replace("'alwadiatjadid': 'newvalley',", "'alwadiatjadid': 'newvalley',\n      'alwadialjadid': 'newvalley',");
content = content.replace("'luxor': 'luxor',", "'luxor': 'luxor',\n      'aluqsur': 'luxor',");

fs.writeFileSync('src/utils/mapUtils.ts', content, 'utf8');
console.log("MapUtils fixed!");
