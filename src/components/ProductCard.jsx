import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import AddButton from './AddButton.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

export default function ProductCard({ product: p, index = 0 }) {
  const soldOut = p.stock === 0;
  return (
    <motion.article className="pc"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}>
      <div className="pc-media">
        <Link to={`/product/${p.id}`} aria-label={p.name} tabIndex={-1}><img src={p.img} alt="" loading="lazy" /></Link>
        <div className="pc-badges">
          {p.isNew && <span className="b-new">New</span>}
          {soldOut ? <span className="b-out">Sold out</span> : isLowStock(p) && <span className="b-low">Only {p.stock} left</span>}
        </div>
        <Link to={`/product/${p.id}`} className="pc-quick" aria-label={`View ${p.name}`}><Eye size={16} /> Quick view</Link>
      </div>
      <div className="pc-body">
        <span className="pc-cat">{p.category}</span>
        <Link to={`/product/${p.id}`} className="pc-title">{p.name}</Link>
        <div className="pc-price">
          {p.variants ? <span>From <b>{formatINR(p.price)}</b></span> : <b>{formatINR(p.price)}</b>}
          {p.variants && <small>{p.variants.length} options</small>}
        </div>
        {p.variants ? (
          <Link to={`/product/${p.id}`} className="pc-choose">Choose options</Link>
        ) : (
          <AddButton id={p.id} name={p.name} disabled={soldOut} />
        )}
      </div>
    </motion.article>
  );
}
