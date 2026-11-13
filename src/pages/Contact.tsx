import { useSeo } from '../lib/seo';
import site from '../data/site.json';
import PressButton, { FbIcon } from '../components/PressButton';

export default function Contact() {
  useSeo('/contact');
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="text-5xl font-extrabold md:text-6xl">Visit Ebenezer’s Place</h1>
      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-2xl font-extrabold">Where we meet</h2>
          <address className="mt-2 not-italic">{site.church}<br />{site.address}.</address>
          <div className="mt-5"><PressButton href={site.mapsUrl} size="lg">Get directions</PressButton></div>
          <iframe title="Map to Ebenezer's Place International Ministry, Ughelli" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent("Ebenezer's Place Int'l, 72 Market Rd, Ughelli 333105, Delta")}&output=embed`}
            className="card mt-6 h-72 w-full border-0" />
        </section>
        <section>
          <h2 className="text-2xl font-extrabold">When we gather</h2>
          <p className="mt-2">Encounter Service holds on Thursdays at 6:00 PM. Special programs are listed on the <PressButton to="/events" variant="paper" className="!px-3 !py-1 !text-base align-middle">services page</PressButton></p>
        </section>
        <section>
          <h2 className="text-2xl font-extrabold">Stay connected</h2>
          <p className="mt-2">Follow Pastor Everest on Facebook for live services and updates.</p>
          <div className="mt-5"><PressButton href={site.facebookUrl} variant="facebook" size="lg"><FbIcon />Follow on Facebook</PressButton></div>
          {site.phone && <p className="mt-4">Call: <a className="font-bold text-royal underline" href={`tel:${site.phone}`}>{site.phone}</a></p>}
        </section>
      </div>
    </div>
  );
}
