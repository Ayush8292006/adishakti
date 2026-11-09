import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import './AddButton.css';

// "Add to cart" → turns into a − qty + stepper once the item is in the cart
export default function AddButton({ id, name, size = 'md', disabled = false }) {
  const shop = useShop();
  const qty = shop.qtyOf(id);
  return (
    <div className={`addbtn ${size}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <motion.button key="add" className="add-idle" onClick={() => shop.add(id)} disabled={disabled} aria-label={`Add ${name} to cart`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <ShoppingBag size={size === 'lg' ? 18 : 15} /> {disabled ? 'Sold out' : 'Add to cart'}
          </motion.button>
        ) : (
          <motion.div key="step" className="add-step" role="group" aria-label={`Quantity of ${name}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <button onClick={() => shop.remove(id)} aria-label="Decrease"><Minus size={15} /></button>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={qty} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.15 }}>{qty}</motion.span>
            </AnimatePresence>
            <button onClick={() => shop.add(id)} aria-label="Increase"><Plus size={15} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
