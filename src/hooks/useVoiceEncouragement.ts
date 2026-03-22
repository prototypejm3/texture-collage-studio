import { useCallback, useRef, useState, useEffect } from 'react';

const VOICE_LINES = [
  'Nice one!',
  'Good job!',
  "That's cool!",
  'I like that!',
  'Whoa, nice!',
  'Great pick!',
];

const MIN_COOLDOWN_MS = 12_000;
const TRIGGER_CHANCE = 0.35;

export function useVoiceEncouragement() {
  const lastVoiceTime = useRef(0);
  const recentLines = useRef<string[]>([]);
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('voice-encouragement') !== 'false'; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('voice-encouragement', String(enabled)); } catch {}
  }, [enabled]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 0.6;
    // Try to pick a soft, natural voice
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    speechSynthesis.speak(utterance);
  }, []);

  const maybeSayEncouragement = useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastVoiceTime.current < MIN_COOLDOWN_MS) return;
    if (Math.random() > TRIGGER_CHANCE) return;

    // Pick a line not recently used
    const available = VOICE_LINES.filter(l => !recentLines.current.includes(l));
    const pool = available.length > 0 ? available : VOICE_LINES;
    const line = pool[Math.floor(Math.random() * pool.length)];
    recentLines.current = [...recentLines.current.slice(-2), line];
    lastVoiceTime.current = now;

    // Slight delay for natural feel
    setTimeout(() => speak(line), 300);
  }, [enabled, speak]);

  return {
    maybeSayEncouragement,
    voiceEnabled: enabled,
    setVoiceEnabled: setEnabled,
  };
}
