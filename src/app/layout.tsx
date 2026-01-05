import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="min-h-screen font-mono selection:bg-black selection:text-white relative">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
