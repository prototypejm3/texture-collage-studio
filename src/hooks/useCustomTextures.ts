import { useState, useCallback } from 'react';
import { TextureSwatch } from '@/types/studio';

let customId = 1;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useCustomTextures() {
  const [customTextures, setCustomTextures] = useState<TextureSwatch[]>([]);

  const addCustomTexture = useCallback(async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const tex: TextureSwatch = {
      id: `custom-${customId++}`,
      name: name || 'Custom Texture',
      category: 'Custom',
      cssBackground: `url(${dataUrl}) center/cover`,
    };
    setCustomTextures(prev => [...prev, tex]);
    return tex.id;
  }, []);

  const removeCustomTexture = useCallback((id: string) => {
    setCustomTextures(prev => prev.filter(t => t.id !== id));
  }, []);

  return { customTextures, addCustomTexture, removeCustomTexture };
}
