import { TextureSwatch } from '@/types/studio';

export const denimTextures: TextureSwatch[] = [
  {
    id: 'denim-classic',
    name: 'Classic Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(215, 50%, 38%, 0.4) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(215, 45%, 42%, 0.3) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(215, 50%, 40%) 0%, hsl(217, 52%, 36%) 50%, hsl(215, 48%, 39%) 100%)`,
  },
  {
    id: 'denim-light-wash',
    name: 'Light Wash Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(210, 35%, 62%, 0.35) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(210, 30%, 66%, 0.25) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(210, 35%, 64%) 0%, hsl(212, 38%, 60%) 50%, hsl(210, 33%, 63%) 100%)`,
  },
  {
    id: 'denim-raw',
    name: 'Raw Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(220, 55%, 22%, 0.5) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(220, 50%, 26%, 0.35) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(220, 55%, 24%) 0%, hsl(222, 58%, 20%) 50%, hsl(220, 53%, 23%) 100%)`,
  },
  {
    id: 'denim-black',
    name: 'Black Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(225, 15%, 18%, 0.5) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(225, 12%, 22%, 0.3) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(225, 15%, 18%) 0%, hsl(227, 18%, 14%) 50%, hsl(225, 14%, 17%) 100%)`,
  },
];
