"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGuest,
  deleteGuest,
  getGuestById,
  getGuests,
  updateGuest,
} from "@/lib/api/guests";
import type { GuestInsert, GuestUpdate } from "@/lib/api/guests";
import { useAuth } from "@/components/auth-provider";

export function useGuests() {
  const { isEmployee, userBranchId } = useAuth();

  return useQuery({
    queryKey: ["guests", { userBranchId }],
    queryFn: () =>
      getGuests(isEmployee ? userBranchId ?? undefined : undefined),
    enabled: !isEmployee || !!userBranchId, // wait until branch is available
  });
}

export function useGuest(id: string) {
  return useQuery({
    queryKey: ["guests", id],
    queryFn: () => getGuestById(id),
    enabled: !!id,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guest: GuestInsert) => createGuest(guest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, guest }: { id: string; guest: GuestUpdate }) =>
      updateGuest(id, guest),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guests", variables.id] });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGuest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}
