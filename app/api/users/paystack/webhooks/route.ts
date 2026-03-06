import crypto from "crypto";
import { NextResponse } from "next/server";
<<<<<<< HEAD
import { prisma } from "@/lib/prisma";
import { notifyUserRealtime } from "@/lib/notifyUserRealtime";
import { getNotificationForStatus } from "@/lib/getNotificationsForStatus";
import { clearCartForPayer, formatOrderNumber } from "@/lib/cartDB";
=======
import { notifyUserRealtime } from "@/lib/notifyUserRealtime";
import { getNotificationForStatus } from "@/lib/getNotificationsForStatus";
import { prisma } from "@/lib/prisma";

>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1

export const runtime = "nodejs";

function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (event?.event !== "charge.success") {
    return NextResponse.json({ ok: true });
  }

  const data = event.data;

  const orderId = data?.metadata?.orderId as string | undefined;
  const reference = data?.reference as string | undefined;
  const amountKobo = data?.amount as number | undefined;

  if (!orderId || !reference || typeof amountKobo !== "number") {
    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
<<<<<<< HEAD
    select: {
      id: true,
      userId: true,
      guestId: true,
      status: true,
      totalKobo: true,
      orderNumber: true,
    },
=======
    select: { id: true, userId: true, status: true, totalKobo: true },
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
  });

  if (!order) return NextResponse.json({ ok: true });

  if (order.totalKobo !== amountKobo) {
<<<<<<< HEAD
    const updatedFailed = await prisma.order.updateMany({
      where: { id: orderId, status: { notIn: ["PAID", "FAILED"] } },
      data: {
        status: "FAILED",
        paymentMethod: "PAYSTACK",
        paymentRef: reference,
      },
    });

    if (updatedFailed.count > 0 && order.userId) {
      const orderRef = formatOrderNumber(order.orderNumber);

      const notif = getNotificationForStatus("PENDING", {
        orderId: order.id,
        orderRef,
      });
      if (notif) {
        await notifyUserRealtime({
          userId: order.userId,
          ...notif,
          link: `/orders/${order.id}`,
        });
=======
    if (order.status !== "FAILED") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      if (order.userId) {
        const notif = getNotificationForStatus("FAILED", order.id);
        if (notif) {
          await notifyUserRealtime({
            userId: order.userId,
            ...notif,
            link: `/orders/${order.id}`,
          });
        }
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
      }
    }
    return NextResponse.json({ ok: true });
  }

<<<<<<< HEAD
  const didPay = await prisma.$transaction(async (tx) => {
    const updatedPaid = await tx.order.updateMany({
      where: { id: orderId, status: { not: "PAID" } },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paymentMethod: "PAYSTACK",
=======
  if (order.status !== "PAID") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
        paymentRef: reference,
      },
    });

<<<<<<< HEAD
    if (updatedPaid.count === 0) return false;

    await clearCartForPayer({
      tx: tx as any,
      userId: order.userId,
      guestId: order.guestId,
    });

    return true;
  });

  if (!didPay) return NextResponse.json({ ok: true });

  if (order.userId) {
    const orderRef = formatOrderNumber(order.orderNumber);

    const notif = getNotificationForStatus("PAID", {
      orderId: order.id,
      orderRef,
    });
    if (notif) {
      await notifyUserRealtime({
        userId: order.userId,
        ...notif,
        link: `/orders/${formatOrderNumber(order.orderNumber)}`,
      });
=======
    if (order.userId) {
      const notif = getNotificationForStatus("PAID", order.id);
      if (notif) {
        await notifyUserRealtime({
          userId: order.userId,
          ...notif,
          link: `/orders/${order.id}`,
        });
      }
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
    }
  }

  return NextResponse.json({ ok: true });
}