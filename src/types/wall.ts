export type WallLayout = 'grid' | 'masonry' | 'single' | 'featured';
export type WallBackground = 'warm-white' | 'cream' | 'soft-gray' | 'charcoal' | 'paper' | 'linen';
export type FrameStyle = 'none' | 'thin' | 'shadow-box' | 'polaroid';
export type DesignStatus = 'in-progress' | 'finished';
export type UserTier = 'free' | 'premium';

export interface SavedDesign {
  id: string;
  name: string;
  vibeName?: string;
  previewImage: string; // data URL
  createdAt: string;
  updatedAt: string;
  status: DesignStatus;
  builtIRL: boolean;
  pinned: boolean;
  frameStyle: FrameStyle;
  /** Serialized studio state for re-editing */
  studioState?: string;
}

export interface WallSettings {
  title: string;
  layout: WallLayout;
  background: WallBackground;
  defaultFrameStyle: FrameStyle;
}

export const defaultWallSettings: WallSettings = {
  title: 'My Wall',
  layout: 'grid',
  background: 'warm-white',
  defaultFrameStyle: 'thin',
};

export const FREE_DESIGN_LIMIT = 1;
