import { useEffect, useRef, useState } from 'react';
import PressButton from './PressButton';
import site from '../data/site.json';

/** Hero: his photo blended into the navy, name on the faded side (never over his face). Text reveals only once fonts are ready. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    const t = setTimeout(go, 1600);
    document.fonts?.ready.then(() => setTimeout(go, 150));
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; root.current?.style.setProperty('--p', String(Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8))))); });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  const d = (n: number) => ({ ['--d' as string]: n });
  return (
    <section ref={root} style={{ ['--p' as string]: 0 }} className={`hero sticky top-0 isolate h-[100svh] min-h-[620px] overflow-hidden bg-deep text-paper ${ready ? 'is-ready' : ''}`}>
      <div className="pattern absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
      <div className="absolute -left-32 top-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-royal/35 blur-3xl" aria-hidden="true" />

      <div className="hero-body relative flex h-full w-full flex-col pb-8 pt-[5.5rem] md:justify-center md:gap-10 md:pb-0 md:pt-24">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <div className="max-w-[32rem]">
            <p className="rv-track text-[11px] font-semibold uppercase text-gold sm:text-sm">{site.church}</p>
            <h1 className="mt-4" aria-label="Pastor Everest Chinakwaeze">
              <span className="rv-line" aria-hidden="true"><span className="font-script text-2xl italic text-gold sm:text-3xl" style={d(250)}>Pastor</span></span>
              <span className="rv-line" aria-hidden="true"><span className="font-classic text-[clamp(2rem,9vw,5rem)] font-semibold leading-[1.08] tracking-wide" style={d(420)}>Everest</span></span>
              <span className="rv-line" aria-hidden="true"><span className="font-classic text-[clamp(2rem,9vw,5rem)] font-semibold leading-[1.08] tracking-wide" style={d(580)}>Chinakwaeze</span></span>
            </h1>
            <p className="rv-fade mt-4 max-w-[21rem] text-base leading-relaxed text-paper/90 sm:max-w-md sm:text-xl" style={d(1000)}>Lead Pastor in Ughelli, Delta State. Come as you are, and encounter God in a place of divine help.</p>
          </div>
        </div>

        {/* His photo: on phones it sits between the text and the buttons; on larger screens it fills the right side */}
        <div className="relative my-3 min-h-0 flex-1 md:absolute md:inset-y-0 md:right-0 md:my-0 md:flex md:w-[66%] md:flex-none md:items-center">
          <img src="/images/pastor-everest-smiling-at-the-pulpit.webp" width={724} height={478} fetchPriority="high"
            alt="Pastor Everest Chinakwaeze smiling and holding a microphone at Ebenezer's Place International Ministry, Ughelli"
            className="hero-photo h-full w-full object-cover object-[70%_16%] md:h-auto md:object-contain" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <div className="rv-fade grid grid-cols-2 gap-3 md:flex md:gap-4" style={d(1250)}>
            <PressButton to="/events" size="lg" className="!px-3 !py-3.5 !text-base md:!px-8 md:!py-4 md:!text-lg">See services</PressButton>
            <PressButton to="/contact" variant="ghost" size="lg" className="!px-3 !py-3.5 !text-base md:!px-8 md:!py-4 md:!text-lg">Plan your visit</PressButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-widest text-paper/60 md:flex" aria-hidden="true">SCROLL DOWN<span className="cue h-10 w-px bg-gold" /></div>
    </section>
  );
}
