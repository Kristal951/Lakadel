import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect("/auth/login");
  if (role !== "ADMIN") redirect("/shop");

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-background">{children}</main>
    </div>
  );
}
