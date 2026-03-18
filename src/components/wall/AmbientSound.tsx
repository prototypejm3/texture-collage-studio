import { useEffect, useRef, useCallback, useState } from 'react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientSoundProps {
  sound: AmbientSoundType;
  showControl?: boolean;
}

// ── Lofi beat generator using Web Audio API ──
// Creates a rhythmic, warm, lo-fi style ambient beat

function createLofiEngine(ctx: AudioContext, type: AmbientSoundType): { master: GainNode; stop: () => void } {
  const master = ctx.createGain();
  master.gain.value = 0;

  const intervals: ReturnType<typeof setInterval>[] = [];
  const sources: (OscillatorNode | AudioBufferSourceNode)[] = [];

  // Warm vinyl crackle — filtered noise
  const crackleBufferSize = ctx.sampleRate * 4;
  const crackleBuffer = ctx.createBuffer(2, crackleBufferSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = crackleBuffer.getChannelData(ch);
    for (let i = 0; i < crackleBufferSize; i++) {
      // Crackle: mostly silence with occasional pops
      data[i] = Math.random() < 0.002 ? (Math.random() - 0.5) * 0.8 : (Math.random() - 0.5) * 0.003;
    }
  }
  const crackleSource = ctx.createBufferSource();
  crackleSource.buffer = crackleBuffer;
  crackleSource.loop = true;
  const crackleFilter = ctx.createBiquadFilter();
  crackleFilter.type = 'bandpass';
  crackleFilter.frequency.value = 2000;
  crackleFilter.Q.value = 0.5;
  const crackleGain = ctx.createGain();
  crackleGain.gain.value = 0.15;
  crackleSource.connect(crackleFilter).connect(crackleGain).connect(master);
  crackleSource.start();
  sources.push(crackleSource);

  if (type === 'gallery') {
    // Gallery: Soft room tone + gentle pad
    const pad = ctx.createOscillator();
    pad.type = 'sine';
    pad.frequency.value = 220;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.03;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 300;
    pad.connect(padFilter).connect(padGain).connect(master);
    pad.start();
    sources.push(pad);

    // Subtle fifth harmony
    const pad2 = ctx.createOscillator();
    pad2.type = 'sine';
    pad2.frequency.value = 330;
    const pad2Gain = ctx.createGain();
    pad2Gain.gain.value = 0.015;
    pad2.connect(padFilter).connect(pad2Gain).connect(master);
    pad2.start();
    sources.push(pad2);

    // Soft room noise
    const roomBuffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = roomBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.004;
      }
    }
    const roomSrc = ctx.createBufferSource();
    roomSrc.buffer = roomBuffer;
    roomSrc.loop = true;
    const roomFilter = ctx.createBiquadFilter();
    roomFilter.type = 'lowpass';
    roomFilter.frequency.value = 250;
    roomSrc.connect(roomFilter).connect(master);
    roomSrc.start();
    sources.push(roomSrc);
  } else if (type === 'loft') {
    // Loft: Lo-fi beat with kick + hi-hat pattern + bass
    const bpm = 75;
    const beatInterval = 60 / bpm;

    // Bass note (sub oscillator)
    const bassOsc = ctx.createOscillator();
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 55; // A1
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.06;
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 120;
    bassOsc.connect(bassFilter).connect(bassGain).connect(master);
    bassOsc.start();
    sources.push(bassOsc);

    // Warm chord pad
    const chordNotes = [130.81, 164.81, 196]; // C3, E3, G3
    chordNotes.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.012;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 400;
      osc.connect(f).connect(g).connect(master);
      osc.start();
      sources.push(osc);
    });

    // Kick drum pattern
    let beatCount = 0;
    const kickInterval = setInterval(() => {
      if (ctx.state === 'closed') return;
      const now = ctx.currentTime;
      // Kick on beats 1 and 3
      if (beatCount % 4 === 0 || beatCount % 4 === 2) {
        const kickOsc = ctx.createOscillator();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(150, now);
        kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
        const kickGain = ctx.createGain();
        kickGain.gain.setValueAtTime(0.12, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        kickOsc.connect(kickGain).connect(master);
        kickOsc.start(now);
        kickOsc.stop(now + 0.25);
      }
      // Hi-hat on every beat
      const hatBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const hatData = hatBuffer.getChannelData(0);
      for (let i = 0; i < hatData.length; i++) {
        hatData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
      }
      const hatSrc = ctx.createBufferSource();
      hatSrc.buffer = hatBuffer;
      const hatFilter = ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 6000;
      const hatGain = ctx.createGain();
      hatGain.gain.value = beatCount % 2 === 0 ? 0.04 : 0.025;
      hatSrc.connect(hatFilter).connect(hatGain).connect(master);
      hatSrc.start(now);

      beatCount++;
    }, beatInterval * 1000);
    intervals.push(kickInterval);
  } else if (type === 'home') {
    // Home: Warm, gentle ambient with soft melody
    const bpm = 60;
    const beatInterval = 60 / bpm;

    // Warm pad — minor 7th chord
    const padNotes = [146.83, 174.61, 220, 261.63]; // D3, F3, A3, C4
    padNotes.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.015;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 350;
      osc.connect(f).connect(g).connect(master);
      osc.start();
      sources.push(osc);
    });

    // Gentle melody — random pentatonic notes
    const melodyNotes = [293.66, 329.63, 392, 440, 523.25]; // D4, E4, G4, A4, C5
    let noteIndex = 0;
    const melodyInterval = setInterval(() => {
      if (ctx.state === 'closed') return;
      const now = ctx.currentTime;
      const freq = melodyNotes[noteIndex % melodyNotes.length];
      noteIndex = Math.floor(Math.random() * melodyNotes.length);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.025, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 600;
      osc.connect(f).connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 1.8);
    }, beatInterval * 2 * 1000);
    intervals.push(melodyInterval);

    // Soft room noise
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.003;
      }
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = 'lowpass';
    nf.frequency.value = 200;
    noiseSrc.connect(nf).connect(master);
    noiseSrc.start();
    sources.push(noiseSrc);
  }

  const stop = () => {
    intervals.forEach(id => clearInterval(id));
    sources.forEach(s => {
      try { s.stop(); } catch {}
    });
  };

  return { master, stop };
}

export function AmbientSoundPlayer({ sound, showControl = false }: AmbientSoundProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const engineRef = useRef<{ master: GainNode; stop: () => void } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);

  const startAudio = useCallback(() => {
    if (sound === 'none') return;

    // Clean up previous
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const engine = createLofiEngine(ctx, sound);
    engine.master.connect(ctx.destination);
    engineRef.current = engine;

    // Fade in
    engine.master.gain.setValueAtTime(0, ctx.currentTime);
    engine.master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2);
    setIsPlaying(true);
  }, [sound]);

  const stopAudio = useCallback(() => {
    if (engineRef.current && ctxRef.current) {
      const ctx = ctxRef.current;
      const engine = engineRef.current;
      engine.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        engine.stop();
        ctx.close().catch(() => {});
        ctxRef.current = null;
        engineRef.current = null;
      }, 1200);
    }
    setIsPlaying(false);
  }, []);

  // When sound type changes
  useEffect(() => {
    if (sound === 'none') {
      stopAudio();
      setUserStarted(false);
      return;
    }

    if (userStarted) {
      startAudio();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, [sound]);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      stopAudio();
      setUserStarted(false);
    } else {
      setUserStarted(true);
      startAudio();
    }
  }, [isPlaying, startAudio, stopAudio]);

  // Auto-start on first selection (needs user gesture context)
  useEffect(() => {
    if (sound !== 'none' && !userStarted) {
      setUserStarted(true);
      startAudio();
    }
  }, [sound]);

  if (sound === 'none' && !showControl) return null;

  if (!showControl) return null;

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full bg-popover/90 backdrop-blur-sm border border-border shadow-lg hover:bg-popover transition-colors"
      title={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}
