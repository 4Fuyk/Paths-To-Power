/**
 * Canlı savaş haritası: oyuncunun doğrudan yönetmediği aktif savaşlarda cepheler zamanla kendiliğinden değişir.
 * Her çağrıda (hafta/ay) olasılıkla bir cephe bölgesi el değiştirir; sonuç kalıcı bölge-kontrol haritasına yazılır,
 * böylece savaş haritaları (WarFrontlineMap vb.) canlı güncellenir.
 *  - 2026: Rusya-Ukrayna (yavaş Rus ilerleyişi), Sudan, Myanmar, Yemen, Libya
 *  - 1950: Kore Savaşı (Haziran-Eylül KP ilerleyişi, Inchon sonrası BM karşı saldırısı, Ekim sonu Çin müdahalesi ve geri çekilme, 1951'de durgunluk)
 */
import { getTheaterRegions, PREDEFINED_CIVIL_WAR_THEATERS, TheaterRegion } from './warTheaterEngine';
import { getTerritoryControlMap, setRegionController } from './territorialControl';

export interface LiveWarUpdate { warKey: string; title: string; body: string; date: string; }

/** [oyunun o tarihte favori tarafı, favori taraf avantajı] */
function koreaBias(iso: string): { favored: 'KP' | 'KR'; p: number } {
  if (iso < '1950-09-15') return { favored: 'KP', p: 0.8 };      // Pusan Çevresi'ne kadar KP ilerleyişi
  if (iso < '1950-10-19') return { favored: 'KR', p: 0.8 };      // Inchon çıkarması ve BM karşı saldırısı
  if (iso < '1951-01-25') return { favored: 'KP', p: 0.75 };     // Çin Gönüllüleri müdahalesi
  return { favored: 'KR', p: 0.55 };                              // cephe durgunlaşır
}

function flipOne(regions: TheaterRegion[], favoredId: string, p: number, label: string): { region: TheaterRegion; from: string; to: string } | null {
  const ctl = getTerritoryControlMap();
  const owner = (r: TheaterRegion) => ctl[r.id] || r.controllerId;
  const sides = Array.from(new Set(regions.map(owner))).filter(Boolean);
  if (sides.length < 2) return null;
  const other = sides.find(s => s !== favoredId) || sides[0];
  // favori taraf mı kazanır, rakip mi (olasılığa göre)
  const gainer = Math.random() < p ? favoredId : other;
  const loser = gainer === favoredId ? other : favoredId;
  const byId = new Map(regions.map(r => [r.id, r] as const));
  // kazananın komşusu olan, kaybedenin elindeki bölgeler (cephe hattı)
  const frontier = regions.filter(r => owner(r) === loser && (r.adjacentRegionIds || []).some(a => byId.has(a) && owner(byId.get(a)!) === gainer));
  if (!frontier.length) return null;
  // düşük stratejik değerli/az tahkimatlı bölge daha kolay düşer
  frontier.sort((a, b) => (a.fortificationLevel + a.strategicValue) - (b.fortificationLevel + b.strategicValue));
  const pick = frontier[Math.min(frontier.length - 1, Math.floor(Math.random() * Math.min(3, frontier.length)))];
  setRegionController(pick.id, gainer);
  void label;
  return { region: pick, from: loser, to: gainer };
}

const NAMES: Record<string, string> = { RU: 'Russia', UA: 'Ukraine', KP: 'North Korea', KR: 'South Korea' };

export function tickLiveWars(params: { scenario: string; playerCountryId: string; dateISO: string }): LiveWarUpdate[] {
  const { scenario, playerCountryId, dateISO } = params;
  const out: LiveWarUpdate[] = [];
  const push = (warKey: string, title: string, r: { region: TheaterRegion; from: string; to: string }, nm: (id: string) => string) =>
    out.push({ warKey, title, date: dateISO, body: `${nm(r.to)} forces took ${r.region.name} from ${nm(r.from)}.` });

  if (scenario === '2026') {
    if (!['UA', 'RU'].includes(playerCountryId) && Math.random() < 0.5) {
      const regions = getTheaterRegions('UA', 'RU').regions;
      const r = flipOne(regions, 'RU', 0.58, 'UA-RU');
      if (r) push('UA-RU', 'Russia-Ukraine front', r, id => NAMES[id] || id);
    }
    for (const cid of ['SD', 'MM', 'YE', 'LY']) {
      if (playerCountryId === cid || Math.random() > 0.3) continue;
      const th = PREDEFINED_CIVIL_WAR_THEATERS[cid];
      if (!th) continue;
      const regions: TheaterRegion[] = th.regions as any;
      const gov = th.factions.find((f: any) => f.isGovernment)?.id || th.factions[0].id;
      const fname = (id: string) => th.factions.find((f: any) => f.id === id)?.name || id;
      const r = flipOne(regions.map(x => ({ ...x, controllerId: x.controllerId || x.originalOwnerId })), gov, 0.5, cid);
      if (r) push(cid, th.conflictName, r, fname);
    }
  }
  if (scenario === '1950' && dateISO >= '1950-06-25' && !['KR', 'KP', 'CN', 'US', 'GB', 'TR', 'AU', 'CA'].includes(playerCountryId) && Math.random() < 0.6) {
    const regions = getTheaterRegions('KR', 'KP').regions;
    const b = koreaBias(dateISO);
    const r = flipOne(regions, b.favored, b.p, 'KOREA');
    if (r) push('KOREA', 'Korean War front', r, id => NAMES[id] || id);
  }
  return out;
}
