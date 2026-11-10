import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, ChevronDown, User, Menu, X, Mic, ArrowUp, Heart,
  Phone, MapPin, MessageCircle, Instagram, Facebook, Youtube, Mail, ChevronRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES, PRODUCTS, formatINR, catSlug } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import WishlistDrawer from './WishlistDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import LoginModal from './LoginModal.jsx';
import './Layout.css';

const WA = 'https://wa.me/917996222111?text=Hi%20Adi%20Shakti%20Trader!';

const ANNOUNCEMENTS = [
  'Welcome to Adi Shakti Trader — Choice of Home Bakers',
  'Visit us at Gandhi Bazaar, Basavanagudi, Bengaluru',
  'Order booking: 080-41486443 · 7996 222111',
];

// Desktop menu: category groups with a dropdown
const MENU = [
  { label: 'Cake Toppers', cat: 'Cake Toppers' },
  { label: 'Moulds', cat: 'Silicone Moulds' },
  { label: 'Baking Tools', cat: 'Baking Tools' },
  { label: 'Cake Base & Boards', cat: 'Cake Base & Boards' },
  { label: 'Packaging', cat: 'Packing Materials' },
  { label: 'Ribbons', cat: 'Decoration Ribbons' },
  { label: 'Cake Stands', cat: 'Cake Stands' },
];

/* ---------------- Brand logo ---------------- */
export function BrandLogo({ compact = false }) {
  return (
    <span className={`blogo ${compact ? 'compact' : ''}`}>
      <svg className="blogo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#fff" stroke="#ba7143" strokeWidth="2" />
        <path d="M20 27c-5 0-6-8 0-9 0-6 9-8 12-3 3-5 12-3 12 3 6 1 5 9 0 9v5H20z" fill="none" stroke="#793a00" strokeWidth="2.6" strokeLinejoin="round" />
        <rect x="22" y="38" width="20" height="8" rx="2" fill="#ba7143" />
        <rect x="20" y="46" width="24" height="3" rx="1.5" fill="#793a00" />
      </svg>
      <span className="blogo-text">
        <span className="blogo-name">Adi Shakti</span>
        <span className="blogo-tag">TRADER · BAKING TOOLS</span>
      </span>
    </span>
  );
}
export const Logo = BrandLogo;
export const Wordmark = BrandLogo;

/* ---------------- Search ---------------- */
function SearchBar({ onDone }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(pathname === '/search' ? params.get('q') || '' : '');
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const h = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { setOpen(false); if (pathname !== '/search') setQ(''); }, [pathname]);

  const matches = q.trim().length > 1
    ? PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    onDone && onDone();
  };

  return (
    <div className="hsearch" ref={box}>
      <form onSubmit={submit} role="search" className="hsearch-form">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search for products..."
          aria-label="Search products"
        />
        {q ? (
          <button type="button" className="hsearch-mic" onClick={() => setQ('')} aria-label="Clear"><X size={16} /></button>
        ) : (
          <span className="hsearch-mic" aria-hidden="true"><Mic size={17} /></span>
        )}
        <button type="submit" className="hsearch-btn" aria-label="Search"><Search size={19} strokeWidth={2.4} /></button>
      </form>
      <AnimatePresence>
        {open && q.trim().length > 1 && (
          <motion.div className="hsearch-drop" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {matches.length === 0 && <p className="hsearch-empty">No products found for “{q}”</p>}
            {matches.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="hsearch-item" onClick={() => onDone && onDone()}>
                <img src={p.img} alt="" />
                <span><b>{p.name}</b><small>{p.category}</small></span>
                <em>{formatINR(p.price)}</em>
              </Link>
            ))}
            {matches.length > 0 && (
              <button type="button" className="hsearch-all" onClick={submit}>View all results <ChevronRight size={14} /></button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Mobile drawer menu ---------------- */
function MobileMenu({ open, onClose }) {
  const shop = useShop();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="mm-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="mm" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.28 }}>
            <div className="mm-head">
              <BrandLogo compact />
              <button className="icon-btn" onClick={onClose} aria-label="Close menu"><X size={22} /></button>
            </div>
            <nav className="mm-links">
              <Link to="/" onClick={onClose}>Home</Link>
              <Link to="/category/all" onClick={onClose}>Shop All</Link>
              <Link to="/category/new-arrivals" onClick={onClose}>New Arrivals</Link>
              {CATEGORIES.map((c) => (
                <Link key={c} to={`/category/${catSlug(c)}`} onClick={onClose}>{c}<ChevronRight size={16} /></Link>
              ))}
            </nav>
            <div className="mm-foot">
              <button className="btn btn-primary" onClick={() => { onClose(); shop.setLoginOpen(true); }}>
                <User size={16} /> {shop.user ? `Hi, ${shop.user.name || 'Baker'}` : 'Login / Sign up'}
              </button>
              <a href="tel:+918041486443" className="mm-call"><Phone size={15} /> 080-41486443</a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Layout ---------------- */
export default function Layout() {
  const shop = useShop();
  const { pathname } = useLocation();
  const [ann, setAnn] = useState(0);
  const [menu, setMenu] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAnn((a) => (a + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const s = () => { setShowTop(window.scrollY > 500); setStuck(window.scrollY > 40); };
    s();
    window.addEventListener('scroll', s, { passive: true });
    return () => window.removeEventListener('scroll', s);
  }, []);
  useEffect(() => { setMenu(false); }, [pathname]);

  const byCat = (c) => PRODUCTS.filter((p) => p.category === c);

  return (
    <>
      {/* Announcement bar */}
      <div className="ann">
        <div className="wrap ann-in">
          <span className="ann-side" />
          <AnimatePresence mode="wait">
            <motion.p key={ann} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {ANNOUNCEMENTS[ann]}
            </motion.p>
          </AnimatePresence>
          <span className="ann-side ann-social">
            <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={15} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
          </span>
        </div>
      </div>

      {/* Header */}
      <header className={`hdr ${stuck ? 'stuck' : ''}`}>
        <div className="wrap hdr-in">
          <div className="hdr-left">
            <button className="icon-btn hdr-burger" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={24} /></button>
            <Link to="/" className="hdr-logo" aria-label="Adi Shakti Trader home"><BrandLogo /></Link>
          </div>

          <div className="hdr-search"><SearchBar /></div>

          <div className="hdr-icons">
            <button className="icon-btn" onClick={() => shop.setLoginOpen(true)} aria-label="Account"><User size={23} /></button>
            <button className="icon-btn hdr-wish" onClick={() => shop.setWishlistOpen(true)} aria-label="Wishlist">
              <Heart size={22} />
              {shop.wishlistCount > 0 && <span className="hdr-count">{shop.wishlistCount}</span>}
            </button>
            <button className="icon-btn" onClick={() => shop.setCartOpen(true)} aria-label="Cart">
              <ShoppingCart size={23} />
              <span className="hdr-count">{shop.count}</span>
            </button>
          </div>
        </div>

        {/* Mobile / tablet: always-visible search row under the header */}
        <div className="hdr-msearch-row">
          <div className="wrap"><SearchBar /></div>
        </div>

        {/* Desktop nav */}
        <nav className="hnav" aria-label="Categories">
          <div className="wrap hnav-in">
            <NavLink to="/" end className="hnav-link">Home</NavLink>
            {MENU.map((m) => (
              <div className="hnav-item" key={m.cat}>
                <NavLink to={`/category/${catSlug(m.cat)}`} className="hnav-link">
                  {m.label} <ChevronDown size={14} />
                </NavLink>
                <div className="hnav-drop">
                  {byCat(m.cat).slice(0, 8).map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`}>{p.name}</Link>
                  ))}
                  <Link to={`/category/${catSlug(m.cat)}`} className="hnav-drop-all">View all {m.label}</Link>
                </div>
              </div>
            ))}
            <NavLink to="/category/new-arrivals" className="hnav-link">New Arrivals</NavLink>
          </div>
        </nav>
      </header>

      <MobileMenu open={menu} onClose={() => setMenu(false)} />

      <main className="main"><Outlet /></main>

      {/* Footer */}
      <footer className="ftr">
        <div className="wrap ftr-grid">
          <div className="ftr-col ftr-brand">
            <BrandLogo />
            <p>Choice of Home Bakers — a unit of Adi Shakti Trader. Cake toppers, silicone moulds, baking tools, cake boards, packaging and ribbons.</p>
            <div className="ftr-social">
              <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={17} /></a>
            </div>
          </div>

          <div className="ftr-col">
            <h4>Shop</h4>
            <ul>
              {CATEGORIES.map((c) => <li key={c}><Link to={`/category/${catSlug(c)}`}>{c}</Link></li>)}
              <li><Link to="/category/new-arrivals">New Arrivals</Link></li>
            </ul>
          </div>

          <div className="ftr-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/category/all">All Products</Link></li>
              <li><button type="button" onClick={() => shop.setLoginOpen(true)}>My Account</button></li>
              <li><button type="button" onClick={() => shop.setCartOpen(true)}>My Cart</button></li>
              <li><button type="button" onClick={() => shop.setWishlistOpen(true)}>Wishlist</button></li>
              <li><a href={WA} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a></li>
            </ul>
          </div>

          <div className="ftr-col">
            <h4>Contact Us</h4>
            <ul className="ftr-contact">
              <li><MapPin size={16} /><span>#39, Ground Floor, WAT Street, Beside Domino&apos;s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</span></li>
              <li><Phone size={16} /><span>Order booking: <a href="tel:+918041486443">080-41486443</a> · <a href="tel:+917996222111">7996 222111</a></span></li>
              <li><Phone size={16} /><span>Mahesh: <a href="tel:+919242222111">9242 222111</a><br />Rani Mahesh: <a href="tel:+918792222111">8792 222111</a></span></li>
              <li><Mail size={16} /><span>GSTIN: 29ANDPR3394Q1Z0</span></li>
            </ul>
            <div className="ftr-actions">
              <a href="tel:+918041486443"><Phone size={16} /> Call</a>
              <a href={WA} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> WhatsApp</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Adi+Shakti+Trader+WAT+Street+Gandhi+Bazaar+Basavanagudi+Bengaluru+560004" target="_blank" rel="noopener noreferrer"><MapPin size={16} /> Directions</a>
            </div>
          </div>
        </div>
        <div className="ftr-bottom">
          <div className="wrap ftr-bottom-in">
            <span>© {new Date().getFullYear()} Adi Shakti Trader. All rights reserved.</span>
            <span>Bengaluru, Karnataka</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp "Need help?" */}
      <a className="wa-float" href={WA} target="_blank" rel="noopener noreferrer" aria-label="Need help? Chat on WhatsApp">
        <span className="wa-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2zm5.8 14.06c-.24.68-1.42 1.31-1.96 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.25-.27.54-.34.72-.34h.52c.17 0 .39-.06.61.47.24.56.79 1.92.86 2.06.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.66-.17 1.33z" /></svg>
        </span>
        <span className="wa-label">Need help?</span>
      </a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs><path id="tt-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
              <text fontSize="11" fontWeight="700" fill="#1d6fd8" letterSpacing="2"><textPath href="#tt-circle">SCROLL TO TOP • SCROLL TO TOP •</textPath></text>
            </svg>
            <ArrowUp size={18} strokeWidth={2.6} />
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer />
      <WishlistDrawer />
      <VideoModal />
      <LoginModal />

      {/* Toast */}
      <AnimatePresence>
        {shop.toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <img src={shop.toast.img} alt="" />
            <span><b>Added to cart</b><small>{shop.toast.name}</small></span>
            <button onClick={() => { shop.closeToast(); shop.setCartOpen(true); }}>View cart</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
