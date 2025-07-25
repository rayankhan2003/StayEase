"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
