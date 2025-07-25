"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { useGuests } from "@/hooks/use-guests";
import { useRooms } from "@/hooks/use-rooms";
import { useBranches } from "@/hooks/use-branches";
import { useCreateBooking } from "@/hooks/use-bookings";
import { formatISO } from "date-fns";

const bookingSchema = z.object({
  guest_id: z.string().uuid({ message: "Select a guest" }),
  room_id: z.string().uuid({ message: "Select a room" }),
  branch_id: z.string().uuid({ message: "Select a branch" }),
  check_in: z.string().min(1, "Required"),
  check_out: z.string().min(1, "Required"),
  status: z.enum(["upcoming", "current", "past", "cancelled"]),
  payment_status: z.enum(["paid", "pending"]),
  total_amount: z.number().min(0),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const { data: guests = [] } = useGuests();
  const { data: rooms = [] } = useRooms();
  const { data: branches = [] } = useBranches();
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guest_id: "",
      room_id: "",
      branch_id: "",
      check_in: "",
      check_out: "",
      status: "upcoming",
      payment_status: "pending",
      total_amount: 0,
    },
  });
  const selectedRoom = rooms.find((r) => r.id === form.watch("room_id"));
  useEffect(() => {
    if (selectedRoom) {
      console.log(selectedRoom.branch_id);
      form.setValue("branch_id", selectedRoom.branch_id);
      form.setValue("total_amount", selectedRoom.price); // Assuming `price` exists
    }
  }, [selectedRoom]);

  const onSubmit = async (data: BookingFormValues) => {
    try {
      console.log("hello");
      const bookingData = {
        ...data,
        check_in: formatISO(new Date(data.check_in)),
        check_out: formatISO(new Date(data.check_out)),
        payment_method: "cash", // hardcoded for admin panel
      };

      const booking = await createBooking.mutateAsync(bookingData as any);
      toast({
        title: "Booking created",
        description: `Booking ID: ${booking.id}`,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to create booking" });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
          <DialogDescription>Enter booking details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Guest */}
            <FormField
              control={form.control}
              name="guest_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {guests.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room */}
            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Booking Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input type="number" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Branch */}
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // important: use controlled value
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select branch"
                          // show branch name instead of just ID
                          defaultValue={field.value}
                        >
                          {branches.find((b) => b.id === field.value)?.name ??
                            "Select branch"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <DialogFooter>
              <Button type="submit">Create Booking</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
