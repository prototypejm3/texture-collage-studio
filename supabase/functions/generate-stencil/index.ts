import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a world-class SVG illustrator creating stencil outlines for a shadow-box art studio. The canvas is 480×480 pixels.

YOUR GOAL: Create a RECOGNIZABLE silhouette of the requested subject, divided into 4-8 large puzzle-like sections that tile together perfectly.

━━━ ABSOLUTE REQUIREMENTS ━━━
1. The subject must be INSTANTLY RECOGNIZABLE — if someone showed only the outline to a child, they'd know what it is.
2. CENTER the subject and make it LARGE — fill 70-85% of the 480×480 canvas.
3. Every path MUST be closed (end with Z).
4. Sections must share edges EXACTLY — no gaps, no overlaps. Think jigsaw puzzle pieces.
5. Each section should be a substantial area (at least 10% of the subject). No tiny slivers.

━━━ SVG PATH GUIDELINES ━━━
- Use M (moveTo), L (lineTo), Q (quadratic bezier), C (cubic bezier), Z (close).
- Use integers only (no decimals).
- For organic/natural shapes: use Q and C curves liberally for smooth silhouettes.
- For architectural/geometric shapes: L lines are fine.
- Make outer silhouette curves BOLD and SMOOTH — avoid jagged zigzags on outlines.
- Inner dividing lines between sections can be simpler (straight L lines are fine for internal seams).

━━━ SECTION DESIGN ━━━
- Divide the subject into logical anatomical/structural parts.
- For animals: head, body, legs, tail, distinctive features (horns, wings, fins).
- For objects: main body, base/stand, decorative elements.
- For plants: stem, leaves, petals, center.
- Assign tones based on visual depth: 'dark' for shadows/depth, 'light' for highlights, 'medium' for mid-tones, 'accent' for focal points.

━━━ DINOSAUR EXAMPLE (T-Rex) ━━━
A T-Rex should have:
- Large head with open jaw (accent) — the iconic shape with big teeth silhouette
- Thick neck connecting to body (medium)
- Massive body/torso (dark)
- Two strong legs with clawed feet (medium/dark)
- Small arms (light)
- Long thick tail curving back (medium)
The overall shape should show the classic T-Rex profile: big head, tiny arms, strong legs, long tail — unmistakable.

━━━ FLOWER EXAMPLE ━━━
- Large circular center (accent) at roughly 240,240, radius ~60
- 5 wide teardrop petals radiating outward (light/medium), each substantial
- Thick stem going down (dark)
- 1-2 large leaves on the stem (medium)

━━━ COMMON MISTAKES TO AVOID ━━━
- Shape too small or off-center in the canvas
- Unrecognizable blob — always prioritize the ICONIC silhouette features
- Paths that create thin lines instead of filled areas
- Sections with gaps between them
- Too many tiny sections instead of a few bold ones

You MUST respond using the generate_stencil tool.`;

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
        model: "openai/gpt-5",
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
