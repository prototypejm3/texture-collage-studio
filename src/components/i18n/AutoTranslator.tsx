// AutoTranslator: walks the DOM and translates visible text to the active language.
// English is the source of truth. Original text is stashed on data-i18n-orig so we can
// restore (or re-translate) when the language changes.
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Lang } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';

const CACHE_PREFIX = 'tx:'; // tx:{lang}:{text} -> translated
const ATTR_TEXTS = ['placeholder', 'title', 'alt', 'aria-label'] as const;

// Skip nodes inside these tags entirely.
const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'CANVAS',
]);
// Don't translate text inside elements with this attribute.
const SKIP_ATTR = 'data-no-translate';

function getCache(lang: Lang, text: string): string | null {
  try { return localStorage.getItem(CACHE_PREFIX + lang + ':' + text); } catch { return null; }
}
function setCache(lang: Lang, text: string, translated: string) {
  try { localStorage.setItem(CACHE_PREFIX + lang + ':' + text, translated); } catch {}
}

function isTranslatable(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.length > 300) return false;
  // Skip pure numbers / symbols / single chars.
  if (!/[A-Za-z]{2,}/.test(t)) return false;
  return true;
}

function shouldSkipElement(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.hasAttribute(SKIP_ATTR)) return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

interface Pending {
  apply: (translated: string) => void;
  text: string;
}

function collectPending(root: Node, lang: Lang): Pending[] {
  const out: Pending[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return shouldSkipElement(node as Element)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_SKIP; // descend into children, no node accepted itself
      }
      // Text node
      const parent = (node as Text).parentElement;
      if (!parent || shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      return isTranslatable(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  } as any);

  // Text nodes
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const tn = n as Text;
    const orig = (tn as any).__i18nOrig || tn.nodeValue || '';
    (tn as any).__i18nOrig = orig;
    out.push({
      text: orig.trim(),
      apply: (translated) => {
        // Preserve leading/trailing whitespace.
        const m = orig.match(/^(\s*)([\s\S]*?)(\s*)$/);
        const lead = m?.[1] ?? '';
        const tail = m?.[3] ?? '';
        tn.nodeValue = lead + translated + tail;
      },
    });
  }

  // Attribute texts
  const elWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => shouldSkipElement(node as Element)
      ? NodeFilter.FILTER_REJECT
      : NodeFilter.FILTER_ACCEPT,
  } as any);
  let el: Node | null;
  while ((el = elWalker.nextNode())) {
    const e = el as HTMLElement;
    for (const attr of ATTR_TEXTS) {
      const cur = e.getAttribute(attr);
      if (!cur || !isTranslatable(cur)) continue;
      const stash = `__i18nAttr_${attr}`;
      const orig = (e as any)[stash] || cur;
      (e as any)[stash] = orig;
      out.push({
        text: orig.trim(),
        apply: (translated) => e.setAttribute(attr, translated),
      });
    }
  }
  return out;
}

function restoreOriginals(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const tn = n as any;
    if (typeof tn.__i18nOrig === 'string') tn.nodeValue = tn.__i18nOrig;
  }
  const elWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let el: Node | null;
  while ((el = elWalker.nextNode())) {
    const e = el as HTMLElement;
    for (const attr of ATTR_TEXTS) {
      const stash = `__i18nAttr_${attr}`;
      const v = (e as any)[stash];
      if (typeof v === 'string') e.setAttribute(attr, v);
    }
  }
}

async function translateBatch(texts: string[], target: Lang): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { texts, target },
    });
    if (error) throw error;
    const arr = (data as any)?.translations as string[] | undefined;
    if (Array.isArray(arr) && arr.length === texts.length) return arr;
  } catch (e) {
    console.warn('[i18n] translate failed', e);
  }
  return texts;
}

export function AutoTranslator() {
  const { lang } = useLanguage();
  const langRef = useRef<Lang>(lang);
  const inflightRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    langRef.current = lang;

    if (lang === 'en') {
      restoreOriginals(document.body);
      return;
    }

    let cancelled = false;
    let mo: MutationObserver | null = null;
    let scheduled = false;

    const processAll = async (root: Node) => {
      if (cancelled || langRef.current !== lang) return;
      const pending = collectPending(root, lang);
      if (!pending.length) return;
      const groups = new Map<string, Pending[]>();
      const need: string[] = [];
      for (const p of pending) {
        const cached = getCache(lang, p.text);
        if (cached) { p.apply(cached); continue; }
        if (!groups.has(p.text)) {
          groups.set(p.text, []);
          if (!inflightRef.current.has(p.text)) need.push(p.text);
        }
        groups.get(p.text)!.push(p);
      }
      if (!need.length) return;
      // Mark inflight.
      need.forEach((t) => inflightRef.current.add(t));
      // Chunk to keep payloads modest.
      const CHUNK = 40;
      for (let i = 0; i < need.length; i += CHUNK) {
        const slice = need.slice(i, i + CHUNK);
        const result = await translateBatch(slice, lang);
        if (cancelled || langRef.current !== lang) return;
        slice.forEach((src, idx) => {
          const tgt = result[idx] ?? src;
          setCache(lang, src, tgt);
          inflightRef.current.delete(src);
          (groups.get(src) || []).forEach((p) => p.apply(tgt));
        });
      }
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        processAll(document.body);
      });
    };

    schedule();

    mo = new MutationObserver(() => schedule());
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: ATTR_TEXTS as unknown as string[],
    });

    return () => {
      cancelled = true;
      mo?.disconnect();
    };
  }, [lang]);

  return null;
}
