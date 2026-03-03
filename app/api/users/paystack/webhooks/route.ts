import crypto from "crypto";
import { NextResponse } from "next/server";
import { notifyUserRealtime } from "@/lib/notifyUserRealtime";
import { getNotificationForStatus } from "@/lib/getNotificationsForStatus";
import { prisma } from "@/lib/prisma";


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

  const event = JSON.parse(rawBody);

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
    select: { id: true, userId: true, status: true, totalKobo: true },
  });

  if (!order) return NextResponse.json({ ok: true });

  if (order.totalKobo !== amountKobo) {
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
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (order.status !== "PAID") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paymentRef: reference,
      },
    });

    if (order.userId) {
      const notif = getNotificationForStatus("PAID", order.id);
      if (notif) {
        await notifyUserRealtime({
          userId: order.userId,
          ...notif,
          link: `/orders/${order.id}`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}