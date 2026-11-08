import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Play, Video, BadgePercent, Store } from 'lucide-react';
import AddButton from '../components/AddButton.jsx';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock, catSlug } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

const EASE = [0.22, 1, 0.36, 1];

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();
  const [variant, setVariant] = useState(null);
  const [open, setOpen] = useState(true);
  useEffect(() => { setVariant(p?.variants?.[0]?.name || null); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) return <main className="wrap pd-missing"><h1>Product not found</h1><Link to="/" className="btn btn-pink">Go home</Link></main>;

  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const stock = p.stock == null ? 'Stock to be confirmed' : isLowStock(p) ? `Only ${p.stock} left` : `${p.stock} ${p.unit} in stock`;

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="wrap pd">
        <div className="pd-left">
          <motion.div className="pd-img" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
            <img src={p.img} alt={p.name} />
            {p.isNew && <span className="pd-new">NEW ARRIVAL</span>}
          </motion.div>
          <div className="pd-details desk">
            <button className="pd-acc" onClick={() => setOpen((o) => !o)} aria-expanded={open}>Product details <ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }} /></button>
            {open && (
              <dl>
                <div><dt>Category</dt><dd>{p.category}</dd></div>
                <div><dt>Sold as</dt><dd>Per {p.unit}</dd></div>
                {p.variants && <div><dt>Options</dt><dd>{p.variants.map((v) => v.name).join(', ')}</dd></div>}
                <div><dt>Availability</dt><dd>{stock}</dd></div>
                <div><dt>Sold by</dt><dd>Adi Shakti Trader, Gandhi Bazaar, Bengaluru</dd></div>
              </dl>
            )}
          </div>
        </div>

        <motion.div className="pd-right" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: EASE }}>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><ChevronRight size={12} />
            <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link><ChevronRight size={12} />
            <span>{p.name}</span>
          </nav>
          <h1>{p.name}</h1>
          <Link to={`/category/${catSlug(p.category)}`} className="pd-viewall">View all in {p.category} <ChevronRight size={14} /></Link>

          {p.variants ? (
            <div className="pd-units" role="radiogroup" aria-label="Choose option">
              <span className="pd-sub">Select option</span>
              <div>
                {p.variants.map((v) => (
                  <button key={v.name} role="radio" aria-checked={variant === v.name} className={variant === v.name ? 'on' : ''} onClick={() => setVariant(v.name)}>
                    <b>{v.name}</b><small>{formatINR(p.price)}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pd-units"><span className="pd-sub">Unit</span><div><button className="on" aria-pressed="true"><b>1 {p.unit}</b><small>{formatINR(p.price)}</small></button></div></div>
          )}

          <div className="pd-buy">
            <div><span className="pd-price">{formatINR(p.price)}</span><small className="muted">per {p.unit}</small></div>
            <AddButton id={p.id} name={p.name} size="lg" />
          </div>
          <p className={`pd-stock ${isLowStock(p) ? 'low' : ''}`}>{stock}</p>

          {demo && (
            <button className="pd-demo" onClick={() => shop.setVideo(demo)}>
              <span className="pd-demo-img"><img src={demo.poster} alt="" /><Play size={16} fill="currentColor" /></span>
              <span><small>SEE IT IN A DEMO · {demo.duration}</small><b>{demo.title}</b></span>
              <ChevronRight size={18} />
            </button>
          )}

          <div className="pd-why">
            <h2>Why shop from Adi Shakti?</h2>
            {[[Video, '2‑minute cake demos', 'Learn how to use every product before you bake.'], [BadgePercent, 'Wholesale rates', 'Better prices for bakeries on bulk orders.'], [Store, 'Pick up or delivery', 'Collect from Gandhi Bazaar or get it delivered in Bengaluru.']].map(([I, t, d]) => (
              <div key={t}><span><I size={20} /></span><p><b>{t}</b><small>{d}</small></p></div>
            ))}
          </div>

          <div className="pd-details mob">
            <h2>Product details</h2>
            <dl>
              <div><dt>Category</dt><dd>{p.category}</dd></div>
              <div><dt>Sold as</dt><dd>Per {p.unit}</dd></div>
              <div><dt>Availability</dt><dd>{stock}</dd></div>
              <div><dt>Sold by</dt><dd>Adi Shakti Trader, Bengaluru</dd></div>
            </dl>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && <Rail title="Similar products" products={related} to={`/category/${catSlug(p.category)}`} />}
    </motion.main>
  );
}
