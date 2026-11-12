import type { EventItem } from '../data/events';

export default function EventCard({ e, featured = false }: { e: EventItem; featured?: boolean }) {
  return (
    <article className={`grid items-center gap-8 ${featured ? 'md:grid-cols-5' : 'md:grid-cols-2'}`}>
      <img src={e.flyer} alt={e.flyerAlt} loading={featured ? 'eager' : 'lazy'} className={`card w-full ${featured ? 'md:col-span-3' : ''}`} />
      <div className={featured ? 'md:col-span-2' : ''}>
        <h3 className="text-3xl font-extrabold md:text-4xl">{e.title}</h3>
        {e.theme && <p className="mt-2 font-display text-xl italic">Theme: {e.theme}</p>}
        <dl className="mt-4 space-y-1">
          {e.dateLabel && <div><dt className="sr-only">Date</dt><dd>{e.dateLabel}</dd></div>}
          {e.time && <div><dt className="sr-only">Time</dt><dd>{e.time}</dd></div>}
          {e.speaker && <div><dt className="sr-only">Speaker</dt><dd>{e.speaker}</dd></div>}
        </dl>
      </div>
    </article>
  );
}
