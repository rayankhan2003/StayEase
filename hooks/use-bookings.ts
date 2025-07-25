"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
} from "@/lib/api/bookings";
import type { BookingInsert, BookingUpdate } from "@/lib/api/bookings";
import { useAuth } from "@/components/auth-provider";

export function useBookings(filterStatus?: string) {
  const { isEmployee, userBranchId } = useAuth();

  return useQuery({
    queryKey: ["bookings", { filterStatus, userBranchId }],
    queryFn: () =>
      getBookings(
        filterStatus,
        isEmployee ? userBranchId ?? undefined : undefined,
      ),
    enabled: !isEmployee || !!userBranchId, // wait for userBranchId if employee
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingInsert) => createBooking(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, booking }: { id: string; booking: BookingUpdate }) =>
      updateBooking(id, booking),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
