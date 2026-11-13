import { useRef, type ReactNode } from 'react';
import { useStickyTop } from '../lib/useStickyTop';

/** A curved sheet that pins, then lets the next sheet climb over it, with a soft shadow along its top edge. */
export default function StackCard({ children, bg = 'bg-paper', z = 10, className = '', id, first = false }: { children: ReactNode; bg?: string; z?: number; className?: string; id?: string; first?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useStickyTop(ref);
  return <section ref={ref} id={id} style={{ zIndex: z }} className={`stack-card sticky pb-24 pt-16 md:pt-20 ${first ? '-mt-4' : '-mt-8'} ${bg} ${className}`}>{children}</section>;
}
