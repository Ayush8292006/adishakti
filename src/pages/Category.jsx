import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronRight, SearchX } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES, catSlug, catFromSlug } from '../data/products.js';
import './Category.css';

const PRICES = [
  { id: 'all', label: 'Any price', test: () => true },
  { id: 'u100', label: 'Under ₹100', test: (p) => p.price < 100 },
  { id: '100-250', label: '₹100 – ₹250', test: (p) => p.price >= 100 && p.price <= 250 },
  { id: '250-500', label: '₹250 – ₹500', test: (p) => p.price > 250 && p.price <= 500 },
  { id: 'o500', label: 'Above ₹500', test: (p) => p.price > 500 },
];

function Filters({ slug, price, setPrice, stockOnly, setStockOnly, onPick }) {
  return (
    <div className="filters">
      <div className="f-block">
        <h3>Categories</h3>
        <Link to="/category/all" onClick={onPick} className={slug === 'all' ? 'on' : ''}>All products <span>{PRODUCTS.length}</span></Link>
        <Link to="/category/new-arrivals" onClick={onPick} className={slug === 'new-arrivals' ? 'on' : ''}>New Arrivals <span>{PRODUCTS.filter((p) => p.isNew).length}</span></Link>
        {CATEGORIES.map((c) => (
          <Link key={c} to={`/category/${catSlug(c)}`} onClick={onPick} className={slug === catSlug(c) ? 'on' : ''}>{c} <span>{PRODUCTS.filter((p) => p.category === c).length}</span></Link>
        ))}
      </div>
      <div className="f-block">
        <h3>Price</h3>
        {PRICES.map((p) => (
          <label key={p.id} className="f-radio"><input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} /> {p.label}</label>
        ))}
      </div>
      <div className="f-block">
        <h3>Availability</h3>
        <label className="f-radio"><input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} /> In stock only</label>
      </div>
    </div>
  );
}

export default function Category() {
  const { slug: rawSlug } = useParams();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const isSearch = pathname === '/search';
  const slug = isSearch ? '' : rawSlug || 'all';
  const q = (params.get('q') || '').trim();
  const [sort, setSort] = useState('featured');
  const [price, setPrice] = useState('all');
  const [stockOnly, setStockOnly] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { setPrice('all'); setStockOnly(false); }, [slug, q]);
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

  const { title, list } = useMemo(() => {
    let l; let t;
    if (isSearch) { l = PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())); t = `Search: “${q}”`; }
    else if (slug === 'new-arrivals') { l = PRODUCTS.filter((p) => p.isNew); t = 'New Arrivals'; }
    else if (slug === 'all') { l = PRODUCTS; t = 'All Products'; }
    else { const c = catFromSlug(slug); l = PRODUCTS.filter((p) => p.category === c); t = c || 'Products'; }
    const pt = PRICES.find((p) => p.id === price).test;
    l = l.filter(pt).filter((p) => !stockOnly || (p.stock ?? 1) > 0);
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'az') l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'new') l = [...l].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return { title: t, list: l };
  }, [isSearch, q, slug, price, stockOnly, sort]);

  const filterProps = { slug, price, setPrice, stockOnly, setStockOnly };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="col-banner">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><span>{title}</span></nav>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{title}</motion.h1>
        </div>
      </div>

      <div className="wrap col">
        <aside className="col-side" aria-label="Filters"><Filters {...filterProps} /></aside>
        <section className="col-main">
          <div className="col-bar">
            <button className="btn btn-line col-filter-btn" onClick={() => setDrawer(true)}><SlidersHorizontal size={16} /> Filter</button>
            <span className="muted">{list.length} {list.length === 1 ? 'product' : 'products'}</span>
            <label className="col-sort"><span>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="new">Newest</option>
                <option value="low">Price, low to high</option>
                <option value="high">Price, high to low</option>
                <option value="az">Alphabetically, A–Z</option>
              </select>
            </label>
          </div>
          {list.length === 0 ? (
            <div className="col-empty"><SearchX size={40} /><h2>No products found</h2><p className="muted">Try another search or clear the filters.</p><Link to="/category/all" className="btn btn-brand">Browse all products</Link></div>
          ) : (
            <div className="pgrid four">{list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fd-bg" onClick={() => setDrawer(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside className="fd" onClick={(e) => e.stopPropagation()} initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} aria-label="Filters">
              <div className="fd-head"><h2>Filter</h2><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close filters"><X size={20} /></button></div>
              <div className="fd-body"><Filters {...filterProps} onPick={() => setDrawer(false)} /></div>
              <div className="fd-foot"><button className="btn btn-brand" onClick={() => setDrawer(false)}>Show {list.length} products</button></div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
