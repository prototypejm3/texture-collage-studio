import { useState } from 'react';
import { Vibe } from '@/types/studio';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { checkGenerationLimit, recordGeneration } from '@/hooks/useGenerationLimit';
import { checkContentFilter } from '@/lib/contentFilter';

export interface GeneratedVibe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  palette: { color: string; label: string }[];
  lightTextures: string[];
  mediumTextures: string[];
  darkTextures: string[];
  accentTextures: string[];
  frameChoice: string;
}

export function useGenerateVibe() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVibe, setGeneratedVibe] = useState<GeneratedVibe | null>(null);

  const generateVibe = async (prompt: string): Promise<GeneratedVibe | null> => {
    if (!prompt.trim()) {
      toast({ title: 'Enter a vibe', description: 'Describe the mood or aesthetic you want.', variant: 'destructive' });
      return null;
    }

    const filter = checkContentFilter(prompt);
    if (!filter.allowed) {
      toast({ title: '🚫 Nope!', description: filter.message, variant: 'destructive' });
      return null;
    }

    const limit = checkGenerationLimit();
    if (!limit.allowed) {
      toast({ title: 'Rate limit reached', description: `You can generate 5 per hour. Try again in ${limit.resetIn} min.`, variant: 'destructive' });
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-vibe', {
        body: { prompt: prompt.trim() },
      });

      if (error) {
        console.error('Generate vibe error:', error);
        toast({ title: 'Generation failed', description: error.message || 'Could not generate vibe.', variant: 'destructive' });
        return null;
      }

      if (data?.error) {
        toast({ title: 'Generation failed', description: data.error, variant: 'destructive' });
        return null;
      }

      recordGeneration();
      setGeneratedVibe(data as GeneratedVibe);
      toast({ title: `${data.emoji} ${data.name}`, description: data.description });
      return data as GeneratedVibe;
    } catch (e) {
      console.error('Generate vibe error:', e);
      toast({ title: 'Error', description: 'Failed to generate vibe. Try again.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const toVibe = (gv: GeneratedVibe): Vibe => ({
    id: gv.id,
    name: gv.name,
    emoji: gv.emoji,
    description: gv.description,
    viewBox: '0 0 480 480',
    sections: [],
    lightTextures: gv.lightTextures,
    mediumTextures: gv.mediumTextures,
    darkTextures: gv.darkTextures,
    accentTextures: gv.accentTextures,
  });

  return { generateVibe, isGenerating, generatedVibe, setGeneratedVibe, toVibe };
}
