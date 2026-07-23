const fs = require('fs');
let c = fs.readFileSync('src/components/ElectionSimulator.tsx', 'utf8');

c = c.replace(/const getWinningCoalition = \(\) => \{[\s\S]*?\/\/ Determine Overall Victor Status/, `const getWinningCoalition = () => {
    if (!coalitions || coalitions.length === 0) return null;
    
    // Find all parties the player is allied with across all their coalitions
    const playerAllies = new Set<string>();
    coalitions.forEach(coal => {
      if (coal.parties.includes(party.name)) {
        coal.parties.forEach(p => playerAllies.add(p));
      }
    });
    
    if (playerAllies.size === 0) return null;
    
    const combinedSeats = Array.from(playerAllies).reduce((sum, partyName) => {
      if (partyName === party.name) {
        return sum + (seatsWon[party.id] || 0);
      }
      const rival = country.rivals.find(r => r.name === partyName);
      if (rival) {
        return sum + (seatsWon[rival.id] || 0);
      }
      return sum;
    }, 0);

    if (combinedSeats > country.seats / 2) {
      return {
        name: "Player Coalition Alliance",
        parties: Array.from(playerAllies),
        totalSeats: combinedSeats,
        ideologyAvg: "Broad Alliance"
      };
    }

    let isLargestBloc = true;
    const playerPartyId = party.id;
    if (seatsWon[playerPartyId] && !playerAllies.has(party.name)) {
      if ((seatsWon[playerPartyId] || 0) >= combinedSeats) {
        isLargestBloc = false;
      }
    }
    
    country.rivals.forEach(r => {
      if (!playerAllies.has(r.name)) {
        const rSeats = seatsWon[r.id] || 0;
        if (rSeats >= combinedSeats) {
          isLargestBloc = false;
        }
      }
    });

    coalitions.forEach(otherCoal => {
      if (!otherCoal.parties.includes(party.name)) {
        const otherCombined = otherCoal.parties.reduce((sum, pName) => {
          if (pName === party.name) return sum + (seatsWon[party.id] || 0);
          const r = country.rivals.find(riv => riv.name === pName);
          return sum + (r ? (seatsWon[r.id] || 0) : 0);
        }, 0);
        if (otherCombined >= combinedSeats) {
          isLargestBloc = false;
        }
      }
    });

    if (isLargestBloc) {
       return {
        name: "Player Coalition Alliance",
        parties: Array.from(playerAllies),
        totalSeats: combinedSeats,
        ideologyAvg: "Broad Alliance"
      };
    }
    return null;
  };

  // Determine Overall Victor Status`);

fs.writeFileSync('src/components/ElectionSimulator.tsx', c);
