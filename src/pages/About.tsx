import PressButton from '../components/PressButton';
import CardStack from '../components/CardStack';
import { useGallery } from '../lib/gallery';
import ScrollText from '../components/ScrollText';
import { useSeo } from '../lib/seo';
import faqs from '../data/faq.json';
import site from '../data/site.json';

export default function About() {
  useSeo('/about');
  const gallery = useGallery();
  return (
    <>
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_1.3fr] md:py-24">
      <img src="/images/pastor-everest-smiling-at-the-pulpit.webp" width={724} height={478} loading="eager"
        alt="Pastor Everest Chinakwaeze at Ebenezer's Place International Ministry in Ughelli"
        className="morph aspect-[4/5] w-full object-cover object-[68%_14%] md:sticky md:top-28 md:self-start" />
      <div className="max-w-xl">
        <h1 className="text-5xl font-extrabold md:text-6xl">About Pastor Everest Chinakwaeze</h1>
        <p className="mt-6">Pastor Everest Chinakwaeze, also addressed as Evang. Everest Chinakwaeze, is the Lead Pastor and General Overseer of {site.church} (EPI), a pastor in Ughelli, Delta State, Nigeria.</p>
        <p className="mt-4">He leads a church known as “a place of divine help,” gathering people for Encounter Services, monthly themes and special programs, and welcoming guest ministers to share the Word.</p>
        <h2 className="mt-12 text-3xl font-extrabold">The church he serves</h2>
        <p className="mt-4">{site.church} is located at {site.address}. In December 2026 the church celebrates its third anniversary under the theme “The Stone of Help.”</p>
        <h2 className="mt-14 text-3xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl bg-white p-5 shadow-[0_18px_24px_-18px_rgba(10,20,80,.5)]">
              <summary className="cursor-pointer list-none font-display text-lg font-bold text-deep marker:hidden">{f.q}</summary>
              <p className="mt-3 text-deep/85">{f.a}</p>
            </details>
          ))}
        </div>
        <ScrollText className="mt-14 font-display text-3xl font-bold leading-snug md:text-4xl" text="Everyone is welcome. Come as you are, find help, and meet God in a place of divine help." />
        <div className="mt-10 flex flex-wrap gap-4">
          <PressButton to="/events">See services</PressButton>
          <PressButton to="/contact" variant="royal">Plan your visit</PressButton>
        </div>
      </div>
    </div>
      <section className="overflow-hidden bg-stone py-20" aria-labelledby="moments">
        <h2 id="moments" className="px-5 text-center text-3xl font-extrabold md:text-5xl">Moments and messages</h2>
        <CardStack items={gallery} />
      </section>
    </>
  );
}
