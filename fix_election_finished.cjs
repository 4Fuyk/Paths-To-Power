const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/const handleElectionFinished = \(success: boolean, finalSeats\?: Record<string, number>\) => \{[\s\S]*?setActiveScreen\('PARTY_CONGRESS'\);\n\s+\}\n\s+\};/, `const handleElectionFinished = (success: boolean, finalSeats?: Record<string, number>, isCoalition?: boolean) => {
    if (success && selectedCountry && playerParty) {
      if (!completedCountries.includes(selectedCountry.id)) {
        setCompletedCountries([...completedCountries, selectedCountry.id]);
      }
      
      setCountryWinCounts(prev => ({
        ...prev,
        [selectedCountry.id]: (prev[selectedCountry.id] || 0) + 1
      }));
      
      setIsRuling(true);
      setRulingMonthsCount(0);
      setIsJuniorMember(false);
      
      if (finalSeats) {
        // Generate coalitons if needed
      }
      
      setActiveScreen('WORLD_MAP');
      playSound('success');
    } else {
      setIsRuling(false);
      setHasReshuffledPrompt(false);
      setIsJuniorMember(false);
      setCoalitions([]);
      
      // Reduce party influence on failure
      const updatedParty = { ...playerParty };
      updatedParty.influence = Math.max(0, updatedParty.influence - 15);
      setPlayerParty(updatedParty);
      
      setActiveScreen('PARTY_CONGRESS');
    }
  };`);
