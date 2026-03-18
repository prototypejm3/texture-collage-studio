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
