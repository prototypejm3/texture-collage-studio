import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getLabels } from '@/lib/labels';
import { useLanguage } from '@/hooks/useLanguage';

export function EmptyWall() {
  const [kidMode, setKidMode] = useState(() => {
    try { return localStorage.getItem('kid-mode') !== 'false'; } catch { return true; }
  });
  useEffect(() => {
    const handler = (e: Event) => setKidMode((e as CustomEvent).detail);
    window.addEventListener('kid-mode-change', handler);
    return () => window.removeEventListener('kid-mode-change', handler);
  }, []);

  const { lang } = useLanguage();
  const labels = getLabels(kidMode, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        {kidMode ? <span className="text-4xl">🎨</span> : <Plus className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {labels.letsMakeSomething}
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        {labels.startFirstPiece}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {kidMode ? (
          <>{labels.startCreating}</>
        ) : (
          <><Plus className="w-4 h-4" /> {labels.createDesign}</>
        )}
      </Link>
    </motion.div>
  );
}
