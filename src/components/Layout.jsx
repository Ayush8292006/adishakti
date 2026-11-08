import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, ChevronDown, ChevronRight, User, MapPin,
  ArrowLeft, ArrowUp, MessageCircle, Sparkles, Truck, Phone, X, Home, Grid
} from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES, PRODUCTS, formatINR, catSlug } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import LoginModal from './LoginModal.jsx';
import AddButton from './AddButton.jsx';
import './Layout.css';

const HINTS = [
  '“chocolate moulds”',
  '“rose silicone mould”',
  '“acrylic cake toppers”',
  '“piping nozzle set”',
  '“MDF cake board”',
  '“gold wrapper foil”',
  '“transparent cake box”',
];

export function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="24" height="24">
          <path
            d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z"
            fill="none"
            stroke="#F8D3DF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="10" y="25" width="16" height="4" rx="2" fill="#F8D3DF" />
        </svg>
      </span>
      <span className="logo-text">
        <span className="logo-brand">Adi Shakti</span>
        <span className="logo-sub">BAKING &amp; MOULDS</span>
      </span>
    </span>
  );
}

function LiveSearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(pathname === '/search' ? params.get('q') || '' : '');
  const [hint, setHint] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (pathname !== '/search') setQ('');
    setIsOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const matches = q.trim().length > 1
    ? PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="search-wrap" ref={containerRef}>
      <form className="searchbar" onSubmit={handleSearchSubmit} role="search">
        <Search size={18} className="search-ico" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder=""
          aria-label="Search baking tools, moulds, toppers"
        />
        {q ? (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQ('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : (
          <span className="search-ph" aria-hidden="true">
            Search
            <AnimatePresence mode="wait">
              <motion.span
                key={hint}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {HINTS[hint]}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
      </form>

      {/* Live Dropdown Results */}
      <AnimatePresence>
        {isOpen && q.trim().length > 1 && (
          <motion.div
            className="search-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="search-drop-head">
              <span>Matching Products ({matches.length})</span>
              <button
                type="button"
                className="search-drop-close"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="search-drop-empty">
                <p>No products matching “{q}”</p>
                <small className="muted">Try searching “mould”, “topper”, or “nozzle”</small>
              </div>
            ) : (
              <div className="search-drop-list">
                {matches.map((item) => (
                  <div key={item.id} className="search-item">
                    <Link
                      to={`/product/${item.id}`}
                      className="search-item-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={item.img} alt="" className="search-item-img" />
                      <div className="search-item-info">
                        <span className="search-item-name">{item.name}</span>
                        <span className="search-item-cat">{item.category}</span>
                        <span className="search-item-price">{formatINR(item.price)}</span>
                      </div>
                    </Link>
                    <div className="search-item-action">
                      <AddButton id={item.id} name={item.name} size="sm" />
                    </div>
                  </div>
                ))}
                <Link
                  to={`/search?q=${encodeURIComponent(q.trim())}`}
                  className="search-drop-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span>See all results for “{q}”</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Layout() {
  const shop = useShop();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);

  // Monitor scroll progress and header elevation
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setScrolled(y > 20);
      setShowBackTop(y > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow = shop.cartOpen || shop.video || shop.loginOpen ? 'hidden' : '';
  }, [shop.cartOpen, shop.video, shop.loginOpen]);

  const navCategories = [
    { label: 'All Products', to: '/category/all' },
    { label: 'Cake Toppers', to: `/category/${catSlug('Cake Toppers')}` },
    { label: 'Silicone Moulds', to: `/category/${catSlug('Silicone Moulds')}` },
    { label: 'Baking Tools', to: `/category/${catSlug('Baking Tools')}` },
    { label: 'Bases & Boards', to: `/category/${catSlug('Cake Base & Boards')}` },
    { label: 'Packaging', to: `/category/${catSlug('Packing Materials')}` },
    { label: 'Ribbons', to: `/category/${catSlug('Decoration Ribbons')}` },
    { label: 'Cake Stands', to: `/category/${catSlug('Cake Stands')}` },
    { label: '✨ New Arrivals', to: '/category/new-arrivals', highlight: true },
  ];

  return (
    <>
      {/* Scroll depth indicator bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* TOP TICKER / MARQUEE ANNOUNCEMENT */}
      <aside className="top-marquee" aria-label="Store highlights">
        <div className="marquee-track">
          <div className="marquee-content">
            <span><Truck size={14} /> Same-Day Delivery in Bengaluru (Order before 2 PM)</span>
            <span className="marquee-dot">•</span>
            <span><Sparkles size={14} /> 100% Certified Food-Grade Silicone Moulds</span>
            <span className="marquee-dot">•</span>
            <span><Phone size={14} /> Wholesale Rates for Bakeries &amp; Cloud Kitchens</span>
            <span className="marquee-dot">•</span>
            <span><MapPin size={14} /> Gandhi Bazaar Store: #39 WAT Street, Basavanagudi</span>
            <span className="marquee-dot">•</span>
            <span>💬 WhatsApp Quick Order: +91 7996 222111</span>
            <span className="marquee-dot">•</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span><Truck size={14} /> Same-Day Delivery in Bengaluru (Order before 2 PM)</span>
            <span className="marquee-dot">•</span>
            <span><Sparkles size={14} /> 100% Certified Food-Grade Silicone Moulds</span>
            <span className="marquee-dot">•</span>
            <span><Phone size={14} /> Wholesale Rates for Bakeries &amp; Cloud Kitchens</span>
            <span className="marquee-dot">•</span>
            <span><MapPin size={14} /> Gandhi Bazaar Store: #39 WAT Street, Basavanagudi</span>
            <span className="marquee-dot">•</span>
            <span>💬 WhatsApp Quick Order: +91 7996 222111</span>
            <span className="marquee-dot">•</span>
          </div>
        </div>
      </aside>

      {/* MAIN STICKY HEADER */}
      <header className={`hdr ${scrolled ? 'scrolled' : ''}`}>
        <div className="wrap hdr-row">
          {!isHome && (
            <button
              className="icon-btn hdr-back"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <Link to="/" className="hdr-logo" aria-label="Adi Shakti Trader Home">
            <Logo />
          </Link>

          {/* Delivery Location Selector */}
          <div className="hdr-loc" title="Basavanagudi, Bengaluru store dispatch">
            <span className="hdr-loc-tag">DELIVERY IN</span>
            <span className="hdr-loc-val">
              <MapPin size={13} className="loc-pin" />
              <span>Bengaluru 560004</span>
              <ChevronDown size={13} />
            </span>
          </div>

          {/* Search Bar with live dropdown */}
          <div className="hdr-search">
            <LiveSearchBar />
          </div>

          {/* WhatsApp Direct Action */}
          <a
            href="https://wa.me/917996222111?text=Hello%20Adi%20Shakti%20Trader!%20I%20am%20looking%20for%20baking%20tools%20and%20moulds."
            target="_blank"
            rel="noopener noreferrer"
            className="hdr-wa"
            title="Chat on WhatsApp with our store team"
          >
            <MessageCircle size={18} />
            <span>WhatsApp Order</span>
          </a>

          {/* Login / Profile */}
          <button
            className="hdr-login"
            onClick={() => shop.setLoginOpen(true)}
            aria-label="Account Login"
          >
            <User size={18} className="hdr-login-ico" />
            <span>{shop.user ? `Hi, ${shop.user.name.split(' ')[0]}` : 'Sign In'}</span>
          </button>

          {/* Cart Button */}
          <motion.button
            key={shop.bump}
            className={`hdr-cart ${shop.count ? 'full' : ''}`}
            onClick={() => shop.setCartOpen(true)}
            animate={shop.bump ? { scale: [1, 1.08, 0.98, 1] } : {}}
            transition={{ duration: 0.35 }}
            aria-label={`Cart with ${shop.count} items`}
          >
            <span className="cart-ico-wrap">
              <ShoppingCart size={20} />
              {shop.count > 0 && <span className="cart-badge">{shop.count}</span>}
            </span>
            <span className="hdr-cart-txt">
              <b>{shop.count ? formatINR(shop.subtotal) : 'My Cart'}</b>
              <small>{shop.count ? `${shop.count} items` : 'Empty'}</small>
            </span>
          </motion.button>
        </div>

        {/* Desktop Quick Category Bar */}
        <nav className="hdr-subnav" aria-label="Quick Category Navigation">
          <div className="wrap subnav-wrap">
            {navCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className={`subnav-link ${cat.highlight ? 'subnav-hl' : ''} ${
                  pathname === cat.to ? 'active' : ''
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* MAIN VIEW CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-top">
            <div className="ftr-brand">
              <Logo />
              <p className="ftr-desc">
                Karnataka&apos;s leading confectionery supplies &amp; baking tools distributor.
                Trusted by 10,000+ passionate home bakers, pastry chefs, and bakeries.
              </p>
              <div className="ftr-badges">
                <span className="badge-pill badge-gold">✓ 100% Food-Grade</span>
                <span className="badge-pill badge-pink">⚡ Express Bangalore Dispatch</span>
              </div>
              <p className="ftr-addr">
                <MapPin size={16} />
                <span>
                  <strong>Store &amp; Warehouse:</strong> #39, Ground Floor, WAT Street, Beside Domino&apos;s Pizza,
                  Gandhi Bazaar, Basavanagudi, Bengaluru 560004
                </span>
              </p>
            </div>

            <div className="ftr-cats">
              <h3>Shop Collections</h3>
              <div className="ftr-cat-grid">
                {CATEGORIES.map((c) => (
                  <Link key={c} to={`/category/${catSlug(c)}`}>{c}</Link>
                ))}
                <Link to="/category/new-arrivals">New Arrivals</Link>
                <Link to="/category/all">Complete Catalogue</Link>
              </div>
            </div>

            <div className="ftr-contact">
              <h3>Store &amp; Bulk Booking</h3>
              <div className="contact-links">
                <a href="tel:+918041486443" className="contact-item">
                  <Phone size={15} /> 080-41486443 (Store Desk)
                </a>
                <a href="tel:+917996222111" className="contact-item">
                  <Phone size={15} /> 7996 222111 (Orders / WhatsApp)
                </a>
                <a
                  href="https://wa.me/917996222111?text=Hi%2C%20I%20am%20interested%20in%20wholesale%20rates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item wa-link"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
              </div>

              <h3 style={{ marginTop: '16px' }}>Direct Owners</h3>
              <div className="contact-links">
                <a href="tel:+919242222111" className="contact-item">
                  Mahesh · 9242 222111
                </a>
                <a href="tel:+918792222111" className="contact-item">
                  Rani Mahesh · 8792 222111
                </a>
              </div>
            </div>
          </div>

          <div className="ftr-bottom">
            <span>© {new Date().getFullYear()} Adi Shakti Trader. All Rights Reserved.</span>
            <span>Gandhi Bazaar · Basavanagudi · Bengaluru, Karnataka</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY BOTTOM DOCK (For Native-Like App Experience) */}
      <nav className="mobile-dock" aria-label="Mobile navigation">
        <Link to="/" className={`dock-tab ${pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/category/all" className={`dock-tab ${pathname.startsWith('/category') ? 'active' : ''}`}>
          <Grid size={20} />
          <span>Categories</span>
        </Link>
        <Link to="/search" className={`dock-tab ${pathname === '/search' ? 'active' : ''}`}>
          <Search size={20} />
          <span>Search</span>
        </Link>
        <a
          href="https://wa.me/917996222111?text=Hello%20Adi%20Shakti%20Trader!%20I%20want%20to%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="dock-tab dock-wa"
        >
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </a>
        <button
          type="button"
          className={`dock-tab ${shop.count ? 'has-items' : ''}`}
          onClick={() => shop.setCartOpen(true)}
          aria-label="View Cart"
        >
          <div className="dock-cart-ico">
            <ShoppingCart size={20} />
            {shop.count > 0 && <span className="dock-badge">{shop.count}</span>}
          </div>
          <span>Cart</span>
        </button>
      </nav>

      {/* Mobile Floating Cart Summary Bar */}
      <AnimatePresence>
        {shop.count > 0 && !shop.cartOpen && (
          <motion.button
            className="cartbar"
            onClick={() => shop.setCartOpen(true)}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            <span className="cartbar-imgs">
              {shop.items.slice(-3).map(({ product: p }) => (
                <img key={p.id} src={p.img} alt="" />
              ))}
            </span>
            <span className="cartbar-txt">
              <b>{shop.count} {shop.count === 1 ? 'item' : 'items'} in cart</b>
              <small>{formatINR(shop.subtotal)} · View Order</small>
            </span>
            <span className="cartbar-cta">
              Checkout <ChevronRight size={18} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <CartDrawer />
      <VideoModal />
      <LoginModal />
    </>
  );
}
