import { useState, type MouseEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  to?: string; href?: string; onClick?: () => void; children: ReactNode; className?: string; label?: string;
  variant?: 'gold' | 'royal' | 'paper' | 'ghost' | 'facebook'; size?: 'sm' | 'md' | 'lg';
};

/** Presses down and pops back; only navigates once that animation has finished. */
export default function PressButton({ to, href, onClick, children, className = '', label, variant = 'gold', size = 'md' }: Props) {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  const go = () => {
    if (to) navigate(to);
    else if (href && /^https?:/.test(href)) {
      const w = window.open(href, '_blank');
      if (w) w.opener = null; else window.location.assign(href);
    } else if (href) window.location.assign(href);
    else onClick?.();
  };
  const start = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let the browser handle new-tab clicks
    e.preventDefault();
    if (pressed) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return go();
    setPressed(true);
  };
  const end = (e: React.AnimationEvent) => { if (e.target === e.currentTarget) { setPressed(false); go(); } };
  const cls = `btn btn-${variant} btn-${size} ${pressed ? 'is-pressed' : ''} ${className}`;

  return to || href
    ? <a href={to ?? href} className={cls} onClick={start} onAnimationEnd={end} aria-label={label}>{children}</a>
    : <button type="button" className={cls} onClick={start} onAnimationEnd={end} aria-label={label}>{children}</button>;
}

export const FbIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.5-3.4h-3.3V8.3c0-1 .3-1.7 1.7-1.7h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.6H7.4v3.4h2.8V22z" /></svg>
);
