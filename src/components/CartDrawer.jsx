import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ChevronRight, ShoppingCart, Trash2, MessageCircle, Minus, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import { suggestVideo } from '../data/videos.js';
import './CartDrawer.css';

export default function CartDrawer() {
  const shop = useShop();
  const v = suggestVideo(shop.items);
  const close = () => shop.setCartOpen(false);
  const checkout = () => { if (!shop.user) shop.setLoginOpen(true); };

  const waOrder = () => {
    const lines = shop.items.map(({ product: p, qty }) => `• ${p.name} × ${qty} — ${formatINR(p.price * qty)}`);
    const text = `Hi Adi Shakti Trader! I'd like to order:\n\n${lines.join('\n')}\n\nSubtotal: ${formatINR(shop.subtotal)}\n\nPlease confirm availability.`;
    return `https://wa.me/917996222111?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {shop.cartOpen && (
        <motion.div className="cd-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.aside className="cd" aria-label="Your cart" onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
            <header className="cd-head">
              <h2>Your Cart <span>({shop.count})</span></h2>
              <button className="icon-btn" onClick={close} aria-label="Close cart"><X size={22} /></button>
            </header>

            <div className="cd-body">
              {shop.items.length === 0 ? (
                <div className="cd-empty">
                  <ShoppingCart size={48} strokeWidth={1.4} />
                  <h3>Your cart is empty</h3>
                  <button className="btn btn-primary" onClick={close}>Continue shopping</button>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {shop.items.map(({ product: p, qty }) => (
                      <motion.div key={p.id} className="cd-line" layout exit={{ opacity: 0, height: 0, paddingBlock: 0 }}>
                        <Link to={`/product/${p.id}`} onClick={close} className="cd-img"><img src={p.img} alt="" /></Link>
                        <div className="cd-info">
                          <Link to={`/product/${p.id}`} onClick={close} className="cd-name">{p.name}</Link>
                          <span className="cd-unit">{formatINR(p.price)}</span>
                          <div className="cd-row">
                            <div className="cd-qty" role="group" aria-label={`Quantity of ${p.name}`}>
                              <button onClick={() => shop.remove(p.id)} aria-label="Decrease"><Minus size={14} /></button>
                              <span>{qty}</span>
                              <button onClick={() => shop.add(p.id, 1)} aria-label="Increase"><Plus size={14} /></button>
                            </div>
                            <button className="cd-del" onClick={() => shop.setQty(p.id, 0)} aria-label={`Remove ${p.name}`}><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <b className="cd-total">{formatINR(p.price * qty)}</b>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {v && (
                    <button className="cd-video" onClick={() => shop.setVideo(v)}>
                      <span className="cd-vimg"><img src={v.poster} alt="" /><span><Play size={13} fill="currentColor" /></span></span>
                      <span className="cd-vtxt"><small>Watch how to use · {v.duration}</small><b>{v.title}</b></span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </>
              )}
            </div>

            {shop.items.length > 0 && (
              <footer className="cd-foot">
                <div className="cd-sub"><span>Subtotal</span><b>{formatINR(shop.subtotal)}</b></div>
                <p className="cd-note">Delivery charges confirmed at checkout.</p>
                <button className="cd-checkout" onClick={checkout}>{shop.user ? 'Checkout' : 'Login to checkout'}</button>
                <a href={waOrder()} target="_blank" rel="noopener noreferrer" className="cd-wa"><MessageCircle size={17} /> Order on WhatsApp</a>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
