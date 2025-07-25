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
import { Progress } from "@/components/ui/progress";
import { useBranches, useDeleteBranch } from "@/hooks/use-branches";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import type { Branch } from "@/lib/api/branches";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BranchEditForm } from "./branches-edit-form";

const columns: ColumnDef<Branch>[] = [
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
    header: "Branch Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => <div>{row.getValue("manager")}</div>,
  },
  {
    accessorKey: "rooms_count",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rooms
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("rooms_count")}</div>
    ),
  },
  {
    accessorKey: "occupancy_rate",
    header: "Occupancy",
    cell: ({ row }) => {
      const rate = row.getValue("occupancy_rate") as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Progress value={rate} className="h-2" />
          </div>
          <div>{rate}%</div>
        </div>
      );
    },
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Revenue
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("revenue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "maintenance"
              ? "destructive"
              : "outline"
          }
        >
          {status.replace("-", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "staff_count",
    header: "Staff",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("staff_count")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      const deleteBranch = useDeleteBranch();

      const [openEdit, setOpenEdit] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteBranch.mutateAsync(branch.id);
          toast({
            title: "Branch deleted",
            description: `Branch ${branch.name} has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete branch. Please try again.",
            variant: "destructive",
          });
        }
      };

      return (
        <>
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
                onClick={() => navigator.clipboard.writeText(branch.id)}
              >
                Copy branch ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Future: <DropdownMenuItem>View details</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit branch
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Manage staff</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={deleteBranch.isPending}
                className="text-destructive"
              >
                Delete branch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Branch Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Branch</DialogTitle>
              </DialogHeader>
              <BranchEditForm
                branch={branch}
                onClose={() => setOpenEdit(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

export function BranchesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const { data: branches = [], isLoading, isError } = useBranches();

  const table = useReactTable({
    data: branches,
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
          Error loading branches. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search branches..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
  );
}
