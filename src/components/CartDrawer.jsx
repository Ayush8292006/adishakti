import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShoppingBag, Minus, Plus, Trash2, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import { suggestVideo } from '../data/videos.js';
import './CartDrawer.css';

export default function CartDrawer() {
  const shop = useShop();
  const v = suggestVideo(shop.items);
  const close = () => shop.setCartOpen(false);
  const checkout = () => { if (!shop.user) shop.setLoginOpen(true); };

  return (
    <AnimatePresence>
      {shop.cartOpen && (
        <motion.div className="cd-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className="cd" aria-label="Your cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }}>
            <header className="cd-head">
              <h2>Your cart <span>({shop.count})</span></h2>
              <button className="icon-btn" onClick={close} aria-label="Close cart"><X size={22} /></button>
            </header>

            {shop.items.length === 0 ? (
              <div className="cd-empty">
                <span><ShoppingBag size={34} /></span>
                <h3>Your cart is empty</h3>
                <p className="muted">Looks like you haven’t added anything yet.</p>
                <Link to="/category/all" className="btn btn-brand" onClick={close}>Continue shopping</Link>
              </div>
            ) : (
              <>
                <div className="cd-body">
                  <AnimatePresence initial={false}>
                    {shop.items.map(({ product: p, qty }) => (
                      <motion.div key={p.id} className="cd-line" layout exit={{ opacity: 0, height: 0, paddingBlock: 0 }}>
                        <Link to={`/product/${p.id}`} onClick={close} className="cd-img"><img src={p.img} alt="" /></Link>
                        <div className="cd-info">
                          <Link to={`/product/${p.id}`} onClick={close} className="cd-name">{p.name}</Link>
                          <span className="muted">{formatINR(p.price)} / {p.unit}</span>
                          <div className="cd-actions">
                            <div className="cd-qty" role="group" aria-label={`Quantity of ${p.name}`}>
                              <button onClick={() => shop.remove(p.id)} aria-label="Decrease"><Minus size={14} /></button>
                              <span>{qty}</span>
                              <button onClick={() => shop.setQty(p.id, qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                            </div>
                            <button className="cd-del" onClick={() => shop.setQty(p.id, 0)} aria-label={`Remove ${p.name}`}><Trash2 size={15} /></button>
                          </div>
                        </div>
                        <b className="cd-total">{formatINR(p.price * qty)}</b>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {v && (
                    <button className="cd-video" onClick={() => shop.setVideo(v)}>
                      <span className="cd-vimg"><img src={v.poster} alt="" /><Play size={16} fill="currentColor" /></span>
                      <span><small>Watch before you bake · {v.duration}</small><b>{v.title}</b></span>
                    </button>
                  )}
                </div>
                <footer className="cd-foot">
                  <div className="cd-sub"><span>Subtotal</span><b>{formatINR(shop.subtotal)}</b></div>
                  <p className="muted">Delivery or store pick-up is chosen at checkout.</p>
                  <button className="btn btn-brand cd-checkout" onClick={checkout}><Lock size={16} /> {shop.user ? 'Checkout' : 'Login to checkout'}</button>
                  <button className="cd-continue" onClick={close}>Continue shopping</button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
