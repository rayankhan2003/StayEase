"use client";

import { useState, useEffect } from "react";
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
import { useRooms, useDeleteRoom } from "@/hooks/use-rooms";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { ActionDialog } from "@/components/ui/action-dialog";
import { RoomDetails } from "@/components/dashboard/rooms/room-details";
import { RoomEditForm } from "@/components/dashboard/rooms/room-edit-form";
import type { Room } from "@/lib/api/rooms";

export function RoomsTable({ filterStatus }: { filterStatus?: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [viewRoom, setViewRoom] = useState<Room | null>(null);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const queryClient = useQueryClient();

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useRooms(filterStatus);
  const deleteRoom = useDeleteRoom();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("rooms-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          // Invalidate the rooms query to refetch data
          queryClient.invalidateQueries({ queryKey: ["rooms"] });

          // Show toast notification
          const operation = payload.eventType;
          const roomNumber = payload.new?.number || payload.old?.number;

          if (operation === "INSERT") {
            toast({
              title: "Room Added",
              description: `Room ${roomNumber} has been added.`,
            });
          } else if (operation === "UPDATE") {
            toast({
              title: "Room Updated",
              description: `Room ${roomNumber} has been updated.`,
            });
          } else if (operation === "DELETE") {
            toast({
              title: "Room Deleted",
              description: `Room ${roomNumber} has been deleted.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDeleteRoom = async (room: Room) => {
    try {
      await deleteRoom.mutateAsync(room.id);
      toast({
        title: "Room deleted",
        description: `Room ${room.number} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Room>[] = [
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
      accessorKey: "number",
      header: "Room Number",
      cell: ({ row }) => <div>{row.getValue("number")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "branches.id",
      header: "Branch",
      cell: ({ row }) => <div>{row.original.branches?.name ?? "Unknown"}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
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
              status === "available"
                ? "success"
                : status === "occupied"
                ? "default"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amenities",
      header: "Amenities",
      cell: ({ row }) => {
        const amenities = row.getValue("amenities") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {amenities && amenities.length > 0 ? (
              <>
                {amenities.slice(0, 2).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{amenities.length - 2} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground text-xs">None</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const room = row.original;

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
                onClick={() => navigator.clipboard.writeText(room.id)}
              >
                Copy room ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewRoom(room)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditRoom(room)}>
                Edit room
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteRoom(room)}
                disabled={deleteRoom.isPending}
                className="text-destructive"
              >
                Delete room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: rooms,
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
          Error loading rooms:{" "}
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
              placeholder="Search rooms..."
              value={
                (table.getColumn("number")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("number")?.setFilterValue(event.target.value)
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
                    onClick={() => setViewRoom(row.original)}
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

      {/* View Room Dialog */}
      <ActionDialog
        title={`Room ${viewRoom?.number || ""} Details`}
        open={!!viewRoom}
        onOpenChange={(open) => !open && setViewRoom(null)}
      >
        {viewRoom && (
          <RoomDetails
            room={viewRoom}
            onEdit={() => {
              setEditRoom(viewRoom);
              setViewRoom(null);
            }}
            onClose={() => setViewRoom(null)}
          />
        )}
      </ActionDialog>

      {/* Edit Room Dialog */}
      <ActionDialog
        title={`Edit Room ${editRoom?.number || ""}`}
        description="Update the room details"
        open={!!editRoom}
        onOpenChange={(open) => !open && setEditRoom(null)}
      >
        {editRoom && (
          <RoomEditForm room={editRoom} onSuccess={() => setEditRoom(null)} />
        )}
      </ActionDialog>
    </>
  );
}
