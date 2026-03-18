export type TextureCategory = 
  | 'Royale' | 'Banks' | 'Bentley' | 'Cody' | 'Sunbrella'
  | 'Bubbly' | 'Karina' | 'Crave' | 'Flat Silk' | 'Checker'
  | 'Soul' | 'Nepal' | 'Sorrento'
  | 'Kenley' | 'Villa' | 'Leuven' | 'Key Largo' | 'Essence'
  | 'Synergy' | 'Milo' | 'Faithful' | 'Nico' | 'Taylor Felt'
  | 'Borough' | 'Lucky' | 'Merit' | 'Prime' | 'Tussah' | 'Bloke'
  | 'Felt' | 'Cotton' | 'Yarn' | 'Corduroy' | 'Flat Silk'
  | 'Leather' | 'Wood' | 'Concrete' | 'Stripe' | 'Grid'
  | 'Animal' | 'Ripple' | 'Speckle' | 'Tie-dye' | 'Maze'
  | 'Alix' | 'Corinne' | 'ShayShari' | 'Suede Ace' | 'Jayme'
  | 'Skott' | 'Kaplan' | 'Riviera'
  | 'Custom';

export type ElementType = 'shape' | 'image' | 'text';
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
  path: string;
  tone: 'light' | 'medium' | 'dark' | 'accent';
}

export interface Vibe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  viewBox: string;
  sections: VibeSection[];
  lightTextures: string[];
  mediumTextures: string[];
  darkTextures: string[];
  accentTextures: string[];
}

export type VibeFills = Record<string, string>;
