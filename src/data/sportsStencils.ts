import { Vibe } from '@/types/studio';

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

// ── SOCCER BALL ⚽ ──
const soccerBall: Vibe = {
  id: 'soccer-ball', name: 'Soccer Ball', emoji: '⚽', category: 'Sports',
  description: 'Classic hex-panel soccer ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'soccer-outer', label: 'Ball', tone: 'light',
      path: circle(240, 240, 200) },
    { id: 'soccer-center-pent', label: 'Center Pentagon', tone: 'dark',
      path: 'M240,180 L275,200 L265,240 L215,240 L205,200 Z' },
    { id: 'soccer-hex-top', label: 'Top Panel', tone: 'medium',
      path: 'M240,180 L205,200 L180,160 L210,130 L270,130 L300,160 L275,200 Z' },
    { id: 'soccer-hex-left', label: 'Left Panel', tone: 'medium',
      path: 'M205,200 L215,240 L185,275 L150,260 L145,215 L180,160 Z' },
    { id: 'soccer-hex-right', label: 'Right Panel', tone: 'medium',
      path: 'M275,200 L300,160 L335,215 L330,260 L295,275 L265,240 Z' },
    { id: 'soccer-hex-bottom', label: 'Bottom Panel', tone: 'accent',
      path: 'M215,240 L265,240 L295,275 L270,310 L210,310 L185,275 Z' },
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

// ── FOOTBALL 🏈 ──
const football: Vibe = {
  id: 'football', name: 'Football', emoji: '🏈', category: 'Sports',
  description: 'American football with laces',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'fb-top', label: 'Top Half', tone: 'medium',
      path: 'M80,240 Q80,120 240,100 Q400,120 400,240 L80,240 Z' },
    { id: 'fb-bottom', label: 'Bottom Half', tone: 'dark',
      path: 'M80,240 L400,240 Q400,360 240,380 Q80,360 80,240 Z' },
    { id: 'fb-stripe-top', label: 'Top Stripe', tone: 'light',
      path: 'M100,135 Q110,120 140,115 L140,145 Q115,150 100,160 Z' },
    { id: 'fb-stripe-bottom', label: 'Bottom Stripe', tone: 'light',
      path: 'M100,345 Q110,360 140,365 L140,335 Q115,330 100,320 Z' },
    { id: 'fb-laces', label: 'Laces', tone: 'accent',
      path: 'M200,215 L280,215 L280,225 L200,225 Z M210,200 L215,225 L220,200 Z M235,200 L240,225 L245,200 Z M260,200 L265,225 L270,200 Z' },
  ],
};

// ── BASEBALL ⚾ ──
const baseball: Vibe = {
  id: 'baseball', name: 'Baseball', emoji: '⚾', category: 'Sports',
  description: 'Classic stitching baseball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'bb-main', label: 'Ball', tone: 'light',
      path: circle(240, 240, 200) },
    { id: 'bb-left-panel', label: 'Left Panel', tone: 'medium',
      path: 'M100,100 Q180,180 180,240 Q180,300 100,380 L80,370 Q150,290 150,240 Q150,190 80,110 Z' },
    { id: 'bb-right-panel', label: 'Right Panel', tone: 'medium',
      path: 'M380,100 Q300,180 300,240 Q300,300 380,380 L400,370 Q330,290 330,240 Q330,190 400,110 Z' },
    { id: 'bb-stitch-left', label: 'Left Stitch', tone: 'accent',
      path: 'M95,105 Q175,185 175,240 Q175,295 95,375 L105,385 Q185,305 185,240 Q185,175 105,95 Z' },
    { id: 'bb-stitch-right', label: 'Right Stitch', tone: 'accent',
      path: 'M385,105 Q305,185 305,240 Q305,295 385,375 L375,385 Q295,305 295,240 Q295,175 375,95 Z' },
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

// ── VOLLEYBALL 🏐 ──
const volleyball: Vibe = {
  id: 'volleyball', name: 'Volleyball', emoji: '🏐', category: 'Sports',
  description: 'Swirl panel volleyball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vb-panel1', label: 'Panel 1', tone: 'light',
      path: `M240,40 Q340,100 380,200 L240,240 Z` },
    { id: 'vb-panel2', label: 'Panel 2', tone: 'medium',
      path: `M380,200 Q420,320 340,420 L240,240 Z` },
    { id: 'vb-panel3', label: 'Panel 3', tone: 'light',
      path: `M340,420 Q240,460 140,420 L240,240 Z` },
    { id: 'vb-panel4', label: 'Panel 4', tone: 'medium',
      path: `M140,420 Q60,320 100,200 L240,240 Z` },
    { id: 'vb-panel5', label: 'Panel 5', tone: 'light',
      path: `M100,200 Q140,100 240,40 L240,240 Z` },
    { id: 'vb-ring', label: 'Outer Ring', tone: 'dark',
      path: `${circle(240, 240, 200)} ${circle(240, 240, 185)}` },
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

// ── SOFTBALL 🥎 ──
const softball: Vibe = {
  id: 'softball', name: 'Softball', emoji: '🥎', category: 'Sports',
  description: 'Chunky stitching softball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
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
  tennisBall, volleyball, rugbyBall, billiardsBall,
  softball, cricketBall,
  starBall, smileBall, rainbowBall, fireBall,
];
