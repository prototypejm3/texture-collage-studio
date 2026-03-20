import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a world-class SVG illustrator creating stencil outlines for a shadow-box art studio.

The canvas is 480×480.

GOLDEN RULE: Create a simple, recognizable cartoon silhouette that a child could easily identify at first glance.
A user should instantly say "That's a [subject]!" — never "What is that?"

CRITICAL RULE
You must FIRST create a clear, recognizable OUTER SILHOUETTE of the subject.
ONLY AFTER the silhouette is correct should you divide it into sections.

STEP 1: SILHOUETTE — MOST IMPORTANT
- Think of the subject as a STICKER or COOKIE CUTTER shape
- Use a simple CARTOON style — bold, clean, friendly proportions
- Exaggerate defining features (big head, clear tail, obvious wings, etc.)
- The silhouette alone, with NO internal detail, must be 100% identifiable
- Use the most iconic/recognizable pose (e.g., side profile for animals)
- Center the subject and fill 70–85% of the canvas
- DO NOT use abstract or artistic interpretation — be LITERAL

STEP 2: DIVIDE INTO SECTIONS (4–6 only)
- Cut the silhouette into 4–6 LARGE interlocking sections
- Sections must follow the subject's anatomy/structure (head, body, legs, tail, wings, etc.)
- Every section must be BIG — no tiny fragments or slivers
- No random blob shapes — each piece should be a logical, nameable part
- Sections must tile together perfectly: no gaps, no overlaps
- Shared edges between sections must use identical coordinates
- NEVER cut through key identity features (face, eyes, distinctive shapes)

SHAPE RULES
- Use bold, simple curves (Q and C commands)
- Avoid wobbly, noisy, or micro-detailed forms
- All paths must be closed (end with Z)
- Use only: M, L, Q, C, Z with integers only
- Keep anchor points minimal — fewer is better
- Shapes must look clean and intentional
- NO overlapping geometry, NO confusing intersections

SECTION DESIGN
Each section gets a tone for shading:
- light = highlight area
- medium = mid-tone area  
- dark = shadow area
- accent = focal feature (eyes, face, key detail)

COMPOSITION
- Strong, clear profile or front-facing view
- The silhouette should read clearly even at thumbnail size
- Proportions should be slightly cartoonish (bigger heads, simpler limbs)

SPECIFIC SUBJECT GUIDANCE
- Animals: Must have clearly identifiable head shape, body, and limbs/tail
- Dragons: Clear head with snout, curved body, tail, simple wing shapes
- People: Recognizable head, torso, limbs in a clear pose
- Objects: Iconic shape with 2-3 defining details
- Buildings: Clear architectural silhouette with key features

You MUST respond using the generate_stencil tool. Return only valid SVG path data for each section. No explanations. No extra text.`;

interface CuratedStencil {
  name: string;
  emoji: string;
  description: string;
  keywords: RegExp;
  sections: { id: string; label: string; tone: string; path: string }[];
}

const CURATED: CuratedStencil[] = [
  {
    name: "Dinosaur", emoji: "🦖", description: "Bold T-Rex silhouette",
    keywords: /(dinosaur|dino|t-rex|trex|tyrannosaurus)/,
    sections: [
      { id: "dino-head", label: "Head", tone: "accent", path: "M84,196 Q108,152 154,132 Q194,116 238,126 Q252,128 260,140 Q258,154 244,164 Q220,176 206,196 Q194,214 178,224 Q148,240 114,232 Q92,226 80,210 Z" },
      { id: "dino-neck", label: "Neck", tone: "medium", path: "M178,224 Q196,198 214,178 Q236,160 258,154 Q276,164 286,186 Q276,222 254,254 Q236,276 214,292 Q192,286 176,262 Q168,244 178,224 Z" },
      { id: "dino-back-tail", label: "Back & Tail", tone: "medium", path: "M258,154 Q320,126 382,126 Q426,130 448,156 Q470,184 474,228 Q472,266 456,300 Q438,334 408,366 Q382,392 356,404 Q326,388 298,360 Q286,334 286,306 Q300,274 318,254 Q346,228 372,214 Q344,194 318,178 Q292,162 258,154 Z" },
      { id: "dino-body", label: "Body", tone: "dark", path: "M214,292 Q234,272 262,264 Q290,266 310,286 Q324,306 326,336 Q322,374 296,404 Q272,430 236,438 Q210,434 194,414 Q184,390 186,362 Q190,322 214,292 Z" },
      { id: "dino-arm", label: "Arm", tone: "light", path: "M218,286 Q232,280 246,284 Q252,292 246,304 Q236,312 230,324 Q224,336 212,338 Q202,332 202,320 Q206,300 218,286 Z" },
      { id: "dino-leg-front", label: "Front Leg", tone: "medium", path: "M218,436 Q242,424 260,432 Q268,446 266,466 Q256,472 238,472 Q220,472 206,470 Q196,458 202,446 Q208,440 218,436 Z" },
      { id: "dino-leg-back", label: "Back Leg", tone: "dark", path: "M278,420 Q306,404 332,410 Q342,430 340,462 Q330,472 312,472 Q286,472 266,470 Q258,456 264,438 Q270,426 278,420 Z" },
    ],
  },
  {
    name: "Butterfly", emoji: "🦋", description: "Symmetrical butterfly with spread wings",
    keywords: /(butterfly|butterflies|moth)/,
    sections: [
      { id: "bf-body", label: "Body", tone: "dark", path: "M230,80 Q240,70 250,80 L260,400 Q250,420 240,420 Q230,420 220,400 Z" },
      { id: "bf-wing-tl", label: "Top Left Wing", tone: "accent", path: "M230,120 Q180,60 80,50 Q30,70 20,140 Q20,200 60,240 Q100,270 160,260 Q200,240 220,200 Z" },
      { id: "bf-wing-tr", label: "Top Right Wing", tone: "accent", path: "M250,120 Q300,60 400,50 Q450,70 460,140 Q460,200 420,240 Q380,270 320,260 Q280,240 260,200 Z" },
      { id: "bf-wing-bl", label: "Bottom Left Wing", tone: "medium", path: "M220,200 Q160,260 100,300 Q50,330 40,370 Q50,410 100,420 Q160,420 200,380 Q220,340 220,300 Z" },
      { id: "bf-wing-br", label: "Bottom Right Wing", tone: "medium", path: "M260,200 Q320,260 380,300 Q430,330 440,370 Q430,410 380,420 Q320,420 280,380 Q260,340 260,300 Z" },
      { id: "bf-antenna", label: "Antennae", tone: "light", path: "M230,80 Q200,40 170,20 Q160,16 158,24 Q162,34 180,50 Q210,70 230,80 L250,80 Q270,70 300,50 Q318,34 322,24 Q320,16 310,20 Q280,40 250,80 Z" },
    ],
  },
  {
    name: "Horse", emoji: "🐴", description: "Majestic horse profile in motion",
    keywords: /(horse|stallion|mare|pony|mustang)/,
    sections: [
      { id: "horse-head", label: "Head", tone: "accent", path: "M60,140 Q70,90 110,60 Q150,40 180,50 Q200,60 210,90 Q215,110 210,140 Q200,170 180,190 Q150,210 120,210 Q90,200 70,180 Q60,160 60,140 Z" },
      { id: "horse-neck", label: "Neck", tone: "medium", path: "M120,210 Q150,210 180,190 Q210,170 220,150 Q240,170 260,200 Q270,230 260,260 Q240,280 210,290 Q180,280 150,260 Q130,240 120,210 Z" },
      { id: "horse-body", label: "Body", tone: "dark", path: "M210,290 Q240,280 270,270 Q320,260 370,270 Q410,285 430,310 Q440,340 430,370 Q410,390 380,395 Q340,395 300,380 Q260,365 230,340 Q210,320 210,290 Z" },
      { id: "horse-mane", label: "Mane", tone: "light", path: "M110,60 Q130,50 160,55 Q140,80 130,110 Q120,140 115,170 Q110,200 120,210 L110,210 Q80,190 70,160 Q65,130 75,100 Q85,75 110,60 Z" },
      { id: "horse-front-legs", label: "Front Legs", tone: "medium", path: "M230,340 Q240,360 240,400 Q238,430 230,460 Q228,472 218,472 Q210,468 212,450 Q216,420 210,400 Q200,380 190,400 Q184,420 186,450 Q188,468 178,472 Q168,472 166,460 Q164,430 170,400 Q180,370 200,350 Q215,342 230,340 Z" },
      { id: "horse-back-legs", label: "Back Legs", tone: "dark", path: "M380,395 Q390,400 400,430 Q406,450 404,468 Q400,474 390,472 Q382,468 384,450 Q380,420 370,400 Q360,390 350,400 Q340,420 338,450 Q336,468 326,472 Q316,474 314,468 Q312,450 318,420 Q330,395 350,385 Q365,390 380,395 Z" },
      { id: "horse-tail", label: "Tail", tone: "medium", path: "M430,310 Q450,300 460,320 Q470,350 460,390 Q448,420 430,440 Q415,450 405,440 Q410,420 420,400 Q428,380 430,360 Q430,340 430,310 Z" },
    ],
  },
  {
    name: "Fish", emoji: "🐟", description: "Tropical fish with fins and tail",
    keywords: /(fish|goldfish|tropical fish|koi|salmon)/,
    sections: [
      { id: "fish-head", label: "Head", tone: "accent", path: "M60,240 Q80,180 130,160 Q160,150 180,160 L180,320 Q160,330 130,320 Q80,300 60,240 Z" },
      { id: "fish-body", label: "Body", tone: "dark", path: "M180,160 Q230,140 290,150 Q340,165 370,200 L370,280 Q340,315 290,330 Q230,340 180,320 Z" },
      { id: "fish-tail", label: "Tail", tone: "medium", path: "M370,200 Q390,190 420,150 Q440,120 460,110 Q470,120 465,150 Q455,190 430,220 L430,260 Q455,290 465,330 Q470,360 460,370 Q440,360 420,330 Q390,290 370,280 Z" },
      { id: "fish-dorsal", label: "Dorsal Fin", tone: "light", path: "M200,160 Q230,140 260,120 Q290,100 310,90 Q320,100 310,120 Q300,140 290,150 Q260,155 230,155 Q210,158 200,160 Z" },
      { id: "fish-belly", label: "Belly Fin", tone: "light", path: "M220,320 Q250,340 270,360 Q290,380 300,390 Q295,400 280,395 Q260,380 240,360 Q220,340 210,330 Z" },
      { id: "fish-eye", label: "Eye", tone: "light", path: "M110,220 Q120,205 140,205 Q155,210 158,225 Q158,240 148,250 Q135,255 120,250 Q108,240 110,220 Z" },
    ],
  },
  {
    name: "Flower", emoji: "🌸", description: "Large bloom with petals and stem",
    keywords: /(^flower$|^flowers$|daisy|sunflower|bloom)/,
    sections: [
      { id: "fl-center", label: "Center", tone: "accent", path: "M200,180 Q220,160 250,160 Q280,165 295,185 Q305,210 300,240 Q290,265 265,275 Q240,280 215,270 Q195,255 190,230 Q185,205 200,180 Z" },
      { id: "fl-petal-top", label: "Top Petal", tone: "light", path: "M220,160 Q210,110 220,70 Q235,40 260,40 Q285,45 290,75 Q295,110 280,160 Q265,165 250,160 Z" },
      { id: "fl-petal-right", label: "Right Petal", tone: "medium", path: "M295,185 Q340,165 380,170 Q410,185 415,215 Q415,245 385,258 Q350,265 305,245 Q300,230 295,185 Z" },
      { id: "fl-petal-bottom-r", label: "Bottom Right", tone: "light", path: "M290,265 Q310,300 310,340 Q305,370 280,380 Q255,382 240,360 Q230,330 240,290 Q250,278 265,275 Z" },
      { id: "fl-petal-bottom-l", label: "Bottom Left", tone: "medium", path: "M215,270 Q200,290 185,330 Q175,360 180,380 Q195,395 220,385 Q245,370 250,340 Q250,310 240,280 Z" },
      { id: "fl-petal-left", label: "Left Petal", tone: "light", path: "M200,180 Q170,160 135,160 Q105,170 95,200 Q90,230 110,255 Q135,270 185,260 Q192,245 190,230 Z" },
      { id: "fl-stem", label: "Stem & Leaves", tone: "dark", path: "M235,380 Q240,400 242,430 Q244,450 240,470 Q236,474 232,470 Q228,450 230,430 L210,410 Q180,400 160,420 Q150,430 155,415 Q165,395 200,390 Q220,388 235,380 Z" },
    ],
  },
  {
    name: "Castle", emoji: "🏰", description: "Medieval castle with towers and gate",
    keywords: /(castle|fortress|palace|medieval)/,
    sections: [
      { id: "castle-tower-l", label: "Left Tower", tone: "dark", path: "M60,120 L60,400 L130,400 L130,120 L120,100 L110,120 L100,100 L90,120 L80,100 L70,120 Z" },
      { id: "castle-tower-r", label: "Right Tower", tone: "dark", path: "M350,120 L350,400 L420,400 L420,120 L410,100 L400,120 L390,100 L380,120 L370,100 L360,120 Z" },
      { id: "castle-wall-l", label: "Left Wall", tone: "medium", path: "M130,200 L130,400 L200,400 L200,200 Z" },
      { id: "castle-wall-r", label: "Right Wall", tone: "medium", path: "M280,200 L280,400 L350,400 L350,200 Z" },
      { id: "castle-center", label: "Center Tower", tone: "accent", path: "M200,140 L200,400 L280,400 L280,140 L270,120 L260,140 L250,120 L240,80 L230,120 L220,140 L210,120 Z" },
      { id: "castle-gate", label: "Gate", tone: "light", path: "M215,300 Q215,260 240,240 Q265,260 265,300 L265,400 L215,400 Z" },
      { id: "castle-base", label: "Base", tone: "dark", path: "M40,400 L440,400 L450,440 L460,460 L20,460 L30,440 Z" },
    ],
  },
  {
    name: "House", emoji: "🏠", description: "Cozy house with roof and chimney",
    keywords: /(^house$|^home$|cottage|cabin)/,
    sections: [
      { id: "house-roof", label: "Roof", tone: "dark", path: "M60,220 L240,80 L420,220 L380,220 L380,220 L100,220 Z" },
      { id: "house-wall-l", label: "Left Wall", tone: "light", path: "M100,220 L100,420 L240,420 L240,220 Z" },
      { id: "house-wall-r", label: "Right Wall", tone: "medium", path: "M240,220 L240,420 L380,420 L380,220 Z" },
      { id: "house-door", label: "Door", tone: "accent", path: "M200,300 Q200,270 220,260 Q240,270 240,300 L240,420 L200,420 Z" },
      { id: "house-window-l", label: "Left Window", tone: "medium", path: "M130,260 L130,320 L180,320 L180,260 Z" },
      { id: "house-window-r", label: "Right Window", tone: "medium", path: "M280,260 L280,320 L340,320 L340,260 Z" },
      { id: "house-chimney", label: "Chimney", tone: "dark", path: "M320,100 L320,180 L360,180 L360,80 Z" },
      { id: "house-base", label: "Foundation", tone: "dark", path: "M80,420 L400,420 L410,450 L70,450 Z" },
    ],
  },
  {
    name: "Mouse", emoji: "🐭", description: "Cute sitting mouse with big ears",
    keywords: /(^mouse$|^mice$|^rat$)/,
    sections: [
      { id: "mouse-ear-l", label: "Left Ear", tone: "accent", path: "M140,120 Q110,60 130,30 Q155,10 180,30 Q200,55 190,100 Q180,120 160,130 Z" },
      { id: "mouse-ear-r", label: "Right Ear", tone: "accent", path: "M260,100 Q250,55 270,30 Q295,10 320,30 Q340,60 310,120 Q290,130 270,125 Z" },
      { id: "mouse-head", label: "Head", tone: "medium", path: "M140,120 Q160,130 190,140 Q220,145 260,140 Q290,130 310,120 Q330,160 320,200 Q300,230 260,245 Q230,250 200,245 Q160,230 140,200 Q130,160 140,120 Z" },
      { id: "mouse-body", label: "Body", tone: "dark", path: "M160,240 Q200,245 240,245 Q280,240 310,225 Q340,260 350,310 Q355,360 340,400 Q310,435 260,450 Q210,455 170,440 Q130,420 115,385 Q105,350 115,310 Q130,270 160,240 Z" },
      { id: "mouse-nose", label: "Nose", tone: "light", path: "M210,200 Q220,190 235,192 Q245,200 240,212 Q230,220 218,218 Q208,210 210,200 Z" },
      { id: "mouse-tail", label: "Tail", tone: "medium", path: "M340,400 Q370,410 400,390 Q430,360 440,320 Q445,290 435,270 Q425,275 430,300 Q430,340 410,370 Q390,395 360,405 Q350,405 340,400 Z" },
    ],
  },
  {
    name: "Cat", emoji: "🐱", description: "Sitting cat with pointed ears and curled tail",
    keywords: /(^cat$|^cats$|^kitten$|^kitty$|feline)/,
    sections: [
      { id: "cat-ear-l", label: "Left Ear", tone: "accent", path: "M150,130 Q140,70 160,30 Q175,20 185,50 Q190,80 185,130 Z" },
      { id: "cat-ear-r", label: "Right Ear", tone: "accent", path: "M275,130 Q270,80 280,50 Q290,20 305,30 Q320,70 310,130 Z" },
      { id: "cat-head", label: "Head", tone: "medium", path: "M150,130 Q185,130 230,125 Q275,130 310,130 Q330,170 325,210 Q310,245 270,260 Q240,268 210,260 Q170,245 155,210 Q145,170 150,130 Z" },
      { id: "cat-body", label: "Body", tone: "dark", path: "M180,260 Q210,260 240,265 Q280,260 300,250 Q330,280 345,330 Q355,380 345,420 Q330,445 290,460 Q250,468 210,460 Q170,445 155,420 Q145,380 155,330 Q170,280 180,260 Z" },
      { id: "cat-face", label: "Face", tone: "light", path: "M185,170 Q200,160 230,158 Q260,160 275,170 Q280,195 270,215 Q255,230 230,235 Q205,230 190,215 Q180,195 185,170 Z" },
      { id: "cat-tail", label: "Tail", tone: "medium", path: "M345,380 Q380,360 410,330 Q435,300 445,270 Q450,250 440,245 Q430,255 425,280 Q415,310 395,340 Q375,365 355,385 Q348,390 345,380 Z" },
    ],
  },
  {
    name: "Dog", emoji: "🐕", description: "Friendly dog sitting with floppy ears",
    keywords: /(^dog$|^dogs$|^puppy$|^pup$|canine|golden retriever)/,
    sections: [
      { id: "dog-head", label: "Head", tone: "accent", path: "M160,100 Q180,70 220,60 Q260,60 290,80 Q310,100 315,130 Q315,165 295,190 Q270,210 240,215 Q200,215 175,195 Q155,170 155,140 Z" },
      { id: "dog-ear-l", label: "Left Ear", tone: "dark", path: "M160,100 Q140,90 120,100 Q100,120 95,155 Q95,190 110,210 Q130,220 150,205 Q165,185 160,160 Q158,130 160,100 Z" },
      { id: "dog-ear-r", label: "Right Ear", tone: "dark", path: "M290,80 Q310,70 330,80 Q350,100 360,135 Q362,175 350,200 Q335,215 315,205 Q300,190 295,165 Q292,130 290,80 Z" },
      { id: "dog-body", label: "Body", tone: "medium", path: "M190,215 Q240,220 280,210 Q320,220 345,260 Q360,310 355,370 Q340,415 300,440 Q260,455 220,450 Q180,435 155,410 Q140,375 145,330 Q155,280 175,245 Q180,225 190,215 Z" },
      { id: "dog-snout", label: "Snout", tone: "light", path: "M200,175 Q220,170 245,172 Q265,178 275,192 Q270,210 250,218 Q230,222 210,218 Q190,210 185,195 Q190,180 200,175 Z" },
      { id: "dog-front-paws", label: "Front Paws", tone: "dark", path: "M175,420 Q185,435 185,455 Q182,470 168,470 Q155,468 155,455 Q158,440 165,425 Q168,420 175,420 L220,440 Q225,455 222,468 Q218,474 205,472 Q194,468 196,455 Q200,440 210,430 Z" },
      { id: "dog-tail", label: "Tail", tone: "medium", path: "M345,300 Q370,270 390,250 Q405,240 415,248 Q420,260 410,280 Q395,305 375,330 Q360,348 350,355 Z" },
    ],
  },
  {
    name: "Pumpkin", emoji: "🎃", description: "Round pumpkin with stem and ridges",
    keywords: /(pumpkin|jack.o.lantern|halloween)/,
    sections: [
      { id: "pump-left", label: "Left Lobe", tone: "medium", path: "M60,250 Q50,180 80,130 Q120,90 170,100 Q200,115 210,150 L210,380 Q200,410 170,430 Q120,440 80,400 Q50,350 60,250 Z" },
      { id: "pump-center", label: "Center", tone: "accent", path: "M210,150 Q220,100 250,90 Q280,100 290,150 L290,380 Q280,420 250,440 Q220,420 210,380 Z" },
      { id: "pump-right", label: "Right Lobe", tone: "medium", path: "M290,150 Q300,115 330,100 Q380,90 420,130 Q450,180 440,250 Q450,350 420,400 Q380,440 330,430 Q300,410 290,380 Z" },
      { id: "pump-stem", label: "Stem", tone: "dark", path: "M220,100 Q225,60 240,40 Q250,35 260,40 Q275,60 280,100 Q270,95 250,90 Q230,95 220,100 Z" },
      { id: "pump-face-eyes", label: "Face", tone: "dark", path: "M170,220 L195,190 L220,220 L195,230 Z M280,220 L305,190 L330,220 L305,230 Z" },
      { id: "pump-face-mouth", label: "Mouth", tone: "dark", path: "M180,310 L200,290 L220,310 L240,290 L260,310 L280,290 L300,310 L290,340 Q250,370 210,340 Z" },
    ],
  },
  {
    name: "Rose", emoji: "🌹", description: "Elegant rose with layered petals",
    keywords: /(^rose$|^roses$)/,
    sections: [
      { id: "rose-inner", label: "Inner Petals", tone: "accent", path: "M220,170 Q240,150 265,155 Q285,170 285,195 Q280,220 260,235 Q240,242 220,235 Q200,220 198,195 Q200,175 220,170 Z" },
      { id: "rose-mid", label: "Mid Petals", tone: "medium", path: "M198,195 Q180,150 200,120 Q230,100 270,110 Q310,130 320,170 Q325,210 305,250 Q280,275 250,280 Q215,278 195,255 Q182,235 185,215 Q190,205 198,195 Z" },
      { id: "rose-outer-l", label: "Outer Left", tone: "light", path: "M195,255 Q160,230 140,190 Q130,150 150,115 Q170,90 200,85 Q195,100 190,120 Q183,145 185,175 Q188,205 195,225 Q196,240 195,255 Z" },
      { id: "rose-outer-r", label: "Outer Right", tone: "light", path: "M305,250 Q335,225 355,190 Q365,150 350,115 Q330,90 300,85 Q305,100 310,120 Q315,145 315,175 Q312,210 308,235 Q306,245 305,250 Z" },
      { id: "rose-outer-b", label: "Outer Bottom", tone: "medium", path: "M195,255 Q200,290 220,320 Q240,340 260,340 Q280,335 295,310 Q305,285 305,250 Q290,275 265,285 Q240,288 220,280 Q205,270 195,255 Z" },
      { id: "rose-stem", label: "Stem", tone: "dark", path: "M235,340 Q238,370 240,400 Q242,430 240,460 Q238,470 234,460 Q232,430 230,400 Q228,370 230,345 Z" },
      { id: "rose-leaves", label: "Leaves", tone: "dark", path: "M230,380 Q200,370 170,390 Q150,405 155,395 Q165,375 190,365 Q215,360 230,365 L240,400 Q270,390 300,400 Q325,415 320,405 Q310,385 285,375 Q260,370 240,375 Z" },
    ],
  },
  {
    name: "Sunset", emoji: "🌅", description: "Sunset over water with layered sky",
    keywords: /(sunset|sunrise|horizon)/,
    sections: [
      { id: "sun-sky-top", label: "Upper Sky", tone: "dark", path: "M0,0 L480,0 L480,140 Q400,130 320,140 Q240,150 160,140 Q80,130 0,140 Z" },
      { id: "sun-sky-mid", label: "Mid Sky", tone: "medium", path: "M0,140 Q80,130 160,140 Q240,150 320,140 Q400,130 480,140 L480,230 Q400,225 320,230 Q240,235 160,230 Q80,225 0,230 Z" },
      { id: "sun-sun", label: "Sun", tone: "accent", path: "M180,180 Q200,140 240,130 Q280,140 300,180 Q310,220 290,250 Q270,270 240,275 Q210,270 190,250 Q170,220 180,180 Z" },
      { id: "sun-sky-low", label: "Lower Sky", tone: "light", path: "M0,230 Q80,225 160,230 Q240,235 320,230 Q400,225 480,230 L480,310 Q400,305 320,310 Q240,315 160,310 Q80,305 0,310 Z" },
      { id: "sun-water", label: "Water", tone: "medium", path: "M0,310 Q80,305 160,310 Q240,315 320,310 Q400,305 480,310 L480,400 Q400,410 320,400 Q240,395 160,400 Q80,410 0,400 Z" },
      { id: "sun-reflection", label: "Reflection", tone: "dark", path: "M0,400 Q80,410 160,400 Q240,395 320,400 Q400,410 480,400 L480,480 L0,480 Z" },
    ],
  },
  {
    name: "Paris Skyline", emoji: "🗼", description: "Parisian skyline with Eiffel Tower",
    keywords: /(paris|eiffel|parisian)/,
    sections: [
      { id: "paris-sky", label: "Sky", tone: "light", path: "M0,0 L480,0 L480,300 L0,300 Z" },
      { id: "paris-eiffel-top", label: "Eiffel Top", tone: "accent", path: "M230,60 L240,20 L250,60 L260,100 L280,180 L200,180 L220,100 Z" },
      { id: "paris-eiffel-base", label: "Eiffel Base", tone: "dark", path: "M200,180 L280,180 L310,360 L330,400 L150,400 L170,360 Z" },
      { id: "paris-buildings-l", label: "Left Buildings", tone: "medium", path: "M0,300 L0,400 L150,400 L150,280 L130,260 L130,300 L100,300 L100,270 L80,250 L80,300 L50,300 L50,320 L30,320 L30,300 Z" },
      { id: "paris-buildings-r", label: "Right Buildings", tone: "medium", path: "M330,400 L480,400 L480,300 L450,300 L450,280 L430,260 L430,300 L400,300 L400,270 L380,250 L380,300 L350,300 L350,280 L330,260 Z" },
      { id: "paris-ground", label: "Ground", tone: "dark", path: "M0,400 L480,400 L480,480 L0,480 Z" },
    ],
  },
  {
    name: "Vegas", emoji: "🎰", description: "Las Vegas skyline with iconic signs",
    keywords: /(vegas|las vegas|strip|casino)/,
    sections: [
      { id: "vegas-sky", label: "Night Sky", tone: "dark", path: "M0,0 L480,0 L480,280 L0,280 Z" },
      { id: "vegas-sign", label: "Vegas Sign", tone: "accent", path: "M180,80 L180,200 L300,200 L300,80 L280,60 L260,80 L240,50 L220,80 L200,60 Z" },
      { id: "vegas-tower-l", label: "Left Tower", tone: "medium", path: "M40,180 L40,400 L100,400 L100,180 L90,140 L80,160 L70,140 L60,160 L50,140 Z" },
      { id: "vegas-pyramid", label: "Pyramid", tone: "medium", path: "M340,400 L380,160 L390,140 L400,160 L440,400 Z" },
      { id: "vegas-buildings", label: "Buildings", tone: "dark", path: "M100,280 L100,400 L340,400 L340,280 L320,260 L320,300 L280,300 L280,260 L260,240 L260,300 L220,300 L220,260 L200,240 L200,300 L160,300 L160,260 L140,280 L140,300 L120,300 L120,260 Z" },
      { id: "vegas-ground", label: "Strip", tone: "light", path: "M0,400 L480,400 L480,480 L0,480 Z" },
    ],
  },
];

function getCuratedStencil(prompt: string) {
  const normalized = prompt.toLowerCase().trim();
  for (const stencil of CURATED) {
    if (stencil.keywords.test(normalized)) {
      return stencil;
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const curated = getCuratedStencil(prompt);
    if (curated) {
      const vibe = {
        id: `ai-${Date.now()}`,
        name: curated.name,
        emoji: curated.emoji,
        description: curated.description,
        viewBox: "0 0 480 480",
        sections: curated.sections,
        lightTextures: ["linen-white", "linen-natural", "boucle-cream", "boucle-ivory"],
        mediumTextures: ["suede-camel", "leather-tan", "linen-mustard", "boucle-taupe"],
        darkTextures: ["suede-terracotta", "leather-cognac", "velvet-rust", "wood-walnut"],
        accentTextures: ["boucle-blush", "linen-dusty-rose", "velvet-emerald"],
      };

      return new Response(JSON.stringify(vibe), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create a stencil of: "${prompt}"

Use a friendly cartoon style, not abstract.

Think step by step:
1. SILHOUETTE FIRST: Draw a single, clear, recognizable outline of this subject. What key features make it instantly identifiable? (e.g. for a dinosaur: head with jaw, body, tail, legs)
2. POSITION: Center it on the 480×480 canvas, filling 70-85% of the space.
3. DIVIDE: Now slice the completed silhouette into 4-6 anatomical/structural sections. Each cut should follow natural boundaries of the subject.
4. VERIFY: Do the sections tile back together to recreate the original silhouette perfectly? Are shared edges identical?

Now generate the stencil with clean, bold SVG paths.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_stencil",
              description: "Generate an SVG stencil with labeled sections that tile together",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Short name for the stencil (1-2 words)" },
                  emoji: { type: "string", description: "A single emoji representing the stencil" },
                  description: { type: "string", description: "Brief description of the stencil" },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Unique kebab-case id like 'flower-petals'" },
                        label: { type: "string", description: "Short human label like 'Petals'" },
                        tone: { type: "string", enum: ["light", "medium", "dark", "accent"] },
                        path: { type: "string", description: "SVG path d attribute — must be closed (Z), use curves (Q/C), be chunky and bold" },
                      },
                      required: ["id", "label", "tone", "path"],
                      additionalProperties: false,
                    },
                    minItems: 4,
                    maxItems: 8,
                  },
                },
                required: ["name", "emoji", "description", "sections"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_stencil" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "AI did not return a valid stencil" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stencil = JSON.parse(toolCall.function.arguments);

    const vibe = {
      id: `ai-${Date.now()}`,
      name: stencil.name,
      emoji: stencil.emoji,
      description: stencil.description,
      viewBox: "0 0 480 480",
      sections: stencil.sections,
      lightTextures: ["linen-white", "linen-natural", "boucle-cream", "boucle-ivory"],
      mediumTextures: ["suede-camel", "leather-tan", "linen-mustard", "boucle-taupe"],
      darkTextures: ["suede-terracotta", "leather-cognac", "velvet-rust", "wood-walnut"],
      accentTextures: ["boucle-blush", "linen-dusty-rose", "velvet-emerald"],
    };

    return new Response(JSON.stringify(vibe), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-stencil error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
