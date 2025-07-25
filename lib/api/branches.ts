import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Branch = Database["public"]["Tables"]["branches"]["Row"]
export type BranchInsert = Database["public"]["Tables"]["branches"]["Insert"]
export type BranchUpdate = Database["public"]["Tables"]["branches"]["Update"]

export async function getBranches() {
  const { data, error } = await supabase.from("branches").select("*").order("name")

  if (error) {
    throw new Error(`Error fetching branches: ${error.message}`)
  }

  return data
}

export async function getBranchById(id: string) {
  const { data, error } = await supabase.from("branches").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching branch: ${error.message}`)
  }

  return data
}

export async function createBranch(branch: BranchInsert) {
  const { data, error } = await supabase.from("branches").insert(branch).select().single()

  if (error) {
    throw new Error(`Error creating branch: ${error.message}`)
  }

  return data
}

export async function updateBranch(id: string, branch: BranchUpdate) {
  const { data, error } = await supabase.from("branches").update(branch).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating branch: ${error.message}`)
  }

  return data
}

export async function deleteBranch(id: string) {
  const { error } = await supabase.from("branches").delete().eq("id", id)

  if (error) {
    throw new Error(`Error deleting branch: ${error.message}`)
  }

  return true
}
