import { useCallback, useRef, useState, useEffect } from 'react';

// ── Drop celebration messages ──
const DROP_MESSAGES = [
  '🎉 YAY! Good job!',
  'Nice drop! ✨',
  'Ooo that looks fun!',
  'You did it! 🎨',
  'Cute choice!',
  "That's a good one!",
  'Pop! Added!',
  'Love that!',
  'So colorful!',
  "You're doing great!",
];

// ── 50% milestone messages ──
const MILESTONE_MESSAGES = [
  'Wow... that looks really cool',
  'Ooo I like where this is going',
  'This is getting fun!',
  'Your picture is coming together!',
  'Wait… this looks awesome 👀',
  "You're making something special",
  'I love this part right here',
  'This is a vibe',
  'Okay artist!! 🎨',
  'This is getting really good',
];

// Context-aware overrides
const CONTEXT_MESSAGES: Record<string, string[]> = {
  stencil: ['Cute choice!', 'Nice stencil! ✨', 'Ooo fancy shape!'],
  bright: ['So colorful!', 'Bright pick!', 'Love those colors!'],
  large: ['Big move!', 'Going BIG!', 'Wow, that is a big one!'],
};

export interface CelebrationToast {
  id: string;
  message: string;
  x: number;
  y: number;
}

let toastId = 0;

export function useKidCelebration() {
  const [toasts, setToasts] = useState<CelebrationToast[]>([]);
  const recentMessages = useRef<string[]>([]);
  const milestoneShown = useRef(false);
  const dropCount = useRef(0);

  // Pick a message avoiding last 3
  const pickMessage = useCallback((pool: string[]): string => {
    const available = pool.filter(m => !recentMessages.current.includes(m));
    const pick = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : pool[Math.floor(Math.random() * pool.length)];
    recentMessages.current = [...recentMessages.current.slice(-2), pick];
    return pick;
  }, []);

  const showToast = useCallback((message: string, x: number, y: number) => {
    const id = `celeb-${toastId++}`;
    setToasts(prev => [...prev, { id, message, x, y }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  }, []);

  const celebrateDrop = useCallback((x: number, y: number, context?: 'stencil' | 'bright' | 'large') => {
    dropCount.current++;
    const pool = context && CONTEXT_MESSAGES[context]
      ? [...CONTEXT_MESSAGES[context], ...DROP_MESSAGES]
      : DROP_MESSAGES;
    // Bias toward shorter messages on rapid actions
    const biased = dropCount.current > 3 ? pool.filter(m => m.length < 20) : pool;
    const msg = pickMessage(biased.length > 0 ? biased : pool);
    showToast(msg, x, y);
  }, [pickMessage, showToast]);

  const checkMilestone = useCallback((filledCount: number, totalSections: number, canvasCenter: { x: number; y: number }) => {
    if (milestoneShown.current || totalSections === 0) return;
    const ratio = filledCount / totalSections;
    // Trigger between 45-60%
    if (ratio >= 0.45 && ratio <= 0.7) {
      milestoneShown.current = true;
      const msg = pickMessage(MILESTONE_MESSAGES);
      showToast(msg, canvasCenter.x, canvasCenter.y);
    }
  }, [pickMessage, showToast]);

  const resetMilestone = useCallback(() => {
    milestoneShown.current = false;
    dropCount.current = 0;
  }, []);

  return { toasts, celebrateDrop, checkMilestone, resetMilestone };
}
