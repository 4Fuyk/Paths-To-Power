const fs = require('fs');
let c = fs.readFileSync('src/components/ElectionSimulator.tsx', 'utf8');

c = c.replace(/\{\(\(seatsWon\[party\.id\] \|\| 0\) \+ selectedCoalitionParties\.reduce/g, 
  `{((seatsWon[party.id] || 0) + (coalitions?.filter(c => c.parties.includes(party.name)).flatMap(c => c.parties).filter((v, i, a) => a.indexOf(v) === i && v !== party.name).reduce((sum, p) => sum + (seatsWon[country.rivals.find(r=>r.name===p)?.id || ''] || 0), 0) || 0) + selectedCoalitionParties.reduce`);

c = c.replace(/Combined Coalition Seats: <\/span>\s*<span className="font-mono text-slate-300">\s*\{\s*\(seatsWon\[party\.id\] \|\| 0\)\s*\+\s*selectedCoalitionParties\.reduce/, 
  `Combined Coalition Seats: </span>\n                            <span className="font-mono text-slate-300">\n                              { (seatsWon[party.id] || 0) + (coalitions?.filter(c => c.parties.includes(party.name)).flatMap(c => c.parties).filter((v, i, a) => a.indexOf(v) === i && v !== party.name).reduce((sum, p) => sum + (seatsWon[country.rivals.find(r=>r.name===p)?.id || ''] || 0), 0) || 0) + selectedCoalitionParties.reduce`);

fs.writeFileSync('src/components/ElectionSimulator.tsx', c);
