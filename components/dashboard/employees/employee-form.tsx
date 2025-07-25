"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useBranches } from "@/hooks/use-branches";
import { useCreateEmployee } from "@/hooks/use-employees";
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
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const employeeFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  role: z.enum(["admin", "employee"], {
    required_error: "Please select a role.",
  }),
  branch_id: z.string().uuid({
    message: "Please select a branch.",
  }),
  user_id: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export function EmployeeForm() {
  const [open, setOpen] = useState(false);
  const { data: branches = [], isLoading: isLoadingBranches } = useBranches();
  const createEmployee = useCreateEmployee();
  const { isAdmin, userBranchId } = useAuth();
  const shouldDisableBranchSelect =
    isLoadingBranches || (!isAdmin && !!userBranchId);
  // Filter branches based on user role
  const availableBranches = isAdmin
    ? branches
    : branches.filter((branch) => branch.id === userBranchId);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "employee",
      branch_id: userBranchId || "",
      user_id: "",
    },
  });

  async function onSubmit(data: EmployeeFormValues) {
    if (isAdmin) {
      try {
        const res = await fetch("/api/employees/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.name,
            phone: data.phone,
            role: data.role,
            branch_id: data.branch_id,
            isAdmin,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to create employee");
        }

        toast({
          title: "Employee created",
          description: `${data.name} has been added as a ${data.role}.`,
        });

        form.reset();
        setOpen(false);
      } catch (error: any) {
        console.error("Error creating employee:", error);
        toast({
          title: "Error",
          description:
            error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.log("you must be an admin");
      toast({
        title: "Error",
        description: "You must be an admin",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new employee to your hotel.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isAdmin && (
                          <SelectItem value="admin">Admin</SelectItem>
                        )}
                        {(isAdmin || userBranchId) && (
                          <SelectItem value="employee">Employee</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={shouldDisableBranchSelect}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The branch where this employee will work.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={createEmployee.isPending}
                className="w-full sm:w-auto"
              >
                {createEmployee.isPending ? "Creating..." : "Create Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
