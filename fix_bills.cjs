const fs = require('fs');
let c = fs.readFileSync('src/constants/countries.ts', 'utf8');

c = c.replace(/const selectedCount = Math\.floor\(Math\.random\(\) \* 3\) \+ 4; \/\/ Select 4 to 6 bills/g, "const selectedCount = 8;");
// wait, let's just make sure we select up to the length of the pool
c = c.replace(/const selectedCount = [^\n]+/g, "const selectedCount = Math.min(8, shuffled.length);");

fs.writeFileSync('src/constants/countries.ts', c);
