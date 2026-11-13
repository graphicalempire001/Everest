import { Link } from 'react-router-dom';

const all = [
  { to: '/about', label: 'Who is Pastor Everest Chinakwaeze?', note: 'The Lead Pastor of Ebenezer’s Place' },
  { to: '/events', label: 'Encounter Service in Ughelli', note: 'Services, events and previous programs' },
  { to: '/catalog', label: 'Photos of Pastor Everest', note: 'Pictures and flyers from the church' },
  { to: '/contact', label: 'Visit Ebenezer’s Place, Ughelli', note: 'Address, directions and times' },
];

/** Links every inner page to the other directories with descriptive anchor text. */
export default function Related({ current }: { current: string }) {
  const items = all.filter((i) => i.to !== current);
  return (
    <nav aria-label="Related pages" className="mx-auto mt-24 max-w-6xl px-5">
      <h2 className="text-2xl font-extrabold md:text-3xl">Also explore</h2>
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="block rounded-2xl bg-white p-6 shadow-[0_22px_28px_-20px_rgba(10,20,80,.55)] transition hover:-translate-y-1">
              <span className="block font-display text-xl font-bold text-royal">{i.label}</span>
              <span className="mt-1 block text-deep/70">{i.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
