export const LABELS = {
  kids: {
    // Nav
    myRoom: "My Room",
    showAndTell: "Show & Tell",
    // Toolbar
    save: "Keep It!",
    colors: "Colors",
    frame: "Frame",
    shapes: "Shapes",
    // Panel
    shapePanel: "SHAPE",
    grow: "Grow",
    shrink: "Shrink",
    cut: "Cut",
    fade: "Fade",
    crumple: "Crumple",
    twin: "Twin",
    toss: "Toss",
    // General
    myBox: "My Treasure Box",
    stencils: "Stencils",
    assets: "My Stuff",
    fun: "Fun",
    kidsGallery: "Gallery",
    startOver: "Start Over",
    trash: "Trash",
    sitDown: "Sit Down",
    standUp: "Stand Up",
    layers: "Stack",
    tools: "Magic Tools",
  },
  adult: {
    // Nav
    myRoom: "My Studio",
    showAndTell: "Showcase",
    // Toolbar
    save: "Save",
    colors: "Colors",
    frame: "Frame",
    shapes: "Elements",
    // Panel
    shapePanel: "ELEMENT",
    grow: "Scale Up",
    shrink: "Scale Down",
    cut: "Delete",
    fade: "Opacity",
    crumple: "Distort",
    twin: "Duplicate",
    toss: "Remove",
    // General
    myBox: "Library",
    stencils: "Templates",
    assets: "Assets",
    fun: "Explore",
    kidsGallery: "Kids Gallery",
    startOver: "Reset",
    trash: "Delete",
    sitDown: "Exit Canvas",
    standUp: "Stand Up",
    layers: "Layers",
    tools: "Tools",
  },
} as const;

export type ModeLabels = { [K in keyof typeof LABELS.kids]: string };

export function getLabels(kidMode: boolean): ModeLabels {
  return kidMode ? LABELS.kids : LABELS.adult;
}
