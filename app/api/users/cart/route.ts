import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

type Item = {
  productId: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
};

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const items: Item[] = Array.isArray(body?.items) ? body.items : [];

    // normalize
    const raw = items
      .filter((i) => i?.productId && Number.isFinite(i.quantity))
      .map((i) => ({
        productId: String(i.productId),
        quantity: Math.max(1, Math.floor(Number(i.quantity))),
        selectedColor: i.selectedColor ? String(i.selectedColor) : null,
        selectedSize: i.selectedSize ? String(i.selectedSize) : null,
      }));

    // dedupe + sum quantities by (productId, selectedColor, selectedSize)
    const dedupMap = new Map<string, (typeof raw)[number]>();
    for (const it of raw) {
      const k = `${it.productId}::${it.selectedColor ?? ""}::${it.selectedSize ?? ""}`;
      const prev = dedupMap.get(k);
      if (!prev) dedupMap.set(k, it);
      else dedupMap.set(k, { ...prev, quantity: prev.quantity + it.quantity });
    }
    const clean = Array.from(dedupMap.values());

    // 1) Ensure cart exists (NOT inside interactive tx)
    const cartRow = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      select: { id: true },
    });

    // 2) Validate product IDs once (optional but good)
    let insertData: Array<{
      cartId: string;
      productId: string;
      quantity: number;
      selectedColor: string | null;
      selectedSize: string | null;
    }> = [];

    if (clean.length) {
      const ids = [...new Set(clean.map((i) => i.productId))];
      const existing = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });
      const allowed = new Set(existing.map((p) => p.id));

      insertData = clean
        .filter((i) => allowed.has(i.productId))
        .map((i) => ({
          cartId: cartRow.id,
          productId: i.productId,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
        }));
    }

    // 3) Replace strategy in a short batch transaction (much more reliable than interactive tx)
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cartId: cartRow.id } }),
      ...(insertData.length
        ? [
            prisma.cartItem.createMany({
              data: insertData,
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    // 4) Return fresh cart
    const cart = await prisma.cart.findUnique({
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

    return NextResponse.json({ cart });
  } catch (e: any) {
    if (e?.code === "P2028") {
      return NextResponse.json(
        {
          error:
            "Cart update failed (database busy). Please retry in a moment.",
          code: "P2028",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: e?.message ?? "Something went wrong." },
      { status: 500 },
    );
  }
}