import { useState, useEffect, useCallback } from 'react';
import { checkGenerationLimit } from '@/hooks/useGenerationLimit';

const SESSION_KEY = 'ai_limit_reached';
const FAIL_COUNT_KEY = 'ai_consecutive_fails';

export function useAiCredits() {
  const [limitReached, setLimitReached] = useState(() => {
    const limit = checkGenerationLimit();
    return !limit.allowed;
  });
  const [showModal, setShowModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [dailyInfo, setDailyInfo] = useState(() => checkGenerationLimit());

  // Re-check on mount / across components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.limitReached !== undefined) setLimitReached(detail.limitReached);
      if (detail.showModal) setShowModal(true);
      if (detail.showPremiumModal) setShowPremiumModal(true);
      setDailyInfo(checkGenerationLimit());
    };
    window.addEventListener('ai-credits-change', handler);
    return () => window.removeEventListener('ai-credits-change', handler);
  }, []);

  const refreshDaily = useCallback(() => {
    const info = checkGenerationLimit();
    setDailyInfo(info);
    setLimitReached(!info.allowed);
  }, []);

  const recordFailure = useCallback((errorMessage?: string, statusCode?: number) => {
    const isCreditsError = statusCode === 402 || statusCode === 429 ||
      /quota|limit|credit|rate.limit|insufficient|payment.required|too many/i.test(errorMessage || '');

    if (isCreditsError) {
      setLimitReached(true);
      setShowModal(true);
      window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { limitReached: true, showModal: true } }));
      return;
    }

    const count = parseInt(sessionStorage.getItem(FAIL_COUNT_KEY) || '0', 10) + 1;
    sessionStorage.setItem(FAIL_COUNT_KEY, String(count));

    if (count >= 2) {
      setLimitReached(true);
      setShowModal(true);
      window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { limitReached: true, showModal: true } }));
    }
  }, []);

  const recordSuccess = useCallback(() => {
    sessionStorage.setItem(FAIL_COUNT_KEY, '0');
    refreshDaily();
  }, [refreshDaily]);

  const dismissModal = useCallback(() => setShowModal(false), []);
  const dismissPremiumModal = useCallback(() => setShowPremiumModal(false), []);

  // Guard for premium users (daily limit)
  const guardAiAction = useCallback((): boolean => {
    const info = checkGenerationLimit();
    if (!info.allowed) {
      setLimitReached(true);
      setShowModal(true);
      return true;
    }
    return false;
  }, []);

  // Guard for free users (show premium upsell)
  const guardFreeUser = useCallback((): boolean => {
    setShowPremiumModal(true);
    window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { showPremiumModal: true } }));
    return true;
  }, []);

  return {
    limitReached,
    dailyInfo,
    showModal,
    showPremiumModal,
    guardAiAction,
    guardFreeUser,
    recordFailure,
    recordSuccess,
    refreshDaily,
    dismissModal,
    dismissPremiumModal,
  };
}
