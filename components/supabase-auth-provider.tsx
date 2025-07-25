"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type SupabaseAuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  isLoading: true,
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser(); // ✅ safer
        console.log("supabase", supabase);
        setUser(user || null);
        console.log("session data:", user);
        console.log(
          "Auth state:",
          user ? "Authenticated" : "Not authenticated"
        );
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseAuthContext.Provider value={{ user, isLoading }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);
