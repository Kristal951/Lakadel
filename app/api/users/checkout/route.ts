import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { items, currency } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(), 
        product_data: {
          name: item.name,
          images: [item.image[0]],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/shopping-bag`,
  });

  return NextResponse.json({ url: session.url });
}
