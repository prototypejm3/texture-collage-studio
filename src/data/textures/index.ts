import { TextureSwatch } from '@/types/studio';

const img = (path: string) => `url(/textures/${path})`;

export const textures: TextureSwatch[] = [
  // ── Ocean ──
  { id: 'ocean-reef', name: 'Ocean Reef', category: 'Ocean', cssBackground: img('ocean-reef.png') },
  { id: 'ocean-deep', name: 'Ocean Deep', category: 'Ocean', cssBackground: img('ocean-deep.png') },
  { id: 'ocean-foam', name: 'Ocean Foam', category: 'Ocean', cssBackground: img('ocean-foam.png') },
  { id: 'ocean-tide', name: 'Ocean Tide', category: 'Ocean', cssBackground: img('ocean-tide.png') },

  // ── Sky ──
  { id: 'sky-dawn', name: 'Sky Dawn', category: 'Sky', cssBackground: img('sky-dawn.png') },
  { id: 'sky-cloud', name: 'Sky Cloud', category: 'Sky', cssBackground: img('sky-cloud.png') },
  { id: 'sky-dusk', name: 'Sky Dusk', category: 'Sky', cssBackground: img('sky-dusk.png') },
  { id: 'sky-azure', name: 'Sky Azure', category: 'Sky', cssBackground: img('sky-azure.png') },

  // ── Space ──
  { id: 'space-nebula', name: 'Space Nebula', category: 'Space', cssBackground: img('space-nebula.png') },
  { id: 'space-stardust', name: 'Space Stardust', category: 'Space', cssBackground: img('space-stardust.png') },
  { id: 'space-eclipse', name: 'Space Eclipse', category: 'Space', cssBackground: img('space-eclipse.png') },
  { id: 'space-cosmos', name: 'Space Cosmos', category: 'Space', cssBackground: img('space-cosmos.png') },

  // ── Alix ──
  { id: 'alix-slate', name: 'Alix Slate', category: 'Alix', cssBackground: img('alix-slate.png') },
  { id: 'alix-sand', name: 'Alix Sand', category: 'Alix', cssBackground: img('alix-sand.png') },
  { id: 'alix-oat', name: 'Alix Oat', category: 'Alix', cssBackground: img('alix-oat.png') },

  // ── Corinne ──
  { id: 'corinne-rose', name: 'Corinne Rose', category: 'Corinne', cssBackground: img('corinne-rose.png') },
  { id: 'corinne-mocha', name: 'Corinne Mocha', category: 'Corinne', cssBackground: img('corinne-mocha.png') },
  { id: 'corinne-sage', name: 'Corinne Sage', category: 'Corinne', cssBackground: img('corinne-sage.png') },
  { id: 'corinne-pearl', name: 'Corinne Pearl', category: 'Corinne', cssBackground: img('corinne-pearl.png') },

  // ── Shayshari ──
  { id: 'shayshari-peacock', name: 'Shayshari Peacock', category: 'Shayshari', cssBackground: img('shayshari-peacock.png') },
  { id: 'shayshari-cobalt', name: 'Shayshari Cobalt', category: 'Shayshari', cssBackground: img('shayshari-cobalt.png') },
  { id: 'shayshari-berry', name: 'Shayshari Berry', category: 'Shayshari', cssBackground: img('shayshari-berry.png') },
  { id: 'shayshari-gold', name: 'Shayshari Gold', category: 'Shayshari', cssBackground: img('shayshari-gold.png') },

  // ── Jayme ──
  { id: 'jayme-rust', name: 'Jayme Rust', category: 'Jayme', cssBackground: img('jayme-rust.png') },
  { id: 'jayme-olive', name: 'Jayme Olive', category: 'Jayme', cssBackground: img('jayme-olive.png') },
  { id: 'jayme-cream', name: 'Jayme Cream', category: 'Jayme', cssBackground: img('jayme-cream.png') },
  { id: 'jayme-nutmeg', name: 'Jayme Nutmeg', category: 'Jayme', cssBackground: img('jayme-nutmeg.png') },

  // ── Marble ──
  { id: 'marble-carrara', name: 'Marble Carrara', category: 'Marble', cssBackground: img('marble-carrara.png') },
  { id: 'marble-nero', name: 'Marble Nero', category: 'Marble', cssBackground: img('marble-nero.png') },
  { id: 'marble-verde', name: 'Marble Verde', category: 'Marble', cssBackground: img('marble-verde.png') },
  { id: 'marble-rosa', name: 'Marble Rosa', category: 'Marble', cssBackground: img('marble-rosa.png') },

  // ── Nuts ──
  { id: 'nuts-walnut', name: 'Nuts Walnut', category: 'Nuts', cssBackground: img('nuts-walnut.png') },
  { id: 'nuts-cashew', name: 'Nuts Cashew', category: 'Nuts', cssBackground: img('nuts-cashew.png') },
  { id: 'nuts-pecan', name: 'Nuts Pecan', category: 'Nuts', cssBackground: img('nuts-pecan.png') },
  { id: 'nuts-almond', name: 'Nuts Almond', category: 'Nuts', cssBackground: img('nuts-almond.png') },

  // ── Fruit ──
  { id: 'fruit-berry', name: 'Fruit Berry', category: 'Fruit', cssBackground: img('fruit-berry.png') },
  { id: 'fruit-citrus', name: 'Fruit Citrus', category: 'Fruit', cssBackground: img('fruit-citrus.png') },
  { id: 'fruit-apple', name: 'Fruit Apple', category: 'Fruit', cssBackground: img('fruit-apple.png') },
  { id: 'fruit-plum', name: 'Fruit Plum', category: 'Fruit', cssBackground: img('fruit-plum.png') },

  // ── Animal ──
  { id: 'animal-cheetah', name: 'Cheetah', category: 'Animal', cssBackground: img('cheetah-print.png') },
  { id: 'animal-cheetah-white', name: 'White Cheetah', category: 'Animal', cssBackground: img('cheetah-white.png') },
  { id: 'animal-cow', name: 'Cow Print', category: 'Animal', cssBackground: img('cow-print.png') },
  { id: 'animal-zebra', name: 'Zebra', category: 'Animal', cssBackground: img('zebra-print.png') },

  // ── Novelty ──
  { id: 'novelty-apples', name: 'Apples', category: 'Novelty', cssBackground: img('novelty-apples.png') },
  { id: 'novelty-bananas', name: 'Bananas', category: 'Novelty', cssBackground: img('novelty-bananas.png') },

  // ── Stripe ──
  { id: 'stripe-ink', name: 'Ink Stripe', category: 'Stripe', cssBackground: img('stripe-ink.png') },
  { id: 'stripe-pinstripe', name: 'Pinstripe', category: 'Stripe', cssBackground: img('stripe-pinstripe.png') },
  { id: 'stripe-woven', name: 'Woven Stripe', category: 'Stripe', cssBackground: img('stripe-woven.png') },

  // ── Grid ──
  { id: 'grid-checker-blue', name: 'Blue Check', category: 'Grid', cssBackground: img('grid-checker-blue.png') },
  { id: 'grid-cream', name: 'Cream Grid', category: 'Grid', cssBackground: img('grid-cream.png') },
  { id: 'grid-crosshatch', name: 'Crosshatch', category: 'Grid', cssBackground: img('grid-crosshatch.png') },
  { id: 'grid-windowpane', name: 'Windowpane', category: 'Grid', cssBackground: img('grid-windowpane.png') },

  // ── Wood ──
  { id: 'wood-oak', name: 'Oak', category: 'Wood', cssBackground: img('wood-oak.png') },
  { id: 'wood-walnut', name: 'Walnut', category: 'Wood', cssBackground: img('wood-walnut.png') },
  { id: 'wood-birch', name: 'Birch', category: 'Wood', cssBackground: img('wood-birch.png') },

  // ── Concrete ──
  { id: 'concrete-raw', name: 'Raw', category: 'Concrete', cssBackground: img('concrete-raw.png') },
  { id: 'concrete-polished', name: 'Polished', category: 'Concrete', cssBackground: img('concrete-polished.png') },
  { id: 'concrete-weathered', name: 'Weathered', category: 'Concrete', cssBackground: img('concrete-weathered.png') },

  // ── Leather ──
  { id: 'leather-bourbon', name: 'Bourbon', category: 'Leather', cssBackground: img('leather-bourbon.png') },
  { id: 'leather-espresso', name: 'Espresso', category: 'Leather', cssBackground: img('leather-espresso.png') },
  { id: 'leather-chai', name: 'Chai', category: 'Leather', cssBackground: img('leather-chai.png') },
  { id: 'leather-cognac', name: 'Cognac', category: 'Leather', cssBackground: img('leather-cognac.png') },
  { id: 'leather-mocha', name: 'Mocha', category: 'Leather', cssBackground: img('leather-mocha.png') },
  { id: 'leather-rye', name: 'Rye', category: 'Leather', cssBackground: img('leather-rye.png') },

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
];
