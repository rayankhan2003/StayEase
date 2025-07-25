import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { Room } from "./rooms";
import {
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
} from "date-fns";
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export async function getBookings(filterStatus?: string, branchId?: string) {
  let query = supabase.from("bookings").select(`
        *,
        guests:guest_id(id, name, email),
        rooms:room_id(id, number, type),
        branches:branch_id(id, name)
      `);

  if (filterStatus) {
    query = query.eq("status", filterStatus);
  }

  if (branchId) {
    query = query.eq("branch_id", branchId);
  }

  const { data, error } = await query.order("check_in", { ascending: false });

  if (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }

  return data;
}

export async function getBookingById(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      guests:guest_id(id, name, email),
      rooms:room_id(id, number, type, price),
      branches:branch_id(id, name)
    `,
    )
    .eq("id", id)
    .maybeSingle(); // ✅ returns `null` instead of throwing on no result

  if (error) {
    console.error("Supabase error:", error); // ✅ log error for debugging
    throw new Error(`Error fetching booking: ${error.message}`);
  }

  return data;
}

export async function createBooking(booking: BookingInsert) {
  // 1. Check for overlaps
  const { data: conflicts, error: overlapError } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", booking.room_id)
    .not("status", "eq", "past")
    .lt("check_in", booking.check_out)
    .gt("check_out", booking.check_in);

  if (overlapError) {
    console.error("overlapError", overlapError);
    throw new Error(`Error checking overlap: ${overlapError.message}`);
  }

  if (conflicts && conflicts.length > 0) {
    throw new Error("Room is already booked for the selected dates.");
  }
  console.log("booking ", booking);
  // 2. Calculate status
  const today = new Date().toISOString().split("T")[0];
  console.log("today", today);

  // 2. Calculate status based on check-in
  const checkInDate = parseISO(booking.check_in);
  const checkOutDate = parseISO(booking.check_out);
  const todayDate = new Date();

  let status: "past" | "current" | "upcoming" = "upcoming";

  if (isSameDay(checkInDate, todayDate)) {
    status = "current";
  } else if (isBefore(checkInDate, todayDate)) {
    status = "past";
  } else if (isAfter(checkInDate, todayDate)) {
    status = "upcoming";
  }

  console.log("status", status);
  console.log("checkInDate", checkInDate);
  console.log("checkOutDate", checkOutDate);

  const nights = differenceInCalendarDays(checkOutDate, checkInDate);
  console.log("checkInDate", checkInDate);
  console.log("checkOutDate", checkOutDate);
  console.log("nights", nights);

  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date.");
  }

  // 4. Get room price
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("price")
    .eq("id", booking.room_id)
    .single();

  if (roomError || !room) {
    throw new Error(`Failed to fetch room price: ${roomError?.message}`);
  }

  const totalAmount = nights * room.price;

  // 5. Create booking
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...booking,
      status,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating booking: ${error.message}`);
  }

  return data;
}

export async function updateBooking(id: string, booking: BookingUpdate) {
  const { status, ...safeBooking } = booking;
  console.log(safeBooking);
  const { data, error } = await supabase
    .from("bookings")
    .update(safeBooking)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating booking: ${error.message}`);
  }

  return data;
}

export async function deleteBooking(id: string) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting booking: ${error.message}`);
  }

  return true;
}

// get rooms by branch id
export async function getRoomsByBranch(branchId: string): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("branch_id", branchId);

  if (error) {
    console.error("Error fetching rooms by branch:", error);
    throw new Error(error.message);
  }

  return data;
}
