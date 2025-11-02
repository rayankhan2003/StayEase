import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ✅ Use the same environment variables you set in Netlify
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🧩 Safety check — prevents silent failures
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Check Netlify settings.");
}

// ✅ Create and export a singleton Supabase client for server components or API routes
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
