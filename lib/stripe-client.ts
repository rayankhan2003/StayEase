'"use client';

interface CreatePaymentIntentParams {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestDetails: any;
    nights: number;
    totalAmount: number;
}

export async function createPaymentIntent(
    params: CreatePaymentIntentParams,
): Promise<{ clientSecret: string; bookingId: string }> {
    const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment intent");
    }

    return await response.json();
}
