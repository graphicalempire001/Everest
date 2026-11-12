import { useEffect, useRef } from 'react';

/** Large text whose words light up as you scroll down, and fade back as you scroll up. */
export default function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const words = [...el.querySelectorAll<HTMLElement>('.sw')];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      words.forEach((w, i) => w.style.setProperty('--v', String(Math.min(1, Math.max(0, p * words.length * 1.1 - i)))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [text]);
  return <p ref={ref} className={className}>{text.split(' ').map((w, i) => <span key={i}><span className="sw">{w}</span>{' '}</span>)}</p>;
}
