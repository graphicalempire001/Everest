import { useEffect, useState } from 'react';
import staticItems from '../data/catalog.json';
import { supabase, publicUrl } from './supabase';

export interface GItem { id: string; src: string; w: number; h: number; title: string; caption: string; alt: string; category: string; video?: string }

export const fromRow = (r: any): GItem => ({
  id: r.id, src: publicUrl(r.image_path), w: r.width || 1200, h: r.height || 800, title: r.title, caption: r.caption || '',
  alt: r.alt, category: r.category, video: r.video_path ? publicUrl(r.video_path) : undefined,
});

/** Admin uploads (newest first) followed by the built-in catalog. */
export function useGallery(): GItem[] {
  const [remote, setRemote] = useState<GItem[]>([]);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('gallery_items').select('*').eq('published', true)
      .order('sort_order', { ascending: false }).order('created_at', { ascending: false })
      .then(({ data }) => data && setRemote(data.map(fromRow)));
  }, []);
  return [...remote, ...(staticItems as GItem[])];
}
