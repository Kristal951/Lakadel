import { prisma } from "@/lib/prisma";
import { CreateNotificationInput } from "@/store/types";

export async function notifyUserRealtime(input: CreateNotificationInput) {
  const n = await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type ?? "INFO",
      link: input.link,
      action: input.action,
      orderId: input.orderId,
      status: input.status,
    },
  });

  try {
    await fetch(process.env.SOCKET_EMIT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": process.env.SOCKET_INTERNAL_KEY!,
      },
      body: JSON.stringify({
        userId: input.userId,
        notification: {
          id: n.id,
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type,
          action: n.action,
          link: n.link,
          orderId: n.orderId,
          status: n.status,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        },
      }),
    });
  } catch (err) {
    console.log(err);
  }

  return n;
}
