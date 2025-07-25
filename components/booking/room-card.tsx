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
  // Format amenities for display
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi className="h-4 w-4 text-primary" />,
    tv: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
        <polyline points="17 2 12 7 7 2"></polyline>
      </svg>
    ),
    ac: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v2m8-2v2M8 20v2m8-2v2M2 8h2m-2 8h2M20 8h2m-2 8h2M8 8v8m8-8v8M8 8h8M8 16h8"></path>
      </svg>
    ),
    minibar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2h8m-8 20h8M6 4h12v16H6z"></path>
        <path d="M12 7v10"></path>
      </svg>
    ),
    ocean_view: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 16.5l2-2 3 3 3-3 2 2"></path>
        <path d="M3 12.5l2-2 3 3 3-3 2 2"></path>
        <path d="M3 8.5l2-2 3 3 3-3 2 2"></path>
      </svg>
    ),
  };

  // Get room image based on type
  const getRoomImage = (type: string) => {
    switch (type) {
      case "standard":
        return "/images/standard-room.jpg";
      case "deluxe":
        return "/images/deluxe-room.jpg";
      case "executive":
        return "/images/executive-suite.jpg";
      case "suite":
        return "/images/suite.jpg";
      case "presidential":
        return "/images/presidential-suite.jpg";
      default:
        return "/images/standard-room.jpg";
    }
  };

  // Calculate total price
  const totalPrice = Number(room.price) * nights;

  return (
    <div className="border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="relative h-48 md:h-full">
          <img
            src={getRoomImage(room.type) || "/placeholder.svg"}
            alt={`${room.type} Room`}
            className="h-full w-full object-cover"
          />
        </div>
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

              <div className="my-4 border-t border-[#333]"></div>

              <div className="grid grid-cols-2 gap-2">
                {room.amenities &&
                  room.amenities.map((amenity) => (
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

            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white">
                  ${room.price}
                </span>
                <span className="text-sm text-gray-400"> / night</span>
                <p className="text-sm text-gray-400">
                  ${totalPrice} total for {nights} night{nights > 1 ? "s" : ""}
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
