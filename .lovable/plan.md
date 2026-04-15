

# Table Boxes: Replace Bottom Tray with Individual Toy Boxes on the Table

## What Changes

Currently in Kid mode, the four tool buttons (Keep It!, Colors, Frame, Shapes) live in a brown wooden tray bar below the canvas. The idea is to replace this with **four individual toy boxes** that sit directly on the wood table surface, similar to how the Treasure Chest already sits on the table. Each box would be a small 3D illustrated container that kids can tap to open, revealing its contents (drawers expand upward from the box).

## Design

Each box will be a small ~80×70px illustrated container sitting on the table, styled similarly to the Treasure Chest but with unique visual identity per function:

```text
┌─────────────────────────────────────────┐
│              WOOD TABLE                  │
│                                          │
│  [🎨 Colors]  [🖼️ Frame]  [🧸 Shapes]  │
│       Box         Box         Box        │
│                                          │
│  [📦 Treasure]   [Canvas]    [🗑️ Trash] │
│     Chest                                │
└─────────────────────────────────────────┘
```

- **Colors Box** — Rainbow/paint-themed box with color dots on it
- **Frame Box** — Picture-frame themed box  
- **Shapes Box** — Bear/stencil themed box
- **Keep It! (Treasure Chest)** — Already exists, stays as-is

When tapped, each box opens its lid (like TreasureChest) and the corresponding ExpandableDrawer content appears above it.

## Technical Plan

### 1. Create `KidToolBox` component (`src/components/studio/KidToolBox.tsx`)
- A reusable small box component (similar visual structure to TreasureChest but ~60% the size)
- Props: `id`, `label`, `emoji`, `isOpen`, `onToggle`, `themeColor` (each box gets a distinct color scheme)
- Animated lid that tilts open on tap (reuse framer-motion pattern from TreasureChest)
- Four variants: Colors (rainbow), Frame (picture frame), Shapes (bear), Keep It (existing chest)

### 2. Update `Canvas.tsx` — Position boxes on the table
- Remove the bottom tray rendering for kid mode
- Place 3-4 `KidToolBox` components as absolute-positioned elements on the table surface
- Each box triggers `toggleBox(id)` on tap, same as current BoxButtons
- Position them in a row near the bottom of the table area, leaving room for the canvas above

### 3. Update `Index.tsx` — Remove kid mode bottom tray
- Remove the wooden tray `<div>` that wraps the BoxButtons (lines ~1190-1225)
- The boxes now live on the table inside Canvas, so the ExpandableDrawer panels still open from the activeBox state
- Keep the ExpandableDrawer rendering logic as-is — it just gets triggered by the table boxes instead

### 4. Adjust ExpandableDrawer positioning
- When a table box is tapped, the drawer should appear anchored near that box's position on the table (or as a floating panel above the table)
- On mobile, drawers continue to slide up from the bottom

## What Stays the Same
- Adult mode UI is completely unchanged
- All drawer contents (TextureLibrary, BottomBar/Frame, BuildPanel/Stencils) remain identical
- Treasure Chest storage functionality unchanged
- ExpandableDrawer component unchanged internally

