import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Play, Video, BadgePercent, Store,
  Star, ShieldCheck, Truck, MessageCircle
} from 'lucide-react';
import AddButton from '../components/AddButton.jsx';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock, catSlug } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

const EASE = [0.16, 1, 0.3, 1];

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();
  const [variant, setVariant] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setVariant(p?.variants?.[0]?.name || null);
  }, [id, p]);

  if (!p) {
    return (
      <main className="wrap pd-missing">
        <h1>Product not found</h1>
        <p className="muted">The product you are looking for might have been moved or updated.</p>
        <Link to="/" className="btn btn-pink">
          Browse All Products
        </Link>
      </main>
    );
  }

  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  const stock = p.stock == null
    ? 'Stock to be confirmed'
    : isLowStock(p)
      ? `Only ${p.stock} left in Gandhi Bazaar`
      : `${p.stock} ${p.unit} in stock (Immediate dispatch)`;

  const mrp = Math.round(p.price * 1.25);

  const whatsappMessage = `Hi Adi Shakti Trader! I want to order "${p.name}" (Price: ${formatINR(p.price)}${variant ? `, Option: ${variant}` : ''
    }). Is same-day delivery available?`;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pd-page"
    >
      <div className="wrap pd">
        <div className="pd-left">
          <motion.div
            className="pd-img"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <img src={p.img} alt={p.name} />
            {p.isNew && <span className="pd-new">NEW ARRIVAL</span>}
            {p.category === 'Silicone Moulds' && (
              <span className="pd-food-badge">
                <ShieldCheck size={13} /> 100% Certified Food-Grade Platinum Silicone
              </span>
            )}
          </motion.div>

          <div className="pd-details desk">
            <button
              className="pd-acc"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              <span>Product Specifications &amp; Details</span>
              <ChevronDown
                size={18}
                style={{
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition: 'transform .28s var(--ease)',
                }}
              />
            </button>
            {open && (
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{p.category}</dd>
                </div>
                <div>
                  <dt>Sold As</dt>
                  <dd>Per {p.unit}</dd>
                </div>
                {p.variants && (
                  <div>
                    <dt>Available Options</dt>
                    <dd>{p.variants.map((v) => v.name).join(', ')}</dd>
                  </div>
                )}
                <div>
                  <dt>Stock Status</dt>
                  <dd>{stock}</dd>
                </div>
                <div>
                  <dt>Material / Safety</dt>
                  <dd>BPA-Free, 100% Food-Safe &amp; Non-Toxic</dd>
                </div>
                <div>
                  <dt>Sold &amp; Dispatched By</dt>
                  <dd>Adi Shakti Trader, #39 WAT Street, Gandhi Bazaar, Bengaluru</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        <motion.div
          className="pd-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link>
            <ChevronRight size={12} />
            <span>{p.name}</span>
          </nav>

          <h1>{p.name}</h1>

          <div className="pd-rating-strip">
            <div className="pd-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#eab308" color="#eab308" />
              ))}
            </div>
            <span>4.9 / 5</span>
            <span className="pd-dot">•</span>
            <span className="muted">38 verified reviews</span>
            <span className="pd-dot">•</span>
            <Link to={`/category/${catSlug(p.category)}`} className="pd-viewall">
              View all {p.category} &rarr;
            </Link>
          </div>

          {p.variants ? (
            <div className="pd-units" role="radiogroup" aria-label="Choose option">
              <span className="pd-sub">Select Option / Color:</span>
              <div>
                {p.variants.map((v) => (
                  <button
                    key={v.name}
                    role="radio"
                    aria-checked={variant === v.name}
                    className={variant === v.name ? 'on' : ''}
                    onClick={() => setVariant(v.name)}
                  >
                    <b>{v.name}</b>
                    <small>{formatINR(p.price)}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pd-units">
              <span className="pd-sub">Package Unit:</span>
              <div>
                <button className="on" aria-pressed="true">
                  <b>1 {p.unit}</b>
                  <small>{formatINR(p.price)}</small>
                </button>
              </div>
            </div>
          )}

          <div className="pd-buy">
            <div className="pd-price-col">
              <div className="pd-prices">
                <span className="pd-price">{formatINR(p.price)}</span>
                <span className="pd-mrp">{formatINR(mrp)}</span>
                <span className="pd-save-badge">20% OFF</span>
              </div>
              <small className="muted">Inclusive of all local taxes</small>
            </div>
            <div className="pd-add-action">
              <AddButton id={p.id} name={p.name} size="lg" />
            </div>
          </div>

          <div className="pd-action-btns">
            <a
              href={`https://wa.me/917996222111?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp pd-wa-btn"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
          </div>

          <p className={`pd-stock ${isLowStock(p) ? 'low' : ''}`}>
            <span className="stock-bullet" /> {stock}
          </p>

          <div className="pd-delivery-callout">
            <Truck size={17} className="deliv-ico" />
            <div>
              <b>Express Delivery in Bengaluru</b>
              <small>Dispatched today from Gandhi Bazaar if ordered before 2 PM.</small>
            </div>
          </div>

          {demo && (
            <button className="pd-demo" onClick={() => shop.setVideo(demo)}>
              <span className="pd-demo-img">
                <img src={demo.poster} alt="" />
                <Play size={16} fill="currentColor" />
              </span>
              <span>
                <small>WATCH HOW TO USE · {demo.duration}</small>
                <b>{demo.title}</b>
              </span>
              <ChevronRight size={18} />
            </button>
          )}

          <div className="pd-why">
            <h2>Why Buy from Adi Shakti?</h2>
            {[
              [Video, '2-Minute Cake Demos', 'See how to use every mould and nozzle set before you start baking.'],
              [BadgePercent, 'Direct Wholesale Rates', 'Discounted tiered rates for bakeries and home chefs on bulk orders.'],
              [Store, 'Pick Up or Fast Delivery', 'Collect in person from Gandhi Bazaar or get express door delivery across Bengaluru.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="pd-why-item">
                <span>
                  <Icon size={20} />
                </span>
                <p>
                  <b>{title}</b>
                  <small>{desc}</small>
                </p>
              </div>
            ))}
          </div>

          <div className="pd-details mob">
            <h2>Product Details</h2>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{p.category}</dd>
              </div>
              <div>
                <dt>Sold As</dt>
                <dd>Per {p.unit}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{stock}</dd>
              </div>
              <div>
                <dt>Store Location</dt>
                <dd>#39 WAT Street, Gandhi Bazaar, Basavanagudi, Bengaluru</dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <Rail
          title={`More in ${p.category}`}
          subtitle="Frequently bought together by Bengaluru cake decorators"
          products={related}
          to={`/category/${catSlug(p.category)}`}
        />
      )}
    </motion.main>
  );
}
