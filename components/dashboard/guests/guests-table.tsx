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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGuests, useDeleteGuest } from "@/hooks/use-guests";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import type { Guest } from "@/lib/api/guests";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuestEditForm } from "./guests-edit-form";
import { GuestDetails } from "./guest-details";

const columns: ColumnDef<Guest>[] = [
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
    header: "Guest",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{name}</div>
        </div>
      );
    },
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
    accessorKey: "visits",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Visits
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("visits")}</div>
    ),
  },
  {
    accessorKey: "last_visit",
    header: "Last Visit",
    cell: ({ row }) => <div>{row.getValue("last_visit") || "Never"}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_spent",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Spent
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total_spent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "preferences",
    header: "Preferences",
    cell: ({ row }) => {
      const preferences = row.getValue("preferences") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {preferences.slice(0, 2).map((preference) => (
            <Badge key={preference} variant="outline" className="text-xs">
              {preference}
            </Badge>
          ))}
          {preferences.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{preferences.length - 2} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const guest = row.original;
      const deleteGuest = useDeleteGuest();
      const [openEdit, setOpenEdit] = useState(false);
      const [openDetails, setOpenDetails] = useState(false);
      const handleDelete = async () => {
        try {
          await deleteGuest.mutateAsync(guest.id);
          toast({
            title: "Guest deleted",
            description: `Guest ${guest.name} has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete guest. Please try again.",
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
                onClick={() => navigator.clipboard.writeText(guest.id)}
              >
                Copy guest ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit guest
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenDetails(true)}>
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem disabled>View booking history</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={deleteGuest.isPending}
                className="text-destructive"
              >
                Delete guest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Guest Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Guest</DialogTitle>
              </DialogHeader>
              <GuestEditForm guest={guest} onClose={() => setOpenEdit(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={openDetails} onOpenChange={setOpenDetails}>
            <DialogContent className="w-full max-w-3xl p-6">
              <DialogHeader>
                <DialogTitle>Guest Details</DialogTitle>
              </DialogHeader>
              <GuestDetails
                guest={guest}
                onEdit={() => {
                  setOpenDetails(false);
                  setOpenEdit(true);
                }}
              />
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

export function GuestsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const { data: guests = [], isLoading, isError } = useGuests();

  const table = useReactTable({
    data: guests,
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
          Error loading guests. Please try again later.
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
            placeholder="Search guests..."
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
