import { Vibe } from '@/types/studio';

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} A${r},${r} 0 1,1 ${cx + r},${cy} A${r},${r} 0 1,1 ${cx - r},${cy} Z`;
}

// ── SOCCER BALL ⚽ ──
const soccerBall: Vibe = {
  id: 'soccer-ball', name: 'Soccer Ball', emoji: '⚽', category: 'Sports',
  description: 'Classic hex-panel soccer ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<circle cx="50" cy="50" r="46" fill="#f5f0e8" stroke="#1a1714" stroke-width="4"/><polygon points="50,30 63,40 58,55 42,55 37,40" fill="#1a1714"/><polygon points="50,4 58,14 48,18 40,12" fill="#1a1714"/><polygon points="82,28 88,40 76,42 70,32" fill="#1a1714"/><polygon points="78,68 76,80 64,78 64,66" fill="#1a1714"/><polygon points="22,68 36,66 36,78 24,80" fill="#1a1714"/><polygon points="18,28 30,32 24,42 12,40" fill="#1a1714"/><line x1="50" y1="30" x2="50" y2="7" stroke="#1a1714" stroke-width="2.5"/><line x1="63" y1="40" x2="78" y2="32" stroke="#1a1714" stroke-width="2.5"/><line x1="58" y1="55" x2="70" y2="66" stroke="#1a1714" stroke-width="2.5"/><line x1="42" y1="55" x2="30" y2="66" stroke="#1a1714" stroke-width="2.5"/><line x1="37" y1="40" x2="22" y2="32" stroke="#1a1714" stroke-width="2.5"/>`,
  adultSvg: `<defs><radialGradient id="soccer-grad" cx="36%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.18"/><stop offset="100%" stop-color="#000" stop-opacity="0.1"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="#ede8e0"/><circle cx="50" cy="50" r="44" fill="url(#soccer-grad)"/><polygon points="50,31 62,40 57,54 43,54 38,40" fill="#2a2420"/><polygon points="50,6 57,14 48,18 41,13" fill="#2a2420"/><polygon points="80,28 86,39 75,41 70,32" fill="#2a2420"/><polygon points="76,67 74,78 63,76 63,65" fill="#2a2420"/><polygon points="24,67 37,65 37,76 26,78" fill="#2a2420"/><polygon points="20,28 30,32 25,41 14,39" fill="#2a2420"/><line x1="50" y1="31" x2="50" y2="8" stroke="#2a2420" stroke-width="1.2"/><line x1="62" y1="40" x2="77" y2="33" stroke="#2a2420" stroke-width="1.2"/><line x1="57" y1="54" x2="69" y2="65" stroke="#2a2420" stroke-width="1.2"/><line x1="43" y1="54" x2="31" y2="65" stroke="#2a2420" stroke-width="1.2"/><line x1="38" y1="40" x2="23" y2="33" stroke="#2a2420" stroke-width="1.2"/><circle cx="50" cy="50" r="44" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'soccer-bg', label: 'Ball', tone: 'light',
      path: circle(50, 50, 44) },
    { id: 'soccer-pent-c', label: 'Center', tone: 'dark',
      path: 'M50,30 L63,40 L58,55 L42,55 L37,40 Z' },
    { id: 'soccer-pent-top', label: 'Top', tone: 'dark',
      path: 'M50,4 L58,14 L48,18 L40,12 Z' },
    { id: 'soccer-pent-tr', label: 'Top Right', tone: 'dark',
      path: 'M82,28 L88,40 L76,42 L70,32 Z' },
    { id: 'soccer-pent-br', label: 'Bottom Right', tone: 'dark',
      path: 'M78,68 L76,80 L64,78 L64,66 Z' },
    { id: 'soccer-pent-bl', label: 'Bottom Left', tone: 'dark',
      path: 'M22,68 L36,66 L36,78 L24,80 Z' },
    { id: 'soccer-pent-tl', label: 'Top Left', tone: 'dark',
      path: 'M18,28 L30,32 L24,42 L12,40 Z' },
  ],
};

// ── BASKETBALL 🏀 ──
const basketball: Vibe = {
  id: 'basketball', name: 'Basketball', emoji: '🏀', category: 'Sports',
  description: 'Bold seam basketball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<circle cx="50" cy="50" r="46" fill="#f97316" stroke="#1a1714" stroke-width="4"/><path d="M50 4 Q72 28 72 50 Q72 72 50 96" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M50 4 Q28 28 28 50 Q28 72 50 96" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><line x1="4" y1="50" x2="96" y2="50" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/>`,
  adultSvg: `<defs><radialGradient id="bball-grad" cx="38%" cy="36%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.15"/><stop offset="100%" stop-color="#000" stop-opacity="0.18"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="#e8611a"/><circle cx="50" cy="50" r="44" fill="url(#bball-grad)"/><path d="M50 6 Q70 26 70 50 Q70 74 50 94" fill="none" stroke="#1a1714" stroke-width="1.8" stroke-linecap="round"/><path d="M50 6 Q30 26 30 50 Q30 74 50 94" fill="none" stroke="#1a1714" stroke-width="1.8" stroke-linecap="round"/><line x1="6" y1="50" x2="94" y2="50" stroke="#1a1714" stroke-width="1.8" stroke-linecap="round"/><circle cx="50" cy="50" r="44" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'bball-top-left', label: 'Top Left', tone: 'medium',
      path: `M6,50 A44,44 0 0,1 50,6 L50,50 Z` },
    { id: 'bball-top-right', label: 'Top Right', tone: 'light',
      path: `M50,6 A44,44 0 0,1 94,50 L50,50 Z` },
    { id: 'bball-bottom-right', label: 'Bottom Right', tone: 'medium',
      path: `M94,50 A44,44 0 0,1 50,94 L50,50 Z` },
    { id: 'bball-bottom-left', label: 'Bottom Left', tone: 'light',
      path: `M50,94 A44,44 0 0,1 6,50 L50,50 Z` },
  ],
};

// ── FOOTBALL 🏈 ──
const football: Vibe = {
  id: 'football', name: 'Football', emoji: '🏈', category: 'Sports',
  description: 'American football with laces',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<ellipse cx="50" cy="50" rx="42" ry="28" fill="#92400e" stroke="#1a1714" stroke-width="4"/><path d="M50 22 Q74 36 74 50 Q74 64 50 78 Q26 64 26 50 Q26 36 50 22Z" fill="none" stroke="#1a1714" stroke-width="3.5"/><line x1="18" y1="50" x2="82" y2="50" stroke="#f5f0e8" stroke-width="3" stroke-linecap="round"/><line x1="44" y1="38" x2="44" y2="62" stroke="#f5f0e8" stroke-width="3" stroke-linecap="round"/><line x1="52" y1="36" x2="52" y2="64" stroke="#f5f0e8" stroke-width="3" stroke-linecap="round"/><line x1="60" y1="38" x2="60" y2="62" stroke="#f5f0e8" stroke-width="3" stroke-linecap="round"/>`,
  adultSvg: `<defs><radialGradient id="fb-grad" cx="36%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000" stop-opacity="0.2"/></radialGradient></defs><ellipse cx="50" cy="50" rx="41" ry="27" fill="#7c3a10"/><ellipse cx="50" cy="50" rx="41" ry="27" fill="url(#fb-grad)"/><path d="M50 23 Q73 36 73 50 Q73 64 50 77 Q27 64 27 50 Q27 36 50 23Z" fill="none" stroke="#5a2a08" stroke-width="1.2"/><line x1="19" y1="50" x2="81" y2="50" stroke="#f5f0e8" stroke-width="1.5" stroke-linecap="round"/><line x1="44" y1="40" x2="44" y2="60" stroke="#f5f0e8" stroke-width="1.5" stroke-linecap="round"/><line x1="51" y1="38" x2="51" y2="62" stroke="#f5f0e8" stroke-width="1.5" stroke-linecap="round"/><line x1="58" y1="40" x2="58" y2="60" stroke="#f5f0e8" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="50" cy="50" rx="41" ry="27" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'fb-top', label: 'Top Half', tone: 'medium',
      path: 'M9,50 Q9,23 50,23 Q91,23 91,50 Z' },
    { id: 'fb-bottom', label: 'Bottom Half', tone: 'dark',
      path: 'M9,50 Q9,77 50,77 Q91,77 91,50 Z' },
    { id: 'fb-laces', label: 'Laces', tone: 'light',
      path: 'M19,48 L81,48 L81,52 L19,52 Z' },
  ],
};

// ── BASEBALL ⚾ ──
const baseball: Vibe = {
  id: 'baseball', name: 'Baseball', emoji: '⚾', category: 'Sports',
  description: 'Classic stitching baseball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<circle cx="50" cy="50" r="46" fill="#fffaf5" stroke="#1a1714" stroke-width="4"/><path d="M32 16 Q22 34 24 50 Q22 66 32 84" fill="none" stroke="#e03030" stroke-width="3" stroke-linecap="round"/><path d="M68 16 Q78 34 76 50 Q78 66 68 84" fill="none" stroke="#e03030" stroke-width="3" stroke-linecap="round"/><line x1="32" y1="26" x2="24" y2="30" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="30" y1="34" x2="22" y2="36" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="29" y1="42" x2="21" y2="42" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="29" y1="50" x2="21" y2="50" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="29" y1="58" x2="21" y2="58" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="30" y1="66" x2="22" y2="68" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="74" x2="24" y2="70" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="68" y1="26" x2="76" y2="30" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="70" y1="34" x2="78" y2="36" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="71" y1="42" x2="79" y2="42" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="71" y1="50" x2="79" y2="50" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="71" y1="58" x2="79" y2="58" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="70" y1="66" x2="78" y2="68" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/><line x1="68" y1="74" x2="76" y2="70" stroke="#e03030" stroke-width="2.5" stroke-linecap="round"/>`,
  adultSvg: `<defs><radialGradient id="bb-grad" cx="36%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.2"/><stop offset="100%" stop-color="#c8b89a" stop-opacity="0.1"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="#f5efe6"/><circle cx="50" cy="50" r="44" fill="url(#bb-grad)"/><path d="M33 18 Q23 35 25 50 Q23 65 33 82" fill="none" stroke="#c0392b" stroke-width="1.5" stroke-linecap="round"/><path d="M67 18 Q77 35 75 50 Q77 65 67 82" fill="none" stroke="#c0392b" stroke-width="1.5" stroke-linecap="round"/><line x1="33" y1="27" x2="25" y2="31" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="31" y1="35" x2="23" y2="37" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="30" y1="43" x2="22" y2="43" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="30" y1="50" x2="22" y2="50" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="30" y1="57" x2="22" y2="57" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="31" y1="65" x2="23" y2="67" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="33" y1="73" x2="25" y2="69" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="67" y1="27" x2="75" y2="31" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="69" y1="35" x2="77" y2="37" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="70" y1="43" x2="78" y2="43" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="70" y1="50" x2="78" y2="50" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="70" y1="57" x2="78" y2="57" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="69" y1="65" x2="77" y2="67" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><line x1="67" y1="73" x2="75" y2="69" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><circle cx="50" cy="50" r="44" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'bb-main', label: 'Ball', tone: 'light',
      path: circle(50, 50, 44) },
    { id: 'bb-left-panel', label: 'Left Panel', tone: 'medium',
      path: 'M25,18 Q15,35 17,50 Q15,65 25,82 L33,82 Q23,65 25,50 Q23,35 33,18 Z' },
    { id: 'bb-right-panel', label: 'Right Panel', tone: 'medium',
      path: 'M75,18 Q85,35 83,50 Q85,65 75,82 L67,82 Q77,65 75,50 Q77,35 67,18 Z' },
  ],
};

// ── TENNIS BALL 🎾 ──
const tennisBall: Vibe = {
  id: 'tennis-ball', name: 'Tennis Ball', emoji: '🎾', category: 'Sports',
  description: 'Soft S-curve tennis ball',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<circle cx="50" cy="50" r="46" fill="#a3e635" stroke="#1a1714" stroke-width="4"/><path d="M18 26 Q38 50 18 74" fill="none" stroke="#f5f0e8" stroke-width="4" stroke-linecap="round"/><path d="M82 26 Q62 50 82 74" fill="none" stroke="#f5f0e8" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="46" fill="none" stroke="#1a1714" stroke-width="4"/>`,
  adultSvg: `<defs><radialGradient id="tb-grad" cx="36%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.2"/><stop offset="100%" stop-color="#000" stop-opacity="0.12"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="#84cc16"/><circle cx="50" cy="50" r="44" fill="url(#tb-grad)"/><path d="M19 27 Q37 50 19 73" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/><path d="M81 27 Q63 50 81 73" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="50" r="44" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'tb-left', label: 'Left Half', tone: 'light',
      path: `M6,50 A44,44 0 0,1 50,6 L50,94 A44,44 0 0,1 6,50 Z` },
    { id: 'tb-right', label: 'Right Half', tone: 'medium',
      path: `M50,6 A44,44 0 0,1 94,50 A44,44 0 0,1 50,94 Z` },
  ],
};

// ── VOLLEYBALL 🏐 ── Front view
const volleyball: Vibe = {
  id: 'volleyball', name: 'Volleyball (Front)', emoji: '🏐', category: 'Sports',
  description: 'Classic front-facing volleyball with curved panel lines',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 100 100',
  kidSvg: `<circle cx="50" cy="50" r="46" fill="#fef3c7" stroke="#1a1714" stroke-width="4"/><path d="M50 4 Q80 20 90 50" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M90 50 Q80 80 50 96" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M50 4 Q20 20 10 50" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M10 50 Q20 80 50 96" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M14 34 Q50 24 86 34" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/><path d="M14 66 Q50 76 86 66" fill="none" stroke="#1a1714" stroke-width="3.5" stroke-linecap="round"/>`,
  adultSvg: `<defs><radialGradient id="vb-grad" cx="36%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.2"/><stop offset="100%" stop-color="#000" stop-opacity="0.08"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="#f0e8d0"/><circle cx="50" cy="50" r="44" fill="url(#vb-grad)"/><path d="M50 6 Q78 20 88 50" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><path d="M88 50 Q78 80 50 94" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><path d="M50 6 Q22 20 12 50" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><path d="M12 50 Q22 80 50 94" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><path d="M15 34 Q50 25 85 34" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><path d="M15 66 Q50 75 85 66" fill="none" stroke="#8a7a60" stroke-width="1.8" stroke-linecap="round"/><circle cx="50" cy="50" r="44" fill="none" stroke="#1a1714" stroke-width="1.5"/>`,
  sections: [
    { id: 'vb-bg', label: 'Ball', tone: 'light', path: circle(50, 50, 44) },
    { id: 'vb-top-left', label: 'Top Left', tone: 'medium',
      path: 'M6,50 A44,44 0 0,1 50,6 Q35,20 25,34 Q15,48 6,50 Z' },
    { id: 'vb-top-right', label: 'Top Right', tone: 'light',
      path: 'M50,6 A44,44 0 0,1 94,50 Q85,48 75,34 Q65,20 50,6 Z' },
    { id: 'vb-bottom-left', label: 'Bottom Left', tone: 'light',
      path: 'M6,50 Q15,52 25,66 Q35,80 50,94 A44,44 0 0,1 6,50 Z' },
    { id: 'vb-bottom-right', label: 'Bottom Right', tone: 'medium',
      path: 'M94,50 Q85,52 75,66 Q65,80 50,94 A44,44 0 0,1 94,50 Z' },
  ],
};

// ── VOLLEYBALL 🏐 ── Side view: rotated swirl bands
const volleyballSide: Vibe = {
  id: 'volleyball-side', name: 'Volleyball (Side)', emoji: '🏐', category: 'Sports',
  description: 'Side-angled volleyball swirl bands',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vbs-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    // Band 1: top to bottom-left curve
    { id: 'vbs-band-1', label: 'Swirl Band 1', tone: 'medium',
      path: 'M240,42 Q200,130 150,220 Q100,310 60,370 L85,395 Q125,330 175,240 Q225,145 265,50 Z' },
    // Band 2: top-right to bottom curve
    { id: 'vbs-band-2', label: 'Swirl Band 2', tone: 'medium',
      path: 'M370,65 Q320,140 280,230 Q250,320 240,438 L265,438 Q275,330 305,240 Q345,150 395,80 Z' },
    // Band 3: left to right gentle arc
    { id: 'vbs-band-3', label: 'Cross Band', tone: 'medium',
      path: 'M42,200 Q130,220 220,260 Q310,300 420,310 L425,280 Q320,275 230,235 Q140,195 45,175 Z' },
  ],
};

// ── VOLLEYBALL 🏐 ── Top view: swirl from above
const volleyballTop: Vibe = {
  id: 'volleyball-top', name: 'Volleyball (Top)', emoji: '🏐', category: 'Sports',
  description: 'Top-down volleyball swirl bands',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'vbt-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    // Band 1: gentle clockwise curve
    { id: 'vbt-band-1', label: 'Swirl Band 1', tone: 'medium',
      path: 'M180,45 Q160,140 180,240 Q200,340 260,430 L285,420 Q225,330 205,240 Q185,150 205,55 Z' },
    // Band 2: second clockwise curve offset
    { id: 'vbt-band-2', label: 'Swirl Band 2', tone: 'medium',
      path: 'M55,180 Q140,160 240,180 Q340,200 430,260 L420,285 Q330,225 240,205 Q150,185 65,205 Z' },
    // Band 3: third completing the swirl
    { id: 'vbt-band-3', label: 'Swirl Band 3', tone: 'medium',
      path: 'M380,55 Q350,140 310,220 Q260,300 150,380 L170,405 Q280,320 330,240 Q370,155 400,70 Z' },
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

// ── SHELLY'S VOLLEYBALL 🏐💜 ── Magenta themed volleyball
const shellysVolleyball: Vibe = {
  id: 'shellys-volleyball', name: "Shelly's Volleyball", emoji: '🏐', category: 'Sports',
  description: "Shelly's signature magenta volleyball",
  lightTextures: ['magenta-mrstik'], mediumTextures: ['magenta-mrstik'], darkTextures: ['magenta-mrstik'], accentTextures: ['magenta-mrstik'],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'sv-bg', label: 'Ball', tone: 'light', path: circle(240, 240, 200) },
    { id: 'sv-band-1', label: 'Swirl Band 1', tone: 'medium',
      path: 'M75,110 Q140,180 200,280 Q250,370 340,430 L365,405 Q275,350 225,260 Q165,160 100,90 Z' },
    { id: 'sv-band-2', label: 'Swirl Band 2', tone: 'medium',
      path: 'M115,60 Q180,130 235,240 Q290,340 380,400 L400,375 Q315,320 260,220 Q205,115 140,45 Z' },
    { id: 'sv-band-3', label: 'Cross Band', tone: 'dark',
      path: 'M75,370 Q150,310 220,240 Q290,170 400,110 L380,85 Q275,150 210,220 Q140,290 55,345 Z' },
  ],
};

// ═══════════════════════════════════════════
// ANCHOR STENCILS — Snap to Edge
// ═══════════════════════════════════════════

// ── BASKETBALL HOOP 🏀 ──
const basketballHoop: Vibe = {
  id: 'basketball-hoop', name: 'Basketball Hoop', emoji: '🏀', category: 'Anchors',
  description: 'Backboard, rim, and net — snap balls to the rim',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 360 480',
  sections: [
    // Backboard
    { id: 'bh-backboard', label: 'Backboard', tone: 'light',
      path: 'M60,30 L300,30 Q308,30 308,38 L308,186 Q308,194 300,194 L60,194 Q52,194 52,186 L52,38 Q52,30 60,30 Z' },
    // Target box on backboard
    { id: 'bh-target', label: 'Target Box', tone: 'accent',
      path: 'M126,66 L234,66 L234,144 L126,144 Z' },
    // Bracket arm
    { id: 'bh-bracket', label: 'Bracket', tone: 'dark',
      path: 'M170,194 L190,194 L190,225 L170,225 Z' },
    // Rim (ellipse approximated as path)
    { id: 'bh-rim', label: 'Rim', tone: 'accent',
      path: 'M102,240 Q102,218 180,218 Q258,218 258,240 Q258,262 180,262 Q102,262 102,240 Z M114,240 Q114,226 180,226 Q246,226 246,240 Q246,254 180,254 Q114,254 114,240 Z' },
    // Net (simplified trapezoid mesh)
    { id: 'bh-net', label: 'Net', tone: 'medium',
      path: 'M108,252 L132,354 L144,354 L120,258 Z M150,258 L156,354 L168,354 L162,258 Z M192,258 L198,354 L210,354 L204,258 Z M228,258 L252,354 L240,354 L216,258 Z' },
  ],
};

// ── FOOTBALL GOAL POST 🏈 ──
const footballGoalPost: Vibe = {
  id: 'football-goal-post', name: 'Football Goal Post', emoji: '🏈', category: 'Anchors',
  description: 'Classic Y-shaped goal post — kick through the uprights',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 360 600',
  sections: [
    // Base pole
    { id: 'fg-base', label: 'Base Pole', tone: 'medium',
      path: 'M168,540 L192,540 L192,330 L168,330 Z' },
    // Crossbar
    { id: 'fg-crossbar', label: 'Crossbar', tone: 'medium',
      path: 'M60,318 L300,318 L300,342 L60,342 Z' },
    // Left upright
    { id: 'fg-left', label: 'Left Upright', tone: 'medium',
      path: 'M52,60 L72,60 L72,342 L52,342 Z' },
    // Right upright
    { id: 'fg-right', label: 'Right Upright', tone: 'medium',
      path: 'M288,60 L308,60 L308,342 L288,342 Z' },
    // Left cap
    { id: 'fg-cap-l', label: 'Left Cap', tone: 'accent',
      path: circle(62, 54, 14) },
    // Right cap
    { id: 'fg-cap-r', label: 'Right Cap', tone: 'accent',
      path: circle(298, 54, 14) },
  ],
};

// ── SOCCER GOAL ⚽ ──
const soccerGoal: Vibe = {
  id: 'soccer-goal', name: 'Soccer Goal', emoji: '⚽', category: 'Anchors',
  description: '3D soccer goal with net — shoot into the net',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 360',
  sections: [
    // Front frame (bold rectangle)
    { id: 'sg-frame', label: 'Goal Frame', tone: 'light',
      path: 'M30,60 L360,60 L360,270 L30,270 Z M42,72 L348,72 L348,258 L42,258 Z' },
    // Depth lines (3D effect) — left side
    { id: 'sg-depth-l', label: 'Left Depth', tone: 'medium',
      path: 'M30,60 L90,30 L90,42 L42,66 Z M30,270 L90,300 L90,288 L42,264 Z' },
    // Depth lines — right side
    { id: 'sg-depth-r', label: 'Right Depth', tone: 'medium',
      path: 'M360,60 L420,30 L420,42 L366,66 Z M360,270 L420,300 L420,288 L366,264 Z' },
    // Back frame (dashed look via thin stroke)
    { id: 'sg-back', label: 'Back Frame', tone: 'dark',
      path: 'M90,30 L420,30 L420,300 L90,300 Z M96,36 L414,36 L414,294 L96,294 Z' },
    // Net vertical lines
    { id: 'sg-net', label: 'Net', tone: 'medium',
      path: 'M140,72 L140,258 L146,258 L146,72 Z M248,72 L248,258 L254,258 L254,72 Z M42,162 L348,162 L348,168 L42,168 Z' },
  ],
};

// ═══════════════════════════════════════════
// WORLD STENCILS — Full Scene Backgrounds
// ═══════════════════════════════════════════

// ── VOLLEYBALL COURT 🏐 ──
const volleyballCourt: Vibe = {
  id: 'volleyball-court', name: 'Volleyball Court', emoji: '🏐', category: 'Worlds',
  description: 'Top-down volleyball court with center net',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 600 390',
  sections: [
    // Court surface
    { id: 'vc-court', label: 'Court Surface', tone: 'light',
      path: 'M30,30 L570,30 Q576,30 576,36 L576,354 Q576,360 570,360 L30,360 Q24,360 24,354 L24,36 Q24,30 30,30 Z' },
    // Court boundary line
    { id: 'vc-boundary', label: 'Boundary', tone: 'dark',
      path: 'M30,30 L570,30 L570,42 L42,42 L42,348 L570,348 L570,360 L30,360 L30,30 Z M558,42 L558,348 L570,348 L570,42 Z' },
    // Center net (bold accent line)
    { id: 'vc-net', label: 'Center Net', tone: 'accent',
      path: 'M294,30 L306,30 L306,360 L294,360 Z' },
    // Left attack line
    { id: 'vc-attack-l', label: 'Attack Line Left', tone: 'medium',
      path: 'M198,42 L204,42 L204,348 L198,348 Z' },
    // Right attack line
    { id: 'vc-attack-r', label: 'Attack Line Right', tone: 'medium',
      path: 'M396,42 L402,42 L402,348 L396,348 Z' },
  ],
};

// ── BASEBALL FIELD ⚾ ──
const baseballField: Vibe = {
  id: 'baseball-field', name: 'Baseball Field', emoji: '⚾', category: 'Worlds',
  description: 'Top-down diamond with outfield arc',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 600 540',
  sections: [
    // Outfield arc (green field)
    { id: 'bf-outfield', label: 'Outfield', tone: 'light',
      path: 'M60,480 Q300,60 540,480 Z' },
    // Infield dirt (brown area)
    { id: 'bf-infield', label: 'Infield', tone: 'medium',
      path: 'M180,480 Q300,240 420,480 Z' },
    // Diamond (the key shape)
    { id: 'bf-diamond', label: 'Diamond', tone: 'accent',
      path: 'M300,240 L390,345 L300,450 L210,345 Z M300,252 L378,345 L300,438 L222,345 Z' },
    // Home plate (pentagon)
    { id: 'bf-home', label: 'Home Plate', tone: 'dark',
      path: 'M300,468 L324,450 L324,432 L276,432 L276,450 Z' },
    // Pitcher's mound
    { id: 'bf-mound', label: "Pitcher's Mound", tone: 'dark',
      path: circle(300, 345, 21) },
    // First base
    { id: 'bf-1b', label: '1st Base', tone: 'accent',
      path: 'M378,333 L390,345 L378,357 L366,345 Z' },
    // Second base
    { id: 'bf-2b', label: '2nd Base', tone: 'accent',
      path: 'M288,228 L300,240 L288,252 L276,240 Z' },
    // Third base
    { id: 'bf-3b', label: '3rd Base', tone: 'accent',
      path: 'M222,333 L234,345 L222,357 L210,345 Z' },
  ],
};

export const sportsStencils: Vibe[] = [
  soccerBall, basketball, football, baseball,
  tennisBall, volleyball, volleyballSide, volleyballTop, shellysVolleyball,
  rugbyBall, billiardsBall,
  softball, cricketBall,
  starBall, smileBall, rainbowBall, fireBall,
];

export const anchorStencils: Vibe[] = [
  basketballHoop, footballGoalPost, soccerGoal,
];

export const worldStencils: Vibe[] = [
  volleyballCourt, baseballField,
];
