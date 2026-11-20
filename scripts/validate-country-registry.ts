/// <reference types="node" />
/**
 * Validates src/data/countryRegistry/sovereignRoster.ts (Phase 1/9 tooling).
 * Run from the repo root:  npx tsx scripts/validate-country-registry.ts
 * Exit code 1 on any failure. Read-only: never writes files.
 *
 * Checks that need repo files (world GeoJSON, public/geo) are SKIPPED with a visible notice when the files
 * are absent — a skipped check is reported as SKIPPED, never as passed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { SOVEREIGN_ROSTER, PLAYABLE_ROSTER, BREAKAWAY_IDS, flagFromIso2 } from '../src/data/countryRegistry/sovereignRoster';

const root = process.cwd();
const failures: string[] = [];
const notes: string[] = [];
const fail = (m: string) => failures.push(m);

// The 30 sovereign profiles that exist in src/constants/countries.ts at main 19cddff.
const EXISTING_30 = ['TR','DE','US','CA','AR','ZA','IN','IT','ID','MX','ES','KR','AU','FR','RO','HU','GB','BR','JP','EG','RU','CL','IS','PT','GR','PL','FI','NO','SE','CH'];

// --- 1. identity checks -------------------------------------------------------------------------------------
const dupes = (vals: (string | null)[]) => {
  const seen = new Set<string>(); const d = new Set<string>();
  for (const v of vals) { if (v == null) continue; if (seen.has(v)) d.add(v); seen.add(v); }
  return [...d];
};
for (const [label, vals] of [
  ['id', SOVEREIGN_ROSTER.map(e => e.id)],
  ['iso2', SOVEREIGN_ROSTER.map(e => e.iso2)],
  ['iso3', SOVEREIGN_ROSTER.map(e => e.iso3)],
  ['geoKey', SOVEREIGN_ROSTER.map(e => e.geoKey)],
] as const) {
  const d = dupes([...vals]);
  if (d.length) fail(`duplicate ${label}: ${d.join(', ')}`);
}
for (const e of SOVEREIGN_ROSTER) {
  if (!/^[A-Z]{2}$/.test(e.iso2)) fail(`${e.id}: bad iso2 '${e.iso2}'`);
  if (!/^[A-Z]{3}$/.test(e.iso3)) fail(`${e.id}: bad iso3 '${e.iso3}'`);
  if (e.id !== e.iso2) fail(`${e.id}: id must equal iso2`);
  if (e.inRoster && !e.geoKey) fail(`${e.id}: inRoster but has no geoKey`);
  if (!e.inRoster && !e.reason) fail(`${e.id}: excluded without a documented reason`);
  if (flagFromIso2(e.iso2).length === 0) fail(`${e.id}: no flag`);
}
for (const b of BREAKAWAY_IDS) {
  if (SOVEREIGN_ROSTER.some(e => e.id === b)) fail(`breakaway id ${b} leaked into the sovereign roster`);
}
if (BREAKAWAY_IDS.length !== 6) fail(`expected 6 breakaway entities, found ${BREAKAWAY_IDS.length}`);
for (const id of EXISTING_30) {
  const e = SOVEREIGN_ROSTER.find(x => x.id === id);
  if (!e) fail(`existing profile ${id} missing from roster`);
  else if (e.profileStatus !== 'existing') fail(`${id} must be profileStatus 'existing'`);
}
const existingInRoster = SOVEREIGN_ROSTER.filter(e => e.profileStatus === 'existing').map(e => e.id);
if (existingInRoster.length !== EXISTING_30.length) fail(`roster marks ${existingInRoster.length} existing profiles, expected ${EXISTING_30.length}`);

// --- 2. world dataset join (adm0_a3) -----------------------------------------------------------------------
const worldPath = path.join(root, 'public', 'world_admin0_50m.geojson');
if (fs.existsSync(worldPath)) {
  const world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
  const byAdm: Record<string, any[]> = {};
  for (const f of world.features ?? []) {
    const p = f.properties ?? {};
    const k = String(p.adm0_a3 ?? p.ADM0_A3 ?? '').toUpperCase();
    (byAdm[k] ||= []).push(f);
    const g = f.geometry;
    if (!g || !['Polygon', 'MultiPolygon'].includes(g.type)) fail(`world feature ${k || '?'}: invalid geometry`);
  }
  for (const e of PLAYABLE_ROSTER) {
    const hits = byAdm[e.geoKey as string] ?? [];
    if (hits.length !== 1) fail(`${e.id}: geoKey ${e.geoKey} matches ${hits.length} world features (expected 1)`);
  }
  for (const e of SOVEREIGN_ROSTER.filter(x => !x.inRoster && x.geoKey)) {
    if ((byAdm[e.geoKey as string] ?? []).length) fail(`${e.id}: excluded for missing polygon but world file has one`);
  }
  notes.push(`world dataset: ${world.features?.length ?? 0} features joined by adm0_a3`);
} else notes.push('SKIPPED world-dataset join: public/world_admin0_50m.geojson not found');

// --- 3. regional geo coverage (public/geo) -------------------------------------------------------------------
const geoDir = path.join(root, 'public', 'geo');
if (fs.existsSync(geoDir)) {
  const files = new Set(fs.readdirSync(geoDir).filter(f => /^[a-z]{3}\.geojson$/.test(f)).map(f => f.slice(0, 3)));
  for (const e of PLAYABLE_ROSTER) {
    const has = files.has(e.iso3.toLowerCase());
    if (has !== e.regionalGeo) fail(`${e.id}: regionalGeo=${e.regionalGeo} but /geo/${e.iso3.toLowerCase()}.geojson ${has ? 'exists' : 'is missing'}`);
  }
  const rosterIso3 = new Set(SOVEREIGN_ROSTER.map(e => e.iso3.toLowerCase()));
  const extra = [...files].filter(f => !rosterIso3.has(f));
  if (extra.length) notes.push(`public/geo files not in the sovereign roster (kept untouched): ${extra.join(', ')}`);
  const upper = fs.readdirSync(geoDir).filter(f => /^[A-Z]{2,3}\.geojson$/.test(f) || /^[a-z]{2}\.geojson$/.test(f) || /^[a-z]{4,}\.geojson$/.test(f));
  if (upper.length) notes.push(`alias/duplicate-named files in public/geo (cache-collision risk): ${upper.join(', ')}`);
  for (const f of fs.readdirSync(geoDir).filter(f => f.endsWith('.geojson'))) {
    try { const j = JSON.parse(fs.readFileSync(path.join(geoDir, f), 'utf8')); if (!Array.isArray(j.features)) fail(`/geo/${f}: no features array`); }
    catch (err) { fail(`/geo/${f}: does not parse (${(err as Error).message})`); }
  }
} else notes.push('SKIPPED public/geo coverage + parse check: directory not found');

// --- report ----------------------------------------------------------------------------------------------------
const summary = {
  entries: SOVEREIGN_ROSTER.length,
  playableRoster: PLAYABLE_ROSTER.length,
  existingProfiles: existingInRoster.length,
  stubs: PLAYABLE_ROSTER.filter(e => e.profileStatus === 'stub').length,
  withRegionalGeo: PLAYABLE_ROSTER.filter(e => e.regionalGeo).length,
  withoutRegionalGeo: PLAYABLE_ROSTER.filter(e => !e.regionalGeo).length,
  excluded: SOVEREIGN_ROSTER.filter(e => !e.inRoster).map(e => e.id),
};
console.log('ROSTER SUMMARY', JSON.stringify(summary, null, 2));
for (const n of notes) console.log('NOTE:', n);
if (failures.length) { console.error(`FAILED (${failures.length}):`); failures.forEach(f => console.error(' -', f)); process.exit(1); }
console.log('OK: all executed checks passed (see NOTE lines for skipped checks).');
