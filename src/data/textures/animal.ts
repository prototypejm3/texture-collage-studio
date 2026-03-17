import { TextureSwatch } from '@/types/studio';

export const animalTextures: TextureSwatch[] = [
  {
    id: 'animal-cow',
    name: 'Cow Print',
    category: 'Animal',
    cssBackground: `url(/textures/cow-print.png)`,
  },
  {
    id: 'animal-zebra',
    name: 'Zebra Print',
    category: 'Animal',
    cssBackground: `repeating-linear-gradient(80deg, hsl(0, 0%, 8%) 0px, hsl(0, 0%, 8%) 3px, hsl(0, 0%, 96%) 3px, hsl(0, 0%, 96%) 7px, hsl(0, 0%, 8%) 7px, hsl(0, 0%, 8%) 9px, hsl(0, 0%, 96%) 9px, hsl(0, 0%, 96%) 14px),
      repeating-linear-gradient(100deg, hsla(0, 0%, 10%, 0.15) 0px, transparent 2px, transparent 8px)`,
  },
  {
    id: 'animal-cheetah',
    name: 'Cheetah Print',
    category: 'Animal',
    cssBackground: `radial-gradient(ellipse 4px 5px at 20% 25%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 5px 4px at 45% 15%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 4px 5px at 70% 30%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 5px 4px at 30% 55%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 4px 5px at 60% 50%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 5px 4px at 85% 60%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 4px 5px at 15% 80%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 5px 4px at 50% 75%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      radial-gradient(ellipse 4px 5px at 80% 85%, hsl(20, 40%, 15%) 0%, hsl(20, 40%, 15%) 60%, transparent 62%) no-repeat,
      linear-gradient(135deg, hsl(38, 55%, 62%) 0%, hsl(35, 50%, 58%) 50%, hsl(40, 52%, 60%) 100%)`,
  },
  {
    id: 'animal-horse',
    name: 'Horse Fur',
    category: 'Animal',
    cssBackground: `repeating-linear-gradient(170deg, hsla(22, 30%, 28%, 0.15) 0px, transparent 1px, transparent 2px),
      repeating-linear-gradient(175deg, hsla(20, 25%, 32%, 0.12) 0px, transparent 1px, transparent 3px),
      linear-gradient(180deg, hsl(22, 32%, 32%) 0%, hsl(20, 28%, 28%) 30%, hsl(24, 30%, 30%) 60%, hsl(22, 30%, 31%) 100%)`,
  },
];
