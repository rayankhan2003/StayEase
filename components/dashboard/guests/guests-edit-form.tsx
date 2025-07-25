"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Guest } from "@/lib/api/guests";
import { useUpdateGuest } from "@/hooks/use-guests";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  preferences: z.string().optional(),
});

type GuestEditInput = z.infer<typeof formSchema>;

export function GuestEditForm({
  guest,
  onClose,
}: {
  guest: Guest;
  onClose: () => void;
}) {
  const form = useForm<GuestEditInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: guest.name,
      email: guest.email ?? "",
      phone: guest.phone ?? "",
      preferences: (guest.preferences || []).join(", "),
    },
  });

  const { toast } = useToast();
  const updateGuest = useUpdateGuest();

  const onSubmit = async (data: GuestEditInput) => {
    try {
      await updateGuest.mutateAsync({
        id: guest.id,
        guest: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferences: data.preferences
            ? data.preferences.split(",").map((s) => s.trim())
            : [],
        },
      });

      toast({
        title: "Guest updated",
        description: `Guest "${data.name}" was successfully updated.`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.message || "An error occurred while updating the guest.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Guest name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="guest@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+92-300-1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferences */}
        <FormField
          control={form.control}
          name="preferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferences</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Comma-separated (e.g., sea view, late check-in)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Guest
        </Button>
      </form>
    </Form>
  );
}
