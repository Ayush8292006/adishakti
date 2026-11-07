import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { findProduct, formatINR } from '../data/products.js';
import './VideoModal.css';

// Plays an admin-uploaded demo (video.src). Until a file exists the poster shows.
export default function VideoModal() {
  const shop = useShop();
  const v = shop.video;
  const close = () => shop.setVideo(null);
  return (
    <AnimatePresence>
      {v && (
        <motion.div className="vm-bg" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="vm" role="dialog" aria-modal="true" aria-label={v.title} onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="vm-player">
              {v.src ? <video src={v.src} poster={v.poster} controls autoPlay playsInline /> : (
                <>
                  <img src={v.poster} alt="" />
                  <div className="vm-ph"><span className="vm-play"><Play size={24} fill="currentColor" /></span><p>Demo video ({v.duration}) plays here once uploaded</p></div>
                </>
              )}
              <button className="icon-btn vm-x" onClick={close} aria-label="Close video"><X size={20} /></button>
            </div>
            <div className="vm-body">
              <div><span className="label">Cake demo · {v.duration}</span><h3 className="serif">{v.title}</h3></div>
              <div className="vm-products">
                <span className="label">Used in this demo</span>
                {v.productIds.map((id) => {
                  const p = findProduct(id);
                  return (
                    <div key={id} className="vm-p">
                      <img src={p.img} alt="" />
                      <span><b>{p.name}</b><small>{formatINR(p.price)}</small></span>
                      <button className="icon-btn" onClick={() => shop.add(id)} aria-label={`Add ${p.name}`}><Plus size={18} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
