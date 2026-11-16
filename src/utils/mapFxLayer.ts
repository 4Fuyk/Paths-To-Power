/**
 * TerrainWaterLayer (HOI4 tarzı deniz + gerçek iklime göre hafif bulutlar)
 * ----------------------------------------------------------------------
 *  - Deniz: akan, yumuşak dalga/ışıltı; düşük çözünürlükte hesaplanıp büyütülür. Uzakta hafif, yakında tam görünür.
 *    Kara maskesiyle kesilir, kıyıda köpük çizgisi vardır.
 *  - Bulutlar: iklim verisine göre seyrek, yavaş sürüklenen, gölgeli kümeler; çok yakın zoomda kaybolur.
 *  Canvas'lar ekrana sabittir, her karede haritayla hizalanır; yakınlaştırırken Leaflet gibi ölçeklenir.
 */
import L from 'leaflet';
import { hash, sm } from './terrainModel';
import { getRings, Ring } from './baseTile';
import { cloudCover } from './cloudClimate';
import { fxRegister, fxPerf, bindZoomAnim } from './fxScheduler';

export interface TerrainWaterOptions {
  landUrl?: string;
  /** Dalgaların tam görünür olduğu zoom aralığı başlangıcı/bitişi */
  waveMin?: number;
  waveFull?: number;
  darkMode?: boolean;
  clouds?: boolean;
}

/* 256x256 tekrarlı değer gürültüsü dokusu (su hareketi için) */
const NT = new Float32Array(65536);
for (let i = 0; i < 65536; i++) NT[i] = hash(i & 255, i >> 8, 99);
function tex(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const x0 = xi & 255, x1 = (xi + 1) & 255, y0 = (yi & 255) << 8, y1 = ((yi + 1) & 255) << 8;
  const a = NT[y0 | x0], b = NT[y0 | x1], c = NT[y1 | x0], d = NT[y1 | x1];
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

const PAD = 0.6, MS = 0.5;   // kara maskesi: ekranın %60 fazlası, yarı çözünürlük

export class TerrainWaterLayer extends L.Layer {
  private opts: Required<TerrainWaterOptions>;
  private map: any = null;
  private water: HTMLCanvasElement | null = null;
  private cloud: HTMLCanvasElement | null = null;
  private wc!: CanvasRenderingContext2D;
  private cc!: CanvasRenderingContext2D;
  private low = document.createElement('canvas');
  private lowCtx = this.low.getContext('2d')!;
  private img: ImageData | null = null;
  private cell = 0;
  private mask = document.createElement('canvas');
  private foam = document.createElement('canvas');
  private mRect = { x: 0, y: 0, w: 0, h: 0 };
  private mZoom = -1;
  private rings: Ring[] | null = null;
  private puff = document.createElement('canvas');
  private puffDark = document.createElement('canvas');
  private buf = new Float32Array(4 * 600);
  private frame = 0;
  private lastKey = '';
  private waterOn = false;
  private cloudOn = false;
  private unreg: (() => void) | null = null;
  private unzoom: (() => void) | null = null;

  constructor(options: TerrainWaterOptions = {}) {
    super();
    this.opts = { landUrl: '/world_admin0_50m.geojson', waveMin: 3, waveFull: 5, darkMode: false, clouds: true, ...options } as any;
    const mkPuff = (cv: HTMLCanvasElement, rgb: string) => {
      cv.width = cv.height = 128;
      const p = cv.getContext('2d')!, g = p.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, `rgba(${rgb},0.9)`); g.addColorStop(0.5, `rgba(${rgb},0.4)`); g.addColorStop(1, `rgba(${rgb},0)`);
      p.fillStyle = g; p.fillRect(0, 0, 128, 128);
    };
    mkPuff(this.puff, '255,255,255'); mkPuff(this.puffDark, '20,30,50');
  }

  setDarkMode(dark: boolean) { this.opts.darkMode = dark; }
  setClouds(on: boolean) { this.opts.clouds = on; }

  onAdd(map: any): this {
    this.map = map;
    const mk = (name: string, z: string) => {
      const pane = map.getPane(name) || map.createPane(name);
      pane.style.zIndex = z; pane.style.pointerEvents = 'none';
      const c = document.createElement('canvas');
      c.className = 'leaflet-zoom-animated';
      c.style.position = 'absolute'; c.style.pointerEvents = 'none';
      pane.appendChild(c);
      return c;
    };
    this.water = mk('fxWaterPane', '250');   // taban harita üstü, ülke poligonları altı
    this.cloud = mk('fxCloudPane', '440');   // ülke poligonları ve gece katmanı üstü, işaretçiler altı
    this.wc = this.water.getContext('2d')!;
    this.cc = this.cloud.getContext('2d')!;
    getRings(this.opts.landUrl).then(r => { this.rings = r; this.mZoom = -1; }).catch(console.error);
    this.unzoom = bindZoomAnim(L, map, () => [this.water, this.cloud]);
    this.unreg = fxRegister(this.tick);
    return this;
  }

  onRemove(): this {
    this.unreg?.(); this.unzoom?.();
    this.water?.remove(); this.cloud?.remove();
    this.water = this.cloud = null; this.map = null;
    return this;
  }

  private ensureSize(size: { x: number; y: number }) {
    const w = this.water!, c = this.cloud!;
    if (w.width !== size.x || w.height !== size.y) {
      w.width = size.x; w.height = size.y; w.style.width = size.x + 'px'; w.style.height = size.y + 'px';
      c.width = Math.ceil(size.x * 0.5); c.height = Math.ceil(size.y * 0.5);
      c.style.width = size.x + 'px'; c.style.height = size.y + 'px';
      this.mZoom = -1; this.cell = 0;
    }
    const cell = Math.round(Math.max(6, size.x / 260) * fxPerf.cellMul);   // kalite düştükçe daha seyrek örnekle
    if (cell !== this.cell) {
      this.cell = cell;
      this.low.width = Math.ceil(size.x / cell); this.low.height = Math.ceil(size.y / cell);
      this.img = this.lowCtx.createImageData(this.low.width, this.low.height);
    }
  }

  /** Kara maskesi ve kıyı köpüğü: görünür alanın etrafında geniş pay ile bir kez çizilir. */
  private buildMask(tl: { x: number; y: number }, size: { x: number; y: number }, zoom: number) {
    if (!this.rings) return;
    const S = 256 * Math.pow(2, zoom), po = this.map.getPixelOrigin();
    const x0 = tl.x - PAD * size.x, y0 = tl.y - PAD * size.y, w = size.x * (1 + 2 * PAD), h = size.y * (1 + 2 * PAD);
    const u0 = (po.x + x0) / S, u1 = (po.x + x0 + w) / S, v0 = (po.y + y0) / S, v1 = (po.y + y0 + h) / S;
    const path = new Path2D();
    for (const r of this.rings) {
      if (r.mxu < u0 || r.mnu > u1 || r.mxv < v0 || r.mnv > v1) continue;
      let lx = -1e9, ly = -1e9;
      for (let i = 0; i < r.u.length; i++) {
        const x = ((r.u[i] * S - po.x) - x0) * MS, y = ((r.v[i] * S - po.y) - y0) * MS;
        if (i && i < r.u.length - 1 && Math.abs(x - lx) + Math.abs(y - ly) < 0.6) continue;
        i ? path.lineTo(x, y) : path.moveTo(x, y); lx = x; ly = y;
      }
      path.closePath();
    }
    const mw = Math.ceil(w * MS), mh = Math.ceil(h * MS);
    this.mask.width = this.foam.width = mw; this.mask.height = this.foam.height = mh;
    const mc = this.mask.getContext('2d')!, fc = this.foam.getContext('2d')!;
    mc.fillStyle = '#000'; mc.fill(path);
    fc.lineJoin = 'round'; fc.strokeStyle = '#fff'; fc.lineWidth = 6 * MS; fc.stroke(path);
    fc.globalCompositeOperation = 'destination-out'; fc.fill(path);
    this.mRect = { x: x0, y: y0, w, h }; this.mZoom = zoom;
  }

  private needMask(tl: { x: number; y: number }, size: { x: number; y: number }, zoom: number) {
    const r = this.mRect, m = 0.15 * size.x;
    return this.mZoom !== zoom || tl.x < r.x + m || tl.y < r.y + m || tl.x + size.x > r.x + r.w - m || tl.y + size.y > r.y + r.h - m;
  }

  /** Akan deniz: hareketli gürültü katmanları + ilerleyen dalga sırtları + parıltılar. */
  private drawWater(t: number, A: number, tl: { x: number; y: number }, size: { x: number; y: number }) {
    const img = this.img!, d = img.data, lw = this.low.width, lh = this.low.height, cell = this.cell;
    const po = this.map.getPixelOrigin(), ox = po.x + tl.x, oy = po.y + tl.y;
    let k = 0;
    for (let j = 0; j < lh; j++) {
      const wy = oy + j * cell;
      for (let i = 0; i < lw; i++, k += 4) {
        const wx = ox + i * cell;
        // her katman farklı açıda döndürülür: gürültü ızgarası belli olmaz
        const a1 = wx * 0.0105 + wy * 0.0034 + t * 0.23, b1 = wy * 0.0105 - wx * 0.0034 + t * 0.10;
        const a2 = wx * 0.0160 - wy * 0.0230 - t * 0.30, b2 = wy * 0.0160 + wx * 0.0230 + t * 0.20;
        const a3 = wx * 0.0300 + wy * 0.0420 + t * 0.50, b3 = wy * 0.0300 - wx * 0.0420 - t * 0.35;
        const n1 = tex(a1, b1), n2 = tex(a2, b2), n3 = tex(a3, b3);
        const dv = (n1 * 0.5 + n2 * 0.32 + n3 * 0.18 - 0.5) * 2;
        let a: number, r: number, g: number, b: number;
        if (dv > 0) { a = dv * 110 * A; r = 205; g = 232; b = 248; } else { a = -dv * 170 * A; r = 4; g = 26; b = 54; }
        const gl = (n2 * 0.4 + n3 * 0.6 - 0.66) * 4;               // ince parıltılar
        if (gl > 0 && gl * 95 * A > a) { a = gl * 95 * A; r = 238; g = 249; b = 255; }
        // ilerleyen dalga sırtları (yönlü, net görülen hareket)
        const rp = Math.sin((wx * 0.7 + wy * 0.45) * 0.075 - t * 1.9 + n1 * 7.5);
        const hl = (rp - 0.82) * 5.5 * (0.35 + 0.65 * n2) * 80 * A;
        if (hl > a) { a = hl; r = 232; g = 246; b = 255; }
        d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = a;
      }
    }
    this.lowCtx.putImageData(img, 0, 0);
    const wc = this.wc;
    wc.globalCompositeOperation = 'source-over'; wc.globalAlpha = 1;
    wc.clearRect(0, 0, size.x, size.y);
    wc.imageSmoothingEnabled = true;
    wc.drawImage(this.low, 0, 0, lw * cell, lh * cell);
    const r = this.mRect, dx = r.x - tl.x, dy = r.y - tl.y;
    wc.globalCompositeOperation = 'destination-out';
    wc.drawImage(this.mask, dx, dy, r.w, r.h);                   // karayı sil
    wc.globalCompositeOperation = 'source-over';
    wc.globalAlpha = A * (0.5 + 0.12 * Math.sin(t * 1.3));
    wc.drawImage(this.foam, dx, dy, r.w, r.h);                   // kıyı köpüğü
    wc.globalAlpha = 1;
  }

  /** Bulutlar: gerçek iklim oranına göre seyrek, gölgeli, yavaş sürüklenen kümeler. */
  private drawClouds(t: number, C: number, tl: { x: number; y: number }, size: { x: number; y: number }, zoom: number) {
    const cc = this.cc, cv = this.cloud!;
    cc.setTransform(1, 0, 0, 1, 0, 0); cc.clearRect(0, 0, cv.width, cv.height); cc.setTransform(0.5, 0, 0, 0.5, 0, 0);
    const S = 256 * Math.pow(2, zoom), po = this.map.getPixelOrigin(), ox = po.x + tl.x, oy = po.y + tl.y;
    const cs = 0.02, drift = t * 0.00006, amp = C * (this.opts.darkMode ? 0.26 : 0.34), PMAX = 0.34;
    const nowD = new Date(), doy = Math.floor((+nowD - Date.UTC(nowD.getUTCFullYear(), 0, 0)) / 86400000);
    const i0 = Math.floor((ox / S - drift) / cs) - 1, i1 = Math.floor(((ox + size.x) / S - drift) / cs) + 1;
    const j0 = Math.floor(oy / S / cs) - 1, j1 = Math.floor((oy + size.y) / S / cs) + 1;
    let n = 0;
    const buf = this.buf;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const th = hash(i, j, 50) / PMAX;                       // bu hücrenin bulut eşiği
      if (th > 1) continue;
      const cu = (i + hash(i, j, 51)) * cs + drift, cvv = (j + hash(i, j, 52)) * cs;
      // gerçek iklim: bulut oranı bölgeye göre değişir (çöller az, fırtına kuşağı/ITCZ çok)
      const lon = cu * 360 - 180, lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * cvv))) * 180 / Math.PI;
      const cf = cloudCover(lon, lat, doy), q = (0.03 + 0.30 * cf * cf) / PMAX;
      const fade = Math.min(1, Math.max(0, (q - th) / 0.15));
      if (fade <= 0) continue;
      const sz = 0.75 + 0.5 * cf;
      for (let k = 0; k < 6 && n < 600; k++) {
        const r = Math.min(110, (0.5 + hash(i, j, 80 + k) * 0.6) * cs * 0.3 * S * sz * (1 + 0.05 * Math.sin(t * 0.3 + k)));
        const x = (cu + (hash(i, j, 60 + k) - 0.5) * cs * 0.8) * S - ox, y = (cvv + (hash(i, j, 70 + k) - 0.5) * cs * 0.3) * S - oy;
        if (x < -r || x > size.x + r || y < -r || y > size.y + r) continue;
        buf[n * 4] = x; buf[n * 4 + 1] = y; buf[n * 4 + 2] = r; buf[n * 4 + 3] = amp * fade * (0.7 + 0.3 * hash(i, j, 90 + k));
        n++;
      }
    }
    // önce yumuşak gölge (renkli ülkelerin üstünde de bulutun görünmesini sağlar), sonra bulut
    for (let p = 0; p < n; p++) {
      const r = buf[p * 4 + 2]; cc.globalAlpha = buf[p * 4 + 3] * 0.55;
      cc.drawImage(this.puffDark, buf[p * 4] + r * 0.3 - r, buf[p * 4 + 1] + r * 0.45 - r, 2 * r, 2 * r);
    }
    for (let p = 0; p < n; p++) {
      const r = buf[p * 4 + 2]; cc.globalAlpha = buf[p * 4 + 3];
      cc.drawImage(this.puff, buf[p * 4] - r, buf[p * 4 + 1] - r, 2 * r, 2 * r);
    }
    cc.globalAlpha = 1;
  }

  private tick = (now: number) => {
    const map = this.map;
    if (!map || !this.water || !this.cloud) return;
    if (map._animatingZoom) return;                        // yakınlaştırma animasyonunda canvas Leaflet gibi ölçeklenir
    const size = map.getSize(), zoom = map.getZoom();
    const tl = map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.water, tl); L.DomUtil.setPosition(this.cloud, tl);   // ekrana sabit kal
    this.ensureSize(size);
    const t = now / 1000;
    const A = 0.4 + 0.6 * sm(this.opts.waveMin, this.opts.waveFull, zoom);          // uzakta bile hafif hareket
    const C = !this.opts.clouds ? 0 : sm(4.6, 5.6, zoom) * (1 - sm(6.2, 7.6, zoom)); // yakın zoomda bulut yok
    const key = `${tl.x}|${tl.y}|${zoom}|${this.cell}`, moved = key !== this.lastKey;
    this.lastKey = key; this.frame++;
    const draw = moved || this.frame % fxPerf.idleEvery === 0;

    if (this.rings) {
      if (this.needMask(tl, size, zoom)) this.buildMask(tl, size, zoom);
      if (draw) this.drawWater(t, A, tl, size);
      this.waterOn = true;
    }
    if (C > 0) { if (draw) this.drawClouds(t, C, tl, size, zoom); this.cloudOn = true; }
    else if (this.cloudOn) { this.cc.setTransform(1, 0, 0, 1, 0, 0); this.cc.clearRect(0, 0, this.cloud.width, this.cloud.height); this.cloudOn = false; }
  };
}
