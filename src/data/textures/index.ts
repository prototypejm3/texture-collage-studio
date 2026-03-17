import { TextureSwatch } from '@/types/studio';
import { boucleTextures } from './boucle';
import { linenTextures } from './linen';
import { velvetTextures } from './velvet';
import { leatherTextures } from './leather';
import { suedeTextures } from './suede';
import { marbleTextures } from './marble';
import { woodTextures } from './wood';
import { terrazzoTextures } from './terrazzo';
import { abstractTextures } from './abstract';

export const textures: TextureSwatch[] = [
  ...boucleTextures,
  ...linenTextures,
  ...velvetTextures,
  ...leatherTextures,
  ...suedeTextures,
  ...marbleTextures,
  ...woodTextures,
  ...terrazzoTextures,
  ...abstractTextures,
];
