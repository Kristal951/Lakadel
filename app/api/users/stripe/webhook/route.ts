import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { notifyUserRealtime } from "@/lib/notifyUserRealtime";
import { getNotificationForStatus } from "@/lib/getNotificationsForStatus";
import { clearCartForPayer, formatOrderNumber } from "@/lib/cartDB";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature" },
      { status: 400 },
    );
  }

  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured: STRIPE_WEBHOOK_SECRET missing" },
      { status: 500 },
    );
  }

  let event: any;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // 1) Checkout completed (still useful, but not always the earliest signal)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const orderId =
        session?.metadata?.orderId || session?.client_reference_id || null;

      if (!orderId) {
        console.warn("Stripe session missing orderId");
        return NextResponse.json({ received: true });
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          guestId: true,
          orderNumber: true,
          status: true,
        },
      });

      if (!order) return NextResponse.json({ received: true });

      const didPay = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: orderId, status: { not: "PAID" } },
          data: {
            status: "PAID",
            paidAt: new Date(),
            paymentMethod: "STRIPE",
            paymentRef: paymentIntentId || session.id,
          },
        });

        if (updated.count === 0) return false;

        await clearCartForPayer({
          tx: tx as any,
          userId: order.userId,
          guestId: order.guestId,
        });

        return true;
      });

      if (didPay && order.userId) {
        const orderRef = formatOrderNumber(order.orderNumber);

        const notif = getNotificationForStatus("PAID", {
          orderId: order.id,
          orderRef,
        });

        if (notif) {
          await notifyUserRealtime({
            userId: order.userId,
            ...notif,
            link: `/orders/${order.id}`,
          });
        }
      }
    }

    // 2) Payment intent succeeded (often the most reliable “paid” signal)
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as any;

      const orderId = pi?.metadata?.orderId ?? null;
      if (!orderId) return NextResponse.json({ received: true });

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          guestId: true,
          orderNumber: true,
          status: true,
        },
      });

      if (!order) return NextResponse.json({ received: true });

      const didPay = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: orderId, status: { not: "PAID" } },
          data: {
            status: "PAID",
            paidAt: new Date(),
            paymentMethod: "STRIPE",
            paymentRef: typeof pi.id === "string" ? pi.id : undefined,
          },
        });

        if (updated.count === 0) return false;

        await clearCartForPayer({
          tx: tx as any,
          userId: order.userId,
          guestId: order.guestId,
        });

        return true;
      });

      if (didPay && order.userId) {
        const orderRef = formatOrderNumber(order.orderNumber);

        const notif = getNotificationForStatus("PAID", {
          orderId: order.id,
          orderRef,
        });

        if (notif) {
          await notifyUserRealtime({
            userId: order.userId,
            ...notif,
            link: `/orders/${order.id}`,
          });
        }
      }
    }

    // 3) Payment failed
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as any;

      const orderId = pi?.metadata?.orderId ?? null;
      if (!orderId) return NextResponse.json({ received: true });

      const updated = await prisma.order.updateMany({
        where: { id: orderId, status: { not: "PAID" } },
        data: {
          status: "FAILED",
          paymentMethod: "STRIPE",
          paymentRef: typeof pi.id === "string" ? pi.id : undefined,
        },
      });

      if (updated.count === 0) return NextResponse.json({ received: true });

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, userId: true, orderNumber: true },
      });

      if (order?.userId) {
        const orderRef = formatOrderNumber(order.orderNumber);

        const notif = getNotificationForStatus("FAILED", {
          orderId: order.id,
          orderRef,
        });

        if (notif) {
          await notifyUserRealtime({
            userId: order.userId,
            ...notif,
            link: `/orders/${order.id}`,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler failed:", err?.message);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}