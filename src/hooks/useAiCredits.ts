import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'ai_limit_reached';
const FAIL_COUNT_KEY = 'ai_consecutive_fails';
const WARNING_KEY = 'ai_low_warning';

export function useAiCredits() {
  const [limitReached, setLimitReached] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === 'true'; } catch { return false; }
  });
  const [lowWarning, setLowWarning] = useState(() => {
    try { return sessionStorage.getItem(WARNING_KEY) === 'true'; } catch { return false; }
  });
  const [showModal, setShowModal] = useState(false);

  // Sync across components via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setLimitReached(detail.limitReached);
      if (detail.showModal) setShowModal(true);
      if (detail.lowWarning !== undefined) setLowWarning(detail.lowWarning);
    };
    window.addEventListener('ai-credits-change', handler);
    return () => window.removeEventListener('ai-credits-change', handler);
  }, []);

  const recordFailure = useCallback((errorMessage?: string, statusCode?: number) => {
    const isCreditsError = statusCode === 402 || statusCode === 429 ||
      /quota|limit|credit|rate.limit|insufficient|payment.required|too many/i.test(errorMessage || '');

    if (isCreditsError) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      sessionStorage.setItem(FAIL_COUNT_KEY, '0');
      setLimitReached(true);
      setShowModal(true);
      window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { limitReached: true, showModal: true } }));
      return;
    }

    // Track consecutive non-credit failures
    const count = parseInt(sessionStorage.getItem(FAIL_COUNT_KEY) || '0', 10) + 1;
    sessionStorage.setItem(FAIL_COUNT_KEY, String(count));

    if (count >= 2) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setLimitReached(true);
      setShowModal(true);
      window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { limitReached: true, showModal: true } }));
    }
  }, []);

  const recordSuccess = useCallback(() => {
    sessionStorage.setItem(FAIL_COUNT_KEY, '0');
  }, []);

  const showLowWarning = useCallback(() => {
    sessionStorage.setItem(WARNING_KEY, 'true');
    setLowWarning(true);
    window.dispatchEvent(new CustomEvent('ai-credits-change', { detail: { limitReached: false, lowWarning: true } }));
  }, []);

  const dismissModal = useCallback(() => setShowModal(false), []);
  const dismissWarning = useCallback(() => {
    setLowWarning(false);
    sessionStorage.removeItem(WARNING_KEY);
  }, []);

  // Guard: returns true if AI is blocked
  const guardAiAction = useCallback((): boolean => {
    if (limitReached) {
      setShowModal(true);
      return true;
    }
    return false;
  }, [limitReached]);

  return {
    limitReached,
    lowWarning,
    showModal,
    guardAiAction,
    recordFailure,
    recordSuccess,
    showLowWarning,
    dismissModal,
    dismissWarning,
  };
}
