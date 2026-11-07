import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Play, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import { suggestVideo } from '../data/videos.js';
import './CartDrawer.css';

export default function CartDrawer() {
  const shop = useShop();
  const navigate = useNavigate();
  const suggestion = suggestVideo(shop.items);
  const close = () => shop.setCartOpen(false);

  return (
    <AnimatePresence>
      {shop.cartOpen && (
        <motion.div className="cd-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className="cd" aria-label="Shopping cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <header className="cd-head">
              <h2 className="serif">Cart <sup>{shop.count}</sup></h2>
              <button className="icon-btn" onClick={close} aria-label="Close cart"><X size={22} strokeWidth={1.5} /></button>
            </header>

            <div className="cd-body">
              {shop.items.length === 0 && (
                <div className="cd-empty">
                  <p className="serif">Your cart is empty.</p>
                  <p className="muted">Add a product and we’ll suggest a matching 2‑minute cake demo.</p>
                  <Link to="/#shop" className="btn btn-solid" onClick={close}>Start shopping</Link>
                </div>
              )}
              <AnimatePresence initial={false}>
                {shop.items.map(({ product: p, qty }) => (
                  <motion.div key={p.id} className="cd-line" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, paddingBlock: 0 }}>
                    <Link to={`/product/${p.id}`} onClick={close}><img src={p.img} alt="" /></Link>
                    <div className="cd-info">
                      <Link to={`/product/${p.id}`} onClick={close} className="cd-name">{p.name}</Link>
                      <span className="muted">{formatINR(p.price)} / {p.unit}</span>
                      <div className="qty" role="group" aria-label={`Quantity of ${p.name}`}>
                        <button onClick={() => shop.setQty(p.id, qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                        <span>{qty}</span>
                        <button onClick={() => shop.setQty(p.id, qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                      </div>
                    </div>
                    <b className="cd-total">{formatINR(p.price * qty)}</b>
                  </motion.div>
                ))}
              </AnimatePresence>

              {suggestion && (
                <motion.button key={suggestion.id} className="cd-suggest" onClick={() => shop.setVideo(suggestion)}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                  <span className="cd-suggest-img">
                    <img src={suggestion.poster} alt="" />
                    <span className="play"><Play size={16} fill="currentColor" /></span>
                  </span>
                  <span className="cd-suggest-text">
                    <span className="label">Watch before you bake</span>
                    <b className="serif">{suggestion.title}</b>
                    <small>{suggestion.duration} · uses items in your cart</small>
                  </span>
                </motion.button>
              )}
            </div>

            {shop.items.length > 0 && (
              <footer className="cd-foot">
                <div className="cd-sub"><span>Subtotal</span><b>{formatINR(shop.subtotal)}</b></div>
                <p className="muted">Delivery or store pick-up chosen at checkout.</p>
                <button className="btn btn-solid" onClick={() => { close(); navigate('/login'); }}>
                  Checkout <ArrowRight size={16} className="arrow" />
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
