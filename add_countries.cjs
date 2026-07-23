const fs = require('fs');
let content = fs.readFileSync('src/constants/countries.ts', 'utf8');

const makeVoterGroup = (a, b, c, d, e, f) => ({
  'Working Class': a, 'Middle Class': b, 'Upper Class': c, 'Youth': d, 'Elderly': e, 'Rural': f
});

const generateRegions = (countryId, regionNames, supports, ownerPartyId) => {
  return regionNames.map(name => ({
    id: name,
    name,
    seats: 20, // default
    voterDistribution: makeVoterGroup(20,20,20,20,10,10),
    supports,
    infrastructure: 3,
    campaignLevel: 0,
    ownerPartyId,
    mayorName: '' // Will be generated dynamically at runtime if empty
  }));
};

const newCountries = `
  {
    id: 'CA',
    name: 'Canada',
    description: 'A vast, diverse nation with a strong federal system and distinct provincial identities.',
    flag: '🇨🇦',
    seats: 338,
    parliamentName: 'House of Commons',
    system: 'Federal Parliamentary Republic',
    population: '40 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'LIB', name: 'Liberal Party', leader: 'Justin Trudeau', ideology: 'Liberal', symbol: 'Compass', color: '#EF4444', baseSupport: 32 },
      { id: 'CON', name: 'Conservative', leader: 'Pierre Poilievre', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 38 },
      { id: 'NDP', name: 'New Democratic', leader: 'Jagmeet Singh', ideology: 'Social Democrat', symbol: 'Users', color: '#F97316', baseSupport: 18 },
      { id: 'BQ', name: 'Bloc Québécois', leader: 'Yves-François Blanchet', ideology: 'Nationalist', symbol: 'Landmark', color: '#38BDF8', baseSupport: 8 }
    ],
    regions: ${JSON.stringify(generateRegions('CA', ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'], {"LIB":35, "CON":35, "NDP":20, "BQ":10}, 'LIB'))},
    bills: createBills('CA'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'AR',
    name: 'Argentina',
    description: 'A passionate nation experiencing economic challenges and intense political shifts.',
    flag: '🇦🇷',
    seats: 257,
    parliamentName: 'Chamber of Deputies',
    system: 'Presidential System',
    population: '46 Million',
    primaryColor: '#3b82f6',
    rivals: [
      { id: 'LLA', name: 'La Libertad Avanza', leader: 'Javier Milei', ideology: 'Libertarian', symbol: 'Flame', color: '#8B5CF6', baseSupport: 30 },
      { id: 'UP', name: 'Unión por la Patria', leader: 'Sergio Massa', ideology: 'Social Democrat', symbol: 'Users', color: '#3B82F6', baseSupport: 36 },
      { id: 'JXC', name: 'Juntos por el Cambio', leader: 'Patricia Bullrich', ideology: 'Conservative', symbol: 'Building', color: '#FCD34D', baseSupport: 24 }
    ],
    regions: ${JSON.stringify(generateRegions('AR', ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes'], {"LLA":33, "UP":33, "JXC":34}, 'UP'))},
    bills: createBills('AR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'ZA',
    name: 'South Africa',
    description: 'A diverse "Rainbow Nation" navigating complex socioeconomic transformations.',
    flag: '🇿🇦',
    seats: 400,
    parliamentName: 'National Assembly',
    system: 'Parliamentary Republic',
    population: '60 Million',
    primaryColor: '#22c55e',
    rivals: [
      { id: 'ANC', name: 'African National Congress', leader: 'Cyril Ramaphosa', ideology: 'Social Democrat', symbol: 'Users', color: '#16A34A', baseSupport: 40 },
      { id: 'DA', name: 'Democratic Alliance', leader: 'John Steenhuisen', ideology: 'Liberal', symbol: 'Compass', color: '#2563EB', baseSupport: 21 },
      { id: 'EFF', name: 'Economic Freedom Fighters', leader: 'Julius Malema', ideology: 'Socialist', symbol: 'Flame', color: '#DC2626', baseSupport: 10 },
      { id: 'MK', name: 'uMkhonto we Sizwe', leader: 'Jacob Zuma', ideology: 'Nationalist', symbol: 'Shield', color: '#047857', baseSupport: 14 }
    ],
    regions: ${JSON.stringify(generateRegions('ZA', ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'], {"ANC":40, "DA":20, "EFF":10, "MK":15}, 'ANC'))},
    bills: createBills('ZA'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IN',
    name: 'India',
    description: 'The world\'s largest democracy, blending ancient traditions with rapid modernization.',
    flag: '🇮🇳',
    seats: 543,
    parliamentName: 'Lok Sabha',
    system: 'Parliamentary Republic',
    population: '1.4 Billion',
    primaryColor: '#f97316',
    rivals: [
      { id: 'BJP', name: 'Bharatiya Janata Party', leader: 'Narendra Modi', ideology: 'Conservative', symbol: 'Building', color: '#F97316', baseSupport: 40 },
      { id: 'INC', name: 'Indian National Congress', leader: 'Rahul Gandhi', ideology: 'Social Democrat', symbol: 'Users', color: '#14B8A6', baseSupport: 25 },
      { id: 'TMC', name: 'All India Trinamool Congress', leader: 'Mamata Banerjee', ideology: 'Liberal', symbol: 'Compass', color: '#22C55E', baseSupport: 5 }
    ],
    regions: ${JSON.stringify(generateRegions('IN', ['Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Rajasthan', 'Andhra Pradesh'], {"BJP":45, "INC":30, "TMC":10}, 'BJP'))},
    bills: createBills('IN'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'IT',
    name: 'Italy',
    description: 'A historic republic with a dynamic and often volatile multi-party political landscape.',
    flag: '🇮🇹',
    seats: 400,
    parliamentName: 'Chamber of Deputies',
    system: 'Parliamentary Republic',
    population: '59 Million',
    primaryColor: '#16a34a',
    rivals: [
      { id: 'FDI', name: 'Brothers of Italy', leader: 'Giorgia Meloni', ideology: 'Conservative', symbol: 'Shield', color: '#1D4ED8', baseSupport: 28 },
      { id: 'PD', name: 'Democratic Party', leader: 'Elly Schlein', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 20 },
      { id: 'M5S', name: 'Five Star Movement', leader: 'Giuseppe Conte', ideology: 'Populist', symbol: 'Flame', color: '#EAB308', baseSupport: 16 },
      { id: 'LEGA', name: 'Lega', leader: 'Matteo Salvini', ideology: 'Nationalist', symbol: 'Landmark', color: '#10B981', baseSupport: 9 }
    ],
    regions: ${JSON.stringify(generateRegions('IT', ['Lombardy', 'Lazio', 'Campania', 'Sicily', 'Veneto', 'Emilia-Romagna', 'Piedmont', 'Apulia', 'Tuscany', 'Calabria'], {"FDI":30, "PD":25, "M5S":15, "LEGA":10}, 'FDI'))},
    bills: createBills('IT'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'ID',
    name: 'Indonesia',
    description: 'An expansive archipelagic nation balancing diverse cultures with rapid growth.',
    flag: '🇮🇩',
    seats: 580,
    parliamentName: 'People\'s Representative Council',
    system: 'Presidential System',
    population: '275 Million',
    primaryColor: '#ef4444',
    rivals: [
      { id: 'PDIP', name: 'PDI-P', leader: 'Megawati Sukarnoputri', ideology: 'Nationalist', symbol: 'Landmark', color: '#DC2626', baseSupport: 17 },
      { id: 'GOLKAR', name: 'Golkar', leader: 'Airlangga Hartarto', ideology: 'Conservative', symbol: 'Building', color: '#FACC15', baseSupport: 15 },
      { id: 'GERINDRA', name: 'Gerindra', leader: 'Prabowo Subianto', ideology: 'Nationalist', symbol: 'Shield', color: '#991B1B', baseSupport: 13 },
      { id: 'PKB', name: 'PKB', leader: 'Muhaimin Iskandar', ideology: 'Islamic', symbol: 'Users', color: '#15803D', baseSupport: 10 }
    ],
    regions: ${JSON.stringify(generateRegions('ID', ['West Java', 'East Java', 'Central Java', 'North Sumatra', 'Banten', 'Jakarta', 'South Sulawesi', 'Lampung', 'South Sumatra', 'Riau'], {"PDIP":25, "GOLKAR":20, "GERINDRA":20, "PKB":15}, 'PDIP'))},
    bills: createBills('ID'),
    campaignTurns: 53,
    electionCycleYears: 5,
  },
  {
    id: 'MX',
    name: 'Mexico',
    description: 'A vibrant North American nation with deep historical roots and complex social dynamics.',
    flag: '🇲🇽',
    seats: 500,
    parliamentName: 'Chamber of Deputies',
    system: 'Presidential System',
    population: '128 Million',
    primaryColor: '#059669',
    rivals: [
      { id: 'MORENA', name: 'MORENA', leader: 'Claudia Sheinbaum', ideology: 'Social Democrat', symbol: 'Users', color: '#991B1B', baseSupport: 45 },
      { id: 'PAN', name: 'National Action Party', leader: 'Marko Cortés', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 18 },
      { id: 'PRI', name: 'Institutional Revolutionary', leader: 'Alejandro Moreno', ideology: 'Centrist', symbol: 'Compass', color: '#16A34A', baseSupport: 11 }
    ],
    regions: ${JSON.stringify(generateRegions('MX', ['México (State)', 'Ciudad de México', 'Veracruz', 'Jalisco', 'Puebla', 'Guanajuato', 'Chiapas', 'Nuevo León', 'Michoacán', 'Oaxaca'], {"MORENA":50, "PAN":25, "PRI":15}, 'MORENA'))},
    bills: createBills('MX'),
    campaignTurns: 53,
    electionCycleYears: 6,
  },
  {
    id: 'ES',
    name: 'Spain',
    description: 'A culturally diverse European nation managing strong regional identities and modern progress.',
    flag: '🇪🇸',
    seats: 350,
    parliamentName: 'Congress of Deputies',
    system: 'Parliamentary Monarchy',
    population: '48 Million',
    primaryColor: '#dc2626',
    rivals: [
      { id: 'PP', name: 'People\'s Party', leader: 'Alberto Núñez Feijóo', ideology: 'Conservative', symbol: 'Building', color: '#2563EB', baseSupport: 33 },
      { id: 'PSOE', name: 'PSOE', leader: 'Pedro Sánchez', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 31 },
      { id: 'VOX', name: 'Vox', leader: 'Santiago Abascal', ideology: 'Nationalist', symbol: 'Shield', color: '#16A34A', baseSupport: 12 },
      { id: 'SUMAR', name: 'Sumar', leader: 'Yolanda Díaz', ideology: 'Socialist', symbol: 'Flame', color: '#D946EF', baseSupport: 12 }
    ],
    regions: ${JSON.stringify(generateRegions('ES', ['Andalusia', 'Catalonia', 'Madrid', 'Valencia', 'Galicia', 'Castile and León', 'Basque Country', 'Canary Islands', 'Castile-La Mancha', 'Murcia'], {"PP":35, "PSOE":35, "VOX":15, "SUMAR":10}, 'PP'))},
    bills: createBills('ES'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'KR',
    name: 'South Korea',
    description: 'A fast-paced, highly developed nation bridging deep traditions and technological dominance.',
    flag: '🇰🇷',
    seats: 300,
    parliamentName: 'National Assembly',
    system: 'Presidential System',
    population: '51 Million',
    primaryColor: '#2563eb',
    rivals: [
      { id: 'DP', name: 'Democratic Party', leader: 'Lee Jae-myung', ideology: 'Liberal', symbol: 'Compass', color: '#1D4ED8', baseSupport: 50 },
      { id: 'PPP', name: 'People Power Party', leader: 'Han Dong-hoon', ideology: 'Conservative', symbol: 'Building', color: '#EF4444', baseSupport: 35 }
    ],
    regions: ${JSON.stringify(generateRegions('KR', ['Seoul', 'Gyeonggi', 'Busan', 'Incheon', 'Daegu', 'Gyeongnam', 'Gyeongbuk', 'Chungnam', 'Jeonnam', 'Jeonbuk'], {"DP":55, "PPP":40}, 'DP'))},
    bills: createBills('KR'),
    campaignTurns: 53,
    electionCycleYears: 4,
  },
  {
    id: 'AU',
    name: 'Australia',
    description: 'A prosperous, resilient nation encompassing an entire continent.',
    flag: '🇦🇺',
    seats: 151,
    parliamentName: 'House of Representatives',
    system: 'Parliamentary Democracy',
    population: '26 Million',
    primaryColor: '#0369a1',
    rivals: [
      { id: 'ALP', name: 'Labor Party', leader: 'Anthony Albanese', ideology: 'Social Democrat', symbol: 'Users', color: '#DC2626', baseSupport: 32 },
      { id: 'LNP', name: 'Liberal/National', leader: 'Peter Dutton', ideology: 'Conservative', symbol: 'Building', color: '#1D4ED8', baseSupport: 35 },
      { id: 'GRN', name: 'The Greens', leader: 'Adam Bandt', ideology: 'Environmentalist', symbol: 'Flame', color: '#16A34A', baseSupport: 12 }
    ],
    regions: ${JSON.stringify(generateRegions('AU', ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'], {"ALP":40, "LNP":40, "GRN":10}, 'ALP'))},
    bills: createBills('AU'),
    campaignTurns: 53,
    electionCycleYears: 3,
  }
`;

const replacePattern = 'export const PLAYABLE_COUNTRIES: Country[] = [';
if (content.includes(replacePattern)) {
  content = content.replace(replacePattern, replacePattern + '\n' + newCountries + ',');
  // Formatting fix
  content = content.replace(/\\"/g, "'");
  fs.writeFileSync('src/constants/countries.ts', content, 'utf8');
  console.log('Success!');
} else {
  console.log('Pattern not found.');
}
