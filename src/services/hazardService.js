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
 * @param {string} [hazard.photo_url] - URL of uploaded photo
 * @param {number} [hazard.verification_score] - AI verification score (0-100)
 * @param {string} [hazard.verification_status] - Verification status
 * @param {boolean} [hazard.is_ai_generated] - Whether photo is AI-generated
 * @param {Object} [hazard.ai_analysis] - Full AI analysis JSON
 * @returns {Promise<Object>} The inserted hazard row
 */
export async function insertHazard({
  hazard_type,
  description,
  latitude,
  longitude,
  reported_by = "anonymous",
  ...optionalFields
}) {
  const row = {
    hazard_type,
    description,
    latitude,
    longitude,
    reported_by,
  };

  // Only include optional fields (photo, verification) if they are present
  // This prevents errors when DB migration hasn't been run yet
  for (const [key, value] of Object.entries(optionalFields)) {
    if (value !== undefined && value !== null) {
      row[key] = value;
    }
  }

  const { data, error } = await supabase
    .from("hazards")
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(`Failed to insert hazard: ${error.message}`);
  return data;
}

/**
 * Update an existing hazard report in Supabase.
 * @param {string} id - The ID of the hazard to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated hazard row
 */
export async function updateHazard(id, updates) {
  const { data, error } = await supabase
    .from("hazards")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update hazard: ${error.message}`);
  return data;
}

/**
 * Delete a hazard report from Supabase.
 * @param {string} id - The ID of the hazard to delete
 * @returns {Promise<void>}
 */
export async function deleteHazard(id) {
  const { data, error } = await supabase
    .from("hazards")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to delete hazard: ${error.message}`);
  
  // If RLS blocked the delete, data will be empty or null
  if (!data || data.length === 0) {
    throw new Error("You do not have permission to delete this hazard. You can only delete reports that you created while logged in.");
  }
}
