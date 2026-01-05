import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen font-mono selection:bg-black selection:text-white relative">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-9xl font-black tracking-tighter">404</h1>
          <p className="text-2xl mt-4">Page Not Found</p>
          <p className="mt-2 text-lg">
            Oops! The page you are looking for does not exist.
          </p>
          <Link href="/" className="mt-8 flex items-center gap-2 font-bold uppercase border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            Return to HQ
          </Link>
        </div>
      </body>
    </html>
  );
}
