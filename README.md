# Adi Shakti Trader — Customer Website

React + Vite. White · beige · black editorial design with scroll animations. Responsive for mobile, tablet and laptop.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Pages

| Route          | Page |
|----------------|------|
| `/`            | Home + shop (hero, category index, new arrivals, all products, cake demos, how to order, visit store) |
| `/product/:id` | Product detail (options, quantity, demo video, related products) |
| `/login`       | Sign in / Create account |

## Animations

- **Intro**: plays once per browser session when the site first opens (wordmark rises, panel lifts away)
- **Scroll**: headlines rise line by line, images unmask with light parallax, the About paragraph lights up word by word as you scroll, and on laptop the New Arrivals section pins and scrolls sideways
- **Hover**: category list shows a floating image on laptop, product images zoom, buttons fill, links underline
- **Header** hides when scrolling down and returns when scrolling up, with a thin scroll-progress line on top

## Data

- `src/data/products.js`: all 46 products. Stock is real; **prices are sample**.
- `src/data/videos.js`: cake demo videos. Set `src` to the uploaded MP4 URL; until then the poster shows.
- Login is a prototype. Connect it to the backend in `src/pages/Login.jsx` (`submit`).

## Deploy

`vercel.json` (Vercel) and `public/_redirects` (Netlify) are included so routes like `/product/5` work after refresh.
