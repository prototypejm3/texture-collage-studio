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

export const vibes: Vibe[] = [sunset, ocean, solarSystem, cat, dog, fruitBowl, mushroom, beehive, rainbow, mandala, mandalaFlower];
