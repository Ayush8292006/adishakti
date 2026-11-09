import { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { findProduct } from '../data/products.js';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      const saved = localStorage.getItem('tbt_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('tbt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [viewed, setViewed] = useState([]);
  const [toast, setToast] = useState(null);
  const t = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('tbt_cart', JSON.stringify(lines));
    } catch {}
  }, [lines]);

  useEffect(() => {
    try {
      localStorage.setItem('tbt_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

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

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  }, []);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  const value = useMemo(() => {
    const items = Object.entries(lines)
      .map(([id, qty]) => ({ product: findProduct(Number(id)), qty }))
      .filter((l) => l.product && l.qty > 0);

    const wishlistItems = wishlist
      .map((id) => findProduct(Number(id)))
      .filter(Boolean);

    return {
      items,
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, l) => s + l.qty * l.product.price, 0),
      qtyOf: (id) => lines[id] || 0,
      add: (id, n = 1) => change(id, n),
      remove: (id) => change(id, -1, false),
      setQty: (id, q) => setLines((p) => { const n = { ...p }; if (q <= 0) delete n[id]; else n[id] = q; return n; }),
      cartOpen, setCartOpen,
      wishlist,
      wishlistItems,
      wishlistCount: wishlist.length,
      wishlistOpen, setWishlistOpen,
      toggleWishlist,
      isWishlisted,
      video, setVideo,
      user, setUser,
      loginOpen, setLoginOpen,
      viewed,
      markViewed: (id) => setViewed((v) => [id, ...v.filter((x) => x !== id)].slice(0, 12)),
      toast, closeToast: () => setToast(null),
    };
  }, [lines, wishlist, cartOpen, wishlistOpen, video, user, loginOpen, viewed, toast, change, toggleWishlist, isWishlisted]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
