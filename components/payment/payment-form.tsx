"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe-client";
import { Loader2 } from "lucide-react";
import type { Room } from "@/lib/api/rooms";

interface PaymentFormProps {
  room: Room;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  guestDetails: any;
}

export function PaymentForm({
  room,
  checkIn,
  checkOut,
  nights,
  guests,
  guestDetails,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate costs
  const roomRate = Number(room.price);
  const subtotal = roomRate * nights;
  const tax = subtotal * 0.12; // Assuming 12% tax
  const totalAmount = subtotal + tax;

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await createCheckoutSession({
        roomId: room.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guestDetails,
        nights,
        totalAmount,
      });
    } catch (err) {
      setError("Failed to process payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#1e1e1e] border border-[#333] rounded-lg">
        <h3 className="text-lg font-medium text-white">Payment Method</h3>
        <p className="mt-2 text-sm text-gray-400">
          Your payment will be processed securely via Stripe
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <img src="/images/visa.svg" alt="Visa" className="h-8" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-8" />
          <img src="/images/amex.svg" alt="American Express" className="h-8" />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-900/50 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay PKR ${totalAmount.toLocaleString()}`
        )}
      </Button>
    </div>
  );
}
