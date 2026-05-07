"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { logPurchase, logAddToCart } from "@/lib/bi-logger";
import { recordPurchase, recordAddToCart, type PurchaseItem } from "@/lib/bi-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number; // numeric price
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  isSuccessModalOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  completePurchase: () => void;
  closeSuccessModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Track if user had items when the tab/page unloads (cart abandonment signal)
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (itemsRef.current.length > 0) {
        // 📊 BI: Cart abandonment detected — user is leaving with items in cart
        console.log(
          "%c[BI DATA INGESTION] CART_ABANDONED:",
          "color: #ef4444; font-weight: bold",
          JSON.stringify({
            items: itemsRef.current.map(i => ({ name: i.name, qty: i.quantity })),
            timestamp: new Date().toISOString(),
          })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === newItem.id);
      if (existing) {
        return prev.map(i =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });

    // 📊 BI TRIGGER: ADD_TO_CART event
    logAddToCart(newItem.id, newItem.name);
    recordAddToCart();
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev =>
        prev.map(i => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const closeSuccessModal = useCallback(() => setIsSuccessModalOpen(false), []);

  const completePurchase = useCallback(() => {
    if (items.length === 0) return;

    const purchaseItems: PurchaseItem[] = items.map(i => ({
      productName: i.name,
      quantity: i.quantity,
      priceEach: i.price,
    }));

    // 📊 BI TRIGGER: PURCHASE_COMPLETED
    logPurchase(items, totalPrice);

    // 📊 Update the reactive BI store so Dashboard charts reflect the sale
    recordPurchase(purchaseItems, totalPrice);

    // Clear cart & show success
    setItems([]);
    setIsDrawerOpen(false);
    setIsSuccessModalOpen(true);
  }, [items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isDrawerOpen,
        isSuccessModalOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        completePurchase,
        closeSuccessModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
