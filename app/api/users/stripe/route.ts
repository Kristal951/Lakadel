import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      items: cartItems,
      currency,
      email,
      userId,
      guestId,
    }: {
      items: { productId: string; quantity: number }[];
      currency?: string;
      email?: string;
      userId?: string | null;
      guestId?: string | null;
    } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "cartItems required" },
        { status: 400 },
      );
    }
    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "guestId required for guest checkout" },
        { status: 400 },
      );
    }

    for (const i of cartItems) {
      if (!i.productId || !Number.isInteger(i.quantity) || i.quantity < 1) {
        return NextResponse.json(
          { error: "Invalid cartItems" },
          { status: 400 },
        );
      }
    }

    const cur = (currency || "NGN").toLowerCase();

    // ----------------------
    // fetch products from db
    // ----------------------
    const productIds = [...new Set(cartItems.map((i) => i.productId))];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, images: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const missing = productIds.filter((id) => !productMap.has(id));
    if (missing.length) {
      return NextResponse.json(
        { error: "Some products no longer exist", missing },
        { status: 400 },
      );
    }

    // ----------------------
    // build stripe line items
    // ----------------------
    const line_items = cartItems.map((i) => {
      const p = productMap.get(i.productId)!;

      // Stripe expects amount in the smallest currency unit.
      // If you're using NGN in Stripe, typically it's in kobo => multiply by 100.
      const unit_amount = Math.round(Number(p.price) * 100);

      return {
        price_data: {
          currency: cur,
          product_data: {
            name: p.name,
            images: p.images?.length ? [p.images[0]] : [],
          },
          unit_amount,
        },
        quantity: i.quantity,
      };
    });

    // optional: include metadata so you can identify guest/user later in webhook
    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items,
      metadata: {
        userId: userId || "",
        guestId: guestId || "",
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/shopping-bag`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed to create Stripe session" },
      { status: 500 },
    );
  }
}
