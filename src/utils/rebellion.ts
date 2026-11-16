/**
 * Halk isyanı için gerçek bir savaş haritası üretir: hükümet ve isyancılar, ülkenin gerçek bölge (il) sınırları üzerinde.
 * İsyancılar tek bir komşu bölge kümesini elinde tutar. Üretilen tanım INITIAL_CIVIL_WARS'a eklenir ve iç savaş haritası bunu kullanır.
 * Daha önce çözülmüş bir iç savaşın eski tarafları kullanılmaz: isyan her zaman yeni bir yapıdır.
 */
import type { Country, CivilWarState } from '../types';
import { INITIAL_CIVIL_WARS } from '../constants/civilWarData';
import { ISO2_TO_ISO3, loadCountryMapData, getCountryMapConfig, getFeatureRegionName } from '../data/mapRegistry';

const ring0 = (g: any): number[][] => g?.type === 'Polygon' ? g.coordinates[0] : g?.type === 'MultiPolygon' ? g.coordinates.reduce((a: number[][], p: number[][][]) => (p[0].length > a.length ? p[0] : a), []) : [];

/** İç savaş haritasıyla aynı yükleyici ve aynı bölge adı çözümü: isyancı bölge adları haritadaki adlarla birebir eşleşir. */
async function loadRegions(country: Country): Promise<{ name: string; c: [number, number] }[]> {
  try {
    const res = await loadCountryMapData(country.id, country.name);
    const feats = res.data?.features;
    if (!Array.isArray(feats)) return [];
    const cfg = getCountryMapConfig(country.id, country.name);
    return feats.map((ft: any, i: number) => {
      const r = ring0(ft.geometry);
      const n = r.length || 1;
      return { name: getFeatureRegionName(ft, cfg) || `Region_${i}`, c: [r.reduce((s, p) => s + p[0], 0) / n, r.reduce((s, p) => s + p[1], 0) / n] as [number, number] };
    });
  } catch (e) { return []; }
}

/** İsyanın INITIAL_CIVIL_WARS'a yazdığı anahtarların önceki değerleri; yeni oyunda geri yüklenir (isyan sonraki oyuna sızmasın). */
const rebellionBackup = new Map<string, CivilWarState | undefined>();
export function clearRebellionCivilWars(): void {
  rebellionBackup.forEach((prev, key) => { if (prev) INITIAL_CIVIL_WARS[key] = prev; else delete INITIAL_CIVIL_WARS[key]; });
  rebellionBackup.clear();
}

export async function startRebellionCivilWar(country: Country, year: number): Promise<void> {
  const iso3 = ISO2_TO_ISO3[country.id] || country.id;
  const regions = await loadRegions(country);
  let rebelRegions: string[] = [];
  if (regions.length >= 3) {
    // rastgele bir çekirdek bölge + ona en yakın bölgeler = isyancıların elindeki bitişik küme
    const seed = regions[Math.floor(Math.random() * regions.length)];
    const k = Math.max(1, Math.min(Math.max(2, Math.round(regions.length * 0.28)), Math.floor(regions.length / 2)));   // 3 bölgeli ülkede hükümet çoğunluğu korur
    rebelRegions = regions.slice().sort((a, b) => Math.hypot(a.c[0] - seed.c[0], a.c[1] - seed.c[1]) - Math.hypot(b.c[0] - seed.c[0], b.c[1] - seed.c[1])).slice(0, k).map(r => r.name);
  }
  const govId = `${country.id}_GOV`, rebId = `${country.id}_REBELS`;
  const def: CivilWarState = {
    countryId: country.id, countryName: country.name, flag: country.flag,
    conflictName: `${country.name} Uprising ${year}`, yearStarted: year, stability: 22, status: 'ACTIVE',
    refugeePressure: 25, monthlyCasualties: 150, playerStance: 'NEUTRAL',
    sides: [
      { id: `${country.id}_SIDE_GOV`, name: `${country.name} Government`, leader: govId, members: [govId], color: '#2563eb' },
      { id: `${country.id}_SIDE_REB`, name: 'Insurgent Front', leader: rebId, members: [rebId], color: '#e11d48' }
    ],
    factions: [
      { id: govId, name: `${country.name} Government Forces`, leader: 'Government', ideology: 'Incumbent', color: '#2563eb', strength: 62, controlledRegions: [], isGovernment: true, description: 'Loyalist forces defending the capital and the remaining provinces.' },
      { id: rebId, name: 'Insurgent Front', leader: 'Rebel Command', ideology: 'Insurgent', color: '#e11d48', strength: 38, controlledRegions: rebelRegions, description: 'Armed rebels who seized a block of provinces after the uprising.' }
    ]
  };
  for (const key of [country.id, iso3]) if (!rebellionBackup.has(key)) rebellionBackup.set(key, INITIAL_CIVIL_WARS[key]);
  INITIAL_CIVIL_WARS[country.id] = def;
  INITIAL_CIVIL_WARS[iso3] = def;
}
