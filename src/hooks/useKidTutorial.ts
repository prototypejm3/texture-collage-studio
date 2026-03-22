import { useState, useCallback, useRef, useEffect } from 'react';

export interface TutorialState {
  hasSeenIntro: boolean;
  hasDragged: boolean;
  hasUsedBox: boolean;
  hasUsedColor: boolean;
  hasUsedFrame: boolean;
  hasUsedTrash: boolean;
}

const STORAGE_KEY = 'kid-tutorial-state';

function loadState(): TutorialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    hasSeenIntro: false,
    hasDragged: false,
    hasUsedBox: false,
    hasUsedColor: false,
    hasUsedFrame: false,
    hasUsedTrash: false,
  };
}

function saveState(state: TutorialState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export type HintType = 'intro' | 'drag' | 'box' | 'color' | 'frame' | 'trash' | null;

export function useKidTutorial() {
  const [state, setState] = useState<TutorialState>(loadState);
  const [activeHint, setActiveHint] = useState<HintType>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Persist state changes
  useEffect(() => { saveState(state); }, [state]);

  const markDone = useCallback((key: keyof TutorialState) => {
    setState(prev => ({ ...prev, [key]: true }));
    setActiveHint(null);
  }, []);

  const showHint = useCallback((hint: HintType, duration = 3500) => {
    setActiveHint(hint);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setActiveHint(null), duration);
  }, []);

  // Called on first studio entry
  const triggerIntro = useCallback(() => {
    if (state.hasSeenIntro) return;
    showHint('intro', 4000);
    setState(prev => ({ ...prev, hasSeenIntro: true }));
  }, [state.hasSeenIntro, showHint]);

  // Called when user first touches a stencil/shape
  const triggerDrag = useCallback(() => {
    if (state.hasDragged) return;
    showHint('drag', 3000);
    setState(prev => ({ ...prev, hasDragged: true }));
  }, [state.hasDragged, showHint]);

  // Called when user first drags near the save/box area
  const triggerBox = useCallback(() => {
    if (state.hasUsedBox) return;
    showHint('box', 3500);
    setState(prev => ({ ...prev, hasUsedBox: true }));
  }, [state.hasUsedBox, showHint]);

  // Called when user first opens colors
  const triggerColor = useCallback(() => {
    if (state.hasUsedColor) return;
    showHint('color', 3000);
    setState(prev => ({ ...prev, hasUsedColor: true }));
  }, [state.hasUsedColor, showHint]);

  // Called when user first opens frame
  const triggerFrame = useCallback(() => {
    if (state.hasUsedFrame) return;
    // Frame is silent — no text
    setState(prev => ({ ...prev, hasUsedFrame: true }));
  }, [state.hasUsedFrame]);

  // Called when user first trashes something
  const triggerTrash = useCallback(() => {
    if (state.hasUsedTrash) return;
    showHint('trash', 2500);
    setState(prev => ({ ...prev, hasUsedTrash: true }));
  }, [state.hasUsedTrash, showHint]);

  // Reset all tutorials (for the ? replay button)
  const resetAll = useCallback(() => {
    const fresh: TutorialState = {
      hasSeenIntro: false,
      hasDragged: false,
      hasUsedBox: false,
      hasUsedColor: false,
      hasUsedFrame: false,
      hasUsedTrash: false,
    };
    setState(fresh);
  }, []);

  const dismissHint = useCallback(() => {
    setActiveHint(null);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
  }, []);

  return {
    state,
    activeHint,
    triggerIntro,
    triggerDrag,
    triggerBox,
    triggerColor,
    triggerFrame,
    triggerTrash,
    markDone,
    resetAll,
    dismissHint,
  };
}
