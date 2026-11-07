import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Splash.css';

// First-open intro: chef hat draws itself, brand name rises letter by letter,
// a progress line fills, then the whole layer curtains up.
const WORD = 'Adi Shakti';

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      onClick={onDone}
      role="status"
      aria-label="Loading Adi Shakti Trader"
    >
      <div className="splash-glow" />
      <svg className="splash-hat" width="120" height="120" viewBox="0 0 64 64" aria-hidden="true">
        <motion.path
          d="M20 27c-5 0-6-8 0-9 0-6 9-8 12-3 3-5 12-3 12 3 6 1 5 9 0 9v5H20z"
          fill="none" stroke="#F6E9DC" strokeWidth="1.8" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.rect x="22" y="38" width="20" height="8" rx="2" fill="#B8235A"
          initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }} transition={{ delay: 0.9, duration: 0.5 }} />
        <motion.circle cx="32" cy="35" r="2.2" fill="#F2B8CC"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3, type: 'spring', stiffness: 400 }} />
      </svg>
      <h1 className="splash-word display" aria-hidden="true">
        {WORD.split('').map((ch, i) => (
          <motion.span key={i}
            initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </h1>
      <motion.p className="splash-sub" initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.45em' }} transition={{ delay: 1.3, duration: 0.9 }}>
        TRADER · BAKING TOOLS &amp; ACCESSORIES
      </motion.p>
      <div className="splash-bar"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} /></div>
    </motion.div>
  );
}
