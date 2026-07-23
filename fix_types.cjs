const fs = require('fs');
let c = fs.readFileSync('src/constants/countries.ts', 'utf8');

c = c.replace(/'Federal Parliamentary Republic'/g, "'Coalition Government'");
c = c.replace(/'Parliamentary Republic'/g, "'Coalition Government'");
c = c.replace(/'Parliamentary Monarchy'/g, "'Coalition Government'");
c = c.replace(/'Parliamentary Democracy'/g, "'Coalition Government'");
c = c.replace(/'Libertarian'/g, "'Liberal'");
c = c.replace(/'Populist'/g, "'Nationalist'");
c = c.replace(/'Islamic'/g, "'Social Conservative'");
c = c.replace(/'Environmentalist'/g, "'Ecologist'");

fs.writeFileSync('src/constants/countries.ts', c, 'utf8');
