-- Allow service role to read tour_requests (in case RLS blocks reads in some setups).
-- The service_role key normally bypasses RLS; this policy ensures SELECT works.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tour_requests' AND policyname = 'Service role read tour_requests'
  ) THEN
    CREATE POLICY "Service role read tour_requests"
      ON tour_requests FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;
