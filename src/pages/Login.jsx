import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, LayoutDashboard, Smartphone, Handshake, ArrowRight, Eye, EyeOff, Check, Phone, MapPin, Sparkles, Video, Package, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { Page } from '../components/Reveal.jsx';
import './Login.css';

const PORTALS = [
  { id: 'shop', to: '/shop', title: 'Customer Website', short: 'Website', desc: 'Shop moulds, toppers & tools', icon: Store, user: 'Phone number', demo: '7996 222111' },
  { id: 'admin', to: '/admin', title: 'Super Admin', short: 'Admin', desc: 'Tally, stock, billing, videos', icon: LayoutDashboard, user: 'Admin ID', demo: 'admin@adishakti' },
  { id: 'app', to: '/app', title: 'Customer App', short: 'App', desc: 'Mobile shopping app', icon: Smartphone, user: 'Phone number', demo: '7996 222111' },
  { id: 'partner', to: '/partner', title: 'Partnership App', short: 'Partner', desc: 'For partner store owners', icon: Handshake, user: 'Store ID', demo: 'PS-1024' },
];

const COL_A = ['ginkgo-topper', 'rose-mould', 'teddy-topper', 'nozzle-set', 'filigree-butterfly', 'hb-coin'];
const COL_B = ['mini-crown', 'star-heart-topper', 'acrylic-box', 'fairy-topper', 'pompom-topper', 'rainbow-topper'];
const STRIP = [...COL_A, ...COL_B];

const ease = [0.22, 1, 0.36, 1];

export default function Login() {
  const navigate = useNavigate();
  const [portal, setPortal] = useState('shop');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const current = PORTALS.find((p) => p.id === portal);

  const go = (to) => {
    setLoading(true);
    // Prototype: no real auth — go straight to the chosen portal
    setTimeout(() => navigate(to), 650);
  };
  const submit = (e) => { e.preventDefault(); go(current.to); };

  return (
    <Page className="home">
      <div className="home-bg" aria-hidden="true">
        <span className="glow g1" /><span className="glow g2" /><span className="grain" />
      </div>

      {/* Desktop: two vertical image columns drifting behind the card */}
      <div className="home-cols" aria-hidden="true">
        {[COL_A, COL_B].map((col, ci) => (
          <div key={ci} className={`home-col ${ci ? 'down' : 'up'}`}>
            {[...col, ...col].map((s, i) => <img key={i} src={`/products/${s}.jpg`} alt="" />)}
          </div>
        ))}
      </div>

      <header className="home-head container">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Logo light size={42} />
        </motion.div>
        <motion.a href="tel:+917996222111" className="home-call" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Phone size={16} /><span>7996 222111</span>
        </motion.a>
      </header>

      <main className="home-main container">
        <section className="home-hero">
          <motion.span className="home-tag" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Sparkles size={14} /> Choice of Home Bakers
          </motion.span>
          <h1 className="display">
            {[<>Bake it</>, <><em>beautiful</em>,</>, <>every time.</>].map((l, i) => (
              <span className="line-mask" key={i}>
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2 + i * 0.12, duration: 0.9, ease }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="home-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Baking tools, moulds, toppers and packing for home bakers and bakeries — with 2‑minute cake demo videos.
          </motion.p>

          {/* Mobile / tablet: horizontal product strip */}
          <div className="home-strip" aria-hidden="true">
            <div className="home-strip-track">
              {[...STRIP, ...STRIP].map((s, i) => <img key={i} src={`/products/${s}.jpg`} alt="" />)}
            </div>
          </div>

          <motion.ul className="home-stats" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.08, delayChildren: 0.75 } } }}>
            {[[Package, '46+', 'Products'], [Video, '2 min', 'Cake demos'], [ShieldCheck, 'GST', 'Billing']].map(([I, n, l]) => (
              <motion.li key={l} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
                <span><I size={18} /></span><div><b>{n}</b><small>{l}</small></div>
              </motion.li>
            ))}
          </motion.ul>
          <motion.p className="home-addr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <MapPin size={15} /> #39, WAT Street, Gandhi Bazaar, Basavanagudi, Bengaluru
          </motion.p>
        </section>

        <motion.section className="home-card" aria-label="Sign in"
          initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.25, ease }}>
          <form onSubmit={submit}>
            <h2 className="display">Sign in</h2>
            <p className="home-card-sub">Choose a portal to continue</p>

            <fieldset className="portals">
              <legend className="sr-only">Choose a portal</legend>
              {PORTALS.map((p, i) => {
                const Icon = p.icon;
                const active = p.id === portal;
                return (
                  <motion.label key={p.id} className={`portal ${active ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.07 }}
                    whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                    <input type="radio" name="portal" value={p.id} checked={active} onChange={() => setPortal(p.id)} className="sr-only" />
                    {active && <motion.span layoutId="portal-ring" className="portal-ring" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                    <span className="portal-icon"><Icon size={20} /></span>
                    <span className="portal-text">
                      <span className="portal-title"><span className="t-long">{p.title}</span><span className="t-short">{p.short}</span></span>
                      <span className="portal-desc">{p.desc}</span>
                    </span>
                    <AnimatePresence>
                      {active && (
                        <motion.span className="portal-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check size={12} strokeWidth={3.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.label>
                );
              })}
            </fieldset>

            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <label className="field">
                  <span>{current.user}</span>
                  <input required defaultValue={current.demo} autoComplete="username" />
                </label>
              </motion.div>
            </AnimatePresence>
            <label className="field">
              <span>Password</span>
              <span className="field-pw">
                <input required type={showPw ? 'text' : 'password'} defaultValue="prototype" autoComplete="current-password" />
                <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <button className="btn btn-primary home-submit" type="submit" disabled={loading}>
              {loading ? <span className="spinner" aria-label="Signing in" /> : <>Continue to {current.title} <ArrowRight size={18} /></>}
            </button>
            <p className="home-foot">Prototype — any details work. <button type="button" onClick={() => go('/shop')}>Browse shop as guest</button></p>
          </form>
        </motion.section>
      </main>
    </Page>
  );
}
