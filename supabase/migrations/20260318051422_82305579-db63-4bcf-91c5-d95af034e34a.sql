
CREATE TABLE public.stencil_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stencil_id uuid NOT NULL REFERENCES public.stencils(id) ON DELETE CASCADE,
  reason text NOT NULL DEFAULT 'bad_quality',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, stencil_id)
);

ALTER TABLE public.stencil_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reports" ON public.stencil_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own reports" ON public.stencil_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.stencil_reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
