import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, User, Menu, X, ChevronDown, ChevronLeft, ChevronRight, Phone, MapPin, ArrowUp, Check, Mail, LayoutGrid,
} from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, formatINR } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import LoginModal from './LoginModal.jsx';
import './Layout.css';

const ANNOUNCE = [
  <>Wholesale rates for bakeries — call <a href="tel:+917996222111">7996 222111</a></>,
  <>Store pick-up available at Gandhi Bazaar, Basavanagudi</>,
  <>New stock: filigree butterflies, rose moulds &amp; plunger cutters</>,
];
const NAV = [
  { to: '/category/cake-toppers', label: 'Cake Toppers' },
  { to: '/category/silicone-moulds', label: 'Moulds' },
  { to: '/category/baking-tools', label: 'Baking Tools' },
  { to: '/category/packing-materials', label: 'Packing' },
  { to: '/category/new-arrivals', label: 'New Arrivals' },
  { to: '/#demos', label: 'Cake Demos' },
];

export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'light' : ''}`}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="26" height="26"><path d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /><rect x="10" y="25" width="16" height="4" rx="2" fill="#B8235A" /></svg>
      </span>
      <span className="logo-text"><b>Adi Shakti</b><small>Trader · Baking Tools</small></span>
    </span>
  );
}

function Announce() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % ANNOUNCE.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="announce">
      <button className="ann-arrow" onClick={() => setI((x) => (x - 1 + ANNOUNCE.length) % ANNOUNCE.length)} aria-label="Previous message"><ChevronLeft size={16} /></button>
      <div className="ann-text" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3 }}>{ANNOUNCE[i]}</motion.p>
        </AnimatePresence>
      </div>
      <button className="ann-arrow" onClick={() => setI((x) => (x + 1) % ANNOUNCE.length)} aria-label="Next message"><ChevronRight size={16} /></button>
    </div>
  );
}

function SearchBox({ onDone, autoFocus }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const hits = useMemo(() => (q.trim() ? PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : []), [q]);
  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const go = (to) => { setOpen(false); setQ(''); onDone?.(); navigate(to); };
  return (
    <form className="sbox" ref={box} role="search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }}>
      <label className="sbox-field">
        <span className="sr-only">Search products</span>
        <input value={q} autoFocus={autoFocus} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Search for moulds, toppers, nozzles…" />
      </label>
      <button className="sbox-btn" aria-label="Search"><Search size={18} /></button>
      <AnimatePresence>
        {open && q.trim() && (
          <motion.div className="sbox-pop" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            {hits.length === 0 ? <p className="muted">No products found for “{q}”</p> : hits.map((p) => (
              <button type="button" key={p.id} onClick={() => go(`/product/${p.id}`)}>
                <img src={p.img} alt="" /><span><b>{p.name}</b><small>{formatINR(p.price)}</small></span>
              </button>
            ))}
            {hits.length > 0 && <button type="button" className="sbox-all" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}>See all results for “{q}”</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function MegaMenu({ onClose }) {
  return (
    <motion.div className="mega" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} onMouseLeave={onClose}>
      <div className="wrap mega-grid">
        {CATEGORIES.map((c) => (
          <div key={c} className="mega-col">
            <Link to={`/category/${catSlug(c)}`} className="mega-head" onClick={onClose}>
              <img src={CAT_IMG[c]} alt="" /><span>{c}</span>
            </Link>
            {PRODUCTS.filter((p) => p.category === c).slice(0, 4).map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} onClick={onClose}>{p.name}</Link>
            ))}
            <Link to={`/category/${catSlug(c)}`} className="mega-more" onClick={onClose}>View all</Link>
          </div>
        ))}
        <Link to="/category/new-arrivals" className="mega-feature" onClick={onClose}>
          <img src="/products/filigree-butterfly.jpg" alt="" />
          <span><small>Just in</small><b>New Arrivals</b><em>Shop now</em></span>
        </Link>
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose }) {
  const [openCat, setOpenCat] = useState(null);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="mm-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className="mm" onClick={(e) => e.stopPropagation()} initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} aria-label="Menu">
            <div className="mm-top"><Logo /><button className="icon-btn" onClick={onClose} aria-label="Close menu"><X size={22} /></button></div>
            <div className="mm-search"><SearchBox onDone={onClose} /></div>
            <nav className="mm-nav">
              <Link to="/" onClick={onClose}>Home</Link>
              {CATEGORIES.map((c) => (
                <div key={c} className="mm-cat">
                  <div className="mm-row">
                    <Link to={`/category/${catSlug(c)}`} onClick={onClose}>{c}</Link>
                    <button className="icon-btn" onClick={() => setOpenCat(openCat === c ? null : c)} aria-expanded={openCat === c} aria-label={`Show ${c} products`}>
                      <ChevronDown size={18} style={{ transform: openCat === c ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
                    </button>
                  </div>
                  <AnimatePresence initial={false}>
                    {openCat === c && (
                      <motion.div className="mm-sub" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                        {PRODUCTS.filter((p) => p.category === c).map((p) => <Link key={p.id} to={`/product/${p.id}`} onClick={onClose}>{p.name}</Link>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link to="/category/new-arrivals" onClick={onClose}>New Arrivals</Link>
              <Link to="/#demos" onClick={onClose}>Cake Demos</Link>
            </nav>
            <div className="mm-foot">
              <a href="tel:+918041486443"><Phone size={16} /> 080-41486443</a>
              <span><MapPin size={16} /> Gandhi Bazaar, Basavanagudi, Bengaluru</span>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Layout() {
  const shop = useShop();
  const { pathname, hash } = useLocation();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [msearch, setMsearch] = useState(false);
  const [top, setTop] = useState(false);
  const [mail, setMail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => { setMega(false); setMobile(false); setMsearch(false); }, [pathname, hash]);
  useEffect(() => { if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80); }, [hash, pathname]);
  useEffect(() => { const s = () => setTop(window.scrollY > 700); window.addEventListener('scroll', s, { passive: true }); return () => window.removeEventListener('scroll', s); }, []);
  useEffect(() => { document.body.style.overflow = shop.cartOpen || shop.video || shop.loginOpen || mobile ? 'hidden' : ''; }, [shop.cartOpen, shop.video, shop.loginOpen, mobile]);

  return (
    <>
      <Announce />
      <header className="hdr">
        <div className="wrap hdr-main">
          <button className="icon-btn hdr-burger" onClick={() => setMobile(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Link to="/" className="hdr-logo" aria-label="Adi Shakti Trader home"><Logo /></Link>
          <div className="hdr-search"><SearchBox /></div>
          <div className="hdr-icons">
            <button className="icon-btn hdr-msearch" onClick={() => setMsearch((s) => !s)} aria-label="Search" aria-expanded={msearch}><Search size={21} /></button>
            <button className="hdr-acct" onClick={() => shop.setLoginOpen(true)}>
              <User size={21} />
              <span><small>{shop.user ? 'Hello' : 'Login'}</small><b>{shop.user ? shop.user.name.split(' ')[0] : 'My account'}</b></span>
            </button>
            <button className="hdr-cart" onClick={() => shop.setCartOpen(true)} aria-label={`Cart, ${shop.count} items`}>
              <span className="hdr-cart-ico"><ShoppingBag size={22} /><motion.i key={shop.count} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>{shop.count}</motion.i></span>
              <span className="hdr-cart-txt"><small>My cart</small><b>{formatINR(shop.subtotal)}</b></span>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {msearch && (
            <motion.div className="hdr-msearch-row" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <div className="wrap"><SearchBox autoFocus onDone={() => setMsearch(false)} /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="navbar" aria-label="Main">
          <div className="wrap navbar-row">
            <button className={`allcats ${mega ? 'on' : ''}`} onClick={() => setMega((m) => !m)} onMouseEnter={() => setMega(true)} aria-expanded={mega}>
              <LayoutGrid size={17} /> All Categories <ChevronDown size={16} />
            </button>
            <NavLink to="/" end className="nav-a">Home</NavLink>
            {NAV.map((n) => <NavLink key={n.to} to={n.to} className="nav-a">{n.label}</NavLink>)}
            <a href="tel:+917996222111" className="nav-call"><Phone size={15} /> 7996 222111</a>
          </div>
          <AnimatePresence>{mega && <MegaMenu onClose={() => setMega(false)} />}</AnimatePresence>
        </nav>
      </header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />

      <Outlet />

      <footer className="ftr" id="contact">
        <div className="ftr-news">
          <div className="wrap ftr-news-row">
            <div><h3>Get new arrivals &amp; demo videos first</h3><p>Subscribe for stock updates from Adi Shakti Trader.</p></div>
            {subscribed ? <p className="ftr-thanks"><Check size={18} /> Thanks! You’re subscribed.</p> : (
              <form onSubmit={(e) => { e.preventDefault(); if (mail.includes('@')) setSubscribed(true); }}>
                <label className="sr-only" htmlFor="news-mail">Email address</label>
                <Mail size={18} />
                <input id="news-mail" type="email" required value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Enter your email" />
                <button className="btn btn-accent">Subscribe</button>
              </form>
            )}
          </div>
        </div>
        <div className="wrap ftr-cols">
          <div className="ftr-about">
            <Logo light />
            <p>Baking tools &amp; accessories for home bakers and bakeries. Choice of Home Bakers (unit of AST).</p>
            <p className="ftr-line"><MapPin size={16} /> #39, Ground Floor, WAT Street, Beside Domino’s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
          </div>
          <div><h4>Shop</h4>{CATEGORIES.map((c) => <Link key={c} to={`/category/${catSlug(c)}`}>{c}</Link>)}</div>
          <div><h4>Quick links</h4><Link to="/">Home</Link><Link to="/category/new-arrivals">New Arrivals</Link><Link to="/category/all">All Products</Link><Link to="/#demos">Cake Demo Videos</Link><button className="ftr-linkbtn" onClick={() => shop.setLoginOpen(true)}>My Account</button></div>
          <div><h4>Contact us</h4>
            <a href="tel:+918041486443"><Phone size={14} /> 080-41486443</a>
            <a href="tel:+917996222111"><Phone size={14} /> 7996 222111</a>
            <a href="tel:+919242222111">Mahesh · 9242 222111</a>
            <a href="tel:+918792222111">Rani Mahesh · 8792 222111</a>
          </div>
        </div>
        <div className="ftr-bottom"><div className="wrap"><span>© {new Date().getFullYear()} Adi Shakti Trader. All rights reserved.</span><span>UPI · Cards · Cash at store</span></div></div>
      </footer>

      <AnimatePresence>
        {top && <motion.button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}><ArrowUp size={20} /></motion.button>}
      </AnimatePresence>
      <AnimatePresence>
        {shop.toast && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <img src={shop.toast.img} alt="" />
            <div><small><Check size={13} /> Added to your cart</small><b>{shop.toast.name}</b></div>
            <button className="btn btn-brand" onClick={() => { shop.closeToast(); shop.setCartOpen(true); }}>View cart</button>
            <button className="icon-btn" onClick={shop.closeToast} aria-label="Dismiss"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <VideoModal />
      <LoginModal />
    </>
  );
}
