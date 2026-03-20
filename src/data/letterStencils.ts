import { Vibe } from '@/types/studio';

// Bold, blocky uppercase letter stencils — each letter is a single fillable shape
// All use viewBox 0 0 480 480, designed for clean textile filling

const letterA: Vibe = {
  id: 'letter-a', name: 'A', emoji: '🔤', category: 'Letters',
  description: 'Letter A stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'la-outer', label: 'Letter A', tone: 'medium' as const,
      path: 'M240,40 L400,440 L340,440 L310,360 L170,360 L140,440 L80,440 Z M200,310 L280,310 L240,170 Z' },
  ],
};

const letterB: Vibe = {
  id: 'letter-b', name: 'B', emoji: '🔤', category: 'Letters',
  description: 'Letter B stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lb-outer', label: 'Letter B', tone: 'medium' as const,
      path: 'M100,40 L300,40 Q380,40 380,120 Q380,180 330,200 Q390,220 390,280 Q390,360 310,380 Q300,382 100,382 Z M170,100 L170,180 L280,180 Q310,180 310,140 Q310,100 280,100 Z M170,240 L170,322 L290,322 Q330,322 330,280 Q330,240 290,240 Z' },
  ],
};

const letterC: Vibe = {
  id: 'letter-c', name: 'C', emoji: '🔤', category: 'Letters',
  description: 'Letter C stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lc-outer', label: 'Letter C', tone: 'medium' as const,
      path: 'M340,100 Q280,40 200,40 Q100,40 80,160 L80,280 Q100,400 200,400 Q280,400 340,340 L300,290 Q260,340 200,340 Q160,340 150,280 L150,160 Q160,100 200,100 Q260,100 300,150 Z' },
  ],
};

const letterD: Vibe = {
  id: 'letter-d', name: 'D', emoji: '🔤', category: 'Letters',
  description: 'Letter D stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ld-outer', label: 'Letter D', tone: 'medium' as const,
      path: 'M100,40 L260,40 Q400,40 400,210 Q400,380 260,380 L100,380 Z M170,110 L170,310 L260,310 Q330,310 330,210 Q330,110 260,110 Z' },
  ],
};

const letterE: Vibe = {
  id: 'letter-e', name: 'E', emoji: '🔤', category: 'Letters',
  description: 'Letter E stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'le-outer', label: 'Letter E', tone: 'medium' as const,
      path: 'M100,40 L380,40 L380,110 L170,110 L170,180 L350,180 L350,250 L170,250 L170,310 L380,310 L380,380 L100,380 Z' },
  ],
};

const letterF: Vibe = {
  id: 'letter-f', name: 'F', emoji: '🔤', category: 'Letters',
  description: 'Letter F stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lf-outer', label: 'Letter F', tone: 'medium' as const,
      path: 'M100,40 L380,40 L380,110 L170,110 L170,190 L340,190 L340,260 L170,260 L170,380 L100,380 Z' },
  ],
};

const letterG: Vibe = {
  id: 'letter-g', name: 'G', emoji: '🔤', category: 'Letters',
  description: 'Letter G stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lg-outer', label: 'Letter G', tone: 'medium' as const,
      path: 'M340,100 Q280,40 200,40 Q100,40 80,160 L80,280 Q100,400 200,400 Q280,400 340,340 L340,230 L250,230 L250,290 L280,290 Q260,340 200,340 Q160,340 150,280 L150,160 Q160,100 200,100 Q260,100 300,150 Z' },
  ],
};

const letterH: Vibe = {
  id: 'letter-h', name: 'H', emoji: '🔤', category: 'Letters',
  description: 'Letter H stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lh-outer', label: 'Letter H', tone: 'medium' as const,
      path: 'M100,40 L170,40 L170,180 L310,180 L310,40 L380,40 L380,380 L310,380 L310,250 L170,250 L170,380 L100,380 Z' },
  ],
};

const letterI: Vibe = {
  id: 'letter-i', name: 'I', emoji: '🔤', category: 'Letters',
  description: 'Letter I stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'li-outer', label: 'Letter I', tone: 'medium' as const,
      path: 'M150,40 L330,40 L330,110 L275,110 L275,310 L330,310 L330,380 L150,380 L150,310 L205,310 L205,110 L150,110 Z' },
  ],
};

const letterJ: Vibe = {
  id: 'letter-j', name: 'J', emoji: '🔤', category: 'Letters',
  description: 'Letter J stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lj-outer', label: 'Letter J', tone: 'medium' as const,
      path: 'M200,40 L380,40 L380,110 L340,110 L340,290 Q340,380 240,380 Q140,380 140,290 L140,260 L210,260 L210,290 Q210,310 240,310 Q270,310 270,290 L270,110 L200,110 Z' },
  ],
};

const letterK: Vibe = {
  id: 'letter-k', name: 'K', emoji: '🔤', category: 'Letters',
  description: 'Letter K stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lk-outer', label: 'Letter K', tone: 'medium' as const,
      path: 'M100,40 L170,40 L170,180 L290,40 L380,40 L230,210 L390,380 L295,380 L170,240 L170,380 L100,380 Z' },
  ],
};

const letterL: Vibe = {
  id: 'letter-l', name: 'L', emoji: '🔤', category: 'Letters',
  description: 'Letter L stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'll-outer', label: 'Letter L', tone: 'medium' as const,
      path: 'M100,40 L170,40 L170,310 L380,310 L380,380 L100,380 Z' },
  ],
};

const letterM: Vibe = {
  id: 'letter-m', name: 'M', emoji: '🔤', category: 'Letters',
  description: 'Letter M stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lm-outer', label: 'Letter M', tone: 'medium' as const,
      path: 'M60,40 L140,40 L240,220 L340,40 L420,40 L420,380 L355,380 L355,170 L260,340 L220,340 L125,170 L125,380 L60,380 Z' },
  ],
};

const letterN: Vibe = {
  id: 'letter-n', name: 'N', emoji: '🔤', category: 'Letters',
  description: 'Letter N stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ln-outer', label: 'Letter N', tone: 'medium' as const,
      path: 'M100,40 L170,40 L340,280 L340,40 L400,40 L400,380 L330,380 L160,140 L160,380 L100,380 Z' },
  ],
};

const letterO: Vibe = {
  id: 'letter-o', name: 'O', emoji: '🔤', category: 'Letters',
  description: 'Letter O stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lo-outer', label: 'Letter O', tone: 'medium' as const,
      path: 'M240,40 Q400,40 400,210 Q400,380 240,380 Q80,380 80,210 Q80,40 240,40 Z M240,110 Q150,110 150,210 Q150,310 240,310 Q330,310 330,210 Q330,110 240,110 Z' },
  ],
};

const letterP: Vibe = {
  id: 'letter-p', name: 'P', emoji: '🔤', category: 'Letters',
  description: 'Letter P stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lp-outer', label: 'Letter P', tone: 'medium' as const,
      path: 'M100,40 L300,40 Q390,40 390,140 Q390,240 300,240 L170,240 L170,380 L100,380 Z M170,110 L170,170 L290,170 Q320,170 320,140 Q320,110 290,110 Z' },
  ],
};

const letterQ: Vibe = {
  id: 'letter-q', name: 'Q', emoji: '🔤', category: 'Letters',
  description: 'Letter Q stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lq-outer', label: 'Letter Q', tone: 'medium' as const,
      path: 'M240,40 Q400,40 400,210 Q400,330 340,370 L400,440 L340,440 L280,380 Q260,382 240,380 Q80,380 80,210 Q80,40 240,40 Z M240,110 Q150,110 150,210 Q150,310 240,310 Q330,310 330,210 Q330,110 240,110 Z' },
  ],
};

const letterR: Vibe = {
  id: 'letter-r', name: 'R', emoji: '🔤', category: 'Letters',
  description: 'Letter R stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lr-outer', label: 'Letter R', tone: 'medium' as const,
      path: 'M100,40 L300,40 Q390,40 390,140 Q390,210 340,230 L400,380 L325,380 L270,240 L170,240 L170,380 L100,380 Z M170,110 L170,180 L290,180 Q320,180 320,140 Q320,110 290,110 Z' },
  ],
};

const letterS: Vibe = {
  id: 'letter-s', name: 'S', emoji: '🔤', category: 'Letters',
  description: 'Letter S stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ls-outer', label: 'Letter S', tone: 'medium' as const,
      path: 'M340,100 Q300,40 220,40 Q100,40 100,130 Q100,210 200,230 L300,250 Q370,260 370,320 Q370,400 240,400 Q140,400 100,340 L160,290 Q190,340 240,340 Q310,340 310,310 Q310,280 260,270 L170,250 Q100,235 100,160 Q100,100 140,70 Q180,40 220,40 L340,100 Z' },
  ],
};

const letterT: Vibe = {
  id: 'letter-t', name: 'T', emoji: '🔤', category: 'Letters',
  description: 'Letter T stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lt-outer', label: 'Letter T', tone: 'medium' as const,
      path: 'M60,40 L420,40 L420,110 L275,110 L275,380 L205,380 L205,110 L60,110 Z' },
  ],
};

const letterU: Vibe = {
  id: 'letter-u', name: 'U', emoji: '🔤', category: 'Letters',
  description: 'Letter U stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lu-outer', label: 'Letter U', tone: 'medium' as const,
      path: 'M100,40 L170,40 L170,290 Q170,340 240,340 Q310,340 310,290 L310,40 L380,40 L380,290 Q380,380 240,380 Q100,380 100,290 Z' },
  ],
};

const letterV: Vibe = {
  id: 'letter-v', name: 'V', emoji: '🔤', category: 'Letters',
  description: 'Letter V stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lv-outer', label: 'Letter V', tone: 'medium' as const,
      path: 'M60,40 L140,40 L240,320 L340,40 L420,40 L275,380 L205,380 Z' },
  ],
};

const letterW: Vibe = {
  id: 'letter-w', name: 'W', emoji: '🔤', category: 'Letters',
  description: 'Letter W stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lw-outer', label: 'Letter W', tone: 'medium' as const,
      path: 'M40,40 L110,40 L160,280 L230,40 L250,40 L320,280 L370,40 L440,40 L350,380 L280,380 L240,200 L200,380 L130,380 Z' },
  ],
};

const letterX: Vibe = {
  id: 'letter-x', name: 'X', emoji: '🔤', category: 'Letters',
  description: 'Letter X stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lx-outer', label: 'Letter X', tone: 'medium' as const,
      path: 'M80,40 L170,40 L240,175 L310,40 L400,40 L285,210 L400,380 L310,380 L240,250 L170,380 L80,380 L195,210 Z' },
  ],
};

const letterY: Vibe = {
  id: 'letter-y', name: 'Y', emoji: '🔤', category: 'Letters',
  description: 'Letter Y stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ly-outer', label: 'Letter Y', tone: 'medium' as const,
      path: 'M60,40 L155,40 L240,190 L325,40 L420,40 L275,260 L275,380 L205,380 L205,260 Z' },
  ],
};

const letterZ: Vibe = {
  id: 'letter-z', name: 'Z', emoji: '🔤', category: 'Letters',
  description: 'Letter Z stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'lz-outer', label: 'Letter Z', tone: 'medium' as const,
      path: 'M80,40 L400,40 L400,110 L195,310 L400,310 L400,380 L80,380 L80,310 L285,110 L80,110 Z' },
  ],
};

export const letterStencils: Vibe[] = [
  letterA, letterB, letterC, letterD, letterE, letterF, letterG,
  letterH, letterI, letterJ, letterK, letterL, letterM, letterN,
  letterO, letterP, letterQ, letterR, letterS, letterT, letterU,
  letterV, letterW, letterX, letterY, letterZ,
];
