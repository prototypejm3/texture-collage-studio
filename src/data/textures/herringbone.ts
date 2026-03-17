import { TextureSwatch } from '@/types/studio';

export const herringboneTextures: TextureSwatch[] = [
  {
    id: 'herringbone-charcoal',
    name: 'Charcoal Herringbone',
    category: 'Herringbone',
    cssBackground: `repeating-linear-gradient(135deg, hsla(0, 0%, 25%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(0, 0%, 30%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(135deg, hsla(0, 0%, 35%, 0.2) 3px, transparent 4px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(0, 0%, 35%, 0.2) 3px, transparent 4px, transparent 6px),
      linear-gradient(180deg, hsl(0, 0%, 32%) 0%, hsl(0, 0%, 28%) 100%)`,
  },
  {
    id: 'herringbone-camel',
    name: 'Camel Herringbone',
    category: 'Herringbone',
    cssBackground: `repeating-linear-gradient(135deg, hsla(30, 35%, 42%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(28, 30%, 48%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(135deg, hsla(32, 38%, 52%, 0.2) 3px, transparent 4px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(32, 38%, 52%, 0.2) 3px, transparent 4px, transparent 6px),
      linear-gradient(180deg, hsl(30, 34%, 50%) 0%, hsl(28, 30%, 46%) 100%)`,
  },
  {
    id: 'herringbone-navy',
    name: 'Navy Herringbone',
    category: 'Herringbone',
    cssBackground: `repeating-linear-gradient(135deg, hsla(220, 50%, 20%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(218, 45%, 25%, 0.5) 0px, transparent 2px, transparent 6px),
      repeating-linear-gradient(135deg, hsla(222, 48%, 30%, 0.2) 3px, transparent 4px, transparent 6px),
      repeating-linear-gradient(45deg, hsla(222, 48%, 30%, 0.2) 3px, transparent 4px, transparent 6px),
      linear-gradient(180deg, hsl(220, 48%, 24%) 0%, hsl(218, 44%, 20%) 100%)`,
  },
];
