import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, PlayCircle, ShoppingBag, User, Search, ChevronLeft, Plus, Minus, Play, X, Package, MapPin, LogOut } from 'lucide-react';
import PhoneFrame from '../../components/PhoneFrame.jsx';
import { Page } from '../../components/Reveal.jsx';
import { PRODUCTS, CATEGORIES, formatINR, findProduct, isLowStock } from '../../data/products.js';
import { VIDEOS, suggestVideo } from '../../data/videos.js';
import { useCart } from '../../context/CartContext.jsx';
import './CustomerApp.css';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
  { id: 'demos', label: 'Demos', icon: PlayCircle },
  { id: 'cart', label: 'Cart', icon: ShoppingBag },
  { id: 'account', label: 'Account', icon: User },
];

const CAT_IMG = {
  'Cake Toppers': '/products/filigree-butterfly.jpg', 'Silicone Moulds': '/products/rose-mould.jpg', 'Baking Tools': '/products/nozzle-set.jpg',
  'Cake Base & Boards': '/products/mdf-cake-board.jpg', 'Packing Materials': '/products/gold-foil.jpg', 'Decoration Ribbons': '/products/diamond-mesh.jpg', 'Cake Stands': '/products/acrylic-stand.jpg',
};

const SHORT = {
  'Cake Toppers': 'Toppers', 'Silicone Moulds': 'Moulds', 'Baking Tools': 'Tools', 'Cake Base & Boards': 'Bases',
  'Packing Materials': 'Packing', 'Decoration Ribbons': 'Ribbons', 'Cake Stands': 'Stands',
};

const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

function MiniCard({ p, onOpen }) {
  const cart = useCart();
  return (
    <motion.div variants={item} className="ca-card" whileTap={{ scale: 0.97 }}>
      <button className="ca-card-img" onClick={() => onOpen(p)} aria-label={`Open ${p.name}`}>
        <img src={p.img} alt="" />
        {p.isNew && <span className="ca-new">NEW</span>}
      </button>
      <div className="ca-card-body">
        <span className="ca-card-name">{p.name}</span>
        <div className="ca-card-foot">
          <b>{formatINR(p.price)}</b>
          <motion.button whileTap={{ scale: 0.8, rotate: 90 }} className="ca-add" onClick={() => cart.add(p.id)} aria-label={`Add ${p.name}`}><Plus size={18} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function VideoSheet({ video, onClose }) {
  const cart = useCart();
  return (
    <AnimatePresence>
      {video && (
        <motion.div className="ca-sheet-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="ca-sheet" onClick={(e) => e.stopPropagation()} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
            <span className="ca-grab" />
            <div className="ca-sheet-video">
              {video.src ? <video src={video.src} controls autoPlay /> : <><img src={video.poster} alt="" /><span className="ca-play-big"><Play size={26} fill="#B8235A" color="#B8235A" /></span></>}
              <button className="ca-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>
            <h3 className="display">{video.title}</h3>
            <p className="ca-muted">{video.duration} · Products used</p>
            {video.productIds.map((id) => {
              const p = findProduct(id);
              return (
                <div key={id} className="ca-line">
                  <img src={p.img} alt="" />
                  <div><b>{p.name}</b><span>{formatINR(p.price)}</span></div>
                  <button className="ca-pill-btn" onClick={() => cart.add(id)}>Add</button>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CustomerApp() {
  const cart = useCart();
  const [tab, setTab] = useState('home');
  const [product, setProduct] = useState(null);
  const [cat, setCat] = useState(null);
  const [q, setQ] = useState('');
  const [video, setVideo] = useState(null);
  const [slide, setSlide] = useState(0);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const scroller = useRef(null);

  const banners = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  useEffect(() => { const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 3500); return () => clearInterval(t); }, [banners.length]);
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [tab, product, cat]);

  const open = (p) => { setProduct(p); setVariant(p.variants?.[0]?.name || null); setQty(1); };
  const filtered = useMemo(() => PRODUCTS.filter((p) => (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [cat, q]);
  const suggestion = suggestVideo(cart.items);
  const screenKey = product ? `p-${product.id}` : cat ? `c-${cat}` : tab;

  return (
    <Page>
      <PhoneFrame title="Customer App" desc="Mobile shopping app for home bakers and bakeries. Same products, cart and demo videos as the website."
        points={['Auto-sliding new arrivals', 'Product page with variants', 'Cart suggests a 2-min cake demo', 'Smooth screen transitions']}>
        <div className="ca">
          <div className="ca-scroll" ref={scroller}>
            <AnimatePresence mode="wait">
              <motion.div key={screenKey} initial={{ opacity: 0, x: product || cat ? 40 : 0, y: product || cat ? 0 : 12 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: product || cat ? -30 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

                {/* PRODUCT DETAIL */}
                {product && (
                  <div className="ca-pd">
                    <div className="ca-pd-img">
                      <motion.img layoutId={`img-${product.id}`} src={product.img} alt={product.name} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} />
                      <button className="ca-round back" onClick={() => setProduct(null)} aria-label="Back"><ChevronLeft size={20} /></button>
                    </div>
                    <div className="ca-pd-body">
                      <span className="ca-eyebrow">{product.category}</span>
                      <h1 className="display">{product.name}</h1>
                      <div className="ca-pd-price"><b className="display">{formatINR(product.price)}</b><span>/ {product.unit}</span></div>
                      <p className={`ca-stock ${isLowStock(product) ? 'low' : ''}`}>{product.stock == null ? 'Stock to confirm' : isLowStock(product) ? `Only ${product.stock} left` : 'In stock'}</p>
                      {product.variants && (
                        <div className="ca-variants" role="radiogroup" aria-label="Variant">
                          {product.variants.map((v) => (
                            <button key={v.name} role="radio" aria-checked={variant === v.name} className={variant === v.name ? 'on' : ''} onClick={() => setVariant(v.name)}>{v.name}</button>
                          ))}
                        </div>
                      )}
                      {VIDEOS.filter((v) => v.productIds.includes(product.id) || v.category === product.category).slice(0, 1).map((v) => (
                        <button key={v.id} className="ca-demo-link" onClick={() => setVideo(v)}>
                          <span className="ca-demo-thumb"><img src={v.poster} alt="" /><Play size={16} fill="#fff" color="#fff" /></span>
                          <span><b>See it in a demo</b><small>{v.title} · {v.duration}</small></span>
                        </button>
                      ))}
                    </div>
                    <div className="ca-pd-bar">
                      <div className="ca-qty">
                        <button onClick={() => setQty((x) => Math.max(1, x - 1))} aria-label="Decrease"><Minus size={16} /></button>
                        <span>{qty}</span>
                        <button onClick={() => setQty((x) => x + 1)} aria-label="Increase"><Plus size={16} /></button>
                      </div>
                      <motion.button whileTap={{ scale: 0.96 }} className="ca-cta" onClick={() => { cart.add(product.id, qty); setProduct(null); setTab('cart'); }}>
                        Add to cart · {formatINR(product.price * qty)}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* CATEGORY LIST */}
                {!product && cat && (
                  <div className="ca-pad">
                    <div className="ca-row-head">
                      <button className="ca-round" onClick={() => setCat(null)} aria-label="Back"><ChevronLeft size={20} /></button>
                      <h1 className="display ca-h">{cat}</h1>
                    </div>
                    <motion.div className="ca-grid" variants={list} initial="hidden" animate="show">
                      {filtered.map((p) => <MiniCard key={p.id} p={p} onOpen={open} />)}
                    </motion.div>
                  </div>
                )}

                {/* HOME */}
                {!product && !cat && tab === 'home' && (
                  <div className="ca-pad">
                    <div className="ca-top">
                      <div><span className="ca-muted"><MapPin size={13} /> Deliver to Basavanagudi</span><div className="display ca-brand">Adi Shakti</div></div>
                      <button className="ca-cart-ico" onClick={() => setTab('cart')} aria-label="Cart">
                        <ShoppingBag size={20} />
                        <motion.span key={cart.count} initial={{ scale: 1.8 }} animate={{ scale: 1 }}>{cart.count}</motion.span>
                      </button>
                    </div>
                    <label className="ca-search"><Search size={18} /><span className="sr-only">Search</span>
                      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search moulds, toppers…" onFocus={() => setTab('categories')} />
                    </label>

                    <div className="ca-banner">
                      <AnimatePresence mode="wait">
                        <motion.div key={slide} className="ca-banner-slide" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                          <div>
                            <span className="ca-eyebrow light">NEW ARRIVAL</span>
                            <b className="display">{banners[slide].name}</b>
                            <button className="ca-pill-btn" onClick={() => open(banners[slide])}>Shop · {formatINR(banners[slide].price)}</button>
                          </div>
                          <img src={banners[slide].img} alt="" />
                        </motion.div>
                      </AnimatePresence>
                      <div className="ca-dots">{banners.map((_, i) => <span key={i} className={i === slide ? 'on' : ''} />)}</div>
                    </div>

                    <div className="ca-cats">
                      {CATEGORIES.map((c, i) => (
                        <motion.button key={c} onClick={() => setCat(c)} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} whileTap={{ scale: 0.9 }}>
                          <img src={CAT_IMG[c]} alt="" /><span>{SHORT[c]}</span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="ca-sec-head"><h2 className="display">Demo videos</h2><button onClick={() => setTab('demos')}>See all</button></div>
                    <div className="ca-hscroll">
                      {VIDEOS.slice(0, 4).map((v) => (
                        <button key={v.id} className="ca-vcard" onClick={() => setVideo(v)}>
                          <img src={v.poster} alt="" /><span className="ca-vplay"><Play size={16} fill="#B8235A" color="#B8235A" /></span>
                          <b>{v.title}</b><small>{v.duration}</small>
                        </button>
                      ))}
                    </div>

                    <div className="ca-sec-head"><h2 className="display">Popular</h2></div>
                    <motion.div className="ca-grid" variants={list} initial="hidden" animate="show">
                      {PRODUCTS.slice(0, 12).map((p) => <MiniCard key={p.id} p={p} onOpen={open} />)}
                    </motion.div>
                  </div>
                )}

                {/* CATEGORIES */}
                {!product && !cat && tab === 'categories' && (
                  <div className="ca-pad">
                    <h1 className="display ca-h">Categories</h1>
                    <label className="ca-search"><Search size={18} /><span className="sr-only">Search</span><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all 46 products" /></label>
                    {q ? (
                      <motion.div className="ca-grid" variants={list} initial="hidden" animate="show">{filtered.map((p) => <MiniCard key={p.id} p={p} onOpen={open} />)}</motion.div>
                    ) : (
                      <motion.div className="ca-catlist" variants={list} initial="hidden" animate="show">
                        {CATEGORIES.map((c) => (
                          <motion.button variants={item} key={c} onClick={() => setCat(c)} whileTap={{ scale: 0.97 }}>
                            <img src={CAT_IMG[c]} alt="" />
                            <span><b>{c}</b><small>{PRODUCTS.filter((p) => p.category === c).length} products</small></span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* DEMOS */}
                {!product && !cat && tab === 'demos' && (
                  <div className="ca-pad">
                    <h1 className="display ca-h">Cake demos</h1>
                    <p className="ca-muted" style={{ marginTop: -6 }}>2-minute videos with the products used.</p>
                    <motion.div variants={list} initial="hidden" animate="show" className="ca-vlist">
                      {VIDEOS.map((v) => (
                        <motion.button variants={item} key={v.id} className="ca-vrow" onClick={() => setVideo(v)}>
                          <span className="ca-vrow-img"><img src={v.poster} alt="" /><Play size={20} fill="#fff" color="#fff" /><small>{v.duration}</small></span>
                          <span><b>{v.title}</b><small>{v.productIds.length} products used</small></span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* CART */}
                {!product && !cat && tab === 'cart' && (
                  <div className="ca-pad">
                    <h1 className="display ca-h">My cart <small className="ca-muted">({cart.count})</small></h1>
                    {cart.items.length === 0 && <p className="ca-muted" style={{ textAlign: 'center', marginTop: 60 }}>Cart is empty.</p>}
                    <AnimatePresence initial={false}>
                      {cart.items.map(({ product: p, qty: n }) => (
                        <motion.div key={p.id} layout className="ca-cline" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
                          <img src={p.img} alt="" />
                          <div><b>{p.name}</b><span>{formatINR(p.price * n)}</span></div>
                          <div className="ca-qty sm">
                            <button onClick={() => cart.setQty(p.id, n - 1)} aria-label="Decrease"><Minus size={14} /></button>
                            <span>{n}</span>
                            <button onClick={() => cart.setQty(p.id, n + 1)} aria-label="Increase"><Plus size={14} /></button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {suggestion && (
                      <motion.button className="ca-suggest" onClick={() => setVideo(suggestion)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <span className="ca-eyebrow light">WATCH BEFORE YOU BAKE</span>
                        <span className="ca-suggest-img"><img src={suggestion.poster} alt="" /><span className="ca-play-big sm"><Play size={20} fill="#B8235A" color="#B8235A" /></span><small>{suggestion.duration}</small></span>
                        <b>{suggestion.title}</b>
                        <small>Matches the items in your cart</small>
                      </motion.button>
                    )}
                    {cart.count > 0 && (
                      <div className="ca-total">
                        <div><span>Subtotal</span><b>{formatINR(cart.subtotal)}</b></div>
                        <motion.button whileTap={{ scale: 0.97 }} className="ca-cta full">Checkout · {formatINR(cart.subtotal)}</motion.button>
                      </div>
                    )}
                  </div>
                )}

                {/* ACCOUNT */}
                {!product && !cat && tab === 'account' && (
                  <div className="ca-pad">
                    <h1 className="display ca-h">Account</h1>
                    <div className="ca-profile"><span>HB</span><div><b>Home Baker</b><small>+91 79962 22111</small></div></div>
                    <h2 className="display ca-sub">My orders</h2>
                    {[['#AST-1042', 'Pending', '₹487'], ['#AST-1031', 'Delivered', '₹1,145'], ['#AST-1019', 'Delivered', '₹318']].map(([id, s, a]) => (
                      <div key={id} className="ca-order"><Package size={18} /><div><b>{id}</b><small>{s}</small></div><b>{a}</b></div>
                    ))}
                    <Link to="/" className="ca-portals"><LogOut size={16} /> All portals / Logout</Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {!product && (
            <nav className="ca-tabs" aria-label="App navigation">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} className={tab === id && !cat ? 'on' : ''} onClick={() => { setCat(null); setTab(id); }}>
                  {tab === id && !cat && <motion.span layoutId="ca-tab" className="ca-tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  <span className="ca-tab-ico"><Icon size={21} />{id === 'cart' && cart.count > 0 && <i>{cart.count}</i>}</span>
                  <span className="ca-tab-label">{label}</span>
                </button>
              ))}
            </nav>
          )}
          <VideoSheet video={video} onClose={() => setVideo(null)} />
        </div>
      </PhoneFrame>
    </Page>
  );
}
