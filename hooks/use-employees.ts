"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeeByUserId,
  getEmployees,
  updateEmployee,
} from "@/lib/api/employees";
import type { EmployeeInsert, EmployeeUpdate } from "@/lib/api/employees";
import { useAuth } from "@/components/auth-provider";

export function useEmployees() {
  const { user, isAdmin, isEmployee, userBranchId } = useAuth();

  return useQuery({
    queryKey: ["employees", {
      role: isAdmin ? "admin" : "employee",
      branchId: { userBranchId },
    }],
    queryFn: () =>
      getEmployees(isAdmin ? "admin" : "employee", userBranchId ?? undefined),
    enabled: !!user, // wait until user is available
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });
}

export function useEmployeeByUserId(userId: string) {
  return useQuery({
    queryKey: ["employees", "user", userId],
    queryFn: () => getEmployeeByUserId(userId),
    enabled: !!userId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: EmployeeInsert) => createEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employee }: { id: string; employee: EmployeeUpdate }) =>
      updateEmployee(id, employee),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
