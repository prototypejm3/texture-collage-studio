import { useState, useCallback, useEffect } from 'react';
import { UserTier, FREE_DESIGN_LIMIT } from '@/types/wall';

const TIER_KEY = 'user-tier';

export function useUserTier() {
  const [tier, setTier] = useState<UserTier>(() => {
    try {
      return (localStorage.getItem(TIER_KEY) as UserTier) || 'free';
    } catch { return 'free'; }
  });

  useEffect(() => {
    localStorage.setItem(TIER_KEY, tier);
  }, [tier]);

  const upgradeToPremium = useCallback(() => {
    setTier('premium');
  }, []);

  const canSave = useCallback((currentCount: number) => {
    if (tier === 'premium') return true;
    return currentCount < FREE_DESIGN_LIMIT;
  }, [tier]);

  const isPremium = tier === 'premium';

  return { tier, isPremium, canSave, upgradeToPremium };
}
