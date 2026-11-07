import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Intro from './components/Intro.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const location = useLocation();
  // Intro plays once per browser session, on the very first open
  const [intro, setIntro] = useState(() => !sessionStorage.getItem('ast-intro'));
  const done = () => { sessionStorage.setItem('ast-intro', '1'); setIntro(false); };

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" onDone={done} />}</AnimatePresence>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home ready={!intro} />} />
            <Route path="/product/:id" element={<Product />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
