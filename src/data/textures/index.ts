import { TextureSwatch } from '@/types/studio';

const img = (path: string) => `url(/textures/${path})`;

export const textures: TextureSwatch[] = [
  // ── Royale (Velvet) ──
  { id: 'royale-blush', name: 'Blush', category: 'Royale', cssBackground: img('royale-blush.png') },
  { id: 'royale-gunmetal', name: 'Gunmetal', category: 'Royale', cssBackground: img('royale-gunmetal.png') },
  { id: 'royale-evergreen', name: 'Evergreen', category: 'Royale', cssBackground: img('royale-evergreen.png') },
  { id: 'royale-apple', name: 'Apple', category: 'Royale', cssBackground: img('royale-apple.png') },
  { id: 'royale-hacienda', name: 'Hacienda', category: 'Royale', cssBackground: img('royale-hacienda.png') },
  { id: 'royale-peacock', name: 'Peacock', category: 'Royale', cssBackground: img('royale-peacock.png') },
  { id: 'royale-cobalt', name: 'Cobalt', category: 'Royale', cssBackground: img('royale-cobalt.png') },
  { id: 'royale-ash', name: 'Ash', category: 'Royale', cssBackground: img('royale-ash.png') },
  { id: 'royale-forest', name: 'Forest', category: 'Royale', cssBackground: img('royale-forest.png') },
  { id: 'royale-berry', name: 'Berry', category: 'Royale', cssBackground: img('royale-berry.png') },

  // ── Banks (Smooth Velvet) ──
  { id: 'banks-nutmeg', name: 'Nutmeg', category: 'Banks', cssBackground: img('banks-nutmeg.png') },
  { id: 'banks-currant', name: 'Currant', category: 'Banks', cssBackground: img('banks-currant.png') },
  { id: 'banks-oatmeal', name: 'Oatmeal', category: 'Banks', cssBackground: img('banks-oatmeal.png') },
  { id: 'banks-zinnia', name: 'Zinnia', category: 'Banks', cssBackground: img('banks-zinnia.png') },

  // ── Bentley (Striated Chenille) ──
  { id: 'bentley-daisey', name: 'Daisey', category: 'Bentley', cssBackground: img('bentley-daisey.png') },
  { id: 'bentley-indigo', name: 'Indigo', category: 'Bentley', cssBackground: img('bentley-indigo.png') },
  { id: 'bentley-pewter', name: 'Pewter', category: 'Bentley', cssBackground: img('bentley-pewter.png') },

  // ── Cody (Tweed Weave) ──
  { id: 'cody-slate', name: 'Slate', category: 'Cody', cssBackground: img('cody-slate.png') },
  { id: 'cody-sandstone', name: 'Sandstone', category: 'Cody', cssBackground: img('cody-sandstone.png') },
  { id: 'cody-pacific', name: 'Pacific', category: 'Cody', cssBackground: img('cody-pacific.png') },

  // ── Sunbrella (Performance) ──
  { id: 'sunbrella-fog', name: 'Fog', category: 'Sunbrella', cssBackground: img('sunbrella-fog.png') },
  { id: 'sunbrella-sea', name: 'Sea', category: 'Sunbrella', cssBackground: img('sunbrella-sea.png') },
  { id: 'sunbrella-wisteria', name: 'Wisteria', category: 'Sunbrella', cssBackground: img('sunbrella-wisteria.png') },
  { id: 'sunbrella-lagoon', name: 'Lagoon', category: 'Sunbrella', cssBackground: img('sunbrella-lagoon.png') },
  { id: 'sunbrella-white', name: 'White', category: 'Sunbrella', cssBackground: img('sunbrella-white.png') },

  // ── Bubbly (Textured Weave) ──
  { id: 'bubbly-cucumber', name: 'Cucumber', category: 'Bubbly', cssBackground: img('bubbly-cucumber.png') },
  { id: 'bubbly-moscow-mule', name: 'Moscow Mule', category: 'Bubbly', cssBackground: img('bubbly-moscow-mule.png') },
  { id: 'bubbly-cream-soda', name: 'Cream Soda', category: 'Bubbly', cssBackground: img('bubbly-cream-soda.png') },

  // ── Karina (Bouclé) ──
  { id: 'karina-cloud', name: 'Cloud', category: 'Karina', cssBackground: img('karina-cloud.png') },
  { id: 'karina-teal', name: 'Teal', category: 'Karina', cssBackground: img('karina-teal.png') },

  // ── Crave (Ribbed Chenille) ──
  { id: 'crave-rose', name: 'Rose', category: 'Crave', cssBackground: img('crave-rose.png') },
  { id: 'crave-mocha', name: 'Mocha', category: 'Crave', cssBackground: img('crave-mocha.png') },

  // ── Caspiar (Silk) ──
  { id: 'caspiar-chiffon', name: 'Chiffon', category: 'Caspiar', cssBackground: img('caspiar-chiffon.png') },
  { id: 'caspiar-ivory', name: 'Ivory', category: 'Caspiar', cssBackground: img('caspiar-ivory.png') },

  // ── Checker ──
  { id: 'checker-mocha', name: 'Mocha', category: 'Checker', cssBackground: img('checker-mocha.png') },
  { id: 'checker-tapestry', name: 'Tapestry', category: 'Checker', cssBackground: img('checker-tapestry.png') },

  // ── Soul ──
  { id: 'soul-cloud', name: 'Cloud', category: 'Soul', cssBackground: img('soul-cloud.png') },

  // ── Nepal ──
  { id: 'nepal-teal', name: 'Teal', category: 'Nepal', cssBackground: img('nepal-teal.png') },

  // ── Sorrento ──
  { id: 'sorrento-teal', name: 'Teal', category: 'Sorrento', cssBackground: img('sorrento-teal.png') },

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
