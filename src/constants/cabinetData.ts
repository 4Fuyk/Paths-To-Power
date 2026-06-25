import { MinisterCandidate } from '../types';

export interface CabinetPosition {
  id: string; // e.g., "finance"
  name: string; // display name, e.g., "Minister of Treasury and Finance"
  description: string;
}

export const CABINET_POSITIONS_BY_COUNTRY: Record<string, CabinetPosition[]> = {
  TR: [
    { id: 'vice_president', name: 'Vice President', description: 'Assists the presidency and acts in place of the president.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Oversees international relations and diplomatic strategies.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Responsible for public security, policing, and local governance.' },
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
    { id: 'finance', name: 'Minister of Finance', description: 'Manages the federal budget and stability pact implementations.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Serves as commander-in-chief of the Bundeswehr during peacetime.' },
    { id: 'economic_affairs', name: 'Minister of Economic Affairs', description: 'Drives national industry, climate action, and regulatory standards.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees federal law reform and legislative compliance.' },
    { id: 'health', name: 'Minister of Health', description: 'Directs public health insurance, disease control, and medical networks.' },
    { id: 'education', name: 'Minister of Education and Research', description: 'Sponsors higher education, federal research initiatives, and tech hubs.' },
    { id: 'labour', name: 'Minister of Labour and Social Affairs', description: 'Regulates worker safety, unemployment insurance, and pensions.' }
  ],
  US: [
    { id: 'vice_president', name: 'Vice President', description: 'Serves as President of the Senate and principal advisor.' },
    { id: 'state', name: 'Secretary of State', description: 'Leads the State Department and coordinates global diplomacy.' },
    { id: 'treasury', name: 'Secretary of the Treasury', description: 'Manages government revenue, currency minting, and fiscal planning.' },
    { id: 'defense', name: 'Secretary of Defense', description: 'Exercises authority, control, and direction over the military branches.' },
    { id: 'justice', name: 'Attorney General', description: 'Leads the Department of Justice and acts as chief law enforcement officer.' },
    { id: 'interior', name: 'Secretary of the Interior', description: 'Preserves national parks, federal lands, and natural resources.' },
    { id: 'labor', name: 'Secretary of Labor', description: 'Sets wage guidelines, unions regulations, and collective bargaining rules.' },
    { id: 'hhs', name: 'Secretary of Health & Human Services', description: 'Directs Medicaid, Medicare, and FDA public safety guidelines.' },
    { id: 'education', name: 'Secretary of Education', description: 'Distributes federal school funds, student loan systems, and testing.' },
    { id: 'energy', name: 'Secretary of Energy', description: 'Administers domestic nuclear security, energy grids, and research.' }
  ],
  GB: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Deputises for the Prime Minister and directs Cabinet Office operations.' },
    { id: 'foreign_secretary', name: 'Foreign Secretary', description: 'Manages the Foreign, Commonwealth & Development Office.' },
    { id: 'home_secretary', name: 'Home Secretary', description: 'Directs MI5, national policing, immigration, and border force.' },
    { id: 'chancellor', name: 'Chancellor of the Exchequer', description: 'Prepares the Autumn Budget and manages HM Treasury.' },
    { id: 'defence_secretary', name: 'Defence Secretary', description: 'Oversees the British Armed Forces and procurement programs.' },
    { id: 'justice_secretary', name: 'Lord Chancellor & Justice Secretary', description: 'Manages Her Majesty\'s courts and prison services.' },
    { id: 'health_secretary', name: 'Health Secretary', description: 'Coordinates the National Health Service (NHS) and social care.' },
    { id: 'education_secretary', name: 'Education Secretary', description: 'Sets standards for schools, apprenticeships, and universities.' },
    { id: 'business_secretary', name: 'Business and Trade Secretary', description: 'Nurtures industrial strategy, export controls, and free trade deals.' }
  ],
  BR: [
    { id: 'vice_president', name: 'Vice President', description: 'Advises the Executive and assumes office during presidential absence.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs the Itamaraty and MERCOSUR economic negotiations.' },
    { id: 'justice', name: 'Minister of Justice & Public Security', description: 'Fights organized crime, drug trafficking, and coordinates Federal Police.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Formulates national tax guidelines and central banking policies.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Coordinates joint operations between Army, Navy, and Air Force.' },
    { id: 'health', name: 'Minister of Health', description: 'Oversees the Unified Health System (SUS) and vaccine distribution.' },
    { id: 'education', name: 'Minister of Education', description: 'Supervises federal universities, high schools, and funding.' },
    { id: 'mines_energy', name: 'Minister of Mines & Energy', description: 'Controls state energy operators, mining concessions, and oil drills.' }
  ],
  JP: [
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs', description: 'Guides international treaties, G7 conferences, and strategic alliances.' },
    { id: 'internal_affairs', name: 'Minister for Internal Affairs', description: 'Administers local tax collections, telecommunications, and post.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Formulates budgets, tariffs, and currency interventions with Bank of Japan.' },
    { id: 'defense', name: 'Minister of Defense', description: 'Manages the Japan Self-Defense Forces and bilateral security treaties.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees registrations, citizenship requests, and penal facilities.' },
    { id: 'health', name: 'Minister of Health, Labour & Welfare', description: 'Tackles aging demographics, social security, and labor norms.' },
    { id: 'education', name: 'Minister of Education & Technology', description: 'Drives scientific research, space programs, and school systems.' }
  ],
  EG: [
    { id: 'prime_minister', name: 'Prime Minister', description: 'Supervises government cabinet work and drafts national policy.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Handles Arab League relations, Nile treaties, and foreign aid.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Oversees internal security, homeland investigations, and police forces.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Drafts national budgets, customs tariffs, and tax compliance.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Serves as Commander of the Armed Forces and military factories.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Coordinates judicial councils, legislation drafts, and courthouse safety.' },
    { id: 'health', name: 'Minister of Health & Population', description: 'Maintains national health insurance and rural medical centers.' },
    { id: 'education', name: 'Minister of Education', description: 'Supervises the K-12 schooling system and curriculum modernization.' }
  ]
};

export const POLITICIAN_CANDIDATES_POOL: Record<string, MinisterCandidate[]> = {
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
    { name: 'Kamala Harris', party: 'Demokratik Uyanış', loyalty: 85, competence: 82, popularity: 80 },
    { name: 'JD Vance', party: 'Cumhuriyetçi Kanat', loyalty: 90, competence: 84, popularity: 78 },
    { name: 'Antony Blinken', party: 'Demokratik Uyanış', loyalty: 92, competence: 88, popularity: 72 },
    { name: 'Janet Yellen', party: 'Demokratik Uyanış', loyalty: 88, competence: 94, popularity: 75 },
    { name: 'Lloyd Austin', party: 'Demokratik Uyanış', loyalty: 94, competence: 90, popularity: 78 },
    { name: 'Merrick Garland', party: 'Demokratik Uyanış', loyalty: 85, competence: 80, popularity: 60 },
    { name: 'Pete Buttigieg', party: 'Demokratik Uyanış', loyalty: 80, competence: 86, popularity: 82 },
    { name: 'Bernie Sanders', party: 'Independent', loyalty: 45, competence: 90, popularity: 92 },
    { name: 'Elizabeth Warren', party: 'Demokratik Uyanış', loyalty: 65, competence: 91, popularity: 80 },
    { name: 'Ted Cruz', party: 'Cumhuriyetçi Kanat', loyalty: 55, competence: 82, popularity: 70 },
    { name: 'Marco Rubio', party: 'Cumhuriyetçi Kanat', loyalty: 65, competence: 84, popularity: 75 },
    { name: 'Mike Pompeo', party: 'Cumhuriyetçi Kanat', loyalty: 75, competence: 86, popularity: 72 }
  ],
  GB: [
    { name: 'Angela Rayner', party: 'Ulusal İşçi Cephesi', loyalty: 82, competence: 80, popularity: 85 },
    { name: 'David Lammy', party: 'Ulusal İşçi Cephesi', loyalty: 88, competence: 82, popularity: 70 },
    { name: 'Yvette Cooper', party: 'Ulusal İşçi Cephesi', loyalty: 90, competence: 85, popularity: 75 },
    { name: 'Rachel Reeves', party: 'Ulusal İşçi Cephesi', loyalty: 92, competence: 90, popularity: 78 },
    { name: 'John Healey', party: 'Ulusal İşçi Cephesi', loyalty: 89, competence: 81, popularity: 65 },
    { name: 'Rishi Sunak', party: 'Muhafazakar Düzen Partisi', loyalty: 40, competence: 88, popularity: 72 },
    { name: 'Boris Johnson', party: 'Muhafazakar Düzen Partisi', loyalty: 30, competence: 82, popularity: 88 },
    { name: 'Jeremy Hunt', party: 'Muhafazakar Düzen Partisi', loyalty: 65, competence: 86, popularity: 68 },
    { name: 'James Cleverly', party: 'Muhafazakar Düzen Partisi', loyalty: 75, competence: 80, popularity: 70 },
    { name: 'Ed Davey', party: 'Liberal Demokratlar', loyalty: 60, competence: 84, popularity: 74 }
  ],
  BR: [
    { name: 'Geraldo Alckmin', party: 'Merkez Kalkınma Partisi', loyalty: 80, competence: 88, popularity: 75 },
    { name: 'Fernando Haddad', party: 'Sosyal Özgürlük Birliği', loyalty: 92, competence: 85, popularity: 78 },
    { name: 'Mauro Vieira', party: 'Sosyal Özgürlük Birliği', loyalty: 90, competence: 90, popularity: 68 },
    { name: 'Flávio Dino', party: 'Sosyal Özgürlük Birliği', loyalty: 88, competence: 86, popularity: 72 },
    { name: 'José Múcio', party: 'Merkez Kalkınma Partisi', loyalty: 94, competence: 80, popularity: 60 },
    { name: 'Simone Tebet', party: 'Merkez Kalkınma Partisi', loyalty: 75, competence: 85, popularity: 80 },
    { name: 'Marina Silva', party: 'Green Party', loyalty: 70, competence: 88, popularity: 82 },
    { name: 'Arthur Lira', party: 'Centrão', loyalty: 30, competence: 84, popularity: 65 }
  ],
  JP: [
    { name: 'Yoshimasa Hayashi', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 92, competence: 89, popularity: 72 },
    { name: 'Takeshi Iwaya', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 88, competence: 84, popularity: 65 },
    { name: 'Ryosei Akazawa', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 85, competence: 80, popularity: 60 },
    { name: 'Katsunobu Kato', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 90, competence: 86, popularity: 68 },
    { name: 'Gen Nakatani', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 94, competence: 82, popularity: 62 },
    { name: 'Yoko Kamikawa', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 88, competence: 87, popularity: 70 },
    { name: 'Sanae Takaichi', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 60, competence: 85, popularity: 78 },
    { name: 'Taro Kono', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 70, competence: 90, popularity: 82 },
    { name: 'Shinjiro Koizumi', party: 'Ata Yurdu Liberal Demokratlar', loyalty: 65, competence: 75, popularity: 85 }
  ],
  EG: [
    { name: 'Mostafa Madbouly', party: 'Ulusal Vatan Hareketi', loyalty: 95, competence: 88, popularity: 74 },
    { name: 'Badr Abdelatty', party: 'Ulusal Vatan Hareketi', loyalty: 90, competence: 85, popularity: 68 },
    { name: 'Mahmoud Tawfik', party: 'Ulusal Vatan Hareketi', loyalty: 96, competence: 90, popularity: 72 },
    { name: 'Ahmed Kouchouk', party: 'Ulusal Vatan Hareketi', loyalty: 88, competence: 92, popularity: 65 },
    { name: 'Abdel Majeed Saqr', party: 'Ulusal Vatan Hareketi', loyalty: 95, competence: 84, popularity: 60 },
    { name: 'Khaled Abdel Ghaffar', party: 'Ulusal Vatan Hareketi', loyalty: 85, competence: 86, popularity: 70 },
    { name: 'Mohamed Abdel Latif', party: 'Ulusal Vatan Hareketi', loyalty: 82, competence: 80, popularity: 58 }
  ]
};
