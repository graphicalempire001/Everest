import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';
import { events, isUpcoming } from '../data/events';
import { useGallery } from '../lib/gallery';
import site from '../data/site.json';
import Hero from '../components/Hero';
import Scripture from '../components/Scripture';
import PressButton, { FbIcon } from '../components/PressButton';
import Reveal from '../components/Reveal';

const Title = ({ eyebrow, children, id }: { eyebrow: string; children: string; id?: string }) => (
  <div className="mb-12 text-center">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-royal">{eyebrow}</p>
    <h2 id={id} className="mt-3 text-3xl font-extrabold md:text-5xl">{children}</h2>
  </div>
);

export default function Home() {
  useSeo('/');
  const gallery = useGallery().slice(0, 6);
  const next = events.find(isUpcoming);
  const cards = [...(next ? [next] : []), ...events.filter((e) => e !== next)].slice(0, 3);

  return (
    <>
      <Hero />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-[1fr_1.2fr] md:gap-16" aria-labelledby="welcome">
        <Reveal><img src="/images/pastor-everest-chinakwaeze.webp" alt="Pastor Everest Chinakwaeze, Lead Pastor of Ebenezer's Place International Ministry" loading="lazy" className="card aspect-[4/5] w-full object-cover object-top" /></Reveal>
        <Reveal delay={100}>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-royal">Welcome</p>
          <h2 id="welcome" className="mt-3 text-3xl font-extrabold md:text-5xl">Who is Pastor Everest Chinakwaeze?</h2>
          <p className="mt-5">Pastor Everest Chinakwaeze is the Lead Pastor and General Overseer of <strong>{site.church}</strong> (EPI), a pastor in Ughelli, Delta State, Nigeria, serving a church known as a place of divine help.</p>
          <p className="mt-4">Ebenezer means <strong>“stone of help.”</strong> That is the heart of this ministry: a place where people meet God in worship and the Word, find help, and leave with fresh hope.</p>
          <div className="mt-8"><PressButton to="/about" variant="royal">More about Pastor Everest</PressButton></div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24" aria-label="At a glance">
        <dl className="grid grid-cols-1 gap-y-10 text-center sm:grid-cols-3 sm:gap-x-6">
          {[['Lead Pastor', 'Ebenezer’s Place'], ['Thursdays', 'Encounter Service, 6:00 PM'], ['Ughelli', 'Delta State, Nigeria']].map(([k, v]) => (
            <div key={k}><dt className="font-classic text-3xl font-semibold text-royal md:text-4xl">{k}</dt><dd className="mt-2 text-deep/75">{v}</dd></div>
          ))}
        </dl>
      </section>

      <Scripture />

      <section className="mx-auto max-w-6xl px-5 py-24" aria-labelledby="updates">
        <Title eyebrow="Services & updates" id="updates">Join us at the next service</Title>
        <div className="grid gap-10 md:grid-cols-3">
          {cards.map((e, i) => (
            <Reveal key={e.slug} delay={i * 100}>
              <article>
                <img src={e.flyer} alt={e.flyerAlt} loading="lazy" className="card aspect-[4/3] w-full object-cover" />
                <p className="mt-5 text-sm font-bold uppercase tracking-wider text-royal">{e === next ? 'Coming up' : 'Previous service'}</p>
                <h3 className="mt-1 text-2xl font-bold">{e.title}</h3>
                <p className="mt-1 text-deep/70">{[e.dateLabel, e.time].filter(Boolean).join(', ')}</p>
                <Link to="/events" className="mt-3 inline-block font-bold text-royal underline underline-offset-4 hover:text-deep">Read more</Link>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center"><PressButton to="/events" variant="royal" size="lg">All services and events</PressButton></div>
      </section>

      <section className="bg-stone py-24" aria-labelledby="photos">
        <div className="mx-auto max-w-6xl px-5">
          <Title eyebrow="Photo gallery" id="photos">Moments and messages</Title>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {gallery.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 80}>
                <img src={g.src} alt={g.alt} loading="lazy" className="card aspect-square w-full object-cover object-top" />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center"><PressButton to="/catalog" variant="royal" size="lg">Open the full catalog</PressButton></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24" aria-labelledby="contact">
        <Title eyebrow="Contact" id="contact">Visit Ebenezer’s Place</Title>
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <p className="font-bold">{site.church}</p>
            <address className="mt-1 not-italic">{site.address}.</address>
            <p className="mt-4"><strong>Encounter Service:</strong> Thursdays at 6:00 PM</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PressButton href={site.mapsUrl} variant="royal" size="lg">Get directions</PressButton>
              <PressButton href={site.facebookUrl} variant="facebook" size="lg"><FbIcon />Facebook</PressButton>
            </div>
          </div>
          <iframe title="Map to Ebenezer's Place International Ministry, Ughelli" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent("Ebenezer's Place Int'l, 72 Market Rd, Ughelli 333105, Delta")}&output=embed`}
            className="card h-72 w-full border-0 md:h-80" />
        </div>
      </section>
    </>
  );
}
