"use client";

import { Button } from "@/components/ui/button";
import { Check, Users, Wifi } from "lucide-react";
import type { Room } from "@/lib/api/rooms";
import type { JSX } from "react";

interface RoomCardProps {
  room: Room;
  nights: number;
  onSelect: () => void;
}

export function RoomCard({ room, nights, onSelect }: RoomCardProps) {
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi className="h-4 w-4 text-primary" />,
    tv: <Check className="h-4 w-4 text-primary" />,
    ac: <Check className="h-4 w-4 text-primary" />,
    minibar: <Check className="h-4 w-4 text-primary" />,
    ocean_view: <Check className="h-4 w-4 text-primary" />,
  };

  // PKR total calculation
  const totalPrice = Number(room.price) * nights;
  // ✅ FIX: normalize nullable array
  const images: string[] = room.image_urls ?? [];
  return (
    <div className="border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* ROOM IMAGE */}
        <div className="relative h-48 md:h-full">
          <img
            src={images[0] || "/room-placeholder.jpg"}
            alt={`${room.type} Room`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* ROOM INFO */}
        <div className="p-6 md:col-span-2">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold capitalize text-white">
                  {room.type} Room
                </h3>
                <span className="px-2 py-1 text-xs rounded bg-[#333] text-gray-300">
                  Room {room.number}
                </span>
              </div>

              <div className="mt-2 flex items-center text-sm text-gray-400">
                <Users className="mr-1 h-4 w-4" />
                <span>Max {room.max_guests} Guests</span>
              </div>

              <div className="my-4 border-t border-[#333]" />

              <div className="grid grid-cols-2 gap-2">
                {room.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center text-sm text-gray-300"
                  >
                    {amenityIcons[amenity] || (
                      <Check className="mr-1 h-4 w-4 text-primary" />
                    )}
                    <span className="ml-1 capitalize">
                      {amenity.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white">
                  PKR {room.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400"> / night</span>

                <p className="text-sm text-gray-400">
                  PKR {totalPrice.toLocaleString()} total for {nights} night
                  {nights > 1 ? "s" : ""}
                </p>
              </div>

              <Button
                onClick={onSelect}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
