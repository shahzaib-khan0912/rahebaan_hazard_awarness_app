-- ============================================================
-- Pakistan Road Hazard Reporter — Migration #2
-- File: 002_add_photo_verification.sql
-- Description: Adds photo verification columns and creates
--              a storage bucket for hazard photos.
-- ============================================================

-- 1. Add photo and AI verification columns
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS verification_score INTEGER;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT false;
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS ai_analysis JSONB;

-- 2. Add comments for documentation
COMMENT ON COLUMN hazards.photo_url IS 'Public URL of the uploaded hazard photo in Supabase Storage.';
COMMENT ON COLUMN hazards.verification_score IS 'AI-assigned confidence score (0-100) that the photo matches the reported hazard.';
COMMENT ON COLUMN hazards.verification_status IS 'One of: unverified, verified, suspicious, rejected.';
COMMENT ON COLUMN hazards.is_ai_generated IS 'Whether the AI detected the photo as AI-generated (fake).';
COMMENT ON COLUMN hazards.ai_analysis IS 'Full JSON response from the AI verification agents.';

-- 3. Create storage bucket for hazard photos (run in Supabase Dashboard > Storage)
-- NOTE: Supabase storage buckets are typically created via the Dashboard or API,
-- not via SQL. Create a bucket named "hazard-photos" with:
--   - Public access: ON
--   - Max file size: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp

-- 4. RLS policy for storage (if using SQL-based storage policies)
-- Allow anyone to upload to hazard-photos bucket
-- Allow anyone to read from hazard-photos bucket

-- 5. Update existing RLS policies to include new columns
-- (existing SELECT/INSERT policies already cover all columns via *)

-- 6. Add UPDATE policy so users can update verification data
CREATE POLICY "Allow public update access"
    ON hazards
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Add DELETE policy so users can delete hazard reports
CREATE POLICY "Allow public delete access"
    ON hazards
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- ============================================================
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard → SQL Editor
-- 2. Paste this entire script and click "Run"
-- 3. Go to Storage → Create bucket "hazard-photos" (public)
-- ============================================================
