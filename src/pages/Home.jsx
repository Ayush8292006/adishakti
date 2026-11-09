import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Truck, Store, BadgePercent, Video, Phone, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, findProduct } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const EASE = [0.22, 1, 0.36, 1];
const up = (d = 0) => ({ initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.6, delay: d, ease: EASE } });

/* ---------------- hero slider ---------------- */
function Hero({ ready }) {
  const shop = useShop();
  const slides = [
    { tag: 'Choice of Home Bakers', title: <>Everything your<br />cake needs</>, text: 'Moulds, toppers, piping tools, cake bases & packing — all at one counter in Gandhi Bazaar.', cta: 'Shop all products', to: '/category/all', imgs: ['ginkgo-topper', 'nozzle-set', 'rose-mould'], tone: 'brown' },
    { tag: 'New stock arrivals', title: <>Filigree butterflies<br />&amp; rose moulds</>, text: 'Fresh on the shelf this week — gold & silver butterflies, rose and sunflower chocolate moulds.', cta: 'Shop new arrivals', to: '/category/new-arrivals', imgs: ['filigree-butterfly', 'rose-mould', 'plunger-cutter'], tone: 'cream' },
    { tag: 'Watch before you bake', title: <>2‑minute<br />cake demos</>, text: 'See each kit in action, then add the exact products used in one tap.', cta: 'Watch a demo', video: VIDEOS[0], imgs: ['bar-mould-6', 'gold-foil', 'star-mould'], tone: 'pink' },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return undefined; const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5500); return () => clearInterval(t); }, [paused, slides.length]);
  const s = slides[i];

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured">
      <AnimatePresence mode="wait">
        <motion.div key={i} className={`slide ${s.tone}`} initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <div className="wrap slide-in">
            <div className="slide-copy">
              <motion.span className="slide-tag" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.5 }}>{s.tag}</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.18, duration: 0.6, ease: EASE }}>{s.title}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.28, duration: 0.5 }}>{s.text}</motion.p>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.36, duration: 0.5 }}>
                {s.video
                  ? <button className="btn slide-btn" onClick={() => shop.setVideo(s.video)}><Play size={16} fill="currentColor" /> {s.cta}</button>
                  : <Link to={s.to} className="btn slide-btn">{s.cta} <ArrowRight size={16} /></Link>}
              </motion.div>
            </div>
            <div className="slide-art" aria-hidden="true">
              {s.imgs.map((im, k) => (
                <motion.img key={im} src={`/products/${im}.jpg`} alt="" className={`sa sa${k + 1}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ delay: 0.2 + k * 0.1, duration: 0.7, ease: EASE }} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button className="hero-arrow l" onClick={() => setI((x) => (x - 1 + slides.length) % slides.length)} aria-label="Previous slide"><ChevronLeft size={22} /></button>
      <button className="hero-arrow r" onClick={() => setI((x) => (x + 1) % slides.length)} aria-label="Next slide"><ChevronRight size={22} /></button>
      <div className="hero-dots">{slides.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} />)}</div>
    </section>
  );
}

/* ---------------- tabbed product section ---------------- */
function TabbedProducts({ title, sub, tabs, limit = 10 }) {
  const [t, setT] = useState(0);
  const list = useMemo(() => tabs[t].items.slice(0, limit), [t, tabs, limit]);
  return (
    <section className="wrap sec">
      <motion.div className="sec-title" {...up()}><h2>{title}</h2>{sub && <p>{sub}</p>}</motion.div>
      <div className="ptabs" role="tablist" aria-label={title}>
        {tabs.map((x, k) => (
          <button key={x.label} role="tab" aria-selected={t === k} className={t === k ? 'on' : ''} onClick={() => setT(k)}>
            {t === k && <motion.span layoutId={`pill-${title}`} className="pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{x.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={t} className="pgrid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {list.map((p, k) => <ProductCard key={p.id} product={p} index={k} />)}
        </motion.div>
      </AnimatePresence>
      {tabs[t].to && <div className="center-btn"><Link to={tabs[t].to} className="btn btn-line">View all {tabs[t].label} <ArrowRight size={16} /></Link></div>}
    </section>
  );
}

const byCat = (c) => PRODUCTS.filter((p) => p.category === c);
const byIds = (ids) => ids.map(findProduct).filter(Boolean);

export default function Home({ ready = true }) {
  const shop = useShop();
  const recently = shop.viewed.map(findProduct).filter(Boolean);
  const tiles = [{ label: 'New Arrivals', img: '/products/plunger-cutter.jpg', to: '/category/new-arrivals', n: PRODUCTS.filter((p) => p.isNew).length },
    ...CATEGORIES.map((c) => ({ label: c, img: CAT_IMG[c], to: `/category/${catSlug(c)}`, n: byCat(c).length }))];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Hero ready={ready} />

      {/* trust strip */}
      <section className="trust">
        <div className="wrap trust-row">
          {[[Truck, 'Delivery in Bengaluru', 'Fast local delivery'], [Store, 'Store pick-up', 'Gandhi Bazaar, Basavanagudi'], [BadgePercent, 'Wholesale rates', 'For bakeries & bulk orders'], [Video, '2‑min cake demos', 'Watch before you bake']].map(([I, t, d], k) => (
            <motion.div key={t} className="trust-item" {...up(k * 0.06)}><span><I size={22} /></span><div><b>{t}</b><small>{d}</small></div></motion.div>
          ))}
        </div>
      </section>

      {/* category tiles */}
      <section className="wrap sec">
        <motion.div className="sec-title" {...up()}><h2>Shop by Category</h2><p>Find exactly what you need for your next bake</p></motion.div>
        <div className="cats">
          {tiles.map((t, k) => (
            <motion.div key={t.label} {...up(k * 0.04)}>
              <Link to={t.to} className="cat">
                <span className="cat-img"><img src={t.img} alt="" /></span>
                <b>{t.label}</b>
                <small>{t.n} products</small>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* new arrivals */}
      <section className="wrap sec sec-tight">
        <motion.div className="sec-head-row" {...up()}><h2>What’s New</h2><Link to="/category/new-arrivals" className="view-all">View all</Link></motion.div>
        <div className="pgrid">{PRODUCTS.filter((p) => p.isNew).slice(0, 5).map((p, k) => <ProductCard key={p.id} product={p} index={k} />)}</div>
      </section>

      <TabbedProducts title="Our Baking Products" sub="Bestsellers from every shelf" tabs={[
        { label: 'Cake Toppers', items: byCat('Cake Toppers'), to: '/category/cake-toppers' },
        { label: 'Silicone Moulds', items: byCat('Silicone Moulds'), to: '/category/silicone-moulds' },
        { label: 'Packing', items: [...byCat('Packing Materials'), ...byCat('Decoration Ribbons')], to: '/category/packing-materials' },
        { label: 'Bases & Stands', items: [...byCat('Cake Base & Boards'), ...byCat('Cake Stands')], to: '/category/cake-base-and-boards' },
      ]} />

      {/* promo banners */}
      <section className="wrap promos">
        <motion.div className="promo p-a" {...up()}>
          <div><small>Cake bases &amp; boards</small><h3>Stack it strong</h3><p>MDF boards, 5" &amp; 6" bases and tier dowels.</p><Link to="/category/cake-base-and-boards" className="btn btn-brand">Shop now</Link></div>
          <img src="/products/mdf-cake-board.jpg" alt="" />
        </motion.div>
        <motion.div className="promo p-b" {...up(0.08)}>
          <div><small>Packing &amp; ribbons</small><h3>Gift-ready finish</h3><p>Acrylic boxes, gold foil, satin &amp; diamond mesh ribbons.</p><Link to="/category/packing-materials" className="btn btn-brand">Shop now</Link></div>
          <img src="/products/acrylic-box.jpg" alt="" />
        </motion.div>
      </section>

      {/* tools block */}
      <section className="wrap sec">
        <div className="tools">
          <motion.div className="tools-copy" {...up()}>
            <small>Baking tools &amp; accessories</small>
            <h2>Tools every baker reaches for</h2>
            <p>Nozzle sets, smoothers, scrapers, plunger cutters, bowls and measuring sets — the everyday kit for clean, professional finishes.</p>
            <Link to="/category/baking-tools" className="btn btn-white">Shop baking tools <ArrowRight size={16} /></Link>
          </motion.div>
          <div className="tools-grid">
            {byIds([26, 38, 42, 30]).map((p, k) => <ProductCard key={p.id} product={p} index={k} />)}
          </div>
        </div>
      </section>

      <TabbedProducts title="Chocolate & Fondant Moulds" sub="Silicone moulds for chocolates, letters and decorations" limit={5} tabs={[
        { label: 'Chocolate moulds', items: byIds([41, 8, 9, 12, 14, 16, 46, 27]), to: '/category/silicone-moulds' },
        { label: 'Letters & numbers', items: byIds([6, 19, 32]), to: '/category/silicone-moulds' },
        { label: 'Fondant', items: byIds([36, 42, 38]), to: '/category/silicone-moulds' },
      ]} />

      {/* demos */}
      <section id="demos" className="demos">
        <div className="wrap sec">
          <motion.div className="sec-title light" {...up()}><h2>Watch Before You Bake</h2><p>Two‑minute demos with the exact products used</p></motion.div>
          <div className="demo-grid">
            {VIDEOS.map((v, k) => (
              <motion.button key={v.id} className="demo" onClick={() => shop.setVideo(v)} {...up(k * 0.05)}>
                <span className="demo-img"><img src={v.poster} alt="" /><span className="demo-play"><Play size={18} fill="currentColor" /></span><span className="demo-time">{v.duration}</span></span>
                <b>{v.title}</b>
                <small>{v.productIds.length} products used</small>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Rail title="Cake Toppers" products={byCat('Cake Toppers')} to="/category/cake-toppers" />
      <Rail title="Recently Viewed" products={recently} />

      {/* call band */}
      <section className="wrap">
        <motion.div className="callband" {...up()}>
          <div><h3>Running a bakery or cake studio?</h3><p>Ask for wholesale rates on toppers, moulds and packing.</p></div>
          <div className="callband-btns">
            <a href="tel:+917996222111" className="btn btn-white"><Phone size={16} /> 7996 222111</a>
            <a href="tel:+918041486443" className="btn btn-line light">080-41486443</a>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
