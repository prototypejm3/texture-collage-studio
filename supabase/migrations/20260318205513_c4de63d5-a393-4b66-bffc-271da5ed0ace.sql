-- Allow authenticated users to read all gallery submissions (needed for admin review)
CREATE POLICY "Authenticated users can read all submissions"
  ON public.gallery_submissions
  FOR SELECT
  TO authenticated
  USING (true);
