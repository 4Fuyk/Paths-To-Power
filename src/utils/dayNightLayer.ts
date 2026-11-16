/**
 * DayNightLayer: gece/gündüz sınırı (terminatör), alacakaranlık ve gece tarafında şehir ışıkları.
 * Güneşin konumu gerçek astronomik formülle (NOAA yaklaşımı) hesaplanır. Açılıp kapatılabilir,
 * zaman hızı ayarlanabilir (1 = gerçek zaman). Canvas ekrana sabit çizilir; tıklamayı engellemez.
 */
import L from 'leaflet';
import { fxRegister, fxPerf, bindZoomAnim } from './fxScheduler';

export interface DayNightOptions {
  enabled?: boolean;
  /** Zaman hızı: 1 = gerçek zaman. Oyunda hız, oyun hızından gelir (bkz. App.tsx); örn. 2880 = 30 saniyede bir gün */
  speed?: number;
  /** Gecenin en koyu opaklığı (0..1) */
  maxDark?: number;
  /** Gece tarafında parlayacak noktalar: [boylam, enlem] */
  lights?: [number, number][];
  /** Özel zaman kaynağı (ms). Verilirse hız yok sayılır. */
  getTime?: () => number;
}

const RAD = Math.PI / 180;

/** Güneşin deklinasyonu (radyan) ve tam tepede olduğu boylam (derece) */
export function sunPosition(ms: number): { dec: number; lon: number } {
  const d = new Date(ms), y0 = Date.UTC(d.getUTCFullYear(), 0, 0);
  const day = (ms - y0) / 86400000, hour = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const g = 2 * Math.PI / 365 * (day - 1 + (hour - 12) / 24);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
    - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const utcMin = hour * 60;
  return { dec, lon: -(utcMin + eq - 720) / 4 };
}

const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export class DayNightLayer extends L.Layer {
  private opts: Required<Omit<DayNightOptions, 'getTime'>> & { getTime?: () => number };
  private map: any = null;
  private cv: HTMLCanvasElement | null = null;
  private cx!: CanvasRenderingContext2D;
  private low = document.createElement('canvas');
  private lowCtx = this.low.getContext('2d')!;
  private img: ImageData | null = null;
  private cell = 8;
  private glow = document.createElement('canvas');
  private unreg: (() => void) | null = null; private unzoom: (() => void) | null = null; private frame = 0; private lastKey = ''; private shown = false;
  private sim0 = Date.now(); private real0 = performance.now();
  /** Oyun hızına bağlı gece/gündüz hızı: App 'ptp-daynight-speed' olayıyla saniyede kaç simülasyon-saniyesi aktığını bildirir (0 = durdu). */
  private onSpeed = (e: Event) => this.setSpeed(Number((e as CustomEvent).detail) || 0);

  constructor(options: DayNightOptions = {}) {
    super();
    this.opts = { enabled: true, speed: 1, maxDark: 0.55, lights: [], ...options } as any;
    this.glow.width = this.glow.height = 32;
    const p = this.glow.getContext('2d')!, g = p.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,225,150,1)'); g.addColorStop(0.3, 'rgba(255,200,110,0.55)'); g.addColorStop(1, 'rgba(255,190,90,0)');
    p.fillStyle = g; p.fillRect(0, 0, 32, 32);
  }

  setEnabled(v: boolean) { this.opts.enabled = v; }
  isEnabled() { return this.opts.enabled; }
  setLights(pts: [number, number][]) { this.opts.lights = pts; }
  /** Zaman hızını değiştirir; o ana kadar geçen simülasyon zamanı korunur. */
  setSpeed(s: number) { const now = this.getSimTime(); this.sim0 = now; this.real0 = performance.now(); this.opts.speed = s; }
  /** Simülasyon zamanını verilen ana ayarlar (ms). */
  setTime(ms: number) { this.sim0 = ms; this.real0 = performance.now(); }
  getSimTime(): number {
    return this.opts.getTime ? this.opts.getTime() : this.sim0 + (performance.now() - this.real0) * this.opts.speed;
  }

  onAdd(map: any): this {
    this.map = map;
    const pane = map.getPane('fxNightPane') || map.createPane('fxNightPane');
    pane.style.zIndex = '420'; pane.style.pointerEvents = 'none';   // ülke poligonları üstü, bulut ve işaretçiler altı
    this.cv = document.createElement('canvas');
    this.cv.style.position = 'absolute'; this.cv.style.pointerEvents = 'none';
    this.cv.className = 'leaflet-zoom-animated';
    pane.appendChild(this.cv); this.cx = this.cv.getContext('2d')!;
    const initial = (window as any).__ptpDnSpeed;                 // katman sonradan eklenirse mevcut oyun hızını al
    if (typeof initial === 'number') this.setSpeed(initial);
    window.addEventListener('ptp-daynight-speed', this.onSpeed);
    this.unzoom = bindZoomAnim(L, map, () => [this.cv]);
    this.unreg = fxRegister(this.tick);
    return this;
  }
  onRemove(): this { window.removeEventListener('ptp-daynight-speed', this.onSpeed); this.unreg?.(); this.unzoom?.(); this.cv?.remove(); this.cv = null; this.map = null; return this; }

  private tick = () => {
    const map = this.map, cv = this.cv;
    if (!map || !cv) return;
    if (map._animatingZoom) return;                        // yakınlaştırırken katman haritayla birlikte ölçeklenir (gece gündüze dönmez)
    const size = map.getSize(), zoom = map.getZoom(), tl = map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(cv, tl);
    if (!this.opts.enabled) {
      if (this.shown) { this.cx.clearRect(0, 0, cv.width, cv.height); this.shown = false; }
      return;
    }
    const want = Math.round(Math.max(8, size.x / 180) * fxPerf.cellMul);
    if (cv.width !== size.x || cv.height !== size.y || this.cell !== want) {
      cv.width = size.x; cv.height = size.y; cv.style.width = size.x + 'px'; cv.style.height = size.y + 'px';
      this.cell = want;
      this.low.width = Math.ceil(size.x / this.cell); this.low.height = Math.ceil(size.y / this.cell);
      this.img = this.lowCtx.createImageData(this.low.width, this.low.height); this.lastKey = '';
    }
    const key = `${tl.x}|${tl.y}|${zoom}`, moved = key !== this.lastKey; this.lastKey = key; this.frame++;
    const fast = this.opts.speed > 1 || !!this.opts.getTime;
    if (moved || (fast ? this.frame % fxPerf.idleEvery === 0 : this.frame % 30 === 0) || !this.shown) this.draw(tl, size, zoom);
    this.shown = true;
  };

  private draw(tl: { x: number; y: number }, size: { x: number; y: number }, zoom: number) {
    const map = this.map, S = 256 * Math.pow(2, zoom), po = map.getPixelOrigin(), ox = po.x + tl.x, oy = po.y + tl.y;
    const { dec, lon: sunLon } = sunPosition(this.getSimTime()), sd = Math.sin(dec), cd = Math.cos(dec);
    const img = this.img!, d = img.data, lw = this.low.width, lh = this.low.height, cell = this.cell, maxA = this.opts.maxDark;
    const cosH = new Float32Array(lw);
    for (let i = 0; i < lw; i++) cosH[i] = Math.cos(((ox + i * cell) / S * 360 - 180 - sunLon) * RAD);
    let k = 0;
    for (let j = 0; j < lh; j++) {
      const v = Math.min(1, Math.max(0, (oy + j * cell) / S)), lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * v)));
      const sl = Math.sin(lat) * sd, cl = Math.cos(lat) * cd;
      for (let i = 0; i < lw; i++, k += 4) {
        const s = sl + cl * cosH[i];                          // güneşin yükseklik açısının sinüsü
        const night = sm(0.09, -0.24, s), aN = night * maxA;
        const aW = 0.17 * Math.max(0, 1 - Math.abs(s - 0.02) / 0.13) * (1 - night);   // gün batımı/doğumu sıcak tonu
        const a = aN + aW * (1 - aN);
        if (a <= 0.001) { d[k + 3] = 0; continue; }
        const wN = aN / a, wW = 1 - wN;
        d[k] = 5 * wN + 255 * wW; d[k + 1] = 12 * wN + 140 * wW; d[k + 2] = 36 * wN + 60 * wW; d[k + 3] = a * 255;
      }
    }
    this.lowCtx.putImageData(img, 0, 0);
    const cx = this.cx;
    cx.clearRect(0, 0, size.x, size.y); cx.imageSmoothingEnabled = true;
    cx.drawImage(this.low, 0, 0, lw * cell, lh * cell);
    // gece tarafında şehir ışıkları
    const r = Math.max(5, Math.min(14, 1.7 * (zoom + 1)));
    for (const [lo, la] of this.opts.lights) {
      const x = (lo + 180) / 360 * S - ox, sl2 = Math.sin(la * RAD), y = (0.5 - Math.log((1 + sl2) / (1 - sl2)) / (4 * Math.PI)) * S - oy;
      if (x < -r || x > size.x + r || y < -r || y > size.y + r) continue;
      const s = Math.sin(la * RAD) * sd + Math.cos(la * RAD) * cd * Math.cos((lo - sunLon) * RAD);
      const n = sm(0.05, -0.2, s);
      if (n <= 0.02) continue;
      cx.globalAlpha = n * 0.85; cx.drawImage(this.glow, x - r, y - r, 2 * r, 2 * r);
    }
    cx.globalAlpha = 1;
  }
}
