import { Vibe } from '@/types/studio';

/** Helper: Generate an SVG circle path */
function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

// ── SUNSET ──
// Complex layered sunset with sun disc, cloud wisps, and many gradient bands
const sunset: Vibe = {
  id: 'sunset',
  name: 'Sunset',
  emoji: '🌅',
  description: 'Rich layered sunset with sun, clouds & horizon',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'sun-high-sky',
      label: 'High Sky',
      tone: 'light',
      path: 'M0,0 L480,0 L480,55 Q400,68 320,60 Q240,52 160,65 Q80,78 0,62 Z',
    },
    {
      id: 'sun-upper-sky',
      label: 'Upper Sky',
      tone: 'light',
      path: 'M0,62 Q80,78 160,65 Q240,52 320,60 Q400,68 480,55 L480,110 Q410,125 340,118 Q270,108 200,120 Q130,132 60,122 Q30,117 0,125 Z',
    },
    {
      id: 'sun-cloud-left',
      label: 'Cloud Left',
      tone: 'light',
      path: 'M30,100 Q20,85 50,78 Q80,72 110,80 Q130,88 125,102 Q118,115 90,118 Q55,120 35,112 Z',
    },
    {
      id: 'sun-cloud-right',
      label: 'Cloud Right',
      tone: 'light',
      path: 'M340,82 Q330,68 365,62 Q400,58 430,68 Q452,78 448,92 Q442,105 415,108 Q380,110 355,102 Q338,95 340,82 Z',
    },
    {
      id: 'sun-disc',
      label: 'Sun',
      tone: 'accent',
      path: circlePath(240, 165, 52),
    },
    {
      id: 'sun-halo',
      label: 'Sun Halo',
      tone: 'accent',
      // Ring around the sun
      path: `M240,100 A65,65 0 1,1 240,230 A65,65 0 1,1 240,100 Z M240,113 A52,52 0 1,0 240,217 A52,52 0 1,0 240,113 Z`,
    },
    {
      id: 'sun-mid-upper',
      label: 'Mid Upper Glow',
      tone: 'medium',
      path: 'M0,125 Q30,117 60,122 Q130,132 200,120 Q270,108 340,118 Q410,125 480,110 L480,195 Q400,215 320,205 Q240,192 160,210 Q80,225 0,208 Z',
    },
    {
      id: 'sun-mid-glow',
      label: 'Mid Glow',
      tone: 'medium',
      path: 'M0,208 Q80,225 160,210 Q240,192 320,205 Q400,215 480,195 L480,270 Q410,295 330,280 Q250,262 170,285 Q90,305 0,288 Z',
    },
    {
      id: 'sun-lower-glow',
      label: 'Lower Glow',
      tone: 'dark',
      path: 'M0,288 Q90,305 170,285 Q250,262 330,280 Q410,295 480,270 L480,340 Q400,360 310,348 Q220,335 130,355 Q60,368 0,352 Z',
    },
    {
      id: 'sun-horizon-band',
      label: 'Horizon Band',
      tone: 'dark',
      path: 'M0,352 Q60,368 130,355 Q220,335 310,348 Q400,360 480,340 L480,395 Q400,412 310,402 Q220,392 130,408 Q60,418 0,405 Z',
    },
    {
      id: 'sun-foreground',
      label: 'Foreground',
      tone: 'dark',
      path: 'M0,405 Q60,418 130,408 Q220,392 310,402 Q400,412 480,395 L480,440 Q380,455 280,448 Q180,440 80,452 Q40,458 0,450 Z',
    },
    {
      id: 'sun-ground',
      label: 'Ground',
      tone: 'dark',
      path: 'M0,450 Q40,458 80,452 Q180,440 280,448 Q380,455 480,440 L480,480 L0,480 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── OCEAN ──
// Complex ocean with sky layers, sun reflection, wave crests, seafoam, rocks, and sand
const ocean: Vibe = {
  id: 'ocean',
  name: 'Ocean',
  emoji: '🌊',
  description: 'Deep ocean scene with waves, foam, rocks & sand',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'ocean-sky-high',
      label: 'Sky',
      tone: 'light',
      path: 'M0,0 L480,0 L480,50 Q400,60 320,55 Q240,48 160,58 Q80,68 0,55 Z',
    },
    {
      id: 'ocean-sky-low',
      label: 'Low Sky',
      tone: 'light',
      path: 'M0,55 Q80,68 160,58 Q240,48 320,55 Q400,60 480,50 L480,95 Q420,108 360,100 Q300,90 240,102 Q180,114 120,105 Q60,96 0,108 Z',
    },
    {
      id: 'ocean-horizon',
      label: 'Horizon Line',
      tone: 'medium',
      path: 'M0,108 Q60,96 120,105 Q180,114 240,102 Q300,90 360,100 Q420,108 480,95 L480,130 Q400,140 320,135 Q240,128 160,138 Q80,148 0,135 Z',
    },
    {
      id: 'ocean-deep-far',
      label: 'Far Water',
      tone: 'dark',
      path: 'M0,135 Q80,148 160,138 Q240,128 320,135 Q400,140 480,130 L480,185 Q410,202 340,190 Q270,178 200,195 Q130,212 60,198 Q30,192 0,200 Z',
    },
    {
      id: 'ocean-reflection',
      label: 'Sun Reflection',
      tone: 'accent',
      // Elongated shimmer on the water
      path: 'M200,145 Q210,138 240,136 Q270,138 280,145 L285,178 Q275,185 240,188 Q205,185 195,178 Z',
    },
    {
      id: 'ocean-mid-wave',
      label: 'Mid Wave',
      tone: 'dark',
      path: 'M0,200 Q30,192 60,198 Q130,212 200,195 Q270,178 340,190 Q410,202 480,185 L480,240 Q420,262 350,248 Q280,232 210,252 Q140,272 70,258 Q30,250 0,260 Z',
    },
    {
      id: 'ocean-wave-crest',
      label: 'Wave Crest',
      tone: 'light',
      // Thin foam crest on top of the big wave
      path: 'M0,260 Q30,250 70,258 Q140,272 210,252 Q280,232 350,248 Q420,262 480,240 L480,260 Q430,278 360,268 Q290,255 220,270 Q150,285 80,275 Q35,268 0,278 Z',
    },
    {
      id: 'ocean-mid-body',
      label: 'Mid Body',
      tone: 'medium',
      path: 'M0,278 Q35,268 80,275 Q150,285 220,270 Q290,255 360,268 Q430,278 480,260 L480,320 Q410,342 340,328 Q270,312 200,332 Q130,352 60,338 Q25,330 0,342 Z',
    },
    {
      id: 'ocean-shallow',
      label: 'Shallow Water',
      tone: 'medium',
      path: 'M0,342 Q25,330 60,338 Q130,352 200,332 Q270,312 340,328 Q410,342 480,320 L480,375 Q420,392 350,380 Q280,368 210,385 Q140,400 70,390 Q30,385 0,395 Z',
    },
    {
      id: 'ocean-rock-left',
      label: 'Rock Left',
      tone: 'dark',
      path: 'M30,395 Q22,370 40,358 Q58,348 78,355 Q92,365 88,385 Q82,398 65,402 Q42,405 30,395 Z',
    },
    {
      id: 'ocean-rock-right',
      label: 'Rock Right',
      tone: 'dark',
      path: 'M385,388 Q378,368 395,355 Q412,345 430,352 Q445,362 442,382 Q438,395 422,400 Q398,404 385,388 Z',
    },
    {
      id: 'ocean-seafoam',
      label: 'Seafoam',
      tone: 'light',
      path: 'M0,395 Q30,385 70,390 Q140,400 210,385 Q280,368 350,380 Q420,392 480,375 L480,415 Q400,428 320,420 Q240,412 160,425 Q80,435 0,422 Z',
    },
    {
      id: 'ocean-wet-sand',
      label: 'Wet Sand',
      tone: 'accent',
      path: 'M0,422 Q80,435 160,425 Q240,412 320,420 Q400,428 480,415 L480,450 Q380,458 280,452 Q180,446 80,455 Q40,458 0,455 Z',
    },
    {
      id: 'ocean-sand',
      label: 'Dry Sand',
      tone: 'accent',
      path: 'M0,455 Q40,458 80,455 Q180,446 280,452 Q380,458 480,450 L480,480 L0,480 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── SOLAR SYSTEM ──
// Complex solar system with sun, planets of different sizes, rings, moons, asteroid belt
const solarSystem: Vibe = {
  id: 'solar-system',
  name: 'Solar System',
  emoji: '🌌',
  description: 'Celestial bodies, rings & moons floating in space',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'solar-bg',
      label: 'Space',
      tone: 'dark',
      path: 'M0,0 L480,0 L480,480 L0,480 Z',
    },
    {
      id: 'solar-sun',
      label: 'Sun',
      tone: 'accent',
      // Large sun at left edge, partially off-canvas
      path: 'M-30,240 A110,110 0 1,1 -30,20 A110,110 0 1,1 -30,240 Z',
    },
    {
      id: 'solar-sun-corona',
      label: 'Corona',
      tone: 'accent',
      // Corona ring around the sun
      path: `M-30,240 A128,128 0 1,0 -30,0 A128,128 0 1,0 -30,240 Z M-30,230 A110,110 0 1,1 -30,10 A110,110 0 1,1 -30,230 Z`,
    },
    {
      id: 'solar-mercury',
      label: 'Mercury',
      tone: 'medium',
      path: circlePath(130, 145, 14),
    },
    {
      id: 'solar-venus',
      label: 'Venus',
      tone: 'accent',
      path: circlePath(175, 320, 22),
    },
    {
      id: 'solar-earth',
      label: 'Earth',
      tone: 'medium',
      path: circlePath(235, 190, 26),
    },
    {
      id: 'solar-earth-moon',
      label: 'Moon',
      tone: 'light',
      path: circlePath(268, 172, 8),
    },
    {
      id: 'solar-mars',
      label: 'Mars',
      tone: 'accent',
      path: circlePath(280, 400, 20),
    },
    {
      id: 'solar-jupiter',
      label: 'Jupiter',
      tone: 'medium',
      // Large gas giant
      path: circlePath(350, 230, 48),
    },
    {
      id: 'solar-jupiter-band',
      label: 'Jupiter Band',
      tone: 'dark',
      // Horizontal band across Jupiter
      path: 'M302,222 Q326,216 350,215 Q374,216 398,222 L398,238 Q374,244 350,245 Q326,244 302,238 Z',
    },
    {
      id: 'solar-saturn',
      label: 'Saturn',
      tone: 'accent',
      path: circlePath(420, 85, 32),
    },
    {
      id: 'solar-saturn-ring',
      label: 'Saturn Ring',
      tone: 'light',
      // Elliptical ring around Saturn
      path: 'M365,85 Q365,68 420,62 Q475,68 475,85 Q475,92 420,96 Q365,92 365,85 Z M378,85 Q378,75 420,70 Q462,75 462,85 Q462,90 420,93 Q378,90 378,85 Z',
    },
    {
      id: 'solar-neptune',
      label: 'Neptune',
      tone: 'dark',
      path: circlePath(445, 380, 24),
    },
    {
      id: 'solar-asteroid-1',
      label: 'Asteroid',
      tone: 'medium',
      path: circlePath(155, 60, 7),
    },
    {
      id: 'solar-asteroid-2',
      label: 'Asteroid',
      tone: 'medium',
      path: circlePath(310, 80, 5),
    },
    {
      id: 'solar-asteroid-3',
      label: 'Asteroid',
      tone: 'medium',
      path: circlePath(200, 430, 6),
    },
    {
      id: 'solar-asteroid-4',
      label: 'Asteroid',
      tone: 'light',
      path: circlePath(380, 450, 8),
    },
    {
      id: 'solar-comet',
      label: 'Comet',
      tone: 'light',
      // Small comet with tail
      path: 'M460,30 Q465,25 470,28 Q472,32 468,36 L440,55 Q435,52 438,48 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── CAT ──
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
      path: 'M175,195 Q170,155 185,130 L200,90 Q205,80 215,88 Q220,110 240,115 Q260,110 265,88 Q275,80 280,90 L295,130 Q310,155 305,195 Q305,225 280,235 L200,235 Q175,225 175,195 Z',
    },
    {
      id: 'cat-body',
      label: 'Body',
      tone: 'medium',
      path: 'M175,235 L305,235 Q365,265 375,330 Q380,395 345,425 L135,425 Q100,395 105,330 Q115,265 175,235 Z',
    },
    {
      id: 'cat-tail',
      label: 'Tail',
      tone: 'accent',
      path: 'M345,370 Q370,355 390,330 Q410,300 430,295 Q455,290 458,315 Q460,340 440,360 Q415,385 385,405 Q360,420 345,425 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── DOG ──
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
      path: 'M165,195 Q160,150 180,120 Q200,95 240,90 Q280,95 300,120 Q320,150 315,195 Q315,225 290,238 L190,238 Q165,225 165,195 Z',
    },
    {
      id: 'dog-ears',
      label: 'Ears',
      tone: 'dark',
      path: 'M180,120 Q155,105 135,110 Q115,118 112,145 Q110,175 122,205 Q132,228 150,235 L165,225 Q165,195 165,170 Q165,140 180,120 Z M300,120 Q325,105 345,110 Q365,118 368,145 Q370,175 358,205 Q348,228 330,235 L315,225 Q315,195 315,170 Q315,140 300,120 Z',
    },
    {
      id: 'dog-body',
      label: 'Body',
      tone: 'light',
      path: 'M168,238 L312,238 Q370,268 380,335 Q385,400 350,430 L130,430 Q95,400 100,335 Q110,268 168,238 Z',
    },
    {
      id: 'dog-tail',
      label: 'Tail',
      tone: 'accent',
      path: 'M350,375 Q375,358 395,330 Q415,298 435,292 Q458,288 460,312 Q462,338 442,360 Q418,388 390,410 Q365,425 350,430 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── FRUIT BOWL ──
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
      path: 'M120,175 Q115,130 140,110 Q165,90 195,95 Q225,100 235,130 Q245,160 235,190 Q225,210 200,215 Q160,220 135,205 Q115,195 120,175 Z',
    },
    {
      id: 'fruit-2',
      label: 'Fruit Center',
      tone: 'medium',
      path: 'M200,155 Q195,110 220,88 Q245,70 275,75 Q305,82 315,110 Q325,140 318,170 Q310,195 285,205 Q255,215 230,205 Q205,192 200,155 Z',
    },
    {
      id: 'fruit-3',
      label: 'Fruit Right',
      tone: 'accent',
      path: 'M295,180 Q290,140 310,118 Q330,100 355,105 Q380,112 388,140 Q395,170 385,198 Q375,218 350,222 Q320,225 305,210 Q292,200 295,180 Z',
    },
    {
      id: 'bowl-rim',
      label: 'Bowl Rim',
      tone: 'dark',
      path: 'M80,225 Q85,210 140,200 Q240,185 340,200 Q400,210 405,225 L410,255 Q400,245 340,235 Q240,220 140,235 Q90,245 80,255 Z',
    },
    {
      id: 'bowl-base',
      label: 'Bowl',
      tone: 'medium',
      path: 'M80,255 Q90,245 140,235 Q240,220 340,235 Q400,245 410,255 Q420,320 390,380 Q360,420 240,425 Q120,420 90,380 Q60,320 80,255 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── MUSHROOM ──
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
      path: 'M95,210 Q90,140 130,95 Q175,55 240,50 Q305,55 350,95 Q390,140 385,210 Q380,230 350,235 L130,235 Q100,230 95,210 Z',
    },
    {
      id: 'mush-cap-under',
      label: 'Cap Underside',
      tone: 'medium',
      path: 'M130,235 L350,235 Q355,260 340,272 L140,272 Q125,260 130,235 Z',
    },
    {
      id: 'mush-stem',
      label: 'Stem',
      tone: 'light',
      path: 'M185,272 L295,272 Q310,290 315,340 Q320,390 310,410 L170,410 Q160,390 165,340 Q170,290 185,272 Z',
    },
    {
      id: 'mush-base',
      label: 'Base',
      tone: 'dark',
      path: 'M130,410 L350,410 Q370,420 375,440 Q370,458 340,462 L140,462 Q110,458 105,440 Q110,420 130,410 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── BEEHIVE ──
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
      path: 'M100,380 Q95,280 120,200 Q155,120 240,90 Q325,120 360,200 Q385,280 380,380 L345,380 Q348,290 330,220 Q305,150 240,128 Q175,150 150,220 Q132,290 135,380 Z',
    },
    {
      id: 'hive-middle',
      label: 'Middle Arch',
      tone: 'medium',
      path: 'M135,380 Q132,290 150,220 Q175,150 240,128 Q305,150 330,220 Q348,290 345,380 L310,380 Q315,300 300,245 Q280,185 240,168 Q200,185 180,245 Q165,300 170,380 Z',
    },
    {
      id: 'hive-inner',
      label: 'Inner Arch',
      tone: 'accent',
      path: 'M170,380 Q165,300 180,245 Q200,185 240,168 Q280,185 300,245 Q315,300 310,380 Z',
    },
    {
      id: 'hive-base',
      label: 'Base',
      tone: 'dark',
      path: 'M80,380 L400,380 Q415,395 418,415 Q415,438 395,445 L85,445 Q65,438 62,415 Q65,395 80,380 Z',
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── RAINBOW ──
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
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── MANDALA ──
// Symmetric mandala with concentric rings, petal layers, and geometric accents
const mandala: Vibe = {
  id: 'mandala',
  name: 'Mandala',
  emoji: '🕉️',
  description: 'Intricate mandala with petal rings & geometric symmetry',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'mandala-bg',
      label: 'Background',
      tone: 'light',
      path: 'M0,0 L480,0 L480,480 L0,480 Z',
    },
    {
      id: 'mandala-outer-ring',
      label: 'Outer Ring',
      tone: 'dark',
      path: `M240,20 A220,220 0 1,1 240,460 A220,220 0 1,1 240,20 Z M240,45 A195,195 0 1,0 240,435 A195,195 0 1,0 240,45 Z`,
    },
    {
      id: 'mandala-petal-n',
      label: 'North Petal',
      tone: 'accent',
      path: 'M240,45 Q210,100 200,140 Q220,120 240,115 Q260,120 280,140 Q270,100 240,45 Z',
    },
    {
      id: 'mandala-petal-ne',
      label: 'NE Petal',
      tone: 'accent',
      path: 'M378,102 Q340,140 330,175 Q340,155 358,148 Q375,148 390,165 Q395,130 378,102 Z',
    },
    {
      id: 'mandala-petal-e',
      label: 'East Petal',
      tone: 'accent',
      path: 'M435,240 Q380,210 340,200 Q360,220 365,240 Q360,260 340,280 Q380,270 435,240 Z',
    },
    {
      id: 'mandala-petal-se',
      label: 'SE Petal',
      tone: 'accent',
      path: 'M378,378 Q340,340 330,305 Q340,325 358,332 Q375,332 390,315 Q395,350 378,378 Z',
    },
    {
      id: 'mandala-petal-s',
      label: 'South Petal',
      tone: 'accent',
      path: 'M240,435 Q210,380 200,340 Q220,360 240,365 Q260,360 280,340 Q270,380 240,435 Z',
    },
    {
      id: 'mandala-petal-sw',
      label: 'SW Petal',
      tone: 'accent',
      path: 'M102,378 Q140,340 150,305 Q140,325 122,332 Q105,332 90,315 Q85,350 102,378 Z',
    },
    {
      id: 'mandala-petal-w',
      label: 'West Petal',
      tone: 'accent',
      path: 'M45,240 Q100,210 140,200 Q120,220 115,240 Q120,260 140,280 Q100,270 45,240 Z',
    },
    {
      id: 'mandala-petal-nw',
      label: 'NW Petal',
      tone: 'accent',
      path: 'M102,102 Q140,140 150,175 Q140,155 122,148 Q105,148 90,165 Q85,130 102,102 Z',
    },
    {
      id: 'mandala-mid-ring',
      label: 'Middle Ring',
      tone: 'medium',
      path: `M240,100 A140,140 0 1,1 240,380 A140,140 0 1,1 240,100 Z M240,130 A110,110 0 1,0 240,350 A110,110 0 1,0 240,130 Z`,
    },
    {
      id: 'mandala-inner-petal-n',
      label: 'Inner N Petal',
      tone: 'medium',
      path: 'M240,130 Q225,165 218,190 Q230,178 240,175 Q250,178 262,190 Q255,165 240,130 Z',
    },
    {
      id: 'mandala-inner-petal-e',
      label: 'Inner E Petal',
      tone: 'medium',
      path: 'M350,240 Q315,225 290,218 Q302,230 305,240 Q302,250 290,262 Q315,255 350,240 Z',
    },
    {
      id: 'mandala-inner-petal-s',
      label: 'Inner S Petal',
      tone: 'medium',
      path: 'M240,350 Q225,315 218,290 Q230,302 240,305 Q250,302 262,290 Q255,315 240,350 Z',
    },
    {
      id: 'mandala-inner-petal-w',
      label: 'Inner W Petal',
      tone: 'medium',
      path: 'M130,240 Q165,225 190,218 Q178,230 175,240 Q178,250 190,262 Q165,255 130,240 Z',
    },
    {
      id: 'mandala-inner-ring',
      label: 'Inner Ring',
      tone: 'dark',
      path: `M240,170 A70,70 0 1,1 240,310 A70,70 0 1,1 240,170 Z M240,190 A50,50 0 1,0 240,290 A50,50 0 1,0 240,190 Z`,
    },
    {
      id: 'mandala-center',
      label: 'Center',
      tone: 'accent',
      path: circlePath(240, 240, 50),
    },
    {
      id: 'mandala-core',
      label: 'Core',
      tone: 'light',
      path: circlePath(240, 240, 22),
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── MANDALA FLOWER ──
// Floral mandala with layered petal rosette
const mandalaFlower: Vibe = {
  id: 'mandala-flower',
  name: 'Mandala Flower',
  emoji: '🌸',
  description: 'Floral mandala with layered petal rosette & decorative border',
  viewBox: '0 0 480 480',
  sections: [
    {
      id: 'mf-bg',
      label: 'Background',
      tone: 'light',
      path: 'M0,0 L480,0 L480,480 L0,480 Z',
    },
    {
      id: 'mf-corner-tl',
      label: 'Corner TL',
      tone: 'dark',
      path: 'M0,0 L80,0 Q60,20 50,50 Q40,80 0,80 Z',
    },
    {
      id: 'mf-corner-tr',
      label: 'Corner TR',
      tone: 'dark',
      path: 'M400,0 L480,0 L480,80 Q440,80 430,50 Q420,20 400,0 Z',
    },
    {
      id: 'mf-corner-bl',
      label: 'Corner BL',
      tone: 'dark',
      path: 'M0,400 Q40,400 50,430 Q60,460 80,480 L0,480 Z',
    },
    {
      id: 'mf-corner-br',
      label: 'Corner BR',
      tone: 'dark',
      path: 'M480,400 L480,480 L400,480 Q420,460 430,430 Q440,400 480,400 Z',
    },
    {
      id: 'mf-outer-circle',
      label: 'Outer Circle',
      tone: 'medium',
      path: `M240,30 A210,210 0 1,1 240,450 A210,210 0 1,1 240,30 Z M240,60 A180,180 0 1,0 240,420 A180,180 0 1,0 240,60 Z`,
    },
    {
      id: 'mf-lg-petal-1',
      label: 'Large Petal 1',
      tone: 'accent',
      path: 'M240,60 Q200,130 190,170 Q215,145 240,140 Q265,145 290,170 Q280,130 240,60 Z',
    },
    {
      id: 'mf-lg-petal-2',
      label: 'Large Petal 2',
      tone: 'accent',
      path: 'M395,135 Q340,170 320,200 Q340,185 358,185 Q378,190 388,210 Q400,175 395,135 Z',
    },
    {
      id: 'mf-lg-petal-3',
      label: 'Large Petal 3',
      tone: 'accent',
      path: 'M420,240 Q370,215 340,210 Q355,228 358,240 Q355,252 340,270 Q370,265 420,240 Z',
    },
    {
      id: 'mf-lg-petal-4',
      label: 'Large Petal 4',
      tone: 'accent',
      path: 'M395,345 Q340,310 320,280 Q340,295 358,295 Q378,290 388,270 Q400,305 395,345 Z',
    },
    {
      id: 'mf-lg-petal-5',
      label: 'Large Petal 5',
      tone: 'accent',
      path: 'M240,420 Q200,350 190,310 Q215,335 240,340 Q265,335 290,310 Q280,350 240,420 Z',
    },
    {
      id: 'mf-lg-petal-6',
      label: 'Large Petal 6',
      tone: 'accent',
      path: 'M85,345 Q140,310 160,280 Q140,295 122,295 Q102,290 92,270 Q80,305 85,345 Z',
    },
    {
      id: 'mf-lg-petal-7',
      label: 'Large Petal 7',
      tone: 'accent',
      path: 'M60,240 Q110,215 140,210 Q125,228 122,240 Q125,252 140,270 Q110,265 60,240 Z',
    },
    {
      id: 'mf-lg-petal-8',
      label: 'Large Petal 8',
      tone: 'accent',
      path: 'M85,135 Q140,170 160,200 Q140,185 122,185 Q102,190 92,210 Q80,175 85,135 Z',
    },
    {
      id: 'mf-inner-circle',
      label: 'Inner Circle',
      tone: 'medium',
      path: `M240,150 A90,90 0 1,1 240,330 A90,90 0 1,1 240,150 Z M240,175 A65,65 0 1,0 240,305 A65,65 0 1,0 240,175 Z`,
    },
    {
      id: 'mf-center-flower',
      label: 'Center Bloom',
      tone: 'accent',
      path: circlePath(240, 240, 65),
    },
    {
      id: 'mf-center-dot',
      label: 'Center Dot',
      tone: 'dark',
      path: circlePath(240, 240, 25),
    },
  ],
  lightTextures: [],
  mediumTextures: [],
  darkTextures: [],
  accentTextures: [],
};

// ── BUTTERFLY ──
const butterfly: Vibe = {
  id: 'butterfly',
  name: 'Butterfly',
  emoji: '🦋',
  description: 'Graceful butterfly with detailed wing sections',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'butterfly-upper-left', label: 'Upper Left Wing', tone: 'accent',
      path: 'M240,180 Q200,140 160,100 Q120,65 80,70 Q45,78 40,120 Q38,165 65,200 Q95,235 140,250 Q180,258 215,245 Q235,235 240,220 Z' },
    { id: 'butterfly-upper-right', label: 'Upper Right Wing', tone: 'accent',
      path: 'M240,180 Q280,140 320,100 Q360,65 400,70 Q435,78 440,120 Q442,165 415,200 Q385,235 340,250 Q300,258 265,245 Q245,235 240,220 Z' },
    { id: 'butterfly-lower-left', label: 'Lower Left Wing', tone: 'medium',
      path: 'M240,260 Q210,270 170,290 Q130,310 105,340 Q85,370 95,400 Q108,425 140,430 Q175,432 210,410 Q235,390 240,360 Z' },
    { id: 'butterfly-lower-right', label: 'Lower Right Wing', tone: 'medium',
      path: 'M240,260 Q270,270 310,290 Q350,310 375,340 Q395,370 385,400 Q372,425 340,430 Q305,432 270,410 Q245,390 240,360 Z' },
    { id: 'butterfly-body', label: 'Body', tone: 'dark',
      path: 'M232,130 Q236,120 240,110 Q244,120 248,130 L250,360 Q248,390 240,400 Q232,390 230,360 Z' },
    { id: 'butterfly-antenna-l', label: 'Left Antenna', tone: 'dark',
      path: 'M240,130 Q220,95 195,70 Q185,60 180,55 Q175,50 178,48 Q185,48 195,58 Q215,78 235,115 Z' },
    { id: 'butterfly-antenna-r', label: 'Right Antenna', tone: 'dark',
      path: 'M240,130 Q260,95 285,70 Q295,60 300,55 Q305,50 302,48 Q295,48 285,58 Q265,78 245,115 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── BEAR ──
const bear: Vibe = {
  id: 'bear', name: 'Bear', emoji: '🐻',
  description: 'Strong bear silhouette — bold & grounded',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'bear-ear-l', label: 'Left Ear', tone: 'dark',
      path: 'M155,120 Q145,85 160,65 Q178,50 200,60 Q215,72 210,100 Q205,120 195,135 Z' },
    { id: 'bear-ear-r', label: 'Right Ear', tone: 'dark',
      path: 'M325,120 Q335,85 320,65 Q302,50 280,60 Q265,72 270,100 Q275,120 285,135 Z' },
    { id: 'bear-head', label: 'Head', tone: 'medium',
      path: 'M160,155 Q155,120 180,100 Q210,82 240,80 Q270,82 300,100 Q325,120 320,155 Q318,190 295,210 Q270,225 240,228 Q210,225 185,210 Q162,190 160,155 Z' },
    { id: 'bear-snout', label: 'Snout', tone: 'light',
      path: 'M210,175 Q215,160 240,155 Q265,160 270,175 Q272,190 260,200 Q250,208 240,210 Q230,208 220,200 Q208,190 210,175 Z' },
    { id: 'bear-body', label: 'Body', tone: 'medium',
      path: 'M140,228 Q135,260 130,300 Q125,360 140,400 Q160,435 200,445 L280,445 Q320,435 340,400 Q355,360 350,300 Q345,260 340,228 Q300,245 240,248 Q180,245 140,228 Z' },
    { id: 'bear-belly', label: 'Belly', tone: 'light',
      path: 'M190,300 Q195,270 240,265 Q285,270 290,300 Q292,340 280,375 Q260,400 240,405 Q220,400 200,375 Q188,340 190,300 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};



// ── OWL ──
const owl: Vibe = {
  id: 'owl', name: 'Owl', emoji: '🦉',
  description: 'Wise owl with big eyes & feathered wings',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'owl-ear-l', label: 'Left Tuft', tone: 'dark',
      path: 'M170,110 Q155,70 165,50 Q178,35 195,55 Q205,75 200,110 Z' },
    { id: 'owl-ear-r', label: 'Right Tuft', tone: 'dark',
      path: 'M310,110 Q325,70 315,50 Q302,35 285,55 Q275,75 280,110 Z' },
    { id: 'owl-head', label: 'Head', tone: 'medium',
      path: 'M155,150 Q150,110 175,90 Q205,72 240,70 Q275,72 305,90 Q330,110 325,150 Q322,190 300,210 Q275,225 240,228 Q205,225 180,210 Q158,190 155,150 Z' },
    { id: 'owl-eye-l', label: 'Left Eye', tone: 'light', path: circlePath(210, 155, 28) },
    { id: 'owl-eye-r', label: 'Right Eye', tone: 'light', path: circlePath(270, 155, 28) },
    { id: 'owl-pupil-l', label: 'Left Pupil', tone: 'dark', path: circlePath(210, 155, 12) },
    { id: 'owl-pupil-r', label: 'Right Pupil', tone: 'dark', path: circlePath(270, 155, 12) },
    { id: 'owl-beak', label: 'Beak', tone: 'accent',
      path: 'M232,185 L240,205 L248,185 Q242,178 240,175 Q238,178 232,185 Z' },
    { id: 'owl-body', label: 'Body', tone: 'medium',
      path: 'M165,228 Q155,270 150,320 Q148,380 165,420 Q185,445 215,450 L265,450 Q295,445 315,420 Q332,380 330,320 Q325,270 315,228 Q280,245 240,248 Q200,245 165,228 Z' },
    { id: 'owl-chest', label: 'Chest', tone: 'light',
      path: 'M200,280 Q205,260 240,255 Q275,260 280,280 Q285,320 278,360 Q265,390 240,395 Q215,390 202,360 Q195,320 200,280 Z' },
    { id: 'owl-wing-l', label: 'Left Wing', tone: 'dark',
      path: 'M155,270 Q120,290 95,330 Q75,370 80,400 Q88,425 110,420 Q135,412 155,385 Q168,355 165,320 Z' },
    { id: 'owl-wing-r', label: 'Right Wing', tone: 'dark',
      path: 'M325,270 Q360,290 385,330 Q405,370 400,400 Q392,425 370,420 Q345,412 325,385 Q312,355 315,320 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── TURTLE ──
// Side-profile sea turtle with domed shell, flippers, and hexagonal shell pattern
const turtle: Vibe = {
  id: 'turtle', name: 'Turtle', emoji: '🐢',
  description: 'Sea turtle with domed shell & flipper details',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'turtle-head', label: 'Head', tone: 'medium',
      path: 'M108,265 Q88,250 72,235 Q58,218 55,200 Q55,182 68,172 Q85,162 105,168 Q122,175 132,192 Q138,210 135,230 Q132,248 125,260 Z' },
    { id: 'turtle-eye', label: 'Eye', tone: 'dark',
      path: 'M92,195 Q96,188 104,188 Q112,192 112,200 Q108,206 100,206 Q92,202 92,195 Z' },
    { id: 'turtle-shell-outer', label: 'Shell Outer', tone: 'dark',
      path: 'M140,210 Q148,148 188,108 Q228,78 275,72 Q322,78 358,108 Q392,145 398,210 Q400,255 395,290 Q385,330 362,355 Q335,378 300,388 Q260,395 225,388 Q190,378 168,355 Q150,330 142,290 Q138,252 140,210 Z' },
    { id: 'turtle-shell-dome', label: 'Shell Dome', tone: 'accent',
      path: 'M165,205 Q172,155 205,122 Q240,98 278,95 Q318,100 348,128 Q375,160 380,210 Q382,248 375,282 Q365,318 345,342 Q320,362 288,370 Q252,375 222,368 Q195,355 178,335 Q162,310 158,278 Q155,242 165,205 Z' },
    { id: 'turtle-shell-hex1', label: 'Shell Pattern 1', tone: 'medium',
      path: 'M245,115 Q262,112 278,118 Q290,128 288,145 Q282,158 268,162 Q252,160 242,148 Q235,135 240,122 Z' },
    { id: 'turtle-shell-hex2', label: 'Shell Pattern 2', tone: 'medium',
      path: 'M205,165 Q222,158 238,162 Q250,172 248,190 Q242,205 228,210 Q212,208 202,196 Q196,182 200,170 Z' },
    { id: 'turtle-shell-hex3', label: 'Shell Pattern 3', tone: 'medium',
      path: 'M285,165 Q302,158 318,165 Q328,178 325,195 Q318,210 302,215 Q286,212 278,198 Q272,185 278,170 Z' },
    { id: 'turtle-shell-hex4', label: 'Shell Pattern 4', tone: 'medium',
      path: 'M240,215 Q258,210 275,218 Q285,232 282,250 Q275,265 258,268 Q242,265 234,252 Q228,238 235,222 Z' },
    { id: 'turtle-shell-hex5', label: 'Shell Pattern 5', tone: 'medium',
      path: 'M195,248 Q212,242 228,248 Q238,262 235,280 Q228,295 212,298 Q196,295 188,282 Q182,268 190,252 Z' },
    { id: 'turtle-shell-hex6', label: 'Shell Pattern 6', tone: 'medium',
      path: 'M285,248 Q302,242 318,250 Q328,265 325,282 Q318,298 302,302 Q286,298 278,285 Q272,270 278,255 Z' },
    { id: 'turtle-flipper-front', label: 'Front Flipper', tone: 'dark',
      path: 'M148,295 Q128,308 108,328 Q92,348 82,368 Q78,385 88,392 Q102,395 118,382 Q138,365 152,342 Q160,325 158,308 Z' },
    { id: 'turtle-flipper-back', label: 'Back Flipper', tone: 'dark',
      path: 'M375,310 Q392,322 405,342 Q415,360 412,375 Q405,385 392,382 Q378,372 368,352 Q360,335 365,318 Z' },
    { id: 'turtle-tail', label: 'Tail', tone: 'medium',
      path: 'M388,345 Q402,348 412,342 Q418,335 415,328 Q408,322 398,328 Q390,335 388,342 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── LION ──
const lion: Vibe = {
  id: 'lion', name: 'Lion', emoji: '🦁',
  description: 'Majestic lion with flowing mane',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lion-mane', label: 'Mane', tone: 'accent',
      path: 'M120,130 Q105,90 130,60 Q160,35 200,30 Q240,28 280,30 Q320,35 350,60 Q375,90 360,130 Q370,170 365,210 Q358,250 340,275 Q280,310 240,312 Q200,310 140,275 Q122,250 115,210 Q110,170 120,130 Z' },
    { id: 'lion-face', label: 'Face', tone: 'medium',
      path: 'M170,140 Q168,105 195,85 Q220,72 240,70 Q260,72 285,85 Q312,105 310,140 Q310,180 295,210 Q275,235 240,240 Q205,235 185,210 Q170,180 170,140 Z' },
    { id: 'lion-snout', label: 'Snout', tone: 'light',
      path: 'M210,185 Q215,172 240,168 Q265,172 270,185 Q272,198 262,208 Q252,215 240,218 Q228,215 218,208 Q208,198 210,185 Z' },
    { id: 'lion-nose', label: 'Nose', tone: 'dark',
      path: 'M230,182 Q235,175 240,173 Q245,175 250,182 Q252,188 245,192 Q240,195 235,192 Q228,188 230,182 Z' },
    { id: 'lion-body', label: 'Body', tone: 'medium',
      path: 'M155,290 Q150,320 148,360 Q145,400 158,430 Q175,450 210,455 L270,455 Q305,450 322,430 Q335,400 332,360 Q330,320 325,290 Q290,310 240,312 Q190,310 155,290 Z' },
    { id: 'lion-tail', label: 'Tail', tone: 'accent',
      path: 'M330,380 Q355,365 378,345 Q400,325 418,318 Q435,315 440,328 Q442,345 428,362 Q410,382 388,400 Q368,415 348,425 Q335,430 332,420 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── RABBIT ──
const rabbit: Vibe = {
  id: 'rabbit', name: 'Rabbit', emoji: '🐰',
  description: 'Cute bunny with long ears & fluffy tail',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'rabbit-ear-l', label: 'Left Ear', tone: 'medium',
      path: 'M195,145 Q185,90 190,45 Q195,15 210,10 Q225,8 228,35 Q232,70 225,120 Q222,140 215,155 Z' },
    { id: 'rabbit-ear-l-inner', label: 'Left Ear Inner', tone: 'accent',
      path: 'M200,130 Q195,90 198,55 Q202,30 212,28 Q220,28 222,50 Q225,80 220,120 Z' },
    { id: 'rabbit-ear-r', label: 'Right Ear', tone: 'medium',
      path: 'M285,145 Q295,90 290,45 Q285,15 270,10 Q255,8 252,35 Q248,70 255,120 Q258,140 265,155 Z' },
    { id: 'rabbit-ear-r-inner', label: 'Right Ear Inner', tone: 'accent',
      path: 'M280,130 Q285,90 282,55 Q278,30 268,28 Q260,28 258,50 Q255,80 260,120 Z' },
    { id: 'rabbit-head', label: 'Head', tone: 'light',
      path: 'M170,200 Q165,160 185,140 Q210,120 240,118 Q270,120 295,140 Q315,160 310,200 Q308,235 288,255 Q265,270 240,272 Q215,270 192,255 Q172,235 170,200 Z' },
    { id: 'rabbit-nose', label: 'Nose', tone: 'accent',
      path: 'M232,225 Q236,218 240,216 Q244,218 248,225 Q250,232 240,236 Q230,232 232,225 Z' },
    { id: 'rabbit-body', label: 'Body', tone: 'light',
      path: 'M170,272 Q158,310 155,355 Q152,400 168,430 Q188,452 220,458 L260,458 Q292,452 312,430 Q328,400 325,355 Q322,310 310,272 Q280,288 240,290 Q200,288 170,272 Z' },
    { id: 'rabbit-belly', label: 'Belly', tone: 'medium',
      path: 'M200,340 Q205,315 240,310 Q275,315 280,340 Q282,375 272,405 Q258,425 240,428 Q222,425 208,405 Q198,375 200,340 Z' },
    { id: 'rabbit-tail', label: 'Tail', tone: 'light',
      path: 'M320,395 Q340,385 355,388 Q368,395 365,412 Q358,425 342,428 Q328,425 322,415 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── DINOSAUR ──
const dinosaur: Vibe = {
  id: 'dinosaur', name: 'Dinosaur', emoji: '🦕',
  description: 'Friendly long-neck dino with spiky back',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'dino-head', label: 'Head', tone: 'medium',
      path: 'M95,130 Q85,100 95,78 Q110,58 135,55 Q160,58 170,78 Q178,100 170,130 Q165,150 150,160 Q130,165 115,155 Q98,145 95,130 Z' },
    { id: 'dino-eye', label: 'Eye', tone: 'light', path: circlePath(140, 100, 12) },
    { id: 'dino-neck', label: 'Neck', tone: 'medium',
      path: 'M120,160 Q125,200 135,240 Q148,280 170,310 Q190,295 210,288 L195,240 Q180,200 170,165 Q160,158 145,162 Z' },
    { id: 'dino-body', label: 'Body', tone: 'dark',
      path: 'M170,310 Q175,280 210,265 Q260,250 315,255 Q365,265 390,290 Q408,315 405,350 Q400,385 375,405 Q345,420 300,425 L185,425 Q160,420 148,400 Q138,378 140,350 Q145,325 170,310 Z' },
    { id: 'dino-belly', label: 'Belly', tone: 'light',
      path: 'M195,340 Q205,315 270,308 Q340,315 355,340 Q362,370 350,395 Q330,415 280,418 Q215,415 198,395 Q188,370 195,340 Z' },
    { id: 'dino-spike-1', label: 'Spike 1', tone: 'accent', path: 'M200,265 L210,235 L225,262 Z' },
    { id: 'dino-spike-2', label: 'Spike 2', tone: 'accent', path: 'M245,255 L258,222 L275,252 Z' },
    { id: 'dino-spike-3', label: 'Spike 3', tone: 'accent', path: 'M295,258 L310,228 L328,258 Z' },
    { id: 'dino-spike-4', label: 'Spike 4', tone: 'accent', path: 'M345,268 L358,240 L372,272 Z' },
    { id: 'dino-tail', label: 'Tail', tone: 'medium',
      path: 'M390,350 Q410,345 430,335 Q448,322 458,312 Q465,305 468,310 Q470,320 458,338 Q442,358 420,375 Q400,388 385,395 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── GIRAFFE ──
const giraffe: Vibe = {
  id: 'giraffe', name: 'Giraffe', emoji: '🦒',
  description: 'Tall giraffe with spotted neck & long legs',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'giraffe-horns', label: 'Horns', tone: 'dark',
      path: 'M200,55 Q198,35 205,25 Q212,20 215,30 Q218,42 215,60 Z M250,55 Q248,35 255,25 Q262,20 265,30 Q268,42 265,60 Z' },
    { id: 'giraffe-head', label: 'Head', tone: 'medium',
      path: 'M185,95 Q182,68 200,55 Q218,48 235,48 Q252,48 268,55 Q285,68 282,95 Q280,115 268,128 Q252,138 235,140 Q218,138 202,128 Q188,115 185,95 Z' },
    { id: 'giraffe-neck', label: 'Neck', tone: 'accent',
      path: 'M205,135 Q200,180 198,230 Q195,280 200,320 Q250,325 280,320 Q275,280 272,230 Q270,180 265,135 Q252,142 235,145 Q218,142 205,135 Z' },
    { id: 'giraffe-spot-1', label: 'Neck Spot 1', tone: 'dark',
      path: 'M215,170 Q220,158 238,155 Q255,158 258,170 Q260,182 250,188 Q235,192 222,188 Q212,182 215,170 Z' },
    { id: 'giraffe-spot-2', label: 'Neck Spot 2', tone: 'dark',
      path: 'M218,220 Q222,208 238,205 Q254,208 258,220 Q260,232 250,238 Q235,242 222,238 Q215,232 218,220 Z' },
    { id: 'giraffe-spot-3', label: 'Neck Spot 3', tone: 'dark',
      path: 'M215,270 Q220,258 238,255 Q255,258 258,270 Q260,282 250,288 Q235,292 222,288 Q212,282 215,270 Z' },
    { id: 'giraffe-body', label: 'Body', tone: 'medium',
      path: 'M160,330 Q155,320 200,312 Q240,308 280,312 Q325,320 320,330 Q325,365 318,395 L162,395 Q155,365 160,330 Z' },
    { id: 'giraffe-leg-fl', label: 'Front Left', tone: 'dark',
      path: 'M172,395 L168,455 Q170,462 180,462 Q188,460 186,450 L185,395 Z' },
    { id: 'giraffe-leg-fr', label: 'Front Right', tone: 'dark',
      path: 'M205,395 L202,455 Q204,462 214,462 Q222,460 220,450 L218,395 Z' },
    { id: 'giraffe-leg-bl', label: 'Back Left', tone: 'dark',
      path: 'M262,395 L258,455 Q260,462 270,462 Q278,460 276,450 L275,395 Z' },
    { id: 'giraffe-leg-br', label: 'Back Right', tone: 'dark',
      path: 'M298,395 L295,455 Q297,462 307,462 Q315,460 312,450 L310,395 Z' },
    { id: 'giraffe-tail', label: 'Tail', tone: 'accent',
      path: 'M318,335 Q335,330 345,335 Q352,342 348,355 Q340,365 328,362 Q318,358 318,348 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── HUMMINGBIRD ──
const hummingbird: Vibe = {
  id: 'hummingbird', name: 'Hummingbird', emoji: '🐦',
  description: 'Elegant hummingbird in flight with spread wings',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'hbird-head', label: 'Head', tone: 'dark',
      path: 'M280,140 Q295,118 315,110 Q338,105 348,118 Q355,132 342,148 Q328,160 310,162 Q292,160 282,152 Z' },
    { id: 'hbird-beak', label: 'Beak', tone: 'dark',
      path: 'M348,125 Q370,118 400,112 Q420,108 430,112 Q435,118 425,122 Q405,128 380,135 Q360,140 348,138 Z' },
    { id: 'hbird-eye', label: 'Eye', tone: 'light', path: circlePath(318, 130, 6) },
    { id: 'hbird-throat', label: 'Throat', tone: 'accent',
      path: 'M282,152 Q278,170 275,188 Q290,195 310,190 Q325,182 328,165 Q330,155 310,162 Q292,160 282,152 Z' },
    { id: 'hbird-body', label: 'Body', tone: 'medium',
      path: 'M275,188 Q260,210 245,245 Q232,280 228,310 Q225,340 235,365 Q248,385 268,390 Q290,388 305,370 Q318,348 322,318 Q325,285 318,252 Q312,220 300,198 Q295,192 280,190 Z' },
    { id: 'hbird-belly', label: 'Belly', tone: 'light',
      path: 'M260,250 Q255,275 252,305 Q250,335 258,358 Q268,372 280,368 Q292,358 295,330 Q298,300 295,270 Q290,245 275,238 Z' },
    { id: 'hbird-wing-upper', label: 'Upper Wing', tone: 'accent',
      path: 'M270,200 Q235,175 195,155 Q155,138 120,135 Q88,135 75,148 Q68,165 82,182 Q100,198 130,208 Q165,218 205,222 Q240,225 265,218 Z' },
    { id: 'hbird-wing-lower', label: 'Lower Wing', tone: 'medium',
      path: 'M265,218 Q230,235 190,250 Q150,268 118,278 Q90,285 78,278 Q68,268 78,252 Q92,238 118,228 Q150,218 190,212 Q225,210 260,212 Z' },
    { id: 'hbird-tail-upper', label: 'Upper Tail', tone: 'dark',
      path: 'M235,365 Q215,380 185,395 Q155,408 130,412 Q112,412 110,402 Q112,390 128,382 Q152,372 180,365 Q210,358 232,358 Z' },
    { id: 'hbird-tail-lower', label: 'Lower Tail', tone: 'dark',
      path: 'M240,375 Q222,392 195,410 Q168,425 142,432 Q125,435 120,425 Q122,415 138,405 Q162,395 190,385 Q218,378 238,372 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

// ── BEE ──
const bee: Vibe = {
  id: 'bee', name: 'Bee', emoji: '🐝',
  description: 'Detailed honeybee with striped body & transparent wings',
  viewBox: '0 0 480 480',
  sections: [
    { id: 'bee-head', label: 'Head', tone: 'dark',
      path: 'M200,215 Q195,188 210,170 Q228,155 248,155 Q268,155 285,170 Q298,188 295,215 Q292,235 278,248 Q262,258 248,260 Q232,258 218,248 Q202,235 200,215 Z' },
    { id: 'bee-eye-l', label: 'Left Eye', tone: 'light', path: circlePath(228, 200, 14) },
    { id: 'bee-eye-r', label: 'Right Eye', tone: 'light', path: circlePath(268, 200, 14) },
    { id: 'bee-antenna-l', label: 'Left Antenna', tone: 'dark',
      path: 'M225,170 Q215,140 195,118 Q182,105 175,95 Q170,88 175,85 Q182,85 192,95 Q208,115 220,145 Z' },
    { id: 'bee-antenna-r', label: 'Right Antenna', tone: 'dark',
      path: 'M270,170 Q280,140 300,118 Q312,105 320,95 Q325,88 320,85 Q312,85 302,95 Q285,115 275,145 Z' },
    { id: 'bee-stripe-1', label: 'Stripe 1 (Yellow)', tone: 'accent',
      path: 'M195,260 Q190,258 248,255 Q305,258 300,260 L305,290 Q305,292 248,290 Q190,292 190,290 Z' },
    { id: 'bee-stripe-2', label: 'Stripe 2 (Dark)', tone: 'dark',
      path: 'M190,290 Q190,292 248,290 Q305,292 305,290 L308,318 Q308,320 248,318 Q188,320 188,318 Z' },
    { id: 'bee-stripe-3', label: 'Stripe 3 (Yellow)', tone: 'accent',
      path: 'M188,318 Q188,320 248,318 Q308,320 308,318 L310,345 Q310,348 248,345 Q185,348 185,345 Z' },
    { id: 'bee-stripe-4', label: 'Stripe 4 (Dark)', tone: 'dark',
      path: 'M185,345 Q185,348 248,345 Q310,348 310,345 L305,372 Q300,388 248,385 Q195,388 190,372 Z' },
    { id: 'bee-stinger', label: 'Stinger', tone: 'dark',
      path: 'M240,385 Q242,395 245,410 Q248,425 248,435 Q248,440 245,438 Q242,435 240,420 Q238,405 238,395 Z' },
    { id: 'bee-wing-l', label: 'Left Wing', tone: 'light',
      path: 'M200,260 Q165,235 130,218 Q100,205 78,208 Q62,215 65,232 Q72,252 98,268 Q128,282 162,288 Q185,290 195,282 Z' },
    { id: 'bee-wing-r', label: 'Right Wing', tone: 'light',
      path: 'M295,260 Q330,235 365,218 Q395,205 418,208 Q432,215 430,232 Q422,252 398,268 Q368,282 332,288 Q310,290 300,282 Z' },
    { id: 'bee-leg-l', label: 'Left Legs', tone: 'dark',
      path: 'M205,310 Q185,320 172,335 Q165,345 170,350 Q178,348 188,338 Q198,325 205,318 Z M200,345 Q180,355 168,368 Q162,378 168,382 Q175,380 185,370 Q195,358 200,350 Z' },
    { id: 'bee-leg-r', label: 'Right Legs', tone: 'dark',
      path: 'M290,310 Q310,320 322,335 Q328,345 325,350 Q318,348 308,338 Q298,325 290,318 Z M295,345 Q315,355 328,368 Q332,378 328,382 Q320,380 310,370 Q300,358 295,350 Z' },
  ],
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
};

export const vibes: Vibe[] = [sunset, ocean, solarSystem, cat, dog, fruitBowl, mushroom, beehive, rainbow, mandala, mandalaFlower, butterfly, bear, elephant, owl, turtle, lion, rabbit, dinosaur, giraffe, hummingbird, bee];
