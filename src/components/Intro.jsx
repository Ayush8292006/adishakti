import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

// First-open intro: wordmark rises letter by letter on beige,
// a hairline fills, then the panel lifts away.
const EASE = [0.76, 0, 0.24, 1];

export default function Intro({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div className="intro" onClick={onDone} role="status" aria-label="Loading Adi Shakti Trader"
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1, ease: EASE } }}>
      <div className="intro-inner">
        <h1 className="serif intro-word" aria-hidden="true">
          {'Adi Shakti'.split('').map((c, i) => (
            <span className="intro-mask" key={i}>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                {c === ' ' ? ' ' : c}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="intro-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 1.6, ease: EASE }} />
        <motion.p className="intro-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          <span>Trader</span><span>Baking tools &amp; accessories</span><span>Gandhi Bazaar, Bengaluru</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
