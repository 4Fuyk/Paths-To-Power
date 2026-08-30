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
    { id: 'energy', name: 'Minister of Energy and Natural Resources', description: 'Manages national natural resource reserves and power grids.' },
    { id: 'industry', name: 'Minister of Industry and Technology', description: 'Drives national technological sovereignty and manufacturing hubs.' },
    { id: 'transport', name: 'Minister of Transport and Infrastructure', description: 'Supervises highways, high-speed rail, ports, and aerospace.' },
    { id: 'agriculture', name: 'Minister of Agriculture and Forestry', description: 'Protects food security, agrarian subsidies, and water reserves.' },
    { id: 'labour', name: 'Minister of Labour and Social Security', description: 'Regulates minimum wage, union contracts, and employment.' },
    { id: 'environment', name: 'Minister of Environment, Urbanisation and Climate', description: 'Oversees urban transformation, environmental laws, and housing.' },
    { id: 'family', name: 'Minister of Family and Social Services', description: 'Distributes social welfare, supports low-income households.' },
    { id: 'culture_tourism', name: 'Minister of Culture and Tourism', description: 'Promotes heritage sites and international tourism revenue.' }
  ],
  US: [
    { id: 'vice_president', name: 'Vice President', description: 'Serves as President of the Senate and principal executive advisor.' },
    { id: 'state', name: 'Secretary of State', description: 'Leads the State Department and coordinates global diplomacy.' },
    { id: 'treasury', name: 'Secretary of the Treasury', description: 'Manages government revenue, currency minting, and fiscal planning.' },
    { id: 'defense', name: 'Secretary of Defense', description: 'Exercises authority, control, and direction over the military branches.' },
    { id: 'justice', name: 'Attorney General', description: 'Leads the Department of Justice and acts as chief law enforcement officer.' },
    { id: 'interior', name: 'Secretary of the Interior', description: 'Preserves national parks, federal lands, and natural resources.' },
    { id: 'agriculture', name: 'Secretary of Agriculture', description: 'Oversees farm subsidies, food stamps, and rural development.' },
    { id: 'commerce', name: 'Secretary of Commerce', description: 'Promotes job creation, economic growth, and trade enforcement.' },
    { id: 'labor', name: 'Secretary of Labor', description: 'Sets wage guidelines, union regulations, and collective bargaining rules.' },
    { id: 'hhs', name: 'Secretary of Health & Human Services', description: 'Directs Medicaid, Medicare, and FDA public safety guidelines.' },
    { id: 'hud', name: 'Secretary of Housing and Urban Development', description: 'Administers federal housing programs and urban infrastructure.' },
    { id: 'transportation', name: 'Secretary of Transportation', description: 'Maintains interstate highways, FAA aviation, and rail systems.' },
    { id: 'energy', name: 'Secretary of Energy', description: 'Administers domestic nuclear security, energy grids, and research.' },
    { id: 'education', name: 'Secretary of Education', description: 'Distributes federal school funds, student loan systems, and testing.' },
    { id: 'homeland_security', name: 'Secretary of Homeland Security', description: 'Coordinates border patrol, cybersecurity (CISA), and FEMA.' }
  ],
  DE: [
    { id: 'foreign_affairs', name: 'Federal Minister for Foreign Affairs (Auswärtiges Amt)', description: 'Directs the Federal Foreign Office and global diplomatic missions.' },
    { id: 'interior', name: 'Federal Minister of the Interior and Community (BMI)', description: 'Protects constitutional order, homeland security, and federal police.' },
    { id: 'finance', name: 'Federal Minister of Finance (BMF)', description: 'Manages the federal budget and European fiscal stability.' },
    { id: 'defence', name: 'Federal Minister of Defence (BMVg)', description: 'Serves as commander-in-chief of the armed forces during peacetime.' },
    { id: 'economic_affairs', name: 'Federal Minister for Economic Affairs and Climate Action (BMWK)', description: 'Drives national industry, green transition, and energy stability.' },
    { id: 'justice', name: 'Federal Minister of Justice (BMJ)', description: 'Oversees federal law reform and legislative compliance.' },
    { id: 'health', name: 'Federal Minister of Health (BMG)', description: 'Directs statutory health insurance, disease control, and hospital funding.' },
    { id: 'labour', name: 'Federal Minister of Labour and Social Affairs (BMAS)', description: 'Regulates worker safety, Bürgergeld unemployment, and pensions.' },
    { id: 'education', name: 'Federal Minister of Education and Research (BMBF)', description: 'Sponsors higher education, federal research initiatives, and tech hubs.' },
    { id: 'transport', name: 'Federal Minister for Digital and Transport (BMDV)', description: 'Maintains the Autobahn network, Deutsche Bahn, and 5G/fiber grids.' },
    { id: 'agriculture', name: 'Federal Minister of Food and Agriculture (BMEL)', description: 'Directs agrarian policy, consumer food standards, and forestry.' },
    { id: 'environment', name: 'Federal Minister for the Environment and Nature (BMUV)', description: 'Supervises ecological preservation, recycling, and nuclear safety.' },
    { id: 'family', name: 'Federal Minister for Family Affairs and Senior Citizens (BMFSFJ)', description: 'Administers childcare subsidies (Kindergeld) and youth rights.' },
    { id: 'housing', name: 'Federal Minister for Housing and Urban Development (BMWSB)', description: 'Accelerates social housing construction and tenant rights.' },
    { id: 'economic_cooperation', name: 'Federal Minister for Economic Cooperation (BMZ)', description: 'Oversees global development aid and humanitarian treaties.' },
    { id: 'chancellery', name: 'Head of the Federal Chancellery (Chef des Bundeskanzleramtes)', description: 'Coordinates inter-ministerial policy and cabinet agendas.' }
  ],
  GB: [
    { id: 'deputy_pm', name: 'Deputy Prime Minister', description: 'Deputises for the Prime Minister and directs Cabinet Office operations.' },
    { id: 'chancellor', name: 'Chancellor of the Exchequer', description: 'Prepares the Autumn Budget and manages HM Treasury.' },
    { id: 'foreign_secretary', name: 'Foreign Secretary', description: 'Manages the Foreign, Commonwealth & Development Office.' },
    { id: 'home_secretary', name: 'Home Secretary', description: 'Directs MI5, national policing, immigration, and border security.' },
    { id: 'defence_secretary', name: 'Defence Secretary', description: 'Oversees the British Armed Forces, Royal Navy, and procurement.' },
    { id: 'justice_secretary', name: 'Lord Chancellor & Justice Secretary', description: 'Manages His Majesty\'s courts and prison services.' },
    { id: 'health_secretary', name: 'Health and Social Care Secretary', description: 'Coordinates the National Health Service (NHS) and social care.' },
    { id: 'education_secretary', name: 'Education Secretary', description: 'Sets standards for schools, apprenticeships, and universities.' },
    { id: 'energy_secretary', name: 'Energy Security and Net Zero Secretary', description: 'Oversees nuclear power, renewable grids, and energy subsidies.' },
    { id: 'business_secretary', name: 'Business and Trade Secretary', description: 'Nurtures industrial strategy, export controls, and trade agreements.' },
    { id: 'work_pensions', name: 'Work and Pensions Secretary', description: 'Manages Universal Credit, state pensions, and jobcentres.' },
    { id: 'transport_secretary', name: 'Transport Secretary', description: 'Supervises Network Rail, HS2, airports, and road safety.' },
    { id: 'environment_secretary', name: 'Environment, Food and Rural Affairs Secretary (DEFRA)', description: 'Directs agricultural subsidies, flood defenses, and fisheries.' },
    { id: 'housing_secretary', name: 'Housing, Communities and Local Government Secretary', description: 'Oversees council funding, devolution, and housebuilding quotas.' },
    { id: 'science_tech_secretary', name: 'Science, Innovation and Technology Secretary', description: 'Drives national AI strategy, telecommunications, and UKRI research.' },
    { id: 'culture_secretary', name: 'Culture, Media and Sport Secretary', description: 'Regulates broadcasting, BBC charters, and creative industries.' },
    { id: 'northern_ireland', name: 'Northern Ireland Secretary', description: 'Maintains the Good Friday Agreement and devolved relations.' },
    { id: 'scotland_wales', name: 'Scottish & Welsh Affairs Secretary', description: 'Coordinates intergovernmental harmony across the Home Nations.' }
  ],
  PT: [
    { id: 'state_foreign_affairs', name: 'Minister of State and Foreign Affairs (Negócios Estrangeiros)', description: 'Directs diplomatic missions, Lusophone (CPLP) alliances, and EU representation.' },
    { id: 'state_finance', name: 'Minister of State and Finance (Finanças)', description: 'Controls the national budget, Portuguese sovereign debt, and tax collection.' },
    { id: 'presidency', name: 'Minister of the Presidency (Presidência)', description: 'Coordinates government strategy and inter-ministerial administrative reform.' },
    { id: 'internal_admin', name: 'Minister of Internal Administration (Administração Interna)', description: 'Controls the PSP police, GNR gendarmerie, and civil emergency protection.' },
    { id: 'defense', name: 'Minister of National Defence (Defesa Nacional)', description: 'Commands the Portuguese Armed Forces and NATO obligations.' },
    { id: 'justice', name: 'Minister of Justice (Justiça)', description: 'Oversees the judicial courts, judicial police (PJ), and prison system.' },
    { id: 'economy', name: 'Minister of Economy (Economia)', description: 'Drives domestic private enterprises, foreign direct investment, and trade.' },
    { id: 'territorial_cohesion', name: 'Minister of Territorial Cohesion (Coesão Territorial)', description: 'Distributes EU regional development funds to interior municipalities.' },
    { id: 'health', name: 'Minister of Health (Saúde)', description: 'Administers the National Health Service (Serviço Nacional de Saúde - SNS).' },
    { id: 'education_science', name: 'Minister of Education, Science and Innovation (Educação e Ciência)', description: 'Directs primary to secondary curricula, university research, and tech labs.' },
    { id: 'labour_social_security', name: 'Minister of Labour, Solidarity and Social Security (Trabalho e Segurança Social)', description: 'Supervises employment regulations, pensions, and social solidarity.' },
    { id: 'environment_energy', name: 'Minister of Environment and Energy (Ambiente e Energia)', description: 'Manages renewable hydro/solar energy, water grids, and climate goals.' },
    { id: 'infrastructure_housing', name: 'Minister of Infrastructure and Housing (Infraestruturas e Habitação)', description: 'Oversees Comboios de Portugal (CP), airports, and affordable housing.' },
    { id: 'agriculture_fisheries', name: 'Minister of Agriculture and Fisheries (Agricultura e Pescas)', description: 'Supports rural agriculture, wine exports, and Atlantic fishing fleets.' },
    { id: 'culture', name: 'Minister of Culture (Cultura)', description: 'Preserves historic monuments, theatre subsidies, and Portuguese cinema.' },
    { id: 'youth_sports', name: 'Minister of Youth and Sports (Juventude e Desporto)', description: 'Promotes national athletic training and youth entrepreneurship.' },
    { id: 'parliamentary_affairs', name: 'Minister for Parliamentary Affairs (Assuntos Parlamentares)', description: 'Manages legislative negotiations with the Assembleia da República.' }
  ],
  CL: [
    { id: 'interior_security', name: 'Minister of the Interior and Public Security (Interior y Seguridad Pública)', description: 'Leads internal governance, regional delegates, and Carabineros de Chile.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (Relaciones Exteriores - Cancillería)', description: 'Directs international diplomacy, Antarctic sovereignty, and Pacific trade.' },
    { id: 'defense', name: 'Minister of National Defense (Defensa Nacional)', description: 'Directs the Chilean Army, Navy, Air Force, and border sovereignty.' },
    { id: 'finance', name: 'Minister of Finance (Hacienda)', description: 'Manages fiscal policy, sovereign copper reserves, and macroeconomic stability.' },
    { id: 'segpres', name: 'Minister Secretary-General of the Presidency (SEGPRES)', description: 'Coordinates legislative initiatives between President and National Congress.' },
    { id: 'segebog', name: 'Minister Secretary-General of Government (SEGEGOB)', description: 'Acts as chief government spokesperson and coordinates communications.' },
    { id: 'economy', name: 'Minister of Economy, Development and Tourism (Economía)', description: 'Fosters SME business growth, aquaculture, and tourism development.' },
    { id: 'social_development', name: 'Minister of Social Development and Family (Desarrollo Social)', description: 'Oversees indigenous policy, poverty reduction, and social welfare programs.' },
    { id: 'education', name: 'Minister of Education (Educación)', description: 'Administers public school vouchers, gratuity in universities, and standards.' },
    { id: 'justice', name: 'Minister of Justice and Human Rights (Justicia y Derechos Humanos)', description: 'Supervises civil registries, Gendarmería prisons, and judicial reform.' },
    { id: 'labour', name: 'Minister of Labour and Social Provision (Trabajo y Previsión Social)', description: 'Regulates collective bargaining, minimum wage, and pension systems (AFP).' },
    { id: 'public_works', name: 'Minister of Public Works (Obras Públicas - MOP)', description: 'Builds highways, bridges, reservoirs, and public concessions.' },
    { id: 'health', name: 'Minister of Health (Salud - MINSAL)', description: 'Directs public healthcare (FONASA) and private insurance (ISAPRE) regulation.' },
    { id: 'mining', name: 'Minister of Mining (Minería)', description: 'Supervises national lithium strategy, state copper giant CODELCO, and ENAMI.' }
  ],
  IS: [
    { id: 'prime_minister', name: 'Prime Minister (Forsætisráðherra)', description: 'Heads the government and coordinates general state policy.' },
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs (Utanríkisráðherra)', description: 'Leads diplomatic relations, Nordic cooperation, NATO, and Arctic Council.' },
    { id: 'finance_economy', name: 'Minister of Finance and Economic Affairs (Fjármála- og efnahagsráðherra)', description: 'Manages state budget, national treasury, and macroeconomic stability.' },
    { id: 'justice', name: 'Minister of Justice (Dómsmálaráðherra)', description: 'Oversees police, courts, border control, and Coast Guard operations.' },
    { id: 'infrastructure', name: 'Minister of Infrastructure (Innviðaráðherra)', description: 'Directs transport infrastructure, airports, harbors, and municipal governance.' },
    { id: 'health', name: 'Minister of Health (Heilbrigðisráðherra)', description: 'Directs national hospitals, public healthcare, and medical services.' },
    { id: 'education_children', name: 'Minister of Education and Children (Mennta- og barnamálaráðherra)', description: 'Directs primary and secondary schooling and child protection services.' },
    { id: 'social_labour', name: 'Minister of Social Affairs and the Labour Market (Félags- og vinnumarkaðsráðherra)', description: 'Oversees labour rights, collective wage agreements, and social security.' },
    { id: 'food_agriculture_fisheries', name: 'Minister of Food, Agriculture and Fisheries (Matvælaráðherra)', description: 'Supervises Iceland\'s crucial fishing quota system and agricultural production.' },
    { id: 'environment_energy_climate', name: 'Minister of the Environment, Energy and Climate (Umhverfis-, orku- og loftslagsráðherra)', description: 'Oversees geothermal/hydro energy grids, conservation, and volcanic monitoring.' },
    { id: 'higher_ed_science', name: 'Minister of Higher Education, Science and Innovation (Háskóla-, iðnaðar- og nýsköpunarráðherra)', description: 'Drives universities, technology startups, and scientific research.' },
    { id: 'culture_business', name: 'Minister of Culture and Business Affairs (Menningar- og viðskiptaráðherra)', description: 'Promotes Icelandic arts, literature, tourism, and business commerce.' }
  ],
  SE: [
    { id: 'prime_ministers_office', name: 'Prime Minister\'s Office (Statsrådsberedningen)', description: 'Directs the work of the Government and coordinates ministerial initiatives.' },
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs (Utrikesdepartementet)', description: 'Manages foreign policy, NATO integration, and international development.' },
    { id: 'defence', name: 'Minister for Defence (Försvarsdepartementet)', description: 'Commands the Swedish Armed Forces, total defence, and conscription.' },
    { id: 'finance', name: 'Minister for Finance (Finansdepartementet)', description: 'Supervises fiscal budget, taxation, and financial market regulation.' },
    { id: 'justice', name: 'Minister for Justice (Justitiedepartementet)', description: 'Directs the police authority, courts, and counter-gang legislation.' },
    { id: 'health_social', name: 'Minister for Health and Social Affairs (Socialdepartementet)', description: 'Directs healthcare, eldercare, and the national social insurance system.' },
    { id: 'climate_enterprise', name: 'Minister for Climate and Enterprise (Klimat- och näringslivsdepartementet)', description: 'Leads green industrial transition, nuclear power, and business policy.' },
    { id: 'employment_integration', name: 'Minister for Employment and Integration (Arbetsmarknadsdepartementet)', description: 'Regulates labour market policy, integration, and unemployment funds.' },
    { id: 'education_research', name: 'Minister for Education and Research (Utbildningsdepartementet)', description: 'Sets standards for schools, free-school vouchers, and universities.' },
    { id: 'rural_infrastructure', name: 'Minister for Rural Affairs and Infrastructure (Landsbygds- och infrastrukturdepartementet)', description: 'Supervises railways, road networks, forestry, and agriculture.' },
    { id: 'culture', name: 'Minister for Culture (Kulturdepartementet)', description: 'Supports cultural heritage, public service media (SVT/SR), and sports.' },
    { id: 'civil_defence', name: 'Minister for Civil Defence (Ministern för civilt försvar)', description: 'Coordinates crisis preparedness, psychological defence, and critical supply lines.' }
  ],
  RU: [
    { id: 'prime_minister', name: 'Prime Minister (Председатель Правительства)', description: 'Directs the federal ministries and leads executive policies.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MID)', description: 'Directs Russian foreign diplomacy, BRICS, and multilateral treaties.' },
    { id: 'defense', name: 'Minister of Defense', description: 'Commands the Russian Armed Forces and strategic nuclear triad.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Drafts federal state budget, sovereign wealth fund (NWF), and tax policy.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MVD)', description: 'Controls federal police, internal security, and domestic law enforcement.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees court administration, civil registries, and correctional services.' },
    { id: 'economy', name: 'Minister of Economic Development', description: 'Directs domestic investments, trade flows, and import substitution.' },
    { id: 'industry_trade', name: 'Minister of Industry and Trade (Minpromtorg)', description: 'Supervises military-industrial complex, aviation, and manufacturing.' },
    { id: 'energy', name: 'Minister of Energy (Minenergo)', description: 'Oversees oil pipelines, natural gas grids, and power generation.' },
    { id: 'health', name: 'Minister of Health', description: 'Coordinates federal healthcare systems, clinics, and medical reserves.' },
    { id: 'science_higher_ed', name: 'Minister of Science and Higher Education', description: 'Manages national research institutes, universities, and tech hubs.' },
    { id: 'transport', name: 'Minister of Transport', description: 'Maintains Russian Railways (RZD), civil aviation, and maritime ports.' },
    { id: 'agriculture', name: 'Minister of Agriculture', description: 'Guarantees national grain self-sufficiency and agricultural exports.' },
    { id: 'digital_dev', name: 'Minister of Digital Development and Communications', description: 'Regulates telecommunications, government digital services, and IT.' },
    { id: 'natural_resources', name: 'Minister of Natural Resources and Environment', description: 'Administers Siberian mineral reserves, forestry, and Arctic ecology.' },
    { id: 'emergency_situations', name: 'Minister of Emergency Situations (EMERCOM)', description: 'Directs civil defence, disaster relief, and rapid response units.' }
  ],
  FR: [
    { id: 'prime_minister', name: 'Prime Minister (Premier Ministre)', description: 'Directs government actions and ensures implementation of laws.' },
    { id: 'foreign_affairs', name: 'Minister for Europe and Foreign Affairs (Quai d\'Orsay)', description: 'Leads French diplomacy, European affairs, and international cooperation.' },
    { id: 'interior', name: 'Minister of the Interior and Overseas (Intérieur)', description: 'Commands the National Police, Gendarmerie, and prefectures.' },
    { id: 'finance_economy', name: 'Minister of the Economy, Finance and Sovereignty (Bercy)', description: 'Controls state budget, taxation, and re-industrialisation policy.' },
    { id: 'armed_forces', name: 'Minister of the Armed Forces (Armées)', description: 'Directs the French military, nuclear deterrence force, and defence procurement.' },
    { id: 'justice', name: 'Keeper of the Seals, Minister of Justice (Garde des Sceaux)', description: 'Guarantees judicial independence and oversees court systems.' },
    { id: 'national_education', name: 'Minister of National Education and Youth (Éducation nationale)', description: 'Coordinates public education curriculum, teachers, and secularism (laïcité).' },
    { id: 'higher_education', name: 'Minister of Higher Education and Research', description: 'Administers public universities, Grandes Écoles, and CNRS research.' },
    { id: 'health', name: 'Minister of Labour, Health and Solidarities (Santé)', description: 'Supervises the national healthcare system, hospitals, and Sécurité Sociale.' },
    { id: 'ecological_transition', name: 'Minister for Ecological Transition and Territorial Cohesion', description: 'Directs decarbonisation, renewable energy, and territorial planning.' },
    { id: 'agriculture', name: 'Minister of Agriculture and Food Sovereignty', description: 'Defends French farming interests in the EU CAP and wine/food standards.' },
    { id: 'culture', name: 'Minister of Culture', description: 'Funds national museums, historic heritage, and cultural exceptionalism.' },
    { id: 'civil_service', name: 'Minister for Transformation and Public Service', description: 'Modernises state administration, civil servant wages, and digitalization.' },
    { id: 'sports', name: 'Minister of Sports and the Olympic/Paralympic Games', description: 'Supports national athletic federations and major sporting events.' }
  ],
  PL: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MSZ)', description: 'Directs Polish diplomacy, NATO eastern flank policy, and EU affairs.' },
    { id: 'interior_admin', name: 'Minister of the Interior and Administration (MSWiA)', description: 'Controls the Policja, Border Guard (Straż Graniczna), and emergency services.' },
    { id: 'national_defence', name: 'Minister of National Defence (MON)', description: 'Commands the Polish Armed Forces and massive military procurement programs.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget revenues, tax administration, and public debt limits.' },
    { id: 'justice', name: 'Minister of Justice & Prosecutor General (MS)', description: 'Oversees the judicial system, courts, and rule of law compliance.' },
    { id: 'state_assets', name: 'Minister of State Assets (MAP)', description: 'Supervises strategic state-owned corporations (Orlen, PGE, KGHM).' },
    { id: 'economic_dev', name: 'Minister of Economic Development and Technology', description: 'Fosters industrial innovation, SME support, and foreign trade expansion.' },
    { id: 'health', name: 'Minister of Health (MZ)', description: 'Administers the National Health Fund (NFZ) and hospital networks.' },
    { id: 'education', name: 'Minister of National Education (MEN)', description: 'Sets school curricula, teacher standards, and vocational training.' },
    { id: 'science_higher_ed', name: 'Minister of Science and Higher Education', description: 'Sponsors university research, academic autonomy, and Polish science.' },
    { id: 'climate_environment', name: 'Minister of Climate and Environment', description: 'Manages energy transition, nuclear plant development, and forests.' },
    { id: 'infrastructure', name: 'Minister of Infrastructure', description: 'Builds expressways, PKP railway modernisation, and the CPK mega-hub.' },
    { id: 'agriculture', name: 'Minister of Agriculture and Rural Development', description: 'Protects family farming, grain market stability, and rural subsidies.' },
    { id: 'family_labour', name: 'Minister of Family, Labour and Social Policy', description: 'Administers the 800+ family benefit, minimum wage, and pensions.' },
    { id: 'digitization', name: 'Minister of Digitization', description: 'Develops the mObywatel digital ID system and national cybersecurity.' }
  ],
  GR: [
    { id: 'national_economy_finance', name: 'Minister of National Economy and Finance', description: 'Coordinates fiscal surplus targets, tax evasion crackdowns, and investments.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Oversees Hellenic diplomacy, Aegean agreements, and bilateral treaties.' },
    { id: 'national_defence', name: 'Minister of National Defence', description: 'Commands the Hellenic Armed Forces, Mirage/Rafale jets, and naval frigates.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Manages local government municipalities, civil registries, and elections.' },
    { id: 'citizen_protection', name: 'Minister of Citizen Protection', description: 'Controls the Hellenic Police, border surveillance, and public safety.' },
    { id: 'infrastructure_transport', name: 'Minister of Infrastructure and Transport', description: 'Upgrades Greek motorways, railway safety systems, and metro networks.' },
    { id: 'environment_energy', name: 'Minister of Environment and Energy', description: 'Supervises renewable power, island electrical interconnections, and gas.' },
    { id: 'development', name: 'Minister of Development', description: 'Monitors market pricing, consumer protection, and private business investments.' },
    { id: 'labour_social_security', name: 'Minister of Labour and Social Security', description: 'Enforces labour law, pension payments, and employment initiatives.' },
    { id: 'health', name: 'Minister of Health', description: 'Directs the National Health System (ESY) and public hospitals.' },
    { id: 'education_religious_affairs', name: 'Minister of Education, Religious Affairs and Sports', description: 'Directs public schooling, non-state university reforms, and athletic hubs.' },
    { id: 'culture', name: 'Minister of Culture', description: 'Protects ancient classical monuments, museums, and archaeological treasures.' },
    { id: 'tourism', name: 'Minister of Tourism', description: 'Drives national tourism marketing and hotel infrastructure standards.' },
    { id: 'maritime_affairs', name: 'Minister of Maritime Affairs and Insular Policy', description: 'Supervises Greece\'s world-leading merchant shipping fleet and island ferries.' }
  ],
  ES: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs, European Union and Cooperation', description: 'Directs international diplomacy, Ibero-American ties, and EU policy.' },
    { id: 'presidency_justice', name: 'Minister of the Presidency, Justice and Parliamentary Relations', description: 'Coordinates government action, judicial reform, and parliamentary bills.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Commands the Spanish Armed Forces, NATO commitments, and military bases.' },
    { id: 'treasury', name: 'Minister of Finance and Civil Service (Hacienda)', description: 'Prepares the General State Budget and regional fiscal balancing.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Directs the National Police Corps, Guardia Civil, and road safety (DGT).' },
    { id: 'transport', name: 'Minister of Transport and Sustainable Mobility', description: 'Oversees the AVE high-speed train network, AENA airports, and ports.' },
    { id: 'education_sports', name: 'Minister of Education, Vocational Training and Sports', description: 'Determines national educational guidelines and vocational education.' },
    { id: 'industry_tourism', name: 'Minister of Industry and Tourism', description: 'Drives automotive manufacturing, semiconductor projects, and tourism.' },
    { id: 'agriculture_fisheries', name: 'Minister of Agriculture, Fisheries and Food', description: 'Defends agricultural exports, olive oil production, and fishing quotas.' },
    { id: 'territorial_policy', name: 'Minister of Territorial Policy and Democratic Memory', description: 'Handles relations with Autonomous Communities (Catalonia, Basque, etc.).' },
    { id: 'ecological_transition', name: 'Minister for the Ecological Transition and Demographic Challenge', description: 'Directs renewable solar/wind energy, water drought plans, and rural repopulation.' },
    { id: 'health', name: 'Minister of Health', description: 'Coordinates the Interterritorial Council of the National Health System.' },
    { id: 'social_rights', name: 'Minister of Social Rights, Consumer Affairs and Agenda 2030', description: 'Supervises dependency care, child welfare, and consumer protections.' },
    { id: 'science_innovation', name: 'Minister of Science, Innovation and Universities', description: 'Directs public research bodies (CSIC), grants, and universities.' },
    { id: 'inclusion_social_security', name: 'Minister of Inclusion, Social Security and Migration', description: 'Manages the pension reserve fund, Minimum Vital Income, and migration policy.' }
  ],
  IT: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs and International Cooperation (Farnesina)', description: 'Directs Italian foreign diplomacy, Mediterranean strategy, and global exports.' },
    { id: 'interior', name: 'Minister of the Interior (Viminale)', description: 'Controls the State Police, Carabinieri coordination, and public security.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Administers the court system, criminal procedure reform, and penitentiaries.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Directs the Italian Armed Forces, international missions, and defence industry.' },
    { id: 'economy_finance', name: 'Minister of Economy and Finance (MEF)', description: 'Manages public debt, state finances, tax collection, and PNRR funds.' },
    { id: 'enterprises_made_in_italy', name: 'Minister of Enterprises and Made in Italy (MIMIT)', description: 'Protects national industrial excellence, SME innovation, and space economy.' },
    { id: 'agriculture_food', name: 'Minister of Agriculture, Food Sovereignty and Forests (MASAF)', description: 'Champions Italian gastronomic products (DOP/IGP) and agrarian subsidies.' },
    { id: 'environment_energy', name: 'Minister of Environment and Energy Security (MASE)', description: 'Directs energy independence, renewable grids, and environmental protection.' },
    { id: 'infrastructure_transport', name: 'Minister of Infrastructure and Transport (MIT)', description: 'Manages motorways, Ferrovie dello Stato, ports, and major bridge projects.' },
    { id: 'labour_social_policies', name: 'Minister of Labour and Social Policies', description: 'Regulates employment contracts, social inclusion allowance, and safety at work.' },
    { id: 'education_merit', name: 'Minister of Education and Merit', description: 'Coordinates public schools, teacher qualification, and student achievement.' },
    { id: 'university_research', name: 'Minister of University and Research (MUR)', description: 'Sponsors state universities, academic research, and technological labs.' },
    { id: 'culture', name: 'Minister of Culture', description: 'Manages Italy\'s unparalleled UNESCO heritage sites, museums, and arts.' },
    { id: 'health', name: 'Minister of Health', description: 'Supervises the National Health Service (SSN) and pharmaceutical safety.' },
    { id: 'tourism', name: 'Minister of Tourism', description: 'Promotes Italy\'s global hospitality industry and tourism infrastructure.' }
  ],
  JP: [
    { id: 'chief_cabinet_secretary', name: 'Chief Cabinet Secretary (内閣官房長官)', description: 'Acts as chief government spokesperson and coordinates executive policy.' },
    { id: 'internal_affairs', name: 'Minister for Internal Affairs and Communications (総務大臣)', description: 'Oversees local government administration, telecommunications, and postal system.' },
    { id: 'justice', name: 'Minister of Justice (法務大臣)', description: 'Administers the judicial system, immigration services, and legal reforms.' },
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs (外務大臣)', description: 'Directs Japanese diplomacy, US-Japan security alliance, and Indo-Pacific treaties.' },
    { id: 'finance', name: 'Minister of Finance (財務大臣)', description: 'Manages the national budget, government bonds (JGBs), and tax policy.' },
    { id: 'education_science', name: 'Minister of Education, Culture, Sports, Science and Technology (文部科学大臣)', description: 'Supervises national school curriculum, universities, RIKEN, and sports.' },
    { id: 'health_labour', name: 'Minister of Health, Labour and Welfare (厚生労働大臣)', description: 'Directs national health insurance, eldercare pensions, and labour laws.' },
    { id: 'agriculture_fisheries', name: 'Minister of Agriculture, Forestry and Fisheries (農林水産大臣)', description: 'Protects food self-sufficiency, rice price stability, and fisheries.' },
    { id: 'economy_trade_industry', name: 'Minister of Economy, Trade and Industry (METI / 経済産業大臣)', description: 'Steers national industrial policy, semiconductor fabs, and energy security.' },
    { id: 'land_infrastructure', name: 'Minister of Land, Infrastructure, Transport and Tourism (国土交通大臣)', description: 'Oversees Shinkansen rail, road networks, coast guard, and tourism.' },
    { id: 'environment', name: 'Minister of the Environment (環境大臣)', description: 'Manages carbon neutrality goals, waste recycling, and nuclear regulation.' },
    { id: 'defense', name: 'Minister of Defense (防衛大臣)', description: 'Commands the Japan Self-Defense Forces (JSDF) and national deterrence.' },
    { id: 'digital_affairs', name: 'Minister for Digital Transformation (デジタル大臣)', description: 'Accelerates My Number card adoption and government cloud modernization.' },
    { id: 'economic_security', name: 'Minister for Economic Security (経済安全保障担当大臣)', description: 'Protects critical supply chains, advanced tech patents, and infrastructure.' }
  ],
  BR: [
    { id: 'casa_civil', name: 'Chief of Staff (Ministro-Chefe da Casa Civil)', description: 'Coordinates all executive ministries and presidential priority programs.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (Relações Exteriores - Itamaraty)', description: 'Directs Brazilian diplomacy, BRICS leadership, and Mercosur trade.' },
    { id: 'finance', name: 'Minister of Finance (Fazenda)', description: 'Manages fiscal framework, tax reform, and federal budget execution.' },
    { id: 'defense', name: 'Minister of Defense (Defesa)', description: 'Commands the Brazilian Army, Navy, and Air Force.' },
    { id: 'justice_public_security', name: 'Minister of Justice and Public Security (Justiça e Segurança Pública)', description: 'Directs the Federal Police, federal highway patrol, and public security.' },
    { id: 'planning_budget', name: 'Minister of Planning and Budget (Planejamento e Orçamento)', description: 'Formulates multi-year development plans and monitors spending efficiency.' },
    { id: 'mines_energy', name: 'Minister of Mines and Energy (Minas e Energia)', description: 'Supervises Petrobras oil exploration, hydroelectric dams, and mining.' },
    { id: 'health', name: 'Minister of Health (Saúde)', description: 'Administers the Unified Health System (SUS) and vaccination programs.' },
    { id: 'education', name: 'Minister of Education (Educação - MEC)', description: 'Coordinates federal universities (IFEs), basic education, and student aid.' },
    { id: 'environment_climate', name: 'Minister of Environment and Climate Change (Meio Ambiente)', description: 'Enforces Amazon rainforest protection, IBAMA policing, and climate goals.' },
    { id: 'agriculture_livestock', name: 'Minister of Agriculture and Livestock (Agricultura e Pecuária)', description: 'Champions Brazil\'s powerhouse agribusiness and global soy/beef exports.' },
    { id: 'social_development', name: 'Minister of Development, Family and Fight Against Hunger (MDS)', description: 'Administers the Bolsa Família cash transfer program and food security.' },
    { id: 'transport', name: 'Minister of Transport (Transportes)', description: 'Expands federal highway concessions, freight rail, and logistics corridors.' },
    { id: 'cities', name: 'Minister of Cities (Cidades)', description: 'Manages the Minha Casa Minha Vida housing program and basic sanitation.' },
    { id: 'labour_employment', name: 'Minister of Labour and Employment (Trabalho e Emprego)', description: 'Regulates employment formalization, minimum wage, and union standards.' },
    { id: 'science_tech', name: 'Minister of Science, Technology and Innovation (MCTI)', description: 'Drives national scientific research, space agency, and technological funding.' }
  ],
  AR: [
    { id: 'chief_cabinet', name: 'Cabinet Chief (Jefe de Gabinete de Ministros)', description: 'Coordinates executive ministries and represents government in Congress.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs, International Trade and Worship (Cancillería)', description: 'Directs international diplomacy, Western alignment, and export deregulation.' },
    { id: 'economy', name: 'Minister of Economy (Economía)', description: 'Executes zero-deficit fiscal policy, currency stabilization, and deregulation.' },
    { id: 'human_capital', name: 'Minister of Human Capital (Capital Humano)', description: 'Consolidates education, social development, labour, and family policies.' },
    { id: 'interior', name: 'Minister of the Interior (Interior)', description: 'Manages political relations with provincial governors and electoral processes.' },
    { id: 'justice', name: 'Minister of Justice (Justicia)', description: 'Leads judicial reforms, anti-corruption policies, and court appointments.' },
    { id: 'defense', name: 'Minister of Defense (Defensa)', description: 'Commands the Argentine Armed Forces and modernizes military equipment.' },
    { id: 'security', name: 'Minister of Security (Seguridad Nacional)', description: 'Directs federal security forces (PFA, Gendarmería, Prefectura) against crime.' },
    { id: 'health', name: 'Minister of Health (Salud)', description: 'Directs federal health guidelines, hospital oversight, and medical regulation.' }
  ],
  SU: [
    { id: 'foreign_affairs', name: 'Minister / Commissar of Foreign Affairs (MID/NKID)', description: 'Directs Soviet international policy, Warsaw Pact, and UN diplomacy.' },
    { id: 'defense', name: 'Minister / Commissar of Defense (Red Army)', description: 'Commands the Soviet Armed Forces, Strategic Rocket Forces, and Red Fleet.' },
    { id: 'finance', name: 'Minister / Commissar of Finance', description: 'Administers the state budget, Gosbank, and currency circulation.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MVD/NKVD)', description: 'Commands internal security troops, militsiya, and law enforcement.' },
    { id: 'security', name: 'Minister of State Security (MGB/KGB/Cheka)', description: 'Directs state intelligence, counter-espionage, and border guards.' },
    { id: 'planning', name: 'Chairman of Gosplan (State Planning)', description: 'Formulates Five-Year economic plans and state industrial quotas.' },
    { id: 'heavy_industry', name: 'Minister of Heavy Industry & Metallurgy', description: 'Supervises steel complexes, tractor factories, and power stations.' },
    { id: 'agriculture_procurement', name: 'Minister of Agriculture and Grain Procurement', description: 'Manages collective farms (Kolkhozy), state farms (Sovkhozy), and tractors.' },
    { id: 'foreign_trade', name: 'Minister of Foreign Trade', description: 'Executes state monopoly on all exports, oil sales, and machinery imports.' },
    { id: 'railways', name: 'Minister of Railways (MPS)', description: 'Controls the critical Soviet rail logistics network spanning eleven time zones.' }
  ],
  DDR: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs diplomatic relations with socialist bloc nations and treaties.' },
    { id: 'interior', name: 'Minister of the Interior (Volkspolizei)', description: 'Directs the People\'s Police (Volkspolizei) and domestic civil security.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget, economic accounting, and state enterprises (VEB).' },
    { id: 'stasi', name: 'Minister of State Security (Stasi / MfS)', description: 'Directs state surveillance, counter-intelligence, and border troops.' },
    { id: 'defense', name: 'Minister of National Defence (NVA)', description: 'Commands the National People\'s Army and Warsaw Pact integration.' },
    { id: 'planning', name: 'Chairman of the State Planning Commission (SPK)', description: 'Directs the planned economy and socialist production targets.' },
    { id: 'education', name: 'Minister of National Education (Volksbildung)', description: 'Oversees polytechnic education, universities, and youth leagues (FDJ).' },
    { id: 'heavy_industry', name: 'Minister of Heavy Industry and Machine Building', description: 'Supervises industrial conglomerates (Kombinate) and brown coal energy.' }
  ],
  YU: [
    { id: 'foreign_affairs', name: 'Federal Secretary of Foreign Affairs', description: 'Leads Non-Aligned Movement diplomacy and balanced international relations.' },
    { id: 'national_defence', name: 'Federal Secretary of National Defence', description: 'Commands the Yugoslav People\'s Army (JNA) and Territorial Defence.' },
    { id: 'internal_affairs', name: 'Federal Secretary of Internal Affairs', description: 'Directs federal public security, state security (UDBA), and policing.' },
    { id: 'finance', name: 'Federal Secretary of Finance', description: 'Administers federal budget allocations and socialist banking system.' },
    { id: 'social_planning', name: 'Director of the Federal Institute for Social Planning', description: 'Coordinates worker self-management economic guidelines across republics.' },
    { id: 'foreign_trade', name: 'Federal Secretary for Foreign Trade', description: 'Manages balanced trade with both Western and Eastern bloc nations.' },
    { id: 'judiciary', name: 'Federal Secretary of Judiciary and General Administration', description: 'Maintains federal constitutional law and inter-republic legal harmony.' },
    { id: 'industry_energy', name: 'Federal Secretary of Industry and Energy', description: 'Oversees federal energy grids, mining complexes, and heavy machinery.' }
  ],
  CS: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs Czechoslovak foreign policy within Comecon and Warsaw Pact.' },
    { id: 'national_defence', name: 'Minister of National Defence', description: 'Commands the Czechoslovak People\'s Army (ČSLA) and border guards.' },
    { id: 'interior', name: 'Minister of the Interior (StB)', description: 'Controls the National Security Corps (SNB) and State Security (StB).' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state budget and centrally planned enterprise revenues.' },
    { id: 'planning', name: 'Chairman of the State Planning Commission', description: 'Formulates five-year production quotas for Slovak and Czech industries.' },
    { id: 'heavy_industry', name: 'Minister of Heavy Industry and Metallurgy', description: 'Directs famed Škoda engineering plants, arms factories, and metallurgy.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Administers the legal system and socialist legality.' },
    { id: 'education', name: 'Minister of Education and Culture', description: 'Oversees public schooling, universities, and scientific institutions.' }
  ],
  UA: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MFA)', description: 'Leads Ukraine\'s wartime international diplomacy, EU/NATO ascension, and global weapons coalition.' },
    { id: 'defense', name: 'Minister of Defence (MOD)', description: 'Oversees the Armed Forces of Ukraine (AFU), logistics procurement, and drone systems.' },
    { id: 'interior', name: 'Minister of Internal Affairs (MIA)', description: 'Commands the National Police, National Guard, State Border Guard, and Emergency Services.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Coordinates macroeconomic stability, Western financial aid, and state budget.' },
    { id: 'strategic_industries', name: 'Minister for Strategic Industries', description: 'Drives domestic missile manufacturing, artillery ammo, and drone production lines.' },
    { id: 'digital_transformation', name: 'Minister of Digital Transformation', description: 'Manages the Diia e-governance app, Starlink grids, and Army of Drones initiative.' },
    { id: 'economy', name: 'Minister of Economy', description: 'Stimulates wartime economic resilience, SME grants, and Black Sea grain corridor.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees war crimes tribunals, asset confiscation, and judicial reforms.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Protects the electrical grid, nuclear power stations, and wartime power reserves.' },
    { id: 'infrastructure', name: 'Minister for Restoration and Infrastructure', description: 'Rebuilds damaged bridges, railways (Ukrzaliznytsia), and municipal utilities.' },
    { id: 'health', name: 'Minister of Health', description: 'Administers military trauma hospitals, emergency blood banks, and rehabilitation.' },
    { id: 'education_science', name: 'Minister of Education and Science', description: 'Maintains school bomb shelter standards and modern academic curricula.' },
    { id: 'agrarian_policy', name: 'Minister of Agrarian Policy and Food', description: 'Safeguards the global breadbasket, agricultural sowing campaigns, and food exports.' },
    { id: 'social_policy', name: 'Minister of Social Policy', description: 'Distributes pensions and humanitarian support to millions of internally displaced persons.' },
    { id: 'veterans_affairs', name: 'Minister of Veterans Affairs', description: 'Supports combat veterans, medical rehabilitation, and reintegration programs.' },
    { id: 'culture_info', name: 'Minister of Culture and Strategic Communications', description: 'Coordinates national cultural heritage preservation and counter-disinformation.' }
  ],
  CN: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (外交部)', description: 'Directs global diplomatic strategy, Belt and Road Initiative, and BRICS alignment.' },
    { id: 'national_defense', name: 'Minister of National Defense (国防部)', description: 'Represents the PLA internationally and coordinates state military readiness.' },
    { id: 'ndrc', name: 'Chairman of the National Development and Reform Commission (发改委)', description: 'Formulates national Five-Year Plans, infrastructure mega-projects, and macroeconomic policy.' },
    { id: 'finance', name: 'Minister of Finance (财政部)', description: 'Controls state fiscal spending, local government debt quotas, and taxation.' },
    { id: 'commerce', name: 'Minister of Commerce (商务部)', description: 'Regulates foreign trade, export controls, FDI, and global trade negotiations.' },
    { id: 'industry_it', name: 'Minister of Industry and Information Technology (工信部)', description: 'Accelerates domestic semiconductor self-reliance, EV manufacturing, and 5G networks.' },
    { id: 'public_security', name: 'Minister of Public Security (公安部)', description: 'Directs the People\'s Police, national surveillance network, and domestic law enforcement.' },
    { id: 'state_security', name: 'Minister of State Security (国家安全部 / MSS)', description: 'Conducts foreign intelligence, counter-espionage, and strategic security operations.' },
    { id: 'science_tech', name: 'Minister of Science and Technology (科技部)', description: 'Oversees national research laboratories, AI investments, and space exploration programs.' },
    { id: 'education', name: 'Minister of Education (教育部)', description: 'Sets national Gaokao standards, university rankings, and patriotic education.' },
    { id: 'ecology_environment', name: 'Minister of Ecology and Environment (生态环境部)', description: 'Enforces dual-carbon goals (peak emissions by 2030, carbon neutrality by 2060).' },
    { id: 'transport', name: 'Minister of Transport (交通运输部)', description: 'Manages China\'s 45,000km High-Speed Rail network, deepwater ports, and civil aviation.' }
  ],
  TW: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MOFA)', description: 'Maintains diplomatic alliances and expands unofficial ties with democratic nations.' },
    { id: 'national_defense', name: 'Minister of National Defense (MND)', description: 'Commands the ROC Armed Forces, asymmetric warfare strategy, and conscription.' },
    { id: 'economic_affairs', name: 'Minister of Economic Affairs (MOEA)', description: 'Safeguards the silicon shield (TSMC semiconductor supply chain) and green energy.' },
    { id: 'finance', name: 'Minister of Finance (MOF)', description: 'Manages state revenue, national treasury bonds, and customs tariffs.' },
    { id: 'interior', name: 'Minister of the Interior (MOI)', description: 'Directs the National Police Agency, disaster response, and land administration.' },
    { id: 'justice', name: 'Minister of Justice (MOJ)', description: 'Oversees the investigation bureau (MJIB), prosecutorial system, and courts.' },
    { id: 'digital_affairs', name: 'Minister of Digital Affairs (MODA)', description: 'Strengthens national cyber-resilience against attacks and fosters open-source tools.' },
    { id: 'health_welfare', name: 'Minister of Health and Welfare (MOHW)', description: 'Administers the world-renowned National Health Insurance (NHI) system.' },
    { id: 'education', name: 'Minister of Education (MOE)', description: 'Sets high school and university curricula and bilingual 2030 initiatives.' },
    { id: 'transport_comm', name: 'Minister of Transportation and Communications (MOTC)', description: 'Oversees Taiwan High Speed Rail, Taoyuan Airport expansion, and telecom grids.' },
    { id: 'environment', name: 'Minister of Environment (MOENV)', description: 'Manages carbon pricing mechanisms, waste recycling, and air quality standards.' },
    { id: 'agriculture', name: 'Minister of Agriculture (MOA)', description: 'Protects domestic rice security, agricultural technology, and fisheries.' }
  ],
  KR: [
    { id: 'deputy_pm_economy', name: 'Deputy PM & Minister of Economy and Finance (MOEF)', description: 'Directs macroeconomic policy, fiscal budget, and Chaebol regulatory frameworks.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MOFA)', description: 'Directs diplomacy, ROK-US alliance, and trilateral cooperation with Japan.' },
    { id: 'unification', name: 'Minister of Unification (MOU)', description: 'Manages inter-Korean relations, North Korean human rights policy, and reunification planning.' },
    { id: 'justice', name: 'Minister of Justice (MOJ)', description: 'Oversees the Supreme Prosecutors\' Office, correctional institutions, and legal reforms.' },
    { id: 'national_defense', name: 'Minister of National Defense (MND)', description: 'Commands the ROK Armed Forces, missile defense (KAMD), and defence exports (K2/K9).' },
    { id: 'interior_safety', name: 'Minister of the Interior and Safety (MOIS)', description: 'Directs national police agencies, local autonomy, and disaster preparedness.' },
    { id: 'trade_industry_energy', name: 'Minister of Trade, Industry and Energy (MOTIE)', description: 'Accelerates memory chip superiority, nuclear reactor exports, and battery tech.' },
    { id: 'health_welfare', name: 'Minister of Health and Welfare (MOHW)', description: 'Administers national health insurance, low birth rate countermeasures, and pensions.' },
    { id: 'environment', name: 'Minister of Environment (ME)', description: 'Regulates industrial emissions, clean water supplies, and carbon reduction.' },
    { id: 'employment_labor', name: 'Minister of Employment and Labor (MOEL)', description: 'Sets minimum wage standards, 52-hour work week regulations, and union arbitration.' },
    { id: 'land_infrastructure_transport', name: 'Minister of Land, Infrastructure and Transport (MOLIT)', description: 'Oversees KTX high-speed trains, Incheon Airport, and Seoul housing stabilization.' },
    { id: 'science_ict', name: 'Minister of Science and ICT (MSIT)', description: 'Drives national AI supercomputing, quantum computing, and KSLV space launches.' },
    { id: 'culture_sports_tourism', name: 'Minister of Culture, Sports and Tourism (MCST)', description: 'Champions K-pop, K-dramas, video gaming exports, and cultural soft power.' },
    { id: 'agriculture_food_rural', name: 'Minister of Agriculture, Food and Rural Affairs (MAFRA)', description: 'Protects domestic agricultural staples, smart farming, and animal quarantine.' }
  ],
  IN: [
    { id: 'home_affairs', name: 'Minister of Home Affairs', description: 'Controls internal security, intelligence (IB), CRPF, and federal law and order.' },
    { id: 'defence', name: 'Minister of Defence (Raksha Mantri)', description: 'Commands the Indian Armed Forces, border readiness, and Make in India defence indigenisation.' },
    { id: 'external_affairs', name: 'Minister of External Affairs (EAM)', description: 'Leads India\'s multi-aligned global diplomacy, Quad partnerships, and Global South leadership.' },
    { id: 'finance', name: 'Minister of Finance & Corporate Affairs', description: 'Presents the Union Budget, GST taxation, and manages macroeconomic growth.' },
    { id: 'road_transport', name: 'Minister of Road Transport and Highways', description: 'Builds world-class National Expressways and highway infrastructure at record pace.' },
    { id: 'railways_it', name: 'Minister of Railways, Electronics & IT', description: 'Expands Vande Bharat trains, semiconductor fabs, and Digital India stack.' },
    { id: 'commerce_industry', name: 'Minister of Commerce and Industry', description: 'Drives national manufacturing incentives (PLI schemes) and global free trade pacts.' },
    { id: 'agriculture', name: 'Minister of Agriculture and Farmers Welfare', description: 'Supports agrarian price minimums (MSP), Kisan credit, and irrigation networks.' },
    { id: 'education', name: 'Minister of Education', description: 'Implements the National Education Policy (NEP) and expands IITs and IIMs.' },
    { id: 'health', name: 'Minister of Health and Family Welfare', description: 'Administers the world\'s largest public health assurance scheme (Ayushman Bharat).' },
    { id: 'power_renewables', name: 'Minister of Power and New & Renewable Energy', description: 'Spearheads massive solar parks, green hydrogen, and national electrical grid.' },
    { id: 'petroleum', name: 'Minister of Petroleum and Natural Gas', description: 'Secures strategic crude oil reserves, domestic refining, and energy affordability.' },
    { id: 'environment_forests', name: 'Minister of Environment, Forest and Climate Change', description: 'Preserves tiger reserves, oversees environmental clearances, and afforestation.' },
    { id: 'law_justice', name: 'Minister of Law and Justice', description: 'Coordinates legal architecture, judicial reforms, and constitutional compliance.' },
    { id: 'rural_dev', name: 'Minister of Rural Development and Panchayati Raj', description: 'Oversees rural employment guarantee (MGNREGA) and village infrastructure.' }
  ],
  ID: [
    { id: 'polhukam', name: 'Coordinating Minister for Political, Legal, and Security Affairs', description: 'Coordinates national defense, intelligence (BIN), police, and foreign policy.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (Menlu)', description: 'Directs ASEAN leadership, Non-Aligned diplomacy, and international trade pacts.' },
    { id: 'defense', name: 'Minister of Defence (Menhan)', description: 'Directs the Indonesian National Armed Forces (TNI) modernization.' },
    { id: 'finance', name: 'Minister of Finance (Menkeu)', description: 'Maintains state budget deficit caps, tax collection, and sovereign bonds.' },
    { id: 'home_affairs', name: 'Minister of Home Affairs (Mendagri)', description: 'Supervises provincial governors, regencies, and regional autonomy across 17,000 islands.' },
    { id: 'law_human_rights', name: 'Minister of Law and Human Rights (Menkumham)', description: 'Administers national legislation, prison systems, and immigration checkpoints.' },
    { id: 'energy_mineral', name: 'Minister of Energy and Mineral Resources (ESDM)', description: 'Enforces nickel downstream processing (downstreaming) and oil/coal concessions.' },
    { id: 'trade', name: 'Minister of Trade (Mendag)', description: 'Controls staple commodity prices (cooking oil/rice) and export permits.' },
    { id: 'industry', name: 'Minister of Industry (Menperin)', description: 'Expands domestic manufacturing clusters and EV battery supply chains.' },
    { id: 'public_works', name: 'Minister of Public Works and Public Housing (PUPR)', description: 'Constructs the new capital city Nusantara (IKN), toll roads, and dams.' },
    { id: 'health', name: 'Minister of Health (Menkes)', description: 'Directs national universal healthcare (BPJS) and hospital modernisations.' },
    { id: 'education_culture', name: 'Minister of Education, Culture, Research, and Technology', description: 'Directs the Merdeka Belajar school system and university research.' },
    { id: 'state_owned_enterprises', name: 'Minister of State-Owned Enterprises (BUMN)', description: 'Supervises state conglomerates (Pertamina, PLN, Bank Mandiri, Telkom).' },
    { id: 'social_affairs', name: 'Minister of Social Affairs (Mensos)', description: 'Distributes direct cash assistance (BLT) and disaster relief.' }
  ],
  MX: [
    { id: 'interior_segob', name: 'Secretary of the Interior (SEGOB)', description: 'Directs domestic political governance, intelligence (CNI), and civil protection.' },
    { id: 'foreign_sre', name: 'Secretary of Foreign Affairs (SRE)', description: 'Oversees relations with the US, Latin America, and international treaties.' },
    { id: 'defense_sedena', name: 'Secretary of National Defense (SEDENA)', description: 'Commands the Mexican Army, Air Force, and National Guard (Guardia Nacional).' },
    { id: 'navy_semar', name: 'Secretary of the Navy (SEMAR)', description: 'Secures maritime borders, customs ports, and naval special forces.' },
    { id: 'finance_shcp', name: 'Secretary of Finance and Public Credit (SHCP)', description: 'Manages the federal budget, SAT tax collection, and sovereign oil revenue.' },
    { id: 'welfare_bienestar', name: 'Secretary of Welfare (Secretaría de Bienestar)', description: 'Administers universal senior pensions and flagship direct social welfare programs.' },
    { id: 'economy_se', name: 'Secretary of Economy (SE)', description: 'Drives nearshoring investments, USMCA trade compliance, and industrial policy.' },
    { id: 'energy_sener', name: 'Secretary of Energy (SENER)', description: 'Directs state oil titan PEMEX and Federal Electricity Commission (CFE).' },
    { id: 'agriculture_sader', name: 'Secretary of Agriculture and Rural Development (SADER)', description: 'Protects food self-sufficiency, avocado/corn production, and rural subsidies.' },
    { id: 'infrastructure_sict', name: 'Secretary of Infrastructure, Communications and Transport (SICT)', description: 'Builds passenger railways (Tren Maya, Interoceanic Corridor) and highways.' },
    { id: 'education_sep', name: 'Secretary of Public Education (SEP)', description: 'Directs national textbooks (Nueva Escuela Mexicana) and teacher unions.' },
    { id: 'health_salud', name: 'Secretary of Health (SALUD / IMSS-Bienestar)', description: 'Provides free universal medical care and regulates pharmaceuticals (COFEPRIS).' },
    { id: 'labour_stps', name: 'Secretary of Labour and Social Prevention (STPS)', description: 'Enforces historical minimum wage hikes and democratic union voting.' },
    { id: 'environment_semarnat', name: 'Secretary of Environment and Natural Resources (SEMARNAT)', description: 'Protects national biosphere reserves, water concessions, and wildlife.' }
  ],
  CA: [
    { id: 'deputy_pm_finance', name: 'Deputy Prime Minister and Minister of Finance', description: 'Prepares the Federal Budget and coordinates overall government priorities.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (Global Affairs Canada)', description: 'Directs Canadian diplomacy, Arctic sovereignty, G7, and NATO contributions.' },
    { id: 'national_defence', name: 'Minister of National Defence', description: 'Commands the Canadian Armed Forces and NORAD continental defence.' },
    { id: 'public_safety', name: 'Minister of Public Safety', description: 'Oversees the RCMP, border services (CBSA), and intelligence (CSIS).' },
    { id: 'justice', name: 'Minister of Justice and Attorney General', description: 'Guarantees the Charter of Rights and Freedoms and federal judicial appointments.' },
    { id: 'innovation_industry', name: 'Minister of Innovation, Science and Industry (ISED)', description: 'Attracts EV battery gigafactories, AI research hubs, and telecom regulation.' },
    { id: 'health', name: 'Minister of Health', description: 'Administers the Canada Health Act and national dental/pharmacare programs.' },
    { id: 'environment_climate', name: 'Minister of Environment and Climate Change', description: 'Enforces national carbon pricing and national park preservation.' },
    { id: 'housing_infrastructure', name: 'Minister of Housing, Infrastructure and Communities', description: 'Accelerates municipal housing construction and federal transit funding.' },
    { id: 'immigration', name: 'Minister of Immigration, Refugees and Citizenship (IRCC)', description: 'Sets immigration targets, express entry quotas, and student visa caps.' },
    { id: 'natural_resources', name: 'Minister of Energy and Natural Resources', description: 'Manages critical minerals, uranium, oil sands, and clean hydroelectric power.' },
    { id: 'transport', name: 'Minister of Transport', description: 'Regulates VIA Rail, international airports, shipping ports, and pipeline safety.' },
    { id: 'agriculture', name: 'Minister of Agriculture and Agri-Food', description: 'Protects dairy supply management and Western Canadian wheat/canola exports.' },
    { id: 'labour', name: 'Minister of Labour and Seniors', description: 'Oversees federal collective bargaining and old age security (OAS) benefits.' },
    { id: 'canadian_heritage', name: 'Minister of Canadian Heritage', description: 'Supports the CBC/Radio-Canada, Indigenous language revival, and cultural arts.' }
  ],
  AU: [
    { id: 'deputy_pm_defence', name: 'Deputy Prime Minister and Minister for Defence', description: 'Directs the Australian Defence Force (ADF) and AUKUS nuclear submarine pact.' },
    { id: 'treasurer', name: 'Treasurer of Australia', description: 'Delivers the Federal Budget, monitors inflation, and regulates banks (APRA/ASIC).' },
    { id: 'foreign_affairs', name: 'Minister for Foreign Affairs', description: 'Leads Pacific diplomacy, Indo-Pacific alliances (Quad), and consular affairs.' },
    { id: 'finance', name: 'Minister for Finance and Women', description: 'Controls federal departmental expenditure and public sector management.' },
    { id: 'home_affairs', name: 'Minister for Home Affairs and Cyber Security', description: 'Directs ASIO intelligence, Australian Federal Police (AFP), and border security.' },
    { id: 'attorney_general', name: 'Attorney-General', description: 'Protects the rule of law, anti-corruption commission (NACC), and federal courts.' },
    { id: 'climate_energy', name: 'Minister for Climate Change and Energy', description: 'Drives the transition to 82% renewable energy grid and Net Zero targets.' },
    { id: 'health_aged_care', name: 'Minister for Health and Aged Care', description: 'Administers Medicare, subsidized pharmaceuticals (PBS), and aged care standards.' },
    { id: 'education', name: 'Minister for Education', description: 'Funds public and private schools, universities, and student debt relief (HECS).' },
    { id: 'infrastructure_transport', name: 'Minister for Infrastructure, Transport and Regional Development', description: 'Builds major rail links, airport hubs, and regional road networks.' },
    { id: 'employment_workplace', name: 'Minister for Employment and Workplace Relations', description: 'Oversees the Fair Work Commission, multi-employer bargaining, and workplace safety.' },
    { id: 'industry_science', name: 'Minister for Industry and Science', description: 'Oversees the National Reconstruction Fund, CSIRO science, and quantum tech.' },
    { id: 'agriculture_fisheries', name: 'Minister for Agriculture, Fisheries and Forestry', description: 'Defends biosecurity borders and Australian agricultural beef/wheat exports.' },
    { id: 'social_services', name: 'Minister for Social Services', description: 'Oversees Centrelink welfare payments and the National Disability Insurance Scheme (NDIS).' }
  ],
  ZA: [
    { id: 'international_relations', name: 'Minister of International Relations and Cooperation (DIRCO)', description: 'Directs South Africa\'s global foreign policy, African Union leadership, and BRICS+.' },
    { id: 'defence', name: 'Minister of Defence and Military Veterans', description: 'Commands the South African National Defence Force (SANDF) and peacekeeping.' },
    { id: 'finance', name: 'Minister of Finance (National Treasury)', description: 'Drafts the national budget, manages debt stabilization, and tax revenue (SARS).' },
    { id: 'home_affairs', name: 'Minister of Home Affairs', description: 'Manages national civic identity registries, border management (BMA), and visas.' },
    { id: 'police', name: 'Minister of Police', description: 'Commands the South African Police Service (SAPS) and anti-crime initiatives.' },
    { id: 'justice', name: 'Minister of Justice and Constitutional Development', description: 'Guarantees the democratic Constitution and National Prosecuting Authority (NPA).' },
    { id: 'trade_industry', name: 'Minister of Trade, Industry and Competition (DTIC)', description: 'Drives industrialization, Black Economic Empowerment (B-BBEE), and tariff protections.' },
    { id: 'mineral_petroleum', name: 'Minister of Mineral and Petroleum Resources', description: 'Oversees platinum, gold, and coal mining concessions and offshore gas.' },
    { id: 'electricity_energy', name: 'Minister of Electricity and Energy', description: 'Resolves Eskom loadshedding and builds new solar/wind transmission corridors.' },
    { id: 'public_works', name: 'Minister of Public Works and Infrastructure', description: 'Coordinates national infrastructure projects and public asset maintenance.' },
    { id: 'health', name: 'Minister of Health', description: 'Implements the National Health Insurance (NHI) bill and public clinic upgrades.' },
    { id: 'basic_education', name: 'Minister of Basic Education', description: 'Administers primary/secondary schooling, matric exams, and teacher training.' },
    { id: 'transport', name: 'Minister of Transport', description: 'Maintains national roads (SANRAL), passenger rail (PRASA), and ports (Transnet).' },
    { id: 'agriculture', name: 'Minister of Agriculture', description: 'Champions land reform, commercial grain exports, and wine/citrus farming.' }
  ],
  EG: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs and Emigration', description: 'Oversees Arab diplomacy, Nile Basin water rights (GERD), and Red Sea security.' },
    { id: 'defense', name: 'Minister of Defense and Military Production', description: 'Commands the Egyptian Armed Forces, Sinai security, and military industrial factories.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Directs national police, homeland security, and civil identification.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages fiscal deficit, IMF loan programs, and tax modernization.' },
    { id: 'planning_economic_dev', name: 'Minister of Planning, Economic Development and International Cooperation', description: 'Formulates Egypt Vision 2030 and external developmental financing.' },
    { id: 'petroleum_minerals', name: 'Minister of Petroleum and Mineral Resources', description: 'Supervises Zohr natural gas field production and gold mining in the Eastern Desert.' },
    { id: 'supply_internal_trade', name: 'Minister of Supply and Internal Trade', description: 'Guarantees bread subsidies (Baladi bread) for 70 million citizens and wheat reserves.' },
    { id: 'transport', name: 'Minister of Transport and Deputy Prime Minister', description: 'Builds high-speed electric trains, monorail, and modernizes Alexandria ports.' },
    { id: 'housing_utilities', name: 'Minister of Housing, Utilities and Urban Communities', description: 'Constructs the New Administrative Capital and social housing cities.' },
    { id: 'electricity_renewables', name: 'Minister of Electricity and Renewable Energy', description: 'Manages the unified power grid, Benban solar park, and El Dabaa nuclear plant.' },
    { id: 'health', name: 'Minister of Health and Population', description: 'Expands the Universal Health Insurance system and 100 Million Health initiatives.' },
    { id: 'education', name: 'Minister of Education and Technical Education', description: 'Implements Thanaweya Amma high school examination and classroom reforms.' },
    { id: 'agriculture_land', name: 'Minister of Agriculture and Land Reclamation', description: 'Reclaims desert land (New Delta project) to expand wheat and sugar production.' },
    { id: 'tourism_antiquities', name: 'Minister of Tourism and Antiquities', description: 'Oversees the Grand Egyptian Museum, Pyramids plateau, and Red Sea resorts.' }
  ],
  SA: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs GCC diplomacy, Arab League leadership, and international alliances.' },
    { id: 'defense', name: 'Minister of Defense', description: 'Commands the Royal Saudi Armed Forces and domestic defense procurement (GAMI).' },
    { id: 'interior', name: 'Minister of Interior', description: 'Controls public security, state intelligence, border guards, and civil defense.' },
    { id: 'national_guard', name: 'Minister of the National Guard', description: 'Commands the elite Saudi Arabian National Guard (SANG) and royal protection.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages state revenues, sovereign debt, and fiscal sustainability programs.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Directs Saudi Aramco, OPEC+ petroleum quotas, and clean hydrogen projects.' },
    { id: 'investment', name: 'Minister of Investment (MISA)', description: 'Attracts foreign multinational headquarters to Riyadh under Vision 2030.' },
    { id: 'economy_planning', name: 'Minister of Economy and Planning', description: 'Guides non-oil GDP diversification and Vision 2030 strategic realization.' },
    { id: 'commerce', name: 'Minister of Commerce', description: 'Regulates domestic retail markets, corporate law, and consumer protection.' },
    { id: 'industry_minerals', name: 'Minister of Industry and Mineral Resources', description: 'Explores vast rare-earth mineral reserves and develops industrial cities (MODON).' },
    { id: 'health', name: 'Minister of Health', description: 'Directs the Health Sector Transformation Program and SEHA virtual hospitals.' },
    { id: 'education', name: 'Minister of Education', description: 'Modernizes Saudi universities, STEM curricula, and international scholarships.' },
    { id: 'tourism', name: 'Minister of Tourism', description: 'Transforms AlUla, Diriyah, and the Red Sea project into global tourism hubs.' },
    { id: 'transport_logistics', name: 'Minister of Transport and Logistic Services', description: 'Develops Riyadh Air, Saudi railway networks, and King Salman Airport.' }
  ],
  IR: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs diplomacy with regional neighbors, Asian partners, and nuclear accord talks.' },
    { id: 'defense', name: 'Minister of Defence and Armed Forces Logistics', description: 'Directs missile, air defense, and drone research and military manufacturing.' },
    { id: 'intelligence', name: 'Minister of Intelligence (VAJA)', description: 'Directs national intelligence services, counter-espionage, and cyber operations.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Oversees provincial governors-general, Law Enforcement Command (FARAJA), and elections.' },
    { id: 'economy_finance', name: 'Minister of Economic Affairs and Finance', description: 'Manages state taxation, banking regulation, and anti-sanctions currency policy.' },
    { id: 'petroleum', name: 'Minister of Petroleum', description: 'Oversees the National Iranian Oil Company (NIOC), refineries, and gas exports.' },
    { id: 'industry_mine_trade', name: 'Minister of Industry, Mine and Trade', description: 'Directs domestic automotive production (Iran Khodro), steel, and mining.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Manages national water resources, hydroelectric dams, and electricity generation.' },
    { id: 'health', name: 'Minister of Health and Medical Education', description: 'Administers public hospitals, medical schools, and domestic pharmaceutical production.' },
    { id: 'education', name: 'Minister of Education', description: 'Directs primary and secondary public schools and national curricula.' },
    { id: 'roads_urban_dev', name: 'Minister of Roads and Urban Development', description: 'Supervises national housing construction, port logistics, and rail networks.' },
    { id: 'agriculture_jahad', name: 'Minister of Agriculture Jihad', description: 'Guarantees wheat self-sufficiency, livestock feeds, and food security.' },
    { id: 'ict', name: 'Minister of Information and Communications Technology', description: 'Administers the National Information Network and telecommunication infrastructure.' }
  ],
  IL: [
    { id: 'defense', name: 'Minister of Defense', description: 'Commands the Israel Defense Forces (IDF), Mossad/Shin Bet coordination, and defense industries.' },
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs', description: 'Directs Israeli diplomatic missions, Abraham Accords alliances, and international relations.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Oversees state budget appropriations, high-tech sector taxation, and cost of living.' },
    { id: 'national_security', name: 'Minister of National Security', description: 'Directs the Israel Police, Border Police (Border Patrol), and prison service.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees court appointments, State Attorney\'s Office, and judicial system.' },
    { id: 'economy_industry', name: 'Minister of Economy and Industry', description: 'Fosters high-tech innovation, startup incubators, and global trade exports.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Supervises local municipal authorities, regional planning, and population registries.' },
    { id: 'energy_infrastructure', name: 'Minister of Energy and Infrastructure', description: 'Manages offshore Leviathan natural gas fields, electricity grid, and water desalination.' },
    { id: 'health', name: 'Minister of Health', description: 'Administers Israel\'s four universal HMO health maintenance organizations.' },
    { id: 'education', name: 'Minister of Education', description: 'Sets educational standards across state, religious, and Arabic school streams.' },
    { id: 'transport_road_safety', name: 'Minister of Transport and Road Safety', description: 'Builds the Tel Aviv Metro, Israel Railways, and international seaport expansions.' },
    { id: 'strategic_affairs', name: 'Minister of Strategic Affairs', description: 'Directs strategic ties with the United States and counter-delegitimization campaigns.' },
    { id: 'construction_housing', name: 'Minister of Construction and Housing', description: 'Oversees nationwide urban renewal (Tama 38) and subsidized housing tenders.' },
    { id: 'tourism', name: 'Minister of Tourism', description: 'Promotes holy site pilgrimages and Mediterranean hospitality infrastructure.' }
  ],
  PS: [
    { id: 'prime_minister_foreign', name: 'Prime Minister & Minister of Foreign Affairs', description: 'Leads the Palestinian Authority cabinet and directs diplomatic missions worldwide.' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Commands the Palestinian National Security Forces and Civil Police.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Manages tax clearance revenues, civil servant salaries, and international aid.' },
    { id: 'national_economy', name: 'Minister of National Economy', description: 'Supports Palestinian private commerce, SME enterprises, and trade regulations.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Administers the judicial administration, public prosecution, and legal harmonisation.' },
    { id: 'health', name: 'Minister of Health', description: 'Directs public clinics, hospital networks, and emergency medical response.' },
    { id: 'education_higher_ed', name: 'Minister of Education and Higher Education', description: 'Administers Tawjihi matriculation exams and Palestinian universities.' },
    { id: 'social_development', name: 'Minister of Social Development', description: 'Distributes cash assistance to impoverished families and vulnerable citizens.' },
    { id: 'public_works_housing', name: 'Minister of Public Works and Housing', description: 'Coordinates post-conflict reconstruction and municipal infrastructure repair.' },
    { id: 'local_governance', name: 'Minister of Local Governance', description: 'Coordinates city municipalities and village councils across the West Bank and Gaza.' },
    { id: 'waqf_religious_affairs', name: 'Minister of Waqf and Religious Affairs', description: 'Oversees Islamic holy endowments, mosques, and religious heritage institutions.' }
  ],
  RO: [
    { id: 'foreign_affairs', name: 'Minister of Foreign Affairs (MAE)', description: 'Directs Romanian diplomacy, NATO eastern flank integration, and Schengen membership.' },
    { id: 'national_defence', name: 'Minister of National Defence (MApN)', description: 'Commands the Romanian Armed Forces, Black Sea deterrence, and military bases.' },
    { id: 'internal_affairs', name: 'Minister of Internal Affairs (MAI)', description: 'Controls the Romanian Police, Gendarmerie, Border Police, and Emergency Situations.' },
    { id: 'finance', name: 'Minister of Finance (MFP)', description: 'Manages the state budget deficit, tax administration (ANAF), and treasury bonds.' },
    { id: 'justice', name: 'Minister of Justice (MJ)', description: 'Guarantees the independence of the judicial system and anti-corruption compliance.' },
    { id: 'transport_infrastructure', name: 'Minister of Transport and Infrastructure', description: 'Constructs the A7 Moldavia Highway, A8 Unirii Motorway, and Constanța port.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Oversees Cernavodă nuclear reactors, Neptun Deep offshore Black Sea gas, and hydro.' },
    { id: 'economy_tourism', name: 'Minister of Economy, Entrepreneurship and Tourism', description: 'Stimulates domestic industrial manufacturing and international tourism.' },
    { id: 'health', name: 'Minister of Health (MS)', description: 'Administers county hospitals, emergency ambulances (SMURD), and medical funding.' },
    { id: 'education', name: 'Minister of Education', description: 'Directs the Educated Romania reform program, Baccalaureate exams, and universities.' },
    { id: 'agriculture_rural_dev', name: 'Minister of Agriculture and Rural Development', description: 'Supports grain harvesting, livestock breeding, and EU agrarian subsidies.' },
    { id: 'environment_forests', name: 'Minister of Environment, Water and Forests', description: 'Preserves the Carpathian virgin forests, Danube Delta, and anti-illegal logging.' },
    { id: 'european_investments', name: 'Minister of European Investments and Projects (MIPE)', description: 'Accelerates the absorption of EU recovery funds (PNRR) across Romanian regions.' }
  ],
  HU: [
    { id: 'foreign_affairs_trade', name: 'Minister of Foreign Affairs and Trade', description: 'Leads Eastern Opening diplomacy, Western ties, and EV battery gigafactory investments.' },
    { id: 'defence', name: 'Minister of Defence', description: 'Directs the Hungarian Defence Forces (Honvédség) modernization (Zrínyi program).' },
    { id: 'interior', name: 'Minister of the Interior', description: 'Controls the Hungarian Police, southern border fence security, and public healthcare.' },
    { id: 'finance', name: 'Minister of Finance', description: 'Drafts the central state budget, corporate flat tax, and sovereign debt targets.' },
    { id: 'national_economy', name: 'Minister for National Economy', description: 'Fosters high-tech manufacturing, domestic business competitiveness, and retail price caps.' },
    { id: 'justice', name: 'Minister of Justice', description: 'Oversees constitutional legislation, European Union legal affairs, and court rules.' },
    { id: 'energy', name: 'Minister of Energy', description: 'Supervises the Paks II nuclear power plant expansion and national utility price cuts (Rezsicsökkentés).' },
    { id: 'construction_transport', name: 'Minister of Construction and Transport', description: 'Oversees state infrastructure investments, MÁV railways, and motorway networks.' },
    { id: 'agriculture', name: 'Minister of Agriculture', description: 'Protects Hungarian family farmland, GMO-free agricultural standards, and forestry.' },
    { id: 'public_admin_regional', name: 'Minister of Public Administration and Regional Development', description: 'Coordinates government service centres (Kormányablak) and regional development.' },
    { id: 'culture_innovation', name: 'Minister of Culture and Innovation', description: 'Directs university foundation models, family support policies (CSOK), and arts.' },
    { id: 'eu_affairs', name: 'Minister for European Union Affairs', description: 'Conducts negotiations with the European Council and defends national sovereignty.' }
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
