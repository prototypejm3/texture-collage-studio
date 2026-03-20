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

// ─── Number Stencils (0–10) ───

const num0: Vibe = {
  id: 'num-0', name: '0', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 0 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n0', label: 'Number 0', tone: 'medium' as const,
    path: 'M240,40 Q400,40 400,210 Q400,380 240,380 Q80,380 80,210 Q80,40 240,40 Z M240,110 Q150,110 150,210 Q150,310 240,310 Q330,310 330,210 Q330,110 240,110 Z' }],
};
const num1: Vibe = {
  id: 'num-1', name: '1', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 1 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n1', label: 'Number 1', tone: 'medium' as const,
    path: 'M170,110 L170,40 L275,40 L275,310 L340,310 L340,380 L140,380 L140,310 L205,310 L205,110 Z' }],
};
const num2: Vibe = {
  id: 'num-2', name: '2', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 2 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n2', label: 'Number 2', tone: 'medium' as const,
    path: 'M100,100 Q100,40 240,40 Q380,40 380,130 Q380,200 300,240 L180,310 L380,310 L380,380 L100,380 L100,310 L280,200 Q310,180 310,140 Q310,100 240,100 Q180,100 160,130 Z' }],
};
const num3: Vibe = {
  id: 'num-3', name: '3', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 3 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n3', label: 'Number 3', tone: 'medium' as const,
    path: 'M100,100 Q100,40 240,40 Q380,40 380,130 Q380,190 310,210 Q380,230 380,300 Q380,380 240,380 Q100,380 100,320 L170,320 Q180,340 240,340 Q310,340 310,300 Q310,250 240,250 L200,250 L200,190 L240,190 Q310,190 310,140 Q310,100 240,100 Q180,100 170,120 Z' }],
};
const num4: Vibe = {
  id: 'num-4', name: '4', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 4 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n4', label: 'Number 4', tone: 'medium' as const,
    path: 'M280,40 L280,240 L380,240 L380,310 L280,310 L280,380 L210,380 L210,310 L80,310 L80,240 L210,40 Z M210,130 L130,240 L210,240 Z' }],
};
const num5: Vibe = {
  id: 'num-5', name: '5', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 5 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n5', label: 'Number 5', tone: 'medium' as const,
    path: 'M120,40 L380,40 L380,110 L190,110 L190,190 Q220,170 260,170 Q380,170 380,300 Q380,380 240,380 Q120,380 100,320 L170,320 Q185,340 240,340 Q310,340 310,300 Q310,240 240,240 Q190,240 170,270 L120,270 Z' }],
};
const num6: Vibe = {
  id: 'num-6', name: '6', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 6 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n6', label: 'Number 6', tone: 'medium' as const,
    path: 'M340,100 Q300,40 220,40 Q100,40 100,210 L100,290 Q100,380 240,380 Q380,380 380,290 Q380,210 240,210 Q190,210 170,230 L170,160 Q170,100 220,100 Q260,100 290,120 Z M240,270 Q170,270 170,300 Q170,340 240,340 Q310,340 310,300 Q310,270 240,270 Z' }],
};
const num7: Vibe = {
  id: 'num-7', name: '7', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 7 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n7', label: 'Number 7', tone: 'medium' as const,
    path: 'M80,40 L400,40 L400,110 L250,380 L175,380 L320,110 L80,110 Z' }],
};
const num8: Vibe = {
  id: 'num-8', name: '8', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 8 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n8', label: 'Number 8', tone: 'medium' as const,
    path: 'M240,40 Q380,40 380,130 Q380,190 310,210 Q390,230 390,300 Q390,380 240,380 Q90,380 90,300 Q90,230 170,210 Q100,190 100,130 Q100,40 240,40 Z M240,100 Q170,100 170,140 Q170,180 240,190 Q310,180 310,140 Q310,100 240,100 Z M240,250 Q160,250 160,300 Q160,340 240,340 Q320,340 320,300 Q320,250 240,250 Z' }],
};
const num9: Vibe = {
  id: 'num-9', name: '9', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 9 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'n9', label: 'Number 9', tone: 'medium' as const,
    path: 'M240,40 Q380,40 380,130 Q380,210 240,210 Q190,210 170,190 L170,260 Q170,340 220,340 Q280,340 310,300 L340,320 Q300,380 220,380 Q100,380 100,210 L100,130 Q100,40 240,40 Z M240,100 Q170,100 170,140 Q170,170 240,170 Q310,170 310,140 Q310,100 240,100 Z' }],
};
const num10: Vibe = {
  id: 'num-10', name: '10', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Number 10 stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'n10-1', label: 'One', tone: 'medium' as const,
      path: 'M80,100 L80,40 L160,40 L160,310 L200,310 L200,380 L40,380 L40,310 L90,310 L90,100 Z' },
    { id: 'n10-0', label: 'Zero', tone: 'medium' as const,
      path: 'M340,40 Q440,40 440,210 Q440,380 340,380 Q240,380 240,210 Q240,40 340,40 Z M340,100 Q300,100 300,210 Q300,310 340,310 Q380,310 380,210 Q380,100 340,100 Z' },
  ],
};

// ─── Symbol Stencils ───

const symAmpersand: Vibe = {
  id: 'sym-ampersand', name: '&', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Ampersand stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-amp', label: 'Ampersand', tone: 'medium' as const,
    path: 'M350,380 L280,310 Q230,370 170,370 Q90,370 90,290 Q90,230 160,190 Q120,150 120,110 Q120,40 200,40 Q280,40 280,110 Q280,160 230,200 L300,270 L340,210 L400,250 L350,320 L400,380 Z M200,100 Q170,100 170,120 Q170,145 200,170 Q230,145 230,120 Q230,100 200,100 Z M180,240 Q150,260 150,290 Q150,320 180,320 Q210,320 240,280 Z' }],
};
const symPercent: Vibe = {
  id: 'sym-percent', name: '%', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Percent stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-pct', label: 'Percent', tone: 'medium' as const,
    path: 'M350,40 L400,40 L130,380 L80,380 Z M160,40 Q220,40 220,100 Q220,160 160,160 Q100,160 100,100 Q100,40 160,40 Z M160,70 Q130,70 130,100 Q130,130 160,130 Q190,130 190,100 Q190,70 160,70 Z M320,260 Q380,260 380,320 Q380,380 320,380 Q260,380 260,320 Q260,260 320,260 Z M320,290 Q290,290 290,320 Q290,350 320,350 Q350,350 350,320 Q350,290 320,290 Z' }],
};
const symDollar: Vibe = {
  id: 'sym-dollar', name: '$', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Dollar sign stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-dlr', label: 'Dollar', tone: 'medium' as const,
    path: 'M210,20 L270,20 L270,60 Q350,70 380,120 L320,160 Q300,110 240,110 Q170,110 170,150 Q170,190 250,200 L270,204 Q390,220 390,310 Q390,380 270,395 L270,440 L210,440 L210,395 Q120,380 90,320 L160,280 Q180,340 240,340 Q320,340 320,300 Q320,260 240,248 L220,244 Q100,225 100,140 Q100,70 210,60 Z' }],
};
const symHash: Vibe = {
  id: 'sym-hash', name: '#', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Hash/number sign stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-hsh', label: 'Hash', tone: 'medium' as const,
    path: 'M190,40 L250,40 L235,150 L330,150 L345,40 L405,40 L390,150 L440,150 L440,210 L380,210 L365,310 L440,310 L440,370 L355,370 L340,440 L280,440 L295,370 L200,370 L185,440 L125,440 L140,370 L60,370 L60,310 L150,310 L165,210 L60,210 L60,150 L175,150 Z M225,210 L210,310 L305,310 L320,210 Z' }],
};
const symAt: Vibe = {
  id: 'sym-at', name: '@', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'At sign stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-at', label: 'At Sign', tone: 'medium' as const,
    path: 'M240,50 Q130,50 80,140 Q40,220 50,310 Q65,400 150,440 Q220,470 310,450 Q370,430 400,390 L360,360 Q340,395 290,412 Q230,430 170,410 Q110,380 95,310 Q80,240 110,170 Q145,100 240,100 Q320,100 360,155 Q390,200 390,260 Q390,300 370,320 Q355,335 340,320 Q335,310 335,290 L335,190 L290,190 L290,210 Q270,185 240,185 Q200,185 180,215 Q165,240 165,275 Q165,310 185,335 Q205,358 240,358 Q270,358 290,338 Q310,358 340,358 Q380,358 405,325 Q430,290 430,250 Q430,180 390,120 Q340,50 240,50 Z M240,230 Q265,230 280,250 Q292,270 292,295 Q292,318 278,332 Q265,342 240,342 Q215,342 205,325 Q195,308 195,280 Q195,255 210,240 Q222,230 240,230 Z' }],
};
const symCaret: Vibe = {
  id: 'sym-caret', name: '^', emoji: '#️⃣', category: 'Numbers & Symbols',
  description: 'Caret stencil',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [{ id: 'sy-crt', label: 'Caret', tone: 'medium' as const,
    path: 'M240,60 L400,260 L345,300 L240,150 L135,300 L80,260 Z' }],
};

export const numberSymbolStencils: Vibe[] = [
  num0, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10,
  symAmpersand, symPercent, symDollar, symHash, symAt, symCaret,
];
