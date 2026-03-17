import { TextureSwatch } from '@/types/studio';

export const marbleTextures: TextureSwatch[] = [
  {
    id: 'marble-carrara',
    name: 'Carrara Marble',
    category: 'Marble',
    cssBackground: `repeating-linear-gradient(125deg, transparent, transparent 15px, hsla(220, 5%, 82%, 0.3) 15px, hsla(220, 5%, 82%, 0.3) 16px, transparent 16px, transparent 30px),
      repeating-linear-gradient(140deg, transparent, transparent 25px, hsla(0, 0%, 85%, 0.2) 25px, hsla(0, 0%, 85%, 0.2) 26px, transparent 26px, transparent 50px),
      linear-gradient(135deg, hsl(0, 0%, 95%) 0%, hsl(0, 0%, 92%) 20%, hsl(0, 0%, 96%) 40%, hsl(220, 5%, 88%) 60%, hsl(0, 0%, 94%) 80%, hsl(0, 0%, 96%) 100%)`,
  },
  {
    id: 'marble-nero',
    name: 'Nero Marble',
    category: 'Marble',
    cssBackground: `repeating-linear-gradient(130deg, transparent, transparent 20px, hsla(40, 15%, 25%, 0.2) 20px, hsla(40, 15%, 25%, 0.2) 21px, transparent 21px, transparent 40px),
      repeating-linear-gradient(145deg, transparent, transparent 30px, hsla(0, 0%, 22%, 0.15) 30px, hsla(0, 0%, 22%, 0.15) 31px, transparent 31px, transparent 55px),
      linear-gradient(135deg, hsl(0, 0%, 12%) 0%, hsl(0, 0%, 18%) 25%, hsl(40, 10%, 15%) 50%, hsl(0, 0%, 10%) 75%, hsl(0, 0%, 14%) 100%)`,
  },
  {
    id: 'marble-verde',
    name: 'Verde Marble',
    category: 'Marble',
    cssBackground: `repeating-linear-gradient(120deg, transparent, transparent 18px, hsla(150, 15%, 40%, 0.2) 18px, hsla(150, 15%, 40%, 0.2) 19px, transparent 19px, transparent 35px),
      repeating-linear-gradient(150deg, transparent, transparent 28px, hsla(148, 12%, 38%, 0.15) 28px, hsla(148, 12%, 38%, 0.15) 29px, transparent 29px, transparent 52px),
      linear-gradient(135deg, hsl(150, 20%, 30%) 0%, hsl(148, 18%, 36%) 25%, hsl(152, 22%, 28%) 50%, hsl(150, 15%, 34%) 75%, hsl(148, 20%, 32%) 100%)`,
  },
  {
    id: 'marble-calacatta',
    name: 'Calacatta Marble',
    category: 'Marble',
    cssBackground: `repeating-linear-gradient(128deg, transparent, transparent 20px, hsla(38, 25%, 72%, 0.25) 20px, hsla(38, 25%, 72%, 0.25) 21px, transparent 21px, transparent 40px),
      repeating-linear-gradient(142deg, transparent, transparent 35px, hsla(35, 20%, 75%, 0.15) 35px, hsla(35, 20%, 75%, 0.15) 36px, transparent 36px, transparent 60px),
      linear-gradient(135deg, hsl(40, 15%, 95%) 0%, hsl(38, 12%, 92%) 30%, hsl(42, 18%, 94%) 60%, hsl(40, 14%, 93%) 100%)`,
  },
  {
    id: 'marble-rose',
    name: 'Rose Marble',
    category: 'Marble',
    cssBackground: `repeating-linear-gradient(125deg, transparent, transparent 22px, hsla(340, 15%, 70%, 0.2) 22px, hsla(340, 15%, 70%, 0.2) 23px, transparent 23px, transparent 42px),
      repeating-linear-gradient(138deg, transparent, transparent 30px, hsla(345, 12%, 72%, 0.15) 30px, hsla(345, 12%, 72%, 0.15) 31px, transparent 31px, transparent 55px),
      linear-gradient(135deg, hsl(345, 15%, 82%) 0%, hsl(340, 12%, 78%) 30%, hsl(348, 18%, 84%) 60%, hsl(342, 14%, 80%) 100%)`,
  },
];
