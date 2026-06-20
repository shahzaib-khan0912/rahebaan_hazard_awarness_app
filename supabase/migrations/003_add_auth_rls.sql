-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 003_add_auth_rls.sql
-- Description: Adds user_id column to hazards table and secures
--              Row Level Security (RLS) to prevent privacy breaches
--              and restrict editing/deleting to the owner.
-- ============================================================

-- 1. Add user_id to link hazards to authenticated users
--    ON DELETE SET NULL ensures hazards stay if the user deletes their account
ALTER TABLE hazards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Drop the old permissive insert policy
DROP POLICY IF EXISTS "Allow public insert access" ON hazards;

-- 3. Create a STRICT insert policy
--    - Logged-in users MUST insert their own user_id.
--    - Guests (anon) MUST insert with user_id as NULL.
CREATE POLICY "Allow secure insert access"
    ON hazards
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        (auth.role() = 'authenticated' AND user_id = auth.uid())
        OR
        (auth.role() = 'anon' AND user_id IS NULL)
    );

-- 4. Create an UPDATE policy (Strictly Owners Only)
CREATE POLICY "Allow owner to update"
    ON hazards
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Create a DELETE policy (Strictly Owners Only)
CREATE POLICY "Allow owner to delete"
    ON hazards
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run"
-- ============================================================
