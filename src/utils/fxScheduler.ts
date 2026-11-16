/**
 * Tek ortak animasyon döngüsü + otomatik kalite ayarı.
 * Tüm efekt katmanları (deniz, bulut, gece) tek requestAnimationFrame döngüsünde çalışır.
 * Ortalama kare maliyeti yüksekse kalite kademeli düşer (daha seyrek örnekleme), düşünce geri yükselir.
 */
type Step = (now: number) => void;
const steps = new Set<Step>();
let raf = 0, frame = 0, ema = 2;

export const fxPerf = {
  /** 0 = en iyi kalite ... 3 = en hafif */
  level: 0,
  /** Düşük çözünürlüklü efekt hücre boyutu çarpanı */
  get cellMul() { return [1, 1.35, 1.8, 2.6][this.level]; },
  /** Durağan haldeyken kaç karede bir yeniden çizilsin */
  get idleEvery() { return this.level >= 2 ? 4 : 2; },
};

function loop(now: number) {
  raf = requestAnimationFrame(loop);
  if (document.hidden) return;
  const t0 = performance.now();
  for (const s of steps) s(now);
  ema = ema * 0.93 + (performance.now() - t0) * 0.07;
  if (++frame % 45 === 0) {
    if (ema > 7 && fxPerf.level < 3) fxPerf.level++;
    else if (ema < 2 && fxPerf.level > 0) fxPerf.level--;
  }
}

/** Bir adım fonksiyonu kaydeder; geri dönen fonksiyon kaydı siler. */
export function fxRegister(step: Step): () => void {
  steps.add(step);
  if (steps.size === 1) raf = requestAnimationFrame(loop);
  return () => { steps.delete(step); if (!steps.size) cancelAnimationFrame(raf); };
}

/** Yakınlaştırma animasyonu sırasında canvas'ı Leaflet gibi ölçekler (efekt kaybolmaz/titremez). */
export function bindZoomAnim(L: any, map: any, getCanvases: () => (HTMLCanvasElement | null)[]) {
  const h = (e: any) => {
    try {
      const ll = map.layerPointToLatLng(map.containerPointToLayerPoint([0, 0]));
      const scale = map.getZoomScale(e.zoom, map.getZoom());
      const off = map._latLngToNewLayerPoint(ll, e.zoom, e.center);
      for (const c of getCanvases()) if (c) L.DomUtil.setTransform(c, off, scale);
    } catch (err) { /* ölçekleme yapılamazsa son kare olduğu gibi kalır */ }
  };
  map.on('zoomanim', h);
  return () => map.off('zoomanim', h);
}
