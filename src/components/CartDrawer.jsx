import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, ChevronRight, Store, ShoppingBag, ReceiptText,
  Sparkles, MessageCircle, Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import { suggestVideo } from '../data/videos.js';
import AddButton from './AddButton.jsx';
import './CartDrawer.css';

const FREE_SHIP_THRESHOLD = 1499;

export default function CartDrawer() {
  const shop = useShop();
  const v = suggestVideo(shop.items);
  const close = () => shop.setCartOpen(false);
  const proceed = () => {
    if (!shop.user) shop.setLoginOpen(true);
  };

  const amountNeeded = Math.max(0, FREE_SHIP_THRESHOLD - shop.subtotal);
  const progressPercent = Math.min(100, (shop.subtotal / FREE_SHIP_THRESHOLD) * 100);

  // Generate WhatsApp order message
  const generateWhatsAppOrder = () => {
    const lines = shop.items.map(
      ({ product: p, qty }) => `• ${p.name} (Qty: ${qty}) - ${formatINR(p.price * qty)}`
    );
    const text = `Hi The Baking Tools! I would like to place an order from your online store:\n\n${lines.join(
      '\n'
    )}\n\n*Total Order Amount:* ${formatINR(shop.subtotal)}\n\nPlease confirm availability and delivery dispatch.`;
    return `https://wa.me/917996222111?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {shop.cartOpen && (
        <motion.div
          className="cd-bg"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="cd"
            aria-label="My Shopping Bag"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <header className="cd-head">
              <div className="cd-head-title">
                <ShoppingBag size={20} className="cd-bag-ico" />
                <h2>My Shopping Bag</h2>
                <span className="cd-head-badge">
                  {shop.count} {shop.count === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button className="icon-btn" onClick={close} aria-label="Close cart">
                <X size={20} />
              </button>
            </header>

            {/* Free Shipping Progress Meter */}
            {shop.items.length > 0 && (
              <div className="cd-meter-box">
                <div className="cd-meter-txt">
                  <Truck size={15} className="cd-meter-ico" />
                  {amountNeeded > 0 ? (
                    <span>
                      Add <b>{formatINR(amountNeeded)}</b> more for <strong>FREE PAN-India Delivery</strong>!
                    </span>
                  ) : (
                    <span className="cd-meter-free">
                      🎉 <strong>You unlocked FREE PAN-India Delivery!</strong>
                    </span>
                  )}
                </div>
                <div className="cd-meter-bar">
                  <div
                    className="cd-meter-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="cd-body">
              {shop.items.length === 0 ? (
                <div className="cd-empty">
                  <span className="cd-empty-ico">
                    <ShoppingBag size={38} />
                  </span>
                  <h3>Your shopping bag is empty</h3>
                  <p className="muted">
                    Explore our collection of silicone cake moulds, acrylic toppers, nozzles, and bakery packaging supplies.
                  </p>
                  <button className="btn btn-primary" onClick={close}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="cd-card cd-ship">
                    <span className="cd-ship-ico">
                      <Truck size={18} />
                    </span>
                    <div>
                      <b>Pan-India Delivery &amp; Bangalore Store Pickup</b>
                      <small>Dispatched from Gandhi Bazaar hub</small>
                    </div>
                  </div>

                  <div className="cd-card cd-items-card">
                    <AnimatePresence initial={false}>
                      {shop.items.map(({ product: p, qty }) => (
                        <motion.div
                          key={p.id}
                          className="cd-line"
                          layout
                          exit={{
                            opacity: 0,
                            height: 0,
                            marginBlock: 0,
                            paddingBlock: 0,
                          }}
                        >
                          <Link
                            to={`/product/${p.id}`}
                            onClick={close}
                            className="cd-img"
                          >
                            <img src={p.img} alt="" />
                          </Link>
                          <div className="cd-info">
                            <Link
                              to={`/product/${p.id}`}
                              onClick={close}
                              className="cd-name"
                            >
                              {p.name}
                            </Link>
                            <small className="muted">
                              {p.variants ? `${p.variants.length} options` : `1 ${p.unit}`} · {formatINR(p.price)}
                            </small>
                            <b className="cd-price">{formatINR(p.price * qty)}</b>
                          </div>
                          <AddButton id={p.id} name={p.name} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {v && (
                    <motion.button
                      key={v.id}
                      className="cd-card cd-video"
                      onClick={() => shop.setVideo(v)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="cd-vimg">
                        <img src={v.poster} alt="" />
                        <span>
                          <Play size={14} fill="currentColor" />
                        </span>
                      </span>
                      <span className="cd-vtxt">
                        <small>WATCH HOW TO USE · {v.duration}</small>
                        <b>{v.title}</b>
                      </span>
                      <ChevronRight size={18} />
                    </motion.button>
                  )}

                  <div className="cd-card cd-bill">
                    <h3>
                      <ReceiptText size={16} /> Order Summary
                    </h3>
                    <div className="cd-bill-row">
                      <span>Items Subtotal</span>
                      <b>{formatINR(shop.subtotal)}</b>
                    </div>
                    <div className="cd-bill-row">
                      <span>Delivery Fee</span>
                      <span className="cd-ship-fee">
                        {amountNeeded === 0 ? (
                          <strong style={{ color: 'var(--accent-green)' }}>FREE</strong>
                        ) : (
                          '₹50 (Free over ₹1,499)'
                        )}
                      </span>
                    </div>
                    <div className="cd-grand">
                      <span>Estimated Total</span>
                      <span>{formatINR(shop.subtotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {shop.items.length > 0 && (
              <footer className="cd-foot">
                {/* Instant WhatsApp Checkout Button */}
                <a
                  href={generateWhatsAppOrder()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp cd-wa-btn"
                >
                  <MessageCircle size={18} />
                  <span>Order Directly via WhatsApp</span>
                </a>

                <button className="cd-pay" onClick={proceed}>
                  <span>
                    <b>{formatINR(shop.subtotal)}</b>
                    <small>TOTAL</small>
                  </span>
                  <span className="cd-pay-cta">
                    {shop.user ? 'Proceed to Checkout' : 'Sign in to Checkout'}{' '}
                    <ChevronRight size={18} />
                  </span>
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
