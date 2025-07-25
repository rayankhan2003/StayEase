"use client";

import {
  Mail,
  Phone,
  CalendarCheck2,
  DollarSign,
  BadgeCheck,
  Star,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Guest } from "@/lib/api/guests";
import { Button } from "@/components/ui/button";

export function GuestDetails({
  guest,
  onEdit,
}: {
  guest: Guest;
  onEdit?: () => void;
}) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .toUpperCase();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="flex flex-col max-h-[80vh] overflow-y-auto">
      <Card className="w-full bg-background border border-border rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-muted-foreground uppercase font-medium">
                    Guest
                  </span>
                  <span className="text-base sm:text-lg text-foreground font-semibold">
                    {guest.name}
                  </span>
                </div>
              </div>
            </CardTitle>
            <Badge
              variant={guest.status === "active" ? "default" : "secondary"}
            >
              {guest.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 text-sm sm:text-base lg:text-lg text-muted-foreground">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <IconDetail label="Email" icon={<Mail className="w-5 h-5 mb-2" />}>
              {guest.email || "—"}
            </IconDetail>
            <IconDetail label="Phone" icon={<Phone className="w-5 h-5 mb-2" />}>
              {guest.phone || "—"}
            </IconDetail>
            <IconDetail
              label="Visits"
              icon={<BadgeCheck className="w-5 h-5 mb-2" />}
            >
              {guest.visits}
            </IconDetail>
            <IconDetail
              label="Last Visit"
              icon={<CalendarCheck2 className="w-5 h-5 mb-2" />}
            >
              {guest.last_visit || "Never"}
            </IconDetail>
            <IconDetail
              label="Total Spent"
              icon={<DollarSign className="w-5 h-5 mb-2" />}
            >
              {formatCurrency(guest.total_spent ?? 0)}
            </IconDetail>
          </div>

          {/* Preferences */}
          {guest.preferences && guest.preferences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm sm:text-base font-medium uppercase text-muted-foreground">
                  Preferences
                </span>
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {guest.preferences.map((pref) => (
                  <Badge key={pref} variant="outline">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-background py-4 border-t">
        <Button onClick={onEdit}>Edit Guest</Button>
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
