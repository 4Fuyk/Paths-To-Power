/**
 * Prosedürel arazi modeli (HOI4 tarzı): yükselti, çöl, orman, biyom rengi ve gölgelendirme.
 * Hem taban harita karoları (baseTile.ts) hem de dağ/ağaç katmanı (mapFxLayer.ts) bunu kullanır.
 */
export type RGB = [number, number, number];

export const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Deterministik 0..1 değer */
export function hash(i: number, j: number, s: number): number {
  let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(s, 982451653);
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const CA = new Float64Array(128), SA = new Float64Array(128);
for (let i = 0; i < 128; i++) { CA[i] = Math.cos(i * 0.83); SA[i] = Math.sin(i * 0.83); }
function vn(x0: number, y0: number, s: number): number {
  const ca = CA[s & 127], sa = SA[s & 127], x = x0 * ca - y0 * sa, y = x0 * sa + y0 * ca;
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Çok katmanlı gürültü; piksel boyutundan (px, derece) küçük ayrıntıları eklemez. */
export function fbm(lo: number, la: number, px: number, seed = 0): number {
  let s = 0, a = 0.5, f = 0.35, tot = 0;
  for (let o = 0; o < 6; o++) {
    if (o > 1 && 1 / f < 2.2 * px) break;
    s += a * vn(lo * f, la * f, seed + o); tot += a; f *= 2.07; a *= 0.5;
  }
  return s / tot;
}

/** Sıra dağlar: [[boylam, enlem], ...] çizgisi boyunca, yarıçap (°) ve yükseklik */
type Chain = { p: [number, number][]; r: number; h: number; x0: number; x1: number; y0: number; y1: number };
const mk = (p: [number, number][], r: number, h: number): Chain => {
  const xs = p.map(q => q[0]), ys = p.map(q => q[1]), m = r * 3.2;
  return { p, r, h, x0: Math.min(...xs) - m, x1: Math.max(...xs) + m, y0: Math.min(...ys) - m, y1: Math.max(...ys) + m };
};
const CHAINS: Chain[] = [
  mk([[6.5,44.3],[7.5,46],[10,46.5],[13,47],[15.5,47.2]], 1, 1), mk([[-1.8,43],[0.5,42.7],[3,42.5]], .7, .8),
  mk([[-8,43],[-4.5,43]], .6, .5), mk([[8.5,44.5],[12,43.5],[14.5,41.5],[16,39.5]], .6, .5),
  mk([[17.5,49.2],[20,49.3],[24,48.5],[25.5,47],[25.5,45.5],[23,45.3]], .8, .6),
  mk([[14,45.5],[17,43.8],[19.5,42.5],[21,40.5],[22,38.8]], .7, .6), mk([[22.5,43],[25,42.7],[28,42.8]], .6, .5),
  mk([[37.5,44.3],[40,43.4],[43,42.8],[46,42.3],[48.5,41.8]], 1, 1), mk([[30,41],[33.5,41.3],[37,40.8],[40,40.6],[42,40.5]], .7, .7),
  mk([[28.5,37],[31,37],[34,37.3],[36.8,37.8],[39.5,38.2],[42,38]], .8, 1), mk([[41,39.5],[44,39.5],[44.5,38]], 1, .9),
  mk([[45,37],[46.5,35],[48.5,33],[51,30.5],[54,28],[57,26.5]], 1.1, .9), mk([[48.5,37],[51.5,36.2],[54.5,36.5],[58,37]], .8, .9),
  mk([[62,35],[67,35.5],[71,36],[74,36],[77,35.5]], 1.2, 1.1),
  mk([[72.5,34],[77,31.8],[81,30],[85,28],[89,27.7],[93,28.2],[96,28.5]], 1.2, 1.4),
  mk([[75,37],[82,36],[90,35.5],[97,35]], 1.5, .9), mk([[70,41.5],[75,42],[80,42.5],[85,43],[90,43.3]], 1.1, .9),
  mk([[85,49],[89,49.5],[92,50.5],[96,50.8]], 1, .7), mk([[59,52],[59.5,56],[60.5,60],[62,64],[66,67]], .6, .5),
  mk([[98,28],[100,26],[101,24]], .8, .8), mk([[104,34],[108,33.8],[112,34]], .6, .6),
  mk([[136,35.5],[138,36],[140,38],[141.5,41]], .5, .6), mk([[121,23.5],[121.1,24.8]], .3, .6),
  mk([[-9,30.5],[-5,32],[-1,33.5],[3,34.5],[7,35.6]], .8, .8), mk([[38,8],[39,11]], 2, .8), mk([[35,2],[35,-4]], 1.5, .6),
  mk([[27.5,-31],[29.5,-29],[30,-26]], .6, .6),
  mk([[-72,-52],[-71,-44],[-70.5,-36],[-69.5,-30],[-69,-24],[-69.5,-18],[-72,-14],[-76,-9],[-78,-3],[-77,3],[-74,8]], 1.1, 1.3),
  mk([[-124,49],[-117,50],[-114,47],[-111,43],[-107,39],[-105.5,36],[-105,33]], 1.2, .9),
  mk([[-122,45],[-121.5,41],[-119,38],[-118,35.5]], .8, .8), mk([[-108,29],[-105,25],[-103,21],[-100,19],[-97,17]], .8, .8),
  mk([[-84,35],[-80,37.5],[-77,40],[-74,42]], .6, .4), mk([[-153,61],[-148,63],[-142,62],[-137,60]], 1, .9),
  mk([[6,59.5],[8,62],[12,65.5],[16,67.7],[20,69]], .8, .6), mk([[-5,57],[-4,58]], .5, .4),
  mk([[146,-18],[148.5,-24],[151,-29],[149.5,-36],[147,-37]], .7, .4), mk([[168.5,-44.5],[171,-43.5]], .5, .8),
  mk([[134,-3.5],[140,-4.3],[146,-6]], .8, .9), mk([[96,3],[100,0],[103,-3.5]], .5, .6), mk([[106.5,-6.5],[112,-7.8]], .4, .5)
];

export function elev(lo: number, la: number): number {
  let e = 0;
  for (const c of CHAINS) {
    if (lo < c.x0 || lo > c.x1 || la < c.y0 || la > c.y1) continue;
    let d2 = 1e9;
    for (let i = 0; i < c.p.length - 1; i++) {
      const ax = c.p[i][0], ay = c.p[i][1], bx = c.p[i + 1][0] - ax, by = c.p[i + 1][1] - ay;
      const px = lo - ax, py = la - ay, L = bx * bx + by * by;
      const t = L ? Math.max(0, Math.min(1, (px * bx + py * by) / L)) : 0;
      const dx = px - t * bx, dy = py - t * by, q = dx * dx + dy * dy;
      if (q < d2) d2 = q;
    }
    e += c.h * Math.exp(-d2 / (c.r * c.r));
  }
  return e;
}

/** Çöl bölgeleri [boylam, enlem, yarıçap boylam, yarıçap enlem] */
const DES: [number, number, number, number][] = [
  [9, 23, 30, 9], [47, 23, 9, 6], [57, 32, 5, 3], [105, 43, 10, 4], [83, 39, 6, 2], [71, 27, 3, 2],
  [20, -23, 5, 5], [133, -26, 12, 6], [-112, 32, 5, 3], [-69, -23, 2, 5], [40, 19, 5, 4], [-5, 22, 8, 5], [32, 27, 6, 4]
];
export function desert(lo: number, la: number): number {
  let d = 0;
  for (const [x, y, rx, ry] of DES) {
    const dx = (lo - x) / rx, dy = (la - y) / ry, q = dx * dx + dy * dy;
    if (q < 1 && 1 - q > d) d = 1 - q;
  }
  return d;
}

export function forestMask(lo: number, la: number): number {
  return sm(0.42, 0.66, vn(lo * 0.9 + 31, la * 0.9 + 7, 11) * 0.55 + vn(lo * 2.6, la * 2.6, 12) * 0.45);
}

/** Sırt gürültüsü (kayalık görünüm); ince oktavlar sınırlı tutulur */
function ridge(lo: number, la: number, px: number): number {
  let s = 0, a = 0.5, f = 0.9, tot = 0;
  for (let o = 0; o < 4; o++) {
    if (o > 1 && 1 / f < 3 * px) break;
    const r = 1 - Math.abs(2 * vn(lo * f, la * f, 40 + o) - 1);
    s += a * r * r; tot += a; f *= 2.05; a *= 0.5;
  }
  return s / tot;
}

/** Yükseklik: sıra dağlar + sırt dokusu + pürüz (sürekli). Sonucu dizilere yazar (bellek ayırmaz). */
export function heightInto(H: Float32Array, Nn: Float32Array, k: number, lo: number, la: number, px: number): void {
  const e = elev(lo, la), n = fbm(lo, la, px, 3), w = sm(0, 0.2, e);
  let h = e + (n - 0.5) * (0.08 + 0.05 * w);
  if (e > 0.002) h += e * w * (0.8 * ridge(lo, la, px) - 0.3) + e * (1 - w) * 0;
  else { const dd = desert(lo, la); if (dd > 0.2) h += dd * 0.06 * (ridge(lo + 7, la + 3, px) - 0.5); }
  H[k] = h; Nn[k] = n;
}

const hex = (s: string): RGB => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const P = {
  grass: hex('#7d9749'), grass2: hex('#8e9c50'), forest: hex('#4d7035'), jungle: hex('#3a6335'), taiga: hex('#5a7150'),
  tundra: hex('#a9ae9a'), steppe: hex('#b3aa68'), desert: hex('#d9c088'), desert2: hex('#c6a766'),
  rock: hex('#8e7e69'), rock2: hex('#aaa090'), snow: hex('#f0f3f4')
};
const mix3 = (a: number, b: number, t1: number, c: number, t2: number) => { const x = a + (b - a) * t1; return x + (c - x) * t2; };
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

let cr = 0, cg = 0, cb = 0;
const setN = (r: number, g: number, b: number) => { cr = r; cg = g; cb = b; };
const toN = (r: number, g: number, b: number, t: number) => { cr += (r - cr) * t; cg += (g - cg) * t; cb += (b - cb) * t; };
const toC = (c: RGB, t: number) => toN(c[0], c[1], c[2], t);
const lp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Biyom rengi (gölgelendirme öncesi) -> out[0..2]. Bellek ayırmaz. */
export function biomeInto(out: Float64Array, lo: number, la: number, h: number, n: number): void {
  const al = Math.abs(la), d = desert(lo, la), fm = d > 0.7 || al > 76 ? 0 : forestMask(lo, la);
  const t0 = sm(0.35, 0.65, n);
  setN(lp(P.grass[0], P.grass2[0], t0), lp(P.grass[1], P.grass2[1], t0), lp(P.grass[2], P.grass2[2], t0));
  const wTrop = 1 - sm(9, 16, al), wBor = sm(48, 56, al);
  const cov = mix3(fm, sm(0.05, 0.5, fm + 0.35), wTrop, sm(0.15, 0.5, fm + 0.3), wBor);
  toN(lp(lp(P.forest[0], P.jungle[0], wTrop), P.taiga[0], wBor), lp(lp(P.forest[1], P.jungle[1], wTrop), P.taiga[1], wBor),
      lp(lp(P.forest[2], P.jungle[2], wTrop), P.taiga[2], wBor), 0.78 * cov);
  toC(P.steppe, 0.7 * sm(0.02, 0.3, d));
  const td = sm(0.25, 0.55, d);
  if (td > 0) { const k = sm(0.4, 0.7, n); toN(lp(P.desert[0], P.desert2[0], k), lp(P.desert[1], P.desert2[1], k), lp(P.desert[2], P.desert2[2], k), td); }
  toC(P.tundra, sm(62, 70, al));
  toC(P.rock, sm(0.3, 0.75, h));
  toC(P.rock2, sm(0.8, 1.1, h));
  const snowline = 1.15 - Math.min(1, Math.max(0, (al - 25) / 50)) * 0.55;
  toC(P.snow, sm(snowline, snowline + 0.22, h + (n - 0.5) * 0.25));
  const gx = (lo + 42) / 22, gy = (la - 73) / 11;   // Grönland buz örtüsü
  toC(P.snow, 0.95 * Math.max(1 - sm(0.6, 1, gx * gx + gy * gy), sm(-62, -67, la), sm(76, 80, la)));
  out[0] = cr; out[1] = cg; out[2] = cb;
}

/** Tepe gölgelendirme: ışık kuzeybatıdan. sx/sy = doğu/kuzey eğimi (yükseklik/derece). */
export function shade(sx: number, sy: number, relief: number): number {
  const k = 1.1 * relief, Lx = -0.5, Ly = 0.5, Lz = 0.7;
  const dot = (-sx * k * Lx - sy * k * Ly + Lz) / Math.sqrt(1 + k * k * (sx * sx + sy * sy));
  return Math.min(1.45, Math.max(0.55, 1 + (dot / Lz - 1) * 0.9));
}
