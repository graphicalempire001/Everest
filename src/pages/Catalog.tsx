import { useRef, useState } from 'react';
import { useSeo, SITE_URL } from '../lib/seo';
import { useGallery, type GItem } from '../lib/gallery';
import PressButton from '../components/PressButton';
import Reveal from '../components/Reveal';

type Item = GItem;

export default function Catalog() {
  const catalog = useGallery();
  const dlg = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState<Item | null>(null);

  useSeo('/catalog', {
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'ImageGallery',
      name: 'Photo catalog of Pastor Everest Chinakwaeze', url: `${SITE_URL}/catalog`,
      about: { '@id': `${SITE_URL}/#pastor` }, publisher: { '@id': `${SITE_URL}/#church` },
      image: catalog.map((i) => ({ '@type': 'ImageObject', contentUrl: i.src.startsWith('http') ? i.src : SITE_URL + i.src, name: i.title, description: i.caption, caption: i.alt, width: i.w, height: i.h, representativeOfPage: i.id === 'pastor-everest' })),
      video: catalog.filter((i) => i.video).map((i) => ({ '@type': 'VideoObject', name: i.title, description: i.caption || i.title, thumbnailUrl: i.src, contentUrl: i.video, uploadDate: new Date().toISOString().slice(0, 10) })),
    }],
  });

  const open = (i: Item) => { setCur(i); dlg.current?.showModal(); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <h1 className="text-5xl font-extrabold md:text-6xl">Photo catalog</h1>
      <p className="mt-4 max-w-xl">Photos and flyers of Pastor Everest Chinakwaeze and Ebenezer’s Place International Ministry, Ughelli. Tap any picture to enlarge it.</p>

      <div className="mt-12 gap-8 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {catalog.map((i, n) => (
          <Reveal key={i.id} delay={(n % 3) * 100} className="mb-8 break-inside-avoid">
            <figure>
              <button type="button" onClick={() => open(i)} className="card relative block w-full text-left transition-transform duration-300 hover:-translate-y-1" aria-label={`Enlarge: ${i.title}`}>
                <img src={i.src} alt={i.alt} width={i.w} height={i.h} loading="lazy" className="w-full" />
                {i.video && <span className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true"><span className="rounded-full bg-deep/75 px-5 py-3 text-2xl text-paper">▶</span></span>}
              </button>
              <figcaption className="mt-4"><strong className="font-display text-lg">{i.title}</strong><br /><span className="text-deep/75">{i.caption}</span></figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <dialog ref={dlg} onClick={(e) => e.target === dlg.current && dlg.current?.close()} className="m-auto max-h-[92vh] max-w-[min(94vw,64rem)] overflow-auto bg-transparent p-0 backdrop:bg-deep/90">
        {cur && (
          <figure className="text-center text-paper">
            {cur.video ? <video src={cur.video} poster={cur.src} controls playsInline className="mx-auto max-h-[70vh] max-w-full rounded-xl" /> : <img src={cur.src} alt={cur.alt} className="mx-auto max-h-[70vh] w-auto max-w-full rounded-xl" />}
            <figcaption className="mx-auto mt-4 max-w-xl"><strong className="font-display text-xl">{cur.title}</strong><br />{cur.caption}</figcaption>
          </figure>
        )}
        <div className="my-6 text-center"><PressButton onClick={() => dlg.current?.close()}>Close</PressButton></div>
      </dialog>
    </div>
  );
}
