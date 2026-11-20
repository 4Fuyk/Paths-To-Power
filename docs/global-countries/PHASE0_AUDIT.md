# Global Playable Countries — Phase 0 Architecture Audit

Snapshot date: 2026-11-20 · Repository: `4Fuyk/Paths-To-Power` · Audited commit: `19cddff5bc0257c772a1f98e9ec4dd12591a9c0e`

Evidence tags used below: **[verified]** read/computed from the real repo or dataset in this session · **[source]** read from a source body
(Graphify index built at the same commit) · **[predicted]** derived by reading code against verified data, NOT reproduced in a browser ·
**[unread]** not inspected yet.

## 0. Method and limits

- `main` HEAD was re-read live from GitHub (`refs/heads/main`) and equals `19cddff…` **[verified]**. Branches at audit time: `main`, `feature/ptp-additions-audited` (`9346f72…`, already merged via PR #1/#2). `main` is not branch-protected on GitHub.
- Graphify index commit equals main HEAD **[verified]**. Structure/call questions were answered from the graph; key function bodies were read from it.
- Data files were inspected with read-only helper code actions (blob fetched by SHA, parsed, summarized). No file in the repo was modified by the audit.
- NOT possible in this session: `npm install`, `npm run build`, `npm run lint`, a browser run, clicking polygons. Everything below that needs those is marked as such.
- Test infrastructure: `package.json` has scripts `dev`, `build` (`vite build`), `preview`, `clean`, `lint` (`tsc --noEmit`). There is **no test framework, no test script and no test files** in `src/utils` **[verified]**. "Existing test suite" therefore = `tsc --noEmit` + `vite build` only. `tsx` is a devDependency, so validators run as `npx tsx scripts/<name>.ts`.
- `tsconfig.json` has no `include` and `allowJs: true`, so `npm run lint` type-checks every TS/JS file in the repo, including anything added under `scripts/` **[verified]**. New files were checked against these exact options and under `strict`.

## 1. Country data model (src/types.ts) [source]

`Country` has more fields than the project brief lists. Present: `id, name, description, flag, seats, system, parliamentName, population, primaryColor, regions, rivals, bills, campaignTurns, electionCycleYears, termLimit?, freedomScore?, postWarParties?, isBreakaway?, isVassal?, suzerainId?, vassalOf?, parentCountryId?, activeConflictId?, countryMode?, civilWarResolved?, capitalRegionId?, validFrom?, validUntil?`.
Missing for the global expansion: ISO3, capital name, head of state, head of government, governing coalition, data-snapshot date, per-fact verification status.
`RivalParty` = `{id,name,leader,ideology,symbol,color,baseSupport,photo?,startingSeats?}` — no source/verified marker, and `baseSupport` mixes fact and simulation. `Region` carries `supports`/`voterDistribution`.
Finding: Turkey's per-province supports are produced by `hash(name) % n` noise around fixed national shares (`getTurkeyRegions`), and ~25 other countries use `generateRegionsFromSpec(iso, spec, partyIds, nationalShares)`. These are **simulation values, not sourced electoral data** and must be labelled as such (Phase 6).

## 2. Country lists that exist today

| Where | What | Count |
|---|---|---|
| `src/constants/countries.ts` `PLAYABLE_COUNTRIES` (L1376–~2060) | 2026 sovereign profiles | **30**: TR DE US CA AR ZA IN IT ID MX ES KR AU FR RO HU GB BR JP EG RU CL IS PT GR PL FI NO SE CH |
| `src/constants/eraCountries.ts` | `COUNTRIES_1950/1936/1920/1914`, `getPlayableCountriesForScenario` | 4 historical lists (must stay unchanged) |
| `src/constants/breakawayCountries.ts` `BREAKAWAY_COUNTRIES` | breakaway entities | **6**: SY_SDF LY_LNA SD_RSF MM_NUG_PDF YE_HOU CD_M23 |
| `countries.ts` `countryColors` (L1324) | hand-written colour table | 48 keys = 30 playable + DDR SU CS YU TW CN + 12 conflict ids |

Existing 30 all have a colour and a `public/geo` file **[verified]**; the other 166 roster entries have neither a profile nor a colour.

## 3. Hard-coded country logic that blocks new countries

1. `WorldMap.tsx`: three manual tables keyed by country id — `countryCoords` (L54), `englishNames` (L119), `countryRadii` (L184) **[source]** — plus `getPlayableCountryCode(feature)` built from ISO checks and `name.includes('…')` chains (CAF/ESH exclusions, Soviet republics, Czechoslovakia) **[source, first steps only; the rest of the function is [unread]]**. Substring tests such as `name.includes('GEORGIA')` can hit unrelated features **[predicted]**.
2. `WorldMap.tsx` reads `feature.id || properties.ISO_A3 || properties.iso_a3`; in the world file `feature.id` is empty and keys are lowercase **[verified]**, so selection currently depends on lowercase `iso_a3`. That value is `-99` for Kosovo, Northern Cyprus, Somaliland, Siachen, Ashmore & Cartier, Indian Ocean Territories **[verified]**.
3. `mapRegistry.ts` `ISO2_TO_ISO3` (L27): ~170 entries, includes non-sovereign `PR`, alias keys `SU/YU/CS/DDR` that reuse another country's ISO3, and `XK→XKX`. `ISO3_TO_ISO2` is "first key wins" **[source]**. Many sovereign states are absent (see roster file).
4. `mapRegistry.ts` `COUNTRY_MAP_REGISTRY` (L101–~720) hand-lists per-country configs; unknown ids fall back to a naming convention `/geo/<iso3>.geojson`. TR, DE, US, FR, GB, CA also list external `raw.githubusercontent.com` fallback URLs (network dependency) **[source]**.
5. `loadCountryMapData`: local file → external fallbacks → filter world file → "Map data unavailable". A result is accepted only if it has **≥ 3 features** (`validateAdmin1Features`). Cache key is `iso3|url` (good: no RU/SU collision) **[source]**.
6. `filterWorldAdmin0ForCountry` accepts a feature when `fName.includes(targetName) || targetName.includes(fName)` **[source]**. Against the real dataset names this predicts wrong results for countries without their own `/geo` file **[predicted]**: Guinea would collect Guinea + Guinea-Bissau + Eq. Guinea + Papua New Guinea (4 features ≥ 3 → accepted as "regions"); Dominica (+Dominican Rep.), Samoa (+American Samoa), Niger (+Nigeria) get 2 features → rejected → "unavailable". Single-feature countries (all microstates) can never pass the ≥3 rule, so a country-level map mode is required.
7. `countryUtils.ts`: `HISTORICAL_COUNTRY_VALIDITY` (L20), `MODERN_ONLY_COUNTRIES` (L114) **[symbols seen, bodies unread]** — must be checked so new ids are treated as valid in 2026.
8. `warShapes.ts` `loadFeatures` builds `/geo/<iso3>.geojson` from `ISO2_TO_ISO3` **[source]**.
9. Legacy root scripts (`add_countries.cjs/.patch`, `patch_playable.cjs`, `fix_unplayable.sh`, `scripts/download_maps.cjs` with a hard-coded list of 12) are historical hacks; they were not executed.
10. **[unread]** `App.tsx` (~108 KB), `ElectionSimulator.tsx`, `territorialControl.ts`, `scenarios.ts`, `neighborElections.ts`, `foreignElections.ts`, `i18n/*`: hard-coded `'TR'/'US'/'FR'` conditions have NOT been enumerated yet. Blob SHAs at this commit: App.tsx `609f67f`, ElectionSimulator.tsx `73fe460`, territorialControl.ts `27ab27e`, scenarios.ts `ca7d945`.

## 4. GeoJSON inventory

### 4.1 `public/world_admin0_50m.geojson` [verified]
- 4,045,883 bytes · 241 features · 99,566 coordinate pairs · all geometries valid (finite, in range, closed rings) · all lowercase property keys (`adm0_a3, iso_a2, iso_a3, sovereignt, admin, name, type, …`) — a Natural Earth–style schema. The repo does not state provenance/licence of this file **[unverified provenance]**.
- `type` values: `Sovereign country`, `Country`, `Dependency`, `Indeterminate`, `Disputed`. `Country` mixes sovereigns (AU CN DK FI FR GB NL NZ US) with non-sovereigns (Åland, Curaçao, Guernsey, Greenland, Hong Kong, Isle of Man, Jersey, Macao, Sint Maarten), so `type` alone cannot define sovereignty.
- `adm0_a3` is present and **unique on all 241 features** (0 duplicates). `iso_a2/iso_a3` are not usable as a join key (`-99` cases above). → canonical join key = `adm0_a3`.
- Palestine: `type=Disputed`, `sovereignt=Israel`, `adm0_a3=PSX`. Western Sahara, Somaliland, Siachen: `Indeterminate`. Northern Cyprus and Kosovo: typed `Sovereign country` with `-99` ISO codes.
- Several single features contain far-flung parts: France (lon −61.8…55.8), Netherlands (−68.4…7.2), Portugal (−31.3…−6.2), Spain (−18.2…4.3), USA, New Zealand, Chile, Ecuador, Norway (Svalbard); Russia, Fiji and Kiribati touch ±180° (antimeridian). Click/zoom logic must not assume one compact polygon.
- Tuvalu (UN member) has **no polygon** in this file.

### 4.2 `public/geo/` [verified listing; 16 of 129 files opened]
- 140 directory entries = **129 distinct names** + 11 redundant alias copies with identical blob SHAs: `LBY/lby/libya`, `AF/AFG/afg`, `ET/ETH/eth`, `CN/CHN/chn/cn`, `HT/HTI/hti`. Alias copies bloat the repo and invite cache/URL collisions.
- `pri.geojson` is Puerto Rico (non-sovereign).
- `public/` root additionally holds 23 named GeoJSON files (chile, syria, russia, …). `public/libya.geojson` (blob `5866421`) **differs** from `public/geo/lby.geojson` (blob `790aafb`): two different Libya files exist — which is canonical is undecided.
- Files opened so far (mli nzl bgr are cyp rwa svk blr ven cri dom bih mar aze irl nic): all parse, all `MultiPolygon`, 0 invalid features, admin-1 schema with `GID_1, GID_0, COUNTRY, NAME_1, VARNAME_1, NL_NAME_1, TYPE_1, ENGTYPE_1`. Feature counts: MLI 9, NZL 19, BGR 28, ARE 7, CYP 5, RWA 5, SVK 8, BLR 7, VEN 25, CRI 7, DOM 32, BIH 3, MAR 15, AZE 10, IRL 26, NIC 18. `NAME_1` values carry no spaces (e.g. `AbuDhabi`) — a GADM-style convention.
- **Licence flag [unverified]:** the `GID_*`/`NAME_1` schema matches GADM, whose licence restricts commercial use and redistribution. The source of these files is not documented in the repo (`scripts/download_maps.cjs` references geoBoundaries, which is a different licence). Confirm source and licence before any public release.
- Accented names appeared mis-decoded in the inspection output (e.g. `AnzoÃ¡tegui`); this is probably an artefact of the inspection helper, not of the files **[unverified — check locally]**.
- 113 files not opened yet; the validator in `scripts/` parses all of them when run in the repo.

### 4.3 Coverage vs. the roster [verified by computation]
- Roster = 196 playable-eligible (see `DEVELOPMENT_LOG.md`). 128 have a `public/geo/<iso3>.geojson`; **68 have none**: AD AG BB BF BH BI BJ BN BS BT BW BZ CF CV DJ DM ER FJ FM GA GD GM GN GQ GW GY JM KH KI KM KN LA LC LI LR LS LU MC MG MH MR MT MU MV MW NA NE NR PG PW SB SC SL SM SR SS ST SZ TD TG TL TO TT VA VC VU WS XK.
- All 196 roster `adm0_a3` keys match **exactly one** world feature; none missing, none ambiguous.

## 5. Risk list (priority order)

1. Wrong-polygon selection through substring name matching (items 1, 6).
2. No country-level map mode: microstates and the 68 countries without regional data cannot pass the ≥3-feature rule.
3. Duplicate/conflicting geo files (alias copies, two Libya files).
4. Simulation numbers indistinguishable from facts in party/region data.
5. Unknown licence of regional GeoJSON.
6. Unread hard-coded conditions in `App.tsx` and simulation modules.
7. No automated tests exist; only `tsc --noEmit` and `vite build`.
