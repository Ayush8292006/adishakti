import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart, Line,
} from 'recharts';
import {
  BarChart3, Package, Video, Users, LogOut, Download, Search, Plus, Minus, Upload, CheckCircle2, XCircle, Bell, Menu,
} from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import { Page } from '../../components/Reveal.jsx';
import { PRODUCTS, CATEGORIES, formatINR, isLowStock } from '../../data/products.js';
import { VIDEOS } from '../../data/videos.js';
import {
  ORDERS_WEEK, ORDER_STATUS, ORDER_CHANNELS, RECENT_ORDERS, SOLD, SALES_MONTHS, PAYMENT_MODES, PENDING_BILLS, PARTNER_REQUESTS,
} from '../../data/tally.js';
import './Admin.css';

const BROWN = '#5B2C1A';
const PINK = '#B8235A';
const PINK_L = '#E8A3BC';
const GOLD = '#C99A3B';
const PIE = [BROWN, PINK, PINK_L, GOLD];

const NAV = [
  { id: 'tally', label: 'Tally Dashboard', icon: BarChart3 },
  { id: 'stock', label: 'Products & Stock', icon: Package },
  { id: 'videos', label: 'Demo Videos', icon: Video },
  { id: 'partners', label: 'Partner Stores', icon: Users },
];

const statusClass = (s) => ({ Completed: 'ok', Pending: 'wait', Dispatched: 'info', Cancelled: 'bad', Overdue: 'bad', 'Due soon': 'wait', Sent: 'info', Reorder: 'bad', Watch: 'wait' }[s] || 'info');

function downloadCSV(name, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${name}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

const card = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

function Kpi({ label, value, note, tone = 'up', i }) {
  return (
    <motion.div className="kpi" {...card} transition={{ delay: i * 0.07, duration: 0.5 }} whileHover={{ y: -4 }}>
      <span>{label}</span>
      <b className="display">{value}</b>
      <small className={tone}>{note}</small>
    </motion.div>
  );
}

function Panel({ title, action, children, className = '', delay = 0 }) {
  return (
    <motion.section className={`panel ${className}`} {...card} transition={{ delay, duration: 0.55 }}>
      <div className="panel-head"><h2>{title}</h2>{action}</div>
      {children}
    </motion.section>
  );
}

function Table({ cols, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map((c) => <th key={c.k} className={c.right ? 'r' : ''}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}>
              {cols.map((c) => <td key={c.k} className={c.right ? 'r' : ''}>{c.render ? c.render(r) : r[c.k]}</td>)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tip = { contentStyle: { borderRadius: 12, border: '1px solid #EEDFD2', boxShadow: '0 10px 30px -12px rgba(62,31,20,.3)', fontSize: 13 } };

/* ---------------- TALLY ---------------- */
function Tally() {
  const [tab, setTab] = useState('orders');

  const productTally = useMemo(() => CATEGORIES.map((c) => {
    const items = PRODUCTS.filter((p) => p.category === c);
    return {
      name: c.replace('Decoration ', '').replace('Cake ', '').replace(' Materials', '').replace(' & Boards', ''),
      sold: items.reduce((s, p) => s + (SOLD[p.id] || 0), 0),
      available: items.reduce((s, p) => s + (p.stock || 0), 0),
    };
  }), []);
  const totalStock = PRODUCTS.reduce((s, p) => s + (p.stock || 0), 0);
  const totalSold = Object.values(SOLD).reduce((a, b) => a + b, 0);
  const lowStock = PRODUCTS.filter(isLowStock).sort((a, b) => a.stock - b.stock);
  const topSellers = Object.entries(SOLD).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([id, sold]) => ({ name: PRODUCTS.find((p) => p.id === Number(id)).name.split(' ').slice(0, 3).join(' '), sold }));

  const exportCurrent = () => {
    if (tab === 'orders') downloadCSV('order-tally', [['Order', 'Customer', 'Items', 'Amount', 'Status'], ...RECENT_ORDERS.map((o) => [o.id, o.customer, o.items, o.amount, o.status])]);
    if (tab === 'products') downloadCSV('product-tally', [['Product', 'Category', 'Stock', 'Unit', 'Sold'], ...PRODUCTS.map((p) => [p.name, p.category, p.stock ?? 'TBC', p.unit, SOLD[p.id] || 0])]);
    if (tab === 'billing') downloadCSV('billing-tally', [['Bill', 'Customer', 'Due', 'Amount', 'Status'], ...PENDING_BILLS.map((b) => [b.id, b.customer, b.due, b.amount, b.status])]);
  };

  return (
    <>
      <div className="view-head">
        <div>
          <h1 className="display">Tally Dashboard</h1>
          <p className="muted">November 2026 · sample figures until real orders come in</p>
        </div>
        <button className="btn btn-dark btn-sm" onClick={exportCurrent}><Download size={16} /> Export to Excel</button>
      </div>

      <div className="tabs" role="tablist" aria-label="Tally type">
        {[['orders', 'Order Tally'], ['products', 'Product Tally'], ['billing', 'Billing Tally']].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {tab === id && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {tab === 'orders' && (
            <>
              <div className="kpis">
                <Kpi i={0} label="Total orders" value="248" note="+12% vs October" />
                <Kpi i={1} label="Pending" value="37" note="9 older than 2 days" tone="warn" />
                <Kpi i={2} label="Completed" value="196" note="79% completion" />
                <Kpi i={3} label="Cancelled / returned" value="15" note="6% of orders" tone="warn" />
              </div>
              <div className="row">
                <Panel title="Orders per day · last 7 days" className="grow2" delay={0.1}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={ORDERS_WEEK} barCategoryGap="28%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D9" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} width={30} />
                      <Tooltip {...tip} cursor={{ fill: '#FBF5EE' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                      <Bar dataKey="completed" name="Completed" stackId="a" fill={BROWN} animationDuration={1200} />
                      <Bar dataKey="pending" name="Pending" stackId="a" fill={PINK_L} radius={[8, 8, 0, 0]} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
                <Panel title="Order status" className="grow1" delay={0.18}>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={ORDER_STATUS} dataKey="value" nameKey="name" innerRadius={64} outerRadius={100} paddingAngle={3} animationDuration={1200}>
                        {ORDER_STATUS.map((_, i) => <Cell key={i} fill={PIE[i]} />)}
                      </Pie>
                      <Tooltip {...tip} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
              <div className="row">
                <Panel title="Orders by channel" className="grow1" delay={0.22}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={ORDER_CHANNELS} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} tick={{ fill: '#3E1F14', fontSize: 13 }} />
                      <Tooltip {...tip} cursor={{ fill: '#FBF5EE' }} />
                      <Bar dataKey="value" name="Orders" fill={PINK} radius={[0, 8, 8, 0]} barSize={22} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
                <Panel title="Recent orders" className="grow2" delay={0.26}>
                  <Table
                    cols={[{ k: 'id', label: 'Order' }, { k: 'customer', label: 'Customer' }, { k: 'items', label: 'Items' }, { k: 'amount', label: 'Amount', right: true, render: (r) => formatINR(r.amount) }, { k: 'status', label: 'Status', render: (r) => <span className={`pill ${statusClass(r.status)}`}>{r.status}</span> }]}
                    rows={RECENT_ORDERS} />
                </Panel>
              </div>
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="kpis">
                <Kpi i={0} label="Products listed" value={PRODUCTS.length} note={`${PRODUCTS.filter((p) => p.isNew).length} new arrivals`} />
                <Kpi i={1} label="Units in stock" value={totalStock} note="From the store stock list" />
                <Kpi i={2} label="Units sold" value={totalSold} note="This month (sample)" />
                <Kpi i={3} label="Low stock items" value={lowStock.length} note="5 or fewer left" tone="warn" />
              </div>
              <div className="row">
                <Panel title="Sold vs available · by category" className="grow2" delay={0.1}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productTally} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D9" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} width={36} />
                      <Tooltip {...tip} cursor={{ fill: '#FBF5EE' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                      <Bar dataKey="sold" name="Sold" fill={PINK} radius={[6, 6, 0, 0]} animationDuration={1200} />
                      <Bar dataKey="available" name="Available" fill={BROWN} radius={[6, 6, 0, 0]} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
                <Panel title="Top selling products" className="grow1" delay={0.18}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topSellers} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={130} tick={{ fill: '#3E1F14', fontSize: 12 }} />
                      <Tooltip {...tip} cursor={{ fill: '#FBF5EE' }} />
                      <Bar dataKey="sold" name="Sold" fill={GOLD} radius={[0, 8, 8, 0]} barSize={18} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
              <Panel title="Low stock alerts · real stock" delay={0.22}>
                <Table
                  cols={[
                    { k: 'name', label: 'Product', render: (p) => <span className="cell-prod"><img src={p.img} alt="" />{p.name}</span> },
                    { k: 'category', label: 'Category' },
                    { k: 'unit', label: 'Unit' },
                    { k: 'stock', label: 'In stock', right: true },
                    { k: 'a', label: 'Action', render: (p) => <span className={`pill ${p.stock <= 2 ? 'bad' : 'wait'}`}>{p.stock <= 2 ? 'Reorder' : 'Watch'}</span> },
                  ]}
                  rows={lowStock} />
              </Panel>
            </>
          )}

          {tab === 'billing' && (
            <>
              <div className="kpis">
                <Kpi i={0} label="Total bills" value="231" note="GST invoices raised" />
                <Kpi i={1} label="Sales amount" value="₹1.86L" note="+9% vs October" />
                <Kpi i={2} label="Received" value="₹1.52L" note="82% collected" />
                <Kpi i={3} label="Pending payments" value="₹34,180" note="14 bills overdue" tone="warn" />
              </div>
              <div className="row">
                <Panel title="Sales amount · last 6 months" className="grow2" delay={0.1}>
                  <ResponsiveContainer width="100%" height={290}>
                    <ComposedChart data={SALES_MONTHS.map((m) => ({ ...m, total: m.received + m.pending }))}>
                      <defs>
                        <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BROWN} stopOpacity={0.95} /><stop offset="100%" stopColor={BROWN} stopOpacity={0.6} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D9" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B5143', fontSize: 12 }} width={48} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip {...tip} formatter={(v) => formatINR(v)} cursor={{ fill: '#FBF5EE' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                      <Bar dataKey="received" name="Received" stackId="s" fill="url(#gRec)" animationDuration={1200} />
                      <Bar dataKey="pending" name="Pending" stackId="s" fill={PINK_L} radius={[8, 8, 0, 0]} animationDuration={1200} />
                      <Line dataKey="total" name="Total sales" stroke={PINK} strokeWidth={3} dot={{ r: 4, fill: PINK }} animationDuration={1500} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Panel>
                <Panel title="Payment mode" className="grow1" delay={0.18}>
                  <ResponsiveContainer width="100%" height={290}>
                    <PieChart>
                      <Pie data={PAYMENT_MODES} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={3} animationDuration={1200}>
                        {PAYMENT_MODES.map((_, i) => <Cell key={i} fill={PIE[i]} />)}
                      </Pie>
                      <Tooltip {...tip} formatter={(v) => formatINR(v)} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Panel>
              </div>
              <Panel title="Pending payments" delay={0.22}>
                <Table
                  cols={[{ k: 'id', label: 'Bill no.' }, { k: 'customer', label: 'Customer' }, { k: 'due', label: 'Due date' }, { k: 'amount', label: 'Amount', right: true, render: (r) => formatINR(r.amount) }, { k: 'status', label: 'Status', render: (r) => <span className={`pill ${statusClass(r.status)}`}>{r.status}</span> }]}
                  rows={PENDING_BILLS} />
              </Panel>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/* ---------------- STOCK ---------------- */
function Stock() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [stock, setStock] = useState(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock])));
  const rows = PRODUCTS.filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  const bump = (id, d) => setStock((s) => ({ ...s, [id]: Math.max(0, (s[id] || 0) + d) }));

  return (
    <>
      <div className="view-head">
        <div><h1 className="display">Products &amp; Stock</h1><p className="muted">{PRODUCTS.length} products · update stock with + / −</p></div>
        <button className="btn btn-primary btn-sm"><Plus size={16} /> Add product</button>
      </div>
      <Panel title="All products" action={
        <div className="stock-filters">
          <label className="mini-search"><Search size={16} /><span className="sr-only">Search</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product" /></label>
          <label><span className="sr-only">Category</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)}><option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </label>
        </div>
      }>
        <Table
          cols={[
            { k: 'name', label: 'Product', render: (p) => <span className="cell-prod"><img src={p.img} alt="" /><span>{p.name}{p.isNew && <em className="new-tag">New</em>}{p.note && <small className="note">{p.note}</small>}</span></span> },
            { k: 'category', label: 'Category' },
            { k: 'seller', label: 'Seller' },
            { k: 'price', label: 'Price', right: true, render: (p) => formatINR(p.price) },
            { k: 'stock', label: 'Stock', render: (p) => (
              <span className="stepper">
                <button onClick={() => bump(p.id, -1)} aria-label={`Decrease ${p.name}`}><Minus size={14} /></button>
                <b className={stock[p.id] != null && stock[p.id] <= 5 ? 'low' : ''}>{stock[p.id] ?? 'TBC'}</b>
                <button onClick={() => bump(p.id, 1)} aria-label={`Increase ${p.name}`}><Plus size={14} /></button>
                <small>{p.unit}</small>
              </span>
            ) },
          ]}
          rows={rows} />
      </Panel>
    </>
  );
}

/* ---------------- VIDEOS ---------------- */
function Videos() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [linked, setLinked] = useState([41, 13, 8]);
  const [list, setList] = useState(VIDEOS);
  const [title, setTitle] = useState('Chocolate flowers with rose mould');

  const onFile = (f) => {
    setError('');
    if (!f) return;
    const url = URL.createObjectURL(f);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      if (v.duration > 125) { setError(`Video is ${Math.round(v.duration)}s. Please keep it under 2 minutes.`); setFile(null); }
      else setFile({ name: f.name, url, secs: Math.round(v.duration) });
    };
    v.src = url;
  };

  const publish = () => {
    if (!file) { setError('Choose a video file first.'); return; }
    const m = Math.floor(file.secs / 60); const s = String(file.secs % 60).padStart(2, '0');
    setList((l) => [{ id: 'new' + Date.now(), title, duration: `${m}:${s}`, category: 'Silicone Moulds', productIds: linked, poster: PRODUCTS.find((p) => p.id === linked[0])?.img, src: file.url }, ...l]);
    setFile(null);
  };

  return (
    <>
      <div className="view-head"><div><h1 className="display">Cake Demo Videos</h1><p className="muted">Up to 2 minutes each. Linked products decide which carts see the video.</p></div></div>
      <div className="row">
        <Panel title="Upload a new demo" className="grow1">
          <label className={`dropzone ${file ? 'has' : ''}`}>
            <input type="file" accept="video/mp4,video/*" className="sr-only" onChange={(e) => onFile(e.target.files[0])} />
            {file ? <video src={file.url} muted controls className="drop-preview" /> : (<><Upload size={30} /><b>Drop MP4 here or browse</b><small>Max 2:00 · up to 200 MB</small></>)}
          </label>
          {error && <p className="err">{error}</p>}
          <label className="afield"><span>Video title</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <div className="afield"><span>Linked products (tap to toggle)</span>
            <div className="link-chips">
              {PRODUCTS.slice(0, 46).filter((p) => ['Silicone Moulds', 'Packing Materials', 'Baking Tools'].includes(p.category)).slice(0, 14).map((p) => (
                <button key={p.id} type="button" className={`lchip ${linked.includes(p.id) ? 'on' : ''}`} onClick={() => setLinked((l) => l.includes(p.id) ? l.filter((x) => x !== p.id) : [...l, p.id])}>
                  {p.name.split(' ').slice(0, 3).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={publish}><Upload size={16} /> Publish video</button>
        </Panel>
        <Panel title={`Published videos (${list.length})`} className="grow1">
          <div className="vlist">
            <AnimatePresence initial={false}>
              {list.map((v) => (
                <motion.div key={v.id} layout className="vitem" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="vthumb"><img src={v.poster} alt="" /><small>{v.duration}</small></span>
                  <div><b>{v.title}</b><span>{v.productIds.length} linked products</span></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ---------------- PARTNERS ---------------- */
function Partners() {
  const [state, setState] = useState({});
  return (
    <>
      <div className="view-head"><div><h1 className="display">Partner Stores</h1><p className="muted">Approve a store before its products appear on the website and app.</p></div></div>
      <Panel title="New requests">
        {PARTNER_REQUESTS.map((r, i) => (
          <motion.div key={r.id} className="preq" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <span className="preq-av">P{i + 1}</span>
            <div className="preq-info"><b>{r.name}</b><span>{r.meta}</span></div>
            {state[r.id] ? (
              <span className={`pill ${state[r.id] === 'Approved' ? 'ok' : 'bad'}`}>{state[r.id]}</span>
            ) : (
              <div className="preq-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setState((s) => ({ ...s, [r.id]: 'Rejected' }))}><XCircle size={16} /> Reject</button>
                <button className="btn btn-sm btn-dark" onClick={() => setState((s) => ({ ...s, [r.id]: 'Approved' }))}><CheckCircle2 size={16} /> Approve</button>
              </div>
            )}
          </motion.div>
        ))}
      </Panel>
      <Panel title="Partner products live now" delay={0.15}>
        <div className="pp-grid">
          {PRODUCTS.filter((p) => p.seller !== 'Adi Shakti').map((p) => (
            <div key={p.id} className="pp"><img src={p.img} alt="" /><b>{p.name}</b><span>{formatINR(p.price)} · stock {p.stock}</span></div>
          ))}
        </div>
      </Panel>
    </>
  );
}

export default function Admin() {
  const [view, setView] = useState('tally');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Page className="admin">
      <aside className={`side ${menuOpen ? 'open' : ''}`}>
        <div className="side-top">
          <Logo light size={40} sub="SUPER ADMIN" />
          <button className="side-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu"><Menu size={20} /></button>
        </div>
        <nav>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMenuOpen(false); }}>
              {view === id && <motion.span layoutId="side-pill" className="side-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <Link to="/" className="side-logout"><LogOut size={18} /> Logout</Link>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <span className="muted">Adi Shakti Trader · Basavanagudi</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
            <span className="admin-av">AS</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="admin-inner">
            {view === 'tally' && <Tally />}
            {view === 'stock' && <Stock />}
            {view === 'videos' && <Videos />}
            {view === 'partners' && <Partners />}
          </motion.div>
        </AnimatePresence>
      </main>
    </Page>
  );
}
