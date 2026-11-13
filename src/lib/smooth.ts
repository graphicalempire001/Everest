import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Gentle inertia scrolling for mouse wheels (touch screens keep their own native momentum). */
export function initSmooth() {
  if (lenis || typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  const raf = (t: number) => { lenis?.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
export const smooth = { stop: () => lenis?.stop(), start: () => lenis?.start() };
