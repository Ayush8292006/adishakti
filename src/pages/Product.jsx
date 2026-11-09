import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Play, Video, BadgePercent, Store,
  Star, ShieldCheck, Truck, MessageCircle, Heart, Check, RefreshCw,
  Minus, Plus, ShoppingBag, Package
} from 'lucide-react';
import AddButton from '../components/AddButton.jsx';
import Rail from '../components/Rail.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { PRODUCTS, findProduct, formatINR, isLowStock, catSlug } from '../data/products.js';
import { VIDEOS } from '../data/videos.js';
import './Product.css';

const EASE = [0.16, 1, 0.3, 1];

export default function Product() {
  const { id } = useParams();
  const p = findProduct(Number(id));
  const shop = useShop();

  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  useEffect(() => {
    setVariant(p?.variants?.[0]?.name || null);
    setQty(1);
    setPincodeChecked(false);
  }, [id, p]);

  if (!p) {
    return (
      <main className="wrap pd-missing-state">
        <h1>Product Not Found</h1>
        <p className="muted">The product you are looking for is currently unavailable or has been moved.</p>
        <Link to="/category/all" className="btn btn-primary">
          Browse All Products
        </Link>
      </main>
    );
  }

  const demo = VIDEOS.find((v) => v.productIds.includes(p.id)) || VIDEOS.find((v) => v.category === p.category);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);

  const mrp = Math.round(p.price * 1.25);
  const discountPercent = Math.round(((mrp - p.price) / mrp) * 100);
  const wishlisted = shop.isWishlisted(p.id);

  const stockText = p.stock == null
    ? 'Stock to be confirmed'
    : isLowStock(p)
    ? `Only ${p.stock} units left in stock`
    : `In Stock (${p.stock} ${p.unit} available)`;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 6) {
      setPincodeChecked(true);
    }
  };

  const handleAddToCart = () => {
    shop.add(p.id, qty);
    shop.setCartOpen(true);
  };

  const whatsappMessage = `Hi The Baking Tools! I would like to order "${p.name}" (Quantity: ${qty}, Price: ${formatINR(
    p.price * qty
  )}${variant ? `, Option: ${variant}` : ''}). Please confirm order delivery.`;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pd-view-page"
    >
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs pd-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to={`/category/${catSlug(p.category)}`}>{p.category}</Link>
          <ChevronRight size={13} />
          <span>{p.name}</span>
        </nav>

        <div className="pd-main-grid">
          {/* Left Column: Image Gallery */}
          <div className="pd-gallery-col">
            <motion.div
              className="pd-large-image-box"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <img src={p.img} alt={p.name} />

              <span className="pd-img-sale-badge">-{discountPercent}% OFF</span>

              {/* Wishlist Button */}
              <button
                type="button"
                className={`pd-gallery-wishlist-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => shop.toggleWishlist(p.id)}
                aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={20}
                  fill={wishlisted ? '#e23e57' : 'none'}
                  color={wishlisted ? '#e23e57' : '#374151'}
                />
              </button>

              {p.category === 'Silicone Moulds' && (
                <span className="pd-food-grade-strip">
                  <ShieldCheck size={14} /> 100% Certified Food-Grade Platinum Silicone
                </span>
              )}
            </motion.div>

            {/* Thumbnail Gallery Row */}
            <div className="pd-thumbnails-row">
              <button type="button" className="pd-thumb-btn active">
                <img src={p.img} alt="" />
              </button>
              {p.category === 'Silicone Moulds' && (
                <button type="button" className="pd-thumb-btn">
                  <img src="/products/flower-mould.jpg" alt="" />
                </button>
              )}
              {p.category === 'Cake Toppers' && (
                <button type="button" className="pd-thumb-btn">
                  <img src="/products/hb-coin.jpg" alt="" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Product Purchase Info */}
          <div className="pd-info-col">
            <span className="pd-category-pill">{p.category}</span>
            <h1 className="pd-product-title">{p.name}</h1>

            {/* Rating & Review Counter */}
            <div className="pd-rating-box">
              <div className="pd-star-group">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <span className="pd-rating-score">4.9 / 5</span>
              <span className="pd-rating-sep">•</span>
              <span className="pd-rating-count">36 verified customer reviews</span>
            </div>

            {/* Price Box */}
            <div className="pd-price-card">
              <div className="pd-price-line">
                <span className="pd-current-price">{formatINR(p.price)}</span>
                <span className="pd-strike-mrp">{formatINR(mrp)}</span>
                <span className="pd-discount-pill">{discountPercent}% OFF</span>
              </div>
              <small className="pd-tax-note">Inclusive of all taxes · Sold per {p.unit}</small>
            </div>

            {/* Availability Status */}
            <div className="pd-availability-row">
              <span className={`status-dot ${isLowStock(p) ? 'low' : 'in-stock'}`} />
              <b className={isLowStock(p) ? 'text-amber' : 'text-green'}>{stockText}</b>
            </div>

            {/* Variant Options (if any) */}
            {p.variants && (
              <div className="pd-variant-section">
                <span className="pd-section-label">Select Option / Color:</span>
                <div className="pd-variant-options">
                  {p.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      className={`pd-variant-btn ${variant === v.name ? 'selected' : ''}`}
                      onClick={() => setVariant(v.name)}
                    >
                      <b>{v.name}</b>
                      <small>{formatINR(p.price)}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add to Cart + WhatsApp Buy */}
            <div className="pd-purchase-controls">
              <div className="pd-qty-selector">
                <span className="pd-qty-label">Quantity:</span>
                <div className="pd-stepper-box">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="pd-action-buttons">
                <button
                  type="button"
                  className="btn btn-primary btn-lg pd-add-btn"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                <a
                  href={`https://wa.me/917996222111?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg pd-wa-action"
                >
                  <MessageCircle size={18} />
                  <span>Buy on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="pd-pincode-card">
              <form className="pincode-form" onSubmit={handlePincodeCheck}>
                <Truck size={17} className="pincode-ico" />
                <input
                  type="text"
                  placeholder="Enter Delivery Pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeChecked(false);
                  }}
                  aria-label="Pincode"
                />
                <button type="submit" className="pincode-check-btn">
                  Check
                </button>
              </form>

              {pincodeChecked && (
                <div className="pincode-result">
                  <Check size={14} className="check-ico" />
                  <span>
                    Delivery available to <b>{pincode}</b>: Estimated delivery within <strong>24–48 hours</strong>!
                  </span>
                </div>
              )}
            </div>

            {/* Video Tutorial Card Preview */}
            {demo && (
              <button
                type="button"
                className="pd-video-demo-card"
                onClick={() => shop.setVideo(demo)}
              >
                <div className="pd-vdemo-thumb">
                  <img src={demo.poster} alt="" />
                  <span className="pd-vdemo-play">
                    <Play size={14} fill="currentColor" />
                  </span>
                </div>
                <div className="pd-vdemo-copy">
                  <small>WATCH HOW TO USE · {demo.duration}</small>
                  <b>{demo.title}</b>
                  <span>See exact products &amp; demoulding technique</span>
                </div>
                <ChevronRight size={18} className="pd-vdemo-arrow" />
              </button>
            )}

            {/* Trust Perks */}
            <div className="pd-trust-perks-list">
              <div className="pd-perk-item">
                <Truck size={16} />
                <span>Free shipping on all orders over ₹1,499</span>
              </div>
              <div className="pd-perk-item">
                <Package size={16} />
                <span>Cash on Delivery (COD) available across India</span>
              </div>
              <div className="pd-perk-item">
                <ShieldCheck size={16} />
                <span>100% Certified Platinum Food-Grade Quality</span>
              </div>
              <div className="pd-perk-item">
                <Store size={16} />
                <span>Gandhi Bazaar Store pickup available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details & Specifications */}
        <div className="pd-tabs-section">
          <div className="pd-tab-headers" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'desc'}
              className={`pd-tab-header ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Description &amp; Highlights
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'specs'}
              className={`pd-tab-header ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Product Specifications
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reviews'}
              className={`pd-tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Customer Reviews (36)
            </button>
          </div>

          <div className="pd-tab-content-panel">
            {activeTab === 'desc' && (
              <div className="pd-tab-text">
                <h3>About {p.name}</h3>
                <p>
                  Crafted for high performance and durability, this {p.name.toLowerCase()} is an essential
                  addition to any baker&apos;s kitchen. Whether you are creating elaborate wedding cakes,
                  gourmet chocolate truffles, or weekend family treats, this tool ensures precise results
                  with professional polish.
                </p>
                <ul>
                  <li>Manufactured using premium, non-toxic, food-grade materials.</li>
                  <li>Easy to clean, non-stick surface allows hassle-free demoulding and maintenance.</li>
                  <li>Suitable for commercial patisseries, home bakers, and confectionery academies.</li>
                  <li>Directly sourced and quality-checked by The Baking Tools team in Bengaluru.</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="pd-tab-specs">
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th>Product Category</th>
                      <td>{p.category}</td>
                    </tr>
                    <tr>
                      <th>Sold As</th>
                      <td>Per {p.unit}</td>
                    </tr>
                    {p.variants && (
                      <tr>
                        <th>Options Available</th>
                        <td>{p.variants.map((v) => v.name).join(', ')}</td>
                      </tr>
                    )}
                    <tr>
                      <th>Temperature Range</th>
                      <td>-40°C to 230°C (Microwave, Oven &amp; Freezer Safe)</td>
                    </tr>
                    <tr>
                      <th>Material Safety</th>
                      <td>BPA-Free, 100% Certified Food-Grade Platinum Silicone</td>
                    </tr>
                    <tr>
                      <th>Dispatched From</th>
                      <td>#39 WAT Street, Gandhi Bazaar, Bengaluru, Karnataka 560004</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-tab-reviews">
                <div className="reviews-summary-card">
                  <div className="reviews-score-col">
                    <b>4.9</b>
                    <div className="pd-star-group">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#eab308" color="#eab308" />
                      ))}
                    </div>
                    <small>Based on 36 verified reviews</small>
                  </div>
                  <div className="reviews-btn-col">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => alert('Review submission opens for verified buyers!')}
                    >
                      Write a Review
                    </button>
                  </div>
                </div>

                <div className="user-review-item">
                  <div className="review-top-row">
                    <b>Deepa Nair · Bengaluru</b>
                    <span className="review-verified-badge">✓ Verified Buyer</span>
                  </div>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#eab308" color="#eab308" />
                    ))}
                  </div>
                  <p>
                    &ldquo;Excellent quality. I was nervous about demoulding chocolate petals, but they
                    slipped right out cleanly without cracking! Delivered in 4 hours via Dunzo.&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Rail */}
        {related.length > 0 && (
          <Rail
            title={`More in ${p.category}`}
            subtitle="Frequently paired together by cake decorators & pastry chefs"
            products={related}
            to={`/category/${catSlug(p.category)}`}
          />
        )}
      </div>
    </motion.main>
  );
}
