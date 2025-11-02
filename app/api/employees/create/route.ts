
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Securely use env vars (not exposed to client)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ only available on server
);

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password, name, phone, role, branch_id, isAdmin } = body;

    try {
        if (!isAdmin) {
            return NextResponse.json(
                { error: "You must be an admin" },
                { status: 403 },
            );
        }
        // 1. Create Supabase Auth User
        const { data: userData, error: signUpError } = await supabase.auth.admin
            .createUser({
                email,
                password,
                email_confirm: true,
            });

        if (signUpError || !userData?.user) {
            return NextResponse.json(
                { error: signUpError?.message || "Auth user creation failed" },
                { status: 400 },
            );
        }

        const userId = userData.user.id;

        // 2. Insert into profiles table
        const { error: profileError } = await supabase.from("profiles").insert({
            id: userId,
            email,
            full_name: name,
            phone,
            role: "employee",
            branch_id,
        });

        if (profileError) {
            return NextResponse.json(
                { error: profileError.message },
                { status: 400 },
            );
        }

        // 3. Insert into employees table
        const { error: employeeError } = await supabase.from("employees")
            .insert({
                user_id: userId,
                name,
                email,
                phone,
                role,
                branch_id,
                status: "active",
            });

        if (employeeError) {
            return NextResponse.json(
                { error: employeeError.message },
                { status: 400 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Unknown server error" },
            { status: 500 },
        );
    }
}
