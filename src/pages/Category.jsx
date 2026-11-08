import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES, CAT_IMG, catSlug, catFromSlug } from '../data/products.js';
import './Category.css';

const SIDE = [
  { slug: 'all', label: 'All products', img: '/products/hb-coin.jpg' },
  { slug: 'new-arrivals', label: 'New Arrivals', img: '/products/plunger-cutter.jpg' },
  ...CATEGORIES.map((c) => ({ slug: catSlug(c), label: c, img: CAT_IMG[c] })),
];

export default function Category() {
  const { slug = 'all' } = useParams();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const isSearch = pathname === '/search';
  const q = (params.get('q') || '').trim();
  const [sort, setSort] = useState('relevance');

  const { title, list } = useMemo(() => {
    let l; let t;
    if (isSearch) { l = q ? PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())) : PRODUCTS; t = q ? `Results for “${q}”` : 'All products'; }
    else if (slug === 'new-arrivals') { l = PRODUCTS.filter((p) => p.isNew); t = 'New Arrivals'; }
    else if (slug === 'all') { l = PRODUCTS; t = 'All products'; }
    else { const c = catFromSlug(slug); l = PRODUCTS.filter((p) => p.category === c); t = c || 'Products'; }
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'az') l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return { title: t, list: l };
  }, [isSearch, q, slug, sort]);

  const active = isSearch ? '' : slug;

  return (
    <motion.main className="catpage wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <aside className="side" aria-label="Categories">
        {SIDE.map((s) => (
          <Link key={s.slug} to={s.slug === 'all' ? '/category/all' : `/category/${s.slug}`} className={`side-item ${active === s.slug ? 'on' : ''}`}>
            <span className="side-img"><img src={s.img} alt="" /></span>
            <span className="side-label">{s.label}</span>
            {active === s.slug && <motion.span layoutId="side-bar" className="side-bar" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          </Link>
        ))}
      </aside>

      <section className="cat-main">
        <div className="cat-top">
          <div>
            <h1>{title}</h1>
            <span className="muted">{list.length} {list.length === 1 ? 'item' : 'items'}</span>
          </div>
          <label className="sort"><span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Sort: Relevance</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="az">Name: A to Z</option>
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <div className="cat-empty">
            <SearchX size={40} />
            <h2>No products found</h2>
            <p className="muted">Try “mould”, “topper”, “nozzle” or “base”.</p>
            <Link to="/category/all" className="btn btn-pink">See all products</Link>
          </div>
        ) : (
          <motion.div layout className="cat-grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </motion.main>
  );
}
