"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { 
  customerPreferenceData, 
  hourlyDemandData,
} from "@/data/mock-bi-data";
import { getBIState, subscribeBIStore } from "@/lib/bi-store";
import { TrendingUp, TrendingDown, Minus, Coffee, Users, DollarSign, Clock, ShoppingCart } from "lucide-react";
import { useState, useEffect, useSyncExternalStore, useCallback } from "react";

// Hook to subscribe to the reactive BI store
function useBIStore() {
  const subscribe = useCallback((cb: () => void) => subscribeBIStore(cb), []);
  const getSnapshot = useCallback(() => getBIState(), []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default function Dashboard() {
  const biState = useBIStore();
  // Force re-render key when BI state changes (for recharts to pick up mutations)
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const unsub = subscribeBIStore(() => setRenderKey(k => k + 1));
    return unsub;
  }, []);

  const handleExport = () => {
    const headers = ["Product Name,Sales Volume\n"];
    const rows = biState.popularProducts.map(p => `"${p.name}",${p.sales}\n`);
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

  const kpiIcons = [DollarSign, ShoppingCart, Users, Clock];

  return (
    <main className="min-h-screen bg-[#0f0a07] text-[#f4ece6]">
      <Navbar />
      <div className="pt-28 px-2 md:px-8 max-w-7xl mx-auto pb-24">
        
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

        {/* KPI Section — uses reactive biState */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {biState.kpiData.map((kpi, index) => {
            const Icon = kpiIcons[index] || Coffee;
            return (
              <motion.div
                key={`${index}-${renderKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-coffee-card border border-coffee-border p-6 rounded-2xl relative overflow-hidden group hover:border-coffee-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-white/40 text-xs uppercase tracking-widest font-medium">{kpi.label}</span>
                  <div className="p-2 rounded-lg bg-white/5">
                    <Icon className="w-4 h-4 text-coffee-accent" />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-light">{kpi.value}</h2>
                  <div className={`flex items-center gap-1 text-xs mb-1 ${
                    kpi.trend === 'up' ? 'text-emerald-400' : 
                    kpi.trend === 'down' ? 'text-rose-400' : 'text-white/40'
                  }`}>
                    {kpi.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    {kpi.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                    {kpi.trend === 'neutral' && <Minus className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-coffee-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Popular Products — REACTIVE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium tracking-wide">Popular Products</h3>
              {biState.purchaseCompletedCount > 0 && (
                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              )}
            </div>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart key={`pop-${renderKey}`} data={biState.popularProducts} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(212, 163, 115, 0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(26, 19, 16, 0.95)', border: '1px solid #d4a373', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {biState.popularProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#d4a373' : '#2d241f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Pie Chart (static preferences) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Customer Preference Distribution</h3>
            <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(26, 19, 16, 0.95)', border: '1px solid #d4a373', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Pie data={customerPreferenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
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

          {/* Chart 3: Hourly Demand (static) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Hourly Demand Density</h3>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyDemandData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d241f" vertical={false} />
                  <XAxis dataKey="time" stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(26, 19, 16, 0.95)', border: '1px solid #d4a373', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#d4a373" strokeWidth={3} dot={{ fill: '#1a1310', stroke: '#d4a373', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#d4a373', stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 4: Weekly Revenue vs Target — REACTIVE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium tracking-wide">Weekly Revenue vs Target</h3>
                {biState.purchaseCompletedCount > 0 && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="w-3 h-3 rounded-sm bg-coffee-accent" /> Revenue
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="w-3 h-3 rounded-sm bg-white/10" /> Target
                </div>
              </div>
            </div>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart key={`rev-${renderKey}`} data={biState.weeklyRevenue} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d241f" vertical={false} />
                  <XAxis dataKey="day" stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#f4ece6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(212, 163, 115, 0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(26, 19, 16, 0.95)', border: '1px solid #d4a373', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#d4a373', marginBottom: '4px', fontWeight: '600' }}
                  />
                  <Bar dataKey="target" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#d4a373" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity — REACTIVE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium tracking-wide">Recent Activity</h3>
              {biState.purchaseCompletedCount > 0 && (
                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
              )}
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-widest">
                    <th className="pb-4 font-medium">Transaction ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {biState.recentTransactions.map((tx, i) => (
                    <tr key={`${tx.id}-${renderKey}`} className="border-b border-white/5 last:border-0 group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 text-coffee-accent font-mono">{tx.id}</td>
                      <td className="py-4 font-light">{tx.customer}</td>
                      <td className="py-4 font-light text-white/70">{tx.product}</td>
                      <td className="py-4 font-medium">{tx.amount}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 text-white/30 text-xs">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* NEW: Cart Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-coffee-card border border-coffee-border rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-medium mb-6 tracking-wide">Cart Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 text-xs uppercase tracking-widest">Add-to-Cart Events</span>
                <p className="text-2xl font-light mt-2">{biState.addToCartCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 text-xs uppercase tracking-widest">Purchases Completed</span>
                <p className="text-2xl font-light mt-2">{biState.purchaseCompletedCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-white/40 text-xs uppercase tracking-widest">Cart Abandonment Rate</span>
                <p className="text-2xl font-light mt-2">
                  {biState.addToCartCount > 0
                    ? `${(Math.max(0, (biState.addToCartCount - biState.purchaseCompletedCount) / biState.addToCartCount * 100)).toFixed(1)}%`
                    : "—"}
                </p>
              </div>
            </div>
            <p className="text-white/20 text-xs mt-4 italic">📊 Cart abandonment is computed in real-time: (ADD_TO_CART − PURCHASE_COMPLETED) / ADD_TO_CART</p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
