import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Intro.css';

export default function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="intro-overlay"
      onClick={onDone}
      role="status"
      aria-label="Loading The Baking Tools"
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
    >
      <motion.div
        className="intro-box"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="intro-icon-mark">
          <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true">
            <path
              d="M10 18c-3 0-4-5 0-6 0-4 6-5 8-2 2-3 8-2 8 2 4 1 3 6 0 6v4H10z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <rect x="10" y="25" width="16" height="4" rx="2" fill="#ffffff" />
          </svg>
        </div>

        <div className="intro-title-wrap">
          <motion.b
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            The Baking Tools
          </motion.b>
        </div>

        <motion.small
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          Cake Moulds · Toppers · Baking Supplies
        </motion.small>

        <div className="intro-progress-track">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          />
        </div>

        <span className="intro-tap-tip">Tap to enter store</span>
      </motion.div>
    </motion.div>
  );
}
