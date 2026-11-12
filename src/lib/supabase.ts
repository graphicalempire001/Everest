import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when Supabase is not configured yet; the site still works with its built-in catalog. */
export const supabase = url && key ? createClient(url, key) : null;
export const BUCKET = 'gallery';
export const publicUrl = (path: string) => supabase!.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
