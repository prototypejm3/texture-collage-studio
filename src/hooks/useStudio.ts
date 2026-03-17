import { useState, useCallback } from 'react';
import { CanvasElement, FrameSize, FrameColor, defaultEffects, MaterialEffects, ElementShape, Vibe, TemplateSection } from '@/types/studio';
import { textures } from '@/data/textures';

let nextId = 1;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTexturesByIds(ids: string[]) {
  return textures.filter(t => ids.includes(t.id));
}

function pickTextureForTone(vibe: Vibe, tone: TemplateSection['tone']): string {
  const pool = {
    light: vibe.lightTextures,
    medium: vibe.mediumTextures,
    dark: vibe.darkTextures,
    accent: vibe.accentTextures,
  }[tone];
  // Filter to only textures that actually exist
  const valid = pool.filter(id => textures.some(t => t.id === id));
  if (valid.length === 0) return textures[0].id;
  return pickRandom(valid);
}

export function useStudio() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState<FrameSize>('12x12');
  const [frameColor, setFrameColor] = useState<FrameColor>('white');
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

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
      shape: 'square',
      zIndex: nextId,
      effects: { ...defaultEffects },
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);
    return id;
  }, []);

  const addElementToSection = useCallback((sectionId: string, textureId: string, section: TemplateSection, canvasWidth: number, canvasHeight: number) => {
    const id = `el-${nextId++}`;
    const x = (section.x / 100) * canvasWidth;
    const y = (section.y / 100) * canvasHeight;
    const w = (section.width / 100) * canvasWidth;
    const h = (section.height / 100) * canvasHeight;

    const newEl: CanvasElement = {
      id,
      textureId,
      x,
      y,
      width: w,
      height: h,
      rotation: 0,
      shape: section.shape,
      zIndex: nextId,
      effects: { ...defaultEffects },
      sectionId,
    };

    // Remove any existing element in this section
    setElements(prev => [...prev.filter(el => el.sectionId !== sectionId), newEl]);
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
    setElements(prev => [...prev, { ...el, id: newId, x: el.x + 20, y: el.y + 20, zIndex: nextId, sectionId: undefined }]);
    setSelectedId(newId);
  }, [elements]);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    setActiveVibe(null);
  }, []);

  const generateRandom = useCallback(() => {
    const count = 4 + Math.floor(Math.random() * 5);
    const shapes: ElementShape[] = ['square', 'rectangle', 'circle', 'strip'];
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
    setActiveVibe(null);
  }, []);

  const shuffleElements = useCallback(() => {
    if (activeVibe) {
      // Keep same template, re-randomize textures within palette
      applyVibe(activeVibe);
      return;
    }
    setElements(prev => prev.map(el => ({
      ...el,
      x: 30 + Math.random() * 250,
      y: 30 + Math.random() * 250,
      rotation: Math.floor(Math.random() * 30) - 15,
    })));
  }, []);

  const applyVibe = useCallback((vibe: Vibe, canvasW = 480, canvasH = 480) => {
    setActiveVibe(vibe);
    const newElements: CanvasElement[] = vibe.template.sections.map(section => {
      const textureId = pickTextureForTone(vibe, section.tone);
      const x = (section.x / 100) * canvasW;
      const y = (section.y / 100) * canvasH;
      const w = (section.width / 100) * canvasW;
      const h = (section.height / 100) * canvasH;

      return {
        id: `el-${nextId++}`,
        textureId,
        x,
        y,
        width: w,
        height: h,
        rotation: 0,
        shape: section.shape,
        zIndex: nextId,
        effects: { ...defaultEffects },
        sectionId: section.id,
      };
    });
    setElements(newElements);
    setSelectedId(null);
  }, []);

  const shuffleVibe = useCallback(() => {
    if (activeVibe) {
      applyVibe(activeVibe);
    }
  }, [activeVibe, applyVibe]);

  return {
    elements,
    selectedId,
    selectedElement,
    frameSize,
    frameColor,
    activeVibe,
    setSelectedId,
    setFrameSize,
    setFrameColor,
    addElement,
    addElementToSection,
    updateElement,
    updateEffects,
    deleteElement,
    duplicateElement,
    clearCanvas,
    generateRandom,
    shuffleElements,
    applyVibe,
    shuffleVibe,
  };
}
