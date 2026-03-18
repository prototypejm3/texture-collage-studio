import { useEffect, useRef, useCallback } from 'react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';

interface AmbientSoundProps {
  sound: AmbientSoundType;
}

// Web Audio API ambient generator — no external files needed
function createAmbientNode(ctx: AudioContext, type: AmbientSoundType): GainNode {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  
  if (type === 'gallery') {
    // Very soft room tone — filtered noise
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.005;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.5;
    source.connect(filter).connect(gain);
    source.start();
  } else if (type === 'loft') {
    // City hum — low frequency oscillator + noise
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 60;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.015;
    osc.connect(oscGain).connect(gain);
    osc.start();
    
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.008;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    source.connect(filter).connect(gain);
    source.start();
  } else if (type === 'home') {
    // Warm soft tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 120;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.008;
    osc.connect(oscGain).connect(gain);
    osc.start();
    
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 180;
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.004;
    osc2.connect(osc2Gain).connect(gain);
    osc2.start();
  }
  
  return gain;
}

export function AmbientSoundPlayer({ sound }: AmbientSoundProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startAudio = useCallback(() => {
    if (sound === 'none') return;
    
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gain = createAmbientNode(ctx, sound);
    gain.connect(ctx.destination);
    gainRef.current = gain;
    
    // Fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  }, [sound]);

  useEffect(() => {
    if (sound === 'none') {
      // Fade out existing
      if (gainRef.current && ctxRef.current) {
        const g = gainRef.current;
        const ctx = ctxRef.current;
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => ctx.close().catch(() => {}), 1200);
        ctxRef.current = null;
        gainRef.current = null;
      }
      return;
    }

    // Close previous
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
    }
    
    startAudio();

    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, [sound, startAudio]);

  return null;
}
