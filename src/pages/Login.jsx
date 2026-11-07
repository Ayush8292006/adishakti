import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Lines } from '../components/Motion.jsx';
import { Wordmark } from '../components/Layout.jsx';
import { useShop } from '../context/ShopContext.jsx';
import './Login.css';

const EASE = [0.22, 1, 0.36, 1];

export default function Login() {
  const shop = useShop();
  const navigate = useNavigate();
  const [mode, setMode] = useState('in'); // 'in' | 'up'
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    // Prototype: no real auth yet — connect to the backend here
    setTimeout(() => {
      shop.setUser({ name: data.get('name') || 'Customer', phone: data.get('phone') });
      navigate('/');
    }, 700);
  };

  return (
    <motion.main className="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="auth-visual" aria-hidden="true">
        <motion.img src="/products/ginkgo-topper.jpg" alt="" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE }} />
        <motion.div className="auth-visual-cover" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }} />
        <div className="auth-visual-text">
          <span className="label">Adi Shakti Trader</span>
          <p className="serif">Baking tools &amp; accessories, chosen for home bakers.</p>
        </div>
      </section>

      <section className="auth-panel">
        <header className="auth-top">
          <Link to="/" className="link"><ArrowLeft size={14} /> Back to shop</Link>
          <Link to="/" aria-label="Adi Shakti Trader home"><Wordmark /></Link>
        </header>

        <div className="auth-form-wrap">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <span className="label">{mode === 'in' ? 'Welcome back' : 'New customer'}</span>
              <Lines as="h1" className="serif auth-title" inView={false} lines={mode === 'in' ? ['Sign in'] : ['Create', <em key="e">account</em>]} />
            </motion.div>
          </AnimatePresence>

          <div className="auth-tabs" role="tablist" aria-label="Sign in or create account">
            {[['in', 'Sign in'], ['up', 'Create account']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? 'on' : ''} onClick={() => setMode(k)}>
                {l}
                {mode === k && <motion.span layoutId="auth-line" className="auth-line" transition={{ duration: 0.45, ease: EASE }} />}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={submit}>
            <AnimatePresence initial={false}>
              {mode === 'up' && (
                <motion.label key="name" className="fld" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <span>Full name</span>
                  <input name="name" required autoComplete="name" placeholder="Your name" />
                </motion.label>
              )}
            </AnimatePresence>
            <label className="fld">
              <span>Mobile number</span>
              <div className="fld-row"><em>+91</em><input name="phone" required inputMode="numeric" autoComplete="tel" placeholder="98765 43210" /></div>
            </label>
            <label className="fld">
              <span>Password</span>
              <div className="fld-row">
                <input name="password" required type={show ? 'text' : 'password'} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="••••••••" />
                <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </label>
            {mode === 'in' && <button type="button" className="link auth-forgot">Forgot password?</button>}
            <button className="btn btn-solid auth-submit" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'} {!busy && <ArrowRight size={16} className="arrow" />}
            </button>
          </form>

          <p className="auth-note muted">
            {mode === 'in' ? 'New to Adi Shakti? ' : 'Already have an account? '}
            <button className="link" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Create an account' : 'Sign in'}</button>
          </p>
        </div>

        <footer className="auth-foot muted">Need help? Call <a href="tel:+917996222111">7996 222111</a></footer>
      </section>
    </motion.main>
  );
}
