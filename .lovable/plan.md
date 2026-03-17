

# Texture Shadow Box Studio

A visual design tool for creating texture-based collage layouts inspired by shadow box art.

## Layout Structure
- **Left Panel (20%)**: Texture Library with Pinterest-style grid
- **Center (65-70%)**: Main canvas with shadow box frame
- **Top Toolbar**: Generate, Shuffle, Clear, Save PNG
- **Frame Controls**: Size selector (8x8, 12x12, 16x16, Gallery) and frame color picker (white, cream, black, wood)
- **Floating Controls**: Appear near selected elements — no right panel

## Texture Library
- Square swatch tiles in a scrollable grid with rounded corners and subtle hover zoom
- Categories: Boucle, Linen, Velvet, Leather, Suede, Marble, Wood, Terrazzo, Abstract/Patterns
- Textures generated via CSS gradients and patterns to achieve flat, evenly-lit swatch aesthetics (no external photos)

## Canvas & Interactions
- Large shadow box frame with soft depth/shadow effect on a clean minimal background
- Drag textures from library onto canvas
- Move, resize, rotate, and overlap layers freely
- Shape system: each placed texture can be switched between Square, Rectangle, Circle, or Strip

## Floating Toolbar (on selection)
- Resize, Rotate, Duplicate, Delete controls
- Shape switcher
- **Material Effects** section:
  - **Bleach/Fade**: Slider (0–100) reducing saturation, increasing brightness
  - **Edge Style**: Clean / Soft Fray / Rough Torn (CSS filter + SVG mask effects)
  - **Wrinkle**: Light / Medium / Heavy (subtle wave distortion via CSS/SVG)
  - **Grain/Texture Boost**: Slider to enhance texture detail
  - **Shadow Depth**: Flat / Lifted / Floating (box-shadow variations)

## Top Toolbar Actions
- **Generate**: Random layout with random textures and shapes
- **Shuffle**: Rearrange existing elements randomly
- **Clear**: Remove all elements from canvas
- **Save PNG**: Export canvas as PNG using html-to-canvas

## Design Approach
- Canva/Figma-inspired clean UI with soft colors and rounded elements
- All effects are subtle and aesthetic, maintaining the flat swatch aesthetic
- Smooth, instant interactions throughout
- Responsive canvas area that scales with frame size selection

