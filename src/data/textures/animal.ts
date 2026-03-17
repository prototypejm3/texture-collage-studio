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
    cssBackground: `url(/textures/cheetah-print.png)`,
  },
  {
    id: 'animal-cheetah-white',
    name: 'White Cheetah',
    category: 'Animal',
    cssBackground: `url(/textures/cheetah-white.png)`,
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
