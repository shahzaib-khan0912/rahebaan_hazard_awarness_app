-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 001_create_hazards_table.sql
-- Description: Creates the "hazards" table and enables RLS
--              with public read/insert policies.
-- ============================================================

-- 1. Enable the uuid-ossp extension (for uuid_generate_v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the hazards table
CREATE TABLE IF NOT EXISTS hazards (
    id          UUID         DEFAULT uuid_generate_v4() PRIMARY KEY,
    hazard_type TEXT         NOT NULL,
    description TEXT,
    latitude    FLOAT8       NOT NULL,
    longitude   FLOAT8       NOT NULL,
    reported_by TEXT         DEFAULT 'anonymous',
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. Add a comment for documentation
COMMENT ON TABLE hazards IS 'Stores crowd-sourced road hazard reports across Pakistan.';

-- 4. Enable Row Level Security on the table
ALTER TABLE hazards ENABLE ROW LEVEL SECURITY;

-- 5. Policy: Allow anyone to READ all hazard reports
CREATE POLICY "Allow public read access"
    ON hazards
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 6. Policy: Allow anyone to INSERT new hazard reports
CREATE POLICY "Allow public insert access"
    ON hazards
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- ============================================================
-- HOW TO RUN:
-- 1. Go to your Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run"
-- ============================================================
