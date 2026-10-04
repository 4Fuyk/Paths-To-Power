/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Country, ScenarioYear } from '../types';

export interface HistoricalValidity {
  validFrom: number;
  validUntil: number;
  successorId: string;
  successorName: string;
  allowedScenarios?: ScenarioYear[];
}

/**
 * Registry of historical states with their existence windows and modern successors.
 * Ensures dissolved or anachronistic states are never rendered in 2026.
 */
export const HISTORICAL_COUNTRY_VALIDITY: Record<string, HistoricalValidity> = {
  // Soviet Union -> Russian Federation
  SU: {
    validFrom: 1917,
    validUntil: 1991,
    successorId: 'RU',
    successorName: 'Russian Federation',
    allowedScenarios: ['1914', '1920', '1936', '1950']
  },
  SUN: {
    validFrom: 1917,
    validUntil: 1991,
    successorId: 'RU',
    successorName: 'Russian Federation',
    allowedScenarios: ['1914', '1920', '1936', '1950']
  },
  SU_WHITE: {
    validFrom: 1917,
    validUntil: 1922,
    successorId: 'RU',
    successorName: 'Russian Federation',
    allowedScenarios: ['1920']
  },

  // East Germany (GDR / DDR) -> Unified Germany
  DDR: {
    validFrom: 1949,
    validUntil: 1990,
    successorId: 'DE',
    successorName: 'Germany',
    allowedScenarios: ['1950']
  },

  // West Germany as a separate state entity -> Unified Germany
  DE_WEST: {
    validFrom: 1949,
    validUntil: 1990,
    successorId: 'DE',
    successorName: 'Germany',
    allowedScenarios: ['1950']
  },
  FRG: {
    validFrom: 1949,
    validUntil: 1990,
    successorId: 'DE',
    successorName: 'Germany',
    allowedScenarios: ['1950']
  },

  // Czechoslovakia -> Czechia (and Slovakia)
  CS: {
    validFrom: 1918,
    validUntil: 1992,
    successorId: 'CZ',
    successorName: 'Czechia',
    allowedScenarios: ['1920', '1936', '1950']
  },
  CSK: {
    validFrom: 1918,
    validUntil: 1992,
    successorId: 'CZ',
    successorName: 'Czechia',
    allowedScenarios: ['1920', '1936', '1950']
  },

  // Yugoslavia -> Serbia (and Balkan successors)
  YU: {
    validFrom: 1918,
    validUntil: 1992,
    successorId: 'RS',
    successorName: 'Serbia',
    allowedScenarios: ['1920', '1936', '1950']
  },
  YUG: {
    validFrom: 1918,
    validUntil: 1992,
    successorId: 'RS',
    successorName: 'Serbia',
    allowedScenarios: ['1920', '1936', '1950']
  },

  // Historical Zaire -> Democratic Republic of the Congo
  ZAR: {
    validFrom: 1971,
    validUntil: 1997,
    successorId: 'CD',
    successorName: 'Democratic Republic of the Congo',
    allowedScenarios: []
  }
};

/**
 * Modern-only countries that did not exist during early historical scenarios.
 */
export const MODERN_ONLY_COUNTRIES: Record<string, { validFrom: number; allowedScenarios: ScenarioYear[] }> = {
  RU: { validFrom: 1991, allowedScenarios: ['2026'] }, // In 1914/1920/1936/1950 represented by SU
  CZ: { validFrom: 1993, allowedScenarios: ['2026'] }, // In 1920/1936/1950 represented by CS
  SK: { validFrom: 1993, allowedScenarios: ['2026'] },
  RS: { validFrom: 1992, allowedScenarios: ['2026'] }, // In 1920/1936/1950 represented by YU
  HR: { validFrom: 1991, allowedScenarios: ['2026'] },
  SI: { validFrom: 1991, allowedScenarios: ['2026'] },
  BA: { validFrom: 1992, allowedScenarios: ['2026'] },
  ME: { validFrom: 2006, allowedScenarios: ['2026'] },
  MK: { validFrom: 1991, allowedScenarios: ['2026'] },
  // Modern civil war breakaways
  SY_SDF: { validFrom: 2012, allowedScenarios: ['2026'] },
  LY_LNA: { validFrom: 2014, allowedScenarios: ['2026'] },
  SD_RSF: { validFrom: 2013, allowedScenarios: ['2026'] },
  MM_NUG_PDF: { validFrom: 2021, allowedScenarios: ['2026'] },
  YE_HOU: { validFrom: 2004, allowedScenarios: ['2026'] },
  CD_M23: { validFrom: 2012, allowedScenarios: ['2026'] }
};

/**
 * Extracts a numeric year from ScenarioYear or string/number.
 */
export function parseScenarioYear(scenarioYear: ScenarioYear | string | number = '2026'): number {
  if (typeof scenarioYear === 'number') return scenarioYear;
  const str = String(scenarioYear).trim();
  const match = str.match(/\b(19\d\d|20\d\d)\b/);
  if (match) return parseInt(match[1], 10);
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? 2026 : parsed;
}

/**
 * Year-aware country validity check:
 * Returns true if the given country existed and was sovereign/active during the scenario year.
 * For the 2026 scenario, dissolved states (SU, DDR, CS, YU, ZAR, etc.) ALWAYS return false.
 */
export function isCountryActive(
  country: Country | string | null | undefined,
  scenarioYear: ScenarioYear | string | number = '2026'
): boolean {
  if (!country) return false;

  const id = typeof country === 'string' ? country.trim().toUpperCase() : country.id?.trim().toUpperCase();
  if (!id) return false;

  const year = parseScenarioYear(scenarioYear);
  const scenarioStr = (String(scenarioYear).trim() || '2026') as ScenarioYear;

  // 1. Check if explicitly defined on Country object
  if (typeof country === 'object' && country !== null) {
    if (country.validFrom !== undefined && year < country.validFrom) return false;
    if (country.validUntil !== undefined && year > country.validUntil) return false;
  }

  // 2. Check historical validity table
  const historical = HISTORICAL_COUNTRY_VALIDITY[id];
  if (historical) {
    if (year < historical.validFrom || year > historical.validUntil) {
      return false;
    }
    if (historical.allowedScenarios && historical.allowedScenarios.length > 0) {
      if (!historical.allowedScenarios.includes(scenarioStr) && !historical.allowedScenarios.includes(String(year) as ScenarioYear)) {
        return false;
      }
    }
    // Strict safeguard: 2026 scenario must never have obsolete states
    if (year >= 2000) {
      return false;
    }
  }

  // 3. Check modern-only countries during earlier historical scenarios
  const modernOnly = MODERN_ONLY_COUNTRIES[id];
  if (modernOnly) {
    if (year < modernOnly.validFrom) {
      return false;
    }
    if (modernOnly.allowedScenarios && !modernOnly.allowedScenarios.includes(scenarioStr) && !modernOnly.allowedScenarios.includes(String(year) as ScenarioYear)) {
      return false;
    }
  }

  return true;
}

/**
 * Resolves the valid successor country ID for dissolved or anachronistic states in a scenario.
 * e.g., in 2026:
 * SU -> RU (Russian Federation)
 * DDR -> DE (Unified Germany)
 * DE_WEST -> DE
 * CS -> CZ (Czechia)
 * YU -> RS (Serbia)
 * ZAR -> CD (DR Congo)
 */
export function getSuccessorCountryId(
  countryId: string,
  scenarioYear: ScenarioYear | string | number = '2026'
): string {
  if (!countryId) return countryId;
  const id = countryId.trim().toUpperCase();
  const year = parseScenarioYear(scenarioYear);

  if (year >= 1991) {
    const historical = HISTORICAL_COUNTRY_VALIDITY[id];
    if (historical?.successorId) {
      return historical.successorId;
    }
  }

  return id;
}

/**
 * Migration helper for old saved game IDs:
 * Maps obsolete historical IDs to valid modern IDs for the 2026 scenario.
 */
export function migrateCountryId(
  savedId: string,
  scenarioYear: ScenarioYear | string | number = '2026'
): string {
  if (!savedId) return savedId;
  const upper = savedId.trim().toUpperCase();
  const year = parseScenarioYear(scenarioYear);

  if (year >= 2000) {
    switch (upper) {
      case 'SU':
      case 'SUN':
      case 'SU_WHITE':
        return 'RU';
      case 'DDR':
      case 'DE_WEST':
      case 'FRG':
        return 'DE';
      case 'CS':
      case 'CSK':
        return 'CZ';
      case 'YU':
      case 'YUG':
        return 'RS';
      case 'ZAR':
        return 'CD';
      default:
        return savedId;
    }
  }

  return savedId;
}

/**
 * Deeply migrates a saved game state object to ensure no obsolete IDs recreate dead countries.
 */
export function migrateSavedGameState<T = any>(
  savedData: T,
  scenarioYear: ScenarioYear | string = '2026'
): T {
  if (!savedData || typeof savedData !== 'object') return savedData;

  try {
    const cloned = JSON.parse(JSON.stringify(savedData));

    // Migrate selected country ID
    if (cloned.selectedCountryId) {
      cloned.selectedCountryId = migrateCountryId(cloned.selectedCountryId, scenarioYear);
    }
    if (cloned.countryId) {
      cloned.countryId = migrateCountryId(cloned.countryId, scenarioYear);
    }

    // Migrate completedCountries array
    if (Array.isArray(cloned.completedCountries)) {
      cloned.completedCountries = Array.from(
        new Set(cloned.completedCountries.map((id: string) => migrateCountryId(id, scenarioYear)))
      );
    }

    // Migrate countryWinCounts keys
    if (cloned.countryWinCounts && typeof cloned.countryWinCounts === 'object') {
      const migratedWinCounts: Record<string, number> = {};
      Object.entries(cloned.countryWinCounts).forEach(([k, v]) => {
        const newKey = migrateCountryId(k, scenarioYear);
        migratedWinCounts[newKey] = (migratedWinCounts[newKey] || 0) + (Number(v) || 0);
      });
      cloned.countryWinCounts = migratedWinCounts;
    }

    // Migrate diplomaticRelations keys
    if (cloned.diplomaticRelations && typeof cloned.diplomaticRelations === 'object') {
      const migratedRelations: Record<string, any> = {};
      Object.entries(cloned.diplomaticRelations).forEach(([k, v]) => {
        const newKey = migrateCountryId(k, scenarioYear);
        // Do not preserve obsolete relations in 2026 if they couldn't be migrated to a modern state
        if (isCountryActive(newKey, scenarioYear)) {
          migratedRelations[newKey] = v;
        }
      });
      cloned.diplomaticRelations = migratedRelations;
    }

    return cloned;
  } catch (err) {
    console.warn('Failed to migrate saved game state:', err);
    return savedData;
  }
}

/**
 * Separate Congo entities:
 * Support both Democratic Republic of the Congo (Kinshasa) and Republic of the Congo (Brazzaville)
 */
export const CONGO_DRC = {
  iso2: 'CD',
  iso3: 'COD',
  name: 'Democratic Republic of the Congo',
  shortName: 'DR Congo',
  capital: 'Kinshasa',
  flag: '🇨🇩',
  geoFile: '/geo/cod.geojson',
  coords: [-4.4419, 15.2663] as [number, number]
};

export const CONGO_ROC = {
  iso2: 'CG',
  iso3: 'COG',
  name: 'Republic of the Congo',
  shortName: 'Congo-Brazzaville',
  capital: 'Brazzaville',
  flag: '🇨🇬',
  geoFile: '/geo/cog.geojson',
  coords: [-4.2634, 15.2429] as [number, number]
};

/**
 * Distinguishes between DR Congo (Kinshasa) and Republic of the Congo (Brazzaville)
 */
export function identifyCongo(
  idOrName: string
): 'CD' | 'CG' | null {
  if (!idOrName) return null;
  const s = idOrName.toLowerCase().trim();

  // Democratic Republic of the Congo (CD / COD / Kinshasa / DRC)
  if (
    s === 'cd' ||
    s === 'cod' ||
    s === 'zar' ||
    s === 'zaire' ||
    s.includes('kinshasa') ||
    s.includes('democratic republic') ||
    s.includes('drc') ||
    s === 'democratic republic of the congo' ||
    s === 'congo, democratic republic of the'
  ) {
    return 'CD';
  }

  // Republic of the Congo (CG / COG / Brazzaville)
  if (
    s === 'cg' ||
    s === 'cog' ||
    s.includes('brazzaville') ||
    s.includes('republic of the congo') ||
    s.includes('republic of congo') ||
    s.includes('congo-brazzaville') ||
    s === 'congo republic' ||
    s === 'congo'
  ) {
    return 'CG';
  }

  return null;
}
