import { useState, useCallback, useEffect } from 'react';
import { SavedDesign, WallSettings, defaultWallSettings, FrameStyle, DesignStatus } from '@/types/wall';

const DESIGNS_KEY = 'wall-designs';
const SETTINGS_KEY = 'wall-settings';

// Designs are stored globally, each design has a wallId

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
    const data = JSON.stringify(designs);
    try {
      localStorage.setItem(DESIGNS_KEY, data);
    } catch (e) {
      // Quota exceeded — strip studioState from older designs to free space
      console.warn('localStorage quota exceeded, pruning studioState from older designs');
      const pruned = designs.map((d, i) => i < 2 ? d : { ...d, studioState: undefined });
      try {
        localStorage.setItem(DESIGNS_KEY, JSON.stringify(pruned));
      } catch {
        // Still too big — keep only the 20 most recent designs
        const trimmed = pruned.slice(0, 20);
        try {
          localStorage.setItem(DESIGNS_KEY, JSON.stringify(trimmed));
        } catch {
          console.error('localStorage still full after pruning');
        }
      }
    }
  }, [designs]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      console.warn('Could not save wall settings to localStorage');
    }
  }, [settings]);

  const addDesign = useCallback((preview: string, name: string, vibeName?: string, studioState?: string, stencilCreator?: string): string => {
    const id = `design-${nextDesignId++}`;
    const now = new Date().toISOString();
    const design: SavedDesign = {
      id, name,
      vibeName,
      stencilCreator,
      previewImage: preview,
      createdAt: now,
      updatedAt: now,
      status: 'display',
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

  // Draft: upsert a draft by draftKey (returns the draft id)
  const saveDraft = useCallback((draftKey: string, preview: string, name: string, vibeName?: string, studioState?: string, stencilCreator?: string): string => {
    const now = new Date().toISOString();
    setDesigns(prev => {
      const existing = prev.find(d => d.id === draftKey);
      if (existing) {
        return prev.map(d => d.id === draftKey ? { ...d, previewImage: preview, name, vibeName, stencilCreator, studioState, updatedAt: now } : d);
      }
      const design: SavedDesign = {
        id: draftKey,
        name,
        vibeName,
        stencilCreator,
        previewImage: preview,
        createdAt: now,
        updatedAt: now,
        status: 'draft' as DesignStatus,
        builtIRL: false,
        pinned: false,
        hidden: false,
        frameStyle: settings.defaultFrameStyle,
        displaySize: 'medium',
        studioState,
      };
      return [design, ...prev];
    });
    return draftKey;
  }, [settings.defaultFrameStyle]);

  // Promote a draft to a full design
  const promoteDraft = useCallback((draftKey: string) => {
    setDesigns(prev => prev.map(d => d.id === draftKey ? { ...d, status: 'display' as DesignStatus, updatedAt: new Date().toISOString() } : d));
  }, []);

  const replaceDesign = useCallback((preview: string, name: string, vibeName?: string, studioState?: string, stencilCreator?: string) => {
    const id = `design-${nextDesignId++}`;
    const now = new Date().toISOString();
    const design: SavedDesign = {
      id, name, vibeName,
      stencilCreator,
      previewImage: preview,
      createdAt: now,
      updatedAt: now,
      status: 'display',
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
    saveDraft,
    promoteDraft,
  };
}
