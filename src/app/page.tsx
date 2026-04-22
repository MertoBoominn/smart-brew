import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductList } from "@/components/ProductList";
import { CustomerForm } from "@/components/CustomerForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0a07] text-[#f4ece6]">
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-coffee-border to-transparent max-w-5xl mx-auto my-12" />
        
        <ProductList />
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-coffee-border to-transparent max-w-5xl mx-auto my-12" />
        
        <CustomerForm />
      </div>
      
      <footer className="py-12 text-center text-white/30 text-xs font-light tracking-widest mt-24 border-t border-coffee-border/50">
        <p>SMART BREW © {new Date().getFullYear()} - DATA DRIVEN COFFEE EXPERIENCES.</p>
      </footer>
    </main>
  );
}
