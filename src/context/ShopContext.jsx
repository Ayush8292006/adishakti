import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { findProduct } from '../data/products.js';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [lines, setLines] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const t = useRef(null);

  const notify = useCallback((product) => {
    setToast(product);
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const value = useMemo(() => {
    const items = Object.entries(lines)
      .map(([id, qty]) => ({ product: findProduct(Number(id)), qty }))
      .filter((l) => l.product && l.qty > 0);
    return {
      items,
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, l) => s + l.qty * l.product.price, 0),
      add: (id, n = 1) => {
        setLines((p) => ({ ...p, [id]: (p[id] || 0) + n }));
        notify(findProduct(id));
      },
      setQty: (id, qty) => setLines((p) => {
        const next = { ...p };
        if (qty <= 0) delete next[id]; else next[id] = qty;
        return next;
      }),
      cartOpen, setCartOpen,
      video, setVideo,
      toast,
      user, setUser,
    };
  }, [lines, cartOpen, video, toast, user, notify]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
