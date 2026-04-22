"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { logInteraction } from "@/lib/bi-logger";
import { toast } from "sonner";
import Image from "next/image";

const products = [
  {
    id: "prod_001",
    name: "Midnight Cold Brew",
    description: "Steeped for 24 hours, delivering a smooth, bold profile with deep chocolate notes.",
    price: "$5.50",
    image: "/images/cold_brew.jpg"
  },
  {
    id: "prod_002",
    name: "Ethiopean Gold",
    description: "Light roast pour-over highlighting bright citrus acidity and floral jasmine aromas.",
    price: "$6.00",
    image: "/images/ethiopean_gold.jpg"
  },
  {
    id: "prod_003",
    name: "Oat Latte",
    description: "Rich espresso balanced beautifully with creamy oat milk and a touch of vanilla.",
    price: "$5.00",
    image: "/images/oat_latte.jpg"
  }
];

export function ProductList() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: typeof products[0], index: number }) {
  const handleAddToCart = () => {
    // 📊 BI TRIGGER: Logging ADD_TO_CART interaction
    logInteraction({
      product_id: product.id,
      interaction_type: "ADD_TO_CART"
    });
    toast.success(`${product.name} added to cart!`, {
      description: "BI interaction logged successfully.",
    });
  };

  const handleView = () => {
    // 📊 BI TRIGGER: Logging VIEW interaction
    logInteraction({
      product_id: product.id,
      interaction_type: "VIEW"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseEnter={handleView}
      className="group relative bg-coffee-card border border-coffee-border rounded-2xl p-6 md:p-8 hover:border-coffee-accent/50 transition-colors duration-500 flex flex-col h-full"
    >
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-[#0f0a07]">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-light tracking-wide mb-3">{product.name}</h3>
        <p className="text-white/50 font-light leading-relaxed mb-8">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-serif text-coffee-accent">{product.price}</span>
        <button 
          onClick={handleAddToCart}
          className="w-12 h-12 rounded-full border border-coffee-border flex items-center justify-center text-white/70 hover:text-coffee-accent hover:border-coffee-accent hover:bg-coffee-accent/10 transition-all duration-300 group-hover:scale-105 cursor-pointer"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
