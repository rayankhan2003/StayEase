"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateBooking } from "@/hooks/use-bookings";
import { supabase } from "@/lib/supabase";

export default function CheckoutRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createBooking = useCreateBooking();

  const [roomData, setRoomData] = useState<{
    price: number;
    number: string;
    branch_id: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roomId = searchParams.get("roomId");
  const guestId = searchParams.get("guestId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const paymentMethod = searchParams.get("paymentMethod") || "online";
  const isCash = paymentMethod === "cash";

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const nights =
    checkInDate && checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const taxRate = 0.1;

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setError("Missing room ID.");
        return;
      }

      const { data, error } = await supabase
        .from("rooms")
        .select("price, number, branch_id")
        .eq("id", roomId)
        .single();

      if (error || !data) {
        setError("Room not found.");
      } else {
        setRoomData({
          price: data.price,
          number: data.number,
          branch_id: data.branch_id,
        });
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleCheckout = async () => {
    if (!roomId || !guestId || !checkIn || !checkOut || !roomData) {
      setError("Missing booking details.");
      return;
    }

    setIsLoading(true);

    const totalAmount = roomData.price * nights;
    const tax = totalAmount * taxRate;
    const grandTotal = totalAmount + tax;

    if (isCash) {
      try {
        const booking = await createBooking.mutateAsync({
          guest_id: guestId,
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          branch_id: roomData.branch_id,
          payment_method: "cash",
          payment_status: "pending",
          total_amount: grandTotal,
          status: "upcoming",
        });

        router.push(`/booking/success?booking_id=${booking.id}&cash=true`);
      } catch (err: any) {
        setError(err.message || "Failed to confirm booking.");
        setIsLoading(false);
      }
      return;
    }
    console.log("hello");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          guestDetails: { guestId },
          nights: nights,
          totalAmount: grandTotal,
        }),
      });

      const data = await response.json();
      if (response.ok && data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleCancel = () => router.back();

  const totalAmount = (roomData?.price ?? 0) * nights;
  const taxAmount = totalAmount * taxRate;
  const grandTotal = totalAmount + taxAmount;

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <Card className="bg-[#1e1e1e] border-[#333] p-6 text-white">
        <div className="border-b border-[#333] pb-4 mb-4">
          <h2 className="text-xl font-bold">Invoice Summary</h2>
          <p className="text-sm text-gray-400">
            Booking for Room {roomData?.number || roomId}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <div className="flex justify-between">
            <span>Total nights</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between">
            <span>Room Price</span>
            <span>${roomData?.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Room Price × {nights} night(s)</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Payment Method</h3>
          <p className="text-sm text-gray-400 mb-4">
            {isCash
              ? "Payment to be made in person (Cash)"
              : "Secure payment powered by Stripe"}
          </p>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white mb-3 h-12"
          onClick={handleCheckout}
          disabled={isLoading || !roomData?.price}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isCash ? "Saving..." : "Redirecting..."}
            </>
          ) : (
            <>
              {isCash
                ? `Confirm Booking ($${grandTotal.toFixed(2)})`
                : `Continue to Payment ($${grandTotal.toFixed(2)})`}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full border-[#333] text-white"
        >
          Back to Guest Details
        </Button>
      </Card>
    </div>
  );
}
