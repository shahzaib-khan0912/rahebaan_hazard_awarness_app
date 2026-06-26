-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 003_add_auth_rls.sql
-- Description: Adds user_id column to hazards table and secures
--              Row Level Security (RLS) to prevent privacy breaches
--              and restrict editing/deleting to the owner.
-- ============================================================

ALTER TABLE hazards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Allow public insert access" ON hazards;
.
DROP POLICY IF EXISTS "Allow secure insert access" ON hazards;
CREATE POLICY "Allow secure insert access"
    ON hazards
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        (auth.role() = 'authenticated' AND user_id = auth.uid())
        OR
        (auth.role() = 'anon' AND user_id IS NULL)
    );

DROP POLICY IF EXISTS "Allow owner to update" ON hazards;
CREATE POLICY "Allow owner to update"
    ON hazards
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow owner to delete" ON hazards;
CREATE POLICY "Allow owner to delete"
    ON hazards
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
