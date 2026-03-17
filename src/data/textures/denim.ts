import { TextureSwatch } from '@/types/studio';

export const denimTextures: TextureSwatch[] = [
  {
    id: 'denim-indigo',
    name: 'Indigo Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(230, 60%, 28%, 0.5) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(230, 55%, 32%, 0.35) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(230, 58%, 30%) 0%, hsl(232, 62%, 26%) 50%, hsl(230, 56%, 29%) 100%)`,
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
    id: 'denim-vintage',
    name: 'Washed Vintage Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(208, 25%, 58%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(208, 20%, 62%, 0.2) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(208, 28%, 62%) 0%, hsl(210, 22%, 58%) 30%, hsl(206, 25%, 65%) 60%, hsl(208, 24%, 60%) 100%)`,
  },
  {
    id: 'denim-black',
    name: 'Black Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(225, 15%, 18%, 0.5) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(225, 12%, 22%, 0.3) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(225, 15%, 18%) 0%, hsl(227, 18%, 14%) 50%, hsl(225, 14%, 17%) 100%)`,
  },
  {
    id: 'denim-raw',
    name: 'Raw Denim',
    category: 'Denim',
    cssBackground: `repeating-linear-gradient(135deg, hsla(220, 55%, 22%, 0.5) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(135deg, hsla(220, 50%, 26%, 0.35) 1px, transparent 2px, transparent 5px),
      linear-gradient(180deg, hsl(220, 55%, 24%) 0%, hsl(222, 58%, 20%) 50%, hsl(220, 53%, 23%) 100%)`,
  },
];
