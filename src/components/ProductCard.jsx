import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddButton from './AddButton.jsx';
import { formatINR, isLowStock } from '../data/products.js';
import './ProductCard.css';

const unitLabel = (p) => (p.variants ? `${p.variants.length} options` : `1 ${p.unit}`);

export default function ProductCard({ product: p, index = 0 }) {
  return (
    <motion.article className="pcard"
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}>
      <Link to={`/product/${p.id}`} className="pcard-img">
        <img src={p.img} alt={p.name} loading="lazy" />
        {p.isNew && <span className="pcard-new">NEW</span>}
      </Link>
      <div className="pcard-body">
        <span className={`pcard-stock ${isLowStock(p) ? 'low' : ''}`}>
          {p.stock == null ? 'Stock TBC' : isLowStock(p) ? `Only ${p.stock} left` : 'In stock'}
        </span>
        <Link to={`/product/${p.id}`} className="pcard-name">{p.name}</Link>
        <span className="pcard-unit">{unitLabel(p)}</span>
        <div className="pcard-foot">
          <span className="pcard-price">{formatINR(p.price)}</span>
          <AddButton id={p.id} name={p.name} />
        </div>
      </div>
    </motion.article>
  );
}
