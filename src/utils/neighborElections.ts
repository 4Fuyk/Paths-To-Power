/**
 * Komşu ülkelerdeki seçimler: gerçek seçim günlerinde (oyun tarihi o güne gelince) sonuç olayı üretir.
 */
import { COUNTRY_NEIGHBORS } from '../data/countryNeighbors';
import { ELECTIONS_2026, Election2026, GovInfo, GovResult } from '../data/elections2026';

export interface GovChangeEvent {
  id: string;
  iso: string;
  country: string;
  flag: string;
  date: string;
  kind: string;
  before: GovInfo;
  after: GovResult;
  changed: boolean;
  simulated: boolean;
  note?: string;
}

const ISO3_TO_2: Record<string, string> = { TUR: 'TR', DEU: 'DE', FRA: 'FR', USA: 'US', RUS: 'RU', GBR: 'GB', ITA: 'IT', ESP: 'ES', GRC: 'GR', BRA: 'BR', ARG: 'AR', JPN: 'JP', KOR: 'KR', CHN: 'CN', IND: 'IN' };
const norm = (id: string) => (id.length === 3 ? ISO3_TO_2[id.toUpperCase()] || id : id).toUpperCase();

/** Bu ülkenin komşularında 2026'da yapılacak/yapılmış seçimler (tarih sırasıyla). */
export function neighborElectionsFor(countryId: string): Election2026[] {
  const nb = COUNTRY_NEIGHBORS[norm(countryId)] || [];
  return ELECTIONS_2026.filter(e => nb.includes(e.iso)).sort((a, b) => a.date.localeCompare(b.date));
}

/** Seçimi sonuçlandırır: gerçek sonuç varsa onu, yoksa olasılığa göre simülasyon. */
export function resolveElection(e: Election2026): GovChangeEvent {
  let after: GovResult, changed = e.changed, simulated = false;
  if (e.after) after = e.after;
  else {
    simulated = true;
    const opts = e.simulated || [];
    let r = Math.random() * opts.reduce((s, o) => s + o.p, 0);
    let pick = opts[opts.length - 1];
    for (const o of opts) { if ((r -= o.p) <= 0) { pick = o; break; } }
    const { p, ...res } = pick; void p;
    after = res;
    changed = res.leader !== e.before.leader;
  }
  return { id: e.id, iso: e.iso, country: e.country, flag: e.flag, date: e.date, kind: e.kind, before: e.before, after, changed, simulated, note: e.note };
}

/** Oyun tarihi (kampanya: haftalık, yönetim: aylık) */
export function gameDateOf(baseYear: number, isRuling: boolean, campaignTurn: number, rulingMonths: number): Date {
  if (isRuling) return new Date(baseYear + Math.floor(rulingMonths / 12), rulingMonths % 12, 1);
  const d = new Date(baseYear, 0, 10);
  d.setDate(d.getDate() + (campaignTurn - 1) * 7);
  return d;
}
