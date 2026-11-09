import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Phone, Video, BadgePercent, Store, Sparkles,
  ShieldCheck, Truck, MessageCircle, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, Flame, Star, Package, Heart, Award
} from 'lucide-react';
import Rail from '../components/Rail.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, formatINR } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const EASE = [0.16, 1, 0.3, 1];

const inViewAnim = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45, delay, ease: EASE },
});

const byCat = (...cats) => PRODUCTS.filter((p) => cats.includes(p.category));

const FAQS = [
  {
    q: 'What is the Free Shipping policy on orders?',
    a: 'We offer FREE PAN-India delivery on all orders above ₹1,499. For orders below ₹1,499, a flat nominal delivery charge applies. For local Bengaluru customers, same-day delivery is available via express courier.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes! Cash on Delivery (COD) is available on all eligible orders over ₹299 across most pincodes in India. You can also pay seamlessly online via UPI, Google Pay, PhonePe, Paytm, Credit/Debit cards, or NetBanking.',
  },
  {
    q: 'Are your silicone moulds certified 100% food-grade?',
    a: 'Yes, absolutely. All our chocolate, cake, and fondant silicone moulds are manufactured from premium platinum-cured, BPA-free, food-grade silicone. They are heat-resistant from -40°C to 230°C and safe for ovens, microwaves, freezers, and dishwashers.',
  },
  {
    q: 'Can I pick up my order directly from the store?',
    a: 'Yes! You can visit our retail store at #39, WAT Street, Beside Domino\'s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004. You can place your order online for in-store pickup or explore our entire 500+ items collection in person.',
  },
  {
    q: 'Do you offer wholesale bulk discounts for commercial bakeries?',
    a: 'Yes, we supply directly to commercial bakeries, home baking academies, and cloud kitchens across India. Special wholesale discounts start at 10+ units per item. Call us at 7996 222111 or chat with us on WhatsApp for our wholesale catalogue.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Pooja Kashyap',
    role: 'Home Baker, Bengaluru',
    quote: 'The Rose Silicone Mould gives such sharp, realistic chocolate petals! Delivery was super fast and the packaging was completely damage-proof.',
    rating: 5,
    tag: 'Verified Buyer',
  },
  {
    name: 'Chef Rahul Mehta',
    role: 'Pastry Chef, Mumbai',
    quote: 'We order cake boards, dowels, and acrylic boxes in bulk from The Baking Tools every month. The pricing is unbeatable and the quality is consistently top tier.',
    rating: 5,
    tag: 'Commercial Bakery',
  },
  {
    name: 'Sneha Deshmukh',
    role: 'Cake Artist, Pune',
    quote: 'Their gold ginkgo toppers and piping nozzle sets elevated my wedding cakes instantly. Plus, their WhatsApp team is always ready to advise on mould sizes.',
    rating: 5,
    tag: 'Verified Baker',
  },
];

function FestiveHeroCarousel() {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'diwali-packaging',
      title: 'DIWALI',
      subtitle: 'PACKAGING',
      tag: 'Exclusive Festive Range',
      to: `/category/${catSlug('Packing Materials')}`,
      bannerImg: '/banners/diwali-packaging-banner.jpg',
      themeGradient: 'radial-gradient(ellipse at 50% 50%, #b8235a 0%, #7d124e 50%, #4a062f 100%)',
      pedestals: [
        { id: 'pvc-box', label: 'PVC HAMPER BOX', to: `/category/${catSlug('Packing Materials')}`, x: '12%', y: '26%' },
        { id: 'pvc-bag', label: 'PVC HAMPER BAG', to: `/category/${catSlug('Packing Materials')}`, x: '21%', y: '78%' },
        { id: 'sliding-box', label: 'SLIDING GIFT BOX', to: `/category/${catSlug('Packing Materials')}`, x: '50%', y: '80%' },
        { id: 'kunafa-box', label: 'KUNAFA CHOCOLATE BOX', to: `/category/${catSlug('Packing Materials')}`, x: '82%', y: '28%' },
        { id: 'collapsible-box', label: 'COLLAPSIBLE BOXES', to: `/category/${catSlug('Packing Materials')}`, x: '78%', y: '78%' },
      ],
    },
    {
      id: 'bake-craft',
      title: 'BAKE CRAFT',
      subtitle: 'SILICONE MOULDS',
      tag: '100% Certified Food Grade',
      to: `/category/${catSlug('Silicone Moulds')}`,
      themeGradient: 'radial-gradient(ellipse at 50% 50%, #9e1b4f 0%, #680e3c 55%, #3b0621 100%)',
      pedestals: [
        { id: 'rose-mould', label: '3D ROSE MOULD', to: `/category/${catSlug('Silicone Moulds')}`, img: '/products/rose-mould.jpg', price: '₹169', x: '14%', y: '30%' },
        { id: 'bar-mould', label: 'CHOCOLATE BAR MOULD', to: `/category/${catSlug('Silicone Moulds')}`, img: '/products/bar-mould-6.jpg', price: '₹199', x: '21%', y: '74%' },
        { id: 'nozzle-set', label: 'PIPING NOZZLE SET', to: `/category/${catSlug('Baking Tools')}`, img: '/products/nozzle-set.jpg', price: '₹349', x: '50%', y: '76%' },
        { id: 'comb-scraper', label: 'COMB CAKE SCRAPER', to: `/category/${catSlug('Baking Tools')}`, img: '/products/comb-scraper.jpg', price: '₹129', x: '82%', y: '30%' },
        { id: 'plunger-cutter', label: 'PLUNGER CUTTER SET', to: `/category/${catSlug('Baking Tools')}`, img: '/products/plunger-cutter.jpg', price: '₹179', x: '78%', y: '74%' },
      ],
    },
    {
      id: 'party-supplies',
      title: 'PARTY SUPPLIES',
      subtitle: 'CAKE TOPPERS',
      tag: 'Mirror Gold Acrylic Collection',
      to: `/category/${catSlug('Cake Toppers')}`,
      themeGradient: 'radial-gradient(ellipse at 50% 50%, #851859 0%, #570b3b 55%, #300420 100%)',
      pedestals: [
        { id: 'ginkgo', label: 'GOLD GINKGO TOPPER', to: `/category/${catSlug('Cake Toppers')}`, img: '/products/ginkgo-topper.jpg', price: '₹149', x: '14%', y: '30%' },
        { id: 'butterfly', label: 'FILIGREE BUTTERFLIES', to: `/category/${catSlug('Cake Toppers')}`, img: '/products/filigree-butterfly.jpg', price: '₹139', x: '21%', y: '74%' },
        { id: 'hb-coin', label: 'BIRTHDAY GOLD COIN', to: `/category/${catSlug('Cake Toppers')}`, img: '/products/hb-coin.jpg', price: '₹119', x: '50%', y: '76%' },
        { id: 'acrylic-stand', label: 'ACRYLIC CAKE STAND', to: `/category/${catSlug('Cake Stands')}`, img: '/products/acrylic-stand.jpg', price: '₹599', x: '82%', y: '30%' },
        { id: 'satin-ribbon', label: 'LUXURY SATIN RIBBON', to: `/category/${catSlug('Decoration Ribbons')}`, img: '/products/satin-ribbon-red.jpg', price: '₹149', x: '78%', y: '74%' },
      ],
    },
    {
      id: 'packing-material',
      title: 'PACKING MATERIAL',
      subtitle: 'BOXES & BOARDS',
      tag: 'Direct Distributor Rates',
      to: `/category/${catSlug('Packing Materials')}`,
      themeGradient: 'radial-gradient(ellipse at 50% 50%, #a32258 0%, #6e113f 55%, #3c0623 100%)',
      pedestals: [
        { id: 'mdf-board', label: 'MDF CAKE BOARD', to: `/category/${catSlug('Cake Base & Boards')}`, img: '/products/mdf-cake-board.jpg', price: '₹189', x: '14%', y: '30%' },
        { id: 'acrylic-box', label: 'TRANSPARENT BOX', to: `/category/${catSlug('Packing Materials')}`, img: '/products/acrylic-box.jpg', price: '₹229', x: '21%', y: '74%' },
        { id: 'gold-foil', label: 'GOLD FOIL SHEETS', to: `/category/${catSlug('Packing Materials')}`, img: '/products/gold-foil.jpg', price: '₹139', x: '50%', y: '76%' },
        { id: 'cake-base', label: 'WHITE CAKE BASE', to: `/category/${catSlug('Cake Base & Boards')}`, img: '/products/cake-base-6.jpg', price: '₹119', x: '82%', y: '30%' },
        { id: 'dowels', label: 'CAKE DOWEL PILLARS', to: `/category/${catSlug('Cake Base & Boards')}`, img: '/products/cake-dowels.jpg', price: '₹99', x: '78%', y: '74%' },
      ],
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const cur = slides[slide];

  return (
    <div
      className="festive-banner-slider-box"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="festive-banner-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            className="festive-banner-slide"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: cur.themeGradient }}
          >
            {/* Slide 0: Matched exact reference banner from thebakingtools.com */}
            {cur.bannerImg ? (
              <div className="festive-matched-img-layer">
                <img
                  src={cur.bannerImg}
                  alt="Diwali Packaging Festive Collection"
                  className="festive-matched-bg-img"
                />
                {/* Interactive Hotspot Links */}
                {cur.pedestals.map((ped) => (
                  <Link
                    key={ped.id}
                    to={ped.to}
                    className={`festive-hotspot hotspot-${ped.id}`}
                    style={{ left: ped.x, top: ped.y }}
                    aria-label={`Shop ${ped.label}`}
                  >
                    <span className="hotspot-pulse" />
                    <span className="hotspot-pill-label">{ped.label}</span>
                  </Link>
                ))}
              </div>
            ) : (
              /* Rendered Pedestal Stage for subsequent slides */
              <div className="festive-rendered-stage">
                {/* Hanging Garlands Left & Right */}
                <div className="festive-garland garland-left" aria-hidden="true">
                  <div className="garland-flower g-orange" />
                  <div className="garland-flower g-yellow" />
                  <div className="garland-flower g-orange" />
                  <div className="garland-flower g-yellow" />
                  <div className="garland-tassel" />
                </div>
                <div className="festive-garland garland-right" aria-hidden="true">
                  <div className="garland-flower g-orange" />
                  <div className="garland-flower g-yellow" />
                  <div className="garland-flower g-orange" />
                  <div className="garland-flower g-yellow" />
                  <div className="garland-tassel" />
                </div>

                {/* Ambient Center Radial Glow */}
                <div className="festive-radial-glow" aria-hidden="true" />

                {/* Central Display Serif Title */}
                <div className="festive-center-title-group">
                  <span className="festive-tag-sub">{cur.tag}</span>
                  <h2 className="festive-title-main">{cur.title}</h2>
                  <h3 className="festive-title-sub">{cur.subtitle}</h3>
                </div>

                {/* 5 Glowing Pedestals with Products */}
                <div className="festive-pedestals-container">
                  {cur.pedestals.map((p) => (
                    <Link
                      key={p.id}
                      to={p.to}
                      className={`festive-pedestal-link ped-pos-${p.id}`}
                      style={{ left: p.x, top: p.y }}
                    >
                      <div className="pedestal-product-wrap">
                        <img src={p.img} alt={p.label} className="pedestal-img" />
                        {p.price && <span className="pedestal-price-chip">{p.price}</span>}
                      </div>
                      <div className="pedestal-disc-base" />
                      <span className="pedestal-caption">{p.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Vertical Pill Pagination Dots (Screenshot 2 Match) */}
            <div className="festive-vert-pagination" aria-label="Banner slides">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`festive-vert-dot ${slide === idx ? 'is-active' : ''}`}
                  onClick={() => setSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            {/* Carousel Arrow Controls */}
            <button
              type="button"
              className="festive-nav-arrow arrow-prev"
              onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="festive-nav-arrow arrow-next"
              onClick={() => setSlide((s) => (s + 1) % slides.length)}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust Highlights Strip Under Banner */}
      <div className="festive-trust-strip">
        <div className="ftrust-box">
          <Truck size={18} className="ftrust-ico" />
          <div className="ftrust-txt">
            <b>Free Delivery</b>
            <small>On all orders above ₹1,499</small>
          </div>
        </div>
        <div className="ftrust-box">
          <ShieldCheck size={18} className="ftrust-ico" />
          <div className="ftrust-txt">
            <b>100% Food Grade</b>
            <small>Certified Platinum Silicone</small>
          </div>
        </div>
        <div className="ftrust-box">
          <Package size={18} className="ftrust-ico" />
          <div className="ftrust-txt">
            <b>Cash on Delivery</b>
            <small>Available PAN-India</small>
          </div>
        </div>
        <div className="ftrust-box">
          <Award size={18} className="ftrust-ico" />
          <div className="ftrust-txt">
            <b>Direct Wholesale</b>
            <small>Factory pricing on 500+ tools</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home({ ready = true }) {
  const shop = useShop();
  const [activeTab, setActiveTab] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categoryCards = [
    { label: 'Cake Moulds', img: CAT_IMG['Silicone Moulds'], to: `/category/${catSlug('Silicone Moulds')}`, count: '14 Items', tag: 'Bestseller' },
    { label: 'Cake Toppers', img: CAT_IMG['Cake Toppers'], to: `/category/${catSlug('Cake Toppers')}`, count: '12 Items', tag: 'Popular' },
    { label: 'Baking Tools', img: CAT_IMG['Baking Tools'], to: `/category/${catSlug('Baking Tools')}`, count: '11 Items', tag: 'Essential' },
    { label: 'Cake Bases & Boards', img: CAT_IMG['Cake Base & Boards'], to: `/category/${catSlug('Cake Base & Boards')}`, count: '5 Items', tag: 'Heavy Duty' },
    { label: 'Packing Materials', img: CAT_IMG['Packing Materials'], to: `/category/${catSlug('Packing Materials')}`, count: '6 Items', tag: 'Boxes & Foil' },
    { label: 'Decoration Ribbons', img: CAT_IMG['Decoration Ribbons'], to: `/category/${catSlug('Decoration Ribbons')}`, count: '4 Items', tag: 'Luxury Satin' },
    { label: 'Cake Stands', img: CAT_IMG['Cake Stands'], to: `/category/${catSlug('Cake Stands')}`, count: '2 Items', tag: 'Acrylic' },
    { label: 'New Arrivals', img: '/products/plunger-cutter.jpg', to: '/category/new-arrivals', count: 'Fresh Stock', tag: 'New' },
  ];

  const filteredProducts = activeTab === 'All'
    ? PRODUCTS.slice(0, 8)
    : activeTab === 'Moulds'
    ? byCat('Silicone Moulds').slice(0, 8)
    : activeTab === 'Toppers'
    ? byCat('Cake Toppers').slice(0, 8)
    : activeTab === 'Tools'
    ? byCat('Baking Tools').slice(0, 8)
    : byCat('Packing Materials', 'Decoration Ribbons').slice(0, 8);

  const spotlightItem = PRODUCTS.find((p) => p.id === 41) || PRODUCTS[0];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tbt-homepage"
    >
      {/* ========================================================
          1. FESTIVE HERO CAROUSEL BANNER (Screenshot 2 Match)
          ======================================================== */}
      <section className="wrap hero-section">
        <FestiveHeroCarousel />
      </section>

      {/* ========================================================
          2. CORE USPs STRIP
          ======================================================== */}
      <section className="wrap usp-strip-section">
        <div className="usp-grid">
          <div className="usp-item">
            <span className="usp-icon-wrap"><Truck size={22} /></span>
            <div className="usp-text">
              <b>Free Delivery on ₹1,499+</b>
              <small>Fast Pan-India &amp; same-day Bengaluru dispatch</small>
            </div>
          </div>

          <div className="usp-item">
            <span className="usp-icon-wrap"><ShieldCheck size={22} /></span>
            <div className="usp-text">
              <b>100% Food-Safe Silicone</b>
              <small>BPA-free platinum silicone, oven &amp; freezer safe</small>
            </div>
          </div>

          <div className="usp-item">
            <span className="usp-icon-wrap"><BadgePercent size={22} /></span>
            <div className="usp-text">
              <b>Wholesale Slabs for Bakeries</b>
              <small>Save up to 20% on bulk quantities &amp; materials</small>
            </div>
          </div>

          <div className="usp-item">
            <span className="usp-icon-wrap"><Video size={22} /></span>
            <div className="usp-text">
              <b>2-Minute Video Tutorials</b>
              <small>Step-by-step baking demos for every mould &amp; nozzle</small>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SHOP BY CATEGORY SHOWCASE (Clean Visual Grid)
          ======================================================== */}
      <section id="categories" className="wrap category-showcase-section">
        <div className="section-header">
          <div>
            <h2>Shop by Category</h2>
            <p>Explore our wide selection of cake tools, moulds, and packaging essentials</p>
          </div>
          <Link to="/category/all" className="section-view-all">
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cat-showcase-grid">
          {categoryCards.map((cat, idx) => (
            <motion.div key={cat.label} {...inViewAnim(idx * 0.04)}>
              <Link to={cat.to} className="cat-showcase-card">
                <div className="cat-showcase-img-wrap">
                  <img src={cat.img} alt={cat.label} loading="lazy" />
                  <span className="cat-card-tag">{cat.tag}</span>
                </div>
                <div className="cat-showcase-meta">
                  <b>{cat.label}</b>
                  <small>{cat.count}</small>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. PROMOTIONAL FEATURE BANNERS (3-Up Grid)
          ======================================================== */}
      <section className="wrap promo-banners-section">
        <div className="promo-banners-grid">
          <motion.div className="pbanner pbanner-moulds" {...inViewAnim(0)}>
            <div className="pbanner-copy">
              <span className="pbanner-badge">100% Food-Grade</span>
              <h3>Silicone Chocolate Moulds</h3>
              <p>Rose, flower, star, heart &amp; multi-cavity bar moulds.</p>
              <Link to={`/category/${catSlug('Silicone Moulds')}`} className="btn btn-sm btn-primary">
                Shop Moulds &rarr;
              </Link>
            </div>
            <img src="/products/rose-mould.jpg" alt="" className="pbanner-art" />
          </motion.div>

          <motion.div className="pbanner pbanner-toppers" {...inViewAnim(0.06)}>
            <div className="pbanner-copy">
              <span className="pbanner-badge">Celebration Decor</span>
              <h3>Acrylic Cake Toppers</h3>
              <p>Gold ginkgo, birthday coins, fairy dolls &amp; butterfly sets.</p>
              <Link to={`/category/${catSlug('Cake Toppers')}`} className="btn btn-sm btn-primary">
                Explore Toppers &rarr;
              </Link>
            </div>
            <img src="/products/filigree-butterfly.jpg" alt="" className="pbanner-art" />
          </motion.div>

          <motion.div className="pbanner pbanner-packaging" {...inViewAnim(0.12)}>
            <div className="pbanner-copy">
              <span className="pbanner-badge">Heavy Duty &amp; Luxury</span>
              <h3>Bakery Boxes &amp; Boards</h3>
              <p>MDF boards, cake dowels, transparent acrylic boxes &amp; ribbons.</p>
              <Link to={`/category/${catSlug('Packing Materials')}`} className="btn btn-sm btn-primary">
                View Packaging &rarr;
              </Link>
            </div>
            <img src="/products/acrylic-box.jpg" alt="" className="pbanner-art" />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          5. BEST-SELLING PRODUCTS WITH FILTER TABS
          ======================================================== */}
      <section className="wrap curated-products-section">
        <div className="curated-header-row">
          <div>
            <h2>Best-Selling Baking Supplies</h2>
            <p>Customer favorites handpicked for home bakers and commercial patisseries</p>
          </div>

          <div className="curated-tab-list" role="tablist" aria-label="Category filter tabs">
            {['All', 'Moulds', 'Toppers', 'Tools', 'Packaging'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`curated-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="products-grid-container">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ========================================================
          6. FLASH SALE & DEAL OF THE WEEK WITH COUNTDOWN
          ======================================================== */}
      <section className="wrap flash-deal-section">
        <motion.div className="flash-deal-card" {...inViewAnim()}>
          <div className="flash-deal-left">
            <div className="flash-deal-badge-row">
              <span className="badge-pill badge-sale">
                <Flame size={12} /> FLASH DEAL OF THE WEEK
              </span>
              <span className="badge-pill badge-discount">25% OFF</span>
            </div>

            <h2>{spotlightItem.name}</h2>
            <p className="flash-deal-desc">
              Food-grade platinum silicone mould. Create flawless edible chocolate flowers with sharp,
              delicate petals for cakes, cupcakes, and dessert platters.
            </p>

            <div className="flash-timer-box">
              <span className="timer-label"><Clock size={14} /> Deal ends in:</span>
              <div className="timer-digits">
                <div className="digit-block">
                  <b>{String(timeLeft.hours).padStart(2, '0')}</b>
                  <small>Hours</small>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-block">
                  <b>{String(timeLeft.minutes).padStart(2, '0')}</b>
                  <small>Mins</small>
                </div>
                <span className="digit-colon">:</span>
                <div className="digit-block">
                  <b>{String(timeLeft.seconds).padStart(2, '0')}</b>
                  <small>Secs</small>
                </div>
              </div>
            </div>

            <div className="flash-price-row">
              <span className="flash-current-price">{formatINR(spotlightItem.price)}</span>
              <span className="flash-mrp">{formatINR(Math.round(spotlightItem.price * 1.35))}</span>
              <span className="flash-save">Save {formatINR(Math.round(spotlightItem.price * 0.35))}</span>
            </div>

            <div className="flash-actions-row">
              <Link to={`/product/${spotlightItem.id}`} className="btn btn-primary btn-lg">
                Buy Now at Special Price
              </Link>
              <a
                href={`https://wa.me/917996222111?text=Hi!%20I%20want%20to%20order%20the%20Flash%20Deal:%20${encodeURIComponent(
                  spotlightItem.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
            </div>
          </div>

          <div className="flash-deal-right">
            <img src={spotlightItem.img} alt={spotlightItem.name} />
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          7. CATEGORIZED PRODUCT RAILS
          ======================================================== */}
      <Rail
        title="✨ Fresh New Arrivals"
        subtitle="Recently unpacked and ready for immediate dispatch"
        products={PRODUCTS.filter((p) => p.isNew)}
        to="/category/new-arrivals"
      />

      <Rail
        title="🎂 Celebration Cake Toppers"
        subtitle="Acrylic, gold foil, butterfly sets, and miniature figurines"
        products={byCat('Cake Toppers')}
        to={`/category/${catSlug('Cake Toppers')}`}
      />

      <Rail
        title="🍫 Silicone &amp; Chocolate Moulds"
        subtitle="100% Certified Food-Grade Platinum Silicone"
        products={byCat('Silicone Moulds')}
        to={`/category/${catSlug('Silicone Moulds')}`}
      />

      {/* ========================================================
          8. WATCH & LEARN 2-MINUTE VIDEO TUTORIALS
          ======================================================== */}
      <section className="wrap video-tutorials-section">
        <div className="section-header">
          <div>
            <h2>Watch &amp; Learn Before You Bake</h2>
            <p>2-minute step-by-step videos showing tools and styling techniques in action</p>
          </div>
        </div>

        <div className="video-reels-track">
          {VIDEOS.map((v, i) => (
            <motion.button
              key={v.id}
              className="video-reel-card"
              onClick={() => shop.setVideo(v)}
              {...inViewAnim(i * 0.05)}
            >
              <div className="reel-thumb-box">
                <img src={v.poster} alt={v.title} loading="lazy" />
                <span className="reel-play-icon">
                  <Play size={18} fill="currentColor" />
                </span>
                <span className="reel-duration-pill">{v.duration}</span>
                <span className="reel-category-pill">{v.category}</span>
              </div>
              <div className="reel-meta">
                <b>{v.title}</b>
                <small>{v.productIds.length} Products Used &rarr;</small>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <Rail
        title="🧁 Professional Piping Nozzles &amp; Tools"
        subtitle="Precision stainless nozzles, scrapers, whisks &amp; bowls"
        products={byCat('Baking Tools')}
        to={`/category/${catSlug('Baking Tools')}`}
      />

      <Rail
        title="📦 Sturdy Cake Bases, Boards &amp; Packaging"
        subtitle="MDF boards, dowels, gift boxes, and wrapping foils"
        products={byCat('Cake Base & Boards', 'Packing Materials', 'Decoration Ribbons')}
        to={`/category/${catSlug('Cake Base & Boards')}`}
      />

      {/* ========================================================
          9. COMMERCIAL WHOLESALE BANNER FOR BAKERIES
          ======================================================== */}
      <section className="wrap wholesale-tier-section">
        <div className="wholesale-banner-card">
          <div className="wholesale-banner-copy">
            <span className="badge-pill badge-gold">Commercial &amp; Bulk Tier</span>
            <h2>Are You Running a Bakery, Cloud Kitchen or Home Academy?</h2>
            <p>
              Get direct wholesale prices without middlemen. Save up to 20% on bulk quantities
              of cake boards, acrylic toppers, silicone moulds, and cake packing boxes.
            </p>

            <div className="wholesale-slabs-row">
              <div className="wholesale-slab-item">
                <b>10+ Units</b>
                <span>10% Off Wholesale</span>
              </div>
              <div className="wholesale-slab-item">
                <b>25+ Units</b>
                <span>15% Off Wholesale</span>
              </div>
              <div className="wholesale-slab-item">
                <b>50+ Units</b>
                <span>20% Off + Free Delivery</span>
              </div>
            </div>

            <div className="wholesale-btn-row">
              <a
                href="https://wa.me/917996222111?text=Hi%20The%20Baking%20Tools!%20I%20run%20a%20bakery%20and%20would%20like%20your%20wholesale%20rate%20sheet."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} /> Request Wholesale Catalogue on WhatsApp
              </a>
              <a href="tel:+917996222111" className="btn btn-outline btn-lg">
                <Phone size={16} /> Call 7996 222111
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. CUSTOMER BAKER REVIEWS & TESTIMONIALS
          ======================================================== */}
      <section className="wrap testimonials-section">
        <div className="section-header">
          <div>
            <h2>Loved by 10,000+ Indian Bakers</h2>
            <p>Real reviews from passionate home bakers, pastry chefs, and cake academies</p>
          </div>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div key={t.name} className="test-card-item" {...inViewAnim(idx * 0.08)}>
              <div className="test-card-stars">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p className="test-card-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="test-card-author">
                <div className="test-card-avatar">{t.name[0]}</div>
                <div>
                  <b>{t.name}</b>
                  <small>
                    {t.role} · <span className="verified-text">✓ {t.tag}</span>
                  </small>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          11. FREQUENTLY ASKED QUESTIONS (Accordion)
          ======================================================== */}
      <section id="faqs" className="wrap faq-section">
        <div className="section-header">
          <div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about ordering, delivery, and food safety</p>
          </div>
        </div>

        <div className="faq-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className={`faq-row-item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className="faq-arrow-ico"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s var(--ease)',
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-pane"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: EASE }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          12. VISIT STORE IN BENGALURU
          ======================================================== */}
      <section className="wrap store-banner-section">
        <div className="store-banner-card">
          <div className="store-banner-copy">
            <span className="badge-pill badge-discount">Physical Experience Store</span>
            <h2>Visit Us in Gandhi Bazaar, Bengaluru</h2>
            <p>
              Touch, inspect, and choose from over 500 moulds, toppers, and baking accessories.
              Our friendly team is always ready to guide you with nozzle numbers and sizing.
            </p>
            <div className="store-location-info">
              <span>
                <Store size={16} /> #39 WAT Street, Beside Domino&apos;s, Gandhi Bazaar, Basavanagudi, Bengaluru
              </span>
              <span>
                <Clock size={16} /> Monday to Saturday: 10:00 AM – 8:30 PM
              </span>
            </div>
          </div>
          <div className="store-banner-actions">
            <a
              href="https://maps.google.com/?q=Gandhi+Bazaar+Basavanagudi+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              Get Store Directions
            </a>
            <a href="tel:+918041486443" className="btn btn-outline btn-lg">
              Call Store Desk
            </a>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
