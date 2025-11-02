

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

// Initialize Stripe with your secret key
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables",
    );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15" as any, // Use a stable API version
});
// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            endpointSecret,
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({
            error: "Webhook signature verification failed",
        }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;

            // Update booking status to paid
            if (session.metadata?.bookingId) {
                const { error } = await supabase
                    .from("bookings")
                    .update({ payment_status: "paid" })
                    .eq("id", session.metadata.bookingId);

                if (error) {
                    console.error("Error updating booking status:", error);
                    return NextResponse.json({
                        error: "Failed to update booking status",
                    }, { status: 500 });
                }

                // Update room status to occupied
                const { data: booking, error: bookingError } = await supabase
                    .from("bookings")
                    .select("room_id")
                    .eq("id", session.metadata.bookingId)
                    .single();

                if (!bookingError && booking) {
                    const { error: roomError } = await supabase
                        .from("rooms")
                        .update({ status: "occupied" })
                        .eq("id", booking.room_id);

                    if (roomError) {
                        console.error("Error updating room status:", roomError);
                    }
                }
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
