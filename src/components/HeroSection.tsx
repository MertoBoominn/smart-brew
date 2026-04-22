"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Image 
        src="/images/hero.jpg" 
        alt="Smart Brew Hero" 
        fill 
        sizes="100vw"
        className="object-cover opacity-30 z-0" 
        priority 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0a07] z-10" />
      {/* Abstract dark shapes / glow for premium cafe feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coffee-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-coffee-border bg-coffee-card/50 text-xs tracking-widest text-coffee-accent mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-coffee-accent animate-pulse" />
          DATA-DRIVEN BREWING
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-7xl font-light tracking-tight mb-6 leading-[1.1]"
        >
          Crafting the perfect cup, <br className="hidden md:block" />
          <span className="italic text-coffee-accent font-serif">optimized by data.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed"
        >
          Smart Brew leverages advanced Business Intelligence to understand your preferences, ensuring every roast and pour matches exactly what you crave.
        </motion.p>
      </div>
    </section>
  );
}
