import { createContext, useContext, useMemo, useState } from 'react';
import { findProduct } from '../data/products.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // { [productId]: qty }
  const [lines, setLines] = useState({ 26: 1, 38: 2 });

  const api = useMemo(() => {
    const items = Object.entries(lines)
      .map(([id, qty]) => ({ product: findProduct(Number(id)), qty }))
      .filter((l) => l.product && l.qty > 0);
    const count = items.reduce((s, l) => s + l.qty, 0);
    const subtotal = items.reduce((s, l) => s + l.qty * l.product.price, 0);
    return {
      items, count, subtotal,
      add: (id, n = 1) => setLines((prev) => ({ ...prev, [id]: (prev[id] || 0) + n })),
      setQty: (id, qty) => setLines((prev) => {
        const next = { ...prev };
        if (qty <= 0) delete next[id]; else next[id] = qty;
        return next;
      }),
      clear: () => setLines({}),
    };
  }, [lines]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
