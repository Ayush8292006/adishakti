# Adi Shakti Trader – 4 Prototypes (React)

Customer Website, Super Admin Panel (Tally), Customer App and Partnership App in one React + Vite project.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Routes

| Route      | Screen                                   |
|------------|------------------------------------------|
| `/`        | Login – choose one of the 4 portals      |
| `/shop`    | Customer ecommerce website               |
| `/admin`   | Super Admin panel with Order / Product / Billing tally |
| `/app`     | Customer mobile app (phone frame on desktop, full screen on mobile) |
| `/partner` | Partnership app for partner store owners |

The animated intro (splash) plays once per browser session. To see it again, open a new tab or run `sessionStorage.clear()` in the console.

## Libraries

- **framer-motion**: splash, page transitions, scroll reveal, hover/tap effects, layout animations
- **recharts**: tally charts (bar, stacked bar, donut, area, composed)
- **react-router-dom**: routing between portals
- **lucide-react**: icons

## Folder structure

```
src/
  App.jsx                 routes + splash
  context/CartContext.jsx shared cart (website + app)
  data/products.js        all 46 products (stock = real, price = SAMPLE)
  data/videos.js          demo videos + cart → video suggestion logic
  data/tally.js           SAMPLE tally numbers (replace with API)
  components/             Logo, Splash, Reveal (scroll animations), ProductCard, VideoModal, PhoneFrame
  pages/Login.jsx
  pages/shop/Shop.jsx
  pages/admin/Admin.jsx
  pages/app/CustomerApp.jsx
  pages/partner/PartnerApp.jsx
public/products/          product photos (46)
```

## To replace before going live

- **Prices** in `src/data/products.js` are sample rates.
- **Tally numbers** in `src/data/tally.js` are sample. Connect them to the backend API.
- **Logo**: `src/components/Logo.jsx` draws a brand mark. Put the official transparent logo in `public/logo.png` and use `<img src="/logo.png" />`.
- **Videos**: set `src` in `src/data/videos.js` to the uploaded MP4 URLs. The admin "Upload" form checks the 2-minute limit.
- **To confirm**: product #44 (steel round cup with pin) name and stock, and product #46 (mini chocolate mould) stock.
- **Login** is a prototype: any details work.
