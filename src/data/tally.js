// SAMPLE tally figures for the prototype. Replace with API data.
export const ORDERS_WEEK = [
  { day: 'Sat', completed: 24, pending: 4 },
  { day: 'Sun', completed: 31, pending: 6 },
  { day: 'Mon', completed: 18, pending: 5 },
  { day: 'Tue', completed: 22, pending: 3 },
  { day: 'Wed', completed: 27, pending: 7 },
  { day: 'Thu', completed: 35, pending: 5 },
  { day: 'Fri', completed: 39, pending: 7 },
];

export const ORDER_STATUS = [
  { name: 'Completed', value: 196 },
  { name: 'Pending', value: 37 },
  { name: 'Cancelled', value: 15 },
];

export const ORDER_CHANNELS = [
  { name: 'Website', value: 96 },
  { name: 'Mobile app', value: 118 },
  { name: 'Partner stores', value: 34 },
];

export const RECENT_ORDERS = [
  { id: '#AST-1042', customer: 'Home baker · Jayanagar', items: 'Nozzle set, Smoother ×2', amount: 487, status: 'Pending' },
  { id: '#AST-1041', customer: 'Bakery · Basavanagudi', items: 'Gold coin ×50, Crown ×5', amount: 1145, status: 'Completed' },
  { id: '#AST-1040', customer: 'Home baker · JP Nagar', items: 'Rose mould, Star mould', amount: 318, status: 'Completed' },
  { id: '#AST-1039', customer: 'Partner order', items: 'Fairy topper ×2', amount: 498, status: 'Dispatched' },
  { id: '#AST-1038', customer: 'Home baker · Banashankari', items: 'Butterfly topper ×10', amount: 590, status: 'Cancelled' },
  { id: '#AST-1037', customer: 'Bakery · Girinagar', items: 'Cake base 6" ×10, Dowels ×20', amount: 690, status: 'Completed' },
];

// sold counts per product id (sample) — available comes from real stock
export const SOLD = { 21: 96, 10: 58, 38: 31, 26: 19, 45: 22, 5: 14, 22: 11, 41: 9, 13: 18, 24: 12, 23: 30, 33: 8, 8: 6, 14: 3 };

export const SALES_MONTHS = [
  { month: 'Jun', received: 98000, pending: 8000 },
  { month: 'Jul', received: 112000, pending: 12000 },
  { month: 'Aug', received: 121000, pending: 10000 },
  { month: 'Sep', received: 134000, pending: 16000 },
  { month: 'Oct', received: 148000, pending: 22000 },
  { month: 'Nov', received: 152000, pending: 34180 },
];

export const PAYMENT_MODES = [
  { name: 'UPI', value: 92400 },
  { name: 'Cash', value: 38600 },
  { name: 'Credit', value: 34180 },
  { name: 'Card', value: 21300 },
];

export const PENDING_BILLS = [
  { id: 'INV-2611', customer: 'Bakery · Basavanagudi', due: '02 Nov 2026', amount: 8450, status: 'Overdue' },
  { id: 'INV-2618', customer: 'Bakery · Hanumanthnagar', due: '05 Nov 2026', amount: 6120, status: 'Overdue' },
  { id: 'INV-2624', customer: 'Partner store', due: '10 Nov 2026', amount: 4980, status: 'Due soon' },
  { id: 'INV-2627', customer: 'Home baker · Jayanagar', due: '12 Nov 2026', amount: 1340, status: 'Due soon' },
  { id: 'INV-2630', customer: 'Bakery · Girinagar', due: '15 Nov 2026', amount: 3760, status: 'Sent' },
];

export const PARTNER_REQUESTS = [
  { id: 'p1', name: 'Partner store request #1', meta: 'Cake toppers · 24 products · Bengaluru' },
  { id: 'p2', name: 'Partner store request #2', meta: 'Packing boxes · 12 products · Mysuru' },
  { id: 'p3', name: 'Partner store request #3', meta: 'Baking tools · 31 products · Bengaluru' },
];
