// Lightweight i18n for core UI labels.
// Manual switcher only — no auto-detect. Persisted in localStorage.

export type Lang = 'en' | 'tr' | 'fr' | 'de' | 'es';

export const SUPPORTED_LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe',   flag: '🇹🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
];

const STORAGE_KEY = 'app-lang';
const EVENT = 'app-lang-change';

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (v && SUPPORTED_LANGS.some(l => l.code === v)) return v;
  } catch {}
  return 'en';
}

export function setLang(lang: Lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: lang }));
}

export function onLangChange(cb: (lang: Lang) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent).detail as Lang);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
