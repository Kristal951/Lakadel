import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { paystackInitialize } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = typeof body?.orderId === "string" ? body.orderId : "";

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const baseUrl =
      process.env.PAYSTACK_CALLBACK_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      throw new Error("Missing PAYSTACK_CALLBACK_URL or NEXT_PUBLIC_APP_URL");
    }

    const callbackUrl =
      baseUrl.replace(/\/$/, "") + `/success?orderId=${orderId}`;

    if (!callbackUrl || callbackUrl.includes("undefined")) {
      return NextResponse.json(
        { error: "PAYSTACK_CALLBACK_URL is not set" },
        { status: 500 },
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          select: {
            id: true,
            status: true,
            customerEmail: true,
            totalKobo: true,
            paymentRef: true,
          },
        });

        if (!order) {
          return { kind: "not_found" as const };
        }

        if (order.status === "PAID") {
          return { kind: "already_paid" as const };
        }
        if (order.paymentRef) {
          return { kind: "reuse" as const, reference: order.paymentRef };
        }

        const init = await paystackInitialize({
          email: order.customerEmail,
          amountKobo: order.totalKobo,
          callback_url: callbackUrl,
          metadata: { orderId: order.id, app: "Lakadel" },
        });

        const reference = init?.data?.reference as string | undefined;
        const authorization_url = init?.data?.authorization_url as
          | string
          | undefined;

        if (!reference || !authorization_url) {
          throw new Error("Paystack initialize did not return reference/url");
        }

        await tx.order.update({
          where: { id: order.id },
          data: { paymentRef: reference },
        });

        return {
          kind: "new" as const,
          reference,
          authorization_url,
        };
      },
      { maxWait: 10_000, timeout: 20_000 },
    );

    if (result.kind === "not_found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (result.kind === "already_paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 },
      );
    }
    if (result.kind === "reuse") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          customerEmail: true,
          totalKobo: true,
          id: true,
          paymentRef: true,
        },
      });

      const init = await paystackInitialize({
        email: order!.customerEmail,
        amountKobo: order!.totalKobo,
        callback_url: callbackUrl,
        metadata: { orderId, app: "Lakadel", reuse: true },
      });

      const authorization_url = init?.data?.authorization_url as
        | string
        | undefined;
      return NextResponse.json({
        reference: order!.paymentRef,
        authorization_url,
        reused: true,
      });
    }

    return NextResponse.json({
      authorization_url: result.authorization_url,
      reference: result.reference,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to initialize Paystack" },
      { status: 500 },
    );
  }
}
