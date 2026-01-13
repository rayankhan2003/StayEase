"use client";

import { useSearchParams, usePathname } from "next/navigation";
import BookRoomForm from "@/components/booking/book-room-form";
import { useRoom } from "@/hooks/use-rooms";
import { RoomImagePreview } from "@/components/dashboard/rooms/room-image-preview";

export default function BookRoomPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const roomId = pathname.split("/").pop() ?? "";

  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const branchId = searchParams.get("branchId") ?? "";

  const { data: room, isLoading, isError } = useRoom(roomId);

  if (isLoading)
    return <div className="text-white text-center py-10">Loading...</div>;
  if (isError || !room)
    return (
      <div className="text-red-400 text-center py-10">Room not found.</div>
    );
  const images = room.image_urls ?? [];

  return (
    <div className="bg-neutral-950">
      <div className="max-w-3xl mx-auto px-6 py-14 text-white min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-center">Book Your Room</h1>
        <RoomImagePreview images={images} />
        <BookRoomForm
          room={room}
          roomId={roomId}
          branchId={branchId}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      </div>
    </div>
  );
}
