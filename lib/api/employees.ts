import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export type Employee = Database["public"]["Tables"]["employees"]["Row"];
export type EmployeeInsert =
  Database["public"]["Tables"]["employees"]["Insert"];
export type EmployeeUpdate =
  Database["public"]["Tables"]["employees"]["Update"];

export async function getEmployees(userRole: string, userBranchId?: string) {
  let query = supabase
    .from("employees")
    .select(`
      *,
      branches:branch_id(id, name)
    `);

  if (userRole === "employee") {
    query = query.eq("role", "employee");

    if (userBranchId) {
      query = query.eq("branch_id", userBranchId);
    }
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function getEmployeeById(id: string) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      *,
      branches:branch_id(id, name)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching employee: ${error.message}`);
  }

  return data;
}

export async function getEmployeeByUserId(userId: string) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      *,
      branches:branch_id(id, name)
    `,
    )
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGSQL_ERROR_NO_DATA") {
    throw new Error(`Error fetching employee: ${error.message}`);
  }

  return data;
}

export async function createEmployee(employee: EmployeeInsert) {
  const { data, error } = await supabase
    .from("employees")
    .insert(employee)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating employee: ${error.message}`);
  }

  return data;
}

export async function updateEmployee(id: string, employee: EmployeeUpdate) {
  const { data, error } = await supabase
    .from("employees")
    .update(employee)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating employee: ${error.message}`);
  }

  return data;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting employee: ${error.message}`);
  }

  return true;
}
