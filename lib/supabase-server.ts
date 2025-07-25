import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// This client should only be used in Server Components or API routes
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_KEY || "";

  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const supabase = createServerSupabaseClient();
