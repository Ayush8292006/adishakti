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
    if (!el) return;
    setEdge({
      start: el.scrollLeft < 10,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 10,
    });
  };

  useEffect(() => {
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [products]);

  const go = (dir) => {
    if (!track.current) return;
    track.current.scrollBy({
      left: dir * track.current.clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  return (
    <section className="rail wrap">
      <div className="rail-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="rail-sub">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="see-all">
            <span>Explore all</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <div className="rail-box">
        {!edge.start && (
          <button
            className="rail-arrow left"
            onClick={() => go(-1)}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="rail-track" ref={track} onScroll={check}>
          {products.map((p, i) => (
            <div className="rail-item" key={p.id}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>

        {!edge.end && (
          <button
            className="rail-arrow right"
            onClick={() => go(1)}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </section>
  );
}
