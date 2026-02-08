import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const NO_STORE = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ cart: { id: null, items: [] } }, NO_STORE);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            selectedColor: true,
            selectedSize: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                status: true,
                totalStock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: { id: null, items: [] } }, NO_STORE);
    }

    const sanitizedItems = cart.items.filter(
      (item) =>
        item.product &&
        item.product.status === "ACTIVE" &&
        item.product.totalStock > 0
    );

    return NextResponse.json(
      { cart: { id: cart.id, items: sanitizedItems } },
      NO_STORE
    );
  } catch (error) {
    console.error("[CART_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
