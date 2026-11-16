/**
 * 2026 seçim takvimi (gerçek tarihler) ve sonuçları.
 * Sonuçlar, seçimin gerçek haber/resmî kaynaklarından doğrulanmıştır (Şubat-Ekim 2026; kaynaklar 12 Kasım 2026'da yeniden kontrol edildi).
 * voteShare: null ise kaynaklarda net oran doğrulanamadı (arayüzde "n/a" gösterilir).
 * simulated: yalnızca sonucu henüz belli olmayan ileri tarihli seçimler için kullanılır; şu an hiçbir kayıtta kullanılmıyor.
 */
export interface GovInfo { party: string; leader: string; ideology: string; }
export interface GovResult extends GovInfo { voteShare: number | null; }
export interface SimOption extends GovResult { p: number; }

export interface Election2026 {
  id: string;
  iso: string;            // ISO-3166 alpha-2
  country: string;
  flag: string;
  date: string;           // YYYY-MM-DD (gerçek seçim günü)
  kind: string;
  before: GovInfo;
  after?: GovResult;      // gerçek sonuç
  changed: boolean;       // hükümet/devlet başkanı değişti mi
  note?: string;
  simulated?: SimOption[]; // sonuç henüz belli değil
}

export const ELECTIONS_2026: Election2026[] = [
  {
    id: 'PT_PRES_2026', iso: 'PT', country: 'Portugal', flag: '🇵🇹', date: '2026-02-08', kind: 'Presidential runoff',
    before: { party: 'Independent (PSD background)', leader: 'Marcelo Rebelo de Sousa', ideology: 'Centre-right' },
    after: { party: 'Socialist Party (PS)', leader: 'António José Seguro', ideology: 'Centre-left / Social democracy', voteShare: 66.84 },
    changed: true, note: 'Seguro beat the far-right Chega candidate André Ventura in the runoff with 66.84% (final result).'
  },
  {
    id: 'DK_GEN_2026', iso: 'DK', country: 'Denmark', flag: '🇩🇰', date: '2026-03-24', kind: 'Snap general election',
    before: { party: 'Social Democrats-led coalition', leader: 'Mette Frederiksen', ideology: 'Centre-left (left-right coalition)' },
    after: { party: 'Social Democrats', leader: 'Mette Frederiksen', ideology: 'Centre-left / Social democracy', voteShare: 21.8 },
    changed: false, note: 'Worst Social Democrat result since 1903, no bloc majority; after 69 days of talks Frederiksen formed a centre-left minority government (Social Democrats, Social Liberals, Green Left, Moderates) on 1 June.'
  },
  {
    id: 'HU_GEN_2026', iso: 'HU', country: 'Hungary', flag: '🇭🇺', date: '2026-04-12', kind: 'Parliamentary election',
    before: { party: 'Fidesz-KDNP', leader: 'Viktor Orbán', ideology: 'National conservatism / Right-wing populism' },
    after: { party: 'Tisza Party', leader: 'Péter Magyar', ideology: 'Centre-right, pro-European', voteShare: 53.2 },
    changed: true, note: 'Tisza won a two-thirds majority, ending 16 years of Orbán rule.'
  },
  {
    id: 'BG_GEN_2026', iso: 'BG', country: 'Bulgaria', flag: '🇧🇬', date: '2026-04-19', kind: 'Snap parliamentary election',
    before: { party: 'GERB-led coalition (resigned Dec 2025)', leader: 'Rosen Zhelyazkov', ideology: 'Centre-right' },
    after: { party: 'Progressive Bulgaria', leader: 'Rumen Radev', ideology: 'Centre-left / Left-populism', voteShare: 44.6 },
    changed: true, note: 'Eighth election since 2021; Radev\'s coalition won enough seats to govern alone.'
  },
  {
    id: 'PE_PRES_2026', iso: 'PE', country: 'Peru', flag: '🇵🇪', date: '2026-06-07', kind: 'Presidential runoff',
    before: { party: 'Interim administration', leader: 'Interim president', ideology: 'Technocratic / Independent' },
    after: { party: 'Fuerza Popular', leader: 'Keiko Fujimori', ideology: 'Right-wing populism / Conservatism', voteShare: 50.1 },
    changed: true, note: 'Fujimori won the runoff with 50.135% vs Roberto Sánchez 49.865% (about 49,600 votes); Sánchez contested the result.'
  },
  {
    id: 'AM_GEN_2026', iso: 'AM', country: 'Armenia', flag: '🇦🇲', date: '2026-06-07', kind: 'Parliamentary election',
    before: { party: 'Civil Contract', leader: 'Nikol Pashinyan', ideology: 'Liberal / Pro-Western centrism' },
    after: { party: 'Civil Contract', leader: 'Nikol Pashinyan', ideology: 'Liberal / Pro-Western centrism', voteShare: 49.7 },
    changed: false, note: 'Civil Contract kept power and can govern alone (64 of 105 seats).'
  },
  {
    id: 'CO_PRES_2026', iso: 'CO', country: 'Colombia', flag: '🇨🇴', date: '2026-06-21', kind: 'Presidential runoff',
    before: { party: 'Historic Pact', leader: 'Gustavo Petro', ideology: 'Left-wing / Progressive' },
    after: { party: 'Defenders of the Motherland', leader: 'Abelardo De La Espriella', ideology: 'Right-wing', voteShare: 49.7 },
    changed: true, note: 'Narrow runoff win over Iván Cepeda (49.66% vs 48.70%); Cepeda conceded on 24 June.'
  },
  {
    id: 'SE_GEN_2026', iso: 'SE', country: 'Sweden', flag: '🇸🇪', date: '2026-09-13', kind: 'General election',
    before: { party: 'Moderate Party-led government', leader: 'Ulf Kristersson', ideology: 'Liberal conservatism / Centre-right' },
    after: { party: 'Social Democrats', leader: 'Magdalena Andersson', ideology: 'Centre-left / Social democracy', voteShare: 28.02 },
    changed: true, note: 'The centre-left opposition won 176 of 349 seats in the final count; Kristersson announced his resignation.'
  },
  {
    id: 'BR_R1_2026', iso: 'BR', country: 'Brazil', flag: '🇧🇷', date: '2026-10-04', kind: 'Presidential first round',
    before: { party: 'Workers\' Party (PT)', leader: 'Luiz Inácio Lula da Silva', ideology: 'Centre-left / Left' },
    after: { party: 'Workers\' Party (PT)', leader: 'Luiz Inácio Lula da Silva', ideology: 'Centre-left / Left', voteShare: 45.2 },
    changed: false, note: 'First round: challenger Flávio Bolsonaro (PL) led with 47.03% vs Lula 45.16%; runoff on 25 October.'
  },
  {
    id: 'BR_R2_2026', iso: 'BR', country: 'Brazil', flag: '🇧🇷', date: '2026-10-25', kind: 'Presidential runoff',
    before: { party: 'Workers\' Party (PT)', leader: 'Luiz Inácio Lula da Silva', ideology: 'Centre-left / Left' },
    after: { party: 'Workers\' Party (PT)', leader: 'Luiz Inácio Lula da Silva', ideology: 'Centre-left / Left', voteShare: 51.8 },
    changed: false, note: 'Lula won a fourth term, beating Flávio Bolsonaro (PL) 51.79% to 48.21% (TSE, 100% counted); Bolsonaro refused to accept the result.'
  }
];
