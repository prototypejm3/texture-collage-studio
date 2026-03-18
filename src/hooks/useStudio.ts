import { useState, useCallback } from 'react';
import { CanvasElement, FrameSize, FrameColor, defaultEffects, MaterialEffects, ElementShape, Vibe, VibeFills } from '@/types/studio';
import { DesignSize, FrameStyle } from '@/types/wall';
import { textures } from '@/data/textures';

let nextId = 1;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTextureForTone(vibe: Vibe, tone: 'light' | 'medium' | 'dark' | 'accent'): string {
  const pool = {
    light: vibe.lightTextures,
    medium: vibe.mediumTextures,
    dark: vibe.darkTextures,
    accent: vibe.accentTextures,
  }[tone];
  const valid = pool.filter(id => textures.some(t => t.id === id));
  if (valid.length === 0) return textures[0].id;
  return pickRandom(valid);
}

export function useStudio() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState<FrameSize>('12x12');
  const [frameColor, setFrameColor] = useState<FrameColor>('white');
  const [displaySize, setDisplaySize] = useState<DesignSize>('medium');
  const [wallFrameStyle, setWallFrameStyle] = useState<FrameStyle>('gold');
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null);
  const [vibeFills, setVibeFills] = useState<VibeFills>({});
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [customSections, setCustomSections] = useState<VibeSection[]>([]);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  // ── Free-mode actions ──

  const addElement = useCallback((textureId: string, x: number, y: number) => {
    const id = `el-${nextId++}`;
    const newEl: CanvasElement = {
      id,
      textureId,
      x,
      y,
      width: 100,
      height: 100,
      rotation: 0,
      shape: 'soft-square',
      zIndex: nextId,
      effects: { ...defaultEffects },
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);
    return id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  }, []);

  const updateEffects = useCallback((id: string, effects: Partial<MaterialEffects>) => {
    setElements(prev => prev.map(el =>
      el.id === id ? { ...el, effects: { ...el.effects, ...effects } } : el
    ));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const duplicateElement = useCallback((id: string) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const newId = `el-${nextId++}`;
    setElements(prev => [...prev, { ...el, id: newId, x: el.x + 20, y: el.y + 20, zIndex: nextId }]);
    setSelectedId(newId);
  }, [elements]);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    setActiveVibe(null);
    setVibeFills({});
    setSelectedSectionId(null);
    setCustomSections([]);
    setDrawMode(false);
  }, []);

  const generateRandom = useCallback(() => {
    setActiveVibe(null);
    setVibeFills({});
    setSelectedSectionId(null);
    const count = 4 + Math.floor(Math.random() * 5);
    const shapes: ElementShape[] = ['soft-square', 'rectangle', 'circle', 'strip', 'torn-edge', 'blob'];
    const newElements: CanvasElement[] = [];
    for (let i = 0; i < count; i++) {
      const tex = textures[Math.floor(Math.random() * textures.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const w = shape === 'strip' ? 40 + Math.random() * 60 : 60 + Math.random() * 100;
      const h = shape === 'strip' ? 120 + Math.random() * 100 : shape === 'rectangle' ? w * 1.5 : w;
      newElements.push({
        id: `el-${nextId++}`,
        textureId: tex.id,
        x: 30 + Math.random() * 250,
        y: 30 + Math.random() * 250,
        width: w,
        height: h,
        rotation: Math.floor(Math.random() * 30) - 15,
        shape,
        zIndex: nextId,
        effects: { ...defaultEffects },
      });
    }
    setElements(newElements);
    setSelectedId(null);
  }, []);

  const shuffleElements = useCallback(() => {
    if (activeVibe) {
      shuffleVibeFills();
      return;
    }
    setElements(prev => prev.map(el => ({
      ...el,
      x: 30 + Math.random() * 250,
      y: 30 + Math.random() * 250,
      rotation: Math.floor(Math.random() * 30) - 15,
    })));
  }, []);

  // ── Vibe actions ──

  const selectVibe = useCallback((vibe: Vibe) => {
    setActiveVibe(vibe);
    setElements([]);
    setSelectedId(null);
    setSelectedSectionId(null);
    // Auto-fill all sections
    const fills: VibeFills = {};
    vibe.sections.forEach(section => {
      fills[section.id] = pickTextureForTone(vibe, section.tone);
    });
    setVibeFills(fills);
  }, []);

  const fillSection = useCallback((sectionId: string, textureId: string) => {
    setVibeFills(prev => ({ ...prev, [sectionId]: textureId }));
  }, []);

  const selectSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  const shuffleVibeFills = useCallback(() => {
    if (!activeVibe) return;
    const fills: VibeFills = {};
    activeVibe.sections.forEach(section => {
      fills[section.id] = pickTextureForTone(activeVibe, section.tone);
    });
    setVibeFills(fills);
  }, [activeVibe]);

  // ── Custom drawn sections ──

  const addCustomSection = useCallback((pathD: string) => {
    const id = `custom-section-${Date.now()}`;
    const section: VibeSection = {
      id,
      label: `Section ${customSections.length + 1}`,
      path: pathD,
      tone: 'medium',
    };
    setCustomSections(prev => [...prev, section]);
    setSelectedSectionId(id);
    setDrawMode(false);
  }, [customSections.length]);

  const deleteCustomSection = useCallback((sectionId: string) => {
    setCustomSections(prev => prev.filter(s => s.id !== sectionId));
    setVibeFills(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [selectedSectionId]);

  // Combine vibe sections + custom drawn sections
  const allSections = useMemo(() => {
    const vibeSections = activeVibe?.sections || [];
    return [...vibeSections, ...customSections];
  }, [activeVibe, customSections]);

  // A virtual vibe that includes custom sections
  const effectiveVibe = useMemo((): Vibe | null => {
    if (activeVibe) {
      return { ...activeVibe, sections: allSections };
    }
    if (customSections.length > 0) {
      return {
        id: 'custom-draw',
        name: 'Custom',
        emoji: '✏️',
        description: 'Freehand drawn sections',
        viewBox: '0 0 480 480',
        sections: customSections,
        lightTextures: [],
        mediumTextures: [],
        darkTextures: [],
        accentTextures: [],
      };
    }
    return null;
  }, [activeVibe, customSections, allSections]);

  const getState = useCallback(() => {
    return JSON.stringify({ elements, frameSize, frameColor, activeVibe, vibeFills, selectedSectionId });
  }, [elements, frameSize, frameColor, activeVibe, vibeFills, selectedSectionId]);

  const loadState = useCallback((serialized: string) => {
    try {
      const state = JSON.parse(serialized);
      if (state.elements) setElements(state.elements);
      if (state.frameSize) setFrameSize(state.frameSize);
      if (state.frameColor) setFrameColor(state.frameColor);
      if (state.activeVibe) setActiveVibe(state.activeVibe);
      if (state.vibeFills) setVibeFills(state.vibeFills);
      if (state.selectedSectionId !== undefined) setSelectedSectionId(state.selectedSectionId);
      setSelectedId(null);
    } catch { /* ignore corrupt state */ }
  }, []);

  return {
    // State
    elements,
    selectedId,
    selectedElement,
    frameSize,
    frameColor,
    displaySize,
    wallFrameStyle,
    activeVibe,
    vibeFills,
    selectedSectionId,
    // Setters
    setSelectedId,
    setFrameSize,
    setFrameColor,
    setDisplaySize,
    setWallFrameStyle,
    // Free-mode
    addElement,
    updateElement,
    updateEffects,
    deleteElement,
    duplicateElement,
    clearCanvas,
    generateRandom,
    shuffleElements,
    // Vibe mode
    selectVibe,
    fillSection,
    selectSection,
    shuffleVibeFills,
    // Serialization
    getState,
    loadState,
  };
}
