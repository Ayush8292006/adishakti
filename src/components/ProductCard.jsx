import { motion } from 'framer-motion';
import { Plus, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import { formatINR, isLowStock } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

export default function ProductCard({ product, onAdded }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const p = product;

  const add = () => {
    cart.add(p.id);
    setAdded(true);
    onAdded?.(p);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      layout
      className="pcard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pcard-media">
        <img src={p.img} alt={p.name} loading="lazy" />
        <div className="pcard-badges">
          {p.isNew && <span className="pbadge new">New arrival</span>}
        </div>
        <motion.button whileTap={{ scale: 0.8 }} className={`pcard-like ${liked ? 'on' : ''}`} onClick={() => setLiked((l) => !l)} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </motion.button>
        {isLowStock(p) && <span className="pbadge low">Only {p.stock} left</span>}
        <button className="pcard-quick" onClick={add} aria-label={`Quick add ${p.name}`}>
          {added ? <><Check size={16} /> Added</> : <><Plus size={16} /> Quick add</>}
        </button>
      </div>
      <div className="pcard-body">
        <span className="pcard-cat">{p.category}</span>
        <h3>{p.name}</h3>
        {p.variants && <span className="pcard-var">{p.variants.map((v) => v.name).join(' · ')}</span>}
        <div className="pcard-foot">
          <span className="pcard-price display">{formatINR(p.price)}<small>/{p.unit}</small></span>
          <motion.button whileTap={{ scale: 0.85 }} className={`pcard-add ${added ? 'done' : ''}`} onClick={add} aria-label={`Add ${p.name} to cart`}>
            {added ? <Check size={18} /> : <Plus size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
