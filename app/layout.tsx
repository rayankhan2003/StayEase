import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/lib/react-query";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthGate } from "@/components/auth-gate";
import { Suspense } from "react"; // ✅ import Suspense

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A modern hotel management system dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              }
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <main className="min-h-screen">{children}</main>
              </ThemeProvider>
            </Suspense>
          </AuthProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
