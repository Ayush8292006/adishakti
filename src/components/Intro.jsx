import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

// Short first-open intro: logo pops in, name slides up, panel lifts away.
export default function Intro({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="intro" onClick={onDone} role="status" aria-label="Loading Adi Shakti Trader"
      exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}>
      <motion.span className="intro-mark" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
        <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true"><path d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z" fill="none" stroke="#4A2316" strokeWidth="2.4" strokeLinejoin="round" /><rect x="10" y="25" width="16" height="4" rx="2" fill="#B8235A" /></svg>
      </motion.span>
      <div className="intro-name">
        <motion.b initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>Adi Shakti</motion.b>
      </div>
      <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>Baking tools &amp; accessories</motion.small>
      <div className="intro-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} /></div>
    </motion.div>
  );
}
