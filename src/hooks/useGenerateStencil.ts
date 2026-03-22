import { useState } from 'react';
import { Vibe } from '@/types/studio';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkContentFilter } from '@/lib/contentFilter';

interface UseGenerateStencilOptions {
  onCreditsUpdate?: (data: any) => void;
  onNoPremium?: () => void;
  onNoCredits?: () => void;
  onSuccess?: () => void;
}

export function useGenerateStencil(options?: UseGenerateStencilOptions) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStencil = async (prompt: string): Promise<Vibe | null> => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a prompt', description: 'Describe what you want the stencil to look like.', variant: 'destructive' });
      return null;
    }

    // Offline check
    if (!navigator.onLine) {
      toast({ title: 'AI requires a connection', variant: 'destructive' });
      return null;
    }

    const filter = checkContentFilter(prompt);
    if (!filter.allowed) {
      toast({ title: '🚫 Nope!', description: filter.message, variant: 'destructive' });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-stencil', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error('Generate stencil error:', error);
        const msg = (error as any)?.message || 'Could not generate stencil.';
        const status = (error as any)?.status;
        
        // Try to parse error body
        let errorBody: any = null;
        try {
          if (typeof msg === 'string' && msg.startsWith('{')) errorBody = JSON.parse(msg);
        } catch {}

        const errorCode = errorBody?.error || data?.error;

        if (errorCode === 'PREMIUM_REQUIRED' || status === 403) {
          options?.onNoPremium?.();
          return null;
        }
        if (errorCode === 'NO_CREDITS' || status === 402) {
          options?.onNoCredits?.();
          return null;
        }
        if (errorCode === 'GENERATION_FAILED') {
          toast({ title: 'Something went wrong', description: 'Credit not used.', variant: 'destructive' });
          return null;
        }
        toast({ title: 'Generation failed', description: msg, variant: 'destructive' });
        return null;
      }

      if (data?.error) {
        if (data.error === 'PREMIUM_REQUIRED') {
          options?.onNoPremium?.();
          return null;
        }
        if (data.error === 'NO_CREDITS') {
          options?.onNoCredits?.();
          return null;
        }
        if (data.error === 'GENERATION_FAILED') {
          toast({ title: 'Something went wrong', description: 'Credit not used.', variant: 'destructive' });
          return null;
        }
        toast({ title: 'Generation failed', description: data.message || data.error, variant: 'destructive' });
        return null;
      }

      // Success — update credits from response
      options?.onCreditsUpdate?.(data);
      options?.onSuccess?.();
      
      const remaining = data.totalRemaining;
      toast({ title: `${data.emoji} ${data.name}`, description: `Nice — ${remaining} left` });
      return data as Vibe;
    } catch (e) {
      console.error('Generate stencil error:', e);
      toast({ title: 'Something went wrong', description: 'Credit not used.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateStencil, isGenerating };
}
