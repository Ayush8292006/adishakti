import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, Store, ShoppingCart, ReceiptText } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import { suggestVideo } from '../data/videos.js';
import AddButton from './AddButton.jsx';
import './CartDrawer.css';

export default function CartDrawer() {
  const shop = useShop();
  const v = suggestVideo(shop.items);
  const close = () => shop.setCartOpen(false);
  const proceed = () => { if (!shop.user) shop.setLoginOpen(true); };

  return (
    <AnimatePresence>
      {shop.cartOpen && (
        <motion.div className="cd-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className="cd" aria-label="My cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}>
            <header className="cd-head">
              <h2>My Cart</h2>
              <button className="icon-btn" onClick={close} aria-label="Close cart"><X size={20} /></button>
            </header>

            <div className="cd-body">
              {shop.items.length === 0 ? (
                <div className="cd-empty">
                  <span className="cd-empty-ico"><ShoppingCart size={34} /></span>
                  <h3>Your cart is empty</h3>
                  <p className="muted">Add moulds, toppers or tools to get started.</p>
                  <button className="btn btn-pink" onClick={close}>Browse products</button>
                </div>
              ) : (
                <>
                  <div className="cd-card cd-ship">
                    <span className="cd-ship-ico"><Store size={20} /></span>
                    <div><b>Delivery in Bengaluru or store pick-up</b><small>Choose at checkout · Gandhi Bazaar store</small></div>
                  </div>

                  <div className="cd-card">
                    <AnimatePresence initial={false}>
                      {shop.items.map(({ product: p, qty }) => (
                        <motion.div key={p.id} className="cd-line" layout exit={{ opacity: 0, height: 0, marginBlock: 0, paddingBlock: 0 }}>
                          <Link to={`/product/${p.id}`} onClick={close} className="cd-img"><img src={p.img} alt="" /></Link>
                          <div className="cd-info">
                            <Link to={`/product/${p.id}`} onClick={close} className="cd-name">{p.name}</Link>
                            <small className="muted">1 {p.unit}</small>
                            <b>{formatINR(p.price * qty)}</b>
                          </div>
                          <AddButton id={p.id} name={p.name} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {v && (
                    <motion.button key={v.id} className="cd-card cd-video" onClick={() => shop.setVideo(v)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <span className="cd-vimg"><img src={v.poster} alt="" /><span><Play size={14} fill="currentColor" /></span></span>
                      <span className="cd-vtxt"><small>WATCH BEFORE YOU BAKE · {v.duration}</small><b>{v.title}</b></span>
                      <ChevronRight size={18} />
                    </motion.button>
                  )}

                  <div className="cd-card cd-bill">
                    <h3><ReceiptText size={16} /> Bill details</h3>
                    <div><span>Items total</span><span>{formatINR(shop.subtotal)}</span></div>
                    <div><span>Delivery</span><span className="muted">At checkout</span></div>
                    <div className="cd-grand"><span>Grand total</span><span>{formatINR(shop.subtotal)}</span></div>
                  </div>
                </>
              )}
            </div>

            {shop.items.length > 0 && (
              <footer className="cd-foot">
                <button className="cd-pay" onClick={proceed}>
                  <span><b>{formatINR(shop.subtotal)}</b><small>TOTAL</small></span>
                  <span className="cd-pay-cta">{shop.user ? 'Proceed to checkout' : 'Login to proceed'} <ChevronRight size={18} /></span>
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
