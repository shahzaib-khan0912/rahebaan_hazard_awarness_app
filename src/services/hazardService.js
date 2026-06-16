import { supabase } from "../lib/SupabaseClient";

/**
 * Fetch all hazard reports, newest first.
 * @returns {Promise<Array>} Array of hazard objects
 */
export async function fetchHazards() {
  const { data, error } = await supabase
    .from("hazards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch hazards: ${error.message}`);
  return data || [];
}

/**
 * Insert a new hazard report into Supabase.
 * @param {Object} hazard - The hazard report data
 * @param {string} hazard.hazard_type - Type of hazard
 * @param {string} hazard.description - Description of the hazard
 * @param {number} hazard.latitude - Latitude coordinate
 * @param {number} hazard.longitude - Longitude coordinate
 * @param {string} [hazard.reported_by="anonymous"] - Reporter name
 * @returns {Promise<Object>} The inserted hazard row
 */
export async function insertHazard({
  hazard_type,
  description,
  latitude,
  longitude,
  reported_by = "anonymous",
}) {
  const { data, error } = await supabase
    .from("hazards")
    .insert([
      {
        hazard_type,
        description,
        latitude,
        longitude,
        reported_by,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to insert hazard: ${error.message}`);
  return data;
}
