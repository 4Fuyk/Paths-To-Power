const SOUNDS = {
  click: 'click',
  success: 'success',
  error: 'error',
  hover: 'hover',
  win: 'win',
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

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
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (name === 'click') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.06);
    } 
    else if (name === 'hover') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

      gainNode.gain.setValueAtTime(volume * 0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.start(now);
      osc.stop(now + 0.03);
    }
    else if (name === 'success') {
      // Pleasant chime: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const time = now + index * 0.08;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(volume * 0.4, time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.start(time);
        osc.stop(time + 0.4);
      });
    }
    else if (name === 'error') {
      // Low descending discord buzz
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.35);

      osc2.frequency.setValueAtTime(143, now); // slightly detuned
      osc2.frequency.linearRampToValueAtTime(92, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);

      gainNode.gain.setValueAtTime(volume * 0.6, now);
      gainNode.gain.linearRampToValueAtTime(volume * 0.4, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.36);
      osc2.stop(now + 0.36);
    }
    else if (name === 'win') {
      // Magnificent Fanfare!
      // C4, E4, G4, C5, E5, G5, C6
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const time = now + index * 0.08;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(volume * 0.35, time + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

        osc.start(time);
        osc.stop(time + 0.55);
      });

      // Big final triumphant chord: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const finalChordTime = now + notes.length * 0.08;
      const chordFreqs = [523.25, 659.25, 783.99, 1046.50];
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, finalChordTime);

        gainNode.gain.setValueAtTime(0, finalChordTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.25, finalChordTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, finalChordTime + 1.2);

        osc.start(finalChordTime);
        osc.stop(finalChordTime + 1.3);
      });
    }
  } catch {}
}
