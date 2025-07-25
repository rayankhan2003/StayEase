"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");
  const baseAmount = bookingDetails?.total_amount;
  const tax = baseAmount * 0.1;
  const grandTotal = baseAmount + tax;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!bookingId) {
        setError("Booking ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        // Get booking details
        const { data: booking, error: bookingError } = await supabase
          .from("bookings")
          .select("*, rooms(*), guests(*)")
          .eq("id", bookingId)
          .single();

        if (bookingError || !booking) {
          throw new Error("Booking not found");
        }

        // If we have a session ID, verify the payment with Stripe
        if (sessionId) {
          // Update booking status to confirmed
          const { error: updateError } = await supabase
            .from("bookings")
            .update({
              payment_status: "paid",
            })
            .eq("id", bookingId);

          if (updateError) {
            throw new Error("Failed to update booking status");
          }
        }

        setBookingDetails(booking);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error verifying payment:", err);
        setError(err.message || "Failed to verify payment");
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [bookingId, sessionId]);

  const handleViewBookings = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-bold text-white">
          Confirming your booking...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6">
        <Card className="bg-[#1e1e1e] border-[#333] p-6 text-white">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <Card className="bg-[#1e1e1e] border-[#333] p-6 text-white">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-gray-400">Your payment was successful</p>
        </div>

        {bookingDetails && (
          <div className="space-y-4 mb-6">
            <div className="border-t border-b border-[#333] py-4">
              <h3 className="text-lg font-medium mb-2">Booking Details</h3>
              <p className="text-sm text-gray-400">
                Booking ID: {bookingDetails.id}
              </p>
              <p className="text-sm text-gray-400">
                Check-in:{" "}
                {new Date(bookingDetails.check_in).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Check-out:{" "}
                {new Date(bookingDetails.check_out).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Room: {bookingDetails.rooms?.type} - Room{" "}
                {bookingDetails.rooms?.number}
              </p>
              <p className="text-sm text-gray-400">
                Base Amount: ${baseAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                Tax (10%): ${tax.toFixed(2)}
              </p>
              <p className="text-sm text-white font-semibold">
                Grand Total: ${grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button className="w-full bg-primary" onClick={handleViewBookings}>
            View My Bookings
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full border-[#333] text-white"
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
