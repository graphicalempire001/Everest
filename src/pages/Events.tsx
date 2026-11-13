import { useSeo, SITE_URL } from '../lib/seo';
import { events, isUpcoming } from '../data/events';
import site from '../data/site.json';
import EventCard from '../components/EventCard';
import CardStack from '../components/CardStack';
import { useGallery, eventItems } from '../lib/gallery';
import Reveal from '../components/Reveal';

export default function Events() {
  const upcoming = events.filter(isUpcoming);
  const past = events.filter((e) => !isUpcoming(e));
  const stack = eventItems(past, useGallery());
  useSeo('/events', {
    jsonLd: upcoming.map((e) => ({
      '@context': 'https://schema.org', '@type': 'Event', name: e.title,
      description: e.theme ? `${e.title}. Theme: ${e.theme}.` : e.title,
      startDate: e.start, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
      image: SITE_URL + e.flyer,
      location: { '@type': 'Place', name: site.church, hasMap: site.mapsUrl, address: { '@type': 'PostalAddress', streetAddress: '72 Market Road, opposite Voke Star Filling Station, beside Zenith Bank', addressLocality: 'Ughelli', addressRegion: 'Delta State', addressCountry: 'NG' } },
      organizer: { '@id': `${SITE_URL}/#church` }, performer: { '@id': `${SITE_URL}/#pastor` },
    })),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <h1 className="text-5xl font-extrabold md:text-6xl">Services and events</h1>
      <p className="mt-4 max-w-xl">Join Pastor Everest and the church family at {site.church}, Ughelli.</p>

      {upcoming.length > 0 && (
        <section className="mt-14" aria-labelledby="up">
          <h2 id="up" className="mb-8 text-3xl font-extrabold">Coming up</h2>
          <div className="space-y-16">{upcoming.map((e) => <Reveal key={e.slug}><EventCard e={e} featured /></Reveal>)}</div>
        </section>
      )}

      <section className="mt-24" aria-labelledby="past">
        <h2 id="past" className="text-3xl font-extrabold">Previous services</h2>
        <p className="mb-2 mt-2 text-deep/70">Swipe through recent services, then read the details below.</p>
        <div className="-mx-5 mb-16"><CardStack items={stack} /></div>
        <div className="grid gap-16">{past.map((e) => <Reveal key={e.slug}><EventCard e={e} /></Reveal>)}</div>
      </section>
    </div>
  );
}
