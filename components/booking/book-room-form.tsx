"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatISO } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateBooking } from "@/hooks/use-bookings";
import { findGuestByEmail, GuestInsert } from "@/lib/api/guests";
import { useCreateGuest } from "@/hooks/use-guests";
import { Room } from "@/lib/api/rooms";

// Schema validation
const guestFormSchema = z.object({
  name: z.string().min(1, "Guest name is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  paymentMethod: z.enum(["cash", "online"]),
  checkIn: z.string().min(1, "Check-in date is required."),
  checkOut: z.string().min(1, "Check-out date is required."),
});

const formatDateForInput = (isoDate: string) => {
  try {
    return new Date(isoDate).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

type Props = {
  roomId: string;
  branchId: string;
  checkIn?: string;
  checkOut?: string;
  room: Room;
};

export default function BookRoomForm({
  roomId,
  branchId,
  checkIn,
  checkOut,
  room,
}: Props) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const createGuest = useCreateGuest();

  // Initial states from URL (converted to YYYY-MM-DD)
  const [localCheckIn, setLocalCheckIn] = useState(
    formatDateForInput(checkIn ?? "")
  );
  const [localCheckOut, setLocalCheckOut] = useState(
    formatDateForInput(checkOut ?? "")
  );
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const handleSubmit = async () => {
    const validation = guestFormSchema.safeParse({
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      paymentMethod,
      totalAmount: room.price,
      checkIn: localCheckIn,
      checkOut: localCheckOut,
    });
    if (!validation.success) {
      console.log("errro", validation.error);
    }

    try {
      let guest = await findGuestByEmail(guestEmail);

      if (!guest) {
        const guestData: GuestInsert = {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          visits: 0,
          total_spent: 0,
          preferences: [],
          branch_id: branchId,
        };
        guest = await createGuest.mutateAsync(guestData);
      }
      if (paymentMethod === "online") {
        const query = new URLSearchParams({
          roomId,
          checkIn: localCheckIn,
          checkOut: localCheckOut,
          guestId: guest.id,
          totalAmount: room.price.toString(),
          nights: "1",
        }).toString();

        toast.success("Redirecting to checkout...");
        router.push(`/checkout?${query}`);
        return;
      } else {
        const query = new URLSearchParams({
          roomId,
          checkIn: localCheckIn,
          checkOut: localCheckOut,
          guestId: guest.id,
          paymentMethod: "cash",
        }).toString();
        router.push(`/checkout?${query}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6 bg-neutral-900 p-6 rounded-xl shadow-md"
    >
      <div>
        <Label className="text-gray-300">Guest Names</Label>
        <Input
          placeholder="John Doe"
          className="bg-neutral-800 text-white border-gray-700"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-gray-300">Guest Email</Label>
        <Input
          type="email"
          placeholder="john@example.com"
          className="bg-neutral-800 text-white border-gray-700"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-gray-300">Phone (optional)</Label>
        <Input
          type="tel"
          placeholder="+92 312 3456789"
          className="bg-neutral-800 text-white border-gray-700"
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-gray-300">Check-in</Label>
        <Input
          type="date"
          value={localCheckIn}
          onChange={(e) => setLocalCheckIn(e.target.value)}
          className="bg-neutral-800 text-white border-gray-700"
        />
      </div>

      <div>
        <Label className="text-gray-300">Check-out</Label>
        <Input
          type="date"
          value={localCheckOut}
          onChange={(e) => setLocalCheckOut(e.target.value)}
          className="bg-neutral-800 text-white border-gray-700"
        />
      </div>

      <div>
        <Label className="text-gray-300">Payment Method</Label>
        <div className="flex gap-6 mt-3">
          {["cash", "online"].map((method) => (
            <label
              key={method}
              className="flex items-center gap-3 text-gray-300"
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method as "cash" | "online")}
                className="accent-green-600"
              />
              {method === "cash" ? "Cash (Face to Face)" : "Online Payment"}
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleSubmit}
        disabled={createBooking.isPending || createGuest.isPending}
      >
        {createBooking.isPending ? "Booking..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
