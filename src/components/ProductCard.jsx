import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import AddButton from './AddButton.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

// Store-style product card: square image on a soft grey tile, badge top-left,
// centered 2-line title, centered bold price, add-to-cart button.
// Prices are the prototype's sample prices — no invented MRP / discount.
export default function ProductCard({ product: p, index = 0 }) {
  const shop = useShop();
  const wished = shop.isWishlisted(p.id);
  const soldOut = p.stock === 0;

  let badge = null;
  if (soldOut) badge = <span className="pc-badge sold">Sold out</span>;
  else if (p.isNew) badge = <span className="pc-badge new">New</span>;
  else if (isLowStock(p)) badge = <span className="pc-badge low">Few left</span>;

  return (
    <motion.article
      className="pc"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay: Math.min(index % 6, 5) * 0.04 }}
    >
      <div className="pc-img">
        <Link to={`/product/${p.id}`} aria-label={p.name}>
          <img src={p.img} alt={p.name} loading="lazy" />
        </Link>
        {badge}
        <button
          type="button"
          className={`pc-wish ${wished ? 'on' : ''}`}
          onClick={() => shop.toggleWishlist(p.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={wished ? '#e22120' : 'none'} color={wished ? '#e22120' : '#444'} />
        </button>
        {p.variants && <span className="pc-opts">{p.variants.length} options</span>}
      </div>

      <div className="pc-body">
        <Link to={`/product/${p.id}`} className="pc-title" title={p.name}>{p.name}</Link>
        {p.variants && (
          <div className="pc-swatches" aria-label="Available options">
            {p.variants.map((v) => (
              <span key={v.name} className="pc-sw" title={v.name} style={{ background: SWATCH[v.name] || '#ccc' }} />
            ))}
          </div>
        )}
        <div className="pc-price">
          {p.variants && <span className="pc-from">From </span>}
          {formatINR(p.price)}
        </div>
        <div className="pc-cta">
          <AddButton id={p.id} name={p.name} size="sm" disabled={soldOut} />
        </div>
      </div>
    </motion.article>
  );
}

const SWATCH = { Gold: '#d4a64a', Silver: '#c0c0c0', Red: '#d32f2f', White: '#f5f5f5', Black: '#222', Pink: '#f48fb1', Blue: '#64b5f6' };
