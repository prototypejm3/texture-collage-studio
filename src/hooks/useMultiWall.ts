import { useState, useCallback, useEffect } from 'react';
import { WallSettings, defaultWallSettings } from '@/types/wall';

export interface WallInstance {
  id: string;
  settings: WallSettings;
}

const WALLS_KEY = 'user-walls';
const ACTIVE_WALL_KEY = 'active-wall-id';

let nextWallId = Date.now();

function loadWalls(): WallInstance[] {
  try {
    const raw = localStorage.getItem(WALLS_KEY);
    const walls = raw ? JSON.parse(raw) : [];
    return walls.length > 0 ? walls : [{ id: 'wall-default', settings: { ...defaultWallSettings } }];
  } catch {
    return [{ id: 'wall-default', settings: { ...defaultWallSettings } }];
  }
}

function loadActiveId(): string {
  try {
    return localStorage.getItem(ACTIVE_WALL_KEY) || 'wall-default';
  } catch {
    return 'wall-default';
  }
}

export function useMultiWall() {
  const [walls, setWalls] = useState<WallInstance[]>(loadWalls);
  const [activeWallId, setActiveWallId] = useState<string>(loadActiveId);

  useEffect(() => {
    localStorage.setItem(WALLS_KEY, JSON.stringify(walls));
  }, [walls]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_WALL_KEY, activeWallId);
  }, [activeWallId]);

  const activeWall = walls.find(w => w.id === activeWallId) || walls[0];

  const addWall = useCallback((name?: string) => {
    const id = `wall-${nextWallId++}`;
    const newWall: WallInstance = {
      id,
      settings: { ...defaultWallSettings, title: name || `Wall ${walls.length + 1}` },
    };
    setWalls(prev => [...prev, newWall]);
    setActiveWallId(id);
    return id;
  }, [walls.length]);

  const deleteWall = useCallback((id: string) => {
    setWalls(prev => {
      const next = prev.filter(w => w.id !== id);
      if (next.length === 0) return prev; // keep at least one
      return next;
    });
    if (activeWallId === id) {
      setWalls(prev => {
        setActiveWallId(prev[0]?.id || 'wall-default');
        return prev;
      });
    }
  }, [activeWallId]);

  const updateWallSettings = useCallback((id: string, updates: Partial<WallSettings>) => {
    setWalls(prev => prev.map(w => w.id === id ? { ...w, settings: { ...w.settings, ...updates } } : w));
  }, []);

  return {
    walls,
    activeWall,
    activeWallId,
    setActiveWallId,
    addWall,
    deleteWall,
    updateWallSettings,
  };
}
