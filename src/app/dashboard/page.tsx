"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { popularProductsData, customerPreferenceData, hourlyDemandData } from "@/data/mock-bi-data";

export default function Dashboard() {
  const handleExport = () => {
    // Basic CSV export for popular products as an example
    const headers = ["Product Name,Sales Volume\n"];
    const rows = popularProductsData.map(p => `"${p.name}",${p.sales}\n`);
    const csvContent = headers.join("") + rows.join("");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "smart_brew_bi_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#0f0a07] text-[#f4ece6]">
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-24">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-light mb-2"
            >
              BI Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 font-light"
            >
              Real-time analytics and data visualizations for Smart Brew.
            </motion.p>
          </div>
          
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-coffee-card border border-coffee-border hover:border-coffee-accent hover:text-coffee-accent transition-colors rounded-xl text-sm font-medium tracking-wide text-white/70 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Popular Products</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularProductsData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(212, 163, 115, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 19, 16, 0.95)', 
                      border: '1px solid #d4a373', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      color: '#fff',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {popularProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#d4a373' : '#2d241f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Customer Preference Distribution</h3>
            <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 19, 16, 0.95)', 
                      border: '1px solid #d4a373', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      color: '#fff',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Pie
                    data={customerPreferenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {customerPreferenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-serif text-coffee-accent">100%</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Data</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {customerPreferenceData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chart 3: Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Hourly Demand Density</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyDemandData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d241f" vertical={false} />
                  <XAxis dataKey="time" stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 19, 16, 0.95)', 
                      border: '1px solid #d4a373', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      color: '#fff',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#d4a373" 
                    strokeWidth={3}
                    dot={{ fill: '#1a1310', stroke: '#d4a373', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#d4a373', stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
