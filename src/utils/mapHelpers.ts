/**
 * Küçük yardımcılar: ülkeye odaklanma ve dünya haritasını ekrana sığdırma.
 */

/** Çok parçalı ülkelerde (ABD, Fransa, Rusya...) en büyük ana kara parçasının sınırlarını verir: [[güney, batı], [kuzey, doğu]] */
export function mainLandBounds(feature: any): [[number, number], [number, number]] | null {
  const g = feature?.geometry;
  if (!g) return null;
  const polys: number[][][][] = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  let best: [[number, number], [number, number]] | null = null, bestArea = -1;
  for (const p of polys) {
    const ring = p[0] || [];
    if (ring.length < 3) continue;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of ring) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const area = (x1 - x0) * (y1 - y0);
    if (area > bestArea) { bestArea = area; best = [[y0, x0], [y1, x1]]; }
  }
  return best;
}

/** Bir ülkeye tıklanınca haritayı o ülkeye uçurur. feature = GeoJSON Feature. */
export function flyToCountry(map: any, feature: any, opts: { padding?: [number, number]; maxZoom?: number; duration?: number } = {}) {
  const b = mainLandBounds(feature);
  if (b) map.flyToBounds(b, { padding: opts.padding ?? [80, 80], maxZoom: opts.maxZoom ?? 7, duration: opts.duration ?? 1.0 });
}

/**
 * Minimum zoom'u dünya ekranı dolduracak şekilde ayarlar (kenarlarda boş/küçük dünya görünmesin).
 * Harita oluşturulduktan sonra ve boyut değişince çağrılır; otomatik olarak 'resize' olayını dinler.
 */
export function fitWorldMinZoom(L: any, map: any, bounds: [[number, number], [number, number]] = [[-85, -180], [85, 180]], base = 0) {
  const fit = () => {
    try {
      const s = map.getSize();
      if (s.x < 50 || s.y < 50) return;
      const z = map.getBoundsZoom(L.latLngBounds(bounds), true);
      if (isFinite(z)) map.setMinZoom(Math.max(base, z));
    } catch (e) { /* ayar uygulanamazsa harita varsayılan haliyle çalışır */ }
  };
  map.on('resize', fit);
  fit();
  setTimeout(fit, 350);
}
