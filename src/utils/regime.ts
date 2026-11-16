import type { Country } from '../types';

const NO_ELECTION_IDS = ['SU', 'DDR', 'CN', 'CS', 'KP', 'SA', 'AE', 'QA', 'OM', 'BH', 'CU', 'LA', 'ER', 'TM', 'BY'];
const NO_ELECTION_KEYWORDS = [
  'one-party', 'single-party', 'tek parti', 'communist', 'socialist state', 'socialist republic', 'socialist federal',
  'soviet', 'totalitarian', 'autocracy', 'junta', 'absolute monarchy', 'theocra', 'emirate', 'fascist', 'revolutionary assembly'
];

/** Serbest seçimin olmadığı ülke mi? (tek parti, otokrasi, mutlak monarşi, cunta...) Bu ülkelerde güç isyanla alınır. */
export function hasNoFreeElections(country: Country | null | undefined): boolean {
  if (!country) return false;
  if (NO_ELECTION_IDS.includes((country.id || '').toUpperCase())) return true;
  const sys = (country.system || '').toLowerCase();
  if (sys.includes('constitutional monarchy') || sys.includes('constitutional imperial')) return false;
  return NO_ELECTION_KEYWORDS.some(k => sys.includes(k));
}
