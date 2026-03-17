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
// Chunky, rounded sitting dog — same plush style as cat
// 3 simple sections: head (with ear bump), body, tail
// No facial features, bold & easy to cut with scissors
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
      // Big rounded head with one floppy ear bump on the right, no face
      path: 'M170,200 Q165,160 180,130 Q195,105 220,95 L270,95 Q300,100 315,115 Q335,95 355,90 Q375,88 378,108 Q380,130 365,155 Q350,170 330,175 Q325,165 310,145 Q305,155 305,200 Q305,230 280,240 L200,240 Q170,230 170,200 Z',
    },
    {
      id: 'dog-body',
      label: 'Body',
      tone: 'light',
      // Wide, chunky sitting body — pear shape, grounded
      path: 'M170,240 L310,240 Q370,270 380,335 Q385,400 350,430 L130,430 Q95,400 100,335 Q110,270 170,240 Z',
    },
    {
      id: 'dog-tail',
      label: 'Tail',
      tone: 'accent',
      // Thick curved tail sweeping right — chunky, matches cat tail style
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

export const vibes: Vibe[] = [sunset, ocean, solarSystem, cat, dog];
