import PressButton from './PressButton';
import site from '../data/site.json';

/** Calm full-screen hero: the pastor's photo faded into the navy background, text on the left (top on phones). */
export default function Hero() {
  return (
    <section className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-deep text-paper">
      <img src="/images/pastor-everest-chinakwaeze.webp" width={900} height={1200} fetchPriority="high"
        alt="Pastor Everest Chinakwaeze ministering with a microphone at Ebenezer's Place International Ministry"
        className="hero-photo absolute bottom-0 right-0 -z-20 h-[66%] w-full object-cover object-[50%_14%] opacity-60 md:inset-y-0 md:h-full md:w-[58%] md:object-[50%_12%] md:opacity-65" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/40 to-transparent md:via-deep/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-deep to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pb-10 pt-28 md:justify-center md:gap-10 md:pb-0 md:pt-24">
        <div className="max-w-[34rem]">
          <p className="rise text-xs font-semibold uppercase tracking-[.22em] text-gold sm:text-sm">{site.church}</p>
          <h1 className="mt-4">
            <span className="rise rise-2 block font-script text-2xl italic text-gold sm:text-3xl">Pastor</span>
            <span className="rise rise-2 block font-classic text-[clamp(2rem,9vw,5.2rem)] font-semibold leading-[1.05] tracking-wide">Everest Chinakwaeze</span>
          </h1>
          <p className="rise rise-3 mt-4 max-w-[21rem] text-base leading-relaxed text-paper/90 sm:max-w-md sm:text-xl">Lead Pastor in Ughelli, Delta State. Come as you are, and encounter God in a place of divine help.</p>
        </div>
        <div className="rise rise-3 grid grid-cols-2 gap-3 md:flex md:gap-4">
          <PressButton to="/events" size="lg" className="!px-3 !py-3.5 !text-base md:!px-8 md:!py-4 md:!text-lg">See services</PressButton>
          <PressButton to="/contact" variant="ghost" size="lg" className="!px-3 !py-3.5 !text-base md:!px-8 md:!py-4 md:!text-lg">Plan your visit</PressButton>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-widest text-paper/60 md:flex" aria-hidden="true">SCROLL DOWN<span className="cue h-10 w-px bg-gold" /></div>
    </section>
  );
}
