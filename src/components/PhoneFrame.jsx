import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import './PhoneFrame.css';

// On desktop the mobile app is shown inside a phone frame with a short
// description beside it. On real phones (< 520px) it goes full-screen.
export default function PhoneFrame({ children, dark = false, title, desc, points = [] }) {
  return (
    <div className={`pf-stage ${dark ? 'dark' : ''}`}>
      <motion.div className="pf-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <Link to="/" className="pf-back"><ArrowLeft size={16} /> All portals</Link>
        <h1 className="display">{title}</h1>
        <p>{desc}</p>
        <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>
      </motion.div>
      <motion.div className="pf-device" initial={{ opacity: 0, y: 60, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <div className="pf-notch" />
        <div className="pf-screen">{children}</div>
      </motion.div>
    </div>
  );
}
