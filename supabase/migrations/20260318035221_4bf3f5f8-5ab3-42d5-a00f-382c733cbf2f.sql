
-- Gallery submissions table
CREATE TABLE public.gallery_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  artist_name text NOT NULL DEFAULT 'Anonymous',
  preview_image text NOT NULL,
  frame_style text NOT NULL DEFAULT 'gold',
  display_size text NOT NULL DEFAULT 'medium',
  shadow_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Gallery shadows (likes) table
CREATE TABLE public.gallery_shadows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id uuid NOT NULL REFERENCES public.gallery_submissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, submission_id)
);

-- Enable RLS
ALTER TABLE public.gallery_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_shadows ENABLE ROW LEVEL SECURITY;

-- Gallery submissions policies
CREATE POLICY "Anyone can read approved submissions" ON public.gallery_submissions
  FOR SELECT TO public USING (status = 'approved');

CREATE POLICY "Users can read own submissions" ON public.gallery_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.gallery_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" ON public.gallery_submissions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own submissions" ON public.gallery_submissions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Gallery shadows policies
CREATE POLICY "Anyone can read shadow counts" ON public.gallery_shadows
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert own shadows" ON public.gallery_shadows
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shadows" ON public.gallery_shadows
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger to update shadow_count
CREATE OR REPLACE FUNCTION public.update_shadow_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.gallery_submissions SET shadow_count = shadow_count + 1 WHERE id = NEW.submission_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.gallery_submissions SET shadow_count = shadow_count - 1 WHERE id = OLD.submission_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_shadow_change
  AFTER INSERT OR DELETE ON public.gallery_shadows
  FOR EACH ROW EXECUTE FUNCTION public.update_shadow_count();

-- Enable realtime for gallery
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_submissions;
