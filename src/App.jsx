import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Splash from './components/Splash.jsx';
import Login from './pages/Login.jsx';
import Shop from './pages/shop/Shop.jsx';
import Admin from './pages/admin/Admin.jsx';
import CustomerApp from './pages/app/CustomerApp.jsx';
import PartnerApp from './pages/partner/PartnerApp.jsx';

export default function App() {
  // Splash shows once per browser session, the first time the site opens
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('ast-splash-seen'));
  const location = useLocation();

  const finishSplash = () => {
    sessionStorage.setItem('ast-splash-seen', '1');
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence>{showSplash && <Splash key="splash" onDone={finishSplash} />}</AnimatePresence>
      {!showSplash && (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Login />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/app" element={<CustomerApp />} />
            <Route path="/partner" element={<PartnerApp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      )}
    </>
  );
}
