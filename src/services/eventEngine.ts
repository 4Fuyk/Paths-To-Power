import { 
  Country, 
  Party, 
  DynamicGameEvent, 
  GameEventChoice, 
  ResolvedEventLog, 
  OngoingSituation 
} from '../types';
import { DYNAMIC_EVENTS_BANK } from '../constants/dynamicEvents';

export interface EventExecutionResult {
  updatedTreasuryDelta: number;
  updatedInflationDelta: number;
  updatedReputationDelta: number;
  updatedConfidenceDelta: number;
  updatedFreedomDelta: number;
  updatedCivilWarDelta: number;
  updatedApprovalDelta: number;
  relationDeltas: Record<string, number>;
  voterApprovalDeltas?: Partial<Record<string, number>>;
  spawnedSituation?: OngoingSituation;
  logEntry: ResolvedEventLog;
}

/**
 * Checks if a dynamic event should trigger on this turn/month
 */
export function evaluateEventTrigger(params: {
  isRuling: boolean;
  currentTurnOrMonth: number;
  country: Country;
  scenarioYear: string;
  resolvedEventIds: string[];
  hasPendingEvent: boolean;
  turnsSinceLastEvent?: number;
  lastEventCategory?: string | null;
  stability?: number;
  forceType?: 'DOMESTIC' | 'GLOBAL';
}): DynamicGameEvent | null {
  const {
    isRuling,
    currentTurnOrMonth,
    country,
    scenarioYear,
    resolvedEventIds,
    hasPendingEvent,
    turnsSinceLastEvent = 99,
    lastEventCategory = null,
    stability = 60,
    forceType
  } = params;

  // 1. Never fire if there is already an unhandled/pending event modal
  if (hasPendingEvent) return null;

  // 2. Cooldown enforcement: at least 2 turns must pass after any event before a new one can fire
  if (!forceType && turnsSinceLastEvent < 2) {
    return null;
  }

  // 3. Weighted roll: base chance 25% per week/turn, +15% if stability < 40 (40% total)
  if (!forceType) {
    let triggerChance = 0.25;
    if (stability < 40) {
      triggerChance += 0.15; // 40% if stability is critical / fragile
    }
    const roll = Math.random();
    if (roll > triggerChance) {
      return null;
    }
  }

  // 4. Filter available unhandled events from the bank
  let availableEvents = DYNAMIC_EVENTS_BANK.filter(e => !resolvedEventIds.includes(e.id) && !resolvedEventIds.includes(e.title));
  if (availableEvents.length === 0) return null;

  // 5. Scenario Year Compatibility (if event is tied to a specific scenario)
  availableEvents = availableEvents.filter(e => !e.scenarioYear || e.scenarioYear === 'ANY' || e.scenarioYear === scenarioYear);

  // 6. Election Phase Filter:
  // During the election phase only campaign/political/scandal/social events may fire — no war, diplomacy or economy-crisis events!
  if (!isRuling) {
    availableEvents = availableEvents.filter(e => {
      const cat = (e.category || '').toUpperCase();
      // Exclude war (MILITARY), diplomacy (DIPLOMATIC), economy (ECONOMIC), and SECURITY
      const isExcluded = cat === 'MILITARY' || cat === 'DIPLOMATIC' || cat === 'ECONOMIC' || cat === 'SECURITY';
      return !isExcluded;
    });
  }

  if (availableEvents.length === 0) return null;

  // 7. Prevent back-to-back events of the same category
  if (lastEventCategory) {
    const nonSameCategory = availableEvents.filter(e => (e.category || '').toUpperCase() !== lastEventCategory.toUpperCase());
    if (nonSameCategory.length > 0) {
      availableEvents = nonSameCategory;
    }
  }

  // 8. Check domestic vs global candidate selection
  const targetType = forceType || (Math.random() < 0.60 ? 'DOMESTIC' : 'GLOBAL');

  let candidates: DynamicGameEvent[] = [];

  if (targetType === 'DOMESTIC') {
    // Look for exact country ID match
    candidates = availableEvents.filter(e => e.scope === 'DOMESTIC' && e.countryId === country.id);
    // If none for this specific country, look for 'ALL' or fallback
    if (candidates.length === 0) {
      candidates = availableEvents.filter(e => e.scope === 'DOMESTIC' && (!e.countryId || e.countryId === 'ALL'));
    }
  }

  // If no domestic candidates or target was global, use global
  if (candidates.length === 0 || targetType === 'GLOBAL') {
    candidates = availableEvents.filter(e => e.scope === 'GLOBAL');
  }

  // Final fallback to any available event
  if (candidates.length === 0) {
    candidates = availableEvents;
  }

  if (candidates.length === 0) return null;

  // Return a random candidate from the filtered pool
  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  return selected || null;
}

/**
 * Resolves a chosen event option and applies all mathematical and political consequences
 */
export function executeEventChoice(params: {
  event: DynamicGameEvent;
  choice: GameEventChoice;
  country: Country;
  playerParty: Party;
  currentDateString: string;
}): EventExecutionResult {
  const { event, choice, country, playerParty, currentDateString } = params;
  const effects = choice.effects;

  // Calculate domestic approval change weighted by party ideology
  let finalApprovalDelta = effects.approvalDelta || 0;
  
  // Apply ideological synergy if player party aligns with voter groups favored by choice
  if (effects.voterApprovalDelta && playerParty.ideology) {
    const ideology = playerParty.ideology.toLowerCase();
    if (ideology.includes('social') || ideology.includes('democrat')) {
      if (effects.voterApprovalDelta.Workers) finalApprovalDelta += (effects.voterApprovalDelta.Workers * 0.2);
    } else if (ideology.includes('national')) {
      if (effects.voterApprovalDelta.Nationalists) finalApprovalDelta += (effects.voterApprovalDelta.Nationalists * 0.2);
    } else if (ideology.includes('liberal')) {
      if (effects.voterApprovalDelta.Liberals) finalApprovalDelta += (effects.voterApprovalDelta.Liberals * 0.2);
    } else if (ideology.includes('conservative') || ideology.includes('traditional')) {
      if (effects.voterApprovalDelta.Traditionalists) finalApprovalDelta += (effects.voterApprovalDelta.Traditionalists * 0.2);
    }
  }

  // Prepare situation if choice spawns one
  let spawnedSituation: OngoingSituation | undefined = undefined;
  if (choice.spawnSituation) {
    spawnedSituation = {
      ...choice.spawnSituation,
      id: `sit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
  }

  // Prepare consequence summary for the persistent history log
  const consequencesParts: string[] = [];
  if (effects.treasuryDelta) consequencesParts.push(`${effects.treasuryDelta > 0 ? '+' : ''}${effects.treasuryDelta.toLocaleString()} ₺`);
  if (effects.inflationDelta) consequencesParts.push(`${effects.inflationDelta > 0 ? '+' : ''}${effects.inflationDelta}% Inflation`);
  if (effects.reputationDelta) consequencesParts.push(`${effects.reputationDelta > 0 ? '+' : ''}${effects.reputationDelta} Rep`);
  if (effects.confidenceDelta) consequencesParts.push(`${effects.confidenceDelta > 0 ? '+' : ''}${effects.confidenceDelta} Confidence`);
  if (finalApprovalDelta) consequencesParts.push(`${finalApprovalDelta > 0 ? '+' : ''}${Math.round(finalApprovalDelta)}% Approval`);
  if (effects.civilWarRiskDelta) consequencesParts.push(`${effects.civilWarRiskDelta > 0 ? '+' : ''}${effects.civilWarRiskDelta}% War Risk`);
  if (effects.relationDeltas) {
    const relStrings = Object.entries(effects.relationDeltas).map(([code, d]) => `${code}: ${d > 0 ? '+' : ''}${d}`);
    consequencesParts.push(`Relations (${relStrings.join(', ')})`);
  }

  const consequencesSummary = consequencesParts.length > 0 ? consequencesParts.join(' | ') : 'Resolved smoothly with minor administrative effects.';

  const logEntry: ResolvedEventLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: currentDateString,
    scope: event.scope,
    title: event.title,
    category: event.category,
    icon: event.icon,
    countryName: country.name,
    chosenOptionText: choice.text,
    outcomeNarrative: choice.outcomeNarrative,
    consequencesSummary
  };

  return {
    updatedTreasuryDelta: effects.treasuryDelta || 0,
    updatedInflationDelta: effects.inflationDelta || 0,
    updatedReputationDelta: effects.reputationDelta || 0,
    updatedConfidenceDelta: effects.confidenceDelta || 0,
    updatedFreedomDelta: effects.freedomDelta || 0,
    updatedCivilWarDelta: effects.civilWarRiskDelta || 0,
    updatedApprovalDelta: Math.round(finalApprovalDelta),
    relationDeltas: effects.relationDeltas || {},
    voterApprovalDeltas: effects.voterApprovalDelta,
    spawnedSituation,
    logEntry
  };
}
