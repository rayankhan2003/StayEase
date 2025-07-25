import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Settings = Database["public"]["Tables"]["settings"]["Row"]
export type SettingsUpdate = Database["public"]["Tables"]["settings"]["Update"]

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single()

  if (error) {
    throw new Error(`Error fetching settings: ${error.message}`)
  }

  return data
}

export async function updateSettings(id: string, settings: SettingsUpdate) {
  const { data, error } = await supabase.from("settings").update(settings).eq("id", id).select().single()

  if (error) {
    throw new Error(`Error updating settings: ${error.message}`)
  }

  return data
}
