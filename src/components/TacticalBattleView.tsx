import React, { useState, useEffect } from 'react';
import { Shield, Swords, Users, Trophy, ChevronRight, Compass, Heart, Award, AlertTriangle } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  type: 'loyal' | 'rebel';
  icon: string;
  hp: number;
  maxHp: number;
  atk: number;
  x: number;
  y: number;
  hasActed: boolean;
}

interface Tile {
  x: number;
  y: number;
  terrain: 'urban' | 'hill' | 'forest' | 'palace';
}

interface TacticalBattleViewProps {
  country: { name: string; flag?: string };
  party: { name: string };
  darkMode: boolean;
  onBattleFinished: (success: boolean) => void;
}

export const TacticalBattleView: React.FC<TacticalBattleViewProps> = ({
  country,
  party,
  darkMode,
  onBattleFinished
}) => {
  // 6x6 grid setup
  const [grid, setGrid] = useState<Tile[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [turn, setTurn] = useState<'player' | 'rebel'>('player');
  const [battleLogs, setBattleLogs] = useState<string[]>(['Savaş başladı! Asi güçler başkente sızdı. Birliklerinizi seçip hareket ettirin veya saldırın.']);
  const [selectedAction, setSelectedAction] = useState<'move' | 'attack' | null>(null);
  const [hoverTile, setHoverTile] = useState<{x: number, y: number} | null>(null);

  // Initialize board
  useEffect(() => {
    // Generate tiles
    const newGrid: Tile[] = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        let terrain: 'urban' | 'hill' | 'forest' | 'palace' = 'urban';
        if (x === 2 && y === 2) terrain = 'palace';
        else if ((x + y) % 3 === 0) terrain = 'forest';
        else if ((x * y) % 4 === 1) terrain = 'hill';
        newGrid.push({ x, y, terrain });
      }
    }
    setGrid(newGrid);

    // Initialize units
    const loyalUnits: Unit[] = [
      { id: 'l1', name: 'Cumhurbaşkanlığı Muhafızları', type: 'loyal', icon: '💂', hp: 100, maxHp: 100, atk: 25, x: 0, y: 2, hasActed: false },
      { id: 'l2', name: 'Özel Harekat Timi', type: 'loyal', icon: '👮', hp: 80, maxHp: 80, atk: 35, x: 1, y: 1, hasActed: false },
      { id: 'l3', name: 'Zırhlı Tugay', type: 'loyal', icon: '🚜', hp: 120, maxHp: 120, atk: 20, x: 0, y: 4, hasActed: false },
      { id: 'l4', name: 'İHA Sürüsü', type: 'loyal', icon: '🛸', hp: 60, maxHp: 60, atk: 40, x: 1, y: 5, hasActed: false },
    ];

    const rebelUnits: Unit[] = [
      { id: 'r1', name: 'Silahlı Militanlar', type: 'rebel', icon: '👤', hp: 80, maxHp: 80, atk: 20, x: 4, y: 1, hasActed: false },
      { id: 'r2', name: 'Hücre Yapılanması', type: 'rebel', icon: '💥', hp: 60, maxHp: 60, atk: 30, x: 5, y: 2, hasActed: false },
      { id: 'r3', name: 'Ele Geçirilmiş Tank', type: 'rebel', icon: '🚜', hp: 100, maxHp: 100, atk: 25, x: 4, y: 4, hasActed: false },
      { id: 'r4', name: 'Asi Keskin Nişancı', type: 'rebel', icon: '🎯', hp: 70, maxHp: 70, atk: 35, x: 5, y: 5, hasActed: false },
    ];

    setUnits([...loyalUnits, ...rebelUnits]);
  }, []);

  const getUnitAt = (x: number, y: number) => {
    return units.find(u => u.x === x && u.y === y && u.hp > 0);
  };

  const addLog = (msg: string) => {
    setBattleLogs(prev => [msg, ...prev].slice(0, 10));
  };

  // Distance calculator
  const getDistance = (u1: {x: number, y: number}, u2: {x: number, y: number}) => {
    return Math.abs(u1.x - u2.x) + Math.abs(u1.y - u2.y);
  };

  // Player clicks tile
  const handleTileClick = (x: number, y: number) => {
    if (turn !== 'player') return;

    const clickedUnit = getUnitAt(x, y);

    // If no unit is selected, try to select a loyal unit
    if (!selectedUnitId) {
      if (clickedUnit && clickedUnit.type === 'loyal') {
        if (clickedUnit.hasActed) {
          addLog(`${clickedUnit.name} bu turda zaten hareket etti veya saldırdı.`);
          return;
        }
        setSelectedUnitId(clickedUnit.id);
        setSelectedAction('move');
      }
      return;
    }

    // A unit is currently selected
    const activeUnit = units.find(u => u.id === selectedUnitId);
    if (!activeUnit) return;

    // Clicked on another of our own loyal units -> switch selection
    if (clickedUnit && clickedUnit.type === 'loyal') {
      if (clickedUnit.hasActed) {
        addLog(`${clickedUnit.name} bu turda zaten hareket etti.`);
        return;
      }
      setSelectedUnitId(clickedUnit.id);
      setSelectedAction('move');
      return;
    }

    const dist = getDistance(activeUnit, { x, y });

    // MOVE action
    if (selectedAction === 'move') {
      if (clickedUnit) {
        // If clicked unit is a rebel and within range, let's switch to attack action automatically!
        if (clickedUnit.type === 'rebel' && dist === 1) {
          handleAttack(activeUnit, clickedUnit);
        }
        return;
      }

      if (dist === 1) {
        // Perform move
        setUnits(prev => prev.map(u => u.id === activeUnit.id ? { ...u, x, y, hasActed: true } : u));
        addLog(`🟢 ${activeUnit.name} mevzi değiştirdi, yeni koordinat (${x + 1}, ${y + 1}).`);
        setSelectedUnitId(null);
        setSelectedAction(null);
      } else {
        addLog(`Mesafe çok uzak! Sadece yanındaki karolara (yatay/dikey) hareket edebilirsin.`);
      }
    }
  };

  // Perform attack
  const handleAttack = (attacker: Unit, defender: Unit) => {
    const damage = attacker.atk + Math.floor(Math.random() * 11 - 5); // randomized spread
    const nextHp = Math.max(0, defender.hp - damage);

    // Update health
    setUnits(prev => prev.map(u => {
      if (u.id === defender.id) {
        return { ...u, hp: nextHp };
      }
      if (u.id === attacker.id) {
        return { ...u, hasActed: true };
      }
      return u;
    }));

    addLog(`💥 ${attacker.name}, ${defender.name} hedefine saldırdı ve ${damage} HASAR verdi!`);
    
    if (nextHp <= 0) {
      addLog(`💀 Savaş Alanı Raporu: ${defender.name} etkisiz hale getirildi!`);
    }

    setSelectedUnitId(null);
    setSelectedAction(null);
  };

  // Check battle end
  useEffect(() => {
    if (units.length === 0) return;

    const aliveLoyal = units.filter(u => u.type === 'loyal' && u.hp > 0);
    const aliveRebels = units.filter(u => u.type === 'rebel' && u.hp > 0);

    if (aliveRebels.length === 0) {
      addLog("🏆 ZAFER: Tüm asiler etkisiz hale getirildi! Güvenlik yeniden sağlandı.");
      setTimeout(() => {
        onBattleFinished(true);
      }, 3000);
    } else if (aliveLoyal.length === 0) {
      addLog("💀 BOZGUN: Tüm sadık kuvvetlerimiz yok edildi! Asi güçler cumhurbaşkanlığı sarayını bastı.");
      setTimeout(() => {
        onBattleFinished(false);
      }, 3000);
    }
  }, [units]);

  // AI/Rebel turn logic
  const handleEndTurn = () => {
    if (turn !== 'player') return;
    setTurn('rebel');
    addLog("⚠️ Asiler karşı taarruza geçiyor...");

    setTimeout(() => {
      // Process rebel AI moves sequentially
      setUnits(currentUnits => {
        const mutableUnits = [...currentUnits];
        const aliveRebels = mutableUnits.filter(u => u.type === 'rebel' && u.hp > 0);
        const aliveLoyal = mutableUnits.filter(u => u.type === 'loyal' && u.hp > 0);

        aliveRebels.forEach(rebel => {
          if (aliveLoyal.length === 0) return;

          // Find closest loyal unit
          let closestLoyal = aliveLoyal[0];
          let minDist = getDistance(rebel, closestLoyal);

          aliveLoyal.forEach(loyal => {
            const d = getDistance(rebel, loyal);
            if (d < minDist) {
              minDist = d;
              closestLoyal = loyal;
            }
          });

          // If adjacent, attack!
          if (minDist === 1) {
            const damage = rebel.atk + Math.floor(Math.random() * 9 - 4);
            closestLoyal.hp = Math.max(0, closestLoyal.hp - damage);
            addLog(`❌ ${rebel.name}, ${closestLoyal.name} birliğimize saldırdı: -${damage} HP!`);
            if (closestLoyal.hp <= 0) {
              addLog(`💀 KRİTİK KAYIP: ${closestLoyal.name} birliğimiz düştü!`);
            }
          } else {
            // Move closer to the target
            const dx = Math.sign(closestLoyal.x - rebel.x);
            const dy = Math.sign(closestLoyal.y - rebel.y);

            // Try moving in X axis first, if unoccupied
            let targetX = rebel.x + dx;
            let targetY = rebel.y;

            const isOccupied = (tx: number, ty: number) => {
              return mutableUnits.some(u => u.x === tx && u.y === ty && u.hp > 0);
            };

            if (dx !== 0 && !isOccupied(targetX, targetY)) {
              rebel.x = targetX;
            } else if (dy !== 0 && !isOccupied(rebel.x, rebel.y + dy)) {
              rebel.y = rebel.y + dy;
            }
          }
        });

        // Reset hasActed for loyal units for the next player turn
        return mutableUnits.map(u => u.type === 'loyal' ? { ...u, hasActed: false } : u);
      });

      setTurn('player');
      addLog("🟢 Sizin sıranız! Ordu birliklerini yönetin.");
    }, 1500);
  };

  return (
    <div className={`p-6 rounded-3xl border w-full max-w-4xl mx-auto flex flex-col gap-6 select-none ${
      darkMode ? 'bg-slate-950/95 border-rose-500/20' : 'bg-slate-50 border-slate-350 shadow-2xl'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🔥</span>
          <div>
            <h2 className="text-lg font-black font-mono tracking-tight text-rose-500 uppercase flex items-center gap-2">
              ASİLERLE TAKTİK MUHAREBE • CIVIL SUPPRESSION GRID
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Saray kuşatma altında. {country.name} asilerini harita üzerinde temizleyin!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase font-bold animate-pulse">
            SAVAŞ DURUMU / COMBAT
          </span>
          <div className="text-xs font-bold text-slate-300 font-mono mt-1">SIKILAŞTIRILMIŞ ALAN</div>
        </div>
      </div>

      {/* Grid and Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical Battlefield (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border border-slate-500/10 bg-slate-900 p-2 shadow-inner">
            <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full">
              {grid.map((tile) => {
                const u = getUnitAt(tile.x, tile.y);
                const isSelected = selectedUnitId && units.find(unit => unit.id === selectedUnitId)?.x === tile.x && units.find(unit => unit.id === selectedUnitId)?.y === tile.y;
                const isAdjacent = selectedUnitId && getDistance(units.find(unit => unit.id === selectedUnitId)!, tile) === 1;

                // Style based on terrain
                let bgTerrain = 'bg-slate-800/40 hover:bg-slate-750/50';
                if (tile.terrain === 'palace') bgTerrain = 'bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/10';
                else if (tile.terrain === 'forest') bgTerrain = 'bg-emerald-950/10 hover:bg-emerald-900/20';
                else if (tile.terrain === 'hill') bgTerrain = 'bg-stone-850 hover:bg-stone-800';

                return (
                  <div
                    key={`${tile.x}-${tile.y}`}
                    onClick={() => handleTileClick(tile.x, tile.y)}
                    onMouseEnter={() => setHoverTile({ x: tile.x, y: tile.y })}
                    onMouseLeave={() => setHoverTile(null)}
                    className={`relative rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 ${bgTerrain} ${
                      isSelected ? 'ring-2 ring-indigo-500 scale-[0.98]' : ''
                    } ${
                      isAdjacent ? 'bg-indigo-900/35 border border-indigo-500/30' : ''
                    }`}
                  >
                    {/* Grid Coordinates label */}
                    <span className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-500">
                      {tile.x + 1},{tile.y + 1}
                    </span>

                    {/* Terrain icon indicator */}
                    {tile.terrain === 'palace' && !u && (
                      <span className="text-[10px] opacity-45 font-bold text-amber-500 uppercase font-mono mt-2">Palas</span>
                    )}

                    {/* Unit Rendering */}
                    {u && (
                      <div className="flex flex-col items-center justify-center gap-1 w-full px-1">
                        <span className="text-2xl drop-shadow animate-scale-up">{u.icon}</span>
                        <div className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${u.type === 'loyal' ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${(u.hp / u.maxHp) * 100}%` }}
                          />
                        </div>
                        <span className={`text-[8.5px] font-bold tracking-tight text-center leading-none ${
                          u.type === 'loyal' ? 'text-emerald-400' : 'text-rose-400'
                        } truncate w-full`}>
                          {u.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tactical Feed & Legend (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Legend and Turn Status */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">TUR SIRASI • ACTIVE TURN</span>
              <span className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                turn === 'player' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
              }`}>
                {turn === 'player' ? 'SİZİN SIRANIZ' : 'ASİLERİN SIRASI'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💂</span>
                <span className="text-slate-300">Yeşil Barlar: Sadık Cumhurbaşkanlığı Güçleriniz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="text-slate-300">Kırmızı Barlar: İsyan Eden Milis Hücreleri</span>
              </div>
            </div>

            <button
              onClick={handleEndTurn}
              disabled={turn !== 'player'}
              className="w-full mt-2 py-3.5 bg-indigo-650 hover:bg-indigo-600 text-white font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1 transition-all hover:scale-[1.01]"
            >
              <span>TURU BİTİR • END TURN</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time battle feeds logs */}
          <div className="p-4 rounded-2xl bg-black/30 border border-slate-850 flex-grow flex flex-col gap-2 max-h-[220px] overflow-y-auto">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-850">
              ⚡ SAVAŞ RAPORLARI • COMBAT LOGS
            </h4>
            <div className="flex flex-col gap-2 pr-1">
              {battleLogs.map((log, index) => (
                <div key={index} className="text-[11px] font-mono leading-relaxed text-slate-350 flex gap-1.5 items-start">
                  <span className="text-indigo-400 shrink-0">▸</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
