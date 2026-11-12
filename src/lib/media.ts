/** Converts any image to a resized WebP in the browser before upload. */
export async function toWebp(source: File | Blob, maxW = 1600, quality = 0.82) {
  const bmp = await createImageBitmap(source);
  const s = Math.min(1, maxW / bmp.width), w = Math.round(bmp.width * s), h = Math.round(bmp.height * s);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/webp', quality));
  if (!blob || blob.type !== 'image/webp') throw new Error('This browser cannot create WebP. Please use Chrome, Edge or Firefox.');
  return { blob, w, h };
}

/** Grabs a frame from a video and returns it as a WebP poster. */
export async function videoPoster(file: File) {
  const v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = URL.createObjectURL(file);
  await new Promise<void>((ok, bad) => { v.onloadeddata = () => ok(); v.onerror = () => bad(new Error('Could not read this video.')); });
  v.currentTime = Math.min(1, (v.duration || 2) / 4);
  await new Promise<void>((ok) => { v.onseeked = () => ok(); });
  const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext('2d')!.drawImage(v, 0, 0);
  URL.revokeObjectURL(v.src);
  return toWebp(await new Promise<Blob>((r) => c.toBlob((b) => r(b!), 'image/jpeg', 0.92)));
}

export const fmtSize = (n: number) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB');
