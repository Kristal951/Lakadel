import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs"; 

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
      },
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
  ]);

  return NextResponse.json({
    items: items.map((n: any) => ({ ...n, createdAt: n.createdAt.toISOString() })),
    unreadCount,
    nextCursor: items.length ? items[items.length - 1].id : null,
  });
}