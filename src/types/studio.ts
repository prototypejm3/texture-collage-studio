export type TextureCategory = 
  | 'Ocean' | 'Sky' | 'Space'
  | 'Alix' | 'Corinne' | 'Shayshari' | 'Jayme'
  | 'Marble' | 'Nuts' | 'Fruit'
  | 'Animal' | 'Novelty' | 'Stripe' | 'Grid' | 'Wood' | 'Concrete' | 'Leather'
  | 'Ripple' | 'Speckle' | 'Tie-dye' | 'Maze'
  | 'Custom';

export type ElementShape = 'soft-square' | 'rectangle' | 'circle' | 'strip' | 'torn-edge' | 'blob';
export type EdgeStyle = 'clean' | 'soft-fray' | 'rough-torn' | 'pinking' | 'scallop' | 'zigzag' | 'wave';
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
  sectionId?: string;
}

export interface MaterialEffects {
  bleachFade: number;
  edgeStyle: EdgeStyle;
  wrinkle: WrinkleLevel;
  grainBoost: number;
  shadowDepth: ShadowDepth;
}

export const defaultEffects: MaterialEffects = {
  bleachFade: 0,
  edgeStyle: 'clean',
  wrinkle: 'none',
  grainBoost: 0,
  shadowDepth: 'flat',
};

// ── Vibe Outline System ──

export interface VibeSection {
  id: string;
  label: string;
  /** SVG path data (d attribute) — defines the section shape */
  path: string;
  /** Tone hint for auto-fill suggestions */
  tone: 'light' | 'medium' | 'dark' | 'accent';
}

export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** SVG viewBox dimensions */
  viewBox: string;
  /** All sections that make up this vibe outline */
  sections: VibeSection[];
  /** Suggested texture IDs per tone */
  lightTextures: string[];
  mediumTextures: string[];
  darkTextures: string[];
  accentTextures: string[];
}

/** Map of sectionId → textureId for filled sections */
export type VibeFills = Record<string, string>;
