-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 004_setup_storage.sql
-- Description: Creates the "hazard-photos" storage bucket and 
--              sets up the necessary permissions for image uploads.
-- ============================================================

-- 1. Create the storage bucket and make it public
INSERT INTO storage.buckets (id, name, public)
VALUES ('hazard-photos', 'hazard-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own uploads" ON storage.objects;

-- 3. Policy: Allow ANYONE to read photos from the bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hazard-photos');

-- 4. Policy: Allow ANYONE (including guests) to upload photos
CREATE POLICY "Allow public upload access"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hazard-photos');

-- 5. Policy: Allow authenticated users to delete photos
CREATE POLICY "Allow users to delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hazard-photos' AND owner = auth.uid());

-- ============================================================
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run"
-- ============================================================
