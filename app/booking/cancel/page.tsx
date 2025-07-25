"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BookingCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const cancelBooking = async () => {
      if (!bookingId) {
        setError("Booking ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        // Update booking status to cancelled
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            status: "cancelled",
            payment_status: "cancelled",
          })
          .eq("id", bookingId);

        if (updateError) {
          throw new Error("Failed to cancel booking");
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("Error cancelling booking:", err);
        setError(err.message || "Failed to cancel booking");
        setIsLoading(false);
      }
    };

    cancelBooking();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-bold text-white">
          Processing your cancellation...
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
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Booking Cancelled</h2>
          <p className="text-gray-400">Your payment was not processed</p>
        </div>

        <p className="text-center mb-6">
          Your booking has been cancelled. No payment has been processed.
        </p>

        <div className="space-y-3">
          <Button
            className="w-full bg-primary"
            onClick={() => router.push("/booking")}
          >
            Try Again
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
