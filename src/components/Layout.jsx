import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, ChevronDown, ChevronRight, User, MapPin, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES, formatINR, catSlug } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import LoginModal from './LoginModal.jsx';
import './Layout.css';

const HINTS = ['“moulds”', '“cake toppers”', '“piping nozzles”', '“cake base”', '“gold foil”', '“ribbons”'];

export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="22" height="22"><path d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z" fill="none" stroke="#F6C9D7" strokeWidth="2.4" strokeLinejoin="round" /><rect x="10" y="25" width="16" height="4" rx="2" fill="#F6C9D7" /></svg>
      </span>
      <span className="logo-text"><b>Adi Shakti</b><small>baking tools</small></span>
    </span>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(pathname === '/search' ? params.get('q') || '' : '');
  const [hint, setHint] = useState(0);
  useEffect(() => { const t = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => { if (pathname !== '/search') setQ(''); }, [pathname]);

  const onChange = (v) => {
    setQ(v);
    navigate(v ? `/search?q=${encodeURIComponent(v)}` : '/search', { replace: pathname === '/search' });
  };

  return (
    <label className="searchbar">
      <Search size={18} />
      <span className="sr-only">Search products</span>
      <input value={q} onChange={(e) => onChange(e.target.value)} onFocus={() => pathname !== '/search' && navigate('/search')} />
      {!q && (
        <span className="search-ph" aria-hidden="true">
          Search
          <AnimatePresence mode="wait">
            <motion.span key={hint} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }}>{HINTS[hint]}</motion.span>
          </AnimatePresence>
        </span>
      )}
    </label>
  );
}

export default function Layout() {
  const shop = useShop();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';

  useEffect(() => {
    document.body.style.overflow = shop.cartOpen || shop.video || shop.loginOpen ? 'hidden' : '';
  }, [shop.cartOpen, shop.video, shop.loginOpen]);

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr-row">
          {!isHome && <button className="icon-btn hdr-back" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button>}
          <Link to="/" className="hdr-logo" aria-label="Adi Shakti Trader home"><Logo /></Link>
          <button className="hdr-loc" aria-label="Delivery location: Basavanagudi, Bengaluru">
            <b>Delivery in Bengaluru</b>
            <span><MapPin size={12} /> Basavanagudi, 560004 <ChevronDown size={14} /></span>
          </button>
          <div className="hdr-search"><SearchBar /></div>
          <button className="hdr-login" onClick={() => shop.setLoginOpen(true)}>
            <User size={18} className="hdr-login-ico" />
            <span>{shop.user ? `Hi, ${shop.user.name.split(' ')[0]}` : 'Login'}</span>
          </button>
          <motion.button key={shop.bump} className={`hdr-cart ${shop.count ? 'full' : ''}`} onClick={() => shop.setCartOpen(true)}
            animate={shop.bump ? { scale: [1, 1.06, 1] } : {}} transition={{ duration: 0.35 }} aria-label={`Cart, ${shop.count} items`}>
            <ShoppingCart size={20} />
            {shop.count ? <span className="hdr-cart-txt"><b>{shop.count} {shop.count === 1 ? 'item' : 'items'}</b><small>{formatINR(shop.subtotal)}</small></span> : <span className="hdr-cart-txt"><b>My Cart</b></span>}
          </motion.button>
        </div>
      </header>

      <Outlet />

      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-top">
            <div className="ftr-brand">
              <Logo />
              <p className="muted">Baking tools &amp; accessories for home bakers and bakeries. Choice of Home Bakers.</p>
              <p className="ftr-addr"><MapPin size={15} /> #39, Ground Floor, WAT Street, Beside Domino’s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
            </div>
            <div className="ftr-cats">
              <h3>Categories</h3>
              <div>{CATEGORIES.map((c) => <Link key={c} to={`/category/${catSlug(c)}`}>{c}</Link>)}<Link to="/category/new-arrivals">New Arrivals</Link></div>
            </div>
            <div className="ftr-contact">
              <h3>Order booking</h3>
              <a href="tel:+918041486443">080-41486443</a>
              <a href="tel:+917996222111">7996 222111</a>
              <h3>Contact</h3>
              <a href="tel:+919242222111">Mahesh · 9242 222111</a>
              <a href="tel:+918792222111">Rani Mahesh · 8792 222111</a>
            </div>
          </div>
          <div className="ftr-bottom">© {new Date().getFullYear()} Adi Shakti Trader · Bengaluru</div>
        </div>
      </footer>

      {/* mobile floating cart bar */}
      <AnimatePresence>
        {shop.count > 0 && !shop.cartOpen && (
          <motion.button className="cartbar" onClick={() => shop.setCartOpen(true)}
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <span className="cartbar-imgs">
              {shop.items.slice(-3).map(({ product: p }) => <img key={p.id} src={p.img} alt="" />)}
            </span>
            <span className="cartbar-txt"><b>{shop.count} {shop.count === 1 ? 'item' : 'items'}</b><small>{formatINR(shop.subtotal)}</small></span>
            <span className="cartbar-cta">View cart <ChevronRight size={18} /></span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer />
      <VideoModal />
      <LoginModal />
    </>
  );
}
