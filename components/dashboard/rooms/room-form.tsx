"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useBranches } from "@/hooks/use-branches"
import { useCreateRoom } from "@/hooks/use-rooms"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

const roomFormSchema = z.object({
  number: z.string().min(1, {
    message: "Room number is required.",
  }),
  type: z.string().min(1, {
    message: "Room type is required.",
  }),
  branch_id: z.string().uuid({
    message: "Please select a branch.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  status: z.enum(["available", "occupied", "maintenance"], {
    required_error: "Please select a room status.",
  }),
  max_guests: z.coerce.number().int().positive({
    message: "Maximum guests must be a positive number.",
  }),
  amenities: z.array(z.string()).default([]),
})

type RoomFormValues = z.infer<typeof roomFormSchema>

const roomTypes = [
  { id: "standard", name: "Standard" },
  { id: "deluxe", name: "Deluxe" },
  { id: "suite", name: "Suite" },
  { id: "executive", name: "Executive" },
  { id: "family", name: "Family" },
]

const amenitiesList = [
  { id: "wifi", label: "WiFi" },
  { id: "tv", label: "TV" },
  { id: "ac", label: "Air Conditioning" },
  { id: "minibar", label: "Minibar" },
  { id: "safe", label: "Safe" },
  { id: "balcony", label: "Balcony" },
  { id: "ocean_view", label: "Ocean View" },
  { id: "bathtub", label: "Bathtub" },
]

export function RoomForm() {
  const [open, setOpen] = useState(false)
  const { data: branches = [], isLoading: isLoadingBranches } = useBranches()
  const createRoom = useCreateRoom()

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
  })

  async function onSubmit(data: RoomFormValues) {
    try {
      await createRoom.mutateAsync({
        number: data.number,
        type: data.type,
        branch_id: data.branch_id,
        price: data.price,
        status: data.status,
        max_guests: data.max_guests,
        amenities: data.amenities,
      })

      toast({
        title: "Room created",
        description: `Room ${data.number} has been created successfully.`,
      })

      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error creating room:", error)
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive",
      })
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>Fill in the details to add a new room to your hotel.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormDescription>The unique room number or identifier.</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The type or category of the room.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingBranches}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The branch where this room is located.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormDescription>The current status of the room.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} placeholder="99.99" {...field} />
                    </FormControl>
                    <FormDescription>The price per night in USD.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="2" {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of guests allowed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Amenities</FormLabel>
                    <FormDescription>Select the amenities available in this room.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesList.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, amenity.id])
                                      : field.onChange(field.value?.filter((value) => value !== amenity.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{amenity.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createRoom.isPending} className="w-full sm:w-auto">
                {createRoom.isPending ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
