import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cartItems,
      currency,
      email,
      userId,
    }: {
      cartItems: { productId: string; quantity: number }[];
      currency?: string;
      email: string;
      userId?: string | null;
    } = body;

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "cartItems required" }, { status: 400 });
    }

    // Validate quantities early
    for (const item of cartItems) {
      if (!item.productId || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ error: "Invalid cartItems" }, { status: 400 });
      }
    }

    // Fetch real product prices from DB
    const productIds = [...new Set(cartItems.map((i) => i.productId))];

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true }, // adjust if your price field is different
    });

    const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));

    // Ensure all products exist
    const missing = productIds.filter((id) => !priceMap.has(id));
    if (missing.length) {
      return NextResponse.json(
        { error: "Some products no longer exist", missing },
        { status: 400 }
      );
    }

    // Compute total from DB prices (ignore client total)
    const computedTotal = cartItems.reduce((sum, item) => {
      const price = priceMap.get(item.productId)!;
      return sum + price * item.quantity;
    }, 0);

    const totalKobo = Math.round(computedTotal * 100);

    const order = await prisma.$transaction(async (tx) => {
      return tx.order.create({
        data: {
          userId: userId || null,
          customerEmail: email,
          total: computedTotal,
          totalKobo,
          currency: currency || "NGN",
          status: "PENDING",
          orderItems: {
            create: cartItems.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: priceMap.get(i.productId)!, // snapshot from DB
            })),
          },
        },
      });
    });

    return NextResponse.json({ orderId: order.id, total: order.total });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
