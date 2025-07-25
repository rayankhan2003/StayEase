"use client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BranchesTable } from "@/components/dashboard/branches/branches-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BranchForm } from "@/components/dashboard/branches/branches-form";

export default function BranchesPage() {
  const [open, setOpen] = useState(false);
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Branches"
        description="Manage your hotel branches"
      >
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
        <BranchForm open={open} setOpen={setOpen} />
      </DashboardHeader>
      <Card>
        <BranchesTable />
      </Card>
    </DashboardShell>
  );
}
