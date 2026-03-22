import { Vibe } from '@/types/studio';

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

// ── SOCCER BALL ⚽ ── Full hex coverage
const soccerBall: Vibe = {
  id: 'soccer-ball', name: 'Soccer Ball', emoji: '⚽', category: 'Sports',
  description: 'Classic hex-panel soccer ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    // White hex panels (background)
    { id: 'soccer-bg', label: 'Ball', tone: 'light',
      path: circle(240, 240, 200) },
    // Center pentagon (dark)
    { id: 'soccer-pent-c', label: 'Center', tone: 'dark',
      path: 'M240,175 L280,200 L268,245 L212,245 L200,200 Z' },
    // Top pentagon
    { id: 'soccer-pent-top', label: 'Top', tone: 'dark',
      path: 'M240,55 L270,75 L260,110 L220,110 L210,75 Z' },
    // Top-right pentagon
    { id: 'soccer-pent-tr', label: 'Top Right', tone: 'dark',
      path: 'M380,120 L400,150 L385,180 L355,175 L350,145 Z' },
    // Bottom-right pentagon
    { id: 'soccer-pent-br', label: 'Bottom Right', tone: 'dark',
      path: 'M395,305 L400,340 L380,365 L350,355 L350,325 Z' },
    // Bottom pentagon
    { id: 'soccer-pent-bot', label: 'Bottom', tone: 'dark',
      path: 'M240,395 L270,380 L280,410 L240,430 L200,410 L210,380 Z' },
    // Bottom-left pentagon
    { id: 'soccer-pent-bl', label: 'Bottom Left', tone: 'dark',
      path: 'M85,305 L95,340 L85,365 L115,355 L115,325 Z' },
    // Top-left pentagon
    { id: 'soccer-pent-tl', label: 'Top Left', tone: 'dark',
      path: 'M100,120 L115,145 L110,175 L80,180 L70,150 Z' },
    // Hex band connectors (medium tone for visible structure)
    { id: 'soccer-hex-ring', label: 'Hex Panels', tone: 'medium',
      path: 'M220,110 L200,200 L212,245 L175,290 L115,325 L85,305 L70,150 L100,120 L210,75 L240,55 L270,75 L350,145 L380,120 L400,150 L385,180 L280,200 L268,245 L310,290 L350,325 L395,305 L400,340 L380,365 L270,380 L240,395 L210,380 L85,365 L95,340 L115,355 L175,290 M310,290 L350,355 M260,110 L280,200 M385,180 L350,145' },
  ],
};

// ── BASKETBALL 🏀 ──
const basketball: Vibe = {
  id: 'basketball', name: 'Basketball', emoji: '🏀', category: 'Sports',
  description: 'Bold seam basketball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'bball-top-left', label: 'Top Left', tone: 'medium',
      path: `M40,240 A200,200 0 0,1 240,40 L240,240 Z` },
    { id: 'bball-top-right', label: 'Top Right', tone: 'light',
      path: `M240,40 A200,200 0 0,1 440,240 L240,240 Z` },
    { id: 'bball-bottom-right', label: 'Bottom Right', tone: 'medium',
      path: `M440,240 A200,200 0 0,1 240,440 L240,240 Z` },
    { id: 'bball-bottom-left', label: 'Bottom Left', tone: 'light',
      path: `M240,440 A200,200 0 0,1 40,240 L240,240 Z` },
    { id: 'bball-left-curve', label: 'Left Curve', tone: 'dark',
      path: 'M120,80 Q200,180 200,240 Q200,300 120,400 L140,400 Q220,300 220,240 Q220,180 140,80 Z' },
    { id: 'bball-right-curve', label: 'Right Curve', tone: 'dark',
      path: 'M360,80 Q280,180 280,240 Q280,300 360,400 L340,400 Q260,300 260,240 Q260,180 340,80 Z' },
  ],
};

// ── FOOTBALL 🏈 ── Proper pointed football shape
const football: Vibe = {
  id: 'football', name: 'Football', emoji: '🏈', category: 'Sports',
  description: 'American football with pointed ends and laces',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    // Top half of pointed football
    { id: 'fb-top', label: 'Top Half', tone: 'medium',
      path: 'M50,240 Q50,160 130,120 Q200,95 240,90 Q280,95 350,120 Q430,160 430,240 L50,240 Z' },
    // Bottom half
    { id: 'fb-bottom', label: 'Bottom Half', tone: 'dark',
      path: 'M50,240 L430,240 Q430,320 350,360 Q280,385 240,390 Q200,385 130,360 Q50,320 50,240 Z' },
    // Left point tip
    { id: 'fb-tip-left', label: 'Left Point', tone: 'accent',
      path: 'M50,240 Q35,220 50,200 Q60,215 70,220 L70,260 Q60,265 50,280 Q35,260 50,240 Z' },
    // Right point tip
    { id: 'fb-tip-right', label: 'Right Point', tone: 'accent',
      path: 'M430,240 Q445,220 430,200 Q420,215 410,220 L410,260 Q420,265 430,280 Q445,260 430,240 Z' },
    // White stripes near tips
    { id: 'fb-stripe-l', label: 'Left Stripe', tone: 'light',
      path: 'M90,155 Q100,140 120,130 L125,150 Q108,158 98,170 Z' },
    { id: 'fb-stripe-r', label: 'Right Stripe', tone: 'light',
      path: 'M390,155 Q380,140 360,130 L355,150 Q372,158 382,170 Z' },
    // Laces
    { id: 'fb-laces', label: 'Laces', tone: 'light',
      path: 'M195,218 L285,218 L285,228 L195,228 Z M210,205 L215,218 L220,205 Z M237,205 L242,218 L247,205 Z M264,205 L269,218 L274,205 Z' },
  ],
};

// ── BASEBALL ⚾ ── Slightly smaller (viewBox 0 0 440 440, r=175)
const baseball: Vibe = {
  id: 'baseball', name: 'Baseball', emoji: '⚾', category: 'Sports',
  description: 'Classic stitching baseball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 440 440',
  sections: [
    { id: 'bb-main', label: 'Ball', tone: 'light',
      path: circle(220, 220, 175) },
    { id: 'bb-left-panel', label: 'Left Panel', tone: 'medium',
      path: 'M90,90 Q165,165 165,220 Q165,275 90,350 L70,340 Q140,270 140,220 Q140,170 70,100 Z' },
    { id: 'bb-right-panel', label: 'Right Panel', tone: 'medium',
      path: 'M350,90 Q275,165 275,220 Q275,275 350,350 L370,340 Q300,270 300,220 Q300,170 370,100 Z' },
    { id: 'bb-stitch-left', label: 'Left Stitch', tone: 'accent',
      path: 'M85,95 Q160,170 160,220 Q160,270 85,345 L95,355 Q175,280 175,220 Q175,160 95,85 Z' },
    { id: 'bb-stitch-right', label: 'Right Stitch', tone: 'accent',
      path: 'M355,95 Q280,170 280,220 Q280,270 355,345 L345,355 Q265,280 265,220 Q265,160 345,85 Z' },
  ],
};

// ── TENNIS BALL 🎾 ──
const tennisBall: Vibe = {
  id: 'tennis-ball', name: 'Tennis Ball', emoji: '🎾', category: 'Sports',
  description: 'Soft S-curve tennis ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'tb-left', label: 'Left Half', tone: 'light',
      path: `M40,240 A200,200 0 0,1 240,40 Q200,160 200,240 Q200,320 240,440 A200,200 0 0,1 40,240 Z` },
    { id: 'tb-right', label: 'Right Half', tone: 'medium',
      path: `M240,40 A200,200 0 0,1 440,240 A200,200 0 0,1 240,440 Q200,320 200,240 Q200,160 240,40 Z` },
    { id: 'tb-seam-left', label: 'Left Seam', tone: 'accent',
      path: 'M140,60 Q100,140 100,240 Q100,340 140,420 L155,415 Q115,335 115,240 Q115,145 155,65 Z' },
    { id: 'tb-seam-right', label: 'Right Seam', tone: 'accent',
      path: 'M340,60 Q380,140 380,240 Q380,340 340,420 L325,415 Q365,335 365,240 Q365,145 325,65 Z' },
  ],
};

// ── VOLLEYBALL 🏐 ── Front view (classic wrapped panels)
const volleyball: Vibe = {
  id: 'volleyball', name: 'Volleyball (Front)', emoji: '🏐', category: 'Sports',
  description: 'Classic front-facing volleyball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vb-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    { id: 'vb-panel-1', label: 'Panel Left', tone: 'medium',
      path: 'M130,55 Q100,140 110,240 Q100,340 130,425 L160,420 Q140,340 145,240 Q140,140 160,60 Z' },
    { id: 'vb-panel-2', label: 'Panel Right', tone: 'medium',
      path: 'M350,55 Q380,140 370,240 Q380,340 350,425 L320,420 Q340,340 335,240 Q340,140 320,60 Z' },
    { id: 'vb-panel-3', label: 'Panel Center', tone: 'medium',
      path: 'M42,225 Q120,200 240,205 Q360,200 438,225 L438,255 Q360,280 240,275 Q120,280 42,255 Z' },
  ],
};

// ── VOLLEYBALL 🏐 ── Side view (rotated diagonal panels)
const volleyballSide: Vibe = {
  id: 'volleyball-side', name: 'Volleyball (Side)', emoji: '🏐', category: 'Sports',
  description: 'Side-rotated volleyball panels',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vbs-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    { id: 'vbs-band-1', label: 'Diagonal Band', tone: 'medium',
      path: 'M80,95 Q160,150 215,240 Q160,330 80,385 L110,410 Q190,340 240,255 L240,240 L240,225 Q290,140 370,70 L340,50 Q270,130 240,215 L240,240 Z' },
    { id: 'vbs-band-2', label: 'Cross Band', tone: 'medium',
      path: 'M400,95 Q320,150 265,240 Q320,330 400,385 L370,410 Q290,340 240,255 L240,240 L240,225 Q190,140 110,70 L140,50 Q210,130 240,215 L240,240 Z' },
    { id: 'vbs-stripe', label: 'Center Stripe', tone: 'accent',
      path: 'M225,42 Q232,140 235,240 Q232,340 225,438 L255,438 Q248,340 245,240 Q248,140 255,42 Z' },
  ],
};

// ── VOLLEYBALL 🏐 ── Top view (radial Y-seam)
const volleyballTop: Vibe = {
  id: 'volleyball-top', name: 'Volleyball (Top)', emoji: '🏐', category: 'Sports',
  description: 'Top-down volleyball with Y-seam',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vbt-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    { id: 'vbt-seam-1', label: 'Top Seam', tone: 'medium',
      path: 'M230,240 Q225,155 215,50 L265,50 Q255,155 250,240 Z' },
    { id: 'vbt-seam-2', label: 'Left Seam', tone: 'medium',
      path: 'M235,250 Q175,305 90,385 L120,415 Q195,330 250,260 Z' },
    { id: 'vbt-seam-3', label: 'Right Seam', tone: 'medium',
      path: 'M245,250 Q305,305 390,385 L360,415 Q285,330 230,260 Z' },
    { id: 'vbt-panel-a', label: 'Right Panel', tone: 'accent',
      path: 'M255,240 Q260,155 265,50 L350,75 Q400,130 430,200 L438,230 Q360,215 260,235 Z' },
    { id: 'vbt-panel-b', label: 'Bottom Panel', tone: 'accent',
      path: 'M250,260 Q285,330 360,415 L300,435 Q250,438 240,438 Q230,438 180,435 L120,415 Q195,330 230,260 Z' },
  ],
};

// ── RUGBY BALL 🏉 ──
const rugbyBall: Vibe = {
  id: 'rugby-ball', name: 'Rugby Ball', emoji: '🏉', category: 'Sports',
  description: 'Clean oval rugby ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'rb-top', label: 'Top Half', tone: 'light',
      path: 'M60,240 Q60,100 240,80 Q420,100 420,240 L60,240 Z' },
    { id: 'rb-bottom', label: 'Bottom Half', tone: 'medium',
      path: 'M60,240 L420,240 Q420,380 240,400 Q60,380 60,240 Z' },
    { id: 'rb-seam', label: 'Center Seam', tone: 'dark',
      path: 'M100,232 L380,232 L380,248 L100,248 Z' },
    { id: 'rb-tip-left', label: 'Left Tip', tone: 'accent',
      path: 'M60,240 Q60,200 100,170 L110,185 Q75,210 75,240 Q75,270 110,295 L100,310 Q60,280 60,240 Z' },
    { id: 'rb-tip-right', label: 'Right Tip', tone: 'accent',
      path: 'M420,240 Q420,200 380,170 L370,185 Q405,210 405,240 Q405,270 370,295 L380,310 Q420,280 420,240 Z' },
  ],
};

// ── BILLIARDS BALL 🎱 ──
const billiardsBall: Vibe = {
  id: 'billiards-ball', name: '8 Ball', emoji: '🎱', category: 'Sports',
  description: 'Classic billiards 8-ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'bil-body', label: 'Ball Body', tone: 'dark',
      path: circle(240, 240, 200) },
    { id: 'bil-stripe', label: 'Center Stripe', tone: 'light',
      path: 'M60,190 Q120,170 240,170 Q360,170 420,190 L420,290 Q360,310 240,310 Q120,310 60,290 Z' },
    { id: 'bil-circle', label: 'Number Circle', tone: 'light',
      path: circle(240, 240, 55) },
    { id: 'bil-number', label: 'Number 8', tone: 'accent',
      path: `M225,215 A18,18 0 1,1 255,215 A18,18 0 1,1 225,215 Z M222,248 A21,21 0 1,1 258,248 A21,21 0 1,1 222,248 Z` },
  ],
};

// ── SOFTBALL 🥎 ── Full size (bigger than baseball), yellow-toned
const softball: Vibe = {
  id: 'softball', name: 'Softball', emoji: '🥎', category: 'Sports',
  description: 'Chunky yellow softball',
  lightTextures: ['bentley-daisey'], mediumTextures: ['bentley-daisey'], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'sb-main', label: 'Ball', tone: 'light',
      path: circle(240, 240, 200) },
    { id: 'sb-left', label: 'Left Arc', tone: 'medium',
      path: 'M80,100 Q170,180 170,240 Q170,300 80,380 L110,400 Q200,310 200,240 Q200,170 110,80 Z' },
    { id: 'sb-right', label: 'Right Arc', tone: 'medium',
      path: 'M400,100 Q310,180 310,240 Q310,300 400,380 L370,400 Q280,310 280,240 Q280,170 370,80 Z' },
    { id: 'sb-stitch-l', label: 'Left Stitch', tone: 'accent',
      path: 'M85,105 Q170,185 170,240 Q170,295 85,375 L100,385 Q190,300 190,240 Q190,180 100,95 Z' },
    { id: 'sb-stitch-r', label: 'Right Stitch', tone: 'accent',
      path: 'M395,105 Q310,185 310,240 Q310,295 395,375 L380,385 Q290,300 290,240 Q290,180 380,95 Z' },
  ],
};

// ── CRICKET BALL 🏏 ──
const cricketBall: Vibe = {
  id: 'cricket-ball', name: 'Cricket Ball', emoji: '🏏', category: 'Sports',
  description: 'Clean seam cricket ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'cb-top', label: 'Top Half', tone: 'dark',
      path: `M40,240 A200,200 0 0,1 440,240 L40,240 Z` },
    { id: 'cb-bottom', label: 'Bottom Half', tone: 'medium',
      path: `M440,240 A200,200 0 0,1 40,240 L440,240 Z` },
    { id: 'cb-seam', label: 'Main Seam', tone: 'accent',
      path: 'M60,225 Q150,200 240,200 Q330,200 420,225 L420,255 Q330,280 240,280 Q150,280 60,255 Z' },
    { id: 'cb-stitch', label: 'Stitch Line', tone: 'light',
      path: 'M100,235 Q170,220 240,220 Q310,220 380,235 L380,245 Q310,260 240,260 Q170,260 100,245 Z' },
  ],
};

// ── STAR BALL ⭐ ──
const starBall: Vibe = {
  id: 'star-ball', name: 'Star Ball', emoji: '⭐', category: 'Sports',
  description: 'Fun circle with a star cutout',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'stb-outer', label: 'Ball', tone: 'light',
      path: circle(240, 240, 200) },
    { id: 'stb-star', label: 'Star', tone: 'accent',
      path: 'M240,120 L265,195 L345,195 L280,240 L305,315 L240,270 L175,315 L200,240 L135,195 L215,195 Z' },
    { id: 'stb-inner-star', label: 'Star Center', tone: 'medium',
      path: 'M240,170 L252,210 L295,210 L260,235 L272,275 L240,252 L208,275 L220,235 L185,210 L228,210 Z' },
  ],
};

// ── SMILE BALL 🙂 ──
const smileBall: Vibe = {
  id: 'smile-ball', name: 'Smile Ball', emoji: '🙂', category: 'Sports',
  description: 'Happy face ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'smb-face', label: 'Face', tone: 'light',
      path: circle(240, 240, 200) },
    { id: 'smb-left-eye', label: 'Left Eye', tone: 'dark',
      path: circle(185, 200, 22) },
    { id: 'smb-right-eye', label: 'Right Eye', tone: 'dark',
      path: circle(295, 200, 22) },
    { id: 'smb-mouth', label: 'Smile', tone: 'accent',
      path: 'M160,275 Q200,340 240,345 Q280,340 320,275 L310,265 Q275,325 240,330 Q205,325 170,265 Z' },
  ],
};

// ── RAINBOW BALL 🌈 ──
const rainbowBall: Vibe = {
  id: 'rainbow-ball', name: 'Rainbow Ball', emoji: '🌈', category: 'Sports',
  description: 'Striped rainbow ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'rb-stripe1', label: 'Top Band', tone: 'accent',
      path: `M40,240 A200,200 0 0,1 122,82 L358,82 A200,200 0 0,1 440,240 L40,240 Z` },
    { id: 'rb-stripe2', label: 'Upper Band', tone: 'light',
      path: 'M122,82 L145,120 L335,120 L358,82 Z' },
    { id: 'rb-stripe3', label: 'Middle Band', tone: 'medium',
      path: 'M80,165 L400,165 L395,200 L85,200 Z' },
    { id: 'rb-stripe4', label: 'Lower Band', tone: 'dark',
      path: `M40,240 L440,240 A200,200 0 0,1 358,398 L122,398 A200,200 0 0,1 40,240 Z` },
    { id: 'rb-stripe5', label: 'Bottom Band', tone: 'accent',
      path: 'M122,398 L145,360 L335,360 L358,398 Z' },
  ],
};

// ── FIRE BALL 🔥 ──
const fireBall: Vibe = {
  id: 'fire-ball', name: 'Fire Ball', emoji: '🔥', category: 'Sports',
  description: 'Fiery flame-edged ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'frb-core', label: 'Core', tone: 'accent',
      path: circle(240, 260, 140) },
    { id: 'frb-inner', label: 'Inner Glow', tone: 'light',
      path: circle(240, 260, 80) },
    { id: 'frb-flame-top', label: 'Top Flame', tone: 'medium',
      path: 'M200,140 Q210,60 240,40 Q270,60 280,140 Q260,110 240,115 Q220,110 200,140 Z' },
    { id: 'frb-flame-left', label: 'Left Flame', tone: 'dark',
      path: 'M120,200 Q60,180 50,150 Q90,170 130,160 Q100,190 120,200 Z M110,280 Q50,290 40,270 Q70,260 100,260 Z' },
    { id: 'frb-flame-right', label: 'Right Flame', tone: 'dark',
      path: 'M360,200 Q420,180 430,150 Q390,170 350,160 Q380,190 360,200 Z M370,280 Q430,290 440,270 Q410,260 380,260 Z' },
  ],
};

export const sportsStencils: Vibe[] = [
  soccerBall, basketball, football, baseball,
  tennisBall, volleyball, volleyballSide, volleyballTop,
  rugbyBall, billiardsBall,
  softball, cricketBall,
  starBall, smileBall, rainbowBall, fireBall,
];
