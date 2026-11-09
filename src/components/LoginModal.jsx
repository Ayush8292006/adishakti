import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { Logo } from './Layout.jsx';
import './LoginModal.css';

// Sign in / Create account. Prototype: any details work — connect to the backend in submit().
export default function LoginModal() {
  const shop = useShop();
  const [mode, setMode] = useState('in');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [forgot, setForgot] = useState(false);
  const close = () => shop.setLoginOpen(false);
  useEffect(() => { if (!shop.loginOpen) { setMode('in'); setErr(''); setForgot(false); } }, [shop.loginOpen]);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = String(f.get('id') || '').trim();
    if (!id || String(f.get('password') || '').length < 4) { setErr('Please enter your email or mobile number and a password (min 4 characters).'); return; }
    shop.setUser({ name: String(f.get('name') || '').trim() || id.split('@')[0], id });
    close();
  };

  return (
    <AnimatePresence>
      {shop.loginOpen && (
        <motion.div className="lm-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="lm" role="dialog" aria-modal="true" aria-label={mode === 'in' ? 'Sign in' : 'Create account'} onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <button className="icon-btn lm-x" onClick={close} aria-label="Close"><X size={20} /></button>
            <div className="lm-logo"><Logo /></div>
            {shop.user ? (
              <div className="lm-in">
                <h2>Hello, {shop.user.name}</h2>
                <p className="muted">You’re signed in as {shop.user.id}.</p>
                <button className="btn btn-line" onClick={() => { shop.setUser(null); close(); }}>Log out</button>
              </div>
            ) : forgot ? (
              <form className="lm-form" onSubmit={(e) => { e.preventDefault(); setForgot('sent'); }}>
                <h2>Reset your password</h2>
                {forgot === 'sent' ? <p className="muted">If an account exists, you’ll get a reset link shortly.</p> : (
                  <><p className="muted">We’ll send you a link to reset your password.</p>
                    <label className="lm-field"><span>Email or mobile number</span><input required /></label>
                    <button className="btn btn-brand lm-btn">Send reset link</button></>
                )}
                <button type="button" className="lm-link" onClick={() => setForgot(false)}>Back to sign in</button>
              </form>
            ) : (
              <>
                <div className="lm-tabs" role="tablist">
                  {[['in', 'Sign in'], ['up', 'Create account']].map(([k, l]) => (
                    <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? 'on' : ''} onClick={() => { setMode(k); setErr(''); }}>
                      {l}{mode === k && <motion.span layoutId="lm-line" className="lm-line" />}
                    </button>
                  ))}
                </div>
                <form className="lm-form" onSubmit={submit} noValidate>
                  <AnimatePresence initial={false}>
                    {mode === 'up' && (
                      <motion.label key="name" className="lm-field" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <span>Full name</span><input name="name" autoComplete="name" />
                      </motion.label>
                    )}
                  </AnimatePresence>
                  <label className="lm-field"><span>Email or mobile number</span><input name="id" autoComplete="username" /></label>
                  <label className="lm-field"><span>Password</span>
                    <span className="lm-pw">
                      <input name="password" type={show ? 'text' : 'password'} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
                      <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                    </span>
                  </label>
                  {mode === 'in' && <button type="button" className="lm-link right" onClick={() => setForgot(true)}>Forgot your password?</button>}
                  {err && <p className="lm-err" role="alert">{err}</p>}
                  <button className="btn btn-brand lm-btn">{mode === 'in' ? 'Sign in' : 'Create account'}</button>
                  <p className="muted lm-note">{mode === 'in' ? 'New customer? ' : 'Already have an account? '}<button type="button" className="lm-link" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'Create an account' : 'Sign in'}</button></p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
