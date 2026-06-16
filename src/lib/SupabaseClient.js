import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables.
// These must be defined in your .env file:
//   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Graceful fallback: if env vars are missing, create a dummy client
// that will fail on actual requests but won't crash the app on load.
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "⚠️ Supabase not configured. Create a .env file with:\n" +
      "  VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co\n" +
      "  VITE_SUPABASE_ANON_KEY=your-anon-public-key-here\n\n" +
      "The app will run with dummy data until Supabase is configured."
  );
  // Create a placeholder that throws descriptive errors on use
  supabase = {
    from: () => ({
      select: () => ({ order: () => ({ data: null, error: { message: "Supabase not configured" } }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: "Supabase not configured" } }) }) }),
    }),
  };
}

export { supabase };
