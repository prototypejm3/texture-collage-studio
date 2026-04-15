import { useState, useCallback, useMemo, useRef } from 'react';
import { CanvasElement, FrameSize, FrameColor, defaultEffects, MaterialEffects, ElementShape, Vibe, VibeFills, VibeSection, SectionTransform, SectionTransforms, defaultSectionTransform, BlendMode, StencilMode } from '@/types/studio';
import { DesignSize, FrameStyle } from '@/types/wall';
import { textures } from '@/data/textures';

let nextId = 1;

/**
 * Normalize an SVG path so all coordinates are relative to the element's
 * bounding box (0,0 → width,height). This allows clip-path elements to be
 * positioned and moved like regular elements.
 */
function normalizeSvgPath(
  pathD: string,
  originX: number,
  originY: number,
  origW: number,
  origH: number,
  targetW: number,
  targetH: number,
): string {
  // Replace every number pair in the path, translating by -originX/-originY
  // and scaling to target dimensions
  const scaleX = targetW / origW;
  const scaleY = targetH / origH;
  let idx = 0;
  const nums = pathD.match(/-?\d+(\.\d+)?/g) || [];
  let result = '';
  let numIdx = 0;
  let i = 0;
  while (i < pathD.length) {
    const match = pathD.slice(i).match(/^-?\d+(\.\d+)?/);
    if (match) {
      const val = parseFloat(match[0]);
      // Determine if x or y coordinate based on pair position
      if (numIdx % 2 === 0) {
        result += String(Math.round((val - originX) * scaleX * 100) / 100);
      } else {
        result += String(Math.round((val - originY) * scaleY * 100) / 100);
      }
      numIdx++;
      i += match[0].length;
    } else {
      result += pathD[i];
      i++;
    }
  }
  return result;
}

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
  // Force re-render when history index changes
  const [historyVersion, setHistoryVersion] = useState(0);

  const pushHistory = useCallback((next: CanvasElement[]) => {
    const idx = historyIndexRef.current;
    const newHistory = historyRef.current.slice(0, idx + 1);
    newHistory.push(next);
    if (newHistory.length > maxHistory) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistoryVersion(v => v + 1);
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
    setHistoryVersion(v => v + 1);
  }, []);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx >= historyRef.current.length - 1) return;
    historyIndexRef.current = idx + 1;
    _setElements(historyRef.current[idx + 1]);
    setHistoryVersion(v => v + 1);
  }, []);

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0;
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1;

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
  const [previewSize, setPreviewSize] = useState<string | null>(null);
  const [previewElementIds, setPreviewElementIds] = useState<string[]>([]);
  const previewIdsRef = useRef<string[]>([]);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  // ── Free-mode actions ──

  const addElement = useCallback((textureId: string, x: number, y: number) => {
    const id = `el-${nextId++}`;
    // Set dimensions based on shape
    let w = 70, h = 70;
    if (nextShape === 'strip') { w = 140; h = 30; }
    else if (nextShape === 'rectangle') { w = 280; h = 45; }
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

  // Add pre-built elements directly (used by Letters panel)
  const addRawElements = useCallback((els: CanvasElement[]) => {
    setElements(prev => [...prev, ...els]);
  }, []);

  const addTextElement = useCallback((text: string, x: number, y: number, opts?: { fontFamily?: string; fontSize?: number; fontWeight?: number; textColor?: string; textAlign?: 'left' | 'center' | 'right' }) => {
    const id = `el-${nextId++}`;
    const newEl: CanvasElement = {
      id,
      textureId: '__text__',
      x,
      y,
      width: 200,
      height: 60,
      rotation: 0,
      shape: 'soft-square',
      zIndex: nextId,
      effects: { ...defaultEffects },
      type: 'text',
      text,
      fontFamily: opts?.fontFamily || 'system-ui',
      fontSize: opts?.fontSize || 24,
      fontWeight: opts?.fontWeight || 500,
      textColor: opts?.textColor || '#3d3530',
      textAlign: opts?.textAlign || 'center',
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

  // Soft fill colors for 'filled' (sticker) mode - desaturated, warm tones
  const filledModeColors: Record<string, string> = {
    light: 'flat-silk-ivory',
    medium: 'felt-sand',
    dark: 'leather-espresso',
    accent: 'cotton-terracotta',
  };

  // Build stencil elements for a given size without committing
  const buildStencilElements = useCallback((sizeOrMode?: string) => {
    if (!activeVibe) return [];
    const sections = activeVibe.sections.filter(s => !deletedSections.has(s.id));
    const newElements: CanvasElement[] = [];

    const vbParts = (activeVibe.viewBox || '0 0 480 480').split(/\s+/).map(Number);
    const vbW = vbParts[2] || 480;
    const vbH = vbParts[3] || 480;
    const sizeMap: Record<string, number> = { S: 100, M: 180, L: 300, outline: 300, filled: 300 };
    const targetSize = sizeMap[sizeOrMode || 'L'] || 300;
    const scaleFactor = targetSize / Math.max(vbW, vbH);

    sections.forEach(section => {
      let textureId = vibeFills[section.id] || '';

      const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
      let minX = vbW, minY = vbH, maxX = 0, maxY = 0;
      for (let i = 0; i < nums.length - 1; i += 2) {
        minX = Math.min(minX, nums[i]);
        maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]);
        maxY = Math.max(maxY, nums[i + 1]);
      }
      const rawW = Math.max(maxX - minX, 20);
      const rawH = Math.max(maxY - minY, 20);
      const scaledW = Math.round(rawW * scaleFactor);
      const scaledH = Math.round(rawH * scaleFactor);
      const scaledX = Math.round(minX * scaleFactor);
      const scaledY = Math.round(minY * scaleFactor);
      const normalizedPath = normalizeSvgPath(section.path, minX, minY, rawW, rawH, scaledW, scaledH);
      const id = `el-${nextId++}`;
      newElements.push({
        id,
        textureId,
        x: scaledX,
        y: scaledY,
        width: scaledW,
        height: scaledH,
        rotation: 0,
        shape: 'soft-square' as const,
        zIndex: nextId,
        effects: { ...defaultEffects },
        sectionId: section.id,
        clipPathD: normalizedPath,
        stencilMode: 'outline',
      });
    });
    return newElements;
  }, [activeVibe, vibeFills, deletedSections]);

  // Preview stencil at a size (non-destructive — replaces previous preview)
  const previewStencilSize = useCallback((size: string) => {
    // Remove previous preview elements using ref (avoids stale closure)
    const oldIds = previewIdsRef.current;
    setElements(prev => prev.filter(e => !oldIds.includes(e.id)));
    const newElements = buildStencilElements(size);
    const ids = newElements.map(e => e.id);
    previewIdsRef.current = ids;
    setPreviewElementIds(ids);
    setPreviewSize(size);
    setElements(prev => [...prev, ...newElements]);
  }, [buildStencilElements]);

  // Commit preview — keep elements, clear vibe state
  const commitPreview = useCallback(() => {
    previewIdsRef.current = [];
    setPreviewElementIds([]);
    setPreviewSize(null);
    setActiveVibe(null);
    setVibeFills({});
    setSelectedSectionId(null);
    setCustomSections([]);
    setSectionTransforms({});
    setDeletedSections(new Set());
  }, []);

  // Cancel preview — remove preview elements, restore vibe
  const cancelPreview = useCallback(() => {
    const oldIds = previewIdsRef.current;
    setElements(prev => prev.filter(e => !oldIds.includes(e.id)));
    previewIdsRef.current = [];
    setPreviewElementIds([]);
    setPreviewSize(null);
  }, []);

  // Place current stencil as free elements on canvas (outline only)
  const placeStencil = useCallback((sizeOrMode?: string) => {
    // If there's an active preview, just commit it
    if (previewElementIds.length > 0) {
      commitPreview();
      return;
    }
    const newElements = buildStencilElements(sizeOrMode);
    setElements(prev => [...prev, ...newElements]);
    setActiveVibe(null);
    setVibeFills({});
    setSelectedSectionId(null);
    setCustomSections([]);
    setSectionTransforms({});
    setDeletedSections(new Set());
  }, [buildStencilElements, previewElementIds, commitPreview]);

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
    const nums = section.path.match(/-?\d+(\.\d+)?/g)?.map(Number) || [];
    let minX = 480, minY = 480, maxX = 0, maxY = 0;
    for (let i = 0; i < nums.length - 1; i += 2) {
      minX = Math.min(minX, nums[i]);
      maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]);
      maxY = Math.max(maxY, nums[i + 1]);
    }
    const w = Math.max(maxX - minX, 20);
    const h = Math.max(maxY - minY, 20);
    const normalizedPath = normalizeSvgPath(section.path, minX, minY, w, h, w, h);

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
      clipPathD: normalizedPath,
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
    addTextElement,
    addElement,
    addRawElements,
    buildStencilElements,
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
    previewStencilSize,
    commitPreview,
    cancelPreview,
    previewSize,
    previewElementIds,
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
    // Layer ordering
    bringForward: useCallback((id: string) => {
      setElements(prev => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex(e => e.id === id);
        if (idx < 0 || idx >= sorted.length - 1) return prev;
        // Reassign sequential zIndex values with the two swapped
        const swapped = [...sorted];
        [swapped[idx], swapped[idx + 1]] = [swapped[idx + 1], swapped[idx]];
        return prev.map(e => {
          const newIdx = swapped.findIndex(s => s.id === e.id);
          return { ...e, zIndex: newIdx };
        });
      });
    }, []),
    sendBackward: useCallback((id: string) => {
      setElements(prev => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex(e => e.id === id);
        if (idx <= 0) return prev;
        const swapped = [...sorted];
        [swapped[idx], swapped[idx - 1]] = [swapped[idx - 1], swapped[idx]];
        return prev.map(e => {
          const newIdx = swapped.findIndex(s => s.id === e.id);
          return { ...e, zIndex: newIdx };
        });
      });
    }, []),
  };
}
