import { Vibe, FrameTemplate, TemplateSection } from '@/types/studio';

// ── Frame Templates ──

const horizonStack: FrameTemplate = {
  id: 'horizon-stack',
  name: 'Horizon Stack',
  sections: [
    { id: 'h1', x: 0, y: 0, width: 100, height: 20, shape: 'rectangle', tone: 'light' },
    { id: 'h2', x: 0, y: 20, width: 100, height: 20, shape: 'rectangle', tone: 'light' },
    { id: 'h3', x: 0, y: 40, width: 100, height: 20, shape: 'rectangle', tone: 'medium' },
    { id: 'h4', x: 0, y: 60, width: 100, height: 20, shape: 'rectangle', tone: 'medium' },
    { id: 'h5', x: 0, y: 80, width: 100, height: 20, shape: 'rectangle', tone: 'dark' },
  ],
};

const floatingCircles: FrameTemplate = {
  id: 'floating-circles',
  name: 'Floating Circles',
  sections: [
    // large center circle
    { id: 'fc-main', x: 25, y: 15, width: 50, height: 50, shape: 'circle', tone: 'accent' },
    // smaller orbiting circles
    { id: 'fc-s1', x: 5, y: 5, width: 22, height: 22, shape: 'circle', tone: 'accent' },
    { id: 'fc-s2', x: 72, y: 8, width: 20, height: 20, shape: 'circle', tone: 'medium' },
    { id: 'fc-s3', x: 8, y: 65, width: 18, height: 18, shape: 'circle', tone: 'medium' },
    { id: 'fc-s4', x: 70, y: 68, width: 24, height: 24, shape: 'circle', tone: 'accent' },
    { id: 'fc-s5', x: 40, y: 75, width: 16, height: 16, shape: 'circle', tone: 'light' },
  ],
};

const softLayers: FrameTemplate = {
  id: 'soft-layers',
  name: 'Soft Layers',
  sections: [
    { id: 'sl1', x: 0, y: 0, width: 100, height: 25, shape: 'rectangle', tone: 'light' },
    { id: 'sl2', x: 0, y: 25, width: 60, height: 25, shape: 'rectangle', tone: 'light' },
    { id: 'sl3', x: 60, y: 25, width: 40, height: 25, shape: 'rectangle', tone: 'medium' },
    { id: 'sl4', x: 0, y: 50, width: 50, height: 25, shape: 'rectangle', tone: 'medium' },
    { id: 'sl5', x: 50, y: 50, width: 50, height: 25, shape: 'rectangle', tone: 'dark' },
    { id: 'sl6', x: 0, y: 75, width: 100, height: 25, shape: 'rectangle', tone: 'dark' },
  ],
};

const frameInFrame: FrameTemplate = {
  id: 'frame-in-frame',
  name: 'Frame in Frame',
  sections: [
    // outer border (4 strips)
    { id: 'fif-top', x: 0, y: 0, width: 100, height: 18, shape: 'rectangle', tone: 'medium' },
    { id: 'fif-bottom', x: 0, y: 82, width: 100, height: 18, shape: 'rectangle', tone: 'medium' },
    { id: 'fif-left', x: 0, y: 18, width: 18, height: 64, shape: 'rectangle', tone: 'light' },
    { id: 'fif-right', x: 82, y: 18, width: 18, height: 64, shape: 'rectangle', tone: 'light' },
    // center focus
    { id: 'fif-center', x: 18, y: 18, width: 64, height: 64, shape: 'soft-square', tone: 'accent' },
  ],
};

const patchwork: FrameTemplate = {
  id: 'patchwork',
  name: 'Patchwork',
  sections: [
    { id: 'pw1', x: 0, y: 0, width: 45, height: 35, shape: 'rectangle', tone: 'dark' },
    { id: 'pw2', x: 45, y: 0, width: 55, height: 35, shape: 'rectangle', tone: 'medium' },
    { id: 'pw3', x: 0, y: 35, width: 35, height: 32, shape: 'soft-square', tone: 'light' },
    { id: 'pw4', x: 35, y: 35, width: 30, height: 32, shape: 'rectangle', tone: 'accent' },
    { id: 'pw5', x: 65, y: 35, width: 35, height: 32, shape: 'rectangle', tone: 'dark' },
    { id: 'pw6', x: 0, y: 67, width: 50, height: 33, shape: 'rectangle', tone: 'medium' },
    { id: 'pw7', x: 50, y: 67, width: 50, height: 33, shape: 'rectangle', tone: 'light' },
  ],
};

// ── Vibes ──

export const vibes: Vibe[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    description: 'Warm horizon layers — cream to rust to deep brown',
    template: horizonStack,
    texturePool: [],
    lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'boucle-ivory'],
    mediumTextures: ['suede-camel', 'leather-tan', 'linen-mustard', 'boucle-taupe', 'leather-caramel'],
    darkTextures: ['suede-terracotta', 'leather-cognac', 'velvet-rust', 'wood-walnut', 'leather-oxblood'],
    accentTextures: ['boucle-blush', 'linen-dusty-rose'],
  },
  {
    id: 'solar-system',
    name: 'Solar System',
    emoji: '🌌',
    description: 'Celestial circles on a deep dark field',
    template: floatingCircles,
    texturePool: [],
    lightTextures: ['marble-carrara', 'marble-calacatta', 'linen-white'],
    mediumTextures: ['suede-slate', 'suede-charcoal', 'linen-slate', 'marble-rose'],
    darkTextures: ['leather-black', 'velvet-navy', 'marble-nero', 'wood-ebony', 'velvet-forest'],
    accentTextures: ['leather-cognac', 'suede-camel', 'wood-teak', 'velvet-sapphire'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    description: 'Sandy shores fading into deep teal waters',
    template: softLayers,
    texturePool: [],
    lightTextures: ['linen-white', 'linen-natural', 'boucle-cream', 'marble-carrara'],
    mediumTextures: ['linen-sage', 'suede-sage', 'linen-slate', 'marble-verde'],
    darkTextures: ['velvet-navy', 'velvet-emerald', 'velvet-forest', 'velvet-sapphire'],
    accentTextures: ['suede-slate', 'marble-verde'],
  },
  {
    id: 'cozy-soft',
    name: 'Cozy Soft',
    emoji: '🐱',
    description: 'Soft plush textures in a warm framed layout',
    template: frameInFrame,
    texturePool: [],
    lightTextures: ['boucle-cream', 'boucle-ivory', 'linen-white', 'boucle-blush'],
    mediumTextures: ['boucle-oat', 'boucle-taupe', 'suede-camel', 'suede-lavender'],
    darkTextures: ['boucle-charcoal', 'suede-charcoal', 'suede-slate'],
    accentTextures: ['boucle-blush', 'suede-lavender', 'boucle-ivory'],
  },
  {
    id: 'rugged-warm',
    name: 'Rugged Warm',
    emoji: '🐶',
    description: 'Raw patchwork of leather, canvas, and wool',
    template: patchwork,
    texturePool: [],
    lightTextures: ['linen-natural', 'linen-white', 'wood-ash', 'boucle-cream'],
    mediumTextures: ['leather-tan', 'leather-caramel', 'suede-camel', 'wood-oak', 'wood-maple'],
    darkTextures: ['leather-black', 'leather-cognac', 'leather-oxblood', 'wood-walnut', 'leather-olive'],
    accentTextures: ['wood-cherry', 'wood-teak', 'leather-caramel'],
  },
];
