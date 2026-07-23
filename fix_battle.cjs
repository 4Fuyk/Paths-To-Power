const fs = require('fs');
let c = fs.readFileSync('src/components/TacticalBattleView.tsx', 'utf8');

c = c.replace(/const \[isInitialized, setIsInitialized\] = useState<boolean>\(false\);/, 
  "const [isInitialized, setIsInitialized] = useState<boolean>(false);\n  const [isPlaying, setIsPlaying] = useState<boolean>(false);\n  const [gameSpeed, setGameSpeed] = useState<number>(1);\n  const [gameDate, setGameDate] = useState<Date>(new Date(2025, 0, 1));");

c = c.replace(/const handleAttack = \(regionId: string\) => \{/g, 
  "const handleAttack = (regionId: string, isAuto: boolean = false) => {");

// We need to add a timer effect
const timerEffect = `
  useEffect(() => {
    if (!isPlaying || !isInitialized) return;
    const intervalId = setInterval(() => {
      // Advance date
      setGameDate(prev => {
        const nextDate = new Date(prev);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
      });
      
      // Auto battle
      setRegionStatus(prev => {
        const next = { ...prev };
        const rebels = (Object.values(next) as RegionUnit[]).filter(r => r.type === 'rebel');
        const loyals = (Object.values(next) as RegionUnit[]).filter(r => r.type === 'loyal');
        if (rebels.length === 0 || loyals.length === 0) {
           setIsPlaying(false);
           return next;
        }
        
        // Random loyal attacks
        if (Math.random() < 0.3) {
            const randomRebel = rebels[Math.floor(Math.random() * rebels.length)];
            const damageDealt = 20 + Math.floor(Math.random() * 30);
            const newHp = Math.max(0, randomRebel.hp - damageDealt);
            if (newHp === 0) {
               addLog(\`🟢 \${country.regions.find(r => r.id === randomRebel.regionId)?.name} has been liberated from rebel control!\`);
               next[randomRebel.regionId] = { ...randomRebel, hp: randomRebel.maxHp, type: 'loyal' };
            } else {
               next[randomRebel.regionId] = { ...randomRebel, hp: newHp };
            }
        }
        
        // Random rebel attacks
        if (Math.random() < 0.3) {
            const targetLoyal = loyals[Math.floor(Math.random() * loyals.length)];
            const rebelDamage = 20 + Math.floor(Math.random() * 30);
            const newHp = Math.max(0, targetLoyal.hp - rebelDamage);
            if (newHp === 0) {
               addLog(\`💀 We lost control of \${country.regions.find(r => r.id === targetLoyal.regionId)?.name}! Rebels took over.\`);
               next[targetLoyal.regionId] = { ...targetLoyal, hp: 150, type: 'rebel' };
            } else {
               next[targetLoyal.regionId] = { ...targetLoyal, hp: newHp };
            }
        }
        
        return next;
      });
      
    }, 1000 / gameSpeed);
    
    return () => clearInterval(intervalId);
  }, [isPlaying, gameSpeed, isInitialized]);
`;

c = c.replace(/  const addLog = \(msg: string\) => \{/, timerEffect + "\n  const addLog = (msg: string) => {");

// Render the controls
const controlsUI = `
      {/* TIME CONTROLS */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-3xl w-full max-w-4xl mt-4">
        <div className="text-white font-mono text-lg font-bold">
          {gameDate.toLocaleDateString()}
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">
             {isPlaying ? '⏸ Pause' : '▶ Play'}
           </button>
           <button onClick={() => setGameSpeed(1)} className={\`px-4 py-2 rounded-lg font-bold \${gameSpeed === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}\`}>1x</button>
           <button onClick={() => setGameSpeed(3)} className={\`px-4 py-2 rounded-lg font-bold \${gameSpeed === 3 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}\`}>3x</button>
           <button onClick={() => setGameSpeed(5)} className={\`px-4 py-2 rounded-lg font-bold \${gameSpeed === 5 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}\`}>5x</button>
        </div>
      </div>
`;

c = c.replace(/\{status === 'ongoing' && \(/, controlsUI + "\n        {status === 'ongoing' && (");

fs.writeFileSync('src/components/TacticalBattleView.tsx', c);
