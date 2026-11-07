import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Play, Truck, Store, Video } from 'lucide-react';
import { Page, Reveal, Lines } from '../components/Motion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

const EASE = [0.22, 1, 0.36, 1];

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(null);

  useEffect(() => { setQty(1); setVariant(p?.variants?.[0]?.name || null); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) {
    return (
      <Page className="pd wrap">
        <p className="serif" style={{ fontSize: 36 }}>Product not found.</p>
        <Link to="/#shop" className="btn btn-solid">Back to shop</Link>
      </Page>
    );
  }

  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const stockText = p.stock == null ? 'Stock to be confirmed' : isLowStock(p) ? `Only ${p.stock} left in stock` : 'In stock';

  return (
    <Page className="pd">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/#shop"><ArrowLeft size={14} /> Shop</Link><span>/</span><span>{p.category}</span>
        </nav>

        <div className="pd-grid">
          <div className="pd-media">
            <motion.div className="pd-img" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.2, ease: EASE }}>
              <motion.img key={p.id} src={p.img} alt={p.name} initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} />
            </motion.div>
          </div>

          <div className="pd-info">
            <motion.span className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{p.category}</motion.span>
            <Lines as="h1" className="serif pd-title" inView={false} delay={0.2} lines={[p.name]} />
            <motion.div className="pd-price" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <span className="serif">{formatINR(p.price)}</span><small>per {p.unit}</small>
            </motion.div>
            <motion.p className={`pd-stock ${isLowStock(p) ? 'low' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="dot" /> {stockText}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease: EASE }}>
              {p.variants && (
                <fieldset className="pd-variants">
                  <legend className="label">Option</legend>
                  <div>
                    {p.variants.map((v) => (
                      <label key={v.name} className={variant === v.name ? 'on' : ''}>
                        <input type="radio" name="variant" className="sr-only" checked={variant === v.name} onChange={() => setVariant(v.name)} />
                        {v.name}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="pd-buy">
                <div className="qty big" role="group" aria-label="Quantity">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={16} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus size={16} /></button>
                </div>
                <button className="btn btn-solid pd-add" onClick={() => { shop.add(p.id, qty); shop.setCartOpen(true); }}>
                  Add to cart — {formatINR(p.price * qty)}
                </button>
              </div>

              {demo && (
                <button className="pd-demo" onClick={() => shop.setVideo(demo)}>
                  <span className="pd-demo-img"><img src={demo.poster} alt="" /><Play size={16} fill="currentColor" /></span>
                  <span><span className="label">See it in a demo · {demo.duration}</span><b className="serif">{demo.title}</b></span>
                </button>
              )}

              <ul className="pd-perks">
                <li><Truck size={18} strokeWidth={1.5} /> Delivery across Bengaluru</li>
                <li><Store size={18} strokeWidth={1.5} /> Pick up at Gandhi Bazaar</li>
                <li><Video size={18} strokeWidth={1.5} /> Two‑minute demo videos</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section wrap">
          <div className="sec-head">
            <div><span className="label">More in {p.category}</span><Lines className="serif" lines={['You may also', <em key="e">need</em>]} /></div>
            <Reveal><Link to="/#shop" className="link">View all</Link></Reveal>
          </div>
          <div className="pd-related">
            {related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}
          </div>
        </section>
      )}
    </Page>
  );
}
