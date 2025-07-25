"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "@/lib/api/branches"
import type { BranchInsert, BranchUpdate } from "@/lib/api/branches"

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
  })
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => getBranchById(id),
    enabled: !!id,
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (branch: BranchInsert) => createBranch(branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, branch }: { id: string; branch: BranchUpdate }) => updateBranch(id, branch),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      queryClient.invalidateQueries({ queryKey: ["branches", variables.id] })
    },
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
  })
}
