"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

export function useUser() {
  const { user, isLoading } = useAuth();

  return {
    data: user,
    isLoading,
    isError: false,
  };
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { fetchUser, user, isAdmin, isEmployee } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      const data = await getUser();
      if (data) {
        await fetchUser();
      }
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/login");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => resetPassword(email),
  });
}
