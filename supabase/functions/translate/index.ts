// Lovable AI translation edge function. Batches strings -> target language.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  tr: "Turkish",
  fr: "French",
  de: "German",
  es: "Spanish",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { texts, target } = await req.json();
    if (!Array.isArray(texts) || !texts.length || !target || target === "en") {
      return new Response(JSON.stringify({ translations: texts ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const targetName = LANG_NAMES[target] ?? target;
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const sys =
      `You are a professional UI translator for a children's art app. Translate every input string from English to ${targetName}. ` +
      `Preserve emojis, punctuation, casing style, and placeholders. Keep brand names untranslated. ` +
      `Return ONLY a JSON object: {"t":["...","..."]} with the same length and order as input. No commentary.`;

    const user = JSON.stringify({ items: texts });

    const resp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(
        JSON.stringify({ error: "translate_failed", status: resp.status }),
        {
          status: resp.status === 429 || resp.status === 402 ? resp.status : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let translations: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      translations = parsed.t ?? parsed.translations ?? [];
    } catch {
      translations = [];
    }
    if (translations.length !== texts.length) {
      // Pad/truncate to keep ordering safe.
      translations = texts.map((t: string, i: number) => translations[i] ?? t);
    }
    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
