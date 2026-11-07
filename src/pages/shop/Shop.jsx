import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import { Search, ShoppingBag, Play, X, Minus, Plus, ArrowRight, MapPin, Phone, LogOut, Sparkles, Truck, BadgePercent, Video } from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import VideoModal from '../../components/VideoModal.jsx';
import Reveal, { Stagger, StaggerItem, Page } from '../../components/Reveal.jsx';
import { PRODUCTS, CATEGORIES, formatINR } from '../../data/products.js';
import { VIDEOS, suggestVideo } from '../../data/videos.js';
import { useCart } from '../../context/CartContext.jsx';
import './Shop.css';

const CAT_IMG = {
  'Cake Toppers': '/products/filigree-butterfly.jpg',
  'Silicone Moulds': '/products/rose-mould.jpg',
  'Baking Tools': '/products/nozzle-set.jpg',
  'Cake Base & Boards': '/products/mdf-cake-board.jpg',
  'Packing Materials': '/products/gold-foil.jpg',
  'Decoration Ribbons': '/products/diamond-mesh.jpg',
  'Cake Stands': '/products/acrylic-stand.jpg',
};

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export default function Shop() {
  const cart = useCart();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const heroY1 = useTransform(scrollY, [0, 700], [0, -120]);
  const heroY2 = useTransform(scrollY, [0, 700], [0, 80]);
  const heroRot = useTransform(scrollY, [0, 700], [0, -6]);

  useEffect(() => scrollY.on('change', (y) => setScrolled(y > 40)), [scrollY]);
  useEffect(() => { document.body.style.overflow = cartOpen ? 'hidden' : ''; }, [cartOpen]);

  const shown = useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'new') list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return list;
  }, [cat, q, sort]);

  const newArrivals = PRODUCTS.filter((p) => p.isNew);
  const suggestion = suggestVideo(cart.items);

  const toastTimer = useRef(null);
  const onAdded = (p) => {
    setToast(p);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <Page className="shop">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      <div className="topbar">
        <span>Wholesale rates for bakeries &amp; home bakers</span>
        <span>Order booking: 080-41486443 · 7996 222111</span>
      </div>

      <header className={`shop-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container shop-header-row">
          <a href="#top" aria-label="Adi Shakti Trader home"><Logo size={42} /></a>
          <label className="shop-search">
            <Search size={18} />
            <span className="sr-only">Search products</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search moulds, toppers, nozzles…"
              onFocus={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} />
          </label>
          <nav className="shop-nav">
            <a href="#shop">Shop</a>
            <a href="#videos">Cake Demos</a>
            <a href="#partners">Partner Stores</a>
            <Link to="/" title="Back to login"><LogOut size={18} /></Link>
          </nav>
          <motion.button className="btn btn-dark cart-btn" onClick={() => setCartOpen(true)} whileTap={{ scale: 0.95 }}>
            <ShoppingBag size={19} /> Cart
            <motion.span key={cart.count} className="cart-count" initial={{ scale: 1.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              {cart.count}
            </motion.span>
          </motion.button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="hero container">
        <div className="hero-copy">
          <motion.span className="hero-tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Sparkles size={14} /> Choice of Home Bakers · Gandhi Bazaar, Bengaluru
          </motion.span>
          <h1 className="display">
            {['Everything', 'your cake needs,', 'in one place.'].map((l, i) => (
              <span className="line-mask" key={l}>
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  {i === 1 ? <>your <em>cake</em> needs,</> : l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Silicone moulds, cake toppers, piping nozzles, cake bases and packing for home bakers and bakeries. Watch a 2‑minute demo before you bake.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
            <a href="#shop" className="btn btn-primary">Shop products <ArrowRight size={18} /></a>
            <a href="#videos" className="btn btn-outline"><Play size={16} fill="currentColor" /> Watch cake demos</a>
          </motion.div>
          <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <div><b className="display"><CountUp to={46} suffix="+" /></b><span>Products in stock</span></div>
            <div><b className="display"><CountUp to={7} /></b><span>Categories</span></div>
            <div><b className="display"><CountUp to={2} suffix=" min" /></b><span>Demo videos</span></div>
          </motion.div>
        </div>
        <div className="hero-art">
          <motion.div className="hero-blob" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
          <motion.figure className="hero-card big" style={{ y: heroY1, rotate: heroRot }}
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <img src="/products/ginkgo-topper.jpg" alt="Gold ginkgo leaf cake topper" />
            <figcaption>Gold Ginkgo Topper · {formatINR(149)}</figcaption>
          </motion.figure>
          <motion.figure className="hero-card s1" style={{ y: heroY2 }}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            <img src="/products/rose-mould.jpg" alt="Rose and sunflower chocolate mould" />
          </motion.figure>
          <motion.figure className="hero-card s2" style={{ y: heroY1 }}
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.55 }}>
            <img src="/products/teddy-topper.jpg" alt="Teddy bear cake toppers" />
          </motion.figure>
          <motion.div className="hero-float-pill" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, type: 'spring' }}>
            <Video size={16} /> 6 cake demos inside
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i}>{c} <i>✦</i></span>
          ))}
        </div>
      </div>

      {/* PERKS */}
      <Stagger className="container perks">
        {[{ icon: BadgePercent, t: 'Wholesale pricing', d: 'Bulk rates for bakeries' }, { icon: Video, t: '2‑min cake demos', d: 'Learn before you bake' }, { icon: Truck, t: 'Bengaluru delivery', d: 'Or pick up at Gandhi Bazaar' }].map(({ icon: I, t, d }) => (
          <StaggerItem key={t} className="perk"><span><I size={22} /></span><div><b>{t}</b><p>{d}</p></div></StaggerItem>
        ))}
      </Stagger>

      {/* CATEGORIES */}
      <section className="container section">
        <Reveal className="section-head">
          <p className="eyebrow">Categories</p>
          <h2 className="display">Shop by what you’re making</h2>
        </Reveal>
        <Stagger className="cat-grid">
          {CATEGORIES.map((c) => (
            <StaggerItem key={c}>
              <button className="cat-card" onClick={() => { setCat(c); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }}>
                <img src={CAT_IMG[c]} alt="" />
                <span className="cat-card-label">{c}<small>{PRODUCTS.filter((p) => p.category === c).length} products</small></span>
                <span className="cat-card-arrow"><ArrowRight size={18} /></span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* NEW ARRIVALS */}
      <section className="new-band">
        <div className="container">
          <Reveal className="section-head light">
            <p className="eyebrow" style={{ color: 'var(--pink-300)' }}>Just landed</p>
            <h2 className="display">New stock arrivals</h2>
          </Reveal>
          <div className="new-row">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} from="right" delay={i * 0.08} className="new-card">
                <img src={p.img} alt={p.name} />
                <div>
                  <b>{p.name}</b>
                  <span>{formatINR(p.price)}</span>
                </div>
                <button className="icon-btn" onClick={() => { cart.add(p.id); onAdded(p); }} aria-label={`Add ${p.name}`}><Plus size={18} /></button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP GRID */}
      <section id="shop" className="container section">
        <Reveal className="shop-toolbar">
          <div>
            <p className="eyebrow">All products</p>
            <h2 className="display">Real stock from our store</h2>
          </div>
          <label className="sort">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="new">New arrivals first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </Reveal>
        <div className="chips" role="tablist" aria-label="Filter by category">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <p className="muted result-count">{shown.length} products{q && <> for “{q}”</>}</p>
        <motion.div layout className="product-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => <ProductCard key={p.id} product={p} onAdded={onAdded} />)}
          </AnimatePresence>
        </motion.div>
        {shown.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: 40 }}>No products match. Try another search.</p>}
      </section>

      {/* VIDEOS */}
      <section id="videos" className="videos">
        <div className="container">
          <Reveal className="section-head light">
            <p className="eyebrow" style={{ color: 'var(--pink-300)' }}>Cake demo videos</p>
            <h2 className="display">See it used, then buy it.</h2>
            <p>Short 2‑minute demos by our team. Each one lists the products used, so you can add them in one tap.</p>
          </Reveal>
          <Stagger className="video-grid">
            {VIDEOS.map((v) => (
              <StaggerItem key={v.id}>
                <button className="video-card" onClick={() => setVideo(v)}>
                  <div className="video-thumb">
                    <img src={v.poster} alt="" />
                    <span className="video-play"><Play size={22} fill="#B8235A" color="#B8235A" /></span>
                    <span className="video-time">{v.duration}</span>
                  </div>
                  <div className="video-meta">
                    <b>{v.title}</b>
                    <span>{v.productIds.length} products used</span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="container section">
        <div className="partner-band">
          <Reveal from="left" className="partner-copy">
            <p className="eyebrow">Partner stores</p>
            <h2 className="display">More stores, one checkout.</h2>
            <p className="muted">Products from verified partner bakery stores appear alongside ours with a “Partner store” badge. Adi Shakti handles the order and the bill.</p>
            <Link to="/partner" className="btn btn-dark">Become a partner <ArrowRight size={18} /></Link>
          </Reveal>
          <Stagger className="partner-imgs">
            {PRODUCTS.filter((p) => p.seller !== 'Adi Shakti').map((p) => (
              <StaggerItem key={p.id} className="partner-img">
                <img src={p.img} alt={p.name} />
                <span>Partner store</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <Reveal from="zoom" className="container">
        <div className="cta-band">
          <h2 className="display">Running a bakery? Ask for wholesale rates.</h2>
          <a className="btn btn-primary" href="tel:+917996222111"><Phone size={18} /> Call 7996 222111</a>
        </div>
      </Reveal>

      <footer className="shop-footer">
        <div className="container footer-grid">
          <div>
            <Logo light size={44} sub="BAKING TOOLS & ACCESSORIES" />
            <p><MapPin size={15} /> #39, Ground Floor, WAT Street, Beside Domino’s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
          </div>
          <div><b>Order booking</b><p>080-41486443<br />7996 222111</p></div>
          <div><b>Contact</b><p>Mahesh · 9242 222111<br />Rani Mahesh · 8792 222111</p></div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} Adi Shakti Trader</div>
      </footer>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
            <img src={toast.img} alt="" /> <span><b>{toast.name}</b> added to cart</span>
            <button className="btn btn-sm btn-primary" onClick={() => setCartOpen(true)}>View cart</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div className="drawer-backdrop" onClick={() => setCartOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside className="drawer" aria-label="Cart" onClick={(e) => e.stopPropagation()}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
              <div className="drawer-head">
                <h2 className="display">Your cart <small>({cart.count})</small></h2>
                <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={18} /></button>
              </div>
              <div className="drawer-body">
                {cart.items.length === 0 && <p className="muted" style={{ textAlign: 'center', marginTop: 40 }}>Your cart is empty. Add a product to see a matching cake demo.</p>}
                <AnimatePresence initial={false}>
                  {cart.items.map(({ product: p, qty }) => (
                    <motion.div key={p.id} className="line" layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }}>
                      <img src={p.img} alt="" />
                      <div className="line-info">
                        <b>{p.name}</b>
                        <span>{formatINR(p.price)} / {p.unit}</span>
                        <div className="qty">
                          <button onClick={() => cart.setQty(p.id, qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                          <span>{qty}</span>
                          <button onClick={() => cart.setQty(p.id, qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                        </div>
                      </div>
                      <b>{formatINR(p.price * qty)}</b>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {suggestion && (
                  <motion.button key={suggestion.id} className="suggest" onClick={() => setVideo(suggestion)}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <span className="eyebrow">Watch before you bake</span>
                    <span className="suggest-row">
                      <span className="suggest-thumb"><img src={suggestion.poster} alt="" /><Play size={22} fill="#fff" color="#fff" /></span>
                      <span><b>{suggestion.title}</b><small>{suggestion.duration} · matches your cart</small></span>
                    </span>
                  </motion.button>
                )}
              </div>
              <div className="drawer-foot">
                <div className="subtotal"><span>Subtotal</span><b>{formatINR(cart.subtotal)}</b></div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={!cart.count}>Checkout <ArrowRight size={18} /></button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal video={video} onClose={() => setVideo(null)} />
    </Page>
  );
}
