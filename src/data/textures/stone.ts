import { TextureSwatch } from '@/types/studio';

export const stoneTextures: TextureSwatch[] = [
  {
    id: 'stone-smooth-grey',
    name: 'Smooth Grey Stone',
    category: 'Stone',
    cssBackground: `repeating-linear-gradient(25deg, hsla(210, 5%, 52%, 0.06) 0px, transparent 1px, transparent 12px),
      repeating-linear-gradient(140deg, hsla(210, 4%, 48%, 0.04) 0px, transparent 1px, transparent 16px),
      linear-gradient(180deg, hsl(210, 5%, 55%) 0%, hsl(210, 4%, 50%) 50%, hsl(210, 5%, 53%) 100%)`,
  },
  {
    id: 'stone-rough-slate',
    name: 'Rough Slate',
    category: 'Stone',
    cssBackground: `repeating-linear-gradient(8deg, hsla(215, 10%, 35%, 0.12) 0px, transparent 1px, transparent 5px),
      repeating-linear-gradient(172deg, hsla(215, 8%, 30%, 0.1) 0px, transparent 1px, transparent 6px),
      repeating-linear-gradient(88deg, hsla(215, 12%, 38%, 0.08) 0px, transparent 1px, transparent 7px),
      linear-gradient(180deg, hsl(215, 10%, 36%) 0%, hsl(215, 8%, 32%) 50%, hsl(215, 9%, 34%) 100%)`,
  },
  {
    id: 'stone-warm',
    name: 'Warm Sandstone',
    category: 'Stone',
    cssBackground: `repeating-linear-gradient(15deg, hsla(25, 22%, 60%, 0.08) 0px, transparent 1px, transparent 8px),
      repeating-linear-gradient(165deg, hsla(22, 18%, 56%, 0.06) 0px, transparent 1px, transparent 10px),
      linear-gradient(180deg, hsl(25, 22%, 62%) 0%, hsl(23, 20%, 58%) 50%, hsl(25, 21%, 60%) 100%)`,
  },
  {
    id: 'stone-basalt',
    name: 'Basalt',
    category: 'Stone',
    cssBackground: `repeating-linear-gradient(8deg, hsla(0, 0%, 22%, 0.1) 0px, transparent 1px, transparent 5px),
      repeating-linear-gradient(172deg, hsla(0, 0%, 18%, 0.08) 0px, transparent 1px, transparent 6px),
      linear-gradient(180deg, hsl(0, 0%, 22%) 0%, hsl(0, 0%, 18%) 50%, hsl(0, 0%, 20%) 100%)`,
  },
];
