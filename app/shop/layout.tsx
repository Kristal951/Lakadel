import Header from "@/components/shop/Header";
import SidebarFilters from "@/components/shop/Sidebar";
import TopBar from "@/components/shop/TopBar";
import React from "react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex w-full flex-1">
        <SidebarFilters />
        <main className="flex-1 ml-[20%] mt-30 p-4 ">{children}</main>
      </div>
    </div>
  );
}
