import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShieldCheck } from 'lucide-react';
import AddButton from './AddButton.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

const unitLabel = (p) => (p.variants ? `${p.variants.length} options` : `1 ${p.unit}`);

const getRating = (id) => {
  const r = 4.7 + ((id % 4) * 0.1);
  const count = 14 + ((id * 7) % 55);
  return { rate: r.toFixed(1), count };
};

export default function ProductCard({ product: p, index = 0 }) {
  const shop = useShop();
  const { rate, count } = getRating(p.id);
  const mrp = Math.round(p.price * 1.25);
  const discountPercent = Math.round(((mrp - p.price) / mrp) * 100);
  const wishlisted = shop.isWishlisted(p.id);

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index % 8, 6) * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="pcard-img-wrap">
        <Link to={`/product/${p.id}`} className="pcard-img-link">
          <img src={p.img} alt={p.name} loading="lazy" />
        </Link>

        {/* Floating Badges */}
        <div className="pcard-badges">
          <span className="pcard-badge-sale">-{discountPercent}%</span>
          {p.isNew && <span className="pcard-badge-new">NEW</span>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`pcard-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            shop.toggleWishlist(p.id);
          }}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={16}
            fill={wishlisted ? '#e23e57' : 'none'}
            color={wishlisted ? '#e23e57' : '#4b5563'}
          />
        </button>

        {p.category === 'Silicone Moulds' && (
          <span className="pcard-food-safe">
            <ShieldCheck size={11} /> Food-Grade
          </span>
        )}
      </div>

      <div className="pcard-body">
        <div className="pcard-category-row">
          <span className="pcard-cat-name">{p.category}</span>
          <span className="pcard-rating">
            <Star size={11} fill="#eab308" color="#eab308" />
            <span>{rate}</span>
            <small>({count})</small>
          </span>
        </div>

        <Link to={`/product/${p.id}`} className="pcard-title" title={p.name}>
          {p.name}
        </Link>

        <span className="pcard-stock-indicator">
          {p.stock == null ? (
            <span className="stock-dot stock-tbc" />
          ) : isLowStock(p) ? (
            <span className="stock-dot stock-low" />
          ) : (
            <span className="stock-dot stock-ok" />
          )}
          {p.stock == null
            ? 'Stock TBC'
            : isLowStock(p)
            ? `Only ${p.stock} units left`
            : 'In Stock'}
          <span className="pcard-dot-sep">•</span>
          <span className="pcard-unit-txt">{unitLabel(p)}</span>
        </span>

        <div className="pcard-foot">
          <div className="pcard-price-box">
            <div className="pcard-prices">
              <span className="pcard-price">{formatINR(p.price)}</span>
              <span className="pcard-mrp">{formatINR(mrp)}</span>
            </div>
            <span className="pcard-save-txt">Save {formatINR(mrp - p.price)}</span>
          </div>

          <div className="pcard-action">
            <AddButton id={p.id} name={p.name} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
