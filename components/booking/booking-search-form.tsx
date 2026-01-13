"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useBranches } from "@/hooks/use-branches";
import { startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BookingSearchFormProps = {
  defaultValues?: {
    checkIn?: Date;
    checkOut?: Date;
    guests?: string;
    roomType?: string;
    branchId?: string;
  };
};
export function BookingSearchForm({ defaultValues }: BookingSearchFormProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    defaultValues?.checkIn
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    defaultValues?.checkOut
  );
  const [guests, setGuests] = useState(defaultValues?.guests ?? "2");
  const [roomType, setRoomType] = useState(defaultValues?.roomType ?? "any");
  const [branchId, setBranchId] = useState(defaultValues?.branchId ?? "");
  const { data: branches, isLoading: loadingBranches } = useBranches();

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;

    const searchParams = new URLSearchParams();
    searchParams.set("checkIn", checkIn.toISOString());
    searchParams.set("checkOut", checkOut.toISOString());
    searchParams.set("guests", guests);
    if (branchId) {
      searchParams.set("branchId", branchId);
    }

    if (roomType && roomType !== "any") {
      searchParams.set("roomType", roomType);
    }

    router.push(`/booking?${searchParams.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      {/* Room Type */}
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium text-white">Room Type</label>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger className="bg-[#1e1e1e] border-[#333] text-white">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="deluxe">Deluxe</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
            <SelectItem value="executive">Executive Suite</SelectItem>
            <SelectItem value="presidential">Presidential Suite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Check-in */}
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium text-white">Check-in</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-[#1e1e1e] border-[#333] hover:bg-[#2a2a2a]",
                !checkIn && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1e1e1e] border-[#333]">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
              disabled={(date) => date < startOfDay(new Date())}
              className="bg-[#1e1e1e] text-white"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check-out */}
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium text-white">Check-out</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-[#1e1e1e] border-[#333] hover:bg-[#2a2a2a]",
                !checkOut && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1e1e1e] border-[#333]">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
              disabled={(date) =>
                !checkIn || date <= checkIn || date < startOfDay(new Date())
              }
              className="bg-[#1e1e1e] text-white"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Guests */}
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium text-white">Guests</label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="bg-[#1e1e1e] border-[#333] text-white">
            <SelectValue placeholder="2 Guests" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <SelectItem key={g} value={String(g)}>
                {g} Guest{g > 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Branch Selection */}
      <div className="space-y-2 md:col-span-1">
        <label className="text-sm font-medium text-white">Branch</label>
        <Select
          value={branchId}
          onValueChange={setBranchId}
          disabled={loadingBranches}
        >
          <SelectTrigger className="bg-[#1e1e1e] border-[#333] text-white">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] border-[#333] text-white">
            {branches?.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Submit Button */}
      <div className="flex items-end md:col-span-1">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handleSearch}
          disabled={!checkIn || !checkOut}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
