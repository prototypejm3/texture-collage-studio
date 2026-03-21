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
  id: 'tarot-card', name: 'Tarot Card', emoji: '🔮', category: 'Community DIY',
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

// ── ZODIAC WHEEL ♈ ──
const zodiacWheel: Vibe = {
  id: 'zodiac-wheel', name: 'Zodiac Wheel', emoji: '♈', category: 'For Fun',
  description: 'Mystical zodiac wheel with radial segments',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'zw-outer-ring', label: 'Outer Ring', tone: 'dark',
      path: 'M240,20 A220,220 0 1,1 239.99,20 Z M240,65 A175,175 0 1,0 240.01,65 Z' },
    { id: 'zw-inner-ring', label: 'Inner Ring', tone: 'medium',
      path: 'M240,65 A175,175 0 1,1 239.99,65 Z M240,110 A130,130 0 1,0 240.01,110 Z' },
    { id: 'zw-segments-a', label: 'Segments A', tone: 'light',
      path: 'M240,65 L240,20 L244,20 L244,65 Z M279,69 L299,26 L303,28 L282,71 Z M311,87 L349,51 L352,54 L314,90 Z M240,415 L240,460 L236,460 L236,415 Z M201,411 L181,454 L177,452 L198,409 Z M169,393 L131,429 L128,426 L166,390 Z' },
    { id: 'zw-segments-b', label: 'Segments B', tone: 'accent',
      path: 'M415,240 L460,240 L460,236 L415,236 Z M411,279 L454,299 L452,303 L409,282 Z M393,311 L429,349 L426,352 L390,314 Z M65,240 L20,240 L20,244 L65,244 Z M69,201 L26,181 L28,177 L71,198 Z M87,169 L51,131 L54,128 L90,166 Z' },
    { id: 'zw-inner-disc', label: 'Inner Disc', tone: 'light',
      path: 'M240,110 A130,130 0 1,1 239.99,110 Z' },
    { id: 'zw-center-star', label: 'Center Star', tone: 'accent',
      path: 'M240,180 L248,222 L290,222 L256,248 L266,290 L240,264 L214,290 L224,248 L190,222 L232,222 Z' },
    { id: 'zw-center-dot', label: 'Center Dot', tone: 'dark',
      path: 'M240,225 A18,18 0 1,1 239.99,225 Z' },
  ],
};

// ── MESSAGE BUBBLES 💬 ──
const messageBubbles: Vibe = {
  id: 'message-bubbles', name: 'Messages', emoji: '💬', category: 'For Fun',
  description: 'Chat message bubbles with heart',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'mb-bg', label: 'Background', tone: 'light',
      path: 'M40,30 Q30,30 30,45 L30,435 Q30,450 45,450 L435,450 Q450,450 450,435 L450,45 Q450,30 435,30 Z' },
    { id: 'mb-bubble-left', label: 'Left Bubble', tone: 'medium',
      path: 'M60,60 L280,60 Q310,60 310,90 L310,155 Q310,185 280,185 L110,185 L75,210 L85,185 L90,185 Q60,185 60,155 Z' },
    { id: 'mb-bubble-right', label: 'Right Bubble', tone: 'dark',
      path: 'M170,225 L400,225 Q420,225 420,250 L420,325 Q420,350 400,350 L395,350 L405,378 L365,350 L200,350 Q170,350 170,325 Z' },
    { id: 'mb-bubble-small', label: 'Small Bubble', tone: 'medium',
      path: 'M60,375 L230,375 Q255,375 255,398 L255,415 Q255,435 230,435 L100,435 L70,455 L78,435 L85,435 Q60,435 60,415 Z' },
    { id: 'mb-heart', label: 'Heart', tone: 'accent',
      path: 'M340,385 Q340,370 355,365 Q370,362 380,375 Q390,362 405,365 Q420,370 420,385 Q420,405 380,425 Q340,405 340,385 Z' },
  ],
};

// ── STREET LAMP 🏮 ──
const streetLamp: Vibe = {
  id: 'street-lamp', name: 'Street Lamp', emoji: '🏮', category: 'For Fun',
  description: 'Elegant street lamp with glow',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'sl-glow', label: 'Light Glow', tone: 'light',
      path: 'M160,80 Q140,50 180,30 Q220,10 260,20 Q310,35 320,80 Q330,130 300,180 Q280,220 260,260 Q240,290 220,260 Q200,220 180,180 Q155,130 160,80 Z' },
    { id: 'sl-lamp-head', label: 'Lamp Head', tone: 'dark',
      path: 'M200,95 Q195,80 210,72 L270,72 Q285,80 280,95 L285,130 Q288,145 270,150 L210,150 Q192,145 195,130 Z' },
    { id: 'sl-lamp-cap', label: 'Lamp Cap', tone: 'medium',
      path: 'M215,60 Q215,50 225,48 L255,48 Q265,50 265,60 L265,72 L215,72 Z M230,48 L232,35 Q240,28 248,35 L250,48 Z' },
    { id: 'sl-arm', label: 'Curved Arm', tone: 'dark',
      path: 'M235,150 L237,180 Q238,200 245,210 Q260,230 265,250 L255,250 Q248,230 235,215 Q225,200 225,180 L223,150 Z' },
    { id: 'sl-pole', label: 'Pole', tone: 'dark',
      path: 'M230,250 L250,250 L252,420 L228,420 Z' },
    { id: 'sl-base', label: 'Base', tone: 'medium',
      path: 'M190,415 Q188,410 200,408 L280,408 Q292,410 290,415 L295,435 Q298,450 280,455 L200,455 Q182,450 185,435 Z' },
  ],
};

// ── MOONLIT WINDOW 🌙 ──
const moonWindow: Vibe = {
  id: 'moon-window', name: 'Moon Window', emoji: '🌙', category: 'For Fun',
  description: 'Window with a crescent moon outside',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'mw-sky', label: 'Night Sky', tone: 'dark',
      path: 'M100,50 L380,50 Q395,50 395,65 L395,380 L85,380 L85,65 Q85,50 100,50 Z' },
    { id: 'mw-frame', label: 'Window Frame', tone: 'medium',
      path: 'M80,40 L400,40 Q410,40 410,55 L410,390 L70,390 L70,55 Q70,40 80,40 Z M100,60 L380,60 Q390,60 390,72 L390,375 L90,375 L90,72 Q90,60 100,60 Z' },
    { id: 'mw-pane-tl', label: 'Top Left Pane', tone: 'dark',
      path: 'M100,60 L230,60 L230,210 L100,210 Q90,210 90,200 L90,72 Q90,60 100,60 Z' },
    { id: 'mw-pane-tr', label: 'Top Right Pane', tone: 'dark',
      path: 'M250,60 L380,60 Q390,60 390,72 L390,200 Q390,210 380,210 L250,210 Z' },
    { id: 'mw-pane-bl', label: 'Bottom Left Pane', tone: 'dark',
      path: 'M90,230 L230,230 L230,375 L90,375 Z' },
    { id: 'mw-pane-br', label: 'Bottom Right Pane', tone: 'dark',
      path: 'M250,230 L390,230 L390,375 L250,375 Z' },
    { id: 'mw-moon', label: 'Moon', tone: 'accent',
      path: 'M300,100 Q280,80 285,60 Q295,45 315,42 Q340,40 352,58 Q335,50 322,62 Q310,78 315,100 Q318,115 330,125 Q310,128 300,115 Z' },
    { id: 'mw-sill', label: 'Window Sill', tone: 'medium',
      path: 'M55,385 L425,385 Q435,385 435,398 L435,415 Q435,430 420,430 L60,430 Q45,430 45,415 L45,398 Q45,385 55,385 Z' },
  ],
};

// ── MS PAINT 🎨 ──
const msPaint: Vibe = {
  id: 'ms-paint', name: 'MS Paint', emoji: '🎨', category: 'For Fun',
  description: 'Retro paint program interface',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'mp-frame', label: 'Outer Frame', tone: 'medium',
      path: 'M40,40 L440,40 Q450,40 450,50 L450,440 Q450,450 440,450 L40,450 Q30,450 30,440 L30,50 Q30,40 40,40 Z M50,60 L430,60 L430,430 L50,430 Z' },
    { id: 'mp-topbar', label: 'Top Bar', tone: 'dark',
      path: 'M50,60 L430,60 L430,95 L50,95 Z' },
    { id: 'mp-toolbar', label: 'Left Toolbar', tone: 'medium',
      path: 'M50,95 L115,95 L115,400 L50,400 Z' },
    { id: 'mp-tool-square', label: 'Brush Tool', tone: 'light',
      path: 'M60,108 L105,108 L105,153 L60,153 Z' },
    { id: 'mp-tool-circle', label: 'Fill Tool', tone: 'accent',
      path: 'M82,175 A20,20 0 1,1 81.99,175 Z' },
    { id: 'mp-tool-triangle', label: 'Eraser Tool', tone: 'light',
      path: 'M82,210 L105,255 L60,255 Z' },
    { id: 'mp-canvas', label: 'Canvas Area', tone: 'light',
      path: 'M115,95 L430,95 L430,400 L115,400 Z' },
    { id: 'mp-bottombar', label: 'Bottom Bar', tone: 'dark',
      path: 'M50,400 L430,400 L430,430 L50,430 Z' },
  ],
};

export const funStencils: Vibe[] = [
  martiniGlass, wineGlass, tarotCard, candle, lipstick, discoBall, cheeseBoard, zodiacWheel, messageBubbles, streetLamp, moonWindow, msPaint,
];
