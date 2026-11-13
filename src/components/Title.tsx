export default function Title({ eyebrow, children, id, light = false }: { eyebrow: string; children: string; id?: string; light?: boolean }) {
  return (
    <div className="mb-12 text-center">
      <p className={`text-sm font-bold uppercase tracking-[.2em] ${light ? 'text-gold' : 'text-royal'}`}>{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-extrabold md:text-5xl">{children}</h2>
    </div>
  );
}
