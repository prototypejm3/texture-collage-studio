import { useState } from 'react';
import { Vibe } from '@/types/studio';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkGenerationLimit, recordGeneration } from '@/hooks/useGenerationLimit';
import { checkContentFilter } from '@/lib/contentFilter';

interface UseGenerateStencilOptions {
  onCreditsError?: (message?: string, status?: number) => void;
  onSuccess?: () => void;
}

export function useGenerateStencil(options?: UseGenerateStencilOptions) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStencil = async (prompt: string): Promise<Vibe | null> => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a prompt', description: 'Describe what you want the stencil to look like.', variant: 'destructive' });
      return null;
    }

    const filter = checkContentFilter(prompt);
    if (!filter.allowed) {
      toast({ title: '🚫 Nope!', description: filter.message, variant: 'destructive' });
      return null;
    }

    const limit = checkGenerationLimit();
    if (!limit.allowed) {
      toast({ title: 'Daily limit reached', description: `You've used all ${limit.max} AI generations for today. Come back tomorrow!`, variant: 'destructive' });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-stencil', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error('Generate stencil error:', error);
        const msg = error.message || 'Could not generate stencil.';
        // Check for credits/rate errors from edge function
        const status = (error as any)?.status;
        if (status === 402 || status === 429 || /quota|limit|credit|rate|insufficient|payment/i.test(msg)) {
          options?.onCreditsError?.(msg, status);
          return null;
        }
        options?.onCreditsError?.(msg, status); // track consecutive failures
        toast({ title: 'Generation failed', description: msg, variant: 'destructive' });
        return null;
      }

      if (data?.error) {
        const dataError = data.error as string;
        if (/quota|limit|credit|rate|insufficient|payment|429|402/i.test(dataError)) {
          options?.onCreditsError?.(dataError);
          return null;
        }
        options?.onCreditsError?.(dataError);
        toast({ title: 'Generation failed', description: dataError, variant: 'destructive' });
        return null;
      }

      recordGeneration();
      options?.onSuccess?.();
      toast({ title: `${data.emoji} ${data.name}`, description: 'AI stencil generated!' });
      return data as Vibe;
    } catch (e) {
      console.error('Generate stencil error:', e);
      const msg = e instanceof Error ? e.message : 'Failed to generate stencil. Try again.';
      options?.onCreditsError?.(msg);
      toast({ title: 'Error', description: 'Failed to generate stencil. Try again.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateStencil, isGenerating };
}
