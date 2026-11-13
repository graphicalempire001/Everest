import { useEffect, useRef, useState } from 'react';
import PressButton from './PressButton';
import { useStickyTop } from '../lib/useStickyTop';
import site from '../data/site.json';

/** Hero modelled on a "meet our minister" flyer: photo panel, dark text card, gold name tag and a service strip. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useStickyTop(root);

  // Text reveals only once fonts are ready, so nothing flashes before it animates
  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    const t = setTimeout(go, 1600);
    document.fonts?.ready.then(() => setTimeout(go, 150));
    return () => clearTimeout(t);
  }, []);

  const d = (n: number) => ({ ['--d' as string]: n });
  return (
    <section ref={root} className={`hero sticky top-0 isolate overflow-hidden bg-deep text-paper ${ready ? 'is-ready' : ''}`}>
      <img src="/images/hero-bg.webp" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-deep via-deep/90 to-royal/45" />
      <div className="pattern absolute inset-0 -z-10 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-14 pt-24">
        <div className="grid items-center gap-0 md:grid-cols-[.92fr_1.08fr] md:gap-8">
          {/* Photo panel with the gold name tag (tag sits on the background, never on his face) */}
          <div className="relative">
            <div className="relative aspect-[4/3.3] overflow-hidden rounded-[1.75rem] shadow-[0_34px_50px_-24px_rgba(0,0,0,.85)] md:aspect-auto md:h-[min(66svh,640px)]">
              <img src="/images/pastor-everest-smiling-at-the-pulpit.webp" width={1128} height={1232} fetchPriority="high"
                alt="Pastor Everest Chinakwaeze smiling and holding a microphone at Ebenezer's Place International Ministry, Ughelli"
                className="hero-img h-full w-full object-cover object-[50%_22%]" />
            </div>
            <div className="rv-fade torn absolute -top-4 left-3 z-20 -rotate-[7deg] bg-gold px-5 py-3 text-center text-xs font-extrabold uppercase leading-tight tracking-wide text-deep shadow-lg md:-left-3 md:text-sm" style={d(900)} aria-hidden="true">Lead Pastor<br />Ughelli, Delta State</div>
          </div>

          {/* Dark text card */}
          <div className="relative z-10 -mt-8 rounded-[1.75rem] bg-[#080f3c]/95 p-7 shadow-[0_34px_50px_-24px_rgba(0,0,0,.9)] md:mt-0 md:p-10">
            <p className="rv-track text-[11px] font-semibold uppercase text-gold sm:text-xs">Meet the pastor</p>
            <h1 className="mt-4" aria-label="Pastor Everest Chinakwaeze">
              <span className="rv-line" aria-hidden="true"><span className="block font-classic text-[clamp(1.5rem,6.6vw,2.6rem)] font-semibold leading-[1.1] tracking-wide text-white" style={d(300)}>Pastor Everest</span></span>
              <span className="rv-line" aria-hidden="true"><span className="block font-classic text-[clamp(1.5rem,6.6vw,2.6rem)] font-semibold leading-[1.1] tracking-wide text-gold" style={d(450)}>Chinakwaeze</span></span>
            </h1>
            <div className="rv-fade mt-5 h-px w-full bg-paper/60" style={d(700)} aria-hidden="true" />
            <p className="rv-fade mt-5 text-base leading-relaxed text-paper/90 sm:text-lg" style={d(850)}>
              <strong className="font-semibold text-gold">Pastor Everest Chinakwaeze</strong> is the Lead Pastor and General Overseer of {site.church} (EPI) in Ughelli, Delta State, Nigeria.
            </p>
            <p className="rv-fade mt-3 text-base leading-relaxed text-paper/80 sm:text-lg" style={d(1000)}>Come as you are, and encounter God in a place of divine help.</p>
            <div className="rv-fade mt-7 grid grid-cols-2 gap-3 sm:flex" style={d(1150)}>
              <PressButton to="/events" className="!px-3 !py-3.5 sm:!px-7">See services</PressButton>
              <PressButton to="/contact" variant="ghost" className="!px-3 !py-3.5 sm:!px-7">Plan your visit</PressButton>
            </div>
          </div>
        </div>

        {/* Service strip, like the date strip on the flyer */}
        <div className="rv-fade mt-8 flex justify-center drop-shadow-[0_16px_20px_rgba(0,0,0,.45)]" style={d(1350)}>
          <div className="torn bg-paper px-8 py-4 text-center text-deep">
            <p className="font-display text-lg font-extrabold md:text-xl"><span className="text-[#c98a00]">Encounter Service</span> | Thursdays 6:00 PM</p>
            <p className="text-sm font-bold uppercase tracking-wide">{site.church}</p>
            <p className="text-xs text-deep/70">72 Market Road, Ughelli, Delta State</p>
          </div>
        </div>
      </div>
    </section>
  );
}
