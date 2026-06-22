-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 005_add_admin_role.sql
-- Description: Creates an admins table and updates the hazards
--              Delete policy so admins can delete any report.
-- ============================================================

-- 1. Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on the admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only read their own admin status
DROP POLICY IF EXISTS "Allow users to read their own admin status" ON admins;
CREATE POLICY "Allow users to read their own admin status"
    ON admins 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- 4. Drop the old delete policy for hazards
DROP POLICY IF EXISTS "Allow owner to delete" ON hazards;
DROP POLICY IF EXISTS "Allow secure delete access" ON hazards;
DROP POLICY IF EXISTS "Allow public delete access" ON hazards;

-- 5. Create new delete policy: Owners AND Admins can delete
DROP POLICY IF EXISTS "Allow owner and admins to delete" ON hazards;
CREATE POLICY "Allow owner and admins to delete"
    ON hazards
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id 
        OR 
        EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
    );

-- ============================================================
-- HOW TO USE:
-- 1. Run this script in the Supabase SQL Editor.
-- 2. To make someone an admin, manually insert their user UUID 
--    into the "admins" table via the Supabase Table Editor.
-- ============================================================
