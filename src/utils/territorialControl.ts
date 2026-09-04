/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Region, Country } from '../types';

const STORAGE_KEY = 'world_political_territory_control';

export interface CombatBelligerentForces {
  id: string;
  name: string;
  soldiers: number;
  tanks: number;
  aircraft: number;
  warships?: number;
  morale: number; // 0-100
  supplyScore?: number; // 0-100
  foreignAlliesBonus?: boolean;
}

export interface FrontlineBattleResult {
  captured: boolean;
  powerRatio: number;
  attackerPower: number;
  defenderPower: number;
  attackerLosses: { soldiers: number; tanks: number; aircraft: number };
  defenderLosses: { soldiers: number; tanks: number; aircraft: number };
  narrative: string;
  newControllerId: string;
  previousControllerId: string;
}

/**
 * Retrieves the global persistent territorial control registry
 */
export function getTerritoryControlMap(): Record<string, string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.warn('Failed to load territory control state', e);
    return {};
  }
}

/**
 * Saves a region's controller into the persistent registry
 */
export function setRegionController(regionId: string, newControllerId: string): void {
  try {
    const current = getTerritoryControlMap();
    current[regionId] = newControllerId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save territory control state', e);
  }
}

/**
 * Batch updates multiple region controllers
 */
export function setBatchRegionControllers(updates: Record<string, string>): void {
  try {
    const current = getTerritoryControlMap();
    const merged = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save batch territory control state', e);
  }
}

/**
 * Resolves current controller of a region given default owner
 */
export function resolveRegionController(regionId: string, defaultOwnerId: string): string {
  const controlMap = getTerritoryControlMap();
  return controlMap[regionId] || defaultOwnerId;
}

/**
 * Resets all territorial control to default scenario borders
 */
export function resetTerritoryControl(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset territory control state', e);
  }
}

/**
 * Deterministic military power calculator based on actual forces, equipment, supply, terrain, morale, and allies.
 * Strictly avoids random drift.
 */
export function calculateCombatPower(
  forces: CombatBelligerentForces,
  isDefending: boolean,
  terrainType: 'PLAINS' | 'MOUNTAINS' | 'URBAN' | 'MARSH' | 'COAST' = 'PLAINS',
  infrastructureLevel: number = 3
): number {
  // Base equipment firepower weighting
  const infantryFirepower = forces.soldiers * 1.0;
  const tankFirepower = forces.tanks * 28.0;
  const airFirepower = forces.aircraft * 35.0;
  const navalFirepower = (forces.warships || 0) * 45.0;

  const baseRawPower = infantryFirepower + tankFirepower + airFirepower + navalFirepower;

  // Morale modifier (0.5x at 0 morale, 1.25x at 100 morale)
  const moraleMultiplier = 0.5 + (Math.max(10, Math.min(100, forces.morale)) / 100) * 0.75;

  // Supply / Infrastructure modifier (1-5 scale: 0.8x to 1.3x)
  const supplyMultiplier = 0.7 + (Math.max(1, Math.min(5, infrastructureLevel)) * 0.12);

  // Foreign allied support bonus
  const alliedMultiplier = forces.foreignAlliesBonus ? 1.2 : 1.0;

  // Defense terrain multipliers
  let terrainMultiplier = 1.0;
  if (isDefending) {
    switch (terrainType) {
      case 'MOUNTAINS':
        terrainMultiplier = 1.45; // Mountain stronghold defense advantage
        break;
      case 'URBAN':
        terrainMultiplier = 1.35; // Dense urban warfare advantage
        break;
      case 'MARSH':
        terrainMultiplier = 1.25; // River / marsh bottleneck advantage
        break;
      case 'COAST':
        terrainMultiplier = 1.15; // Coastal artillery defense
        break;
      default:
        terrainMultiplier = 1.10; // Standard defensive line entrenchment
    }
  }

  const finalPower = baseRawPower * moraleMultiplier * supplyMultiplier * alliedMultiplier * terrainMultiplier;
  return Math.round(finalPower);
}

/**
 * Deterministic Frontline Engagement Resolver
 * Driven strictly by relative strength of belligerents.
 */
export function resolveDeterministicFrontlineBattle(
  attacker: CombatBelligerentForces,
  defender: CombatBelligerentForces,
  region: Region,
  terrainType: 'PLAINS' | 'MOUNTAINS' | 'URBAN' | 'MARSH' | 'COAST' = 'PLAINS'
): FrontlineBattleResult {
  const currentController = resolveRegionController(region.id, region.originalOwnerId || defender.id);
  const attackerPower = calculateCombatPower(attacker, false, terrainType, region.infrastructure);
  const defenderPower = calculateCombatPower(defender, true, terrainType, region.infrastructure);

  // Power Ratio calculation
  const safeDefenderPower = Math.max(1, defenderPower);
  const ratio = Number((attackerPower / safeDefenderPower).toFixed(2));

  // Determine outcome threshold
  // Ratio > 1.32 => Attacker overwhelms defensive perimeter and captures region
  const isCaptured = ratio > 1.32;

  // Calculate proportional deterministic casualties
  const attackerLossRatio = Math.min(0.25, Math.max(0.02, (1.0 / (ratio + 0.5)) * 0.12));
  const defenderLossRatio = isCaptured 
    ? Math.min(0.45, Math.max(0.10, ratio * 0.14))
    : Math.min(0.20, Math.max(0.03, (1.0 / ratio) * 0.08));

  const attackerLosses = {
    soldiers: Math.round(attacker.soldiers * attackerLossRatio),
    tanks: Math.round(attacker.tanks * attackerLossRatio * 0.8),
    aircraft: Math.round(attacker.aircraft * attackerLossRatio * 0.4)
  };

  const defenderLosses = {
    soldiers: Math.round(defender.soldiers * defenderLossRatio),
    tanks: Math.round(defender.tanks * defenderLossRatio * 0.9),
    aircraft: Math.round(defender.aircraft * defenderLossRatio * 0.5)
  };

  let narrative = '';
  let newController = currentController;

  if (isCaptured) {
    newController = attacker.id;
    setRegionController(region.id, attacker.id);
    narrative = `🚩 BORDER BREACH & SECTOR CAPTURE: ${attacker.name} concentrated overwhelming combat power (Ratio ${ratio}:1) against ${defender.name} defensive lines in ${region.name}, liberating the territory and pushing the frontline forward.`;
  } else if (ratio < 0.80) {
    narrative = `🛡️ DEFENSIVE REPULSE: ${defender.name} fortified tactical positions in ${region.name}, utilizing defensive terrain to crush ${attacker.name}'s offensive assault (Power Ratio ${ratio}:1).`;
  } else {
    narrative = `⚔️ STALEMATED FRONTLINE CLASH: Heavy artillery duels and localized skirmishes erupted in ${region.name} between ${attacker.name} and ${defender.name} (Power Ratio ${ratio}:1). Neither side achieved breakthrough.`;
  }

  return {
    captured: isCaptured,
    powerRatio: ratio,
    attackerPower,
    defenderPower,
    attackerLosses,
    defenderLosses,
    narrative,
    newControllerId: newController,
    previousControllerId: currentController
  };
}

/**
 * Permanently integrates captured regions into victor's sovereign state upon treaty ratification.
 */
export function applyPeaceDealAnnexation(
  victorCountry: Country,
  defeatedCountryId: string,
  occupiedRegions: Region[]
): Country {
  const currentControl = getTerritoryControlMap();
  
  // Find all regions controlled by victor from the defeated country
  const newRegions = [...victorCountry.regions];
  const newControlMapUpdates: Record<string, string> = {};

  occupiedRegions.forEach(reg => {
    const isOccupiedByVictor = (currentControl[reg.id] === victorCountry.id) || (reg.controlledBy === victorCountry.id);
    if (isOccupiedByVictor && !newRegions.some(r => r.id === reg.id)) {
      // Add region to victor's permanent state
      const annexedRegion: Region = {
        ...reg,
        controlledBy: victorCountry.id,
        originalOwnerId: defeatedCountryId,
        campaignLevel: Math.max(1, reg.campaignLevel - 1) // slight post-war reconstruction requirement
      };
      newRegions.push(annexedRegion);
      newControlMapUpdates[reg.id] = victorCountry.id;
    }
  });

  // Persist the new permanent control
  setBatchRegionControllers(newControlMapUpdates);

  // Recalculate total seats and update country
  const totalSeats = newRegions.reduce((sum, r) => sum + r.seats, 0);

  return {
    ...victorCountry,
    seats: totalSeats,
    regions: newRegions
  };
}
