"use client";

import {
  CalendarDays,
  DollarSign,
  Building2,
  BadgeDollarSign,
  StickyNote,
  BedDouble,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/api/bookings";

export function BookingDetails({
  booking,
  onEdit,
  onRemind,
}: {
  booking: Booking;
  onEdit?: () => void;
  onRemind?: () => void;
}) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);

  const guestName = booking.guests?.name || "Unknown Guest";
  const guestInitials = guestName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto">
      <Card className="w-full bg-background border border-border rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{guestInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-muted-foreground uppercase font-medium">
                    Guest
                  </span>
                  <span className="text-base sm:text-lg text-foreground font-semibold">
                    {guestName}
                  </span>
                </div>
              </div>
            </CardTitle>
            <Badge
              className="px-3 py-1 text-xs sm:text-sm"
              variant={
                booking.status === "upcoming"
                  ? "outline"
                  : booking.status === "current"
                  ? "default"
                  : "secondary"
              }
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-sm sm:text-base lg:text-lg text-muted-foreground">
          {/* Guest Info */}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <IconDetail
              label="Room"
              icon={<BedDouble className="w-5 h-5 mb-2" />}
            >
              Room {booking.rooms?.number || booking.room_id}
            </IconDetail>

            <IconDetail
              label="Branch"
              icon={<Building2 className="w-5 h-5 mb-2" />}
            >
              {booking.branches?.name || booking.branch_id}
            </IconDetail>

            <IconDetail
              label="Check-in"
              icon={<CalendarDays className="w-5 h-5 mb-2" />}
            >
              {formatDate(booking.check_in)}
            </IconDetail>

            <IconDetail
              label="Check-out"
              icon={<CalendarDays className="w-5 h-5 mb-2" />}
            >
              {formatDate(booking.check_out)}
            </IconDetail>

            <IconDetail
              label="Payment"
              icon={<BadgeDollarSign className="w-5 h-5 mb-2" />}
            >
              <Badge
                className="px-3 py-1 text-xs sm:text-sm"
                variant={
                  booking.payment_status === "paid" ? "success" : "destructive"
                }
              >
                {booking.payment_status}
              </Badge>
            </IconDetail>

            <IconDetail
              label="Amount"
              icon={<DollarSign className="w-5 h-5 mb-2" />}
            >
              {formatCurrency(booking.total_amount)}
            </IconDetail>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StickyNote className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm sm:text-base font-medium uppercase text-muted-foreground">
                  Notes
                </span>
              </div>
              <p className="text-sm sm:text-base lg:text-lg px-4 py-2 bg-muted/20 text-foreground rounded-md">
                {booking.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-background py-4 border-t">
        <Button variant="secondary" onClick={onRemind}>
          Send Reminder
        </Button>
        <Button onClick={onEdit}>Edit Booking</Button>
      </div>
    </div>
  );
}

function IconDetail({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
        {icon}
        {label}
      </span>
      <span className="text-sm sm:text-base text-foreground">{children}</span>
    </div>
  );
}
