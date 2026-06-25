const SOUNDS = {
  click: 'https://cdn.jsdelivr.net/gh/freeCodeCamp/cdn@main/build/audio/click.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
};

const cache: Record<string, HTMLAudioElement> = {};
let muted = false;

// Initialize muted from localStorage if exists
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('world_political_muted');
  if (stored !== null) {
    muted = stored === 'true';
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  if (typeof window !== 'undefined') {
    localStorage.setItem('world_political_muted', m.toString());
  }
}

export function playSound(name: keyof typeof SOUNDS, volume = 0.3) {
  if (muted) return;
  try {
    if (!cache[name]) cache[name] = new Audio(SOUNDS[name]);
    const a = cache[name].cloneNode(true) as HTMLAudioElement;
    a.volume = volume;
    a.play().catch(() => {});
  } catch {}
}
