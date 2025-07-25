"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEmployees, useDeleteEmployee } from "@/hooks/use-employees";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ActionDialog } from "@/components/ui/action-dialog";
import { useAuth } from "@/components/auth-provider";
import type { Employee } from "@/lib/api/employees";

export function EmployeesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const { isAdmin, userBranchId } = useAuth();

  const { data: employees = [], isLoading, isError, error } = useEmployees();

  const deleteEmployee = useDeleteEmployee();

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      await deleteEmployee.mutateAsync(employee.id);
      toast({
        title: "Employee deleted",
        description: `${employee.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Employee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "branches.name",
      header: "Branch",
      cell: ({ row }) => {
        const branch = row.original.branches as any;
        return <div>{branch?.name || "Unknown"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "active" ? "success" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(employee.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewEmployee(employee)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit employee</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteEmployee(employee)}
                disabled={deleteEmployee.isPending}
                className="text-destructive"
              >
                Delete employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: employees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">
          Error loading employees:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Please check your console for more details.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4 px-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={columns.length}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => setViewEmployee(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={(e) => {
                          // Prevent row click when clicking on checkbox or dropdown
                          if (
                            cell.column.id === "select" ||
                            cell.column.id === "actions"
                          ) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4 px-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* View Employee Dialog */}
      <ActionDialog
        title={`Employee Details: ${viewEmployee?.name || ""}`}
        open={!!viewEmployee}
        onOpenChange={(open) => !open && setViewEmployee(null)}
      >
        {viewEmployee && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p>{viewEmployee.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{viewEmployee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p>{viewEmployee.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <p className="capitalize">{viewEmployee.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Branch
                </p>
                <p>{(viewEmployee.branches as any)?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    viewEmployee.status === "active" ? "success" : "secondary"
                  }
                >
                  {viewEmployee.status}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setViewEmployee(null)}>Close</Button>
            </div>
          </div>
        )}
      </ActionDialog>
    </>
  );
}
