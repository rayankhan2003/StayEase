"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "@/lib/api/rooms";
import type { RoomInsert, RoomUpdate } from "@/lib/api/rooms";
import { getRoomsByBranch } from "@/lib/api/bookings";
import { useAuth } from "@/components/auth-provider";

export function useRooms(filterStatus?: string) {
  const { isEmployee, userBranchId } = useAuth();

  return useQuery({
    queryKey: ["rooms", { filterStatus, userBranchId }],
    queryFn: () =>
      getRooms(
        filterStatus,
        isEmployee ? userBranchId ?? undefined : undefined,
      ),
    enabled: !isEmployee || !!userBranchId, // wait for branchId if employee
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (room: RoomInsert) => createRoom(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, room }: { id: string; room: RoomUpdate }) =>
      updateRoom(id, room),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.id] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// get rooms by branch

export function useRoomsByBranch(branchId?: string) {
  return useQuery({
    queryKey: ["rooms", "byBranch", branchId],
    queryFn: () => getRoomsByBranch(branchId!),
    enabled: !!branchId,
  });
}

export function useFilteredRooms(filters: {
  filterStatus?: string;
  branchId?: string;
  roomType?: string;
  guests?: string;
}) {
  return useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => getRooms(undefined, undefined, filters),
    enabled: true,
  });
}
