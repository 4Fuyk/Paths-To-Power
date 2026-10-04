/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Centralized Authority and Permissions System
 *
 * Enforces constitutional legality and authority across all countries (Russia, Ukraine, US, etc.):
 * - Cabinet, ministers, state finance controls, government policy and military command depend on actual authority.
 * - An election candidate or opposition party that has not won power cannot appoint ministers or command the military.
 * - During an election, the incumbent government / General Staff commands the war. The candidate can view
 *   frontline intelligence, troop dispositions, and casualties, but cannot issue sovereign military orders.
 * - Civil-war faction leaders are an exception: they command their own faction's units and war chest,
 *   while civilian ministries and sovereign election campaigns remain suspended.
 */

export interface AuthorityPermissions {
  canCommandMilitary: boolean;
  canAppointMinisters: boolean;
  canControlStateFinance: boolean;
  canConductStateDiplomacy: boolean;
  canRunElectionCampaign: boolean;
  isSpectatorOrObserverOnly: boolean;
  authorityRole: 'RULING_EXECUTIVE' | 'FACTION_COMMANDER' | 'OPPOSITION_CANDIDATE' | 'JUNIOR_MEMBER';
  authorityTitle: string;
  authorityDescription: string;
}

export function getAuthorityPermissions(params: {
  isRuling: boolean;
  countryMode?: string;
  isJuniorMember?: boolean;
  playerPartyId?: string;
  countryId?: string;
}): AuthorityPermissions {
  const isCivilWar = params.countryMode === 'civilwar';

  // 1. Civil War Faction Leader
  if (isCivilWar) {
    return {
      canCommandMilitary: true, // Commands own faction forces & war chest
      canAppointMinisters: false, // State ministries suspended
      canControlStateFinance: false, // Only faction war chest, not sovereign state taxes
      canConductStateDiplomacy: false, // Sovereign diplomacy suspended; peace negotiations handled via frontline peace panel
      canRunElectionCampaign: false, // Elections suspended
      isSpectatorOrObserverOnly: false,
      authorityRole: 'FACTION_COMMANDER',
      authorityTitle: 'Faction Commander',
      authorityDescription: 'Civil war in progress. You command your faction’s combat divisions and regional resources.'
    };
  }

  // 2. Ruling Executive (President / Prime Minister / Chancellor)
  if (params.isRuling) {
    return {
      canCommandMilitary: true,
      canAppointMinisters: true,
      canControlStateFinance: true,
      canConductStateDiplomacy: true,
      canRunElectionCampaign: true,
      isSpectatorOrObserverOnly: false,
      authorityRole: 'RULING_EXECUTIVE',
      authorityTitle: 'Head of Government / Commander-in-Chief',
      authorityDescription: 'Full sovereign constitutional authority over the armed forces, cabinet, and state treasury.'
    };
  }

  // 3. Junior Member (within opposition party before winning party congress)
  if (params.isJuniorMember) {
    return {
      canCommandMilitary: false,
      canAppointMinisters: false,
      canControlStateFinance: false,
      canConductStateDiplomacy: false,
      canRunElectionCampaign: false,
      isSpectatorOrObserverOnly: true,
      authorityRole: 'JUNIOR_MEMBER',
      authorityTitle: 'Party Delegate',
      authorityDescription: 'You must win the internal party congress before leading the national election campaign.'
    };
  }

  // 4. Opposition Party Candidate / Election Participant
  return {
    canCommandMilitary: false, // Observer mode: can monitor the war, but General Staff commands until election victory
    canAppointMinisters: false, // Opposition cannot appoint state ministers
    canControlStateFinance: false, // Controls party budget only, not national tax policy or state treasury
    canConductStateDiplomacy: false, // State diplomacy reserved for the sovereign government
    canRunElectionCampaign: true, // Can rally voters and run campaign across provinces
    isSpectatorOrObserverOnly: true,
    authorityRole: 'OPPOSITION_CANDIDATE',
    authorityTitle: 'Election Candidate / Opposition Leader',
    authorityDescription: 'Incumbent government and General Staff hold state command until you win the general election.'
  };
}
