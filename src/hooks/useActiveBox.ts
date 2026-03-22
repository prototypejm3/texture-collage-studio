import { useState, useCallback } from 'react';

export type BoxId = 'mybox' | 'stencils' | 'tools' | 'textures' | 'text' | 'toolbox' | null;

export function useActiveBox() {
  const [activeBox, setActiveBox] = useState<BoxId>(null);

  const toggleBox = useCallback((id: BoxId) => {
    setActiveBox(prev => prev === id ? null : id);
  }, []);

  const closeBox = useCallback(() => {
    setActiveBox(null);
  }, []);

  const openBox = useCallback((id: BoxId) => {
    setActiveBox(id);
  }, []);

  return { activeBox, toggleBox, closeBox, openBox };
}
