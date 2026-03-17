import { TextureSwatch } from '@/types/studio';

export const noveltyTextures: TextureSwatch[] = [
  {
    id: 'novelty-recycled-plastic',
    name: 'Recycled Plastic',
    category: 'Novelty',
    cssBackground: `repeating-linear-gradient(15deg, hsla(180, 15%, 72%, 0.15) 0px, transparent 1px, transparent 4px),
      repeating-linear-gradient(105deg, hsla(175, 12%, 68%, 0.12) 0px, transparent 1px, transparent 5px),
      repeating-linear-gradient(60deg, hsla(185, 10%, 75%, 0.08) 0px, transparent 1px, transparent 6px),
      linear-gradient(135deg, hsl(178, 12%, 72%) 0%, hsl(180, 10%, 68%) 30%, hsl(176, 14%, 74%) 60%, hsl(178, 11%, 70%) 100%)`,
  },
  {
    id: 'novelty-foam',
    name: 'Foam',
    category: 'Novelty',
    cssBackground: `radial-gradient(circle 2px at 20% 30%, hsla(0, 0%, 70%, 0.15) 0%, transparent 100%),
      radial-gradient(circle 1.5px at 50% 60%, hsla(0, 0%, 68%, 0.12) 0%, transparent 100%),
      radial-gradient(circle 2px at 75% 40%, hsla(0, 0%, 72%, 0.13) 0%, transparent 100%),
      radial-gradient(circle 1px at 35% 80%, hsla(0, 0%, 65%, 0.1) 0%, transparent 100%),
      linear-gradient(180deg, hsl(0, 0%, 78%) 0%, hsl(0, 0%, 74%) 50%, hsl(0, 0%, 76%) 100%)`,
  },
  {
    id: 'novelty-scrambled-eggs',
    name: 'Scrambled Eggs',
    category: 'Novelty',
    cssBackground: `radial-gradient(ellipse 12px 10px at 30% 35%, hsl(48, 85%, 62%) 0%, hsl(48, 85%, 62%) 50%, transparent 52%) no-repeat,
      radial-gradient(ellipse 14px 11px at 65% 25%, hsl(50, 80%, 65%) 0%, hsl(50, 80%, 65%) 50%, transparent 52%) no-repeat,
      radial-gradient(ellipse 10px 12px at 50% 60%, hsl(46, 82%, 60%) 0%, hsl(46, 82%, 60%) 50%, transparent 52%) no-repeat,
      radial-gradient(ellipse 13px 9px at 20% 70%, hsl(48, 78%, 64%) 0%, hsl(48, 78%, 64%) 50%, transparent 52%) no-repeat,
      radial-gradient(ellipse 11px 13px at 75% 72%, hsl(50, 83%, 60%) 0%, hsl(50, 83%, 60%) 50%, transparent 52%) no-repeat,
      linear-gradient(180deg, hsl(45, 60%, 88%) 0%, hsl(43, 55%, 85%) 50%, hsl(47, 58%, 86%) 100%)`,
  },
  {
    id: 'novelty-noodles',
    name: 'Noodles',
    category: 'Novelty',
    cssBackground: `repeating-linear-gradient(25deg, hsla(42, 50%, 68%, 0.5) 0px, transparent 2px, transparent 4px),
      repeating-linear-gradient(155deg, hsla(40, 45%, 65%, 0.4) 0px, transparent 2px, transparent 5px),
      repeating-linear-gradient(80deg, hsla(44, 48%, 70%, 0.35) 0px, transparent 1px, transparent 3px),
      repeating-linear-gradient(110deg, hsla(38, 42%, 62%, 0.3) 0px, transparent 2px, transparent 6px),
      linear-gradient(180deg, hsl(42, 50%, 72%) 0%, hsl(40, 45%, 68%) 50%, hsl(44, 48%, 70%) 100%)`,
  },
];
