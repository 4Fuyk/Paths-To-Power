/**
 * CANONICAL 2026 SOVEREIGN ROSTER — identity layer (Phase 1). Snapshot date: 2026-11-20.
 *
 * Inclusion policy: all 193 UN member states + 2 UN non-member observer states (Holy See, State of Palestine)
 * + 2 partially recognized states (Taiwan, Kosovo). An entry without a polygon in the world dataset is listed
 * but excluded (inRoster: false). NOT in the roster (documented, never silently dropped): dependencies and
 * territories (e.g. Puerto Rico, Greenland, Hong Kong), de-facto entities without general recognition
 * (Northern Cyprus, Somaliland, Western Sahara), and the six breakaway entities, which live in
 * breakawayCountries.ts under their own ids.
 *
 * This file holds IDENTITY + GEOMETRY MAPPING only — no political data. profileStatus 'stub' means identity and
 * map mapping exist but the political profile (government, parties, regions) has NOT been researched; such a
 * country must not be offered as playable until it is promoted.
 *
 * geoKey is the join key into public/world_admin0_50m.geojson: the `adm0_a3` property (unique per feature there).
 * ISO codes are not the join key because iso_a2/iso_a3 are '-99' for Kosovo and several other features.
 */
export type SovereigntyStatus = 'un-member' | 'un-observer' | 'partially-recognized';
export type ProfileStatus = 'existing' | 'stub';

export interface RosterEntry {
  /** Game country id = ISO 3166-1 alpha-2 (Kosovo uses the user-assigned 'XK'). Equals the ids of the 30 existing profiles. */
  id: string;
  iso2: string;
  iso3: string;
  /** Common English name (informational). For profileStatus 'existing' the profile in countries.ts stays authoritative. */
  name: string;
  sovereignty: SovereigntyStatus;
  /** adm0_a3 of the matching feature in public/world_admin0_50m.geojson, or null when there is none. */
  geoKey: string | null;
  /** True when public/geo/<iso3>.geojson existed at main 19cddff (file content/schema is not guaranteed per file). */
  regionalGeo: boolean;
  profileStatus: ProfileStatus;
  inRoster: boolean;
  reason?: string;
}

// [iso2, iso3, name, sovereignty (M=UN member, O=UN observer, P=partially recognized), regionalGeo (1/0), existing profile (1/0)]
type Row = readonly [string, string, string, 'M' | 'O' | 'P', 0 | 1, 0 | 1];

const SOVEREIGNTY: Record<'M' | 'O' | 'P', SovereigntyStatus> = { M: 'un-member', O: 'un-observer', P: 'partially-recognized' };

/** adm0_a3 differs from ISO3 for these three (verified against the world file at main 19cddff). */
const GEOKEY_OVERRIDES: Readonly<Record<string, string>> = { PS: 'PSX', SS: 'SDS', XK: 'KOS' };

/** Listed but not playable-eligible, with the reason. */
const EXCLUDED: Readonly<Record<string, string>> = {
  TV: 'No polygon in public/world_admin0_50m.geojson (241 features checked at main 19cddff); needs a higher-resolution source before it can be playable.',
};

const ROWS: readonly Row[] = [
  ['AF', 'AFG', "Afghanistan", 'M', 1, 0],
  ['AL', 'ALB', "Albania", 'M', 1, 0],
  ['DZ', 'DZA', "Algeria", 'M', 1, 0],
  ['AD', 'AND', "Andorra", 'M', 0, 0],
  ['AO', 'AGO', "Angola", 'M', 1, 0],
  ['AG', 'ATG', "Antigua and Barbuda", 'M', 0, 0],
  ['AR', 'ARG', "Argentina", 'M', 1, 1],
  ['AM', 'ARM', "Armenia", 'M', 1, 0],
  ['AU', 'AUS', "Australia", 'M', 1, 1],
  ['AT', 'AUT', "Austria", 'M', 1, 0],
  ['AZ', 'AZE', "Azerbaijan", 'M', 1, 0],
  ['BS', 'BHS', "Bahamas", 'M', 0, 0],
  ['BH', 'BHR', "Bahrain", 'M', 0, 0],
  ['BD', 'BGD', "Bangladesh", 'M', 1, 0],
  ['BB', 'BRB', "Barbados", 'M', 0, 0],
  ['BY', 'BLR', "Belarus", 'M', 1, 0],
  ['BE', 'BEL', "Belgium", 'M', 1, 0],
  ['BZ', 'BLZ', "Belize", 'M', 0, 0],
  ['BJ', 'BEN', "Benin", 'M', 0, 0],
  ['BT', 'BTN', "Bhutan", 'M', 0, 0],
  ['BO', 'BOL', "Bolivia", 'M', 1, 0],
  ['BA', 'BIH', "Bosnia and Herzegovina", 'M', 1, 0],
  ['BW', 'BWA', "Botswana", 'M', 0, 0],
  ['BR', 'BRA', "Brazil", 'M', 1, 1],
  ['BN', 'BRN', "Brunei", 'M', 0, 0],
  ['BG', 'BGR', "Bulgaria", 'M', 1, 0],
  ['BF', 'BFA', "Burkina Faso", 'M', 0, 0],
  ['BI', 'BDI', "Burundi", 'M', 0, 0],
  ['CV', 'CPV', "Cabo Verde", 'M', 0, 0],
  ['KH', 'KHM', "Cambodia", 'M', 0, 0],
  ['CM', 'CMR', "Cameroon", 'M', 1, 0],
  ['CA', 'CAN', "Canada", 'M', 1, 1],
  ['CF', 'CAF', "Central African Republic", 'M', 0, 0],
  ['TD', 'TCD', "Chad", 'M', 0, 0],
  ['CL', 'CHL', "Chile", 'M', 1, 1],
  ['CN', 'CHN', "China", 'M', 1, 0],
  ['CO', 'COL', "Colombia", 'M', 1, 0],
  ['KM', 'COM', "Comoros", 'M', 0, 0],
  ['CG', 'COG', "Republic of the Congo", 'M', 1, 0],
  ['CD', 'COD', "Democratic Republic of the Congo", 'M', 1, 0],
  ['CR', 'CRI', "Costa Rica", 'M', 1, 0],
  ['CI', 'CIV', "Côte d'Ivoire", 'M', 1, 0],
  ['HR', 'HRV', "Croatia", 'M', 1, 0],
  ['CU', 'CUB', "Cuba", 'M', 1, 0],
  ['CY', 'CYP', "Cyprus", 'M', 1, 0],
  ['CZ', 'CZE', "Czechia", 'M', 1, 0],
  ['DK', 'DNK', "Denmark", 'M', 1, 0],
  ['DJ', 'DJI', "Djibouti", 'M', 0, 0],
  ['DM', 'DMA', "Dominica", 'M', 0, 0],
  ['DO', 'DOM', "Dominican Republic", 'M', 1, 0],
  ['EC', 'ECU', "Ecuador", 'M', 1, 0],
  ['EG', 'EGY', "Egypt", 'M', 1, 1],
  ['SV', 'SLV', "El Salvador", 'M', 1, 0],
  ['GQ', 'GNQ', "Equatorial Guinea", 'M', 0, 0],
  ['ER', 'ERI', "Eritrea", 'M', 0, 0],
  ['EE', 'EST', "Estonia", 'M', 1, 0],
  ['SZ', 'SWZ', "Eswatini", 'M', 0, 0],
  ['ET', 'ETH', "Ethiopia", 'M', 1, 0],
  ['FJ', 'FJI', "Fiji", 'M', 0, 0],
  ['FI', 'FIN', "Finland", 'M', 1, 1],
  ['FR', 'FRA', "France", 'M', 1, 1],
  ['GA', 'GAB', "Gabon", 'M', 0, 0],
  ['GM', 'GMB', "Gambia", 'M', 0, 0],
  ['GE', 'GEO', "Georgia", 'M', 1, 0],
  ['DE', 'DEU', "Germany", 'M', 1, 1],
  ['GH', 'GHA', "Ghana", 'M', 1, 0],
  ['GR', 'GRC', "Greece", 'M', 1, 1],
  ['GD', 'GRD', "Grenada", 'M', 0, 0],
  ['GT', 'GTM', "Guatemala", 'M', 1, 0],
  ['GN', 'GIN', "Guinea", 'M', 0, 0],
  ['GW', 'GNB', "Guinea-Bissau", 'M', 0, 0],
  ['GY', 'GUY', "Guyana", 'M', 0, 0],
  ['HT', 'HTI', "Haiti", 'M', 1, 0],
  ['HN', 'HND', "Honduras", 'M', 1, 0],
  ['HU', 'HUN', "Hungary", 'M', 1, 1],
  ['IS', 'ISL', "Iceland", 'M', 1, 1],
  ['IN', 'IND', "India", 'M', 1, 1],
  ['ID', 'IDN', "Indonesia", 'M', 1, 1],
  ['IR', 'IRN', "Iran", 'M', 1, 0],
  ['IQ', 'IRQ', "Iraq", 'M', 1, 0],
  ['IE', 'IRL', "Ireland", 'M', 1, 0],
  ['IL', 'ISR', "Israel", 'M', 1, 0],
  ['IT', 'ITA', "Italy", 'M', 1, 1],
  ['JM', 'JAM', "Jamaica", 'M', 0, 0],
  ['JP', 'JPN', "Japan", 'M', 1, 1],
  ['JO', 'JOR', "Jordan", 'M', 1, 0],
  ['KZ', 'KAZ', "Kazakhstan", 'M', 1, 0],
  ['KE', 'KEN', "Kenya", 'M', 1, 0],
  ['KI', 'KIR', "Kiribati", 'M', 0, 0],
  ['KP', 'PRK', "North Korea", 'M', 1, 0],
  ['KR', 'KOR', "South Korea", 'M', 1, 1],
  ['KW', 'KWT', "Kuwait", 'M', 1, 0],
  ['KG', 'KGZ', "Kyrgyzstan", 'M', 1, 0],
  ['LA', 'LAO', "Laos", 'M', 0, 0],
  ['LV', 'LVA', "Latvia", 'M', 1, 0],
  ['LB', 'LBN', "Lebanon", 'M', 1, 0],
  ['LS', 'LSO', "Lesotho", 'M', 0, 0],
  ['LR', 'LBR', "Liberia", 'M', 0, 0],
  ['LY', 'LBY', "Libya", 'M', 1, 0],
  ['LI', 'LIE', "Liechtenstein", 'M', 0, 0],
  ['LT', 'LTU', "Lithuania", 'M', 1, 0],
  ['LU', 'LUX', "Luxembourg", 'M', 0, 0],
  ['MG', 'MDG', "Madagascar", 'M', 0, 0],
  ['MW', 'MWI', "Malawi", 'M', 0, 0],
  ['MY', 'MYS', "Malaysia", 'M', 1, 0],
  ['MV', 'MDV', "Maldives", 'M', 0, 0],
  ['ML', 'MLI', "Mali", 'M', 1, 0],
  ['MT', 'MLT', "Malta", 'M', 0, 0],
  ['MH', 'MHL', "Marshall Islands", 'M', 0, 0],
  ['MR', 'MRT', "Mauritania", 'M', 0, 0],
  ['MU', 'MUS', "Mauritius", 'M', 0, 0],
  ['MX', 'MEX', "Mexico", 'M', 1, 1],
  ['FM', 'FSM', "Micronesia", 'M', 0, 0],
  ['MD', 'MDA', "Moldova", 'M', 1, 0],
  ['MC', 'MCO', "Monaco", 'M', 0, 0],
  ['MN', 'MNG', "Mongolia", 'M', 1, 0],
  ['ME', 'MNE', "Montenegro", 'M', 1, 0],
  ['MA', 'MAR', "Morocco", 'M', 1, 0],
  ['MZ', 'MOZ', "Mozambique", 'M', 1, 0],
  ['MM', 'MMR', "Myanmar", 'M', 1, 0],
  ['NA', 'NAM', "Namibia", 'M', 0, 0],
  ['NR', 'NRU', "Nauru", 'M', 0, 0],
  ['NP', 'NPL', "Nepal", 'M', 1, 0],
  ['NL', 'NLD', "Netherlands", 'M', 1, 0],
  ['NZ', 'NZL', "New Zealand", 'M', 1, 0],
  ['NI', 'NIC', "Nicaragua", 'M', 1, 0],
  ['NE', 'NER', "Niger", 'M', 0, 0],
  ['NG', 'NGA', "Nigeria", 'M', 1, 0],
  ['MK', 'MKD', "North Macedonia", 'M', 1, 0],
  ['NO', 'NOR', "Norway", 'M', 1, 1],
  ['OM', 'OMN', "Oman", 'M', 1, 0],
  ['PK', 'PAK', "Pakistan", 'M', 1, 0],
  ['PW', 'PLW', "Palau", 'M', 0, 0],
  ['PA', 'PAN', "Panama", 'M', 1, 0],
  ['PG', 'PNG', "Papua New Guinea", 'M', 0, 0],
  ['PY', 'PRY', "Paraguay", 'M', 1, 0],
  ['PE', 'PER', "Peru", 'M', 1, 0],
  ['PH', 'PHL', "Philippines", 'M', 1, 0],
  ['PL', 'POL', "Poland", 'M', 1, 1],
  ['PT', 'PRT', "Portugal", 'M', 1, 1],
  ['QA', 'QAT', "Qatar", 'M', 1, 0],
  ['RO', 'ROU', "Romania", 'M', 1, 1],
  ['RU', 'RUS', "Russia", 'M', 1, 1],
  ['RW', 'RWA', "Rwanda", 'M', 1, 0],
  ['KN', 'KNA', "Saint Kitts and Nevis", 'M', 0, 0],
  ['LC', 'LCA', "Saint Lucia", 'M', 0, 0],
  ['VC', 'VCT', "Saint Vincent and the Grenadines", 'M', 0, 0],
  ['WS', 'WSM', "Samoa", 'M', 0, 0],
  ['SM', 'SMR', "San Marino", 'M', 0, 0],
  ['ST', 'STP', "São Tomé and Príncipe", 'M', 0, 0],
  ['SA', 'SAU', "Saudi Arabia", 'M', 1, 0],
  ['SN', 'SEN', "Senegal", 'M', 1, 0],
  ['RS', 'SRB', "Serbia", 'M', 1, 0],
  ['SC', 'SYC', "Seychelles", 'M', 0, 0],
  ['SL', 'SLE', "Sierra Leone", 'M', 0, 0],
  ['SG', 'SGP', "Singapore", 'M', 1, 0],
  ['SK', 'SVK', "Slovakia", 'M', 1, 0],
  ['SI', 'SVN', "Slovenia", 'M', 1, 0],
  ['SB', 'SLB', "Solomon Islands", 'M', 0, 0],
  ['SO', 'SOM', "Somalia", 'M', 1, 0],
  ['ZA', 'ZAF', "South Africa", 'M', 1, 1],
  ['SS', 'SSD', "South Sudan", 'M', 0, 0],
  ['ES', 'ESP', "Spain", 'M', 1, 1],
  ['LK', 'LKA', "Sri Lanka", 'M', 1, 0],
  ['SD', 'SDN', "Sudan", 'M', 1, 0],
  ['SR', 'SUR', "Suriname", 'M', 0, 0],
  ['SE', 'SWE', "Sweden", 'M', 1, 1],
  ['CH', 'CHE', "Switzerland", 'M', 1, 1],
  ['SY', 'SYR', "Syria", 'M', 1, 0],
  ['TJ', 'TJK', "Tajikistan", 'M', 1, 0],
  ['TH', 'THA', "Thailand", 'M', 1, 0],
  ['TL', 'TLS', "Timor-Leste", 'M', 0, 0],
  ['TG', 'TGO', "Togo", 'M', 0, 0],
  ['TO', 'TON', "Tonga", 'M', 0, 0],
  ['TT', 'TTO', "Trinidad and Tobago", 'M', 0, 0],
  ['TN', 'TUN', "Tunisia", 'M', 1, 0],
  ['TR', 'TUR', "Turkey", 'M', 1, 1],
  ['TM', 'TKM', "Turkmenistan", 'M', 1, 0],
  ['TV', 'TUV', "Tuvalu", 'M', 0, 0],
  ['UG', 'UGA', "Uganda", 'M', 1, 0],
  ['UA', 'UKR', "Ukraine", 'M', 1, 0],
  ['AE', 'ARE', "United Arab Emirates", 'M', 1, 0],
  ['GB', 'GBR', "United Kingdom", 'M', 1, 1],
  ['TZ', 'TZA', "Tanzania", 'M', 1, 0],
  ['US', 'USA', "United States", 'M', 1, 1],
  ['UY', 'URY', "Uruguay", 'M', 1, 0],
  ['UZ', 'UZB', "Uzbekistan", 'M', 1, 0],
  ['VU', 'VUT', "Vanuatu", 'M', 0, 0],
  ['VE', 'VEN', "Venezuela", 'M', 1, 0],
  ['VN', 'VNM', "Vietnam", 'M', 1, 0],
  ['YE', 'YEM', "Yemen", 'M', 1, 0],
  ['ZM', 'ZMB', "Zambia", 'M', 1, 0],
  ['ZW', 'ZWE', "Zimbabwe", 'M', 1, 0],
  ['VA', 'VAT', "Vatican City (Holy See)", 'O', 0, 0],
  ['PS', 'PSE', "State of Palestine", 'O', 1, 0],
  ['TW', 'TWN', "Taiwan", 'P', 1, 0],
  ['XK', 'XKX', "Kosovo", 'P', 0, 0],
];

export const SOVEREIGN_ROSTER: readonly RosterEntry[] = ROWS.map(([iso2, iso3, name, sov, regional, existing]): RosterEntry => {
  const excluded = EXCLUDED[iso2];
  return {
    id: iso2,
    iso2,
    iso3,
    name,
    sovereignty: SOVEREIGNTY[sov],
    geoKey: excluded ? null : (GEOKEY_OVERRIDES[iso2] ?? iso3),
    regionalGeo: regional === 1,
    profileStatus: existing === 1 ? 'existing' : 'stub',
    inRoster: !excluded,
    ...(excluded ? { reason: excluded } : {}),
  };
});

/** The six existing breakaway entities (separate namespace, never part of SOVEREIGN_ROSTER). */
export const BREAKAWAY_IDS = ['SY_SDF', 'LY_LNA', 'SD_RSF', 'MM_NUG_PDF', 'YE_HOU', 'CD_M23'] as const;

export const PLAYABLE_ROSTER: readonly RosterEntry[] = SOVEREIGN_ROSTER.filter(e => e.inRoster);
const BY_ID = new Map(SOVEREIGN_ROSTER.map(e => [e.id, e] as const));
const BY_ISO3 = new Map(SOVEREIGN_ROSTER.map(e => [e.iso3, e] as const));
const BY_GEOKEY = new Map(SOVEREIGN_ROSTER.filter(e => e.geoKey).map(e => [e.geoKey as string, e] as const));

export const getRosterEntry = (id: string): RosterEntry | undefined => BY_ID.get(id.toUpperCase());
export const getRosterEntryByIso3 = (iso3: string): RosterEntry | undefined => BY_ISO3.get(iso3.toUpperCase());
/** Resolve a world-dataset feature to a roster entry through adm0_a3 only (no name matching, no substring matching). */
export const getRosterEntryByGeoKey = (adm0a3: string): RosterEntry | undefined => BY_GEOKEY.get(adm0a3.toUpperCase());

/** Deterministic flag emoji from ISO 3166-1 alpha-2 (regional indicator symbols). */
export const flagFromIso2 = (iso2: string): string =>
  iso2.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
