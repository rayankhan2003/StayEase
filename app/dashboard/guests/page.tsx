import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuestsTable } from "@/components/dashboard/guests/guests-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function GuestsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Guests" description="Manage your hotel guests">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </DashboardHeader>
      <Card>
        <GuestsTable />
      </Card>
    </DashboardShell>
  )
}
