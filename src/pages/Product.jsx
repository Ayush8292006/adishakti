import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Minus, Plus, Play, Truck, Store, BadgePercent, Phone, ShoppingBag, Zap } from 'lucide-react';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock, catSlug } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

function Acc({ title, children, open: o = false }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="acc">
      <button onClick={() => setOpen((x) => !x)} aria-expanded={open}>{title}<ChevronDown size={18} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} /></button>
      <AnimatePresence initial={false}>
        {open && <motion.div className="acc-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div>{children}</div></motion.div>}
      </AnimatePresence>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(null);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useEffect(() => {
    if (!p) return;
    setQty(1); setVariant(p.variants?.[0]?.name || null);
    shop.markViewed(p.id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) return <main className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}><h1>Product not found</h1><Link to="/category/all" className="btn btn-brand">Browse products</Link></main>;

  const soldOut = p.stock === 0;
  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const recently = shop.viewed.filter((x) => x !== p.id).map(findProduct).filter(Boolean);
  const stockText = p.stock == null ? 'Stock to be confirmed — call to check' : soldOut ? 'Sold out' : isLowStock(p) ? `Hurry, only ${p.stock} left in stock` : 'In stock';
  const add = () => { shop.add(p.id, qty); };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="wrap">
        <nav className="crumbs pd-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><ChevronRight size={13} />
          <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link><ChevronRight size={13} />
          <span>{p.name}</span>
        </nav>

        <div className="pd">
          <motion.div className="pd-gallery" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="pd-main"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}>
              <img src={p.img} alt={p.name} style={{ transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: zoom.on ? 'scale(1.8)' : 'none' }} />
              {p.isNew && <span className="pd-badge">New</span>}
            </div>
            <p className="pd-hint muted">Hover to zoom</p>
          </motion.div>

          <motion.div className="pd-info" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
            <Link to={`/category/${catSlug(p.category)}`} className="pd-cat">{p.category}</Link>
            <h1>{p.name}</h1>
            <div className="pd-price"><b>{formatINR(p.price)}</b><span className="muted">per {p.unit}</span></div>
            <p className={`pd-stock ${soldOut ? 'out' : isLowStock(p) ? 'low' : ''}`}><i />{stockText}</p>

            {p.variants && (
              <fieldset className="pd-var">
                <legend>Option: <b>{variant}</b></legend>
                <div>{p.variants.map((v) => (
                  <label key={v.name} className={variant === v.name ? 'on' : ''}>
                    <input type="radio" name="variant" className="sr-only" checked={variant === v.name} onChange={() => setVariant(v.name)} />{v.name}
                  </label>
                ))}</div>
              </fieldset>
            )}

            <div className="pd-qty-row">
              <span className="pd-label">Quantity</span>
              <div className="pd-qty" role="group" aria-label="Quantity">
                <button onClick={() => setQty((x) => Math.max(1, x - 1))} aria-label="Decrease"><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((x) => x + 1)} aria-label="Increase"><Plus size={16} /></button>
              </div>
            </div>
            <div className="pd-btns">
              <button className="btn btn-line pd-add" onClick={add} disabled={soldOut}><ShoppingBag size={18} /> Add to cart</button>
              <button className="btn btn-accent pd-buy" onClick={() => { add(); shop.setCartOpen(true); }} disabled={soldOut}><Zap size={18} /> Buy it now</button>
            </div>

            {demo && (
              <button className="pd-demo" onClick={() => shop.setVideo(demo)}>
                <span className="pd-demo-img"><img src={demo.poster} alt="" /><Play size={16} fill="currentColor" /></span>
                <span><small>See it in a cake demo · {demo.duration}</small><b>{demo.title}</b></span>
                <ChevronRight size={18} />
              </button>
            )}

            <ul className="pd-perks">
              <li><Truck size={18} /> Delivery across Bengaluru</li>
              <li><Store size={18} /> Pick up from Gandhi Bazaar store</li>
              <li><BadgePercent size={18} /> Wholesale rates on bulk orders</li>
            </ul>

            <div className="pd-accs">
              <Acc title="Description" open>
                <p><b>{p.name}</b> from Adi Shakti Trader, Gandhi Bazaar, Bengaluru. Sold per {p.unit}{p.variants ? `, available in ${p.variants.map((v) => v.name).join(' and ')}` : ''}.</p>
                <p>Part of our <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link> range for home bakers and bakeries.</p>
              </Acc>
              <Acc title="Delivery & pick-up">
                <p>We deliver across Bengaluru. You can also collect your order from #39, Ground Floor, WAT Street, Beside Domino’s Pizza, Gandhi Bazaar, Basavanagudi.</p>
              </Acc>
              <Acc title="Wholesale & bulk orders">
                <p>Bakeries and cake studios can ask for wholesale rates. Call <a href="tel:+917996222111"><Phone size={13} /> 7996 222111</a> or <a href="tel:+918041486443">080-41486443</a>.</p>
              </Acc>
            </div>
          </motion.div>
        </div>
      </div>

      <Rail title="You may also like" products={related} to={`/category/${catSlug(p.category)}`} />
      <Rail title="Recently viewed" products={recently} />
    </motion.main>
  );
}
