import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

// Short first-open intro: logo pops in, name slides up, panel lifts away.
export default function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="intro"
      onClick={onDone}
      role="status"
      aria-label="Loading Adi Shakti Trader"
      exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.span
        className="intro-mark"
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <svg viewBox="0 0 40 40" width="46" height="46" aria-hidden="true">
          <path
            d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z"
            fill="none"
            stroke="#36170d"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="10" y="25" width="16" height="4" rx="2" fill="#B8235A" />
        </svg>
      </motion.span>

      <div className="intro-name">
        <motion.b
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Adi Shakti
        </motion.b>
      </div>

      <motion.small
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        Baking Tools · Moulds · Toppers
      </motion.small>

      <div className="intro-bar">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      <span className="intro-skip">Tap anywhere to enter</span>
    </motion.div>
  );
}
