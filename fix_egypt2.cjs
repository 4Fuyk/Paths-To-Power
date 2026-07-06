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

for (const [id, mayor] of Object.entries(mayors)) {
  const searchFor = `{ id: '${id}', name: '${id}', seats:`;
  const replaceWith = `{ id: '${id}', name: '${id}', mayorName: '${mayor}', seats:`;
  content = content.replace(searchFor, replaceWith);
}

fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
console.log("Mayors replaced!");
