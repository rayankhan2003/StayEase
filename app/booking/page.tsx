"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useFilteredRooms } from "@/hooks/use-rooms";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { Button } from "@/components/ui/button";
import SearchRoomCard from "@/components/booking/search-room-card";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const checkInRaw = searchParams.get("checkIn");
  const checkOutRaw = searchParams.get("checkOut");

  const checkIn = checkInRaw ? new Date(checkInRaw) : undefined;
  const checkOut = checkOutRaw ? new Date(checkOutRaw) : undefined;
  const guests = searchParams.get("guests") || undefined;
  const roomType = searchParams.get("roomType") || undefined;
  const branchId = searchParams.get("branchId") || undefined;

  if (!branchId) {
  }
  const {
    data: rooms,
    isLoading,
    isError,
  } = useFilteredRooms({
    filterStatus: "available",
    guests,
    roomType,
    branchId,
  });

  return (
    <div className="bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-12  text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Find Your Room</h1>

        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg mb-10">
          <BookingSearchForm
            defaultValues={{
              checkIn,
              checkOut,
              guests,
              roomType,
              branchId,
            }}
          />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>

          <div className="mb-6 flex flex-wrap gap-4">
            {checkIn && (
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                Check-in: {checkIn.toDateString()}
              </Badge>
            )}
            {checkOut && (
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                Check-out: {checkOut.toDateString()}
              </Badge>
            )}
            {guests && (
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {guests} Guest(s)
              </Badge>
            )}
            {roomType && roomType !== "any" && (
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                Room Type: {roomType}
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-full rounded-lg bg-neutral-800"
                />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-400">
              Failed to load rooms. Please try again later.
            </p>
          ) : rooms?.length === 0 ? (
            <p className="text-gray-500">
              No rooms found matching your criteria.
            </p>
          ) : (
            <div className="space-y-8">
              {rooms?.map((room) => (
                <SearchRoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
