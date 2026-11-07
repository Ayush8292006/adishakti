import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play, Phone, MapPin } from 'lucide-react';
import { Page, Reveal, Lines, RevealImage, Stagger, Item, ScrollWords, useMedia } from '../components/Motion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, formatINR } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const CAT_IMG = {
  'Cake Toppers': '/products/filigree-butterfly.jpg',
  'Silicone Moulds': '/products/rose-mould.jpg',
  'Baking Tools': '/products/nozzle-set.jpg',
  'Cake Base & Boards': '/products/mdf-cake-board.jpg',
  'Packing Materials': '/products/gold-foil.jpg',
  'Decoration Ribbons': '/products/diamond-mesh.jpg',
  'Cake Stands': '/products/acrylic-stand.jpg',
};
const EASE = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 12;

/* ---------------- HERO ---------------- */
function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = { initial: { opacity: 0, y: 18 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, ease: EASE } };

  return (
    <section ref={ref} className="hero wrap">
      <motion.div className="hero-copy" style={{ y: textY }}>
        <motion.span className="label" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>Baking tools &amp; accessories — Bengaluru</motion.span>
        <Lines as="h1" className="serif hero-title" inView={false} play={ready} delay={0.15}
          lines={['Tools for cakes', <>that look as <em>good</em></>, 'as they taste.']} />
        <motion.p className="hero-sub" {...fade} transition={{ ...fade.transition, delay: 0.55 }}>
          Silicone moulds, cake toppers, piping nozzles, bases and packing — chosen for home bakers and bakeries, with a two‑minute demo for every kit.
        </motion.p>
        <motion.div className="hero-cta" {...fade} transition={{ ...fade.transition, delay: 0.7 }}>
          <Link to="/#shop" className="btn btn-solid">Shop the collection <ArrowRight size={16} className="arrow" /></Link>
          <Link to="/#demos" className="link"><Play size={14} fill="currentColor" /> Watch cake demos</Link>
        </motion.div>
        <motion.dl className="hero-facts" {...fade} transition={{ ...fade.transition, delay: 0.85 }}>
          <div><dt>Products</dt><dd className="serif">46</dd></div>
          <div><dt>Categories</dt><dd className="serif">07</dd></div>
          <div><dt>Demo length</dt><dd className="serif">2 min</dd></div>
        </motion.dl>
      </motion.div>

      <motion.div className="hero-visual" style={{ scale: imgScale }}>
        <RevealImage src="/products/ginkgo-topper.jpg" alt="Gold ginkgo leaf cake topper" className="hero-img" eager play={ready} delay={0.2} parallax={30} />
        <motion.div className="hero-caption" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 0.8 }}>
          <span className="label">No. 01</span>
          <span>Gold Ginkgo Leaf Topper</span>
          <Link to="/product/1" className="link">{formatINR(149)} <ArrowUpRight size={14} /></Link>
        </motion.div>
        <div className="hero-thumb">
          <RevealImage src="/products/rose-mould.jpg" alt="Rose and sunflower chocolate mould" eager play={ready} delay={0.5} parallax={14} />
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- CATEGORY INDEX ---------------- */
function CategoryIndex({ onPick }) {
  const desktop = useMedia(1024);
  const [hover, setHover] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26 });
  const y = useSpring(my, { stiffness: 220, damping: 26 });
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - 150);
    my.set(e.clientY - r.top - 190);
  };

  return (
    <section id="categories" className="section wrap">
      <div className="sec-head">
        <div><span className="label">Index</span><Lines className="serif" lines={['Shop by', <em key="e">category</em>]} /></div>
        <Reveal as="p">Seven departments, one counter. Pick what you’re making today.</Reveal>
      </div>
      <div ref={ref} className="cat-index" onMouseMove={desktop ? move : undefined} onMouseLeave={() => setHover(null)}>
        {CATEGORIES.map((c, i) => {
          const n = PRODUCTS.filter((p) => p.category === c).length;
          return (
            <Reveal key={c} delay={i * 0.04} y={20}>
              <button className={`cat-row ${hover && hover !== c ? 'dim' : ''}`} onMouseEnter={() => setHover(c)} onFocus={() => setHover(c)} onClick={() => onPick(c)}>
                <span className="cat-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cat-name serif">{c}</span>
                <img className="cat-thumb" src={CAT_IMG[c]} alt="" />
                <span className="cat-count">{n} {n === 1 ? 'item' : 'items'}</span>
                <ArrowUpRight className="cat-arrow" size={24} strokeWidth={1.25} />
              </button>
            </Reveal>
          );
        })}
        {desktop && (
          <motion.div className="cat-float" style={{ x, y }} aria-hidden="true">
            <AnimatePresence mode="popLayout">
              {hover && (
                <motion.img key={hover} src={CAT_IMG[hover]} alt=""
                  initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.1 }} animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------------- NEW ARRIVALS (pinned horizontal scroll on desktop) ---------------- */
function NewArrivals() {
  const shop = useShop();
  const desktop = useMedia(1024);
  const items = PRODUCTS.filter((p) => p.isNew);
  const section = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  useLayoutEffect(() => {
    if (!desktop || !track.current) return undefined;
    const calc = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [desktop]);

  const cards = items.map((p, i) => (
    <article key={p.id} className="na-card">
      <Link to={`/product/${p.id}`} className="na-media"><img src={p.img} alt={p.name} /></Link>
      <div className="na-info">
        <span className="label">{String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <h3 className="serif">{p.name}</h3>
        <div className="na-row">
          <span>{formatINR(p.price)}</span>
          <button className="link" onClick={() => shop.add(p.id)}>Add to cart</button>
        </div>
      </div>
    </article>
  ));

  const intro = (
    <div className="na-intro">
      <span className="label">Just in</span>
      <Lines className="serif" lines={['New stock', <em key="e">arrivals</em>]} />
      <p className="muted">Six new pieces on the shelf this week. {desktop ? 'Scroll to browse.' : 'Swipe to browse.'}</p>
    </div>
  );

  if (!desktop) {
    return (
      <section id="new" className="na-mobile section">
        <div className="wrap">{intro}</div>
        <div className="na-swipe">{cards}</div>
      </section>
    );
  }
  return (
    <section id="new" ref={section} className="na-pin" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="na-sticky">
        <motion.div ref={track} className="na-track" style={{ x }}>
          {intro}
          {cards}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- SHOP GRID ---------------- */
function ShopGrid({ cat, setCat }) {
  const [sort, setSort] = useState('featured');
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => setLimit(PAGE_SIZE), [cat, sort]);

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => cat === 'All' || p.category === cat);
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'new') l = [...l].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return l;
  }, [cat, sort]);

  return (
    <section id="shop" className="section wrap">
      <div className="sec-head">
        <div><span className="label">The shop</span><Lines className="serif" lines={['Everything', <>on the <em>shelf</em></>]} /></div>
        <Reveal as="p">Real stock from our Gandhi Bazaar store, updated as it sells.</Reveal>
      </div>

      <div className="filters">
        <div className="tabs" role="tablist" aria-label="Filter by category">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
              {c}
              {cat === c && <motion.span layoutId="tab-underline" className="tab-line" transition={{ duration: 0.5, ease: EASE }} />}
            </button>
          ))}
        </div>
        <div className="filters-right">
          <span className="muted">{list.length} products</span>
          <label className="sort"><span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </label>
        </div>
      </div>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {list.slice(0, limit).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </AnimatePresence>
      </motion.div>

      {limit < list.length && (
        <div className="more">
          <span className="muted">Showing {Math.min(limit, list.length)} of {list.length}</span>
          <div className="more-bar"><motion.span animate={{ scaleX: Math.min(limit, list.length) / list.length }} transition={{ duration: 0.6, ease: EASE }} /></div>
          <button className="btn btn-line" onClick={() => setLimit((l) => l + PAGE_SIZE)}>Load more</button>
        </div>
      )}
    </section>
  );
}

/* ---------------- DEMOS ---------------- */
function Demos() {
  const shop = useShop();
  const [feat, ...rest] = VIDEOS;
  return (
    <section id="demos" className="demos">
      <div className="wrap section">
        <div className="sec-head light">
          <div><span className="label">Cake demos</span><Lines className="serif" lines={['Watch it made.', <em key="e">Then make it.</em>]} /></div>
          <Reveal as="p">Two‑minute videos from our team. Each one lists the exact products used, so you can add them in one tap.</Reveal>
        </div>
        <div className="demo-layout">
          <Reveal className="demo-feat">
            <button onClick={() => shop.setVideo(feat)} aria-label={`Play ${feat.title}`}>
              <RevealImage src={feat.poster} className="demo-feat-img" parallax={24} />
              <span className="demo-play"><Play size={22} fill="currentColor" /></span>
            </button>
            <div className="demo-feat-meta">
              <span className="label">Featured · {feat.duration}</span>
              <h3 className="serif">{feat.title}</h3>
            </div>
          </Reveal>
          <Stagger className="demo-list">
            {rest.map((v, i) => (
              <Item key={v.id}>
                <button className="demo-row" onClick={() => shop.setVideo(v)}>
                  <span className="demo-n">{String(i + 2).padStart(2, '0')}</span>
                  <span className="demo-thumb"><img src={v.poster} alt="" /><Play size={14} fill="currentColor" /></span>
                  <span className="demo-t"><b className="serif">{v.title}</b><small>{v.duration} · {v.productIds.length} products</small></span>
                  <ArrowUpRight size={20} strokeWidth={1.25} className="demo-arrow" />
                </button>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW + VISIT ---------------- */
function How() {
  const steps = [
    ['Choose your tools', 'Browse moulds, toppers, nozzles and packing. Bakeries get wholesale pricing on request.'],
    ['Watch the demo', 'Your cart suggests a two‑minute cake demo that uses what you picked.'],
    ['Deliver or collect', 'Get it delivered in Bengaluru, or pick it up from our Gandhi Bazaar counter.'],
  ];
  return (
    <section id="how" className="section wrap">
      <div className="sec-head">
        <div><span className="label">How it works</span><Lines className="serif" lines={['Three steps', <>to a better <em>bake</em></>]} /></div>
      </div>
      <Stagger className="how">
        {steps.map(([t, d], i) => (
          <Item key={t} className="how-step">
            <span className="how-n serif">{String(i + 1).padStart(2, '0')}</span>
            <h3>{t}</h3>
            <p className="muted">{d}</p>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}

function Visit() {
  return (
    <section id="visit" className="visit wrap">
      <div className="visit-imgs">
        <RevealImage src="/products/nozzle-set.jpg" className="v1" parallax={30} />
        <RevealImage src="/products/mini-crown.jpg" className="v2" parallax={50} delay={0.15} />
      </div>
      <div className="visit-copy">
        <span className="label">Visit the store</span>
        <Lines className="serif" lines={['Gandhi Bazaar,', <em key="e">Basavanagudi.</em>]} />
        <Reveal as="p" className="muted visit-addr"><MapPin size={16} /> #39, Ground Floor, WAT Street, Beside Domino’s Pizza, Bengaluru 560004</Reveal>
        <Reveal className="visit-contacts">
          <div><span className="label">Order booking</span><a href="tel:+918041486443">080-41486443</a><a href="tel:+917996222111">7996 222111</a></div>
          <div><span className="label">Contact</span><a href="tel:+919242222111">Mahesh</a><a href="tel:+918792222111">Rani Mahesh</a></div>
        </Reveal>
        <Reveal className="visit-cta">
          <a className="btn btn-solid" href="tel:+917996222111"><Phone size={16} /> Call the store</a>
          <a className="btn btn-line" href="https://maps.google.com/?q=WAT+Street+Gandhi+Bazaar+Basavanagudi+Bengaluru" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16} className="arrow" /></a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- PAGE ---------------- */
export default function Home({ ready = true }) {
  const [cat, setCat] = useState('All');
  const pick = (c) => {
    setCat(c);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <Page className="home">
      <Hero ready={ready} />
      <section className="statement wrap">
        <span className="label">About</span>
        <ScrollWords className="serif statement-text"
          text="We supply home bakers and bakeries across Bengaluru with moulds, toppers, piping tools and packing — and we show you how to use every one of them." />
      </section>
      <CategoryIndex onPick={pick} />
      <NewArrivals />
      <ShopGrid cat={cat} setCat={setCat} />
      <Demos />
      <How />
      <Visit />
    </Page>
  );
}
