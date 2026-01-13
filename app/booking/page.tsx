"use client";

import { useSearchParams } from "next/navigation";
import { useFilteredRooms } from "@/hooks/use-rooms";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingSearchForm } from "@/components/booking/booking-search-form";
import { Button } from "@/components/ui/button";
import SearchRoomCard from "@/components/booking/search-room-card";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const searchParams = useSearchParams();

  const checkInRaw = searchParams.get("checkIn");
  const checkOutRaw = searchParams.get("checkOut");

  const checkIn = checkInRaw ? new Date(checkInRaw) : undefined;
  const checkOut = checkOutRaw ? new Date(checkOutRaw) : undefined;
  const guests = searchParams.get("guests") || undefined;
  const roomType = searchParams.get("roomType") || undefined;
  const branchId = searchParams.get("branchId") || undefined;

  const [page, setPage] = useState(1);
  const pageSize = 6;

  // ✅ Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [guests, roomType, branchId]);

  const { data, isLoading, isError } = useFilteredRooms(
    {
      filterStatus: "available",
      guests,
      roomType,
      branchId,
    },
    page
  );

  const rooms = data?.data ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-[#0b0f14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/40 via-neutral-900 to-black">
      <div className="mx-auto max-w-6xl px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Find Your Room</h1>

        {/* Search Form */}
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

          {/* Filters badges */}
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

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32 w-full rounded-lg bg-neutral-800"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <p className="text-red-400">
              Failed to load rooms. Please try again later.
            </p>
          )}

          {/* No rooms */}
          {!isLoading && !isError && rooms.length === 0 && (
            <p className="text-gray-500">
              No rooms found matching your criteria.
            </p>
          )}

          {/* Rooms list */}
          {!isLoading && !isError && rooms.length > 0 && (
            <>
              <div className="space-y-8">
                {rooms.map((room) => (
                  <SearchRoomCard key={room.id} room={room} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
