import { Vibe } from '@/types/studio';

// ── SIDE PROFILE — flowing hair ──
const sideProfile: Vibe = {
  id: 'portrait-side-profile', name: 'Side Profile', emoji: '👩', category: 'Portraits',
  description: 'Elegant side profile with flowing hair',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ps-face', label: 'Face', tone: 'light' as const,
      path: 'M220,120 C200,120 185,135 178,155 C172,175 170,195 175,210 C178,220 185,232 195,240 C200,248 198,260 190,268 C185,274 182,282 185,290 C188,298 195,305 205,308 C215,310 225,308 232,302 C240,295 248,285 252,272 C255,260 252,248 248,238 C245,228 248,215 255,205 C262,195 265,180 262,165 C258,148 245,130 228,122 Z' },
    { id: 'ps-hair', label: 'Hair', tone: 'dark' as const,
      path: 'M228,122 C245,130 258,148 262,165 C270,155 282,148 290,155 C298,162 295,178 288,192 C282,205 275,220 272,240 C270,260 275,285 285,310 C292,328 298,348 295,365 C290,382 278,395 260,402 C245,408 228,410 210,405 C195,400 185,392 180,380 C175,368 178,355 182,345 C188,332 195,318 195,305 C195,305 188,298 185,290 C182,282 185,274 190,268 C198,260 200,248 195,240 C185,232 178,220 175,210 C170,195 172,175 178,155 C185,135 200,120 220,120 C222,108 228,95 240,88 C255,80 272,82 282,92 C290,100 292,112 288,125 C282,138 272,148 262,155 Z' },
    { id: 'ps-neck', label: 'Neck', tone: 'medium' as const,
      path: 'M205,308 C210,320 208,338 205,355 C202,372 198,388 200,400 C202,408 208,415 218,418 L218,440 L185,440 L185,410 C178,398 175,385 178,370 C180,355 185,340 188,325 C190,315 195,310 205,308 Z' },
    { id: 'ps-ear', label: 'Ear', tone: 'accent' as const,
      path: 'M252,200 C258,195 265,198 268,205 C270,212 268,222 262,225 C256,228 250,222 248,215 C246,208 248,202 252,200 Z' },
  ],
};

// ── FRONT FACE — eyes closed ──
const frontFace: Vibe = {
  id: 'portrait-front-face', name: 'Closed Eyes', emoji: '👩', category: 'Portraits',
  description: 'Front-facing portrait with closed eyes',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'pf-face', label: 'Face', tone: 'light' as const,
      path: 'M240,100 C275,100 305,115 325,140 C345,165 352,198 348,230 C345,255 335,278 322,298 C310,315 295,328 278,338 C265,345 250,350 240,350 C230,350 215,345 202,338 C185,328 170,315 158,298 C145,278 135,255 132,230 C128,198 135,165 155,140 C175,115 205,100 240,100 Z' },
    { id: 'pf-hair', label: 'Hair', tone: 'dark' as const,
      path: 'M240,68 C210,68 182,78 160,98 C140,115 128,140 125,168 C122,155 115,145 105,142 C95,140 88,148 85,160 C82,175 88,195 98,205 C105,212 112,215 118,212 C120,225 125,240 132,252 C132,230 135,198 155,165 C172,138 200,118 232,108 C238,106 245,105 250,105 C260,106 270,110 278,118 C295,132 310,155 320,180 C330,205 335,228 338,248 C345,235 352,218 355,200 C362,210 368,198 370,180 C372,162 365,145 355,138 C345,132 340,140 338,155 C335,140 328,122 315,108 C300,92 280,78 258,72 C252,70 245,68 240,68 Z' },
    { id: 'pf-left-eye', label: 'Left Eye', tone: 'accent' as const,
      path: 'M185,205 C192,198 205,196 218,200 C222,202 225,205 222,208 C218,212 208,215 198,214 C190,212 185,210 185,205 Z' },
    { id: 'pf-right-eye', label: 'Right Eye', tone: 'accent' as const,
      path: 'M258,200 C265,196 278,196 288,202 C292,205 292,210 288,212 C282,215 272,215 262,212 C256,210 255,205 258,200 Z' },
    { id: 'pf-lips', label: 'Lips', tone: 'medium' as const,
      path: 'M215,298 C222,290 232,286 240,285 C248,286 258,290 265,298 C268,302 265,308 258,312 C250,316 245,318 240,318 C235,318 230,316 222,312 C215,308 212,302 215,298 Z' },
    { id: 'pf-neck', label: 'Neck', tone: 'light' as const,
      path: 'M218,350 C225,355 232,358 240,358 C248,358 255,355 262,350 L270,440 L210,440 Z' },
  ],
};

// ── BACK VIEW — hair up ──
const backView: Vibe = {
  id: 'portrait-back-view', name: 'Elegant Back', emoji: '👩', category: 'Portraits',
  description: 'Woman\'s back and shoulders, hair up',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'pb-shoulders', label: 'Shoulders', tone: 'light' as const,
      path: 'M210,280 C195,285 175,298 158,318 C140,340 125,368 115,400 L115,440 L365,440 L365,400 C355,368 340,340 322,318 C305,298 285,285 270,280 L270,260 C262,265 252,268 240,268 C228,268 218,265 210,260 Z' },
    { id: 'pb-neck', label: 'Neck', tone: 'light' as const,
      path: 'M210,260 C215,240 220,220 222,200 L258,200 C260,220 265,240 270,260 C262,265 252,268 240,268 C228,268 218,265 210,260 Z' },
    { id: 'pb-hair-bun', label: 'Hair Bun', tone: 'dark' as const,
      path: 'M200,110 C200,75 218,50 240,50 C262,50 280,75 280,110 C280,145 262,165 240,165 C218,165 200,145 200,110 Z' },
    { id: 'pb-hair-base', label: 'Hair Back', tone: 'medium' as const,
      path: 'M218,165 C222,175 228,182 240,185 C252,182 258,175 262,165 C265,178 262,195 258,200 L222,200 C218,195 215,178 218,165 Z' },
    { id: 'pb-spine', label: 'Spine Detail', tone: 'accent' as const,
      path: 'M238,200 L238,340 L242,340 L242,200 Z' },
  ],
};

// ── CLOSE-UP — hand near face ──
const closeupHand: Vibe = {
  id: 'portrait-closeup-hand', name: 'Graceful Touch', emoji: '👩', category: 'Portraits',
  description: 'Close-up face with hand near cheek',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'pc-face', label: 'Face', tone: 'light' as const,
      path: 'M240,80 C280,80 315,100 338,132 C360,162 368,200 362,238 C358,265 345,290 328,310 C312,328 292,342 270,350 C255,355 242,358 235,358 C225,358 212,352 198,342 C178,328 162,308 152,285 C142,262 138,235 140,210 C142,180 152,152 170,130 C192,105 215,88 240,80 Z' },
    { id: 'pc-hair', label: 'Flowing Hair', tone: 'dark' as const,
      path: 'M240,50 C205,52 175,68 155,95 C138,118 128,148 125,180 C122,210 125,242 135,268 C130,260 118,258 108,265 C98,275 95,292 100,308 C105,322 118,328 128,320 C132,316 135,310 138,300 C145,320 158,338 175,352 C165,358 158,368 155,382 C152,398 158,418 172,428 C185,438 205,438 218,430 C228,422 235,410 238,395 C240,382 235,370 228,362 C235,358 242,358 252,355 C260,368 272,378 288,382 C305,385 322,378 332,365 C340,352 342,335 335,320 C330,308 322,302 312,305 C318,318 315,332 308,342 C298,355 282,360 270,350 C292,342 312,328 328,310 C345,290 358,265 362,238 C368,200 360,162 338,132 C315,100 280,80 240,80 C240,72 245,62 255,55 C268,48 282,52 290,62 C298,72 300,88 295,102 C288,85 275,75 260,72 C250,70 242,72 240,80 L240,50 Z' },
    { id: 'pc-hand', label: 'Hand', tone: 'medium' as const,
      path: 'M128,320 C135,332 148,342 158,345 C162,346 165,342 162,338 L150,310 C148,305 142,302 138,305 C132,308 128,315 128,320 Z M108,265 C102,270 98,280 98,292 L92,282 C88,275 85,268 88,262 C92,255 100,258 108,265 Z' },
    { id: 'pc-lips', label: 'Lips', tone: 'accent' as const,
      path: 'M218,292 C225,285 235,282 245,282 C255,285 262,290 265,298 C262,305 255,310 245,312 C235,310 225,305 220,298 Z' },
  ],
};

// ── HEAD WRAP / UPDO ──
const headWrap: Vibe = {
  id: 'portrait-headwrap', name: 'Head Wrap', emoji: '👩', category: 'Portraits',
  description: 'Side profile with elaborate head wrap',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'ph-face', label: 'Face', tone: 'light' as const,
      path: 'M220,180 C215,195 210,212 212,228 C215,245 222,260 228,272 C232,280 230,290 225,298 C220,305 218,315 222,325 C228,335 238,340 248,338 C258,335 265,325 268,312 C270,300 268,288 262,278 C258,270 260,258 265,248 C272,235 275,218 272,200 C268,185 258,172 245,168 C235,165 225,170 220,180 Z' },
    { id: 'ph-wrap', label: 'Head Wrap', tone: 'accent' as const,
      path: 'M245,168 C258,172 268,185 272,200 C280,188 292,180 305,182 C318,185 328,198 332,215 C335,235 330,258 318,275 C308,290 295,300 280,305 C265,308 252,305 245,295 C255,288 262,278 265,265 C268,248 265,235 260,220 C260,215 262,210 268,208 C275,205 282,210 285,220 C288,235 285,252 278,265 C272,275 265,282 258,285 C260,272 258,258 252,245 C245,232 242,218 245,200 C248,188 252,178 258,172 C262,155 270,140 282,132 C295,125 310,128 320,140 C330,152 332,170 328,188 C325,175 315,162 302,158 C290,155 278,162 272,175 Z' },
    { id: 'ph-wrap-fold', label: 'Wrap Detail', tone: 'medium' as const,
      path: 'M305,182 C310,178 318,178 325,182 C330,188 332,198 332,215 C328,205 320,195 312,190 Z' },
    { id: 'ph-neck', label: 'Neck', tone: 'light' as const,
      path: 'M228,335 C230,348 228,362 225,378 L225,440 L260,440 L260,378 C262,362 265,348 268,338 C258,345 245,345 235,340 Z' },
    { id: 'ph-earring', label: 'Earring', tone: 'dark' as const,
      path: 'M262,278 C268,282 272,290 270,300 C268,308 262,312 258,310 L255,325 C253,332 250,335 248,330 L252,312 C248,308 246,300 248,292 C250,284 256,278 262,278 Z' },
  ],
};

// ── MINIMAL PROFILE ──
const minimalProfile: Vibe = {
  id: 'portrait-minimal', name: 'Minimal Profile', emoji: '👩', category: 'Portraits',
  description: 'Clean minimal side profile — essential lines',
  lightTextures: [], mediumTextures: [], darkTextures: [], accentTextures: [],
  viewBox: '0 0 480 480',
  sections: [
    { id: 'pm-face', label: 'Face Outline', tone: 'medium' as const,
      path: 'M260,100 C250,100 238,108 230,120 C222,132 218,148 218,165 C218,182 222,198 228,210 C232,218 230,228 225,235 C218,245 215,258 220,270 C225,280 235,288 245,290 C255,288 262,280 265,270 C268,258 265,248 260,238 C255,228 258,218 262,210 C268,198 272,182 272,165 C272,148 268,132 262,120 C258,112 255,105 260,100 Z' },
    { id: 'pm-neck', label: 'Neck', tone: 'light' as const,
      path: 'M235,290 C238,305 235,322 232,340 L232,440 L260,440 L260,340 C262,322 265,305 268,290 C262,295 255,298 248,298 C240,298 235,295 235,290 Z' },
    { id: 'pm-nose', label: 'Nose', tone: 'accent' as const,
      path: 'M218,165 C212,172 208,182 210,192 C212,200 218,205 225,202 C228,200 228,195 225,190 C222,185 220,178 222,170 Z' },
    { id: 'pm-lip', label: 'Lips', tone: 'dark' as const,
      path: 'M220,252 C225,248 232,246 240,248 C248,250 252,255 250,260 C248,265 240,268 232,266 C225,264 220,258 220,252 Z' },
  ],
};

export const portraitStencils: Vibe[] = [
  sideProfile, frontFace, backView, closeupHand, minimalProfile,
];
