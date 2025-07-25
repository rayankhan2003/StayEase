"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BookingsTable } from "@/components/dashboard/bookings/bookings-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "@/components/dashboard/bookings/booking-form";

export default function BookingsPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bookings"
        description="Manage your hotel bookings"
      >
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
        <BookingForm open={open} setOpen={setOpen} />
      </DashboardHeader>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <BookingsTable />
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <BookingsTable filterStatus="upcoming" />
          </Card>
        </TabsContent>
        <TabsContent value="current" className="space-y-4">
          <Card>
            <BookingsTable filterStatus="current" />
          </Card>
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          <Card>
            <BookingsTable filterStatus="past" />
          </Card>
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-4">
          <Card>
            <BookingsTable filterStatus="cancelled" />
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
