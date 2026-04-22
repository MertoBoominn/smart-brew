"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-coffee-card group-[.toaster]:text-foreground group-[.toaster]:border-coffee-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:bg-coffee-card/80",
          description: "group-[.toast]:text-white/50 font-light",
          actionButton: "group-[.toast]:bg-coffee-accent group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-white/50",
          success: "group-[.toast]:border-coffee-accent/50",
        },
      }}
    />
  );
}
