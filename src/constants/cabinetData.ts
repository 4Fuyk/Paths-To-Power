import { MinisterCandidate, ScenarioYear } from '../types';

export interface CabinetPosition {
  id: string; // e.g., "finance"
  name: string; // display name, e.g., "Minister of Treasury and Finance"
  description: string;
}

export const DEFAULT_CABINET_POSITIONS: CabinetPosition[] = [
  { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Oversees foreign diplomacy, international treaties, and alliances.' },
  { id: 'interior', name: 'Minister of Internal Affairs', description: 'Controls domestic law enforcement, civil protection, and regional administration.' },
  { id: 'finance', name: 'Minister of Finance & Treasury', description: 'Manages national budgetary planning, taxation, and fiscal allocations.' },
  { id: 'defence', name: 'Minister of Defence', description: 'Directs national armed forces, border security, and military readiness.' },
  { id: 'justice', name: 'Minister of Justice', description: 'Administers the legal system, courts, and rule of law enforcement.' },
  { id: 'health', name: 'Minister of Health', description: 'Manages national hospitals, healthcare infrastructure, and epidemic response.' },
  { id: 'education', name: 'Minister of National Education', description: 'Directs public education curricula, universities, and scientific research.' },
  { id: 'economy', name: 'Minister of Economic Affairs', description: 'Supervises industrial output, domestic commerce, and trade policy.' }
];

export const CABINET_POSITIONS_BY_COUNTRY: Record<string, CabinetPosition[]> = {
  TR: [
    { id: 'vice_president', name: 'Vice President', description: 'Assists the presidency and coordinates national executive ministries.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Oversees international relations and diplomatic strategies.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Responsible for public security, policing, and internal administration.' },
    { id: 'finance', name: 'Minister of Treasury and Finance', description: 'Controls the national budget, fiscal policies, and tax rates.' },
    { id: 'defence', name: 'Minister of National Defence', description: 'Commands armed forces and coordinates defense infrastructure.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Handles the judicial system, law enforcement integrity, and prisons.' },
    { id: 'health', name: 'Minister of Health', description: 'Manages national healthcare quality, social services, and pandemic responses.' },
    { id: 'education', name: 'Minister of National Education', description: 'Determines the educational curriculum and academic development.' },
    { id: 'trade', name: 'Minister of Trade', description: 'Fosters domestic commerce and foreign trade tariffs.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Manages national natural resource reserves and power grids.' }
  ],
  DE: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs the Federal Foreign Office and global diplomatic missions.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Protects constitutional order, homeland security, and federal police.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages the federal budget and European fiscal stability.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Serves as commander-in-chief of the armed forces during peacetime.' },
    { id: 'economic_affairs', name: 'Minister of Economic Affairs', description: 'Drives national industry, climate action, and regulatory standards.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees federal law reform and legislative compliance.' },
    { id: 'health', name: 'Minister of Health', description: 'Directs public health insurance, disease control, and medical networks.' },
    { id: 'education', name: 'Minister of Education and Research', description: 'Sponsors higher education, federal research initiatives, and tech hubs.' },
    { id: 'labour', name: 'Minister of Labour and Social Affairs', description: 'Regulates worker safety, unemployment insurance, and pensions.' }
  ],
  US: [
    { id: 'vice_president', name: 'Vice President', description: 'Serves as President of the Senate and principal executive advisor.' },
    { id: 'state', name: 'Secretary of State', description: 'Leads the State Department and coordinates global diplomacy.' },
    { id: 'treasury', name: 'Secretary of the Treasury', description: 'Manages government revenue, currency minting, and fiscal planning.' },
    { id: 'defense', name: 'Secretary of Defense / War', description: 'Exercises authority, control, and direction over the military branches.' },
    { id: 'justice', name: 'Attorney General', description: 'Leads the Department of Justice and acts as chief law enforcement officer.' },
    { id: 'interior', name: 'Secretary of the Interior', description: 'Preserves national parks, federal lands, and natural resources.' },
    { id: 'labor', name: 'Secretary of Labor', description: 'Sets wage guidelines, union regulations, and collective bargaining rules.' },
    { id: 'hhs', name: 'Secretary of Health & Human Services', description: 'Directs Medicaid, Medicare, and FDA public safety guidelines.' },
    { id: 'education', name: 'Secretary of Education', description: 'Distributes federal school funds, student loan systems, and testing.' },
    { id: 'energy', name: 'Secretary of Energy', description: 'Administers domestic nuclear security, energy grids, and research.' }
  ],
  GB: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Deputises for the Prime Minister and directs Cabinet Office operations.' },
    { id: 'foreign_secretary', name: 'Foreign Secretary', description: 'Manages the Foreign, Commonwealth & Development Office.' },
    { id: 'home_secretary', name: 'Home Secretary', description: 'Directs MI5, national policing, immigration, and border security.' },
    { id: 'chancellor', name: 'Chancellor of the Exchequer', description: 'Prepares the Autumn Budget and manages HM Treasury.' },
    { id: 'defence_secretary', name: 'Defence Secretary / War Secretary', description: 'Oversees the British Armed Forces and procurement programs.' },
    { id: 'justice_secretary', name: 'Lord Chancellor & Justice Secretary', description: 'Manages His Majesty\'s courts and prison services.' },
    { id: 'health_secretary', name: 'Health Secretary', description: 'Coordinates the National Health Service (NHS) and social care.' },
    { id: 'education_secretary', name: 'Education Secretary', description: 'Sets standards for schools, apprenticeships, and universities.' },
    { id: 'business_secretary', name: 'Business and Trade Secretary', description: 'Nurtures industrial strategy, export controls, and free trade deals.' }
  ],
  RU: [
    { id: 'prime_minister', name: 'Prime Minister (Председатель Правительства)', description: 'Directs the federal ministries and leads executive policies.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs the MID, Eurasian integration, and global diplomacy.' },
    { id: 'defense', name: 'Minister of Defense', description: 'Commands the Russian Armed Forces and strategic deterrence.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Drafts federal state budget, sovereign wealth fund, and tax revenue.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MVD)', description: 'Controls federal police, public security, and domestic law.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees court administrations, registrations, and penal services.' },
    { id: 'economy', name: 'Minister of Economic Development', description: 'Directs domestic investments, trade flows, and industrial strategy.' },
    { id: 'health', name: 'Minister of Health', description: 'Coordinates federal healthcare systems, clinics, and medical reserves.' },
    { id: 'education', name: 'Minister of Science & Higher Education', description: 'Manages national academies, universities, and tech research.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Oversees oil pipelines, natural gas infrastructure, and nuclear power.' }
  ],
  FR: [
    { id: 'prime_minister', name: 'Prime Minister (Premier Ministre)', description: 'Directs government actions and ensures implementation of laws.' },
    { id: 'foreign_affairs', name: 'Minister for Europe & Foreign Affairs', description: 'Leads the Quai d\'Orsay, European diplomacy, and global affairs.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Responsible for national police, gendarmerie, and internal security.' },
    { id: 'finance', name: 'Minister of Economy & Finance (Bercy)', description: 'Controls state budget, taxation, and economic sovereignty.' },
    { id: 'defense', name: 'Minister of the Armed Forces', description: 'Directs the French military, nuclear deterrence, and defense industry.' },
    { id: 'justice', name: 'Minister of Justice (Garde des Sceaux)', description: 'Guarantees judicial independence and oversees court systems.' },
    { id: 'health', name: 'Minister of Health & Prevention', description: 'Supervises the national healthcare system and hospitals.' },
    { id: 'education', name: 'Minister of National Education', description: 'Coordinates public education, academies, and national curriculum.' }
  ],
  SU: [
    { id: 'foreign_affairs', name: 'Minister / Commissar of Foreign Affairs (MID/NKID)', description: 'Directs Soviet international policy, Warsaw Pact, and UN diplomacy.' },
    { id: 'defense', name: 'Minister / Commissar of Defense (Red Army)', description: 'Commands the Soviet Armed Forces, Strategic Rocket Forces, and Red Fleet.' },
    { id: 'finance', name: 'Minister / Commissar of Finance', description: 'Administers the state budget, Gosbank, and currency circulation.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MVD/NKVD)', description: 'Commands internal security troops, militsiya, and law enforcement.' },
    { id: 'security', name: 'Minister of State Security (MGB/KGB/Cheka)', description: 'Directs state intelligence, counter-espionage, and border guards.' },
    { id: 'planning', name: 'Chairman of Gosplan (State Planning)', description: 'Formulates Five-Year economic plans and state industrial quotas.' },
    { id: 'industry', name: 'Minister of Heavy Industry', description: 'Supervises metallurgical plants, tractor factories, and power grids.' }
  ],
  DDR: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs diplomatic relations with socialist bloc nations and treaties.' },
    { id: 'interior', name: 'Minister of the Interior (Volkspolizei)', description: 'Directs the People\'s Police (Volkspolizei) and domestic civil security.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget, economic accounting, and state enterprises.' },
    { id: 'stasi', name: 'Minister of State Security (Stasi)', description: 'Directs state security, border surveillance, and counter-intelligence.' },
    { id: 'planning', name: 'Chairman of the State Planning Commission', description: 'Directs the planned economy and socialist production targets.' },
    { id: 'education', name: 'Minister of National Education', description: 'Oversees polytechnic education, universities, and youth leagues.' }
  ]
};

// -------------------------------------------------------------
// ERA & COUNTRY SPECIFIC CANDIDATE POOLS
// -------------------------------------------------------------
export const POLITICIAN_CANDIDATES_BY_ERA: Record<ScenarioYear, Record<string, MinisterCandidate[]>> = {
  // ===========================================================
  // 1914: EVE OF WORLD WAR I
  // ===========================================================
  '1914': {
    TR: [
      { name: 'Talat Pasha', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 98, competence: 94, popularity: 88 },
      { name: 'Enver Pasha', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 95, competence: 90, popularity: 92 },
      { name: 'Cemal Pasha', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 92, competence: 88, popularity: 82 },
      { name: 'Said Halim Pasha', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 90, competence: 86, popularity: 76 },
      { name: 'Mehmet Cavit Bey', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 94, competence: 96, popularity: 78 },
      { name: 'Emanuel Karasu', party: 'İttihat ve Terakki Cemiyeti (CUP)', loyalty: 86, competence: 88, popularity: 65 },
      { name: 'Damad Ferid Pasha', party: 'Hürriyet ve İtilaf Fırkası (Liberal Entente)', loyalty: 40, competence: 75, popularity: 60 },
      { name: 'Rıza Tevfik', party: 'Hürriyet ve İtilaf Fırkası (Liberal Entente)', loyalty: 45, competence: 82, popularity: 70 },
      { name: 'Ahmet Rıza', party: 'Independent', loyalty: 60, competence: 89, popularity: 75 }
    ],
    DE: [
      { name: 'Theobald von Bethmann-Hollweg', party: 'Imperial Administration', loyalty: 96, competence: 90, popularity: 82 },
      { name: 'Gottlieb von Jagow', party: 'Imperial Administration', loyalty: 92, competence: 86, popularity: 70 },
      { name: 'Karl Helfferich', party: 'National Liberal Party', loyalty: 90, competence: 94, popularity: 78 },
      { name: 'Alfred von Tirpitz', party: 'Imperial Navy', loyalty: 95, competence: 92, popularity: 88 },
      { name: 'Erich von Falkenhayn', party: 'Prussian War Ministry', loyalty: 94, competence: 89, popularity: 76 },
      { name: 'Clemens von Delbrück', party: 'Centre Party (Zentrum)', loyalty: 88, competence: 87, popularity: 72 },
      { name: 'Friedrich Ebert', party: 'Social Democratic Party of Germany (SPD)', loyalty: 45, competence: 91, popularity: 86 },
      { name: 'Hugo Haase', party: 'Social Democratic Party of Germany (SPD)', loyalty: 40, competence: 84, popularity: 80 },
      { name: 'Peter Spahn', party: 'Centre Party (Zentrum)', loyalty: 70, competence: 85, popularity: 74 },
      { name: 'Ernst Bassermann', party: 'National Liberal Party', loyalty: 75, competence: 88, popularity: 76 }
    ],
    GB: [
      { name: 'H. H. Asquith', party: 'Liberal Party', loyalty: 96, competence: 92, popularity: 85 },
      { name: 'Sir Edward Grey', party: 'Liberal Party', loyalty: 94, competence: 95, popularity: 82 },
      { name: 'David Lloyd George', party: 'Liberal Party', loyalty: 90, competence: 96, popularity: 92 },
      { name: 'Winston Churchill', party: 'Liberal Party', loyalty: 88, competence: 93, popularity: 86 },
      { name: 'Lord Kitchener', party: 'War Office', loyalty: 98, competence: 94, popularity: 95 },
      { name: 'Reginald McKenna', party: 'Liberal Party', loyalty: 92, competence: 89, popularity: 72 },
      { name: 'Arthur Henderson', party: 'Labour Party', loyalty: 55, competence: 86, popularity: 80 },
      { name: 'Bonar Law', party: 'Conservative and Unionist Party', loyalty: 45, competence: 88, popularity: 78 },
      { name: 'John Redmond', party: 'Irish Parliamentary Party', loyalty: 50, competence: 84, popularity: 74 }
    ],
    SU: [
      { name: 'Ivan Goremykin', party: 'Union of the Russian People (Rightists)', loyalty: 95, competence: 80, popularity: 60 },
      { name: 'Sergey Sazonov', party: 'Union of October 17 (Octobrists)', loyalty: 94, competence: 92, popularity: 76 },
      { name: 'Peter Bark', party: 'Union of October 17 (Octobrists)', loyalty: 92, competence: 95, popularity: 70 },
      { name: 'Nikolai Sukhomlinov', party: 'War Ministry', loyalty: 88, competence: 76, popularity: 62 },
      { name: 'Alexander Krivoshein', party: 'Union of October 17 (Octobrists)', loyalty: 90, competence: 91, popularity: 78 },
      { name: 'Mikhail Rodzianko', party: 'Union of October 17 (Octobrists)', loyalty: 75, competence: 88, popularity: 82 },
      { name: 'Pavel Milyukov', party: 'Constitutional Democratic Party (Kadets)', loyalty: 40, competence: 93, popularity: 84 },
      { name: 'Alexander Kerensky', party: 'Trudoviks & Social Democrats', loyalty: 35, competence: 87, popularity: 86 }
    ],
    US: [
      { name: 'Woodrow Wilson', party: 'Democratic Party (New Freedom)', loyalty: 98, competence: 92, popularity: 88 },
      { name: 'William Jennings Bryan', party: 'Democratic Party (New Freedom)', loyalty: 88, competence: 89, popularity: 90 },
      { name: 'William Gibbs McAdoo', party: 'Democratic Party (New Freedom)', loyalty: 95, competence: 96, popularity: 80 },
      { name: 'Lindley M. Garrison', party: 'Democratic Party (New Freedom)', loyalty: 90, competence: 84, popularity: 70 },
      { name: 'Josephus Daniels', party: 'Democratic Party (New Freedom)', loyalty: 92, competence: 85, popularity: 74 },
      { name: 'Thomas Watt Gregory', party: 'Democratic Party (New Freedom)', loyalty: 91, competence: 88, popularity: 68 },
      { name: 'Theodore Roosevelt', party: 'Progressive Party (Bull Moose)', loyalty: 40, competence: 95, popularity: 94 },
      { name: 'William Howard Taft', party: 'Republican Party', loyalty: 45, competence: 90, popularity: 76 }
    ]
  },

  // ===========================================================
  // 1920: AFTERMATH OF WWI & LEAGUE OF NATIONS
  // ===========================================================
  '1920': {
    TR: [
      { name: 'Mustafa Kemal Atatürk', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 100, competence: 99, popularity: 98 },
      { name: 'İsmet İnönü', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 98, competence: 95, popularity: 90 },
      { name: 'Fevzi Çakmak', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 97, competence: 94, popularity: 92 },
      { name: 'Bekir Sami Kunduh', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 88, competence: 89, popularity: 75 },
      { name: 'Celâl Bayar', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 94, competence: 93, popularity: 82 },
      { name: 'Hakkı Behiç Bayiç', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 90, competence: 87, popularity: 70 },
      { name: 'Adnan Adıvar', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 92, competence: 91, popularity: 80 },
      { name: 'Yusuf Kemal Tengirşenk', party: 'Anadolu ve Rumeli Müdafaa-i Hukuk', loyalty: 93, competence: 90, popularity: 76 },
      { name: 'Damad Ferid Pasha', party: 'Hürriyet ve İtilaf (Istanbul Govt)', loyalty: 20, competence: 65, popularity: 30 }
    ],
    DE: [
      { name: 'Hermann Müller', party: 'SPD (Social Democratic)', loyalty: 92, competence: 89, popularity: 80 },
      { name: 'Joseph Wirth', party: 'Zentrum (Centre Party)', loyalty: 88, competence: 92, popularity: 78 },
      { name: 'Adolf Köster', party: 'SPD (Social Democratic)', loyalty: 90, competence: 85, popularity: 72 },
      { name: 'Otto Gessler', party: 'DDP (German Democratic)', loyalty: 89, competence: 88, popularity: 74 },
      { name: 'Carl Severing', party: 'SPD (Social Democratic)', loyalty: 91, competence: 87, popularity: 76 },
      { name: 'Gustav Stresemann', party: 'DVP (German People\'s Party)', loyalty: 75, competence: 97, popularity: 88 },
      { name: 'Matthias Erzberger', party: 'Zentrum (Centre Party)', loyalty: 80, competence: 91, popularity: 70 },
      { name: 'Walther Rathenau', party: 'DDP (German Democratic)', loyalty: 82, competence: 96, popularity: 84 }
    ],
    US: [
      { name: 'Bainbridge Colby', party: 'Democratic Party', loyalty: 92, competence: 88, popularity: 75 },
      { name: 'David F. Houston', party: 'Democratic Party', loyalty: 94, competence: 92, popularity: 72 },
      { name: 'Newton D. Baker', party: 'Democratic Party', loyalty: 90, competence: 89, popularity: 78 },
      { name: 'A. Mitchell Palmer', party: 'Democratic Party', loyalty: 85, competence: 80, popularity: 65 },
      { name: 'Warren G. Harding', party: 'Republican Party', loyalty: 40, competence: 82, popularity: 86 },
      { name: 'Calvin Coolidge', party: 'Republican Party', loyalty: 45, competence: 88, popularity: 84 },
      { name: 'James M. Cox', party: 'Democratic Party', loyalty: 90, competence: 86, popularity: 80 },
      { name: 'Franklin D. Roosevelt', party: 'Democratic Party', loyalty: 92, competence: 94, popularity: 89 }
    ],
    GB: [
      { name: 'David Lloyd George', party: 'Liberal Coalition', loyalty: 95, competence: 96, popularity: 88 },
      { name: 'Lord Curzon', party: 'Conservative Party', loyalty: 85, competence: 92, popularity: 76 },
      { name: 'Austen Chamberlain', party: 'Conservative Party', loyalty: 88, competence: 90, popularity: 78 },
      { name: 'Winston Churchill', party: 'Liberal Coalition', loyalty: 90, competence: 94, popularity: 85 },
      { name: 'Edward Shortt', party: 'Liberal Coalition', loyalty: 86, competence: 82, popularity: 68 },
      { name: 'Arthur Henderson', party: 'Labour Party', loyalty: 50, competence: 87, popularity: 82 },
      { name: 'Ramsay MacDonald', party: 'Labour Party', loyalty: 45, competence: 89, popularity: 80 }
    ],
    SU: [
      { name: 'Vladimir Lenin', party: 'Russian Communist Party (Bolsheviks)', loyalty: 100, competence: 99, popularity: 96 },
      { name: 'Leon Trotsky', party: 'Russian Communist Party (Bolsheviks)', loyalty: 95, competence: 98, popularity: 94 },
      { name: 'Georgy Chicherin', party: 'Russian Communist Party (Bolsheviks)', loyalty: 96, competence: 97, popularity: 84 },
      { name: 'Nikolay Krestinsky', party: 'Russian Communist Party (Bolsheviks)', loyalty: 90, competence: 91, popularity: 72 },
      { name: 'Felix Dzerzhinsky', party: 'Russian Communist Party (Bolsheviks)', loyalty: 98, competence: 95, popularity: 88 },
      { name: 'Lev Kamenev', party: 'Russian Communist Party (Bolsheviks)', loyalty: 88, competence: 89, popularity: 80 },
      { name: 'Joseph Stalin', party: 'Russian Communist Party (Bolsheviks)', loyalty: 92, competence: 94, popularity: 82 }
    ]
  },

  // ===========================================================
  // 1936: INTERWAR & POPULAR FRONTS
  // ===========================================================
  '1936': {
    TR: [
      { name: 'İsmet İnönü', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 98, competence: 96, popularity: 94 },
      { name: 'Tevfik Rüştü Aras', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 94, competence: 95, popularity: 84 },
      { name: 'Şükrü Saracoğlu', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 96, competence: 94, popularity: 86 },
      { name: 'Kazım Özalp', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 95, competence: 90, popularity: 82 },
      { name: 'Şükrü Kaya', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 92, competence: 89, popularity: 78 },
      { name: 'Celâl Bayar', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 93, competence: 96, popularity: 88 },
      { name: 'Fevzi Çakmak', party: 'Turkish Armed Forces', loyalty: 99, competence: 97, popularity: 95 },
      { name: 'Refik Saydam', party: 'Cumhuriyet Halk Fırkası (CHP)', loyalty: 95, competence: 93, popularity: 85 }
    ],
    DE: [
      { name: 'Hjalmar Schacht', party: 'Reich Economic Ministry', loyalty: 75, competence: 98, popularity: 85 },
      { name: 'Konstantin von Neurath', party: 'Foreign Office', loyalty: 80, competence: 91, popularity: 76 },
      { name: 'Lutz Graf Schwerin von Krosigk', party: 'Reich Ministry of Finance', loyalty: 85, competence: 94, popularity: 72 },
      { name: 'Werner von Blomberg', party: 'Armed Forces (Wehrmacht)', loyalty: 88, competence: 92, popularity: 80 },
      { name: 'Wilhelm Frick', party: 'National Socialist Party', loyalty: 95, competence: 84, popularity: 70 },
      { name: 'Franz von Papen', party: 'Centre Conservative', loyalty: 65, competence: 86, popularity: 65 },
      { name: 'Hermann Göring', party: 'Four-Year Plan Commission', loyalty: 96, competence: 88, popularity: 82 }
    ],
    US: [
      { name: 'Franklin D. Roosevelt', party: 'Democratic Party (New Deal)', loyalty: 100, competence: 98, popularity: 95 },
      { name: 'Cordell Hull', party: 'Democratic Party (New Deal)', loyalty: 94, competence: 95, popularity: 82 },
      { name: 'Henry Morgenthau Jr.', party: 'Democratic Party (New Deal)', loyalty: 96, competence: 94, popularity: 78 },
      { name: 'George Dern', party: 'Democratic Party (New Deal)', loyalty: 90, competence: 86, popularity: 70 },
      { name: 'Homer Cummings', party: 'Democratic Party (New Deal)', loyalty: 92, competence: 88, popularity: 72 },
      { name: 'Harold Ickes', party: 'Democratic Party (New Deal)', loyalty: 91, competence: 93, popularity: 80 },
      { name: 'Frances Perkins', party: 'Democratic Party (New Deal)', loyalty: 95, competence: 96, popularity: 85 },
      { name: 'Henry A. Wallace', party: 'Democratic Party (New Deal)', loyalty: 89, competence: 92, popularity: 84 },
      { name: 'Alf Landon', party: 'Republican Party', loyalty: 40, competence: 84, popularity: 74 },
      { name: 'Frank Knox', party: 'Republican Party', loyalty: 45, competence: 86, popularity: 72 }
    ],
    GB: [
      { name: 'Stanley Baldwin', party: 'National Government (Conservative)', loyalty: 96, competence: 90, popularity: 84 },
      { name: 'Anthony Eden', party: 'National Government (Conservative)', loyalty: 90, competence: 95, popularity: 88 },
      { name: 'Neville Chamberlain', party: 'National Government (Conservative)', loyalty: 94, competence: 93, popularity: 82 },
      { name: 'Sir John Simon', party: 'National Liberal Party', loyalty: 88, competence: 89, popularity: 74 },
      { name: 'Duff Cooper', party: 'National Government (Conservative)', loyalty: 86, competence: 88, popularity: 76 },
      { name: 'Winston Churchill', party: 'Conservative (Backbencher)', loyalty: 65, competence: 96, popularity: 85 },
      { name: 'Clement Attlee', party: 'Labour Party', loyalty: 45, competence: 91, popularity: 82 },
      { name: 'Arthur Greenwood', party: 'Labour Party', loyalty: 40, competence: 85, popularity: 75 }
    ],
    FR: [
      { name: 'Léon Blum', party: 'Section Française de l\'Internationale Ouvrière (SFIO)', loyalty: 98, competence: 93, popularity: 90 },
      { name: 'Yvon Delbos', party: 'Parti Radical-Socialiste', loyalty: 88, competence: 89, popularity: 76 },
      { name: 'Vincent Auriol', party: 'Section Française de l\'Internationale Ouvrière (SFIO)', loyalty: 94, competence: 92, popularity: 82 },
      { name: 'Édouard Daladier', party: 'Parti Radical-Socialiste', loyalty: 86, competence: 90, popularity: 84 },
      { name: 'Roger Salengro', party: 'Section Française de l\'Internationale Ouvrière (SFIO)', loyalty: 92, competence: 86, popularity: 78 },
      { name: 'Paul Reynaud', party: 'Alliance Démocratique', loyalty: 50, competence: 94, popularity: 80 },
      { name: 'Maurice Thorez', party: 'Parti Communiste Français (PCF)', loyalty: 45, competence: 87, popularity: 82 }
    ],
    SU: [
      { name: 'Maxim Litvinov', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 92, competence: 97, popularity: 85 },
      { name: 'Lazar Kaganovich', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 96, competence: 92, popularity: 76 },
      { name: 'Kliment Voroshilov', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 95, competence: 88, popularity: 84 },
      { name: 'Vyacheslav Molotov', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 98, competence: 94, popularity: 88 },
      { name: 'Grigory Ordzhonikidze', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 90, competence: 95, popularity: 86 },
      { name: 'Anastas Mikoyan', party: 'All-Union Communist Party (Bolsheviks)', loyalty: 94, competence: 93, popularity: 82 },
      { name: 'Genrikh Yagoda', party: 'NKVD', loyalty: 85, competence: 82, popularity: 55 }
    ]
  },

  // ===========================================================
  // 1950: POST-WAR COLD WAR ORDER
  // ===========================================================
  '1950': {
    TR: [
      { name: 'Adnan Menderes', party: 'Demokrat Parti (DP)', loyalty: 98, competence: 92, popularity: 95 },
      { name: 'Fuad Köprülü', party: 'Demokrat Parti (DP)', loyalty: 94, competence: 96, popularity: 88 },
      { name: 'Hasan Polatkan', party: 'Demokrat Parti (DP)', loyalty: 95, competence: 93, popularity: 82 },
      { name: 'Refik Şevket İnce', party: 'Demokrat Parti (DP)', loyalty: 91, competence: 87, popularity: 74 },
      { name: 'Halil Özyörük', party: 'Demokrat Parti (DP)', loyalty: 92, competence: 89, popularity: 76 },
      { name: 'Celâl Bayar', party: 'Demokrat Parti (DP)', loyalty: 99, competence: 94, popularity: 92 },
      { name: 'Samet Ağaoğlu', party: 'Demokrat Parti (DP)', loyalty: 90, competence: 91, popularity: 80 },
      { name: 'Fevzi Lütfi Karaosmanoğlu', party: 'Demokrat Parti (DP)', loyalty: 88, competence: 88, popularity: 78 },
      { name: 'İsmet İnönü', party: 'Cumhuriyet Halk Partisi (CHP)', loyalty: 40, competence: 97, popularity: 86 },
      { name: 'Osman Bölükbaşı', party: 'Millet Partisi (MP)', loyalty: 35, competence: 85, popularity: 78 }
    ],
    DE: [
      { name: 'Konrad Adenauer', party: 'CDU (Christian Democratic Union)', loyalty: 98, competence: 96, popularity: 92 },
      { name: 'Ludwig Erhard', party: 'CDU / Independent', loyalty: 94, competence: 98, popularity: 95 },
      { name: 'Fritz Schäffer', party: 'CSU (Christian Social Union)', loyalty: 92, competence: 93, popularity: 78 },
      { name: 'Gustav Heinemann', party: 'CDU (Christian Democratic Union)', loyalty: 86, competence: 90, popularity: 75 },
      { name: 'Theodor Blank', party: 'CDU (Christian Democratic Union)', loyalty: 93, competence: 89, popularity: 72 },
      { name: 'Walter Hallstein', party: 'CDU (Christian Democratic Union)', loyalty: 95, competence: 96, popularity: 80 },
      { name: 'Franz Josef Strauss', party: 'CSU (Christian Social Union)', loyalty: 88, competence: 92, popularity: 85 },
      { name: 'Kurt Schumacher', party: 'SPD (Social Democratic Party)', loyalty: 40, competence: 94, popularity: 88 },
      { name: 'Erich Ollenhauer', party: 'SPD (Social Democratic Party)', loyalty: 45, competence: 88, popularity: 80 },
      { name: 'Franz Blücher', party: 'FDP (Free Democratic Party)', loyalty: 70, competence: 87, popularity: 72 }
    ],
    DDR: [
      { name: 'Walter Ulbricht', party: 'SED (Socialist Unity Party)', loyalty: 99, competence: 93, popularity: 85 },
      { name: 'Otto Grotewohl', party: 'SED (Socialist Unity Party)', loyalty: 95, competence: 90, popularity: 84 },
      { name: 'Wilhelm Zaisser', party: 'SED (Minister for State Security)', loyalty: 94, competence: 88, popularity: 65 },
      { name: 'Georg Dertinger', party: 'CDU East (Christian Democratic)', loyalty: 70, competence: 86, popularity: 72 },
      { name: 'Hans Loch', party: 'LDPD (Liberal Democratic)', loyalty: 75, competence: 85, popularity: 70 },
      { name: 'Otto Nuschke', party: 'CDU East (Christian Democratic)', loyalty: 78, competence: 82, popularity: 68 },
      { name: 'Erich Mielke', party: 'SED (State Security / Stasi)', loyalty: 97, competence: 91, popularity: 60 },
      { name: 'Fred Oelssner', party: 'SED (Propaganda & Ideology)', loyalty: 92, competence: 87, popularity: 66 }
    ],
    US: [
      { name: 'Dean Acheson', party: 'Democratic Party (Fair Deal)', loyalty: 95, competence: 97, popularity: 80 },
      { name: 'John W. Snyder', party: 'Democratic Party (Fair Deal)', loyalty: 94, competence: 92, popularity: 74 },
      { name: 'George C. Marshall', party: 'Department of Defense', loyalty: 98, competence: 99, popularity: 96 },
      { name: 'J. Howard McGrath', party: 'Democratic Party (Fair Deal)', loyalty: 90, competence: 84, popularity: 68 },
      { name: 'Alben W. Barkley', party: 'Democratic Party (Fair Deal)', loyalty: 96, competence: 89, popularity: 86 },
      { name: 'Dwight D. Eisenhower', party: 'NATO / Military Command', loyalty: 80, competence: 98, popularity: 97 },
      { name: 'Robert A. Taft', party: 'Republican Party', loyalty: 40, competence: 92, popularity: 82 },
      { name: 'Thomas E. Dewey', party: 'Republican Party', loyalty: 45, competence: 90, popularity: 80 }
    ],
    GB: [
      { name: 'Clement Attlee', party: 'Labour Party (Welfare State)', loyalty: 98, competence: 94, popularity: 88 },
      { name: 'Ernest Bevin', party: 'Labour Party (Welfare State)', loyalty: 96, competence: 97, popularity: 90 },
      { name: 'Stafford Cripps', party: 'Labour Party (Welfare State)', loyalty: 94, competence: 95, popularity: 80 },
      { name: 'Hugh Gaitskell', party: 'Labour Party (Welfare State)', loyalty: 92, competence: 93, popularity: 78 },
      { name: 'Emanuel Shinwell', party: 'Labour Party (Welfare State)', loyalty: 90, competence: 86, popularity: 72 },
      { name: 'Aneurin Bevan', party: 'Labour Party (Left Wing / NHS)', loyalty: 85, competence: 96, popularity: 92 },
      { name: 'Winston Churchill', party: 'Conservative Party', loyalty: 40, competence: 96, popularity: 93 },
      { name: 'Anthony Eden', party: 'Conservative Party', loyalty: 45, competence: 94, popularity: 87 },
      { name: 'Harold Macmillan', party: 'Conservative Party', loyalty: 48, competence: 92, popularity: 82 }
    ],
    SU: [
      { name: 'Vyacheslav Molotov', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 98, competence: 95, popularity: 88 },
      { name: 'Lavrentiy Beria', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 90, competence: 93, popularity: 70 },
      { name: 'Nikolay Bulganin', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 92, competence: 87, popularity: 76 },
      { name: 'Georgy Malenkov', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 94, competence: 91, popularity: 80 },
      { name: 'Nikita Khrushchev', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 89, competence: 90, popularity: 85 },
      { name: 'Anastas Mikoyan', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 95, competence: 94, popularity: 82 },
      { name: 'Andrei Gromyko', party: 'Communist Party of the Soviet Union (CPSU)', loyalty: 97, competence: 97, popularity: 86 },
      { name: 'Georgy Zhukov', party: 'Marshal of the Soviet Union', loyalty: 86, competence: 99, popularity: 97 }
    ],
    FR: [
      { name: 'Robert Schuman', party: 'Mouvement Républicain Populaire (MRP)', loyalty: 96, competence: 97, popularity: 88 },
      { name: 'René Pleven', party: 'Union Démocratique et Socialiste (UDSR)', loyalty: 92, competence: 90, popularity: 80 },
      { name: 'Maurice Petsche', party: 'Centre National des Indépendants (CNIP)', loyalty: 90, competence: 92, popularity: 75 },
      { name: 'Henri Queuille', party: 'Parti Radical', loyalty: 93, competence: 88, popularity: 76 },
      { name: 'Jules Moch', party: 'Section Française de l\'Internationale Ouvrière (SFIO)', loyalty: 89, competence: 91, popularity: 78 },
      { name: 'Charles de Gaulle', party: 'Rassemblement du Peuple Français (RPF)', loyalty: 50, competence: 98, popularity: 94 },
      { name: 'Vincent Auriol', party: 'President of the Republic', loyalty: 95, competence: 91, popularity: 85 },
      { name: 'Maurice Thorez', party: 'Parti Communiste Français (PCF)', loyalty: 40, competence: 86, popularity: 80 }
    ],
    IT: [
      { name: 'Alcide De Gasperi', party: 'Democrazia Cristiana (DC)', loyalty: 98, competence: 96, popularity: 92 },
      { name: 'Carlo Sforza', party: 'Partito Repubblicano Italiano (PRI)', loyalty: 92, competence: 94, popularity: 82 },
      { name: 'Giuseppe Pella', party: 'Democrazia Cristiana (DC)', loyalty: 94, competence: 95, popularity: 78 },
      { name: 'Mario Scelba', party: 'Democrazia Cristiana (DC)', loyalty: 91, competence: 89, popularity: 72 },
      { name: 'Randolfo Pacciardi', party: 'Partito Repubblicano Italiano (PRI)', loyalty: 90, competence: 88, popularity: 75 },
      { name: 'Palmiro Togliatti', party: 'Partito Comunista Italiano (PCI)', loyalty: 40, competence: 92, popularity: 85 },
      { name: 'Pietro Nenni', party: 'Partito Socialista Italiano (PSI)', loyalty: 45, competence: 89, popularity: 80 },
      { name: 'Amintore Fanfani', party: 'Democrazia Cristiana (DC)', loyalty: 88, competence: 91, popularity: 84 }
    ],
    PL: [
      { name: 'Józef Cyrankiewicz', party: 'Polska Zjednoczona Partia Robotnicza (PZPR)', loyalty: 96, competence: 90, popularity: 82 },
      { name: 'Hilary Minc', party: 'Polska Zjednoczona Partia Robotnicza (PZPR)', loyalty: 94, competence: 94, popularity: 74 },
      { name: 'Stanisław Radkiewicz', party: 'Minister of Public Security (MBP)', loyalty: 92, competence: 86, popularity: 60 },
      { name: 'Konstanty Rokossowski', party: 'Marshal & Minister of National Defence', loyalty: 98, competence: 97, popularity: 85 },
      { name: 'Zygmunt Modzelewski', party: 'Polska Zjednoczona Partia Robotnicza (PZPR)', loyalty: 93, competence: 89, popularity: 70 },
      { name: 'Edward Ochab', party: 'Polska Zjednoczona Partia Robotnicza (PZPR)', loyalty: 91, competence: 87, popularity: 72 }
    ],
    CS: [
      { name: 'Viliam Široký', party: 'Komunistická Strana Československa (KSČ)', loyalty: 96, competence: 90, popularity: 80 },
      { name: 'Alexej Čepička', party: 'Komunistická Strana Československa (KSČ)', loyalty: 94, competence: 88, popularity: 72 },
      { name: 'Václav Nosek', party: 'Komunistická Strana Československa (KSČ)', loyalty: 92, competence: 86, popularity: 70 },
      { name: 'Jaroslav Kabeš', party: 'Komunistická Strana Československa (KSČ)', loyalty: 90, competence: 91, popularity: 68 },
      { name: 'Antonín Zápotocký', party: 'Prime Minister (KSČ)', loyalty: 97, competence: 92, popularity: 84 }
    ],
    YU: [
      { name: 'Josip Broz Tito', party: 'League of Communists of Yugoslavia (SKJ)', loyalty: 100, competence: 98, popularity: 98 },
      { name: 'Edvard Kardelj', party: 'League of Communists of Yugoslavia (SKJ)', loyalty: 97, competence: 96, popularity: 90 },
      { name: 'Aleksandar Ranković', party: 'State Security Administration (UDBA)', loyalty: 95, competence: 92, popularity: 82 },
      { name: 'Ivan Gošnjak', party: 'Yugoslav People\'s Army (JNA)', loyalty: 96, competence: 94, popularity: 85 },
      { name: 'Boris Kidrič', party: 'Economic Planning Commission', loyalty: 94, competence: 95, popularity: 84 },
      { name: 'Milovan Djilas', party: 'Agitation & Propaganda (Agitprop)', loyalty: 88, competence: 93, popularity: 86 }
    ],
    CN: [
      { name: 'Zhou Enlai', party: 'Communist Party of China (CPC)', loyalty: 98, competence: 99, popularity: 97 },
      { name: 'Chen Yun', party: 'Communist Party of China (CPC)', loyalty: 96, competence: 97, popularity: 88 },
      { name: 'Peng Dehuai', party: 'People\'s Liberation Army (PLA)', loyalty: 97, competence: 98, popularity: 94 },
      { name: 'Lin Biao', party: 'People\'s Liberation Army (PLA)', loyalty: 95, competence: 96, popularity: 90 },
      { name: 'Bo Yibo', party: 'Ministry of Finance', loyalty: 94, competence: 93, popularity: 82 },
      { name: 'Dong Biwu', party: 'Political & Legal Affairs', loyalty: 93, competence: 90, popularity: 80 }
    ],
    JP: [
      { name: 'Shigeru Yoshida', party: 'Liberal Party (Yoshida Doctrine)', loyalty: 98, competence: 96, popularity: 90 },
      { name: 'Hayato Ikeda', party: 'Liberal Party', loyalty: 95, competence: 98, popularity: 88 },
      { name: 'Takeo Ohashi', party: 'Liberal Party', loyalty: 91, competence: 88, popularity: 72 },
      { name: 'Katsuo Okazaki', party: 'Liberal Party', loyalty: 92, competence: 90, popularity: 75 },
      { name: 'Tetsu Katayama', party: 'Japan Socialist Party (JSP)', loyalty: 40, competence: 88, popularity: 80 },
      { name: 'Hitoshi Ashida', party: 'Democratic Party', loyalty: 50, competence: 89, popularity: 78 }
    ]
  },

  // ===========================================================
  // 2026: CONTEMPORARY ERA
  // ===========================================================
  '2026': {
    TR: [
      { name: 'Mehmet Şimşek', party: 'AKP', loyalty: 90, competence: 95, popularity: 75 },
      { name: 'Hakan Fidan', party: 'AKP', loyalty: 95, competence: 92, popularity: 85 },
      { name: 'Ali Yerlikaya', party: 'AKP', loyalty: 88, competence: 89, popularity: 82 },
      { name: 'Cevdet Yılmaz', party: 'AKP', loyalty: 92, competence: 85, popularity: 70 },
      { name: 'Yaşar Güler', party: 'AKP', loyalty: 96, competence: 87, popularity: 68 },
      { name: 'Ekrem İmamoğlu', party: 'CHP', loyalty: 40, competence: 90, popularity: 95 },
      { name: 'Mansur Yavaş', party: 'CHP', loyalty: 50, competence: 92, popularity: 94 },
      { name: 'Yılmaz Tunç', party: 'AKP', loyalty: 85, competence: 75, popularity: 60 },
      { name: 'Kemal Memişoğlu', party: 'AKP', loyalty: 80, competence: 78, popularity: 58 },
      { name: 'Yusuf Tekin', party: 'AKP', loyalty: 82, competence: 65, popularity: 45 },
      { name: 'Ömer Bolat', party: 'AKP', loyalty: 88, competence: 82, popularity: 65 },
      { name: 'Alparslan Bayraktar', party: 'AKP', loyalty: 90, competence: 88, popularity: 60 },
      { name: 'Özgür Özel', party: 'CHP', loyalty: 45, competence: 80, popularity: 85 },
      { name: 'Kemal Kılıçdaroğlu', party: 'CHP', loyalty: 65, competence: 75, popularity: 65 },
      { name: 'Devlet Bahçeli', party: 'MHP', loyalty: 70, competence: 70, popularity: 70 },
      { name: 'Ali Babacan', party: 'DEVA', loyalty: 65, competence: 94, popularity: 60 },
      { name: 'Ahmet Davutoğlu', party: 'GELECEK', loyalty: 55, competence: 85, popularity: 50 },
      { name: 'Erkan Baş', party: 'TIP', loyalty: 30, competence: 78, popularity: 65 },
      { name: 'Ümit Özdağ', party: 'ZAFER', loyalty: 50, competence: 80, popularity: 78 },
      { name: 'Fatih Erbakan', party: 'YRP', loyalty: 60, competence: 75, popularity: 72 }
    ],
    DE: [
      { name: 'Robert Habeck', party: 'GRÜNE', loyalty: 70, competence: 85, popularity: 78 },
      { name: 'Annalena Baerbock', party: 'GRÜNE', loyalty: 75, competence: 80, popularity: 75 },
      { name: 'Christian Lindner', party: 'FDP', loyalty: 55, competence: 88, popularity: 70 },
      { name: 'Nancy Faeser', party: 'SPD', loyalty: 85, competence: 75, popularity: 62 },
      { name: 'Boris Pistorius', party: 'SPD', loyalty: 90, competence: 94, popularity: 88 },
      { name: 'Friedrich Merz', party: 'CDU', loyalty: 50, competence: 89, popularity: 80 },
      { name: 'Alice Weidel', party: 'AfD', loyalty: 40, competence: 82, popularity: 65 },
      { name: 'Sahra Wagenknecht', party: 'BSW', loyalty: 35, competence: 90, popularity: 82 },
      { name: 'Karl Lauterbach', party: 'SPD', loyalty: 80, competence: 84, popularity: 68 },
      { name: 'Marco Buschmann', party: 'FDP', loyalty: 72, competence: 80, popularity: 58 },
      { name: 'Hubertus Heil', party: 'SPD', loyalty: 85, competence: 86, popularity: 74 },
      { name: 'Bettina Stark-Watzinger', party: 'FDP', loyalty: 75, competence: 72, popularity: 50 }
    ],
    US: [
      { name: 'Kamala Harris', party: 'Democratic Party', loyalty: 85, competence: 82, popularity: 80 },
      { name: 'JD Vance', party: 'Republican Party', loyalty: 90, competence: 84, popularity: 78 },
      { name: 'Antony Blinken', party: 'Democratic Party', loyalty: 92, competence: 88, popularity: 72 },
      { name: 'Janet Yellen', party: 'Democratic Party', loyalty: 88, competence: 94, popularity: 75 },
      { name: 'Lloyd Austin', party: 'Democratic Party', loyalty: 94, competence: 90, popularity: 78 },
      { name: 'Merrick Garland', party: 'Democratic Party', loyalty: 85, competence: 80, popularity: 60 },
      { name: 'Pete Buttigieg', party: 'Democratic Party', loyalty: 80, competence: 86, popularity: 82 },
      { name: 'Bernie Sanders', party: 'Independent', loyalty: 45, competence: 90, popularity: 92 },
      { name: 'Elizabeth Warren', party: 'Democratic Party', loyalty: 65, competence: 91, popularity: 80 },
      { name: 'Ted Cruz', party: 'Republican Party', loyalty: 55, competence: 82, popularity: 70 },
      { name: 'Marco Rubio', party: 'Republican Party', loyalty: 65, competence: 84, popularity: 75 },
      { name: 'Mike Pompeo', party: 'Republican Party', loyalty: 75, competence: 86, popularity: 72 }
    ],
    GB: [
      { name: 'Angela Rayner', party: 'Labour', loyalty: 82, competence: 80, popularity: 85 },
      { name: 'David Lammy', party: 'Labour', loyalty: 88, competence: 82, popularity: 70 },
      { name: 'Yvette Cooper', party: 'Labour', loyalty: 90, competence: 85, popularity: 75 },
      { name: 'Rachel Reeves', party: 'Labour', loyalty: 92, competence: 90, popularity: 78 },
      { name: 'John Healey', party: 'Labour', loyalty: 89, competence: 81, popularity: 65 },
      { name: 'Rishi Sunak', party: 'Conservative', loyalty: 40, competence: 88, popularity: 72 },
      { name: 'Kemi Badenoch', party: 'Conservative', loyalty: 50, competence: 85, popularity: 76 },
      { name: 'Nigel Farage', party: 'Reform UK', loyalty: 30, competence: 78, popularity: 82 },
      { name: 'Ed Davey', party: 'Liberal Democrats', loyalty: 60, competence: 84, popularity: 74 },
      { name: 'Carla Denyer', party: 'Green Party', loyalty: 55, competence: 80, popularity: 70 }
    ],
    RU: [
      { name: 'Mikhail Mishustin', party: 'UR', loyalty: 96, competence: 94, popularity: 88 },
      { name: 'Sergey Lavrov', party: 'UR', loyalty: 95, competence: 96, popularity: 90 },
      { name: 'Anton Siluanov', party: 'UR', loyalty: 92, competence: 93, popularity: 70 },
      { name: 'Andrey Belousov', party: 'UR', loyalty: 94, competence: 95, popularity: 82 },
      { name: 'Vladimir Kolokoltsev', party: 'UR', loyalty: 90, competence: 85, popularity: 68 },
      { name: 'Elvira Nabiullina', party: 'UR', loyalty: 88, competence: 98, popularity: 75 },
      { name: 'Konstantin Chuychenko', party: 'UR', loyalty: 90, competence: 84, popularity: 62 },
      { name: 'Aleksandr Novak', party: 'UR', loyalty: 93, competence: 91, popularity: 72 },
      { name: 'Denis Manturov', party: 'UR', loyalty: 91, competence: 89, popularity: 74 },
      { name: 'Gennady Zyuganov', party: 'CPRF', loyalty: 60, competence: 82, popularity: 78 },
      { name: 'Leonid Slutsky', party: 'LDPR', loyalty: 55, competence: 79, popularity: 72 },
      { name: 'Sergey Mironov', party: 'SRZP', loyalty: 65, competence: 80, popularity: 70 },
      { name: 'Alexey Nechayev', party: 'NL', loyalty: 60, competence: 86, popularity: 75 },
      { name: 'Nikolay Rybakov', party: 'YABLOKO', loyalty: 40, competence: 85, popularity: 68 },
      { name: 'Grigory Yavlinsky', party: 'YABLOKO', loyalty: 35, competence: 92, popularity: 72 },
      { name: 'Boris Vishnevsky', party: 'YABLOKO', loyalty: 38, competence: 87, popularity: 65 },
      { name: 'Boris Nadezhdin', party: 'Independent', loyalty: 30, competence: 84, popularity: 76 }
    ],
    FR: [
      { name: 'Michel Barnier', party: 'RE', loyalty: 88, competence: 90, popularity: 75 },
      { name: 'Gabriel Attal', party: 'RE', loyalty: 92, competence: 88, popularity: 82 },
      { name: 'Bruno Le Maire', party: 'RE', loyalty: 85, competence: 89, popularity: 70 },
      { name: 'Gérald Darmanin', party: 'RE', loyalty: 86, competence: 85, popularity: 68 },
      { name: 'Sébastien Lecornu', party: 'RE', loyalty: 93, competence: 88, popularity: 72 },
      { name: 'Jean-Noël Barrot', party: 'RE', loyalty: 90, competence: 86, popularity: 66 },
      { name: 'Jordan Bardella', party: 'RN', loyalty: 40, competence: 82, popularity: 89 },
      { name: 'Marine Le Pen', party: 'RN', loyalty: 35, competence: 84, popularity: 86 },
      { name: 'Jean-Luc Mélenchon', party: 'LFI', loyalty: 30, competence: 88, popularity: 80 },
      { name: 'Olivier Faure', party: 'PS', loyalty: 55, competence: 82, popularity: 74 },
      { name: 'Édouard Philippe', party: 'Horizons', loyalty: 60, competence: 91, popularity: 85 }
    ],
    BR: [
      { name: 'Geraldo Alckmin', party: 'PT', loyalty: 80, competence: 88, popularity: 75 },
      { name: 'Fernando Haddad', party: 'PT', loyalty: 92, competence: 85, popularity: 78 },
      { name: 'Mauro Vieira', party: 'PT', loyalty: 90, competence: 90, popularity: 68 },
      { name: 'Flávio Dino', party: 'PT', loyalty: 88, competence: 86, popularity: 72 },
      { name: 'José Múcio', party: 'PT', loyalty: 94, competence: 80, popularity: 60 },
      { name: 'Simone Tebet', party: 'MDB', loyalty: 75, competence: 85, popularity: 80 },
      { name: 'Marina Silva', party: 'PT', loyalty: 70, competence: 88, popularity: 82 },
      { name: 'Jair Bolsonaro', party: 'PL', loyalty: 30, competence: 75, popularity: 85 }
    ],
    JP: [
      { name: 'Yoshimasa Hayashi', party: 'LDP', loyalty: 92, competence: 89, popularity: 72 },
      { name: 'Takeshi Iwaya', party: 'LDP', loyalty: 88, competence: 84, popularity: 65 },
      { name: 'Ryosei Akazawa', party: 'LDP', loyalty: 85, competence: 80, popularity: 60 },
      { name: 'Katsunobu Kato', party: 'LDP', loyalty: 90, competence: 86, popularity: 68 },
      { name: 'Gen Nakatani', party: 'LDP', loyalty: 94, competence: 82, popularity: 62 },
      { name: 'Yoko Kamikawa', party: 'LDP', loyalty: 88, competence: 87, popularity: 70 },
      { name: 'Yoshihiko Noda', party: 'CDP', loyalty: 45, competence: 88, popularity: 78 },
      { name: 'Keiichi Ishii', party: 'KOMEITO', loyalty: 70, competence: 82, popularity: 65 },
      { name: 'Nobuyuki Baba', party: 'ISHIN', loyalty: 50, competence: 80, popularity: 70 }
    ],
    EG: [
      { name: 'Mostafa Madbouly', party: 'NFP', loyalty: 95, competence: 88, popularity: 74 },
      { name: 'Badr Abdelatty', party: 'NFP', loyalty: 90, competence: 85, popularity: 68 },
      { name: 'Mahmoud Tawfik', party: 'NFP', loyalty: 96, competence: 90, popularity: 72 },
      { name: 'Ahmed Kouchouk', party: 'NFP', loyalty: 88, competence: 92, popularity: 65 },
      { name: 'Abdel Majeed Saqr', party: 'NFP', loyalty: 95, competence: 84, popularity: 60 },
      { name: 'Hazem Omar', party: 'RPP', loyalty: 65, competence: 82, popularity: 68 },
      { name: 'Abdel Sanad Yamama', party: 'WAFD', loyalty: 55, competence: 80, popularity: 62 }
    ],
    IT: [
      { name: 'Giorgia Meloni', party: 'FDI', loyalty: 95, competence: 90, popularity: 88 },
      { name: 'Elly Schlein', party: 'PD', loyalty: 88, competence: 85, popularity: 82 },
      { name: 'Giuseppe Conte', party: 'M5S', loyalty: 70, competence: 86, popularity: 80 },
      { name: 'Matteo Salvini', party: 'LEGA', loyalty: 75, competence: 82, popularity: 76 },
      { name: 'Antonio Tajani', party: 'FDI', loyalty: 92, competence: 88, popularity: 78 },
      { name: 'Giancarlo Giorgetti', party: 'LEGA', loyalty: 80, competence: 93, popularity: 74 },
      { name: 'Guido Crosetto', party: 'FDI', loyalty: 94, competence: 91, popularity: 80 },
      { name: 'Matteo Piantedosi', party: 'FDI', loyalty: 89, competence: 85, popularity: 70 }
    ],
    ES: [
      { name: 'Alberto Núñez Feijóo', party: 'PP', loyalty: 95, competence: 90, popularity: 85 },
      { name: 'Pedro Sánchez', party: 'PSOE', loyalty: 92, competence: 91, popularity: 88 },
      { name: 'Santiago Abascal', party: 'VOX', loyalty: 80, competence: 82, popularity: 78 },
      { name: 'Yolanda Díaz', party: 'SUMAR', loyalty: 85, competence: 86, popularity: 80 },
      { name: 'María Jesús Montero', party: 'PSOE', loyalty: 94, competence: 92, popularity: 78 },
      { name: 'Fernando Grande-Marlaska', party: 'PSOE', loyalty: 90, competence: 85, popularity: 70 },
      { name: 'Margarita Robles', party: 'PSOE', loyalty: 93, competence: 89, popularity: 82 },
      { name: 'José Manuel Albares', party: 'PSOE', loyalty: 91, competence: 88, popularity: 72 }
    ],
    IN: [
      { name: 'Narendra Modi', party: 'BJP', loyalty: 98, competence: 92, popularity: 95 },
      { name: 'Rahul Gandhi', party: 'INC', loyalty: 85, competence: 80, popularity: 86 },
      { name: 'Amit Shah', party: 'BJP', loyalty: 97, competence: 90, popularity: 88 },
      { name: 'S. Jaishankar', party: 'BJP', loyalty: 95, competence: 96, popularity: 91 },
      { name: 'Nirmala Sitharaman', party: 'BJP', loyalty: 92, competence: 94, popularity: 78 },
      { name: 'Rajnath Singh', party: 'BJP', loyalty: 94, competence: 88, popularity: 84 },
      { name: 'Mallikarjun Kharge', party: 'INC', loyalty: 90, competence: 85, popularity: 76 },
      { name: 'Shashi Tharoor', party: 'INC', loyalty: 75, competence: 92, popularity: 83 }
    ],
    ID: [
      { name: 'Prabowo Subianto', party: 'GERINDRA', loyalty: 95, competence: 90, popularity: 92 },
      { name: 'Megawati Sukarnoputri', party: 'PDIP', loyalty: 90, competence: 82, popularity: 85 },
      { name: 'Airlangga Hartarto', party: 'GOLKAR', loyalty: 88, competence: 89, popularity: 78 },
      { name: 'Muhaimin Iskandar', party: 'PKB', loyalty: 80, competence: 84, popularity: 76 },
      { name: 'Sri Mulyani Indrawati', party: 'PDIP', loyalty: 92, competence: 98, popularity: 89 },
      { name: 'Retno Marsudi', party: 'PDIP', loyalty: 94, competence: 95, popularity: 86 }
    ],
    MX: [
      { name: 'Claudia Sheinbaum', party: 'MORENA', loyalty: 96, competence: 91, popularity: 90 },
      { name: 'Marko Cortés', party: 'PAN', loyalty: 85, competence: 80, popularity: 75 },
      { name: 'Alejandro Moreno', party: 'PRI', loyalty: 70, competence: 78, popularity: 72 },
      { name: 'Rogério Ramírez de la O', party: 'MORENA', loyalty: 92, competence: 95, popularity: 78 },
      { name: 'Marcelo Ebrard', party: 'MORENA', loyalty: 80, competence: 92, popularity: 85 },
      { name: 'Juan Ramón de la Fuente', party: 'MORENA', loyalty: 94, competence: 90, popularity: 76 }
    ],
    KR: [
      { name: 'Lee Jae-myung', party: 'DP', loyalty: 92, competence: 88, popularity: 90 },
      { name: 'Han Dong-hoon', party: 'PPP', loyalty: 94, competence: 89, popularity: 86 },
      { name: 'Choi Sang-mok', party: 'PPP', loyalty: 90, competence: 94, popularity: 72 },
      { name: 'Shin Won-sik', party: 'PPP', loyalty: 92, competence: 88, popularity: 70 },
      { name: 'Cho Tae-yul', party: 'PPP', loyalty: 91, competence: 90, popularity: 74 }
    ],
    AU: [
      { name: 'Anthony Albanese', party: 'ALP', loyalty: 95, competence: 88, popularity: 86 },
      { name: 'Peter Dutton', party: 'LNP', loyalty: 90, competence: 85, popularity: 82 },
      { name: 'Richard Marles', party: 'ALP', loyalty: 92, competence: 86, popularity: 74 },
      { name: 'Penny Wong', party: 'ALP', loyalty: 94, competence: 92, popularity: 88 },
      { name: 'Jim Chalmers', party: 'ALP', loyalty: 91, competence: 90, popularity: 80 },
      { name: 'Adam Bandt', party: 'GRN', loyalty: 75, competence: 84, popularity: 78 }
    ],
    CA: [
      { name: 'Justin Trudeau', party: 'LIB', loyalty: 95, competence: 88, popularity: 84 },
      { name: 'Chrystia Freeland', party: 'LIB', loyalty: 94, competence: 92, popularity: 82 },
      { name: 'Mélanie Joly', party: 'LIB', loyalty: 91, competence: 88, popularity: 78 },
      { name: 'Bill Blair', party: 'LIB', loyalty: 89, competence: 84, popularity: 70 },
      { name: 'Pierre Poilievre', party: 'CON', loyalty: 50, competence: 89, popularity: 86 },
      { name: 'Melissa Lantsman', party: 'CON', loyalty: 55, competence: 85, popularity: 76 },
      { name: 'Jagmeet Singh', party: 'NDP', loyalty: 60, competence: 83, popularity: 80 },
      { name: 'Yves-François Blanchet', party: 'BQ', loyalty: 40, competence: 86, popularity: 75 }
    ],
    PL: [
      { name: 'Donald Tusk', party: 'KO', loyalty: 96, competence: 92, popularity: 88 },
      { name: 'Radosław Sikorski', party: 'KO', loyalty: 93, competence: 95, popularity: 86 },
      { name: 'Andrzej Domański', party: 'KO', loyalty: 90, competence: 92, popularity: 75 },
      { name: 'Władysław Kosiniak-Kamysz', party: 'TD', loyalty: 88, competence: 89, popularity: 82 },
      { name: 'Szymon Hołownia', party: 'TD', loyalty: 85, competence: 87, popularity: 84 },
      { name: 'Tomasz Siemoniak', party: 'KO', loyalty: 92, competence: 86, popularity: 72 },
      { name: 'Adam Bodnar', party: 'KO', loyalty: 89, competence: 91, popularity: 76 },
      { name: 'Jarosław Kaczyński', party: 'PIS', loyalty: 35, competence: 88, popularity: 82 },
      { name: 'Mateusz Morawiecki', party: 'PIS', loyalty: 40, competence: 90, popularity: 78 },
      { name: 'Krzysztof Bosak', party: 'KON', loyalty: 30, competence: 82, popularity: 74 },
      { name: 'Włodzimierz Czarzasty', party: 'LEW', loyalty: 65, competence: 81, popularity: 70 }
    ],
    RO: [
      { name: 'Marcel Ciolacu', party: 'PSD', loyalty: 95, competence: 88, popularity: 84 },
      { name: 'Nicolae Ciucă', party: 'PNL', loyalty: 90, competence: 86, popularity: 78 },
      { name: 'Luminița Odobescu', party: 'PSD', loyalty: 92, competence: 93, popularity: 75 },
      { name: 'Marcel Boloș', party: 'PNL', loyalty: 88, competence: 89, popularity: 70 },
      { name: 'Angel Tîlvăr', party: 'PSD', loyalty: 91, competence: 85, popularity: 68 },
      { name: 'Cătălin Predoiu', party: 'PNL', loyalty: 90, competence: 88, popularity: 72 },
      { name: 'George Simion', party: 'AUR', loyalty: 30, competence: 78, popularity: 82 },
      { name: 'Elena Lasconi', party: 'USR', loyalty: 45, competence: 84, popularity: 80 }
    ],
    HU: [
      { name: 'Viktor Orbán', party: 'FIDESZ', loyalty: 98, competence: 90, popularity: 89 },
      { name: 'Péter Szijjártó', party: 'FIDESZ', loyalty: 96, competence: 92, popularity: 85 },
      { name: 'Mihály Varga', party: 'FIDESZ', loyalty: 94, competence: 93, popularity: 78 },
      { name: 'Kristóf Szalay-Bobrovniczky', party: 'FIDESZ', loyalty: 92, competence: 87, popularity: 72 },
      { name: 'Sándor Pintér', party: 'FIDESZ', loyalty: 95, competence: 91, popularity: 76 },
      { name: 'Péter Magyar', party: 'TISZA', loyalty: 30, competence: 89, popularity: 90 },
      { name: 'Ferenc Gyurcsány', party: 'DK', loyalty: 40, competence: 80, popularity: 65 },
      { name: 'László Toroczkai', party: 'MHM', loyalty: 35, competence: 78, popularity: 70 }
    ]
  }
};

// Fallback pool mapped to 2026
export const POLITICIAN_CANDIDATES_POOL = POLITICIAN_CANDIDATES_BY_ERA['2026'];

export const getCandidatesForEraAndCountry = (
  countryCode: string,
  scenario: ScenarioYear = '2026'
): MinisterCandidate[] => {
  const eraPool = POLITICIAN_CANDIDATES_BY_ERA[scenario];
  if (eraPool && eraPool[countryCode]) {
    return eraPool[countryCode];
  }
  // Try 2026 fallback
  if (POLITICIAN_CANDIDATES_BY_ERA['2026'][countryCode]) {
    return POLITICIAN_CANDIDATES_BY_ERA['2026'][countryCode];
  }
  // Generic historical politician candidates
  return [];
};
