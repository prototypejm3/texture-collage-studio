import { useState, useCallback, useEffect } from 'react';

export interface StudioTab {
  id: string;
  name: string;
  state: string | null;
}

const TABS_KEY = 'studio-tabs';
const ACTIVE_KEY = 'studio-active-tab';
export const MAX_TABS = 4;

function loadTabs(): StudioTab[] {
  try {
    const raw = localStorage.getItem(TABS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StudioTab[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, MAX_TABS);
    }
  } catch {}
  return [{ id: `tab-${Date.now()}`, name: 'Frame 1', state: null }];
}

function loadActiveId(tabs: StudioTab[]): string {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id && tabs.some(t => t.id === id)) return id;
  } catch {}
  return tabs[0].id;
}

export function useStudioTabs() {
  const [tabs, setTabs] = useState<StudioTab[]>(loadTabs);
  const [activeTabId, setActiveTabId] = useState<string>(() => loadActiveId(loadTabs()));

  useEffect(() => {
    try { localStorage.setItem(TABS_KEY, JSON.stringify(tabs)); } catch {}
  }, [tabs]);

  useEffect(() => {
    try { localStorage.setItem(ACTIVE_KEY, activeTabId); } catch {}
  }, [activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Persist current studio state into the active tab slot
  const saveActiveState = useCallback((serialized: string | null) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, state: serialized } : t));
  }, [activeTabId]);

  const addTab = useCallback(() => {
    if (tabs.length >= MAX_TABS) return null;
    const id = `tab-${Date.now()}`;
    const name = `Frame ${tabs.length + 1}`;
    const newTab: StudioTab = { id, name, state: null };
    setTabs(prev => [...prev, newTab]);
    return id;
  }, [tabs.length]);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(t => t.id !== id);
      if (id === activeTabId) {
        setActiveTabId(next[0].id);
      }
      return next;
    });
  }, [activeTabId]);

  const renameTab = useCallback((id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  }, []);

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  return { tabs, activeTab, activeTabId, addTab, closeTab, renameTab, switchTab, saveActiveState };
}
