"use client";

import "./globals.css";
import EnergyFieldController from "@/components/Organisms/EnergyFieldBackground/EnergyField.controller";

export default function NotFoundLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="min-h-screen font-mono selection:bg-black selection:text-white relative">
        <EnergyFieldController />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
