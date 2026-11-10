import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import './Rail.css';

// Horizontal product carousel with grey circular side arrows.
export function Carousel({ items, render, label = 'items' }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const check = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0;
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [items]);

  const go = (d) => track.current && track.current.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div className="car">
      <button type="button" className="car-arrow prev" onClick={() => go(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><ChevronLeft size={16} /></button>
      <div className="car-track" ref={track} onScroll={check}>
        {items.map((it, i) => <div key={it.id ?? i}>{render(it, i)}</div>)}
      </div>
      <button type="button" className="car-arrow next" onClick={() => go(1)} disabled={edge.end} aria-label={`Next ${label}`}><ChevronRight size={16} /></button>
    </div>
  );
}

// Section: title (centered, or left with pill tabs), carousel, VIEW ALL.
export default function Rail({ title, products, to, tabs, activeTab, onTab, centered = false, id }) {
  if (!products || !products.length) return null;
  const pills = tabs && (
    <div className="pill-tabs">
      {tabs.map((t) => (
        <button key={t.key} type="button" className={`pill-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => onTab(t.key)}>{t.label}</button>
      ))}
    </div>
  );
  return (
    <section className="sec" id={id}>
      <div className="wrap">
        {centered || !tabs ? (
          <>
            <h2 className="sec-title">{title}</h2>
            {pills && <div className="rail-pills-center">{pills}</div>}
          </>
        ) : (
          <div className="sec-head-row"><h2 className="sec-title">{title}</h2>{pills}</div>
        )}
        <Carousel items={products} label={title} render={(p, i) => <ProductCard product={p} index={i} />} />
        {to && <div className="view-all-row"><Link to={to} className="btn-viewall">View all</Link></div>}
      </div>
    </section>
  );
}
