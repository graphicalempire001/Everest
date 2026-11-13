import type { ReactNode } from 'react';

/** A curved sheet that slides up over the section before it, with a soft shadow along its top edge. */
export default function StackCard({ children, bg = 'bg-paper', z = 10, className = '', id }: { children: ReactNode; bg?: string; z?: number; className?: string; id?: string }) {
  return <section id={id} style={{ zIndex: z }} className={`stack-card relative -mt-10 pb-24 pt-20 md:-mt-14 md:pt-28 ${bg} ${className}`}>{children}</section>;
}
