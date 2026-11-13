import { useSeo } from '../lib/seo';
import { events, isUpcoming } from '../data/events';
import { useGallery, eventItems } from '../lib/gallery';
import site from '../data/site.json';
import Hero from '../components/Hero';
import Scripture from '../components/Scripture';
import StackCard from '../components/StackCard';
import Title from '../components/Title';
import CardStack from '../components/CardStack';
import EventCard from '../components/EventCard';
import PressButton, { FbIcon } from '../components/PressButton';
import Reveal from '../components/Reveal';
import Standing from '../components/Standing';

export default function Home() {
  useSeo('/');
  const gallery = useGallery();
  const next = events.find(isUpcoming);
  const previous = eventItems(events.filter((e) => e !== next), gallery);

  return (
    <>
      <Hero />

      <StackCard z={10} first>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_1.2fr] md:gap-16" aria-labelledby="welcome">
          <Reveal className="mx-auto w-full max-w-md">
            <Standing />
          </Reveal>
          <Reveal delay={120}>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-royal">Welcome</p>
            <h2 id="welcome" className="mt-3 text-3xl font-extrabold md:text-5xl">Who is Pastor Everest Chinakwaeze?</h2>
            <p className="mt-5">Pastor Everest Chinakwaeze is the Lead Pastor and General Overseer of <strong>{site.church}</strong> (EPI), a pastor in Ughelli, Delta State, Nigeria, serving a church known as a place of divine help.</p>
            <p className="mt-4">Ebenezer means <strong>“stone of help.”</strong> That is the heart of this ministry: a place where people meet God in worship and the Word, find help, and leave with fresh hope.</p>
            <div className="mt-8"><PressButton to="/about" variant="royal">More about Pastor Everest</PressButton></div>
          </Reveal>
        </div>
        <dl className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-y-10 px-5 text-center sm:grid-cols-3 sm:gap-x-6" aria-label="At a glance">
          {[['Lead Pastor', 'Ebenezer’s Place'], ['Thursdays', 'Encounter Service, 6:00 PM'], ['Ughelli', 'Delta State, Nigeria']].map(([k, v]) => (
            <div key={k}><dt className="font-classic text-3xl font-semibold text-royal md:text-4xl">{k}</dt><dd className="mt-2 text-deep/75">{v}</dd></div>
          ))}
        </dl>
      </StackCard>

      <StackCard z={12} bg="bg-royal"><div className="mx-auto max-w-3xl px-5"><Scripture /></div></StackCard>

      <StackCard z={14}>
        <div className="mx-auto max-w-6xl px-5" aria-labelledby="updates">
          <Title eyebrow="Services & updates" id="updates">{next ? 'Join us at the next service' : 'Services and updates'}</Title>
          {next && <Reveal><EventCard e={next} featured /></Reveal>}
          {previous.length > 0 && (
            <div className="mt-24">
              <h3 className="text-center text-2xl font-extrabold md:text-4xl">Previous services</h3>
              <p className="mt-2 text-center text-deep/70">Swipe through recent services</p>
            </div>
          )}
        </div>
        {previous.length > 0 && <CardStack items={previous} />}
        <div className="mt-10 text-center"><PressButton to="/events" variant="royal" size="lg">All services and events</PressButton></div>
      </StackCard>

      <StackCard z={16} bg="bg-stone">
        <div className="mx-auto max-w-6xl px-5"><Title eyebrow="Gallery" id="moments">Moments and messages</Title></div>
        <CardStack items={gallery} />
        <div className="mt-10 text-center"><PressButton to="/catalog" variant="royal" size="lg">Open the full gallery</PressButton></div>
      </StackCard>

      <StackCard z={18} className="!pb-20">
        <div className="mx-auto max-w-6xl px-5" aria-labelledby="contact">
          <Title eyebrow="Contact" id="contact">Visit Ebenezer’s Place</Title>
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <p className="font-bold">{site.church}</p>
              <address className="mt-1 not-italic">{site.address}.</address>
              <p className="mt-4"><strong>Encounter Service:</strong> Thursdays at 6:00 PM</p>
              <p className="mt-1"><strong>Call Pastor Everest:</strong> <a className="font-bold text-royal underline underline-offset-4" href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <PressButton href={`tel:${site.phone}`} size="lg">Call now</PressButton>
                <PressButton href={site.mapsUrl} variant="royal" size="lg">Get directions</PressButton>
                <PressButton href={site.facebookUrl} variant="facebook" size="lg" className="sm:col-span-2"><FbIcon />Follow on Facebook</PressButton>
              </div>
            </div>
            <iframe title="Map to Ebenezer's Place International Ministry, Ughelli" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent("Ebenezer's Place Int'l, 72 Market Rd, Ughelli 333105, Delta")}&output=embed`}
              className="card h-72 w-full border-0 md:h-96" />
          </div>
        </div>
      </StackCard>
    </>
  );
}
