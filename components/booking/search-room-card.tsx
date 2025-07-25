import React from "react";
import { Card } from "../ui/card";
import { Room } from "@/lib/api/rooms";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

const SearchRoomCard = ({ room }: { room: Room }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const branchId = room.branch_id;

  const handleBookNow = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (branchId) params.set("branchId", branchId);

    router.push(`/book/${room.id}?${params.toString()}`);
  };
  return (
    <Card key={room.id} className="bg-[#1e1e1e] border-[#333] p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Room #{room.number} - {room.type}
          </h2>
          <p className="text-sm text-gray-400">Max Guests: {room.max_guests}</p>
          <p className="text-sm text-gray-400">
            Price per night: ${room.price}
          </p>
          {room.amenities && room.amenities?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-white">
              {room.amenities.map((a: string) => (
                <Badge key={a} variant="outline" className="text-white">
                  {a}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-end">
          <Button
            className="bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchRoomCard;
