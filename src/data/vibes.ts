import { Vibe } from '@/types/studio';

// ── SUNSET ──
// Soft wavy horizontal bands — uneven spacing, organic curves
// Feels: calm, gradient, emotional
const sunset: Vibe = {
  id: 'sunset',
  name: 'Sunset',
  emoji: '🌅',
  description: 'Warm curved layers from sky to earth',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'sun-sky',
      label: 'Sky',
      tone: 'light',
      // Wide top band with gentle undulation
      path: 'M0,0 L480,0 L480,85 Q400,105 320,95 Q240,85 160,100 Q80,115 0,95 Z',
    },
    {
      id: 'sun-upperglow',
      label: 'Upper Glow',
      tone: 'light',
      path: 'M0,95 Q80,115 160,100 Q240,85 320,95 Q400,105 480,85 L480,190 Q390,215 300,200 Q210,185 120,205 Q60,218 0,200 Z',
    },
    {
      id: 'sun-midglow',
      label: 'Mid Glow',
      tone: 'medium',
      path: 'M0,200 Q60,218 120,205 Q210,185 300,200 Q390,215 480,190 L480,300 Q410,330 330,315 Q250,298 170,318 Q90,338 0,310 Z',
    },
    {
      id: 'sun-horizon',
      label: 'Horizon',
      tone: 'dark',
      path: 'M0,310 Q90,338 170,318 Q250,298 330,315 Q410,330 480,300 L480,400 Q400,420 310,410 Q220,400 130,415 Q60,425 0,408 Z',
    },
    {
      id: 'sun-ground',
      label: 'Ground',
      tone: 'dark',
      path: 'M0,408 Q60,425 130,415 Q220,400 310,410 Q400,420 480,400 L480,480 L0,480 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
  mediumTextures: ['suede-camel', 'leather-tan', 'linen-mustard', 'boucle-taupe', 'leather-caramel'],
  darkTextures: ['suede-terracotta', 'leather-cognac', 'velvet-rust', 'wood-walnut', 'leather-oxblood'],
  accentTextures: ['boucle-blush', 'linen-dusty-rose'],
};

// ── OCEAN ──
// Flowing wave sections: air → shallow → mid → deep → sand
const ocean: Vibe = {
  id: 'ocean',
  name: 'Ocean',
  emoji: '🌊',
  description: 'Flowing wave layers from air to sand',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'ocean-air',
      label: 'Air',
      tone: 'light',
      path: 'M0,0 L480,0 L480,90 Q420,110 360,95 Q300,80 240,100 Q180,120 120,105 Q60,90 0,110 Z',
    },
    {
      id: 'ocean-shallow',
      label: 'Shallow Water',
      tone: 'medium',
      path: 'M0,110 Q60,90 120,105 Q180,120 240,100 Q300,80 360,95 Q420,110 480,90 L480,210 Q410,235 340,215 Q270,195 200,220 Q130,245 60,225 Q30,215 0,230 Z',
    },
    {
      id: 'ocean-deep',
      label: 'Deep Water',
      tone: 'dark',
      path: 'M0,230 Q30,215 60,225 Q130,245 200,220 Q270,195 340,215 Q410,235 480,210 L480,350 Q420,370 350,355 Q280,340 210,360 Q140,380 70,365 Q30,355 0,370 Z',
    },
    {
      id: 'ocean-sand',
      label: 'Sand',
      tone: 'accent',
      path: 'M0,370 Q30,355 70,365 Q140,380 210,360 Q280,340 350,355 Q420,370 480,350 L480,480 L0,480 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'marble-carrara'],
  mediumTextures: ['linen-sage', 'suede-sage', 'linen-slate', 'marble-verde'],
  darkTextures: ['velvet-navy', 'velvet-emerald', 'velvet-forest', 'velvet-sapphire'],
  accentTextures: ['suede-camel', 'linen-mustard', 'leather-tan', 'boucle-oat'],
};

// ── SOLAR SYSTEM ──
// Circles on dark background
const solarSystem: Vibe = {
  id: 'solar-system',
  name: 'Solar System',
  emoji: '🌌',
  description: 'Celestial circles floating in space',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'solar-bg',
      label: 'Background',
      tone: 'dark',
      // Full background rectangle (rendered as the base layer)
      path: 'M0,0 L480,0 L480,480 L0,480 Z',
    },
    {
      id: 'solar-planet-main',
      label: 'Large Planet',
      tone: 'accent',
      // Large circle center-right
      path: circlePath(280, 220, 100),
    },
    {
      id: 'solar-planet-2',
      label: 'Small Planet',
      tone: 'medium',
      path: circlePath(100, 120, 55),
    },
    {
      id: 'solar-planet-3',
      label: 'Small Planet',
      tone: 'accent',
      path: circlePath(400, 100, 40),
    },
    {
      id: 'solar-planet-4',
      label: 'Small Planet',
      tone: 'medium',
      path: circlePath(80, 360, 45),
    },
    {
      id: 'solar-planet-5',
      label: 'Tiny Moon',
      tone: 'light',
      path: circlePath(380, 380, 30),
    },
  ],
  lightTextures: ['marble-carrara', 'marble-calacatta', 'linen-white'],
  mediumTextures: ['suede-slate', 'suede-charcoal', 'linen-slate', 'marble-rose'],
  darkTextures: ['leather-black', 'velvet-navy', 'marble-nero', 'wood-ebony', 'velvet-forest'],
  accentTextures: ['leather-cognac', 'suede-camel', 'wood-teak', 'velvet-sapphire'],
};

// ── CAT ──
// Chunky, rounded sitting cat — soft plush shape
// No facial features, bold & easy to cut with scissors
const cat: Vibe = {
  id: 'cozy-soft',
  name: 'Cat',
  emoji: '🐱',
  description: 'Soft minimal silhouette — cozy & warm',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'cat-head',
      label: 'Head',
      tone: 'light',
      // Big round head with chunky triangular ears, no face details
      path: 'M175,195 Q170,155 185,130 L200,90 Q205,80 215,88 Q220,110 240,115 Q260,110 265,88 Q275,80 280,90 L295,130 Q310,155 305,195 Q305,225 280,235 L200,235 Q175,225 175,195 Z',
    },
    {
      id: 'cat-body',
      label: 'Body',
      tone: 'medium',
      // Wide, chunky sitting body — pear/egg shape
      path: 'M175,235 L305,235 Q365,265 375,330 Q380,395 345,425 L135,425 Q100,395 105,330 Q115,265 175,235 Z',
    },
    {
      id: 'cat-tail',
      label: 'Tail',
      tone: 'accent',
      // Thick curved tail sweeping right — chunky, easy to cut
      path: 'M345,370 Q370,355 390,330 Q410,300 430,295 Q455,290 458,315 Q460,340 440,360 Q415,385 385,405 Q360,420 345,425 Z',
    },
  ],
  lightTextures: ['boucle-cream', 'boucle-ivory', 'linen-white', 'boucle-blush'],
  mediumTextures: ['boucle-oat', 'boucle-taupe', 'suede-camel', 'suede-lavender'],
  darkTextures: ['boucle-charcoal', 'suede-charcoal', 'suede-slate'],
  accentTextures: ['boucle-blush', 'suede-lavender', 'boucle-ivory'],
};

// ── DOG ──
// Chunky sitting dog — same plush style as cat
// Clean round head, separate floppy ear, pear body, thick tail
const dog: Vibe = {
  id: 'rugged-warm',
  name: 'Dog',
  emoji: '🐶',
  description: 'Bold patchwork silhouette — loyal & grounded',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'dog-head',
      label: 'Head',
      tone: 'medium',
      // Simple round head — slightly wider than cat, no face
      path: 'M165,195 Q160,150 180,120 Q200,95 240,90 Q280,95 300,120 Q320,150 315,195 Q315,225 290,238 L190,238 Q165,225 165,195 Z',
    },
    {
      id: 'dog-ear',
      label: 'Ear',
      tone: 'dark',
      // Chunky floppy ear hanging off right side
      path: 'M300,120 Q325,105 345,110 Q365,118 368,145 Q370,175 358,205 Q348,228 330,235 L315,225 Q315,195 315,170 Q315,140 300,120 Z',
    },
    {
      id: 'dog-body',
      label: 'Body',
      tone: 'light',
      // Wide chunky sitting body — pear shape
      path: 'M168,238 L312,238 Q370,268 380,335 Q385,400 350,430 L130,430 Q95,400 100,335 Q110,268 168,238 Z',
    },
    {
      id: 'dog-tail',
      label: 'Tail',
      tone: 'accent',
      // Thick curved tail — matches cat tail style
      path: 'M350,375 Q375,358 395,330 Q415,298 435,292 Q458,288 460,312 Q462,338 442,360 Q418,388 390,410 Q365,425 350,430 Z',
    },
  ],
  lightTextures: ['linen-natural', 'linen-white', 'wood-ash', 'boucle-cream'],
  mediumTextures: ['leather-tan', 'leather-caramel', 'suede-camel', 'wood-oak', 'wood-maple'],
  darkTextures: ['leather-black', 'leather-cognac', 'leather-oxblood', 'wood-walnut', 'leather-olive'],
  accentTextures: ['wood-cherry', 'wood-teak', 'leather-caramel'],
};

/** Helper: Generate an SVG circle path */
function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

// ── FRUIT BOWL ──
// Simple bowl with circular fruits — warm, playful
const fruitBowl: Vibe = {
  id: 'fruit-bowl',
  name: 'Fruit Bowl',
  emoji: '🍑',
  description: 'Warm chunky fruits in a bold bowl',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'fruit-1',
      label: 'Fruit Left',
      tone: 'accent',
      // Slightly imperfect circle — left fruit peeking from bowl
      path: 'M120,175 Q115,130 140,110 Q165,90 195,95 Q225,100 235,130 Q245,160 235,190 Q225,210 200,215 Q160,220 135,205 Q115,195 120,175 Z',
    },
    {
      id: 'fruit-2',
      label: 'Fruit Center',
      tone: 'medium',
      // Larger center fruit
      path: 'M200,155 Q195,110 220,88 Q245,70 275,75 Q305,82 315,110 Q325,140 318,170 Q310,195 285,205 Q255,215 230,205 Q205,192 200,155 Z',
    },
    {
      id: 'fruit-3',
      label: 'Fruit Right',
      tone: 'accent',
      // Right fruit
      path: 'M295,180 Q290,140 310,118 Q330,100 355,105 Q380,112 388,140 Q395,170 385,198 Q375,218 350,222 Q320,225 305,210 Q292,200 295,180 Z',
    },
    {
      id: 'bowl-rim',
      label: 'Bowl Rim',
      tone: 'dark',
      // Thick curved rim strip
      path: 'M80,225 Q85,210 140,200 Q240,185 340,200 Q400,210 405,225 L410,255 Q400,245 340,235 Q240,220 140,235 Q90,245 80,255 Z',
    },
    {
      id: 'bowl-base',
      label: 'Bowl',
      tone: 'medium',
      // Large rounded bowl body
      path: 'M80,255 Q90,245 140,235 Q240,220 340,235 Q400,245 410,255 Q420,320 390,380 Q360,420 240,425 Q120,420 90,380 Q60,320 80,255 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
  mediumTextures: ['suede-camel', 'leather-tan', 'linen-mustard', 'boucle-taupe', 'leather-caramel'],
  darkTextures: ['suede-terracotta', 'leather-cognac', 'velvet-rust', 'wood-walnut'],
  accentTextures: ['boucle-blush', 'linen-dusty-rose', 'suede-terracotta', 'linen-mustard'],
};

// ── MUSHROOM ──
// Wide cap, chunky stem — playful & earthy
const mushroom: Vibe = {
  id: 'mushroom',
  name: 'Mushroom',
  emoji: '🍄',
  description: 'Playful earthy silhouette — soft & chunky',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'mush-cap-top',
      label: 'Cap Top',
      tone: 'accent',
      // Wide rounded dome — the main cap
      path: 'M95,210 Q90,140 130,95 Q175,55 240,50 Q305,55 350,95 Q390,140 385,210 Q380,230 350,235 L130,235 Q100,230 95,210 Z',
    },
    {
      id: 'mush-cap-under',
      label: 'Cap Underside',
      tone: 'medium',
      // Thin curved strip under the cap — gills
      path: 'M130,235 L350,235 Q355,260 340,272 L140,272 Q125,260 130,235 Z',
    },
    {
      id: 'mush-stem',
      label: 'Stem',
      tone: 'light',
      // Thick chunky stem
      path: 'M185,272 L295,272 Q310,290 315,340 Q320,390 310,410 L170,410 Q160,390 165,340 Q170,290 185,272 Z',
    },
    {
      id: 'mush-base',
      label: 'Base',
      tone: 'dark',
      // Ground base — wide, flat
      path: 'M130,410 L350,410 Q370,420 375,440 Q370,458 340,462 L140,462 Q110,458 105,440 Q110,420 130,410 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
  mediumTextures: ['boucle-taupe', 'suede-camel', 'linen-sage', 'boucle-oat'],
  darkTextures: ['suede-charcoal', 'wood-walnut', 'leather-cognac', 'suede-slate'],
  accentTextures: ['suede-terracotta', 'velvet-rust', 'leather-caramel', 'boucle-blush'],
};

// ── BEEHIVE ──
// Stacked arches — thick, evenly spaced
const beehive: Vibe = {
  id: 'beehive',
  name: 'Beehive',
  emoji: '🐝',
  description: 'Stacked arches — warm & structured',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'hive-outer',
      label: 'Outer Arch',
      tone: 'light',
      // Widest outer arch
      path: 'M100,380 Q95,280 120,200 Q155,120 240,90 Q325,120 360,200 Q385,280 380,380 L345,380 Q348,290 330,220 Q305,150 240,128 Q175,150 150,220 Q132,290 135,380 Z',
    },
    {
      id: 'hive-middle',
      label: 'Middle Arch',
      tone: 'medium',
      // Middle arch
      path: 'M135,380 Q132,290 150,220 Q175,150 240,128 Q305,150 330,220 Q348,290 345,380 L310,380 Q315,300 300,245 Q280,185 240,168 Q200,185 180,245 Q165,300 170,380 Z',
    },
    {
      id: 'hive-inner',
      label: 'Inner Arch',
      tone: 'accent',
      // Innermost arch
      path: 'M170,380 Q165,300 180,245 Q200,185 240,168 Q280,185 300,245 Q315,300 310,380 Z',
    },
    {
      id: 'hive-base',
      label: 'Base',
      tone: 'dark',
      // Flat base strip
      path: 'M80,380 L400,380 Q415,395 418,415 Q415,438 395,445 L85,445 Q65,438 62,415 Q65,395 80,380 Z',
    },
  ],
  lightTextures: ['linen-mustard', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
  mediumTextures: ['suede-camel', 'leather-tan', 'boucle-oat', 'leather-caramel'],
  darkTextures: ['wood-walnut', 'leather-cognac', 'suede-charcoal', 'wood-ebony'],
  accentTextures: ['linen-mustard', 'suede-terracotta', 'boucle-blush', 'leather-caramel'],
};

// ── CACTUS ──
// Chunky saguaro — main body + 2 arms + base
const cactus: Vibe = {
  id: 'cactus',
  name: 'Cactus',
  emoji: '🌵',
  description: 'Desert silhouette — bold & playful',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'cactus-body',
      label: 'Body',
      tone: 'medium',
      // Thick rounded main trunk
      path: 'M200,120 Q195,90 215,75 Q235,65 255,68 Q275,72 282,90 L285,340 Q288,370 270,380 L210,380 Q192,370 195,340 Z',
    },
    {
      id: 'cactus-arm-left',
      label: 'Left Arm',
      tone: 'accent',
      // Chunky left arm curving up
      path: 'M200,220 Q170,225 148,215 Q125,200 120,175 Q118,150 130,138 Q145,128 158,135 Q170,145 172,168 Q175,190 178,200 L200,195 Z',
    },
    {
      id: 'cactus-arm-right',
      label: 'Right Arm',
      tone: 'accent',
      // Chunky right arm curving up
      path: 'M282,180 Q310,175 330,165 Q352,150 358,128 Q362,108 350,98 Q335,90 322,100 Q312,112 310,135 Q308,158 305,170 L282,168 Z',
    },
    {
      id: 'cactus-base',
      label: 'Base',
      tone: 'dark',
      // Ground base
      path: 'M130,380 L350,380 Q370,392 375,412 Q372,435 348,442 L132,442 Q108,435 105,412 Q110,392 130,380 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream'],
  mediumTextures: ['linen-sage', 'suede-sage', 'velvet-emerald', 'velvet-forest'],
  darkTextures: ['suede-charcoal', 'wood-walnut', 'leather-cognac'],
  accentTextures: ['linen-sage', 'suede-sage', 'linen-mustard', 'suede-camel'],
};

// ── NEW YORK BUILDINGS ──
// 3 rectangular building blocks + base — bold skyline
const nyBuildings: Vibe = {
  id: 'ny-buildings',
  name: 'New York',
  emoji: '🏙️',
  description: 'Bold skyline blocks — urban & graphic',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'ny-tall',
      label: 'Tall Tower',
      tone: 'dark',
      // Tallest building left-center
      path: 'M120,80 Q118,72 130,68 L195,68 Q207,72 205,80 L205,380 L120,380 Z',
    },
    {
      id: 'ny-mid',
      label: 'Mid Building',
      tone: 'medium',
      // Medium building center
      path: 'M215,155 Q213,148 225,145 L305,145 Q317,148 315,155 L315,380 L215,380 Z',
    },
    {
      id: 'ny-short',
      label: 'Short Building',
      tone: 'accent',
      // Shorter wide building right
      path: 'M325,220 Q323,212 335,208 L395,208 Q407,212 405,220 L405,380 L325,380 Z',
    },
    {
      id: 'ny-base',
      label: 'Ground',
      tone: 'dark',
      // Wide ground strip
      path: 'M60,380 L420,380 Q438,392 440,415 Q438,438 420,445 L60,445 Q42,438 40,415 Q42,392 60,380 Z',
    },
  ],
  lightTextures: ['marble-carrara', 'linen-white', 'marble-calacatta'],
  mediumTextures: ['suede-slate', 'linen-slate', 'marble-verde', 'suede-charcoal'],
  darkTextures: ['leather-black', 'velvet-navy', 'marble-nero', 'wood-ebony'],
  accentTextures: ['suede-camel', 'leather-cognac', 'wood-teak', 'marble-rose'],
};

// ── RAINBOW ──
// 4 stacked arch layers — bold, thick, evenly spaced
const rainbow: Vibe = {
  id: 'rainbow',
  name: 'Rainbow',
  emoji: '🌈',
  description: 'Stacked color arches — joyful & bold',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'bow-outer',
      label: 'Outer Arch',
      tone: 'accent',
      path: 'M50,400 Q45,250 95,170 Q155,85 240,70 Q325,85 385,170 Q435,250 430,400 L385,400 Q388,265 350,195 Q310,125 240,112 Q170,125 130,195 Q92,265 95,400 Z',
    },
    {
      id: 'bow-mid-outer',
      label: 'Mid Outer',
      tone: 'medium',
      path: 'M95,400 Q92,265 130,195 Q170,125 240,112 Q310,125 350,195 Q388,265 385,400 L345,400 Q348,280 318,218 Q288,162 240,150 Q192,162 162,218 Q132,280 135,400 Z',
    },
    {
      id: 'bow-mid-inner',
      label: 'Mid Inner',
      tone: 'light',
      path: 'M135,400 Q132,280 162,218 Q192,162 240,150 Q288,162 318,218 Q348,280 345,400 L305,400 Q308,295 285,245 Q265,200 240,192 Q215,200 195,245 Q172,295 175,400 Z',
    },
    {
      id: 'bow-inner',
      label: 'Inner Arch',
      tone: 'accent',
      path: 'M175,400 Q172,295 195,245 Q215,200 240,192 Q265,200 285,245 Q308,295 305,400 Z',
    },
  ],
  lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
  mediumTextures: ['linen-mustard', 'suede-camel', 'boucle-oat', 'linen-sage'],
  darkTextures: ['velvet-rust', 'suede-terracotta', 'leather-cognac'],
  accentTextures: ['boucle-blush', 'suede-lavender', 'linen-dusty-rose', 'velvet-sapphire'],
};

export const vibes: Vibe[] = [sunset, ocean, solarSystem, cat, dog, fruitBowl, mushroom, beehive, cactus, nyBuildings, rainbow];
