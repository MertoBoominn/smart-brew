/**
 * Smart Brew BI Reactive Store
 * 
 * A lightweight pub/sub store that bridges the Shopping Cart and BI Dashboard.
 * When a purchase is completed, this store mutates the dashboard data sets
 * and notifies all subscribers (i.e., the Dashboard page) to re-render.
 * 
 * This simulates a real-time data pipeline where transactional events
 * flow into the analytics layer immediately.
 */

// ─── Base Data ────────────────────────────────────────────────────────────────

const basePopularProducts = [
  { name: 'Midnight Cold Brew', sales: 420 },
  { name: 'Ethiopean Gold', sales: 380 },
  { name: 'Oat Latte', sales: 510 },
  { name: 'Caramel Macchiato', sales: 290 },
];

const baseWeeklyRevenue = [
  { day: 'Mon', revenue: 1200, target: 1000 },
  { day: 'Tue', revenue: 1400, target: 1000 },
  { day: 'Wed', revenue: 1100, target: 1000 },
  { day: 'Thu', revenue: 1800, target: 1000 },
  { day: 'Fri', revenue: 2200, target: 1500 },
  { day: 'Sat', revenue: 2600, target: 2000 },
  { day: 'Sun', revenue: 2100, target: 2000 },
];

const baseRecentTransactions = [
  { id: 'TX-9012', customer: 'Alex Johnson', product: '1 Midnight Cold Brew', amount: '$6.50', status: 'Completed' as const, time: '2 mins ago' },
  { id: 'TX-9011', customer: 'Sarah Miller', product: '2 Oat Latte', amount: '$7.20', status: 'Completed' as const, time: '5 mins ago' },
  { id: 'TX-9010', customer: 'Michael Chen', product: '1 Ethiopean Gold', amount: '$5.50', status: 'Processing' as const, time: '12 mins ago' },
  { id: 'TX-9009', customer: 'Elena Rodriguez', product: '1 Caramel Macchiato', amount: '$8.00', status: 'Completed' as const, time: '25 mins ago' },
];

const baseKpiData = [
  { label: 'Total Revenue', value: '$12,450', change: '+12.5%', trend: 'up' as const },
  { label: 'Avg. Order Value', value: '$8.50', change: '-2.1%', trend: 'down' as const },
  { label: 'Customer Retention', value: '78%', change: '+5.4%', trend: 'up' as const },
  { label: 'Peak Hour', value: '10:00 AM', change: 'Steady', trend: 'neutral' as const },
];

// ─── Immutable Store State ─────────────────────────────────────────────────────
// React's useSyncExternalStore freezes returned snapshots in dev mode,
// so every update MUST produce a brand-new state object.

export interface BIStoreState {
  popularProducts: { name: string; sales: number }[];
  weeklyRevenue: { day: string; revenue: number; target: number }[];
  recentTransactions: { id: string; customer: string; product: string; amount: string; status: 'Completed' | 'Processing'; time: string }[];
  kpiData: { label: string; value: string; change: string; trend: 'up' | 'down' | 'neutral' }[];
  totalRevenueRaw: number;
  addToCartCount: number;
  purchaseCompletedCount: number;
}

type Listener = () => void;

function createInitialState(): BIStoreState {
  return {
    popularProducts: basePopularProducts.map(p => ({ ...p })),
    weeklyRevenue: baseWeeklyRevenue.map(w => ({ ...w })),
    recentTransactions: baseRecentTransactions.map(t => ({ ...t })),
    kpiData: baseKpiData.map(k => ({ ...k })),
    totalRevenueRaw: 12450,
    addToCartCount: 0,
    purchaseCompletedCount: 0,
  };
}

let state: BIStoreState = createInitialState();
const listeners = new Set<Listener>();

/** Replace the current state with a new object and notify all subscribers. */
function setState(next: BIStoreState) {
  state = next;
  listeners.forEach(fn => fn());
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBIState(): BIStoreState {
  return state;
}

export function subscribeBIStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export interface PurchaseItem {
  productName: string;
  quantity: number;
  priceEach: number;
}

/**
 * Records a completed purchase into the BI store (immutable).
 * Updates: popular product sales, weekly revenue, recent transactions, KPIs.
 */
export function recordPurchase(items: PurchaseItem[], totalValue: number) {
  const prev = state;

  // 1) Update popular product sales — produce new array
  const popularProducts = prev.popularProducts.map(p => {
    const match = items.find(i => i.productName === p.name);
    return match ? { ...p, sales: p.sales + match.quantity } : { ...p };
  });

  // 2) Update today's weekly revenue — produce new array
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const weeklyRevenue = prev.weeklyRevenue.map(w =>
    w.day === today ? { ...w, revenue: w.revenue + Math.round(totalValue * 100) } : { ...w }
  );

  // 3) Add new transaction to the front — produce new array
  const txId = `TX-${9012 + prev.recentTransactions.length + 1}`;
  const productSummary = items.map(i => `${i.quantity} ${i.productName}`).join(', ');
  const newTx = {
    id: txId,
    customer: 'You',
    product: productSummary,
    amount: `$${totalValue.toFixed(2)}`,
    status: 'Completed' as const,
    time: 'Just now',
  };
  const recentTransactions = [newTx, ...prev.recentTransactions.map(t => ({ ...t }))].slice(0, 6);

  // 4) Update KPI: Total Revenue
  const newTotalRevenue = prev.totalRevenueRaw + totalValue;
  const purchaseCompletedCount = prev.purchaseCompletedCount + 1;

  // 5) Build new KPI array with updated values
  const kpiData = computeKpiData(
    newTotalRevenue,
    prev.addToCartCount,
    purchaseCompletedCount,
    prev.kpiData,
  );

  setState({
    popularProducts,
    weeklyRevenue,
    recentTransactions,
    kpiData,
    totalRevenueRaw: newTotalRevenue,
    addToCartCount: prev.addToCartCount,
    purchaseCompletedCount,
  });
}

/**
 * Increments the ADD_TO_CART counter for abandonment tracking (immutable).
 */
export function recordAddToCart() {
  const prev = state;
  const addToCartCount = prev.addToCartCount + 1;

  const kpiData = computeKpiData(
    prev.totalRevenueRaw,
    addToCartCount,
    prev.purchaseCompletedCount,
    prev.kpiData,
  );

  setState({ ...prev, addToCartCount, kpiData });
}

/** Recompute KPI array with cart abandonment in slot [1]. */
function computeKpiData(
  totalRevenue: number,
  addToCartCount: number,
  purchaseCount: number,
  prevKpi: BIStoreState['kpiData'],
) {
  const kpi = prevKpi.map(k => ({ ...k }));

  // Slot 0 — Total Revenue
  kpi[0] = { ...kpi[0], value: `$${totalRevenue.toLocaleString('en-US')}` };

  // Slot 1 — Cart Abandonment Rate
  if (addToCartCount > 0) {
    const abandoned = addToCartCount - purchaseCount;
    const rate = Math.max(0, (abandoned / addToCartCount) * 100);
    kpi[1] = {
      label: 'Cart Abandon Rate',
      value: `${rate.toFixed(1)}%`,
      change: rate > 50 ? 'High' : rate > 20 ? 'Medium' : 'Low',
      trend: rate > 50 ? 'down' : rate > 20 ? 'neutral' : 'up',
    };
  }

  return kpi;
}
