"use client";

import Link from "next/link";
import { Coffee, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
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
          <div className="flex gap-6 items-center text-sm font-medium tracking-wider">
            <Link href="/" className="hover:text-coffee-accent transition-colors duration-300">HOME</Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-coffee-accent bg-coffee-card px-4 py-2 rounded-full hover:bg-coffee-border transition-colors duration-300">
              <BarChart3 className="w-4 h-4" />
              <span>BI DASHBOARD</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
