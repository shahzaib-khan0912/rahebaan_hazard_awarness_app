import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables.
// These must be defined in your .env file:
//   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Please create a .env file in the project root with:\n" +
      "  VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co\n" +
      "  VITE_SUPABASE_ANON_KEY=your-anon-public-key-here"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
