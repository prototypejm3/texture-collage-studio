import { TextureSwatch } from '@/types/studio';

export const plaidTextures: TextureSwatch[] = [
  {
    id: 'plaid-buffalo',
    name: 'Buffalo Check',
    category: 'Plaid',
    cssBackground: `repeating-linear-gradient(0deg, hsla(0, 60%, 30%, 0.5) 0px, transparent 8px, transparent 16px),
      repeating-linear-gradient(90deg, hsla(0, 60%, 30%, 0.5) 0px, transparent 8px, transparent 16px),
      linear-gradient(180deg, hsl(0, 0%, 12%) 0%, hsl(0, 0%, 10%) 100%)`,
  },
  {
    id: 'plaid-gingham',
    name: 'Blue Gingham',
    category: 'Plaid',
    cssBackground: `repeating-linear-gradient(0deg, hsla(210, 50%, 50%, 0.35) 0px, transparent 6px, transparent 12px),
      repeating-linear-gradient(90deg, hsla(210, 50%, 50%, 0.35) 0px, transparent 6px, transparent 12px),
      linear-gradient(180deg, hsl(0, 0%, 96%) 0%, hsl(0, 0%, 94%) 100%)`,
  },
  {
    id: 'plaid-tartan',
    name: 'Forest Tartan',
    category: 'Plaid',
    cssBackground: `repeating-linear-gradient(0deg, hsla(145, 40%, 25%, 0.5) 0px, transparent 10px, transparent 20px),
      repeating-linear-gradient(90deg, hsla(0, 50%, 30%, 0.4) 0px, transparent 10px, transparent 20px),
      repeating-linear-gradient(0deg, hsla(45, 60%, 55%, 0.15) 0px, transparent 2px, transparent 20px),
      repeating-linear-gradient(90deg, hsla(45, 60%, 55%, 0.15) 0px, transparent 2px, transparent 20px),
      linear-gradient(180deg, hsl(145, 35%, 28%) 0%, hsl(145, 30%, 24%) 100%)`,
  },
  {
    id: 'plaid-windowpane',
    name: 'Windowpane',
    category: 'Plaid',
    cssBackground: `repeating-linear-gradient(0deg, transparent 0px, transparent 18px, hsla(0, 0%, 35%, 0.3) 18px, hsla(0, 0%, 35%, 0.3) 19px),
      repeating-linear-gradient(90deg, transparent 0px, transparent 18px, hsla(0, 0%, 35%, 0.3) 18px, hsla(0, 0%, 35%, 0.3) 19px),
      linear-gradient(180deg, hsl(0, 0%, 92%) 0%, hsl(0, 0%, 90%) 100%)`,
  },
];
