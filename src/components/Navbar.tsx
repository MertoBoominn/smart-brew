"use client";

import Link from "next/link";
import { Coffee, BarChart3, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { totalItems, openDrawer } = useCart();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#0f0a07]/80 backdrop-blur-md border-b border-coffee-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Coffee className="w-6 h-6 text-coffee-accent group-hover:scale-110 transition-transform duration-500" />
            <span className="font-semibold text-xl tracking-widest uppercase">Smart Brew</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center text-sm font-medium tracking-wider">
            <Link href="/" className="hover:text-coffee-accent transition-colors duration-300">HOME</Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-coffee-accent bg-coffee-card px-4 py-2 rounded-full hover:bg-coffee-border transition-colors duration-300 cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              <span>BI DASHBOARD</span>
            </Link>
            <button
              onClick={openDrawer}
              className="relative p-2 text-white/70 hover:text-coffee-accent transition-colors duration-300 cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coffee-accent text-[9px] font-bold flex items-center justify-center text-[#0f0a07]">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden gap-3 items-center">
            <button
              onClick={openDrawer}
              className="relative p-2 text-white/70 hover:text-coffee-accent transition-colors duration-300 cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coffee-accent text-[9px] font-bold flex items-center justify-center text-[#0f0a07]">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <Link href="/dashboard" className="p-2 text-coffee-accent bg-coffee-card rounded-full border border-coffee-border" aria-label="Dashboard">
              <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
