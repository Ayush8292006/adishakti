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
  'Customized Toppers',
  'Rose Silicone Moulds',
  'Kunafa Chocolate Boxes',
  'Piping Nozzle Sets',
  'MDF Cake Boards',
  'Sliding Gift Boxes',
  'PVC Hamper Bags',
];

export function BrandLogo() {
  return (
    <span className="blogo">
      <span className="blogo-mark" aria-hidden="true">
        {/* Whisk + Spatula heart icon styled as in screenshot */}
        <svg viewBox="0 0 40 40" width="34" height="34">
          <circle cx="20" cy="20" r="18" fill="#caa27d" fillOpacity="0.2" />
          <path
            d="M13 14c-1.5 2-1 6 2 8l5 5 5-5c3-2 3.5-6 2-8-1.5-2-4-2-6 0l-1 1-1-1c-2-2-4.5-2-6 0z"
            fill="none"
            stroke="#c2185b"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M20 27v7M16 34h8M14 9l12 12"
            stroke="#caa27d"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="blogo-text">
        <span className="blogo-name">Adi Shakti</span>
        <span className="blogo-tag">baking tools.com</span>
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
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Search for ${HINTS[hint]}`}
          aria-label="Search for Customized Toppers, Cake Moulds, Packaging"
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
        <button type="submit" className="search-icon-btn-block" aria-label="Submit search">
          <Search size={18} />
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
                <small className="muted">Try searching “mould”, “topper”, or “box”</small>
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

  // Dropdown states for navbar categories
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  // Exact navigation menu items matching Image 3:
  const navMenuItems = [
    {
      id: 'festive',
      label: 'Diwali Collection',
      to: `/category/${catSlug('Packing Materials')}`,
      hasDropdown: true,
      subItems: [
        { label: 'PVC Hamper Boxes', to: `/category/${catSlug('Packing Materials')}` },
        { label: 'PVC Hamper Bags', to: `/category/${catSlug('Packing Materials')}` },
        { label: 'Sliding Gift Boxes', to: `/category/${catSlug('Packing Materials')}` },
        { label: 'Kunafa Chocolate Boxes', to: `/category/${catSlug('Packing Materials')}` },
        { label: 'Collapsible Gift Boxes', to: `/category/${catSlug('Packing Materials')}` },
      ],
    },
    { id: 'home', label: 'Home', to: '/' },
    {
      id: 'bake-craft',
      label: 'Bake Craft',
      to: `/category/${catSlug('Silicone Moulds')}`,
      hasDropdown: true,
      subItems: [
        { label: 'Silicone Cake Moulds', to: `/category/${catSlug('Silicone Moulds')}` },
        { label: 'Chocolate Bar Moulds', to: `/category/${catSlug('Silicone Moulds')}` },
        { label: 'Piping Nozzle Sets', to: `/category/${catSlug('Baking Tools')}` },
        { label: 'Cake Scrapers & Smoothers', to: `/category/${catSlug('Baking Tools')}` },
        { label: 'Measuring Sets & Bowls', to: `/category/${catSlug('Baking Tools')}` },
      ],
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      to: `/category/${catSlug('Silicone Moulds')}`,
      hasDropdown: true,
      subItems: [
        { label: 'Food-Grade Chocolate Moulds', to: `/category/${catSlug('Silicone Moulds')}` },
        { label: 'Fondant Plunger Cutters', to: `/category/${catSlug('Baking Tools')}` },
        { label: 'Foil Wrapper Sheets', to: `/category/${catSlug('Packing Materials')}` },
      ],
    },
    {
      id: 'packing',
      label: 'Packing Material',
      to: `/category/${catSlug('Packing Materials')}`,
      hasDropdown: true,
      subItems: [
        { label: 'MDF Round Cake Boards', to: `/category/${catSlug('Cake Base & Boards')}` },
        { label: 'White Cake Bases (5", 6")', to: `/category/${catSlug('Cake Base & Boards')}` },
        { label: 'Cake Dowels & Tier Pillars', to: `/category/${catSlug('Cake Base & Boards')}` },
        { label: 'Transparent Acrylic Boxes', to: `/category/${catSlug('Packing Materials')}` },
        { label: 'Gold & Colour Foil Sheets', to: `/category/${catSlug('Packing Materials')}` },
      ],
    },
    {
      id: 'party',
      label: 'Party Supplies',
      to: `/category/${catSlug('Cake Toppers')}`,
      hasDropdown: true,
      subItems: [
        { label: 'Gold Ginkgo Leaf Topper', to: `/category/${catSlug('Cake Toppers')}` },
        { label: 'Happy Birthday Gold Coins', to: `/category/${catSlug('Cake Toppers')}` },
        { label: 'Filigree Butterfly Toppers', to: `/category/${catSlug('Cake Toppers')}` },
        { label: 'Red Satin & Diamond Mesh Ribbons', to: `/category/${catSlug('Decoration Ribbons')}` },
        { label: 'Mini Crown & Doll Toppers', to: `/category/${catSlug('Cake Toppers')}` },
      ],
    },
    {
      id: 'home-kitchen',
      label: 'Home and Kitchen',
      to: `/category/${catSlug('Cake Stands')}`,
      hasDropdown: true,
      subItems: [
        { label: 'Transparent Acrylic Cake Stands', to: `/category/${catSlug('Cake Stands')}` },
        { label: 'Quilted Oven Mitts', to: `/category/${catSlug('Baking Tools')}` },
        { label: 'Stainless Steel Mixing Bowls', to: `/category/${catSlug('Baking Tools')}` },
      ],
    },
    { id: 'blogs', label: 'Baking Demos & Videos', to: '/#video-section' },
    { id: 'contact', label: 'Contact Us', to: '/#contact-footer' },
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

      {/* MAIN HEADER (Warm Custard Cream #fff6e5) */}
      <header className={`tbt-header-matched ${scrolled ? 'is-scrolled' : ''}`}>
        {/* Row 1: Logo, Search, Hamburger & Utility Icons */}
        <div className="tbt-header-top-row">
          <div className="wrap header-top-wrap">
            <div className="header-left-col">
              <button
                type="button"
                className="hamburger-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={24} />
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
              <Link to="/" className="brand-logo-link" aria-label="Adi Shakti Home">
                <BrandLogo />
              </Link>
            </div>

            {/* Center: Search Bar with Caramel Border & Icon */}
            <div className="header-search-center">
              <GlobalSearchBar />
            </div>

            {/* Right: User & Cart Icons */}
            <div className="header-right-icons">
              {/* Wishlist Icon */}
              <button
                type="button"
                className="header-icon-action"
                onClick={() => shop.setWishlistOpen(true)}
                aria-label={`Wishlist (${shop.wishlistCount})`}
                title="Wishlist"
              >
                <Heart size={22} />
                {shop.wishlistCount > 0 && (
                  <span className="header-badge">{shop.wishlistCount}</span>
                )}
              </button>

              {/* Account / User Icon */}
              <button
                type="button"
                className="header-icon-action"
                onClick={() => shop.setLoginOpen(true)}
                aria-label="User Account"
                title={shop.user ? `Logged in as ${shop.user.name}` : 'Login / Register'}
              >
                <User size={23} />
              </button>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                className="header-icon-action cart-action"
                onClick={() => shop.setCartOpen(true)}
                aria-label={`Cart (${shop.count} items)`}
                title="Shopping Bag"
              >
                <ShoppingCart size={23} />
                {shop.count > 0 && (
                  <span className="header-badge badge-cart">{shop.count}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Sub-Navbar (Apricot Cream #fae8c6 with Purple Bottom Border #7d1357) */}
        <nav className="tbt-subnavbar" aria-label="Main Store Navigation">
          <div className="wrap subnavbar-wrap">
            {navMenuItems.map((item) => (
              <div
                key={item.id}
                className="subnav-item-box"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.to}
                  className={`subnav-link ${
                    pathname === item.to || (item.id === 'home' && isHome) ? 'active' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown size={13} className="subnav-chevron" />}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.id && (
                  <div className="subnav-dropdown-flyout">
                    <div className="flyout-links">
                      {item.subItems.map((sub) => (
                        <Link key={sub.label} to={sub.to} className="flyout-link">
                          <ChevronRight size={14} className="flyout-bullet" />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                  <span className="mob-sec-title">Store Menu</span>
                  <div className="mob-cat-list">
                    {navMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.to}
                        className={`mob-cat-link ${pathname === item.to ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
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
                      href="https://wa.me/917996222111?text=Hi%20Adi%20Shakti!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mob-quick-link wa"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp Order Support</span>
                    </a>
                  </div>
                </div>

                <div className="mob-drawer-info">
                  <p>
                    <MapPin size={15} /> #39 WAT Street, Gandhi Bazaar, Basavanagudi, Bengaluru
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
      <footer id="contact-footer" className="tbt-footer">
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
                India&apos;s premier destination for cake moulds, festive packaging boxes,
                acrylic toppers, piping nozzles, and confectionery supplies. Dispatched across India
                from Gandhi Bazaar, Bengaluru.
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
              <h3>Shop Collections</h3>
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
                <li><a href="#faqs">Store Pickup (Gandhi Bazaar)</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Contact */}
            <div className="ftr-col ftr-col-newsletter">
              <h3>Stay Connected</h3>
              <p className="ftr-news-sub">
                Subscribe for festive offers, new mould launches &amp; baking tutorials.
              </p>

              <form
                className="ftr-newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to Adi Shakti!');
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
                  <MessageCircle size={14} /> WhatsApp Support (Mon-Sat 10 AM - 8:30 PM)
                </a>
              </div>
            </div>
          </div>

          <div className="ftr-bottom-bar">
            <span>
              © {new Date().getFullYear()} Adi Shakti Trader (thebakingtools.com style store). All rights reserved.
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
          href="https://wa.me/917996222111?text=Hi%20Adi%20Shakti!"
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
