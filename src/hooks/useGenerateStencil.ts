import { useState } from 'react';
import { Vibe } from '@/types/studio';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkGenerationLimit, recordGeneration } from '@/hooks/useGenerationLimit';

export function useGenerateStencil() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStencil = async (prompt: string): Promise<Vibe | null> => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a prompt', description: 'Describe what you want the stencil to look like.', variant: 'destructive' });
      return null;
    }

    const limit = checkGenerationLimit();
    if (!limit.allowed) {
      toast({ title: 'Rate limit reached', description: `You can generate 5 per hour. Try again in ${limit.resetIn} min.`, variant: 'destructive' });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-stencil', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error('Generate stencil error:', error);
        toast({ title: 'Generation failed', description: error.message || 'Could not generate stencil.', variant: 'destructive' });
        return null;
      }

      if (data?.error) {
        toast({ title: 'Generation failed', description: data.error, variant: 'destructive' });
        return null;
      }

      toast({ title: `${data.emoji} ${data.name}`, description: 'AI stencil generated!' });
      return data as Vibe;
    } catch (e) {
      console.error('Generate stencil error:', e);
      toast({ title: 'Error', description: 'Failed to generate stencil. Try again.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateStencil, isGenerating };
}
