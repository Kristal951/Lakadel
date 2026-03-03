import { prisma } from "@/lib/prisma";

export async function notifyUserRealtime(input: {
  userId: string;
  title: string;
  message: string;
  action: string;
  type?: string;
  link?: string;
}) {
  const n = await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type ?? "INFO",
      link: input.link,
      action: input.action
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
          title: n.title,
          message: n.message,
          type: n.type,
          link: n.link,
          read: n.read,
          action: n.action,
          createdAt: n.createdAt.toISOString(),
        },
      }),
    });
  } catch (err){
    console.log(err)
  }

  return n;
}