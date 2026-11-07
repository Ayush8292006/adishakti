import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, formatINR } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import './Layout.css';

const NAV = [
  { href: '/#shop', label: 'Shop' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#demos', label: 'Cake Demos' },
  { href: '/#visit', label: 'Visit Store' },
];

export function Wordmark({ light = false }) {
  return (
    <span className={`wordmark ${light ? 'light' : ''}`}>
      <span className="serif wm-name">Adi Shakti</span>
      <span className="wm-sub">Trader</span>
    </span>
  );
}

function SearchPanel({ open, onClose }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => (q.trim() ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : []), [q]);
  useEffect(() => { if (!open) setQ(''); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="search-box" onClick={(e) => e.stopPropagation()}
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="wrap">
              <label className="search-field">
                <Search size={22} strokeWidth={1.5} />
                <span className="sr-only">Search products</span>
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search moulds, toppers, nozzles…" />
                <button className="icon-btn" onClick={onClose} aria-label="Close search"><X size={20} strokeWidth={1.5} /></button>
              </label>
              {q && (
                <ul className="search-results">
                  {results.length === 0 && <li className="muted">No products found for “{q}”.</li>}
                  {results.map((p, i) => (
                    <motion.li key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <button onClick={() => { onClose(); navigate(`/product/${p.id}`); }}>
                        <img src={p.img} alt="" />
                        <span><b>{p.name}</b><small>{p.category}</small></span>
                        <span className="sr-price">{formatINR(p.price)}</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
              {!q && (
                <div className="search-hints">
                  <span className="label">Popular</span>
                  {['Mould', 'Topper', 'Nozzle', 'Cake base', 'Ribbon'].map((h) => <button key={h} onClick={() => setQ(h)}>{h}</button>)}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Layout() {
  const shop = useShop();
  const { pathname, hash } = useLocation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // hide header on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 10);
    setHidden(y > 240 && y > prev && !menu);
  });

  useEffect(() => { setMenu(false); }, [pathname, hash]);
  useEffect(() => {
    if (hash) { const el = document.querySelector(hash); if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60); }
  }, [hash, pathname]);
  useEffect(() => {
    document.body.style.overflow = menu || search || shop.cartOpen || shop.video ? 'hidden' : '';
  }, [menu, search, shop.cartOpen, shop.video]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="announce">
        <span>Wholesale rates for bakeries &amp; home bakers</span>
        <span className="announce-dot" aria-hidden="true" />
        <a href="tel:+917996222111">Order booking 7996 222111</a>
      </div>

      <motion.header className={`site-header ${solid ? 'solid' : ''}`} animate={{ y: hidden ? '-100%' : '0%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <div className="wrap header-row">
          <nav className="nav-left" aria-label="Main">
            {NAV.map((n) => <Link key={n.href} to={n.href} className="nav-link">{n.label}</Link>)}
          </nav>
          <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={22} strokeWidth={1.5} /></button>
          <Link to="/" className="brand" aria-label="Adi Shakti Trader home"><Wordmark /></Link>
          <div className="nav-right">
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="Search"><Search size={20} strokeWidth={1.5} /></button>
            <Link to="/login" className="icon-btn acct" aria-label={shop.user ? 'Account' : 'Sign in'}><User size={20} strokeWidth={1.5} /></Link>
            <button className="cart-pill" onClick={() => shop.setCartOpen(true)} aria-label={`Cart, ${shop.count} items`}>
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span className="cart-label">Cart</span>
              <motion.span key={shop.count} className="cart-n" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{shop.count}</motion.span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {menu && (
          <motion.div className="menu-panel" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <div className="menu-top wrap">
              <Wordmark />
              <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu"><X size={24} strokeWidth={1.5} /></button>
            </div>
            <nav className="menu-links wrap" aria-label="Mobile">
              {[...NAV, { href: '/login', label: 'Sign in' }].map((n, i) => (
                <motion.div key={n.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  <Link to={n.href} onClick={() => setMenu(false)}>
                    <span className="serif">{n.label}</span><ArrowUpRight size={22} strokeWidth={1.25} />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div className="menu-foot wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="label">Store</span>
              <p>#39, WAT Street, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
              <a href="tel:+918041486443">080-41486443</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchPanel open={search} onClose={() => setSearch(false)} />

      <Outlet />

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-cta">
            <h2 className="serif">Running a bakery? <em>Ask for wholesale rates.</em></h2>
            <a className="btn btn-solid" href="tel:+917996222111">Call 7996 222111 <ArrowRight size={16} className="arrow" /></a>
          </div>
          <div className="footer-grid">
            <div className="f-brand"><Wordmark /><p className="muted">Baking tools &amp; accessories. Choice of home bakers.</p></div>
            <div><span className="label">Shop</span><Link to="/#shop">All products</Link><Link to="/#categories">Categories</Link><Link to="/#new">New arrivals</Link></div>
            <div><span className="label">Help</span><Link to="/#demos">Cake demos</Link><Link to="/#how">How to order</Link><Link to="/login">My account</Link></div>
            <div><span className="label">Store</span><p>#39, Ground Floor, WAT Street, Beside Domino’s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p></div>
            <div><span className="label">Contact</span><a href="tel:+918041486443">080-41486443</a><a href="tel:+917996222111">7996 222111</a><a href="tel:+919242222111">Mahesh · 9242 222111</a><a href="tel:+918792222111">Rani Mahesh · 8792 222111</a></div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Adi Shakti Trader</span>
            <button className="link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
          </div>
        </div>
        <div className="footer-giant serif" aria-hidden="true">Adi Shakti</div>
      </footer>

      <CartDrawer />
      <VideoModal />

      <AnimatePresence>
        {shop.toast && (
          <motion.div className="toast" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <img src={shop.toast.img} alt="" />
            <span><small className="label">Added to cart</small><b>{shop.toast.name}</b></span>
            <button className="link" onClick={() => shop.setCartOpen(true)}>View</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
