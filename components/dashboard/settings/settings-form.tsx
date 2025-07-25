"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings, useUpdateSettings } from "@/hooks/use-settings"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  hotel_name: z.string().min(2, {
    message: "Hotel name must be at least 2 characters.",
  }),
  check_in_time: z.string(),
  check_out_time: z.string(),
  min_nights: z.coerce.number().min(1),
  max_nights: z.coerce.number().min(1),
  breakfast_price: z.coerce.number().min(0),
  lunch_price: z.coerce.number().min(0),
  dinner_price: z.coerce.number().min(0),
  max_guests_per_booking: z.coerce.number().min(1),
  allow_early_check_in: z.boolean().default(false),
  allow_late_check_out: z.boolean().default(false),
  require_credit_card: z.boolean().default(true),
  send_confirmation_email: z.boolean().default(true),
})

export function SettingsForm() {
  const { data: settings, isLoading, isError } = useSettings()
  const updateSettings = useUpdateSettings()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotel_name: settings?.hotel_name || "Hotel Management System",
      check_in_time: settings?.check_in_time || "14:00",
      check_out_time: settings?.check_out_time || "11:00",
      min_nights: settings?.min_nights || 1,
      max_nights: settings?.max_nights || 30,
      breakfast_price: settings?.breakfast_price || 15,
      lunch_price: settings?.lunch_price || 25,
      dinner_price: settings?.dinner_price || 35,
      max_guests_per_booking: settings?.max_guests_per_booking || 4,
      allow_early_check_in: settings?.allow_early_check_in || false,
      allow_late_check_out: settings?.allow_late_check_out || false,
      require_credit_card: settings?.require_credit_card || true,
      send_confirmation_email: settings?.send_confirmation_email || true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!settings?.id) {
      toast({
        title: "Error",
        description: "Settings ID not found. Please try again later.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        settings: values,
      })

      toast({
        title: "Settings updated",
        description: "Your hotel settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error loading settings. Please try again later.</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="booking">Booking Rules</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">Configure your hotel's general settings.</p>
            </div>
            <Separator />
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="hotel_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>This is the name of your hotel that will appear on all documents.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="check_in_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="check_out_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allow_early_check_in"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Early Check-in</FormLabel>
                        <FormDescription>Allow guests to check in before the standard time.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allow_late_check_out"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Late Check-out</FormLabel>
                        <FormDescription>Allow guests to check out after the standard time.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="booking" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Booking Rules</h3>
              <p className="text-sm text-muted-foreground">Configure your hotel's booking rules and policies.</p>
            </div>
            <Separator />
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_nights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Nights</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>Minimum number of nights required for a booking.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_nights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Nights</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>Maximum number of nights allowed for a booking.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="max_guests_per_booking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Guests Per Booking</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of guests allowed per booking.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="require_credit_card"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Credit Card</FormLabel>
                        <FormDescription>Require a credit card to secure bookings.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="send_confirmation_email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Send Confirmation Email</FormLabel>
                        <FormDescription>Automatically send booking confirmation emails.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pricing" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Pricing Settings</h3>
              <p className="text-sm text-muted-foreground">Configure your hotel's pricing and meal rates.</p>
            </div>
            <Separator />
            <div className="grid gap-6">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="breakfast_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breakfast Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormDescription>Price per person for breakfast.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lunch_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lunch Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormDescription>Price per person for lunch.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dinner_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dinner Price</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormDescription>Price per person for dinner.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
