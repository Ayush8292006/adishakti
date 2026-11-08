import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Phone, Video, BadgePercent, Store } from 'lucide-react';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const EASE = [0.22, 1, 0.36, 1];
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 }, transition: { duration: 0.6, delay, ease: EASE },
});
const byCat = (...cats) => PRODUCTS.filter((p) => cats.includes(p.category));

export default function Home({ ready = true }) {
  const shop = useShop();
  const tiles = [...CATEGORIES.map((c) => ({ label: c, img: CAT_IMG[c], to: `/category/${catSlug(c)}` })), { label: 'New Arrivals', img: '/products/plunger-cutter.jpg', to: '/category/new-arrivals' }];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="home">
      {/* HERO BANNER */}
      <section className="wrap">
        <motion.div className="hero" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}>
          <div className="hero-copy">
            <motion.span className="hero-tag" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.25 }}>Choice of Home Bakers</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
              Everything for your<br />next cake, in one place
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.42, duration: 0.6 }}>
              Moulds, toppers, piping tools, cake bases &amp; packing — delivered across Bengaluru.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.52, duration: 0.6 }}>
              <a href="#categories" className="btn hero-btn">Shop now <ArrowRight size={16} /></a>
            </motion.div>
          </div>
          <div className="hero-art" aria-hidden="true">
            {['ginkgo-topper', 'rose-mould', 'nozzle-set', 'filigree-butterfly'].map((s, i) => (
              <motion.img key={s} src={`/products/${s}.jpg`} alt="" className={`ha ha${i + 1}`}
                initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: EASE }} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* PROMO CARDS */}
      <section className="wrap">
        <div className="promos">
          <motion.button className="promo p1" onClick={() => shop.setVideo(VIDEOS[0])} {...inView(0)}>
            <div><h3>Cake demo videos</h3><p>2‑minute videos for every kit</p><span className="promo-btn">Watch now</span></div>
            <img src="/products/rose-mould.jpg" alt="" />
          </motion.button>
          <motion.a className="promo p2" href="tel:+917996222111" {...inView(0.08)}>
            <div><h3>Wholesale for bakeries</h3><p>Bulk rates on toppers &amp; tools</p><span className="promo-btn">Call 7996 222111</span></div>
            <img src="/products/hb-coin.jpg" alt="" />
          </motion.a>
          <motion.div className="promo p3" {...inView(0.16)}>
            <Link to="/category/new-arrivals" className="promo-link">
              <div><h3>New stock arrivals</h3><p>Butterflies, rose moulds &amp; more</p><span className="promo-btn">Order now</span></div>
              <img src="/products/filigree-butterfly.jpg" alt="" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section id="categories" className="wrap cats-sec">
        <div className="rail-head"><h2>Shop by category</h2></div>
        <motion.div className="cats" initial="h" whileInView="s" viewport={{ once: true, amount: 0.2 }} variants={{ h: {}, s: { transition: { staggerChildren: 0.05 } } }}>
          {tiles.map((t) => (
            <motion.div key={t.label} variants={{ h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}>
              <Link to={t.to} className="cat">
                <span className="cat-img"><img src={t.img} alt="" /></span>
                <span className="cat-label">{t.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Rail title="New arrivals" products={PRODUCTS.filter((p) => p.isNew)} to="/category/new-arrivals" />
      <Rail title="Cake toppers" products={byCat('Cake Toppers')} to={`/category/${catSlug('Cake Toppers')}`} />
      <Rail title="Silicone & chocolate moulds" products={byCat('Silicone Moulds')} to={`/category/${catSlug('Silicone Moulds')}`} />

      {/* DEMOS RAIL */}
      <section className="wrap demos">
        <div className="rail-head"><h2>Watch before you bake</h2><span className="muted demos-sub">Tap a video to see the products used</span></div>
        <div className="demo-track">
          {VIDEOS.map((v, i) => (
            <motion.button key={v.id} className="demo" onClick={() => shop.setVideo(v)} {...inView(i * 0.05)}>
              <span className="demo-img"><img src={v.poster} alt="" /><span className="demo-play"><Play size={16} fill="currentColor" /></span><span className="demo-time">{v.duration}</span></span>
              <b>{v.title}</b>
              <small className="muted">{v.productIds.length} products used</small>
            </motion.button>
          ))}
        </div>
      </section>

      <Rail title="Baking tools" products={byCat('Baking Tools')} to={`/category/${catSlug('Baking Tools')}`} />
      <Rail title="Cake bases, stands & boards" products={byCat('Cake Base & Boards', 'Cake Stands')} to={`/category/${catSlug('Cake Base & Boards')}`} />
      <Rail title="Packing & ribbons" products={byCat('Packing Materials', 'Decoration Ribbons')} to={`/category/${catSlug('Packing Materials')}`} />

      {/* WHY US */}
      <section className="wrap">
        <motion.div className="why" {...inView()}>
          {[
            [Video, '2‑minute cake demos', 'See every kit in action before you buy'],
            [BadgePercent, 'Wholesale pricing', 'Special rates for bakeries on bulk orders'],
            [Store, 'Pick up or delivery', 'Collect from Gandhi Bazaar or get it delivered'],
          ].map(([I, t, d]) => (
            <div key={t} className="why-item"><span><I size={22} /></span><div><b>{t}</b><small>{d}</small></div></div>
          ))}
          <a href="tel:+918041486443" className="why-call"><Phone size={16} /> 080-41486443</a>
        </motion.div>
      </section>
    </motion.main>
  );
}
