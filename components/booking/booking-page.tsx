"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, addDays, differenceInDays } from "date-fns";
import { useRooms } from "@/hooks/use-rooms";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/components/booking/booking-form";
import { RoomCard } from "@/components/booking/room-card";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Loader2 } from "lucide-react";
import type { Room } from "@/lib/api/rooms";
import { PaymentForm } from "@/components/payment/payment-form";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [step, setStep] = useState("select-room");
  const [guestDetails, setGuestDetails] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: searchParams.get("checkIn")
      ? new Date(searchParams.get("checkIn") as string)
      : addDays(new Date(), 1),
    checkOut: searchParams.get("checkOut")
      ? new Date(searchParams.get("checkOut") as string)
      : addDays(new Date(), 3),
    guests: Number.parseInt(searchParams.get("guests") || "2", 10),
    roomType: searchParams.get("roomType") || "",
  });

  const { data: rooms = [], isLoading } = useRooms(
    bookingDetails.roomType || undefined
  );

  // Filter available rooms
  const availableRooms = rooms.filter((room) => room.status === "available");

  // Calculate nights
  const nights = differenceInDays(
    bookingDetails.checkOut,
    bookingDetails.checkIn
  );

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setStep("guest-details");
  };

  const handleBackToRooms = () => {
    setStep("select-room");
  };

  const handleProceedToPayment = (details: any) => {
    setGuestDetails(details);
    setStep("payment");
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="bg-[#1a1a1a] border-b border-[#333]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Book Your Stay</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a1a1a]">
              <TabsTrigger
                value="select-room"
                disabled={step !== "select-room"}
                className="data-[state=active]:bg-[#2a2a2a] text-white"
              >
                1. Select Room
              </TabsTrigger>
              <TabsTrigger
                value="guest-details"
                disabled={step !== "guest-details" && step !== "payment"}
                className="data-[state=active]:bg-[#2a2a2a] text-white"
              >
                2. Guest Details
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={step !== "payment"}
                className="data-[state=active]:bg-[#2a2a2a] text-white"
              >
                3. Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === "select-room" && (
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="p-6 border-b border-[#333]">
                  <h2 className="text-xl font-bold text-white">
                    Available Rooms
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(bookingDetails.checkIn, "PPP")} -{" "}
                    {format(bookingDetails.checkOut, "PPP")} · {nights} night
                    {nights > 1 ? "s" : ""} · {bookingDetails.guests} guest
                    {bookingDetails.guests > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : availableRooms.length > 0 ? (
                    <div className="space-y-6">
                      {availableRooms.map((room) => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          nights={nights}
                          onSelect={() => handleRoomSelect(room)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                      <p className="text-lg font-medium text-white">
                        No rooms available for your selected dates
                      </p>
                      <p className="text-gray-400">
                        Try different dates or room types
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === "guest-details" && selectedRoom && (
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="p-6 border-b border-[#333]">
                  <h2 className="text-xl font-bold text-white">
                    Guest Details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Please provide your information to complete the booking
                  </p>
                </div>
                <div className="p-6">
                  <BookingForm onSubmit={handleProceedToPayment} />
                </div>
                <div className="p-6 border-t border-[#333] flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBackToRooms}
                    className="border-[#333] text-white hover:bg-[#2a2a2a] hover:text-white"
                  >
                    Back to Rooms
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && selectedRoom && guestDetails && (
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="p-6 border-b border-[#333]">
                  <h2 className="text-xl font-bold text-white">Payment</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Complete your booking by making a secure payment
                  </p>
                </div>
                <div className="p-6">
                  <PaymentForm
                    room={selectedRoom}
                    checkIn={bookingDetails.checkIn}
                    checkOut={bookingDetails.checkOut}
                    nights={nights}
                    guests={bookingDetails.guests}
                    guestDetails={guestDetails}
                  />
                </div>
                <div className="p-6 border-t border-[#333]">
                  <Button
                    variant="outline"
                    onClick={() => setStep("guest-details")}
                    className="w-full border-[#333] text-white hover:bg-[#2a2a2a] hover:text-white"
                  >
                    Back to Guest Details
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              room={selectedRoom}
              checkIn={bookingDetails.checkIn}
              checkOut={bookingDetails.checkOut}
              nights={nights}
              guests={bookingDetails.guests}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
