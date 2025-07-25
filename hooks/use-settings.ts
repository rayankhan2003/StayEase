"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSettings, updateSettings } from "@/lib/api/settings"
import type { SettingsUpdate } from "@/lib/api/settings"

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, settings }: { id: string; settings: SettingsUpdate }) => updateSettings(id, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
