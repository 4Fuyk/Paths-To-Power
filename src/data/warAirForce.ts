/**
 * Air Force & Aircraft Squadrons System
 * Handles Fighter, Bomber, and Close Air Support (CAS) Squadrons,
 * Mission Orders (Air Superiority, Bombing, Support Attack),
 * Ranges, Losses, and Combat Multipliers.
 */

export type AirSquadronType = 'fighter' | 'bomber' | 'cas';
export type AirMissionType = 'air_superiority' | 'bombing' | 'support_attack';

export interface AirSquadron {
  id: string;
  name: string;
  type: AirSquadronType;
  aircraftCount: number;
  maxAircraft: number;
  readiness: number; // 0 - 100%
  rangeKm: number; // in km (approx 100km per region hop)
  rangeHops: number; // max region distance from home base (e.g. 3 regions)
  lossesThisTurn: number;
  assignedMission?: {
    type: AirMissionType;
    targetRegionName: string;
    targetCoords?: [number, number];
    turnsRemaining: number;
  } | null;
}

export interface AirMissionResult {
  missionType: AirMissionType;
  targetRegion: string;
  success: boolean;
  message: string;
  enemyStrengthDamage: number; // percentage or troops
  enemySupplyDamage: number; // supply points reduced
  airSuperiorityGained: number; // +% air superiority
  friendlyLosses: number; // aircraft shot down
  enemyLosses: number; // enemy fighters or SAMs neutralized
}

/**
 * Default starting air wing for a combatant
 */
export function getInitialAirSquadrons(countryId: string, factionId?: string): AirSquadron[] {
  const prefix = factionId || countryId;
  return [
    {
      id: `sq_${prefix}_fighter_1`,
      name: '1st Air Dominance Wing (Fighters)',
      type: 'fighter',
      aircraftCount: 24,
      maxAircraft: 24,
      readiness: 95,
      rangeKm: 600,
      rangeHops: 3,
      lossesThisTurn: 0,
      assignedMission: null
    },
    {
      id: `sq_${prefix}_bomber_1`,
      name: '3rd Strategic Strike Squadron (Bombers)',
      type: 'bomber',
      aircraftCount: 16,
      maxAircraft: 16,
      readiness: 90,
      rangeKm: 900,
      rangeHops: 5,
      lossesThisTurn: 0,
      assignedMission: null
    },
    {
      id: `sq_${prefix}_cas_1`,
      name: '7th Ground Support Squadron (CAS)',
      type: 'cas',
      aircraftCount: 20,
      maxAircraft: 20,
      readiness: 92,
      rangeKm: 450,
      rangeHops: 2,
      lossesThisTurn: 0,
      assignedMission: null
    }
  ];
}

/**
 * Executes an Air Mission over a target region.
 * Calculates outcome, enemy damages, aircraft shoot-downs, and updates squadrons.
 */
export function executeAirMission(
  squadron: AirSquadron,
  targetRegion: string,
  missionType: AirMissionType,
  enemyAirDefenseFactor: number = 0.35 // 0.0 (no flak) to 0.70 (heavy S-300 / Patriot)
): { updatedSquadron: AirSquadron; result: AirMissionResult } {
  let friendlyLosses = 0;
  let enemyLosses = 0;
  let enemyStrengthDamage = 0;
  let enemySupplyDamage = 0;
  let airSuperiorityGained = 0;
  let message = '';

  // Calculate base effectiveness based on readiness and squadron strength
  const strengthRatio = squadron.aircraftCount / Math.max(1, squadron.maxAircraft);
  const readinessRatio = squadron.readiness / 100;
  const operationalPower = strengthRatio * readinessRatio;

  // Chance of enemy anti-air / interceptors shooting down aircraft
  const shootDownProbability = Math.min(0.65, enemyAirDefenseFactor * (squadron.type === 'bomber' ? 1.4 : squadron.type === 'cas' ? 1.2 : 0.8));
  const maxPossibleLosses = Math.max(1, Math.floor(squadron.aircraftCount * 0.15));

  if (Math.random() < shootDownProbability) {
    friendlyLosses = Math.floor(Math.random() * maxPossibleLosses) + 1;
  }

  const remainingAircraft = Math.max(0, squadron.aircraftCount - friendlyLosses);
  const nextReadiness = Math.max(40, squadron.readiness - 15);

  if (missionType === 'air_superiority') {
    airSuperiorityGained = Math.round(25 * operationalPower);
    enemyLosses = Math.floor(Math.random() * 2) + 1;
    message = `🛡️ Air Superiority Mission: ${squadron.name} established control over ${targetRegion}. Hostile airspace suppressed (+${airSuperiorityGained}% Air Superiority).`;
    if (friendlyLosses > 0) {
      message += ` Sustained ${friendlyLosses} fighter(s) lost to hostile surface-to-air missiles.`;
    }
  } else if (missionType === 'bombing') {
    enemyStrengthDamage = Math.round((18 + Math.random() * 12) * operationalPower); // 18% - 30%
    enemySupplyDamage = Math.round((22 + Math.random() * 15) * operationalPower); // 22% - 37%
    message = `💣 Strategic Bombing Run: ${squadron.name} struck fortified positions and supply depots in ${targetRegion}! Reduced enemy strength by ${enemyStrengthDamage}% and severed supply lines by -${enemySupplyDamage}%.`;
    if (friendlyLosses > 0) {
      message += ` Lost ${friendlyLosses} bomber(s) to enemy flak and anti-air fire.`;
    }
  } else if (missionType === 'support_attack') {
    message = `🎯 Close Air Support Sortie: ${squadron.name} delivered precision strikes on forward entrenchments in ${targetRegion}. Friendly ground forces granted +35% attack bonus!`;
    if (friendlyLosses > 0) {
      message += ` ${friendlyLosses} attack aircraft downed by enemy MANPADS.`;
    }
  }

  const updatedSquadron: AirSquadron = {
    ...squadron,
    aircraftCount: remainingAircraft,
    readiness: nextReadiness,
    lossesThisTurn: squadron.lossesThisTurn + friendlyLosses,
    assignedMission: {
      type: missionType,
      targetRegionName: targetRegion,
      turnsRemaining: 1
    }
  };

  const result: AirMissionResult = {
    missionType,
    targetRegion,
    success: true,
    message,
    enemyStrengthDamage,
    enemySupplyDamage,
    airSuperiorityGained,
    friendlyLosses,
    enemyLosses
  };

  return { updatedSquadron, result };
}
