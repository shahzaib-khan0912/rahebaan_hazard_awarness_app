-- ============================================================
-- Pakistan Road Hazard Reporter — Database Migration
-- File: 001_create_hazards_table.sql
-- Description: Creates the "hazards" table and enables RLS
--              with public read/insert policies.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS hazards (
    id          UUID         DEFAULT uuid_generate_v4() PRIMARY KEY,
    hazard_type TEXT         NOT NULL,
    description TEXT,
    latitude    FLOAT8       NOT NULL,
    longitude   FLOAT8       NOT NULL,
    reported_by TEXT         DEFAULT 'anonymous',
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

COMMENT ON TABLE hazards IS 'Stores crowd-sourced road hazard reports across Pakistan.';

ALTER TABLE hazards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON hazards;
CREATE POLICY "Allow public read access"
    ON hazards
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON hazards;
CREATE POLICY "Allow public insert access"
    ON hazards
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
