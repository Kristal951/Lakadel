import crypto from "crypto";
import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

function verifyPaystackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");

  // IMPORTANT: Use RAW body for signature verification
  const rawBody = await req.text();

  const valid = verifyPaystackSignature(rawBody, signature);
  if (!valid) {
    // Return 400 so invalid signatures are rejected
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  /**
   * Paystack sends different event types.
   * Common one for successful payment is:
   *  event.event === "charge.success"
   */
  if (event?.event === "charge.success") {
    const data = event.data;

    const reference = data?.reference;
    const amount = data?.amount; // in kobo
    const currency = data?.currency;

    const orderId = data?.metadata?.orderId;

    // Basic validation
    if (!reference || !orderId) {
      return NextResponse.json({ ok: true }); // acknowledge but do nothing
    }

    /**
     * ✅ IDEMPOTENCY:
     * Only mark paid if not already paid.
     * You should store reference on the order so repeats are harmless.
     */
    // Example logic (Prisma):
    // const order = await prisma.order.findUnique({ where: { id: orderId } });
    // if (!order) return NextResponse.json({ ok: true });
    // if (order.status !== "PAID") {
    //   await prisma.order.update({
    //     where: { id: orderId },
    //     data: {
    //       status: "PAID",
    //       paidAt: new Date(),
    //       paymentProvider: "PAYSTACK",
    //       paymentReference: reference,
    //       amountPaid: amount,
    //       currency,
    //     },
    //   });
    // }

    // Optional: also validate amount matches your order total (recommended)
    // if (amount !== order.totalAmountKobo) reject or flag for review

    return NextResponse.json({ ok: true });
  }

  // For other events, just acknowledge
  return NextResponse.json({ ok: true });
}
