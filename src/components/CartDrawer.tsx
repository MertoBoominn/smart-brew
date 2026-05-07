"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export function CartDrawer() {
  const { items, totalItems, totalPrice, isDrawerOpen, closeDrawer, removeItem, updateQuantity, completePurchase } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} onClick={closeDrawer} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[101] flex flex-col"
            style={{ background: "rgba(26, 19, 16, 0.75)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", borderLeft: "1px solid rgba(212, 163, 115, 0.15)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-coffee-accent" />
                <h2 className="text-lg font-light tracking-wide">Your Cart</h2>
                <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors duration-300 cursor-pointer" aria-label="Close cart"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-5"><ShoppingBag className="w-8 h-8 text-white/20" /></div>
                    <p className="text-white/40 font-light text-sm">Your cart is empty.</p>
                    <p className="text-white/20 text-xs mt-1">Browse our menu and add something delicious.</p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, scale: 0.95 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-coffee-accent/20 transition-colors duration-300">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#0f0a07]">
                        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-coffee-accent text-xs font-serif mt-0.5">${item.price.toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors duration-200 cursor-pointer" aria-label="Decrease quantity"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm w-6 text-center font-mono">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors duration-200 cursor-pointer" aria-label="Increase quantity"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-full text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-colors duration-200 cursor-pointer" aria-label="Remove item"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-sm font-light">Subtotal</span>
                  <span className="text-xl font-light">${totalPrice.toFixed(2)}</span>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={completePurchase} className="w-full py-4 rounded-xl font-medium tracking-wide text-sm transition-all duration-300 cursor-pointer relative overflow-hidden group" style={{ background: "linear-gradient(135deg, #d4a373 0%, #b8864e 100%)", color: "#0f0a07" }}>
                  <span className="relative z-10">COMPLETE PURCHASE</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <p className="text-center text-[10px] text-white/20 tracking-wider">📊 BI telemetry will log this transaction</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
