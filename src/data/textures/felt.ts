import { TextureSwatch } from '@/types/studio';

export const feltTextures: TextureSwatch[] = [
  {
    id: 'felt-crimson',
    name: 'Crimson Felt',
    category: 'Felt',
    cssBackground: `repeating-linear-gradient(22deg, hsla(355, 50%, 38%, 0.08) 0px, transparent 1px, transparent 6px),
      repeating-linear-gradient(158deg, hsla(355, 45%, 42%, 0.06) 0px, transparent 1px, transparent 8px),
      linear-gradient(180deg, hsl(355, 52%, 40%) 0%, hsl(357, 50%, 38%) 50%, hsl(355, 51%, 39%) 100%)`,
  },
  {
    id: 'felt-charcoal',
    name: 'Charcoal Felt',
    category: 'Felt',
    cssBackground: `repeating-linear-gradient(22deg, hsla(0, 0%, 28%, 0.08) 0px, transparent 1px, transparent 6px),
      repeating-linear-gradient(158deg, hsla(0, 0%, 32%, 0.06) 0px, transparent 1px, transparent 8px),
      linear-gradient(180deg, hsl(0, 0%, 30%) 0%, hsl(0, 0%, 28%) 50%, hsl(0, 0%, 29%) 100%)`,
  },
  {
    id: 'felt-sky',
    name: 'Sky Felt',
    category: 'Felt',
    cssBackground: `repeating-linear-gradient(22deg, hsla(200, 45%, 55%, 0.08) 0px, transparent 1px, transparent 6px),
      repeating-linear-gradient(158deg, hsla(200, 40%, 58%, 0.06) 0px, transparent 1px, transparent 8px),
      linear-gradient(180deg, hsl(200, 45%, 58%) 0%, hsl(202, 43%, 55%) 50%, hsl(200, 44%, 57%) 100%)`,
  },
  {
    id: 'felt-marigold',
    name: 'Marigold Felt',
    category: 'Felt',
    cssBackground: `repeating-linear-gradient(22deg, hsla(40, 70%, 52%, 0.08) 0px, transparent 1px, transparent 6px),
      repeating-linear-gradient(158deg, hsla(40, 65%, 56%, 0.06) 0px, transparent 1px, transparent 8px),
      linear-gradient(180deg, hsl(40, 70%, 55%) 0%, hsl(42, 68%, 52%) 50%, hsl(40, 69%, 54%) 100%)`,
  },
];
