interface NeonButtonProps {
  children: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function NeonButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
}: NeonButtonProps) {
  const base =
    'relative inline-flex items-center gap-2 px-6 py-3 text-sm rounded-lg transition-all duration-500 overflow-hidden group';

  const variants = {
    primary:
      'border border-ice-300/20 text-ice-300 hover:bg-ice-300/10 hover:border-ice-300/40',
    secondary:
      'border border-glass-border text-slate-300 hover:border-slate-400/30 hover:text-slate-150',
  };

  const content = (
    <>
      <span className="absolute inset-0 w-0 bg-gradient-to-r from-ice-300/5 to-transparent transition-all duration-500 group-hover:w-full" />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${base} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {content}
    </button>
  );
}
