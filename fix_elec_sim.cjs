const fs = require('fs');
let c = fs.readFileSync('src/components/ElectionSimulator.tsx', 'utf8');

c = c.replace(/onElectionFinished: \(success: boolean, finalSeats\?: Record<string, number>\) => void;/, 
  "onElectionFinished: (success: boolean, finalSeats?: Record<string, number>, newCoalition?: any) => void;");

c = c.replace(/onClick=\{\(\) => onElectionFinished\(true, seatsWon\)\}/g, 
  "onClick={() => onElectionFinished(true, seatsWon, winningCoalition)}");

fs.writeFileSync('src/components/ElectionSimulator.tsx', c);
