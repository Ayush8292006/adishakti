import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { LayoutDashboard, ShoppingCart, Package, Wallet, Bell, Plus, Pencil, X, ImagePlus, CheckCircle2, TrendingUp, Clock, LogOut } from 'lucide-react';
import PhoneFrame from '../../components/PhoneFrame.jsx';
import { Page } from '../../components/Reveal.jsx';
import { PRODUCTS, CATEGORIES, formatINR } from '../../data/products.js';
import './PartnerApp.css';

const TABS = [
  { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
];

// SAMPLE partner data for the prototype
const EARN = {
  week: { total: 8640, delta: '+18% vs last week', orders: 14, data: [{ d: 'Sat', v: 900 }, { d: 'Sun', v: 1400 }, { d: 'Mon', v: 1100 }, { d: 'Tue', v: 1650 }, { d: 'Wed', v: 1200 }, { d: 'Thu', v: 2100 }, { d: 'Fri', v: 2400 }] },
  month: { total: 32980, delta: '+11% vs last month', orders: 58, data: [{ d: 'W1', v: 6200 }, { d: 'W2', v: 7900 }, { d: 'W3', v: 8240 }, { d: 'W4', v: 10640 }] },
};

const START_ORDERS = [
  { id: '#AST-1044', pid: 39, qty: 1, note: 'New order · Gold', status: 'new' },
  { id: '#AST-1039', pid: 20, qty: 2, note: 'Pick-up by 6 PM', status: 'accepted' },
  { id: '#AST-1036', pid: 31, qty: 1, note: 'Pick-up tomorrow', status: 'accepted' },
  { id: '#AST-1029', pid: 35, qty: 3, note: 'Handed over', status: 'done' },
];

const partnerProducts = PRODUCTS.filter((p) => p.seller !== 'Adi Shakti').map((p) => ({ ...p, status: 'Live' }));

export default function PartnerApp() {
  const [tab, setTab] = useState('dash');
  const [period, setPeriod] = useState('week');
  const [orders, setOrders] = useState(START_ORDERS);
  const [items, setItems] = useState([...partnerProducts, { ...PRODUCTS.find((p) => p.id === 22), status: 'Out of stock', stock: 0 }]);
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: CATEGORIES[0], img: null });
  const [orderFilter, setOrderFilter] = useState('all');
  const e = EARN[period];

  const advance = (id) => setOrders((os) => os.map((o) => o.id === id ? { ...o, status: o.status === 'new' ? 'accepted' : 'done', note: o.status === 'new' ? 'Pack and hand over' : 'Handed over' } : o));
  const toPack = orders.filter((o) => o.status !== 'done').length;

  const submit = (ev) => {
    ev.preventDefault();
    setItems((it) => [{ id: Date.now(), name: form.name || 'New product', price: Number(form.price) || 0, stock: Number(form.stock) || 0, img: form.img || '/products/plunger-cutter.jpg', status: 'In review', category: form.category }, ...it]);
    setForm({ name: '', price: '', stock: '', category: CATEGORIES[0], img: null });
    setSheet(false);
    setTab('products');
  };

  const OrderCard = ({ o, i }) => {
    const p = PRODUCTS.find((x) => x.id === o.pid);
    return (
      <motion.div layout className="pa-card pa-order" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
        <img src={p.img} alt="" />
        <div className="pa-grow"><b>{p.name} ×{o.qty}</b><small>{o.id} · {o.note}</small></div>
        {o.status === 'new' && <motion.button whileTap={{ scale: 0.92 }} className="pa-btn ghost" onClick={() => advance(o.id)}>Accept</motion.button>}
        {o.status === 'accepted' && <motion.button whileTap={{ scale: 0.92 }} className="pa-btn" onClick={() => advance(o.id)}>Packed</motion.button>}
        {o.status === 'done' && <CheckCircle2 size={22} color="#9FD8B0" aria-label="Done" />}
      </motion.div>
    );
  };

  return (
    <Page>
      <PhoneFrame dark title="Partnership App" desc="For partner store owners who sell on the Adi Shakti platform. Premium dark UI with gold accents."
        points={['Live earnings chart (week / month)', 'Accept → Packed order flow', 'Add products for admin approval', 'Payout history']}>
        <div className="pa">
          <div className="pa-scroll">
            <AnimatePresence mode="wait">
              <motion.div key={tab} className="pa-pad" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="pa-top">
                  <span className="pa-av display">PS</span>
                  <div className="pa-grow"><small className="pa-eyebrow">PARTNER STORE</small><b className="display pa-store">Your Store Name</b></div>
                  <button className="pa-icon" aria-label="Notifications"><Bell size={19} /><i /></button>
                </div>

                {tab === 'dash' && (
                  <>
                    <motion.section className="pa-earn" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="pa-earn-head">
                        <span>Your earnings</span>
                        <div className="pa-toggle" role="tablist" aria-label="Period">
                          {['week', 'month'].map((p) => (
                            <button key={p} role="tab" aria-selected={period === p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>
                              {period === p && <motion.span layoutId="pa-tog" className="pa-tog-bg" />}
                              <span>{p === 'week' ? 'Week' : 'Month'}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div key={period} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          <b className="display pa-earn-num">{formatINR(e.total)}</b>
                          <span className="pa-delta"><TrendingUp size={14} /> {e.delta}</span>
                        </motion.div>
                      </AnimatePresence>
                      <div className="pa-chart">
                        <ResponsiveContainer width="100%" height={110}>
                          <AreaChart data={e.data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E9C98A" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#E9C98A" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: '#B8A595', fontSize: 11 }} />
                            <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ background: '#17100D', border: '1px solid #5A4331', borderRadius: 10, color: '#F4EAE0', fontSize: 12 }} />
                            <Area type="monotone" dataKey="v" name="Earnings" stroke="#E9C98A" strokeWidth={2.5} fill="url(#gGold)" animationDuration={1200} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="pa-earn-foot">
                        <div><small>Next payout</small><b>₹6,210 · Fri</b></div>
                        <div style={{ textAlign: 'right' }}><small>Commission</small><b>As per agreement</b></div>
                      </div>
                    </motion.section>

                    <div className="pa-stats">
                      {[[e.orders, 'Orders'], [toPack, 'To pack', true], [items.filter((x) => x.status === 'Live').length, 'Live products']].map(([n, l, hi], i) => (
                        <motion.div key={l} className="pa-card pa-stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }} whileHover={{ y: -3 }}>
                          <b className={`display ${hi ? 'pink' : ''}`}>{n}</b><small>{l}</small>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pa-sec"><h2 className="display">Orders to fulfil</h2><button onClick={() => setTab('orders')}>See all</button></div>
                    <div className="pa-list">
                      {orders.filter((o) => o.status !== 'done').slice(0, 3).map((o, i) => <OrderCard key={o.id} o={o} i={i} />)}
                    </div>
                  </>
                )}

                {tab === 'orders' && (
                  <>
                    <h1 className="display pa-h">Orders</h1>
                    <div className="pa-filter">
                      {[['all', 'All'], ['new', 'New'], ['accepted', 'To pack'], ['done', 'Done']].map(([id, l]) => (
                        <button key={id} className={orderFilter === id ? 'on' : ''} onClick={() => setOrderFilter(id)}>{l}</button>
                      ))}
                    </div>
                    <div className="pa-list">
                      <AnimatePresence>
                        {orders.filter((o) => orderFilter === 'all' || o.status === orderFilter).map((o, i) => <OrderCard key={o.id} o={o} i={i} />)}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {tab === 'products' && (
                  <>
                    <h1 className="display pa-h">My products</h1>
                    <div className="pa-filter static">
                      <span className="on">Live · {items.filter((x) => x.status === 'Live').length}</span>
                      <span>In review · {items.filter((x) => x.status === 'In review').length}</span>
                      <span>Out of stock · {items.filter((x) => x.status === 'Out of stock').length}</span>
                    </div>
                    <div className="pa-list">
                      <AnimatePresence initial={false}>
                        {items.map((p, i) => (
                          <motion.div key={p.id} layout className="pa-card pa-prod" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                            <img src={p.img} alt="" />
                            <div className="pa-grow">
                              <b>{p.name}</b>
                              <small>{formatINR(p.price)} · Stock {p.stock}</small>
                              <span className={`pa-status ${p.status.replace(/ /g, '-').toLowerCase()}`}>{p.status === 'In review' ? 'IN REVIEW BY ADMIN' : p.status.toUpperCase()}</span>
                            </div>
                            <button className="pa-icon sq" aria-label={`Edit ${p.name}`}><Pencil size={16} /></button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <p className="pa-note">New products go live after Adi Shakti admin approves them. Orders and billing for your products show in the main admin tally.</p>
                  </>
                )}

                {tab === 'payouts' && (
                  <>
                    <h1 className="display pa-h">Payouts</h1>
                    <div className="pa-earn small">
                      <small>Balance to be paid</small>
                      <b className="display pa-earn-num">₹6,210</b>
                      <span className="pa-delta"><Clock size={14} /> Next payout on Friday</span>
                    </div>
                    <div className="pa-list" style={{ marginTop: 14 }}>
                      {[['31 Oct 2026', 7840], ['24 Oct 2026', 6420], ['17 Oct 2026', 5980], ['10 Oct 2026', 6110]].map(([d, a], i) => (
                        <motion.div key={d} className="pa-card pa-pay" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                          <span className="pa-pay-ico"><Wallet size={18} /></span>
                          <div className="pa-grow"><b>Weekly payout</b><small>{d} · Bank transfer</small></div>
                          <b className="gold">{formatINR(a)}</b>
                        </motion.div>
                      ))}
                    </div>
                    <Link to="/" className="pa-portals"><LogOut size={16} /> All portals / Logout</Link>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {(tab === 'products' || tab === 'dash') && (
            <motion.button className="pa-fab" onClick={() => setSheet(true)} initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }} whileHover={{ rotate: 90 }} aria-label="Add new product">
              <Plus size={24} />
            </motion.button>
          )}

          <nav className="pa-tabs" aria-label="Partner navigation">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
                {tab === id && <motion.span layoutId="pa-tab" className="pa-tab-line" />}
                <Icon size={21} /><span>{label}</span>
              </button>
            ))}
          </nav>

          <AnimatePresence>
            {sheet && (
              <motion.div className="pa-sheet-bg" onClick={() => setSheet(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.form className="pa-sheet" onSubmit={submit} onClick={(ev) => ev.stopPropagation()} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
                  <div className="pa-sheet-head"><h2 className="display">Add new product</h2><button type="button" className="pa-icon" onClick={() => setSheet(false)} aria-label="Close"><X size={18} /></button></div>
                  <label className="pa-upload">
                    <input type="file" accept="image/*" className="sr-only" onChange={(ev) => ev.target.files[0] && setForm((f) => ({ ...f, img: URL.createObjectURL(ev.target.files[0]) }))} />
                    {form.img ? <img src={form.img} alt="Preview" /> : <><ImagePlus size={26} /><span>Add product photo</span></>}
                  </label>
                  <label className="pa-field"><span>Product name</span><input required value={form.name} onChange={(ev) => setForm({ ...form, name: ev.target.value })} placeholder="e.g. Gold acrylic cake topper" /></label>
                  <div className="pa-two">
                    <label className="pa-field"><span>Price (₹)</span><input required inputMode="numeric" value={form.price} onChange={(ev) => setForm({ ...form, price: ev.target.value })} /></label>
                    <label className="pa-field"><span>Stock</span><input required inputMode="numeric" value={form.stock} onChange={(ev) => setForm({ ...form, stock: ev.target.value })} /></label>
                  </div>
                  <label className="pa-field"><span>Category</span>
                    <select value={form.category} onChange={(ev) => setForm({ ...form, category: ev.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                  </label>
                  <motion.button whileTap={{ scale: 0.97 }} className="pa-submit" type="submit">Send for approval</motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneFrame>
    </Page>
  );
}
