"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Theme } from "@/Theme";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const getPageTitle = () => {
    const pathSegment = pathname?.split("/")[1];
    if (!pathSegment) return "";
    // Capitalize the first letter of the segment
    return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
  };

  const pageTitle = getPageTitle();

  return (
    <>
      <nav className="border-b-4 border-black p-4 sticky top-0 z-50 flex justify-between items-center relative" style={{ backgroundColor: Theme.colors.yellow[400] }}>
        <Link
          href="/"
          className="flex items-center gap-2 font-bold uppercase border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <ArrowLeft size={16} /> Back to HQ
        </Link>
        {pageTitle && (
          <span className="font-black uppercase text-lg tracking-tighter hidden md:block">
            Mohak Sharma / {pageTitle}
          </span>
        )}
      </nav>
      {children}
    </>
  );
}
