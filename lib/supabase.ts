import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

// For client components
let supabaseUrl = "";
let supabaseAnonKey = "";

// Check if we're running on the client side
if (typeof window !== "undefined") {
  // Use public environment variables on the client side
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
} else {
  // Use server-side environment variables
  supabaseUrl = process.env.SUPABASE_URL || "";
  supabaseAnonKey = process.env.SUPABASE_KEY || "";
}

// Create and export the Supabase client
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
