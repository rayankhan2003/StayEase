import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Redirect unauthenticated users trying to access /dashboard or any of its subroutes
    const isDashboardRoute = path.startsWith("/dashboard");

    if (!user && isDashboardRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Prevent authenticated users from accessing login or auth pages
    const isAuthPage = path === "/login" || path.startsWith("/auth");

    if (user && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard"; // or redirect based on role if needed
        return NextResponse.redirect(url);
    }

    // Authenticated: Optionally add role-based restrictions here
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const role = profile?.role;

        const employeeAllowedPaths = [
            "/dashboard/bookings",
            "/dashboard/rooms",
            "/dashboard/guests",
            "/dashboard/employees",
        ];

        if (role === "customer" && isDashboardRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

        if (role === "employee" && isDashboardRoute) {
            const isAllowed = path === "/dashboard" ||
                employeeAllowedPaths.some(
                    (allowed) =>
                        path === allowed || path.startsWith(`${allowed}/`),
                );

            if (!isAllowed) {
                const url = request.nextUrl.clone();
                url.pathname = "/dashboard";
                return NextResponse.redirect(url);
            }
        }
    }

    return supabaseResponse;
}
