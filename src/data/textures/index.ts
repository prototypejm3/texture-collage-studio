import { TextureSwatch } from '@/types/studio';

const img = (path: string) => `url(/textures/${path})`;

export const textures: TextureSwatch[] = [
  // ── Royale (Velvet) ──
  { id: 'royale-blush', name: 'Rosé', category: 'Royale', cssBackground: img('royale-blush.png') },
  { id: 'royale-gunmetal', name: 'Smoky Martini', category: 'Royale', cssBackground: img('royale-gunmetal.png') },
  { id: 'royale-evergreen', name: 'Absinthe', category: 'Royale', cssBackground: img('royale-evergreen.png') },
  { id: 'royale-apple', name: 'Appletini', category: 'Royale', cssBackground: img('royale-apple.png') },
  { id: 'royale-hacienda', name: 'Sangria', category: 'Royale', cssBackground: img('royale-hacienda.png') },
  { id: 'royale-peacock', name: 'Blue Lagoon', category: 'Royale', cssBackground: img('royale-peacock.png') },
  { id: 'royale-cobalt', name: 'Blue Curaçao', category: 'Royale', cssBackground: img('royale-cobalt.png') },
  { id: 'royale-ash', name: 'Dirty Martini', category: 'Royale', cssBackground: img('royale-ash.png') },
  { id: 'royale-forest', name: 'Chartreuse', category: 'Royale', cssBackground: img('royale-forest.png') },
  { id: 'royale-berry', name: 'Merlot', category: 'Royale', cssBackground: img('royale-berry.png') },
  { id: 'royale-sand', name: 'Prosecco', category: 'Royale', cssBackground: img('royale-sand.png') },
  { id: 'royale-sage', name: 'Gimlet', category: 'Royale', cssBackground: img('royale-sage.png') },

  // ── Banks (Smooth Velvet) ──
  { id: 'banks-nutmeg', name: 'Amaretto', category: 'Banks', cssBackground: img('banks-nutmeg.png') },
  { id: 'banks-currant', name: 'Cassis', category: 'Banks', cssBackground: img('banks-currant.png') },
  { id: 'banks-oatmeal', name: 'Baileys', category: 'Banks', cssBackground: img('banks-oatmeal.png') },
  { id: 'banks-zinnia', name: 'Aperol', category: 'Banks', cssBackground: img('banks-zinnia.png') },

  // ── Bentley (Striated Chenille) ──
  { id: 'bentley-daisey', name: 'Limoncello', category: 'Bentley', cssBackground: img('bentley-daisey.png') },
  { id: 'bentley-indigo', name: 'Midnight Pour', category: 'Bentley', cssBackground: img('bentley-indigo.png') },
  { id: 'bentley-pewter', name: 'Silver Fizz', category: 'Bentley', cssBackground: img('bentley-pewter.png') },

  // ── Cody (Tweed Weave) ──
  { id: 'cody-slate', name: 'Slate Sour', category: 'Cody', cssBackground: img('cody-slate.png') },
  { id: 'cody-sandstone', name: 'Bourbon Smash', category: 'Cody', cssBackground: img('cody-sandstone.png') },
  { id: 'cody-pacific', name: 'Pacific Cooler', category: 'Cody', cssBackground: img('cody-pacific.png') },

  // ── Sunbrella (Performance) ──
  { id: 'sunbrella-fog', name: 'London Fog', category: 'Sunbrella', cssBackground: img('sunbrella-fog.png') },
  { id: 'sunbrella-sea', name: 'Sea Breeze', category: 'Sunbrella', cssBackground: img('sunbrella-sea.png') },
  { id: 'sunbrella-wisteria', name: 'Lavender Spritz', category: 'Sunbrella', cssBackground: img('sunbrella-wisteria.png') },
  { id: 'sunbrella-lagoon', name: 'Lagoon Punch', category: 'Sunbrella', cssBackground: img('sunbrella-lagoon.png') },
  { id: 'sunbrella-loft-white', name: 'Elderflower', category: 'Sunbrella', cssBackground: img('sunbrella-loft-white.png') },

  // ── Bubbly (Textured Weave) ──
  { id: 'bubbly-cucumber', name: 'Cucumber Collins', category: 'Bubbly', cssBackground: img('bubbly-cucumber.png') },
  { id: 'bubbly-moscow-mule', name: 'Moscow Mule', category: 'Bubbly', cssBackground: img('bubbly-moscow-mule.png') },
  { id: 'bubbly-cream-soda', name: 'Cream Soda', category: 'Bubbly', cssBackground: img('bubbly-cream-soda.png') },

  // ── Karina (Bouclé) ──
  { id: 'karina-cloud', name: 'White Russian', category: 'Karina', cssBackground: img('karina-cloud.png') },
  { id: 'karina-teal', name: 'Tequila Sunrise', category: 'Karina', cssBackground: img('karina-teal.png') },

  // ── Crave (Ribbed Chenille) ──
  { id: 'crave-rose', name: 'Rosé Spritz', category: 'Crave', cssBackground: img('crave-rose.png') },
  { id: 'crave-mocha', name: 'Espresso Martini', category: 'Crave', cssBackground: img('crave-mocha.png') },
  { id: 'crave-mocha-latte', name: 'Mocha Latte', category: 'Crave', cssBackground: img('crave-mocha-latte.png') },
  { id: 'crave-ginger-tea', name: 'Ginger Mule', category: 'Crave', cssBackground: img('crave-ginger-tea.png') },
  { id: 'crave-berry-hibiscus', name: 'Hibiscus Sour', category: 'Crave', cssBackground: img('crave-berry-hibiscus.png') },
  { id: 'crave-greenery', name: 'Mojito', category: 'Crave', cssBackground: img('crave-greenery.png') },
  { id: 'crave-lava-rock', name: 'Dark & Stormy', category: 'Crave', cssBackground: img('crave-lava-rock.png') },
  { id: 'crave-irish-cream', name: 'Irish Cream', category: 'Crave', cssBackground: img('crave-irish-cream.png') },

  // ── Flat Silk ──
  { id: 'flat-silk-cream', name: 'Chardonnay', category: 'Flat Silk', cssBackground: img('flat-silk-cream.png') },
  { id: 'flat-silk-champagne', name: 'Champagne', category: 'Flat Silk', cssBackground: img('flat-silk-champagne.png') },
  { id: 'flat-silk-taupe', name: 'Sherry', category: 'Flat Silk', cssBackground: img('flat-silk-taupe.png') },
  { id: 'flat-silk-dusty-rose', name: 'Cosmopolitan', category: 'Flat Silk', cssBackground: img('flat-silk-dusty-rose.png') },
  { id: 'flat-silk-navy', name: 'Nightcap', category: 'Flat Silk', cssBackground: img('flat-silk-navy.png') },

  // ── Checker ──
  { id: 'checker-mocha', name: 'Café Corretto', category: 'Checker', cssBackground: img('checker-mocha.png') },
  { id: 'checker-tapestry', name: 'Mulled Wine', category: 'Checker', cssBackground: img('checker-tapestry.png') },

  // ── Soul ──
  { id: 'soul-cloud', name: 'Piña Colada', category: 'Soul', cssBackground: img('soul-cloud.png') },

  // ── Nepal ──
  { id: 'nepal-teal', name: 'Mai Tai', category: 'Nepal', cssBackground: img('nepal-teal.png') },

  // ── Sorrento ──
  { id: 'sorrento-teal', name: 'Limoncello Spritz', category: 'Sorrento', cssBackground: img('sorrento-teal.png') },

  // ── Kenley ──
  { id: 'kenley-spruce', name: 'Fernet', category: 'Kenley', cssBackground: img('kenley-spruce.png') },
  { id: 'kenley-mauve', name: 'Kir Royale', category: 'Kenley', cssBackground: img('kenley-mauve.png') },

  // ── Villa ──
  { id: 'villa-sand', name: 'Paloma', category: 'Villa', cssBackground: img('villa-sand.png') },


  // ── Key Largo ──
  { id: 'keylargo-zenith-teal', name: 'Daiquiri', category: 'Key Largo', cssBackground: img('keylargo-zenith-teal.png') },

  // ── Essence ──
  { id: 'essence-ash', name: 'Dry Vermouth', category: 'Essence', cssBackground: img('essence-ash.png') },

  // ── Synergy ──
  { id: 'synergy-pewter', name: 'Pewter Fizz', category: 'Synergy', cssBackground: img('synergy-pewter.png') },

  // ── Milo ──
  { id: 'milo-dove', name: 'French 75', category: 'Milo', cssBackground: img('milo-dove.png') },
  { id: 'milo-french-blue', name: 'Aviation', category: 'Milo', cssBackground: img('milo-french-blue.png') },

  // ── Faithful ──
  { id: 'faithful-olive', name: 'Olive Drop', category: 'Faithful', cssBackground: img('faithful-olive.png') },
  { id: 'faithful-indigo', name: 'Ink & Tonic', category: 'Faithful', cssBackground: img('faithful-indigo.png') },
  { id: 'faithful-sand', name: 'Sidecar', category: 'Faithful', cssBackground: img('faithful-sand.png') },
  { id: 'faithful-mocha', name: 'Mudslide', category: 'Faithful', cssBackground: img('faithful-mocha.png') },

  // ── Nico ──
  { id: 'nico-oyster', name: 'Oyster Shooter', category: 'Nico', cssBackground: img('nico-oyster.png') },

  // ── Taylor Felt ──
  { id: 'taylor-felt-gray', name: 'Grey Goose', category: 'Taylor Felt', cssBackground: img('taylor-felt-gray.png') },

  // ── Borough ──
  { id: 'borough-cotton', name: 'Tom Collins', category: 'Borough', cssBackground: img('borough-cotton.png') },

  // ── Lucky ──
  { id: 'lucky-turquoise', name: 'Blue Hawaii', category: 'Lucky', cssBackground: img('lucky-turquoise.png') },
  { id: 'lucky-divine', name: 'Bellini', category: 'Lucky', cssBackground: img('lucky-divine.png') },

  // ── Merit ──
  { id: 'merit-dove', name: 'Sauvignon', category: 'Merit', cssBackground: img('merit-dove.png') },

  // ── Prime ──
  { id: 'prime-stone', name: 'Old Fashioned', category: 'Prime', cssBackground: img('prime-stone.png') },
  { id: 'prime-peacock', name: 'Peacock Punch', category: 'Prime', cssBackground: img('prime-peacock.png') },

  // ── Tussah ──
  

  // ── Bloke ──
  

  // ── Leather ──
  { id: 'leather-bourbon', name: 'Bourbon', category: 'Leather', cssBackground: img('leather-bourbon.png') },
  { id: 'leather-espresso', name: 'Espresso', category: 'Leather', cssBackground: img('leather-espresso.png') },
  { id: 'leather-chai', name: 'Chai Toddy', category: 'Leather', cssBackground: img('leather-chai.png') },
  { id: 'leather-cognac', name: 'Cognac', category: 'Leather', cssBackground: img('leather-cognac.png') },
  { id: 'leather-mocha', name: 'Kahlúa', category: 'Leather', cssBackground: img('leather-mocha.png') },
  { id: 'leather-rye', name: 'Rye Whiskey', category: 'Leather', cssBackground: img('leather-rye.png') },

  // ── Wood ──
  { id: 'wood-oak', name: 'Oak Barrel', category: 'Wood', cssBackground: img('wood-oak.png') },
  { id: 'wood-walnut', name: 'Walnut Stout', category: 'Wood', cssBackground: img('wood-walnut.png') },
  { id: 'wood-birch', name: 'Birch Sap', category: 'Wood', cssBackground: img('wood-birch.png') },

  // ── Marble ──
  { id: 'marble-carrara', name: 'Carrara Blanc', category: 'Marble', cssBackground: img('marble-carrara.png') },
  { id: 'marble-nero', name: 'Nero Negroni', category: 'Marble', cssBackground: img('marble-nero.png') },
  { id: 'marble-rosa', name: 'Rosa Fizz', category: 'Marble', cssBackground: img('marble-rosa.png') },
  { id: 'marble-verde', name: 'Verde Julep', category: 'Marble', cssBackground: img('marble-verde.png') },

  // ── Concrete ──
  { id: 'concrete-raw', name: 'Concrete Jungle', category: 'Concrete', cssBackground: img('concrete-raw.png') },
  { id: 'concrete-polished', name: 'Neat Pour', category: 'Concrete', cssBackground: img('concrete-polished.png') },
  { id: 'concrete-weathered', name: 'Aged Cask', category: 'Concrete', cssBackground: img('concrete-weathered.png') },

  // ── Stripe ──
  { id: 'stripe-ink', name: 'Ink Negroni', category: 'Stripe', cssBackground: img('stripe-ink.png') },
  { id: 'stripe-pinstripe', name: 'Pinstripe Fizz', category: 'Stripe', cssBackground: img('stripe-pinstripe.png') },
  { id: 'stripe-woven', name: 'Woven Julep', category: 'Stripe', cssBackground: img('stripe-woven.png') },

  // ── Grid ──
  { id: 'grid-checker-blue', name: 'Blueberry Mule', category: 'Grid', cssBackground: img('grid-checker-blue.png') },
  { id: 'grid-cream', name: 'Vanilla Cream', category: 'Grid', cssBackground: img('grid-cream.png') },
  { id: 'grid-crosshatch', name: 'Crosshatch Cider', category: 'Grid', cssBackground: img('grid-crosshatch.png') },
  { id: 'grid-windowpane', name: 'Windowpane Spritz', category: 'Grid', cssBackground: img('grid-windowpane.png') },

  // ── Animal ──
  { id: 'animal-cheetah', name: 'Jungle Bird', category: 'Animal', cssBackground: img('cheetah-print.png') },
  { id: 'animal-cheetah-white', name: 'Snow Leopard', category: 'Animal', cssBackground: img('cheetah-white.png') },
  { id: 'animal-cow', name: 'Black Velvet', category: 'Animal', cssBackground: img('cow-print.png') },
  { id: 'animal-zebra', name: 'Zebra Stripe', category: 'Animal', cssBackground: img('zebra-print.png') },

  // ── Ripple ──
  { id: 'ripple-cream', name: 'Crème Brûlée', category: 'Ripple', cssBackground: img('ripple-cream.png') },
  { id: 'ripple-ink', name: 'Blackberry Wine', category: 'Ripple', cssBackground: img('ripple-ink.png') },
  { id: 'ripple-kraft', name: 'Craft Brew', category: 'Ripple', cssBackground: img('ripple-kraft.png') },
  { id: 'ripple-lattice', name: 'Lattice Lager', category: 'Ripple', cssBackground: img('ripple-lattice.png') },
  { id: 'ripple-parchment', name: 'Parchment Port', category: 'Ripple', cssBackground: img('ripple-parchment.png') },

  // ── Speckle ──
  { id: 'speckle-blue', name: 'Blue Moon', category: 'Speckle', cssBackground: img('speckle-blue.png') },
  { id: 'speckle-ink', name: 'Dark Rum', category: 'Speckle', cssBackground: img('speckle-ink.png') },

  // ── Tie-dye ──
  { id: 'tiedye-blush', name: 'Frosé', category: 'Tie-dye', cssBackground: img('tiedye-blush.png') },
  { id: 'tiedye-neutral', name: 'Kombucha', category: 'Tie-dye', cssBackground: img('tiedye-neutral.png') },
  { id: 'tiedye-rainbow', name: 'Rainbow Punch', category: 'Tie-dye', cssBackground: img('tiedye-rainbow.png') },

  // ── Maze ──
  { id: 'maze', name: 'Labyrinth Lager', category: 'Maze', cssBackground: img('maze.png') },

  // ── Felt ──
  { id: 'felt-sand', name: 'Amaretto Sour', category: 'Felt', cssBackground: img('felt-sand.png') },
  { id: 'felt-brown', name: 'Irish Coffee', category: 'Felt', cssBackground: img('felt-brown.png') },
  { id: 'felt-olive', name: 'Olive Martini', category: 'Felt', cssBackground: img('felt-olive.png') },
  { id: 'felt-navy', name: 'Navy Grog', category: 'Felt', cssBackground: img('felt-navy.png') },

  // ── Cotton ──
  { id: 'cotton-natural', name: 'Coconut Water', category: 'Cotton', cssBackground: img('cotton-natural.png') },
  { id: 'cotton-oatmeal', name: 'Oat Milk Latte', category: 'Cotton', cssBackground: img('cotton-oatmeal.png') },

  // ── Yarn ──
  { id: 'yarn-cream', name: 'Vanilla Bean', category: 'Yarn', cssBackground: img('yarn-cream.png') },
  { id: 'yarn-oatmeal', name: 'Chai Spice', category: 'Yarn', cssBackground: img('yarn-oatmeal.png') },
  { id: 'yarn-charcoal', name: 'Charcoal Stout', category: 'Yarn', cssBackground: img('yarn-charcoal.png') },

  // ── Corduroy ──
  { id: 'cord-fine-sand', name: 'Sandy Collins', category: 'Corduroy', cssBackground: img('cord-fine-sand.png') },
  { id: 'cord-fine-brown', name: 'Brown Derby', category: 'Corduroy', cssBackground: img('cord-fine-brown.png') },
  { id: 'cord-fine-olive', name: 'Olive Brine', category: 'Corduroy', cssBackground: img('cord-fine-olive.png') },
  { id: 'cord-fine-navy', name: 'Navy Negroni', category: 'Corduroy', cssBackground: img('cord-fine-navy.png') },
  { id: 'cord-wide-sand', name: 'Sahara Sling', category: 'Corduroy', cssBackground: img('cord-wide-sand.png') },
  { id: 'cord-wide-brown', name: 'Manhattan', category: 'Corduroy', cssBackground: img('cord-wide-brown.png') },
  { id: 'cord-wide-olive', name: 'Last Word', category: 'Corduroy', cssBackground: img('cord-wide-olive.png') },
  { id: 'cord-wide-navy', name: 'Midnight Mule', category: 'Corduroy', cssBackground: img('cord-wide-navy.png') },
  { id: 'cord-washed-sand', name: 'Paloma Fade', category: 'Corduroy', cssBackground: img('cord-washed-sand.png') },
  { id: 'cord-washed-brown', name: 'Rusty Nail', category: 'Corduroy', cssBackground: img('cord-washed-brown.png') },
  { id: 'cord-washed-olive', name: 'Herb Garden', category: 'Corduroy', cssBackground: img('cord-washed-olive.png') },
  { id: 'cord-washed-navy', name: 'Nightfall', category: 'Corduroy', cssBackground: img('cord-washed-navy.png') },

  // ── Alix ──
  { id: 'alix-rose', name: 'Alix Rosé', category: 'Alix', cssBackground: img('novelty-alix-rose.png') },
  { id: 'alix-blush', name: 'Alix Blush', category: 'Alix', cssBackground: img('novelty-alix-blush.png') },
  { id: 'alix-fuchsia', name: 'Alix Neon', category: 'Alix', cssBackground: img('novelty-alix-fuchsia.png') },

  // ── Corinne ──
  { id: 'corinne-mulberry', name: 'Corinne Crush', category: 'Corinne', cssBackground: img('novelty-corinne-mulberry.png') },
  { id: 'corinne-plum', name: 'Corinne Plum', category: 'Corinne', cssBackground: img('novelty-corinne-plum.png') },
  { id: 'corinne-lavender', name: 'Mulberry', category: 'Corinne', cssBackground: img('novelty-corinne-lavender.png') },

  // ── ShayShari ──
  { id: 'shayshari-terra', name: 'Corinne Crush', category: 'ShayShari', cssBackground: img('novelty-shayshari-terra.png') },
  { id: 'shayshari-sage', name: 'ShayShari Seltzer', category: 'ShayShari', cssBackground: img('novelty-shayshari-sage.png') },
  { id: 'shayshari-sand', name: 'Sand', category: 'Villa', cssBackground: img('novelty-shayshari-sand.png') },

  // ── Suede Ace ──
  { id: 'suede-ace-navy', name: 'Suede Ace', category: 'Suede Ace', cssBackground: img('novelty-suede-navy.png') },
  { id: 'suede-ace-forest', name: 'Woodruff', category: 'Suede Ace', cssBackground: img('novelty-suede-forest.png') },
  { id: 'suede-ace-oxblood', name: 'Twilight', category: 'Suede Ace', cssBackground: img('novelty-suede-oxblood.png') },

  // ── Jayme ──
  { id: 'jayme-gogh', name: 'Jayme Gogh', category: 'Jayme', cssBackground: img('novelty-jayme-gogh.png') },

  // ── Skott ──
  { id: 'skott-camo', name: 'Camo', category: 'Skott', cssBackground: img('novelty-skott-camo.png') },

  // ── Kaplan ──
  { id: 'kaplan-tigerish', name: 'Tigerish', category: 'Kaplan', cssBackground: img('novelty-kaplan-tigerish.png') },

  // ── Riviera ──
  { id: 'riviera', name: 'Riviera', category: 'Riviera', cssBackground: img('novelty-riviera.png') },

  // ── Nicole ──
  { id: 'nicole', name: 'Nicole', category: 'Nicole', cssBackground: img('novelty-nicole.png') },

  // ── Byrd ──
  { id: 'byrd', name: 'Byrd', category: 'Byrd', cssBackground: img('novelty-byrd.png') },

  // ── JaymeLyn ──
  { id: 'jaymelyn', name: 'JaymeLyn', category: 'JaymeLyn', cssBackground: img('novelty-jaymelyn.png') },

  // ── Claude ──
  { id: 'claude', name: 'Claude', category: 'Claude', cssBackground: img('novelty-claude.png') },

  // ── Gemini ──
  { id: 'gemini', name: 'Gemini', category: 'Gemini', cssBackground: img('novelty-gemini.png') },

  // ── Chat ──
  { id: 'chat', name: 'Chat', category: 'Chat', cssBackground: img('novelty-chat.png') },

  // ── Bisous ──
  { id: 'bisous-blues', name: 'Bisous Blues', category: 'Bisous', cssBackground: img('novelty-bisous-blues.png') },

  // ── Sunny Pup ──
  { id: 'sunny-pup', name: 'Sunny Pup', category: 'Sunny Pup', cssBackground: img('novelty-sunny-pup.png') },

  // ── Magenta Mrstik ──
  { id: 'magenta-mrstik', name: 'Magenta Mrstik', category: 'Magenta Mrstik', cssBackground: img('novelty-magenta-mrstik.png') },

  // ── Shelly's Volleyball ──
  { id: 'shellys-volleyball', name: "Shelly's Volleyball", category: "Shelly's Volleyball", cssBackground: img('novelty-shellys-volleyball.png') },

  // ── Signature Sips (CSS gradients — no image asset needed) ──
  {
    id: 'sig-marion',
    name: 'Marion', // French "Marionberry" — deep berry kir
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 30% 25%, #9d4d6b 0%, transparent 55%), radial-gradient(circle at 75% 70%, #4a1d33 0%, transparent 60%), linear-gradient(135deg, #6b2845 0%, #2d0e1f 100%)',
  },
  {
    id: 'sig-clara',
    name: 'Clara', // French "Clairet" rosé / Cointreau blush
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 25% 30%, #ffd4c2 0%, transparent 50%), radial-gradient(circle at 80% 75%, #f59ab0 0%, transparent 55%), linear-gradient(160deg, #fbe1d6 0%, #e89aa7 100%)',
  },
  {
    id: 'sig-hugo-spritz',
    name: 'Hugo Spritz', // elderflower, prosecco, mint
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 30% 25%, #e8f5d8 0%, transparent 55%), radial-gradient(circle at 75% 70%, #b8e0a4 0%, transparent 50%), linear-gradient(135deg, #d4ecc4 0%, #7fb968 100%)',
  },
  {
    id: 'sig-gok-gozel',
    name: 'Gök Güzel', // Turkish for "very beautiful sky"
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 25% 30%, #c2e4f5 0%, transparent 55%), radial-gradient(circle at 80% 75%, #5a8fc4 0%, transparent 60%), linear-gradient(180deg, #a8d0ec 0%, #2d5a8a 100%)',
  },
  {
    id: 'sig-julian',
    name: 'JJulian', // amber whiskey sour vibe
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 30% 25%, #f4d6a0 0%, transparent 55%), radial-gradient(circle at 75% 70%, #b8762e 0%, transparent 60%), linear-gradient(135deg, #e0a96d 0%, #6b3a14 100%)',
  },
  {
    id: 'sig-tumeric-lemonade',
    name: 'Turmeric Lemonade',
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 25% 30%, #fff4b8 0%, transparent 55%), radial-gradient(circle at 80% 75%, #f5a623 0%, transparent 55%), linear-gradient(160deg, #ffeb8a 0%, #d97706 100%)',
  },
  {
    id: 'sig-mihn-maroone',
    name: 'Mihn Maroone', // deep maroon with chestnut warmth
    category: 'Signature Sips',
    cssBackground:
      'radial-gradient(circle at 30% 25%, #b85575 0%, transparent 55%), radial-gradient(circle at 75% 70%, #3a0a18 0%, transparent 60%), linear-gradient(135deg, #7a1f35 0%, #2a0610 100%)',
  },
];
