import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TEXTURE_IDS = [
  "royale-blush","royale-gunmetal","royale-evergreen","royale-apple","royale-hacienda","royale-peacock","royale-cobalt","royale-ash","royale-forest","royale-berry","royale-sand","royale-sage",
  "banks-nutmeg","banks-currant","banks-oatmeal","banks-zinnia",
  "bentley-daisey","bentley-indigo","bentley-pewter",
  "cody-slate","cody-sandstone","cody-pacific",
  "sunbrella-fog","sunbrella-sea","sunbrella-wisteria","sunbrella-lagoon","sunbrella-white","sunbrella-loft-white",
  "bubbly-cucumber","bubbly-moscow-mule","bubbly-cream-soda",
  "karina-cloud","karina-teal",
  "crave-rose","crave-mocha","crave-mocha-latte","crave-ginger-tea","crave-berry-hibiscus","crave-greenery","crave-lava-rock","crave-irish-cream",
  "flat-silk-cream","flat-silk-champagne","flat-silk-taupe","flat-silk-dusty-rose","flat-silk-navy",
  "checker-mocha","checker-tapestry",
  "soul-cloud","nepal-teal","sorrento-teal",
  "kenley-spruce","kenley-mauve","villa-sand","leuven-olive","leuven-snow",
  "keylargo-zenith-teal","essence-ash","synergy-pewter",
  "milo-dove","milo-french-blue",
  "faithful-olive","faithful-indigo","faithful-sand","faithful-mocha",
  "nico-oyster","taylor-felt-gray","borough-cotton","bloke-cotton",
  "felt-brown","felt-navy","felt-olive","felt-sand",
  "cotton-natural","cotton-oatmeal",
  "yarn-charcoal","yarn-cream","yarn-oatmeal",
  "leather-bourbon","leather-chai","leather-cognac","leather-espresso","leather-mocha","leather-rye",
  "wood-birch","wood-oak","wood-walnut",
  "marble-carrara","marble-nero","marble-rosa","marble-verde",
  "concrete-polished","concrete-raw","concrete-weathered",
  "alix-oat","alix-sand","alix-slate",
  "corinne-mocha","corinne-pearl","corinne-rose","corinne-sage",
  "jayme-cream","jayme-nutmeg","jayme-olive","jayme-rust",
  "shayshari-berry","shayshari-cobalt","shayshari-gold","shayshari-peacock",
  "prime-peacock","prime-stone","merit-dove","lucky-divine","lucky-turquoise",
  "caspiar-chiffon","caspiar-ivory",
  "ripple-cream","ripple-ink","ripple-kraft","ripple-lattice","ripple-parchment",
  "tiedye-blush","tiedye-neutral","tiedye-rainbow",
  "stripe-ink","stripe-pinstripe","stripe-woven",
  "grid-cream","grid-crosshatch","grid-windowpane","grid-checker-blue",
  "speckle-blue","speckle-ink",
  "cow-print","cheetah-print","cheetah-white","zebra-print",
  "ocean-deep","ocean-foam","ocean-reef","ocean-tide",
  "sky-azure","sky-cloud","sky-dawn","sky-dusk",
  "space-cosmos","space-eclipse","space-nebula","space-stardust",
  "fruit-apple","fruit-berry","fruit-citrus","fruit-plum",
  "nuts-almond","nuts-cashew","nuts-pecan","nuts-walnut",
  "tussah-silk",
];

const SYSTEM_PROMPT = `You are a color/texture curator for a shadow-box art app. Given a vibe description, you create a cohesive design palette.

You have access to these texture IDs from the app's library:
${TEXTURE_IDS.join(", ")}

Your job:
1. Create a COLOR PALETTE of 4-5 HSL colors that capture the vibe
2. Pick 3-5 LIGHT textures, 3-5 MEDIUM textures, 3-5 DARK textures, and 2-3 ACCENT textures from the available IDs
3. Suggest a FRAME texture or color ("white", "black", or a texture ID)
4. Create a simple SVG STENCIL (4-6 sections) that matches the vibe — abstract shapes are fine, they represent layout zones

TEXTURE SELECTION TIPS:
- Match textures by their visual feel: velvets for luxury, linens for natural, leather for rugged, marble for elegant
- Use the naming hints: "royale" = velvet, "crave" = ribbed chenille, "faithful" = linen, "leather" = leather, etc.
- Group similar tones together — lights should be light-colored textures, darks should be darker ones

SVG STENCIL RULES:
- Canvas is 480×480
- Use 4-6 sections with closed paths (Z) and smooth curves (Q/C)
- Sections should tile together as abstract compositional zones
- Think mood boards, not literal objects — organic shapes, overlapping zones

You MUST respond using the generate_vibe tool.`;

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
          { role: "user", content: `Create a complete vibe palette for: "${prompt}". Pick textures that visually match this mood. Create an abstract stencil layout.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_vibe",
              description: "Generate a complete vibe with palette, textures, frame, and stencil",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Short vibe name (1-3 words)" },
                  emoji: { type: "string", description: "A single emoji capturing the vibe" },
                  description: { type: "string", description: "One-sentence vibe description" },
                  palette: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        color: { type: "string", description: "HSL color like hsl(24, 80%, 50%)" },
                        label: { type: "string", description: "Color name like 'Warm Terracotta'" },
                      },
                      required: ["color", "label"],
                      additionalProperties: false,
                    },
                    minItems: 4,
                    maxItems: 5,
                  },
                  lightTextures: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 texture IDs for light tones",
                  },
                  mediumTextures: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 texture IDs for medium tones",
                  },
                  darkTextures: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 texture IDs for dark tones",
                  },
                  accentTextures: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 texture IDs for accent pops",
                  },
                  frameChoice: {
                    type: "string",
                    description: "Frame texture ID or 'white'/'black'",
                  },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        tone: { type: "string", enum: ["light", "medium", "dark", "accent"] },
                        path: { type: "string", description: "SVG path d attribute — closed (Z), smooth curves" },
                      },
                      required: ["id", "label", "tone", "path"],
                      additionalProperties: false,
                    },
                    minItems: 4,
                    maxItems: 6,
                  },
                },
                required: ["name", "emoji", "description", "palette", "lightTextures", "mediumTextures", "darkTextures", "accentTextures", "frameChoice", "sections"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_vibe" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      return new Response(JSON.stringify({ error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return a valid vibe" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const vibe = JSON.parse(toolCall.function.arguments);

    // Filter texture IDs to only valid ones
    const validIds = new Set(TEXTURE_IDS);
    const filterValid = (ids: string[]) => ids.filter(id => validIds.has(id));

    const result = {
      id: `ai-vibe-${Date.now()}`,
      name: vibe.name,
      emoji: vibe.emoji,
      description: vibe.description,
      palette: vibe.palette,
      lightTextures: filterValid(vibe.lightTextures),
      mediumTextures: filterValid(vibe.mediumTextures),
      darkTextures: filterValid(vibe.darkTextures),
      accentTextures: filterValid(vibe.accentTextures),
      frameChoice: vibe.frameChoice,
      viewBox: "0 0 480 480",
      sections: vibe.sections,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-vibe error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
