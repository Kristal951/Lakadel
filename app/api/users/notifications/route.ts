import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

<<<<<<< HEAD
export const runtime = "nodejs";
=======
export const runtime = "nodejs"; 
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get("take") ?? 50), 100);
  const cursor = searchParams.get("cursor");

  const [items, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        link: true,
        read: true,
        createdAt: true,
<<<<<<< HEAD
        orderId: true,
        order: {
          select: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
=======
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
      },
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
  ]);

  return NextResponse.json({
<<<<<<< HEAD
    items: items.map((n: any) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount,
    nextCursor: items.length ? items[items.length - 1].id : null,
  });
}
=======
    items: items.map((n: any) => ({ ...n, createdAt: n.createdAt.toISOString() })),
    unreadCount,
    nextCursor: items.length ? items[items.length - 1].id : null,
  });
}
>>>>>>> 8b38bdc11d52b30f7b87d401347bf1990c47fef1
