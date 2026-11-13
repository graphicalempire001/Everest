import { useEffect } from 'react';
import site from '../data/site.json';
import routes from '../data/routes.json';

export const SITE_URL = site.siteUrl;

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(attr, value);
}
const meta = (key: string, value: string, by: 'name' | 'property' = 'name') =>
  setTag(`meta[${by}="${key}"]`, () => { const m = document.createElement('meta'); m.setAttribute(by, key); return m; }, 'content', value);

/** Sets title, description, canonical, social tags and robots for a route in routes.json. */
export function useSeo(path: string, opts: { noindex?: boolean; jsonLd?: object[]; title?: string } = {}) {
  const r = routes.find((x) => x.path === path);
  const title = opts.title ?? r?.title ?? `Page not found | ${site.name}`;
  const description = r?.description ?? 'This page could not be found.';
  const jsonLd = JSON.stringify(opts.jsonLd ?? []);
  useEffect(() => {
    const url = SITE_URL + (path === '/' ? '' : path);
    document.title = title;
    meta('description', description);
    if (r?.keywords) meta('keywords', r.keywords);
    meta('robots', opts.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setTag('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l; }, 'href', url);
    if (r?.image) { const img = SITE_URL + r.image; meta('og:image', img, 'property'); meta('twitter:image', img); meta('og:image:alt', r.imageAlt, 'property'); meta('twitter:image:alt', r.imageAlt); }
    meta('og:type', r?.ogType ?? 'website', 'property');
    meta('og:title', title, 'property'); meta('og:description', description, 'property'); meta('og:url', url, 'property');
    meta('twitter:title', title); meta('twitter:description', description);
    const added = (JSON.parse(jsonLd) as object[]).map((o) => {
      const s = document.createElement('script'); s.type = 'application/ld+json';
      s.text = JSON.stringify(o).replace(/</g, '\\u003c'); document.head.appendChild(s); return s;
    });
    return () => added.forEach((s) => s.remove());
  }, [path, title, description, opts.noindex, jsonLd, r?.keywords]);
}

/** BreadcrumbList structured data (Home > Page) */
export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE_URL + (it.path === '/' ? '' : it.path) })),
});
