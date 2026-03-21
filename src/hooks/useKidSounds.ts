import { useCallback, useRef, useEffect, useState } from 'react';

// ── Web Audio API synthesized sounds ──
// Kid sounds: < 0.5s, soft, rounded, slightly magical
// Adult sounds: gentle, meditative, zen-like tones

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

type SoundType = 'pop' | 'whoosh' | 'drop' | 'delete' | 'box_open' | 'save' | 'reward' | 'error'
  | 'shape_square' | 'shape_rectangle' | 'shape_circle' | 'shape_strip' | 'shape_torn' | 'shape_blob'
  | 'tool_cut' | 'tool_crumple' | 'tool_grow' | 'tool_shrink';

// ══════════════════════════════════════
// KID SOUNDS (unchanged — playful & bouncy)
// ══════════════════════════════════════

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

function synthShapeSquare(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'square'; osc.frequency.setValueAtTime(440, now);
  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.12);
}

function synthShapeRectangle(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'square'; osc.frequency.setValueAtTime(330, now);
  osc.frequency.linearRampToValueAtTime(440, now + 0.1);
  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.15);
}

function synthShapeCircle(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(700, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.16);
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.2);
}

function synthShapeStrip(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sawtooth'; osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
  gain.gain.setValueAtTime(volume * 0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.1);
}

function synthShapeTorn(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const bufSize = ctx.sampleRate * 0.12;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 2;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  src.connect(bp).connect(gain).connect(ctx.destination); src.start(now); src.stop(now + 0.12);
}

function synthShapeBlob(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(500, now + 0.06);
  osc.frequency.exponentialRampToValueAtTime(250, now + 0.18);
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.22);
}

function synthToolCut(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const bufSize = ctx.sampleRate * 0.08;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  src.connect(hp).connect(gain).connect(ctx.destination); src.start(now); src.stop(now + 0.08);
  const osc = ctx.createOscillator(); const g2 = ctx.createGain();
  osc.type = 'square'; osc.frequency.setValueAtTime(3000, now);
  osc.frequency.exponentialRampToValueAtTime(1500, now + 0.04);
  g2.gain.setValueAtTime(volume * 0.15, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(g2).connect(ctx.destination); osc.start(now); osc.stop(now + 0.06);
}

function synthToolCrumple(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const bufSize = ctx.sampleRate * 0.2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    d[i] = (Math.random() * 2 - 1) * (0.3 + Math.random() * 0.2) * Math.sin(i / bufSize * Math.PI);
  }
  const src = ctx.createBufferSource(); src.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  src.connect(bp).connect(gain).connect(ctx.destination); src.start(now); src.stop(now + 0.2);
}

function synthToolGrow(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.2);
}

function synthToolShrink(ctx: AudioContext, volume: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
  gain.gain.setValueAtTime(volume * 0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now + 0.2);
}

// ══════════════════════════════════════
// ADULT SOUNDS (meditative, zen-like)
// ══════════════════════════════════════

function zenPop(ctx: AudioContext, volume: number) {
  // Soft singing bowl tap
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(528, now); // Solfeggio frequency
  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
  // Harmonic overtone
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(528 * 2, now);
  g2.gain.setValueAtTime(volume * 0.08, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc2.connect(g2).connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.4);
}

function zenWhoosh(ctx: AudioContext, volume: number) {
  // Gentle breeze
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(800, now);
  lp.frequency.exponentialRampToValueAtTime(200, now + 0.35);
  lp.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(volume * 0.08, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  src.connect(lp).connect(gain).connect(ctx.destination);
  src.start(now);
  src.stop(now + 0.4);
}

function zenDrop(ctx: AudioContext, volume: number) {
  // Water drop — pure sine with gentle decay
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

function zenDelete(ctx: AudioContext, volume: number) {
  // Soft dissolve — gentle descending with reverb-like tail
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(396, now); // Solfeggio
  osc.frequency.exponentialRampToValueAtTime(174, now + 0.5);
  gain.gain.setValueAtTime(volume * 0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

function zenBoxOpen(ctx: AudioContext, volume: number) {
  // Wind chime — gentle ascending with long tail
  const now = ctx.currentTime;
  [0, 0.12, 0.24].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime([396, 528, 639][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.12, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.6);
  });
}

function zenSave(ctx: AudioContext, volume: number) {
  // Gentle bell — two harmonious notes
  const now = ctx.currentTime;
  [0, 0.15].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime([528, 639][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.18, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.7);
  });
}

function zenReward(ctx: AudioContext, volume: number) {
  // Soft singing bowl sweep
  const now = ctx.currentTime;
  [0, 0.08, 0.16].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime([396, 528, 741][i], now + delay);
    gain.gain.setValueAtTime(volume * 0.1, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.5);
  });
}

function zenError(ctx: AudioContext, volume: number) {
  // Gentle low hum
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  gain.gain.setValueAtTime(volume * 0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

function zenShape(ctx: AudioContext, volume: number, freq: number) {
  // Soft bell tone unique per shape
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(volume * 0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

function zenToolCut(ctx: AudioContext, volume: number) {
  // Soft click
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
  gain.gain.setValueAtTime(volume * 0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function zenToolCrumple(ctx: AudioContext, volume: number) {
  // Soft rustle
  const now = ctx.currentTime;
  const bufSize = ctx.sampleRate * 0.25;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i / bufSize * Math.PI);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  src.connect(lp).connect(gain).connect(ctx.destination); src.start(now); src.stop(now + 0.25);
}

function zenToolGrow(ctx: AudioContext, volume: number) {
  // Gentle ascending hum
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(528, now + 0.3);
  gain.gain.setValueAtTime(volume * 0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

function zenToolShrink(ctx: AudioContext, volume: number) {
  // Gentle descending hum
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(528, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.3);
  gain.gain.setValueAtTime(volume * 0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

// ══════════════════════════════════════
// Sound maps
// ══════════════════════════════════════

const kidSynthMap: Record<SoundType, (ctx: AudioContext, vol: number) => void> = {
  pop: synthPop,
  whoosh: synthWhoosh,
  drop: synthDrop,
  delete: synthDelete,
  box_open: synthBoxOpen,
  save: synthSave,
  reward: synthReward,
  error: synthError,
  shape_square: synthShapeSquare,
  shape_rectangle: synthShapeRectangle,
  shape_circle: synthShapeCircle,
  shape_strip: synthShapeStrip,
  shape_torn: synthShapeTorn,
  shape_blob: synthShapeBlob,
  tool_cut: synthToolCut,
  tool_crumple: synthToolCrumple,
  tool_grow: synthToolGrow,
  tool_shrink: synthToolShrink,
};

const adultSynthMap: Record<SoundType, (ctx: AudioContext, vol: number) => void> = {
  pop: zenPop,
  whoosh: zenWhoosh,
  drop: zenDrop,
  delete: zenDelete,
  box_open: zenBoxOpen,
  save: zenSave,
  reward: zenReward,
  error: zenError,
  shape_square: (ctx, vol) => zenShape(ctx, vol, 396),
  shape_rectangle: (ctx, vol) => zenShape(ctx, vol, 417),
  shape_circle: (ctx, vol) => zenShape(ctx, vol, 528),
  shape_strip: (ctx, vol) => zenShape(ctx, vol, 639),
  shape_torn: (ctx, vol) => zenShape(ctx, vol, 741),
  shape_blob: (ctx, vol) => zenShape(ctx, vol, 852),
  tool_cut: zenToolCut,
  tool_crumple: zenToolCrumple,
  tool_grow: zenToolGrow,
  tool_shrink: zenToolShrink,
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
    if (!enabled) return;

    const now = Date.now();
    const last = lastPlayedRef.current[type] || 0;
    if (now - last < minInterval) return;
    lastPlayedRef.current[type] = now;

    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const synthMap = kidMode ? kidSynthMap : adultSynthMap;
    const vol = kidMode ? volume : volume * 0.7; // Adults get slightly quieter

    setTimeout(() => {
      synthMap[type]?.(ctx, vol);
    }, 50);
  }, [enabled, kidMode, volume]);

  const playPop = useCallback(() => play('pop', 100), [play]);
  const playWhoosh = useCallback(() => play('whoosh', 500), [play]);
  const playDrop = useCallback(() => play('drop', 200), [play]);
  const playDelete = useCallback(() => play('delete', 300), [play]);
  const playBoxOpen = useCallback(() => play('box_open', 400), [play]);
  const playSave = useCallback(() => {
    play('save', 500);
    setTimeout(() => play('reward', 0), 150);
  }, [play]);
  const playError = useCallback(() => play('error', 500), [play]);
  const playToolCut = useCallback(() => play('tool_cut', 100), [play]);
  const playToolCrumple = useCallback(() => play('tool_crumple', 100), [play]);
  const playToolGrow = useCallback(() => play('tool_grow', 100), [play]);
  const playToolShrink = useCallback(() => play('tool_shrink', 100), [play]);

  const shapeToSound: Record<string, SoundType> = {
    'soft-square': 'shape_square',
    'rectangle': 'shape_rectangle',
    'circle': 'shape_circle',
    'strip': 'shape_strip',
    'torn-edge': 'shape_torn',
    'blob': 'shape_blob',
  };
  const playShapeSelect = useCallback((shape: string) => {
    const s = shapeToSound[shape];
    if (s) play(s, 100);
  }, [play]);

  const trackAction = useCallback(() => {
    if (!enabled) return;
    actionCountRef.current++;
    if (actionCountRef.current % 5 === 0) {
      setTimeout(() => play('reward', 0), 200);
    }
  }, [enabled, play]);

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
    playToolCut,
    playToolCrumple,
    playToolGrow,
    playToolShrink,
    playShapeSelect,
    trackAction,
  };
}
