import { Vibe } from '@/types/studio';

// ── MARTINI GLASS 🍸 ──
const martiniGlass: Vibe = {
  id: 'martini-glass', name: 'Martini', emoji: '🍸', category: 'For Fun',
  description: 'Classic martini glass with olive',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'mg-bowl-light', label: 'Glass Bowl', tone: 'light',
      path: 'M120,80 L360,80 L248,260 L232,260 Z' },
    { id: 'mg-bowl-shadow', label: 'Glass Shadow', tone: 'medium',
      path: 'M248,260 L360,80 L340,80 L252,240 Z' },
    { id: 'mg-stem', label: 'Stem', tone: 'dark',
      path: 'M232,260 L228,370 L252,370 L248,260 Z' },
    { id: 'mg-base', label: 'Base', tone: 'medium',
      path: 'M180,370 Q180,355 210,355 L270,355 Q300,355 300,370 Q300,395 270,400 L210,400 Q180,395 180,370 Z' },
    { id: 'mg-olive', label: 'Olive', tone: 'accent',
      path: 'M255,145 Q270,130 290,135 Q305,145 300,165 Q290,180 270,175 Q255,165 255,145 Z M275,130 L280,110 L282,130 Z' },
  ],
};

// ── WINE GLASS 🍷 ──
const wineGlass: Vibe = {
  id: 'wine-glass', name: 'Wine Glass', emoji: '🍷', category: 'For Fun',
  description: 'Elegant wine glass',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'wg-bowl', label: 'Glass Bowl', tone: 'light',
      path: 'M180,60 Q170,60 175,100 Q180,160 200,200 Q215,230 230,250 L250,250 Q265,230 280,200 Q300,160 305,100 Q310,60 300,60 Z' },
    { id: 'wg-wine', label: 'Wine', tone: 'accent',
      path: 'M185,140 Q190,180 210,210 Q225,235 235,248 L245,248 Q255,235 270,210 Q290,180 295,140 Z' },
    { id: 'wg-highlight', label: 'Highlight', tone: 'light',
      path: 'M195,80 Q192,100 195,130 Q198,115 202,90 Q200,75 195,80 Z' },
    { id: 'wg-stem', label: 'Stem', tone: 'medium',
      path: 'M232,250 L228,370 L252,370 L248,250 Z' },
    { id: 'wg-base', label: 'Base', tone: 'dark',
      path: 'M175,370 Q175,355 205,350 L275,350 Q305,355 305,370 Q305,395 275,405 L205,405 Q175,395 175,370 Z' },
  ],
};

// ── TAROT CARD 🔮 ──
const tarotCard: Vibe = {
  id: 'tarot-card', name: 'Tarot Card', emoji: '🔮', category: 'For Fun',
  description: 'Mystical tarot card with moon & star',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'tc-card', label: 'Card', tone: 'light',
      path: 'M110,40 Q100,40 100,55 L100,425 Q100,440 115,440 L365,440 Q380,440 380,425 L380,55 Q380,40 365,40 Z' },
    { id: 'tc-frame', label: 'Inner Frame', tone: 'medium',
      path: 'M125,60 L355,60 L355,420 L125,420 Z M140,75 L340,75 L340,405 L140,405 Z' },
    { id: 'tc-moon', label: 'Moon', tone: 'dark',
      path: 'M200,160 Q180,140 185,110 Q195,80 225,70 Q255,65 270,85 Q250,80 235,95 Q220,115 225,140 Q228,160 240,175 Q215,180 200,160 Z' },
    { id: 'tc-star', label: 'Star', tone: 'accent',
      path: 'M290,130 L296,148 L315,148 L300,160 L306,178 L290,166 L274,178 L280,160 L265,148 L284,148 Z' },
    { id: 'tc-eye', label: 'Eye', tone: 'dark',
      path: 'M200,280 Q220,250 240,250 Q260,250 280,280 Q260,310 240,310 Q220,310 200,280 Z M225,280 Q225,268 240,268 Q255,268 255,280 Q255,292 240,292 Q225,292 225,280 Z' },
    { id: 'tc-corner-tl', label: 'Corner TL', tone: 'accent',
      path: 'M145,80 L165,80 L165,85 L150,85 L150,100 L145,100 Z' },
    { id: 'tc-corner-br', label: 'Corner BR', tone: 'accent',
      path: 'M335,400 L315,400 L315,395 L330,395 L330,380 L335,380 Z' },
  ],
};

// ── CANDLE 🕯️ ──
const candle: Vibe = {
  id: 'candle', name: 'Candle', emoji: '🕯️', category: 'For Fun',
  description: 'Cozy candle with flickering flame',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'cn-body', label: 'Candle Body', tone: 'light',
      path: 'M180,180 Q175,175 175,185 L175,400 Q175,420 195,425 L285,425 Q305,420 305,400 L305,185 Q305,175 300,180 Z' },
    { id: 'cn-wax', label: 'Wax Drip', tone: 'medium',
      path: 'M175,180 Q180,168 195,175 Q210,185 225,172 Q240,162 255,175 Q270,185 285,172 Q300,168 305,180 L305,200 Q290,188 275,195 Q260,205 245,192 Q230,182 215,195 Q200,205 185,195 Q175,190 175,200 Z' },
    { id: 'cn-flame-outer', label: 'Flame Outer', tone: 'accent',
      path: 'M225,165 Q222,140 228,110 Q235,75 240,50 Q245,75 252,110 Q258,140 255,165 Q250,175 240,178 Q230,175 225,165 Z' },
    { id: 'cn-flame-inner', label: 'Flame Inner', tone: 'light',
      path: 'M233,160 Q232,142 236,118 Q238,95 240,80 Q242,95 244,118 Q248,142 247,160 Q245,168 240,170 Q235,168 233,160 Z' },
    { id: 'cn-shadow', label: 'Base Shadow', tone: 'dark',
      path: 'M165,420 Q170,430 200,438 L280,438 Q310,430 315,420 Q318,445 295,455 L185,455 Q162,445 165,420 Z' },
  ],
};

// ── LIPSTICK 💄 ──
const lipstick: Vibe = {
  id: 'lipstick', name: 'Lipstick', emoji: '💄', category: 'For Fun',
  description: 'Bold lipstick tube',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ls-tip', label: 'Lipstick Tip', tone: 'accent',
      path: 'M200,55 Q200,48 210,45 L270,45 Q280,48 280,55 L280,155 L200,105 Z' },
    { id: 'ls-highlight', label: 'Highlight', tone: 'light',
      path: 'M210,55 L210,95 L220,100 L220,52 Z' },
    { id: 'ls-body', label: 'Body Upper', tone: 'medium',
      path: 'M195,155 L285,155 L285,260 L195,260 Z' },
    { id: 'ls-base', label: 'Body Lower', tone: 'dark',
      path: 'M190,260 L290,260 L290,400 Q290,420 275,425 L205,425 Q190,420 190,400 Z' },
    { id: 'ls-line', label: 'Accent Line', tone: 'accent',
      path: 'M195,255 L285,255 L285,265 L195,265 Z' },
  ],
};

// ── DISCO BALL 🪩 ──
const discoBall: Vibe = {
  id: 'disco-ball', name: 'Disco Ball', emoji: '🪩', category: 'For Fun',
  description: 'Sparkling disco ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'db-hook', label: 'Hook', tone: 'dark',
      path: 'M230,30 L232,60 L248,60 L250,30 Q250,15 240,15 Q230,15 230,30 Z' },
    { id: 'db-sphere', label: 'Sphere', tone: 'medium',
      path: 'M240,70 A165,165 0 1,1 239.99,70 Z' },
    { id: 'db-tiles-top', label: 'Top Tiles', tone: 'light',
      path: 'M200,90 L210,85 L230,82 L250,82 L270,85 L280,90 L275,110 L265,108 L250,105 L230,105 L215,108 L205,110 Z M175,125 L190,115 L210,112 L210,135 L195,138 L180,135 Z M270,112 L280,115 L305,125 L300,135 L285,138 L270,135 Z' },
    { id: 'db-tiles-mid', label: 'Middle Tiles', tone: 'light',
      path: 'M145,190 L155,165 L175,155 L180,180 L165,195 L148,200 Z M195,155 L215,148 L235,145 L235,170 L215,175 L195,178 Z M255,145 L275,148 L295,155 L295,178 L275,175 L255,170 Z M315,165 L335,190 L332,200 L315,195 L300,180 L305,155 Z' },
    { id: 'db-tiles-bottom', label: 'Bottom Tiles', tone: 'light',
      path: 'M170,295 L185,280 L200,275 L200,300 L188,310 L175,308 Z M220,270 L245,268 L270,270 L268,295 L245,298 L222,295 Z M290,275 L305,280 L318,295 L315,308 L300,310 L290,300 Z' },
    { id: 'db-highlight', label: 'Highlight', tone: 'light',
      path: 'M190,120 Q180,145 178,175 Q185,155 200,135 Q208,125 205,115 Z' },
    { id: 'db-shadow', label: 'Shadow', tone: 'dark',
      path: 'M280,320 Q310,290 330,240 Q340,270 325,310 Q310,345 285,365 Q265,380 250,385 Q275,365 290,340 Z' },
  ],
};
// ── CHEESE BOARD 🧀 ──
const cheeseBoard: Vibe = {
  id: 'cheese-board', name: 'Cheese Board', emoji: '🧀', category: 'For Fun',
  description: 'Charcuterie cheese board with knife',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'cb-board', label: 'Board', tone: 'medium',
      path: 'M60,120 Q50,110 65,105 L415,105 Q430,110 420,120 L420,400 Q425,415 415,420 L65,420 Q50,415 60,400 Z' },
    { id: 'cb-board-edge', label: 'Board Edge', tone: 'dark',
      path: 'M60,390 Q50,415 65,420 L415,420 Q430,415 420,390 L420,400 Q425,415 415,420 L65,420 Q50,415 60,400 Z' },
    { id: 'cb-cheese-wedge', label: 'Cheese Wedge', tone: 'accent',
      path: 'M100,180 L220,150 L200,290 Z' },
    { id: 'cb-cheese-holes', label: 'Cheese Detail', tone: 'light',
      path: 'M140,200 Q148,192 156,200 Q148,210 140,200 Z M165,235 Q170,228 178,233 Q173,242 165,235 Z M130,245 Q136,240 142,246 Q136,253 130,245 Z' },
    { id: 'cb-crackers', label: 'Crackers', tone: 'light',
      path: 'M250,170 L310,170 L310,210 L250,210 Z M260,225 L320,225 L320,265 L260,265 Z M245,280 L305,280 L305,320 L245,320 Z' },
    { id: 'cb-knife-blade', label: 'Knife Blade', tone: 'light',
      path: 'M340,150 L380,148 Q395,155 390,170 L365,175 L340,170 Z' },
    { id: 'cb-knife-handle', label: 'Knife Handle', tone: 'dark',
      path: 'M340,155 L290,165 Q280,170 282,178 L290,180 L340,170 Z' },
  ],
};

export const funStencils: Vibe[] = [
  martiniGlass, wineGlass, tarotCard, candle, lipstick, discoBall, cheeseBoard,
];
