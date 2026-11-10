import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, MapPin, Phone, MessageCircle } from 'lucide-react';
import Rail, { Carousel } from '../components/Rail.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, formatINR, findProduct } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Home.css';

const byCat = (...cats) => PRODUCTS.filter((p) => cats.includes(p.category));
const minPrice = (list) => Math.min(...list.map((p) => p.price));
const pick = (...ids) => ids.map(findProduct).filter(Boolean);

/* ---------------- Hero banner slider (vertical dots on the right) ---------------- */
const SLIDES = [
  {
    key: 'moulds',
    title: 'Silicone Chocolate Moulds',
    sub: `Roses, hearts, stars, bars & more · from ${formatINR(minPrice(byCat('Silicone Moulds')))}`,
    to: '/category/silicone-moulds',
    theme: 'plum',
    items: pick(41, 12, 8, 14, 9),
  },
  {
    key: 'toppers',
    title: 'Cake Toppers',
    sub: `Butterflies, crowns, coins & figurines · from ${formatINR(minPrice(byCat('Cake Toppers')))}`,
    to: '/category/cake-toppers',
    theme: 'cream',
    items: pick(45, 22, 21, 1, 25),
  },
  {
    key: 'pack',
    title: 'Cake Boxes & Packaging',
    sub: 'Acrylic boxes, foil sheets, ribbons & cake boards',
    to: '/category/packing-materials',
    theme: 'teal',
    items: pick(31, 13, 39, 7, 4),
  },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <section className="hero" aria-label="Featured collections">
      <AnimatePresence mode="wait">
        <motion.div key={s.key} className={`hero-slide t-${s.theme}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <div className="hero-side left">
            {s.items.slice(0, 2).map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="hero-ped"><img src={p.img} alt={p.name} /><span>{p.name}</span></Link>
            ))}
          </div>
          <div className="hero-mid">
            <motion.h1 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>{s.title}</motion.h1>
            <p>{s.sub}</p>
            <Link to={s.to} className="hero-btn">Shop now</Link>
            <Link to={`/product/${s.items[2].id}`} className="hero-ped center"><img src={s.items[2].img} alt={s.items[2].name} /><span>{s.items[2].name}</span></Link>
          </div>
          <div className="hero-side right">
            {s.items.slice(3, 5).map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="hero-ped"><img src={p.img} alt={p.name} /><span>{p.name}</span></Link>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="hero-dots" role="tablist">
        {SLIDES.map((x, n) => (
          <button key={x.key} role="tab" aria-selected={n === i} aria-label={x.title} className={n === i ? 'on' : ''} onClick={() => setI(n)} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Circular category icons ---------------- */
function Collections() {
  return (
    <section className="sec" id="categories">
      <div className="wrap">
        <h2 className="sec-title">Check Our Baking Collections</h2>
        <div className="colls">
          {CATEGORIES.map((c, n) => (
            <motion.div key={c} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: n * 0.04 }}>
              <Link to={`/category/${catSlug(c)}`} className="coll">
                <span className="coll-img"><img src={CAT_IMG[c]} alt="" loading="lazy" /></span>
                <span className="coll-name">{c}</span>
              </Link>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link to="/category/new-arrivals" className="coll">
              <span className="coll-img"><img src="/products/mini-choc-mould.jpg" alt="" loading="lazy" /></span>
              <span className="coll-name">New Arrivals</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Promo banner with a white product panel ---------------- */
function PromoPanel({ title, line, to, theme, products, art }) {
  return (
    <section className={`promo t-${theme}`}>
      <div className="promo-top wrap">
        <div>
          <h2>{title}</h2>
          <p>{line}</p>
        </div>
        <div className="promo-art" aria-hidden="true">
          {art.map((p) => <img key={p.id} src={p.img} alt="" />)}
        </div>
      </div>
      <div className="wrap">
        <div className="promo-panel">
          <h3>{title}</h3>
          <Carousel items={products} label={title} render={(p, i) => <ProductCard product={p} index={i} />} />
          <div className="view-all-row"><Link to={to} className="btn-viewall">View all</Link></div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Full-width text banner ---------------- */
function TextBanner() {
  const art = pick(26, 30, 33, 37);
  return (
    <section className="tbanner">
      <div className="tbanner-art l"><img src={art[0].img} alt="" /><img src={art[1].img} alt="" /></div>
      <div className="tbanner-mid">
        <h2>Check Our Range of Baking Tools</h2>
        <Link to="/category/baking-tools" className="tbanner-btn">Shop now</Link>
      </div>
      <div className="tbanner-art r"><img src={art[2].img} alt="" /><img src={art[3].img} alt="" /></div>
    </section>
  );
}

/* ---------------- Cake demo videos ---------------- */
function Demos() {
  const shop = useShop();
  return (
    <section className="sec" id="demos">
      <div className="wrap">
        <h2 className="sec-title">Cake Demo Videos</h2>
        <p className="sec-sub">Short 2-minute demos showing how our tools are used</p>
        <Carousel items={VIDEOS} label="videos" render={(v) => (
          <button type="button" className="demo" onClick={() => shop.setVideo(v)}>
            <span className="demo-img">
              <img src={v.poster} alt="" loading="lazy" />
              <span className="demo-play"><Play size={18} fill="currentColor" /></span>
              <span className="demo-dur">{v.duration}</span>
            </span>
            <span className="demo-title">{v.title}</span>
          </button>
        )} />
      </div>
    </section>
  );
}

/* ---------------- Store visit strip ---------------- */
function Visit() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="visit">
          <div>
            <h2>Visit Our Store</h2>
            <p><MapPin size={16} /> #39, Ground Floor, WAT Street, Beside Domino&apos;s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
          </div>
          <div className="visit-btns">
            <a href="tel:+918041486443" className="btn btn-primary"><Phone size={16} /> 080-41486443</a>
            <a href="https://wa.me/917996222111" target="_blank" rel="noopener noreferrer" className="btn btn-outline"><MessageCircle size={16} /> 7996 222111</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
export default function Home() {
  const [tab1, setTab1] = useState('moulds');
  const [tab2, setTab2] = useState('pack');

  const TAB1 = {
    moulds: byCat('Silicone Moulds'),
    toppers: byCat('Cake Toppers'),
    tools: byCat('Baking Tools'),
  };
  const TAB1_TO = { moulds: '/category/silicone-moulds', toppers: '/category/cake-toppers', tools: '/category/baking-tools' };
  const TAB2 = {
    pack: byCat('Packing Materials', 'Decoration Ribbons'),
    boards: byCat('Cake Base & Boards'),
    stands: byCat('Cake Stands', 'Cake Base & Boards'),
  };
  const TAB2_TO = { pack: '/category/packing-materials', boards: '/category/cake-base-and-boards', stands: '/category/cake-stands' };

  const newArrivals = PRODUCTS.filter((p) => p.isNew).concat(PRODUCTS.slice(-6).filter((p) => !p.isNew)).slice(0, 10);

  return (
    <div className="home">
      <Hero />

      <Rail title="New Arrivals" products={newArrivals} to="/category/new-arrivals" />

      <Rail
        title="Our Baking Products"
        products={TAB1[tab1]}
        to={TAB1_TO[tab1]}
        tabs={[{ key: 'moulds', label: 'Moulds' }, { key: 'toppers', label: 'Cake Toppers' }, { key: 'tools', label: 'Baking Tools' }]}
        activeTab={tab1}
        onTab={setTab1}
      />

      <Collections />

      <PromoPanel
        title="Cake Toppers"
        line={`Butterflies, crowns, coins, figurines & more — starting ${formatINR(minPrice(byCat('Cake Toppers')))}`}
        to="/category/cake-toppers"
        theme="blush"
        products={byCat('Cake Toppers')}
        art={pick(45, 22, 29)}
      />

      <TextBanner />

      <Rail
        title="Cake Boards & Packaging"
        centered
        products={TAB2[tab2]}
        to={TAB2_TO[tab2]}
        tabs={[{ key: 'pack', label: 'Packaging' }, { key: 'boards', label: 'Cake Boards' }, { key: 'stands', label: 'Cake Stands' }]}
        activeTab={tab2}
        onTab={setTab2}
      />

      <Demos />

      <Rail title="Baking Must Haves" products={byCat('Baking Tools')} to="/category/baking-tools" />

      <Visit />
    </div>
  );
}
