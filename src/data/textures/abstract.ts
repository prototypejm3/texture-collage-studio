import { TextureSwatch } from '@/types/studio';

export const abstractTextures: TextureSwatch[] = [
  {
    id: 'abstract-geo',
    name: 'Geometric',
    category: 'Abstract',
    cssBackground: `repeating-linear-gradient(45deg, hsl(24, 60%, 65%) 0px, hsl(24, 60%, 65%) 10px, hsl(40, 30%, 85%) 10px, hsl(40, 30%, 85%) 20px),
      repeating-linear-gradient(-45deg, hsl(200, 40%, 60%) 0px, hsl(200, 40%, 60%) 10px, transparent 10px, transparent 20px)`,
  },
  {
    id: 'abstract-wave',
    name: 'Wave Pattern',
    category: 'Abstract',
    cssBackground: `repeating-linear-gradient(135deg, hsl(180, 20%, 70%) 0px, hsl(180, 20%, 70%) 5px, hsl(200, 25%, 80%) 5px, hsl(200, 25%, 80%) 10px, hsl(220, 20%, 75%) 10px, hsl(220, 20%, 75%) 15px)`,
  },
  {
    id: 'abstract-dots',
    name: 'Polka Dots',
    category: 'Abstract',
    cssBackground: `radial-gradient(circle 4px at 10px 10px, hsl(24, 70%, 60%) 50%, transparent 50%),
      radial-gradient(circle 4px at 30px 30px, hsl(24, 70%, 60%) 50%, transparent 50%),
      linear-gradient(135deg, hsl(40, 20%, 92%) 0%, hsl(38, 18%, 88%) 100%)`,
  },
  {
    id: 'abstract-herringbone',
    name: 'Herringbone',
    category: 'Abstract',
    cssBackground: `repeating-linear-gradient(45deg, hsl(30, 25%, 65%) 0px, hsl(30, 25%, 65%) 5px, hsl(28, 20%, 72%) 5px, hsl(28, 20%, 72%) 10px),
      repeating-linear-gradient(-45deg, hsl(32, 22%, 68%) 0px, hsl(32, 22%, 68%) 5px, transparent 5px, transparent 10px)`,
  },
  {
    id: 'abstract-checker',
    name: 'Checkerboard',
    category: 'Abstract',
    cssBackground: `repeating-conic-gradient(hsl(0, 0%, 20%) 0% 25%, hsl(0, 0%, 88%) 0% 50%) 0 0 / 20px 20px`,
  },
  {
    id: 'abstract-stripe',
    name: 'Bold Stripe',
    category: 'Abstract',
    cssBackground: `repeating-linear-gradient(0deg, hsl(210, 35%, 30%) 0px, hsl(210, 35%, 30%) 8px, hsl(40, 30%, 85%) 8px, hsl(40, 30%, 85%) 16px, hsl(350, 40%, 55%) 16px, hsl(350, 40%, 55%) 24px, hsl(40, 30%, 85%) 24px, hsl(40, 30%, 85%) 32px)`,
  },
];
