import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Intro from './components/Intro.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import Product from './pages/Product.jsx';
import { useShop } from './context/ShopContext.jsx';

// /login opens the login popup on the home page
function LoginRoute() {
  const shop = useShop();
  useEffect(() => { shop.setLoginOpen(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <Navigate to="/" replace />;
}

export default function App() {
  const location = useLocation();
  const [intro, setIntro] = useState(() => !sessionStorage.getItem('ast-intro'));
  const done = () => { sessionStorage.setItem('ast-intro', '1'); setIntro(false); };

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" onDone={done} />}</AnimatePresence>
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home ready={!intro} />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/search" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<LoginRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
