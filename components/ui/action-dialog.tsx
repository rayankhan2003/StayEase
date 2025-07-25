"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionDialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActionDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
