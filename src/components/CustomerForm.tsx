"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { logCustomerPreference } from "@/lib/bi-logger";
import { toast } from "sonner";

export function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coffee_preference: "Strong" as 'Strong' | 'Smooth' | 'Milky',
    special_request: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 📊 BI TRIGGER: Form Submission
    logCustomerPreference(formData);
    toast.success("Preferences saved!", {
      description: "BI structured/unstructured data logs captured.",
    });
    setFormData({ name: "", email: "", coffee_preference: "Strong", special_request: "" });
  };

  return (
    <section className="py-24 px-4 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-coffee-card border border-coffee-border p-8 md:p-12 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-coffee-accent/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-light mb-2">Your Perfect Cup.</h2>
          <p className="text-white/50 mb-10 font-light">Tell us what you love, and let our BI engine curate your experience.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-coffee-border focus:border-coffee-accent outline-none py-2 transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-transparent border-b border-coffee-border focus:border-coffee-accent outline-none py-2 transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-xs uppercase tracking-widest text-white/60">Preference (Structured Data)</label>
              <select 
                className="w-full bg-[#0f0a07] border border-coffee-border rounded-lg p-3 outline-none focus:border-coffee-accent transition-colors appearance-none"
                value={formData.coffee_preference}
                onChange={e => setFormData({ ...formData, coffee_preference: e.target.value as any })}
              >
                <option value="Strong">Strong (Bold & Strong)</option>
                <option value="Smooth">Smooth (Smooth & Mellow)</option>
                <option value="Milky">Milky (Creamy & Milky)</option>
              </select>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest text-white/60">Special Request (Unstructured Data)</label>
                <span className="text-[10px] text-coffee-accent bg-coffee-accent/10 px-2 py-0.5 rounded">NLP Pipeline Ready</span>
              </div>
              <textarea 
                rows={3}
                placeholder="E.g., I usually like my coffee cold but with a hint of cinnamon..."
                className="w-full bg-transparent border border-coffee-border rounded-lg p-3 outline-none focus:border-coffee-accent transition-colors resize-none text-sm placeholder:text-white/20"
                value={formData.special_request}
                onChange={e => setFormData({ ...formData, special_request: e.target.value })}
              />
              <p className="text-xs text-white/40 italic">This field generates unstructured text data for future Natural Language Processing (NLP) analysis.</p>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-medium tracking-wide hover:bg-coffee-accent hover:text-white transition-all duration-300 cursor-pointer"
              >
                SAVE PREFERENCES
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
