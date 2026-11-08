# Adi Shakti Trader — Customer Website

React + Vite quick-shop website. Layout follows the popular quick-commerce pattern (search-first header, category tiles, product rows with ADD → − qty + stepper, floating cart bar on mobile) in Adi Shakti's own brand colours (chocolate brown, raspberry, cream).

## Run

```bash
npm install
npm run dev
```

## Pages

| Route | Page |
|---|---|
| `/` | Home: banner, promo cards, category tiles, product rows, demo videos |
| `/category/:slug` | Category page with side menu and product grid (`/category/all`, `/category/new-arrivals`, `/category/cake-toppers`, ...) |
| `/search?q=` | Live search results (type in the header search) |
| `/product/:id` | Product page: options, ADD stepper, demo video, details, similar products |
| `/login` | Opens the login popup (mobile number → OTP → name). Any 4-digit OTP works in the prototype |

## Notes

- **Prices** in `src/data/products.js` are sample. Stock figures come from the store list.
- **Videos**: set `src` in `src/data/videos.js` to the uploaded MP4 URLs.
- **Cart** shows bill details and suggests a cake demo video based on the items in it.
- `vercel.json` and `public/_redirects` are included so routes work after deploy and refresh.
