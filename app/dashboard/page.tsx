import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingTrends } from "@/components/dashboard/booking-trends";
import { OccupancyRate } from "@/components/dashboard/occupancy-rate";
import { RevenueMetrics } from "@/components/dashboard/revenue-metrics";
import { TopBranches } from "@/components/dashboard/top-branches";
import { GuestFeedback } from "@/components/dashboard/guest-feedback";
import { DebugSupabase } from "@/components/debug-supabase";
import { getUser } from "@/lib/api/auth";
import { useEffect } from "react";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        description="Overview of your hotel performance and metrics."
      />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since yesterday
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly revenue trends
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueMetrics />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>
                  Current occupancy across all branches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OccupancyRate />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>
                  Booking patterns over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BookingTrends />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Branches</CardTitle>
                <CardDescription>
                  Branches with highest revenue and occupancy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopBranches />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Guest Feedback Summary</CardTitle>
                <CardDescription>
                  Recent reviews and ratings from guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GuestFeedback />
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <DebugSupabase />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">
                Advanced analytics content will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and download custom reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">
                Reports content will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
