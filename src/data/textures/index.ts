import { TextureSwatch } from '@/types/studio';
import { boucleTextures } from './boucle';
import { linenTextures } from './linen';
import { velvetTextures } from './velvet';
import { leatherTextures } from './leather';
import { suedeTextures } from './suede';
import { silkTextures } from './silk';
import { denimTextures } from './denim';
import { corduroyTextures } from './corduroy';
import { tweedTextures } from './tweed';
import { feltTextures } from './felt';
import { yarnTextures } from './yarn';
import { marbleTextures } from './marble';
import { woodTextures } from './wood';
import { terrazzoTextures } from './terrazzo';
import { concreteTextures } from './concrete';
import { sandTextures } from './sand';
import { stoneTextures } from './stone';
import { corkTextures } from './cork';
import { abstractTextures } from './abstract';
import { stripeTextures } from './stripe';
import { plaidTextures } from './plaid';
import { gridTextures } from './grid';
import { speckleTextures } from './speckle';
import { herringboneTextures } from './herringbone';
import { animalTextures } from './animal';
import { noveltyTextures } from './novelty';

export const textures: TextureSwatch[] = [
  // Fabrics
  ...boucleTextures,
  ...linenTextures,
  ...velvetTextures,
  ...leatherTextures,
  ...suedeTextures,
  ...silkTextures,
  ...denimTextures,
  ...corduroyTextures,
  ...tweedTextures,
  ...feltTextures,
  ...yarnTextures,
  // Surfaces
  ...marbleTextures,
  ...woodTextures,
  ...terrazzoTextures,
  ...concreteTextures,
  ...sandTextures,
  ...stoneTextures,
  ...corkTextures,
  // Patterns
  ...abstractTextures,
  ...stripeTextures,
  ...plaidTextures,
  ...gridTextures,
  ...speckleTextures,
  ...herringboneTextures,
  // Animal & Fun
  ...animalTextures,
  ...noveltyTextures,
];
