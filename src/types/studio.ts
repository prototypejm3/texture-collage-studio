export type TextureCategory = 
  | 'Royale' | 'Banks' | 'Bentley' | 'Cody' | 'Sunbrella'
  | 'Bubbly' | 'Karina' | 'Crave' | 'Flat Silk' | 'Checker'
  | 'Soul' | 'Nepal' | 'Sorrento'
  | 'Kenley' | 'Villa' | 'Leuven' | 'Key Largo' | 'Essence'
  | 'Synergy' | 'Milo' | 'Faithful' | 'Nico' | 'Taylor Felt'
  | 'Borough' | 'Lucky' | 'Merit' | 'Prime' | 'Tussah' | 'Bloke'
  | 'Felt' | 'Cotton' | 'Yarn' | 'Corduroy' | 'Flat Silk'
  | 'Leather' | 'Wood' | 'Concrete' | 'Marble' | 'Stripe' | 'Grid'
  | 'Animal' | 'Ripple' | 'Speckle' | 'Tie-dye' | 'Maze'
  | 'Alix' | 'Corinne' | 'ShayShari' | 'Suede Ace' | 'Jayme'
  | 'Skott' | 'Kaplan' | 'Riviera'
  | 'Nicole' | 'Byrd' | 'JaymeLyn' | 'Claude' | 'Gemini' | 'Chat'
  | 'Custom';

export type ElementType = 'shape' | 'image' | 'text';
export type ElementShape = 'soft-square' | 'rectangle' | 'circle' | 'strip' | 'torn-edge' | 'blob';
export type EdgeStyle = 'clean' | 'soft-fray' | 'rough-torn' | 'pinking' | 'scallop' | 'zigzag' | 'wave';
export type WrinkleLevel = 'none' | 'light' | 'medium' | 'heavy';
export type ShadowDepth = 'flat' | 'lifted' | 'floating';
export type FrameSize = '8x8' | '12x12' | '16x16' | 'gallery';
export type FrameColor = string; // texture ID or 'white'/'black' for solid

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
  clipPathD?: string; // SVG path d for custom section clip
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

export interface SectionTransform {
  x: number;   // translate X in SVG units
  y: number;   // translate Y in SVG units
  scale: number; // uniform scale factor
  rotation: number; // degrees
}

export const defaultSectionTransform: SectionTransform = {
  x: 0, y: 0, scale: 1, rotation: 0,
};

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
  category?: string;
  creator?: string;
}

export type VibeFills = Record<string, string>;
export type SectionTransforms = Record<string, SectionTransform>;
