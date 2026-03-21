import { useState, useCallback, useMemo, useRef } from 'react';
import { CanvasElement, FrameSize, FrameColor, defaultEffects, MaterialEffects, ElementShape, Vibe, VibeFills, VibeSection, SectionTransform, SectionTransforms, defaultSectionTransform } from '@/types/studio';
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
  const [elements, _setElements] = useState<CanvasElement[]>([]);
  const historyRef = useRef<CanvasElement[][]>([[]]);
  const historyIndexRef = useRef(0);
  const maxHistory = 50;

  const pushHistory = useCallback((next: CanvasElement[]) => {
    const idx = historyIndexRef.current;
    const newHistory = historyRef.current.slice(0, idx + 1);
    newHistory.push(next);
    if (newHistory.length > maxHistory) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  }, []);

  const setElements: typeof _setElements = useCallback((action) => {
    _setElements(prev => {
      const next = typeof action === 'function' ? action(prev) : action;
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    historyIndexRef.current = idx - 1;
    _setElements(historyRef.current[idx - 1]);
  }, []);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx >= historyRef.current.length - 1) return;
    historyIndexRef.current = idx + 1;
    _setElements(historyRef.current[idx + 1]);
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState<FrameSize>('12x12');
  const [frameColor, setFrameColor] = useState<FrameColor>('white');
  const [displaySize, setDisplaySize] = useState<DesignSize>('medium');
  const [wallFrameStyle, setWallFrameStyle] = useState<FrameStyle>('shadow-box');
  const [nextShape, setNextShape] = useState<ElementShape>('soft-square');
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null);
  const [vibeFills, setVibeFills] = useState<VibeFills>({});
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [crayonMode, setCrayonMode] = useState(false);
  const [crayonTextureId, setCrayonTextureId] = useState<string | null>(null);
  const [customSections, setCustomSections] = useState<VibeSection[]>([]);
  const [backgroundTextureId, setBackgroundTextureId] = useState<string | null>(null);
  const [sectionTransforms, setSectionTransforms] = useState<SectionTransforms>({});
  const [deletedSections, setDeletedSections] = useState<Set<string>>(new Set());

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  // ── Free-mode actions ──

  const addElement = useCallback((textureId: string, x: number, y: number) => {
    const id = `el-${nextId++}`;
    // Set dimensions based on shape
    let w = 100, h = 100;
    if (nextShape === 'strip') { w = 180; h = 40; }
    else if (nextShape === 'rectangle') { w = 150; h = 100; }
    const newEl: CanvasElement = {
      id,
      textureId,
      x,
      y,
      width: w,
      height: h,
      rotation: 0,
      shape: nextShape,
      zIndex: nextId,
      effects: { ...defaultEffects },
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);
    return id;
  }, [nextShape]);

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
    setCrayonMode(false);
    setCrayonTextureId(null);
    setBackgroundTextureId(null);
    setSectionTransforms({});
    setDeletedSections(new Set());
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
    setSelectedId(null);
    setSelectedSectionId(null);
    setVibeFills({});
    setSectionTransforms({});
    setDeletedSections(new Set());
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
      const vibePool = {
        light: activeVibe.lightTextures,
        medium: activeVibe.mediumTextures,
        dark: activeVibe.darkTextures,
        accent: activeVibe.accentTextures,
      }[section.tone];
      const valid = vibePool.filter(id => textures.some(t => t.id === id));
      if (valid.length > 0) {
        fills[section.id] = pickRandom(valid);
      } else {
        fills[section.id] = textures[Math.floor(Math.random() * textures.length)].id;
      }
    });
    setVibeFills(fills);
  }, [activeVibe]);

  // Place current stencil as free elements on canvas, freeing the vibe slot for another
  const placeStencil = useCallback(() => {
    if (!activeVibe) return;
    const sections = activeVibe.sections.filter(s => !deletedSections.has(s.id));
    const newElements: CanvasElement[] = [];
    sections.forEach(section => {
      const textureId = vibeFills[section.id] || textures[Math.floor(Math.random() * textures.length)].id;
      const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
      let minX = 480, minY = 480, maxX = 0, maxY = 0;
      for (let i = 0; i < nums.length - 1; i += 2) {
        minX = Math.min(minX, nums[i]);
        maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]);
        maxY = Math.max(maxY, nums[i + 1]);
      }
      const rawW = Math.max(maxX - minX, 20);
      const rawH = Math.max(maxY - minY, 20);
      // Normalize the SVG path so coordinates are relative to 0,0 of the element
      const normalizedPath = normalizeSvgPath(section.path, minX, minY, rawW, rawH, rawW, rawH);
      const id = `el-${nextId++}`;
      newElements.push({
        id,
        textureId,
        x: minX,
        y: minY,
        width: rawW,
        height: rawH,
        rotation: 0,
        shape: 'soft-square' as const,
        zIndex: nextId,
        effects: { ...defaultEffects },
        sectionId: section.id,
        clipPathD: normalizedPath,
      });
    });
    setElements(prev => [...prev, ...newElements]);
    setActiveVibe(null);
    setVibeFills({});
    setSelectedSectionId(null);
    setCustomSections([]);
    setSectionTransforms({});
    setDeletedSections(new Set());
  }, [activeVibe, vibeFills, deletedSections]);

  // ── Custom drawn sections ──

  const addCustomSection = useCallback((pathD: string, overrideTextureId?: string) => {
    // Parse path to compute bounding box
    const nums = pathD.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length - 1; i += 2) {
      minX = Math.min(minX, nums[i]);
      maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]);
      maxY = Math.max(maxY, nums[i + 1]);
    }
    const w = Math.max(maxX - minX, 20);
    const h = Math.max(maxY - minY, 20);

    // Use override texture (crayon), or random
    const textureId = overrideTextureId || crayonTextureId || textures[Math.floor(Math.random() * Math.min(textures.length, 20))].id;

    const id = `el-${nextId++}`;
    const newEl: CanvasElement = {
      id,
      textureId,
      x: minX,
      y: minY,
      width: w,
      height: h,
      rotation: 0,
      shape: nextShape,
      zIndex: nextId,
      effects: { ...defaultEffects },
      clipPathD: pathD,
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);
    // In crayon mode, stay in draw mode so they can keep drawing
    if (!crayonMode) {
      setDrawMode(false);
    }
  }, [nextShape, crayonMode, crayonTextureId]);

  const deleteCustomSection = useCallback((sectionId: string) => {
    setCustomSections(prev => prev.filter(s => s.id !== sectionId));
    setVibeFills(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [selectedSectionId]);

  const updateSectionTransform = useCallback((sectionId: string, updates: Partial<SectionTransform>) => {
    setSectionTransforms(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || defaultSectionTransform), ...updates },
    }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    // Remove from vibe sections if it's a custom section
    setCustomSections(prev => prev.filter(s => s.id !== sectionId));
    // If it's a vibe section, we track deletion separately
    setVibeFills(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setSectionTransforms(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    // Track deleted vibe sections
    setDeletedSections(prev => new Set([...prev, sectionId]));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [selectedSectionId]);

  // Combine vibe sections + custom drawn sections
  const allSections = useMemo(() => {
    const vibeSections = activeVibe?.sections || [];
    return [...vibeSections, ...customSections].filter(s => !deletedSections.has(s.id));
  }, [activeVibe, customSections, deletedSections]);

  const duplicateSection = useCallback((sectionId: string) => {
    const section = allSections.find(s => s.id === sectionId);
    if (!section) return;
    const newId = `section-dup-${nextId++}`;
    const newSection: VibeSection = {
      ...section,
      id: newId,
      label: `${section.label} Copy`,
    };
    setCustomSections(prev => [...prev, newSection]);
    // Copy fill if present
    const existingFill = vibeFills[sectionId];
    if (existingFill) {
      setVibeFills(prev => ({ ...prev, [newId]: existingFill }));
    }
    // Copy transform with slight offset
    const t = sectionTransforms[sectionId] || defaultSectionTransform;
    setSectionTransforms(prev => ({
      ...prev,
      [newId]: { ...t, x: t.x + 15, y: t.y + 15 },
    }));
    setSelectedSectionId(newId);
  }, [allSections, vibeFills, sectionTransforms]);

  // Detach a filled section into a free canvas element
  const detachSection = useCallback((sectionId: string) => {
    const section = allSections.find(s => s.id === sectionId);
    const textureId = vibeFills[sectionId];
    if (!section || !textureId) return;

    // Parse path to compute bounding box
    const nums = section.path.match(/-?\d+/g)?.map(Number) || [];
    let minX = 480, minY = 480, maxX = 0, maxY = 0;
    for (let i = 0; i < nums.length - 1; i += 2) {
      minX = Math.min(minX, nums[i]);
      maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]);
      maxY = Math.max(maxY, nums[i + 1]);
    }
    const w = maxX - minX;
    const h = maxY - minY;

    const id = `el-${nextId++}`;
    const newEl: CanvasElement = {
      id,
      textureId,
      x: minX,
      y: minY,
      width: w,
      height: h,
      rotation: 0,
      shape: 'soft-square',
      zIndex: nextId,
      effects: { ...defaultEffects },
      sectionId,
      clipPathD: section.path,
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);

    // Remove from vibe fills
    setVibeFills(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setSelectedSectionId(null);
  }, [vibeFills, allSections]);

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
    return JSON.stringify({ elements, frameSize, frameColor, activeVibe, vibeFills, selectedSectionId, backgroundTextureId });
  }, [elements, frameSize, frameColor, activeVibe, vibeFills, selectedSectionId, backgroundTextureId]);

  const loadState = useCallback((serialized: string) => {
    try {
      const state = JSON.parse(serialized);
      if (state.elements) setElements(state.elements);
      if (state.frameSize) setFrameSize(state.frameSize);
      if (state.frameColor) setFrameColor(state.frameColor);
      if (state.activeVibe) setActiveVibe(state.activeVibe);
      if (state.vibeFills) setVibeFills(state.vibeFills);
      if (state.selectedSectionId !== undefined) setSelectedSectionId(state.selectedSectionId);
      if (state.backgroundTextureId !== undefined) setBackgroundTextureId(state.backgroundTextureId);
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
    activeVibe: effectiveVibe,
    vibeFills,
    selectedSectionId,
    drawMode,
    crayonMode,
    crayonTextureId,
    customSections,
    backgroundTextureId,
    sectionTransforms,
    // Setters
    setSelectedId,
    setFrameSize,
    setFrameColor,
    setDisplaySize,
    setWallFrameStyle,
    setDrawMode,
    setCrayonMode,
    setCrayonTextureId,
    setBackgroundTextureId,
    nextShape,
    setNextShape,
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
    placeStencil,
    // Custom sections
    addCustomSection,
    deleteCustomSection,
    deleteSection,
    duplicateSection,
    updateSectionTransform,
    detachSection,
    // Serialization
    getState,
    loadState,
    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
