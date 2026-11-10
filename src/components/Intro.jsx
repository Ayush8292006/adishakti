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
      aria-label="Loading Adi Shakti Trader"
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
    >
      <motion.div
        className="intro-box"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.picture
          className="intro-logo"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <source srcSet="/logo.webp" type="image/webp" />
          <img src="/logo.png" alt="Adi Shakti Trader" width="446" height="360" />
        </motion.picture>

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
