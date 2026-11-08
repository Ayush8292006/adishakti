import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { findProduct } from '../data/products.js';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [lines, setLines] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const t = useRef(null);

  const change = useCallback((id, delta) => {
    setLines((p) => {
      const next = { ...p };
      const q = (next[id] || 0) + delta;
      if (q <= 0) delete next[id]; else next[id] = q;
      return next;
    });
    if (delta > 0) { clearTimeout(t.current); setBump((b) => b + 1); }
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
      remove: (id) => change(id, -1),
      setQty: (id, q) => setLines((p) => { const n = { ...p }; if (q <= 0) delete n[id]; else n[id] = q; return n; }),
      bump,
      cartOpen, setCartOpen,
      video, setVideo,
      user, setUser,
      loginOpen, setLoginOpen,
    };
  }, [lines, cartOpen, video, user, loginOpen, bump, change]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
