import { TextureSwatch } from '@/types/studio';

export const concreteTextures: TextureSwatch[] = [
  {
    id: 'concrete-raw',
    name: 'Raw Concrete',
    category: 'Concrete',
    cssBackground: `repeating-linear-gradient(12deg, hsla(0, 0%, 60%, 0.06) 0px, transparent 1px, transparent 8px),
      repeating-linear-gradient(170deg, hsla(0, 0%, 55%, 0.05) 0px, transparent 1px, transparent 10px),
      repeating-linear-gradient(85deg, hsla(0, 0%, 65%, 0.04) 0px, transparent 1px, transparent 12px),
      linear-gradient(180deg, hsl(0, 0%, 68%) 0%, hsl(0, 0%, 64%) 40%, hsl(0, 0%, 66%) 70%, hsl(0, 0%, 65%) 100%)`,
  },
  {
    id: 'concrete-polished',
    name: 'Polished Concrete',
    category: 'Concrete',
    cssBackground: `repeating-linear-gradient(30deg, hsla(200, 3%, 58%, 0.05) 0px, transparent 1px, transparent 10px),
      repeating-linear-gradient(150deg, hsla(200, 2%, 54%, 0.04) 0px, transparent 1px, transparent 14px),
      linear-gradient(180deg, hsl(200, 4%, 60%) 0%, hsl(200, 3%, 56%) 50%, hsl(200, 4%, 58%) 100%)`,
  },
  {
    id: 'concrete-dark',
    name: 'Dark Concrete',
    category: 'Concrete',
    cssBackground: `repeating-linear-gradient(12deg, hsla(0, 0%, 38%, 0.08) 0px, transparent 1px, transparent 8px),
      repeating-linear-gradient(170deg, hsla(0, 0%, 34%, 0.06) 0px, transparent 1px, transparent 10px),
      linear-gradient(180deg, hsl(0, 0%, 38%) 0%, hsl(0, 0%, 34%) 50%, hsl(0, 0%, 36%) 100%)`,
  },
];
