import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { findProduct } from '../data/products.js';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [lines, setLines] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewed, setViewed] = useState([]); // recently viewed product ids
  const [toast, setToast] = useState(null);
  const t = useRef(null);

  const change = useCallback((id, delta, notify = true) => {
    setLines((p) => {
      const next = { ...p };
      const q = (next[id] || 0) + delta;
      if (q <= 0) delete next[id]; else next[id] = q;
      return next;
    });
    if (delta > 0 && notify) {
      setToast(findProduct(id));
      clearTimeout(t.current);
      t.current = setTimeout(() => setToast(null), 2600);
    }
  }, []);

  const value = useMemo(() => {
    const items = Object.entries(lines)
      .map(([id, qty]) => ({ product: findProduct(Number(id)), qty }))
      .filter((l) => l.product && l.qty > 0);
    return {
      items,
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, l) => s + l.qty * l.product.price, 0),
      qtyOf: (id) => lines[id] || 0,
      add: (id, n = 1) => change(id, n),
      remove: (id) => change(id, -1, false),
      setQty: (id, q) => setLines((p) => { const n = { ...p }; if (q <= 0) delete n[id]; else n[id] = q; return n; }),
      cartOpen, setCartOpen,
      video, setVideo,
      user, setUser,
      loginOpen, setLoginOpen,
      viewed,
      markViewed: (id) => setViewed((v) => [id, ...v.filter((x) => x !== id)].slice(0, 12)),
      toast, closeToast: () => setToast(null),
    };
  }, [lines, cartOpen, video, user, loginOpen, viewed, toast, change]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
