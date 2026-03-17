import { TextureSwatch } from '@/types/studio';

export const gridTextures: TextureSwatch[] = [
  {
    id: 'grid-fine-white',
    name: 'Fine White Grid',
    category: 'Grid',
    cssBackground: `repeating-linear-gradient(0deg, transparent 0px, transparent 9px, hsla(0, 0%, 75%, 0.4) 9px, hsla(0, 0%, 75%, 0.4) 10px),
      repeating-linear-gradient(90deg, transparent 0px, transparent 9px, hsla(0, 0%, 75%, 0.4) 9px, hsla(0, 0%, 75%, 0.4) 10px),
      linear-gradient(180deg, hsl(0, 0%, 97%) 0%, hsl(0, 0%, 95%) 100%)`,
  },
  {
    id: 'grid-graph-paper',
    name: 'Graph Paper',
    category: 'Grid',
    cssBackground: `repeating-linear-gradient(0deg, transparent 0px, transparent 9px, hsla(210, 30%, 70%, 0.3) 9px, hsla(210, 30%, 70%, 0.3) 10px),
      repeating-linear-gradient(90deg, transparent 0px, transparent 9px, hsla(210, 30%, 70%, 0.3) 9px, hsla(210, 30%, 70%, 0.3) 10px),
      linear-gradient(180deg, hsl(55, 30%, 95%) 0%, hsl(55, 28%, 93%) 100%)`,
  },
  {
    id: 'grid-dark',
    name: 'Dark Grid',
    category: 'Grid',
    cssBackground: `repeating-linear-gradient(0deg, transparent 0px, transparent 11px, hsla(0, 0%, 30%, 0.4) 11px, hsla(0, 0%, 30%, 0.4) 12px),
      repeating-linear-gradient(90deg, transparent 0px, transparent 11px, hsla(0, 0%, 30%, 0.4) 11px, hsla(0, 0%, 30%, 0.4) 12px),
      linear-gradient(180deg, hsl(0, 0%, 15%) 0%, hsl(0, 0%, 12%) 100%)`,
  },
];
