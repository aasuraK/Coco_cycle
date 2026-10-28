# CocoCycle — GitHub Pages Website

A responsive **B2C concept showroom + B2B partnership landing page** for CocoCycle's proposed Goa pilot. Built with plain HTML, CSS, and JavaScript. **No npm, frameworks, build process, database, or paid hosting required.**

## Quick start

1. Extract this ZIP and open `index.html` in a browser. The website works locally.
2. **Required before you go live:** open `app.js`, find:
   ```js
   const CONFIG = { contactEmail: 'YOUR_EMAIL@example.com' };
   ```
   Replace `YOUR_EMAIL@example.com` with your own business email address. Otherwise the form deliberately blocks sending and shows an explanation.
3. Create a public repository on GitHub. For `https://YOUR_USERNAME.github.io/` name the repository `YOUR_USERNAME.github.io`. For a project URL (`https://YOUR_USERNAME.github.io/cococycle/`), name it `cococycle`.
4. Upload **the contents of this folder** (so `index.html` is at the repository root) and commit them to `main`.
5. In the repository, visit **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, `main`, `/(root)`, then Save.
6. Use the Pages URL shown by GitHub. Publishing may take several minutes.

Official guide: https://docs.github.com/en/pages/quickstart

## What's included

- Responsive marketing home, story, circular process and vision sections
- **B2C concept catalog:** 8 concept products, category filters and crisp vector concept illustrations
- **Inquiry basket:** add/remove products, persistent via localStorage, transfer selections into inquiry form
- **B2B:** collection partners, bulk procurement, institutional/custom orders, and interest prefill
- **Contact form:** validates visitor inputs and prepares an email through the visitor's email application (`mailto:`)
- **Cost model:** adjustable monthly throughput / operating cost and dynamically calculated operating cost per input kilogram; fixed and monthly baseline cost tables
- Accessible labels and keyboard functionality; basic SEO metadata and vector favicon

## Important limitations — honest product status

- GitHub Pages is **static hosting**, so the site does not process payments, send emails from a server, maintain stock levels, track order status, or store submitted inquiries. **The form only opens the visitor's email app**; visitors must send the message themselves. Some devices have no email client configured.
- The basket is **not a checkout**. It stores prospective product interests only on the visitor's device.
- The products shown are **exploratory concepts**, not confirmed inventory, regulatory certifications, verified specifications or delivery promises. No prices were invented.
- The financial model uses **assumptions**, not vendor quotations. Baseline monthly input 3,000 kg, monthly operating cost ₹60,000, initial setup ₹2,00,000. The calculator divides the user-entered total operating cost by throughput. It does not automatically scale costs with volume; the detailed cost breakdown remains at the original baseline. Baseline breakdown is collection ₹4/kg and other operating costs ₹16/kg.
- Operating cost excludes depreciation, financing, taxes, output conversion yield and product fulfillment economics.

## Customization

- Brand/content: `index.html`
- Colors, typography and responsive styling: `styles.css`
- Product concepts: `PRODUCTS` array in `app.js` — names, categories, copy, artwork style
- Setup and monthly cost tables: `FIXED` and `MONTHLY` arrays in `app.js`
- Contact destination email: `CONFIG.contactEmail` in `app.js`
- Branding icon: `assets/favicon.svg`

## Connecting real forms / e-commerce later

For reliably delivered forms without requiring an email app, connect a hosted form endpoint (such as Formspree) and update the submit handler; review the provider's terms and spam protection. For real orders, pricing and payment use a secure hosted-commerce/payment checkout (for example Shopify or a payment provider) and a backend/service to validate orders. **Never put API secrets, private keys or payment credentials in these public static files.**

## Assets (visual refresh)

All imagery is now **hand-built vector artwork** (`assets/*.svg`): a hero scene, a Goa beach scene and eight product illustrations. SVGs stay perfectly sharp on any screen (including retina and mobile), load fast, and have gentle built-in motion (swaying palms, drifting waves, glowing lamps). They respect the visitor's reduced-motion setting.

They are **conceptual illustrations, not photographs of real CocoCycle products**; the site says so in captions and footer. For launch, replace them with real product photos (keep the same file names, or update `image:` in the `PRODUCTS` array in `app.js`).

The earlier blurry `.webp` files (cropped from a mockup, with stray text baked in) were removed. The notebook-page photos from your original uploads are still deliberately not used.

## What changed in this version

- Sharp vector artwork replaces blurry raster images
- New logo mark, favicon, refined typography, spacing and colour
- Scroll-reveal animations, animated counters, tilt-on-hover hero, marquee, parallax vision band, scroll-progress bar, active-section nav, back-to-top
- Better mobile layout and animated hamburger menu
- Product filters show counts; basket shows thumbnails
- Cost explorer now shows how your assumption compares with the ₹20/kg baseline
- Contact form gains a "Copy message" button (useful if the visitor has no email app)
- Respects `prefers-reduced-motion`; works without JavaScript animations

## Files

- `index.html` — page structure and content
- `styles.css` — design and responsive layout
- `app.js` — catalog, filters, basket, inquiry routing, calculator, animations
- `assets/` — SVG artwork and `favicon.svg`
- `.nojekyll` — tells GitHub Pages to publish files directly
- `404.html` — navigation back to the homepage
