"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export function DebugSupabase() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser(); // ✅ safer
      console.log("supabase", supabase);

      console.log("session data:", user);
      console.log("Auth state:", user ? "Authenticated" : "Not authenticated");
    } catch (error) {
      console.error("Error checking auth session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const testConnection = async () => {
    setIsLoading(true);
    setTestResult("Testing connection...");

    try {
      await checkUser();
      // Test a simple query
      const { data, error } = await supabase
        .from("rooms")
        .select("count")
        .limit(1);

      if (error) {
        setTestResult(`Error: ${error.message}`);
        console.error("Supabase test error:", error);
      } else {
        setTestResult(
          `Success! Connection established. Data: ${JSON.stringify(data)}`
        );
        console.log("Supabase test data:", data);
      }
    } catch (err) {
      setTestResult(
        `Exception: ${err instanceof Error ? err.message : String(err)}`
      );
      console.error("Supabase test exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Log environment variables (public ones only)
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"
    );
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Supabase Connection"}
          </Button>
        </div>
        {testResult && (
          <div className="p-4 border rounded-md bg-muted">
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
