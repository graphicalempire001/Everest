import { useEffect, useRef, useState } from 'react';
import type { GItem } from '../lib/gallery';
import { smooth } from '../lib/smooth';
import PressButton from './PressButton';
import Reveal from './Reveal';

const SEEN = 'everestSwipeHintSeen';

function Viewer({ items, start, onClose }: { items: GItem[]; start: number; onClose: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const idx = useRef(start);
  const [i, setI] = useState(start);
  const [hint, setHint] = useState(() => { try { return items.length > 1 && !localStorage.getItem(SEEN); } catch { return false; } });

  const go = (n: number) => { const t = track.current; if (t) t.scrollTo({ left: Math.max(0, Math.min(items.length - 1, n)) * t.clientWidth, behavior: 'smooth' }); };

  useEffect(() => {
    const t = track.current!;
    t.scrollLeft = start * t.clientWidth;
    smooth.stop(); document.body.style.overflow = 'hidden';
    const opener = document.activeElement as HTMLElement | null;
    t.focus({ preventScroll: true });
    if (hint) { try { localStorage.setItem(SEEN, '1'); } catch { /* ignore */ } }
    const hide = setTimeout(() => setHint(false), 5200);
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(idx.current + 1); if (e.key === 'ArrowLeft') go(idx.current - 1); };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); clearTimeout(hide); document.body.style.overflow = ''; smooth.start(); opener?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const t = track.current!, n = Math.round(t.scrollLeft / t.clientWidth);
    if (n !== idx.current) { idx.current = n; setI(n); setHint(false); }
  };

  const arrow = 'absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-xl bg-paper text-2xl text-deep shadow-[0_14px_24px_-10px_rgba(0,0,0,.8)] transition hover:-translate-y-[55%] md:grid';
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] bg-[rgba(6,12,48,.97)]" data-lenis-prevent>
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 text-paper">
        <span className="font-semibold tabular-nums">{i + 1} / {items.length}</span>
        <PressButton onClick={onClose} variant="paper" size="sm">Close</PressButton>
      </div>
      <button type="button" aria-label="Previous picture" className={`${arrow} left-4`} onClick={() => go(i - 1)} disabled={i === 0}>‹</button>
      <button type="button" aria-label="Next picture" className={`${arrow} right-4`} onClick={() => go(i + 1)} disabled={i === items.length - 1}>›</button>

      <div ref={track} tabIndex={-1} onScroll={onScroll} className="no-bar flex h-full w-full snap-x snap-mandatory overflow-x-auto outline-none">
        {items.map((g) => (
          <div key={g.id} className="h-full w-full shrink-0 snap-center overflow-y-auto" data-lenis-prevent>
            <figure className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-5 pb-10 pt-20 text-center text-paper">
              {g.video
                ? <video src={g.video} poster={g.src} controls playsInline className="max-h-[58svh] max-w-full" />
                : <img src={g.src} alt={g.alt} className="max-h-[58svh] w-auto max-w-full object-contain shadow-[0_30px_50px_-20px_rgba(0,0,0,.9)]" />}
              <figcaption className="mt-7 max-w-xl">
                <strong className="font-display text-2xl md:text-3xl">{g.title}</strong>
                {g.caption && <span className="mt-2 block text-paper/85">{g.caption}</span>}
                <span className="mt-4 block text-sm text-paper/55">© Pastor Everest Chinakwaeze</span>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {hint && (
        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-30 flex justify-center" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-deep/85 px-8 py-6 text-paper shadow-[0_30px_50px_-20px_rgba(0,0,0,.9)]">
            <span className="hand text-6xl">👆</span>
            <span className="text-lg font-semibold">‹ Swipe to see more ›</span>
            <span className="text-sm text-paper/70">Each picture has its own description</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Boxes of images; tap one to open it full size with its description below. */
export default function Gallery({ items }: { items: GItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {items.map((g, n) => (
          <li key={g.id}>
            <Reveal delay={(n % 4) * 70}>
              <button type="button" onClick={() => setOpen(n)} aria-label={`Open: ${g.title}`} className="box group relative block aspect-square w-full">
                <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" className="h-full w-full object-cover object-top" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/90 to-transparent px-3 pb-3 pt-10 text-left text-sm font-semibold leading-tight text-paper">{g.title}</span>
                {g.video && <span className="absolute right-3 top-3 rounded-lg bg-deep/80 px-2.5 py-1 text-sm text-paper" aria-hidden="true">▶</span>}
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
      {open !== null && <Viewer items={items} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
