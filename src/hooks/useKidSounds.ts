import { useCallback, useRef, useEffect, useState } from 'react';

// ── Web Audio API synthesized kid-friendly sounds ──
// All sounds are < 0.5s, soft, rounded, slightly magical

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

type SoundType = 'pop' | 'whoosh' | 'drop' | 'delete' | 'box_open' | 'save' | 'reward' | 'error'
  | 'shape_square' | 'shape_rectangle' | 'shape_circle' | 'shape_strip' | 'shape_torn' | 'shape_blob';

function synthPop(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const baseFreq = 600 + Math.random() * 200;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.15);
  gain.gain.setValueAtTime(volume * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function synthWhoosh(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(2000, now);
  bandpass.frequency.exponentialRampToValueAtTime(500, now + 0.18);
  bandpass.Q.value = 1.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  src.connect(bandpass).connect(gain).connect(ctx.destination);
  src.start(now);
  src.stop(now + 0.2);
}

function synthDrop(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
  gain.gain.setValueAtTime(volume * 0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function synthDelete(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // "poof" — descending with noise
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
  // soft noise layer
  const bufSize = ctx.sampleRate * 0.15;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.15;
  const nSrc = ctx.createBufferSource();
  nSrc.buffer = buf;
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(volume * 0.12, now + 0.05);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  nSrc.connect(nGain).connect(ctx.destination);
  nSrc.start(now + 0.05);
  nSrc.stop(now + 0.2);
}

function synthBoxOpen(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // sparkle chime — ascending arpeggio
  [0, 0.06, 0.12].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime([800, 1100, 1500][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.25, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.2);
  });
}

function synthSave(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // magical "ding" — two-note ascending
  [0, 0.1].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime([880, 1320][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.35, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.35);
  });
}

function synthReward(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // sparkle sweep — fast ascending notes
  [0, 0.04, 0.08, 0.12, 0.16].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + i * 200, now + delay);
    gain.gain.setValueAtTime(volume * 0.2, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.15);
  });
}

function synthError(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  // gentle "uh-oh" — two descending xylophone notes
  [0, 0.12].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime([600, 400][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.25, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.2);
  });
}

const synthMap: Record<SoundType, (ctx: AudioContext, vol: number) => void> = {
  pop: synthPop,
  whoosh: synthWhoosh,
  drop: synthDrop,
  delete: synthDelete,
  box_open: synthBoxOpen,
  save: synthSave,
  reward: synthReward,
  error: synthError,
};

export function useKidSounds() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('kid-sounds') !== 'false'; } catch { return true; }
  });
  const [volume, setVolume] = useState(() => {
    try { return parseFloat(localStorage.getItem('kid-sounds-volume') || '0.4'); } catch { return 0.4; }
  });
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });

  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('kid-sounds', String(enabled));
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('kid-sounds-volume', String(volume));
  }, [volume]);

  const lastPlayedRef = useRef<Record<string, number>>({});
  const actionCountRef = useRef(0);

  const play = useCallback((type: SoundType, minInterval = 300) => {
    if (!enabled || !kidMode) return;

    const now = Date.now();
    const last = lastPlayedRef.current[type] || 0;
    if (now - last < minInterval) return;
    lastPlayedRef.current[type] = now;

    // Resume audio context if suspended (browser policy)
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // Slight delay for natural feel
    setTimeout(() => {
      synthMap[type]?.(ctx, volume);
    }, 50);
  }, [enabled, kidMode, volume]);

  const playPop = useCallback(() => play('pop', 100), [play]);
  const playWhoosh = useCallback(() => play('whoosh', 500), [play]);
  const playDrop = useCallback(() => play('drop', 200), [play]);
  const playDelete = useCallback(() => play('delete', 300), [play]);
  const playBoxOpen = useCallback(() => play('box_open', 400), [play]);
  const playSave = useCallback(() => {
    play('save', 500);
    // Layer reward sparkle after a short delay
    setTimeout(() => play('reward', 0), 150);
  }, [play]);
  const playError = useCallback(() => play('error', 500), [play]);

  // Track actions for micro-rewards
  const trackAction = useCallback(() => {
    if (!enabled || !kidMode) return;
    actionCountRef.current++;
    if (actionCountRef.current % 5 === 0) {
      setTimeout(() => play('reward', 0), 200);
    }
  }, [enabled, kidMode, play]);

  return {
    enabled,
    setEnabled,
    volume,
    setVolume,
    kidMode,
    playPop,
    playWhoosh,
    playDrop,
    playDelete,
    playBoxOpen,
    playSave,
    playError,
    trackAction,
  };
}
