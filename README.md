# Pastor Everest Chinakwaeze: website

React + Vite + Tailwind. Pages: Home, About, Services and events, Visit.

## Before you deploy (important)
1. Open `src/data/site.json` and replace `siteUrl` with the real domain (no trailing slash).
   This one line feeds canonical tags, the sitemap, robots.txt and structured data.
2. Fill `facebookUrl`, `phone` and `email` in the same file (blank fields are hidden).

## Everyday edits
- New event: add it at the top of `src/data/events.ts` and put its flyer in `public/images/`.
  Events with a `start` date in the future show as "Coming up"; past ones move to "Recent" automatically.
- Page titles and descriptions: `src/data/routes.json`.

## Commands
    npm install
    npm run dev      # local preview
    npm run build    # builds + writes sitemap.xml, robots.txt and one HTML file per page

## Deploy on Vercel
Import the repo; Vercel reads `vercel.json`. Build command `npm run build`, output `dist`.

## Get indexed on Google
1. Add the domain in Google Search Console and submit `/sitemap.xml`.
2. Use "Request indexing" on the home page.
3. Create a Google Business Profile for the church (address, Thursday service time, photos) and link this site.

## Admin and gallery uploads (Supabase)
1. Create a free project at supabase.com.
2. SQL Editor > New query > paste `supabase/migration.sql` > Run.
3. Authentication > Users > Add user (your email + a strong password).
4. Run the last line of the SQL file (the `insert into public.admins ...`) with that email.
5. Project Settings > API: copy the Project URL and the anon public key into Vercel > Environment Variables as
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`), then redeploy.
6. Sign in at `/admin`. Pictures convert to WebP in the browser before upload; videos get a WebP cover.
   New uploads appear on the Catalog page and the home swipe cards straight away, and in the image sitemap on the next deploy.
