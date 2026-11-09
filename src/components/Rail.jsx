import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import './Rail.css';

// Horizontal product carousel with arrows (desktop) and swipe (mobile)
export default function Rail({ title, products, to }) {
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const check = () => {
    const el = track.current;
    if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check); }, [products.length]);
  const go = (d) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' });
  if (!products.length) return null;
  return (
    <section className="wrap sec rail">
      <div className="sec-head-row">
        <h2>{title}</h2>
        <div className="rail-ctrl">
          {to && <Link to={to} className="view-all">View all</Link>}
          <button className="rail-btn" onClick={() => go(-1)} disabled={edge.start} aria-label={`Scroll ${title} left`}><ChevronLeft size={18} /></button>
          <button className="rail-btn" onClick={() => go(1)} disabled={edge.end} aria-label={`Scroll ${title} right`}><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="rail-track" ref={track} onScroll={check}>
        {products.map((p, i) => <div className="rail-item" key={p.id}><ProductCard product={p} index={i} /></div>)}
      </div>
    </section>
  );
}
