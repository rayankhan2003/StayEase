import { supabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any,
});

// PKR → USD conversion rate (fixed for FYP)
const PKR_TO_USD = 278;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guestDetails, nights } = body;

    if (!roomId || !checkIn || !checkOut || !guestDetails || !nights) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* -----------------------------
       Fetch Room
    ------------------------------ */
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError || !room) {
      console.error("Room fetch error:", roomError);
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    /* -----------------------------
       Price Calculation (PKR)
       NOTE: room.price is PKR
    ------------------------------ */
    const baseAmountPKR = Number(room.price) * Number(nights);
    const taxAmountPKR = baseAmountPKR * 0.1; // 10% tax
    const grandTotalPKR = baseAmountPKR + taxAmountPKR;

    /* -----------------------------
       Convert PKR → USD for Stripe
    ------------------------------ */
    const grandTotalUSD = grandTotalPKR / PKR_TO_USD;

    /* -----------------------------
       Create Booking (store PKR)
    ------------------------------ */
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        guest_id: guestDetails.guestId,
        room_id: roomId,
        branch_id: room.branch_id,
        check_in: checkIn,
        check_out: checkOut,
        payment_status: "pending",
        total_amount: grandTotalPKR, // ✅ PKR stored
        notes: guestDetails.specialRequests || null,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Booking error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    /* -----------------------------
       Stripe Checkout Session
    ------------------------------ */
    const formattedCheckIn = new Date(checkIn).toLocaleDateString();
    const formattedCheckOut = new Date(checkOut).toLocaleDateString();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${room.type.charAt(0).toUpperCase()}${room.type.slice(
                1
              )} Room`,
              description: `${nights} night stay from ${formattedCheckIn} to ${formattedCheckOut}`,
            },
            unit_amount: Math.round(grandTotalUSD * 100), // ✅ USD cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel?booking_id=${booking.id}`,
      metadata: {
        bookingId: booking.id,
        roomId: roomId,
        guestId: guestDetails.guestId,
        nights: nights.toString(),
        totalPKR: Math.round(grandTotalPKR).toString(),
        chargedUSD: grandTotalUSD.toFixed(2),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session: " + error.message },
      { status: 500 }
    );
  }
}
