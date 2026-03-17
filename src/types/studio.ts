export type TextureCategory = 
  | 'Boucle' | 'Linen' | 'Velvet' | 'Leather' | 'Suede' 
  | 'Marble' | 'Wood' | 'Terrazzo' | 'Abstract';

export type ElementShape = 'square' | 'rectangle' | 'circle' | 'strip';
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
