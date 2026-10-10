/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ForeignCandidate {
  name: string;
  party: string;
  ideology: string;
  portrait?: string;
  basePopularity: number; // 0 - 100
}

export interface ForeignCountryElectionProfile {
  countryId: string;
  countryName: string;
  flag: string;
  cycleYears: number; // e.g. 4 or 5
  firstElectionTurn: number; // Staggered initial election turn (1 to 24)
  turnInterval: number; // Turns between elections (e.g. 48 for months, or 12-24 for campaign game scale)
  candidates: ForeignCandidate[];
}

export interface ForeignElectionResult {
  countryId: string;
  countryName: string;
  flag: string;
  incumbentWon: boolean;
  winner: ForeignCandidate;
  incumbent: ForeignCandidate;
  winnerVotesPercent: number;
  incumbentVotesPercent: number;
  newIdeology: string;
  summary: string;
}

export const FOREIGN_ELECTION_PROFILES: Record<string, ForeignCountryElectionProfile> = {
  US: {
    countryId: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    cycleYears: 4,
    firstElectionTurn: 8,
    turnInterval: 48,
    candidates: [
      { name: 'Joe Biden', party: 'Democratic Party', ideology: 'Liberal / Centrist', portrait: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=256&q=80', basePopularity: 48 },
      { name: 'Donald Trump', party: 'Republican Party', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=256&q=80', basePopularity: 50 },
      { name: 'Kamala Harris', party: 'Democratic Party', ideology: 'Liberal / Progressive', portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', basePopularity: 49 },
      { name: 'Ron DeSantis', party: 'Republican Party', ideology: 'National Conservative', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 44 }
    ]
  },
  GB: {
    countryId: 'GB',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    cycleYears: 5,
    firstElectionTurn: 12,
    turnInterval: 60,
    candidates: [
      { name: 'Keir Starmer', party: 'Labour Party', ideology: 'Social Democrat / Centrist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 45 },
      { name: 'Kemi Badenoch', party: 'Conservative Party', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', basePopularity: 44 },
      { name: 'Ed Davey', party: 'Liberal Democrats', ideology: 'Liberal / Centrist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 22 },
      { name: 'Nigel Farage', party: 'Reform UK', ideology: 'Nationalist / Populist', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 28 }
    ]
  },
  FR: {
    countryId: 'FR',
    countryName: 'France',
    flag: '🇫🇷',
    cycleYears: 5,
    firstElectionTurn: 15,
    turnInterval: 60,
    candidates: [
      { name: 'Emmanuel Macron', party: 'Renaissance / Ensemble', ideology: 'Liberal / Centrist', portrait: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80', basePopularity: 42 },
      { name: 'Marine Le Pen', party: 'National Rally (RN)', ideology: 'Right / Sovereign Nationalist', portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80', basePopularity: 51 },
      { name: 'Jordan Bardella', party: 'National Rally (RN)', ideology: 'Nationalist / Right', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 49 },
      { name: 'Jean-Luc Mélenchon', party: 'La France Insoumise (LFI)', ideology: 'Socialist / Left', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 38 }
    ]
  },
  DE: {
    countryId: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    cycleYears: 4,
    firstElectionTurn: 6,
    turnInterval: 48,
    candidates: [
      { name: 'Olaf Scholz', party: 'Social Democratic Party (SPD)', ideology: 'Social Democrat / Centrist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 36 },
      { name: 'Friedrich Merz', party: 'CDU/CSU Union', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 52 },
      { name: 'Alice Weidel', party: 'Alternative for Germany (AfD)', ideology: 'Nationalist / Sovereign Right', portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', basePopularity: 34 },
      { name: 'Robert Habeck', party: 'Alliance 90 / The Greens', ideology: 'Liberal / Ecological', portrait: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80', basePopularity: 30 }
    ]
  },
  TR: {
    countryId: 'TR',
    countryName: 'Turkey',
    flag: '🇹🇷',
    cycleYears: 5,
    firstElectionTurn: 18,
    turnInterval: 60,
    candidates: [
      { name: 'Recep Tayyip Erdoğan', party: 'AK Party (People\'s Alliance)', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 50 },
      { name: 'Özgür Özel', party: 'Republican People\'s Party (CHP)', ideology: 'Social Democrat / Kemalist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 48 },
      { name: 'Ekrem İmamoğlu', party: 'Republican People\'s Party (CHP)', ideology: 'Centrist / Reformist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 52 },
      { name: 'Mansur Yavaş', party: 'National Unity Alliance', ideology: 'Nationalist / Kemalist', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 51 }
    ]
  },
  BR: {
    countryId: 'BR',
    countryName: 'Brazil',
    flag: '🇧🇷',
    cycleYears: 4,
    firstElectionTurn: 10,
    turnInterval: 48,
    candidates: [
      { name: 'Luiz Inácio Lula da Silva', party: 'Workers\' Party (PT)', ideology: 'Social Democrat / Left', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 49 },
      { name: 'Tarcísio de Freitas', party: 'Republicanos / Conservative Coalition', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 48 },
      { name: 'Jair Bolsonaro', party: 'Liberal Party (PL)', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 46 }
    ]
  },
  JP: {
    countryId: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    cycleYears: 4,
    firstElectionTurn: 14,
    turnInterval: 48,
    candidates: [
      { name: 'Shigeru Ishiba', party: 'Liberal Democratic Party (LDP)', ideology: 'Conservative / Centrist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 46 },
      { name: 'Yoshihiko Noda', party: 'Constitutional Democratic Party (CDP)', ideology: 'Centrist / Social Liberal', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 47 },
      { name: 'Sanae Takaichi', party: 'LDP Conservative Wing', ideology: 'Nationalist / Conservative', portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', basePopularity: 44 }
    ]
  },
  IN: {
    countryId: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    cycleYears: 5,
    firstElectionTurn: 20,
    turnInterval: 60,
    candidates: [
      { name: 'Narendra Modi', party: 'Bharatiya Janata Party (BJP)', ideology: 'Nationalist / Conservative', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 54 },
      { name: 'Rahul Gandhi', party: 'Indian National Congress (INC)', ideology: 'Social Democrat / Centrist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 45 },
      { name: 'Arvind Kejriwal', party: 'Aam Aadmi Party (AAP)', ideology: 'Liberal / Centrist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 32 }
    ]
  },
  IT: {
    countryId: 'IT',
    countryName: 'Italy',
    flag: '🇮🇹',
    cycleYears: 5,
    firstElectionTurn: 16,
    turnInterval: 60,
    candidates: [
      { name: 'Giorgia Meloni', party: 'Brothers of Italy (FdI)', ideology: 'National Conservative', portrait: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80', basePopularity: 51 },
      { name: 'Elly Schlein', party: 'Democratic Party (PD)', ideology: 'Social Democrat / Progressive', portrait: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80', basePopularity: 43 },
      { name: 'Giuseppe Conte', party: 'Five Star Movement (M5S)', ideology: 'Centrist / Populist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 38 }
    ]
  },
  CA: {
    countryId: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    cycleYears: 4,
    firstElectionTurn: 5,
    turnInterval: 48,
    candidates: [
      { name: 'Justin Trudeau', party: 'Liberal Party', ideology: 'Liberal / Centrist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 38 },
      { name: 'Pierre Poilievre', party: 'Conservative Party', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 53 },
      { name: 'Jagmeet Singh', party: 'New Democratic Party (NDP)', ideology: 'Social Democrat / Left', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 28 }
    ]
  },
  ES: {
    countryId: 'ES',
    countryName: 'Spain',
    flag: '🇪🇸',
    cycleYears: 4,
    firstElectionTurn: 11,
    turnInterval: 48,
    candidates: [
      { name: 'Pedro Sánchez', party: 'Spanish Socialist Workers\' Party (PSOE)', ideology: 'Social Democrat / Left', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 47 },
      { name: 'Alberto Núñez Feijóo', party: 'People\'s Party (PP)', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 49 },
      { name: 'Santiago Abascal', party: 'VOX', ideology: 'Nationalist / Right', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 26 }
    ]
  },
  PL: {
    countryId: 'PL',
    countryName: 'Poland',
    flag: '🇵🇱',
    cycleYears: 4,
    firstElectionTurn: 9,
    turnInterval: 48,
    candidates: [
      { name: 'Donald Tusk', party: 'Civic Coalition (KO)', ideology: 'Centrist / Pro-European', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 48 },
      { name: 'Mateusz Morawiecki', party: 'Law and Justice (PiS)', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 46 },
      { name: 'Sławomir Mentzen', party: 'Confederation', ideology: 'Libertarian / Nationalist', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 24 }
    ]
  },
  KR: {
    countryId: 'KR',
    countryName: 'South Korea',
    flag: '🇰🇷',
    cycleYears: 5,
    firstElectionTurn: 13,
    turnInterval: 60,
    candidates: [
      { name: 'Yoon Suk-yeol', party: 'People Power Party (PPP)', ideology: 'Conservative / Right', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 38 },
      { name: 'Lee Jae-myung', party: 'Democratic Party (DPK)', ideology: 'Social Democrat / Reformist', portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', basePopularity: 52 },
      { name: 'Han Dong-hoon', party: 'People Power Party (PPP)', ideology: 'Moderate Conservative', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 45 }
    ]
  },
  AU: {
    countryId: 'AU',
    countryName: 'Australia',
    flag: '🇦🇺',
    cycleYears: 3,
    firstElectionTurn: 7,
    turnInterval: 36,
    candidates: [
      { name: 'Anthony Albanese', party: 'Labor Party', ideology: 'Social Democrat / Centrist', portrait: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80', basePopularity: 48 },
      { name: 'Peter Dutton', party: 'Liberal/National Coalition', ideology: 'Right / Conservative-Nationalist', portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', basePopularity: 49 },
      { name: 'Adam Bandt', party: 'Australian Greens', ideology: 'Liberal / Ecological', portrait: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80', basePopularity: 22 }
    ]
  }
};

/**
 * Simulates a foreign election based on real political cycles, economic conditions,
 * stability, and active wars.
 */
export function runForeignCountryElection(
  countryId: string,
  currentLeaderName: string,
  currentPartyName?: string,
  currentIdeology?: string,
  currentStability = 75,
  isAtWar = false
): ForeignElectionResult | null {
  const profile = FOREIGN_ELECTION_PROFILES[countryId];
  if (!profile) return null;

  // Identify incumbent candidate from profile or build from current data
  let incumbent = profile.candidates.find(c => c.name.toLowerCase() === currentLeaderName.toLowerCase());
  if (!incumbent) {
    incumbent = {
      name: currentLeaderName,
      party: currentPartyName || profile.candidates[0].party,
      ideology: currentIdeology || profile.candidates[0].ideology,
      basePopularity: 50,
      portrait: profile.candidates[0].portrait
    };
  }

  // Potential challengers (rival candidates)
  const challengers = profile.candidates.filter(c => c.name.toLowerCase() !== incumbent.name.toLowerCase());
  if (challengers.length === 0) return null;

  // Compute incumbent's electoral chances:
  // - Starts with base popularity (e.g. 50%)
  // - Stability factor (+15% if stability >= 80, -20% if stability < 50)
  // - War fatigue (-20% if embroiled in active war)
  // - Economic noise factor (-8% to +8%)
  let chance = incumbent.basePopularity || 50;

  if (currentStability >= 85) chance += 12;
  else if (currentStability >= 70) chance += 5;
  else if (currentStability < 50) chance -= 18;
  else if (currentStability < 40) chance -= 28;

  if (isAtWar) {
    chance -= 18; // War fatigue heavily punishes incumbents
  }

  const economicShift = (Math.random() * 16) - 8;
  chance += economicShift;

  // Clamp chance between 15% and 85%
  chance = Math.max(18, Math.min(82, Math.round(chance)));

  const roll = Math.random() * 100;
  const incumbentWon = roll < chance;

  if (incumbentWon) {
    const margin = Math.round(50 + (chance - roll) * 0.4);
    return {
      countryId,
      countryName: profile.countryName,
      flag: profile.flag,
      incumbentWon: true,
      winner: incumbent,
      incumbent,
      winnerVotesPercent: Math.min(65, Math.max(51, margin)),
      incumbentVotesPercent: Math.min(65, Math.max(51, margin)),
      newIdeology: incumbent.ideology,
      summary: `Incumbent ${incumbent.name} (${incumbent.party}) has won re-election in ${profile.countryName} with ${margin}% of the popular vote.`
    };
  } else {
    // Challenger victory! Pick the top rival candidate
    const sortedChallengers = [...challengers].sort((a, b) => (b.basePopularity + Math.random() * 20) - (a.basePopularity + Math.random() * 20));
    const winner = sortedChallengers[0];
    const winnerVotes = Math.round(52 + Math.random() * 8);

    return {
      countryId,
      countryName: profile.countryName,
      flag: profile.flag,
      incumbentWon: false,
      winner,
      incumbent,
      winnerVotesPercent: winnerVotes,
      incumbentVotesPercent: 100 - winnerVotes,
      newIdeology: winner.ideology,
      summary: `Election in ${profile.countryName}: ${winner.name} (${winner.party}) defeats ${incumbent.name} (${incumbent.party}) with ${winnerVotes}% of the vote.`
    };
  }
}

/**
 * Checks which foreign countries have elections scheduled on this turn.
 */
export function getForeignElectionsForTurn(
  turn: number,
  playerCountryId: string
): string[] {
  const eligibleCountries: string[] = [];

  Object.values(FOREIGN_ELECTION_PROFILES).forEach(profile => {
    // Never simulate elections for the player's own country here (player plays their own campaign)
    if (profile.countryId === playerCountryId) return;

    // Check if the current turn matches the initial election or recurring intervals
    const turnsSinceStart = turn - profile.firstElectionTurn;
    if (turn === profile.firstElectionTurn) {
      eligibleCountries.push(profile.countryId);
    } else if (turnsSinceStart > 0 && turnsSinceStart % profile.turnInterval === 0) {
      eligibleCountries.push(profile.countryId);
    }
  });

  return eligibleCountries;
}
