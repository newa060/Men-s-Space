import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AESTHETE | Monochrome Fashion",
  description: "Precision-cut essentials for the architecturally minded. Every piece a statement in restraint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary">
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
