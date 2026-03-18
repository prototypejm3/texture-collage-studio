import { TextureSwatch } from '@/types/studio';

const img = (path: string) => `url(/textures/${path})`;

export const textures: TextureSwatch[] = [
  // ── Leather ──
  { id: 'leather-bourbon', name: 'Bourbon', category: 'Leather', cssBackground: img('leather-bourbon.png') },
  { id: 'leather-espresso', name: 'Espresso', category: 'Leather', cssBackground: img('leather-espresso.png') },
  { id: 'leather-chai', name: 'Chai', category: 'Leather', cssBackground: img('leather-chai.png') },
  { id: 'leather-cognac', name: 'Cognac', category: 'Leather', cssBackground: img('leather-cognac.png') },
  { id: 'leather-mocha', name: 'Mocha', category: 'Leather', cssBackground: img('leather-mocha.png') },
  { id: 'leather-rye', name: 'Rye', category: 'Leather', cssBackground: img('leather-rye.png') },

  // ── Wood ──
  { id: 'wood-oak', name: 'Oak', category: 'Wood', cssBackground: img('wood-oak.png') },
  { id: 'wood-walnut', name: 'Walnut', category: 'Wood', cssBackground: img('wood-walnut.png') },
  { id: 'wood-birch', name: 'Birch', category: 'Wood', cssBackground: img('wood-birch.png') },

  // ── Concrete ──
  { id: 'concrete-raw', name: 'Raw', category: 'Concrete', cssBackground: img('concrete-raw.png') },
  { id: 'concrete-polished', name: 'Polished', category: 'Concrete', cssBackground: img('concrete-polished.png') },
  { id: 'concrete-weathered', name: 'Weathered', category: 'Concrete', cssBackground: img('concrete-weathered.png') },

  // ── Stripe ──
  { id: 'stripe-ink', name: 'Ink Stripe', category: 'Stripe', cssBackground: img('stripe-ink.png') },
  { id: 'stripe-pinstripe', name: 'Pinstripe', category: 'Stripe', cssBackground: img('stripe-pinstripe.png') },
  { id: 'stripe-woven', name: 'Woven Stripe', category: 'Stripe', cssBackground: img('stripe-woven.png') },

  // ── Grid ──
  { id: 'grid-checker-blue', name: 'Blue Check', category: 'Grid', cssBackground: img('grid-checker-blue.png') },
  { id: 'grid-cream', name: 'Cream Grid', category: 'Grid', cssBackground: img('grid-cream.png') },
  { id: 'grid-crosshatch', name: 'Crosshatch', category: 'Grid', cssBackground: img('grid-crosshatch.png') },
  { id: 'grid-windowpane', name: 'Windowpane', category: 'Grid', cssBackground: img('grid-windowpane.png') },

  // ── Animal ──
  { id: 'animal-cheetah', name: 'Cheetah', category: 'Animal', cssBackground: img('cheetah-print.png') },
  { id: 'animal-cheetah-white', name: 'White Cheetah', category: 'Animal', cssBackground: img('cheetah-white.png') },
  { id: 'animal-cow', name: 'Cow Print', category: 'Animal', cssBackground: img('cow-print.png') },
  { id: 'animal-zebra', name: 'Zebra', category: 'Animal', cssBackground: img('zebra-print.png') },

  // ── Ripple ──
  { id: 'ripple-cream', name: 'Cream', category: 'Ripple', cssBackground: img('ripple-cream.png') },
  { id: 'ripple-ink', name: 'Ink', category: 'Ripple', cssBackground: img('ripple-ink.png') },
  { id: 'ripple-kraft', name: 'Kraft', category: 'Ripple', cssBackground: img('ripple-kraft.png') },
  { id: 'ripple-lattice', name: 'Lattice', category: 'Ripple', cssBackground: img('ripple-lattice.png') },
  { id: 'ripple-parchment', name: 'Parchment', category: 'Ripple', cssBackground: img('ripple-parchment.png') },

  // ── Speckle ──
  { id: 'speckle-blue', name: 'Blue', category: 'Speckle', cssBackground: img('speckle-blue.png') },
  { id: 'speckle-ink', name: 'Ink', category: 'Speckle', cssBackground: img('speckle-ink.png') },

  // ── Tie-dye ──
  { id: 'tiedye-blush', name: 'Blush', category: 'Tie-dye', cssBackground: img('tiedye-blush.png') },
  { id: 'tiedye-neutral', name: 'Neutral', category: 'Tie-dye', cssBackground: img('tiedye-neutral.png') },
  { id: 'tiedye-rainbow', name: 'Rainbow', category: 'Tie-dye', cssBackground: img('tiedye-rainbow.png') },

  // ── Maze ──
  { id: 'maze', name: 'Maze', category: 'Maze', cssBackground: img('maze.png') },

  // ── Novelty ──
  { id: 'novelty-alix-rose', name: 'Alix Rose', category: 'Novelty', cssBackground: img('novelty-alix-rose.png') },
  { id: 'novelty-alix-blush', name: 'Alix Blush', category: 'Novelty', cssBackground: img('novelty-alix-blush.png') },
  { id: 'novelty-alix-fuchsia', name: 'Alix Fuchsia', category: 'Novelty', cssBackground: img('novelty-alix-fuchsia.png') },
  { id: 'novelty-corinne-mulberry', name: 'Corinne Mulberry', category: 'Novelty', cssBackground: img('novelty-corinne-mulberry.png') },
  { id: 'novelty-corinne-plum', name: 'Corinne Plum', category: 'Novelty', cssBackground: img('novelty-corinne-plum.png') },
  { id: 'novelty-corinne-lavender', name: 'Corinne Lavender', category: 'Novelty', cssBackground: img('novelty-corinne-lavender.png') },
  { id: 'novelty-shayshari-terra', name: 'ShayShari Terra', category: 'Novelty', cssBackground: img('novelty-shayshari-terra.png') },
  { id: 'novelty-shayshari-sage', name: 'ShayShari Sage', category: 'Novelty', cssBackground: img('novelty-shayshari-sage.png') },
  { id: 'novelty-shayshari-sand', name: 'ShayShari Sand', category: 'Novelty', cssBackground: img('novelty-shayshari-sand.png') },
  { id: 'novelty-suede-navy', name: 'Suede Ace Navy', category: 'Novelty', cssBackground: img('novelty-suede-navy.png') },
  { id: 'novelty-suede-forest', name: 'Suede Ace Forest', category: 'Novelty', cssBackground: img('novelty-suede-forest.png') },
  { id: 'novelty-suede-oxblood', name: 'Suede Ace Oxblood', category: 'Novelty', cssBackground: img('novelty-suede-oxblood.png') },
  { id: 'novelty-riviera', name: 'Riviera', category: 'Novelty', cssBackground: img('novelty-riviera.png') },
  { id: 'novelty-jayme-gogh', name: 'Jayme Gogh', category: 'Novelty', cssBackground: img('novelty-jayme-gogh.png') },
  { id: 'novelty-skott-camo', name: 'Skott Camo', category: 'Novelty', cssBackground: img('novelty-skott-camo.png') },
  { id: 'novelty-apples', name: 'Apples', category: 'Novelty', cssBackground: img('novelty-apples.png') },
  { id: 'novelty-bananas', name: 'Bananas', category: 'Novelty', cssBackground: img('novelty-bananas.png') },
];
