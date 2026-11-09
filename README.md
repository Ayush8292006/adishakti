# Adi Shakti Trader — Customer Website

React + Vite online store for baking tools & accessories. Bakery-supplies store layout (announcement bar, search header, All Categories mega menu, hero slider, category tiles, tabbed product sections, promo banners, trust strip, newsletter footer) in Adi Shakti's own branding (chocolate brown, raspberry, cream).

## Run

```bash
npm install
npm run dev
```

## Pages

| Route | Page |
|---|---|
| `/` | Home: hero slider, trust strip, Shop by Category, What's New, Our Baking Products (tabs), promo banners, baking tools block, moulds (tabs), cake demo videos, Cake Toppers carousel, Recently Viewed, wholesale call band |
| `/category/:slug` | Collection page with sidebar filters (category, price, in stock) and sort. Mobile: Filter drawer |
| `/search?q=` | Search results (header search also shows live suggestions) |
| `/product/:id` | Product page: hover-zoom image, options, quantity, Add to cart / Buy it now, cake demo video, description accordions, You may also like, Recently viewed |
| `/login` | Opens the Sign in / Create account popup |

## Notes

- Prices in `src/data/products.js` are **sample**. Stock comes from the store list.
- Set `src` in `src/data/videos.js` to the uploaded demo MP4 URLs.
- Login and newsletter are prototypes. Connect them to the backend.
- `vercel.json` / `public/_redirects` keep routes working after refresh on Vercel / Netlify.
