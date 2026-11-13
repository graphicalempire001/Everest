import { useLayoutEffect, type RefObject } from 'react';

/** Pins a tall block when its BOTTOM reaches the bottom of the screen (so it can be read in full),
 *  and a short block at the top, so the next card can slide over it. */
export function useStickyTop(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => { el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`; };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener('resize', set);
    return () => { ro.disconnect(); window.removeEventListener('resize', set); };
  }, [ref]);
}
