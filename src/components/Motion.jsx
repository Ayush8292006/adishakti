import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/** Fade + rise when scrolled into view */
export function Reveal({ children, delay = 0, y = 32, className, style, as = 'div', once = true }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} style={style}
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }} transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </Tag>
  );
}

/** Headline that rises line by line. lines = array of strings / nodes */
export function Lines({ lines, as = 'h2', className, delay = 0, inView = true, play = true, stagger = 0.09 }) {
  const Tag = motion[as];
  const trigger = inView
    ? { initial: 'h', whileInView: 's', viewport: { once: true, amount: 0.4 } }
    : { initial: 'h', animate: play ? 's' : 'h' };
  return (
    <Tag className={className} {...trigger}
      variants={{ h: {}, s: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span variants={{ h: { y: '108%' }, s: { y: '0%', transition: { duration: 1, ease: EASE } } }}>{l}</motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Image that unmasks upward when scrolled into view, with gentle scroll parallax */
export function RevealImage({ src, alt = '', className, ratio, parallax = 40, delay = 0, eager = false, play = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);
  return (
    <motion.div ref={ref} className={`rimg ${className || ''}`} style={ratio ? { aspectRatio: ratio } : undefined}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      {...(eager ? { animate: play ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined } : { whileInView: { clipPath: 'inset(0% 0% 0% 0%)' }, viewport: { once: true, amount: 0.2 } })}
      transition={{ duration: 1.3, delay, ease: EASE }}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.12 }} loading={eager ? 'eager' : 'lazy'} />
    </motion.div>
  );
}

/** Children appear one after another on scroll */
export function Stagger({ children, className, style, gap = 0.07 }) {
  return (
    <motion.div className={className} style={style} initial="h" whileInView="s" viewport={{ once: true, amount: 0.15 }}
      variants={{ h: {}, s: { transition: { staggerChildren: gap } } }}>
      {children}
    </motion.div>
  );
}
export function Item({ children, className, style, as = 'div' }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} style={style}
      variants={{ h: { opacity: 0, y: 28 }, s: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}>
      {children}
    </Tag>
  );
}

/** Route wrapper */
export function Page({ children, className = '' }) {
  return (
    <motion.main className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      {children}
    </motion.main>
  );
}

/** Paragraph whose words light up as you scroll through it */
export function ScrollWords({ text, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  );
}
function Word({ children, p, range }) {
  const opacity = useTransform(p, range, [0.16, 1]);
  return <><motion.span style={{ opacity }}>{children}</motion.span>{' '}</>;
}

/** true on screens >= minWidth px */
export function useMedia(minWidth = 1024) {
  const q = `(min-width: ${minWidth}px)`;
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setOk(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [q]);
  return ok;
}
