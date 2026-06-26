-- ============================================================
-- Pakistan Road Hazard Reporter — Migration #2
-- File: 002_add_photo_verification.sql
-- Description: Adds photo verification columns and creates
--              a storage bucket for hazard photos.
-- ============================================================

ALTER TABLE hazards ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS verification_score INTEGER;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS ai_analysis JSONB;

COMMENT ON COLUMN hazards.photo_url IS 'Public URL of the uploaded hazard photo in Supabase Storage.';
COMMENT ON COLUMN hazards.verification_score IS 'AI-assigned confidence score (0-100) that the photo matches the reported hazard.';
COMMENT ON COLUMN hazards.verification_status IS 'One of: unverified, verified, suspicious, rejected.';
COMMENT ON COLUMN hazards.is_ai_generated IS 'Whether the AI detected the photo as AI-generated (fake).';
COMMENT ON COLUMN hazards.ai_analysis IS 'Full JSON response from the AI verification agents.';


DROP POLICY IF EXISTS "Allow public update access" ON hazards;
CREATE POLICY "Allow public update access"
    ON hazards
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access" ON hazards;
CREATE POLICY "Allow public delete access"
    ON hazards
    FOR DELETE
    TO anon, authenticated
    USING (true);

