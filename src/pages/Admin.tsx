import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useSeo } from '../lib/seo';
import { supabase, BUCKET, publicUrl } from '../lib/supabase';
import { toWebp, videoPoster, fmtSize } from '../lib/media';
import PressButton from '../components/PressButton';

interface Row { id: string; title: string; caption: string | null; alt: string; category: string; media_type: string; image_path: string; video_path: string | null; published: boolean }
const input = 'w-full rounded-lg border border-deep/25 bg-white px-3 py-2 text-base';
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'item';

export default function Admin() {
  useSeo('/admin', { noindex: true, title: 'Admin | Pastor Everest Chinakwaeze' });
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [f, setF] = useState({ title: '', caption: '', alt: '', category: 'Gallery' });
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase!.from('gallery_items').select('*').order('created_at', { ascending: false });
    setRows((data as Row[]) ?? []);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!supabase || !session) { setIsAdmin(null); return; }
    supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data }) => { setIsAdmin(!!data); if (data) load(); });
  }, [session, load]);

  if (!supabase) return <Box><h1 className="text-4xl font-extrabold">Admin</h1><p className="mt-4">Supabase is not connected yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see README), then redeploy.</p></Box>;

  const signIn = async () => {
    setBusy(true); setMsg('');
    const { error } = await supabase!.auth.signInWithPassword(login);
    if (error) setMsg(error.message);
    setBusy(false);
  };

  const upload = async () => {
    if (!file || !f.title.trim() || !f.alt.trim()) return setMsg('Choose a file and fill in the title and the picture description.');
    const isVideo = file.type.startsWith('video/');
    if (isVideo && file.size > 50 * 1024 * 1024) return setMsg('Videos must be under 50 MB. Compress it first, then upload again.');
    setBusy(true); setMsg(isVideo ? 'Reading video and creating a WebP cover…' : 'Converting to WebP…');
    try {
      const stamp = Date.now(), name = `${stamp}-${slug(f.title)}`;
      const img = isVideo ? await videoPoster(file) : await toWebp(file);
      let videoPath: string | null = null;
      if (isVideo) {
        videoPath = `videos/${name}.${(file.name.split('.').pop() || 'mp4').toLowerCase()}`;
        setMsg('Uploading video…');
        const v = await supabase!.storage.from(BUCKET).upload(videoPath, file, { contentType: file.type, cacheControl: '31536000' });
        if (v.error) throw v.error;
      }
      const imagePath = `images/${name}.webp`;
      setMsg('Uploading WebP image…');
      const up = await supabase!.storage.from(BUCKET).upload(imagePath, img.blob, { contentType: 'image/webp', cacheControl: '31536000' });
      if (up.error) throw up.error;
      const ins = await supabase!.from('gallery_items').insert({
        title: f.title.trim(), caption: f.caption.trim() || null, alt: f.alt.trim(), category: f.category.trim() || 'Gallery',
        media_type: isVideo ? 'video' : 'image', image_path: imagePath, video_path: videoPath, width: img.w, height: img.h, sort_order: Math.floor(stamp / 1000),
      });
      if (ins.error) throw ins.error;
      setMsg(`Saved. ${isVideo ? 'WebP cover' : fmtSize(file.size) + ' became'} ${fmtSize(img.blob.size)}. You can upload the next one.`);
      setF({ title: '', caption: '', alt: '', category: f.category }); setFile(null); load();
    } catch (e: any) { setMsg(e.message || 'Upload failed.'); }
    setBusy(false);
  };

  const save = async (r: Row) => {
    const { error } = await supabase!.from('gallery_items').update({ title: r.title, caption: r.caption, alt: r.alt, category: r.category, published: r.published }).eq('id', r.id);
    setMsg(error ? error.message : 'Changes saved.');
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete “${r.title}” for good?`)) return;
    await supabase!.storage.from(BUCKET).remove([r.image_path, ...(r.video_path ? [r.video_path] : [])]);
    const { error } = await supabase!.from('gallery_items').delete().eq('id', r.id);
    setMsg(error ? error.message : 'Deleted.'); load();
  };
  const edit = (id: string, patch: Partial<Row>) => setRows((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  if (!session) return (
    <Box>
      <h1 className="text-4xl font-extrabold">Admin sign in</h1>
      <div className="mt-6 space-y-4">
        <input className={input} type="email" placeholder="Email" autoComplete="username" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
        <input className={input} type="password" placeholder="Password" autoComplete="current-password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && signIn()} />
        <PressButton onClick={signIn} variant="royal">{busy ? 'Signing in…' : 'Sign in'}</PressButton>
        {msg && <p role="alert" className="font-semibold text-red-700">{msg}</p>}
      </div>
    </Box>
  );
  if (isAdmin === false) return <Box><h1 className="text-3xl font-extrabold">Not an admin</h1><p className="mt-3">This account is not on the admin list. Run the last line of <code>supabase/migration.sql</code> with this email.</p><div className="mt-5"><PressButton onClick={() => supabase!.auth.signOut()} variant="paper">Sign out</PressButton></div></Box>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between gap-4"><h1 className="text-4xl font-extrabold">Gallery admin</h1><PressButton onClick={() => supabase!.auth.signOut()} variant="paper" size="sm">Sign out</PressButton></div>

      <section className="mt-8 rounded-2xl bg-stone p-5 md:p-7" aria-labelledby="add">
        <h2 id="add" className="text-2xl font-extrabold">Add a picture or video</h2>
        <p className="mt-1 text-sm text-deep/75">Pictures are resized and converted to WebP automatically. Videos get a WebP cover image (the video itself stays MP4 or WebM, up to 50 MB).</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2"><span className="font-semibold">File</span><input className={input} type="file" accept="image/*,video/mp4,video/webm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
          <label><span className="font-semibold">Title</span><input className={input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Thanksgiving Service" /></label>
          <label><span className="font-semibold">Category</span><input className={input} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></label>
          <label className="md:col-span-2"><span className="font-semibold">Explanation (shown under the picture)</span><textarea className={input} rows={2} value={f.caption} onChange={(e) => setF({ ...f, caption: e.target.value })} /></label>
          <label className="md:col-span-2"><span className="font-semibold">Describe the picture (for Google and screen readers)</span><input className={input} value={f.alt} onChange={(e) => setF({ ...f, alt: e.target.value })} placeholder="Pastor Everest Chinakwaeze praying with the congregation at Ebenezer's Place" /></label>
        </div>
        <div className="mt-6"><PressButton onClick={upload}>{busy ? 'Working…' : 'Convert and upload'}</PressButton></div>
        {msg && <p role="status" className="mt-4 font-semibold">{msg}</p>}
      </section>

      <section className="mt-12" aria-labelledby="all">
        <h2 id="all" className="text-2xl font-extrabold">Uploaded ({rows.length})</h2>
        <div className="mt-6 space-y-6">
          {rows.map((r) => (
            <div key={r.id} className="grid gap-4 rounded-2xl bg-white p-4 shadow-[0_22px_26px_-20px_rgba(10,20,80,.6)] sm:grid-cols-[9rem_1fr]">
              <img src={publicUrl(r.image_path)} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <div className="space-y-2">
                <input className={input} value={r.title} onChange={(e) => edit(r.id, { title: e.target.value })} aria-label="Title" />
                <textarea className={input} rows={2} value={r.caption ?? ''} onChange={(e) => edit(r.id, { caption: e.target.value })} aria-label="Explanation" />
                <input className={input} value={r.alt} onChange={(e) => edit(r.id, { alt: e.target.value })} aria-label="Picture description" />
                <div className="flex flex-wrap items-center gap-4">
                  <input className={`${input} max-w-[12rem]`} value={r.category} onChange={(e) => edit(r.id, { category: e.target.value })} aria-label="Category" />
                  <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={r.published} onChange={(e) => edit(r.id, { published: e.target.checked })} />Published</label>
                  <span className="text-sm text-deep/60">{r.media_type}</span>
                  <PressButton size="sm" onClick={() => save(r)}>Save</PressButton>
                  <PressButton size="sm" variant="paper" onClick={() => remove(r)}>Delete</PressButton>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p>Nothing uploaded yet.</p>}
        </div>
      </section>
    </div>
  );
}

const Box = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-md px-5 py-16">{children}</div>;
