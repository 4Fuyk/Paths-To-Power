/**
 * Taban harita karosu çizimi (HOI4 tarzı): koyu mavi deniz, kıyıda sığ su, karada
 * iklime göre renklenen ve gölgelendirilen arazi (ova, orman, dağ, çöl, kar).
 */
import { biomeInto, fbm, heightInto, shade, sm, RGB } from './terrainModel';

export type Ring = { u: Float64Array; v: Float64Array; mnu: number; mxu: number; mnv: number; mxv: number };

const merc = (lat: number) => {
  const s = Math.sin(lat * Math.PI / 180);
  return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
};

const ringCache = new Map<string, Promise<Ring[]>>();
/** Kara halkalarını bir kez yükler ve paylaşır (taban harita + efekt katmanı). */
export function getRings(url: string): Promise<Ring[]> {
  const inline = (window as any).PTP_LAND;                     // <script src="world-land.js"> ile gömülü veri varsa onu kullan
  if (inline && !ringCache.has('inline')) ringCache.set('inline', Promise.resolve(buildRings(inline)));
  if (inline) return ringCache.get('inline')!;
  if (!ringCache.has(url)) ringCache.set(url, fetch(url).then(r => r.json()).then(buildRings));
  return ringCache.get(url)!;
}

export function buildRings(geo: any): Ring[] {
  const rings: Ring[] = [];
  const add = (ring: number[][]) => {
    const u = new Float64Array(ring.length), v = new Float64Array(ring.length);
    let mnu = 9, mxu = -9, mnv = 9, mxv = -9;
    ring.forEach(([lo, la], i) => {
      u[i] = (lo + 180) / 360; v[i] = merc(Math.max(-85, Math.min(85, la)));
      if (u[i] < mnu) mnu = u[i]; if (u[i] > mxu) mxu = u[i];
      if (v[i] < mnv) mnv = v[i]; if (v[i] > mxv) mxv = v[i];
    });
    rings.push({ u, v, mnu, mxu, mnv, mxv });
  };
  for (const f of geo.features) {
    const g = f.geometry; if (!g) continue;
    if (g.type === 'Polygon') add(g.coordinates[0]);
    else if (g.type === 'MultiPolygon') g.coordinates.forEach((p: number[][][]) => add(p[0]));
  }
  return rings;
}

const COL = new Float64Array(3);
const lmCanvas = document.createElement('canvas'); lmCanvas.width = lmCanvas.height = 64;
const lmCtx = lmCanvas.getContext('2d', { willReadFrequently: true })!;
/** 64x64 kaba kara maskesi (1 hücre genişletilmiş): denizde arazi hesabı atlanır, kıyı karolarında süre yarıya iner. */
function coarseLand(path: Path2D): Uint8Array {
  lmCtx.setTransform(1, 0, 0, 1, 0, 0); lmCtx.clearRect(0, 0, 64, 64);
  lmCtx.setTransform(0.25, 0, 0, 0.25, 0, 0); lmCtx.fillStyle = '#000'; lmCtx.fill(path); lmCtx.setTransform(1, 0, 0, 1, 0, 0);
  const d = lmCtx.getImageData(0, 0, 64, 64).data, m = new Uint8Array(4096), out = new Uint8Array(4096);
  for (let i = 0; i < 4096; i++) m[i] = d[i * 4 + 3] > 0 ? 1 : 0;
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    let any = 0;
    for (let dy = -1; dy <= 1 && !any; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < 64 && yy < 64 && m[yy * 64 + xx]) { any = 1; break; }
    }
    out[y * 64 + x] = any;
  }
  return out;
}
const SEA1: RGB = [24, 66, 106], SEA2: RGB = [31, 82, 124], SHALLOW = '70,180,196';
const toLat = (v: number) => Math.atan(Math.sinh(Math.PI * (1 - 2 * v))) * 180 / Math.PI;

export function drawBaseTile(t: HTMLCanvasElement, c: { x: number; y: number; z: number }, rings: Ring[], dark: boolean) {
  const x = t.getContext('2d')!;
  const n = Math.pow(2, c.z), S = n * 256, ox = c.x * 256, oy = c.y * 256, pxDeg = 360 / S;
  const m = 90 / S, u0 = c.x / n - m, u1 = (c.x + 1) / n + m, v0 = c.y / n - m, v1 = (c.y + 1) / n + m;
  const lonAt = (px: number) => (ox + px) / S * 360 - 180;
  const latAt = (py: number) => toLat((oy + py) / S);

  /* Deniz: hafif akıntı lekeleri (kenarlarda 1 örnek taşma, karo dikişi olmasın) */
  const SN = 50, sea = x.createImageData(SN, SN), sp = 256 / 48;
  for (let j = 0; j < SN; j++) for (let i = 0; i < SN; i++) {
    const k = sm(0.3, 0.7, fbm(lonAt((i - 0.5) * sp), latAt((j - 0.5) * sp), pxDeg * sp * 2, 21)), o = (j * SN + i) * 4;
    sea.data[o] = SEA1[0] + (SEA2[0] - SEA1[0]) * k; sea.data[o + 1] = SEA1[1] + (SEA2[1] - SEA1[1]) * k;
    sea.data[o + 2] = SEA1[2] + (SEA2[2] - SEA1[2]) * k; sea.data[o + 3] = 255;
  }
  const sc = document.createElement('canvas'); sc.width = sc.height = SN; sc.getContext('2d')!.putImageData(sea, 0, 0);
  x.imageSmoothingEnabled = true; x.drawImage(sc, -sp, -sp, SN * sp, SN * sp);

  /* Kara yolu */
  const path = new Path2D(), halo = new Path2D(); let any = false;
  for (const r of rings) {
    if (r.mxu < u0 || r.mnu > u1 || r.mxv < v0 || r.mnv > v1) continue;
    any = true; let lx = -1e9, ly = -1e9;
    const rp = new Path2D();
    for (let i = 0; i < r.u.length; i++) {
      const px = r.u[i] * S - ox, py = r.v[i] * S - oy;
      if (i && i < r.u.length - 1 && Math.abs(px - lx) + Math.abs(py - ly) < 0.5) continue;
      i ? rp.lineTo(px, py) : rp.moveTo(px, py); lx = px; ly = py;
    }
    rp.closePath();
    path.addPath(rp);
    if (Math.max(r.mxu - r.mnu, r.mxv - r.mnv) * S >= 14) halo.addPath(rp);   // küçük adalarda sığ su lekesi çıkmasın
  }
  if (any) {
    /* Kıyıdan açığa doğru turkuazdan koyu maviye derinlik gradyanı (yakınlaştıkça genişler) */
    x.lineJoin = 'round';
    const ws = 1 + 0.45 * Math.max(0, c.z - 5);
    for (let w = 92; w >= 5; w -= 7.5) {
      x.strokeStyle = `rgba(${SHALLOW},${0.06 + 0.12 * (1 - w / 92)})`; x.lineWidth = w * ws; x.stroke(halo);
    }
    /* Arazi: 128x128 örnekleme, kuzeybatı ışıklı gölgelendirme */
    const N = c.z <= 6 ? 128 : 160, step = 256 / N, G = N + 1;
    const lons = new Float64Array(G), lats = new Float64Array(G);
    for (let i = 0; i < G; i++) { lons[i] = lonAt(i * step); lats[i] = latAt(i * step); }
    const need = coarseLand(path), cm = 64 / N;
    const H = new Float32Array(G * G), Nn = new Float32Array(G * G);
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      if (!need[Math.min(63, (j * cm) | 0) * 64 + Math.min(63, (i * cm) | 0)]) { Nn[j * G + i] = 0.5; continue; }   // deniz: hesaplama
      heightInto(H, Nn, j * G + i, lons[i], lats[j], pxDeg * step);
    }
    const relief = 0.3 + 0.7 * sm(2.5, 5.5, c.z);
    const img = x.createImageData(N, N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      if (!need[Math.min(63, (j * cm) | 0) * 64 + Math.min(63, (i * cm) | 0)]) continue;
      const k = j * G + i, h = H[k];
      const sx = (H[k + 1] - h) / (lons[i + 1] - lons[i]);
      const sy = (h - H[k + G]) / (lats[j] - lats[j + 1]);
      biomeInto(COL, lons[i], lats[j], h, Nn[k]);
      const f = shade(sx, sy, relief), o = (j * N + i) * 4;
      img.data[o] = COL[0] * f; img.data[o + 1] = COL[1] * f; img.data[o + 2] = COL[2] * f; img.data[o + 3] = 255;
    }
    const lc = document.createElement('canvas'); lc.width = lc.height = N; lc.getContext('2d')!.putImageData(img, 0, 0);
    x.save(); x.clip(path); x.drawImage(lc, 0, 0, 256, 256); x.restore();
    /* Komşu ülke sınırlarındaki ince çatlakları arazi dokusuyla kapat */
    const pat = x.createPattern(lc, 'no-repeat');
    if (pat) { pat.setTransform(new DOMMatrix().scale(256 / N)); x.strokeStyle = pat; x.lineWidth = 1.6; x.stroke(path); }
  }
  if (dark) { x.fillStyle = 'rgba(6,14,28,0.4)'; x.fillRect(0, 0, 256, 256); }
}
