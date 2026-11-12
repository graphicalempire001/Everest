// Runs after `vite build`: writes sitemap.xml, robots.txt and one HTML file per route
// with its own title, description and canonical, so Google and social apps see the right
// tags even before JavaScript runs.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
const routes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/routes.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'));
// Optional: include admin-uploaded pictures in the image sitemap (needs the two env vars at build time)
let remote = [];
const SB = process.env.VITE_SUPABASE_URL, KEY = process.env.VITE_SUPABASE_ANON_KEY;
if (SB && KEY) {
  try {
    const res = await fetch(`${SB}/rest/v1/gallery_items?select=title,caption,image_path&published=eq.true`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (res.ok) remote = (await res.json()).map((i) => ({ src: `${SB}/storage/v1/object/public/gallery/${i.image_path}`, title: i.title, caption: i.caption || '' }));
  } catch { /* sitemap still builds without them */ }
}
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const r of routes) {
  const url = site.siteUrl + (r.path === '/' ? '' : r.path);
  let html = base
    .replace(/<title>.*?<\/title>/s, `<title>${esc(r.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/(<meta name="keywords" content=")[^"]*(")/, `$1${esc(r.keywords || '')}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
    .replace(/<noscript>.*?<\/noscript>/s, `<noscript><h1>${esc(r.h1)}</h1>${r.body || `<p>${esc(r.description)}</p>`}</noscript>`);
  if (r.path !== '/') {
    fs.mkdirSync(path.join(dist, r.path), { recursive: true });
    fs.writeFileSync(path.join(dist, r.path, 'index.html'), html);
  } else fs.writeFileSync(path.join(dist, 'index.html'), html);
}

const imgs = (r) => (r.path === '/catalog' ? [...remote, ...catalog.map((i) => ({ ...i, src: site.siteUrl + i.src }))] : r.path === '/' ? catalog.slice(0, 1) : []).map((i) =>
  `\n    <image:image><image:loc>${i.src.startsWith('http') ? i.src : site.siteUrl + i.src}</image:loc><image:title>${esc(i.title)}</image:title><image:caption>${esc(i.caption)}</image:caption></image:image>`).join('');
const urls = routes.map((r) => `  <url><loc>${site.siteUrl}${r.path === '/' ? '/' : r.path}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>${r.path === '/' ? '1.0' : '0.8'}</priority>${imgs(r)}\n  </url>`).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
console.log(`postbuild: ${routes.length} pages, sitemap and robots written for ${site.siteUrl}`);
