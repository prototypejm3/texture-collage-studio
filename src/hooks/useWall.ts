import { useState, useCallback, useEffect } from 'react';
import { SavedDesign, WallSettings, defaultWallSettings, FrameStyle, DesignStatus } from '@/types/wall';

const DESIGNS_KEY = 'wall-designs';
const SETTINGS_KEY = 'wall-settings';

function loadDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(DESIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadSettings(): WallSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultWallSettings, ...JSON.parse(raw) } : defaultWallSettings;
  } catch { return defaultWallSettings; }
}

let nextDesignId = Date.now();

export function useWall() {
  const [designs, setDesigns] = useState<SavedDesign[]>(loadDesigns);
  const [settings, setSettings] = useState<WallSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
  }, [designs]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addDesign = useCallback((preview: string, name: string, vibeName?: string, studioState?: string): string => {
    const id = `design-${nextDesignId++}`;
    const now = new Date().toISOString();
    const design: SavedDesign = {
      id, name,
      vibeName,
      previewImage: preview,
      createdAt: now,
      updatedAt: now,
      status: 'in-progress',
      builtIRL: false,
      pinned: false,
      hidden: false,
      frameStyle: settings.defaultFrameStyle,
      displaySize: 'medium',
      studioState,
    };
    setDesigns(prev => [design, ...prev]);
    return id;
  }, [settings.defaultFrameStyle]);

  const replaceDesign = useCallback((preview: string, name: string, vibeName?: string, studioState?: string) => {
    const id = `design-${nextDesignId++}`;
    const now = new Date().toISOString();
    const design: SavedDesign = {
      id, name, vibeName,
      previewImage: preview,
      createdAt: now,
      updatedAt: now,
      status: 'in-progress',
      builtIRL: false,
      pinned: false,
      hidden: false,
      frameStyle: settings.defaultFrameStyle,
      
      displaySize: 'medium',
      studioState,
    };
    setDesigns([design]);
    return id;
  }, [settings.defaultFrameStyle]);

  const updateDesign = useCallback((id: string, updates: Partial<SavedDesign>) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
  }, []);

  const deleteDesign = useCallback((id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
  }, []);

  const duplicateDesign = useCallback((id: string) => {
    const d = designs.find(x => x.id === id);
    if (!d) return;
    const newId = `design-${nextDesignId++}`;
    setDesigns(prev => [{ ...d, id: newId, name: `${d.name} (copy)`, createdAt: new Date().toISOString(), pinned: false }, ...prev]);
    return newId;
  }, [designs]);

  const reorderDesigns = useCallback((fromIndex: number, toIndex: number) => {
    setDesigns(prev => {
      const arr = [...prev];
      const [item] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
      return arr;
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setDesigns(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, pinned: !d.pinned } : d);
      return updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    });
  }, []);

  const toggleHide = useCallback((id: string) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, hidden: !d.hidden } : d));
  }, []);

  const updateSettings = useCallback((updates: Partial<WallSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const applyFrameToAll = useCallback((style: FrameStyle) => {
    setDesigns(prev => prev.map(d => ({ ...d, frameStyle: style })));
  }, []);

  return {
    designs,
    settings,
    addDesign,
    replaceDesign,
    updateDesign,
    deleteDesign,
    duplicateDesign,
    reorderDesigns,
    togglePin,
    toggleHide,
    updateSettings,
    applyFrameToAll,
  };
}
