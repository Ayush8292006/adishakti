import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Phone, Video, BadgePercent, Store, Sparkles,
  ShieldCheck, Truck, MessageCircle, ChevronDown, CheckCircle2,
  Clock, Flame, Star
} from 'lucide-react';
import Rail from '../components/Rail.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, formatINR } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const EASE = [0.16, 1, 0.3, 1];

const inViewAnim = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, delay, ease: EASE },
});

const byCat = (...cats) => PRODUCTS.filter((p) => cats.includes(p.category));

const FAQS = [
  {
    q: 'How fast is delivery within Bengaluru?',
    a: 'Orders placed before 2:00 PM are dispatched on the same day via local express courier (Dunzo, Porter, or Express Post). Most Bengaluru addresses in South & Central Bangalore receive orders within 3 to 6 hours, while North & East Bangalore deliveries arrive within 24 hours.',
  },
  {
    q: 'Can I visit the store and pick up directly?',
    a: 'Yes, absolutely! Our physical store is located at #39, WAT Street, beside Domino\'s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004. You can place your order online and choose store pickup, or walk in to browse our entire range of 500+ moulds and tools.',
  },
  {
    q: 'Are your silicone moulds certified food-grade?',
    a: 'Yes, 100%. All our chocolate and fondant moulds are manufactured from premium platinum-cured, BPA-free, food-grade silicone. They are heat-resistant from -40°C to 230°C and safe for microwaves, freezers, dishwashers, and standard ovens.',
  },
  {
    q: 'Do you offer wholesale bulk discounts for bakeries and home chefs?',
    a: 'Yes! We supply directly to leading bakeries, cafes, pastry academies, and bulk home bakers across Karnataka. Bulk discounts start at 10+ units per item. Contact our wholesale team directly via WhatsApp or call 7996 222111 for customised tiered rate sheets.',
  },
  {
    q: 'What if I need help selecting the right nozzle or mould?',
    a: 'Our store founders Mahesh & Rani have over a decade of confectionery supply experience. You can chat with us on WhatsApp with a reference photo of the cake you want to bake, and we will send you the exact mould and nozzle set required!',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Raman',
    role: 'Home Baker, Whitefield',
    quote: 'The Rose & Sunflower silicone mould produced the sharpest petals on my tiered anniversary cake. Delivery was shockingly fast — ordered at 10 AM and had it by 2 PM!',
    rating: 5,
    tag: 'Verified Baker',
  },
  {
    name: 'Chef Karthik M.',
    role: 'Pastry Head, Indiranagar',
    quote: 'Adi Shakti has been our bakery\'s primary source for MDF boards, dowels, and acrylic boxes for 3 years. The wholesale rates save us thousands every single month.',
    rating: 5,
    tag: 'Commercial Patisserie',
  },
  {
    name: 'Ananya Swaminathan',
    role: 'Baking Instructor, Jayanagar',
    quote: 'I recommend Adi Shakti to every student in my fondant masterclasses. Their gold ginkgo toppers and piping nozzles are unmatched in durability and finish.',
    rating: 5,
    tag: 'Academy Instructor',
  },
];

export default function Home({ ready = true }) {
  const shop = useShop();
  const [activeTab, setActiveTab] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);

  const tiles = [
    ...CATEGORIES.map((c) => ({
      label: c,
      img: CAT_IMG[c],
      to: `/category/${catSlug(c)}`,
    })),
    {
      label: 'New Arrivals',
      img: '/products/plunger-cutter.jpg',
      to: '/category/new-arrivals',
    },
  ];

  const filteredFeatured = activeTab === 'All'
    ? PRODUCTS.slice(0, 8)
    : activeTab === 'Moulds'
    ? byCat('Silicone Moulds').slice(0, 8)
    : activeTab === 'Toppers'
    ? byCat('Cake Toppers').slice(0, 8)
    : activeTab === 'Tools'
    ? byCat('Baking Tools').slice(0, 8)
    : byCat('Packing Materials', 'Decoration Ribbons').slice(0, 8);

  // Spotlight featured product
  const spotlightProduct = PRODUCTS.find((p) => p.id === 41) || PRODUCTS[0];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home"
    >
      {/* ========================================================
          HERO SECTION (High-Conversion Boutique Bakery Supply)
          ======================================================== */}
      <section className="wrap hero-wrap">
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Ambient background glow & pattern */}
          <div className="hero-glow-blob" aria-hidden="true" />
          <div className="hero-grid-pattern" aria-hidden="true" />

          <div className="hero-content">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} className="hero-badge-ico" />
              <span>Bengaluru&apos;s Trusted Baking &amp; Moulds Destination</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.28, duration: 0.6, ease: EASE }}
            >
              Professional Baking Supplies for Your Next Masterpiece
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.38, duration: 0.6 }}
            >
              Certified food-grade silicone moulds, gold acrylic toppers, precision piping
              nozzles &amp; luxury packaging — wholesale rates, dispatched across Bengaluru.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.48, duration: 0.6 }}
            >
              <a href="#categories" className="btn btn-hero-primary">
                Explore Catalogue <ArrowRight size={17} />
              </a>
              <a
                href="https://wa.me/917996222111?text=Hello%20Adi%20Shakti!%20I%20am%20looking%20for%20baking%20supplies."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-hero-wa"
              >
                <MessageCircle size={18} /> WhatsApp Quick Order
              </a>
            </motion.div>

            {/* Trust Proof Pills */}
            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="hstat">
                <b>500+</b>
                <small>Baking Tools &amp; Moulds</small>
              </div>
              <div className="hstat-div" />
              <div className="hstat">
                <b>10,000+</b>
                <small>Cakes Crafted</small>
              </div>
              <div className="hstat-div" />
              <div className="hstat">
                <b>4.9 ★</b>
                <small>Bengaluru Bakers Rating</small>
              </div>
              <div className="hstat-div" />
              <div className="hstat">
                <b>Same-Day</b>
                <small>Bengaluru Delivery</small>
              </div>
            </motion.div>
          </div>

          {/* Interactive Floating Product Showcase */}
          <div className="hero-showcase" aria-hidden="true">
            <motion.div
              className="showcase-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="showcase-img-wrap">
                <img
                  src="/products/rose-mould.jpg"
                  alt="Rose Silicone Mould"
                  className="showcase-main-img"
                />
                <span className="showcase-floating-tag">
                  <Flame size={12} fill="#ea580c" color="#ea580c" />
                  Top Trending in Bengaluru
                </span>
              </div>
              <div className="showcase-details">
                <div className="showcase-title-row">
                  <b>Rose &amp; Sunflower 3D Mould</b>
                  <span className="showcase-price">{formatINR(169)}</span>
                </div>
                <div className="showcase-tags">
                  <span>✓ 100% Food-Grade</span>
                  <span>✓ Heat Safe (-40° to 230°C)</span>
                </div>
              </div>

              {/* Orbiting Mini Product Thumbnails */}
              <div className="showcase-orbit orbit-1">
                <img src="/products/ginkgo-topper.jpg" alt="" />
                <span>Gold Ginkgo Topper</span>
              </div>
              <div className="showcase-orbit orbit-2">
                <img src="/products/nozzle-set.jpg" alt="" />
                <span>Piping Nozzle Set</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          VALUE PROPOSITIONS (Why Bakers Choose Adi Shakti)
          ======================================================== */}
      <section className="wrap value-sec">
        <motion.div className="value-grid" {...inViewAnim(0.1)}>
          <div className="value-card">
            <span className="value-ico"><Truck size={22} /></span>
            <div>
              <h3>Express Bengaluru Dispatch</h3>
              <p>Same-day delivery from our Gandhi Bazaar warehouse directly to your doorstep.</p>
            </div>
          </div>

          <div className="value-card">
            <span className="value-ico"><ShieldCheck size={22} /></span>
            <div>
              <h3>100% Certified Food-Grade</h3>
              <p>BPA-free platinum silicone moulds. Oven, microwave, freezer &amp; dishwasher safe.</p>
            </div>
          </div>

          <div className="value-card">
            <span className="value-ico"><BadgePercent size={22} /></span>
            <div>
              <h3>Direct Wholesale Pricing</h3>
              <p>Tiered bulk rates for home bakers, cloud kitchens &amp; commercial pastry shops.</p>
            </div>
          </div>

          <div className="value-card">
            <span className="value-ico"><Video size={22} /></span>
            <div>
              <h3>2-Minute Video Tutorials</h3>
              <p>Watch step-by-step styling demos for every kit before you start baking.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          SHOP BY CATEGORY (Visual Grid)
          ======================================================== */}
      <section id="categories" className="wrap cats-sec">
        <div className="rail-head">
          <div>
            <h2>Shop by Category</h2>
            <p>Curated supplies for every stage of cake making</p>
          </div>
          <Link to="/category/all" className="see-all">
            <span>View All ({CATEGORIES.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <motion.div
          className="cats-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {tiles.map((t) => (
            <motion.div
              key={t.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
              }}
            >
              <Link to={t.to} className="cat-card">
                <div className="cat-img-box">
                  <img src={t.img} alt={t.label} loading="lazy" />
                </div>
                <span className="cat-title">{t.label}</span>
                <span className="cat-sub">Explore &rarr;</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========================================================
          PROMO SPOTLIGHT CARDS
          ======================================================== */}
      <section className="wrap promo-sec">
        <div className="promos-grid">
          <motion.div className="pcard-banner pb-video" {...inViewAnim(0)}>
            <div className="pb-copy">
              <span className="pb-badge">Watch &amp; Learn</span>
              <h3>2-Minute Cake Demos</h3>
              <p>See silicone flower moulds &amp; piping nozzles in action with video tutorials.</p>
              <button
                className="btn btn-pb"
                onClick={() => shop.setVideo(VIDEOS[0])}
              >
                <Play size={14} fill="currentColor" /> Watch Now
              </button>
            </div>
            <img src="/products/rose-mould.jpg" alt="" className="pb-art" />
          </motion.div>

          <motion.div className="pcard-banner pb-wholesale" {...inViewAnim(0.08)}>
            <div className="pb-copy">
              <span className="pb-badge">For Bakeries &amp; Academies</span>
              <h3>Wholesale Bulk Rates</h3>
              <p>Special slab discounts on MDF boards, acrylic toppers &amp; boxes.</p>
              <a href="tel:+917996222111" className="btn btn-pb">
                <Phone size={14} /> Call 7996 222111
              </a>
            </div>
            <img src="/products/hb-coin.jpg" alt="" className="pb-art" />
          </motion.div>

          <motion.div className="pcard-banner pb-new" {...inViewAnim(0.16)}>
            <div className="pb-copy">
              <span className="pb-badge">Fresh Bangalore Stock</span>
              <h3>New Season Arrivals</h3>
              <p>Filigree butterflies, plunger cutters &amp; multi-cavity bar moulds.</p>
              <Link to="/category/new-arrivals" className="btn btn-pb">
                Order New Stock &rarr;
              </Link>
            </div>
            <img src="/products/filigree-butterfly.jpg" alt="" className="pb-art" />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          CURATED HIGHLIGHTS WITH INTERACTIVE TABS
          ======================================================== */}
      <section className="wrap curated-sec">
        <div className="curated-head">
          <div>
            <h2>Baker&apos;s Preferred Selection</h2>
            <p>Handpicked essential tools loved by Bengaluru cake artists</p>
          </div>

          <div className="tab-pills" role="tablist" aria-label="Product filter tabs">
            {['All', 'Moulds', 'Toppers', 'Tools', 'Packaging'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="curated-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredFeatured.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ========================================================
          PRODUCT RAILS (Categorized Shelves)
          ======================================================== */}
      <Rail
        title="✨ Fresh New Arrivals"
        subtitle="Recently unpacked in our Gandhi Bazaar store"
        products={PRODUCTS.filter((p) => p.isNew)}
        to="/category/new-arrivals"
      />

      <Rail
        title="🎂 Signature Cake Toppers"
        subtitle="Gold ginkgo, acrylic coins, fairy dolls &amp; butterfly sets"
        products={byCat('Cake Toppers')}
        to={`/category/${catSlug('Cake Toppers')}`}
      />

      {/* ========================================================
          SPOTLIGHT DEAL BANNER
          ======================================================== */}
      <section className="wrap spotlight-sec">
        <motion.div className="spotlight-card" {...inViewAnim()}>
          <div className="spotlight-left">
            <span className="badge-pill badge-gold">
              <Clock size={13} /> Weekly Baker Spotlight
            </span>
            <h2>{spotlightProduct.name}</h2>
            <p>
              Craft detailed floral petals and intricate chocolate garnishes effortlessly.
              100% food-grade platinum silicone with non-stick easy demoulding.
            </p>
            <div className="spotlight-price-row">
              <span className="spotlight-price">{formatINR(spotlightProduct.price)}</span>
              <span className="spotlight-mrp">{formatINR(Math.round(spotlightProduct.price * 1.35))}</span>
              <span className="spotlight-off">25% OFF</span>
            </div>
            <div className="spotlight-actions">
              <Link to={`/product/${spotlightProduct.id}`} className="btn btn-brown">
                View Details &amp; Options
              </Link>
              <a
                href={`https://wa.me/917996222111?text=Hi!%20I%20want%20to%20order%20the%20${encodeURIComponent(spotlightProduct.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={17} /> Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="spotlight-right">
            <img src={spotlightProduct.img} alt={spotlightProduct.name} />
          </div>
        </motion.div>
      </section>

      <Rail
        title="🍫 Silicone &amp; Chocolate Moulds"
        subtitle="100% Platinum food-grade moulds for bars, letters &amp; flowers"
        products={byCat('Silicone Moulds')}
        to={`/category/${catSlug('Silicone Moulds')}`}
      />

      {/* ========================================================
          WATCH BEFORE YOU BAKE (Video Reels Section)
          ======================================================== */}
      <section className="wrap demos-section">
        <div className="rail-head">
          <div>
            <h2>Watch Before You Bake</h2>
            <p className="demos-sub">
              Tap any 2-minute video to preview the cake styling and inspect the products used
            </p>
          </div>
        </div>

        <div className="demo-track">
          {VIDEOS.map((v, i) => (
            <motion.button
              key={v.id}
              className="demo-card"
              onClick={() => shop.setVideo(v)}
              {...inViewAnim(i * 0.05)}
            >
              <div className="demo-thumb">
                <img src={v.poster} alt={v.title} loading="lazy" />
                <span className="demo-play-btn">
                  <Play size={18} fill="currentColor" />
                </span>
                <span className="demo-time-pill">{v.duration}</span>
                <span className="demo-cat-pill">{v.category}</span>
              </div>
              <div className="demo-meta">
                <b>{v.title}</b>
                <small>{v.productIds.length} kit items linked &rarr;</small>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <Rail
        title="🍰 Baking Tools &amp; Nozzles"
        subtitle="Piping tips, scrapers, bowls &amp; precision measuring sets"
        products={byCat('Baking Tools')}
        to={`/category/${catSlug('Baking Tools')}`}
      />

      <Rail
        title="📦 Cake Bases, Boards &amp; Packaging"
        subtitle="MDF boards, dowels, luxury acrylic boxes &amp; ribbons"
        products={byCat('Cake Base & Boards', 'Packing Materials', 'Decoration Ribbons')}
        to={`/category/${catSlug('Cake Base & Boards')}`}
      />

      {/* ========================================================
          WHOLESALE TIER BANNER FOR BAKERIES
          ======================================================== */}
      <section className="wrap wholesale-sec">
        <motion.div className="wholesale-card" {...inViewAnim()}>
          <div className="ws-content">
            <span className="badge-pill badge-gold">Commercial &amp; Home Chef Tier</span>
            <h2>Are You Running a Bakery, Cloud Kitchen or Cake Academy?</h2>
            <p>
              Get direct distributor wholesale prices with no middleman margins.
              Save up to 20% on bulk quantities of cake boards, acrylic toppers, boxes, and moulds.
            </p>

            <div className="ws-slabs">
              <div className="ws-slab">
                <b>10+ Units</b>
                <span>10% Off Wholesale</span>
              </div>
              <div className="ws-slab">
                <b>25+ Units</b>
                <span>15% Off Wholesale</span>
              </div>
              <div className="ws-slab">
                <b>50+ Units</b>
                <span>20% Off + Free Delivery</span>
              </div>
            </div>

            <div className="ws-cta">
              <a
                href="https://wa.me/917996222111?text=Hi%20Adi%20Shakti!%20I%20run%20a%20bakery%20and%20would%20like%20to%20get%20your%20wholesale%20rate%20sheet."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} /> Request Wholesale Catalogue on WhatsApp
              </a>
              <a href="tel:+918041486443" className="btn btn-ghost">
                <Phone size={16} /> 080-41486443
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          TESTIMONIALS / REAL BAKER LOVE
          ======================================================== */}
      <section className="wrap test-sec">
        <div className="rail-head">
          <div>
            <h2>Loved by 10,000+ Bengaluru Bakers</h2>
            <p>Real stories from passion-driven home bakers &amp; pastry chefs</p>
          </div>
        </div>

        <div className="test-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} className="test-card" {...inViewAnim(i * 0.08)}>
              <div className="test-stars">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={15} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p className="test-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="test-author">
                <div className="test-avatar">{t.name[0]}</div>
                <div>
                  <b>{t.name}</b>
                  <small>{t.role} · <span className="test-verified">✓ {t.tag}</span></small>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS (Accordion)
          ======================================================== */}
      <section className="wrap faq-sec">
        <div className="rail-head">
          <div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about ordering, delivery &amp; food safety</p>
          </div>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={faq.q}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                initial={false}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className="faq-arrow"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.28s var(--ease)',
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          STORE VISIT CALLOUT
          ======================================================== */}
      <section className="wrap store-visit-sec">
        <motion.div className="store-card" {...inViewAnim()}>
          <div className="store-copy">
            <span className="badge-pill badge-pink">Visit Us in Person</span>
            <h2>Experience the Full Range at Our Gandhi Bazaar Store</h2>
            <p>
              Touch, inspect, and choose from over 500 moulds, toppers, and baking accessories.
              Our friendly store team is ready to assist you.
            </p>
            <div className="store-meta">
              <span><Store size={16} /> #39 WAT Street, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</span>
              <span><Clock size={16} /> Open Monday to Saturday: 10:00 AM – 8:30 PM</span>
            </div>
          </div>
          <div className="store-actions">
            <a
              href="https://maps.google.com/?q=Gandhi+Bazaar+Basavanagudi+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brown"
            >
              Get Directions on Map
            </a>
            <a href="tel:+918041486443" className="btn btn-ghost">
              Call Store Desk
            </a>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
