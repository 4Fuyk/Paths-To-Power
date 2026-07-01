export const ALL_PRESS_QUESTIONS = [
  {
    avatar: "📺 News 1",
    color: "border-red-500 text-red-400 bg-red-500/15",
    question: `Mr. President, following your electoral victory, what will be your first actions regarding economic reforms and taxes? Will the public find relief?`,
    options: [
      {
        text: "We will heavily tax the rich and relieve the public! (Populist)",
        bonusDesc: "+100k Starting Treasury, increase in Democracy and Freedom scores",
        treasuryBonus: 100000,
        freedomBonus: 10,
        reputationBonus: 0
      },
      {
        text: "We will increase taxes to quickly fill the state treasury! (Fiscal Focus)",
        bonusDesc: "+250k Starting Treasury, Low Public Freedom",
        treasuryBonus: 250000,
        freedomBonus: -15,
        reputationBonus: 0
      },
      {
        text: "We will maintain a balanced budget and free market rules. (Status Quo)",
        bonusDesc: "Standard starting budget and freedom scores",
        treasuryBonus: 0,
        freedomBonus: 0,
        reputationBonus: 0
      }
    ]
  },
  {
    avatar: "📰 Daily News",
    color: "border-blue-500 text-blue-400 bg-blue-500/15",
    question: `Mr. President, what will be your stance on press freedom and opposition voices in your new term? Consolidation of power or full liberty?`,
    options: [
      {
        text: "We will defend democracy to the end, fully independent press! (Libertarian)",
        bonusDesc: "+25 Democracy/Freedom Index, +15 International Reputation",
        treasuryBonus: 0,
        freedomBonus: 25,
        reputationBonus: 15
      },
      {
        text: "National security comes first. We will apply restrictions if necessary! (Authoritarian)",
        bonusDesc: "-20 Democracy/Freedom Index, increase in Military and Security power",
        treasuryBonus: 0,
        freedomBonus: -20,
        reputationBonus: -15
      },
      {
        text: "We will maintain strict adherence to the constitutional framework and laws. (Democratic)",
        bonusDesc: "+5 Democracy/Freedom Index, Balanced Status",
        treasuryBonus: 0,
        freedomBonus: 5,
        reputationBonus: 5
      }
    ]
  },
  {
    avatar: "🌍 Global TV",
    color: "border-amber-500 text-amber-400 bg-amber-500/15",
    question: `What is your strategy regarding global diplomacy, cross-border military operations, and neighboring states in the new term? Is there a possibility of war?`,
    options: [
      {
        text: "Peace at home, peace in the world! Diplomatic dialogue is our only option. (Pacifist)",
        bonusDesc: "+20 International Reputation, Peaceful Relations with Neighbors",
        treasuryBonus: 0,
        freedomBonus: 0,
        reputationBonus: 20
      },
      {
        text: "Absolute leadership in our region! We will declare our power and national stance to everyone. (Nationalist)",
        bonusDesc: "-15 International Reputation, Extra Military Readiness Points",
        treasuryBonus: 50000,
        freedomBonus: 0,
        reputationBonus: -15
      },
      {
        text: "We will focus on our own borders and remain neutral in global conflicts. (Isolationist)",
        bonusDesc: "Balanced international relations and neutral foreign policy",
        treasuryBonus: 0,
        freedomBonus: 0,
        reputationBonus: 5
      }
    ]
  },
  {
    avatar: "🗣️ Public Media",
    color: "border-purple-500 text-purple-400 bg-purple-500/15",
    question: `Your policies on education and youth employment have been highly debated. What is your immediate plan for the younger generation?`,
    options: [
      {
        text: "We will invest heavily in free education and student stipends. (Social Reformer)",
        bonusDesc: "+15 Freedom, -50k Treasury",
        treasuryBonus: -50000,
        freedomBonus: 15,
        reputationBonus: 0
      },
      {
        text: "We will push youth into vocational training and immediate labor markets. (Pragmatist)",
        bonusDesc: "+100k Treasury, -5 Freedom",
        treasuryBonus: 100000,
        freedomBonus: -5,
        reputationBonus: 0
      },
      {
        text: "We will maintain the current education system and make minor adjustments. (Conservative)",
        bonusDesc: "No significant changes",
        treasuryBonus: 0,
        freedomBonus: 0,
        reputationBonus: 0
      }
    ]
  },
  {
    avatar: "⚡ Action News",
    color: "border-emerald-500 text-emerald-400 bg-emerald-500/15",
    question: `Environmental issues and climate change are pressing concerns. Will your government prioritize green policies or industrial growth?`,
    options: [
      {
        text: "We will declare a climate emergency and halt polluting industries. (Green Focus)",
        bonusDesc: "+20 International Reputation, -75k Treasury",
        treasuryBonus: -75000,
        freedomBonus: 0,
        reputationBonus: 20
      },
      {
        text: "Industrial growth is paramount! We will deregulate energy sectors. (Industrialist)",
        bonusDesc: "+150k Treasury, -15 Reputation",
        treasuryBonus: 150000,
        freedomBonus: 0,
        reputationBonus: -15
      },
      {
        text: "We will try to balance economic needs with gradual environmental improvements. (Centrist)",
        bonusDesc: "Minor budget adjustments",
        treasuryBonus: 10000,
        freedomBonus: 0,
        reputationBonus: 5
      }
    ]
  },
  {
    avatar: "💰 FinNews",
    color: "border-indigo-500 text-indigo-400 bg-indigo-500/15",
    question: `Inflation is rising and the housing market is in crisis. What is your strategy for urban development and housing?`,
    options: [
      {
        text: "We will initiate a massive public housing project and freeze rents! (Socialist)",
        bonusDesc: "+20 Freedom, -100k Treasury",
        treasuryBonus: -100000,
        freedomBonus: 20,
        reputationBonus: 0
      },
      {
        text: "We will give tax breaks to developers and let the free market fix the shortage. (Capitalist)",
        bonusDesc: "+120k Treasury, -10 Freedom",
        treasuryBonus: 120000,
        freedomBonus: -10,
        reputationBonus: 0
      },
      {
        text: "We will provide moderate subsidies for first-time homebuyers. (Moderate)",
        bonusDesc: "-20k Treasury, +5 Freedom",
        treasuryBonus: -20000,
        freedomBonus: 5,
        reputationBonus: 0
      }
    ]
  }
];
