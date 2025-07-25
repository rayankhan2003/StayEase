"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useCreateBranch } from "@/hooks/use-branches";

const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  location: z.string().min(1, "Location is required"),
  manager: z.string().min(1, "Manager name  is required"),
});

type BranchFormValues = z.infer<typeof branchSchema>;

export function BranchForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const createBranch = useCreateBranch();

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      manager: "",
      location: "",
    },
  });

  const onSubmit = async (data: BranchFormValues) => {
    try {
      await createBranch.mutateAsync(data);
      toast({ title: "Branch created" });
      setOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create branch" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Branch</DialogTitle>
          <DialogDescription>Enter branch details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Branch</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
