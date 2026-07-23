const fs = require('fs');
let c = fs.readFileSync('src/components/WorldMap.tsx', 'utf8');

c = c.replace(/JP: \[36\.204, 138\.252\]\n};/g, `JP: [36.204, 138.252],
  CA: [56.130, -106.346],
  AR: [-38.416, -63.616],
  ZA: [-30.559, 22.937],
  IN: [20.593, 78.962],
  IT: [41.871, 12.567],
  ID: [-0.789, 113.921],
  MX: [23.634, -102.552],
  ES: [40.463, -3.749],
  KR: [35.907, 127.766],
  AU: [-25.274, 133.775]
};`);

c = c.replace(/JP: "Japan"\n};/g, `JP: "Japan",
  CA: "Canada",
  AR: "Argentina",
  ZA: "South Africa",
  IN: "India",
  IT: "Italy",
  ID: "Indonesia",
  MX: "Mexico",
  ES: "Spain",
  KR: "South Korea",
  AU: "Australia"
};`);

c = c.replace(/JP: \{ default: '#be1c5a', completed: '#ec4899', selected: '#f472b6' \}\s*\/\/ Japonya: Ahududu -> Pembe -> Açık Pembe\n};/g, `JP: { default: '#be1c5a', completed: '#ec4899', selected: '#f472b6' },
  CA: { default: '#991b1b', completed: '#dc2626', selected: '#f87171' },
  AR: { default: '#1e3a8a', completed: '#3b82f6', selected: '#93c5fd' },
  ZA: { default: '#166534', completed: '#22c55e', selected: '#86efac' },
  IN: { default: '#c2410c', completed: '#ea580c', selected: '#fb923c' },
  IT: { default: '#15803d', completed: '#16a34a', selected: '#4ade80' },
  ID: { default: '#b91c1c', completed: '#ef4444', selected: '#f87171' },
  MX: { default: '#064e3b', completed: '#059669', selected: '#34d399' },
  ES: { default: '#b45309', completed: '#d97706', selected: '#fbbf24' },
  KR: { default: '#1d4ed8', completed: '#2563eb', selected: '#60a5fa' },
  AU: { default: '#0c4a6e', completed: '#0284c7', selected: '#38bdf8' }
};`);

c = c.replace(/JP: 400000\n};/g, `JP: 400000,
  CA: 950000,
  AR: 600000,
  ZA: 500000,
  IN: 650000,
  IT: 300000,
  ID: 700000,
  MX: 600000,
  ES: 350000,
  KR: 200000,
  AU: 850000
};`);

c = c.replace(/if \(id3 === 'JPN' \|\| id2 === 'JP' \|\| name\.includes\('JAPAN'\)\) return 'JP';/g, `if (id3 === 'JPN' || id2 === 'JP' || name.includes('JAPAN')) return 'JP';
    if (id3 === 'CAN' || id2 === 'CA' || name.includes('CANADA')) return 'CA';
    if (id3 === 'ARG' || id2 === 'AR' || name.includes('ARGENTINA')) return 'AR';
    if (id3 === 'ZAF' || id2 === 'ZA' || name.includes('SOUTH AFRICA')) return 'ZA';
    if (id3 === 'IND' || id2 === 'IN' || name.includes('INDIA')) return 'IN';
    if (id3 === 'ITA' || id2 === 'IT' || name.includes('ITALY')) return 'IT';
    if (id3 === 'IDN' || id2 === 'ID' || name.includes('INDONESIA')) return 'ID';
    if (id3 === 'MEX' || id2 === 'MX' || name.includes('MEXICO')) return 'MX';
    if (id3 === 'ESP' || id2 === 'ES' || name.includes('SPAIN')) return 'ES';
    if (id3 === 'KOR' || id2 === 'KR' || name.includes('KOREA')) return 'KR';
    if (id3 === 'AUS' || id2 === 'AU' || name.includes('AUSTRALIA')) return 'AU';`);

fs.writeFileSync('src/components/WorldMap.tsx', c, 'utf8');
