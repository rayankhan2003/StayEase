"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const branches = [
  {
    name: "Downtown Hotel",
    revenue: 45231,
    occupancy: 92,
  },
  {
    name: "Beachfront Resort",
    revenue: 38420,
    occupancy: 85,
  },
  {
    name: "Mountain Lodge",
    revenue: 27840,
    occupancy: 78,
  },
  {
    name: "Business Center",
    revenue: 21930,
    occupancy: 72,
  },
]

export function TopBranches() {
  return (
    <div className="space-y-4">
      {branches.map((branch) => (
        <Card key={branch.name} className="p-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">{branch.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">${branch.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{branch.occupancy}%</p>
                <div className="w-20">
                  <Progress value={branch.occupancy} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
