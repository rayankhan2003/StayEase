"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/api/auth";

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  setUser: (user: any) => void; // ✅ Add this
  isEmployee: boolean;
  isLoading: boolean;
  userBranchId: string | null;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [userBranchId, setUserBranchId] = useState<string | null>(null);
  const router = useRouter();
  const fetchUser = async () => {
    try {
      setIsLoading(true);

      // ✅ Wait for session before calling getUser()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setUser(null);
        return;
      }

      const data = await getUser();
      if (data) {
        console.log("setting user from context: ", data);
        setUser(data);
        setIsAdmin(data?.profile?.role === "admin");
        setIsEmployee(data?.profile?.role === "employee");
        setUserBranchId(data?.profile?.branch_id);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setIsAdmin(false);
      setIsEmployee(false);
      setUserBranchId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);
      if (event === "TOKEN_REFRESHED") {
        fetchUser(); // only refresh if token changes
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
        setIsEmployee(false);
        setUserBranchId(null);
        setIsLoading(false);
      }
    });

    fetchUser();
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsEmployee(false);
    setUserBranchId(null);
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        isEmployee,
        isLoading,
        userBranchId,
        fetchUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export { AuthContext };
