import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronRight, SearchX, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES, catSlug, catFromSlug } from '../data/products.js';
import './Category.css';

const PRICES = [
  { id: 'all', label: 'All Prices', test: () => true },
  { id: 'u100', label: 'Under ₹100', test: (p) => p.price < 100 },
  { id: '100-250', label: '₹100 – ₹250', test: (p) => p.price >= 100 && p.price <= 250 },
  { id: '250-500', label: '₹250 – ₹500', test: (p) => p.price > 250 && p.price <= 500 },
  { id: 'o500', label: 'Above ₹500', test: (p) => p.price > 500 },
];

function Filters({ slug, price, setPrice, stockOnly, setStockOnly, onPick }) {
  return (
    <div className="filters-container">
      <div className="filter-group">
        <h3>Categories</h3>
        <div className="filter-links-list">
          <Link
            to="/category/all"
            onClick={onPick}
            className={`filter-cat-row ${slug === 'all' ? 'active' : ''}`}
          >
            <span>All Products</span>
            <small>({PRODUCTS.length})</small>
          </Link>
          <Link
            to="/category/new-arrivals"
            onClick={onPick}
            className={`filter-cat-row ${slug === 'new-arrivals' ? 'active' : ''}`}
          >
            <span>✨ New Arrivals</span>
            <small>({PRODUCTS.filter((p) => p.isNew).length})</small>
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/category/${catSlug(c)}`}
              onClick={onPick}
              className={`filter-cat-row ${slug === catSlug(c) ? 'active' : ''}`}
            >
              <span>{c}</span>
              <small>({PRODUCTS.filter((p) => p.category === c).length})</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Price Range</h3>
        <div className="filter-options-list">
          {PRICES.map((p) => (
            <label key={p.id} className="filter-radio-label">
              <input
                type="radio"
                name="price"
                checked={price === p.id}
                onChange={() => {
                  setPrice(p.id);
                  onPick?.();
                }}
              />
              <span className="radio-custom" />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Availability</h3>
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={stockOnly}
            onChange={(e) => {
              setStockOnly(e.target.checked);
              onPick?.();
            }}
          />
          <span className="checkbox-custom">
            {stockOnly && <Check size={12} strokeWidth={3} />}
          </span>
          <span>In Stock Only</span>
        </label>
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

  useEffect(() => {
    setPrice('all');
    setStockOnly(false);
  }, [slug, q]);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
  }, [drawer]);

  const { title, list } = useMemo(() => {
    let l;
    let t;
    if (isSearch) {
      l = q
        ? PRODUCTS.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()))
        : PRODUCTS;
      t = q ? `Search Results for “${q}”` : 'All Products';
    } else if (slug === 'new-arrivals') {
      l = PRODUCTS.filter((p) => p.isNew);
      t = 'New Season Arrivals';
    } else if (slug === 'all') {
      l = PRODUCTS;
      t = 'All Baking Supplies';
    } else {
      const c = catFromSlug(slug);
      l = PRODUCTS.filter((p) => p.category === c);
      t = c || 'Baking Products';
    }

    const priceFilter = PRICES.find((p) => p.id === price)?.test || (() => true);
    l = l.filter(priceFilter).filter((p) => !stockOnly || (p.stock ?? 1) > 0);

    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price);
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price);
    if (sort === 'az') l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'new') l = [...l].sort((a, b) => Number(b.isNew) - Number(a.isNew));

    return { title: t, list: l };
  }, [isSearch, q, slug, price, stockOnly, sort]);

  const hasActiveFilters = price !== 'all' || stockOnly;
  const resetFilters = () => {
    setPrice('all');
    setStockOnly(false);
  };

  const filterProps = { slug, price, setPrice, stockOnly, setStockOnly };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="category-page"
    >
      {/* Category Banner Header */}
      <div className="cat-page-banner">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          <p className="cat-page-count">
            Showing {list.length} {list.length === 1 ? 'product' : 'products'} for your baking needs
          </p>
        </div>
      </div>

      <div className="wrap cat-page-layout">
        {/* Desktop Sidebar Filters */}
        <aside className="cat-sidebar" aria-label="Filters">
          <Filters {...filterProps} />
        </aside>

        {/* Main Products Section */}
        <section className="cat-main-content">
          {/* Top Filter & Sort Bar */}
          <div className="cat-toolbar">
            <button
              type="button"
              className="btn btn-outline cat-mobile-filter-btn"
              onClick={() => setDrawer(true)}
            >
              <SlidersHorizontal size={16} /> Filters
              {hasActiveFilters && <span className="filter-badge-dot" />}
            </button>

            <span className="cat-product-counter">
              <b>{list.length}</b> {list.length === 1 ? 'item' : 'items'} found
            </span>

            <div className="cat-sort-control">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured Items</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="new">Newest First</option>
                <option value="az">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-filters-row">
              <span className="active-filter-label">Active Filters:</span>
              {price !== 'all' && (
                <span className="filter-chip">
                  Price: {PRICES.find((p) => p.id === price)?.label}
                  <button type="button" onClick={() => setPrice('all')} aria-label="Remove price filter">
                    <X size={13} />
                  </button>
                </span>
              )}
              {stockOnly && (
                <span className="filter-chip">
                  In Stock Only
                  <button type="button" onClick={() => setStockOnly(false)} aria-label="Remove stock filter">
                    <X size={13} />
                  </button>
                </span>
              )}
              <button type="button" className="clear-all-filters-btn" onClick={resetFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {list.length === 0 ? (
            <div className="cat-empty-state">
              <SearchX size={44} className="empty-ico" />
              <h2>No matching baking tools found</h2>
              <p className="muted">
                Try loosening your filters or searching for terms like “rose mould”, “topper”, or “nozzle”.
              </p>
              <button type="button" className="btn btn-primary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="cat-product-grid">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="mob-filter-bg"
            onClick={() => setDrawer(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mob-filter-sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="mob-filter-head">
                <h3>Filter Products</h3>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setDrawer(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mob-filter-content">
                <Filters {...filterProps} onPick={() => setDrawer(false)} />
              </div>

              <div className="mob-filter-foot">
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setDrawer(false)}
                >
                  View {list.length} Products
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
