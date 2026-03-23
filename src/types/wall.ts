export type WallLayout = 'freeform' | 'grid' | 'single';
export type WallBackground = 'brick' | 'concrete' | 'limewash' | 'white-brick' | 'clean-white' | 'speckled-white' | 'wood-birch-wall' | 'wood-oak-wall' | 'wood-walnut-wall' | 'sky-blue' | 'mint' | 'blush' | 'red' | 'green' | 'floral' | 'custom';
export type FrameStyle = 'minimal' | 'shadow-box' | 'wood' | 'floating' | 'polaroid' | 'gold' | 'chrome' | 'copper' | 'silver' | 'black' | 'none' | 'rainbow';
export type HangingStyle = 'floating' | 'string' | 'spotlight' | 'hook' | 'shelf' | 'lighted-string' | 'metal-wire' | 'hemp' | 'white-string' | 'braided' | 'pink-yarn' | 'beaded' | 'silver-screw' | 'red-tack' | 'cork-tack';
export type LightingPreset = 'none' | 'gallery' | 'golden-hour' | 'dramatic' | 'soft-diffused';
export type AmbientSound = 'none' | 'gallery' | 'loft' | 'home';

export type DesignSize = 'small' | 'medium' | 'large';
export type DesignStatus = 'display' | 'hidden' | 'draft';
export type UserTier = 'free' | 'premium';

export interface SavedDesign {
  id: string;
  wallId?: string;
  name: string;
  description?: string;
  artist?: string;
  vibeName?: string;
  previewImage: string;
  createdAt: string;
  updatedAt: string;
  status: DesignStatus;
  builtIRL: boolean;
  pinned: boolean;
  hidden: boolean;
  frameStyle: FrameStyle;
  hangingStyle?: HangingStyle;
  isHero?: boolean;
  showTitleCard?: boolean;
  
  // Museum label fields
  curatorNote?: string;
  edition?: string;
  materials?: string;
  stencilCreator?: string;
  displaySize: DesignSize;
  wallX?: number;
  wallY?: number;
  rotation?: number;
  studioState?: string;
  gallerySubmissionId?: string;
  createdInMode?: 'kid' | 'adult';
}

export interface WallSettings {
  title: string;
  layout: WallLayout;
  background: WallBackground;
  defaultFrameStyle: FrameStyle;
  defaultHangingStyle: HangingStyle;
  customWallImage?: string;
  lightingPreset: LightingPreset;
  ambientSound: AmbientSound;
  showTitleCards: boolean;
}

export const defaultWallSettings: WallSettings = {
  title: 'My Wall',
  layout: 'freeform',
  background: 'white-brick',
  defaultFrameStyle: 'gold',
  defaultHangingStyle: 'floating',
  lightingPreset: 'none',
  ambientSound: 'none',
  showTitleCards: false,
};

export const FREE_DESIGN_LIMIT = 3;
