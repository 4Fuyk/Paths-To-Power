const fs = require('fs');
let c = fs.readFileSync('src/components/TacticalBattleView.tsx', 'utf8');

c = c.replace(/const \[isInitialized, setIsInitialized\] = useState\(false\);/, 
  "const [isInitialized, setIsInitialized] = useState<boolean>(false);\n  const [isPlaying, setIsPlaying] = useState<boolean>(false);\n  const [gameSpeed, setGameSpeed] = useState<number>(1);\n  const [gameDate, setGameDate] = useState<Date>(new Date(2025, 0, 1));");

fs.writeFileSync('src/components/TacticalBattleView.tsx', c);
