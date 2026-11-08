import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import './AddButton.css';

// ADD → turns into a − qty + stepper once the item is in the cart
export default function AddButton({ id, name, size = 'md' }) {
  const shop = useShop();
  const qty = shop.qtyOf(id);
  return (
    <div className={`addbtn ${size}`} onClick={(e) => e.preventDefault()}>
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <motion.button key="add" className="add-idle" onClick={() => shop.add(id)} aria-label={`Add ${name} to cart`}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.18 }}>
            ADD
          </motion.button>
        ) : (
          <motion.div key="step" className="add-step" role="group" aria-label={`Quantity of ${name}`}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.18 }}>
            <button onClick={() => shop.remove(id)} aria-label="Decrease"><Minus size={14} strokeWidth={3} /></button>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={qty} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.18 }}>{qty}</motion.span>
            </AnimatePresence>
            <button onClick={() => shop.add(id)} aria-label="Increase"><Plus size={14} strokeWidth={3} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
