import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a world-class SVG illustrator creating stencil outlines for a shadow-box art studio.

The canvas is 480×480 pixels.

GOAL
Create a bold, highly recognizable silhouette of the requested subject, divided into 4–8 large interlocking sections that tile together perfectly.

ABSOLUTE REQUIREMENTS
- The subject must be instantly recognizable at a glance (no ambiguity)
- The subject must be centered and fill 70–85% of the canvas
- Every path must be fully closed (end with Z)
- All sections must share edges exactly: no gaps, no overlaps, no misalignment
- Each section must be large and meaningful: minimum ~10% of total area, avoid thin slivers or tiny fragments
- Use 4–8 sections total

SHAPE SIMPLICITY RULES (CRITICAL)
- Prioritize bold, simplified forms
- Avoid fine detail, noise, or micro-curves
- All edges must be smooth and intentional
- Shapes must be easy to cut physically

SVG PATH RULES
- Use only: M, L, Q, C, Z
- Use integers only
- Avoid excessive anchor points
- Keep curves smooth and minimal

EDGE QUALITY
- Shared edges must align perfectly between pieces
- No jagged edges or tiny zig-zags
- Avoid extremely sharp angles unless intentional

SECTION DESIGN
Divide the subject into logical visual regions:
- light = highlight
- medium = mid-tone
- dark = shadow
- accent = focal feature
Each section should feel intentional and balanced.

COMPOSITION RULES
- Maintain strong outer silhouette clarity
- Avoid cutting through key identity features (eyes, face shape, etc.)
- Ensure the silhouette reads clearly even at small size

EXAMPLES

Dinosaur (T-Rex):
- Head with jaw (accent)
- Neck (medium)
- Body (dark)
- Legs (medium/dark)
- Arms (light)
- Tail (medium)

Flower:
- Center (accent)
- 5 large petals (light/medium)
- Stem (dark)
- Leaves (medium)

You MUST respond using the generate_stencil tool. Return only valid SVG path data for each section. No explanations. No extra text.`;

function getCuratedStencil(prompt: string) {
  const normalized = prompt.toLowerCase().trim();

  if (/(^|\b)(dinosaur|dino|t-rex|trex|tyrannosaurus)(\b|$)/.test(normalized)) {
    return {
      name: "Dinosaur",
      emoji: "🦖",
      description: "Bold T-Rex silhouette with large interlocking sections",
      sections: [
        {
          id: "dino-head",
          label: "Head",
          tone: "accent",
          path: "M84,196 Q108,152 154,132 Q194,116 238,126 Q252,128 260,140 Q258,154 244,164 Q220,176 206,196 Q194,214 178,224 Q148,240 114,232 Q92,226 80,210 Z",
        },
        {
          id: "dino-neck",
          label: "Neck",
          tone: "medium",
          path: "M178,224 Q196,198 214,178 Q236,160 258,154 Q276,164 286,186 Q276,222 254,254 Q236,276 214,292 Q192,286 176,262 Q168,244 178,224 Z",
        },
        {
          id: "dino-back-tail",
          label: "Back & Tail",
          tone: "medium",
          path: "M258,154 Q320,126 382,126 Q426,130 448,156 Q470,184 474,228 Q472,266 456,300 Q438,334 408,366 Q382,392 356,404 Q326,388 298,360 Q286,334 286,306 Q300,274 318,254 Q346,228 372,214 Q344,194 318,178 Q292,162 258,154 Z",
        },
        {
          id: "dino-body",
          label: "Body",
          tone: "dark",
          path: "M214,292 Q234,272 262,264 Q290,266 310,286 Q324,306 326,336 Q322,374 296,404 Q272,430 236,438 Q210,434 194,414 Q184,390 186,362 Q190,322 214,292 Z",
        },
        {
          id: "dino-arm",
          label: "Arm",
          tone: "light",
          path: "M218,286 Q232,280 246,284 Q252,292 246,304 Q236,312 230,324 Q224,336 212,338 Q202,332 202,320 Q206,300 218,286 Z",
        },
        {
          id: "dino-leg-front",
          label: "Front Leg",
          tone: "medium",
          path: "M218,436 Q242,424 260,432 Q268,446 266,466 Q256,472 238,472 Q220,472 206,470 Q196,458 202,446 Q208,440 218,436 Z",
        },
        {
          id: "dino-leg-back",
          label: "Back Leg",
          tone: "dark",
          path: "M278,420 Q306,404 332,410 Q342,430 340,462 Q330,472 312,472 Q286,472 266,470 Q258,456 264,438 Q270,426 278,420 Z",
        },
      ],
    };
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

Think step by step:
1. What is the most ICONIC silhouette of this subject? What features make it instantly recognizable?
2. How should it be positioned in the 480×480 canvas to look bold and centered?
3. How should it be divided into 4-8 logical sections?

Now generate the stencil with smooth, accurate SVG paths.` },
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
