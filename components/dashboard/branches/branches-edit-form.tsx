// components/dashboard/branches/branch-edit-form.tsx
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Branch } from "@/lib/api/branches";
import { useUpdateBranch } from "@/hooks/use-branches";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1),
  manager: z.string().min(1),
  location: z.string().min(1),
});

type BranchFormInput = z.infer<typeof formSchema>;

export function BranchEditForm({
  branch,
  onClose,
}: {
  branch: Branch;
  onClose: () => void;
}) {
  const form = useForm<BranchFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch.name,
      manager: branch.manager,
      location: branch.location,
    },
  });

  const { toast } = useToast();
  const updateBranch = useUpdateBranch();

  const onSubmit = async (data: BranchFormInput) => {
    try {
      await updateBranch.mutateAsync({ id: branch.id, branch: data });
      toast({
        title: "Branch updated",
        description: `${branch.name} was updated successfully.`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
        <Button type="submit" className="w-full">
          Update Branch
        </Button>
      </form>
    </Form>
  );
}
