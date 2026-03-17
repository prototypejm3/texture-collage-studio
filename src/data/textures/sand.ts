import { TextureSwatch } from '@/types/studio';

export const sandTextures: TextureSwatch[] = [
  {
    id: 'sand-natural',
    name: 'Natural Sand',
    category: 'Sand',
    cssBackground: `repeating-linear-gradient(18deg, hsla(38, 35%, 68%, 0.1) 0px, transparent 1px, transparent 4px),
      repeating-linear-gradient(162deg, hsla(35, 30%, 72%, 0.08) 0px, transparent 1px, transparent 5px),
      repeating-linear-gradient(95deg, hsla(40, 28%, 65%, 0.06) 0px, transparent 1px, transparent 6px),
      linear-gradient(180deg, hsl(38, 38%, 72%) 0%, hsl(36, 35%, 68%) 50%, hsl(38, 36%, 70%) 100%)`,
  },
  {
    id: 'sand-desert',
    name: 'Desert Sand',
    category: 'Sand',
    cssBackground: `repeating-linear-gradient(18deg, hsla(28, 45%, 62%, 0.1) 0px, transparent 1px, transparent 4px),
      repeating-linear-gradient(162deg, hsla(25, 40%, 66%, 0.08) 0px, transparent 1px, transparent 5px),
      linear-gradient(180deg, hsl(28, 45%, 65%) 0%, hsl(26, 42%, 60%) 50%, hsl(28, 43%, 63%) 100%)`,
  },
  {
    id: 'sand-wet',
    name: 'Wet Sand',
    category: 'Sand',
    cssBackground: `repeating-linear-gradient(18deg, hsla(35, 25%, 52%, 0.1) 0px, transparent 1px, transparent 4px),
      repeating-linear-gradient(162deg, hsla(32, 22%, 56%, 0.08) 0px, transparent 1px, transparent 5px),
      linear-gradient(180deg, hsl(35, 28%, 55%) 0%, hsl(33, 25%, 50%) 50%, hsl(35, 26%, 53%) 100%)`,
  },
];
