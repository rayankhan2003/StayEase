import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];
export type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"];

export async function getRooms(
  filterStatus?: string,
  branchId?: string,
  filters?: {
    filterStatus?: string;
    branchId?: string;
    roomType?: string;
    guests?: string;
  },  
  page = 1,
  pageSize = 8
) {
  try { 
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
      .from("rooms")
      .select("* , branches:branch_id (id, name)", { count: "exact" })
       .range(from, to);

    if (filters?.filterStatus) {
      query = query.eq("status", filters?.filterStatus);
    }

    if (filters?.branchId) {
      query = query.eq("branch_id", filters?.branchId);
    }

    if (filters?.roomType && filters?.roomType !== "any") {
      query = query.ilike("type", filters?.roomType);
    }
    if (filters?.branchId) {
      query = query.eq("branch_id", filters?.branchId);
    }
    if (filters?.guests) {
      query = query.gte("max_guests", parseInt(filters?.guests));
    }
    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }

    if (branchId) {
      query = query.eq("branch_id", branchId);
    }
    const { data, error , count } = await query.order("number");

    if (error) throw new Error(`Error fetching rooms: ${error.message}`);
    return {data , count };
  } catch (err) {
    console.error("Exception in getRooms:", err);
    throw err;
  }
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase.from("rooms").select("*").eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching room: ${error.message}`);
  }

  return data;
}

export async function createRoom(room: RoomInsert) {
  const { data, error } = await supabase.from("rooms").insert(room).select()
    .single();

  if (error) {
    throw new Error(`Error creating room: ${error.message}`);
  }

  return data;
}

export async function updateRoom(id: string, room: RoomUpdate) {
  const { data, error } = await supabase.from("rooms").update(room).eq("id", id)
    .select().single();

  if (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }

  return data;
}

export async function deleteRoom(id: string) {
  const { error } = await supabase.from("rooms").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }

  return true;
}
