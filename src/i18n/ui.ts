/**
 * Arayüz metinleri sözlüğü (5 dil): useUi() ile kullanılır. Eksik anahtar İngilizceye düşer.
 */
import { useLanguage } from './LanguageContext';
import type { SupportedLanguage } from './translations';

type Entry = Record<SupportedLanguage, string>;
const E = (en: string, es: string, fr: string, de: string, tr: string): Entry => ({ en, es, fr, de, tr });

export const UI: Record<string, Entry> = {
  // Zaman akışı
  realTimeFlow: E('Real-Time Flow', 'Tiempo real', 'Temps réel', 'Echtzeit-Ablauf', 'Gerçek Zamanlı Akış'),
  startTime: E('Start Time Flow', 'Iniciar tiempo', 'Lancer le temps', 'Zeit starten', 'Zamanı Başlat'),
  pauseTime: E('Pause Time', 'Pausar tiempo', 'Mettre en pause', 'Zeit anhalten', 'Zamanı Durdur'),
  week: E('Week', 'Semana', 'Semaine', 'Woche', 'Hafta'),
  month: E('Month', 'Mes', 'Mois', 'Monat', 'Ay'),
  // İsyan
  launchUprising: E('Launch Uprising', 'Iniciar levantamiento', 'Déclencher un soulèvement', 'Aufstand starten', 'İsyan Başlat'),
  uprisingHint: E('No free elections here: seize power by revolt', 'Sin elecciones libres: toma el poder por la revuelta', 'Pas d\'élections libres : prenez le pouvoir par la révolte', 'Keine freien Wahlen: Macht durch Aufstand', 'Burada serbest seçim yok: iktidarı isyanla alın'),
  // Komşu hükümetler / olaylar
  neighborGovs: E('Neighbor Governments', 'Gobiernos vecinos', 'Gouvernements voisins', 'Nachbarregierungen', 'Komşu Hükümetler'),
  newGovernment: E('New government', 'Nuevo gobierno', 'Nouveau gouvernement', 'Neue Regierung', 'Yeni hükümet'),
  governmentContinues: E('Government continues', 'El gobierno continúa', 'Le gouvernement continue', 'Regierung bleibt im Amt', 'Hükümet devam ediyor'),
  ideology: E('Ideology', 'Ideología', 'Idéologie', 'Ideologie', 'İdeoloji'),
  voteShare: E('Vote share', 'Porcentaje de voto', 'Part des voix', 'Stimmenanteil', 'Oy oranı'),
  leader: E('Leader', 'Líder', 'Dirigeant', 'Führung', 'Lider'),
  election: E('Election', 'Elección', 'Élection', 'Wahl', 'Seçim'),
  simulatedTag: E('Simulated', 'Simulado', 'Simulé', 'Simuliert', 'Simüle'),
  noData: E('n/a', 'n/d', 'n/d', 'k. A.', 'yok'),
  unverifiedTag: E('Unverified', 'Sin verificar', 'Non vérifié', 'Unbestätigt', 'Doğrulanmamış'),
  unverifiedHint: E('Result not officially certified (media-reported)', 'Resultado no certificado oficialmente (según medios)', 'Résultat non certifié officiellement (selon les médias)', 'Ergebnis nicht amtlich bestätigt (laut Medien)', 'Resmî olarak onaylanmamış sonuç (basın kaynaklı)'),
  noElectionsYet: E('No neighbor elections yet', 'Aún no hay elecciones vecinas', 'Pas encore d\'élections voisines', 'Noch keine Nachbarwahlen', 'Henüz komşu seçimi yok'),
  // Başlangıç ekranı ve genel
  settings: E('Settings', 'Ajustes', 'Paramètres', 'Einstellungen', 'Ayarlar'),
  languages: E('Languages', 'Idiomas', 'Langues', 'Sprachen', 'Diller'),
  playWord: E('Play', 'Jugar', 'Jouer', 'Spielen', 'Oyna'),
  play: E('PLAY', 'JUGAR', 'JOUER', 'SPIELEN', 'OYNA'),
  howToPlay: E('How to Play', 'Cómo jugar', 'Comment jouer', 'Spielanleitung', 'Nasıl Oynanır'),
  mainMenu: E('Main Menu', 'Menú principal', 'Menu principal', 'Hauptmenü', 'Ana Menü'),
  readyToSimulate: E('Ready to Simulate', 'Listo para simular', 'Prêt à simuler', 'Bereit zur Simulation', 'Simülasyona Hazır'),
  // Panel sekmeleri
  tabCampaign: E('Campaign', 'Campaña', 'Campagne', 'Wahlkampf', 'Kampanya'),
  tabParliament: E('Parliament', 'Parlamento', 'Parlement', 'Parlament', 'Parlamento'),
  tabCongress: E('Congress', 'Congreso', 'Congrès', 'Kongress', 'Kongre'),
  tabDiplomacy: E('Diplomacy', 'Diplomacia', 'Diplomatie', 'Diplomatie', 'Diplomasi'),
  tabFinance: E('Finance', 'Finanzas', 'Finances', 'Finanzen', 'Finans'),
  tabWarFrontline: E('War Frontline', 'Frente de guerra', 'Ligne de front', 'Kriegsfront', 'Savaş Cephesi'),
  dayNightCycle: E('Day / Night cycle', 'Ciclo día/noche', 'Cycle jour/nuit', 'Tag-/Nachtzyklus', 'Gece / Gündüz döngüsü'),
  eventReceivedOpen: E('Click to open', 'Haz clic para abrir', 'Cliquer pour ouvrir', 'Zum Öffnen klicken', 'Açmak için tıklayın'),
  timePaused: E('Time is paused', 'El tiempo está en pausa', 'Le temps est en pause', 'Zeit ist angehalten', 'Zaman durdu'),
  timeRunning: E('Time is running', 'El tiempo corre', 'Le temps s\'écoule', 'Zeit läuft', 'Zaman akıyor'),
  // Olay bildirimi
  close: E('Close', 'Cerrar', 'Fermer', 'Schließen', 'Kapat'),
};

export function useUi() {
  const { language } = useLanguage();
  return (key: string): string => UI[key]?.[language] || UI[key]?.en || key;
}
