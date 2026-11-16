/**
 * Yıllık ortalama bulut örtüsü (0..1) için yaklaşık iklim modeli.
 * Gerçek uydu iklimatolojisinin genel desenlerini taklit eder (MODIS/ISCCP tipi haritalar):
 *  - Orta enlem fırtına kuşağı (~60°) çok bulutlu, ITCZ (ekvator civarı, mevsimle kayar) bulutlu,
 *  - Subtropikal yüksek basınç kuşağı (~25°) ve büyük çöller (Sahra, Arabistan, Avustralya, Gobi) az bulutlu,
 *  - Soğuk akıntılı batı kıyılarında (Peru, Kaliforniya, Namibya) deniz stratüsü nedeniyle çok bulutlu.
 */
const g = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));

/** [boylam, enlem, yarıçap boylam, yarıçap enlem, değişim] */
const REGIONS: [number, number, number, number, number][] = [
  [9, 23, 28, 9, -0.32], [47, 23, 9, 6, -0.26], [133, -26, 12, 6, -0.22], [105, 43, 10, 5, -0.16],
  [22, -24, 6, 5, -0.12], [15, 36, 12, 3, -0.12], [-112, 32, 6, 4, -0.14],
  [-85, -15, 9, 6, 0.26], [-128, 30, 7, 6, 0.2], [5, -18, 7, 6, 0.26],
  [-60, -5, 12, 7, 0.14], [20, 0, 10, 6, 0.14], [115, 0, 14, 6, 0.14],
  [-30, 60, 15, 6, 0.14], [80, 20, 10, 7, 0.08], [90, 30, 10, 5, 0.05], [-70, -45, 8, 8, 0.1], [140, 36, 8, 5, 0.1]
];

/** @param doy yılın günü (1..366): ITCZ mevsimsel olarak kuzey/güney kayar. */
export function cloudCover(lon: number, lat: number, doy = 180): number {
  const al = Math.abs(lat), itcz = 5 + 6 * Math.sin(2 * Math.PI * (doy - 100) / 365);
  let c = 0.5 + 0.2 * g(al, 60, 13) + 0.17 * g(lat, itcz, 8) - 0.17 * g(al, 26, 9);
  for (const [x, y, rx, ry, d] of REGIONS) {
    const dx = (lon - x) / rx, dy = (lat - y) / ry, q = dx * dx + dy * dy;
    if (q < 4) c += d * Math.exp(-q);
  }
  return Math.min(0.92, Math.max(0.08, c));
}
