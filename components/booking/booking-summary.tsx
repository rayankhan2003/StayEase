import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";
import type { Room } from "@/lib/api/rooms";

interface BookingSummaryProps {
  room: Room | null;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
}

export function BookingSummary({
  room,
  checkIn,
  checkOut,
  nights,
  guests,
}: BookingSummaryProps) {
  // Calculate costs
  const roomRate = room ? Number(room.price) : 0;
  const subtotal = roomRate * nights;
  const tax = subtotal * 0.12; // Assuming 12% tax
  const total = subtotal + tax;

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="p-6 border-b border-[#333]">
        <h2 className="text-xl font-bold text-white">Booking Summary</h2>
        <p className="text-sm text-gray-400 mt-1">
          Review your booking details
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {room ? (
            <>
              <div>
                <h3 className="text-lg font-medium capitalize text-white">
                  {room.type} Room
                </h3>
                <p className="text-sm text-gray-400">Room {room.number}</p>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {format(checkIn, "EEE, MMM d, yyyy")} -{" "}
                    {format(checkOut, "EEE, MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {nights} night{nights > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-white">
                  {guests} guest{guests > 1 ? "s" : ""}
                </p>
              </div>

              <div className="border-t border-[#333] pt-4"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-300">Room rate</p>
                  <p className="text-sm text-gray-300">
                    ${roomRate} × {nights} nights
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-300">Subtotal</p>
                  <p className="text-sm text-gray-300">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-300">Taxes & fees (12%)</p>
                  <p className="text-sm text-gray-300">${tax.toFixed(2)}</p>
                </div>
                <div className="border-t border-[#333] pt-2 mt-2"></div>
                <div className="flex justify-between font-medium">
                  <p className="text-white">Total</p>
                  <p className="text-white">${total.toFixed(2)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400">
                Select a room to see booking details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
