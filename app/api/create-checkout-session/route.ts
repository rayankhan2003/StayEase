
import { supabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2022-11-15" as any,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { roomId, checkIn, checkOut, guestDetails, nights } = body;

        if (!roomId || !checkIn || !checkOut || !guestDetails) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Fetch room
        const { data: room, error: roomError } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", roomId)
            .single();

        if (roomError || !room) {
            console.log("Room fetch error:", roomError);
            return NextResponse.json({ error: "Room not found" }, {
                status: 404,
            });
        }

        // Calculate price
        const baseAmount = room.price * nights;
        const taxAmount = baseAmount * 0.1;
        const grandTotal = baseAmount + taxAmount;

        // PKR equivalent
        const conversionRate = 278;
        const grandTotalPKR = grandTotal * conversionRate;

        // Insert booking
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                guest_id: guestDetails.guestId,
                room_id: roomId,
                branch_id: room.branch_id,
                check_in: checkIn,
                check_out: checkOut,
                payment_status: "pending",
                total_amount: grandTotal,
                notes: guestDetails.specialRequests || null,
            })
            .select()
            .single();

        if (bookingError || !booking) {
            console.log("Booking error:", bookingError);
            return NextResponse.json(
                { error: "Failed to create booking" },
                { status: 500 },
            );
        }

        // Format date for Stripe
        const formattedCheckIn = new Date(checkIn).toLocaleDateString();
        const formattedCheckOut = new Date(checkOut).toLocaleDateString();

        // Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: room.type.charAt(0).toUpperCase() +
                                room.type.slice(1) +
                                " Room",
                            description:
                                `${nights} night stay from ${formattedCheckIn} to ${formattedCheckOut}`,
                        },
                        unit_amount: Math.round(grandTotal * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url:
                `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
            cancel_url:
                `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel?booking_id=${booking.id}`,
            metadata: {
                bookingId: booking.id,
                roomId: roomId,
                guestId: guestDetails.guestId,
                nights: nights.toString(),
                baseAmount: baseAmount.toFixed(2),
                taxAmount: taxAmount.toFixed(2),
                pkrEquivalent: Math.round(grandTotalPKR).toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session: " + error.message },
            { status: 500 },
        );
    }
}
