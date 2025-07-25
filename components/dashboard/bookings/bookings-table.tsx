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
import { useBookings, useDeleteBooking } from "@/hooks/use-bookings";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import type { Booking } from "@/lib/api/bookings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingDetails } from "./booking-details";
import { EditBookingForm } from "./booking-edit-form";

const columns: ColumnDef<Booking>[] = [
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
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "guests.name",
    header: "Guest",
    cell: ({ row }) => {
      const guest = row.original.guests as any;
      return <div>{guest?.name || "Unknown"}</div>;
    },
  },
  {
    accessorKey: "rooms.number",
    header: "Room",
    cell: ({ row }) => {
      const room = row.original.rooms as any;
      return <div>{room?.number || "Unknown"}</div>;
    },
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
    accessorKey: "check_in",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Check In
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("check_in")}</div>,
  },
  {
    accessorKey: "check_out",
    header: "Check Out",
    cell: ({ row }) => <div>{row.getValue("check_out")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "upcoming"
              ? "outline"
              : status === "current"
              ? "default"
              : status === "past"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
    cell: ({ row }) => {
      const paymentStatus = row.getValue("payment_status") as string;
      return (
        <Badge
          variant={
            paymentStatus === "paid"
              ? "default"
              : paymentStatus === "pending"
              ? "outline"
              : "destructive"
          }
        >
          {paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      const deleteBooking = useDeleteBooking();
      const [openView, setOpenView] = useState(false);
      const [openEdit, setOpenEdit] = useState(false);
      const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
      );
      const handleDelete = async () => {
        try {
          await deleteBooking.mutateAsync(booking.id);
          toast({
            title: "Booking deleted",
            description: `Booking ${booking.id} has been deleted successfully.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete booking. Please try again.",
            variant: "destructive",
          });
        }
      };
      return (
        <>
          {/* Dropdown Menu */}
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
                onClick={() => navigator.clipboard.writeText(booking.id)}
              >
                Copy booking ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenView(true)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                Edit booking
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={deleteBooking.isPending}
                className="text-destructive"
              >
                Delete booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Booking Details Modal */}
          <Dialog open={openView} onOpenChange={setOpenView}>
            <DialogContent className="w-full max-w-3xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-6">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>
              <BookingDetails
                booking={booking}
                onEdit={() => {
                  setOpenView(false);
                  setSelectedBooking(booking);
                  setOpenEdit(true);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Booking Edit Modal */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit Booking</DialogTitle>
              </DialogHeader>

              <EditBookingForm
                booking={booking}
                onClose={() => setOpenEdit(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

export function BookingsTable({ filterStatus }: { filterStatus?: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const { data: bookings = [], isLoading, isError } = useBookings(filterStatus);

  const table = useReactTable({
    data: bookings,
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
          Error loading bookings. Please try again later.
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
            placeholder="Search bookings..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
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
