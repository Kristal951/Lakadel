'use client'
import { usePathname } from "next/navigation";

export default function BreadCrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center space-x-2 text-gray-600 text-sm">
      <span className="text-[#B10E0E]/50 cursor-pointer">Home</span>
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1;
        return (
          <span
            key={idx}
            className={
              isLast
                ? "font-semibold text-[#B10E0E]"
                : "text-[#B10E0E]/40 cursor-pointer"
            }
          >
            <span>›</span> {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </span>
        );
      })}
    </div>
  );
}
