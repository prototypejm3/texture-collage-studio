import { useState, useCallback } from 'react';
import { letterStencils } from '@/data/letterStencils';
import { Vibe } from '@/types/studio';

interface Props {
  onPlaceWord: (letters: Vibe[]) => void;
}

/**
 * Kid-friendly panel: type a word and place each letter as a stencil on the canvas.
 */
export function KidLettersPanel({ onPlaceWord }: Props) {
  const [word, setWord] = useState('');

  const handleGo = useCallback(() => {
    if (!word.trim()) return;
    const letters = word
      .toUpperCase()
      .split('')
      .filter(ch => /[A-Z]/.test(ch))
      .map(ch => letterStencils.find(l => l.name === ch))
      .filter(Boolean) as Vibe[];
    if (letters.length > 0) {
      onPlaceWord(letters);
      setWord('');
    }
  }, [word, onPlaceWord]);

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-sm font-bold" style={{ color: '#6b4c2a' }}>
        Type a word and it'll appear on your canvas! 🎉
      </p>
      <input
        type="text"
        value={word}
        onChange={e => setWord(e.target.value.slice(0, 12))}
        onKeyDown={e => { if (e.key === 'Enter') handleGo(); }}
        placeholder="Type your name..."
        maxLength={12}
        className="w-full px-4 py-3 rounded-xl text-lg font-bold text-center outline-none"
        style={{
          background: '#fff8f0',
          border: '3px solid #f59e0b',
          color: '#6b4c2a',
          fontFamily: 'system-ui',
        }}
        autoFocus
      />
      <button
        onClick={handleGo}
        disabled={!word.trim()}
        className="w-full py-3 rounded-xl font-bold text-lg text-white transition-all active:scale-95 disabled:opacity-40"
        style={{ background: '#f97316' }}
      >
        Add to Canvas! ✨
      </button>
      <p className="text-[11px] text-center" style={{ color: '#a0896a' }}>
        Letters only • Max 12 characters
      </p>
    </div>
  );
}
