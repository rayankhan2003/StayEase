import React from "react";
import { Card } from "../ui/card";
import type { Room } from "@/lib/api/rooms";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

const SearchRoomCard = ({ room }: { room: Room }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const branchId = room.branch_id;

  // ✅ FIX: normalize nullable array
  const images: string[] = room.image_urls ?? [];

  const handleBookNow = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (branchId) params.set("branchId", branchId);

    router.push(`/book/${room.id}?${params.toString()}`);
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#333] overflow-hidden text-white">
      <div className="flex flex-col md:flex-row">
        {/* IMAGE */}
        <div className="md:w-64 h-48 bg-black">
          <img
            src={images[0] || "/room-placeholder.jpg"}
            alt={`Room ${room.number}`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Room #{room.number} - {room.type}
            </h2>

            <p className="text-sm text-gray-400">
              Max Guests: {room.max_guests}
            </p>

            <p className="text-sm text-gray-400">
              Price per night: PKR {room.price.toLocaleString()}
            </p>

            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-white">
                {room.amenities.map((a) => (
                  <Badge key={a} variant="outline" className="text-white">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Button onClick={handleBookNow}>Book Now</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SearchRoomCard;
