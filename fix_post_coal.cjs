const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/const handleElectionFinished = \(success: boolean, finalSeats\?: Record<string, number>\) => \{/, 
  "const handleElectionFinished = (success: boolean, finalSeats?: Record<string, number>, newCoalition?: any) => {");
  
c = c.replace(/setCoalitions\(\[\.\.\.\(coalitions \|\| \[\]\), \.\.\.generated\]\);/g, 
  "const finalCoals = [...(coalitions || []), ...generated]; if(newCoalition && !finalCoals.find(c => c.name === newCoalition.name)) finalCoals.push(newCoalition); setCoalitions(finalCoals);");

c = c.replace(/setCoalitions\(\[\]\);/g, 
  "if (newCoalition) setCoalitions([...(coalitions || []), newCoalition]); else setCoalitions([...(coalitions || [])]);");

fs.writeFileSync('src/App.tsx', c);
