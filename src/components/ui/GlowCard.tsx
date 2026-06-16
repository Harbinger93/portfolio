import { useRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export default function GlowCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex h-full rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--glass-border)] overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(
            450px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
            rgba(125, 211, 252, 0.15),
            transparent 80%
          )`,
        }}
      />
      <div className="relative z-10 p-4 md:p-6 h-full w-full">
        {children}
      </div>
    </div>
  );
}
