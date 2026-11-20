# Global Playable Countries — Development Log

Branch: `feature/2026-global-playable-countries` (created from main `19cddff5bc0257c772a1f98e9ec4dd12591a9c0e`). `main` is never modified by this work; no merge without explicit approval. The game name and the repository name are unchanged.

## Status (last updated 2026-11-20)

| Phase | State | Notes |
|---|---|---|
| 0 Architecture audit | **Partial** | `PHASE0_AUDIT.md`. Done: data model, country lists, map registry/loader, world + `public/geo` inventory. Unread: `App.tsx`, `ElectionSimulator.tsx`, `territorialControl.ts`, `scenarios.ts`, rest of `getPlayableCountryCode`, `countryUtils` tables, i18n. |
| 1 Canonical registry | **Partial (identity layer only)** | `src/data/countryRegistry/sovereignRoster.ts`: 197 entries, 196 playable-eligible. Not wired into the game. No political data yet. |
| 2 GeoJSON / world map | Not started | Design decided (join on `adm0_a3`, country-level fallback mode, one shared world file + lazy regional files). No existing file modified. |
| 3 Colours | Not started | The 166 new countries have no colour; deterministic palette + neighbour-aware assignment still to build. |
| 4 Governments | Not started | Needs per-country research with sources; nothing may be invented. |
| 5 Political parties | Not started | Same rule. Existing 30 profiles untouched. |
| 6 Regional/electoral data | Not started | Label simulation values separately from facts. |
| 7 Gameplay | Not started | Needs the `App.tsx` audit first. |
| 8 Performance | Not started | |
| 9 Validation | **Partial** | `scripts/validate-country-registry.ts` written. |
| 10 GitHub workflow | In progress | Feature branch created; logical commits only; nothing pushed to `main`. |

No country besides the 30 existing ones is playable. A roster entry with `profileStatus: 'stub'` only has identity + map mapping.

## Roster policy (snapshot 2026-11-20)

Included: 193 UN member states + 2 UN non-member observer states (Holy See, State of Palestine) + 2 partially recognized states (Taiwan, Kosovo) = 197 candidates. **Tuvalu is excluded for now** because the world file has no polygon for it → **196** playable-eligible. UN count (193 members + 2 observers) was checked against 2026 sources on 2026-11-20.
Not in the roster: dependencies/territories (e.g. Puerto Rico, Greenland, Hong Kong), de-facto entities without general recognition (Northern Cyprus, Somaliland, Western Sahara), and the six breakaway entities (`SY_SDF LY_LNA SD_RSF MM_NUG_PDF YE_HOU CD_M23`), which stay in `breakawayCountries.ts`.
The count (196) is above the "about 180" target. Per the brief the count follows the documented policy and is not forced; trimming (e.g. very small states) is a decision for the project owner.

Verified: all 196 roster `adm0_a3` keys match exactly one feature in `public/world_admin0_50m.geojson`; the 30 existing profile ids are all in the roster; 128 roster countries have a regional file in `public/geo`, 68 do not.

## Decisions pending approval

1. Keep all 196, or trim microstates / disputed entries?
2. Disputed handling default used here: Taiwan, Kosovo and Palestine are included and flagged (`sovereignty` field); Northern Cyprus, Somaliland, Western Sahara are not roster entries.
3. Which Libya file is canonical (`public/libya.geojson` vs `public/geo/lby.geojson`)?

## Verification log

Ran and passed (in a sandbox, not in the repo checkout):
- `tsc` on the two new files with strict mode: pass.
- `tsc` on the two new files with options mirrored from the repo `tsconfig.json`: pass.
- Registry identity checks (unique id/iso2/iso3/geoKey, 6 breakaway ids absent, 30 existing present, excluded entries documented): pass. A deliberately broken copy made the validator fail, then the file was restored.
- Roster `adm0_a3` keys vs the real world file on GitHub: 196/196 matched exactly once.

NOT run yet: `npm install`, `npm run build`, `npm run lint` on the full repo, `npx tsx scripts/validate-country-registry.ts` inside a real checkout (its world-file and `public/geo` checks are skipped outside the repo and are reported as SKIPPED, never as passed), any browser test.

## How to resume

1. Re-read live `main` HEAD and this branch tip before touching anything.
2. In a checkout: `npm install`, `npm run lint`, `npx tsx scripts/validate-country-registry.ts` and record the real results here.
3. Finish the Phase 0 reads listed above, then start Phase 2 (identity resolution through the registry, replacing the name-substring logic) in a small, separate commit.
