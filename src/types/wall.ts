export type WallLayout = 'freeform' | 'grid' | 'single';
export type WallBackground = 'brick' | 'concrete' | 'limewash' | 'black-brick' | 'black-concrete' | 'white-brick' | 'clean-white' | 'dark-brick' | 'gray-brick' | 'black-stone' | 'speckled-white' | 'custom';
export type FrameStyle = 'minimal' | 'shadow-box' | 'wood' | 'floating' | 'polaroid' | 'gold' | 'chrome' | 'copper' | 'silver' | 'none';

export type DesignSize = 'small' | 'medium' | 'large';
export type DesignStatus = 'display' | 'hidden' | 'draft';
export type UserTier = 'free' | 'premium';

export interface SavedDesign {
  id: string;
  wallId?: string; // which wall this belongs to
  name: string;
  description?: string;
  vibeName?: string;
  previewImage: string; // data URL
  createdAt: string;
  updatedAt: string;
  status: DesignStatus;
  builtIRL: boolean;
  pinned: boolean;
  hidden: boolean;
  frameStyle: FrameStyle;
  
  displaySize: DesignSize;
  /** Position on wall in freeform mode (percentage-based) */
  wallX?: number;
  wallY?: number;
  /** Rotation in degrees */
  rotation?: number;
  /** Serialized studio state for re-editing */
  studioState?: string;
}

export interface WallSettings {
  title: string;
  layout: WallLayout;
  background: WallBackground;
  defaultFrameStyle: FrameStyle;
  customWallImage?: string; // data URL for custom wall photo
}

export const defaultWallSettings: WallSettings = {
  title: 'My Wall',
  layout: 'freeform',
  background: 'white-brick',
  defaultFrameStyle: 'gold',
};

export const FREE_DESIGN_LIMIT = 1;
