"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { totalItems, openDrawer } = useCart();

  return (
    <motion.button
      onClick={openDrawer}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-colors duration-300 group"
      style={{
        background: "linear-gradient(135deg, #d4a373 0%, #b8864e 100%)",
        boxShadow: "0 8px 32px rgba(212, 163, 115, 0.3), 0 0 0 1px rgba(212, 163, 115, 0.1)",
      }}
      aria-label="Open shopping cart"
    >
      <ShoppingBag className="w-5 h-5 text-[#0f0a07] group-hover:scale-110 transition-transform duration-300" />

      {/* Badge */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg"
          >
            {totalItems > 9 ? "9+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse ring on non-empty */}
      {totalItems > 0 && (
        <span className="absolute inset-0 rounded-full animate-ping bg-coffee-accent/20 pointer-events-none" style={{ animationDuration: "2s" }} />
      )}
    </motion.button>
  );
}
