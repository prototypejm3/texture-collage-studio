import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { SUPPORTED_LANGS } from '@/lib/i18n';

interface Props {
  kidMode?: boolean;
}

/** Compact language picker pill — manual switcher only. */
export function LanguagePill({ kidMode = false }: Props) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const current = SUPPORTED_LANGS.find(l => l.code === lang) ?? SUPPORTED_LANGS[0];

  const bg = kidMode ? '#fff8f0' : 'hsl(var(--background))';
  const border = kidMode ? '#e8ddd0' : 'hsl(var(--border))';
  const fg = kidMode ? '#6b4c2a' : 'hsl(var(--foreground))';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full px-2.5 transition-all hover:scale-105"
        style={{
          height: 38,
          backgroundColor: bg,
          border: `1.5px solid ${border}`,
          color: fg,
        }}
        title="Change language"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-bold uppercase tracking-wide">{current.code}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 z-[120] rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundColor: bg,
              border: `1.5px solid ${border}`,
              minWidth: 160,
            }}
          >
            {SUPPORTED_LANGS.map(l => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-black/5"
                  style={{
                    backgroundColor: active ? (kidMode ? '#fde6cf' : 'hsl(var(--accent))') : 'transparent',
                    color: fg,
                  }}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="text-sm font-medium flex-1">{l.label}</span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
