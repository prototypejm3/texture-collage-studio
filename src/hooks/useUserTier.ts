import { useState, useCallback, useEffect } from 'react';
import { UserTier, FREE_DESIGN_LIMIT } from '@/types/wall';

const TIER_KEY = 'user-tier';
const EXPIRY_KEY = 'premium-expiry';

function checkExpiry(): boolean {
  try {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry) return false;
    return new Date(expiry) > new Date();
  } catch { return false; }
}

export function useUserTier() {
  const [tier, setTier] = useState<UserTier>(() => {
    try {
      const saved = localStorage.getItem(TIER_KEY) as UserTier;
      if (saved === 'premium' && !checkExpiry()) {
        localStorage.removeItem(TIER_KEY);
        return 'free';
      }
      return saved || 'free';
    } catch { return 'free'; }
  });

  useEffect(() => {
    localStorage.setItem(TIER_KEY, tier);
  }, [tier]);

  // Check expiry periodically
  useEffect(() => {
    if (tier !== 'premium') return;
    const interval = setInterval(() => {
      if (!checkExpiry()) {
        setTier('free');
        localStorage.removeItem(TIER_KEY);
        localStorage.removeItem(EXPIRY_KEY);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [tier]);

  const upgradeToPremium = useCallback(() => {
    setTier('premium');
  }, []);

  const canSave = useCallback((currentCount: number) => {
    if (tier === 'premium') return true;
    return currentCount < FREE_DESIGN_LIMIT;
  }, [tier]);

  const isPremium = tier === 'premium';

  const premiumExpiry = (() => {
    try { return localStorage.getItem(EXPIRY_KEY); } catch { return null; }
  })();

  return { tier, isPremium, canSave, upgradeToPremium, premiumExpiry };
}
