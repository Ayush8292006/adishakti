import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { Logo } from './Layout.jsx';
import './LoginModal.css';

// Phone → OTP → name. Prototype: any 4-digit OTP works. Connect to backend in verify().
export default function LoginModal() {
  const shop = useShop();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [timer, setTimer] = useState(30);
  const boxes = useRef([]);
  const close = () => shop.setLoginOpen(false);

  useEffect(() => { if (!shop.loginOpen) { setStep('phone'); setOtp(['', '', '', '']); } }, [shop.loginOpen]);
  useEffect(() => {
    if (step !== 'otp') return undefined;
    setTimer(30);
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    setTimeout(() => boxes.current[0]?.focus(), 250);
    return () => clearInterval(t);
  }, [step]);

  const typeOtp = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...otp]; next[i] = d; setOtp(next);
    if (d && i < 3) boxes.current[i + 1]?.focus();
    if (next.every(Boolean)) setTimeout(() => setStep('name'), 250);
  };
  const keyOtp = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) boxes.current[i - 1]?.focus(); };
  const finish = (e) => { e.preventDefault(); shop.setUser({ name: name || 'Customer', phone }); close(); };

  return (
    <AnimatePresence>
      {shop.loginOpen && (
        <motion.div className="lm-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="lm" role="dialog" aria-modal="true" aria-label="Login" onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <div className="lm-top">
              {step !== 'phone' ? <button className="icon-btn" onClick={() => setStep('phone')} aria-label="Back"><ArrowLeft size={20} /></button> : <span />}
              <button className="icon-btn" onClick={close} aria-label="Close"><X size={20} /></button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.25 }} className="lm-body">
                {step === 'phone' && (
                  <form onSubmit={(e) => { e.preventDefault(); if (phone.length === 10) setStep('otp'); }}>
                    <div className="lm-logo"><Logo /></div>
                    <h2>Baking tools, delivered</h2>
                    <p className="muted">Log in or sign up with your mobile number</p>
                    <label className="lm-phone">
                      <span>+91</span>
                      <span className="sr-only">Mobile number</span>
                      <input autoFocus inputMode="numeric" autoComplete="tel-national" placeholder="Enter mobile number" value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    </label>
                    <button className="btn btn-pink lm-btn" disabled={phone.length !== 10}>Continue</button>
                    <p className="lm-terms muted">By continuing, you agree to our terms of service &amp; privacy policy.</p>
                  </form>
                )}
                {step === 'otp' && (
                  <div>
                    <h2>OTP verification</h2>
                    <p className="muted">We’ve sent a 4-digit code to <b>+91 {phone}</b></p>
                    <div className="lm-otp">
                      {otp.map((d, i) => (
                        <input key={i} ref={(el) => { boxes.current[i] = el; }} inputMode="numeric" maxLength={1} value={d} aria-label={`Digit ${i + 1}`}
                          onChange={(e) => typeOtp(i, e.target.value)} onKeyDown={(e) => keyOtp(i, e)} />
                      ))}
                    </div>
                    <p className="lm-resend muted">{timer > 0 ? `Resend code in ${timer}s` : <button className="lm-link" onClick={() => setTimer(30)}>Resend code</button>}</p>
                    <p className="lm-terms muted">Prototype: enter any 4 digits.</p>
                  </div>
                )}
                {step === 'name' && (
                  <form onSubmit={finish}>
                    <h2>Almost done</h2>
                    <p className="muted">What should we call you?</p>
                    <label className="lm-field"><span className="sr-only">Your name</span>
                      <input autoFocus placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                    </label>
                    <button className="btn btn-pink lm-btn">Start shopping</button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
