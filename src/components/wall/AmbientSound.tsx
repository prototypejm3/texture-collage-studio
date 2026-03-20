import { useEffect, useRef, useCallback, useState } from 'react';
import { AmbientSound as AmbientSoundType } from '@/types/wall';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientSoundProps {
  sound: AmbientSoundType;
  showControl?: boolean;
}

// ── Lofi beat generator using Web Audio API ──
// Creates a rhythmic, warm, lo-fi style ambient beat

function createLofiEngine(ctx: AudioContext, type: AmbientSoundType, kidMode: boolean): { master: GainNode; stop: () => void } {
  const master = ctx.createGain();
  master.gain.value = 0;

  const intervals: ReturnType<typeof setInterval>[] = [];
  const sources: (OscillatorNode | AudioBufferSourceNode)[] = [];

  if (kidMode) {
    // ── KID MODE SOUNDS — playful, bright, bouncy ──
    if (type === 'gallery') {
      // Gallery: Gentle music box / xylophone melody
      const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33]; // C5 D5 E5 G5 A5 pentatonic
      let noteIdx = 0;
      const melodyInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = melodyNotes[noteIdx % melodyNotes.length];
        noteIdx++;

        // Xylophone-like tone (sine + harmonic)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 4; // bell harmonic
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.015, now);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(g).connect(master);
        osc2.connect(g2).connect(master);
        osc.start(now);
        osc.stop(now + 1);
        osc2.start(now);
        osc2.stop(now + 0.5);
      }, 600);
      intervals.push(melodyInterval);

      // Soft sparkle pad
      const padOsc = ctx.createOscillator();
      padOsc.type = 'sine';
      padOsc.frequency.value = 392; // G4
      const padGain = ctx.createGain();
      padGain.gain.value = 0.015;
      padOsc.connect(padGain).connect(master);
      padOsc.start();
      sources.push(padOsc);

    } else if (type === 'loft') {
      // Loft: Bouncy, fun beat — toy drum + plucky bass + cheerful melody
      const bpm = 110;
      const beatMs = (60 / bpm) * 1000;

      // Plucky bass notes (bouncy)
      const bassNotes = [261.63, 293.66, 329.63, 293.66]; // C4 D4 E4 D4
      let bassIdx = 0;
      const bassInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = bassNotes[bassIdx % bassNotes.length];
        bassIdx++;
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq / 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 0.3);
      }, beatMs);
      intervals.push(bassInterval);

      // Toy drum — soft kick + clap pattern
      let drumBeat = 0;
      const drumInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        if (drumBeat % 4 === 0 || drumBeat % 4 === 2) {
          // Soft round kick
          const kick = ctx.createOscillator();
          kick.type = 'sine';
          kick.frequency.setValueAtTime(180, now);
          kick.frequency.exponentialRampToValueAtTime(60, now + 0.06);
          const kg = ctx.createGain();
          kg.gain.setValueAtTime(0.1, now);
          kg.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          kick.connect(kg).connect(master);
          kick.start(now);
          kick.stop(now + 0.2);
        }
        if (drumBeat % 4 === 2) {
          // Soft clap (noise burst)
          const clapBuf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
          const clapData = clapBuf.getChannelData(0);
          for (let i = 0; i < clapData.length; i++) {
            clapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
          }
          const clapSrc = ctx.createBufferSource();
          clapSrc.buffer = clapBuf;
          const cf = ctx.createBiquadFilter();
          cf.type = 'bandpass';
          cf.frequency.value = 1500;
          const cg = ctx.createGain();
          cg.gain.value = 0.06;
          clapSrc.connect(cf).connect(cg).connect(master);
          clapSrc.start(now);
        }
        drumBeat++;
      }, beatMs / 2);
      intervals.push(drumInterval);

      // Cheerful melody — high xylophone
      const melNotes = [659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 587.33]; // E5 G5 A5...
      let melIdx = 0;
      const melInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = melNotes[melIdx % melNotes.length];
        melIdx++;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.04, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 0.5);
      }, beatMs * 2);
      intervals.push(melInterval);

    } else if (type === 'home') {
      // Home: Gentle lullaby — soft, dreamy, calming
      const bpm = 72;
      const beatMs = (60 / bpm) * 1000;

      // Warm dreamy pad
      const padNotes = [261.63, 329.63, 392]; // C4 E4 G4 major triad
      padNotes.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = 0.02;
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 500;
        osc.connect(f).connect(g).connect(master);
        osc.start();
        sources.push(osc);
      });

      // Gentle lullaby melody — pentatonic, slow
      const lullabyNotes = [523.25, 587.33, 659.25, 523.25, 783.99, 659.25, 587.33, 523.25];
      let lulIdx = 0;
      const lulInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = lullabyNotes[lulIdx % lullabyNotes.length];
        lulIdx++;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.035, now + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 800;
        osc.connect(f).connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 1.5);
      }, beatMs * 1.5);
      intervals.push(lulInterval);

      // Soft twinkle — random high sparkles
      const twinkleInterval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = 1200 + Math.random() * 800;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.01, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + 0.4);
      }, 2500 + Math.random() * 1500);
      intervals.push(twinkleInterval);
    }

    const stop = () => {
      intervals.forEach(id => clearInterval(id));
      sources.forEach(s => { try { s.stop(); } catch {} });
    };
    return { master, stop };
  }

  // ── NORMAL MODE SOUNDS (original) ──

  // Warm vinyl crackle — filtered noise
  const crackleBufferSize = ctx.sampleRate * 4;
  const crackleBuffer = ctx.createBuffer(2, crackleBufferSize, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = crackleBuffer.getChannelData(ch);
    for (let i = 0; i < crackleBufferSize; i++) {
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

    const pad2 = ctx.createOscillator();
    pad2.type = 'sine';
    pad2.frequency.value = 330;
    const pad2Gain = ctx.createGain();
    pad2Gain.gain.value = 0.015;
    pad2.connect(padFilter).connect(pad2Gain).connect(master);
    pad2.start();
    sources.push(pad2);

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
    const bpm = 75;
    const beatInterval = 60 / bpm;

    const bassOsc = ctx.createOscillator();
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 55;
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.06;
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 120;
    bassOsc.connect(bassFilter).connect(bassGain).connect(master);
    bassOsc.start();
    sources.push(bassOsc);

    const chordNotes = [130.81, 164.81, 196];
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

    let beatCount = 0;
    const kickInterval = setInterval(() => {
      if (ctx.state === 'closed') return;
      const now = ctx.currentTime;
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
    const bpm = 60;
    const beatInterval = 60 / bpm;

    const padNotes = [146.83, 174.61, 220, 261.63];
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

    const melodyNotes = [293.66, 329.63, 392, 440, 523.25];
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
