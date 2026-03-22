export const LABELS = {
  kids: {
    myRoom: "My Room",
    showAndTell: "Show & Tell",
    shapes: "Shapes",
    shapePanel: "SHAPE",
    grow: "Grow",
    shrink: "Shrink",
    cut: "Cut",
    fade: "Fade",
    crumple: "Crumple",
    twin: "Twin",
    toss: "Toss",
    swatchBox: "My Swatch Box",
    sitDown: "Sit Down",
    standUp: "Stand Up",
    startOver: "Start Over",
    trash: "Trash",
    gallery: "Show & Tell",
    wall: "My Room",
    myBox: "My Box",
  },
  adult: {
    myRoom: "My Studio",
    showAndTell: "Showcase",
    shapes: "Elements",
    shapePanel: "ELEMENT",
    grow: "Scale Up",
    shrink: "Scale Down",
    cut: "Delete",
    fade: "Opacity",
    crumple: "Distort",
    twin: "Duplicate",
    toss: "Remove",
    swatchBox: "My Collection",
    sitDown: "Exit Canvas",
    standUp: "Stand Up",
    startOver: "Reset",
    trash: "Delete",
    gallery: "Showcase",
    wall: "My Studio",
    myBox: "My Collection",
  },
} as const;

export type ModeLabels = typeof LABELS.kids;

export function getLabels(kidMode: boolean): ModeLabels {
  return kidMode ? LABELS.kids : LABELS.adult;
}
