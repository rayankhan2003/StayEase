import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
export type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

export async function getGuests(branchId?: string) {
  let query = supabase.from("guests").select("*").order("name");

  if (branchId) {
    query = query.eq("branch_id", branchId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching guests: ${error.message}`);
  }

  return data;
}

export async function getGuestById(id: string) {
  const { data, error } = await supabase.from("guests").select("*").eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching guest: ${error.message}`);
  }

  return data;
}

export async function createGuest(guest: GuestInsert) {
  console.log(guest);
  const { data, error } = await supabase.from("guests").insert(guest).select()
    .single();

  if (error) {
    throw new Error(`Error creating guest: ${error.message}`);
  }

  return data;
}

export async function updateGuest(id: string, guest: GuestUpdate) {
  const { data, error } = await supabase.from("guests").update(guest).eq(
    "id",
    id,
  ).select().single();

  if (error) {
    throw new Error(`Error updating guest: ${error.message}`);
  }

  return data;
}

export async function deleteGuest(id: string) {
  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting guest: ${error.message}`);
  }

  return true;
}

export async function findGuestByEmail(email: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(`Error finding guest: ${error.message}`);
  }

  return data;
}
