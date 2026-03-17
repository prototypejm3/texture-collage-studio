import { TextureSwatch } from '@/types/studio';

export const tweedTextures: TextureSwatch[] = [
  {
    id: 'tweed-classic',
    name: 'Classic Tweed',
    category: 'Tweed',
    cssBackground: `repeating-linear-gradient(0deg, hsla(30, 15%, 40%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(90deg, hsla(25, 20%, 35%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(45deg, hsla(35, 25%, 55%, 0.15) 0px, transparent 1px, transparent 4px),
      linear-gradient(135deg, hsl(30, 18%, 45%) 0%, hsl(28, 15%, 42%) 33%, hsl(32, 20%, 48%) 66%, hsl(30, 17%, 44%) 100%)`,
  },
  {
    id: 'tweed-charcoal',
    name: 'Charcoal Tweed',
    category: 'Tweed',
    cssBackground: `repeating-linear-gradient(0deg, hsla(0, 0%, 28%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(90deg, hsla(0, 0%, 24%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(45deg, hsla(0, 0%, 40%, 0.15) 0px, transparent 1px, transparent 4px),
      linear-gradient(135deg, hsl(0, 0%, 30%) 0%, hsl(0, 0%, 26%) 33%, hsl(0, 0%, 34%) 66%, hsl(0, 0%, 29%) 100%)`,
  },
  {
    id: 'tweed-heather',
    name: 'Heather Tweed',
    category: 'Tweed',
    cssBackground: `repeating-linear-gradient(0deg, hsla(280, 12%, 48%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(90deg, hsla(270, 15%, 42%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(45deg, hsla(285, 18%, 55%, 0.15) 0px, transparent 1px, transparent 4px),
      linear-gradient(135deg, hsl(278, 14%, 48%) 0%, hsl(272, 12%, 44%) 33%, hsl(282, 16%, 52%) 66%, hsl(278, 13%, 47%) 100%)`,
  },
  {
    id: 'tweed-moss',
    name: 'Moss Tweed',
    category: 'Tweed',
    cssBackground: `repeating-linear-gradient(0deg, hsla(85, 20%, 38%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(90deg, hsla(80, 22%, 34%, 0.3) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(45deg, hsla(90, 25%, 48%, 0.15) 0px, transparent 1px, transparent 4px),
      linear-gradient(135deg, hsl(85, 22%, 40%) 0%, hsl(80, 18%, 36%) 33%, hsl(90, 24%, 44%) 66%, hsl(85, 20%, 39%) 100%)`,
  },
];
