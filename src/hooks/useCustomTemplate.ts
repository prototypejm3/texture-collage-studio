import { useState, useCallback } from 'react';

export interface CustomTemplate {
  id: string;
  name: string;
  dataUrl: string;
}

let templateId = 1;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useCustomTemplate() {
  const [customTemplate, setCustomTemplate] = useState<CustomTemplate | null>(null);
  const [templateOpacity, setTemplateOpacity] = useState(0.3);

  const uploadTemplate = useCallback(async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const name = file.name.replace(/\.[^.]+$/, '');
    setCustomTemplate({
      id: `template-${templateId++}`,
      name,
      dataUrl,
    });
  }, []);

  const clearTemplate = useCallback(() => {
    setCustomTemplate(null);
  }, []);

  return { customTemplate, templateOpacity, setTemplateOpacity, uploadTemplate, clearTemplate };
}
