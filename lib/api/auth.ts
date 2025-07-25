import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Error signing in: ${error.message}`);
  }

  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`Error signing up: ${error.message}`);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Error signing out: ${error.message}`);
  }

  return true;
}

export async function getUser() {
  // Get the auth user from Supabase
  const { data: authData, error: authError } = await supabase.auth.getUser();
  console.log("data user", authData);

  if (authError) {
    throw new Error(`Error getting user: ${authError.message}`);
  }

  const user = authData.user;

  if (!user) return null;

  // Get the user profile (e.g. role, branch, name)
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Error getting profile: ${profileError.message}`);
  }

  return {
    ...user,
    profile: profileData,
  };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(`Error resetting password: ${error.message}`);
  }

  return true;
}
