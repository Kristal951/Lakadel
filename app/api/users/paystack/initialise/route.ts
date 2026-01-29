import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { paystackInitialize } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    console.log(orderId)
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    console.log(order)
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (order.status === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const init = await paystackInitialize({
      email: order.customerEmail,
      amountKobo: order.totalKobo,
      callback_url: process.env.PAYSTACK_CALLBACK_URL!,
      metadata: { orderId: order.id, app: "Lakadel" },
    });

    const reference = init.data.reference;
    const authorization_url = init.data.authorization_url;

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: reference },
    });

    return NextResponse.json({ authorization_url, reference });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to initialize Paystack" },
      { status: 500 }
    );
  }
}
