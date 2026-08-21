/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'tr';

export interface Translations {
  // Navigation & General
  appTitle: string;
  scenario: string;
  playableNations: string;
  campaignsSecured: string;
  nationsWon: string;
  returnToMap: string;
  settings: string;
  languages: string;
  preferences: string;
  soundEffects: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  resetProgress: string;
  dangerZone: string;
  close: string;
  confirm: string;
  cancel: string;
  startCampaign: string;
  viewCampaign: string;
  
  // Game Flow / Pacing
  gameplayFlowMode: string;
  turnByTurn: string;
  turnByTurnDesc: string;
  pausableRealtime: string;
  pausableRealtimeDesc: string;
  simulationSpeed: string;
  speedVerySlow: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;
  speedVeryFast: string;
  pause: string;
  resume: string;
  nextTurn: string;
  week: string;
  month: string;
  year: string;

  // Party Creator
  establishMovement: string;
  partyCharterName: string;
  founderLeader: string;
  partyColor: string;
  manifestoIdeology: string;
  leaderPresets: string;
  customLeader: string;
  designOwn: string;
  launchCampaign: string;
  ideologyDescriptions: Record<string, { desc: string; focus: string }>;

  // Dashboard & Gameplay
  campaignHub: string;
  parliamentBills: string;
  rulingCabinet: string;
  nationalEconomy: string;
  diplomacy: string;
  pollingAverages: string;
  seatsProjected: string;
  electoralThreshold: string;
  voterGroups: string;
  holdRally: string;
  advertisement: string;
  openHeadquarters: string;
  groundCanvassing: string;
  voteDay: string;
  partyBudget: string;
  partyMembers: string;
  politicalInfluence: string;

  // Ideologies
  ideologyNames: Record<string, string>;
  voterGroupNames: Record<string, string>;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appTitle: "Paths to Power",
    scenario: "Scenario",
    playableNations: "Playable Nations",
    campaignsSecured: "Campaigns Secured",
    nationsWon: "Nations Won",
    returnToMap: "Return to World Map",
    settings: "Game Settings",
    languages: "Languages",
    preferences: "Preferences",
    soundEffects: "Sound Effects",
    theme: "Interface Theme",
    lightMode: "Light Mode (High Contrast)",
    darkMode: "Dark Mode (Immersive Strategy Canvas)",
    resetProgress: "Reset Game Progress",
    dangerZone: "Danger Zone",
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    startCampaign: "Launch Campaign",
    viewCampaign: "Resume Campaign",

    gameplayFlowMode: "Gameplay Flow Mode",
    turnByTurn: "Turn-by-Turn (Manual)",
    turnByTurnDesc: "Control each campaign action and advance weeks manually when ready.",
    pausableRealtime: "Pausable Simulation (Auto-advance)",
    pausableRealtimeDesc: "Automated simulation clock with pause/resume and 5 speed presets.",
    simulationSpeed: "Simulation Speed",
    speedVerySlow: "1: Very Slow (10s / turn)",
    speedSlow: "2: Slow (5s / turn)",
    speedNormal: "3: Normal (3s / turn)",
    speedFast: "4: Fast (1.5s / turn)",
    speedVeryFast: "5: Very Fast (0.8s / turn)",
    pause: "Pause",
    resume: "Resume",
    nextTurn: "Next Week",
    week: "Week",
    month: "Month",
    year: "Year",

    establishMovement: "ESTABLISH NEW MOVEMENT",
    partyCharterName: "Party Charter Name",
    founderLeader: "General Chair / Founder",
    partyColor: "Official Party Color",
    manifestoIdeology: "Party Manifesto Ideology",
    leaderPresets: "Official National Leader Templates",
    customLeader: "Custom Leader",
    designOwn: "Design My Own",
    launchCampaign: "Launch Political Campaign",

    ideologyDescriptions: {
      'Social Democrat': { desc: 'Social justice, robust welfare programs, labor rights, and public healthcare.', focus: 'Boosts Labor and Youth support.' },
      'Conservative': { desc: 'Fiscal prudence, cultural heritage, public order, and market stability.', focus: 'Boosts Traditionalist and Shopkeeper support.' },
      'Nationalist': { desc: 'National sovereignty, border integrity, domestic industrial prioritization, and strategic independence.', focus: 'Boosts Nationalist and Traditionalist support.' },
      'Liberal': { desc: 'Individual liberty, free markets, deregulation, digital innovation, and civil equality.', focus: 'Boosts Liberal and Shopkeeper support.' },
      'Socialist': { desc: 'Public control of essential infrastructure, wealth redistribution, and worker equity.', focus: 'High base appeal among Labor and Youth.' },
      'Ecologist': { desc: 'Green energy transition, climate action, environmental preservation, and sustainability.', focus: 'Strong appeal among Youth and Liberal voters.' },
      'Centrist': { desc: 'Pragmatic governance, consensus-building, balanced budgets, and institutional reform.', focus: 'Broad moderate support across all factions.' },
      'Traditionalist': { desc: 'Deep-rooted faith, rural customs, regional autonomy, and moral conservatism.', focus: 'Dominant in rural Traditionalist communities.' },
      'Communist': { desc: 'Class struggle, planned state economy, complete nationalization, and collective councils.', focus: 'Massive Labor backing with zero Merchant appeal.' },
      'Social Conservative': { desc: 'Family values, social community cohesion, faith-based welfare, and civic solidarity.', focus: 'Strong among Traditionalists and small business.' },
      'Progressive': { desc: 'Rapid modern social reforms, civil equality, green technology, and systemic transparency.', focus: 'Dominant among urban Youth and Liberals.' },
      'Populist': { desc: 'Anti-establishment rhetoric, direct citizen referendums, and defending the common people.', focus: 'High resonance with disconnected working voters.' },
      'Monarchist': { desc: 'Crown authority, aristocratic continuity, constitutional monarchy, and historic statehood.', focus: 'Appeals to historic Traditionalists.' },
      'Far Right': { desc: 'Ultraconservative identity, radical anti-immigration, and authoritarian state authority.', focus: 'High Nationalist radical core.' },
      'Far Left': { desc: 'Radical redistribution, workplace democracy, anti-imperialism, and anti-capitalist mobilization.', focus: 'Radical worker and student base.' }
    },

    campaignHub: "Campaign Strategy Hub",
    parliamentBills: "Parliament & Legislative Bills",
    rulingCabinet: "Government Cabinet",
    nationalEconomy: "Economic Indices & Treasury",
    diplomacy: "Foreign Affairs & Treaties",
    pollingAverages: "Polling Averages",
    seatsProjected: "Projected Seats",
    electoralThreshold: "Electoral Threshold",
    voterGroups: "Demographic Voter Groups",
    holdRally: "Host Mass Rally",
    advertisement: "Media Campaign",
    openHeadquarters: "Build Regional HQ",
    groundCanvassing: "Grassroots Canvassing",
    voteDay: "Election Day",
    partyBudget: "Party Budget",
    partyMembers: "Registered Members",
    politicalInfluence: "Political Influence",

    ideologyNames: {
      'Social Democrat': 'Social Democrat',
      'Conservative': 'Conservative',
      'Nationalist': 'Nationalist',
      'Liberal': 'Liberal',
      'Socialist': 'Socialist',
      'Ecologist': 'Ecologist',
      'Centrist': 'Centrist',
      'Traditionalist': 'Traditionalist',
      'Communist': 'Communist',
      'Social Conservative': 'Social Conservative',
      'Progressive': 'Progressive',
      'Populist': 'Populist',
      'Monarchist': 'Monarchist',
      'Far Right': 'Far Right',
      'Far Left': 'Far Left',
      'Fascist': 'Fascist',
      'Alliance': 'Alliance'
    },

    voterGroupNames: {
      'Workers': 'Workers & Labor',
      'Youth': 'Youth & Students',
      'Nationalists': 'Nationalists',
      'Liberals': 'Urban Liberals',
      'Traditionalists': 'Traditionalists',
      'Shopkeepers': 'Merchants & Small Business'
    }
  },

  es: {
    appTitle: "Senderos al Poder",
    scenario: "Escenario",
    playableNations: "Naciones Jugables",
    campaignsSecured: "Campañas Ganadas",
    nationsWon: "Naciones Victoriosas",
    returnToMap: "Volver al Mapa Mundial",
    settings: "Ajustes del Juego",
    languages: "Idiomas",
    preferences: "Preferencias",
    soundEffects: "Efectos de Sonido",
    theme: "Tema de Interfaz",
    lightMode: "Modo Claro (Alto Contraste)",
    darkMode: "Modo Oscuro (Estrategia Inmersiva)",
    resetProgress: "Reiniciar Progreso",
    dangerZone: "Zona de Peligro",
    close: "Cerrar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    startCampaign: "Iniciar Campaña",
    viewCampaign: "Continuar Campaña",

    gameplayFlowMode: "Modo de Flujo de Juego",
    turnByTurn: "Por Turnos (Manual)",
    turnByTurnDesc: "Controla cada acción y avanza semanas manualmente a tu propio ritmo.",
    pausableRealtime: "Simulación con Pausa (Automático)",
    pausableRealtimeDesc: "Reloj de simulación automático con botón de pausa y 5 niveles de velocidad.",
    simulationSpeed: "Velocidad de Simulación",
    speedVerySlow: "1: Muy Lenta (10s / turno)",
    speedSlow: "2: Lenta (5s / turno)",
    speedNormal: "3: Normal (3s / turno)",
    speedFast: "4: Rápida (1.5s / turno)",
    speedVeryFast: "5: Muy Rápida (0.8s / turno)",
    pause: "Pausa",
    resume: "Reanudar",
    nextTurn: "Siguiente Semana",
    week: "Semana",
    month: "Mes",
    year: "Año",

    establishMovement: "FUNDAR NUEVO MOVIMIENTO",
    partyCharterName: "Nombre Oficial del Partido",
    founderLeader: "Presidente General / Fundador",
    partyColor: "Color Oficial del Partido",
    manifestoIdeology: "Ideología del Manifiesto",
    leaderPresets: "Plantillas de Líderes Nacionales",
    customLeader: "Líder Personalizado",
    designOwn: "Diseñar el Mío",
    launchCampaign: "Lanzar Campaña Política",

    ideologyDescriptions: {
      'Social Democrat': { desc: 'Justicia social, programas de bienestar, derechos laborales y sanidad pública.', focus: 'Aumenta apoyo de Trabajadores y Jóvenes.' },
      'Conservative': { desc: 'Prudencia fiscal, valores tradicionales, orden público y estabilidad económica.', focus: 'Aumenta apoyo de Tradicionalistas y Comerciantes.' },
      'Nationalist': { desc: 'Soberanía nacional, seguridad fronteriza e impulso de industrias nacionales.', focus: 'Aumenta apoyo de Nacionalistas y Tradicionalistas.' },
      'Liberal': { desc: 'Libertad individual, libre mercado, desregulación e innovación tecnológica.', focus: 'Aumenta apoyo de Liberales y Comerciantes.' },
      'Socialist': { desc: 'Control público de servicios esenciales, impuestos progresivos y equidad.', focus: 'Gran apoyo entre Trabajadores y Jóvenes.' },
      'Ecologist': { desc: 'Transición ecológica, energías renovables, acción climática y sostenibilidad.', focus: 'Gran atracción en Jóvenes y Liberales.' },
      'Centrist': { desc: 'Gobernanza pragmática, moderación institucional y reformas consensuadas.', focus: 'Apoyo transversal moderado en todos los sectores.' },
      'Traditionalist': { desc: 'Arraigo cultural, tradiciones locales, fe y orden social clásico.', focus: 'Dominante en zonas rurales tradicionales.' },
      'Communist': { desc: 'Economía planificada estatal, nacionalización total y control obrero.', focus: 'Apoyo masivo de Trabajadores sin apoyo empresarial.' },
      'Social Conservative': { desc: 'Familia, valores comunitarios, solidaridad cívica y ética social.', focus: 'Fuerte entre Tradicionalistas y pequeños negocios.' },
      'Progressive': { desc: 'Reformas sociales avanzadas, igualdad de derechos y modernización.', focus: 'Dominante en Jóvenes urbanos y Liberales.' },
      'Populist': { desc: 'Discurso popular contra las élites, referéndums y soberanía ciudadana.', focus: 'Alta resonancia con votantes desencantados.' },
      'Monarchist': { desc: 'Autoridad monárquica, legitimidad histórica y continuidad institucional.', focus: 'Atrae a tradicionalistas leales.' },
      'Far Right': { desc: 'Identidad radicalizada, soberanía estricta y autoridad estatal fuerte.', focus: 'Núcleo nacionalista radicalizado.' },
      'Far Left': { desc: 'Transformación radical, anticapitalismo y democracia en el lugar de trabajo.', focus: 'Base obrera y estudiantil combativa.' }
    },

    campaignHub: "Centro Estratégico de Campaña",
    parliamentBills: "Parlamento y Leyes",
    rulingCabinet: "Gabinete de Gobierno",
    nationalEconomy: "Índices Económicos y Tesoro",
    diplomacy: "Relaciones Exteriores",
    pollingAverages: "Promedios de Encuestas",
    seatsProjected: "Escaños Proyectados",
    electoralThreshold: "Umbral Electoral",
    voterGroups: "Grupos Demográficos de Votantes",
    holdRally: "Mitin Masivo",
    advertisement: "Campaña en Medios",
    openHeadquarters: "Abrir Sede Regional",
    groundCanvassing: "Campaña Puerta a Puerta",
    voteDay: "Día de Elecciones",
    partyBudget: "Presupuesto del Partido",
    partyMembers: "Miembros Afiliados",
    politicalInfluence: "Influencia Política",

    ideologyNames: {
      'Social Democrat': 'Socialdemócrata',
      'Conservative': 'Conservador',
      'Nationalist': 'Nacionalista',
      'Liberal': 'Liberal',
      'Socialist': 'Socialista',
      'Ecologist': 'Ecologista',
      'Centrist': 'Centrista',
      'Traditionalist': 'Tradicionalista',
      'Communist': 'Comunista',
      'Social Conservative': 'Conservador Social',
      'Progressive': 'Progresista',
      'Populist': 'Populista',
      'Monarchist': 'Monárquico',
      'Far Right': 'Extrema Derecha',
      'Far Left': 'Extrema Izquierda',
      'Fascist': 'Fascista',
      'Alliance': 'Alianza'
    },

    voterGroupNames: {
      'Workers': 'Trabajadores y Obreros',
      'Youth': 'Jóvenes y Estudiantes',
      'Nationalists': 'Nacionalistas',
      'Liberals': 'Liberales Urbanos',
      'Traditionalists': 'Tradicionalistas',
      'Shopkeepers': 'Comerciantes y Negocios'
    }
  },

  fr: {
    appTitle: "Voies vers le Pouvoir",
    scenario: "Scénario",
    playableNations: "Nations Jouables",
    campaignsSecured: "Campagnes Gagnées",
    nationsWon: "Nations Remportées",
    returnToMap: "Retour à la Carte du Monde",
    settings: "Paramètres du Jeu",
    languages: "Langues",
    preferences: "Préférences",
    soundEffects: "Effets Sonores",
    theme: "Thème d'Interface",
    lightMode: "Mode Clair (Contraste Élevé)",
    darkMode: "Mode Sombre (Stratégie Immersive)",
    resetProgress: "Réinitialiser la Progression",
    dangerZone: "Zone Critique",
    close: "Fermer",
    confirm: "Confirmer",
    cancel: "Annuler",
    startCampaign: "Lancer la Campagne",
    viewCampaign: "Continuer la Campagne",

    gameplayFlowMode: "Mode de Déroulement du Jeu",
    turnByTurn: "Tour par Tour (Manuel)",
    turnByTurnDesc: "Prenez le temps d'agir et avancez les semaines manuellement.",
    pausableRealtime: "Simulation avec Pause (Automatique)",
    pausableRealtimeDesc: "Horloge de simulation automatique avec pause et 5 vitesses réglables.",
    simulationSpeed: "Vitesse de Simulation",
    speedVerySlow: "1 : Très Lent (10s / tour)",
    speedSlow: "2 : Lent (5s / tour)",
    speedNormal: "3 : Normal (3s / tour)",
    speedFast: "4 : Rapide (1.5s / tour)",
    speedVeryFast: "5 : Très Rapide (0.8s / tour)",
    pause: "Pause",
    resume: "Reprendre",
    nextTurn: "Semaine Suivante",
    week: "Semaine",
    month: "Mois",
    year: "Année",

    establishMovement: "FONDER UN NOUVEAU MOUVEMENT",
    partyCharterName: "Nom Officiel du Parti",
    founderLeader: "Président Général / Fondateur",
    partyColor: "Couleur Officielle",
    manifestoIdeology: "Idéologie du Manifeste",
    leaderPresets: "Modèles de Dirigeants Nationaux",
    customLeader: "Dirigeant Personnalisé",
    designOwn: "Créer le Mien",
    launchCampaign: "Lancer la Campagne Politique",

    ideologyDescriptions: {
      'Social Democrat': { desc: 'Justice sociale, protection forte de l\'État, droits du travail et santé publique.', focus: 'Renforce le soutien des Travailleurs et des Jeunes.' },
      'Conservative': { desc: 'Prudence budgétaire, préservation des traditions, ordre public et stabilité.', focus: 'Renforce le soutien des Traditionalistes et des Commerçants.' },
      'Nationalist': { desc: 'Souveraineté nationale, sécurité des frontières et soutien à l\'industrie nationale.', focus: 'Renforce le soutien des Nationalistes et Traditionalistes.' },
      'Liberal': { desc: 'Liberté individuelle, libre marché, dérégulation et innovation numérique.', focus: 'Renforce le soutien des Libéraux et Commerçants.' },
      'Socialist': { desc: 'Contrôle public des infrastructures essentielles, impôts progressifs et égalité.', focus: 'Fort soutien parmi les Travailleurs et la Jeunesse.' },
      'Ecologist': { desc: 'Transition écologique, énergies propres, préservation de la nature et durabilité.', focus: 'Grand attrait auprès des Jeunes et des Libéraux.' },
      'Centrist': { desc: 'Gouvernance pragmatique, réformes institutionnelles et équilibre budgétaire.', focus: 'Soutien modéré réparti dans tous les groupes.' },
      'Traditionalist': { desc: 'Attachement au terroir, traditions locales, foi et valeurs coutumières.', focus: 'Dominant dans les régions rurales traditionnelles.' },
      'Communist': { desc: 'Économie planifiée d\'État, nationalisation intégrale et pouvoir ouvrier.', focus: 'Soutien ouvrier massif, rejet des commerçants.' },
      'Social Conservative': { desc: 'Valeurs familiales, solidarité civique et cohésion sociale.', focus: 'Fort chez les Traditionalistes et petits commerces.' },
      'Progressive': { desc: 'Réformes sociales rapides, égalité des droits et modernité.', focus: 'Dominant chez les Jeunes urbains et Libéraux.' },
      'Populist': { desc: 'Discours populaire contre les élites et démocratie directe.', focus: 'Forte adhésion des électeurs ouvriers déçus.' },
      'Monarchist': { desc: 'Autorité royale, légitimité historique et continuité de l\'État.', focus: 'Séduit les traditionalistes fidèles.' },
      'Far Right': { desc: 'Identité stricte, anti-immigration résolue et autorité renforcée de l\'État.', focus: 'Noyau nationaliste radicalisé.' },
      'Far Left': { desc: 'Transformation sociale profonde, anticapitalisme et autogestion ouvrière.', focus: 'Base militante ouvrière et étudiante.' }
    },

    campaignHub: "QG Stratégique de Campagne",
    parliamentBills: "Parlement et Projets de Lois",
    rulingCabinet: "Conseil des Ministres",
    nationalEconomy: "Indicateurs Économiques et Trésor",
    diplomacy: "Affaires Étrangères",
    pollingAverages: "Moyennes des Sondages",
    seatsProjected: "Sièges Projetés",
    electoralThreshold: "Seuil Électoral",
    voterGroups: "Groupes Sociodémographiques",
    holdRally: "Grand Meeting Populaire",
    advertisement: "Campagne Médiatique",
    openHeadquarters: "Ouvrir une Antenne Locale",
    groundCanvassing: "Porte-à-Porte Électoral",
    voteDay: "Jour du Scrutin",
    partyBudget: "Budget du Parti",
    partyMembers: "Adhérents Enregistrés",
    politicalInfluence: "Influence Politique",

    ideologyNames: {
      'Social Democrat': 'Social-Démocrate',
      'Conservative': 'Conservateur',
      'Nationalist': 'Nationaliste',
      'Liberal': 'Libéral',
      'Socialist': 'Socialiste',
      'Ecologist': 'Écologiste',
      'Centrist': 'Centriste',
      'Traditionalist': 'Traditionaliste',
      'Communist': 'Communiste',
      'Social Conservative': 'Conservateur Social',
      'Progressive': 'Progressiste',
      'Populist': 'Populiste',
      'Monarchist': 'Monarchiste',
      'Far Right': 'Extrême Droite',
      'Far Left': 'Extrême Gauche',
      'Fascist': 'Fasciste',
      'Alliance': 'Alliance'
    },

    voterGroupNames: {
      'Workers': 'Travailleurs et Ouvriers',
      'Youth': 'Jeunesse et Étudiants',
      'Nationalists': 'Nationalistes',
      'Liberals': 'Libéraux Urbains',
      'Traditionalists': 'Traditionalistes',
      'Shopkeepers': 'Commerçants et Artisans'
    }
  },

  de: {
    appTitle: "Pfade zur Macht",
    scenario: "Szenario",
    playableNations: "Spielbare Nationen",
    campaignsSecured: "Gewonnene Kampagnen",
    nationsWon: "Siegreiche Staaten",
    returnToMap: "Zurück zur Weltkarte",
    settings: "Spieleinstellungen",
    languages: "Sprachen",
    preferences: "Präferenzen",
    soundEffects: "Soundeffekte",
    theme: "Oberflächendesign",
    lightMode: "Heller Modus (Hoher Kontrast)",
    darkMode: "Dunkler Modus (Immersive Strategie)",
    resetProgress: "Spielfortschritt Zurücksetzen",
    dangerZone: "Gefahrenzone",
    close: "Schließen",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    startCampaign: "Wahlkampf Starten",
    viewCampaign: "Wahlkampf Fortsetzen",

    gameplayFlowMode: "Spielablauf-Modus",
    turnByTurn: "Rundenbasiert (Manuell)",
    turnByTurnDesc: "Jede Woche und Wahlkampfaktion manuell im eigenen Tempo durchführen.",
    pausableRealtime: "Pausierbare Simulation (Automatisch)",
    pausableRealtimeDesc: "Automatische Simulationsuhr mit Pausenfunktion und 5 Tempomodi.",
    simulationSpeed: "Simulationsgeschwindigkeit",
    speedVerySlow: "1: Sehr Langsam (10s / Runde)",
    speedSlow: "2: Langsam (5s / Runde)",
    speedNormal: "3: Normal (3s / Runde)",
    speedFast: "4: Schnell (1.5s / Runde)",
    speedVeryFast: "5: Sehr Schnell (0.8s / Runde)",
    pause: "Pause",
    resume: "Fortsetzen",
    nextTurn: "Nächste Woche",
    week: "Woche",
    month: "Monat",
    year: "Jahr",

    establishMovement: "NEUE BEWEGUNG GRÜNDEN",
    partyCharterName: "Offizieller Parteiname",
    founderLeader: "Vorsitzender / Parteigründer",
    partyColor: "Offizielle Parteifarbe",
    manifestoIdeology: "Parteimanifest-Ideologie",
    leaderPresets: "Nationale Spitzenkandidaten",
    customLeader: "Eigener Kandidat",
    designOwn: "Eigenen Entwerfen",
    launchCampaign: "Wahlkampagne Starten",

    ideologyDescriptions: {
      'Social Democrat': { desc: 'Soziale Gerechtigkeit, Wohlfahrtsstaat, Arbeitnehmerrechte und Gesundheit.', focus: 'Stärkt Arbeiter und Jugend.' },
      'Conservative': { desc: 'Finanzielle Solidität, Wertebewahrung, öffentliche Ordnung und Stabilität.', focus: 'Stärkt Traditionalisten und Kaufleute.' },
      'Nationalist': { desc: 'Nationale Souveränität, Grenzsicherheit und heimische Industriepolitik.', focus: 'Stärkt Nationalisten und Traditionalisten.' },
      'Liberal': { desc: 'Individuelle Freiheit, freie Marktwirtschaft, Deregulierung und Innovation.', focus: 'Stärkt Liberale und Kaufleute.' },
      'Socialist': { desc: 'Vergesellschaftung der Daseinsvorsorge, Vermögensabgaben und Arbeiterdemokratie.', focus: 'Großer Rückhalt bei Arbeitern und Jugend.' },
      'Ecologist': { desc: 'Energiewende, Klimaschutz, Ressourcenschonung und Nachhaltigkeit.', focus: 'Sehr beliebt bei Jugend und Liberalen.' },
      'Centrist': { desc: 'Pragmatische Mitte, Reformkompromisse und ausgeglichener Haushalt.', focus: 'Breite moderate Zustimmung aller Schichten.' },
      'Traditionalist': { desc: 'Heimatverbundenheit, Brauchtum, christliche Werte und ländliche Identität.', focus: 'Dominant in ländlichen Regionen.' },
      'Communist': { desc: 'Staatliche Planwirtschaft, Verstaatlichung und Räteorganisation.', focus: 'Massiver Arbeiterzuspruch, Ablehnung bei Händlern.' },
      'Social Conservative': { desc: 'Familienförderung, bürgerschaftliche Solidarität und ethische Gemeinschaft.', focus: 'Stark bei Traditionalisten und Mittelstand.' },
      'Progressive': { desc: 'Gesellschaftlicher Wandel, Bürgerrechte und moderne Technologien.', focus: 'Führend bei städtischer Jugend und Liberalen.' },
      'Populist': { desc: 'Bürgernahe Politik gegen das Establishment und Volksabstimmungen.', focus: 'Starke Anziehungskraft bei unzufriedenen Wählern.' },
      'Monarchist': { desc: 'Monarchische Kontinuität, historische Würde und verfassungsrechtliche Krone.', focus: 'Spricht geschichtsbewusste Traditionalisten an.' },
      'Far Right': { desc: 'Radikale Identitätspolitik, strenge Grenzen und harter Sicherheitsstaat.', focus: 'Radikaler nationalistischer Kern.' },
      'Far Left': { desc: 'Radikale Umverteilung, Antikapitalismus und betriebliche Selbstverwaltung.', focus: 'Kämpferische Arbeiter- und Studierendenbasis.' }
    },

    campaignHub: "Wahlkampf-Kommandozentrale",
    parliamentBills: "Parlament & Gesetzgebung",
    rulingCabinet: "Regierungskabinett",
    nationalEconomy: "Wirtschaftsindikatoren & Staatskasse",
    diplomacy: "Außenpolitik & Abkommen",
    pollingAverages: "Umfragedurchschnitt",
    seatsProjected: "Prognostizierte Sitze",
    electoralThreshold: "Sperrklausel (Hürde)",
    voterGroups: "Demografische Wählergruppen",
    holdRally: "Großkundgebung Abhalten",
    advertisement: "Medienkampagne",
    openHeadquarters: "Regionalbüro Eröffnen",
    groundCanvassing: "Haustür-Wahlkampf",
    voteDay: "Wahltag",
    partyBudget: "Parteibudget",
    partyMembers: "Eingetragene Mitglieder",
    politicalInfluence: "Politischer Einfluss",

    ideologyNames: {
      'Social Democrat': 'Sozialdemokratisch',
      'Conservative': 'Konservativ',
      'Nationalist': 'Nationalistisch',
      'Liberal': 'Liberal',
      'Socialist': 'Sozialistisch',
      'Ecologist': 'Ökologisch (Grün)',
      'Centrist': 'Zentristisch',
      'Traditionalist': 'Traditionalistisch',
      'Communist': 'Kommunistisch',
      'Social Conservative': 'Sozialkonservativ',
      'Progressive': 'Progressiv',
      'Populist': 'Populistisch',
      'Monarchist': 'Monarchistisch',
      'Far Right': 'Rechtsaußen',
      'Far Left': 'Linksaußen',
      'Fascist': 'Faschistisch',
      'Alliance': 'Bündnis'
    },

    voterGroupNames: {
      'Workers': 'Arbeiterschaft & Gewerkschaften',
      'Youth': 'Jugend & Studierende',
      'Nationalists': 'Nationalgesinnte',
      'Liberals': 'Städtische Liberale',
      'Traditionalists': 'Traditionalisten & Landbevölkerung',
      'Shopkeepers': 'Mittelstand & Gewerbetreibende'
    }
  },

  tr: {
    appTitle: "İktidar Yolları",
    scenario: "Senaryo",
    playableNations: "Oynanabilir Ülkeler",
    campaignsSecured: "Kazanılan Seçimler",
    nationsWon: "Kazanılan Ülkeler",
    returnToMap: "Dünya Haritasına Dön",
    settings: "Oyun Ayarları",
    languages: "Diller",
    preferences: "Tercihler",
    soundEffects: "Ses Efektleri",
    theme: "Arayüz Teması",
    lightMode: "Açık Tema (Yüksek Kontrast)",
    darkMode: "Karanlık Tema (Strateji Modu)",
    resetProgress: "İlerlemeyi Sıfırla",
    dangerZone: "Tehlikeli Bölge",
    close: "Kapat",
    confirm: "Onayla",
    cancel: "İptal",
    startCampaign: "Seçim Kampanyasını Başlat",
    viewCampaign: "Kampanyaya Devam Et",

    gameplayFlowMode: "Oyun İlerleme Modu",
    turnByTurn: "Tur Atlayarak Oyna (Manuel)",
    turnByTurnDesc: "Her hamleyi ve haftayı kendi kontrolünüzde manuel olarak ilerletin.",
    pausableRealtime: "Durdurmalı Oyna (Otomatik Simülasyon)",
    pausableRealtimeDesc: "Durdurulup başlatılabilen ve 5 hız kademesine sahip otomatik simülasyon akışı.",
    simulationSpeed: "Simülasyon Hızı",
    speedVerySlow: "1: Çok Yavaş (10 sn / tur)",
    speedSlow: "2: Yavaş (5 sn / tur)",
    speedNormal: "3: Normal (3 sn / tur)",
    speedFast: "4: Hızlı (1.5 sn / tur)",
    speedVeryFast: "5: Çok Hızlı (0.8 sn / tur)",
    pause: "Durdur",
    resume: "Devam Et",
    nextTurn: "Sonraki Hafta",
    week: "Hafta",
    month: "Ay",
    year: "Yıl",

    establishMovement: "YENİ SİYASİ HAREKET KUR",
    partyCharterName: "Parti Resmi Tüzük Adı",
    founderLeader: "Genel Başkan / Kurucu Lider",
    partyColor: "Resmi Parti Rengi",
    manifestoIdeology: "Seçim Beyannamesi İdeolojisi",
    leaderPresets: "Mevcut Ulusal Lider Şablonları",
    customLeader: "Özel Lider Oluştur",
    designOwn: "Kendi Liderimi Tasarla",
    launchCampaign: "Siyasi Kampanyayı Başlat",

    ideologyDescriptions: {
      'Social Democrat': { desc: 'Sosyal adalet, güçlü kamusal destekler, emek hakları ve kapsayıcı sağlık sistemi.', focus: 'İşçi ve Genç seçmen tabanında yüksek destek sağlar.' },
      'Conservative': { desc: 'Mali disiplin, kültürel mirasın korunması, kamu düzeni ve piyasa istikrarı.', focus: 'Gelenekçi ve Esnaf seçmenlerde güçlü destek sağlar.' },
      'Nationalist': { desc: 'Milli egemenlik, sınır güvenliği, yerli sanayi ve bağımsız dış politika.', focus: 'Milliyetçi ve Gelenekçi kesimlerde yüksek oy getirir.' },
      'Liberal': { desc: 'Bireysel özgürlükler, serbest piyasa ekonomisi, dijitalleşme ve bürokratik sadeleşme.', focus: 'Liberal ve Esnaf seçmenlerde etkilidir.' },
      'Socialist': { desc: 'Stratejik kamu yatırımları, gelir adaleti, emekçi hakları ve tabandan yönetim.', focus: 'İşçi ve Gençlik kitlelerinde büyük taban oluşturur.' },
      'Ecologist': { desc: 'Yeşil enerji dönüşümü, çevre koruma, karbon tasarrufu ve sürdürülebilirlik.', focus: 'Genç ve Liberal seçmenlerde güçlü karşılık bulur.' },
      'Centrist': { desc: 'Kutuplaşmadan uzak, uzlaşmacı yönetim, dengeli bütçe ve kurumsal reformlar.', focus: 'Tüm kesimlerde dengeli ve ılımlı destek toplar.' },
      'Traditionalist': { desc: 'Köklü gelenekler, manevi değerler, yerel kültür ve toplumsal ahlak.', focus: 'Kırsal ve dindar muhafazakar seçmende hakimdir.' },
      'Communist': { desc: 'Planlı kamucu ekonomi, tam kamulaştırma ve işçi konseyleri yönetimi.', focus: 'Emekçi kitlelerde yoğun destek, sermayede sıfır oy.' },
      'Social Conservative': { desc: 'Aile yapısının korunması, dayanışma, ahlaki kalkınma ve sosyal yardımlar.', focus: 'Gelenekçi ve esnaf çevrelerinde yüksek kabul görür.' },
      'Progressive': { desc: 'Hızlı toplumsal yenilikler, yurttaş hakları, bilimsel ve teknolojik atılım.', focus: 'Şehirli Gençlik ve Liberal kitlelerde etkilidir.' },
      'Populist': { desc: 'Vatandaşın doğrudan sesi, elit karşıtı söylem ve halk referandumları.', focus: 'Mevcut siyasete tepkili geniş halk tabanında karşılık bulur.' },
      'Monarchist': { desc: 'Tarihi devlet geleneği, kurumların devamlılığı ve meşru liderlik otoritesi.', focus: 'Tarihine bağlı geleneksel seçmene hitap eder.' },
      'Far Right': { desc: 'Sert milli kimlik, radikal sınır politikaları ve ödünsüz devlet otoritesi.', focus: 'Radikal milliyetçi çekirdek seçmende etkilidir.' },
      'Far Left': { desc: 'Radikal yeniden dağıtım, antikapitalist dönüşüm ve emekçi iktidarı.', focus: 'Mücadeleci işçi ve öğrenci tabanını harekete geçirir.' }
    },

    campaignHub: "Seçim Karargahı",
    parliamentBills: "Meclis ve Yasa Tasarıları",
    rulingCabinet: "Bakanlar Kurulu (Kabine)",
    nationalEconomy: "Ekonomik Göstergeler & Hazine",
    diplomacy: "Dış Politika ve Antlaşmalar",
    pollingAverages: "Anket Ortalamaları",
    seatsProjected: "Tahmini Milletvekili Sayısı",
    electoralThreshold: "Seçim Barajı",
    voterGroups: "Demografik Seçmen Grupları",
    holdRally: "Miting Düzenle",
    advertisement: "Medya Kampanyası",
    openHeadquarters: "İlçe Teşkilatı Aç",
    groundCanvassing: "Kapı Kapı Saha Çalışması",
    voteDay: "Seçim Günü",
    partyBudget: "Parti Bütçesi",
    partyMembers: "Kayıtlı Üye Sayısı",
    politicalInfluence: "Siyasi Nüfuz",

    ideologyNames: {
      'Social Democrat': 'Sosyal Demokrat',
      'Conservative': 'Muhafazakar',
      'Nationalist': 'Milliyetçi',
      'Liberal': 'Liberal',
      'Socialist': 'Sosyalist',
      'Ecologist': 'Çevreci (Yeşil)',
      'Centrist': 'Merkez',
      'Traditionalist': 'Gelenekçi',
      'Communist': 'Komünist',
      'Social Conservative': 'Sosyal Muhafazakar',
      'Progressive': 'İlerici (Progresif)',
      'Populist': 'Popülist',
      'Monarchist': 'Monarşist',
      'Far Right': 'Aşırı Sağ',
      'Far Left': 'Aşırı Sol',
      'Fascist': 'Faşist',
      'Alliance': 'İttifak'
    },

    voterGroupNames: {
      'Workers': 'İşçiler ve Emekçiler',
      'Youth': 'Gençler ve Öğrenciler',
      'Nationalists': 'Milliyetçiler',
      'Liberals': 'Şehirli Liberaller',
      'Traditionalists': 'Gelenekçiler ve Dindarlar',
      'Shopkeepers': 'Esnaf ve KOBİ\'ler'
    }
  }
};
