import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { CartItemPayload } from "@/store/types";
import { getGuestId, ensureGuestId } from "@/lib/guest";

export const runtime = "nodejs"; // Prisma needs node runtime

const DEFAULT_VARIANT = "__DEFAULT__";
const norm = (v?: string | null) => (v && v.trim() ? v.trim() : DEFAULT_VARIANT);

type CartOwner = { userId: string; guestId?: never } | { guestId: string; userId?: never };

// Read session userId if present
async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

// For GET: do NOT create guestId
async function getCartOwnerForRead(): Promise<CartOwner | null> {
  const userId = await getUserId();
  if (userId) return { userId };

  const guestId = await getGuestId(); // ✅ no ensure
  if (!guestId) return null;

  return { guestId };
}

// For POST/PUT/DELETE: create guestId ONLY if needed
async function getCartOwnerForWrite(): Promise<CartOwner> {
  const userId = await getUserId();
  if (userId) return { userId };

  const guestId = await ensureGuestId(); // ✅ creates only on write
  return { guestId };
}

async function fetchCartItems(owner: CartOwner) {
  const cart = await prisma.cart.findUnique({
    where: "userId" in owner ? { userId: owner.userId } : { guestId: owner.guestId },
    include: {
      items: {
        orderBy: { id: "desc" },
        include: { product: true },
      },
    },
  });

  return cart?.items ?? [];
}

function isPrismaRecordNotFound(err: any) {
  return err?.code === "P2025";
}

export async function GET() {
  try {
    const owner = await getCartOwnerForRead();
    if (!owner) return NextResponse.json({ items: [] }); // ✅ guests with no cookie: empty cart

    const items = await fetchCartItems(owner);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const owner = await getCartOwnerForWrite();

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

    // Ensure cart exists for user OR guest
    const cart = await prisma.cart.upsert({
      where: "userId" in owner ? { userId: owner.userId } : { guestId: owner.guestId },
      update: {},
      create: "userId" in owner ? { userId: owner.userId } : { guestId: owner.guestId },
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

    const items = await fetchCartItems(owner);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const owner = await getCartOwnerForWrite();

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
      where: "userId" in owner ? { userId: owner.userId } : { guestId: owner.guestId },
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

      const items = await fetchCartItems(owner);
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

      const items = await fetchCartItems(owner);
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
          // NOTE: inside transaction, throw to escape
          throw Object.assign(new Error("Item not found"), { statusCode: 404 });
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
      if (err?.statusCode === 404) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      console.error("PUT /api/cart decrease error:", err);
      return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }

    const items = await fetchCartItems(owner);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const owner = await getCartOwnerForWrite();

    // handle missing JSON body safely
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
      where: "userId" in owner ? { userId: owner.userId } : { guestId: owner.guestId },
      select: { id: true },
    });

    if (!cart) return NextResponse.json({ success: true, items: [] });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ success: true, items: [] });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}