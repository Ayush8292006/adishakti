import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { findProduct, formatINR } from '../data/products.js';
import AddButton from './AddButton.jsx';
import './VideoModal.css';

// Plays the admin-uploaded demo (video.src). Until uploaded, the poster shows.
export default function VideoModal() {
  const shop = useShop();
  const v = shop.video;
  const close = () => shop.setVideo(null);
  return (
    <AnimatePresence>
      {v && (
        <motion.div className="vm-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="vm" role="dialog" aria-modal="true" aria-label={v.title} onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <div className="vm-player">
              {v.src ? <video src={v.src} poster={v.poster} controls autoPlay playsInline /> : (
                <>
                  <img src={v.poster} alt="" />
                  <div className="vm-ph"><span><Play size={26} fill="currentColor" /></span><p>Demo video ({v.duration}) plays here once uploaded</p></div>
                </>
              )}
              <button className="icon-btn vm-x" onClick={close} aria-label="Close video"><X size={20} /></button>
            </div>
            <div className="vm-body">
              <small className="vm-tag">CAKE DEMO · {v.duration}</small>
              <h3>{v.title}</h3>
              <p className="muted">Products used in this video</p>
              {v.productIds.map((id) => {
                const p = findProduct(id);
                return (
                  <div key={id} className="vm-p">
                    <img src={p.img} alt="" />
                    <span><b>{p.name}</b><small>{formatINR(p.price)}</small></span>
                    <AddButton id={id} name={p.name} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
