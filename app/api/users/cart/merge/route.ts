import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type MergeItem = {
  productId: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const items: MergeItem[] = Array.isArray(body?.items) ? body.items : [];

  const cleanArr = Array.from(
    items
      .filter((i) => i?.productId && Number.isFinite(i.quantity))
      .map((i) => ({
        productId: String(i.productId),
        quantity: Math.max(1, Math.floor(Number(i.quantity))),
        selectedColor: i.selectedColor ? String(i.selectedColor) : null,
        selectedSize: i.selectedSize ? String(i.selectedSize) : null,
      }))
      .reduce((acc, cur) => {
        const k = `${cur.productId}::${cur.selectedColor ?? ""}::${cur.selectedSize ?? ""}`;
        const prev = acc.get(k);
        acc.set(k, prev ? { ...prev, quantity: prev.quantity + cur.quantity } : cur);
        return acc;
      }, new Map<string, { productId: string; quantity: number; selectedColor: string | null; selectedSize: string | null }>())
      .values()
  );

  const now = new Date();

  const cart = await prisma.$transaction(
    async (tx: any) => {
      const cartRow = await tx.cart.upsert({
        where: { userId },
        create: { userId, createdAt: now, updatedAt: now },
        update: { updatedAt: now },
        select: { id: true },
      });

      if (cleanArr.length) {
        // (Optional) validate product IDs - keep if you need FK safety
        const productIds = [...new Set(cleanArr.map((i) => i.productId))];
        const existingProducts = await tx.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true },
        });
        const allowed = new Set(existingProducts.map((p) => p.id));
        const filtered = cleanArr.filter((i) => allowed.has(i.productId));

        for (const item of filtered) {
          await tx.cartItem.upsert({
            where: {
              cartId_productId_selectedColor_selectedSize: {
                cartId: cartRow.id,
                productId: item.productId,
                // IMPORTANT: use nulls consistently (NOT '')
                selectedColor: item.selectedColor || null,
                selectedSize: item.selectedSize || null,
              },
            },
            create: {
              cartId: cartRow.id,
              productId: item.productId,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
              createdAt: now,
              updatedAt: now,
            },
            update: {
              quantity: { increment: item.quantity }, // ✅ no read needed
              updatedAt: now,
            },
          });
        }
      }

      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            select: {
              productId: true,
              quantity: true,
              selectedColor: true,
              selectedSize: true,
            },
          },
        },
      });
    },
    {
      maxWait: 10_000, 
      timeout: 20_000, 
    }
  );

  return NextResponse.json({ cart });
}