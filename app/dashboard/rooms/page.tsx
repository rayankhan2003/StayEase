import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RoomsTable } from "@/components/dashboard/rooms/rooms-table"
import { RoomForm } from "@/components/dashboard/rooms/room-form"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoomsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rooms" description="Manage your hotel rooms">
        <RoomForm />
      </DashboardHeader>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <RoomsTable />
          </Card>
        </TabsContent>
        <TabsContent value="available" className="space-y-4">
          <Card>
            <RoomsTable filterStatus="available" />
          </Card>
        </TabsContent>
        <TabsContent value="occupied" className="space-y-4">
          <Card>
            <RoomsTable filterStatus="occupied" />
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <RoomsTable filterStatus="maintenance" />
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
