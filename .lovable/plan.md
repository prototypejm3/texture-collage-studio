## Scope
Make the canvas shape-switcher button (added in previous build) visible **only in Kid mode**, not in Adult/Granny mode.

## Technical Plan
1. **Canvas.tsx**: Pass `kidMode` prop to `<CanvasElementComponent>`.
2. **CanvasElement.tsx**: 
   - Accept `kidMode?: boolean` in `Props`.
   - Wrap the shape-switcher UI in `{kidMode && ...}` so it only renders when Kid mode is active.

## Why this is safe
- Adult users still have the full shape selector inside the `FloatingToolbar` (Elements section).
- The canvas quick-switcher is a kid-friendly shortcut that would clutter the adult minimal UI.