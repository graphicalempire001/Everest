import { useEffect, useRef, useState } from 'react';
import PressButton from './PressButton';

export interface StackItem { id: string; src: string; w: number; h: number; title: string; caption: string; alt: string; video?: string }

/** Swipeable row of overlapping, frameless cards; the card in the middle rises to the front. */
export default function CardStack({ items }: { items: StackItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const update = () => {
    const t = track.current; if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2; let best = 0, bestD = 1e9;
    [...t.children].forEach((node, i) => {
      const el = node as HTMLElement, d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth, a = Math.min(Math.abs(d), 1.6);
      el.style.transform = `scale(${1 - a * 0.1}) rotate(${d * 3.5}deg)`;
      el.style.opacity = String(1 - Math.min(a, 1.4) * 0.3);
      el.style.zIndex = String(50 - Math.round(a * 10));
      if (a < bestD) { bestD = a; best = i; }
    });
    setActive((p) => (p === best ? p : best));
  };
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []);

  const move = (dir: number) => { const t = track.current!; const w = (t.children[0] as HTMLElement).offsetWidth * 0.7; t.scrollBy({ left: dir * w, behavior: 'smooth' }); };

  return (
    <div>
      <div ref={track} onScroll={update} tabIndex={0} aria-label="Swipe through photos and flyers"
        className="no-bar flex snap-x snap-mandatory items-center overflow-x-auto px-[18vw] py-10 md:px-[30vw]">
        {items.map((it, i) => (
          <figure key={it.id} className={`card h-[17rem] shrink-0 snap-center bg-deep transition-opacity md:h-[26rem] ${i ? '-ml-12 md:-ml-20' : ''} relative`} style={{ aspectRatio: `${it.w} / ${it.h}` }}>
            <img src={it.src} alt={it.alt} loading="lazy" draggable={false} className="h-full w-full object-cover" />
            {it.video && <span className="absolute inset-0 grid place-items-center" aria-hidden="true"><span className="rounded-full bg-deep/75 px-5 py-3 text-2xl text-paper">▶</span></span>}
          </figure>
        ))}
      </div>
      <div className="mx-auto mt-2 max-w-xl px-5 text-center">
        <p className="font-display text-xl font-semibold" aria-live="polite">{items[active]?.title}</p>
        <div className="mt-5 flex justify-center gap-4">
          <PressButton variant="royal" onClick={() => move(-1)}>‹ Previous</PressButton>
          <PressButton variant="royal" onClick={() => move(1)}>Next ›</PressButton>
        </div>
      </div>
    </div>
  );
}
