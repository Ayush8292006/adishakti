import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';
import AddButton from './AddButton.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

const unitLabel = (p) => (p.variants ? `${p.variants.length} options` : `1 ${p.unit}`);

// Fake consistent rating derived from product id
const getRating = (id) => {
  const r = 4.7 + ((id % 4) * 0.1);
  const count = 18 + ((id * 7) % 65);
  return { rate: r.toFixed(1), count };
};

export default function ProductCard({ product: p, index = 0 }) {
  const { rate, count } = getRating(p.id);
  const mrp = Math.round(p.price * 1.25);

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index % 6, 5) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link to={`/product/${p.id}`} className="pcard-img">
        <img src={p.img} alt={p.name} loading="lazy" />
        
        {/* Floating Badges */}
        <div className="pcard-badges">
          {p.isNew && <span className="pcard-badge new">NEW ARRIVAL</span>}
          {p.category === 'Silicone Moulds' && (
            <span className="pcard-badge food-grade" title="100% Food-Grade Certified Silicone">
              <ShieldCheck size={11} /> Food-Safe
            </span>
          )}
        </div>

        {/* Quick Discount Tag */}
        <span className="pcard-save">SAVE 20%</span>
      </Link>

      <div className="pcard-body">
        <div className="pcard-meta">
          <span className={`pcard-stock ${isLowStock(p) ? 'low' : ''}`}>
            {p.stock == null ? 'Stock TBC' : isLowStock(p) ? `Only ${p.stock} left` : 'In stock'}
          </span>
          <span className="pcard-rating">
            <Star size={11} fill="#eab308" color="#eab308" />
            <span>{rate}</span>
            <small>({count})</small>
          </span>
        </div>

        <Link to={`/product/${p.id}`} className="pcard-name" title={p.name}>
          {p.name}
        </Link>

        <span className="pcard-unit">{unitLabel(p)} · {p.category}</span>

        <div className="pcard-foot">
          <div className="pcard-pricing">
            <span className="pcard-price">{formatINR(p.price)}</span>
            <span className="pcard-mrp">{formatINR(mrp)}</span>
          </div>
          <AddButton id={p.id} name={p.name} />
        </div>
      </div>
    </motion.article>
  );
}
