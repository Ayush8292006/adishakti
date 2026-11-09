import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, ChevronDown, ChevronRight, User, MapPin,
  ArrowLeft, ArrowUp, MessageCircle, Sparkles, Truck, Phone, X,
  Heart, Menu, Tag, Package, HelpCircle, ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { CATEGORIES, PRODUCTS, formatINR, catSlug } from '../data/products.js';
import CartDrawer from './CartDrawer.jsx';
import WishlistDrawer from './WishlistDrawer.jsx';
import VideoModal from './VideoModal.jsx';
import LoginModal from './LoginModal.jsx';
import AddButton from './AddButton.jsx';
import './Layout.css';

const HINTS = [
  'chocolate moulds',
  'rose silicone mould',
  'acrylic cake toppers',
  'piping nozzle set',
  'MDF cake boards',
  'cake boxes & packing',
  'gold wrapper foils',
];

export function BrandLogo() {
  return (
    <span className="blogo">
      <span className="blogo-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="22" height="22">
          <path
            d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <rect x="10" y="25" width="16" height="4" rx="2" fill="#ffffff" />
        </svg>
      </span>
      <span className="blogo-text">
        <span className="blogo-name">Adi Shakti</span>
        <span className="blogo-tag">THE BAKING TOOLS</span>
      </span>
    </span>
  );
}

export const Logo = BrandLogo;


function GlobalSearchBar() {
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
    <div className="search-container" ref={containerRef}>
      <form className="tbt-searchbar" onSubmit={handleSearchSubmit} role="search">
        <Search size={18} className="search-ico" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search ${HINTS[hint]}...`}
          aria-label="Search for baking tools, silicone moulds, cake toppers"
        />
        {q && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setQ('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
        <button type="submit" className="search-submit-btn" aria-label="Submit search">
          Search
        </button>
      </form>

      {/* Live Dropdown Preview */}
      <AnimatePresence>
        {isOpen && q.trim().length > 1 && (
          <motion.div
            className="search-drop-menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
          >
            <div className="search-drop-bar">
              <span>Matching Products ({matches.length})</span>
              <button
                type="button"
                className="search-drop-x"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="search-drop-none">
                <p>No products found for “{q}”</p>
                <small className="muted">Try searching “mould”, “topper”, or “nozzle”</small>
              </div>
            ) : (
              <div className="search-drop-items">
                {matches.map((item) => (
                  <div key={item.id} className="search-drop-row">
                    <Link
                      to={`/product/${item.id}`}
                      className="search-drop-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={item.img} alt="" className="search-drop-thumb" />
                      <div className="search-drop-info">
                        <span className="search-drop-name">{item.name}</span>
                        <span className="search-drop-cat">{item.category}</span>
                        <span className="search-drop-price">{formatINR(item.price)}</span>
                      </div>
                    </Link>
                    <div className="search-drop-action">
                      <AddButton id={item.id} name={item.name} size="sm" />
                    </div>
                  </div>
                ))}
                <Link
                  to={`/search?q=${encodeURIComponent(q.trim())}`}
                  className="search-drop-view-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View all results for “{q}”</span>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mouldsDropdown, setMouldsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setScrolled(y > 20);
      setShowBackTop(y > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow =
      shop.cartOpen || shop.wishlistOpen || shop.video || shop.loginOpen || mobileMenuOpen
        ? 'hidden'
        : '';
  }, [shop.cartOpen, shop.wishlistOpen, shop.video, shop.loginOpen, mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navCategories = [
    { label: 'All Products', to: '/category/all' },
    { label: 'Cake Moulds', to: `/category/${catSlug('Silicone Moulds')}`, hasDropdown: true },
    { label: 'Cake Toppers', to: `/category/${catSlug('Cake Toppers')}` },
    { label: 'Baking Tools', to: `/category/${catSlug('Baking Tools')}` },
    { label: 'Cake Bases & Boards', to: `/category/${catSlug('Cake Base & Boards')}` },
    { label: 'Packing Materials', to: `/category/${catSlug('Packing Materials')}` },
    { label: 'Decoration Ribbons', to: `/category/${catSlug('Decoration Ribbons')}` },
    { label: 'Cake Stands', to: `/category/${catSlug('Cake Stands')}` },
    { label: '✨ New Arrivals', to: '/category/new-arrivals', isHighlight: true },
  ];

  return (
    <>
      {/* Scroll Depth Progress Bar */}
      <div
        className="top-scroll-line"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      {/* TOP PROMOTIONAL ANNOUNCEMENT BAR */}
      <aside className="tbt-top-bar" aria-label="Announcement">
        <div className="wrap top-bar-wrap">
          <div className="top-bar-left">
            <span>✨ <strong>FREE SHIPPING</strong> on orders above ₹1,499</span>
            <span className="top-bar-sep">|</span>
            <span>Cash on Delivery (COD) Available</span>
            <span className="top-bar-sep">|</span>
            <span>⚡ Same-Day Bengaluru Delivery</span>
          </div>

          <div className="top-bar-right">
            <a href="tel:+917996222111" className="top-util-link">
              <Phone size={13} /> 7996 222111
            </a>
            <span className="top-bar-sep">|</span>
            <a
              href="https://wa.me/917996222111?text=Hi%2C%20I%20have%20an%20inquiry%20from%20The%20Baking%20Tools%20store"
              target="_blank"
              rel="noopener noreferrer"
              className="top-util-link"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <span className="top-bar-sep">|</span>
            <span className="top-util-loc">
              <MapPin size={13} /> Gandhi Bazaar, Bengaluru
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN STICKY HEADER */}
      <header className={`tbt-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap tbt-header-main">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {!isHome && (
            <button
              className="icon-btn header-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Logo Area */}
          <Link to="/" className="tbt-brand-link" aria-label="The Baking Tools Home">
            <BrandLogo />
          </Link>

          {/* Global Search Bar */}
          <div className="tbt-header-search">
            <GlobalSearchBar />
          </div>

          {/* Header Action Icons */}
          <div className="tbt-header-actions">
            {/* WhatsApp Quick Order button */}
            <a
              href="https://wa.me/917996222111?text=Hi%20The%20Baking%20Tools!%20I%20would%20like%20to%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="tbt-wa-btn"
              title="Chat with Store Support on WhatsApp"
            >
              <MessageCircle size={17} />
              <span>WhatsApp Order</span>
            </a>

            {/* Account / Login */}
            <button
              type="button"
              className="tbt-action-btn"
              onClick={() => shop.setLoginOpen(true)}
              aria-label="Account Login"
            >
              <User size={20} />
              <div className="action-txt">
                <small>Sign In</small>
                <b>{shop.user ? shop.user.name.split(' ')[0] : 'Account'}</b>
              </div>
            </button>

            {/* Wishlist Icon */}
            <button
              type="button"
              className="tbt-action-btn"
              onClick={() => shop.setWishlistOpen(true)}
              aria-label={`Wishlist with ${shop.wishlistCount} items`}
            >
              <div className="action-ico-box">
                <Heart size={20} />
                {shop.wishlistCount > 0 && (
                  <span className="action-badge">{shop.wishlistCount}</span>
                )}
              </div>
              <div className="action-txt">
                <small>Saved</small>
                <b>Wishlist</b>
              </div>
            </button>

            {/* Cart Button */}
            <button
              type="button"
              className="tbt-action-btn tbt-cart-action"
              onClick={() => shop.setCartOpen(true)}
              aria-label={`Shopping Cart with ${shop.count} items`}
            >
              <div className="action-ico-box">
                <ShoppingCart size={20} />
                {shop.count > 0 && (
                  <span className="action-badge badge-cart">{shop.count}</span>
                )}
              </div>
              <div className="action-txt">
                <small>{shop.count ? `${shop.count} items` : 'Bag'}</small>
                <b>{shop.count ? formatINR(shop.subtotal) : '₹0.00'}</b>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation Menu Bar */}
        <nav className="tbt-navbar" aria-label="Category Navigation">
          <div className="wrap tbt-nav-wrap">
            <div className="nav-links-left">
              {navCategories.map((cat) => (
                <div
                  key={cat.label}
                  className="nav-link-item-wrap"
                  onMouseEnter={() => cat.hasDropdown && setMouldsDropdown(true)}
                  onMouseLeave={() => cat.hasDropdown && setMouldsDropdown(false)}
                >
                  <Link
                    to={cat.to}
                    className={`tbt-nav-link ${cat.isHighlight ? 'nav-hl' : ''} ${
                      pathname === cat.to ? 'active' : ''
                    }`}
                  >
                    <span>{cat.label}</span>
                    {cat.hasDropdown && <ChevronDown size={14} />}
                  </Link>

                  {/* Dropdown Menu for Moulds */}
                  {cat.hasDropdown && mouldsDropdown && (
                    <div className="nav-dropdown-menu">
                      <div className="dropdown-col">
                        <b>Silicone Moulds</b>
                        <Link to={`/category/${catSlug('Silicone Moulds')}`}>Chocolate Bar Moulds</Link>
                        <Link to={`/category/${catSlug('Silicone Moulds')}`}>Rose &amp; Flower Moulds</Link>
                        <Link to={`/category/${catSlug('Silicone Moulds')}`}>Alphabet &amp; Number Moulds</Link>
                        <Link to={`/category/${catSlug('Silicone Moulds')}`}>Heart &amp; Geometric Moulds</Link>
                      </div>
                      <div className="dropdown-col">
                        <b>Baking Essentials</b>
                        <Link to={`/category/${catSlug('Baking Tools')}`}>Piping Nozzle Sets</Link>
                        <Link to={`/category/${catSlug('Baking Tools')}`}>Cake Scrapers &amp; Smoothers</Link>
                        <Link to={`/category/${catSlug('Cake Base & Boards')}`}>MDF Cake Boards</Link>
                        <Link to={`/category/${catSlug('Packing Materials')}`}>Transparent Cake Boxes</Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="nav-links-right">
              <Link to="/category/all" className="nav-deal-link">
                <Tag size={14} />
                <span>Special Offers &amp; Sale</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mob-drawer-bg"
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="mob-drawer"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="mob-drawer-head">
                <BrandLogo />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mob-drawer-body">
                <div className="mob-drawer-search">
                  <GlobalSearchBar />
                </div>

                <div className="mob-drawer-section">
                  <span className="mob-sec-title">Shop by Category</span>
                  <div className="mob-cat-list">
                    {navCategories.map((cat) => (
                      <Link
                        key={cat.label}
                        to={cat.to}
                        className={`mob-cat-link ${pathname === cat.to ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{cat.label}</span>
                        <ChevronRight size={16} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mob-drawer-section">
                  <span className="mob-sec-title">Quick Actions</span>
                  <div className="mob-quick-links">
                    <button
                      type="button"
                      className="mob-quick-link"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        shop.setWishlistOpen(true);
                      }}
                    >
                      <Heart size={18} />
                      <span>My Wishlist ({shop.wishlistCount})</span>
                    </button>
                    <button
                      type="button"
                      className="mob-quick-link"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        shop.setLoginOpen(true);
                      }}
                    >
                      <User size={18} />
                      <span>{shop.user ? `Hi, ${shop.user.name}` : 'Login / Register'}</span>
                    </button>
                    <a
                      href="https://wa.me/917996222111?text=Hi%20The%20Baking%20Tools!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mob-quick-link wa"
                    >
                      <MessageCircle size={18} />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="mob-drawer-info">
                  <p>
                    <MapPin size={15} /> #39 WAT Street, Gandhi Bazaar, Bengaluru
                  </p>
                  <p>
                    <Phone size={15} /> 080-41486443 · 7996 222111
                  </p>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <footer className="tbt-footer">
        <div className="wrap">
          {/* Trust Highlights Strip */}
          <div className="ftr-trust-strip">
            <div className="ftr-trust-item">
              <Truck size={24} className="ftr-tico" />
              <div>
                <b>Free Shipping</b>
                <small>On all orders above ₹1,499</small>
              </div>
            </div>
            <div className="ftr-trust-item">
              <Package size={24} className="ftr-tico" />
              <div>
                <b>Cash on Delivery (COD)</b>
                <small>Available on orders over ₹299</small>
              </div>
            </div>
            <div className="ftr-trust-item">
              <ShieldCheck size={24} className="ftr-tico" />
              <div>
                <b>100% Food-Grade Silicone</b>
                <small>BPA-free platinum cured moulds</small>
              </div>
            </div>
            <div className="ftr-trust-item">
              <HelpCircle size={24} className="ftr-tico" />
              <div>
                <b>Baker&apos;s Support Desk</b>
                <small>Direct WhatsApp advice &amp; sizing</small>
              </div>
            </div>
          </div>

          <div className="ftr-main-grid">
            {/* Column 1: Brand Info */}
            <div className="ftr-col ftr-col-brand">
              <BrandLogo />
              <p className="ftr-about-txt">
                India&apos;s dedicated online destination for baking supplies, premium silicone moulds,
                acrylic cake toppers, piping nozzles, and pastry packaging. Trusted by 10,000+ home
                bakers and commercial patisseries.
              </p>
              <div className="ftr-store-address">
                <MapPin size={16} />
                <span>
                  <strong>Store:</strong> #39, Ground Floor, WAT Street, Beside Domino&apos;s Pizza,
                  Gandhi Bazaar, Basavanagudi, Bengaluru 560004
                </span>
              </div>
            </div>

            {/* Column 2: Shop Categories */}
            <div className="ftr-col">
              <h3>Shop Categories</h3>
              <ul className="ftr-links">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link to={`/category/${catSlug(c)}`}>{c}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/category/new-arrivals">New Arrivals</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care & Policies */}
            <div className="ftr-col">
              <h3>Customer Care</h3>
              <ul className="ftr-links">
                <li><Link to="/category/all">Browse All Products</Link></li>
                <li><a href="tel:+917996222111">Track Your Order</a></li>
                <li><a href="#faqs">Shipping &amp; Delivery Policy</a></li>
                <li><a href="#faqs">Returns &amp; Replacement</a></li>
                <li><a href="#faqs">Food-Grade Certification</a></li>
                <li><a href="#faqs">Store Pickup (Basavanagudi)</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Contact */}
            <div className="ftr-col ftr-col-newsletter">
              <h3>Stay Connected</h3>
              <p className="ftr-news-sub">
                Subscribe for exclusive discounts, new mould launches &amp; baking tutorials.
              </p>

              <form
                className="ftr-newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to The Baking Tools Club!');
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  required
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Subscribe
                </button>
              </form>

              <div className="ftr-contact-block">
                <a href="tel:+917996222111" className="ftr-contact-link">
                  <Phone size={14} /> +91 7996 222111 / 080-41486443
                </a>
                <a
                  href="https://wa.me/917996222111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ftr-contact-link wa"
                >
                  <MessageCircle size={14} /> WhatsApp Support (Mon-Sat 10 AM - 8 PM)
                </a>
              </div>
            </div>
          </div>

          <div className="ftr-bottom-bar">
            <span>
              © {new Date().getFullYear()} The Baking Tools Store (Adi Shakti Trader). All rights reserved.
            </span>
            <div className="ftr-payments">
              <span className="pay-badge">UPI</span>
              <span className="pay-badge">Visa</span>
              <span className="pay-badge">Mastercard</span>
              <span className="pay-badge">RuPay</span>
              <span className="pay-badge">NetBanking</span>
              <span className="pay-badge">COD</span>
            </div>
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

      {/* MOBILE STICKY BOTTOM NAVIGATION DOCK */}
      <nav className="mobile-dock" aria-label="Mobile Navigation">
        <Link to="/" className={`dock-tab ${pathname === '/' ? 'active' : ''}`}>
          <BrandLogo />
          <span>Home</span>
        </Link>
        <Link
          to="/category/all"
          className={`dock-tab ${pathname.startsWith('/category') ? 'active' : ''}`}
        >
          <Package size={20} />
          <span>Shop</span>
        </Link>
        <button
          type="button"
          className={`dock-tab ${shop.wishlistCount ? 'has-items' : ''}`}
          onClick={() => shop.setWishlistOpen(true)}
          aria-label="Wishlist"
        >
          <div className="dock-ico-wrap">
            <Heart size={20} />
            {shop.wishlistCount > 0 && <span className="dock-badge">{shop.wishlistCount}</span>}
          </div>
          <span>Wishlist</span>
        </button>
        <a
          href="https://wa.me/917996222111?text=Hi%20The%20Baking%20Tools!"
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
          <div className="dock-ico-wrap">
            <ShoppingCart size={20} />
            {shop.count > 0 && <span className="dock-badge">{shop.count}</span>}
          </div>
          <span>Bag</span>
        </button>
      </nav>

      <CartDrawer />
      <WishlistDrawer />
      <VideoModal />
      <LoginModal />
    </>
  );
}
