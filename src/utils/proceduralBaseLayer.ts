/**
 * Prosedürel taban harita katmanı: ArcGIS/OSM gibi resim karolarının yerine geçer.
 * Karolar canvas ile çizilir (koyu mavi deniz + turkuaz sığ su + iklime göre renkli, gölgelendirilmiş arazi).
 * Karolar ana iş parçacığını bloke etmesin diye karelere bölünerek üretilir (son istenen önce).
 *
 * Kullanım:  const Base = createProceduralBaseClass(L);  new Base({ noWrap: true }).addTo(map);
 */
import { getRings, drawBaseTile, Ring } from './baseTile';

export function createProceduralBaseClass(L: any, landUrl = '/world_admin0_50m.geojson') {
  type Job = { t: HTMLCanvasElement; c: any; done: any; dark: boolean; cancelled?: boolean };
  let rings: Ring[] = [];
  const queue: Job[] = [], waiting: Job[] = [], layers = new Set<any>();
  let pumping = false;
  const cache = new Map<string, HTMLCanvasElement>(), CACHE_MAX = 140;   // en son kullanılan karolar tekrar çizilmez
  const isDark = () => document.documentElement.classList.contains('dark');
  const pump = () => { if (!pumping) { pumping = true; requestAnimationFrame(run); } };
  function run() {
    const t0 = performance.now();
    while (queue.length && performance.now() - t0 < 8) {
      const job = queue.pop()!;
      if (job.cancelled) continue;
      drawBaseTile(job.t, job.c, rings, job.dark);
      const key = `${job.c.z}/${job.c.x}/${job.c.y}/${job.dark ? 1 : 0}`;
      cache.set(key, job.t);
      if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
      job.done(null, job.t);
    }
    pumping = false;
    if (queue.length) pump();
  }
  getRings(landUrl).then(r => { rings = r; queue.push(...waiting.splice(0)); pump(); }).catch(console.error);

  const Base = L.GridLayer.extend({
    initialize(options: any) {
      L.GridLayer.prototype.initialize.call(this, options);
      layers.add(this);
      this.on('tileunload', (e: any) => { if (e.tile.__job) e.tile.__job.cancelled = true; });
    },
    createTile(c: any, done: any) {
      const dark = this.options._dark ?? isDark();
      const hit = cache.get(`${c.z}/${c.x}/${c.y}/${dark ? 1 : 0}`);
      if (hit && !hit.isConnected) { requestAnimationFrame(() => done(null, hit)); return hit; }   // önbellekten
      const t = document.createElement('canvas'); t.width = t.height = 256;
      const job: Job = { t, c, done, dark };
      (t as any).__job = job;
      if (rings.length) { queue.push(job); pump(); } else waiting.push(job);
      return t;
    }
  });
  // <html class="dark"> değişince karoları yeniden çiz
  new MutationObserver(() => layers.forEach(l => l._map && l.redraw()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return Base;
}
