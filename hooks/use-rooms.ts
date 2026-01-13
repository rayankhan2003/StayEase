"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "@/lib/api/rooms";
import type { Room, RoomInsert, RoomUpdate } from "@/lib/api/rooms";
import { getRoomsByBranch } from "@/lib/api/bookings";
import { useAuth } from "@/components/auth-provider";

export function useRooms(filterStatus?: string) {
  const { isEmployee, userBranchId } = useAuth();

  return useQuery({
    queryKey: ["rooms", { filterStatus, userBranchId }],
    queryFn: async () => {
      const res = await getRooms(
        filterStatus,
        isEmployee ? userBranchId ?? undefined : undefined
      );

      // 🔑 normalize response
      if (Array.isArray(res)) return res;
      if ("data" in res) return res.data;

      return [];
    },
    enabled: !isEmployee || !!userBranchId,
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

  return useMutation<Room, Error, RoomInsert>({
    mutationFn: (room) => createRoom(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}


export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation<Room, Error, { id: string; room: RoomUpdate }>({
    mutationFn: ({ id, room }) => updateRoom(id, room),
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
} , page : number) {
  return useQuery({
    queryKey: ["rooms", filters , page],
    queryFn: () => getRooms(undefined, undefined, filters , page),
    enabled: true,
  });
}
