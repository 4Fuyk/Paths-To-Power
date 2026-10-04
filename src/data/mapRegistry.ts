/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RegionLevel = 'admin1' | 'admin2';

export interface CountryMapConfig {
  iso2: string;
  iso3: string;
  name: string;
  url: string;
  regionLevel: RegionLevel;
  nameProperty: string;
  altNameProperties: string[];
  countryNameProperty?: string;
  fallbackUrls?: string[];
}

export interface MapLoadResult {
  data: any | null;
  source: 'local' | 'fallback' | 'world_filtered' | 'none';
  error?: string;
}

// Complete ISO-2 to ISO-3 lookup dictionary for worldwide automatic mapping
export const ISO2_TO_ISO3: Record<string, string> = {
  // Playable Countries
  FR: 'FRA', RO: 'ROU', HU: 'HUN', CA: 'CAN', AR: 'ARG', ZA: 'ZAF',
  IN: 'IND', IT: 'ITA', ID: 'IDN', MX: 'MEX', ES: 'ESP', KR: 'KOR',
  AU: 'AUS', TR: 'TUR', US: 'USA', DE: 'DEU', GB: 'GBR', BR: 'BRA',
  JP: 'JPN', EG: 'EGY', RU: 'RUS', CL: 'CHL', IS: 'ISL', PT: 'PRT',
  GR: 'GRC', PL: 'POL',

  // Civil War Belligerents & African Nations
  SY: 'SYR', LY: 'LBY', SD: 'SDN', MM: 'MMR', YE: 'YEM', SO: 'SOM',
  ML: 'MLI', CD: 'COD', CG: 'COG', ET: 'ETH', HT: 'HTI',

  // Other Global / Scenario Nations
  UA: 'UKR', SE: 'SWE', TW: 'TWN', SA: 'SAU', IR: 'IRN', IL: 'ISR',
  PS: 'PSE', CN: 'CHN', KP: 'PRK', IQ: 'IRQ', AF: 'AFG', PK: 'PAK',
  AZ: 'AZE', AM: 'ARM', CY: 'CYP', NO: 'NOR', FI: 'FIN', DK: 'DNK',
  NL: 'NLD', BE: 'BEL', CH: 'CHE', AT: 'AUT', CZ: 'CZE', NZ: 'NZL',
  NG: 'NGA', DZ: 'DZA', MA: 'MAR', CO: 'COL', PE: 'PER', VE: 'VEN',
  VN: 'VNM', TH: 'THA', PH: 'PHL', MY: 'MYS', SG: 'SGP', GE: 'GEO',
  LB: 'LBN', JO: 'JOR', KW: 'KWT', QA: 'QAT', AE: 'ARE', OM: 'OMN',
  BD: 'BGD', LK: 'LKA', NP: 'NPL', KZ: 'KAZ', UZ: 'UZB', TM: 'TKM',
  TJ: 'TJK', KG: 'KGZ', MN: 'MNG', BY: 'BLR', MD: 'MDA', BG: 'BGR',
  RS: 'SRB', HR: 'HRV', BA: 'BIH', AL: 'ALB', MK: 'MKD', ME: 'MNE',
  XK: 'XKX', SI: 'SVN', SK: 'SVK', EE: 'EST', LV: 'LVA', LT: 'LTU',
  IE: 'IRL', CU: 'CUB', DO: 'DOM', PR: 'PRI', PA: 'PAN', CR: 'CRI',
  NI: 'NIC', HN: 'HND', SV: 'SLV', GT: 'GTM', EC: 'ECU', BO: 'BOL',
  PY: 'PRY', UY: 'URY', GH: 'GHA', KE: 'KEN', TZ: 'TZA', UG: 'UGA',
  RW: 'RWA', AO: 'AGO', MZ: 'MOZ', ZW: 'ZWE', ZM: 'ZMB', SN: 'SEN',
  CI: 'CIV', CM: 'CMR', TN: 'TUN', LU: 'LUX', MT: 'MLT', LI: 'LIE',
  MC: 'MCO', AD: 'AND', SM: 'SMR', VA: 'VAT',

  // Historical Nation Aliases
  SU: 'RUS', // Soviet Union core
  YU: 'SRB', // Yugoslavia core
  CS: 'CZE', // Czechoslovakia core
  DDR: 'DEU' // East Germany
};

export const ISO3_TO_ISO2: Record<string, string> = Object.entries(ISO2_TO_ISO3).reduce(
  (acc, [k, v]) => {
    if (!acc[v]) acc[v] = k;
    return acc;
  },
  {} as Record<string, string>
);

const DEFAULT_ALT_NAME_PROPS = [
  'NAME_1',
  'VARNAME_1',
  'NL_NAME_1',
  'shapeName',
  'name',
  'NAME',
  'nom',
  'NOM',
  'name_en',
  'NAME_EN',
  'name_latin',
  'NAME_LATIN',
  'provincia',
  'PROVINCIA',
  'state',
  'STATE',
  'ADM1_EN',
  'adm1_name',
  'EER13NM',
  'NAME_2',
  'HASC_1',
  'ISO_1'
];

/**
 * Standard registry of explicit map configs for playable and conflict nations
 */
export const COUNTRY_MAP_REGISTRY: Record<string, CountryMapConfig> = {
  // Playable Countries
  TR: {
    iso2: 'TR',
    iso3: 'TUR',
    name: 'Turkey',
    url: '/geo/tur.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities.json',
      '/world_admin0_50m.geojson'
    ]
  },
  DE: {
    iso2: 'DE',
    iso3: 'DEU',
    name: 'Germany',
    url: '/geo/deu.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json',
      '/world_admin0_50m.geojson'
    ]
  },
  US: {
    iso2: 'US',
    iso3: 'USA',
    name: 'United States of America',
    url: '/geo/usa.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json',
      '/world_admin0_50m.geojson'
    ]
  },
  FR: {
    iso2: 'FR',
    iso3: 'FRA',
    name: 'France',
    url: '/geo/fra.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/france-regions.geojson',
      '/world_admin0_50m.geojson'
    ]
  },
  GB: {
    iso2: 'GB',
    iso3: 'GBR',
    name: 'United Kingdom',
    url: '/geo/gbr.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/eer.json',
      '/world_admin0_50m.geojson'
    ]
  },
  CA: {
    iso2: 'CA',
    iso3: 'CAN',
    name: 'Canada',
    url: '/geo/can.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/canada.geojson',
      '/world_admin0_50m.geojson'
    ]
  },
  RO: {
    iso2: 'RO',
    iso3: 'ROU',
    name: 'Romania',
    url: '/geo/rou.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  HU: {
    iso2: 'HU',
    iso3: 'HUN',
    name: 'Hungary',
    url: '/geo/hun.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  AR: {
    iso2: 'AR',
    iso3: 'ARG',
    name: 'Argentina',
    url: '/geo/arg.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  ZA: {
    iso2: 'ZA',
    iso3: 'ZAF',
    name: 'South Africa',
    url: '/geo/zaf.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  IN: {
    iso2: 'IN',
    iso3: 'IND',
    name: 'India',
    url: '/geo/ind.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  IT: {
    iso2: 'IT',
    iso3: 'ITA',
    name: 'Italy',
    url: '/geo/ita.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  ID: {
    iso2: 'ID',
    iso3: 'IDN',
    name: 'Indonesia',
    url: '/geo/idn.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  MX: {
    iso2: 'MX',
    iso3: 'MEX',
    name: 'Mexico',
    url: '/geo/mex.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  ES: {
    iso2: 'ES',
    iso3: 'ESP',
    name: 'Spain',
    url: '/geo/esp.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  KR: {
    iso2: 'KR',
    iso3: 'KOR',
    name: 'South Korea',
    url: '/geo/kor.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  AU: {
    iso2: 'AU',
    iso3: 'AUS',
    name: 'Australia',
    url: '/geo/aus.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  BR: {
    iso2: 'BR',
    iso3: 'BRA',
    name: 'Brazil',
    url: '/geo/bra.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  JP: {
    iso2: 'JP',
    iso3: 'JPN',
    name: 'Japan',
    url: '/geo/jpn.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  EG: {
    iso2: 'EG',
    iso3: 'EGY',
    name: 'Egypt',
    url: '/geo/egy.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/egypt-provinces.geojson', '/world_admin0_50m.geojson']
  },
  RU: {
    iso2: 'RU',
    iso3: 'RUS',
    name: 'Russia',
    url: '/russia.geojson?v=2021_duma',
    regionLevel: 'admin1',
    nameProperty: 'shapeName',
    altNameProperties: ['name', 'NAME_1', ...DEFAULT_ALT_NAME_PROPS],
    countryNameProperty: 'shapeGroup',
    fallbackUrls: ['/geo/rus.geojson', '/world_admin0_50m.geojson']
  },
  CL: {
    iso2: 'CL',
    iso3: 'CHL',
    name: 'Chile',
    url: '/geo/chl.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/chile.geojson', '/world_admin0_50m.geojson']
  },
  IS: {
    iso2: 'IS',
    iso3: 'ISL',
    name: 'Iceland',
    url: '/geo/isl.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/iceland.geojson', '/world_admin0_50m.geojson']
  },
  PT: {
    iso2: 'PT',
    iso3: 'PRT',
    name: 'Portugal',
    url: '/geo/prt.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/portugal.geojson', '/world_admin0_50m.geojson']
  },
  GR: {
    iso2: 'GR',
    iso3: 'GRC',
    name: 'Greece',
    url: '/geo/grc.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/greece.geojson', '/world_admin0_50m.geojson']
  },
  PL: {
    iso2: 'PL',
    iso3: 'POL',
    name: 'Poland',
    url: '/geo/pol.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },

  // Civil War / Major Conflict Countries
  SY: {
    iso2: 'SY',
    iso3: 'SYR',
    name: 'Syria',
    url: '/geo/syr.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/syria.geojson', '/world_admin0_50m.geojson']
  },
  LY: {
    iso2: 'LY',
    iso3: 'LBY',
    name: 'Libya',
    url: '/geo/libya.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/geo/lby.geojson', '/libya.geojson']
  },
  SD: {
    iso2: 'SD',
    iso3: 'SDN',
    name: 'Sudan',
    url: '/geo/sdn.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/sudan.geojson', '/world_admin0_50m.geojson']
  },
  MM: {
    iso2: 'MM',
    iso3: 'MMR',
    name: 'Myanmar',
    url: '/geo/mmr.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/myanmar.geojson', '/world_admin0_50m.geojson']
  },
  YE: {
    iso2: 'YE',
    iso3: 'YEM',
    name: 'Yemen',
    url: '/geo/yem.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/yemen.geojson', '/world_admin0_50m.geojson']
  },
  SO: {
    iso2: 'SO',
    iso3: 'SOM',
    name: 'Somalia',
    url: '/geo/som.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  ML: {
    iso2: 'ML',
    iso3: 'MLI',
    name: 'Mali',
    url: '/geo/mli.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  CD: {
    iso2: 'CD',
    iso3: 'COD',
    name: 'Democratic Republic of the Congo',
    url: '/geo/cod.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  COD: {
    iso2: 'CD',
    iso3: 'COD',
    name: 'Democratic Republic of the Congo',
    url: '/geo/cod.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  CG: {
    iso2: 'CG',
    iso3: 'COG',
    name: 'Republic of the Congo',
    url: '/geo/cog.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  COG: {
    iso2: 'CG',
    iso3: 'COG',
    name: 'Republic of the Congo',
    url: '/geo/cog.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  ET: {
    iso2: 'ET',
    iso3: 'ETH',
    name: 'Ethiopia',
    url: '/geo/eth.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  HT: {
    iso2: 'HT',
    iso3: 'HTI',
    name: 'Haiti',
    url: '/geo/hti.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  UA: {
    iso2: 'UA',
    iso3: 'UKR',
    name: 'Ukraine',
    url: '/geo/ukr.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  FI: {
    iso2: 'FI',
    iso3: 'FIN',
    name: 'Finland',
    url: '/geo/fin.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  NO: {
    iso2: 'NO',
    iso3: 'NOR',
    name: 'Norway',
    url: '/geo/nor.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  SE: {
    iso2: 'SE',
    iso3: 'SWE',
    name: 'Sweden',
    url: '/geo/swe.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  },
  CH: {
    iso2: 'CH',
    iso3: 'CHE',
    name: 'Switzerland',
    url: '/geo/che.geojson',
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: ['/world_admin0_50m.geojson']
  }
};

/**
 * Automatically resolve or construct a CountryMapConfig for any country code.
 * Zero manual wiring required when adding new countries!
 */
export function getCountryMapConfig(countryIdOrIso: string, countryName?: string): CountryMapConfig {
  const code = (countryIdOrIso || '').trim().toUpperCase();
  
  if (COUNTRY_MAP_REGISTRY[code]) {
    return COUNTRY_MAP_REGISTRY[code];
  }

  // Check if code is ISO3 (e.g. 'TUR', 'FRA')
  const iso3 = code.length === 3 ? code : (ISO2_TO_ISO3[code] || code);
  const iso2 = code.length === 2 ? code : (ISO3_TO_ISO2[code] || code);
  const name = countryName || code;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    iso2,
    iso3,
    name,
    url: `/geo/${iso3.toLowerCase()}.geojson`,
    regionLevel: 'admin1',
    nameProperty: 'NAME_1',
    altNameProperties: DEFAULT_ALT_NAME_PROPS,
    countryNameProperty: 'GID_0',
    fallbackUrls: [
      `/geo/${slug}.geojson`,
      `/${slug}.geojson`,
      `/geo/${iso2.toLowerCase()}.geojson`,
      `/${iso2.toLowerCase()}.geojson`,
      '/world_admin0_50m.geojson'
    ]
  };
}

// In-memory cache for loaded GeoJSON datasets
const geoJsonCache: Record<string, any> = {};

/**
 * Fetch and validate a JSON file safely
 */
async function fetchJsonSafely(url: string): Promise<any | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data.type === 'FeatureCollection' || Array.isArray(data.features))) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Filters the shared world admin-0 dataset to extract a specific country's boundary features.
 */
function filterWorldAdmin0ForCountry(worldData: any, iso2: string, iso3: string, countryName: string): any | null {
  if (!worldData || !Array.isArray(worldData.features)) return null;

  const targetIso2 = iso2.toUpperCase();
  const targetIso3 = iso3.toUpperCase();
  const targetName = countryName.toLowerCase().replace(/[^a-z]/g, '');

  const matchingFeatures = worldData.features.filter((f: any) => {
    if (!f || !f.properties) return false;
    const p = f.properties;

    const fIso3 = String(p.ISO_A3 || p.iso_a3 || p.ADM0_A3 || p.adm0_a3 || p.GID_0 || f.id || '').toUpperCase();
    const fIso2 = String(p.ISO_A2 || p.iso_a2 || p.WB_A2 || '').toUpperCase();
    const fName = String(p.NAME || p.name || p.ADMIN || p.admin || p.NAME_LONG || '').toLowerCase().replace(/[^a-z]/g, '');

    if (fIso3 === targetIso3 || (fIso3 !== '-99' && fIso3 === targetIso3)) return true;
    if (fIso2 === targetIso2 && targetIso2.length === 2) return true;

    // Strict Congo distinction to prevent cross-contamination
    if (targetIso2 === 'CD' || targetIso3 === 'COD') {
      return fName.includes('dem') || fName.includes('kinshasa') || fName.includes('drc') || fIso3 === 'COD' || fIso3 === 'ZAR';
    }
    if (targetIso2 === 'CG' || targetIso3 === 'COG') {
      if (fName.includes('dem') || fName.includes('kinshasa') || fName.includes('drc')) return false;
      return fName.includes('brazzaville') || fName.includes('republicofthecongo') || fIso3 === 'COG';
    }

    if (targetName && (fName.includes(targetName) || targetName.includes(fName))) return true;

    return false;
  });

  if (matchingFeatures.length > 0) {
    return {
      type: 'FeatureCollection',
      features: matchingFeatures
    };
  }

  return null;
}

/**
 * Standard Fallback Chain (in strict order):
 * a. Local file public/geo/{iso3}.geojson (or configured url)
 * b. Candidate fallback URLs
 * c. Filter shared world admin-0 file by ISO_A3/ISO_A2 to draw country outline
 * d. If all fail, return null with descriptive error (NEVER draw wrong country).
 */
function validateAdmin1Features(data: any, iso3: string): boolean {
  if (!data || !Array.isArray(data.features) || data.features.length === 0) return false;
  
  // Reject invalid, empty or single-rectangle map data
  if (data.features.length < 3) {
    console.warn(`[MapRegistry] Rejected invalid or insufficient map data for ${iso3}: requires at least 3 administrative features, found ${data.features.length}`);
    return false;
  }

  // Ensure features are not just placeholder single-rectangles
  const hasValidGeometry = data.features.some((f: any) => {
    if (!f || !f.geometry) return false;
    const geomType = f.geometry.type;
    return geomType === 'Polygon' || geomType === 'MultiPolygon';
  });

  if (!hasValidGeometry) {
    console.warn(`[MapRegistry] Rejected map data for ${iso3}: no valid Polygon or MultiPolygon geometries found.`);
    return false;
  }

  return true;
}

export async function loadCountryMapData(
  countryId: string,
  countryName?: string
): Promise<MapLoadResult> {
  const config = getCountryMapConfig(countryId, countryName);
  const cacheKey = config.iso3;

  if (geoJsonCache[cacheKey]) {
    if (validateAdmin1Features(geoJsonCache[cacheKey], config.iso3)) {
      return { data: geoJsonCache[cacheKey], source: 'local' };
    }
  }

  // 1. Try local primary file (e.g. /geo/tur.geojson, /geo/cod.geojson, /geo/cog.geojson)
  const primaryData = await fetchJsonSafely(config.url);
  if (primaryData) {
    if (validateAdmin1Features(primaryData, config.iso3)) {
      geoJsonCache[cacheKey] = primaryData;
      return { data: primaryData, source: 'local' };
    }
  }

  // 2. Try secondary fallback URLs if defined
  if (config.fallbackUrls && config.fallbackUrls.length > 0) {
    for (const url of config.fallbackUrls) {
      if (url.includes('world_admin0_50m.geojson')) continue; // Handled in step 3
      const fallbackData = await fetchJsonSafely(url);
      if (fallbackData) {
        if (validateAdmin1Features(fallbackData, config.iso3)) {
          geoJsonCache[cacheKey] = fallbackData;
          return { data: fallbackData, source: 'fallback' };
        }
      }
    }
  }

  // 3. Fallback to filtering shared world admin-0 file
  const worldData = await fetchJsonSafely('/world_admin0_50m.geojson');
  if (worldData) {
    const filtered = filterWorldAdmin0ForCountry(worldData, config.iso2, config.iso3, config.name);
    if (filtered && validateAdmin1Features(filtered, config.iso3)) {
      geoJsonCache[cacheKey] = filtered;
      return { data: filtered, source: 'world_filtered' };
    }
  }

  // 4. Everything failed or had fewer than 3 features: show Map data unavailable and log the missing ISO/file clearly. Never fall back to Turkey, Libya or a generic rectangle.
  const displayName = countryName || config.name || countryId;
  console.warn(`[MapRegistry] Map data unavailable for ${displayName} (ISO2: ${config.iso2}, ISO3: ${config.iso3}, file: ${config.url})`);
  return {
    data: null,
    source: 'none',
    error: `Map data unavailable for ${displayName}`
  };
}

/**
 * Extracts normalized feature name from standard GADM or custom GeoJSON properties
 */
export function getFeatureRegionName(feature: any, config?: CountryMapConfig): string {
  if (!feature || !feature.properties) return '';
  const p = feature.properties;

  if (config && config.nameProperty && p[config.nameProperty]) {
    return String(p[config.nameProperty]).trim();
  }

  const propsToTry = config?.altNameProperties || DEFAULT_ALT_NAME_PROPS;
  for (const key of propsToTry) {
    if (p[key] && typeof p[key] === 'string' && p[key].trim().length > 0) {
      return p[key].trim();
    }
  }

  return p.name || p.NAME || p.id || '';
}

/**
 * Dev-time auto-validation: logs clear console warning listing any playable countries
 * that lack a local GeoJSON file so missing maps are caught immediately.
 */
export async function validatePlayableCountriesMaps(
  countries: { id: string; name: string }[]
): Promise<void> {
  const missing: string[] = [];

  for (const c of countries) {
    const config = getCountryMapConfig(c.id, c.name);
    try {
      const res = await fetch(config.url, { method: 'HEAD' });
      if (!res.ok) {
        missing.push(`${c.name} (${c.id}) -> ${config.url}`);
      }
    } catch {
      missing.push(`${c.name} (${c.id}) -> ${config.url}`);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[MapRegistry DEV WARNING] ${missing.length} playable country map(s) missing local GeoJSON:\n` +
      missing.map(m => ` - ${m}`).join('\n')
    );
  } else {
    console.info(`[MapRegistry] All ${countries.length} playable country maps verified in /public/geo/.`);
  }
}
