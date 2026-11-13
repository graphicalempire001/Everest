import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import site from '../data/site.json';
import PressButton, { FbIcon } from './PressButton';
import Related from './Related';
import { initSmooth, smooth } from '../lib/smooth';

const links = [
  { to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/events', label: 'Services' },
  { to: '/catalog', label: 'Catalog' }, { to: '/contact', label: 'Visit' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { initSmooth(); }, []);
  useEffect(() => { setOpen(false); setHidden(false); window.scrollTo(0, 0); }, [pathname]);

  // Slides away while scrolling down, returns the moment you scroll up
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) { setHidden(y > last && y > 140); last = y; }
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) smooth.stop(); else smooth.start();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open]);

  const item = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-2 text-[15px] font-semibold transition-colors ${isActive ? 'bg-royal/10 text-royal' : 'text-deep hover:bg-deep/5 hover:text-royal'}`;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:bg-paper focus:p-3">Skip to content</a>

      <header className={`fixed inset-x-0 top-0 z-50 bg-white text-deep shadow-[0_10px_30px_-14px_rgba(10,20,80,.45)] transition-transform duration-500 ease-out ${hidden && !open ? '-translate-y-full' : ''}`}>
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="Pastor Everest Chinakwaeze, home">
            <img src="/images/ep1-logo.webp" width={512} height={512} alt="EP1 Ebenezer's Place logo" className="h-14 w-14 object-contain" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => <NavLink key={l.to} to={l.to} end className={item}>{l.label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Pastor Everest on Facebook" className="hidden h-11 w-11 place-items-center rounded-lg text-royal transition hover:bg-royal/10 sm:grid"><FbIcon /></a>
            <PressButton to="/contact" size="sm" variant="royal" className="hidden sm:inline-flex">Plan a visit</PressButton>
            <button className="grid h-11 w-11 place-items-center rounded-lg text-deep transition hover:bg-deep/5 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
              <span className="bars" data-open={open}><span /><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="fixed inset-0 z-40 flex flex-col overflow-auto bg-white px-6 pb-10 pt-28 lg:hidden" data-lenis-prevent>
          <div className="space-y-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end onClick={() => setOpen(false)}
                className={({ isActive }) => `block rounded-xl px-4 py-4 font-display text-3xl font-bold ${isActive ? 'bg-royal/10 text-royal' : 'text-deep'}`}>{l.label}</NavLink>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <PressButton href={site.facebookUrl} variant="facebook" size="lg"><FbIcon />Follow on Facebook</PressButton>
            <PressButton href={site.mapsUrl} variant="royal" size="lg">Get directions to the church</PressButton>
          </div>
        </nav>
      )}

      <main id="main" className={pathname === '/' ? '' : 'pt-[4.5rem]'}><Outlet /></main>
      {['/about', '/events', '/catalog', '/contact'].includes(pathname) && <Related current={pathname} />}

      <footer className={`relative bg-deep text-paper ${pathname === '/' ? '' : 'mt-24'}`}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src="/images/ep1-logo.webp" width={512} height={512} alt="EP1 Ebenezer's Place logo" loading="lazy" className="mb-4 h-16 w-16 rounded-xl bg-white object-contain p-1.5" />
            <p className="font-display text-xl font-bold">Pastor Everest Chinakwaeze</p>
            <p className="mt-2 max-w-sm text-paper/75">Lead Pastor, {site.church}. {site.tagline}.</p>
            <address className="mt-4 max-w-sm not-italic text-paper/75">{site.address}.</address>
            <p className="mt-3 text-paper/75">Call: <a className="font-semibold text-paper underline underline-offset-4 hover:text-gold" href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p>
          </div>
          <div>
            <p className="font-display text-lg font-bold">Navigation</p>
            <ul className="mt-3 space-y-2 text-paper/75">
              {links.map((l) => <li key={l.to}><Link className="hover:text-gold" to={l.to}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="font-display text-lg font-bold">Quick links</p>
            <ul className="mt-3 space-y-2 text-paper/75">
              <li><a className="hover:text-gold" href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a className="hover:text-gold" href={site.mapsUrl} target="_blank" rel="noopener noreferrer">Directions to the church</a></li>
              <li><Link className="hover:text-gold" to="/events">Previous services</Link></li>
              <li><Link className="hover:text-gold" to="/catalog">Photo catalog</Link></li>
            </ul>
          </div>
        </div>
        <p className="bg-black/25 px-5 py-5 text-center text-sm text-paper/60">© {new Date().getFullYear()} Pastor Everest Chinakwaeze. All rights reserved. All photos and content on this site belong to Pastor Everest Chinakwaeze.</p>
      </footer>
    </>
  );
}
