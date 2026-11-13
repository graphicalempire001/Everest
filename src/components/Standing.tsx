/** The standing cutout of Pastor Everest rising out of a navy panel (no photo background). */
export default function Standing({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-full max-w-sm pt-14 ${className}`}>
      <div className="absolute inset-x-0 bottom-0 top-24 overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-royal to-deep shadow-[0_34px_44px_-24px_rgba(10,20,80,.8)]" aria-hidden="true">
        <div className="pattern absolute inset-0 opacity-50" />
      </div>
      <img src="/images/pastor-everest-standing.webp" width={524} height={905} loading="lazy"
        alt="Pastor Everest Chinakwaeze standing and smiling with a microphone"
        className="relative z-10 mx-auto h-auto w-[88%] drop-shadow-[0_26px_30px_rgba(0,0,0,.55)]" />
    </div>
  );
}
