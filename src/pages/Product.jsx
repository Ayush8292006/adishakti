import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Heart, MessageCircle, Minus, Plus, MapPin, Phone, Store } from 'lucide-react';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock, catSlug, stockLabel } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

function Acc({ title, children, open: init = false }) {
  const [open, setOpen] = useState(init);
  return (
    <div className={`pd-acc ${open ? 'open' : ''}`}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span><ChevronDown size={18} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="pd-acc-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useEffect(() => {
    setVariant(p?.variants?.[0]?.name || null);
    setQty(1);
    if (p) shop.markViewed(p.id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) {
    return (
      <div className="wrap pd-missing">
        <h1>Product not found</h1>
        <Link to="/category/all" className="btn btn-primary">Browse all products</Link>
      </div>
    );
  }

  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const viewed = shop.viewed.filter((x) => x !== p.id).map(findProduct).filter(Boolean);
  const soldOut = p.stock === 0;
  const maxQty = p.stock || 99;
  const wished = shop.isWishlisted(p.id);
  const cur = p.variants?.find((v) => v.name === variant);

  const wa = `https://wa.me/917996222111?text=${encodeURIComponent(
    `Hi Adi Shakti Trader! I'd like to order: ${p.name}${variant ? ` (${variant})` : ''} × ${qty} — ${formatINR(p.price * qty)}`
  )}`;

  const addToCart = () => shop.add(p.id, qty);
  const buyNow = () => { shop.add(p.id, qty); shop.setCartOpen(true); };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="pd">
      <nav className="wrap pd-crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link><span>/</span>
        <b>{p.name}</b>
      </nav>

      <div className="wrap pd-grid">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main" onMouseMove={onMove} onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}>
            <img src={p.img} alt={p.name} style={zoom.on ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            {soldOut ? <span className="pc-badge sold">Sold out</span> : p.isNew ? <span className="pc-badge new">New</span> : null}
          </div>
          <div className="pd-thumbs">
            <button type="button" className="on"><img src={p.img} alt="" /></button>
            {demo && (
              <button type="button" className="pd-thumb-vid" onClick={() => shop.setVideo(demo)} aria-label="Play demo video">
                <img src={demo.poster} alt="" /><span><Play size={14} fill="currentColor" /></span>
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1>{p.name}</h1>
          <div className="pd-price">{formatINR(p.price)}</div>
          <p className="pd-tax">Price shown is a sample price for this prototype.</p>

          <div className={`pd-stock ${soldOut ? 'out' : isLowStock(p) ? 'low' : ''}`}>
            <span className="dot" />
            {soldOut ? 'Sold out' : p.stock == null ? 'Stock to be confirmed' : isLowStock(p) ? `Hurry, only ${p.stock} left` : 'In stock'}
          </div>

          {p.variants && (
            <div className="pd-opt">
              <span className="pd-label">Colour: <b>{variant}</b></span>
              <div className="pd-opt-row">
                {p.variants.map((v) => (
                  <button key={v.name} type="button" className={`pd-chip ${variant === v.name ? 'on' : ''}`} onClick={() => setVariant(v.name)} disabled={v.stock === 0}>
                    {v.name}
                  </button>
                ))}
              </div>
              {cur && <small className="pd-opt-stock">{cur.stock} {p.unit} available</small>}
            </div>
          )}

          <div className="pd-opt">
            <span className="pd-label">Quantity</span>
            <div className="pd-buyrow">
              <div className="pd-qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={15} /></button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase"><Plus size={15} /></button>
              </div>
              <button type="button" className="pd-add" onClick={addToCart} disabled={soldOut}>{soldOut ? 'Sold out' : 'Add to cart'}</button>
              <button type="button" className={`pd-wish ${wished ? 'on' : ''}`} onClick={() => shop.toggleWishlist(p.id)} aria-label="Wishlist">
                <Heart size={19} fill={wished ? '#e22120' : 'none'} color={wished ? '#e22120' : '#333'} />
              </button>
            </div>
            <button type="button" className="pd-buy" onClick={buyNow} disabled={soldOut}>Buy it now</button>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="pd-wa"><MessageCircle size={17} /> Order on WhatsApp</a>
          </div>

          {demo && (
            <button type="button" className="pd-demo" onClick={() => shop.setVideo(demo)}>
              <span className="pd-demo-img"><img src={demo.poster} alt="" /><span><Play size={14} fill="currentColor" /></span></span>
              <span><small>Cake demo · {demo.duration}</small><b>{demo.title}</b></span>
            </button>
          )}

          <div className="pd-accs">
            <Acc title="Description" open>
              <p>{p.name} from our {p.category.toLowerCase()} range. Available at Adi Shakti Trader, Gandhi Bazaar, Bengaluru.</p>
              {p.note && <p className="pd-note">Note: {p.note}</p>}
            </Acc>
            <Acc title="Product details">
              <table className="pd-table">
                <tbody>
                  <tr><th>Category</th><td>{p.category}</td></tr>
                  <tr><th>Sold as</th><td>Per {p.unit}</td></tr>
                  {p.variants && <tr><th>Options</th><td>{p.variants.map((v) => v.name).join(', ')}</td></tr>}
                  <tr><th>Availability</th><td>{stockLabel(p)}</td></tr>
                </tbody>
              </table>
            </Acc>
            <Acc title="Store pickup & contact">
              <p className="pd-line"><Store size={15} /> Pickup available at our Gandhi Bazaar store.</p>
              <p className="pd-line"><MapPin size={15} /> #39, Ground Floor, WAT Street, Beside Domino&apos;s Pizza, Gandhi Bazaar, Basavanagudi, Bengaluru 560004</p>
              <p className="pd-line"><Phone size={15} /> <a href="tel:+918041486443">080-41486443</a> · <a href="tel:+917996222111">7996 222111</a></p>
            </Acc>
          </div>
        </div>
      </div>

      {related.length > 0 && <Rail title="You may also like" products={related} to={`/category/${catSlug(p.category)}`} />}
      {viewed.length > 0 && <Rail title="Recently viewed" products={viewed} />}
    </div>
  );
}
