import { useEffect, useState } from 'react';
import { getLang, setLang as setLangStore, onLangChange, Lang } from '@/lib/i18n';

export function useLanguage(): { lang: Lang; setLang: (l: Lang) => void } {
  const [lang, setLangState] = useState<Lang>(() => getLang());
  useEffect(() => onLangChange(setLangState), []);
  return {
    lang,
    setLang: (l: Lang) => { setLangStore(l); setLangState(l); },
  };
}
