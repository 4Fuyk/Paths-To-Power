/**
 * Savaş bölgeleri için gerçek il (admin-1) şekilleri: bölge kimliği/adı ile il adı eşleştirilir.
 * Eşleşmeyen bölgeler eski yaklaşık şekliyle çizilir.
 */
import { ISO2_TO_ISO3 } from '../data/mapRegistry';

const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
const fileCache: Record<string, Promise<any[]>> = {};

function loadFeatures(iso2: string): Promise<any[]> {
  if (!fileCache[iso2]) {
    const iso3 = ISO2_TO_ISO3[iso2] || iso2;
    fileCache[iso2] = (async () => {
      for (const f of [iso3.toLowerCase(), iso3]) {
        try { const r = await fetch(`/geo/${f}.geojson`); if (r.ok) { const j = await r.json(); if (Array.isArray(j.features)) return j.features; } } catch (e) { /* sonraki ad */ }
      }
      return [];
    })();
  }
  return fileCache[iso2];
}

export async function loadWarShapes(regions: any[]): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  const countries = Array.from(new Set(regions.map(r => r.countryId || r.originalOwnerId || String(r.id).split('_')[0])));
  const feats: Record<string, any[]> = {};
  await Promise.all(countries.map(async c => { feats[c] = await loadFeatures(c); }));
  for (const r of regions) {
    const list = feats[r.countryId || r.originalOwnerId || String(r.id).split('_')[0]] || [];
    const suf = norm(String(r.id).split('_').slice(1).join(''));
    const first = norm(String(r.name || '').split(/[ &,]/)[0]);
    const hit = list.find((f: any) => {
      const nn = norm(f.properties?.NAME_1 || f.properties?.name || '');
      return nn && (nn.includes(suf) || suf.includes(nn) || (first.length > 3 && (nn.includes(first) || first.includes(nn))));
    });
    if (hit) out[r.id] = hit;
  }
  return out;
}
