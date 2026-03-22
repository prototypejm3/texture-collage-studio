import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CreditInfo {
  isPremium: boolean;
  monthlyCredits: number;
  monthlyUsed: number;
  purchasedCredits: number;
  creditsResetAt: string | null;
  remainingMonthly: number;
  totalRemaining: number;
  loading: boolean;
}

export function useAiCredits() {
  const { user } = useAuth();
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    isPremium: false,
    monthlyCredits: 10,
    monthlyUsed: 0,
    purchasedCredits: 0,
    creditsResetAt: null,
    remainingMonthly: 10,
    totalRemaining: 10,
    loading: true,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCreditInfo(prev => ({ ...prev, loading: false, isPremium: false }));
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium, monthly_credits, monthly_used, purchased_credits, credits_reset_at')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      setCreditInfo(prev => ({ ...prev, loading: false }));
      return;
    }

    const remainingMonthly = Math.max(0, (data.monthly_credits || 10) - (data.monthly_used || 0));
    const totalRemaining = remainingMonthly + (data.purchased_credits || 0);

    setCreditInfo({
      isPremium: data.is_premium || false,
      monthlyCredits: data.monthly_credits || 10,
      monthlyUsed: data.monthly_used || 0,
      purchasedCredits: data.purchased_credits || 0,
      creditsResetAt: data.credits_reset_at || null,
      remainingMonthly,
      totalRemaining,
      loading: false,
    });
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Handle credits_purchased query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('credits_purchased') === 'true' && user) {
      // Verify and add credits
      supabase.functions.invoke('verify-credits-purchase').then(({ data, error }) => {
        if (data?.credited) {
          fetchCredits();
          // Import dynamically to avoid circular deps
          import('@/hooks/use-toast').then(({ toast }) => {
            const isFirst = creditInfo.purchasedCredits === 0;
            toast({ title: '+10 credits added ✦', description: isFirst ? 'Credits never expire — use them anytime' : 'Your AI stencil credits have been topped up.' });
          });
        }
      });
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('credits_purchased');
      window.history.replaceState({}, '', url.toString());
    }
  }, [user]);

  const updateFromResponse = useCallback((responseData: any) => {
    if (responseData?.totalRemaining !== undefined) {
      setCreditInfo(prev => ({
        ...prev,
        remainingMonthly: responseData.remainingMonthly ?? prev.remainingMonthly,
        purchasedCredits: responseData.purchasedCredits ?? prev.purchasedCredits,
        totalRemaining: responseData.totalRemaining,
        creditsResetAt: responseData.creditsResetAt ?? prev.creditsResetAt,
      }));
    }
  }, []);

  const openPurchaseModal = useCallback(() => setShowPurchaseModal(true), []);
  const closePurchaseModal = useCallback(() => setShowPurchaseModal(false), []);
  const openPremiumPaywall = useCallback(() => setShowPremiumPaywall(true), []);
  const closePremiumPaywall = useCallback(() => setShowPremiumPaywall(false), []);

  const handlePurchase = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('purchase-credits');
    if (error || !data?.url) {
      import('@/hooks/use-toast').then(({ toast }) => {
        toast({ title: 'Payment failed', description: 'Payment failed. You were not charged.', variant: 'destructive' });
      });
      return;
    }
    window.open(data.url, '_blank');
  }, []);

  return {
    ...creditInfo,
    showPurchaseModal,
    showPremiumPaywall,
    fetchCredits,
    updateFromResponse,
    openPurchaseModal,
    closePurchaseModal,
    openPremiumPaywall,
    closePremiumPaywall,
    handlePurchase,
  };
}
