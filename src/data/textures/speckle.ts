import { TextureSwatch } from '@/types/studio';

export const speckleTextures: TextureSwatch[] = [
  {
    id: 'speckle-cream',
    name: 'Cream Speckle',
    category: 'Speckle',
    cssBackground: `radial-gradient(circle 1px, hsla(30, 25%, 40%, 0.3) 0%, transparent 100%) 0 0 / 8px 8px,
      radial-gradient(circle 1px, hsla(25, 20%, 35%, 0.2) 0%, transparent 100%) 4px 4px / 10px 10px,
      radial-gradient(circle 0.5px, hsla(35, 30%, 45%, 0.25) 0%, transparent 100%) 2px 6px / 12px 12px,
      linear-gradient(180deg, hsl(38, 25%, 88%) 0%, hsl(36, 22%, 85%) 100%)`,
  },
  {
    id: 'speckle-charcoal',
    name: 'Charcoal Speckle',
    category: 'Speckle',
    cssBackground: `radial-gradient(circle 1px, hsla(0, 0%, 55%, 0.3) 0%, transparent 100%) 0 0 / 8px 8px,
      radial-gradient(circle 1px, hsla(0, 0%, 50%, 0.2) 0%, transparent 100%) 4px 4px / 10px 10px,
      radial-gradient(circle 0.5px, hsla(0, 0%, 60%, 0.25) 0%, transparent 100%) 2px 6px / 12px 12px,
      linear-gradient(180deg, hsl(0, 0%, 28%) 0%, hsl(0, 0%, 24%) 100%)`,
  },
  {
    id: 'speckle-sage',
    name: 'Sage Speckle',
    category: 'Speckle',
    cssBackground: `radial-gradient(circle 1px, hsla(125, 15%, 35%, 0.3) 0%, transparent 100%) 0 0 / 8px 8px,
      radial-gradient(circle 1px, hsla(120, 12%, 30%, 0.2) 0%, transparent 100%) 4px 4px / 10px 10px,
      radial-gradient(circle 0.5px, hsla(130, 18%, 40%, 0.25) 0%, transparent 100%) 2px 6px / 12px 12px,
      linear-gradient(180deg, hsl(128, 15%, 72%) 0%, hsl(126, 12%, 68%) 100%)`,
  },
];
