import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Smart Brew | Data-Driven Coffee",
  description: "A Business Intelligence (BI) focused boutique coffee shop prototype.",
};

import { Toaster } from "@/components/Toaster";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CartIcon } from "@/components/CartIcon";
import { SuccessModal } from "@/components/SuccessModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartIcon />
          <CartDrawer />
          <SuccessModal />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
