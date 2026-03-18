import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert SVG path designer creating stencils for a shadow-box art app. The canvas is 480×480.

CRITICAL RULES FOR GOOD PATHS:
1. CENTER the subject in the 480×480 viewBox. Use the full space — the shape should be large and bold, filling at least 60-70% of the canvas.
2. Use SIMPLE, CHUNKY shapes. Think bold silhouettes like you'd see in a coloring book — no fine details, no tiny features.
3. Paths must be CLOSED (end with Z) and use smooth curves (Q, C commands). Avoid jagged lines.
4. Sections must TILE together — shared edges should match exactly. No gaps, no overlaps.
5. Each section should be substantial — minimum ~15% of the subject area. No tiny sliver sections.
6. Use 4-8 sections for good complexity.
7. Think about the shape as CUT PAPER PIECES that fit together like a puzzle.

PATH QUALITY TIPS:
- Use Quadratic Bézier curves (Q) for smooth organic shapes
- Round numbers to integers — no decimals needed
- Make curves BOLD and EXAGGERATED, not subtle
- The overall silhouette should be instantly recognizable even at thumbnail size
- Avoid paths that create thin lines or narrow spikes

GOOD EXAMPLE — A simple flower:
- Large circular center (accent): circlePath at 240,220 radius 70
- 4 large petal sections (light/medium) radiating out, each a wide teardrop shape
- Thick stem section (dark) below

BAD EXAMPLE:
- Tiny detailed petals with intricate curves
- Sections that are just thin lines
- Shape that's too small in the viewBox

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
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create a bold, recognizable stencil of: ${prompt}. Make it chunky and large, filling most of the 480x480 canvas. Use 4-8 sections with smooth curves.` },
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
