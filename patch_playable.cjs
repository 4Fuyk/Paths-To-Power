const fs = require('fs');
let code = fs.readFileSync('src/constants/countries.ts', 'utf8');

const franceStr = `
  {
    id: 'FR',
    name: 'France',
    description: 'A major European power with a semi-presidential system.',
    flag: '🇫🇷',
    seats: 577,
    parliamentName: 'National Assembly',
    system: 'Semi-Presidential',
    population: '68 Million',
    primaryColor: '#002654',
    rivals: [
      { id: 'RE', name: 'Renaissance', leader: 'Emmanuel Macron', ideology: 'Centrist', symbol: 'Globe', color: '#facc15', baseSupport: 25 },
      { id: 'RN', name: 'National Rally', leader: 'Marine Le Pen', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#0f172a', baseSupport: 30 },
      { id: 'LFI', name: 'France Unbowed', leader: 'Jean-Luc Mélenchon', ideology: 'Socialist', symbol: 'Sparkles', color: '#ef4444', baseSupport: 15 },
      { id: 'PS', name: 'Socialist Party', leader: 'Olivier Faure', ideology: 'Social Democrat', symbol: 'Heart', color: '#ec4899', baseSupport: 15 }
    ],
    regions: getFranceRegions(),
    bills: createBills('FR'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },`;

const romaniaStr = `
  {
    id: 'RO',
    name: 'Romania',
    description: 'A rapidly developing Eastern European country.',
    flag: '🇷🇴',
    seats: 330,
    parliamentName: 'Chamber of Deputies',
    system: 'Semi-Presidential',
    population: '19 Million',
    primaryColor: '#fcd116',
    rivals: [
      { id: 'PSD', name: 'Social Democratic Party', leader: 'Marcel Ciolacu', ideology: 'Social Democrat', symbol: 'Heart', color: '#dc2626', baseSupport: 30 },
      { id: 'PNL', name: 'National Liberal Party', leader: 'Nicolae Ciucă', ideology: 'Conservative', symbol: 'Building', color: '#facc15', baseSupport: 20 },
      { id: 'AUR', name: 'Alliance for the Union', leader: 'George Simion', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#000000', baseSupport: 20 },
      { id: 'USR', name: 'Save Romania Union', leader: 'Elena Lasconi', ideology: 'Liberal', symbol: 'Globe', color: '#3b82f6', baseSupport: 15 }
    ],
    regions: getRomaniaRegions(),
    bills: createBills('RO'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },`;

const hungaryStr = `
  {
    id: 'HU',
    name: 'Hungary',
    description: 'A Central European nation characterized by strong conservative policies.',
    flag: '🇭🇺',
    seats: 199,
    parliamentName: 'National Assembly',
    system: 'Parliamentary Republic',
    population: '9.6 Million',
    primaryColor: '#437a46',
    rivals: [
      { id: 'FIDESZ', name: 'Fidesz', leader: 'Viktor Orbán', ideology: 'Nationalist', symbol: 'ShieldAlert', color: '#ea580c', baseSupport: 45 },
      { id: 'TISZA', name: 'Tisza Party', leader: 'Péter Magyar', ideology: 'Centrist', symbol: 'Building', color: '#3b82f6', baseSupport: 30 },
      { id: 'DK', name: 'Democratic Coalition', leader: 'Ferenc Gyurcsány', ideology: 'Social Democrat', symbol: 'Globe', color: '#3b82f6', baseSupport: 8 },
      { id: 'MHM', name: 'Our Homeland', leader: 'László Toroczkai', ideology: 'Nationalist', symbol: 'Flame', color: '#166534', baseSupport: 6 }
    ],
    regions: getHungaryRegions(),
    bills: createBills('HU'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },`;

code = code.replace("export const PLAYABLE_COUNTRIES: Country[] = [", "export const PLAYABLE_COUNTRIES: Country[] = [" + franceStr + romaniaStr + hungaryStr);
fs.writeFileSync('src/constants/countries.ts', code);
