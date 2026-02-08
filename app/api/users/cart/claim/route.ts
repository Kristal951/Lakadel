import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guestUserId } = await req.json().catch(() => ({}) as any);
  if (!guestUserId || typeof guestUserId !== "string") {
    return NextResponse.json(
      { error: "guestUserId required" },
      { status: 400 },
    );
  }

  await prisma.$transaction(async (tx) => {
    // ✅ Load guest cart id + claimedAt first
    const guestCart = await tx.cart.findUnique({
      where: { userId: guestUserId },
      select: { id: true, claimedAt: true },
    });

    if (!guestCart?.id) return;

    // ✅ If already claimed, do nothing (idempotent)
    if (guestCart.claimedAt) return;

    // ✅ Mark claimed immediately (prevents double claim in races)
    await tx.cart.update({
      where: { id: guestCart.id },
      data: { claimedAt: new Date() },
    });

    const guestItems = await tx.cartItem.findMany({
      where: { cartId: guestCart.id },
    });

    if (!guestItems.length) return;

    const userCart = await tx.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });

    for (const it of guestItems) {
      await tx.cartItem.upsert({
        where: {
          cartId_productId_selectedColor_selectedSize: {
            cartId: userCart.id,
            productId: it.productId,
            selectedColor: it.selectedColor ?? "",
            selectedSize: it.selectedSize ?? "",
          },
        },
        // ✅ choose ONE:
        // A) REPLACE (recommended for claim safety)
        update: { quantity: it.quantity },
        // B) ADD (only if you really want add behavior)
        // update: { quantity: { increment: it.quantity } },

        create: {
          cartId: userCart.id,
          productId: it.productId,
          quantity: it.quantity,
          selectedColor: it.selectedColor,
          selectedSize: it.selectedSize,
        },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: guestCart.id } });
  });

  return NextResponse.json({ ok: true });
}
