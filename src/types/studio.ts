export type TextureCategory = 
  | 'Boucle' | 'Linen' | 'Velvet' | 'Leather' | 'Suede' 
  | 'Marble' | 'Wood' | 'Terrazzo' | 'Abstract';

export type ElementShape = 'soft-square' | 'rectangle' | 'circle' | 'strip' | 'torn-edge' | 'blob';
export type EdgeStyle = 'clean' | 'soft-fray' | 'rough-torn';
export type WrinkleLevel = 'none' | 'light' | 'medium' | 'heavy';
export type ShadowDepth = 'flat' | 'lifted' | 'floating';
export type FrameSize = '8x8' | '12x12' | '16x16' | 'gallery';
export type FrameColor = 'white' | 'cream' | 'black' | 'walnut' | 'oak' | 'mahogany';

export interface TextureSwatch {
  id: string;
  name: string;
  category: TextureCategory;
  cssBackground: string;
}

export interface CanvasElement {
  id: string;
  textureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shape: ElementShape;
  zIndex: number;
  effects: MaterialEffects;
  sectionId?: string; // links element to a template section
}

export interface MaterialEffects {
  bleachFade: number;       // 0-100
  edgeStyle: EdgeStyle;
  wrinkle: WrinkleLevel;
  grainBoost: number;       // 0-100
  shadowDepth: ShadowDepth;
}

export const defaultEffects: MaterialEffects = {
  bleachFade: 0,
  edgeStyle: 'clean',
  wrinkle: 'none',
  grainBoost: 0,
  shadowDepth: 'flat',
};

// ── Template & Vibe types ──

export interface TemplateSection {
  id: string;
  /** Position and size as percentages of canvas (0-100) */
  x: number;
  y: number;
  width: number;
  height: number;
  shape: ElementShape;
  /** Tone hint for auto-fill: light, medium, dark, accent */
  tone: 'light' | 'medium' | 'dark' | 'accent';
}

export interface FrameTemplate {
  id: string;
  name: string;
  sections: TemplateSection[];
}

export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  template: FrameTemplate;
  /** Texture IDs or categories that match this vibe */
  texturePool: string[];
  /** Ordered from light to dark for tone matching */
  lightTextures: string[];
  mediumTextures: string[];
  darkTextures: string[];
  accentTextures: string[];
}
