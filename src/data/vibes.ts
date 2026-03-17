import { Vibe } from '@/types/studio';

// ── SUNSET ──
// Curved horizontal bands: sky → mid glow → horizon → warm ground → dark earth
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
      path: 'M0,0 L480,0 L480,100 Q400,120 240,110 Q80,100 0,120 Z',
    },
    {
      id: 'sun-midglow',
      label: 'Mid Glow',
      tone: 'light',
      path: 'M0,120 Q80,100 240,110 Q400,120 480,100 L480,210 Q380,230 240,220 Q100,210 0,235 Z',
    },
    {
      id: 'sun-horizon',
      label: 'Horizon',
      tone: 'medium',
      path: 'M0,235 Q100,210 240,220 Q380,230 480,210 L480,320 Q400,340 240,330 Q80,320 0,345 Z',
    },
    {
      id: 'sun-ground',
      label: 'Ground',
      tone: 'dark',
      path: 'M0,345 Q80,320 240,330 Q400,340 480,320 L480,410 Q380,425 240,418 Q100,410 0,430 Z',
    },
    {
      id: 'sun-earth',
      label: 'Earth',
      tone: 'dark',
      path: 'M0,430 Q100,410 240,418 Q380,425 480,410 L480,480 L0,480 Z',
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
// Simple cat silhouette split into head, body, tail
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
      // Round head with two ears
      path: 'M160,180 L180,110 Q185,100 195,105 Q210,130 240,130 Q270,130 285,105 Q295,100 300,110 L320,180 Q320,220 280,240 L200,240 Q160,220 160,180 Z',
    },
    {
      id: 'cat-body',
      label: 'Body',
      tone: 'medium',
      // Rounded sitting body
      path: 'M160,240 L320,240 Q360,260 370,320 Q375,380 340,420 L140,420 Q105,380 110,320 Q120,260 160,240 Z',
    },
    {
      id: 'cat-tail',
      label: 'Tail',
      tone: 'accent',
      // Curved tail sweeping right
      path: 'M340,380 Q360,370 380,340 Q400,310 420,310 Q440,310 440,330 Q440,350 420,360 Q400,370 370,400 Q350,410 340,420 Z',
    },
  ],
  lightTextures: ['boucle-cream', 'boucle-ivory', 'linen-white', 'boucle-blush'],
  mediumTextures: ['boucle-oat', 'boucle-taupe', 'suede-camel', 'suede-lavender'],
  darkTextures: ['boucle-charcoal', 'suede-charcoal', 'suede-slate'],
  accentTextures: ['boucle-blush', 'suede-lavender', 'boucle-ivory'],
};

// ── DOG ──
// Simple dog silhouette: head, ear, body, tail
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
      // Square-ish dog head with snout
      path: 'M150,160 Q150,120 190,110 L290,110 Q330,120 330,160 L330,220 L340,250 Q340,270 320,270 L160,270 Q140,270 140,250 L150,220 Z',
    },
    {
      id: 'dog-ear',
      label: 'Ear',
      tone: 'dark',
      // Floppy ear on right side
      path: 'M310,110 Q340,90 360,100 Q380,110 375,150 Q370,190 340,210 L330,200 L330,160 Q330,130 310,110 Z',
    },
    {
      id: 'dog-body',
      label: 'Body',
      tone: 'medium',
      // Stocky body
      path: 'M130,270 L350,270 Q390,290 400,340 Q410,400 380,430 L100,430 Q70,400 80,340 Q90,290 130,270 Z',
    },
    {
      id: 'dog-tail',
      label: 'Tail',
      tone: 'accent',
      // Short upward tail
      path: 'M380,330 Q400,300 420,280 Q435,270 440,280 Q445,295 430,320 Q415,340 400,360 Q390,370 380,360 Z',
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
