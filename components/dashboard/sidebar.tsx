"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  BedDouble,
  Building2,
  Calendar,
  Home,
  Hotel,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "../auth-provider";

interface DashboardSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardSidebar({
  open,
  onOpenChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, isEmployee, isAdmin } = useAuth();

  const employeeAllowedPaths = [
    "/dashboard",
    "/dashboard/bookings",
    "/dashboard/rooms",
    "/dashboard/guests",
    "/dashboard/employees",
  ];

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Rooms",
      icon: BedDouble,
      href: "/dashboard/rooms",
      active: pathname === "/dashboard/rooms",
    },
    {
      label: "Bookings",
      icon: Calendar,
      href: "/dashboard/bookings",
      active: pathname === "/dashboard/bookings",
    },
    {
      label: "Guests",
      icon: Users,
      href: "/dashboard/guests",
      active: pathname === "/dashboard/guests",
    },
    {
      label: "Branches",
      icon: Building2,
      href: "/dashboard/branches",
      active: pathname === "/dashboard/branches",
    },

    {
      label: "Employees",
      icon: Users,
      href: "/dashboard/employees",
      active: pathname === "/dashboard/employees",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  const filteredRoutes = routes.filter((route) => {
    if (isAdmin) return true;
    if (isEmployee) return employeeAllowedPaths.includes(route.href);
    return false; // hide everything for other roles
  });

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Hotel className="h-6 w-6" />
          <span>Gala Hotel</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                route.active && "bg-muted text-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 rounded-lg border p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {isAdmin && "Admin"}
              {isEmployee && "Employee"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-72">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      <aside className="hidden border-r bg-background md:block w-72">
        {sidebarContent}
      </aside>
    </>
  );
}
