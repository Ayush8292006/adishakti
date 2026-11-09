import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import './Rail.css';

export default function Rail({ title, subtitle, products, to }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const check = () => {
    const el = track.current;
    if (el) {
      setEdge({
        start: el.scrollLeft < 10,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 10,
      });
    }
  };

  useEffect(() => {
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [products]);

  const go = (d) => {
    if (track.current) {
      track.current.scrollBy({
        left: d * track.current.clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  if (!products || !products.length) return null;

  return (
    <section className="wrap rail-section">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="rail-controls">
          {to && (
            <Link to={to} className="section-view-all">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          )}
          <button
            type="button"
            className="rail-nav-btn"
            onClick={() => go(-1)}
            disabled={edge.start}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="rail-nav-btn"
            onClick={() => go(1)}
            disabled={edge.end}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="rail-track" ref={track} onScroll={check}>
        {products.map((p, i) => (
          <div className="rail-card-col" key={p.id}>
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
