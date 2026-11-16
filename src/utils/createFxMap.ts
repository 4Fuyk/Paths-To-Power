/**
 * createFxMap: L.map yerine kullanılır. Haritaya (1) vektör katmanı için geniş kenar payı,
 * (2) akan deniz + bulut katmanı, (3) gece/gündüz katmanı ekler. Oyundaki tüm harita ekranlarında
 * aynı efektler çalışır; gece/gündüz düğmesi ('ptp-daynight' olayı) hepsini birlikte açıp kapatır.
 */
import { TerrainWaterLayer } from './mapFxLayer';
import { DayNightLayer } from './dayNightLayer';

export function dayNightPreference(): boolean {
  try { return localStorage.getItem('ptp_daynight') !== '0'; } catch (e) { return true; }
}

export function createFxMap(L: any, el: any, opts: any = {}): any {
  const o = { ...opts };
  if (!o.renderer && !o.preferCanvas) o.renderer = L.svg({ padding: 0.75 });
  const map = L.map(el, o);
  new TerrainWaterLayer({ darkMode: document.documentElement.classList.contains('dark') }).addTo(map);
  const night = new DayNightLayer({ enabled: dayNightPreference() }).addTo(map);
  const onToggle = (e: any) => night.setEnabled(!!e.detail);
  window.addEventListener('ptp-daynight', onToggle);
  map.on('unload', () => window.removeEventListener('ptp-daynight', onToggle));
  return map;
}
