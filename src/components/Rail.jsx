import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import './Rail.css';

// Horizontal product row with arrow buttons (desktop) and swipe (mobile)
export default function Rail({ title, products, to }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const check = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check); }, []);
  const go = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="rail wrap">
      <div className="rail-head">
        <h2>{title}</h2>
        {to && <Link to={to} className="see-all">see all</Link>}
      </div>
      <div className="rail-box">
        {!edge.start && <button className="rail-arrow left" onClick={() => go(-1)} aria-label={`Scroll ${title} left`}><ChevronLeft size={20} /></button>}
        <div className="rail-track" ref={track} onScroll={check}>
          {products.map((p, i) => <div className="rail-item" key={p.id}><ProductCard product={p} index={i} /></div>)}
        </div>
        {!edge.end && <button className="rail-arrow right" onClick={() => go(1)} aria-label={`Scroll ${title} right`}><ChevronRight size={20} /></button>}
      </div>
    </section>
  );
}
