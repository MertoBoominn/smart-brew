"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coffee, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function SuccessModal() {
  const { isSuccessModalOpen, closeSuccessModal } = useCart();
  const confettiFired = useRef(false);

  useEffect(() => {
    if (isSuccessModalOpen && !confettiFired.current) {
      confettiFired.current = true;
      // Fire confetti burst from both sides
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200, colors: ['#d4a373', '#b8864e', '#f4ece6', '#2d241f'] };
      confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.6 } });
      confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.6 } });
      setTimeout(() => {
        confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.4 } });
      }, 250);
    }
    if (!isSuccessModalOpen) {
      confettiFired.current = false;
    }
  }, [isSuccessModalOpen]);

  return (
    <AnimatePresence>
      {isSuccessModalOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={closeSuccessModal} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-sm rounded-3xl p-8 text-center relative overflow-hidden"
              style={{ background: "rgba(26, 19, 16, 0.85)", backdropFilter: "blur(32px) saturate(200%)", border: "1px solid rgba(212, 163, 115, 0.2)" }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-coffee-accent/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="mx-auto w-16 h-16 rounded-full bg-coffee-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-coffee-accent" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-light tracking-wide">Order Received!</h3>
                  <div className="flex items-center justify-center gap-2 text-coffee-accent text-sm">
                    <Coffee className="w-4 h-4" />
                    <span className="font-serif italic">Your coffee is being prepared.</span>
                  </div>
                </div>

                <p className="text-white/40 text-xs leading-relaxed">Your purchase has been logged to our BI pipeline. Check the dashboard to see your impact on the analytics.</p>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={closeSuccessModal} className="w-full py-3 rounded-xl text-sm font-medium tracking-wide cursor-pointer transition-all duration-300 bg-white/5 border border-white/10 hover:border-coffee-accent/50 hover:text-coffee-accent">
                  CONTINUE BROWSING
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
