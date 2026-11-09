import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR } from '../data/products.js';
import AddButton from './AddButton.jsx';
import './WishlistDrawer.css';

export default function WishlistDrawer() {
  const shop = useShop();
  const close = () => shop.setWishlistOpen(false);

  return (
    <AnimatePresence>
      {shop.wishlistOpen && (
        <motion.div
          className="wd-bg"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="wd"
            aria-label="My Wishlist"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <header className="wd-head">
              <div className="wd-head-title">
                <Heart size={20} className="wd-heart-ico" fill="#e23e57" color="#e23e57" />
                <h2>My Wishlist</h2>
                <span className="wd-count">({shop.wishlistCount})</span>
              </div>
              <button className="icon-btn" onClick={close} aria-label="Close wishlist">
                <X size={20} />
              </button>
            </header>

            <div className="wd-body">
              {shop.wishlistItems.length === 0 ? (
                <div className="wd-empty">
                  <span className="wd-empty-ico">
                    <Heart size={38} />
                  </span>
                  <h3>Your wishlist is empty</h3>
                  <p className="muted">
                    Save cake moulds, toppers, and tools you love by clicking the heart icon on any product.
                  </p>
                  <button className="btn btn-primary" onClick={close}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="wd-list">
                  {shop.wishlistItems.map((p) => (
                    <div key={p.id} className="wd-item">
                      <Link to={`/product/${p.id}`} onClick={close} className="wd-item-img">
                        <img src={p.img} alt={p.name} />
                      </Link>
                      <div className="wd-item-info">
                        <Link to={`/product/${p.id}`} onClick={close} className="wd-item-title">
                          {p.name}
                        </Link>
                        <span className="wd-item-cat">{p.category}</span>
                        <div className="wd-item-pricing">
                          <span className="wd-item-price">{formatINR(p.price)}</span>
                          <span className="wd-item-mrp">{formatINR(Math.round(p.price * 1.25))}</span>
                        </div>
                      </div>
                      <div className="wd-item-actions">
                        <button
                          className="wd-item-remove"
                          onClick={() => shop.toggleWishlist(p.id)}
                          title="Remove from wishlist"
                          aria-label="Remove"
                        >
                          <X size={16} />
                        </button>
                        <AddButton id={p.id} name={p.name} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {shop.wishlistItems.length > 0 && (
              <footer className="wd-foot">
                <button
                  className="btn btn-primary wd-view-cart-btn"
                  onClick={() => {
                    close();
                    shop.setCartOpen(true);
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Go to Shopping Bag ({shop.count})</span>
                  <ArrowRight size={16} />
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

