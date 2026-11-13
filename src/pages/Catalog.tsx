import { useSeo, SITE_URL } from '../lib/seo';
import { useGallery } from '../lib/gallery';
import Gallery from '../components/Gallery';


export default function Catalog() {
  const catalog = useGallery();

  useSeo('/catalog', {
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'ImageGallery',
      name: 'Photo catalog of Pastor Everest Chinakwaeze', url: `${SITE_URL}/catalog`,
      about: { '@id': `${SITE_URL}/#pastor` }, publisher: { '@id': `${SITE_URL}/#church` },
      image: catalog.map((i) => ({ '@type': 'ImageObject', contentUrl: i.src.startsWith('http') ? i.src : SITE_URL + i.src, name: i.title, description: i.caption, caption: i.alt, width: i.w, height: i.h, representativeOfPage: i.id === 'm-smiling-at-the-pulpit', creditText: 'Pastor Everest Chinakwaeze', copyrightNotice: '© Pastor Everest Chinakwaeze', creator: { '@id': `${SITE_URL}/#pastor` } })),
      video: catalog.filter((i) => i.video).map((i) => ({ '@type': 'VideoObject', name: i.title, description: i.caption || i.title, thumbnailUrl: i.src, contentUrl: i.video, uploadDate: new Date().toISOString().slice(0, 10) })),
    }],
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <h1 className="text-5xl font-extrabold md:text-6xl">Photo catalog</h1>
      <p className="mt-4 max-w-xl">Photos and flyers of Pastor Everest Chinakwaeze and Ebenezer’s Place International Ministry, Ughelli. Tap any picture to open it full size with its description, then swipe to see the next one.</p>

      <div className="mt-12"><Gallery items={catalog} /></div>
    </div>
  );
}
