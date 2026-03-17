import { TextureSwatch } from '@/types/studio';

export const corkTextures: TextureSwatch[] = [
  {
    id: 'cork-natural',
    name: 'Natural Cork',
    category: 'Cork',
    cssBackground: `repeating-linear-gradient(35deg, hsla(28, 40%, 48%, 0.12) 0px, transparent 2px, transparent 5px),
      repeating-linear-gradient(125deg, hsla(30, 35%, 52%, 0.1) 0px, transparent 1px, transparent 4px),
      repeating-linear-gradient(80deg, hsla(25, 45%, 44%, 0.08) 0px, transparent 1px, transparent 6px),
      linear-gradient(180deg, hsl(30, 40%, 55%) 0%, hsl(28, 38%, 50%) 50%, hsl(30, 39%, 53%) 100%)`,
  },
  {
    id: 'cork-dark',
    name: 'Dark Cork',
    category: 'Cork',
    cssBackground: `repeating-linear-gradient(35deg, hsla(22, 35%, 32%, 0.12) 0px, transparent 2px, transparent 5px),
      repeating-linear-gradient(125deg, hsla(24, 30%, 36%, 0.1) 0px, transparent 1px, transparent 4px),
      linear-gradient(180deg, hsl(22, 35%, 35%) 0%, hsl(20, 32%, 30%) 50%, hsl(22, 33%, 33%) 100%)`,
  },
  {
    id: 'cork-bleached',
    name: 'Bleached Cork',
    category: 'Cork',
    cssBackground: `repeating-linear-gradient(35deg, hsla(35, 30%, 68%, 0.1) 0px, transparent 2px, transparent 5px),
      repeating-linear-gradient(125deg, hsla(37, 25%, 72%, 0.08) 0px, transparent 1px, transparent 4px),
      linear-gradient(180deg, hsl(35, 30%, 72%) 0%, hsl(33, 28%, 68%) 50%, hsl(35, 29%, 70%) 100%)`,
  },
];
