import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

  if (event?.event === "charge.success") {
    const data = event.data;

    const orderId = data?.metadata?.orderId as string | undefined;
    const reference = data?.reference as string | undefined;
    const amountKobo = data?.amount as number | undefined;

    if (!orderId || !reference || typeof amountKobo !== "number") {
      return NextResponse.json({ ok: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ ok: true });

    // Validate amount (prevents underpayment / tampering)
    if (order.totalKobo !== amountKobo) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ ok: true });
    }

    // Idempotency: don't re-update paid orders
    if (order.status !== "PAID") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
          paymentRef: reference,
        },
      });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
