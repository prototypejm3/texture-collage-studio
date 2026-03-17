import { useState, useCallback } from 'react';
import { CanvasElement, FrameSize, FrameColor, defaultEffects, MaterialEffects, ElementShape } from '@/types/studio';
import { textures } from '@/data/textures';

let nextId = 1;

export function useStudio() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frameSize, setFrameSize] = useState<FrameSize>('12x12');
  const [frameColor, setFrameColor] = useState<FrameColor>('white');

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
  }, []);

  const shuffleElements = useCallback(() => {
    setElements(prev => prev.map(el => ({
      ...el,
      x: 30 + Math.random() * 250,
      y: 30 + Math.random() * 250,
      rotation: Math.floor(Math.random() * 30) - 15,
    })));
  }, []);

  return {
    elements,
    selectedId,
    selectedElement,
    frameSize,
    frameColor,
    setSelectedId,
    setFrameSize,
    setFrameColor,
    addElement,
    updateElement,
    updateEffects,
    deleteElement,
    duplicateElement,
    clearCanvas,
    generateRandom,
    shuffleElements,
  };
}
