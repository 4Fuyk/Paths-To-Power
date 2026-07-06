const fs = require('fs');
let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

const mayors = {
  'Alexandria': 'Mohamed Taher Al-Sherif',
  'Aswan': 'Ashraf Attia',
  'Asyut': 'Essam Saad',
  'Beheira': 'Hisham Amna',
  'Beni Suef': 'Mohamed Hany Ghoneim',
  'Cairo': 'Khaled Abdel Aal',
  'Dakahlia': 'Ayman Mokhtar',
  'Damietta': 'Manal Awad Mikhail',
  'Faiyum': 'Ahmed Al-Ansari',
  'Gharbia': 'Tarek Rahmy',
  'Giza': 'Ahmed Rashed',
  'Ismailia': 'Sherif Fahmy Bishara',
  'Kafr El Sheikh': 'Gamal Nour El-Din',
  'Luxor': 'Mustafa Al-Alham',
  'Matrouh': 'Khaled Shoaib',
  'Minya': 'Osama Al-Qady',
  'Monufia': 'Ibrahim Abu Limon',
  'New Valley': 'Mohamed Al-Zamlout',
  'North Sinai': 'Mohamed Shousha',
  'Port Said': 'Adel Ghadban',
  'Qalyubia': 'Abdel Hamid El-Haggan',
  'Qena': 'Ashraf Daoudi',
  'Red Sea': 'Amr Hanafy',
  'Sharqia': 'Mamdouh Ghorab',
  'Sohag': 'Tarek El-Feki',
  'South Sinai': 'Khaled Fouda',
  'Suez': 'Abdel Majeed Saqr'
};

const regex = /\{ id: '([^']+)', name: '([^']+)', seats:/g;

let startIdx = content.indexOf("id: 'EG'");
let endIdx = content.indexOf("id: 'GB'"); 
if (endIdx === -1) endIdx = content.length;

let egyptContent = content.substring(startIdx, endIdx);

egyptContent = egyptContent.replace(/\{ id: '([^']+)', name: '([^']+)', seats:/g, (match, id, name) => {
  if (mayors[id]) {
    return `{ id: '${id}', name: '${name}', mayorName: '${mayors[id]}', seats:`;
  }
  return match;
});

content = content.substring(0, startIdx) + egyptContent + content.substring(endIdx);

fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
console.log("Mayors added!");
