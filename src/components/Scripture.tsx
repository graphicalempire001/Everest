import { useEffect, useState } from 'react';

const verses = [
  { t: 'Then Samuel took a stone, and set it between Mizpeh and Shen, and called the name of it Ebenezer, saying, Hitherto hath the LORD helped us.', r: '1 Samuel 7:12' },
  { t: 'But now the LORD my God hath given me rest on every side, so that there is neither adversary nor evil occurrent.', r: '1 Kings 5:4' },
  { t: 'God is our refuge and strength, a very present help in trouble.', r: 'Psalm 46:1' },
];

export default function Scripture() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((n) => (n + 1) % verses.length), 8000); return () => clearInterval(id); }, [i]);
  const v = verses[i];
  return (
    <div className="text-center text-paper" aria-label="Scripture">
      <div className="mx-auto max-w-3xl px-5">
        <blockquote key={i} className="rise min-h-[11rem] md:min-h-[9rem]">
          <p className="font-display text-2xl italic leading-snug md:text-4xl">“{v.t}”</p>
          <footer className="mt-4 text-base text-gold">{v.r} (KJV)</footer>
        </blockquote>
        <div className="mt-6 flex justify-center">
          {verses.map((_, n) => (
            <button key={n} type="button" onClick={() => setI(n)} aria-label={`Show verse ${n + 1}`} aria-current={n === i} className="p-3">
              <span className={`block h-2.5 w-2.5 rounded-full transition ${n === i ? 'scale-125 bg-gold' : 'bg-paper/40'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
