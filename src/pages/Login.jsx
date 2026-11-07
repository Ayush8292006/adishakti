import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Store, LayoutDashboard, Smartphone, Handshake, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { Page } from '../components/Reveal.jsx';
import './Login.css';

const PORTALS = [
  { id: 'shop', to: '/shop', title: 'Customer Website', desc: 'Shop moulds, toppers & tools', icon: Store, user: 'Phone number' },
  { id: 'admin', to: '/admin', title: 'Super Admin', desc: 'Tally, stock, billing, videos', icon: LayoutDashboard, user: 'Admin ID' },
  { id: 'app', to: '/app', title: 'Customer App', desc: 'Mobile shopping experience', icon: Smartphone, user: 'Phone number' },
  { id: 'partner', to: '/partner', title: 'Partnership App', desc: 'For partner store owners', icon: Handshake, user: 'Store ID' },
];

const FLOAT = [
  { src: '/products/ginkgo-topper.jpg', cls: 'f1', depth: 30 },
  { src: '/products/rose-mould.jpg', cls: 'f2', depth: -24 },
  { src: '/products/filigree-butterfly.jpg', cls: 'f3', depth: 40 },
  { src: '/products/nozzle-set.jpg', cls: 'f4', depth: -36 },
];

function FloatImg({ src, cls, depth, mx, my }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.img src={src} alt="" className={`login-float ${cls}`} style={{ x, y }}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [portal, setPortal] = useState('shop');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 18 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 18 });
  const current = PORTALS.find((p) => p.id === portal);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mxRaw.set((e.clientX - r.left) / r.width - 0.5);
    myRaw.set((e.clientY - r.top) / r.height - 0.5);
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Prototype: no real auth — go straight to the chosen portal
    setTimeout(() => navigate(current.to), 700);
  };

  return (
    <Page className="login">
      <section className="login-brand" onMouseMove={onMove}>
        <div className="login-blob" />
        {FLOAT.map((f) => <FloatImg key={f.cls} {...f} mx={mx} my={my} />)}
        <motion.div className="login-brand-top" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Logo light size={46} />
        </motion.div>
        <div className="login-brand-copy">
          <motion.p className="eyebrow" style={{ color: 'var(--pink-300)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Choice of Home Bakers
          </motion.p>
          <h1 className="display">
            {['Everything', 'your cake', 'needs.'].map((line, i) => (
              <span className="line-mask" key={line}>
                <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="login-brand-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            Baking tools &amp; accessories · Gandhi Bazaar, Basavanagudi, Bengaluru
          </motion.p>
        </div>
      </section>

      <section className="login-panel">
        <motion.form onSubmit={submit} className="login-form"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="display">Welcome back</h2>
          <p className="muted" style={{ margin: '6px 0 26px' }}>Choose where you want to go, then sign in.</p>

          <fieldset className="portal-grid">
            <legend className="sr-only">Choose a portal</legend>
            {PORTALS.map((p, i) => {
              const Icon = p.icon;
              const active = p.id === portal;
              return (
                <motion.label key={p.id} className={`portal ${active ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                  <input type="radio" name="portal" value={p.id} checked={active} onChange={() => setPortal(p.id)} className="sr-only" />
                  <span className="portal-icon"><Icon size={22} /></span>
                  <span className="portal-title">{p.title}</span>
                  <span className="portal-desc">{p.desc}</span>
                  <AnimatePresence>
                    {active && (
                      <motion.span className="portal-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.label>
              );
            })}
          </fieldset>

          <label className="field">
            <span>{current.user}</span>
            <input required defaultValue={current.id === 'admin' ? 'admin@adishakti' : '7996 222111'} key={current.id} />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="field-pw">
              <input required type={showPw ? 'text' : 'password'} defaultValue="prototype" />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
            {loading ? <span className="spinner" aria-label="Signing in" /> : <>Login to {current.title} <ArrowRight size={18} /></>}
          </button>
          <p className="muted login-foot">Prototype login — any details work.</p>
        </motion.form>
      </section>
    </Page>
  );
}
