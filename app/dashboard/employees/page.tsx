import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmployeeForm } from "@/components/dashboard/employees/employee-form";
import { EmployeesTable } from "@/components/dashboard/employees/employee-table";
import { Card } from "@/components/ui/card";

export default function EmployeesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Employees"
        description="Manage your hotel staff"
      >
        <EmployeeForm />
      </DashboardHeader>
      <Card>
        <EmployeesTable />
      </Card>
    </DashboardShell>
  );
}
