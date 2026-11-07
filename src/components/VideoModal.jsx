import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Plus } from 'lucide-react';
import { findProduct, formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

// Plays an admin-uploaded demo video (src). Until a file is uploaded the
// poster is shown with a note. Lists the products used, with quick add.
export default function VideoModal({ video, onClose }) {
  const cart = useCart();
  return (
    <AnimatePresence>
      {video && (
        <motion.div className="vmodal-backdrop" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="vmodal" role="dialog" aria-modal="true" aria-label={video.title}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
            <div className="vmodal-player">
              {video.src ? (
                <video src={video.src} poster={video.poster} controls autoPlay />
              ) : (
                <>
                  <img src={video.poster} alt="" />
                  <div className="placeholder">
                    <div>
                      <span style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', display: 'inline-grid', placeItems: 'center' }}>
                        <Play size={28} color="#B8235A" fill="#B8235A" />
                      </span>
                      <p style={{ margin: '14px 0 0', fontSize: 14, color: '#F6E9DC' }}>Demo video ({video.duration}) plays here once uploaded from the admin panel</p>
                    </div>
                  </div>
                </>
              )}
              <button className="icon-btn" onClick={onClose} aria-label="Close video" style={{ position: 'absolute', top: 14, right: 14 }}>
                <X size={18} />
              </button>
            </div>
            <div className="vmodal-body">
              <div>
                <h3 className="display" style={{ margin: 0, fontSize: 24 }}>{video.title}</h3>
                <p style={{ margin: '4px 0 0', color: '#E3CFC0', fontSize: 14 }}>{video.duration} · Products used in this demo</p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {video.productIds.map((id) => {
                  const p = findProduct(id);
                  return (
                    <button key={id} onClick={() => cart.add(id)} className="vm-prod"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#4D2A1D', border: 0, color: '#fff', borderRadius: 14, padding: '6px 12px 6px 6px' }}>
                      <img src={p.img} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
                      <span style={{ fontSize: 13, textAlign: 'left' }}>{p.name.split(' ').slice(0, 3).join(' ')}<br /><b>{formatINR(p.price)}</b></span>
                      <Plus size={16} />
                    </button>
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
