"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBranches } from "@/hooks/use-branches";
import { useCreateRoom } from "@/hooks/use-rooms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { uploadRoomImage } from "@/lib/api/upload-room-image";
import { updateRoom } from "@/lib/api/rooms";

const roomFormSchema = z.object({
  number: z.string().min(1),
  type: z.string().min(1),
  branch_id: z.string().uuid(),
  price: z.coerce.number().positive(),
  status: z.enum(["available", "occupied", "maintenance"]),
  max_guests: z.coerce.number().int().positive(),
  amenities: z.array(z.string()).default([]),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

const roomTypes = [
  { id: "standard", name: "Standard" },
  { id: "deluxe", name: "Deluxe" },
  { id: "suite", name: "Suite" },
  { id: "executive", name: "Executive" },
  { id: "family", name: "Family" },
];

const amenitiesList = [
  { id: "wifi", label: "WiFi" },
  { id: "tv", label: "TV" },
  { id: "ac", label: "Air Conditioning" },
  { id: "minibar", label: "Minibar" },
  { id: "safe", label: "Safe" },
  { id: "balcony", label: "Balcony" },
  { id: "ocean_view", label: "Ocean View" },
  { id: "bathtub", label: "Bathtub" },
];

export function RoomForm() {
  const [open, setOpen] = useState(false);
  const { data: branches = [], isLoading } = useBranches();
  const createRoom = useCreateRoom();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      number: "",
      type: "",
      branch_id: "",
      price: 0,
      status: "available",
      max_guests: 2,
      amenities: [],
    },
  });

  async function onSubmit(data: RoomFormValues) {
    try {
      const room = await createRoom.mutateAsync(data);

      if (imageFiles.length > 0) {
        const imageUrls: string[] = [];
        for (const file of imageFiles) {
          const url = await uploadRoomImage(file, room.id);
          imageUrls.push(url);
        }
        await updateRoom(room.id, { image_urls: imageUrls });
      }

      toast({
        title: "Room created",
        description: `Room ${data.number} created successfully.`,
      });

      form.reset();
      setImageFiles([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Fill in the details and upload multiple images.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Room number + type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique room number or identifier.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type or category of the room.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Branch + status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select onValueChange={field.onChange} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The branch where this room is located.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The current status of the room.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Price + guests */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        placeholder="15000"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The price per night in PKR
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of guests allowed.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Amenities */}
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormDescription>
                Select the amenities available in this room.
              </FormDescription>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesList.map((a) => (
                  <label key={a.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={form.watch("amenities").includes(a.id)}
                      onCheckedChange={(checked) =>
                        checked
                          ? form.setValue("amenities", [
                              ...form.getValues("amenities"),
                              a.id,
                            ])
                          : form.setValue(
                              "amenities",
                              form
                                .getValues("amenities")
                                .filter((x) => x !== a.id)
                            )
                      }
                    />
                    {a.label}
                  </label>
                ))}
              </div>
            </FormItem>

            {/* Images */}
            <FormItem>
              <FormLabel>Room Images</FormLabel>
              <FormDescription>
                You can select images multiple times; they will be added.
              </FormDescription>
              <FormControl>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files ?? []);
                    setImageFiles((prev) => [...prev, ...newFiles]);
                  }}
                />
              </FormControl>
              {imageFiles.length > 0 && (
                <p className="text-sm text-green-500">
                  {imageFiles.length} image(s) selected
                </p>
              )}
            </FormItem>

            <DialogFooter>
              <Button type="submit" disabled={createRoom.isPending}>
                {createRoom.isPending ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
