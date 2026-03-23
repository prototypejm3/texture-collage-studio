/**
 * Kid-friendly texture names — cute, color-accurate words kids love.
 * Keyed by texture id → kid name.
 */
export const kidTextureNames: Record<string, string> = {
  // Royale (Velvet)
  'royale-blush': 'Cotton Candy',        // soft pink velvet
  'royale-gunmetal': 'Night Sky',          // dark gray velvet
  'royale-evergreen': 'Dinosaur Green',   // deep green velvet
  'royale-apple': 'Frog Belly',           // bright green velvet
  'royale-hacienda': 'Cinnamon Swirl',    // warm reddish-brown
  'royale-peacock': 'Mermaid Tail',        // teal velvet
  'royale-cobalt': 'Rocket Blue',          // bright blue velvet
  'royale-ash': 'Elephant Ear',            // gray velvet
  'royale-forest': 'Tree Fort',            // forest green velvet
  'royale-berry': 'Grape Juice',           // deep purple-berry
  'royale-sand': 'Sandcastle',             // sandy beige velvet
  'royale-sage': 'Turtle Shell',           // sage green velvet

  // Banks (Smooth Velvet)
  'banks-nutmeg': 'Teddy Bear',           // warm brown
  'banks-currant': 'Cherry Jam',           // deep red
  'banks-oatmeal': 'Cookie Dough',         // light tan
  'banks-zinnia': 'Goldfish',              // orange

  // Bentley (Striated Chenille)
  'bentley-daisey': 'Lemonade',           // yellow
  'bentley-indigo': 'Midnight Sky',        // dark indigo
  'bentley-pewter': 'Robot Silver',        // pewter gray

  // Cody (Tweed Weave)
  'cody-slate': 'Blueberry Ice',          // blue-gray tweed
  'cody-sandstone': 'Peanut Butter',       // tan tweed
  'cody-pacific': 'Ocean Wave',            // blue tweed

  // Sunbrella (Performance)
  'sunbrella-fog': 'Foggy Morning',        // light gray
  'sunbrella-sea': 'Swimming Pool',        // sea blue
  'sunbrella-wisteria': 'Unicorn Purple',  // purple
  'sunbrella-lagoon': 'Lagoon Splash',     // green lagoon
  'sunbrella-loft-white': 'Marshmallow',   // soft white

  // Bubbly (Textured Weave)
  'bubbly-cucumber': 'Pickle Green',       // green textured
  'bubbly-moscow-mule': 'Gingerbread',     // warm copper-brown
  'bubbly-cream-soda': 'Cream Puff',       // creamy beige

  // Karina (Bouclé)
  'karina-cloud': 'Cloud Puff',           // white bouclé
  'karina-teal': 'Mermaid Scale',          // teal bouclé

  // Crave (Ribbed Chenille)
  'crave-rose': 'Bubblegum',              // rosy pink
  'crave-mocha': 'Hot Cocoa',              // dark brown
  'crave-mocha-latte': 'Milk Chocolate',   // medium brown
  'crave-ginger-tea': 'Ginger Snap',       // warm ginger
  'crave-berry-hibiscus': 'Raspberry',     // berry red-pink
  'crave-greenery': 'Grasshopper',         // leafy green
  'crave-lava-rock': 'Volcano Rock',       // very dark brown-black
  'crave-irish-cream': 'Caramel Swirl',    // light tan-cream

  // Flat Silk
  'flat-silk-cream': 'Banana Cream',       // creamy yellow
  'flat-silk-champagne': 'Golden Star',    // champagne gold
  'flat-silk-taupe': 'Chipmunk',           // taupe brown
  'flat-silk-dusty-rose': 'Fairy Wing',    // dusty pink
  'flat-silk-navy': 'Starry Night',        // dark navy

  // Checker
  'checker-mocha': 'Checkerboard',         // brown checks
  'checker-tapestry': 'Berry Waffle',      // berry-toned checks

  // Soul
  'soul-cloud': 'Fluffy Cloud',           // soft white textured

  // Nepal
  'nepal-teal': 'Parrot Feather',          // teal textured

  // Sorrento
  'sorrento-teal': 'Sea Glass',            // teal textured

  // Kenley
  'kenley-spruce': 'Pine Tree',            // dark green velvet
  'kenley-mauve': 'Fairy Dust',            // mauve-pink velvet

  // Villa
  'villa-sand': 'Beach Sand',             // sandy linen

  // Leuven — removed

  // Key Largo
  'keylargo-zenith-teal': 'Mermaid Green', // teal performance

  // Essence
  'essence-ash': 'Bunny Gray',            // light gray smooth

  // Synergy
  'synergy-pewter': 'Silver Coin',         // pewter woven

  // Milo
  'milo-dove': 'Dove Feather',            // soft gray linen
  'milo-french-blue': 'Sky Blue',          // french blue linen

  // Faithful
  'faithful-olive': 'Pickle Jar',          // olive linen
  'faithful-indigo': 'Ink Splash',         // indigo linen
  'faithful-sand': 'Sandy Toes',           // sand linen
  'faithful-mocha': 'Brownie',             // mocha brown linen

  // Nico
  'nico-oyster': 'Seashell',              // oyster white smooth

  // Taylor Felt
  'taylor-felt-gray': 'Rainy Day',        // gray felt

  // Borough
  'borough-cotton': 'Cotton Ball',         // white textured

  // Lucky
  'lucky-turquoise': 'Crystal Blue',       // turquoise
  'lucky-divine': 'Peach Gummy',           // peachy-pink

  // Merit
  'merit-dove': 'Feather Soft',            // dove gray linen

  // Prime
  'prime-stone': 'River Rock',             // stone gray velvet
  'prime-peacock': 'Peacock Feather',      // deep teal velvet

  // Bloke

  // Leather
  'leather-bourbon': 'Honey Bear',        // warm honey-brown leather
  'leather-espresso': 'Dark Chocolate',    // very dark brown leather
  'leather-chai': 'Cinnamon Toast',        // warm cinnamon leather
  'leather-cognac': 'Maple Syrup',         // amber-brown leather
  'leather-mocha': 'Cocoa Bean',           // deep brown leather
  'leather-rye': 'Graham Cracker',         // tan-brown leather

  // Wood
  'wood-oak': 'Treehouse',                // medium oak wood
  'wood-walnut': 'Acorn',                  // dark walnut wood
  'wood-birch': 'Birch Bark',             // light birch wood

  // Marble
  'marble-carrara': 'Ice Cream Swirl',    // white marble with gray veins
  'marble-nero': 'Licorice',               // black marble
  'marble-rosa': 'Strawberry Milk',        // pink marble
  'marble-verde': 'Mint Chip',             // green marble

  // Concrete
  'concrete-raw': 'Sidewalk',             // raw gray concrete
  'concrete-polished': 'Moon Rock',        // smooth gray concrete
  'concrete-weathered': 'Fossil',          // old rough concrete

  // Stripe
  'stripe-ink': 'Zebra Stripe',           // black & white stripes
  'stripe-pinstripe': 'Candy Stripe',      // thin light stripes
  'stripe-woven': 'Rainbow Weave',         // colorful woven stripes

  // Grid
  'grid-checker-blue': 'Blueberry Waffle', // blue checkers
  'grid-cream': 'Vanilla Waffle',          // cream grid
  'grid-crosshatch': 'Tic-Tac-Toe',       // crosshatch pattern
  'grid-windowpane': 'Window Frost',       // windowpane grid

  // Animal
  'animal-cheetah': 'Cheetah Spots',       // classic cheetah print
  'animal-cheetah-white': 'Snow Leopard',  // white cheetah print
  'animal-cow': 'Cow Spots',               // black & white cow
  'animal-zebra': 'Zebra Stripes',         // black & white zebra

  // Ripple
  'ripple-cream': 'Vanilla Pudding',       // cream wavy
  'ripple-ink': 'Blackberry Jam',          // dark wavy
  'ripple-kraft': 'Paper Bag',             // brown kraft wavy
  'ripple-lattice': 'Waffle Cone',         // tan lattice
  'ripple-parchment': 'Treasure Map',      // old parchment

  // Speckle
  'speckle-blue': 'Robin Egg',            // speckled blue
  'speckle-ink': 'Cookies & Cream',        // dark speckled

  // Tie-dye
  'tiedye-blush': 'Pink Swirl',           // pink tie-dye
  'tiedye-neutral': 'Cinnamon Roll',       // neutral tie-dye
  'tiedye-rainbow': 'Rainbow Swirl',       // rainbow tie-dye

  // Maze
  'maze': 'Maze Game',                     // maze pattern

  // Felt
  'felt-sand': 'Sandy Beach',             // sand-colored felt
  'felt-brown': 'Chocolate Milk',          // brown felt
  'felt-olive': 'Turtle Green',            // olive felt
  'felt-navy': 'Deep Ocean',               // navy felt

  // Cotton
  'cotton-natural': 'Coconut Flake',       // natural white cotton
  'cotton-oatmeal': 'Oatmeal Cookie',      // oatmeal cotton

  // Yarn
  'yarn-cream': 'Vanilla Ice Cream',      // cream yarn
  'yarn-oatmeal': 'Cinnamon Sugar',        // tan yarn
  'yarn-charcoal': 'Pencil Lead',          // dark gray yarn

  // Corduroy
  'cord-fine-sand': 'Sandy Lines',         // sand corduroy
  'cord-fine-brown': 'Chocolate Bar',      // brown corduroy
  'cord-fine-olive': 'Caterpillar Lines',  // olive corduroy
  'cord-fine-navy': 'Whale Blue',          // navy corduroy
  'cord-wide-sand': 'Gingerbread',         // sand wide cord
  'cord-wide-brown': "S'more",             // brown wide cord
  'cord-wide-olive': 'Leaf Pile',          // olive wide cord
  'cord-wide-navy': 'Nighttime',           // navy wide cord
  'cord-washed-sand': 'Sand Dollar',       // washed sand cord
  'cord-washed-brown': 'Teddy Paw',        // washed brown cord
  'cord-washed-olive': 'Herb Garden',      // washed olive cord
  'cord-washed-navy': 'Deep Space',        // washed navy cord

  // Alix (Signature)
  'alix-rose': 'Rose Petal',              // pink floral
  'alix-blush': 'Pink Lollipop',          // blush floral
  'alix-fuchsia': 'Hot Pink',              // bright fuchsia floral

  // Corinne (Signature)
  'corinne-mulberry': 'Orange Candy',      // orange-toned
  'corinne-plum': 'Plum Pudding',          // deep plum
  'corinne-lavender': 'Grape Popsicle',    // lavender

  // ShayShari (Signature)
  'shayshari-terra': 'Clay Pot',           // terracotta
  'shayshari-sage': 'Sage Leaf',           // sage green
  'shayshari-sand': 'Sand Dune',           // sandy

  // Suede Ace (Signature)
  'suede-ace-navy': 'Midnight Blue',       // dark navy suede
  'suede-ace-forest': 'Forest Floor',      // deep green suede
  'suede-ace-oxblood': 'Cherry Cola',      // deep red suede

  // Jayme (Signature)
  'jayme-gogh': 'Starry Painting',         // artistic swirls

  // Skott
  'skott-camo': 'Army Camo',              // camo pattern

  // Kaplan
  'kaplan-tigerish': 'Tiger Stripe',       // tiger pattern

  // Riviera
  'riviera': 'Beach Day',                  // coastal pattern

  // Nicole
  'nicole': 'Sparkle Dots',                // decorative pattern

  // Byrd
  'byrd': 'Bird Feather',                  // feathered pattern

  // JaymeLyn
  'jaymelyn': 'Fairy Garden',              // whimsical pattern

  // Claude
  'claude': 'Magic Swirl',                 // abstract pattern

  // Gemini
  'gemini': 'Twin Stars',                  // abstract pattern

  // Chat
  'chat': 'Happy Chat',                    // abstract pattern

  // Bisous
  'bisous-blues': 'Blueberry Kiss',        // blue with kiss prints

  // Sunny Pup
  'sunny-pup': 'Sunny Puppy',             // golden with puppy silhouettes
};
