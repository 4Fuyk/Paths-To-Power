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
    { id: 'health', name: 'Minister of Health & Prevention', description: 'Supervises the national healthcare system (Sécurité Sociale) and hospitals.' },
    { id: 'education', name: 'Minister of National Education', description: 'Coordinates public education, academies, and national curriculum.' }
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
  ],
  IT: [
    { id: 'vice_pm', name: 'Deputy Prime Minister', description: 'Assists the Prime Minister and manages public administration reforms.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Leads the Farnesina and handles European and Mediterranean diplomacy.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Responsible for public security, border control, and migration policies.' },
    { id: 'finance', name: 'Minister of Economy and Finance', description: 'Oversees the national budget, tax reforms, and Eurozone compliance.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Commands the Italian Armed Forces and NATO defense operations.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees judicial processes, prison security, and anti-corruption policies.' },
    { id: 'health', name: 'Minister of Health', description: 'Manages the National Health Service (SSN) and public health initiatives.' },
    { id: 'education', name: 'Minister of Education and Merit', description: 'Formulates school standards, curriculum, and academic development.' }
  ],
  ES: [
    { id: 'deputy_pm', name: 'First Deputy Prime Minister', description: 'Assists the Prime Minister and coordinates general government policy.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Leads international diplomacy, EU relations, and global cooperation.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Directs national security forces, policing, and civil protection.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Directs public treasury, budget policy, and public spending controls.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Directs defense policies and coordinates the Spanish Armed Forces.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees judicial administration, royal decrees, and court logistics.' },
    { id: 'health', name: 'Minister of Health', description: 'Coordinates with regional health systems and handles public safety.' },
    { id: 'education', name: 'Minister of Education', description: 'Sets educational guidelines and professional training development.' }
  ],
  IN: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Assists the Prime Minister and coordinates major national portfolios.' },
    { id: 'foreign_affairs', name: 'Minister of External Affairs', description: 'Leads the Ministry of External Affairs and handles international diplomacy.' },
    { id: 'interior', name: 'Minister of Home Affairs', description: 'Controls internal security, police forces, and border management.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Presents the Union Budget and governs corporate affairs.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Exercises administrative control over the Indian Armed Forces.' },
    { id: 'justice', name: 'Minister of Law and Justice', description: 'Oversees the national legal system and judicial policies.' },
    { id: 'health', name: 'Minister of Health & Family Welfare', description: 'Oversees national health policies, vaccination drives, and healthcare.' },
    { id: 'education', name: 'Minister of Education', description: 'Formulates educational development and research policies.' }
  ],
  ID: [
    { id: 'coordinating_minister', name: 'Coordinating Minister for Political Affairs', description: 'Coordinates ministries of defense, foreign affairs, and justice.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs international diplomacy, ASEAN affairs, and trade negotiations.' },
    { id: 'interior', name: 'Minister of Home Affairs', description: 'Manages regional development, local elections, and civil registries.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Coordinates state budget planning, taxation, and fiscal stability.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Directs military planning, procurement, and national defense forces.' }
  ],
  MX: [
    { id: 'interior', name: 'Secretary of the Interior (SEGOB)', description: 'Directs internal political affairs, public security, and civil protection.' },
    { id: 'foreign_affairs', name: 'Secretary of Foreign Affairs (SRE)', description: 'Manages foreign bilateral treaties, embassies, and regional diplomacy.' },
    { id: 'finance', name: 'Secretary of Finance & Public Credit (SHCP)', description: 'Directs national macroeconomic policies, federal taxes, and budgets.' },
    { id: 'defense', name: 'Secretary of National Defense (SEDENA)', description: 'Commands the Mexican Army and Air Force.' },
    { id: 'security', name: 'Secretary of Security & Citizen Protection', description: 'Directs the National Guard and federal anti-crime initiatives.' },
    { id: 'health', name: 'Secretary of Health', description: 'Manages IMSS-Bienestar, public clinics, and medical supplies.' },
    { id: 'education', name: 'Secretary of Public Education (SEP)', description: 'Directs federal public schools, teachers, and textbooks.' }
  ],
  KR: [
    { id: 'prime_minister', name: 'Prime Minister', description: 'Assists the President and oversees ministerial coordination.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Leads diplomacy, international alliances, and treaties.' },
    { id: 'unification', name: 'Minister of Unification', description: 'Supervises inter-Korean relations and peace initiatives.' },
    { id: 'finance', name: 'Minister of Economy and Finance', description: 'Oversees national budget, fiscal stimulus, and trade tariffs.' },
    { id: 'defense', name: 'Minister of National Defense', description: 'Directs the Republic of Korea Armed Forces and missile defense.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Supervises prosecution, legal administration, and immigration.' },
    { id: 'health', name: 'Minister of Health and Welfare', description: 'Directs national health insurance and welfare programs.' }
  ],
  AU: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Deputises for the Prime Minister and leads key government programs.' },
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs', description: 'Directs diplomatic engagement in the Indo-Pacific and global summits.' },
    { id: 'treasurer', name: 'Treasurer', description: 'Delivers the Federal Budget, tax laws, and economic strategy.' },
    { id: 'defense', name: 'Minister for Defence', description: 'Manages the Australian Defence Force and strategic alliances.' },
    { id: 'home_affairs', name: 'Minister for Home Affairs', description: 'Oversees border protection, federal police, and domestic security.' },
    { id: 'health', name: 'Minister for Health', description: 'Oversees Medicare, national hospital funding, and aged care.' },
    { id: 'education', name: 'Minister for Education', description: 'Sets funding standards for schools, universities, and research.' }
  ],
  CA: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister & Finance', description: 'Oversees federal budget planning, fiscal strategy, and interprovincial affairs.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Leads Global Affairs Canada and international diplomacy.' },
    { id: 'defence', name: 'Minister of National Defence', description: 'Commands Canadian Armed Forces and NORAD/NATO contributions.' },
    { id: 'public_safety', name: 'Minister of Public Safety', description: 'Directs RCMP, CSIS, and national border security.' },
    { id: 'justice', name: 'Minister of Justice & Attorney General', description: 'Oversees federal laws, courts, and human rights charters.' },
    { id: 'health', name: 'Minister of Health', description: 'Administers Canada Health Act and federal medical transfers.' },
    { id: 'industry', name: 'Minister of Innovation & Industry', description: 'Drives national tech hubs, clean energy, and industrial strategy.' }
  ],
  PL: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister (Wicepremier)', description: 'Coordinates government policy and ministerial portfolios.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MSZ)', description: 'Directs Polish diplomacy, EU policy, and Eastern European security.' },
    { id: 'defence', name: 'Minister of National Defence (MON)', description: 'Oversees the Polish Armed Forces and military modernization.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Drafts national budgets, tax policy, and EU funds allocation.' },
    { id: 'interior', name: 'Minister of Interior & Administration (MSWiA)', description: 'Controls national police, border guards, and emergency services.' },
    { id: 'justice', name: 'Minister of Justice (Prokurator Generalny)', description: 'Directs the judiciary reform, courts, and prosecution.' },
    { id: 'health', name: 'Minister of Health', description: 'Oversees the National Health Fund (NFZ) and hospitals.' },
    { id: 'education', name: 'Minister of National Education', description: 'Administers public schools and modern educational curricula.' }
  ],
  RO: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Assists the Prime Minister in coordinating governmental projects.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MAE)', description: 'Leads Romanian diplomacy, NATO partnerships, and Black Sea security.' },
    { id: 'finance', name: 'Minister of Public Finance', description: 'Manages national budget, tax policies, and PNRR investment funds.' },
    { id: 'defence', name: 'Minister of National Defence (MApN)', description: 'Commands the Romanian Armed Forces and allied deterrence.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MAI)', description: 'Directs Romanian Police, Gendarmerie, and emergency response.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Supervises the judicial system, anti-corruption, and courts.' },
    { id: 'health', name: 'Minister of Health', description: 'Administers the public healthcare network and hospital investments.' }
  ],
  HU: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Coordinates government strategy and cross-ministerial initiatives.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs & Trade', description: 'Directs diplomacy, foreign investment, and energy import pacts.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget, national tax incentives, and fiscal balance.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Commands the Hungarian Defence Forces and military modernization.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Directs police, border surveillance, and municipal governance.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees legislative drafts, court systems, and EU legal compliance.' },
    { id: 'economy', name: 'Minister of National Economy', description: 'Drives domestic industry, manufacturing investments, and trade.' }
  ],
  SU: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (НКИД/МИД)', description: 'Directs Soviet international policy, Warsaw Pact, and UN diplomacy.' },
    { id: 'defense', name: 'Minister of Armed Forces / Defense', description: 'Commands the Soviet Red Army, Strategic Rocket Forces, and Navy.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Administers the state budget, Gosbank, and currency circulation.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MVD)', description: 'Commands internal security troops, militsiya, and law enforcement.' },
    { id: 'security', name: 'Minister of State Security (MGB/KGB)', description: 'Directs state intelligence, counter-espionage, and border troops.' },
    { id: 'planning', name: 'Chairman of Gosplan', description: 'Formulates Five-Year economic plans and state industrial quotas.' },
    { id: 'industry', name: 'Minister of Heavy Industry', description: 'Supervises metallurgical plants, tractor factories, and power plants.' }
  ],
  DDR: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs diplomatic relations with socialist bloc nations and treaties.' },
    { id: 'interior', name: 'Minister of the Interior (Volkspolizei)', description: 'Directs the People\'s Police (Volkspolizei) and domestic civil security.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget, economic accounting, and state enterprises.' },
    { id: 'stasi', name: 'Minister of State Security (Stasi)', description: 'Directs state security, border surveillance, and intelligence.' },
    { id: 'planning', name: 'Chairman of the State Planning Commission', description: 'Directs the planned economy and socialist production targets.' },
    { id: 'education', name: 'Minister of National Education', description: 'Oversees polytechnic education, universities, and youth leagues.' }
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
    { name: 'Özgür Özel', party: 'YENI', loyalty: 45, competence: 80, popularity: 85 },
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
    { name: 'Kamala Harris', party: 'Demokrat Parti', loyalty: 85, competence: 82, popularity: 80 },
    { name: 'JD Vance', party: 'Cumhuriyetçi Parti', loyalty: 90, competence: 84, popularity: 78 },
    { name: 'Antony Blinken', party: 'Demokrat Parti', loyalty: 92, competence: 88, popularity: 72 },
    { name: 'Janet Yellen', party: 'Demokrat Parti', loyalty: 88, competence: 94, popularity: 75 },
    { name: 'Lloyd Austin', party: 'Demokrat Parti', loyalty: 94, competence: 90, popularity: 78 },
    { name: 'Merrick Garland', party: 'Demokrat Parti', loyalty: 85, competence: 80, popularity: 60 },
    { name: 'Pete Buttigieg', party: 'Demokrat Parti', loyalty: 80, competence: 86, popularity: 82 },
    { name: 'Bernie Sanders', party: 'Independent', loyalty: 45, competence: 90, popularity: 92 },
    { name: 'Elizabeth Warren', party: 'Demokrat Parti', loyalty: 65, competence: 91, popularity: 80 },
    { name: 'Ted Cruz', party: 'Cumhuriyetçi Parti', loyalty: 55, competence: 82, popularity: 70 },
    { name: 'Marco Rubio', party: 'Cumhuriyetçi Parti', loyalty: 65, competence: 84, popularity: 75 },
    { name: 'Mike Pompeo', party: 'Cumhuriyetçi Parti', loyalty: 75, competence: 86, popularity: 72 }
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
  ],
  SU: [
    { name: 'Vyacheslav Molotov', party: 'CPSU', loyalty: 98, competence: 94, popularity: 88 },
    { name: 'Lavrentiy Beria', party: 'CPSU', loyalty: 90, competence: 92, popularity: 70 },
    { name: 'Nikolay Bulganin', party: 'CPSU', loyalty: 92, competence: 86, popularity: 75 },
    { name: 'Nikita Khrushchev', party: 'CPSU', loyalty: 88, competence: 89, popularity: 84 },
    { name: 'Georgy Malenkov', party: 'CPSU', loyalty: 94, competence: 90, popularity: 80 },
    { name: 'Anastas Mikoyan', party: 'CPSU', loyalty: 95, competence: 93, popularity: 82 },
    { name: 'Andrei Gromyko', party: 'CPSU', loyalty: 96, competence: 96, popularity: 85 },
    { name: 'Georgy Zhukov', party: 'CPSU', loyalty: 85, competence: 98, popularity: 96 }
  ],
  DDR: [
    { name: 'Walter Ulbricht', party: 'SED', loyalty: 98, competence: 92, popularity: 85 },
    { name: 'Otto Grotewohl', party: 'SED', loyalty: 95, competence: 89, popularity: 84 },
    { name: 'Georg Dertinger', party: 'CDU_EAST', loyalty: 70, competence: 86, popularity: 72 },
    { name: 'Wilhelm Zaisser', party: 'SED', loyalty: 92, competence: 88, popularity: 68 },
    { name: 'Hans Loch', party: 'LDPD', loyalty: 75, competence: 85, popularity: 70 },
    { name: 'Otto Nuschke', party: 'CDU_EAST', loyalty: 78, competence: 82, popularity: 68 },
    { name: 'Erich Mielke', party: 'SED', loyalty: 96, competence: 90, popularity: 60 }
  ]
};
