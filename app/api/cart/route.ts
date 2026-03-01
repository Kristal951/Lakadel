// /app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { CartItemPayload } from "@/store/types";

/**
 * IMPORTANT:
 * Using NULL in a composite UNIQUE key can cause duplicates in PostgreSQL.
 * So we normalize empty/undefined values into a sentinel string.
 * Make sure your Prisma schema makes selectedColor/selectedSize NON-NULL with a default "__DEFAULT__".
 */
const DEFAULT_VARIANT = "__DEFAULT__";
const norm = (v?: string | null) => (v && v.trim() ? v.trim() : DEFAULT_VARIANT);

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function fetchCartItems(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { id: "desc" },
        include: {
          product: true,
        },
      },
    },
  });

  return cart?.items ?? [];
}
function isPrismaRecordNotFound(err: any) {
  // Prisma throws P2025 when update/delete target doesn't exist
  return err?.code === "P2025";
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await fetchCartItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CartItemPayload & { action?: string } = await request.json();
    const action = body.action ?? "add";

    if (action !== "add") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!body.productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const qtyToAdd = Number(body.quantity ?? 1);
    if (!Number.isFinite(qtyToAdd) || qtyToAdd <= 0) {
      return NextResponse.json(
        { error: "quantity must be a positive number" },
        { status: 400 },
      );
    }

    const selectedColor = norm(body.selectedColor);
    const selectedSize = norm(body.selectedSize);

    // Ensure cart exists
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });

    // Upsert item by unique composite key
    await prisma.cartItem.upsert({
      where: {
        cartId_productId_selectedColor_selectedSize: {
          cartId: cart.id,
          productId: body.productId,
          selectedColor,
          selectedSize,
        },
      },
      update: { quantity: { increment: qtyToAdd } },
      create: {
        cartId: cart.id,
        productId: body.productId,
        selectedColor,
        selectedSize,
        quantity: qtyToAdd,
      },
    });

    const items = await fetchCartItems(userId);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CartItemPayload & { action: string } = await request.json();
    const { action, productId } = body;

    if (!["increase", "decrease", "remove"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const qtyDelta = Number(body.quantity ?? 1);
    if (!Number.isFinite(qtyDelta) || qtyDelta <= 0) {
      return NextResponse.json(
        { error: "quantity must be a positive number" },
        { status: 400 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const selectedColor = norm(body.selectedColor);
    const selectedSize = norm(body.selectedSize);

    const key = {
      cartId: cart.id,
      productId,
      selectedColor,
      selectedSize,
    };

    if (action === "increase") {
      try {
        await prisma.cartItem.update({
          where: { cartId_productId_selectedColor_selectedSize: key },
          data: { quantity: { increment: qtyDelta } },
        });
      } catch (err: any) {
        if (isPrismaRecordNotFound(err)) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        throw err;
      }

      const items = await fetchCartItems(userId);
      return NextResponse.json({ success: true, items });
    }

    if (action === "remove") {
      try {
        await prisma.cartItem.delete({
          where: { cartId_productId_selectedColor_selectedSize: key },
        });
      } catch (err: any) {
        if (isPrismaRecordNotFound(err)) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        throw err;
      }

      const items = await fetchCartItems(userId);
      return NextResponse.json({ success: true, items });
    }

    // action === "decrease"
    try {
      await prisma.$transaction(async (tx) => {
        const item = await tx.cartItem.findUnique({
          where: { cartId_productId_selectedColor_selectedSize: key },
          select: { id: true, quantity: true },
        });

        if (!item) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const newQty = item.quantity - qtyDelta;

        if (newQty <= 0) {
          await tx.cartItem.delete({ where: { id: item.id } });
        } else {
          await tx.cartItem.update({
            where: { id: item.id },
            data: { quantity: newQty },
          });
        }
      });
    } catch (err: any) {
      // If transaction threw our response, return it
      if (err instanceof NextResponse) return err;
      console.error("PUT /api/cart decrease error:", err);
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }

    const items = await fetchCartItems(userId);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Make DELETE robust: handle missing JSON body safely
    let body: { action?: string } = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (body.action !== "clear") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) return NextResponse.json({ success: true, items: [] });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ success: true, items: [] });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}