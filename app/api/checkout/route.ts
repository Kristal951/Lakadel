import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { items, currency } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
    payment_method_types: ["card", "link", "alipay"],

      // ✅ Don't set payment_method_collection for one-time payments
      // ✅ Optional: don't set payment_method_types either (Stripe shows eligible methods
      // based on your Dashboard settings, customer country, currency, etc.)

      line_items: items.map((item: any) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: item?.image?.[0] ? [item.image[0]] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Math.max(1, Number(item.quantity) || 1),
      })),

      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/shopping-bag`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err?.message || "Checkout creation failed" },
      { status: 500 },
    );
  }
}
