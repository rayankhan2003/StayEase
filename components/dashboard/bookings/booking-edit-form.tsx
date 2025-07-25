"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateBooking } from "@/hooks/use-bookings";
import { useRoomsByBranch } from "@/hooks/use-rooms";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/lib/api/bookings";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  status: z.enum(["upcoming", "current", "past", "cancelled"]),
  payment_status: z.enum(["pending", "paid"]),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  room_id: z.string().min(1),
  total_amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" }),
  notes: z.string().optional(),
});

type EditBookingInput = z.infer<typeof formSchema>;

export function EditBookingForm({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose?: () => void;
}) {
  const form = useForm<EditBookingInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: booking.status as "upcoming" | "current" | "past" | "cancelled",
      payment_status: booking.payment_status as "pending" | "paid",
      check_in: booking.check_in.slice(0, 10),
      check_out: booking.check_out.slice(0, 10),
      room_id: booking.room_id,
      total_amount: booking.total_amount.toString(),
      notes: booking.notes || "",
    },
  });

  const updateBooking = useUpdateBooking();
  const { data: rooms = [] } = useRoomsByBranch(booking.branch_id);
  const { toast } = useToast();
  const onSubmit = async (values: EditBookingInput) => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        booking: {
          ...values,
          total_amount: parseFloat(values.total_amount),
        },
      });
      console.log("hello");
      toast({
        title: "Booking updated",
        description: `Booking by ${booking.guest_id} was successfully updated.`,
      });
      onClose?.(); // ✅ closes the dialog if passed
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.message || "An error occurred while updating the booking.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Status */}
        <FormField
          control={form.control}
          name="payment_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Check-in */}
        <FormField
          control={form.control}
          name="check_in"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Check-out */}
        <FormField
          control={form.control}
          name="check_out"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Room ID */}
        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Amount */}
        <FormField
          control={form.control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Optional notes..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Booking
        </Button>
      </form>
    </Form>
  );
}
