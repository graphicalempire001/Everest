import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo('/404', { noindex: true });
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="text-5xl font-extrabold">Page not found</h1>
      <p className="mt-4">That page does not exist. Go back to the <Link className="font-bold text-royal underline" to="/">home page</Link>.</p>
    </div>
  );
}
