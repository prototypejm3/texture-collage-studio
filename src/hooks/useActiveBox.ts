import { useState, useCallback } from 'react';

export type BoxId = 'mybox' | 'stencils' | 'tools' | 'textures' | null;

export function useActiveBox() {
  const [activeBox, setActiveBox] = useState<BoxId>(null);

  const toggleBox = useCallback((id: BoxId) => {
    setActiveBox(prev => prev === id ? null : id);
  }, []);

  const closeBox = useCallback(() => {
    setActiveBox(null);
  }, []);

  return { activeBox, toggleBox, closeBox };
}
