import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

export default function ProductCard({ product: p, index = 0 }) {
  const shop = useShop();
  const [added, setAdded] = useState(false);
  const add = () => {
    shop.add(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <motion.article className="pc" layout
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}>
      <div className="pc-media">
        <Link to={`/product/${p.id}`} tabIndex={-1} aria-hidden="true">
          <img src={p.img} alt="" loading="lazy" />
        </Link>
        <div className="pc-tags">
          {p.isNew && <span>New</span>}
          {isLowStock(p) && <span className="low">Few left</span>}
        </div>
        <button className={`pc-add ${added ? 'done' : ''}`} onClick={add} aria-label={`Add ${p.name} to cart`}>
          {added ? <Check size={16} /> : <Plus size={16} />}
          <span className="pc-add-text">{added ? 'Added' : 'Add to cart'}</span>
        </button>
      </div>
      <Link to={`/product/${p.id}`} className="pc-info">
        <span className="pc-cat">{p.category}</span>
        <h3>{p.name}</h3>
        <span className="pc-price">{formatINR(p.price)} <small>/ {p.unit}</small></span>
      </Link>
    </motion.article>
  );
}
